const { catchError, removenull, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const stateModel = require('./state.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { Op, Sequelize } = require('sequelize')
const countryModel = require('../../common/country/country.model')
class StateServices {
  async getStateById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const state = await stateModel.findOne({
        where: {
          id,
          deleted_at: null
        },
        include: [{
          model: countryModel,
          as: 'country',
          attributes: ['id', 'title']
        }]
      })
      if (!state) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].state) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: state, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].state) })
    } catch (error) {
      return await catchError('state.getAllPackage', error, req, res)
    }
  }

  async getAllState(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const countAll = await stateModel.count({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$country.title$': {
                [Op.like]: `%${search}%`
              }
            }
          ],
          deleted_at: null
        },
        include: [{
          model: countryModel,
          as: 'country',
          attributes: []
        }
        ]
      })
      const states = await stateModel.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$country.title$': {
                [Op.like]: `%${search}%`
              }
            }
          ],
          deleted_at: null
        },
        include: [{
          model: countryModel,
          as: 'country',
          attributes: []
        }
        ],
        attributes: ['id', 'title', 'abbreviation', 'is_active', [Sequelize.col('country.title'), 'country_name']],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: states, total: countAll, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].state) })
    } catch (error) {
      return await catchError('state.getAllPackage', error, req, res)
    }
  }

  async createState(req, res) {
    try {
      removenull(req.body)
      const {
        title,
        countyId,
        abbreviation
      } = req.body
      const existState = await stateModel.findOne({ where: { title: title, abbreviation: abbreviation, deleted_at: null } })
      if (existState) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].state) })
      const customId = await getUniqueString(8, stateModel)
      const createdPackage = await stateModel.create({ custom_id: customId, title, county_id: countyId, abbreviation })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: createdPackage, message: messages[req.userLanguage].generate_success.replace('##', messages[req.userLanguage].state) })
    } catch (error) {
      return await catchError('state.createPackage', error, req, res)
    }
  }

  async updateState(req, res) {
    try {
      removenull(req.body)
      const {
      // eslint-disable-next-line camelcase
        title,
        countyId,
        abbreviation,
        id,
        updateType,
        isActive
      } = req.body
      const exist = await stateModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await stateModel.update({ is_active: isActive }, { where: { id: id, deleted_at: null } })
          res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].state) })
        } else {
          const titleExist = await stateModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].state) })
          await stateModel.update({ title, county_id: countyId, abbreviation }, { where: { id: id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].state) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].state) })
      }
    } catch (error) {
      return await catchError('state.updatePackage', error, req, res)
    }
  }

  async deleteState(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await stateModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].state) })

      await stateModel.update({ deleted_at: new Date() }, { where: { id: id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].state) })
    } catch (error) {
      return await catchError('state.deletePackage', error, req, res)
    }
  }
}
module.exports = new StateServices()
