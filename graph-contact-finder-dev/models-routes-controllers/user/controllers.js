// @ts-check
const driver = require('../../database/neo4j_driver')
const crypto = require('crypto')
const UserModel = require('./model')
const config = require('../../config')
const {
  jwtSign, checkDuplicate,
  catchError, getIp, getPaginationValues,
  userLog, responseMessage, savePushNotification, arrayToObject
} = require('../../helpers/utilityServices')
const mongoose = require('mongoose')
const { message } = require('../../responses')
const { redisClient } = require('../../helpers/redis')
const { contactSyncNodeExists, contactSyncNodeNew } = require('../../queue')
const OTPModel = require('../otp/model')
const { logOperationName } = require('../../enums')

class UserController {
  // User routes
  // Register user
  async register (req, res) {
    const session = driver.session()
    const mongoSession = await UserModel.startSession()
    mongoSession.startTransaction({ readPreference: 'primary', readConcern: { level: 'majority' }, writeConcern: { w: 'majority' } })
    try {
      const { sName, sMobileNumber, sPassword, iOTPId } = req.body
      const isOTPVerified = await OTPModel.findOne({ _id: iOTPId, bIsVerify: true, sAuth: 'R', sType: 'M', bIsOperationCompleted: false }).lean()
      if (!isOTPVerified || sMobileNumber !== isOTPVerified?.sLogin) return responseMessage(req, res, 'BadRequest', 'SomethingWentWrong', 'OTPVerification')
      const sHashedPassword = crypto.createHash('sha512').update(sPassword).digest('hex')
      const userInfo = await UserModel.findOne({ sMobileNumber }).lean()
      if (userInfo?.bIsUser) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'User')
      else if (!userInfo) {
        const userDetails = await UserModel.create([{
          sName,
          sMobileNumber,
          sPassword: sHashedPassword
        }], { session: mongoSession })
        const graphInsertQueryParam = {
          id: userDetails[0]._id.toString()
        }
        await session.run('merge(:User{id:$id})', graphInsertQueryParam)
        const logData = {
          eOperationType: 'C',
          sOperationName: logOperationName?.CU,
          oOldFields: {},
          oNewFields: req?.body,
          sIpAddress: getIp(req)
        }
        await Promise.all([
          userLog(req, res, logData),
          OTPModel.updateOne({ _id: iOTPId }, { bIsOperationCompleted: true })
        ])
        await mongoSession.commitTransaction()
        return responseMessage(req, res, 'Success', 'CreatedSuccessfully', 'User')
      } else {
        // set the password, new name, bIsUser = true and eStatus = 'A' if the node has already exists
        await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(userInfo._id),
          {
            sName,
            sPassword: sHashedPassword,
            bIsUser: true,
            eStatus: 'A',
            dDeletedAt: null,
            aJwtTokens: [],
            dLoginAt: null,
            dUpdatedAt: null
          },
          { session: mongoSession })
        const oNewUser = { ...userInfo, ...req.body, sPassword: sHashedPassword, eStatus: 'A', bIsUser: true, dDeletedAt: null, dLoginAt: null }
        const logData = {
          eOperationType: 'C',
          sOperationName: logOperationName?.CU,
          oOldUser: userInfo,
          oNewUser,
          sIpAddress: getIp(req)
        }
        await Promise.all([
          userLog(req, res, logData),
          OTPModel.updateOne({ _id: iOTPId }, { bIsOperationCompleted: true })
        ])
        await mongoSession.commitTransaction()
        return responseMessage(req, res, 'Success', 'CreatedSuccessfully', 'User')
      }
    } catch (error) {
      await mongoSession.abortTransaction()
      return catchError(req, res)
    } finally {
      await session.close()
    }
  }

  // login user
  async login (req, res) {
    try {
      const { sMobileNumber, sPassword } = req.body
      const sHashedPassword = crypto.createHash('sha512').update(sPassword).digest('hex')

      const user = await UserModel.findOne({ sMobileNumber }, { bIsUser: 1, sPassword: 1, aJwtTokens: 1, eStatus: 1 })

      if (!user || user.bIsUser === false) return responseMessage(req, res, 'NotFound', 'UserNotRegistered', '')

      if (user.eStatus === 'D') return responseMessage(req, res, 'NotFound', 'NotFound', 'User')

      if (user.sPassword !== sHashedPassword) return responseMessage(req, res, 'Forbidden', 'IncorrectPassword', '')

      const newToken = jwtSign({ id: user._id }, config.JWT_VALIDITY)

      const sPushToken = req.headers.sPushToken
      if (sPushToken) newToken.sPushToken = sPushToken

      if (user.aJwtTokens.length >= config.LOGIN_HARD_LIMIT) {
        user.aJwtTokens.shift()
        user.aJwtTokens.push(newToken)
      } else {
        user.aJwtTokens.push(newToken)
      }

      await UserModel.findByIdAndUpdate(user._id, { aJwtTokens: user.aJwtTokens, dLoginAt: new Date() })

      // if (sPushToken) await subscribeUser(sPushToken, 'globalNotification')

      return responseMessage(req, res, 'Success', 'LoginSuccessfully', '', { sToken: newToken.sToken })
    } catch (error) {
      return catchError(req, res)
    }
  }

  // contact-sync
  async contactSync (req, res) {
    try {
      const aValidContacts = req?.body?.aList?.filter(({ sMobileNumber }) => sMobileNumber !== req?.currentUserInfo?.sMobileNumber)
      const iCurrentUserId = req?.iCurrentUserId
      const withoutDuplicate = checkDuplicate(aValidContacts.map(e => e.sMobileNumber))

      const aExistingContacts = await UserModel.find({ sMobileNumber: { $in: withoutDuplicate } }, { sMobileNumber: 1 }).lean()
      const aExistedMobileNumbers = aExistingContacts.map(e => e.sMobileNumber)

      const aNonExistingContacts = aValidContacts.filter(x => !aExistedMobileNumbers.includes(x.sMobileNumber))
      const aNonExistingUsers = aNonExistingContacts.map(e => {
        return { ...e, sPassword: 'NA', bIsUser: false, eStatus: 'A', iSyncBy: req?.iCurrentUserId }
      })

      const aUserIds = await UserModel.insertMany(aNonExistingUsers)
      if (aUserIds?.length) await redisClient.rpush('contact-sync:new', iCurrentUserId + JSON.stringify(aUserIds))
      if (aExistingContacts?.length) await redisClient.rpush('contact-sync:exists', iCurrentUserId + JSON.stringify(aExistingContacts))
      const logData = {
        eOperationType: 'S',
        sOperationName: logOperationName?.CU,
        oOldFields: {},
        oNewFields: req.body,
        sIpAddress: getIp(req)
      }
      await userLog(req, res, logData)
      if (!req.aInValidContacts) {
        return responseMessage(req, res, 'Success', 'AllContactsSyncedSuccessFully', '')
      }
      return responseMessage(req, res, 'Success', 'ContactsSyncSuccessfully', '', { inValidContact: req.aInValidContacts })
    } catch (error) {
      if (error._message === 'User validation failed') {
        return responseMessage(req, res, 'BadRequest', 'ValidationFailed', '')
      }
      return catchError(req, res)
    }
  }

  async filterContacts (req, res) {
    const session = driver.session()
    try {
      const { nPage = 1, nLimit = 10, iProfessionIds, iCityIds = [], nLevel = 5, eServiceType } = req.query
      let aGraphUsers = []
      let oGraphUsersResponse

      const pageResponse = {
        aUser: [],
        count: 0
      }
      const graphQueryParams = {
        id: req?.iCurrentUserId,
        iProfessionIds: Array.isArray(iProfessionIds) ? iProfessionIds : [iProfessionIds],
        iCityIds: Array.isArray(iCityIds) ? iCityIds : [iCityIds],
        nStartLimit: nLimit * (nPage - 1),
        nEndLimit: nLimit * (nPage)
      }
      const userProfessionPipeline = {
        eStatus: { $ne: 'D' },
        iProfessionId: { $in: [...graphQueryParams?.iProfessionIds]?.map((id) => new mongoose.Types.ObjectId(id)) }
      }
      if (iProfessionIds?.length && iCityIds?.length) {
        oGraphUsersResponse = await session.run(`match (c:City)
          where c.id in $iCityIds
          match (p:Profession)
          where p.id in $iProfessionIds
          match path=shortestPath((currentUser:User {id:$id})-[:CONNECTED *..${nLevel}]-(targetUser:User))
          where currentUser <> targetUser
          match (targetUser)-[:WORKING_AS]->(p)
          where (targetUser.eServiceType = "G" or ((targetUser)-[:WORKING_IN]->(c)))                    
          return return count(targetUser) as total,collect(targetUser{.id, hops:toFloat(length(path))})[${graphQueryParams?.nStartLimit}..${graphQueryParams?.nEndLimit}] as users`, graphQueryParams)
      } else if (iProfessionIds?.length) {
        oGraphUsersResponse = await session.run(`match (p:Profession)
          where p.id in $iProfessionIds
          match path=shortestPath((currentUser:User {id:$id})-[:CONNECTED *..${nLevel}]-(targetUser:User))
          where currentUser <> targetUser
          match ((targetUser)-[:WORKING_AS]->(p))
          return count(targetUser) as total,collect(targetUser{.id, hops:toFloat(length(path))})[${graphQueryParams?.nStartLimit}..${graphQueryParams?.nEndLimit}] as users`, graphQueryParams)
      }
      oGraphUsersResponse?.records.forEach((record) => {
        if (record.get('users')) aGraphUsers = record.get('users')
        if (record.get('total') && !pageResponse.count)pageResponse.count = record.get('total')?.low
      })

      if (eServiceType && eServiceType === 'G')userProfessionPipeline.eServiceType = 'G'
      else if (iCityIds?.length) {
        userProfessionPipeline.aCityIds = {
          $in: iCityIds?.map((id) => new mongoose.Types.ObjectId(id))
        }
      }
      const graphUserMap = arrayToObject(aGraphUsers, 'id')
      const queryStage = [
        {
          $match: {
            _id: {
              $in: Object.keys(graphUserMap)?.map((id) => new mongoose.Types.ObjectId(id))
            }
          }
        },
        {
          $lookup: {
            from: 'userprofessions',
            localField: '_id',
            foreignField: 'iUserId',
            as: 'oUserProfession',
            pipeline: [
              {
                $match: {
                  ...userProfessionPipeline
                }
              }
            ]
          }
        },
        {
          $unwind: {
            path: '$oUserProfession',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            sName: 1,
            sMobileNumber: 1,
            bIsUser: 1,
            nAvgRating: 1,
            nTotalReview: 1,
            'oUserProfession.sTitle': 1,
            'oUserProfession.sMobile': 1,
            'oUserProfession.sEmail': 1,
            'oUserProfession.sWebsiteURL': 1,
            'oUserProfession.eServiceType': 1,
            'oUserProfession.sDescription': 1,
            'oUserProfession._id': 1
          }
        }
      ]
      const aUserList = await UserModel.aggregate(queryStage)
      if (aUserList) {
        aUserList?.forEach((userInfo) => {
          pageResponse?.aUser.push({
            ...userInfo,
            nHops: graphUserMap?.[userInfo?._id?.toString()]?.hops
          })
        })
      }
      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Contacts', pageResponse)
    } catch (error) {
      return catchError(req, res)
    } finally {
      await session.close()
    }
  }

  // change-password
  async changePassword (req, res) {
    try {
      const iUserId = req.iCurrentUserId
      const { sNewPassword, sOldPassword } = req.body
      const sHashedOldPassword = crypto.createHash('sha512').update(sOldPassword).digest('hex')
      const sNewHashedPassword = crypto.createHash('sha512').update(sNewPassword).digest('hex')
      const result = await UserModel.findOneAndUpdate({ $and: [{ _id: iUserId }, { sPassword: sHashedOldPassword }] }, { sPassword: sNewHashedPassword, dPasswordChangeAt: new Date() })
      if (!result) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Password')
      const logData = {
        eOperationType: 'E',
        sOperationName: logOperationName?.CP,
        oOldFields: {
          ...result,
          sPassword: sHashedOldPassword
        },
        oNewFields: result,
        sIpAddress: getIp(req)
      }
      await userLog(req, res, logData)
      return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'Password')
    } catch (error) {
      return catchError(req, res)
    }
  }

  // reset-password
  async resetPassword (req, res) {
    try {
      const { iOTPId, sMobileNumber, sNewPassword } = req.body
      const isOTPVerified = await OTPModel.findOne({ _id: iOTPId, bIsVerify: true, bIsOperationCompleted: false })
      if (!isOTPVerified) return responseMessage(req, res, 'BadRequest', 'SomethingWentWrong', 'OTPVerification')
      const sNewHashedPassword = crypto.createHash('sha512').update(sNewPassword).digest('hex')
      const result = await UserModel.findOneAndUpdate({ sMobileNumber }, { sPassword: sNewHashedPassword })
      if (!result) return responseMessage(req, res, 'BadRequest', 'UserNotRegistered')
      const logData = {
        eOperationType: 'E',
        sOperationName: logOperationName?.FP,
        oNewFields: req.body,
        sIpAddress: getIp(req)
      }
      await userLog(req, res, logData)
      await OTPModel.updateOne({ _id: iOTPId }, { bIsOperationCompleted: true })
      return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'Password')
    } catch (error) {
      return catchError(req, res)
    }
  }

  // logging out
  async logout (req, res) {
    try {
      const sToken = req.sToken
      const iCurrentUserId = req.iCurrentUserId
      await UserModel.findByIdAndUpdate(iCurrentUserId, { $pull: { aJwtTokens: { sToken } } })
      return responseMessage(req, res, 'Success', 'LoggedOutSuccessfully')
    } catch (error) {
      return catchError(req, res)
    }
  }

  async userUpdate (req, res) {
    try {
      const iUserId = req?.iCurrentUserId || req.params.id
      const isUserExists = await UserModel.findOne({
        _id: { $ne: iUserId },
        sMobileNumber: req.body?.sMobileNumber
      }, { sPassword: 0 }).lean()
      if (isUserExists) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'MobileNumber')
      const oNewFields = await UserModel.findByIdAndUpdate(iUserId, req.body, { runValidators: true }).lean()
      const logData = {
        eOperationType: 'E',
        sOperationName: logOperationName?.UU,
        oNewFields,
        oOldFields: req?.body,
        sIpAddress: getIp(req)
      }
      await userLog(req, res, logData)
      return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'User')
    } catch (error) {
      return catchError(req, res)
    }
  }

  async getContactUserProfile (req, res) {
    const session = driver.session()
    try {
      const projectStage = {
        sName: 1,
        sMobileNumber: 1,
        dCreatedAt: 1,
        nAvgRating: 1,
        nTotalReview: 1,
        'aProfession._id': 1,
        'aProfession._sTitle': 1,
        'aProfession.sWebsiteURL': 1,
        'aProfession.sSecondaryMobile': 1,
        'aProfession.sMobile': 1,
        'aProfession.sEmail': 1,
        'aProfession.eServiceType': 1,
        'aProfession.sDescription': 1
      }
      const { iContactUserId } = req?.query
      const graphQueryParams = {
        id: req?.iCurrentUserId,
        iContactUserId
      }
      let hops = 0

      const matchStage = {
        _id: new mongoose.Types.ObjectId(iContactUserId)
      }

      const queryStage = [
        {
          $match: matchStage
        },
        {
          $lookup: {
            from: 'userprofessions',
            localField: '_id',
            foreignField: 'iUserId',
            as: 'aProfession',
            pipeline: [
              {
                $match: {
                  eStatus: { $ne: 'D' }
                }
              }
            ]
          }
        },
        {
          $project: projectStage
        }
      ]
      const [[oUserInfo], hopsInfo] = await Promise.all([
        UserModel.aggregate(queryStage),
        session.run('match path = shortestPath((u:User {id:$id})-[:CONNECTED *]-(v:User {id:$iContactUserId})) where u <> v return toFloat(length(path)) as hops ', graphQueryParams)
      ])
      hopsInfo?.records?.forEach((record) => {
        hops = record.get('hops')
      })
      if (!oUserInfo) return responseMessage(req, res, 'NotFound', 'NotFound', 'User')
      oUserInfo.hops = hops
      return res.status(200).json({
        status: 200,
        message: 'Profile fetched successfully',
        data: oUserInfo
      })
    } catch (error) {
      return catchError(req, res)
    } finally {
      await session.close()
    }
  }

  async getPersonalProfile (req, res) {
    try {
      const iUserId = req?.iCurrentUserId
      const cacheKey = `user:${iUserId}:profile`
      const matchStage = {
        _id: new mongoose.Types.ObjectId(iUserId)
      }
      const projectStage = {
        sName: 1,
        sMobileNumber: 1,
        dCreatedAt: 1,
        nAvgRating: 1,
        nTotalReview: 1,
        'aProfession._id': 1,
        'aProfession._sTitle': 1,
        'aProfession.sWebsiteURL': 1,
        'aProfession.sSecondaryMobile': 1,
        'aProfession.sMobile': 1,
        'aProfession.sEmail': 1,
        'aProfession.eServiceType': 1,
        'aProfession.sDescription': 1

      }
      const queryStage = [
        {
          $match: matchStage
        },
        {
          $lookup: {
            from: 'userprofessions',
            localField: '_id',
            foreignField: 'iUserId',
            as: 'aProfession',
            pipeline: [
              {
                $match: {
                  eStatus: { $ne: 'D' }
                }
              }
            ]
          }
        },
        { $project: projectStage }
      ]
      const [oUserProfile] = await UserModel.aggregate(queryStage).cache(config?.CACHE_1_DAY, cacheKey)
      return res.status(200).json({
        status: 200,
        message: 'Profile fetched successfully',
        data: oUserProfile
      })
    } catch (error) {
      return catchError(req, res)
    }
  }

  // =================================== Admin routes ===================================

  // get all users
  async getUsers (req, res) {
    try {
      const { nPage = 1, nLimit = 10, sSearch, oSorting } = getPaginationValues(req.query)
      const { nMinRating = 1, nMaxRating = 5, bIsUser, iProfessionId, iCityId } = req.query
      const matchStage = {
        eStatus: { $ne: 'D' }
      }
      const projectStage = { sName: 1, sMobileNumber: 1, nAvgRating: 1, 'aProfession.sName': 1, 'aProfession._id': 1, 'aCity.sName': 1, 'aCity._id': 1, eServiceType: 1 }
      if (bIsUser) matchStage.bIsUser = bIsUser
      if (iProfessionId) matchStage.iProfessionIds = new mongoose.Types.ObjectId(iProfessionId)
      if (iCityId) matchStage.iCityIds = new mongoose.Types.ObjectId(iCityId)
      if (sSearch) {
        matchStage.$or = [
          { sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
          { sMobileNumber: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
        ]
      }
      if (nMaxRating !== undefined && nMinRating !== undefined) {
        if (nMaxRating < nMinRating) return responseMessage(req, res, 'BadRequest', 'ValidationFailed')
        if ((nMinRating > 0) && (nMaxRating < 5)) {
          matchStage.nAvgRating = {
            $gte: nMinRating, $lte: nMaxRating
          }
        }
      }
      const queryStage = [
        {
          $match: matchStage
        },
        {
          $lookup: {
            from: 'professions',
            localField: 'iProfessionIds',
            foreignField: '_id',
            as: 'aProfession'
          }
        },
        {
          $lookup: {
            from: 'cities',
            localField: 'iCityIds',
            foreignField: '_id',
            as: 'aCity'
          }
        }
      ]

      const response = await UserModel.aggregate([
        {
          $facet: {
            aUser: [
              ...queryStage,
              {
                $sort: oSorting
              },
              {
                $skip: (nPage - 1) * nLimit
              },
              { $limit: nLimit },
              {
                $project: projectStage
              }
            ],
            total: [
              ...queryStage,
              { $count: 'total' }
            ]
          }
        }
      ])
      const data = { aUser: response[0].aUser, count: response[0].total[0]?.total || 0 }
      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Users', data)
    } catch (error) {
      return catchError(req, res)
    }
  }

  // get user details
  async getUser (req, res) {
    try {
      const { id } = req.params
      const queryStage = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'professions',
            localField: 'iProfessionIds',
            foreignField: '_id',
            as: 'aProfession'
          }
        },
        {
          $lookup: {
            from: 'cities',
            localField: 'iCityIds',
            foreignField: '_id',
            as: 'aCity'
          }
        },
        {
          $project: { sName: 1, sMobileNumber: 1, 'aProfession._id': 1, 'aProfession.sName': 1, 'aCity._id': 1, 'aCity.sName': 1, nAvgRating: 1, nTotalReview: 1 }
        }
      ]
      const userDetails = await UserModel.aggregate(queryStage)

      if (!userDetails?.[0]) return responseMessage(req, res, 'NotFound', 'NotFound', 'User')

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'UserDetails', { data: userDetails?.[0] })
    } catch (error) {
      return catchError(req, res)
    }
  }

  // delete user profile
  async deleteUser (req, res) {
    try {
      const iUserId = req.params.id

      const user = await UserModel.findOne({ _id: iUserId, eStatus: { $ne: 'D' }, bIsUser: true }).lean()

      if (!user) return responseMessage(req, res, 'NotFound', 'NotFound', 'User')
      await UserModel.findByIdAndUpdate(iUserId, { bIsUser: false, eStatus: 'D', dDeletedAt: new Date() }).lean()

      const [registeredToken] = user.aJwtTokens.slice(-1)
      const sTitle = `Hello ${user.sName}`
      const sBody = message.English.YourProfileDeletedByAdmin

      if (registeredToken && registeredToken.sPushToken) {
        // await pushNotification(registeredToken.sPushToken, sTitle, sBody)
        await savePushNotification({ iAdminId: new mongoose.Types.ObjectId(req.params._id), sUserToken: registeredToken.sPushToken, sTitle, sDescription: sBody })
      }
      const logData = {
        eOperationType: 'D',
        sOperationName: logOperationName?.ADU,
        sIpAddress: getIp(req)
      }
      await userLog(req, res, logData)
      return responseMessage(req, res, 'Success', 'DeletedSuccessfully', 'Profile')
    } catch (error) {
      return catchError(req, res)
    }
  }
}

setTimeout(() => {
  contactSyncNodeNew()
  contactSyncNodeExists()
}, 2000)

module.exports = new UserController()
