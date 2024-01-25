/* eslint-disable camelcase */
const { removenull, catchError, validateEmail, validateMobile, randomStr, getPaginationValues, getIncrementNumber } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const CenterModel = require('../../center/Auth/center.model')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)
const { sendMailPassword } = require('../../../helper/email.service')
const CityModel = require('../city/city.model')
const StateModel = require('../state/state.model')
const CountryModel = require('../../common/country/country.model')
const CounsellorModel = require('../../counsellor/counsellor.model')
const { sequelize } = require('../../../database/sequelize')
class CenterService {
  async getCenterById(req, res) {
    try {
      const { id } = req.body
      removenull(req.body)
      const students = await CenterModel.findOne({
        where: { id, deleted_at: null },
        include: [{
          model: CountryModel,
          as: 'country',
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
          model: StateModel,
          as: 'states',
          required: false,
          attributes: ['id', 'title']
        }]
      })
      if (!students) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].center) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: students, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].center) })
    } catch (error) {
      return await catchError('center.getAllCenter', error, req, res)
    }
  }

  async getAll(req, res) {
    try {
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      removenull(req.body)
      const student = await CenterModel.findAndCountAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${search}%`
              }
            },
            {
              email: {
                [Op.like]: `%${search}%`
              }
            },
            {
              mobile: {
                [Op.like]: `%${search}%`
              }
            }
          ],
          deleted_at: null
        },
        attributes: ['id', 'user_name', 'title', 'email', 'mobile', 'is_active', 'created_at', 'updated_at', 'deleted_at'],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: student, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('center.getAllCenter', error, req, res)
    }
  }

  async createCenter(req, res) {
    try {
      removenull(req.body)
      const { title, mobile, city_id, state_id, country_id, commission } = req.body

      const sCustomId = randomStr(8, 'string')
      const fullName = title
      const sUsername = await getUniqueUserName(fullName)
      const password = await generatePassword(8)
      const sPassword = bcrypt.hashSync(password, salt)

      let email = req.body.email
      email = email.toLowerCase().trim()
      if (!validateMobile(mobile)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      const isEmail = await validateEmail(email)
      if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })

      const userExist = await CenterModel.findOne({ where: { [Op.or]: [{ email: email }, { mobile: mobile }], deleted_at: null } }, null, { readPreference: 'primary' })

      if (userExist && userExist.mobile === mobile) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      if (userExist && userExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })

      /** check last ollato number */
      const lastRecord = await CenterModel.findOne({
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
      const getOllatoNumber = await getIncrementNumber('center', id)
      const counsellor_commission = commission || 0

      const center = await CenterModel.create({ custom_id: sCustomId, ollato_code: getOllatoNumber, slug: sUsername, user_name: sUsername, password: sPassword, title, email, mobile, city_id, state_id, country_id, commission: counsellor_commission })

      const resp = await sendMailPassword(password, title, email)
      if (resp === undefined) throw Error()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: center, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].center) })
    } catch (error) {
      return await catchError('center.createCenter', error, req, res)
    }
  }

  async updateCenter(req, res) {
    try {
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const { id, updateType, isActive, title, mobile, city_id, state_id, country_id, commission } = req.body

      const exist = await CenterModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await CenterModel.update({ is_active: isActive }, { where: { id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].center) })
        } else {
          let email = req.body.email
          email = email.toLowerCase().trim()

          const titleExist = await CenterModel.findAll({ raw: true, where: { id: { [Op.not]: id }, email, mobile } })

          if (titleExist.length && titleExist[0].email === email) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })

          if (titleExist.length && titleExist[0].mobile === mobile) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })

          const counsellor_commission = commission || 0
          await CenterModel.update({ title, email, mobile, city_id, state_id, country_id, updated_by: 'admin', commission: counsellor_commission }, { where: { id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].center) })
        }
      }
    } catch (error) {
      return await catchError('center.updateCenter', error, req, res)
    }
  }

  async deleteCenter(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await CenterModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].center) })

      let transaction
      try {
        transaction = await sequelize.transaction()

        const center = CenterModel.update({ deleted_at: new Date() }, { raw: true, where: { id } })
        if (!center) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].center) })

        const counsellor = CounsellorModel.findOne({ where: { center_id: exist.id } })
        if (counsellor) CounsellorModel.update({ center_id: null }, { where: { center_id: exist.id } })

        await transaction.commit()

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].center) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('center.deleteCenter', error, req, res)
    }
  }

  async getAllCenterFront(req, res) {
    try {
      const center = await CenterModel.findAll({ where: { deleted_at: null, is_active: 'y' } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: center, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('center.getCenter', error, req, res)
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
    const exists = await CenterModel.findOne({ where: { user_name: sUsername } })

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
module.exports = new CenterService()
