/* eslint-disable camelcase */
const jwt = require('jsonwebtoken')
const StudentsModel = require('../auth/student.model')
const StudentsRegisterVerifyModel = require('./register_verify.model')
const StudentDetailModel = require('./student_details.model')
const studentResetModel = require('./student_reset.model')
const CountryModel = require('../../common/country/country.model')
const GradeModel = require('../../admin/grade/grade.model')
const CityModel = require('../../admin/city/city.model')
const StateModel = require('../../admin/state/state.model')
const SchoolModel = require('../../admin/school/schools.model')
const {
  SendOtpMsg,
  generateOTP
} = require('../../../helper/sms.service')

const { Op } = require('sequelize')
const axios = require('axios')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')

const { removenull, catchError, pick, validateEmail, validateMobile, validatePassword, randomStr, getIncrementNumber } = require('../../../helper/utilities.services')

const config = require('../../../config/config-file')
const bcrypt = require('bcryptjs')
const { testCasesDefault } = require('../../../config/testCases.js')
const { sendMail } = require('../../../helper/email.service')
const { sequelize } = require('../../../database/sequelize')

const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)

class StudentService {
  async register(req, res) {
    try {
      // students model
      // testing
      // eslint-disable-next-line camelcase
      const { center_id, counselor_id, first_name, middle_name, last_name, mobile, OTP, dob, gender, father_name, mother_name, password, math_dropped, science_dropped, is_verify, verified_at, country_id, state_id, city_id, pin_code, grade_id, board_id, school_name, nationality, school_address_1, school_address_2, school_country_id, school_state_id, school_city_id, school_pin_code } = req.body

      removenull(req.body)
      // eslint-disable-next-line camelcase
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)

      if (!validateMobile(mobile)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      if (!validatePassword(password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].ssPassword) })

