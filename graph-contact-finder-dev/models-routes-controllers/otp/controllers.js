// @ts-check
const OTPModel = require('./model')
const { catchError, responseMessage, generateOTP } = require('../../helpers/utilityServices')
const config = require('../../config')

class OTPController {
  async send (req, res) {
    try {
      const { sLogin, sAuth, sType } = req?.body || {}
      const sCode = config?.NODE_ENV !== 'production' ? '1111' : generateOTP(6)
      const insertBody = {
        sCode,
        sAuth,
        sLogin,
        sType
      }
      await OTPModel.create(insertBody)
      return responseMessage(req, res, 'Success', 'SendSuccessfully', 'OTP')
    } catch (error) {
      return catchError(req, res)
    }
  }

  async verify (req, res) {
    try {
      const { sCode, sLogin, sType, sAuth } = req?.body || {}
      const isOTPExists = await OTPModel.findOne({ sCode, sLogin, sType, sAuth, bIsVerify: false })
      if (!isOTPExists) return responseMessage(req, res, 'BadRequest', 'VerifyOTPError')
      await OTPModel.updateOne({ _id: isOTPExists?._id }, { bIsVerify: true })
      return responseMessage(req, res, 'Success', 'VerificationSuccess', '', { iOTPId: isOTPExists?._id?.toString() })
    } catch (error) {
      return catchError(req, res)
    }
  }
}

module.exports = new OTPController()
