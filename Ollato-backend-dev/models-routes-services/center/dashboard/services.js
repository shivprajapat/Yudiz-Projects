const { status, jsonStatus, messages } = require('../../../helper/api.responses')
const { catchError } = require('../../../helper/utilities.services')
const counsellorModel = require('../../counsellor/counsellor.model')
const studentModel = require('../../student/auth/student.model')
const sessionsModel = require('../../counsellor/sessions/session.model')
const centerModel = require('../Auth/center.model')
const { Op } = require('sequelize')

class CenterServices {
  async dashboardCounts(req, res) {
    try {
      const centerDetails = await centerModel.findOne({ where: { id: req.user.id, deleted_at: null }, attributes: { exclude: ['password', 'token', 'OTP', 'created_by', 'updated_by', 'created_at', 'updated_at'] } })
      const centerCounsellors = await counsellorModel.findAll({ raw: true, where: { center_id: req.user.id, deleted_at: null } })
      const centerCounsellorsId = centerCounsellors.map((item) => item.id)
      const TotalCounsellors = centerCounsellorsId.length
      const totalStudents = await studentModel.count({ raw: true, where: { center_id: req.user.id, deleted_at: null } })
      const totalSessions = await sessionsModel.count({ raw: true, where: { counsellor_id: { [Op.in]: centerCounsellorsId }, status: 'completed' } })
      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].success.replace('##', 'dashboard data'),
        data: {
          counsellors: TotalCounsellors,
          Students: totalStudents,
          CompletedSessions: totalSessions,
          centerDetails
        }
      })
    } catch (error) {
      catchError('center.dashboardCounts', error, req, res)
    }
  }
}

module.exports = new CenterServices()
