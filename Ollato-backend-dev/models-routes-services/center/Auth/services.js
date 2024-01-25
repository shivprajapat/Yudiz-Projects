const { status, jsonStatus, messages } = require('../../../helper/api.responses')
const { catchError, pick, removenull, validateEmail, validateMobile, validatePassword } = require('../../../helper/utilities.services')
const CenterModel = require('./center.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../../config/config-file')
const {
  SendOtpMsg,
  generateOTP
} = require('../../../helper/sms.service')
const {
  sendMail
} = require('../../../helper/email.service')
const CenterResetModel = require('./center.reset.model')
const { Op } = require('sequelize')

const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)
class CenterServices {
  async loginWithPassword(req, res) {
    try {
      req.body = pick(req.body, ['login', 'password'])
      removenull(req.body)
      let sLogin = req.body.login
      const sPassword = req.body.password

      sLogin = sLogin.toLowerCase().trim()

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { email: sLogin, is_active: 'y', deleted_at: null } : { mobile: sLogin, is_active: 'y', deleted_at: null }

      const centerUser = await CenterModel.findOne({ where: { [Op.and]: [{ is_active: 'y' }, { deleted_at: null }, query] } })
      if (!centerUser) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].is_not_active_deleted.replace('##', messages[req.userLanguage].center) })

      const center = await CenterModel.findOne({ where: query })
      if (!center) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (!bcrypt.compareSync(sPassword, center.password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const newToken = {
        token: jwt.sign({ _id: center.email }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
        // sPushToken
      }

      await CenterModel.update({ token: newToken.token }, { where: { id: center.id } })
      const createdCenter = await CenterModel.findOne({ raw: true, where: query, attributes: { exclude: ['password', 'created_by', 'updated_by', 'created_at', 'updatedAt', 'OTP', 'is_verify', 'verified_at', 'is_active'] } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: createdCenter, Authorization: newToken.token })
    } catch (error) {
      catchError('center.loginWithPassword', error, req, res)
    }
  }

  async loginWithOTP(req, res) {
    try {
      req.body = pick(req.body, ['login'])
      removenull(req.body)

      let sLogin = req.body.login
      sLogin = sLogin.toLowerCase().trim()

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { email: sLogin, is_active: 'y', deleted_at: null } : { mobile: sLogin, is_active: 'y', deleted_at: null }

      const center = await CenterModel.findOne({ raw: true, where: query })
      if (!center) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })
      const OTP = generateOTP(4)
      await CenterModel.update({ OTP }, { where: query })
      if (isEmail) {
        const resp = await sendMail(OTP, center.email)
        if (resp === undefined) throw Error()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ })
      } else {
        const data = await SendOtpMsg({ sPhone: sLogin, sOTP: OTP })
        if (data.isSuccess) {
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
        } else {
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
        }
      }
    } catch (error) {
      return await catchError('CenterService.loginwithOTP', error, req, res)
    }
  }

  async loginWithOtpVerify(req, res) {
    try {
      req.body = pick(req.body, ['login', 'otp'])
      removenull(req.body)
      let sLogin = req.body.login
      const sOtp = req.body.otp

      sLogin = sLogin.toLowerCase().trim()

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { email: sLogin, is_active: 'y', deleted_at: null } : { mobile: sLogin, is_active: 'y', deleted_at: null }

      const student = await CenterModel.findOne({ raw: true, where: query })
      if (!student) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (sOtp !== student.OTP) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const token = jwt.sign({ _id: student.id }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

      await CenterModel.update({ token: token, OTP: null }, { where: { id: student.id } })
      const centerUser = await CenterModel.findOne({ raw: true, where: query })
      return res.status(status.OK).set('Authorization', token).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: centerUser, Authorization: token })
    } catch (error) {
      return await catchError('CenterService.login', error, req, res)
    }
  }

  async forgotPassword(req, res) {
    try {
      req.body = pick(req.body, ['emailMobile'])
      removenull(req.body)
      const { emailMobile } = req.body

      // validation for email and mobile number
      const isEmail = await validateEmail(emailMobile)
      const isMobile = validateMobile(emailMobile)

      if (!isEmail) {
        if (!isMobile) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
        }
      }
      if (emailMobile !== '' && !isMobile && !isEmail) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
      }

      const query = isEmail ? { email: emailMobile, is_active: 'y', deleted_at: null } : { mobile: emailMobile, is_active: 'y', deleted_at: null }
      const userExist = await CenterModel.findOne({ raw: true, where: query })
      // user_not_exist
      if (!userExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      // Blocked user can't reset password.
      if (userExist && userExist.is_active === 'n') return res.status(status.Forbidden).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      const otp = generateOTP(4)
      const token = jwt.sign({ _id: emailMobile }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
      await CenterResetModel.create({ raw: true, email_mobile: emailMobile, OTP: otp, token })
      if (isMobile) {
        const data = await SendOtpMsg({ sPhone: emailMobile, sOTP: otp })
        if (data.isSuccess) {
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message, Authorization: token })
        } else {
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
        }
      } else {
        // eslint-disable-next-line no-undef
        const resp = await sendMail(otp, userExist.email)
        if (resp === undefined) throw Error()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ, Authorization: token })
      }
    } catch (error) {
      return await catchError('UserAuth.forgotPasswordV1', error, req, res)
    }
  }

  async verifyOtpForForgotPassword(req, res) {
    try {
      req.body = pick(req.body, ['otp', 'token'])
      removenull(req.body)
      const { otp, token } = req.body

      const otpLength = otp.toString().length
      if (otpLength !== 4) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].verify_otp_err })
      }
      const decode = jwt.verify(token, config.JWT_SECRET)
      const otpUserExist = await CenterResetModel.findOne({ raw: true, where: { otp: otp } })
      if (!otpUserExist) return res.status(status.BadRequest).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].verify_otp_err })

      // Verify the token using jwt.verify method
      if (decode._id === otpUserExist.email_mobile) {
        await CenterResetModel.destroy({ raw: true, where: { email_mobile: otpUserExist.email_mobile } })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].verification_success })
      } else {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].token_expire })
      }
    } catch (error) {
      return await catchError('UserAuth.otp-verification', error, req, res)
    }
  }

  async resetPassword(req, res) {
    try {
      req.body = pick(req.body, ['password', 'confirm_password', 'token'])
      removenull(req.body)
      const sNewPassword = req.body.password
      const sConfirmPassword = req.body.confirm_password
      const sToken = req.body.token

      if (sNewPassword !== sConfirmPassword) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].new_confirm_password_not_same })

      let decodedToken
      try {
        decodedToken = jwt.decode(sToken, config.JWT_SECRET)
      } catch (err) {
        return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })
      }

      const student = await CenterModel.findOne({ raw: true, where: { email: decodedToken._id } })
      if (!student) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })

      await CenterModel.update({ password: bcrypt.hashSync(sNewPassword, salt) }, { where: { id: student.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].password) })
    } catch (error) {
      return await catchError('CenterService.changePasswordV3', error, req, res)
    }
  }

  async changePassword(req, res) {
    try {
      req.body = pick(req.body, ['currentPassword', 'confirmPassword', 'password'])
      removenull(req.body)
      const { currentPassword, confirmPassword, password } = req.body
      if (!validatePassword(password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })
      if (confirmPassword !== password) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const user = await CenterModel.findOne({ raw: true, where: { id: req.user.id } })
      if (!user) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      if (!bcrypt.compareSync(currentPassword, user.password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
      await CenterModel.update({ password: bcrypt.hashSync(password, salt) }, { where: { id: req.user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].change_password.replace('##', messages[req.userLanguage].ssPassword) })
    } catch (error) {
      return await catchError('UserAuth.changePassword', error, req, res)
    }
  }

  async logout(req, res) {
    try {
      await CenterModel.update({ token: null }, { where: { id: req.user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_logout })
    } catch (error) {
      return await catchError('CenterService.logout', error, req, res)
    }
  }
}

module.exports = new CenterServices()
