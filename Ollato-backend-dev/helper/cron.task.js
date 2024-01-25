/* eslint-disable no-inner-declarations */
/* eslint-disable camelcase */
const { randomStr, getIncrementNumber, getUniqueString } = require('./utilities.services')
const studentPackageModel = require('../models-routes-services/student/package/student.packages.model')
const studentImportModel = require('../models-routes-services/admin/student-import/student.import.model')
const StudentModel = require('../models-routes-services/student/auth/student.model')
const StudentDetailModel = require('../models-routes-services/student/auth/student_details.model')
const countryModel = require('../models-routes-services/common/country/country.model')
const stateModel = require('../models-routes-services/admin/state/state.model')
const cityModel = require('../models-routes-services/admin/city/city.model')
const gradeModel = require('../models-routes-services/admin/grade/grade.model')
const boardModel = require('../models-routes-services/admin/board/board.model')
const schooldModel = require('../models-routes-services/admin/school/schools.model')
const StudentCalcTest = require('../models-routes-services/student/test/student.calc.test.model')
const StudentTest = require('../models-routes-services/student/test/student.test.model')
const StudentTestAns = require('../models-routes-services/student/test/student.test.ans.model')
const StudentCalcTestNorm = require('../models-routes-services/student/test/student.calc.test.norm.model')
const StudentPackageExpireTest = require('../models-routes-services/common/expire-package/student.package.expire.test.model')
const StudentTestArchive = require('../models-routes-services/common/student-test-archive/student.test.archive.model')
const StudentPackageModel = require('../models-routes-services/student/package/student.packages.model')
const StudentPackagesHistory = require('../models-routes-services/student/package/student.package.history.model')
const PackageModel = require('../models-routes-services/admin/package/package.model')
const CsvLogsModel = require('../models-routes-services/admin/csv-logs/csv_logs.model')
const { Op, Sequelize } = require('sequelize')
const { sequelize } = require('../database/sequelize')
const bcrypt = require('bcryptjs')
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)
const { sendMailPassword, sendMailCsv } = require('./email.service')
const path = require('path')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const config = require('../config/config-file')

const packageExpire = async() => {
  console.log('check package')
  try {
    const studentPackages = await studentPackageModel.findAll({
      raw: true,
      where: {
        expireDate: {
          [Op.lte]: Sequelize.literal('NOW()')
        },
        isExpired: 0
      }
    })
    for (let i = 0; i < studentPackages.length; i++) {
      const studentPackage = studentPackages[i]
      // console.log(studentPackage)
      await studentPackageModel.update({ isExpired: 1 }, { where: { id: studentPackage.id } })

      // check package test which is not completed
      await checkStudentPackageTest(studentPackage)
    }
  } catch (error) {
    console.log('error:---->>>', error)
  }
}

