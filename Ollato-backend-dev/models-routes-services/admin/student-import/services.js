/* eslint-disable camelcase */
const { catchError, removenull, randomStr, getIncrementNumber, getUniqueString } = require('../../../helper/utilities.services')
const studentImportModel = require('./student.import.model')
const StudentModel = require('../../student/auth/student.model')
const StudentDetailModel = require('../../student/auth/student_details.model')
const countryModel = require('../../common/country/country.model')
const stateModel = require('../state/state.model')
const cityModel = require('../city/city.model')
const gradeModel = require('../grade/grade.model')
const boardModel = require('../board/board.model')
// const schooldModel = require('../school/schools.model')
const { Op, Sequelize } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')
const bcrypt = require('bcryptjs')
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)
const { sendMailPassword } = require('../../../helper/email.service')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const fs = require('fs')
const csv = require('fast-csv')
const config = require('../../../config/config-file')

class StudentImportServices {
  async addStudentsData(req, res) {
    try {
      removenull(req.body)
      if (req.files.student_import_file) {
        // const getResponse = await uploadCsv(req.files.student_import_file[0].path)
        // console.log('getResponse', getResponse)
        // console.log('File has imported :')

        try {
          const errorData = []
          const uriFile = req.files.student_import_file[0].path
          console.log(uriFile)
          const stream = fs.createReadStream(uriFile)
          const csvDataColl = []
          const fileStream = csv
            .parse()
            .on('data', function (data) {
              csvDataColl.push(data)
            })
            .on('end', async () => {
              try {
                csvDataColl.shift()
                for (let i = 0; i < csvDataColl.length; i++) {
                  const studentData = csvDataColl[i]
                  if (/* studentData[0] === '' || */studentData[1] === '' || studentData[2] === '' ||
                  studentData[3] === '' || studentData[4] === '' || studentData[5] === '' ||
                  studentData[6] === '' || studentData[7] === '' || studentData[8] === '' || studentData[9] === '' || studentData[10] === '' /* || studentData[12] === '' */) {
                    errorData.push(studentData[3])
                    console.log('error', studentData[3])
                  } else {
                    await studentImportModel.create({
                      first_name: studentData[1],
                      last_name: studentData[2],
                      email: studentData[0] || null,
                      mobile: studentData[3],
                      country: studentData[4],
                      state: studentData[5],
                      city: studentData[6],
                      grade: studentData[7],
                      board: studentData[8],
                      school: studentData[9],
                      math_dropped: studentData[10],
                      science_dropped: studentData[11],
                      package_id: studentData[12] || 0
                    })
                  }
                }
                fs.unlinkSync(uriFile)
                console.log('errorData', errorData)
                if (errorData.length > 0) {
                  return res.status(status.NotAcceptable).jsonp({ status: jsonStatus.NotAcceptable, data: errorData.join(), message: messages[req.userLanguage].error_with.replace('##', messages[req.userLanguage].csv) })
                }
                return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: [], message: messages[req.userLanguage].student_import_start })
              } catch (error) {
                return await catchError('state.createPackage', error, req, res)
              }
            })
          stream.pipe(fileStream)
        } catch (error) {
          return await catchError('state.createPackage', error, req, res)
        }
      }
    } catch (error) {
      return await catchError('state.createPackage', error, req, res)
    }
  }

  // not in use: cron is used instead
  async createStudent (req, res) {
    try {
      const studentData = await studentImportModel.findAll({
        raw: true
      })
      for (let i = 0; i < studentData.length; i++) {
        const studentDetail = studentData[i]
        // eslint-disable-next-line camelcase
        const { first_name, last_name, mobile, country, state, city, grade, board, school, math_dropped, science_dropped } = studentDetail
        console.log(studentDetail)
        const fullName = first_name + ' ' + last_name
        const sUsername = await getUniqueUserName(fullName)
        const password = await generatePassword(8)

        let email
        if (studentDetail.email && studentDetail.email != null) {
          email = studentDetail.email || null
          email = email.toLowerCase().trim()
        }

        const query = [
          { mobile }
        ]
        if (email) query.push({ email })

        const userExist = await StudentModel.findOne({
          raw: true,
          where: {
            [Op.or]: query,
            deleted_at: null
          }
        })

        // const userExist = await StudentModel.findOne({ where: { [Op.or]: [{ email: email }, { mobile: mobile }], deleted_at: null } })
        if (!userExist) {
          let transaction
          try {
            transaction = await sequelize.transaction()

            const sPassword = bcrypt.hashSync(password, salt)
            const sCustomId = randomStr(8, 'string')

            /** check last ollato number */
            const lastStudentRecord = await StudentModel.findOne({
              raw: true,
              where: { ollato_code: { [Op.ne]: null } },
              order: [
                ['id', 'DESC']
              ]
            })
            let id = ''
            if (lastStudentRecord) {
              id = lastStudentRecord.ollato_code
            }
            const getOllatoNumber = await getIncrementNumber('student', id)
            const countryId = await getCountryId(country)
            const stateId = await getStateId(state, countryId)
            const cityId = await getCityId(city, countryId, stateId)
            const gradeId = await getGradeId(grade)
            const boardId = await getBoardId(board)
            // const schoolDetails = await getSchoolId(school, countryId, stateId, cityId, boardId)
            console.log('country_id', countryId, 'state id', stateId, 'city id', cityId, 'grade id', gradeId, 'board id', boardId, 'school id', school)

            // create student
            const student = await StudentModel.create({ custom_id: sCustomId, ollato_code: getOllatoNumber, slug: sUsername, user_name: sUsername, password: sPassword, first_name, last_name, email, mobile, math_dropped, science_dropped, is_verify: 'y', verified_at: new Date(), created_by: 'admin' }, { transaction })
            student.setDataValue('password', null)

            const sCustomIdStudentDetail = randomStr(8, 'string')
            await StudentDetailModel.create({ custom_id: sCustomIdStudentDetail, student_id: student.id, country_id: countryId, state_id: stateId, city_id: cityId, grade_id: gradeId, board_id: boardId, school_name: school, created_by: 'admin' }, { transaction })

            await transaction.commit()

            const name = first_name.concat(' ', last_name)
            let resp
            if (!email) {
              resp = await sendMailPassword(password, name, config.RECEIVER_EMAIL)
              if (resp === undefined) throw Error()
            } else {
              resp = await sendMailPassword(password, name, email)
              if (resp === undefined) throw Error()
            }
            // await sendMailPassword(password, email)
          } catch (error) {
            await transaction.rollback()
          }
        }
        // remove import entry
        await studentImportModel.destroy({
          where: { mobile }
        })
      }
    } catch (error) {
      return await catchError('state.createPackage', error, req, res)
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

// get country id by name
const getCountryId = async (country) => {
  try {
    let countryId = ''
    const getCountry = await countryModel.findOne({
      raw: true,
      where: sequelize.where(Sequelize.fn('lower', sequelize.col('title')), Sequelize.fn('lower', country))
    })
    if (getCountry) {
      countryId = getCountry.id
    } else {
      const customId = await getUniqueString(8, countryModel)
      const createCountry = await countryModel.create({ custom_id: customId, title: country })
      countryId = createCountry.id
    }
    return countryId
  } catch (error) {
    return new Error(error)
  }
}

// get state id by name
const getStateId = async (state, countryId) => {
  try {
    let stateId = ''
    const getState = await stateModel.findOne({
      raw: true,
      where: { $col: sequelize.where(Sequelize.fn('lower', sequelize.col('title')), Sequelize.fn('lower', state)), county_id: countryId }
    })
    console.log(getState)
    if (getState) {
      stateId = getState.id
    } else {
      const customId = await getUniqueString(8, stateModel)
      const createState = await stateModel.create({ custom_id: customId, title: state, county_id: countryId })
      stateId = createState.id
    }
    return stateId
  } catch (error) {
    return new Error(error)
  }
}

// get city id by name
const getCityId = async (city, countryId, stateId) => {
  try {
    let cityId = ''
    const getCity = await cityModel.findOne({
      raw: true,
      where: { $col: sequelize.where(Sequelize.fn('lower', sequelize.col('title')), Sequelize.fn('lower', city)), county_id: countryId, state_id: stateId }
    })
    console.log(getCity)
    if (getCity) {
      cityId = getCity.id
    } else {
      const customId = await getUniqueString(8, cityModel)
      const createCity = await cityModel.create({ custom_id: customId, title: city, county_id: countryId, state_id: stateId })
      cityId = createCity.id
    }
    return cityId
  } catch (error) {
    return new Error(error)
  }
}

// get grade id by name
const getGradeId = async (grade) => {
  try {
    let gradeId = ''
    const getGrade = await gradeModel.findOne({
      raw: true,
      where: { $col: sequelize.where(Sequelize.fn('lower', sequelize.col('title')), Sequelize.fn('lower', grade)) }
    })
    console.log(getGrade)
    if (getGrade) {
      gradeId = getGrade.id
    } else {
      const customId = await getUniqueString(8, gradeModel)
      const createGrade = await gradeModel.create({ custom_id: customId, title: grade })
      gradeId = createGrade.id
    }
    return gradeId
  } catch (error) {
    return new Error(error)
  }
}

// get board id by name
const getBoardId = async (borad) => {
  try {
    let boardId = ''
    const getBoard = await boardModel.findOne({
      raw: true,
      where: { $col: sequelize.where(Sequelize.fn('lower', sequelize.col('title')), Sequelize.fn('lower', borad)) }
    })
    console.log(getBoard)
    if (getBoard) {
      boardId = getBoard.id
    } else {
      const customId = await getUniqueString(8, boardModel)
      const createBoard = await boardModel.create({ custom_id: customId, title: borad })
      boardId = createBoard.id
    }
    return boardId
  } catch (error) {
    return new Error(error)
  }
}

// get school id by name
// const getSchoolId = async (school, countryId, stateId, cityId, boardId) => {
//   try {
//     let schoolId = ''
//     let schoolName = ''
//     const getSchool = await schooldModel.findOne({
//       raw: true,
//       where: { $col: sequelize.where(Sequelize.fn('lower', sequelize.col('title')), Sequelize.fn('lower', school)), county_id: countryId, state_id: stateId, city_id: cityId, board_id: boardId }
//     })
//     console.log(getSchool)
//     if (getSchool) {
//       schoolId = getSchool.id
//     } else {
//       const customId = await getUniqueString(8, schooldModel)
//       const createSchool = await schooldModel.create({ custom_id: customId, title: school, county_id: countryId, state_id: stateId, city_id: cityId, board_id: boardId, address_1: 'dummy', address_2: 'dummy', pin_code: '123456' })
//       schoolId = createSchool.id
//       schoolName = createSchool.title
//     }
//     return { schoolId, schoolName }
//   } catch (error) {
//     return new Error(error)
//   }
// }
module.exports = new StudentImportServices()
