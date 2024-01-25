const { status, messages, jsonStatus } = require('../../../helper/api.responses')
const { catchError, removenull, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const SoftwareMetrixModel = require('./software.matrix.model')
const SoftwareMetrixDetailsModel = require('./software.matrix.details.model')
const careerProfileDetailModel = require('../career-profile/career-profile-detail.model')
const { Op } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')

class SoftwareMetrix {
  async getAllSoftwareMetrics(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const gotAllData = await SoftwareMetrixModel.findAndCountAll({
        where: {
          [Op.or]: [{
            '$careerProfiles.profile_type_det$': {
              [Op.like]: `%${search}%`
            }
          }
          ],
          deleted_at: null
        },
        include: [{
          model: careerProfileDetailModel,
          as: 'careerProfiles',
          where: { deleted_at: null },
          attributes: ['profile_type_det', 'id']
        }],
        order: sorting,
        limit,
        offset: start,
        attributes: ['id', 'career_profile_detail_id', 'test_abb_1', 'test_abb_2', 'test_abb_3', 'sort_order', 'math_dropped', 'science_dropped', 'is_active']
      })
      res.status(status.OK).jsonp({ status: jsonStatus.OK, data: gotAllData, messages: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      catchError('get-all-software-metrics', error, req, res)
    }
  }

  async getSoftwareMetricsById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const gotData = await SoftwareMetrixModel.findOne({
        where: { id: id },
        include: [{
          model: careerProfileDetailModel,
          as: 'careerProfiles',
          where: { deleted_at: null },
          required: false,
          attributes: ['profile_type_det', 'id']
        },
        {
          model: SoftwareMetrixDetailsModel,
          as: 'softwareAllMatrix',
          where: { deleted_at: null },
          required: false,
          attributes: ['id',
            'custom_id',
            'software_matrix_id',
            'test_detail_id',
            'norm_values',
            'is_active']
        }]
      })
      res.status(status.OK).jsonp({ status: jsonStatus.OK, data: gotData, messages: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      catchError('get-all-software-metrics', error, req, res)
    }
  }

  async createSoftwareMetrics(req, res) {
    const t = await sequelize.transaction()
    try {
      removenull(req.body)
      const { testAbb1, testAbb2, testAbb3, sortOrder, careerProfileId, mathDropped, scienceDropped, matrixArray } = req.body
      const customId = await getUniqueString(8, SoftwareMetrixModel)
      const createdData = await SoftwareMetrixModel.create({
        custom_id: customId,
        test_abb_1: testAbb1,
        test_abb_2: testAbb2,
        test_abb_3: testAbb3,
        sort_order: sortOrder,
        career_profile_detail_id: careerProfileId,
        math_dropped: mathDropped,
        science_dropped: scienceDropped
      }, { transaction: t })
      for (let index = 0; index < matrixArray.length; index++) {
        const customId = await getUniqueString(8, SoftwareMetrixDetailsModel)
        matrixArray[index].custom_id = customId
        matrixArray[index].software_matrix_id = createdData.id
        await SoftwareMetrixDetailsModel.create(matrixArray[index], { transaction: t })
      }
      await t.commit()
      res.status(status.OK).jsonp({ status: jsonStatus.OK, data: createdData, messages: messages[req.userLanguage].generate_success.replace('##', messages[req.userLanguage].SoftwareMetrix) })
    } catch (error) {
      await t.rollback()
      catchError('get-create-software-metrics', error, req, res)
    }
  }

  async updateSoftwareMetrics(req, res) {
    const t = await sequelize.transaction()
    try {
      removenull(req.body)
      const { id, updateType, isActive, testAbb1, testAbb2, testAbb3, sortOrder, careerProfileId, mathDropped, scienceDropped, matrixArray } = req.body
      const existSoftwareMetrics = await SoftwareMetrixModel.findOne({ where: { id } })
      if (existSoftwareMetrics) {
        if (updateType && updateType === 'status') {
          await SoftwareMetrixModel.update({ is_active: isActive }, { where: { id: id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, messages: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].SoftwareMetrix) })
        } else {
          const customId = await getUniqueString(8, SoftwareMetrixModel)
          await SoftwareMetrixModel.update({
            custom_id: customId,
            test_abb_1: testAbb1,
            test_abb_2: testAbb2,
            test_abb_3: testAbb3,
            sort_order: sortOrder,
            career_profile_detail_id: careerProfileId,
            math_dropped: mathDropped,
            science_dropped: scienceDropped
          }, { where: { id } }, { transaction: t })
          for (let index = 0; index < matrixArray.length; index++) {
            if (matrixArray[index].id) {
              await SoftwareMetrixDetailsModel.update({ norm_values: matrixArray[index].norm_values, test_detail_id: matrixArray[index].test_detail_id }, { where: { id: matrixArray[index].id } }, { transaction: t })
            } else {
              const customId = await getUniqueString(8, SoftwareMetrixDetailsModel)
              matrixArray[index].custom_id = customId
              matrixArray[index].software_matrix_id = existSoftwareMetrics.id
              await SoftwareMetrixDetailsModel.create(matrixArray[index], { transaction: t })
            }
          }
          await t.commit()
          res.status(status.OK).jsonp({ status: jsonStatus.OK, messages: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].SoftwareMetrix) })
        }
      } else {
        res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, messages: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].SoftwareMetrix) })
      }
    } catch (error) {
      await t.rollback()
      catchError('get-update-software-metrics', error, req, res)
    }
  }

  async deletesoftwareMetrix(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await SoftwareMetrixModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].SoftwareMetrix) })

      const deletdSoftwareMetrix = await SoftwareMetrixModel.update({ deleted_at: new Date() }, { where: { id: id } })
      if (deletdSoftwareMetrix) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].SoftwareMetrix) })
    } catch (error) {
      return await catchError('softwareMetrix.deletesoftwareMetrix', error, req, res)
    }
  }

  async deletesoftwareMetrixDetails(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await SoftwareMetrixDetailsModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].data) })

      const deletdSoftwareMetrixDetails = await SoftwareMetrixDetailsModel.update({ deleted_at: new Date() }, { where: { id: id } })
      if (deletdSoftwareMetrixDetails) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('softwareMetrix.deletesoftwareMetrixDetails', error, req, res)
    }
  }
}

module.exports = new SoftwareMetrix()