const studentImportAdmin = async() => {
  let sendCSVInMail
  try {
    const studentData = await studentImportModel.findAll({
      raw: true,
      where: { center_id: null }
    })

    // TODO: need to optimize
    for (let i = 0; i < studentData.length; i++) {
      const studentDetail = studentData[i]
      // eslint-disable-next-line camelcase
      const { first_name, last_name, mobile, country, state, city, grade, board, school, math_dropped, science_dropped, package_id } = studentDetail
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)
      const password = await generatePassword(8)

      let email
      if (studentDetail.email) {
        email = studentDetail.email || ''
        email = email.toLowerCase().trim()
      }

      const query = [
        { mobile }
      ]
      if (email) query.push({ email })

      try {
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
            const schoolId = await getSchoolId(school, countryId, stateId, cityId, boardId)

            // create student
            const student = await StudentModel.create({ custom_id: sCustomId, ollato_code: getOllatoNumber, slug: sUsername, user_name: sUsername, password: sPassword, first_name, last_name, email, mobile, math_dropped, science_dropped, is_verify: 'y', verified_at: new Date(), created_by: 'admin' }, { transaction })
            student.setDataValue('password', null)

            const sCustomIdStudentDetail = randomStr(8, 'string')
            await StudentDetailModel.create({ custom_id: sCustomIdStudentDetail, student_id: student.id, country_id: countryId, state_id: stateId, city_id: cityId, grade_id: gradeId, board_id: boardId, school_id: schoolId, created_by: 'admin' }, { transaction })

            await transaction.commit()

            // payment conditions
            // eslint-disable-next-line eqeqeq
            if (package_id == '1' || package_id == '2' || package_id == '3') {
              const packageDetail = await PackageModel.findOne({ raw: true, where: { id: package_id } })
              const onlineTest = packageDetail.online_test ? 1 : 0
              const testReport = packageDetail.test_report ? 1 : 0
              const videoCall = packageDetail.video_call ? 1 : 0
              const f2fCall = packageDetail.f2f_call ? 1 : 0
              const org_amount = packageDetail.amount
              const cDate = new Date()
              var expireDate = new Date(cDate.setMonth(cDate.getMonth() + 1))
              const txnid = 'paid_by_csv_' + Date.now()
              const customId = await getUniqueString(8, StudentPackagesHistory)

              await StudentPackageModel.create({ custom_id: customId, onlineTest, testReport, videoCall, f2fCall, student_id: student.id, package_id, package_type: packageDetail.package_type, amount: org_amount, final_amount: org_amount, purchase_date: new Date(), expireDate, transaction_id: txnid, payment_status: 'C' })

              await StudentPackagesHistory.create(
                {
                  custom_id: customId,
                  student_id: student.id,
                  package_id: packageDetail.id,
                  transaction_id: txnid,
                  // order_id: mihpayid,
                  // order_signature: hash,
                  amount: packageDetail.amount,
                  status: 'C'
                })
            }

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
        } else {
        // add records with issue in csv_logs
          let description
          const query = {}
          query.student_name = fullName
          if (userExist && userExist.mobile === mobile) {
            description = 'Existing mobile number.'
            query.description = description
            query.mobile = mobile
          }

          if (email) {
            if (userExist && userExist.email && userExist.email === email) {
              description = 'Existing email number.'
              query.description = query.description ? 'Existing email and mobile.' : description
              query.email = email
            }
          }
          await CsvLogsModel.create(query)
        }

        // remove import entry
        await studentImportModel.destroy({
          where: {
            [Op.and]: [
              { mobile: mobile },
              { center_id: null }
            ]
          }
        })
      } catch (error) {
        console.log('error: ', error)
      }
    }

    const createCsvLogs = await CsvLogsModel.findAll({ raw: true, where: { deleted_at: null } })
    let fileName
    if (createCsvLogs.length > 0) {
      // create csv
      fileName = await createAndWriteCsv(createCsvLogs)
      // email csv
      const fileNm = fileName
      const filePath = path.resolve(__dirname, `../public/uploads/csv_to_admin/${fileNm}`)
      sendCSVInMail = await sendMailCsv(filePath, fileNm, config.RECEIVER_EMAIL) // set client email - seracedu@gmail.com
      if (!sendCSVInMail) throw Error()
    }

    // remove csv_logs entry
    if (sendCSVInMail) {
      await CsvLogsModel.destroy({
        where: {},
        truncate: true
      })
    }
  } catch (error) {
    console.log('error: ', error)
  }
}

