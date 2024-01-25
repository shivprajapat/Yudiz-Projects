const { status, jsonStatus, messages } = require('../../../helper/api.responses')
const { catchError, removenull, randomStr } = require('../../../helper/utilities.services')
const { sendMail } = require('../../../helper/email.service')
const centerModel = require('../Auth/center.model')
const IssueCategoryModel = require('../../admin/issue-category/counsellor_issue_category.model')
const CenterSupportModel = require('./center_support.model')
const { Op } = require('sequelize')
const config = require('../../../config/config-file')

class CenterServices {
  async getCenterDetail(req, res) {
    try {
      const center = await centerModel.findOne({ where: { id: req.user.id }, attributes: { exclude: ['password', 'token', 'OTP', 'is_active', 'created_by', 'updated_by', 'created_at', 'updated_at'] } })
      if (!center) {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].data)
        })
      }
      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data),
        data: center
      })
    } catch (error) {
      catchError('center.getCenterDetail', error, req, res)
    }
  }

  async getAllIssueCategory(req, res) {
    try {
      const issueCategoryAll = await IssueCategoryModel.findAll({ where: { is_active: 'y' } })
      if (!issueCategoryAll) {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].data)
        })
      }
      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data),
        data: issueCategoryAll
      })
    } catch (error) {
      catchError('center.getAllIssueCategory', error, req, res)
    }
  }

  async createCenterSupport(req, res) {
    try {
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const { issue_category_id, query_desc } = req.body
      await sendMail(query_desc, config.SUPPORT_EMAIL)

      const sCustomId = randomStr(8, 'string')
      const id = req.user.id
      const counsellorSupport = await CenterSupportModel.create({ custom_id: sCustomId, center_id: id, issue_category_id, query_desc })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: counsellorSupport, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].issueCategory) })
    } catch (error) {
      return await catchError('center.centerSupport', error, req, res)
    }
  }

  async updateCenterDetail(req, res) {
    try {
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const { profile, userName, title, city_id, state_id, country_id, email, mobile } = req.body
      const center = await centerModel.findOne({ where: { id: req.user.id, is_active: 'y', deleted_at: null }, attributes: { exclude: ['password', 'token', 'OTP', 'is_active', 'created_by', 'updated_by', 'created_at', 'updated_at'] } })
      if (!center) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].is_not_active_deleted.replace('##', messages[req.userLanguage].center) })

      const titleExist = await centerModel.findAll({
        raw: true,
        where: {
          id: { [Op.not]: req.user.id },
          [Op.or]: [{ email }, { mobile }],
          deleted_at: null
        }
      })
      if (titleExist.length && titleExist[0].email === email) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
      if (titleExist.length && titleExist[0].mobile === mobile) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      // update
      const update = { profile, user_name: userName, title, city_id, state_id, email, mobile, country_id }
      await centerModel.update(update, { where: { id: req.user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].center) })
    } catch (error) {
      catchError('center.getCenterDetail', error, req, res)
    }
  }
}

module.exports = new CenterServices()
