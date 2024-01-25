const { removenull, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const studentModel = require('../../student/auth/student.model')
const CounsellorModel = require('../../counsellor/counsellor.model')
const sessionsModel = require('../../counsellor/sessions/session.model')
const sessionsCancelModel = require('../../counsellor/sessions/session.cancel.model')
const sessionsRescheduleModel = require('../../counsellor/sessions/session.reschedule.model')
const sessionsReportModel = require('../../counsellor/sessions/report.session.model')
const StudentReviewModel = require('../../student/counsellor/session.rate.model')
const StudentCalcTest = require('../../student/test/student.calc.test.model')
const { Op, Sequelize } = require('sequelize')
const CounsellorDetail = require('../../counsellor/counsellor_details.model')

class CounsellorAvailService {
  async getAllCounsellorSessions(req, res) {
    try {
      removenull(req.body)
      const { sessionStatus } = req.body
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const query = {
        where: {
          [Op.or]: [
            {
              '$student.first_name$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$student.last_name$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$counsellors.first_name$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$counsellors.last_name$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              date: {
                [Op.like]: `%${search}%`
              }
            },
            {
              from_time: {
                [Op.like]: `%${search}%`
              }
            }
          ]
        },
        include: [
          {
            model: studentModel,
            as: 'student',
            attributes: ['first_name', 'last_name', 'email', 'profile']
          },
          {
            model: CounsellorModel,
            as: 'counsellors',
            attributes: ['first_name', 'last_name', 'email']
          }
        ],
        order: sorting,
        limit,
        offset: start
      }
      if (sessionStatus && sessionStatus !== 'all' && sessionStatus !== 'upcoming') {
        query.where.status = sessionStatus
      }
      let today = new Date()
      if (sessionStatus === 'upcoming') {
        const dd = String(today.getDate()).padStart(2, '0')
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const yyyy = today.getFullYear()
        today = yyyy + '-' + mm + '-' + dd
        query.where.date = { [Op.gte]: today }
        query.where.status = 'accepted'
      }
      const countAll = await sessionsModel.findAndCountAll(query)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: countAll, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async getSessionDetailById(req, res) {
    try {
      removenull(req.body)
      const { sessionId } = req.body
      const getSession = await sessionsModel.findOne({
        raw: true,
        where: { id: sessionId },
        include: [{
          model: CounsellorModel,
          as: 'counsellors',
          attributes: []
        },
        {
          model: studentModel,
          as: 'student',
          attributes: []
        }],
        attributes: ['id', 'counsellor_id', 'counsellor_aval_id', 'student_package_id', 'date', 'from_time', 'to_time', 'type', 'status', [Sequelize.col('student.id'), 'student_id'], [Sequelize.col('student.first_name'), 'student_first_name'], [Sequelize.col('student.middle_name'), 'student_middle_name'], [Sequelize.col('student.last_name'), 'student_last_name'], [Sequelize.col('student.email'), 'student_email'], [Sequelize.col('student.profile'), 'student_profile'], [Sequelize.col('counsellors.id'), 'counsellors_id'], [Sequelize.col('counsellors.first_name'), 'counsellors_first_name'], [Sequelize.col('counsellors.middle_name'), 'counsellors_middle_name'], [Sequelize.col('counsellors.last_name'), 'counsellors_last_name'], [Sequelize.col('counsellors.email'), 'counsellors_email']]
      })

      getSession.counsellors_profile = null
      const counsellorDetail = await CounsellorDetail.findOne({
        raw: true,
        where: {
          id: getSession.counsellor_id
        }
      })
      if (counsellorDetail) {
        getSession.counsellors_profile = counsellorDetail.profile_picture
      }

      getSession.rescheduleSession = null
      if (getSession.status === 'reschedule') {
        getSession.rescheduleSession = await sessionsRescheduleModel.findOne({
          raw: true,
          where: {
            sessions_id: sessionId
          },
          attributes: ['id', 'reason', 'rescheduled_by']
        })
      }

      getSession.cancelSession = null
      if (getSession.status === 'cancel') {
        getSession.cancelSession = await sessionsCancelModel.findOne({
          raw: true,
          where: {
            sessions_id: sessionId
          },
          attributes: ['id', 'reason', 'canceled_by']
        })
      }

      getSession.reportSession = null
      if (getSession.status === 'completed') {
        const reportData = await sessionsReportModel.findOne({
          raw: true,
          where: {
            sessions_id: sessionId
          },
          attributes: ['id', 'reason', 'report_by']
        })
        if (reportData) {
          getSession.reportSession = reportData
        }
      }

      getSession.ratingSession = null
      if (getSession.status === 'completed') {
        const reviewData = await StudentReviewModel.findOne({
          raw: true,
          where: {
            session_id: sessionId
          },
          attributes: ['id', 'custom_id', 'message', 'ratings']
        })
        if (reviewData) {
          getSession.ratingSession = reviewData
        }
      }

      // get student test data
      const studentTest = await StudentCalcTest.findOne({
        where: { student_id: getSession.student_id, is_submitted: 1 },
        order: [
          ['submission_Time', 'DESC']
        ],
        attributes: ['id', 'custom_id', 'report_path']
      })
      getSession.report = studentTest
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: getSession, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].session) })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }
}

module.exports = new CounsellorAvailService()