const studentImportCenter = async() => {
  let sendCSVInMail
  try {
    const studentData = await studentImportModel.findAll({
      raw: true,
      where: {
        center_id: {
          [Op.not]: null
        }
      }
    })

    for (let i = 0; i < studentData.length; i++) {
      const studentDetail = studentData[i]
      // eslint-disable-next-line camelcase
      const { first_name, last_name, mobile, country, state, city, grade, board, school, math_dropped, science_dropped, package_id, center_email } = studentDetail
      const fullName = first_name + ' ' + last_name
      const sUsername = await getUniqueUserName(fullName)
      const password = await generatePassword(8)

      // TODO: EMAIL
      let email
      if (studentDetail.email) {
        email = studentDetail.email || ''
        email = email.toLowerCase().trim()
      }

      // TODAY
      const query = [
        { mobile }
      ]
      if (email) query.push({ email })

      try {
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
            const schoolId = await getSchoolId(school, countryId, stateId, cityId, boardId)

            // create student
            const student = await StudentModel.create({ custom_id: sCustomId, ollato_code: getOllatoNumber, slug: sUsername, user_name: sUsername, password: sPassword, first_name, last_name, email, mobile, math_dropped, science_dropped, is_verify: 'y', verified_at: new Date(), created_by: 'center', center_id: studentDetail.center_id }, { transaction })
            student.setDataValue('password', null)

            const sCustomIdStudentDetail = randomStr(8, 'string')
            await StudentDetailModel.create({ custom_id: sCustomIdStudentDetail, student_id: student.id, country_id: countryId, state_id: stateId, city_id: cityId, grade_id: gradeId, board_id: boardId, school_id: schoolId, created_by: 'center' }, { transaction })

            await transaction.commit()

            // payment conditions
            // eslint-disable-next-line eqeqeq
            if (package_id == '1' || package_id == '2' || package_id == '3') {
              const packageDetail = await PackageModel.findOne({ raw: true, where: { id: package_id } })
              const onlineTest = packageDetail.online_test ? 1 : 0
              const testReport = packageDetail.test_report ? 1 : 0
              const videoCall = packageDetail.video_call ? 1 : 0
              const f2fCall = packageDetail.f2f_call ? 1 : 0
              const org_amount = packageDetail.amount
              const cDate = new Date()
              var expireDate = new Date(cDate.setMonth(cDate.getMonth() + 1))
              const txnid = 'paid_by_csv_' + Date.now()
              const customId = await getUniqueString(8, StudentPackagesHistory)

              await StudentPackageModel.create({ custom_id: customId, onlineTest, testReport, videoCall, f2fCall, student_id: student.id, package_id, package_type: packageDetail.package_type, amount: org_amount, final_amount: org_amount, purchase_date: new Date(), expireDate, transaction_id: txnid, payment_status: 'C' })

              await StudentPackagesHistory.create(
                {
                  custom_id: customId,
                  student_id: student.id,
                  package_id: packageDetail.id,
                  transaction_id: txnid,
                  // order_id: mihpayid,
                  // order_signature: hash,
                  amount: packageDetail.amount,
                  status: 'C'
                })
            }

            const name = first_name.concat(' ', last_name)
            let resp
            if (!email) {
              resp = await sendMailPassword(password, name, config.RECEIVER_EMAIL) // TODO:studentDetail.center_email
              if (resp === undefined) throw Error()
            } else {
              resp = await sendMailPassword(password, name, email)
              if (resp === undefined) throw Error()
            }

          // await sendMailPassword(password, email)
          } catch (error) {
            await transaction.rollback()
          }
        } else {
        // add records with issue in csv_logs
          let description
          const query = {}
          query.student_name = fullName
          if (userExist && userExist.mobile === mobile) {
            description = 'Existing mobile number.'
            query.description = description
            query.mobile = mobile
          }

          if (email) {
            if (userExist && userExist.email && userExist.email === email) {
              description = 'Existing email number.'
              query.description = query.description ? 'Existing email and mobile.' : description
              query.email = email
            }
          }
          await CsvLogsModel.create(query)
        }

        // remove import entry
        await studentImportModel.destroy({
          where: {
            center_email: center_email // add center_email in student_imports
          }
        })
      } catch (error) {
        console.log('error: ', error)
      }
    }

    const createCsvLogs = await CsvLogsModel.findAll({ raw: true, where: { deleted_at: null } })
    let fileName
    if (createCsvLogs.length > 0) {
      // create csv
      fileName = await createAndWriteCsv(createCsvLogs)
      // email csv
      const fileNm = fileName
      const filePath = path.resolve(__dirname, `../public/uploads/csv_to_admin/${fileNm}`)
      sendCSVInMail = await sendMailCsv(filePath, fileNm, config.RECEIVER_EMAIL) // set center email - studentData.center_email
      if (!sendCSVInMail) throw Error()
    }

    // remove csv_logs entry
    if (sendCSVInMail) {
      await CsvLogsModel.destroy({
        where: {},
        truncate: true
      })
    }
  } catch (error) {
    console.log('error: ', error)
  }
}

