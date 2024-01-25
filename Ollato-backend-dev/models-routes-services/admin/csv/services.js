/* eslint-disable camelcase */
const { status, jsonStatus, messages } = require('../../../helper/api.responses')
const { catchError, removenull } = require('../../../helper/utilities.services')
const StudentModel = require('../../student/auth/student.model')
const StudentDetailModel = require('../../student/auth/student_details.model')
const StateModel = require('../../admin/state/state.model')
const CountryModel = require('../../common/country/country.model')
const CityModel = require('../../admin/city/city.model')
const CenterModel = require('../../center/Auth/center.model')
const CounsellorModel = require('../../counsellor/counsellor.model')
const CounsellorDetailModel = require('../../counsellor/counsellor_details.model')
const { Op, Sequelize } = require('sequelize')
// const Excel = require('exceljs')

class AdminServices {
  async csvCenter(req, res) {
    try {
      removenull(req.body)
      const { startDate, endDate } = req.body

      const center = await CenterModel.findAndCountAll({
        where: {
          created_at: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          deleted_at: null
        },
        attributes: ['id', 'ollato_code', 'title', 'email', 'mobile', 'total_amount', 'redeem_amount', 'remaining_amount', 'commission', 'is_active']
      })

      if (!center) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: center, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: center, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('admin.csvCenter', error, req, res)
    }
  }

  async csvStudent(req, res) {
    try {
      removenull(req.body)
      const { startDate, endDate } = req.body

      const student = await StudentModel.findAndCountAll({
        where: {
          deleted_at: null,
          created_at: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        include: [
          {
            model: StudentDetailModel,
            as: 'studentDetails',
            attributes: [],
            include: [{
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
              as: 'cities',
              attributes: []
            }]
          }
        ],
        attributes: ['id', 'ollato_code', 'first_name', 'middle_name', 'last_name', 'email', 'mobile', 'dob', 'gender', 'father_name', 'mother_name', 'math_dropped', 'science_dropped', 'is_active', [Sequelize.col('studentDetails.pin_code'), 'pin_code'], [Sequelize.col('studentDetails.countries.title'), 'countries_title'], [Sequelize.col('studentDetails.states.title'), 'states_title'], [Sequelize.col('studentDetails.cities.title'), 'cities_title'], [Sequelize.col('studentDetails.school_name'), 'school_name'], [Sequelize.col('studentDetails.school_address_1'), 'school_address_1'], [Sequelize.col('studentDetails.school_address_2'), 'school_address_2']]
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: student, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('admin.csvStudent', error, req, res)
    }
  }

  async csvCounsellor(req, res) {
    try {
      removenull(req.body)
      const { startDate, endDate } = req.body

      const counsellor = await CounsellorModel.findAndCountAll({
        where: {
          deleted_at: null,
          created_at: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        include: [
          {
            model: CounsellorDetailModel,
            as: 'details',
            attributes: [],
            include: [{
              model: CountryModel,
              as: 'country',
              attributes: []
            },
            {
              model: StateModel,
              as: 'state',
              attributes: []
            },
            {
              model: CityModel,
              as: 'city',
              attributes: []
            }]
          }
        ],
        attributes: ['id', 'ollato_code', 'first_name', 'middle_name', 'last_name', 'email', 'mobile', 'dob', 'gender', 'is_active', 'career_counsellor', 'psychologist', 'overseas_counsellor', 'subject_expert', [Sequelize.col('details.pin_code'), 'pin_code'], [Sequelize.col('details.country.title'), 'countries_title'], [Sequelize.col('details.state.title'), 'states_title'], [Sequelize.col('details.city.title'), 'cities_title']]
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: counsellor, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('admin.csvCounsellor', error, req, res)
    }
  }
}

module.exports = new AdminServices()
