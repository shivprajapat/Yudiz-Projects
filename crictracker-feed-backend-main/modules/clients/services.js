const bcryptjs = require('bcryptjs')
const moment = require('moment')
const { _, messages, constants: { apiPath, constraints } } = require('../../global')
const ClientsModel = require('./model')
const { SubscriptionModel } = require('../subscriptions')
const config = require('../../config')
const saltRounds = 10
const salt = bcryptjs.genSaltSync(saltRounds)
const { redisScheduler: { queuePush } } = require('../../utils/index')

const { ApiLogsModel } = require('../api-logs') // Use service of that module rather than the model directly
const { articles: ArticlesModel } = require('../../app/model')
const { redis: { redisFeedDb } } = require('../../utils')

const { processRedis } = require('../../extras')

class Clients {
  async store(req, res) {
    try {
      const body = _.pick(req.body, ['sName', 'sUsername', 'sEmail', 'aSubscriptionType', 'dSubscriptionStart', 'dSubscriptionEnd', 'nApiTotal', 'nArticleTotal', 'aCategoryIds', 'sPassword', 'sExclusiveSlug'])
      const { sName, sUsername, sEmail, aSubscriptionType, dSubscriptionStart, dSubscriptionEnd, nApiTotal, nArticleTotal = 0, aCategoryIds, sPassword, sExclusiveSlug } = body

      const clientData = await ClientsModel.findOne({ sUsername: sUsername.toLowerCase().trim() }).lean()
      if (clientData) return _.response(req, res, 'already_exist', 'statusResourceExist', {}, 'client')
      if (aSubscriptionType.includes('article') && !nArticleTotal) return _.response(req, res, 'required', 'statusBadRequest', {}, 'articleLimit')
      if (aSubscriptionType.includes('category') && (!aCategoryIds || !aCategoryIds.length)) return _.response(req, res, 'required', 'statusBadRequest', {}, 'category')
      if (aSubscriptionType.includes('exclusive') && !sExclusiveSlug) return _.response(req, res, 'required', 'statusBadRequest', {}, 'exclusiveSlug')

      const clientObj = {
        sName,
        sUsername: sUsername.toLowerCase().trim(),
        sEmail: sEmail.toLowerCase().trim(),
        eStatus: 'a',
        sPassword: bcryptjs.hashSync(sPassword, salt)
      }
      if (aSubscriptionType.includes('exclusive') && sExclusiveSlug) clientObj.sExclusiveSlug = sExclusiveSlug

      const newClient = await new ClientsModel(clientObj)
      const client = await newClient.save()

      const subscriptionObj = {
        iClientId: client._id,
        aSubscriptionType,
        dSubscriptionStart,
        dSubscriptionEnd,
        oStats: {
          nApiTotal
        }
      }

      if (aSubscriptionType.includes('article')) subscriptionObj.oStats.nArticleTotal = nArticleTotal
      if (aSubscriptionType.includes('category')) subscriptionObj.oStats.aCategoryIds = aCategoryIds

      const newSubscription = await new SubscriptionModel(subscriptionObj)
      const subscription = await newSubscription.save()

      const newToken = _.encodeToken({ _id: client._id }, '1800d')
      const dValidTill = moment().add('1800', 'days')

      client.aToken.push({ sToken: newToken, eStatus: 'a', dValidTill, iGeneratedBy: req.admin._id, dCreatedAt: Date.now() })

      const newLoginToken = {
        sToken: _.encodeToken({ _id: (client._id).toHexString() }, config.JWT_LOGIN_VALIDITY)
      }

      if (client.aJwtTokens.length < config.LOGIN_HARD_LIMIT_CLIENT || config.LOGIN_HARD_LIMIT_CLIENT === 0) {
        client.aJwtTokens.push(newLoginToken)
      } else {
        client.aJwtTokens.splice(0, 1)
        client.aJwtTokens.push(newLoginToken)
      }

      await ClientsModel.findByIdAndUpdate(client._id, { $set: { aToken: client.aToken, aJwtTokens: client.aJwtTokens, iSubscriptionId: subscription._id } }, { runValidators: true })

      return res.send({ status: messages.status.statusOk, message: messages[req.userLanguage].reg_success.replace('##', messages[req.userLanguage].client) })
    } catch (error) {
      return _.catchError('Clients.store', error, req, res)
    }
  }

