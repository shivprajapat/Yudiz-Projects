/* eslint-disable camelcase */
const { catchError, removenull, randomStr, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const SchoolModel = require('./schools.model')
const CountryModel = require('../../common/country/country.model')
const CenterModel = require('../../center/Auth/center.model')
const StateModel = require('../state/state.model')
const CityModel = require('../city/city.model')
const { Op, Sequelize } = require('sequelize')

class SchoolService {
  async getSchoolById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await SchoolModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].school) })
      const school = await SchoolModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        },
        include: [{
          model: CountryModel,
          as: 'countries',
          attributes: ['id', 'title']
        },
        {
          model: StateModel,
          as: 'states',
          attributes: ['id', 'title']
        },
        {
          model: CityModel,
          as: 'city',
          attributes: ['id', 'title']
        }]
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: school, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('school.getAllSchool', error, req, res)
    }
  }

  async getAllSchool(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const countAll = await SchoolModel.count({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$centers.title$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$countries.title$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$states.title$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$city.title$': {
                [Op.like]: `%${search}%`
              }
            }
          ],
          deleted_at: null
        },
        include: [{
          model: CenterModel,
          as: 'centers',
          attributes: []
        },
        {
          model: CountryModel,
          as: 'countries',
          attributes: []
        },
        {
          model: StateModel,
          as: 'states',
          attributes: []
        },
        {
          model: CityModel,
          as: 'city',
          attributes: []
        }]
      })

      const schools = await SchoolModel.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$centers.title$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$countries.title$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$states.title$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$city.title$': {
                [Op.like]: `%${search}%`
              }
            }
          ],
          deleted_at: null
        },
        include: [{
          model: CenterModel,
          as: 'centers',
          attributes: []
        },
        {
          model: CountryModel,
          as: 'countries',
          attributes: []
        },
        {
          model: StateModel,
          as: 'states',
          attributes: []
        },
        {
          model: CityModel,
          as: 'city',
          attributes: []
        }],
        attributes: ['id', 'title', 'is_active', 'custom_id', 'address_1', 'address_2', 'area', 'pin_code', 'contact_name', 'contact_email', 'contact_mobile', [Sequelize.col('centers.title'), 'center_name'], [Sequelize.col('countries.title'), 'country_name'], [Sequelize.col('states.title'), 'state_name'], [Sequelize.col('city.title'), 'city_name']],
        order: sorting,
        limit,
        offset: start
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: schools, total: countAll, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('school.getAllSchool', error, req, res)
    }
  }

  async createSchool(req, res) {
    try {
      removenull(req.body)
      const { title, center_id, abbreviation, address_1, address_2, area, county_id, state_id, city_id, board_id, pin_code, contact_name, contact_email, contact_mobile } = req.body
      const sCustomId = randomStr(8, 'string')

      const exist = await SchoolModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].school) })

      const school = await SchoolModel.create({ custom_id: sCustomId, title, abbreviation, center_id, address_1, address_2, area, county_id, state_id, city_id, board_id, pin_code, contact_name, contact_email, contact_mobile })
      if (school) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: school, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].school) })
    } catch (error) {
      return await catchError('school.createSchool', error, req, res)
    }
  }

  async updateSchool(req, res) {
    try {
      const { id, title, center_id, address_1, address_2, area, county_id, state_id, city_id, pin_code, contact_name, contact_email, contact_mobile, isActive, updateType, board_id, abbreviation } = req.body
      removenull(req.body)

      const exist = await SchoolModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await SchoolModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].school) })
        } else {
          const titleExist = await SchoolModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].school) })
          await SchoolModel.update({ title, center_id, address_1, address_2, area, county_id, state_id, city_id, pin_code, contact_name, contact_email, contact_mobile, board_id, abbreviation }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].school) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].school) })
      }
    } catch (error) {
      return await catchError('school.updateSchool', error, req, res)
    }
  }

  async deleteSchool(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await SchoolModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].school) })

      const school = await SchoolModel.update({ deleted_at: new Date() }, { where: { id: id } })
      if (school) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].school) })
    } catch (error) {
      return await catchError('school.deleteSchool', error, req, res)
    }
  }
}

module.exports = new SchoolService()
