const jwt = require('jsonwebtoken')
const UsersModel = require('../model')
const OTPVerificationsModel = require('../otpverifications.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const {
  removenull, catchError, pick, validateEmail, getIp, validateIndianNumber,
  checkCountryCode, getUserType
} = require('../../../helper/utilities.services')
const { checkRateLimitOTP, queuePush, getOTPExpiryStatus } = require('../../../helper/redis')
const config = require('../../../config/config')
const { subscribeUser } = require('../../../helper/firebase.services')
const cachegoose = require('recachegoose')
const { verifyOTPFromProvider } = require('../../../helper/sms.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { pushOtpToQueue, getOtp } = require('./common')

class OtpVerifications {
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
      // common function
      const result = await getOtp(req.body) // isolating repetative code
      if (!result.isSuccess) return res.status(result.status).jsonp({ status: result.status, message: result.message })
      const { sCode } = result.data
      await OTPVerificationsModel.create({ ...req.body, sCode })

      // Send mail for forgot password otp code
      await pushOtpToQueue({ sLogin, sCode, sUsername, sType }) // common function

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

        const newToken = {
          sPushToken
        }

        if (userDetails.nLogin < config.LOGIN_HARD_LIMIT || config.LOGIN_HARD_LIMIT === 0) {
          userDetails.aPushToken.push(newToken)
        } else {
          const removedToken = userDetails.aPushToken.splice(0, 1)
          cachegoose.clearCache(`at:${removedToken}`)
          userDetails.aPushToken.push(newToken)
        }

        await UsersModel.updateOne({ _id: ObjectId(userDetails._id) }, { aPushToken: userDetails.aPushToken, dLoginAt: new Date(), $inc: { nLogin: 1 } })

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

      const result = await getOtp(req.body) // isolating repetative code
      if (!result.isSuccess) return res.status(result.status).jsonp({ status: result.status, message: result.message })
      const { sCode } = result.d

      await OTPVerificationsModel.updateMany(
        { sLogin: sLogin, sType: sType, sAuth: sAuth },
        { $set: { bIsVerify: true } })
      const oOtpVerification = user ? { sLogin, sCode, sAuth, sType, sDeviceToken, iUserId: user._id } : { sLogin, sCode, sAuth, sType, sDeviceToken }
      await OTPVerificationsModel.create(oOtpVerification)
      await pushOtpToQueue({ sUsername: user.sUsername, sLogin, sCode, sType })

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
          { sEmail: sLogin, bIsEmailVerified: true }
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
          { $addToSet: { aDeviceToken: sDeviceId } }
        )
      }

      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform'))
        ? req.header('Platform')
        : 'O'
      const sToken = jwt.sign({ _id: userDetails._id.toHexString(), eType: user.eType }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
      if (sAuth === 'L') {
        const newToken = { sPushToken }

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
}

module.exports = new OtpVerifications()
