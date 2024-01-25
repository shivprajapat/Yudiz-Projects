/* eslint-disable camelcase */
const { removenull, catchError, validateEmail, validateMobile, randomStr, getPaginationValues, getIncrementNumber, getUniqueString } = require('../../../helper/utilities.services')
const StudentModel = require('../../student/auth/student.model')
const StudentDetailModel = require('../../student/auth/student_details.model')
const StateModel = require('../../admin/state/state.model')
const CountryModel = require('../../common/country/country.model')
const CityModel = require('../../admin/city/city.model')
const GradeModel = require('../../admin/grade/grade.model')
const SchoolModel = require('../../admin/school/schools.model')
const BoardModel = require('../../admin/board/board.model')
const CounsellorModel = require('../../counsellor/counsellor.model')
const centerPackageModel = require('../packages/center.packages.model')
const studentPackageModel = require('../../student/package/student.packages.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { Op, Sequelize } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')
const bcrypt = require('bcryptjs')
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)
const { sendMailPassword } = require('../../../helper/email.service')
const config = require('../../../config/config-file')

class StudentServices {
  async getStudentById(req, res) {
    try {
      const { id } = req.body
      removenull(req.body)
      const students = await StudentModel.findOne({
        where: { id, deleted_at: null, center_id: req.user.id },
        attributes: ['id', 'center_id', 'counselor_id', 'user_name', 'first_name', 'middle_name', 'last_name', 'email', 'mobile', 'dob', 'gender', 'profile', 'math_dropped', 'science_dropped', 'father_name', 'mother_name'],
        include: [
          {
            model: StudentDetailModel,
            as: 'studentDetails',
            attributes: ['pin_code', 'school_name', 'nationality', 'school_address_1', 'school_address_2', 'school_pin_code'],
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
              include: [
                {
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
                }
              ]
            }]
          },
          {
            model: CounsellorModel,
            as: 'counselors',
            attributes: ['id', 'center_id', 'user_name', 'first_name', 'middle_name', 'last_name', 'email', 'mobile', 'avg_ratings']
          }
        ]
      })
      if (!students) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].student) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: students, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].student) })
    } catch (error) {
      return await catchError('student.getAllStudent', error, req, res)
    }
  }

  async getAll(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const student = await StudentModel.findAndCountAll({
        where: {
          [Op.or]: [
            {
              first_name: {
                [Op.like]: `%${search}%`
              }
            },
            {
              middle_name: {
                [Op.like]: `%${search}%`
              }
            },
            {
              last_name: {
                [Op.like]: `%${search}%`
              }
            },
            {
              email: {
                [Op.like]: `%${search}%`
              }
            },
            {
              mobile: {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$studentDetails.countries.title$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$studentDetails.states.title$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$studentDetails.cities.title$': {
                [Op.like]: `%${search}%`
              }
            }
          ],
          deleted_at: null,
          center_id: req.user.id
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
            },
            {
              model: GradeModel,
              as: 'grades',
              attributes: []
            },
            {
              model: SchoolModel,
              as: 'schools',
              attributes: []
            },
            {
              model: BoardModel,
              as: 'boards',
              attributes: []
            }]
          }
        ],
        attributes: ['id', 'first_name', 'middle_name', 'last_name', 'email', 'mobile', 'dob', 'gender', 'father_name', 'mother_name', 'profile', 'is_active', 'deleted_at', 'math_dropped', 'science_dropped', [Sequelize.col('studentDetails.countries.title'), 'countries_title'], [Sequelize.col('studentDetails.states.title'), 'states_title'], [Sequelize.col('studentDetails.cities.title'), 'cities_title'], [Sequelize.col('studentDetails.nationality'), 'nationality'], [Sequelize.col('studentDetails.school_address_1'), 'school_address_1'], [Sequelize.col('studentDetails.school_name'), 'school_name'], [Sequelize.col('studentDetails.school_address_2'), 'school_address_2'], [Sequelize.col('studentDetails.school_pin_code'), 'school_pin_code'], [Sequelize.col('studentDetails.grades.title'), 'grades_title'], [Sequelize.col('studentDetails.schools.title'), 'schools_title'], [Sequelize.col('studentDetails.boards.title'), 'boards_title']],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: student, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async createStudent(req, res) {
    try {
      // students model
      // eslint-disable-next-line camelcase
      const { counselor_id, first_name, middle_name, last_name, mobile, dob, gender, country_id, father_name, mother_name, is_verify, verified_at, state_id, city_id, student_pin_code, grade_id, board_id, school_id, school_name, nationality, math_dropped, science_dropped, package_id } = req.body

      removenull(req.body)
      // eslint-disable-next-line camelcase
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)

      let email
      if (req.body.email && req.body.email != null) {
        email = req.body.email || null
        email = email.toLowerCase().trim()

        const isEmail = await validateEmail(email)
        if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })
      }

      const query = [
        { mobile },
        { user_name: sUsername }
      ]
      if (email) query.push({ email })

      const userExist = await StudentModel.findOne({
        raw: true,
        where: {
          [Op.or]: query,
          deleted_at: null
        }
      })

      if (!validateMobile(mobile)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      // const isEmail = await validateEmail(email)
      // if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })

      // const userExist = await StudentModel.findOne({ where: { [Op.or]: [{ email: email }, { mobile: mobile }, { user_name: sUsername }], deleted_at: null } })
      if (userExist && userExist.user_name === sUsername) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username) })
      if (userExist && userExist.mobile === mobile) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      if (email) {
        if (userExist && userExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
      }

      let packageDetail
      if (package_id) {
        packageDetail = await centerPackageModel.findOne({
          raw: true,
          where: {
            center_id: req.user.id,
            package_id,
            [Op.and]: [
              { payment_status: { [Op.eq]: 'C' } },
              { remaining_packages: { [Op.gt]: 0 } }
            ]
          },
          order: [['purchase_date', 'ASC']]
        })
        if (!packageDetail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package })
      }

      let transaction
      try {
        transaction = await sequelize.transaction()

        const password = await generatePassword(8)
        const sPassword = bcrypt.hashSync(password, salt)
        const sCustomId = randomStr(8, 'string')

        /** check last ollato number */
        const lastStudentRecord = await StudentModel.findOne({
          raw: true,
          attributes: ['id', 'ollato_code'],
          order: [
            ['id', 'DESC']
          ]
        })
        let id = ''
        if (lastStudentRecord) {
          id = lastStudentRecord.ollato_code
        }
        const getOllatoNumber = await getIncrementNumber('student', id)

        const student = await StudentModel.create({ custom_id: sCustomId, ollato_code: getOllatoNumber, center_id: req.user.id, counselor_id, slug: sUsername, user_name: sUsername, password: sPassword, first_name, middle_name, last_name, email, mobile, dob, gender, mother_name, father_name, math_dropped, science_dropped, is_verify, verified_at, created_by: 'center' }, { transaction })
        student.setDataValue('password', null)

        const sCustomIdStudentDetail = randomStr(8, 'string')
        await StudentDetailModel.create({ custom_id: sCustomIdStudentDetail, student_id: student.getDataValue('id'), country_id, state_id, city_id, pin_code: student_pin_code, grade_id, board_id, school_id, school_name, nationality, created_by: 'center' }, { transaction })

        if (packageDetail) {
          const customId = await getUniqueString(8, studentPackageModel)
          const onlineTest = packageDetail.onlineTest ? 1 : 0
          const testReport = packageDetail.testReport ? 1 : 0
          const videoCall = packageDetail.videoCall ? 1 : 0
          const f2fCall = packageDetail.f2fCall ? 1 : 0
          const cDate = new Date()
          var expireDate = new Date(cDate.setMonth(cDate.getMonth() + 1))

          await studentPackageModel.create({ student_id: student.getDataValue('id'), center_id: req.user.id, custom_id: customId, package_id, package_type: packageDetail.package_type, payment_status: 'C', purchase_date: new Date(), expireDate, order_id: packageDetail.order_id, onlineTest, testReport, videoCall, f2fCall }, { transaction })

          await centerPackageModel.update({ assigned_packages: packageDetail.assigned_packages + 1, remaining_packages: packageDetail.remaining_packages - 1 }, { where: { order_id: packageDetail.order_id } }, { transaction })
        }
        await transaction.commit()

        // send password email
        const name = first_name.concat(' ', last_name)
        let resp
        if (!email) {
          resp = await sendMailPassword(password, name, config.RECEIVER_EMAIL)
          if (resp === undefined) throw Error()
        } else {
          resp = await sendMailPassword(password, name, email)
          if (resp === undefined) throw Error()
        }
        // const resp = await sendMailPassword(password, email)
        // if (resp === undefined) throw Error()

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: student, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].student) })
      } catch (error) {
        await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('StudentService.register', error, req, res)
    }
  }

  async updateStudent(req, res) {
    try {
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const { id, updateType, isActive, counselor_id, first_name, middle_name, last_name, mobile, dob, gender, country_id, father_name, mother_name, state_id, city_id, student_pin_code, grade_id, board_id, school_id, school_name, nationality, math_dropped, science_dropped } = req.body

      const exist = await StudentModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          let transaction
          try {
            transaction = await sequelize.transaction()
            await StudentModel.update({ is_active: isActive }, { where: { id: id, deleted_at: null } }, { transaction })

            await StudentDetailModel.update({ is_active: isActive }, { where: { student_id: id, deleted_at: null } }, { transaction })

            await transaction.commit()
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].student) })
          } catch (error) {
            await transaction.rollback()
            return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
          }
        } else {
          let email
          if (req.body.email != null) {
            email = req.body.email || null
            email = email.toLowerCase().trim()

            const isEmail = await validateEmail(email)
            if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })
          }

          const conditions = { id: { $ne: id }, mobile, deleted_at: null }
          if (email) {
            conditions.email = email
          }

          const titleExist = await StudentModel.findAll({
            raw: true,
            where: conditions
          })

          // const titleExist = await StudentModel.findAll({ raw: true, where: { id: { [Op.not]: id }, mobile, email, deleted_at: null } })

          if (email) {
            if (titleExist.length && titleExist[0].email === email) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
          }

          if (titleExist.length && titleExist[0].mobile === mobile) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })

          let transac
          try {
            transac = await sequelize.transaction()

            await StudentModel.update({ center_id: req.user.id, counselor_id, first_name, middle_name, last_name, email, mobile, dob, gender, mother_name, father_name, math_dropped, science_dropped, updated_by: 'center' }, { where: { id, deleted_at: null } }, { transac })

            await StudentDetailModel.update({ country_id, state_id, city_id, pin_code: student_pin_code, grade_id, board_id, school_id, school_name, nationality, updated_by: 'center' }, { where: { student_id: id, deleted_at: null } }, { transac })

            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].student) })
          } catch (error) {
            await transac.rollback()
            return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })
          }
        }
      }
    } catch (error) {
      return await catchError('student.updateStudent', error, req, res)
    }
  }

  async deleteStudent(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await StudentModel.findOne({ where: { id, deleted_at: null, center_id: req.user.id } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].student) })

      let transaction
      try {
        transaction = await sequelize.transaction()

        await StudentModel.update({ deleted_at: new Date() }, { where: { id } }, { transaction })
        await StudentDetailModel.update({ deleted_at: new Date() }, { where: { student_id: id } }, { transaction })
        await transaction.commit()

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].student) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('packages.deletePackage', error, req, res)
    }
  }
}

