const jwt = require('jsonwebtoken')
const UsersModel = require('../model')
const OTPVerificationsModel = require('../otpverifications.model')
const UserSessionModel = require('../userSession.model')
const UserLeagueModel = require('../../userLeague/model')
const PreferencesModel = require('../../preferences/model')
const seriesLBUserRankModel = require('../../seriesLeaderBoard/seriesLBUserRank.model')
const UserTeamModel = require('../../userTeam/model')
const axios = require('axios')
const { blackListToken, getOTPExpiryStatus } = require('../../../helper/redis')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const {
  removenull, catchError, pick, randomStr, validateEmail, getIp, validatePassword, validateIndianNumber,
  checkCountryCode, getBucketName, getUserType, handleCatchError
} = require('../../../helper/utilities.services')
const { checkRateLimitOTP, getRateLimitStatus, queuePush } = require('../../../helper/redis')
const config = require('../../../config/config')
const bcrypt = require('bcryptjs')
const { subscribeUser } = require('../../../helper/firebase.services')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(config.GOOGLE_CLIENT_ID_W)
const { testCasesDefault } = require('../../../config/testCases.js')
const cachegoose = require('recachegoose')
const { generateOTP, verifyOTPFromProvider } = require('../../../helper/sms.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)
const { countCMS, deleteUserKyc } = require('../grpc/clientServices')
const verifier = require('../../../helper/truecaller.services')
const bucket = require('../../../helper/cloudStorage.services')
const { processRegisterAndReferBonus, checkUserExist } = require('./common')
class UserAuth {
  async registerV4(req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sUsername', 'sEmail', 'sReferCode', 'sCode', 'sMobNum', 'sPassword', 'sDeviceToken', 'sSocialType', 'sSocialToken', 'sPushToken', 'iPolicyId'])
      removenull(req.body)

      let { sEmail, sUsername, sMobNum, sName, sCode, sSocialType, sSocialToken, iPolicyId } = req.body
      sUsername = sUsername.toLowerCase()

      let oSocial
      let sSocialId
      if (sSocialType && sSocialToken) {
        // Social signup with Google process
        if (sSocialType === 'G') {
          const ticket = await client.verifyIdToken({ idToken: sSocialToken, audience: [config.GOOGLE_CLIENT_ID_W] })
          const payload = ticket.getPayload()

          const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${sSocialToken}`)

          if (payload.sub !== googleRes.data.sub) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_auth_failed })

          if (googleRes.data.email !== sEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_email_error })

          sSocialId = googleRes.data.sub
          oSocial = {
            sType: 'G',
            sId: sSocialId,
            sToken: sSocialToken
          }
        } else if (sSocialType === 'F') { // Social signup with Facebook process
          const fbRes = await axios.get(`https://graph.facebook.com/v3.2/me?access_token=${sSocialToken}&debug=all&fields=id,name,first_name,last_name,email&format=json&method=get&pretty=1`)

          if (!fbRes || (fbRes && !fbRes.data.id)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_auth_failed })

          if (fbRes.data.email !== sEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_email_error })

          sSocialId = fbRes.data.id
          oSocial = {
            sType: 'F',
            sId: sSocialId,
            sToken: sSocialToken
          }
        }
      }

      if (oSocial) {
        const socialUser = await UsersModel.findOne({ 'oSocial.sId': sSocialId }, null).lean()
        if (socialUser) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].user) })
        req.body.oSocial = oSocial
        req.body.bIsEmailVerified = true
      }

      if (iPolicyId) {
        const policyExist = await countCMS({ _id: ObjectId(iPolicyId), eStatus: 'Y' })
        if (!policyExist) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].check_policy_err })
      }

      const result = await checkUserExist({ sUsername, sMobNum, sEmail })
      if (!result.isSuccess) return res.status(result.status).jsonp({ status: result.status, message: result.message })
      // common function for checkUserExist

      const isOTPExist = await OTPVerificationsModel.findOne({ sLogin: sMobNum, sType: 'M', sAuth: 'R', sCode, bIsVerify: true }, null, { readPreference: 'primary' }).sort({ dCreatedAt: -1 })
      if (!isOTPExist || isOTPExist.sCode !== parseInt(sCode)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].went_wrong_with.replace('##', messages[req.userLanguage].cotpVerification) })

      req.body.bIsMobVerified = true


      // common function for register and refer bonus
      req.body.ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'
      const oProcessBonusResult = await processRegisterAndReferBonus(req.body, req.userLanguage, getIp(req))
      if (oProcessBonusResult.isSuccess === false) return res.status(oProcessBonusResult.status).jsonp({ status: oProcessBonusResult.status, message: oProcessBonusResult.message })
      const sFullName = sName ? sName.split(' ') : sUsername
      // To send welcome mail to new user
      await queuePush('SendMail', {
        sSlug: 'welcome-email',
        replaceData: {
          firstName: sFullName[0],
          lastName: sFullName[1] || ''
        },
        to: sEmail
      })
      return res.status(status.OK).set('Authorization', oProcessBonusResult.data.Authorization).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].reg_success, data: oProcessBonusResult.data.user, Authorization: oProcessBonusResult.data.Authorization })
    } catch (error) {
      return catchError('UserAuth.registerV4', error, req, res)
    }
  }

  async login(req, res) {
    try {
      req.body = pick(req.body, ['sLogin', 'sPassword', 'sPushToken', 'sDeviceToken'])
      removenull(req.body)

      let { sLogin, sPushToken, sPassword, sDeviceToken } = req.body
      sLogin = sLogin.toLowerCase().trim()

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { sEmail: sLogin } : { sMobNum: sLogin }
      const user = await UsersModel.findOne(query).lean()

      // If user not found or user is blocked or (System)Bot user then we'll give 404 error
      if (!user) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })
      if (user.eStatus !== 'Y' || user.eType === 'B') { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked }) }

      if (!bcrypt.compareSync(sPassword, user.sPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'

      const systemData = [
        '7878787878',
        'superuser@gmail.com',
        '7676767676',
        'internaluser@gmail.com'
      ]

      const isLoginVerify = user.aDeviceToken.some((deviceToken) => deviceToken === sDeviceToken)
      if (!isLoginVerify && sDeviceToken && !systemData.includes(sLogin)) {
        const sCode = 1234
        await OTPVerificationsModel.create({ sLogin, sCode, sType: isEmail ? 'E' : 'M', sAuth: 'L', sDeviceToken, iUserId: user._id })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ, data: { nOtpSend: true } })
      }
      const sToken = jwt.sign({ _id: (user._id).toHexString(), eType: getUserType(user.eType) }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

      const newToken = {
        sPushToken
      }

      // User can login in LOGIN_HARD_LIMIT time.
      // for e.g. LOGIN_HARD_LIMIT=5 -> User can login only for 5 times, After that we'll remove first login token from db.
      // if (user.aPushToken.length < config.LOGIN_HARD_LIMIT || config.LOGIN_HARD_LIMIT === 0) {
      // } else {
      //   const removedToken = user.aPushToken.splice(0, 1)
      //   await unsubscribeUsers(removedToken)
      //   cachegoose.clearCache(`at:${removedToken}`)
      //   user.aPushToken.push(newToken)
      // }

      const dLoginAt = new Date()

      // If user allow for push notification then we'll store push notification token in db
      if (sPushToken) {
        subscribeUser(sPushToken, ePlatform)
      }
      await queuePush('AuthLogs', {
        iUserId: user._id, ePlatform, eType: 'L', sDeviceToken, sIpAddress: getIp(req)
      })

      await UsersModel.updateOne({ _id: ObjectId(user._id) }, { dLoginAt, $push: { aPushToken: newToken }, $inc: { nLogin: 1 } })
      UsersModel.filterDataForUser(user)

      return res.status(status.OK).set('Authorization', sToken).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: user, Authorization: sToken })
    } catch (error) {
      return catchError('UserAuth.login', error, req, res)
    }
  }

  async sendOTP(req, res) {
    try {
      req.body = pick(req.body, ['sLogin', 'sType', 'sAuth'])
      removenull(req.body)

      const { sLogin, sType, sAuth } = req.body
      let sUsername = ''

      if (sAuth === 'R' || sAuth === 'F') {
        const isEmail = await validateEmail(sLogin)
        const query = isEmail ? { sEmail: sLogin } : { sMobNum: sLogin }
        const user = await UsersModel.findOne(query, null, { readPreference: 'primary' }).lean()

        // Bot user not allowed to send otp.
        if (user && user.eType === 'B') return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked })
        if (user && sAuth === 'R') return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].user) })

        if (!user && sAuth === 'F') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].user_forgot_err })
        sUsername = user ? user.sUsername : ''
      }

      if (sAuth === 'V') {
        if (!req.header('Authorization')) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

        const user = await UsersModel.findByToken(req.header('Authorization'))
        if (!user) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

        // Internal user not able to change mobile no. or email id
        if (user && user.bIsInternalAccount === true) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].cant_change_mobile_email
          })
        }

        const isEmail = await validateEmail(sLogin)
        const query = isEmail ? { sEmail: sLogin } : { sMobNum: sLogin }
        query._id = { $ne: user._id }
        query.eType = { $ne: 'B' }

        const userExist = await UsersModel.findOne(query, null, { readPreference: 'primary' })
        if (userExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].user) })
        sUsername = user.sUsername
      }

      // In production, we'll only allow user to re-send otp after 30 seconds time.
      if (process.env.NODE_ENV === 'production') {
        var d = new Date()
        d.setSeconds(d.getSeconds() - 30)
        const exist = await OTPVerificationsModel.findOne({ ...req.body, dCreatedAt: { $gt: d } }, null, { readPreference: 'primary' }).sort({ dCreatedAt: -1 })

        if (exist) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].err_resend_otp.replace('##', messages[req.userLanguage].nThirty) })
      }

      // check rate limit for otp sending from same ip at multiple time. we'll make sure not too many request from same ip will occurs.
      const [rateLimit, verifyRateLimit] = await Promise.all([
        checkRateLimitOTP(sLogin, sType, sAuth),
        getRateLimitStatus(sLogin, sType, `${sAuth}-V`) // check verify rate limit because if verification limit reached we can not send OTP
      ])
      const message = rateLimit === 'LIMIT_REACHED' ? messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].cotp) : messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].cotpVerification)
      if (rateLimit === 'LIMIT_REACHED' || verifyRateLimit === 'LIMIT_REACHED') return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message })
      let sCode = 1234
      if (['production', 'staging'].includes(process.env.NODE_ENV) && config.OTP_PROVIDER !== 'TEST') sCode = generateOTP(4)

      await OTPVerificationsModel.create({ ...req.body, sCode })

      // Send mail for forgot password otp code
      if (sType === 'E') {
        await queuePush('SendMail', {
          sSlug: 'forgot-password-email',
          replaceData: {
            email: sUsername,
            otp: sCode,
            from: config.SMTP_FROM
          },
          to: sLogin
        })
      }
      if (sType === 'M' && ['production', 'staging'].includes(process.env.NODE_ENV) && config.OTP_PROVIDER !== 'TEST') {
        await queuePush('sendSms', {
          sProvider: config.OTP_PROVIDER,
          oUser: {
            sPhone: sLogin,
            sOTP: sCode
          }
        })
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ })
    } catch (error) {
      return catchError('UserAuth.sendOTP', error, req, res)
    }
  }

  async verifyOTPV2(req, res) {
    try {
      let { sLogin, sType, sAuth, sCode, sDeviceToken, sPushToken } = req.body

      if (sAuth === 'L') req.body = pick(req.body, ['sLogin', 'sType', 'sAuth', 'sCode', 'sDeviceToken'])
      else req.body = pick(req.body, ['sLogin', 'sType', 'sAuth', 'sCode'])

      removenull(req.body)

      sCode = parseInt(sCode)
      if (typeof sCode !== 'number') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].verify_otp_err })

      if (sAuth === 'L' && !sDeviceToken) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].required.replace('##', messages[req.userLanguage].cdeviceToken) })

      // check rate limit for otp verify from same ip at multiple time. we'll make sure not too many request from same ip will occurs.
      if (['production', 'staging'].includes(process.env.NODE_ENV)) {
        const rateLimit = await checkRateLimitOTP(sLogin, sType, `${sAuth}-V`)
        if (rateLimit === 'LIMIT_REACHED') return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message: messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].cotpVerification) })
      }

      const verificationQuery = { sLogin, sAuth, sType, bIsVerify: false }
      const exist = await OTPVerificationsModel.findOne(verificationQuery, null, { readPreference: 'primary' }).sort({ dCreatedAt: -1 }).lean()
      if (!exist || exist.sCode !== sCode) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].verify_otp_err })

      if (sType === 'M' && ['production', 'staging'].includes(process.env.NODE_ENV) && config.OTP_PROVIDER !== 'TEST') {
        const verifyFromProvider = await verifyOTPFromProvider(config.OTP_PROVIDER, { sPhone: sLogin, sOTP: sCode })
        if (!verifyFromProvider || !verifyFromProvider.isSuccess) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })
      }

      if (sAuth === 'V') {
        if (!req.header('Authorization')) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

        const user = await UsersModel.findByToken(req.header('Authorization'))

        if (!user) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

        if (user.bIsInternalAccount === true) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].cant_change_mobile_email
          })
        }

        const isEmail = await validateEmail(sLogin)
        const query = isEmail ? { sEmail: sLogin } : { sMobNum: sLogin }
        query._id = { $ne: user._id }
        query.eType = { $ne: 'B' }

        const userExist = await UsersModel.findOne(query, null, { readPreference: 'primary' }).lean()
        if (userExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].user) })

        if (sType === 'E') {
          await UsersModel.updateOne({ _id: ObjectId(user._id) }, { sEmail: sLogin, bIsEmailVerified: true })
        } else if (sType === 'M') {
          await UsersModel.updateOne({ _id: ObjectId(user._id) }, { sMobNum: sLogin, bIsMobVerified: true })
        }
      }
      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'

      const user = await OTPVerificationsModel.findByIdAndUpdate(exist._id, { bIsVerify: true }, { runValidators: true, readPreference: 'primary' }).lean()

      if (user) await UsersModel.updateOne({ _id: ObjectId(user.iUserId) }, { $addToSet: { aDeviceToken: sDeviceToken } })

      if (sAuth === 'L') {
        const userDetails = await UsersModel.findById(user.iUserId, null, { readPreference: 'primary' }).lean()
        const sToken = jwt.sign({ _id: (userDetails._id).toHexString(), eType: getUserType(userDetails.eType) }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

        const newToken = { sPushToken }

        if (userDetails.nLogin < config.LOGIN_HARD_LIMIT || config.LOGIN_HARD_LIMIT === 0) {
          userDetails.aPushToken.push(newToken)
        } else {
          const removedToken = userDetails.aPushToken.splice(0, 1)
          cachegoose.clearCache(`at:${removedToken}`)
          userDetails.aPushToken.push(newToken)
        }

        await UsersModel.updateOne({ _id: ObjectId(userDetails._id) }, { aPushToken: userDetails.aPushToken, $inc: { nLogin: 1 }, dLoginAt: new Date() })

        await queuePush('AuthLogs', {
          iUserId: userDetails._id, ePlatform, eType: 'L', sDeviceToken, sIpAddress: getIp(req)
        })

        if (sPushToken) { await subscribeUser(sPushToken, ePlatform) }
        UsersModel.filterDataForUser(userDetails)

        return res.status(status.OK).set('Authorization', sToken).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].verification_success, data: userDetails, Authorization: newToken.sToken })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].verification_success })
    } catch (error) {
      return catchError('UserAuth.verifyOTPV2', error, req, res)
    }
  }

  async resetPasswordV3(req, res) {
    try {
      req.body = pick(req.body, ['sLogin', 'sType', 'sAuth', 'sCode', 'sNewPassword'])
      removenull(req.body)

      let { sLogin, sType, sAuth, sCode, sNewPassword } = req.body

      sCode = parseInt(sCode)
      if (typeof sCode !== 'number') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].verify_otp_err })

      const exist = await OTPVerificationsModel.findOne({ sLogin, sType, sAuth, sCode, bIsVerify: true }, null, { readPreference: 'primary' }).sort({ dCreatedAt: -1 })
      if (!exist || exist.sCode !== sCode) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].verify_otp_err })

      if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { sEmail: sLogin } : { sMobNum: sLogin }

      const user = await UsersModel.findOne(query).lean()

      // Bot user and Blocked user can't reset password.
      if (user.eType === 'B') return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked })
      if (!user) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      if (user && user.eStatus !== 'Y') return res.status(status.BadRequest).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked })

      await UsersModel.updateOne({ _id: ObjectId(user._id) }, { aPushToken: [], sPassword: bcrypt.hashSync(sNewPassword, salt) })
      await exist.remove()

      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'
      await queuePush('AuthLogs', {
        iUserId: user._id, ePlatform, eType: 'RP', sIpAddress: getIp(req)
      })

      // send mail for reset password
      if (sType === 'E') {
        await queuePush('SendMail', {
          sSlug: 'reset-password-email',
          replaceData: {
            sName: user.sName,
            from: config.SMTP_FROM
          },
          to: sLogin
        })
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].reset_pass_succ })
    } catch (error) {
      return catchError('UserAuth.resetPasswordV3', error, req, res)
    }
  }

  async changePasswordV3(req, res) {
    try {
      req.body = pick(req.body, ['sOldPassword', 'sNewPassword'])
      removenull(req.body)

      const { sOldPassword, sNewPassword } = req.body
      const user = await UsersModel.findById(req.user._id).lean()

      if (!bcrypt.compareSync(sOldPassword, user.sPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].wrong_old_field })
      if (sOldPassword === sNewPassword) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].old_new_field_same.replace('##', messages[req.userLanguage].sField) })

      if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })

      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'

      await UsersModel.updateOne({ _id: ObjectId(user._id) }, { dPasswordchangeAt: new Date(), sPassword: bcrypt.hashSync(sNewPassword, salt) })

      await queuePush('AuthLogs', {
        iUserId: user._id, ePlatform, eType: 'PC', sIpAddress: getIp(req)
      })

      if (user.sEmail) {
        await queuePush('SendMail', {
          sSlug: 'change-password-email',
          replaceData: {
            sName: user.sName,
            from: config.SMTP_FROM
          },
          to: user.sEmail
        })
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].password) })
    } catch (error) {
      return catchError('UserAuth.changePasswordV3', error, req, res)
    }
  }

  async logout(req, res) {
    try {
      const sToken = req.header('Authorization')
      // await UsersModel.updateOne({ _id: ObjectId(req.user._id) }, { $pull: { aPushToken: { sToken } } })
      // await unsubscribeUsers(sToken)
      // blackListToken(sToken)
      // await redisClient.del(`at:${req.header('Authorization')}`)
      cachegoose.clearCache(`at:${sToken}`)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_logout })
    } catch (error) {
      return catchError('UserAuth.logout', error, req, res)
    }
  }

  async deleteAccount(req, res) {
    try {
      const sToken = req.header('Authorization')
      const { sReason } = req.body
      const user = await UsersModel.findOne({ _id: ObjectId(req.user._id) }).lean()
      if (!user) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })
      if (user.eStatus !== 'Y') { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked }) }
      const [nUserNameCount, nMobCount, nEmailCount] = await Promise.all([
        UsersModel.countDocuments({ sUsername: new RegExp('^.*' + user.sUsername + '.*', 'i') }),
        UsersModel.countDocuments({ sMobNum: new RegExp('^.*' + user.sMobNum + '.*', 'i') }),
        UsersModel.countDocuments({ sEmail: new RegExp('^.*' + user.sEmail + '.*', 'i') })
      ])
      const changeInfo = {
        $set: {
          eStatus: 'D',
          sProPic: '',
          sUsername: `${user.sUsername}_${String.fromCharCode(nUserNameCount + 64)}`,
          sMobNum: `${user.sMobNum}_${String.fromCharCode(nMobCount + 64)}`,
          sEmail: `${user.sEmail}_${String.fromCharCode(nEmailCount + 64)}`,
          aPushToken: [],
          dDeletedAt: Date.now(),
          sReason
        }
      }
      const changePreferences = {
        $set: {
          bEmails: false,
          bSms: false,
          bSound: false,
          bVibration: false,
          bPush: false
        }
      }
      const sBucketName = getBucketName()
      const bucketParams = {
        Bucket: sBucketName,
        Key: user.sProPic
      }
      if (user.sProPic) { await bucket.deleteObject(bucketParams) }
      await Promise.all([
        UsersModel.updateOne({ _id: ObjectId(req.user._id) }, changeInfo),
        PreferencesModel.updateOne({ iUserId: ObjectId(req.user._id) }, changePreferences)
      ])
      blackListToken(sToken)
      UserTeamModel.updateMany({ iUserId: ObjectId(req.user._id) }, { $set: { eStatus: 'N' } }).exec()
      UserLeagueModel.updateMany({ iUserId: ObjectId(req.user._id) }, { $set: { sUserName: config.DELETED_USERNAME, sProPic: '' } }).exec()
      deleteUserKyc(user._id)
      seriesLBUserRankModel.updateMany({ iUserId: ObjectId(req.user._id) }, { $set: { sUsername: config.DELETED_USERNAME, sProPic: '' } }).exec()
      cachegoose.clearCache(`at:${sToken}`)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].caccountdelete) })
    } catch (error) {
      return catchError('UserAuth.deleteAccount', error, req, res)
    }
  }

  async checkExist(req, res) {
    try {
      const { sType, sValue } = req.body
      let exist
      let existVal
      if (sType === 'E') {
        exist = await UsersModel.findOne({ sEmail: sValue }, {}, { readPreference: 'primary' }).lean()
        existVal = 'Email'
      } else if (sType === 'M') {
        exist = await UsersModel.findOne({ sMobNum: sValue }, {}, { readPreference: 'primary' }).lean()
        existVal = 'Mobile number'
      } else if (sType === 'U') {
        exist = await UsersModel.findOne({ sUsername: sValue.toLowerCase() }, {}, { readPreference: 'primary' }).lean()
        existVal = 'Username'
      } else {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].went_wrong_with.replace('##', messages[req.userLanguage].type) })
      }
      if (exist) {
        if (exist.eType === 'B') return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked })
        return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', existVal) })
      } else {
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', existVal) })
      }
    } catch (error) {
      return catchError('UserAuth.checkExist', error, req, res)
    }
  }

  async checkExistence(req, res) {
    try {
      const { sUsername: sUserName, sEmail: sEmailId, sMobNum: sPhone } = req.body

      const exist = await UsersModel.findOne({ $or: [{ sUsername: sUserName.toLowerCase() }, { sEmail: sEmailId.toLowerCase() }, { sMobNum: sPhone }] }, { sUsername: 1, sEmail: 1, sMobNum: 1 }, { readPreference: 'primary' }).lean()
      if (!exist) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      if (exist.sUsername === sUserName.toLowerCase()) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username), data: { bIsUsernameExist: true } })

      if (exist.sEmail === sEmailId) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email), data: { bIsEmailExist: true } })

      if (exist.sMobNum === sPhone) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber), data: { bIsMobExist: true } })
    } catch (error) {
      return catchError('UserAuth.checkExistence', error, req, res)
    }
  }

  async validateToken(req, res) {
    try {
      req.body = pick(req.body, ['nLongitude', 'nLatitude', 'sPushToken', 'sDeviceToken', 'nVersion'])
      removenull(req.body)

      const decoded = jwt.verify(req.body.sPushToken, config.JWT_SECRET)

      const user = await UsersModel.countDocuments({ _id: ObjectId(decoded._id) })

      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'

      await UserSessionModel.create({ ...req.body, ePlatform, iUserId: req.user._id })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].action_success.replace('##', messages[req.userLanguage].cvalidate), data: { bExist: !!user } })
    } catch (error) {
      return catchError('UserAuth.validateToken', error, req, res)
    }
  }

  async socialLogin(req, res) {
    try {
      const { sSocialType, sSocialToken, sPushToken, sDeviceToken } = req.body
      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'

      if (!['G', 'F'].includes(sSocialType)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].went_wrong_with.replace('##', messages[req.userLanguage].csocialType) })

      let userSocialId
      let userSocialEmail
      let userSocialName

      if (sSocialType === 'G') {
        const ticket = await client.verifyIdToken({ idToken: sSocialToken, audience: [config.GOOGLE_CLIENT_ID_W] })
        const payload = ticket.getPayload()

        const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${sSocialToken}`)

        if (payload.sub !== googleRes.data.sub) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_auth_failed })

        if (!googleRes || (googleRes && !googleRes.data.sub)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_auth_failed })

        userSocialId = googleRes.data.sub
        userSocialEmail = googleRes.data.email
        userSocialName = googleRes.data.name
      } else if (sSocialType === 'F') {
        const fbRes = await axios.get(`https://graph.facebook.com/v3.2/me?access_token=${sSocialToken}&debug=all&fields=id,name,first_name,last_name,email&format=json&method=get&pretty=1`)

        if (!fbRes || (fbRes && !fbRes.data.id)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_auth_failed })

        userSocialId = fbRes.data.id
        userSocialEmail = fbRes.data.email
        userSocialName = fbRes.data.name
      }

      const user = await UsersModel.findOne({ $or: [{ 'oSocial.sId': userSocialId, 'oSocial.sType': sSocialType }, { sEmail: userSocialEmail }] }, { _id: 1, oSocial: 1, aPushToken: 1, eType: 1, eStatus: 1 }, { readPreference: 'primary' }).lean()

      if (user && (user.eType === 'B' || user.eStatus !== 'Y')) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].user_blocked })

      if (!user) {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].social_user_not_found, data: { sEmail: userSocialEmail, sName: userSocialName } })
      }

      const sToken = jwt.sign({ _id: (user._id).toHexString(), eType: getUserType(user.eType) }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

      const newToken = {
        sPushToken
      }

      user.oSocial = {
        sType: sSocialType,
        sId: userSocialId,
        sToken: sSocialToken
      }

      // let oldToken = []
      if (user.nLogin < config.LOGIN_HARD_LIMIT || config.LOGIN_HARD_LIMIT === 0) {
        user.aPushToken.push(newToken)
      }
      //  else {
      // oldToken = user.aPushToken.splice(0, 1)
      // cachegoose.clearCache(`at:${oldToken}`)
      //   user.aPushToken.push(newToken)
      // }

      // oldToken.length && oldToken.map(s => redisClient.del(`at:${s.sToken}`))

      await UsersModel.updateOne({ _id: ObjectId(user._id) }, { aPushToken: user.aPushToken, oSocial: user.oSocial, $inc: { nLogin: 1 } })

      await queuePush('AuthLogs', {
        iUserId: user._id, ePlatform, eType: 'L', sDeviceToken, sIpAddress: getIp(req)
      })
      UsersModel.filterDataForUser(user)

      return res.status(status.OK).set('Authorization', sToken).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: user, Authorization: newToken.sToken })
    } catch (error) {
      return catchError('UserAuth.socialLogin', error, req, res)
    }
  }

  // For new OTP login flow
  async sendOTPV2(req, res) {
    try {
      let { sAuth, sType } = req.body
      req.body = pick(req.body, ['sLogin', 'sDeviceToken', 'sAuth'])

      const { sLogin, sDeviceToken } = req.body
      sType = sType || 'M'

      let user
      if (sAuth !== 'V' || sType !== 'E') {
        user = await UsersModel.findOne({ sMobNum: sLogin }, null, { readPreference: 'primary' }).lean()
        // Bot user not allowed to send otp.
        if (user && user.eType === 'B') {
          return res.status(status.NotFound).jsonp({
            status: jsonStatus.NotFound,
            message: messages[req.userLanguage].user_blocked
          })
        }
        if (user && user.eStatus !== 'Y') {
          return res.status(status.NotFound).jsonp({
            status: jsonStatus.NotFound,
            message: messages[req.userLanguage].user_blocked
          })
        }
        sAuth = user ? 'L' : 'R'
      }

      // In production, we'll only allow user to re-send otp after 30 seconds time.
      if (process.env.NODE_ENV === 'production') {
        const d = new Date()
        d.setSeconds(d.getSeconds() - 30)
        const exist = await OTPVerificationsModel.findOne(
          { ...req.body, dCreatedAt: { $gt: d } },
          null,
          { readPreference: 'primary' }
        ).sort({ dCreatedAt: -1 })

        if (exist) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].err_resend_otp.replace(
              '##',
              messages[req.userLanguage].nThirty
            )
          })
        }
      }

      if (sAuth && sAuth === 'V' && sType === 'E') {
        if (!req.header('Authorization')) {
          return res.status(status.Unauthorized).jsonp({
            status: jsonStatus.Unauthorized,
            message: messages[req.userLanguage].err_unauthorized
          })
        }
        user = await UsersModel.findByToken(req.header('Authorization'))

        // Internal user not able to change email id
        if (user && user.bIsInternalAccount === true) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].cant_change_mobile_email
          })
        }

        if (!user) {
          return res.status(status.Unauthorized).jsonp({
            status: jsonStatus.Unauthorized,
            message: messages[req.userLanguage].err_unauthorized
          })
        }

        const isEmail = await validateEmail(sLogin)
        if (!isEmail) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].invalid.replace(
              '##',
              messages[req.userLanguage].email
            )
          })
        }
        const query = { sEmail: sLogin }
        query._id = { $ne: user._id }
        query.eType = { $ne: 'B' }

        const userExist = await UsersModel.findOne(query, null, {
          readPreference: 'primary'
        })
        if (userExist) {
          return res.status(status.ResourceExist).jsonp({
            status: jsonStatus.ResourceExist,
            message: messages[req.userLanguage].already_exist.replace(
              '##',
              messages[req.userLanguage].user
            )
          })
        }
      }

      // check rate limit for otp sending from same ip at multiple time. we'll make sure not too many request from same ip will occurs.
      if (['production', 'staging'].includes(process.env.NODE_ENV)) {
        const [rateLimit, verifyRateLimit] = await Promise.all([
          checkRateLimitOTP(sLogin, sType, sAuth),
          getRateLimitStatus(sLogin, sType, `${sAuth}-V`) // check verify rate limit because if verification limit reached we can not send OTP
        ]) // if (rateLimit === 'LIMIT_REACHED') return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message: messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].cotp) })
        const message = rateLimit === 'LIMIT_REACHED' ? messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].cotp) : messages[req.userLanguage].otp_limit_reached
        if (rateLimit === 'LIMIT_REACHED' || verifyRateLimit === 'LIMIT_REACHED') return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message })
      }

      let sCode = config.DEFAULT_OTP
      if (
        ['production', 'staging'].includes(process.env.NODE_ENV) &&
        config.OTP_PROVIDER !== 'TEST' &&
        ![config.TRIAL_USER_NUMBER, config.SB_OPS_TEAM_USER_NUMBER, config.TEST_USER_NUMBER, config.TEST_USER_NUMBER_2].includes(sLogin)) {
        sCode = generateOTP(config.OTP_LENGTH)
      }

      await OTPVerificationsModel.updateMany(
        { sLogin: sLogin, sType: sType, sAuth: sAuth },
        { $set: { bIsVerify: true } }
      )
      const oOtpVerification = user
        ? { sLogin, sCode, sAuth, sType, sDeviceToken, iUserId: user._id }
        : { sLogin, sCode, sAuth, sType, sDeviceToken }
      await OTPVerificationsModel.create(oOtpVerification)

      if (
        sType === 'M' &&
        ['production', 'staging'].includes(process.env.NODE_ENV) && config.OTP_PROVIDER !== 'TEST'
      ) {
        if (checkCountryCode(sLogin) || !validateIndianNumber(sLogin)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })
        await queuePush('sendSms', {
          sProvider: config.OTP_PROVIDER,
          oUser: {
            sPhone: sLogin,
            sOTP: sCode
          }
        })
      }

      if (sType === 'E' && sAuth === 'V') {
        await queuePush('SendMail', {
          sSlug: 'forgot-password-email',
          replaceData: {
            email: user.sUsername,
            otp: sCode,
            from: config.SMTP_FROM
          },
          to: sLogin
        })
      }
      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].OTP_sent_succ
      })
    } catch (error) {
      return catchError('UserAuth.sendOTPV2', error, req, res)
    }
  }

  // for new login flow
  async verifyOTPV3(req, res) {
    try {
      let { sLogin, sCode, sDeviceId, sPushToken, sAuth, sType } = req.body
      removenull(req.body)

      sType = sType || 'M'

      sCode = parseInt(sCode)
      if (typeof sCode !== 'number') {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].verify_otp_err
        })
      }

      let userDetails
      if (sAuth !== 'V' || sType !== 'E') {
        userDetails = await UsersModel.findOne({ sMobNum: sLogin }, null, {
          readPreference: 'primary'
        }).lean()
        sAuth = userDetails ? 'L' : 'R'
      }

      let verificationQuery = { sLogin, sCode, sAuth, sType, bIsVerify: false }
      if (['production', 'staging'].includes(process.env.NODE_ENV)) {
        // check rate limit for otp verify from same ip at multiple time. we'll make sure not too many request from same ip will occurs.
        const [rateLimit, expiredOTP] = await Promise.all([
          checkRateLimitOTP(sLogin, sType, `${sAuth}-V`),
          getOTPExpiryStatus(sLogin, sType, sAuth) // check verify rate limit because if verification limit reached we can not send OTP
        ]) // if (rateLimit === 'LIMIT_REACHED') return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message: messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].cotpVerification) })

        const message = rateLimit === 'LIMIT_REACHED' ? messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].cotp) : messages[req.userLanguage].err_otp_expired

        if (rateLimit === 'LIMIT_REACHED' || expiredOTP === 'EXPIRED') {
          return res.status(status.TooManyRequest).jsonp({
            status: jsonStatus.TooManyRequest,
            message
          })
        }

        if (
          sType === 'M' &&
          config.OTP_PROVIDER !== 'TEST' &&
          ![config.TRIAL_USER_NUMBER, config.SB_OPS_TEAM_USER_NUMBER, config.TEST_USER_NUMBER, config.TEST_USER_NUMBER_2].includes(sLogin)) {
          // we will verify otp from thirf party provider
          if (checkCountryCode(sLogin) || !validateIndianNumber(sLogin)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })
          const verifyFromProvider = await verifyOTPFromProvider(
            config.OTP_PROVIDER,
            { sPhone: sLogin, sOTP: sCode }
          )
          if (!verifyFromProvider || !verifyFromProvider.isSuccess) {
            return res.status(status.BadRequest).jsonp({
              status: jsonStatus.BadRequest,
              message: messages[req.userLanguage].verify_otp_err
            })
          }
        }

        // otp lives for only 10 minutes
        const d = new Date()
        d.setMinutes(d.getMinutes() - 10)
        verificationQuery = { ...verificationQuery, dCreatedAt: { $gt: d } }
      }

      const exist = await OTPVerificationsModel.findOne(
        verificationQuery,
        null,
        { readPreference: 'primary' }
      )
        .sort({ dCreatedAt: -1 })
        .lean()
      if (!exist || exist.sCode !== sCode) {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].verify_otp_err
        })
      }

      if (sAuth === 'V' && sType === 'E') {
        if (!req.header('Authorization')) {
          return res.status(status.Unauthorized).jsonp({
            status: jsonStatus.Unauthorized,
            message: messages[req.userLanguage].err_unauthorized
          })
        }

        const user = await UsersModel.findByToken(req.header('Authorization'))

        if (!user) {
          return res.status(status.Unauthorized).jsonp({
            status: jsonStatus.Unauthorized,
            message: messages[req.userLanguage].err_unauthorized
          })
        }

        if (user.bIsInternalAccount === true) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].cant_change_mobile_email
          })
        }

        const isEmail = await validateEmail(sLogin)
        if (!isEmail) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].invalid.replace(
              '##',
              messages[req.userLanguage].email
            )
          })
        }
        const query = { sEmail: sLogin }
        query._id = { $ne: user._id }
        query.eType = { $ne: 'B' }

        const userExist = await UsersModel.findOne(query, null, {
          readPreference: 'primary'
        }).lean()
        if (userExist) {
          return res.status(status.ResourceExist).jsonp({
            status: jsonStatus.ResourceExist,
            message: messages[req.userLanguage].already_exist.replace(
              '##',
              messages[req.userLanguage].user
            )
          })
        }

        await UsersModel.updateOne(
          { _id: ObjectId(user._id) },
          { sEmail: sLogin, bIsEmailVerified: true, $inc: { nLogin: 1 } }
        )
      }

      const user = await OTPVerificationsModel.findByIdAndUpdate(
        exist._id,
        { bIsVerify: true },
        { runValidators: true, readPreference: 'primary' }
      ).lean()
      if (user) {
        await UsersModel.updateOne(
          { _id: ObjectId(user.iUserId) },
          { $addToSet: { aDeviceToken: sDeviceId }, $inc: { nLogin: 1 } }
        )
      }

      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform'))
        ? req.header('Platform')
        : 'O'

      if (sAuth === 'L') {
        const sToken = jwt.sign(
          { _id: userDetails._id.toHexString(), eType: user.eType },
          config.JWT_SECRET,
          { expiresIn: config.JWT_VALIDITY }
        )
        const newToken = {
          sPushToken
        }

        if (
          userDetails.nLogin < config.LOGIN_HARD_LIMIT ||
          config.LOGIN_HARD_LIMIT === 0
        ) {
          userDetails.aPushToken.push(newToken)
        } else {
          const removedToken = userDetails.aPushToken.splice(0, 1)
          cachegoose.clearCache(`at:${removedToken}`)
          userDetails.aPushToken.push(newToken)
        }

        await UsersModel.updateOne(
          { _id: ObjectId(userDetails._id) },
          { aPushToken: userDetails.aPushToken, dLoginAt: new Date(), $inc: { nLogin: 1 } }
        )

        await queuePush('AuthLogs', {
          iUserId: userDetails._id,
          ePlatform,
          eType: 'L',
          sDeviceToken: sDeviceId,
          sIpAddress: getIp(req)
        })

        if (sPushToken) {
          await subscribeUser(sPushToken, ePlatform)
        }
        UsersModel.filterData(userDetails)

        return res
          .status(status.OK)
          .set('Authorization', sToken)
          .jsonp({
            status: jsonStatus.OK,
            message: messages[req.userLanguage].verification_success,
            data: userDetails,
            Authorization: newToken.sToken
          })
      }

      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].verification_success
      })
    } catch (error) {
      return catchError('UserAuth.verifyOTPV3', error, req, res)
    }
  }

  // register by new otp flow
  async registerV5(req, res) {
    try {
      const {
        sLogin,
        sName,
        sUsername,
        sEmail,
        sSocialType,
        sPayLoad,
        sSignature,
        sSignatureAlgorithm
      } = req.body
      req.body = pick(req.body, [
        'sName',
        'sEmail',
        'sReferCode',
        'sDeviceId',
        'sPushToken',
        'sUsername',
        'sSocialType',
        'sSocialToken',
        'sPayLoad',
        'sSignature',
        'sSignatureAlgorithm'
      ])
      removenull(req.body)

      let trueRes
      const oSocial = {}

      const result = await checkUserExist({ sUsername, sMobNum: sLogin, sEmail })
      if (!result.isSuccess) return res.status(result.status).jsonp({ status: result.status, message: result.message })
      // common function for checkUserExist

      if (sSocialType) {
        // Social signup with truecaller

        if (sSocialType === 'T') {
          try {
            if (!(sPayLoad || sSignature)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_auth_failed })
            const profile = {
              payload: sPayLoad,
              signature: sSignature,
              signatureAlgorithm: sSignatureAlgorithm || 'SHA512withRSA'
            }
            const trueRes = await getVerifyProfile(profile)

            if (!trueRes) {
              return res.status(status.BadRequest).jsonp({
                status: jsonStatus.BadRequest,
                message: messages[req.userLanguage].social_auth_failed
              })
            }
          } catch (error) {
            handleCatchError(error)
            return res.status(status.BadRequest).jsonp({
              status: jsonStatus.BadRequest,
              message: messages[req.userLanguage].social_auth_failed
            })
          }
        }
      }
      if (trueRes) {
        const socialUser = await UsersModel.findOne(
          { sMobNum: sLogin },
          { sMobNum: 1 }
        ).lean()
        if (socialUser) {
          return res.status(status.ResourceExist).jsonp({
            status: jsonStatus.ResourceExist,
            message: messages[req.userLanguage].already_exist.replace(
              '##',
              messages[req.userLanguage].user
            )
          })
        }
        req.body.oSocial = oSocial
        req.body.bIsEmailVerified = true
        oSocial.sType = 'T'

        if (!sName) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].invalid.replace(
              '##',
              messages[req.userLanguage].cName
            )
          })
        }
        if (sLogin.length !== 10) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].invalid.replace(
              '##',
              messages[req.userLanguage].mobileNumber
            )
          })
        }
      }

      const isOTPExist = await OTPVerificationsModel.findOne(
        { sLogin, sType: 'M', sAuth: 'R', bIsVerify: true },
        null,
        { readPreference: 'primary' }
      ).sort({ dCreatedAt: -1 })
      if (!isOTPExist && !sSocialType) {
        return res
          .status(status.BadRequest)
          .jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].went_wrong_with.replace(
              '##',
              messages[req.userLanguage].cotpVerification
            )
          })
      }

      if (config.OTP_PROVIDER !== 'TEST' && (checkCountryCode(sLogin) || !validateIndianNumber(sLogin))) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      if (!sUsername) {
        const newUsername = await getUniqueUserName(sName)
        if (newUsername instanceof Error) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].invalid.replace(
              '##',
              messages[req.userLanguage].username
            )
          })
        }
        req.body.sUsername = newUsername
      }

      // If sReferCode is invalid

      req.body.bIsMobVerified = true
      req.body.ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'
      const oProcessBonusResult = await processRegisterAndReferBonus(req.body, req.userLanguage, getIp(req))
      if (oProcessBonusResult.isSuccess === false) return res.status(oProcessBonusResult.status).jsonp({ status: oProcessBonusResult.status, message: oProcessBonusResult.message })
      return res.status(status.OK).set('Authorization', oProcessBonusResult.data.Authorization).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].reg_success, data: oProcessBonusResult.data.user, Authorization: oProcessBonusResult.data.Authorization })
    } catch (error) {
      return catchError('UserAuth.registerV5', error, req, res)
    }
  }

  // for new login flow
  async socialLoginV3(req, res) {
    try {
      const { sSocialType, sSocialToken, sPushToken, sDeviceId } = req.body
      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'

      if (!['T'].includes(sSocialType)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].went_wrong_with.replace('##', messages[req.userLanguage].csocialType) })

      let userSocialId
      let userSocialName

      if (sSocialType === 'T') {
        try {
          const trueRes = await axios.get('https://profile4-noneu.truecaller.com/v1/default', { headers: { Authorization: `Bearer ${sSocialToken}` } })
          if (!trueRes || (trueRes && !trueRes.data.id)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_auth_failed })

          const { first, last } = trueRes.data.name
          userSocialId = trueRes.data.id
          userSocialName = first && last ? `${first} ${last}` : ''
        } catch (error) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].social_auth_failed })
        }
      }

      const user = await UsersModel.findOne({ 'oSocial.sId': userSocialId, 'oSocial.sType': 'T' }, null, { readPreference: 'primary' }).lean()

      if (user && (user.eType === 'B' || user.eStatus !== 'Y')) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].user_blocked })

      if (!user) {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].social_user_not_found, data: { sName: userSocialName } })
      }
      const sToken = jwt.sign({ _id: (user._id).toHexString(), eType: getUserType(user.eType) }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

      const newToken = {
        sPushToken
      }

      user.oSocial = {
        sType: sSocialType,
        sId: userSocialId,
        sToken: sSocialToken
      }

      // let oldToken = []
      if (user.nLogin < config.LOGIN_HARD_LIMIT || config.LOGIN_HARD_LIMIT === 0) {
        user.aPushToken.push(newToken)
      }
      // else {
      //   // oldToken = user.aPushToken.splice(0, 1)
      //   // cachegoose.clearCache(`at:${oldToken}`)
      //   user.aPushToken.push(newToken)
      // }

      // oldToken.length && oldToken.map(s => redisClient.del(`at:${s.sToken}`))

      await UsersModel.updateOne({ _id: ObjectId(user._id) }, { aPushToken: user.aPushToken, oSocial: user.oSocial, $inc: { nLogin: 1 } })

      await queuePush('AuthLogs', {
        iUserId: user._id, ePlatform, eType: 'L', sDeviceToken: sDeviceId, sIpAddress: getIp(req)
      })
      UsersModel.filterDataForUser(user)

      return res.status(status.OK).set('Authorization', sToken).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: user, Authorization: newToken.sToken })
    } catch (error) {
      return catchError('UserAuth.socialLoginV3', error, req, res)
    }
  }

  async getUserToken(type = '') {
    let response
    let sLogin
    let sPassword
    let sDeviceToken
    if (type && type === 'INTERNAL') {
      sLogin = testCasesDefault.internalUser.sLogin
      sPassword = testCasesDefault.internalUser.sPassword
      sDeviceToken = testCasesDefault.internalUser.sDeviceToken
    } else {
      sLogin = testCasesDefault.user.sLogin
      sPassword = testCasesDefault.user.sPassword
      sDeviceToken = testCasesDefault.user.sDeviceToken
    }
    try {
      const result = await axios.post(`${config.DEPLOY_HOST_URL}/api/user/auth/login/v2`, { sLogin, sPassword, sDeviceToken })
      response = result.data
    } catch (error) {
    }
    return response
  }

  async subscribePushToken(req, res) {
    try {
      const { sPushToken } = req.body
      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'

      const data = await UsersModel.findOne({ _id: ObjectId(req.user._id) })

      if (data && data.aPushToken.length) {
        await subscribeUser(sPushToken, ePlatform)
        for (const d of data.aPushToken) {
          if (!d.sPushToken) {
            d.sPushToken = sPushToken
          }
        }
        await data.save()
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].subscribePushToken_success })
    } catch (error) {
      return catchError('UserAuth.subscribePushToken', error, req, res)
    }
  }
}
const genReferCode = () => new Promise((resolve, reject) => {
  const sReferCode = randomStr(6, 'referral')

  UsersModel.findOne({ sReferCode }).then(codeExist => {
    if (!codeExist && sReferCode.toString().length === 6) {
      resolve(sReferCode)
    } else {
      return genReferCode().then(resolve).catch(reject)
    }
  }).catch(error => {
    reject(error)
  })
})