const testArchive = async() => {
  console.log('test archive')
  try {
    const archiveData = await StudentTestArchive.findAll({
      raw: true,
      attributes: ['id', 'student_calc_test_id']
    })

    const testCalcIds = archiveData.map((result) => result.student_calc_test_id)

    const uniquesTestCalcIds = testCalcIds.filter((x, i) => i === testCalcIds.indexOf(x))
    // console.log('uniques', uniquesTestCalcIds)
    const studentTestsCalc = await StudentCalcTest.findAll({
      raw: true,
      where: {
        is_submitted: 1,
        id: { [Op.notIn]: uniquesTestCalcIds }
      }
    })
    for (let i = 0; i < studentTestsCalc.length; i++) {
      const studentTestCalc = studentTestsCalc[i]
      // console.log('studentTestCalc', studentTestCalc)
      await getArchiveTest(studentTestCalc)
    }
  } catch (error) {
    console.log('error: ', error)
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

async function createAndWriteCsv(data) {
  // create CSV file
  const dateTS = Date.now()
  const filename = `${dateTS}-csvLogs.csv`
  const filepath = path.join(__dirname, `../public/uploads/csv_to_admin/${filename}`)

  const csvWriter = createCsvWriter({
    path: filepath,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'student_name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'mobile', title: 'Mobile' },
      { id: 'description', title: 'Description' },
      { id: 'action_by', title: 'Created By' },
      { id: 'created_at', title: 'Created At' }
    ]
  })

  csvWriter.writeRecords(data) // returns a promise
    .then(() => {
    })

  return filename
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
const getSchoolId = async (school, countryId, stateId, cityId, boardId) => {
  try {
    let schoolId = ''
    const getSchool = await schooldModel.findOne({
      raw: true,
      where: { $col: sequelize.where(Sequelize.fn('lower', sequelize.col('title')), Sequelize.fn('lower', school)), county_id: countryId, state_id: stateId, city_id: cityId, board_id: boardId }
    })
    if (getSchool) {
      schoolId = getSchool.id
    } else {
      const customId = await getUniqueString(8, schooldModel)
      const createSchool = await schooldModel.create({ custom_id: customId, title: school, county_id: countryId, state_id: stateId, city_id: cityId, board_id: boardId, address_1: 'dummy', address_2: 'dummy', pin_code: '123456' })
      schoolId = createSchool.id
    }
    return schoolId
  } catch (error) {
    return new Error(error)
  }
}

const checkStudentPackageTest = async (studentPackage) => {
  // console.log(studentPackage)
  const studentTestCalc = await StudentCalcTest.findOne({
    raw: true,
    where: {
      student_package_id: studentPackage.id,
      is_submitted: 0
    }
  })

  if (studentTestCalc) {
    await getAllGivenTest(studentTestCalc)
    await StudentCalcTest.update({ deleted_at: new Date() }, { raw: true, where: { id: studentTestCalc.id } })
  }
}

const getAllGivenTest = async (studentTestCalc) => {
  const allStudentTest = await StudentTest.findAll({
    raw: true,
    where: {
      student_calc_test_id: studentTestCalc.id
    }
  })
  // console.log(allStudentTest)
  for (let i = 0; i < allStudentTest.length; i++) {
    const studentTestData = allStudentTest[i]
    // console.log('studentTestData', studentTestData)
    // get test ans recoreds to delete unused records
    await getTestAns(studentTestData)
    // delete test record
    await StudentTest.destroy({ raw: true, where: { id: studentTestData.id } })
  }
}

const getArchiveTest = async (studentTestCalc) => {
  const allStudentTest = await StudentTest.findAll({
    raw: true,
    where: {
      student_calc_test_id: studentTestCalc.id,
      is_submitted: 0
    }
  })
  // console.log(allStudentTest)
  for (let i = 0; i < allStudentTest.length; i++) {
    const studentTestData = allStudentTest[i]
    // console.log('studentTestData', studentTestData)
    // get test ans recoreds to delete unused records
    await getArchiveTestAns(studentTestData)
    // delete test record
    await StudentTest.destroy({ raw: true, where: { id: studentTestData.id } })
  }
}

const getTestAns = async (studentTestData) => {
  const getAllTestAns = await StudentTestAns.findAll({
    raw: true,
    where: {
      student_test_id: studentTestData.id
    }
  })

  // get test norm data
  const getTestNorm = await StudentCalcTestNorm.findOne({
    raw: true,
    where: {
      student_test_id: studentTestData.id
    }
  })

  // move test data to expire table
  const data = {
    student_id: studentTestData.student_id,
    student_package_id: studentTestData.student_package_id,
    student_calc_test_id: studentTestData.student_calc_test_id,
    student_test_id: studentTestData.id,
    student_test: JSON.stringify(studentTestData),
    student_test_ans: JSON.stringify(getAllTestAns),
    student_test_norm: JSON.stringify(getTestNorm)
  }
  await StudentPackageExpireTest.create(data)

  // delete all ans recoreds
  await StudentTestAns.destroy({ raw: true, where: { student_test_id: studentTestData.id } })

  // delete test norm record
  await StudentCalcTestNorm.destroy({ raw: true, where: { student_test_id: studentTestData.id } })
}

const getArchiveTestAns = async (studentTestData) => {
  const getAllTestAns = await StudentTestAns.findAll({
    raw: true,
    where: {
      student_test_id: studentTestData.id
    }
  })

  // get test norm data
  const getTestNorm = await StudentCalcTestNorm.findOne({
    raw: true,
    where: {
      student_test_id: studentTestData.id
    }
  })

  // move test data to expire table
  const data = {
    student_id: studentTestData.student_id,
    student_package_id: studentTestData.student_package_id,
    student_calc_test_id: studentTestData.student_calc_test_id,
    student_test_id: studentTestData.id,
    student_test: JSON.stringify(studentTestData),
    student_test_ans: JSON.stringify(getAllTestAns),
    student_test_norm: JSON.stringify(getTestNorm)
  }
  await StudentTestArchive.create(data)

  // delete all ans recoreds
  await StudentTestAns.destroy({ raw: true, where: { student_test_id: studentTestData.id } })

  // delete test norm record
  await StudentCalcTestNorm.destroy({ raw: true, where: { student_test_id: studentTestData.id } })
}

module.exports = {
  packageExpire,
  studentImportAdmin,
  studentImportCenter,
  testArchive
}
