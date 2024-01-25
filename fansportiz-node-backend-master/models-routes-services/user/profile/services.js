const UsersModel = require('../model')
const StatisticsModel = require('../statistics/model')
const MyMatchesModel = require('../../myMatches/model')
const UserBalanceModel = require('../../userBalance/model')
const UserLeagueModel = require('../../userLeague/model')
const SeriesLBUserRankModel = require('../../seriesLeaderBoard/seriesLBUserRank.model')
const CitiesModel = require('../cities')
const StatesModel = require('../states')
// const cachegoose = require('recachegoose')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const userBalanceServices = require('../../userBalance/services')
const { catchError, getPaginationValues, pick, projectionFields, getIp, validatePIN, checkValidImageType, removenull, validateUsername, replaceSenistiveInfo } = require('../../../helper/utilities.services')
const { redisClient } = require('../../../helper/redis')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const commonRuleServices = require('../../commonRules/services')
const { bAllowDiskUse, s3UserProfile } = require('../../../config/config')
const data = require('../../../data')
const { createAdminLog } = require('../../commonRules/grpc/clientServices')
const bucket = require('../../../helper/cloudStorage.services')
const { USER_REMINDER_TITLE } = require('../../../config/common')
const { sendNotification } = require('../../queue/notificationQueue')

