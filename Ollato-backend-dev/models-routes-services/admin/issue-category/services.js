/* eslint-disable camelcase */
const { catchError, removenull } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { randomStr } = require('../../../helper/utilities.services')
const IssueCategoryModel = require('./counsellor_issue_category.model')
const { Op } = require('sequelize')

class CounsellorAvailService {
  async createIssueCategory(req, res) {
    try {
      removenull(req.body)
      const { title } = req.body

      const exist = await IssueCategoryModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].issueCategory) })

      const sCustomId = randomStr(8, 'string')
      const issue = await IssueCategoryModel.create({ custom_id: sCustomId, title })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: issue, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].issueCategory) })
    } catch (error) {
      return await catchError('issueCategory.IssueCategory', error, req, res)
    }
  }

  async updateIssueCategory(req, res) {
    try {
      const { title, id, updateType, isActive } = req.body
      removenull(req.body)

      const exist = await IssueCategoryModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await IssueCategoryModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].issueCategory) })
        } else {
          const titleExist = await IssueCategoryModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.BadRequest).jsonp({ status: status.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].issueCategory) })

          await IssueCategoryModel.update({ title }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].issueCategory) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].issueCategory) })
      }
    } catch (error) {
      return await catchError('issue.issueCategory', error, req, res)
    }
  }

  async deleteIssueCategory(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await IssueCategoryModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].issueCategory) })

      const issue = await IssueCategoryModel.update({ deleted_at: new Date() }, { raw: true, where: { id: id } })
      if (issue) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].issueCategory) })
    } catch (error) {
      return await catchError('issue.IssueCategory', error, req, res)
    }
  }
}

module.exports = new CounsellorAvailService()