// To get new generated username
const getUniqueUserName = async (sName) => {
  try {
    let sUsername = sName.replace(/\s/g, '').toLowerCase()
    if (sUsername.length > 15) sUsername = sUsername.slice(0, -(sUsername.length - 15))
    if (sUsername.length < 5) {
      const randomNumber = generateOTP(5 - sUsername.length)
      sUsername = sUsername.concat(randomNumber)
    }
    const verified = await checkUserName(sUsername)
    if (verified instanceof Error) return new Error('Username verification failed!')
    return verified
  } catch (error) {
    return new Error(error)
  }
}

// To verify if username already exist then increment counter
const checkUserName = async (sUsername) => {
  try {
    const exists = await UsersModel.findOne({ sUsername }).select({ sUsername: 1 }).lean()
    if (exists) {
      let nDigit = exists.sUsername.match(/\d+/g) ? exists.sUsername.match(/\d+/g)[0] : 0
      nDigit = Number(nDigit) || 0
      sUsername = exists.sUsername.match(/[a-zA-Z]+/g)[0].concat(nDigit + 1)
      return await checkUserName(sUsername)
    } else {
      return sUsername
    }
  } catch (error) {
    return new Error(error)
  }
}

async function getVerifyProfile(profile) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        verifier.verifyProfile(profile, function (err, res) {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      } catch (error) {
        reject(error)
      }
    })()
  })
}

module.exports = new UserAuth()
