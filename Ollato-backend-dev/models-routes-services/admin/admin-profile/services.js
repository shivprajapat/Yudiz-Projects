const adminModel = require('../auth/admin.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { removenull, catchError } = require('../../../helper/utilities.services')
const { Op } = require('sequelize')

class AdminService {
  async getAdminProfile(req, res) {
    try {
      const exist = await adminModel.findOne({
        where: { id: req.user.id, is_active: 'y', deleted_at: null },
        attributes: { exclude: ['password', 'created_by', 'updated_by', 'deleted_at', 'created_at', 'updated_at', 'OTP', 'token', 'slug'] }
      })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].admin) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: exist, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('admin.getAllAdmin', error, req, res)
    }
  }

  async updateAdminProfile(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { first_name, last_name, mobile, email, profile } = req.body
      removenull(req.body)

      const exist = await adminModel.findOne({ where: { id: req.user.id, deleted_at: null } })
      if (exist) {
        const titleExist = await adminModel.findAll({
          raw: true,
          where: {
            id: { [Op.not]: req.user.id },
            [Op.or]: [{ email }, { mobile }],
            deleted_at: null
          }
        })
        if (titleExist.length) return res.status(status.BadRequest).jsonp({ status: status.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].admin) })

        await adminModel.update({ first_name, last_name, mobile, email, profile_pic: profile }, { where: { id: req.user.id } })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].cprofile) })
      } else {
        return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].admin) })
      }
    } catch (error) {
      return await catchError('admin.updateAdmin', error, req, res)
    }
  }
}

module.exports = new AdminService()
