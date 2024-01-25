/* eslint-disable camelcase */
const jwt = require('jsonwebtoken')
const CounsellorModel = require('./counsellor.model')
const sessionModel = require('./sessions/session.model')
const CounsellorResetModel = require('./counsellor_reset.model')
const CounsellorDetailModel = require('./counsellor_details.model')
const CounsellorRegisterVerifyModel = require('../student/auth/register_verify.model')
const UniversityModel = require('../admin/university/university.model')
const QualificationsModel = require('../admin/qualification/qualification.model')
const CountryModel = require('../common/country/country.model')
const CityModel = require('../admin/city/city.model')
const StateModel = require('../admin/state/state.model')
const { Op, Sequelize } = require('sequelize')
const axios = require('axios')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { removenull, catchError, validateMobile, randomStr, pick, validateEmail, validatePassword, getIp, getIncrementNumber } = require('../../helper/utilities.services')
const config = require('../../config/config-file')
const bcrypt = require('bcryptjs')
const { testCasesDefault } = require('../../config/testCases.js')
const { queuePush } = require('../../helper/redis')
const { sendMail } = require('../../helper/email.service')
const { sequelize } = require('../../database/sequelize')
const {
  SendOtpMsg,
  generateOTP
} = require('../../helper/sms.service')

const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)