class Users {
  async listV2(req, res) {
    try {
      const { start = 0, limit = 10, order, search, mobile, internalAccount, email, ePlatform, datefrom, dateto, isFullResponse } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const sorting = { dCreatedAt: orderBy }

      let query = mobile ? { bIsMobVerified: true } : {}
      query = internalAccount ? { ...query, bIsInternalAccount: true } : query
      query = ePlatform ? { ...query, ePlatform } : query
      query = email ? { ...query, bIsEmailVerified: true } : query
      query = datefrom && dateto ? { ...query, dCreatedAt: { $gte: (datefrom), $lte: (dateto) } } : query

      if (search && search.length) {
        query = {
          ...query,
          $or: [
            { sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
          ]
        }
      }

      query = { ...query, eType: 'U', eStatus: { $ne: 'D' } }

      let usersList
      if ([true, 'true'].includes(isFullResponse)) {
        if (!datefrom || !dateto) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].date_filter_err })
        }
        usersList = await UsersModel.find(query, {
          sName: 1,
          sUsername: 1,
          sEmail: 1,
          sMobNum: 1,
          bIsEmailVerified: 1,
          bIsMobVerified: 1,
          sProPic: 1,
          eType: 1,
          eGender: 1,
          eStatus: 1,
          iReferredBy: 1,
          sReferCode: 1,
          iStateId: 1,
          dDob: 1,
          iCountryId: 1,
          iCityId: 1,
          sAddress: 1,
          nPinCode: 1,
          dLoginAt: 1,
          dPasswordchangeAt: 1,
          dCreatedAt: 1,
          bIsInternalAccount: 1,
          ePlatform: 1
        }).sort(sorting).lean()
      } else {
        usersList = await UsersModel.find(query, {
          sName: 1,
          sUsername: 1,
          sEmail: 1,
          sMobNum: 1,
          bIsEmailVerified: 1,
          bIsMobVerified: 1,
          sProPic: 1,
          eType: 1,
          eGender: 1,
          eStatus: 1,
          iReferredBy: 1,
          sReferCode: 1,
          iStateId: 1,
          dDob: 1,
          iCountryId: 1,
          iCityId: 1,
          sAddress: 1,
          nPinCode: 1,
          dLoginAt: 1,
          dPasswordchangeAt: 1,
          dCreatedAt: 1,
          bIsInternalAccount: 1,
          ePlatform: 1
        }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cusers), data: { results: usersList } })
    } catch (error) {
      return catchError('Users.listV2', error, req, res)
    }
  }

  async getCounts(req, res) {
    try {
      const { search, mobile, internalAccount, email, datefrom, ePlatform, dateto } = req.query

      let query = mobile ? { bIsMobVerified: true } : {}
      query = internalAccount ? { ...query, bIsInternalAccount: true } : query
      query = ePlatform ? { ...query, ePlatform } : query
      query = email ? { ...query, bIsEmailVerified: true } : query
      query = datefrom && dateto ? { ...query, dCreatedAt: { $gte: (datefrom), $lte: (dateto) } } : query

      if (search && search.length) {
        query = {
          ...query,
          $or: [
            { sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
          ]
        }
      }

      query = { ...query, eType: 'U', eStatus: { $ne: 'D' } }

      const count = await UsersModel.countDocuments({ ...query })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', `${messages[req.userLanguage].cusers} ${messages[req.userLanguage].cCounts}`), data: { count } })
    } catch (error) {
      return catchError('Users.getCounts', error, req, res)
    }
  }

  async getV2(req, res) {
    try {
      const user = await UsersModel.findById(req.user._id, { dLoginAt: 0 }).lean()
      if (!user) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

      const balanceExist = await UserBalanceModel.findOne({ where: { iUserId: req.user._id.toString() }, raw: true })

      const llc = await commonRuleServices.findRule('LCC')
      const nLeagueCreatorCom = llc ? llc.nAmount : undefined

      if (!balanceExist) {
        const openAccount = await userBalanceServices.openAccount({ iUserId: user._id, sUsername: user.sUsername, eType: user.eType })
        if (openAccount.isSuccess === false) {
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].user), data: { ...user, nLeagueCreatorCom, id: undefined, iUserId: undefined } })
        }
      }
      UsersModel.filterDataForUser(user)

      const balance = await UserBalanceModel.findOne({ where: { iUserId: req.user._id.toString() }, raw: true })
      balance.eUserType = undefined
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].user), data: { ...user, ...balance, nLeagueCreatorCom, id: undefined, iUserId: undefined } })
    } catch (error) {
      return catchError('Users.get', error, req, res)
    }
  }

  async getStatistic(req, res) {
    try {
      const aTotalJoinLeague = await MyMatchesModel.aggregate([
        { $match: { iUserId: req.user._id } }, {
          $project: {
            count: { $cond: { if: { $isArray: '$aMatchLeagueId' }, then: { $size: '$aMatchLeagueId' }, else: 0 } }
          }
        }
      ])
        .allowDiskUse(bAllowDiskUse)
        .exec()

      const nTotalJoinLeague = aTotalJoinLeague.length ? aTotalJoinLeague.reduce((sum, { count }) => (sum + count), 0) : 0
      const nTotalMatch = await MyMatchesModel.countDocuments({ iUserId: req.user._id, 'aMatchLeagueId.0': { $exists: true } })

      const data = await StatisticsModel.findOne({ iUserId: req.user._id }, { nTotalWinnings: 1, _id: 0 }).lean()
      if (!data) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].user) })
      const statistic = { ...data, nTotalJoinLeague, nTotalMatch }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].user), data: { ...statistic } })
    } catch (error) {
      return catchError('Users.getStatistic', error, req, res)
    }
  }

  async adminGet(req, res) {
    try {
      const user = await UsersModel.findOne({ _id: req.params.id, eType: 'U' }).lean()
      if (!user) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cprofile) })

      UsersModel.filterDataForAdmin(user)

      const statistics = await StatisticsModel.findOne({ iUserId: req.params.id }, { nReferrals: 1, _id: 0 }).lean()

      const data = { ...user, ...statistics }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cprofile), data })
    } catch (error) {
      return catchError('Users.adminGet', error, req, res)
    }
  }

  async update(req, res) {
    try {
      const { sProPic, nPinCode, eGender } = req.body
      req.body = pick(req.body, ['sName', 'eGender', 'sProPic', 'dDob', 'sAddress', 'nPinCode', 'iCityId', 'iStateId', 'iCountryId'])
      removenull(req.body)

      if (eGender && !(data.userGender.includes(eGender))) { return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cGender) }) }

      if (nPinCode && !validatePIN(nPinCode)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cPin) })

      const iUserId = req.user._id
      const user = await UsersModel.findByIdAndUpdate(iUserId, { ...req.body }, { new: true, runValidators: true }).lean()
      UsersModel.filterDataForUser(user)

      if (sProPic && sProPic.length) {
        UserLeagueModel.updateMany({ iUserId: ObjectId(user._id) }, { sProPic: user.sProPic }).exec()
        SeriesLBUserRankModel.updateMany({ iUserId: ObjectId(user._id) }, { sProPic: user.sProPic }).exec()
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].cprofile), data: user })
    } catch (error) {
      return catchError('Users.update', error, req, res)
    }
  }

  async updateV2(req, res) {
    try {
      const { sUsername, sProPic, nPinCode, eGender } = req.body
      req.body = pick(req.body, ['sName', 'sUsername', 'eGender', 'sProPic', 'dDob', 'sAddress', 'nPinCode', 'iCityId', 'iStateId', 'iCountryId'])
      removenull(req.body)

      if (sUsername && !validateUsername(sUsername)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].username) })

      if (eGender && !(data.userGender.includes(eGender))) { return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cGender) }) }

      if (nPinCode && !validatePIN(nPinCode)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cPin) })

      const iUserId = req.user._id

      const userNameExist = await UsersModel.findOne({ sUsername }).lean()

      if (userNameExist && !(userNameExist._id.toString() === iUserId.toString())) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username) })

      const user = await UsersModel.findByIdAndUpdate(iUserId, { ...req.body }, { new: true, runValidators: true }).lean()
      UsersModel.filterDataForUser(user)

      if ((sProPic && sProPic.length) || sUsername) {
        const oUserLeague = {}
        const oSeriesLB = {}

        if (sProPic && sProPic.length) {
          oSeriesLB.sProPic = user.sProPic
          oUserLeague.sProPic = user.sProPic
        }

        if (sUsername) {
          oSeriesLB.sUsername = user.sUsername
          oUserLeague.sUserName = user.sUsername
        }

        await Promise.all([
          UserLeagueModel.updateMany({ iUserId: ObjectId(user._id) }, oUserLeague),
          SeriesLBUserRankModel.updateMany({ iUserId: ObjectId(user._id) }, oSeriesLB)
        ])
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].cprofile), data: user })
    } catch (error) {
      return catchError('Users.updateV2', error, req, res)
    }
  }

  async getSignedUrl(req, res) {
    try {
      req.body = pick(req.body, ['sFileName', 'sContentType'])
      const { sFileName, sContentType } = req.body

      const valid = checkValidImageType(sFileName, sContentType)
      if (!valid) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].image) })

      const data = await bucket.getSignedUrl({ sFileName, sContentType, path: s3UserProfile })

      // const data = await s3.signedUrl(sFileName, sContentType, s3UserProfile)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      catchError('Users.getSignedUrl', error, req, res)
    }
  }

  async adminUpdate(req, res) {
    try {
      const { sEmail, sMobNum, eStatus, sProPic, sUsername, nPinCode, eGender } = req.body
      req.body = pick(req.body, ['sName', 'eGender', 'eStatus', 'sReferCode', 'dDob', 'sAddress', 'nPinCode', 'sEmail', 'sMobNum', 'bIsInternalAccount', 'iCityId', 'iStateId', 'iCountryId', 'sUsername'])

      const projection = projectionFields(req.body)

      const iUserId = req.params.id

      const oOldFields = await UsersModel.findOne({ _id: iUserId }, { ...projection, aPushToken: 1, _id: 0 }).lean()
      if (!oOldFields) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cuserProfile) })
      if (eStatus && eStatus === 'N') {
        // const { aPushToken } = oOldFields
        await UsersModel.updateOne({ _id: ObjectId(iUserId) }, { $set: { aPushToken: [] } })
        // aPushToken.map((token) => {
        //   // blackListToken(token.s)
        //   // cachegoose.clearCache(`at:${token.sToken}`)
        // })
      }

      if (eGender && !(data.userGender.includes(eGender))) { return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cGender) }) }

      if (nPinCode && !validatePIN(nPinCode)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cPin) })

      const { _id: iAdminId } = req.admin
      const userExist = await UsersModel.findOne({ $or: [{ sEmail }, { sMobNum }, { sUsername }], _id: { $ne: iUserId } }).lean()
      if (userExist) {
        if (userExist.sMobNum === sMobNum) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
        if (userExist.sEmail && userExist.sEmail === sEmail) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
        if (userExist.sUsername === sUsername) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username) })

        if (userExist.sEmail !== sEmail) req.body.bIsEmailVerified = true
        if (userExist.sMobNum !== sMobNum) req.body.bIsMobVerified = true
      }
      const user = await UsersModel.findByIdAndUpdate(iUserId, { ...req.body, sProPic }, { new: true, runValidators: true }).lean()

      const oNewFields = { ...req.body }
      let logData = { oOldFields, oNewFields, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: ObjectId(iUserId), eKey: 'P' }
      logData = await replaceSenistiveInfo(logData)
      await createAdminLog(logData)

      UsersModel.filterDataForAdmin(user)

      if (sProPic && sProPic.length) {
        UserLeagueModel.updateMany({ iUserId: ObjectId(user._id) }, { sProPic: user.sProPic }).exec()
        SeriesLBUserRankModel.updateMany({ iUserId: ObjectId(user._id) }, { sProPic: user.sProPic }).exec()
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].user), data: user })
    } catch (error) {
      return catchError('Users.adminUpdate', error, req, res)
    }
  }

  async getState(req, res) {
    try {
      // List of State (Static) only be added in DB from backend developer, it'll not be add and update from admin
      const query = req.query.eStatus ? { eStatus: req.query.eStatus } : {}

      const states = await StatesModel.find(query, { sName: 1, id: 1, _id: 0, eStatus: 1 }).lean()
      if (!states) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cUserStates) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cUserStates), data: states })
    } catch (error) {
      return catchError('Users.getState', error, req, res)
    }
  }

  async listCity(req, res) {
    try {
      // List of City (Static) only be added in DB from backend developer, it'll not be add and update from admin
      let { start, limit } = getPaginationValues(req.query)
      if (!start || !limit) {
        start = 0
        limit = 10
      }
      const data = await CitiesModel.aggregate([
        {
          $match: {
            nStateId: Number(req.query.nStateId)
          }
        },
        {
          $group: {
            _id: 0,
            count: {
              $sum: 1
            },
            document: {
              $push: '$$ROOT'
            }
          }
        },
        {
          $unwind: '$document'
        },
        { $limit: parseInt(start) + parseInt(limit) },
        { $skip: parseInt(start) },
        {
          $group: {
            _id: 0,
            total: {
              $first: '$count'
            },
            results: {
              $push: {
                sName: { $ifNull: ['$document.sName', ''] }
              }
            }
          }
        }
      ]).allowDiskUse(bAllowDiskUse).exec()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cUsersCity), data: data })
    } catch (error) {
      return catchError('Users.listCity', error, req, res)
    }
  }

  async adminRecommendation(req, res) {
    try {
      let { sSearch, nLimit } = req.query
      sSearch = !sSearch ? '' : sSearch
      nLimit = !nLimit ? 10 : parseInt(nLimit)

      const sValue = { $regex: new RegExp('^.*' + sSearch + '.*', 'i') }
      const query = { $or: [{ sName: sValue }, { sUsername: sValue }, { sEmail: sValue }, { sMobNum: sValue }] }

      const data = await UsersModel.find(query, { _id: 1, sName: 1, sEmail: 1, sUsername: 1, sMobNum: 1 }).limit(nLimit).lean()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cRecommendedUsers), data })
    } catch (error) {
      return catchError('Users.adminRecommendation', error, req, res)
    }
  }

  async referredByUserList(req, res) {
    try {
      const { start = 0, limit = 10, sort = 'dCreatedAt', order, search } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const sorting = { [sort]: orderBy }

      let query = { iReferredBy: ObjectId(req.params.id) }
      if (search && search.length) {
        query = {
          ...query,
          $or: [
            { sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
          ]
        }
      }
      const usersList = await UsersModel.find(query, {
        sName: 1,
        sUsername: 1,
        sEmail: 1,
        sMobNum: 1,
        bIsEmailVerified: 1,
        bIsMobVerified: 1,
        sProPic: 1,
        eType: 1,
        eGender: 1,
        eStatus: 1,
        iReferredBy: 1,
        sReferCode: 1,
        iStateId: 1,
        dDob: 1,
        iCountryId: 1,
        iCityId: 1,
        sAddress: 1,
        nPinCode: 1,
        dLoginAt: 1,
        dPasswordchangeAt: 1,
        dCreatedAt: 1,
        bIsInternalAccount: 1
      }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()

      const count = await UsersModel.countDocuments({ ...query })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserrefferals), data: { results: usersList, count } })
    } catch (error) {
      return catchError('Users.referredByUserList', error, req, res)
    }
  }

  async userReferrals(req, res) {
    try {
      const { start = 0, limit = 10, sort = 'dCreatedAt', order, search, eReferStatus, sReferrerRewardsOn } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      const sorting = { [sort]: orderBy }

      let query = { iReferredBy: ObjectId(req.user._id) }
      if (eReferStatus) { query = { ...query, eReferStatus } }
      if (sReferrerRewardsOn) { query = { ...query, sReferrerRewardsOn } }
      if (search && search.length) {
        query = {
          ...query,
          sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') }
        }
      }
      const [aResult, nCount] = await Promise.all([
        UsersModel.find(query, {
          sUsername: 1,
          nReferrerAmount: 1,
          sReferrerRewardsOn: 1,
          eReferStatus: 1,
          dCreatedAt: 1
        }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean(),
        UsersModel.countDocuments(query)
      ])
      if (!aResult.length) {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cuserrefferals) })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserrefferals), data: { aResult, nCount } })
    } catch (error) {
      return catchError('Users.userReferrals', error, req, res)
    }
  }

  async deletedUsers(req, res) {
    try {
      const { start = 0, limit = 10, order, search, mobile, internalAccount, ePlatform, email, datefrom, dateto, isFullResponse } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const sorting = { dDeletedAt: orderBy }

      let query = mobile ? { bIsMobVerified: true } : {}
      query = internalAccount ? { ...query, bIsInternalAccount: true } : query
      query = email ? { ...query, bIsEmailVerified: true } : query
      query = ePlatform ? { ...query, ePlatform } : query
      query = datefrom && dateto ? { ...query, dCreatedAt: { $gte: (datefrom), $lte: (dateto) } } : query

      if (search && search.length) {
        query = {
          ...query,
          $or: [
            { sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
          ]
        }
      }

      query = { ...query, eStatus: 'D', eType: 'U' }
      const oProjection = {
        sName: 1,
        sUsername: 1,
        sEmail: 1,
        sMobNum: 1,
        bIsEmailVerified: 1,
        bIsMobVerified: 1,
        eType: 1,
        eStatus: 1,
        dDeletedAt: 1,
        dCreatedAt: 1,
        sReason: 1,
        bIsInternalAccount: 1,
        ePlatform: 1
      }

      let usersList
      let count = 0
      if ([true, 'true'].includes(isFullResponse)) {
        if (!datefrom || !dateto) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].date_filter_err })
        }
        usersList = await UsersModel.find(query, oProjection).sort(sorting).lean()
      } else {
        [usersList, count] = await Promise.all([
          UsersModel.find(query, oProjection).sort(sorting).skip(Number(start)).limit(Number(limit)).lean(),
          UsersModel.countDocuments(query)
        ])
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cusers), data: { results: usersList, count } })
    } catch (error) {
      return catchError('Users.deletedUsers', error, req, res)
    }
  }

  async listOfReason(req, res) {
    try {
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].reasons), data: { aReason: data.reasonsForDeleteAccount } })
    } catch (error) {
      return catchError('Users.listOfReason', error, req, res)
    }
  }

  async remindReferUser(req, res) {
    try {
      const iReceiverId = req.body.id
      const sTitle = USER_REMINDER_TITLE
      const remindKey = `Remind:${iReceiverId}`
      const tokenExp = 86400
      const isRemind = await redisClient.get(`Remind:${iReceiverId}`)
      if (isRemind) {
        return res.status(status.OK).jsonp({
          status: jsonStatus.OK,
          message: messages[req.userLanguage].already_remind
        })
      }
      const receiver = await UsersModel.findOne({ _id: ObjectId(iReceiverId), iReferredBy: ObjectId(req.user._id) }, { sReferrerRewardsOn: 1, aPushToken: 1 }).lean()
      if (!receiver) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].creminduser) })
      const sMessage = messages[req.userLanguage][receiver.sReferrerRewardsOn] || 'Play and win exciting prizes.'
      const aToken = receiver.aPushToken
      await Promise.all([
        sendNotification(aToken, sTitle, sMessage),
        redisClient.setex(remindKey, tokenExp, 0)
      ])
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].sent_success.replace('##', messages[req.userLanguage].creminder) })
    } catch (error) {
      return catchError('Users.remindReferUser', error, req, res)
    }
  }

  async userCitiesList(req, res) {
    try {
      const cities = await CitiesModel.find({ nStateId: Number(req.query.nStateId) }, { sName: 1, _id: 0 }).lean()
      if (!cities) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cUsersCity) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cUsersCity), data: cities })
    } catch (error) {
      return catchError('Users.userCitiesList', error, req, res)
    }
  }
}

module.exports = new Users()