  async regenerateToken(req, res) {
    try {
      const activeToken = req.client.aToken.filter(s => s.eStatus === 'a')

      if (activeToken?.length >= 2) return _.response(req, res, 'tokenGenerate24Error', 'statusBadRequest')

      const newToken = _.encodeToken({ _id: req.client._id }, '1800d')
      const dValidTill = moment().add('1800', 'days')
      const dValidTillOld = moment().add('24', 'h')
      const aToken = [
        { sToken: newToken, eStatus: 'a', dValidTill, dCreatedAt: Date.now() },
        { sToken: req.client.aToken[0].sToken, eStatus: 'a', dValidTill: dValidTillOld, iGeneratedBy: req.client.aToken[0].iGeneratedBy, dCreatedAt: req.client.aToken[0].dCreatedAt }
      ]

      await ClientsModel.findByIdAndUpdate(req.client._id, { $set: { aToken } })

      return _.response(req, res, 'tokenGenerateSuccess', 'statusOk')
    } catch (error) {
      return _.catchError('Admins.register', error, req, res)
    }
  }

  async login(req, res) {
    try {
      let { sLogin, sPushToken, sPassword } = req.body

      sLogin = sLogin.toLowerCase().trim()

      const client = await ClientsModel.findOne({ $or: [{ sUsername: sLogin }, { sEmail: sLogin }], eStatus: 'a' })
      if (!client) return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized')

      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      if (!bcryptjs.compareSync(sPassword, client.sPassword)) {
        if (constraints.isApiRateLimiterEnabled) {
          let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
          ipAddress = ipAddress ? ipAddress.split(',') : ''
          ipAddress = ipAddress[0]

          if (ipAddress) {
            const rateLimit = await _.apiRateLimiter(ipAddress, apiPath.clientLogin, constraints.loginThreshold, constraints.loginRateLimitTime)
            if (rateLimit === 'LIMIT_REACHED') return _.response(req, res, 'login_limit_reached', 'statusTooManyRequests')
          }
        }

        return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized')
      }

      const newToken = {
        sToken: _.encodeToken({ _id: (client._id).toHexString() }, config.JWT_LOGIN_VALIDITY),
        sIpAddress: ipAddress,
        sPushToken
      }

      if (client.aJwtTokens.length < config.LOGIN_HARD_LIMIT_CLIENT || config.LOGIN_HARD_LIMIT_CLIENT === 0) {
        client.aJwtTokens.push(newToken)
      } else {
        client.aJwtTokens.splice(0, 1)
        client.aJwtTokens.push(newToken)
      }

      await client.save()

      return _.response(req, res, 'reg_success', 'statusOk', { sLoginToken: newToken.sToken }, 'you', { Authorization: newToken.sToken })
    } catch (error) {
      return _.catchError('Admins.register', error, req, res)
    }
  }

  async changePassword(req, res) {
    try {
      const { sOldPassword, sNewPassword } = req.body

      const client = await ClientsModel.findById(req.client._id)
      if (!client) return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized')

      if (!bcryptjs.compareSync(sOldPassword, client.sPassword)) return _.response(req, res, 'wrong_old_password', 'statusBadRequest')

      if (sOldPassword === sNewPassword) return _.response(req, res, 'old_new_password_same', 'statusBadRequest')

      if (client && client.eStatus === 'i') return _.response(req, res, 'block_user_err', 'statusUnAuthorized')

      client.sPassword = bcryptjs.hashSync(sNewPassword, salt)
      await client.save()
      // await AuthLogsModel.create({ iUserId: client._id, ePlatform, eType: 'PC', sIpAddress: req.connection.remoteAddress })

      // if (client.sEmail) {
      //   await queuePush('SendMail', {
      //     sValues: {
      //       sUsername: client.sUsername
      //     },
      //     emailTemplate: 'change-password.ejs',
      //     to: client.sEmail,
      //     from: 'HousieSkill <care@housieskill.com>',
      //     subject: 'Your Password Has Been Changed!'
      //   })
      // }

      return _.response(req, res, 'updateSuccess', 'statusOk', {}, 'password')
    } catch (error) {
      return _.catchError('Admins.register', error, req, res)
    }
  }

