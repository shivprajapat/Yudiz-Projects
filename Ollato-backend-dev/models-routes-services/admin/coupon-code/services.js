/* eslint-disable camelcase */
const { catchError, removenull, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const CouponCodeModel = require('./coupon_code.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { Op } = require('sequelize')

class CouponCodeServices {
  async getCouponCodeById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const couponcode = await CouponCodeModel.findOne({
        where: {
          id,
          deleted_at: null
        }
      })
      if (!couponcode) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].couponCode) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: couponcode, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].couponCode) })
    } catch (error) {
      return await catchError('couponcode.getAllCouponCode', error, req, res)
    }
  }

  async getAll(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const couponCodes = await CouponCodeModel.findAndCountAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${search}%`
              }
            },
            {
              code: {
                [Op.like]: `%${search}%`
              }
            }
          ],
          deleted_at: null
        },
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: couponCodes, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('couponCode.getAllCouponCode', error, req, res)
    }
  }

  async createCouponCode(req, res) {
    try {
      removenull(req.body)
      const { title, description, from_date, to_date, coupon_type, amount_percentage, number_time_use } = req.body
      let { code } = req.body

      // code will be alphanumeric and lower/upper
      if (!code) code = await generateCouponCode(4)

      const exist = await CouponCodeModel.findOne({ where: { title, code, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].couponCode) })

      const customId = await getUniqueString(8, CouponCodeModel)
      const createdCity = await CouponCodeModel.create({ custom_id: customId, title, code, description, from_date, to_date, coupon_type, amount_percentage, number_time_use, remaining_time_use: number_time_use })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: createdCity, message: messages[req.userLanguage].generate_success.replace('##', messages[req.userLanguage].couponCode) })
    } catch (error) {
      return await catchError('couponCode.createdCouponCode', error, req, res)
    }
  }

  async updateCouponCode(req, res) {
    try {
      removenull(req.body)
      const { title, code, description, from_date, to_date, coupon_type, amount_percentage, number_time_use, remaining_time_use, id, updateType, isActive } = req.body

      const exist = await CouponCodeModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await CouponCodeModel.update({ is_active: isActive }, { where: { id: id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].couponCode) })
        } else {
          const titleExist = await CouponCodeModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, code, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].couponCode) })

          await CouponCodeModel.update({ title, code, description, from_date, to_date, coupon_type, amount_percentage, number_time_use, remaining_time_use }, { where: { id: id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].couponCode) })
        }
      }
    } catch (error) {
      return await catchError('couponCode.updateCouponCode', error, req, res)
    }
  }

  async deleteCouponCode(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await CouponCodeModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].couponCode) })

      await CouponCodeModel.update({ deleted_at: new Date() }, { where: { id: id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].couponCode) })
    } catch (error) {
      return await catchError('packages.deletePackage', error, req, res)
    }
  }
}

// Coupon code at least one number and both lower and uppercase letters.
const generateCouponCode = async (codeLength) => {
  try {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
    const upperCase = lowerCase.toUpperCase()
    const numberChars = '0123456789'

    let generatedCode = ''
    let restCode = ''

    const restLength = codeLength % 4
    const usableLength = codeLength - restLength
    const generateLength = usableLength / 4

    const randomString = (char) => {
      return char[Math.floor(Math.random() * (char.length))]
    }
    for (let i = 0; i <= generateLength - 1; i++) {
      generatedCode += `${randomString(lowerCase)}${randomString(upperCase)}${randomString(numberChars)}`
    }

    for (let i = 0; i <= restLength - 1; i++) {
      restCode += randomString([...lowerCase, ...upperCase, ...numberChars])
    }
    return generatedCode + restCode
  } catch (error) {
    return new Error(error)
  }
}
module.exports = new CouponCodeServices()