      let email
      if (req.body.email && req.body.email !== null) {
        email = req.body.email || null
        email = email.toLowerCase().trim()

        const isEmail = await validateEmail(email)
        if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })
      }

      const query = [
        { mobile },
        { user_name: sUsername }
      ]
      if (email) query.push({ email })

      const userExist = await StudentsModel.findOne({
        raw: true,
        where: {
          [Op.or]: query,
          deleted_at: null
        }
      })

      if (userExist && userExist.user_name === sUsername) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username) })
      if (userExist && parseInt(userExist.mobile) === parseInt(mobile)) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      if (email) {
        if (userExist && userExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
      }

      let transaction
      try {
        transaction = await sequelize.transaction()

        const sPassword = bcrypt.hashSync(password, salt)
        const sCustomId = randomStr(8, 'string')

        /** check last ollato number */
        const lastStudentRecord = await StudentsModel.findOne({
          raw: true,
          where: { ollato_code: { [Op.ne]: null } },
          order: [
            ['id', 'DESC']
          ]
        })
        let id = ''
        if (lastStudentRecord) {
          id = lastStudentRecord.ollato_code
        }
        const getOllatoNumber = await getIncrementNumber('student', id)

        const student = await StudentsModel.create({ custom_id: sCustomId, ollato_code: getOllatoNumber, slug: sUsername, user_name: sUsername, password: sPassword, center_id, counselor_id, first_name, middle_name, last_name, email, mobile, OTP, dob, gender, mother_name, father_name, math_dropped, science_dropped, is_verify, verified_at, created_by: 'ollato', updated_by: 'ollato' }, { transaction })
        student.setDataValue('password', null)

        const sCustomIdStudentDetail = randomStr(8, 'string')
        await StudentDetailModel.create({ custom_id: sCustomIdStudentDetail, student_id: student.getDataValue('id'), country_id, state_id, city_id, pin_code, grade_id, board_id, school_name, nationality, school_address_1, school_address_2, school_country_id, school_state_id, school_city_id, school_pin_code, created_by: 'ollato', updated_by: 'ollato' }, { transaction })

        await transaction.commit()

        const token = jwt.sign({ id: (student.getDataValue('id')) }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
        const studentToken = await StudentsModel.update({ token: token }, { where: { id: student.id } })
        if (!studentToken) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

        return res.status(status.OK).set('Authorization', token).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].reg_success, data: student, Authorization: token })
      } catch (error) {
        console.log(error)
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      console.log(error)
      return await catchError('StudentService.register', error, req, res)
    }
  }

  async registerEmailOtpSend(req, res) {
    try {
      removenull(req.body)
      const { emailMobile } = req.body

      const isEmail = await validateEmail(emailMobile)
      const isMobile = await validateMobile(emailMobile)

      const queryStudent = isEmail ? { email: emailMobile, deleted_at: null } : { mobile: emailMobile, deleted_at: null }
      const query = { email_mobile: emailMobile }
      const student = await StudentsModel.findOne({ raw: true, where: queryStudent })

      if (student && student.email === emailMobile) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })

      if (student && parseInt(student.mobile) === parseInt(emailMobile)) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })

      const otp = generateOTP(4)
      const emailExist = await StudentsRegisterVerifyModel.findOne({ raw: true, where: query })
      if (!emailExist) {
        if (isMobile) {
          await StudentsRegisterVerifyModel.create({ otp: otp, email_mobile: emailMobile })
          const data = await SendOtpMsg({ sPhone: emailMobile, sOTP: otp })
          if (data.isSuccess) {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
          } else {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
          }
        } else {
          await sendMail(otp, emailMobile)
          await StudentsRegisterVerifyModel.create({ otp: otp, email_mobile: emailMobile })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ })
        }
      } else {
        if (isMobile) {
          await StudentsRegisterVerifyModel.update({ otp }, { where: query })
          const data = await SendOtpMsg({ sPhone: emailMobile, sOTP: otp })
          if (data.isSuccess) {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
          } else {
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: data.message })
          }
        } else {
          await sendMail(otp, emailMobile)
          await StudentsRegisterVerifyModel.update({ otp }, { where: query })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].OTP_sent_succ })
        }
      }
    } catch (error) {
      return await catchError('StudentService.registerEmailOtpSend', error, req, res)
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

      const student = await StudentsRegisterVerifyModel.findOne({ where: query })
      if (!student) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].verify_otp_err })

      if (sOtp !== student.otp) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].verify_otp_err })
      } else {
        await StudentsRegisterVerifyModel.destroy({ where: query })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].verification_success })
      }
    } catch (error) {
      return await catchError('StudentService.login', error, req, res)
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

      const student = await StudentsModel.findOne({ raw: true, where: query })
      if (!student) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (sOtp !== student.OTP) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const token = jwt.sign({ _id: student.id }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

      await StudentsModel.update({ token: token, OTP: null }, { where: { id: student.id } })
      const newStudent = await StudentsModel.findOne({ raw: true, where: query })
      return res.status(status.OK).set('Authorization', token).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: newStudent, Authorization: token })
    } catch (error) {
      return await catchError('StudentService.login', error, req, res)
    }
  }

  async loginWithPassword(req, res) {
    try {
      req.body = pick(req.body, ['login', 'password'])
      removenull(req.body)
      let sLogin = req.body.login
      const sPassword = req.body.password

      sLogin = sLogin.toLowerCase().trim()

      const isEmail = await validateEmail(sLogin)
      const query = isEmail ? { email: sLogin, is_active: 'y', deleted_at: null } : { mobile: sLogin, is_active: 'y', deleted_at: null }

      const student = await StudentsModel.findOne({ where: query })
      if (!student) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (!bcrypt.compareSync(sPassword, student.password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const newToken = {
        token: jwt.sign({ _id: student.id }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
        // sPushToken
      }

      await StudentsModel.update({ token: newToken.token }, { where: { id: student.id } })
      const newStudent = await StudentsModel.findOne({ raw: true, where: query, attributes: { exclude: ['password', 'created_by', 'updated_by', 'created_at', 'updatedAt', 'OTP', 'is_verify', 'verified_at', 'is_active'] } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: newStudent, Authorization: newToken.token })
    } catch (error) {
      return await catchError('StudentService.login', error, req, res)
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
      const userExist = await StudentsModel.findOne({ raw: true, where: query })
      // user_not_exist
      if (!userExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      // Blocked user can't reset password.
      if (userExist && userExist.is_active === 'n') return res.status(status.Forbidden).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      const otp = generateOTP(4)
      const token = jwt.sign({ _id: userExist.id }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
      await studentResetModel.create({ raw: true, email_mobile: emailMobile, otp, token })
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
      const otpUserExist = await studentResetModel.findOne({ raw: true, where: { otp: otp } })
      if (!otpUserExist) return res.status(status.BadRequest).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].verify_otp_err })

      const userExist = await StudentsModel.findOne({
        raw: true,
        where: { [Op.or]: [{ email: otpUserExist.email_mobile }, { mobile: otpUserExist.email_mobile }], is_active: 'y', deleted_at: null }
      })
      // user_not_exist
      if (!userExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      // Verify the token using jwt.verify method
      if (decode._id === userExist.id) {
        await studentResetModel.destroy({ raw: true, where: { id: otpUserExist.id } })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].verification_success })
      } else {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].token_expire })
      }
    } catch (error) {
      return await catchError('UserAuth.otp-verification', error, req, res)
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

      const student = await StudentsModel.findOne({ raw: true, where: query })
      if (!student) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })
      const OTP = generateOTP(4)
      await StudentsModel.update({ OTP: OTP }, { where: query })
      if (isEmail) {
        const resp = await sendMail(OTP, student.email)
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
      return await catchError('StudentService.loginwithOTP', error, req, res)
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
      const student = await StudentsModel.findOne({ raw: true, where: { id: decodedToken._id } })
      if (!student) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })

      await StudentsModel.update({ password: bcrypt.hashSync(sNewPassword, salt) }, { where: { id: student.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].password) })
    } catch (error) {
      return await catchError('StudentService.changePasswordV3', error, req, res)
    }
  }

  async getAllCountry(req, res) {
    try {
      const countries = await CountryModel.findAll()
      if (!countries.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'country') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: countries })
    } catch (error) {
      return await catchError('student.allcountries', error, req, res)
    }
  }

  async getAllStates(req, res) {
    try {
      const states = await StateModel.findAll()
      if (!states.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'states') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: states })
    } catch (error) {
      return await catchError('student.allstates', error, req, res)
    }
  }

  async getAllGrade(req, res) {
    try {
      const grades = await GradeModel.findAll()
      if (!grades.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'grades') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: grades })
    } catch (error) {
      return await catchError('student.allgrades', error, req, res)
    }
  }

  async getAllCities(req, res) {
    try {
      const cities = await CityModel.findAll()
      if (!cities.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'grades') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: cities })
    } catch (error) {
      return await catchError('student.allcities', error, req, res)
    }
  }

  async getAllSchools(req, res) {
    try {
      const schools = await SchoolModel.findAll()
      if (!schools.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'schools') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: schools })
    } catch (error) {
      return await catchError('student.allschools', error, req, res)
    }
  }

  async changePassword(req, res) {
    try {
      req.body = pick(req.body, ['currentPassword', 'confirmPassword', 'password'])
      removenull(req.body)
      const { currentPassword, confirmPassword, password } = req.body
      if (!validatePassword(password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })
      if (confirmPassword !== password) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const user = await StudentsModel.findOne({ raw: true, where: { id: req.user.id } })

      if (!user) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      if (!bcrypt.compareSync(currentPassword, user.password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
      await StudentsModel.update({ password: bcrypt.hashSync(password, salt) }, { where: { id: req.user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].change_password.replace('##', messages[req.userLanguage].ssPassword) })
    } catch (error) {
      return await catchError('UserAuth.changePassword', error, req, res)
    }
  }

  async logout(req, res) {
    try {
      await StudentsModel.update({ token: null }, { where: { id: req.user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_logout })
    } catch (error) {
      return await catchError('StudentService.logout', error, req, res)
    }
  }

  async checkExist(req, res) {
    try {
      const { sType, sValue } = req.body
      let exist
      let existVal
      if (sType === 'E') {
        exist = await StudentsModel.findOne({ sEmail: sValue }, {}, { readPreference: 'primary' }).lean()
        existVal = 'Email'
      } else if (sType === 'M') {
        exist = await StudentsModel.findOne({ sMobNum: sValue }, {}, { readPreference: 'primary' }).lean()
        existVal = 'Mobile number'
      } else if (sType === 'U') {
        exist = await StudentsModel.findOne({ sUsername: sValue }, {}, { readPreference: 'primary' }).lean()
        existVal = 'Username'
      } else {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].went_wrong_with.replace('##', 'CSV') })
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

      const exist = await StudentsModel.find({ $or: [{ sUsername: sUserName.toLowerCase() }, { sEmail: sEmailId.toLowerCase() }, { sMobNum: sPhone }] }, { sUsername: 1, sEmail: 1, sMobNum: 1 }, { readPreference: 'primary' }).lean()
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
    const exists = await StudentsModel.findOne({ where: { user_name: sUsername } })
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

module.exports = new StudentService()