  async forgotPassword(req, res) {
    try {
      let { sLogin } = req.body
      sLogin = sLogin.toLowerCase().trim()

      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

      const message = await _.apiRateLimiter(ipAddress, apiPath.clientForgotPasswordPath, constraints.forgotPasswordThreshold, constraints.forgotPasswordRateLimit)
      if (message === 'LIMIT_REACHED') return _.response(req, res, 'resendOtpTimerExpire', 'statusTooManyRequests', {}, null, { 'Retry- After': 30 })

      const newToken = _.encodeToken({ sLogin }, config.JWT_VERIFICATION_VALIDITY)

      const client = await ClientsModel.findOneAndUpdate({ $or: [{ sUsername: sLogin }, { sEmail: sLogin }] }, { $set: { sVerificationToken: newToken } })
      if (!client) return _.response(req, res, 'accountNotExist', 'statusBadRequest')
      if (client && client.eStatus === 'i') return _.response(req, res, 'block_user_err', 'statusUnAuthorized')

      const messageForOtpCount = await _.apiRateLimiter(ipAddress, apiPath.clientForgotPasswordAttempt, constraints.forgotPasswordOtpCount, constraints.forgotPasswordOtpRateLimit)
      if (messageForOtpCount === 'LIMIT_REACHED') return _.response(req, res, 'login_limit_reached', 'statusTooManyRequests')

      // Send Mail Here
      await queuePush('sendMail', { sEmail: client.sEmail, eType: 'feedPasswordReset', sVerificationToken: newToken, sUserName: client.sUsername })

      return _.response(req, res, 'mail_success', 'statusOk', {}, 'reset_link')
    } catch (error) {
      return _.catchError('Admins.register', error, req, res)
    }
  }

  async resetPassword(req, res) {
    try {
      const { sVerificationToken, sPassword } = req.body

      const decodedToken = _.decodeToken(sVerificationToken)
      if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') return _.response(req, res, 'reset_link_expire', 'statusUnAuthorized')

      const client = await ClientsModel.findOne({ sVerificationToken, eStatus: 'a' })
      if (!client) return _.response(req, res, 'reset_link_expire', 'statusBadRequest')
      client.sPassword = bcryptjs.hashSync(sPassword, salt)
      client.sVerificationToken = null
      await client.save()

      return _.response(req, res, 'updateSuccess', 'statusOk', {}, 'password')
    } catch (error) {
      return _.catchError('Admins.register', error, req, res)
    }
  }

  async getAdminByToken(token) {
    try {
      const client = await ClientsModel.findOne({ 'aToken.sToken': token })
      const subscription = await SubscriptionModel.findOne({ iClientId: client._id, eStatus: 'a' }).lean()
      client.subscription = subscription
      return client
    } catch (error) {
      return error
    }
  }

