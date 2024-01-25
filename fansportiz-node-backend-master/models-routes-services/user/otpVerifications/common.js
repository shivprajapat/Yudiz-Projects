const config = require('../../../config/config')
const { handleCatchError } = require('../../../helper/utilities.services')
const { generateOTP } = require('../../../helper/sms.services')
const OTPVerificationsModel = require('../otpverifications.model')
const { messages, jsonStatus } = require('../../../helper/api.responses')
const { checkRateLimitOTP, getRateLimitStatus, queuePush } = require('../../../helper/redis')

module.exports = {
  pushOtpToQueue: async function (payload) {
    const { sUsername, sCode, sLogin, sType } = payload
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
  },
  /**
  *
  */
  getOtp: async function (body, userLanguage = 'English') {
    try {
      const { sLogin, sType, sAuth } = body
      if (process.env.NODE_ENV === 'production') {
        var d = new Date()
        d.setSeconds(d.getSeconds() - 30)
        const exist = await OTPVerificationsModel.findOne({ ...body, dCreatedAt: { $gt: d } }, null, { readPreference: 'primary' }).sort({ dCreatedAt: -1 })
        if (exist) return { isSuccess: false, status: jsonStatus.BadRequest, message: messages[userLanguage].err_resend_otp.replace('##', messages[userLanguage].nThirty), data: {} }
      }
      // check rate limit for otp sending from same ip at multiple time. we'll make sure not too many request from same ip will occurs.
      const [rateLimit, verifyRateLimit] = await Promise.all([
        checkRateLimitOTP(sLogin, sType, sAuth),
        getRateLimitStatus(sLogin, sType, `${sAuth}-V`) // check verify rate limit because if verification limit reached we can not send OTP
      ])
      const message = rateLimit === 'LIMIT_REACHED' ? messages[userLanguage].limit_reached.replace('##', messages[userLanguage].cotp) : messages[userLanguage].limit_reached.replace('##', messages[userLanguage].cotpVerification)
      if (rateLimit === 'LIMIT_REACHED' || verifyRateLimit === 'LIMIT_REACHED') return { isSuccess: false, status: jsonStatus.TooManyRequest, message, data: {} }
      let sCode = 1234
      if (['production', 'staging'].includes(process.env.NODE_ENV) && config.OTP_PROVIDER !== 'TEST') sCode = generateOTP(4)
      return { isSuccess: true, status: jsonStatus.OK, message: messages[userLanguage].not_exist.replace('##', messages[userLanguage].match), data: { sCode } }
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false, status: jsonStatus.InternalServerError, message: messages[userLanguage].err_generate_otp, data: {} }
    }
  }
}
