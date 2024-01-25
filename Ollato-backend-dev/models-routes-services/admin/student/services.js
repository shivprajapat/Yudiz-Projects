/* eslint-disable camelcase */
const { removenull, catchError, validateEmail, validateMobile, randomStr, getPaginationValues, getIncrementNumber } = require('../../../helper/utilities.services')
const StudentModel = require('../../student/auth/student.model')
const StudentDetailModel = require('../../student/auth/student_details.model')
const StateModel = require('../../admin/state/state.model')
const CountryModel = require('../../common/country/country.model')
const CityModel = require('../../admin/city/city.model')
const GradeModel = require('../../admin/grade/grade.model')
const SchoolModel = require('../../admin/school/schools.model')
const BoardModel = require('../../admin/board/board.model')
const CounsellorModel = require('../../counsellor/counsellor.model')
const StudentCalcTest = require('../../student/test/student.calc.test.model')
const StudentTest = require('../../student/test/student.test.model')
const testDetailsModel = require('../../student/test/test.detail.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { Op, Sequelize } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')
const config = require('../../../config/config-file')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)
const { sendMailPassword } = require('../../../helper/email.service')

class StudentServices {
  async getStudentById(req, res) {
    try {
      const { id } = req.body
      removenull(req.body)
      const students = await StudentModel.findOne({
        where: { id, deleted_at: null },
        attributes: ['id', 'center_id', 'counselor_id', 'user_name', 'first_name', 'middle_name', 'last_name', 'email', 'mobile', 'dob', 'gender', 'profile', 'math_dropped', 'science_dropped', 'father_name', 'mother_name'],
        include: [
          {
            model: StudentDetailModel,
            as: 'studentDetails',
            attributes: ['pin_code', 'nationality', 'school_name', 'school_address_1', 'school_address_2', 'school_pin_code'],
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
                  attributes: ['title']
                },
                {
                  model: StateModel,
                  as: 'states',
                  attributes: ['title']
                },
                {
                  model: CityModel,
                  as: 'city',
                  attributes: ['title']
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
      let query
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const { test_status } = req.body

      if (test_status === 'all') {
        const allQuery = {
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
                '$studentDetails.school_name$': {
                  [Op.like]: `%${search}%`
                }
              }
            ],
            deleted_at: null
          },
          include: [
            {
              model: StudentDetailModel,
              as: 'studentDetails',
              attributes: [],
              required: true
            }
          ],
          attributes: ['id', 'custom_id', 'first_name', 'middle_name', 'last_name', 'email', 'is_active'],
          order: sorting,
          limit,
          offset: start
        }

        const student = await StudentModel.findAndCountAll(allQuery)
        student.rows = student.rows.map((ele) => ele.get({ plain: true }))

        const updatedStudentRows = await Promise.all(student.rows.map(async (stud) => {
          const assessmentTest = await StudentCalcTest.findOne({
            raw: true,
            where: {
              student_id: stud.id,
              report_path: {
                [Op.ne]: null
              }
            },
            attributes: ['id', 'custom_id', 'is_submitted']
          })

          // eslint-disable-next-line camelcase
          if (test_status === 'all' && !assessmentTest) {
            return {
              ...stud,
              test_status: 'pending'
            }
          }

          if (assessmentTest) {
            const totalTest = await testDetailsModel.count({
              where: { is_active: 'y', deleted_at: null }
            })
            const totalCompletedTest = await StudentTest.count({
              where: {
                student_calc_test_id: assessmentTest.id,
                is_submitted: 1,
                deleted_at: null
              }
            })
            const assessmentCompletedPercent = Math.round((totalCompletedTest * 100) / totalTest)
            assessmentTest.completed_percent = assessmentCompletedPercent

            if (assessmentTest.completed_percent === 100) {
              return {
                ...stud,
                test_status: 'completed',
                test_custom_id: assessmentTest.custom_id
              }
            }
          }
          // eslint-disable-next-line camelcase
          if (test_status === 'all') {
            return stud
          }
        }))
        const filteredData = updatedStudentRows.filter((value) => value !== null && value !== undefined)

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, count: student.count, data: filteredData, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
      } else if (test_status === 'completed') {
        if (search) {
          query = {
            raw: true,
            order: [['created_at', 'DESC']],
            limit,
            offset: start,
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
                  '$studentDetails.school_name$': {
                    [Op.like]: `%${search}%`
                  }
                }
              ],
              deleted_at: null
            },
            include: [
              {
                model: StudentDetailModel,
                as: 'studentDetails',
                attributes: ['school_name', 'id'],
                required: true
              },
              {
                model: StudentCalcTest,
                as: 'studentCalcTests',
                where: {
                  is_submitted: true,
                  deleted_at: null,
                  report_path: { [Op.ne]: null }
                },
                attributes: [],
                required: true
              }
            ],
            attributes: ['id', 'custom_id', 'first_name', 'middle_name', 'last_name', 'email', 'is_active', [Sequelize.col('studentCalcTests.custom_id'), 'test_custom_id']]
          }
        } else {
          query = {
            raw: true,
            order: [['created_at', 'DESC']],
            limit,
            offset: start,
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
                }
              ],
              deleted_at: null
            },
            include: [
              {
                model: StudentCalcTest,
                as: 'studentCalcTests',
                where: {
                  is_submitted: true,
                  deleted_at: null,
                  report_path: { [Op.ne]: null }
                },
                order: [['created_at', 'DESC']],
                attributes: [],
                // attributes: ['created_at'],
                required: true
              }
            ],
            attributes: ['id', 'custom_id', 'first_name', 'middle_name', 'last_name', 'email', 'is_active', [Sequelize.col('studentCalcTests.custom_id'), 'test_custom_id']]
            // limit,
            // offset: start
          }
        }
        const student = await StudentModel.findAndCountAll(query)
        const testCompleted = student.rows.map((row) => ({
          ...row,
          test_status: 'completed'
        }))

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, count: student.count, data: testCompleted, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].student) })
      }
    } catch (error) {
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async createStudent(req, res) {
    try {
      // students model
      // eslint-disable-next-line camelcase
      const { center_id, counselor_id, first_name, middle_name, last_name, mobile, dob, gender, country_id, father_name, mother_name, math_dropped, science_dropped, is_verify, verified_at, /* created_by, updated_by, */ state_id, city_id, student_pin_code, grade_id, board_id, school_name, nationality, school_address_1, school_address_2, school_country_id, school_state_id, school_city_id, school_pin_code } = req.body

      removenull(req.body)
      // eslint-disable-next-line camelcase
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)
      const password = await generatePassword(8)

      let email
      if (req.body.email && req.body.email !== null) {
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

      let transaction
      try {
        transaction = await sequelize.transaction()

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

        const student = await StudentModel.create({ custom_id: sCustomId, ollato_code: getOllatoNumber, center_id, counselor_id, slug: sUsername, user_name: sUsername, password: sPassword, first_name, middle_name, last_name, email, mobile, dob, gender, mother_name, father_name, math_dropped, science_dropped, is_verify, verified_at, created_by: 'admin' }, { transaction })
        student.setDataValue('password', null)

        const sCustomIdStudentDetail = randomStr(8, 'string')
        await StudentDetailModel.create({ custom_id: sCustomIdStudentDetail, student_id: student.id, country_id, state_id, city_id, pin_code: student_pin_code, grade_id, board_id, school_name, nationality, school_address_1, school_address_2, school_country_id, school_state_id, school_city_id, school_pin_code, created_by: 'admin' }, { transaction })

        await transaction.commit()

        const token = jwt.sign({ id: (student.getDataValue('id')) }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

        const name = first_name.concat(' ', last_name)
        let resp
        if (!email) {
          resp = await sendMailPassword(password, name, config.RECEIVER_EMAIL)
          if (resp === undefined) throw Error()
        } else {
          resp = await sendMailPassword(password, name, email)
          if (resp === undefined) throw Error()
        }

        const studentToken = await StudentModel.update({ token: token }, { where: { id: student.id } })
        if (!studentToken) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

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
      const { id, updateType, center_id, counselor_id, first_name, middle_name, last_name, mobile, dob, gender, country_id, father_name, mother_name, state_id, city_id, math_dropped, science_dropped, student_pin_code, grade_id, board_id, school_name, nationality, school_address_1, school_address_2, school_country_id, school_state_id, school_city_id, school_pin_code, isActive } = req.body

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
          if (req.body.email && req.body.email != null) {
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

          // const titleExist = await StudentModel.findAll({ raw: true, where: { id: { $ne: id }, mobile, email, deleted_at: null } })
          if (email) {
            if (titleExist.length && titleExist[0].email === email) {
              return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
            }
          }

          if (titleExist.length && titleExist[0].mobile === mobile) {
            return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobile) })
          }

          let transac
          try {
            transac = await sequelize.transaction()
            await StudentModel.update({ center_id, counselor_id, first_name, middle_name, last_name, email, mobile, dob, gender, mother_name, father_name, math_dropped, science_dropped, updated_by: 'admin' }, { where: { id, deleted_at: null } }, { transac })

            await StudentDetailModel.update({ country_id, state_id, city_id, pin_code: student_pin_code, grade_id, board_id, school_name, nationality, school_address_1, school_address_2, school_country_id, school_state_id, school_city_id, school_pin_code, updated_by: 'admin' }, { where: { student_id: id, deleted_at: null } }, { transac })

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

      const exist = await StudentModel.findOne({ where: { id, deleted_at: null } })
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
