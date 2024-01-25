/* eslint-disable no-useless-escape */
const { admins: AdminsModel } = require('../../../model')

const controllers = {}

controllers.getAdmin = async ({ request }, cb) => {
  try {
    const { iAdminId } = request

    const admin = await AdminsModel.findOne({ _id: iAdminId }).lean()
    cb(null, admin || '')
  } catch (error) {
    cb(error, null)
  }
}

module.exports = controllers