  async getGeneralApiStats(req, res) {
    try {
      const { client, subscription } = req
      const response = []
      const getGeneralDayCounts = await redisFeedDb.keys(`generalDayCount:${client._id}:${subscription._id}:${client.sTz ?? 'Asia/Kolkata'}:*`)
      for (const getGeneralDayCount of getGeneralDayCounts) {
        const aCount = await redisFeedDb.hgetall(getGeneralDayCount)
        const dDate = getGeneralDayCount.split(':').pop()
        response.push({ dDate, aCount })
      }

      return res.status(200).send({ data: response.sort((a, b) => new Date(b.dDate) - new Date(a.dDate)) })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ sMessage: 'Dakkho thai gyo' })
    }
  }

  async getArticleApiStats(req, res) {
    try {
      const { client, subscription } = req
      const { nSkip, nLimit, isLiveUpdate, dFetchStart, dFetchEnd, sSearch } = req.query

      if (isLiveUpdate) await processRedis()
      const query = { iClientId: _.mongify(client._id), iSubscriptionId: _.mongify(subscription._id) }

      if (dFetchStart) Object.assign(query, { dFetchedOn: { $gt: dFetchStart, $lt: dFetchEnd } })

      if (sSearch) Object.assign(query, { 'oArticle.sTitle': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } })

      const allArticlesFetched = await ApiLogsModel.find(query).skip(nSkip || 0).limit(nLimit || 10).lean()

      if (allArticlesFetched.length) {
        const allArticles = await ArticlesModel.find({ _id: { $in: allArticlesFetched.map((ele) => ele.iArticleId) } }).lean()
        allArticlesFetched.map((articles) => {
          const foundArticle = allArticles.find((ele) => ele._id.toString() === articles.iArticleId.toString())
          articles.oArticle = { sTitle: foundArticle.sTitle, oImg: foundArticle.oImg }
          return articles
        })
        return res.status(200).send({ data: allArticlesFetched })
      } else {
        return res.status(200).send({ data: [] })
      }
    } catch (error) {
      return res.status(500).send('Dakhho thai gyo')
    }
  }

  async getCategoryApiStats(req, res) {
    try {
      const { client, subscription } = req
      const { nSkip, nLimit, dFetchStart, dFetchEnd, sSearch, isLiveUpdate } = req.query

      if (isLiveUpdate) await processRedis()

      const query = { iClientId: _.mongify(client._id), iSubscriptionId: _.mongify(subscription._id), 'oSeo.eType': 'ct' }

      if (dFetchStart) Object.assign(query, { dFetchedOn: { $gt: dFetchStart, $lt: dFetchEnd } })

      if (sSearch) Object.assign(query, { 'oArticle.sTitle': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } })

      const allArticlesFetched = await ApiLogsModel.find(query).skip(nSkip || 0).limit(nLimit || 10).lean()

      if (allArticlesFetched.length) {
        const allArticles = await ArticlesModel.find({ _id: { $in: allArticlesFetched.map((ele) => ele.iArticleId) } }).lean()
        allArticlesFetched.map((articles) => {
          const foundArticle = allArticles.find((ele) => ele._id.toString() === articles.iArticleId.toString())
          articles.oArticle = { sTitle: foundArticle.sTitle, oImg: foundArticle.oImg }
          return articles
        })
        return res.status(200).send({ data: allArticlesFetched })
      } else {
        return res.status(200).send({ data: [] })
      }
    } catch (error) {
      return res.status(500).send('Dakhho thai gyo')
    }
  }

  async removeInvalidTokens(req, res) {
    try {
      const currentDate = moment()
      const invalidTokens = await ClientsModel.find({ 'aToken.dValidTill': { $lte: currentDate } })

      invalidTokens.forEach(async s => {
        s.aToken.splice(s.aToken.indexOf(e => +e.dValidTill < +currentDate), 1)
        await ClientsModel.findByIdAndUpdate(s._id, { $set: { aToken: s.aToken } })
      })

      return _.response(req, res, 'cronSuccess', 'statusOk', {}, 'invalidToken')
    } catch (error) {
      return _.catchError('Admins.register', error, req, res)
    }
  }

  async fetchClient(req, res) {
    try {
      const client = _.pick(req.client, ['sName', 'sUsername', 'sEmail', 'aToken', 'iSubscriptionId'])

      return _.response(req, res, 'fetchSuccess', 'statusOk', client, 'client')
    } catch (error) {
      return _.catchError('Admins.register', error, req, res)
    }
  }
}

module.exports = new Clients()