class CounsellorService {
  async dashboard(req, res) {
    try {
      const getAllData = await sessionModel.findAll({
        raw: true,
        where: { counsellor_id: req.user.id },
        attributes: [
          [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN status = "panding" THEN 1 ELSE 0 END')), 'pandingSession'],
          [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN status = "accepted" THEN 1 ELSE 0 END')), 'acceptedSession'],
          [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN status = "reschedule" THEN 1 ELSE 0 END')), 'rescheduleSession'],
          [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN status = "cancel" THEN 1 ELSE 0 END')), 'cancelSession']
        ]
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: getAllData })
    } catch (error) {
      return await catchError('counsellorService.dashboard', error, req, res)
    }
  }

  async register(req, res) {
    try {
      // counsellor model
      // eslint-disable-next-line camelcase
      const { center_id, first_name, middle_name, last_name, mobile, career_counsellor, psychologist, overseas_counsellor, OTP, dob, gender, father_name, mother_name, password, professional_expertness, country_id, state_id, city_id, pin_code, high_qualification_id, high_university_id, last_qualification_id, last_university_id, certificate_qualification_id, certificate_university_id, experience_year, experience_month, total_experience, pan_number, gst_no, adhar_card_number, subject_expert, resume, pancard, adharcard_front, adharcard_back, signature, profile_picture } = req.body
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)

      let email = req.body.email
      email = email ? email.toLowerCase().trim() : null
      if (!validateMobile(mobile)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      const isEmail = await validateEmail(email)
      if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })

      if (!validatePassword(password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].invalid_pass) })

      const userExist = await CounsellorModel.findOne({ where: { [Op.or]: [{ email: email }, { mobile: mobile }, { user_name: sUsername }], deleted_at: null } }, null, { readPreference: 'primary' })

      if (userExist && userExist.user_name === sUsername) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username) })
      if (userExist && userExist.mobile === mobile) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      if (userExist && userExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })

      let transaction
      try {
        transaction = await sequelize.transaction()

        const dVerifiedAt = new Date()
        const sPassword = bcrypt.hashSync(password, salt)
        const sCustomId = randomStr(8, 'string')

        /** check last ollato number */
        const lastRecord = await CounsellorModel.findOne({
          raw: true,
          attributes: ['id', 'ollato_code'],
          order: [
            ['id', 'DESC']
          ]
        })
        let id = ''
        if (lastRecord) {
          id = lastRecord.ollato_code
        }
        const getOllatoNumber = await getIncrementNumber('counsellor', id)
        console.log(getOllatoNumber)

        const counsellor = await CounsellorModel.create({ custom_id: sCustomId, center_id, slug: sUsername, user_name: sUsername, password: sPassword, ollato_code: getOllatoNumber, first_name, middle_name, last_name, email, mobile, career_counsellor, psychologist, overseas_counsellor, subject_expert, OTP, dob, gender, mother_name, father_name, verified_at: dVerifiedAt, status: 'pending' }, { transaction })
        counsellor.setDataValue('password', null)

        const sCustomIdCounsellorDetail = randomStr(8, 'string')

        await CounsellorDetailModel.create({ custom_id: sCustomIdCounsellorDetail, counsellor_id: counsellor.getDataValue('id'), resume, professional_expertness, country_id, state_id, city_id, pin_code, high_qualification_id, high_university_id, last_qualification_id, last_university_id, certificate_qualification_id, certificate_university_id, experience_year, experience_month, total_experience, pan_number, pan_file: pancard, adhar_card_number, adhar_card_number_front: adharcard_front, adhar_card_number_back: adharcard_back, signature, profile_picture, gst_no }, { transaction })

        await transaction.commit()

        const token = jwt.sign({ id: (counsellor.getDataValue('id')) }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
        await CounsellorModel.update({ token: token }, { where: { id: counsellor.getDataValue('id') } })

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].admin_approval })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async loginWithPassword(req, res) {
    try {
      removenull(req.body)
      let sLogin = req.body.login
      const sPassword = req.body.password

      sLogin = sLogin.toLowerCase().trim()

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { email: sLogin, is_active: 'y', deleted_at: null } : { mobile: sLogin, is_active: 'y', deleted_at: null }
      const counsellor = await CounsellorModel.findOne({
        where: query,
        attributes: { exclude: ['verified_at', 'created_by', 'updated_by', 'deleted_at', 'created_at', 'updated_at'] }
      })
      if (!counsellor) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (counsellor.status === 'pending') return res.status(status.Locked).jsonp({ status: jsonStatus.Locked, message: messages[req.userLanguage].counsellor_not_approved })

      if (!bcrypt.compareSync(sPassword, counsellor.password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const newToken = {
        token: jwt.sign({ _id: counsellor.email }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
      }

      await CounsellorModel.update({ token: newToken.token }, { where: { id: counsellor.id } })
      const updatedCounsellor = await CounsellorModel.findOne({
        where: { id: counsellor.id },
        include: [{
          model: CounsellorDetailModel,
          as: 'details',
          attributes: []
        }],
        attributes: {
          exclude: ['password', 'verified_at', 'created_by', 'updated_by', 'deleted_at', 'created_at', 'updated_at', 'is_active'],
          include: [[Sequelize.col('details.profile_picture'), 'profile_picture']]
        }
      })
      return res.status(status.OK).set('Authorization', newToken.token).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: updatedCounsellor, Authorization: newToken.token })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async forgotPassword(req, res) {
    try {
      req.body = pick(req.body, ['email_mobile'])
      removenull(req.body)
      const { email_mobile } = req.body
      // validation for email and mobile number
      const isEmail = await validateEmail(email_mobile)
      const isMobile = validateMobile(email_mobile)
      if (!isEmail) {
        if (!isMobile) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
        }
      }
      // eslint-disable-next-line camelcase
      if (email_mobile !== '' && !isMobile && !isEmail) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
      }

      const query = isEmail ? { email: email_mobile, is_active: 'y', deleted_at: null } : { mobile: email_mobile, is_active: 'y', deleted_at: null }
      const userExist = await CounsellorModel.findOne({ raw: true, where: query })
      // user_not_exist
      if (!userExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      // check counsellor approved or not
      if (userExist.status === 'pending') return res.status(status.Locked).jsonp({ status: jsonStatus.Locked, message: messages[req.userLanguage].counsellor_not_approved })

      // Blocked user can't reset password.
      if (userExist && userExist.is_active === 'n') return res.status(status.Forbidden).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      if (userExist) {
        const token = jwt.sign({ _id: userExist.email }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
        const otp = await generateOTP(4)
        await CounsellorResetModel.create({ raw: true, email_mobile: email_mobile, OTP: otp, token })
        if (isMobile) {
          const data = await SendOtpMsg({ sPhone: email_mobile, sOTP: otp })
          if (data.isSuccess) {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message, Authorization: token })
          } else {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
          }
        } else {
          const resp = await sendMail(otp, userExist.email)
          if (resp === undefined) throw Error()
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ, Authorization: token })
        }
      }
    } catch (error) {
      return await catchError('counsellor.forgotPasswordV1', error, req, res)
    }
  }

  async verifyOtpForForgotPassword(req, res) {
    try {
      req.body = pick(req.body, ['otp', 'token'])
      removenull(req.body)
      const { otp, token } = req.body

      const otpLength = otp.toString().length
      if (otpLength !== 4) {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].verify_otp_err })
      }
      // Verify the token using jwt.verify method
      const decode = jwt.verify(token, config.JWT_SECRET)
      const otpUserExist = await CounsellorResetModel.findOne({ raw: true, where: { email_mobile: decode._id, OTP: otp } })
      if (!otpUserExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].verify_otp_err })

      await CounsellorResetModel.destroy({ raw: true, where: { email_mobile: decode._id, OTP: otp } })
      res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].verification_success })
    } catch (error) {
      return await catchError('counsellor.otp-verification', error, req, res)
    }
  }

  async loginWithOTP(req, res) {
    try {
      req.body = pick(req.body, ['login'])
      removenull(req.body)

      const { login } = req.body
      const sLogin = login.toString()
      const isEmail = await validateEmail(sLogin)

      const query = isEmail ? { email: sLogin, is_active: 'y', deleted_at: null } : { mobile: sLogin, is_active: 'y', deleted_at: null }
      const counsellor = await CounsellorModel.findOne({ raw: true, where: query })
      if (!counsellor) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })
      // check counsellor approved or not
      if (counsellor.status === 'pending') return res.status(status.Locked).jsonp({ status: jsonStatus.Locked, message: messages[req.userLanguage].counsellor_not_approved })
      const OTP = generateOTP(4)
      await CounsellorModel.update({ OTP }, { where: query })

      if (isEmail) {
        const resp = await sendMail(OTP, counsellor.email)
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
      return await catchError('counsellorService.login', error, req, res)
    }
  }

  async loginWithOtpVerify(req, res) {
    try {
      req.body = pick(req.body, ['login', 'otp'])
      removenull(req.body)
      let sLogin = req.body.login
      const iOTP = req.body.otp

      sLogin = sLogin.toLowerCase().trim()

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { email: sLogin, is_active: 'y', deleted_at: null } : { mobile: sLogin, is_active: 'y', deleted_at: null }
      query.OTP = iOTP
      const user = await CounsellorModel.findOne({
        raw: true,
        where: query,
        include: [{
          model: CounsellorDetailModel,
          as: 'details',
          attributes: []
        }],
        attributes: {
          exclude: ['password', 'verified_at', 'created_by', 'updated_by', 'deleted_at', 'created_at', 'updated_at', 'is_active'],
          include: [[Sequelize.col('details.profile_picture'), 'profile_picture']]
        }
      })
      if (!user) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].verify_otp_err })
      const token = jwt.sign({ _id: user.email }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

      await CounsellorModel.update({ OTP: null, token }, { where: { id: user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: user, Authorization: token })
    } catch (error) {
      return await catchError('userService.login', error, req, res)
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
      const Counsellor = await CounsellorModel.findOne({ where: { email: decodedToken._id, is_active: 'y', deleted_at: null } })

      if (!Counsellor) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })
      // check counsellor approved or not
      if (Counsellor.status === 'pending') return res.status(status.Locked).jsonp({ status: jsonStatus.Locked, message: messages[req.userLanguage].counsellor_not_approved })
      if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })

      await CounsellorModel.update({ password: bcrypt.hashSync(sNewPassword, salt) }, { where: { id: Counsellor.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].password) })
    } catch (error) {
      return await catchError('CounsellorService.changePasswordV1', error, req, res)
    }
  }

  async changePassword(req, res) {
    try {
      req.body = pick(req.body, ['sLogin', 'sType', 'sAuth', 'sCode', 'sNewPassword'])
      removenull(req.body)

      let { sLogin, sType, sCode, sNewPassword } = req.body

      sCode = parseInt(sCode)
      if (typeof sCode !== 'number') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].verify_otp_err })

      if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { sEmail: sLogin, is_active: 'y', deleted_at: null } : { sMobNum: sLogin, is_active: 'y', deleted_at: null }

      const user = await CounsellorModel.findOne(query).lean()

      // Bot user and Blocked user can't reset password.
      if (user.eType === 'B') return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked })
      if (!user) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      if (user && user.eStatus === 'B') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].block_user_err })

      await CounsellorModel.findByIdAndUpdate(user._id, { aJwtTokens: [], sPassword: bcrypt.hashSync(sNewPassword, salt) }, { runValidators: true })

      const ePlatform = ['A', 'I', 'W'].includes(req.headers.Platform) ? req.headers.Platform : 'O'
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
      return await catchError('UserAuth.resetPasswordV3', error, req, res)
    }
  }

  async registerEmailOtpSend(req, res) {
    try {
      removenull(req.body)
      const { emailMobile } = req.body
      const isEmail = await validateEmail(emailMobile)
      const isMobile = await validateMobile(emailMobile)
      const queryCounsellor = isEmail ? { email: emailMobile, deleted_at: null } : { mobile: emailMobile, deleted_at: null }
      const query = { email_mobile: emailMobile }

      let errMsgEmailMobile
      if (isEmail) {
        errMsgEmailMobile = 'Email'
      } else {
        errMsgEmailMobile = 'Mobile'
      }
      const counsellor = await CounsellorModel.findOne({ raw: true, where: queryCounsellor })
      if (counsellor) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', errMsgEmailMobile) })

      const otp = randomStr(4, 'otp')

      const emailExist = await CounsellorRegisterVerifyModel.findOne({ raw: true, where: query })

      if (!emailExist) {
        if (isMobile) {
          await CounsellorRegisterVerifyModel.create({ otp: otp, email_mobile: emailMobile })
          const data = await SendOtpMsg({ sPhone: emailMobile, sOTP: otp })
          if (data.isSuccess) {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ })
          } else {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
          }
        } else {
          await sendMail(otp, emailMobile)
          await CounsellorRegisterVerifyModel.create({ otp: otp, email_mobile: emailMobile })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ })
        }
      } else {
        if (isMobile) {
          await CounsellorRegisterVerifyModel.update({ otp }, { where: query })
          const data = await SendOtpMsg({ sPhone: emailMobile, sOTP: otp })
          if (data.isSuccess) {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ })
          } else {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
          }
        } else {
          await sendMail(otp, emailMobile)
          await CounsellorRegisterVerifyModel.update({ otp }, { where: query })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ })
        }
      }
    } catch (error) {
      return await catchError('CounselloService.login', error, req, res)
    }
  }

  async registerEmailOtpVerify(req, res) {
    try {
      req.body = pick(req.body, ['login', 'otp'])
      removenull(req.body)
      let sLogin = req.body.login
      const sOtp = req.body.otp

      sLogin = sLogin.toLowerCase().trim()

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { email_mobile: sLogin } : { email_mobile: sLogin }

      const counsellor = await CounsellorRegisterVerifyModel.findOne({ raw: true, where: query })
      if (!counsellor) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (sOtp !== counsellor.otp) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
      } else {
        await CounsellorRegisterVerifyModel.destroy({ where: query })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].verification_success })
      }
    } catch (error) {
      return await catchError('CounsellorService.login', error, req, res)
    }
  }

  async getCounsellor(req, res) {
    try {
      const counsellor = await CounsellorModel.findOne({
        where: { id: req.user.id, deleted_at: null, is_active: 'y' },
        include: [
          {
            model: CounsellorDetailModel,
            as: 'details',
            required: false,
            include: [
              {
                model: CountryModel,
                as: 'country',
                required: false,
                attributes: ['id', 'title']
              },
              {
                model: StateModel,
                as: 'state',
                required: false,
                attributes: ['id', 'title']
              },
              {
                model: CityModel,
                as: 'city',
                required: false,
                attributes: ['id', 'title']
              },
              {
                model: QualificationsModel,
                as: 'high_qualification',
                required: false,
                attributes: ['id', 'title']
              },
              {
                model: QualificationsModel,
                as: 'last_qualification',
                required: false,
                attributes: ['id', 'title']
              },
              {
                model: QualificationsModel,
                as: 'certificate_qualification',
                required: false,
                attributes: ['id', 'title']
              },
              {
                model: QualificationsModel,
                as: 'professional_expertnesses',
                required: false,
                attributes: ['id', 'title']
              },
              {
                model: UniversityModel,
                as: 'high_university',
                required: false,
                attributes: ['id', 'title']
              },
              {
                model: UniversityModel,
                as: 'last_university',
                required: false,
                attributes: ['id', 'title']
              },
              {
                model: UniversityModel,
                as: 'certificate_university',
                required: false,
                attributes: ['id', 'title']
              }
            ],
            where: { deleted_at: null }
          }
        ],
        attributes: ['id', 'ollato_code', 'center_id', 'first_name', 'middle_name', 'last_name', 'email', 'mobile', 'avg_ratings', 'career_counsellor', 'psychologist', 'overseas_counsellor', 'subject_expert', 'dob', 'gender', 'total_amount', 'redeem_amount', 'remaining_amount']
      })
      if (!counsellor) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'data') })
      // check counsellor approved or not
      if (counsellor.status === 'pending') return res.status(status.Locked).jsonp({ status: jsonStatus.Locked, message: messages[req.userLanguage].counsellor_not_approved })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: counsellor })
    } catch (error) {
      return await catchError('counsellor.getCounsellorDetail', error, req, res)
    }
  }

  async updateCounsellor(req, res) {
    try {
      // counsellor model
      // eslint-disable-next-line camelcase
      const { center_id, first_name, middle_name, last_name, mobile, career_counsellor, psychologist, overseas_counsellor, dob, father_name, mother_name, professional_expertness, country_id, state_id, city_id, pin_code, high_qualification_id, high_university_id, last_qualification_id, last_university_id, certificate_qualification_id, certificate_university_id, experience_year, experience_month, total_experience, pan_number, gst_no, adhar_card_number, adharcard_front, adharcard_back, signature, pancard, profile_picture, resume, subject_expert } = req.body
      removenull(req.body)

      // eslint-disable-next-line camelcase
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)

      const exist = await CounsellorModel.findOne({ where: { id: req.user.id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].counsellor) })
      // check counsellor approved or not
      if (exist.status === 'pending') return res.status(status.Locked).jsonp({ status: jsonStatus.Locked, message: messages[req.userLanguage].counsellor_not_approved })

      let email = req.body.email
      email = email ? email.toLowerCase().trim() : null

      if (!validateMobile(mobile)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      const isEmail = await validateEmail(email)
      if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })

      const userExist = await CounsellorModel.findOne({
        where: {
          [Op.not]: [
            { id: req.user.id }
          ],
          [Op.or]: [
            { email: email },
            { mobile: mobile }
          ],
          deleted_at: null
        }
      }, null, { readPreference: 'primary' })
      if (userExist && userExist.mobile === mobile) {
        return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      }
      if (userExist && userExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
      let transaction
      try {
        transaction = await sequelize.transaction()

        await CounsellorModel.update({ center_id, slug: sUsername, user_name: sUsername, first_name, middle_name, last_name, email, mobile, career_counsellor, psychologist, overseas_counsellor, dob, mother_name, father_name, subject_expert }, { where: { id: req.user.id } }, { transaction })

        await CounsellorDetailModel.update({ resume, professional_expertness, country_id, state_id, city_id, pin_code, high_qualification_id, high_university_id, last_qualification_id, last_university_id, certificate_qualification_id, certificate_university_id, experience_year, experience_month, total_experience, pan_number, pan_file: pancard, adhar_card_number, adhar_card_number_front: adharcard_front, adhar_card_number_back: adharcard_back, signature, profile_picture, gst_no }, { where: { counsellor_id: req.user.id } }, { transaction })

        await transaction.commit()

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].counsellor) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async logout(req, res) {
    try {
      await CounsellorModel.update({ token: null }, { where: { id: req.user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_logout })
    } catch (error) {
      return await catchError('CounsellorService.logout', error, req, res)
    }
  }

  async getQualification(req, res) {
    try {
      const qualifications = await QualificationsModel.findAll({ where: { deleted_at: null } })
      if (!qualifications.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'qualifications') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: qualifications })
    } catch (error) {
      return await catchError('counsellor.qualification', error, req, res)
    }
  }

  async getAllUniversity(req, res) {
    try {
      removenull(req.body)
      const universities = await UniversityModel.findAll({ where: { deleted_at: null } })
      if (!universities.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'university') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: universities, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('university.getAllUniversity', error, req, res)
    }
  }

  async checkExist(req, res) {
    try {
      const { sType, sValue } = req.body
      let exist
      let existVal
      if (sType === 'E') {
        exist = await CounsellorModel.findOne({ sEmail: sValue }, {}, { readPreference: 'primary' }).lean()
        existVal = 'Email'
      } else if (sType === 'M') {
        exist = await CounsellorModel.findOne({ sMobNum: sValue }, {}, { readPreference: 'primary' }).lean()
        existVal = 'Mobile number'
      } else if (sType === 'U') {
        exist = await CounsellorModel.findOne({ sUsername: sValue }, {}, { readPreference: 'primary' }).lean()
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
      return await catchError('StudentService.checkExist', error, req, res)
    }
  }

  async checkExistence(req, res) {
    try {
      const { sUsername: sUserName, sEmail: sEmailId, sMobNum: sPhone } = req.body

      const exist = await CounsellorModel.find({ $or: [{ sUsername: sUserName.toLowerCase() }, { sEmail: sEmailId.toLowerCase() }, { sMobNum: sPhone }] }, { sUsername: 1, sEmail: 1, sMobNum: 1 }, { readPreference: 'primary' }).lean()
      if (!exist.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', 'User') })

      const userNameExist = exist.find(({ sUsername }) => sUsername === sUserName.toLowerCase())
      if (userNameExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', 'Username'), data: { bIsUsernameExist: true } })

      const emailExist = exist.find(({ sEmail }) => sEmail === sEmailId.toLowerCase())
      if (emailExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', 'Email'), data: { bIsEmailExist: true } })

      const phoneExist = exist.find(({ sMobNum }) => sMobNum === sPhone)
      if (phoneExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', 'Mobile number'), data: { bIsMobExist: true } })
    } catch (error) {
      return await catchError('StudentService.checkExistence', error, req, res)
    }
  }

  async validateToken(req, res) {
    try {
      req.body = pick(req.body, ['nLongitude', 'nLatitude', 'sPushToken', 'sDeviceToken', 'nVersion'])
      removenull(req.body)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].action_success.replace('##', messages[req.userLanguage].cvalidate) })
    } catch (error) {
      return await catchError('StudentService.validateToken', error, req, res)
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
}

// To get new generated username
const getUniqueUserName = async(sName) => {
  try {
    let sUsername = sName.replace(/\s/g, '').toLowerCase()
    if (sUsername.length > 15) sUsername = sUsername.slice(0, -(sUsername.length - 15))

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
    const exists = await CounsellorModel.findOne({ where: { user_name: sUsername } })

    if (exists) {
      let nDigit = exists.user_name.match(/\d+/g) ? exists.user_name.match(/\d+/g)[0] : 0
      nDigit = Number(nDigit) || 0
      sUsername = exists.user_name.match(/[a-zA-Z]+/g)[0].concat(nDigit + 1)

      return await checkUserName(sUsername)
    } else {
      return sUsername
    }
  } catch (error) {
    return new Error(error)
  }
}

module.exports = new CounsellorService()
