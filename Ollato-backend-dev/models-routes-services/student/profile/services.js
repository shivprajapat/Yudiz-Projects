const { catchError, validateEmail, validateMobile } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const studentModel = require('../auth/student.model')
const studentDetailsModel = require('../auth/student_details.model')
const CountryModel = require('../../../models-routes-services/common/country/country.model')
const StateModel = require('../../admin/state/state.model')
const CityModel = require('../../admin/city/city.model')
const GradeModel = require('../../admin/grade/grade.model')
const SchoolModel = require('../../admin/school/schools.model')
const BoardModel = require('../../admin/board/board.model')
const { sequelize } = require('../../../database/sequelize')
const { Op } = require('sequelize')

class ProfileService {
  async getLoginStudentDetails(req, res) {
    try {
      const { id } = req.user
      const loginUser = await studentModel.findOne({
        where: { id },
        include: {
          model: studentDetailsModel,
          as: 'studentDetails',
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
            as: 'cities',
            attributes: ['id', 'title']
          },
          {
            model: CountryModel,
            as: 'school_country',
            attributes: ['id', 'title']
          },
          {
            model: StateModel,
            as: 'school_state',
            attributes: ['id', 'title']
          },
          {
            model: CityModel,
            as: 'school_city',
            attributes: ['id', 'title']
          },
          {
            model: GradeModel,
            as: 'grades',
            attributes: ['id', 'title']
          },
          {
            model: BoardModel,
            as: 'boards',
            attributes: ['id', 'title']
          },
          {
            model: SchoolModel,
            as: 'schools',
            attributes: ['id', 'title']
          }]
        },
        attributes: { exclude: ['token', 'is_active', 'password', 'OTP', 'slug', 'created_by', 'updated_by', 'verified_at', 'updated_at', 'is_verify', 'created_at'] }
      })
      if (loginUser) {
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'user'), data: loginUser })
      }
    } catch (error) {
      return await catchError('student.profile.details', error, req, res)
    }
  }

  async updateUserProfile(req, res) {
    try {
      const { id } = req.user
      // eslint-disable-next-line camelcase
      const { firstName, lastName, motherName, fatherName, dob, mobile, nationality, sCountryId, sStateId, sCityId, sPinCode, grade, board, school_name, sAddress1, sAddress2, countryId, stateId, cityId, pinCode, mathDropped, scienceDropped, profile } = req.body
      let transaction
      try {
        const student = await studentModel.findOne({
          where: { id }
        })
        if (student) {
          let email
          if (req.body.email && req.body.email !== null) {
            email = req.body.email || null
            email = email.toLowerCase().trim()

            const isEmail = await validateEmail(email)
            if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })
          }

          const query = [
            { mobile }
          ]
          if (email) query.push({ email })

          const userExist = await studentModel.findOne({
            raw: true,
            where: {
              [Op.and]: [
                {
                  [Op.or]: query,
                  deleted_at: null
                },
                {
                  id: { [Op.not]: req.user.id }
                }
              ]
            }
          })

          if (!validateMobile(mobile)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

          if (userExist && userExist.mobile === mobile) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
          if (email) {
            if (userExist && userExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
          }

          transaction = await sequelize.transaction()
          await studentModel.update({
            first_name: firstName,
            father_name: fatherName,
            middle_name: fatherName,
            last_name: lastName,
            email,
            mobile,
            dob,
            mother_name: motherName,
            profile,
            math_dropped: mathDropped,
            science_dropped: scienceDropped
          }, { where: { id } }, { transaction })

          await studentDetailsModel.update({
            country_id: countryId,
            state_id: stateId,
            city_id: cityId,
            pin_code: pinCode,
            nationality: nationality,
            school_country_id: sCountryId,
            school_state_id: sStateId,
            school_city_id: sCityId,
            school_pin_code: sPinCode,
            grade_id: grade,
            board_id: board,
            school_name,
            school_address_1: sAddress1,
            school_address_2: sAddress2
          }, { where: { student_id: id } }, { transaction })

          await transaction.commit()
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].user) })
        } else {
          return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'Student') })
        }
      } catch (error) {
        if (transaction) {
          await transaction.rollback()
        }
        return await catchError('updateUserProfile', error, req, res)
      }
    } catch (error) {
      return await catchError('updateUserProfile', error, req, res)
    }
  }
}

module.exports = new ProfileService()
