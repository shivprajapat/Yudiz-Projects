const { status, jsonStatus, messages } = require('../../../helper/api.responses')
const { catchError } = require('../../../helper/utilities.services')
const counsellorModel = require('../../counsellor/counsellor.model')
const studentModel = require('../../student/auth/student.model')
const sessionsModel = require('../../counsellor/sessions/session.model')
const centerModel = require('../../center/Auth/center.model')
const adminModel = require('../auth/admin.model')
const StudentCalcTest = require('../../student/test/student.calc.test.model')
const StudentTest = require('../../student/test/student.test.model')
const testDetailsModel = require('../../student/test/test.detail.model')
const { Op } = require('sequelize')
const { downloadFilesAndCreateZip } = require('../../../helper/downloadReports')
class AdminServices {
  async dashboardCounts(req, res) {
    try {
      const adminDetails = await adminModel.findOne({ where: { id: req.user.id }, attributes: { exclude: ['password', 'token', 'OTP', 'created_by', 'updated_by', 'created_at', 'updated_at'] } })
      const totalCounsellors = await counsellorModel.count({ raw: true, where: { deleted_at: null } })
      const students = await studentModel.findAndCountAll({ raw: true, where: { deleted_at: null } })
      const totalCenters = await centerModel.count({ raw: true, where: { deleted_at: null } })
      const totalSessions = await sessionsModel.count({ raw: true, where: { status: 'completed' } })

      let totalStudentCompletedTest = 0
      await Promise.all(students.rows.map(async (student) => {
        const assessmentTest = await StudentCalcTest.findOne({
          raw: true,
          where: { student_id: student.id },
          order: [['id', 'DESC']],
          attributes: ['id', 'custom_id', 'is_submitted']
        })

        if (!assessmentTest) return

        const totalTest = await testDetailsModel.count({
          where: { is_active: 'y', deleted_at: null }
        })
        const totalCompletedTest = await StudentTest.count({
          where: { student_calc_test_id: assessmentTest.id, is_submitted: 1, deleted_at: null }
        })
        const assessmentCompletedPercent = Math.round((totalCompletedTest * 100) / totalTest)
        assessmentTest.completed_percent = assessmentCompletedPercent

        if (assessmentTest.completed_percent === 100) {
          totalStudentCompletedTest++
        }
      }))

      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].success.replace('##', 'dashboard data'),
        data: {
          counsellors: totalCounsellors,
          Students: students.count,
          CompletedSessions: totalSessions,
          centers: totalCenters,
          adminDetails,
          testCompletedStudents: totalStudentCompletedTest
        }
      })
    } catch (error) {
      return await catchError('admin.dashboardCounts', error, req, res)
    }
  }

  async downloadReports(req, res) {
    try {
      const studentReport = await StudentCalcTest.findAll({
        raw: true,
        where: {
          report_path: { [Op.ne]: null },
          is_submitted: true,
          deleted_at: null
        },
        attributes: ['report_path']
      })

      const reportZip = await downloadFilesAndCreateZip(studentReport)

      console.log('reportZip: ', reportZip)

      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].success.replace('##', 'dashboard data'),
        data: studentReport
      })
    } catch (error) {
      return await catchError('admin.dashboardCounts', error, req, res)
    }
  }
}

module.exports = new AdminServices()
