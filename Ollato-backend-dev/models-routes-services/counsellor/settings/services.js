/* eslint-disable camelcase */
const { catchError, removenull } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { validatePassword, randomStr } = require('../../../helper/utilities.services')
const CounsellorModel = require('../counsellor.model')
const IssueCategoryModel = require('../../admin/issue-category/counsellor_issue_category.model')
const CounsellorSupportModel = require('./counsellor_support.model')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(1)
const { sendMail } = require('../../../helper/email.service')

class CounsellorSettingsService {
  async changePassword(req, res) {
    try {
      removenull(req.body)
      const { currentPassword, confirmPassword, password } = req.body
      if (!validatePassword(password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass.replace('##', messages[req.userLanguage].ssPassword) })
      if (confirmPassword !== password) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const user = await CounsellorModel.findOne({ raw: true, where: { id: req.user.id } })
      if (!user) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      if (!bcrypt.compareSync(currentPassword, user.password)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
      await CounsellorModel.update({ password: bcrypt.hashSync(password, salt) }, { where: { id: req.user.id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].change_password.replace('##', messages[req.userLanguage].ssPassword) })
    } catch (error) {
      return await catchError('UserAuth.changePassword', error, req, res)
    }
  }

  async getAllIssueCategory(req, res) {
    try {
      const schools = await IssueCategoryModel.findAll({ where: { deleted_at: null } })
      if (!schools.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'Issue category') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: schools })
    } catch (error) {
      return await catchError('counsellor.settings.issuecategories', error, req, res)
    }
  }

  async createCounsellorSupport(req, res) {
    try {
      removenull(req.body)
      const { issue_category_id, query_desc } = req.body
      const counsellor_id = req.user.id

      await sendMail(query_desc, 'parth.panchal@yudiz.com')

      const sCustomId = randomStr(8, 'string')
      const counsellorSupport = await CounsellorSupportModel.create({ custom_id: sCustomId, counsellor_id, issue_category_id, query_desc })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: counsellorSupport, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].issueCategory) })
    } catch (error) {
      return await catchError('counsellor.counsellorSupport', error, req, res)
    }
  }
}

module.exports = new CounsellorSettingsService()
