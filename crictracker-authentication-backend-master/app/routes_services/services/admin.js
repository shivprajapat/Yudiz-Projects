const { admins: AdminsModel } = require('../../model')

class Admin {
  async getAdminName(req, res) {
    try {
      const { iAdminId } = req.params

      const admin = await AdminsModel.findOne({ _id: iAdminId }).lean()
      return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: messages.english.fetchSuccess.message.replace('##', messages.english.link), data: admin.sUName })
    } catch (error) {
      return res.status(messages.status.statusInternalError).jsonp({ status: messages.status.statusInternalError, message: messages.english.wentWrong.message })
    }
  }
}
module.exports = new Admin()
