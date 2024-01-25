/* eslint-disable camelcase */
const { catchError, removenull } = require('../../../helper/utilities.services')
const studentImportModel = require('../../admin/student-import/student.import.model')
const CenterModel = require('../../center/Auth/center.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const fs = require('fs')
const csv = require('fast-csv')

class StudentImportServices {
  async addStudentsData(req, res) {
    try {
      removenull(req.body)
      if (req.files.student_import_file) {
        try {
          const center_detail = await CenterModel.findOne({
            raw: true,
            where: { id: req.user.id }
          })
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
                  if (studentData[1] === '' || studentData[2] === '' ||
                  studentData[3] === '' || studentData[4] === '' || studentData[5] === '' ||
                  studentData[6] === '' || studentData[7] === '' || studentData[8] === '' || studentData[9] === '' || studentData[10] === '') {
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
                      package_id: studentData[12] || 0,
                      center_id: req.user.id,
                      center_email: center_detail.email
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
                return await catchError('student.createStudent', error, req, res)
              }
            })
          stream.pipe(fileStream)
        } catch (error) {
          return await catchError('student.createStudent', error, req, res)
        }
      }
    } catch (error) {
      return await catchError('student.createStudent', error, req, res)
    }
  }
}

module.exports = new StudentImportServices()
