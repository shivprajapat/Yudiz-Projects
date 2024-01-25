const UsersModel = require('../model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { catchError, getPaginationValues2, pick, removenull, projectionFields, getIp, getUserType, generateNumber, replaceSenistiveInfo } = require('../../../helper/utilities.services')
const { maleFirstNames, femaleFirstNames, lastNames } = require('../../../helper/name')
const jwt = require('jsonwebtoken')
const config = require('../../../config/config')
const PassbookModel = require('../../passbook/model')
const UserBalanceModel = require('../../userBalance/model')
const StatisticsModel = require('../statistics/model')
// const { redisClient } = require('../../../helper/redis')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const data = require('../../../data')
const { createAdminLog } = require('../../commonRules/grpc/clientServices')
class SystemUsers {
  async list(req, res) {
    try {
      const { mobile, internalAccount, email, datefrom, dateto, isFullResponse } = req.query
      const { start, limit, sorting, search } = getPaginationValues2(req.query)

      let query = mobile ? { bIsMobVerified: true } : {}
      query = internalAccount ? { ...query, bIsInternalAccount: true } : query
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
      query.eType = 'B'

      let results
      if ([true, 'true'].includes(isFullResponse)) {
        if (!datefrom || !dateto) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].date_filter_err })
        }
        results = await UsersModel.find(query, {
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
          iStateId: 1,
          dDob: 1,
          iCountryId: 1,
          iCityId: 1,
          sAddress: 1,
          nPinCode: 1,
          dCreatedAt: 1,
          bIsInternalAccount: 1

        }).sort(sorting).lean()
      } else {
        results = await UsersModel.find(query, {
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
          dCreatedAt: 1,
          bIsInternalAccount: 1

        }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()
      }
      const data = [{ results }]
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].csystemUsers), data: data })
    } catch (error) {
      return catchError('SystemUsers.list', error, req, res)
    }
  }

  async getCounts(req, res) {
    try {
      const { mobile, internalAccount, email, datefrom, dateto } = req.query
      const { search } = getPaginationValues2(req.query)

      let query = mobile ? { bIsMobVerified: true } : {}
      query = internalAccount ? { ...query, bIsInternalAccount: true } : query
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
      query.eType = 'B'

      const count = await UsersModel.countDocuments({ ...query })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', `${messages[req.userLanguage].csystemUsers} ${messages[req.userLanguage].cCounts}`), data: { count } })
    } catch (error) {
      return catchError('SystemUsers.getCounts', error, req, res)
    }
  }

  async add(req, res) {
    try {
      const { nUsers } = req.body

      let sUser = 0

      while (sUser < parseInt(nUsers)) {
        const randomUser = getRandomUser()
        const { sEmail, sMobNum, sUsername } = randomUser
        const isUserExists = await UsersModel.findOne({ $or: [{ sEmail }, { sMobNum }, { sUsername }] })
        if (isUserExists) {
          continue
        }
        const user = await UsersModel.create(randomUser)
        // await UsersModel.updateOne({ _id: ObjectId(user._id) }, { $push: { aJwtTokens: newToken } })
        await PassbookModel.create({
          iUserId: user._id.toString(),
          eUserType: 'B',
          eTransactionType: 'Opening',
          sRemarks: `${sUsername} Initial Account Opened`,
          dActivityDate: new Date()
        })
        await UserBalanceModel.create({ iUserId: user._id.toString(), eUserType: 'B' })
        await StatisticsModel.create([{ iUserId: user._id, eUserType: 'B' }])
        sUser++
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].csystemUsers) })
    } catch (error) {
      return catchError('SystemUsers.add', error, req, res)
    }
  }

  // wont be used as we are not storing jwt anymore
  async addToken(req, res) {
    try {
      const systemUsers = await UsersModel.find({ eType: 'B' }).lean()
      // const aUpdateUser = []
      // systemUsers.map((user) => {

      //   aUpdateUser.push({
      //     updateOne: {
      //       filter: { _id: ObjectId(user._id) },
      //       update: { $push: { aJwtTokens: newToken } }
      //     }
      //   })
      // })
      // await UsersModel.bulkWrite(aUpdateUser, { ordered: false })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cToken) })
    } catch (error) {
      return catchError('SystemUsers.addToken', error, req, res)
    }
  }

  async get(req, res) {
    try {
      const data = await UsersModel.countDocuments({ eType: 'B' })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].csystemUser), data })
    } catch (error) {
      return catchError('SystemUsers.get', error, req, res)
    }
  }

  async remove(req, res) {
    try {
      await UsersModel.deleteMany({ eType: 'B' }).lean()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].csystemUser) })
    } catch (error) {
      return catchError('SystemUsers.remove', error, req, res)
    }
  }

  async adminGet(req, res) {
    try {
      const user = await UsersModel.findOne({ _id: req.params.id, eType: 'B' }).lean()

      if (!user) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cprofile) })

      UsersModel.filterDataForAdmin(user)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cprofile), data: user })
    } catch (error) {
      return catchError('Users.adminGet', error, req, res)
    }
  }

  async adminUpdate(req, res) {
    try {
      const { sEmail, sMobNum, eStatus, eGender } = req.body
      req.body = pick(req.body, ['sName', 'eGender', 'eStatus', 'sReferCode', 'sProPic', 'dDob', 'iCityId', 'iCountryId', 'iStateId', 'sAddress', 'nPinCode', 'sEmail', 'sMobNum'])
      removenull(req.body)
      const projection = projectionFields(req.body)

      const iUserId = req.params.id

      const oOldFields = await UsersModel.findOne({ _id: iUserId, eType: 'B' }, { ...projection, aJwtTokens: 1, _id: 0 }).lean()
      if (!oOldFields) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].csystemUser) })
      if (eStatus && eStatus === 'N') {
        // const { aJwtTokens } = oOldFields
        // const aUpdateUser = []
        // aJwtTokens.map(async (token) => {
        //   aUpdateUser.push({
        //     updateOne: {
        //       filter: { _id: ObjectId(iUserId) },
        //       update: { $pull: { aJwtTokens: { sToken: token.sToken } } }
        //     }
        //   })
        // await redisClient.del(`at:${token.sToken}`)
        // })
        // await UsersModel.bulkWrite(aUpdateUser, { ordered: false })
      }

      const { _id: iAdminId } = req.admin
      const userExist = await UsersModel.findOne({ $or: [{ sEmail }, { sMobNum }], _id: { $ne: iUserId } }).lean()
      if (userExist) {
        if (userExist.sMobNum === sMobNum) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
        if (userExist.sEmail === sEmail) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
        if (userExist.sEmail !== sEmail) req.body.bIsEmailVerified = true
        if (userExist.sMobNum !== sMobNum) req.body.bIsMobVerified = true
      }

      if (eGender && !(data.userGender.includes(eGender))) { return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cGender) }) }

      const user = await UsersModel.findByIdAndUpdate(iUserId, { ...req.body }, { new: true, runValidators: true }).lean()

      const oNewFields = { ...req.body }
      let logData = { oOldFields, oNewFields, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: ObjectId(iUserId), eKey: 'P' }
      logData = await replaceSenistiveInfo(logData)
      await createAdminLog(logData)

      UsersModel.filterDataForAdmin(user)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].csystemUser), data: user })
    } catch (error) {
      return catchError('Users.adminUpdate', error, req, res)
    }
  }
}
const getRandomUser = () => {
  const gender = generateNumber(0, 10) >= 5 ? 'male' : 'female'
  const users = gender === 'male' ? maleFirstNames : femaleFirstNames
  const randomNumber = getRandomNDigitNumber(randomBetween(1, 4))
  const fullFirstName = users[randomBetween(0, users.length - 1)]
  const fullLastName = lastNames[randomBetween(0, lastNames.length - 1)]
  const firstName = fullFirstName
  const lastName = generateNumber(0, 10) >= 5 ? fullLastName.substring(0, 2) : fullLastName
  const sName = `${fullFirstName} ${fullLastName}`
  const sUsername = `${firstName}${lastName}${randomNumber || ''}`.toLocaleLowerCase()

  return {
    sName,
    sUsername,
    eType: 'B',
    eGender: gender === 'male' ? 'M' : 'F',
    sEmail: `${sUsername}@mail.com`,
    sMobNum: '91' + generateNumber(10000000, 99999999),
    // sReferCode: randomStr(6, 'referral'),
    ePlatform: 'O',
    bIsEmailVerified: true,
    bIsMobVerified: true,
    eStatus: 'Y'
  }
}
const getRandomNDigitNumber = (numOfDigits) => Math.floor(Math.pow(10, numOfDigits - 1) + generateNumber(0, Math.pow(10, numOfDigits - 1) * 9))
const randomBetween = (min, max) => generateNumber(min, max) + min

module.exports = new SystemUsers()