// To get new generated username
const getUniqueUserName = async(sName) => {
  try {
    let sUsername = sName.replace(/\s/g, '').toLowerCase()

    if (sUsername.length > 15) sUsername = sUsername.slice(0, -(sUsername.length - 15))
    const verified = await checkUserName(sUsername)
    if (verified instanceof Error) return new Error('Username verification failed!')
    return verified
  } catch (error) {
    return new Error(error)
  }
}

// To verify if username already exist then increment counter
const checkUserName = async (sUsername) => {
  try {
    const exists = await StudentModel.findOne({ where: { user_name: sUsername } })
    if (exists) {
      let nDigit = exists.user_name.match(/\d+/g) ? exists.user_name.match(/\d+/g)[0] : 0
      nDigit = Number(nDigit) || 0
      sUsername = exists.user_name.match(/[a-zA-Z]+/g)[0].concat(nDigit + 1)

      return await checkUserName(sUsername)
    } else {
      return sUsername
    }
  } catch (error) {
    return new Error(error)
  }
}

// Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters.
const generatePassword = async (passwordLength) => {
  try {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
    const upperCase = lowerCase.toUpperCase()
    const numberChars = '0123456789'
    const specialChars = '!"@$%+-_?^&*()'

    let generatedPassword = ''
    let restPassword = ''

    const restLength = passwordLength % 4
    const usableLength = passwordLength - restLength
    const generateLength = usableLength / 4

    const randomString = (char) => {
      return char[Math.floor(Math.random() * (char.length))]
    }
    for (let i = 0; i <= generateLength - 1; i++) {
      generatedPassword += `${randomString(lowerCase)}${randomString(upperCase)}${randomString(numberChars)}${randomString(specialChars)}`
    }

    for (let i = 0; i <= restLength - 1; i++) {
      restPassword += randomString([...lowerCase, ...upperCase, ...numberChars, ...specialChars])
    }
    return generatedPassword + restPassword
  } catch (error) {
    return new Error(error)
  }
}

module.exports = new StudentServices()
