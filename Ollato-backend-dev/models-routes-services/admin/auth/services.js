/* eslint-disable camelcase */
const jwt = require('jsonwebtoken')
const adminModel = require('./admin.model')
const adminResetModel = require('./admin_reset.model')
const RoleModel = require('../roles/roles.model')
const RolePermissionModel = require('../roles/role.permission.model')
const ModulePermissionModel = require('../roles/module.permissions.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { removenull, catchError, pick, validateEmail, validatePassword, validateMobile, randomStr, getPaginationValues, getIncrementNumber } = require('../../../helper/utilities.services')
const config = require('../../../config/config-file')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const { sendMailPassword, sendMail } = require('../../../helper/email.service')
const { SendOtpMsg, generateOTP } = require('../../../helper/sms.service')
const { testCasesDefault } = require('../../../config/testCases.js')
const { Op, Sequelize } = require('sequelize')
// const { sequelize } = require('../../../database/sequelize')

const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)

class AdminService {
  async loginWithPassword(req, res) {
    try {
      removenull(req.body)
      let sLogin = req.body.email
      const sPassword = req.body.password

      sLogin = sLogin.toLowerCase().trim()

      const isEmail = await validateEmail(sLogin)
      if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const query = { email: sLogin, deleted_at: null }
      const admin = await adminModel.findOne({ where: query })
      if (!admin) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].admin) })

      if (!bcrypt.compareSync(sPassword, admin.password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const newToken = {
        token: jwt.sign({ _id: admin.email }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
      }

      await adminModel.update({ token: newToken.token }, { where: { id: admin.id } })
      let adminData = {}
      let queryAdminType = {}
      if (admin.admin_type === 'super') {
        queryAdminType = { email: sLogin }
        adminData = await adminModel.findOne({
          where: queryAdminType,
          attributes: { exclude: ['custom_id', 'slug', 'deleted_at', 'password', 'created_by', 'updated_by', 'created_at', 'updated_at'] }
        })
      } else {
        queryAdminType = { email: sLogin, admin_type: admin.admin_type }
        adminData = await adminModel.findOne({
          where: queryAdminType,
          include: [{
            model: RoleModel,
            as: 'admin_role',
            required: false,
            include: [{
              model: RolePermissionModel,
              as: 'role_permissions',
              required: false,
              include: {
                model: ModulePermissionModel,
                as: 'module_permissions',
                required: false,
                attributes: [[Sequelize.col('slug'), 'slug']]
              },
              attributes: ['id', 'role_id', 'permission_id', 'is_active', 'module_permission_id', /* [Sequelize.col('module_permissions.id'), 'id'], [Sequelize.col('module_permissions.module_name'), 'module_name'], [Sequelize.col('module_permissions.list'), 'list'], [Sequelize.col('module_permissions.view'), 'view'], [Sequelize.col('module_permissions.create'), 'create'], [Sequelize.col('module_permissions.update'), 'update'], [Sequelize.col('module_permissions.delete'), 'delete'], [Sequelize.col('module_permissions.is_active'), 'is_active'], [Sequelize.col('module_permissions.deleted_at'), 'deleted_at'], */'list', 'view', 'create', 'update', 'delete']
            }],
            attributes: ['id', 'title', 'is_active']
          }],
          attributes: { exclude: ['custom_id', 'slug', 'deleted_at', 'password', 'created_by', 'updated_by', 'created_at', 'updated_at'] }
        })
      }

      return res.status(status.OK).set('Authorization', newToken.token).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: adminData, Authorization: newToken.token })
    } catch (error) {
      return await catchError('adminService.login', error, req, res)
    }
  }

  // async forgotPassword(req, res) {
  //   try {
  //     removenull(req.body)
  //     const { email } = req.body
  //     // validation for email
  //     const isEmail = await validateEmail(email)
  //     if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
  //     const query = { email }

  //     const userExist = await adminModel.findOne({ raw: true, where: query })
  //     if (!userExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

  //     // Blocked user can't reset password.
  //     if (userExist && userExist.is_active === 'n') return res.status(status.Forbidden).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

  //     if (userExist) {
  //       const token = jwt.sign({ _id: userExist.id }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
  //       await adminResetModel.create({ raw: true, email, token })
  //       const OTP = generateOTP(4)
  //       const resp = await sendMail(OTP, userExist.email)
  //       if (resp === undefined) throw Error()
  //       return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].sent_success.replace('##', messages[req.userLanguage].email) })
  //     }
  //   } catch (error) {
  //     return await catchError('admin.forgotPasswordV1', error, req, res)
  //   }
  // }

  async forgotPassword(req, res) {
    try {
      removenull(req.body)
      const { email } = req.body

      // validation for email and mobile number
      const isEmail = await validateEmail(email)
      const isMobile = validateMobile(email)

      if (!isEmail) {
        if (!isMobile) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
        }
      }
      if (email !== '' && !isMobile && !isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const query = isEmail ? { email: email, is_active: 'y', deleted_at: null } : { mobile: email, is_active: 'y', deleted_at: null }
      const userExist = await adminModel.findOne({ raw: true, where: query })
      if (!userExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      // Blocked user can't reset password.
      if (userExist && userExist.is_active === 'n') return res.status(status.Forbidden).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      const otp = generateOTP(4)
      const token = jwt.sign({ _id: userExist.email }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
      await adminResetModel.create({ raw: true, email, OTP: otp, token })
      if (isMobile) {
        const data = await SendOtpMsg({ sPhone: email, sOTP: otp })
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

      const admin = await adminModel.findOne({ where: { email: decodedToken._id } })

      if (!admin) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].invalid_pass) })

      await adminModel.update({ password: bcrypt.hashSync(sNewPassword, salt) }, { where: { id: admin.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].password) })
    } catch (error) {
      return await catchError('adminService.resetPassword', error, req, res)
    }
  }

  async changePassword(req, res) {
    try {
      req.body = pick(req.body, ['currentPassword', 'confirmPassword', 'password'])
      removenull(req.body)
      const { currentPassword, confirmPassword, password } = req.body
      if (!validatePassword(password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })
      if (confirmPassword !== password) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const admin = await adminModel.findOne({ raw: true, where: { id: req.user.id } })

      if (!admin) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      if (!bcrypt.compareSync(currentPassword, admin.password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
      await adminModel.update({ password: bcrypt.hashSync(password, salt) }, { where: { id: req.user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].change_password.replace('##', messages[req.userLanguage].ssPassword) })
    } catch (error) {
      return await catchError('AdminAuth.changePassword', error, req, res)
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
      const query = isEmail ? { email: sLogin } : { mobile: sLogin }

      const admin = await adminModel.findOne({ raw: true, where: query })
      if (!admin) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      if (sOtp !== admin.OTP) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const token = jwt.sign({ _id: admin.email }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

      await adminModel.update({ token: token, OTP: null }, { where: { id: admin.id } })
      const adminUser = await adminModel.findOne({ raw: true, where: query })
      return res.status(status.OK).set('Authorization', token).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, data: adminUser, Authorization: token })
    } catch (error) {
      return await catchError('AdminService.login', error, req, res)
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
      const otpUserExist = await adminResetModel.findOne({ raw: true, where: { OTP: otp } })
      if (!otpUserExist) return res.status(status.BadRequest).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].verify_otp_err })

      // Verify the token using jwt.verify method
      if (decode._id === otpUserExist.email) {
        await adminResetModel.destroy({ raw: true, where: { email: otpUserExist.email } })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].verification_success })
      } else {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].token_expire })
      }
    } catch (error) {
      return await catchError('UserAuth.otp-verification', error, req, res)
    }
  }

  async logout(req, res) {
    try {
      await adminModel.update({ token: null }, { where: { id: req.user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_logout })
    } catch (error) {
      return await catchError('AdminService.logout', error, req, res)
    }
  }

  /**
  * Give you a Admin Authorization token to run test script.
  * @returns Authorization token.
  */
  async getAdminToken() {
    let response
    try {
      const result = await axios.post(`${config.HOST_URL}:${config.PORT}/api/v1/admin/login-with-password`, {
        email: testCasesDefault.admin.sLogin,
        password: testCasesDefault.admin.sPassword
      })
      response = result.data.Authorization
    } catch (error) {
      return await catchError('AdminAuth.getAdminToken', error, '', '')
    }
    return response
  }

  /** Add/update/delete/list role admins */
  async getRoleAdmin(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await adminModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].admin) })

      const roleAdmin = await adminModel.findOne({
        where: {
          id,
          deleted_at: null,
          admin_type: 'sub'
        },
        include: [{
          model: RoleModel,
          as: 'admin_role',
          required: false,
          attributes: ['id', 'title', 'is_active']
        }],
        attributes: {
          exclude: ['deleted_at', 'token', 'updated_by', 'created_by', 'password']
        }
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: roleAdmin, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('admin.getAllAdmin', error, req, res)
    }
  }

  async listRoleAdmin(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const query = {
        [Op.or]: [
          {
            first_name: {
              [Op.like]: `%${search}%`
            }
          },
          {
            last_name: {
              [Op.like]: `%${search}%`
            }
          },
          {
            email: {
              [Op.like]: `%${search}%`
            }
          }
        ],
        deleted_at: null,
        admin_type: 'sub'
      }
      const admins = await adminModel.findAndCountAll({
        where: query,
        include: [{
          model: RoleModel,
          as: 'admin_role',
          required: false,
          attributes: ['id', 'title', 'is_active']
        }],
        // attributes: {
        //   exclude: ['deleted_at', 'token', 'updated_by', 'created_by', 'password']
        // },
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: admins, /* total: total.count, */ message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('admin.getAllAdmin', error, req, res)
    }
  }

  async createRoleAdmin(req, res) {
    try {
      removenull(req.body)
      const { first_name, last_name, mobile, admin_type, role_id } = req.body

      const sCustomId = randomStr(8, 'string')
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)
      const password = await generatePassword(8)
      const sPassword = bcrypt.hashSync(password, salt)
      const roleId = Number(role_id)

      let email = req.body.email
      email = email.toLowerCase().trim()
      if (!validateMobile(mobile)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      const isEmail = await validateEmail(email)
      if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })

      const userExist = await adminModel.findOne({ where: { [Op.or]: [{ email: email }, { mobile: mobile }, { user_name: sUsername }], deleted_at: null } }, null, { readPreference: 'primary' })

      if (userExist && userExist.user_name === sUsername) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username) })
      if (userExist && userExist.mobile === mobile) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      if (userExist && userExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })

      // const profilePictureLink = `/uploads/profile${req.files.profile[0].filename}`

      /** check last ollato number */
      const lastRecord = await adminModel.findOne({
        raw: true,
        where: { ollato_code: { [Op.ne]: null } },
        order: [
          ['id', 'DESC']
        ]
      })
      let id = ''
      if (lastRecord) {
        id = lastRecord.ollato_code
      }
      const getOllatoNumber = await getIncrementNumber('admin', id)

      try {
        const admin = await adminModel.create({ custom_id: sCustomId, ollato_code: getOllatoNumber, slug: sUsername, user_name: sUsername, password: sPassword, first_name, last_name, email, mobile, admin_type, role_id: roleId/*, profile_pic: profilePictureLink */ })

        const token = jwt.sign({ id: (admin.getDataValue('id')) }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
        const adminToken = await adminModel.update({ token: token }, { where: { id: admin.id } })
        if (!adminToken) {
          return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
        }

        const name = first_name.concat(' ', last_name)
        const resp = await sendMailPassword(password, name, email)
        if (resp === undefined) throw Error()

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: admin, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].admin) })
      } catch (error) {
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('admin.createAdmin', error, req, res)
    }
  }

  async updateRoleAdmin(req, res) {
    try {
      const { id, first_name, last_name, mobile, email, admin_type, role_id, profile, updateType, isActive } = req.body
      removenull(req.body)

      const exist = await adminModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await adminModel.update({ is_active: isActive }, { where: { id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].admin) })
        } else {
          const titleExist = await adminModel.findAll({ raw: true, where: { id: { [Op.not]: id }, [Op.or]: [{ email }, { mobile }], deleted_at: null } })
          if (titleExist.length) return res.status(status.BadRequest).jsonp({ status: status.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].admin) })

          await adminModel.update({ first_name, last_name, mobile, email, admin_type, role_id, profile_pic: profile }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].admin) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].admin) })
      }
    } catch (error) {
      return await catchError('admin.updateAdmin', error, req, res)
    }
  }

  async deleteRoleAdmin(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await adminModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].admin) })

      const admin = await adminModel.update({ deleted_at: new Date() }, { raw: true, where: { id: id } })
      if (admin) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].admin) })
    } catch (error) {
      return await catchError('admin.deleteAdmin', error, req, res)
    }
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
    const exists = await adminModel.findOne({ where: { user_name: sUsername } })

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

// Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters.
const generatePassword = async (passwordLength) => {
  try {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
    const upperCase = lowerCase.toUpperCase()
    const numberChars = '0123456789'
    const specialChars = '!"@$%+-_?^&*()'

    let generatedPassword = ''
    let restPassword = ''

    const restLength = passwordLength % 4
    const usableLength = passwordLength - restLength
    const generateLength = usableLength / 4

    const randomString = (char) => {
      return char[Math.floor(Math.random() * (char.length))]
    }
    for (let i = 0; i <= generateLength - 1; i++) {
      generatedPassword += `${randomString(lowerCase)}${randomString(upperCase)}${randomString(numberChars)}${randomString(specialChars)}`
    }

    for (let i = 0; i <= restLength - 1; i++) {
      restPassword += randomString([...lowerCase, ...upperCase, ...numberChars, ...specialChars])
    }
    return generatedPassword + restPassword
  } catch (error) {
    return new Error(error)
  }
}

module.exports = new AdminService()
