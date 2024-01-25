/* eslint-disable camelcase */
const { catchError, removenull, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const packageModel = require('./package.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { Op } = require('sequelize')
class PackageServices {
  async getPackageById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const packages = await packageModel.findOne({ where: { id, deleted_at: null } })
      if (!packages) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].package) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].package) })
    } catch (error) {
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async getAll(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const packages = await packageModel.findAndCountAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        },
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async createPackage(req, res) {
    try {
      removenull(req.body)
      const {
        title,
        amount,
        description,
        package_number,
        package_type,
        online_test,
        test_report,
        video_call,
        f2f_call,
        is_active,
        gst_percent
      } = req.body
      const existPackage = await packageModel.findOne({ where: { title, deleted_at: null } })
      if (existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].package) })
      const customId = await getUniqueString(8, packageModel)
      const gst = gst_percent || 18
      const createdPackage = await packageModel.create({ custom_id: customId, title, package_number, package_type, test_report, online_test, video_call, f2f_call, amount, description, is_active, gst_percent: gst })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: createdPackage, message: messages[req.userLanguage].generate_success.replace('##', messages[req.userLanguage].package) })
    } catch (error) {
      return await catchError('packages.createPackage', error, req, res)
    }
  }

  async updatePackage(req, res) {
    try {
      removenull(req.body)
      const {
      // eslint-disable-next-line camelcase
        title,
        amount,
        description,
        package_number,
        package_type,
        online_test,
        test_report,
        video_call,
        f2f_call,
        id,
        updateType,
        isActive,
        gst_percent
      } = req.body
      const existPackage = await packageModel.findOne({ where: { id, deleted_at: null } })
      if (existPackage) {
        if (updateType && updateType === 'status') {
          await packageModel.update({ is_active: isActive }, { where: { id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].package) })
        } else {
          const titleExist = await packageModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].package) })
          const gst = gst_percent || 18
          await packageModel.update({ title, amount, description, package_number, package_type, test_report, online_test, video_call, f2f_call, gst_percent: gst }, { where: { id: id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].package) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].package) })
      }
    } catch (error) {
      return await catchError('packages.updatePackage', error, req, res)
    }
  }

  async deletePackage(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await packageModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].package) })

      await packageModel.update({ deleted_at: new Date() }, { where: { id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].package) })
    } catch (error) {
      return await catchError('packages.deletePackage', error, req, res)
    }
  }
}
module.exports = new PackageServices()
