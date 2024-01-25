const { catchError, removenull, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const cityModel = require('./city.model')
const countryModel = require('../../common/country/country.model')
const stateModel = require('../state/state.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { Op, Sequelize } = require('sequelize')

class CityServices {
  async getCityById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const cities = await cityModel.findOne({
        where: {
          id,
          deleted_at: null
        },
        include: [{
          model: countryModel,
          as: 'country',
          attributes: ['id', 'title']
        },
        {
          model: stateModel,
          as: 'states',
          attributes: ['id', 'title']
        }
        ]
      })
      if (!cities) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].city) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: cities, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].city) })
    } catch (error) {
      return await catchError('city.getAllPackage', error, req, res)
    }
  }

  async getAll(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const countAll = await cityModel.count({
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
            },
            {
              '$states.title$': {
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
        },
        {
          model: stateModel,
          as: 'states',
          attributes: []
        }
        ],
        order: sorting,
        limit,
        offset: start
      })
      const packages = await cityModel.findAll({
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
            },
            {
              '$states.title$': {
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
        },
        {
          model: stateModel,
          as: 'states',
          attributes: []
        }
        ],
        attributes: ['id', 'title', 'abbreviation', 'is_active', [Sequelize.col('country.title'), 'country_name'], [Sequelize.col('states.title'), 'state_name']],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, total: countAll, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async createCity(req, res) {
    try {
      removenull(req.body)
      const { title, countyId, stateId, abbreviation } = req.body

      const exist = await cityModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].city) })

      const customId = await getUniqueString(8, cityModel)
      const createdCity = await cityModel.create({ custom_id: customId, title, county_id: countyId, state_id: stateId, abbreviation })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: createdCity, message: messages[req.userLanguage].generate_success.replace('##', messages[req.userLanguage].city) })
    } catch (error) {
      return await catchError('city.createdCity', error, req, res)
    }
  }

  async updateCity(req, res) {
    try {
      removenull(req.body)
      const { title, countyId, stateId, abbreviation, id, updateType, isActive } = req.body

      const exist = await cityModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await cityModel.update({ is_active: isActive }, { where: { id: id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].city) })
        } else {
          const titleExist = await cityModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].board) })
          await cityModel.update({ title, county_id: countyId, state_id: stateId, abbreviation }, { where: { id: id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].city) })
        }
      }

      const updated = await cityModel.update({ title, county_id: countyId, state_id: stateId, abbreviation }, { where: { id, deleted_at: null } })
      if (updated[0] === 0) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].city) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].city) })
    } catch (error) {
      return await catchError('cities.updateCities', error, req, res)
    }
  }

  async deleteCity(req, res) {
    try {
      // testing
      removenull(req.body)
      const { id } = req.body

      const exist = await cityModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].city) })

      await cityModel.update({ deleted_at: new Date() }, { where: { id: id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].city) })
    } catch (error) {
      return await catchError('packages.deletePackage', error, req, res)
    }
  }
}
module.exports = new CityServices()
