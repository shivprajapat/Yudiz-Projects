/* eslint-disable camelcase */
const { catchError, removenull, getPaginationValues, randomStr, validateMobile, validateEmail, getIncrementNumber } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const CounsellorModel = require('../../counsellor/counsellor.model')
const CounsellorDetailModel = require('../../counsellor/counsellor_details.model')
const CityModel = require('../../admin/city/city.model')
const CountryModel = require('../../common/country/country.model')
const StateModel = require('../../admin/state/state.model')
const QualificationsModel = require('../../admin/qualification/qualification.model')
const UniversitiesModel = require('../../admin/university/university.model')
const { Op } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')
const { sendMailPassword } = require('../../../helper/email.service')

const bcrypt = require('bcryptjs')
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)

class CounsellorService {
  async getCounsellorById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await CounsellorModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].counsellor) })

      let transaction
      try {
        transaction = await sequelize.transaction()
        const counsellor = await CounsellorModel.findOne({
          where: {
            [Op.and]: [
              { id },
              { deleted_at: null }
            ]
          }
        }, { transaction })

        const counsellorDetailId = counsellor.id
        const counsellorDetail = await CounsellorDetailModel.findOne({
          where: {
            [Op.and]: [
              { counsellor_id: counsellorDetailId },
              { deleted_at: null }
            ]
          },
          include: [{
            model: CityModel,
            as: 'city',
            attributes: ['id', 'title']
          },
          {
            model: CountryModel,
            as: 'country',
            attributes: ['id', 'title']
          },
          {
            model: StateModel,
            as: 'state',
            attributes: ['id', 'title']
          },
          {
            model: QualificationsModel,
            as: 'high_qualification',
            attributes: ['id', 'title']
          },
          {
            model: QualificationsModel,
            as: 'last_qualification',
            attributes: ['id', 'title']
          },
          {
            model: QualificationsModel,
            as: 'certificate_qualification',
            attributes: ['id', 'title']
          },
          {
            model: UniversitiesModel,
            as: 'high_university',
            attributes: ['id', 'title']
          },
          {
            model: UniversitiesModel,
            as: 'last_university',
            attributes: ['id', 'title']
          },
          {
            model: UniversitiesModel,
            as: 'certificate_university',
            attributes: ['id', 'title']
          }]
        }, { transaction })

        await transaction.commit()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: { counsellor, counsellorDetail }, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
      } catch (error) {
        console.log(error)
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      console.log(error)
      return await catchError('counsellor.getCounsellorByID', error, req, res)
    }
  }

  async getAllCounsellor(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      // const counsellorType = req.body.counsellor_type
      // const type = (counsellorType === 'career_counsellor') ? { career_counsellor: true }
      //   : (counsellorType === 'psychologist') ? { psychologist: true }
      //     : { overseas_counsellor: true }

      const counsellor = await CounsellorModel.findAndCountAll({
        where: {
          [Op.or]: [{
            first_name: {
              [Op.like]: `%${search}%`
            }
          }, {
            last_name: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null,
          center_id: req.user.id
        },
        order: sorting,
        limit,
        offset: start
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: counsellor, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('counsellor.getAllCounsellor', error, req, res)
    }
  }

  async createCounsellor(req, res) {
    try {
      // counsellor model
      // eslint-disable-next-line camelcase
      const { counsellor_id, first_name, middle_name, last_name, mobile, career_counsellor, psychologist, overseas_counsellor, subject_expert, OTP, dob, gender, father_name, mother_name, professional_expertness, country_id, state_id, city_id, pin_code, high_qualification_id, high_university_id, last_qualification_id, last_university_id, certificate_qualification_id, certificate_university_id, experience_year, experience_month, pan_number, gst_no, adhar_card_number, adharcard_front, adharcard_back, signature, pancard, profile_picture, resume } = req.body
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)
      const password = await generatePassword(8)

      let email = req.body.email
      email = email ? email.toLowerCase().trim() : null
      if (!validateMobile(mobile)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      const isEmail = await validateEmail(email)
      if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })

      const userExist = await CounsellorModel.findOne({ where: { [Op.or]: [{ email: email }, { mobile: mobile }, { user_name: sUsername }] } }, null, { readPreference: 'primary' })

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

        const counsellor = await CounsellorModel.create({ custom_id: sCustomId, ollato_code: getOllatoNumber, center_id: req.user.id, counselor_id: counsellor_id, slug: sUsername, user_name: sUsername, password: sPassword, first_name, middle_name, last_name, email, mobile, career_counsellor, psychologist, overseas_counsellor, subject_expert, OTP, dob, gender, mother_name, father_name, verified_at: dVerifiedAt, status: 'approved' }, { transaction })
        counsellor.setDataValue('password', null)

        const sCustomIdCounsellorDetail = randomStr(8, 'string')
        await CounsellorDetailModel.create({ custom_id: sCustomIdCounsellorDetail, counsellor_id: counsellor.getDataValue('id'), resume, professional_expertness, country_id, state_id, city_id, pin_code, high_qualification_id, high_university_id, last_qualification_id, last_university_id, certificate_qualification_id, certificate_university_id, experience_year, experience_month, pan_number, pan_file: pancard, adhar_card_number, adhar_card_number_front: adharcard_front, adhar_card_number_back: adharcard_back, signature, profile_picture, gst_no }, { transaction })

        await transaction.commit()

        const name = first_name.concat(' ', last_name)
        const resp = await sendMailPassword(password, name, email)
        if (resp === undefined) throw Error()

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].counsellor), data: counsellor })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('CounsellorService.register', error, req, res)
    }
  }

  async updateCounsellor(req, res) {
    try {
      // counsellor model
      // eslint-disable-next-line camelcase
      const { counsellor_id, first_name, middle_name, last_name, mobile, career_counsellor, psychologist, overseas_counsellor, subject_expert, dob, father_name, mother_name, professional_expertness, country_id, state_id, city_id, pin_code, high_qualification_id, high_university_id, last_qualification_id, last_university_id, certificate_qualification_id, certificate_university_id, experience_year, experience_month, pan_number, gst_no, adhar_card_number, adharcard_front, adharcard_back, signature, pancard, profile_picture, resume, isActive, updateType } = req.body
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)

      const exist = await CounsellorModel.findOne({ where: { id: counsellor_id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].counsellor) })

      let statusTransaction
      try {
        statusTransaction = await sequelize.transaction()
        if (updateType && updateType === 'status') {
          await CounsellorModel.update({ is_active: isActive }, { where: { id: counsellor_id } }, { transaction: statusTransaction })
          await CounsellorDetailModel.update({ is_active: isActive }, { where: { counsellor_id: counsellor_id } }, { transaction: statusTransaction })
          await statusTransaction.commit()

          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].counsellor) })
        } else {
        }
      } catch (error) {
        if (statusTransaction) await statusTransaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }

      let email = req.body.email
      email = email ? email.toLowerCase().trim() : null

      if (!validateMobile(mobile)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      const isEmail = await validateEmail(email)
      if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })

      const cID = Number(counsellor_id)
      const userExist = await CounsellorModel.findOne({
        where: {
          [Op.not]: [
            { id: cID }
          ],
          [Op.or]: [
            { email: email },
            { mobile: mobile }
          ]
        }
      }, null, { readPreference: 'primary' })

      if (userExist && userExist.mobile === mobile) {
        return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      }
      if (userExist && userExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
      let transaction
      try {
        transaction = await sequelize.transaction()
        await CounsellorModel.update({ center_id: req.user.id, counselor_id: counsellor_id, slug: sUsername, user_name: sUsername, first_name, middle_name, last_name, email, mobile, career_counsellor, psychologist, overseas_counsellor, subject_expert, dob, mother_name, father_name }, { where: { id: counsellor_id } }, { transaction })

        await CounsellorDetailModel.update({ resume, professional_expertness, country_id, state_id, city_id, pin_code, high_qualification_id, high_university_id, last_qualification_id, last_university_id, certificate_qualification_id, certificate_university_id, experience_year, experience_month, pan_number, pan_file: pancard, adhar_card_number, adhar_card_number_front: adharcard_front, adhar_card_number_back: adharcard_back, signature, profile_picture: profile_picture, gst_no }, { where: { counsellor_id: counsellor_id } }, { transaction })

        await transaction.commit()

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].counsellor) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('CounsellorService.register', error, req, res)
    }
  }

  async deleteCounsellor(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await CounsellorModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].counsellor) })

      let transaction
      try {
        transaction = await sequelize.transaction()

        const deletedAt = new Date()
        const counsellor = await CounsellorModel.update({ deleted_at: deletedAt }, { where: { id } }, { transaction })
        await CounsellorDetailModel.update({ deleted_at: deletedAt }, { where: { counsellor_id: id } }, { transaction })

        await transaction.commit()
        if (counsellor) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].counsellor) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('counsellor.deleteCounsellor', error, req, res)
    }
  }

  // frontend
  async getAllCounsellorFrontend(req, res) {
    try {
      const counsellor = await CounsellorModel.findAll({ where: { center_id: req.user.id, deleted_at: null } })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: counsellor, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('counsellor.getAllCounsellor', error, req, res)
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

module.exports = new CounsellorService()
