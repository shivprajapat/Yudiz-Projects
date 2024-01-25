/* eslint-disable camelcase */
const { catchError, removenull, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const studentModel = require('../../student/auth/student.model')
const counsellorAvailbleModel = require('../../counsellor/counsellor_availability.model')
const CounsellorModel = require('../../counsellor/counsellor.model')
const CounsellorDetail = require('../../counsellor/counsellor_details.model')
const sessionsModel = require('../../counsellor/sessions/session.model')
const sessionsCancelModel = require('../../counsellor/sessions/session.cancel.model')
const sessionsRescheduleModel = require('../../counsellor/sessions/session.reschedule.model')
const sessionsReportModel = require('../../counsellor/sessions/report.session.model')
const StudentReviewModel = require('../../student/counsellor/session.rate.model')
const StudentCalcTest = require('../../student/test/student.calc.test.model')
const { Op, Sequelize } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')
const moment = require('moment')

class CounsellorAvailService {
  async getAllCounsellorSessions(req, res) {
    try {
      removenull(req.body)
      const { sessionStatus } = req.body
      const { start, limit, sorting, search } = getPaginationValues(req.body)

      const query = {
        where: {
          '$counsellors.center_id$': req.user.id,
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
            attributes: ['first_name', 'last_name', 'email', 'mobile', 'profile']
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
      if (sessionStatus && sessionStatus !== 'all') {
        query.where.status = sessionStatus
      }
      const countAll = await sessionsModel.findAndCountAll(query)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: countAll, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('sessions.getAllSession', error, req, res)
    }
  }

  async acceptRejectSession(req, res) {
    try {
      removenull(req.body)
      const { isAccept, sessionId } = req.body
      const getSession = await sessionsModel.findOne({ raw: true, where: { id: sessionId } })
      if (!getSession) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].session) })
      if (isAccept) {
        await sessionsModel.update({ status: 'accepted' }, { where: { id: sessionId } })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].session) })
      } else {
        let transaction
        try {
          transaction = await sequelize.transaction()

          await sessionsModel.update({ status: 'reject' }, { where: { id: sessionId } }, { transaction })
          await counsellorAvailbleModel.update({ status: 'available' }, { where: { id: getSession.counsellor_aval_id } }, { transaction })
          await transaction.commit()

          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].session) })
        } catch (error) {
          if (transaction) await transaction.rollback()
          return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
        }
      }
    } catch (error) {
      return await catchError('packages.acceptRejectSession', error, req, res)
    }
  }

  async reportSession(req, res) {
    try {
      removenull(req.body)
      const { reason, sessionId, reportBy } = req.body
      const getSession = await sessionsModel.findOne({ raw: true, where: { id: sessionId } })
      if (getSession) {
        await sessionsReportModel.create({
          reason,
          sessions_id: sessionId,
          report_by: reportBy
        })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: getSession, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].report) })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].session) })
    } catch (error) {
      return await catchError('packages.acceptRejectSession', error, req, res)
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
        }, {
          model: studentModel,
          as: 'student',
          attributes: []
        }],
        attributes: ['id', 'counsellor_id', 'counsellor_aval_id', 'student_package_id', 'date', 'from_time', 'to_time', 'type', 'status', [Sequelize.col('student.id'), 'student_id'], [Sequelize.col('student.first_name'), 'student_first_name'], [Sequelize.col('student.middle_name'), 'student_middle_name'], [Sequelize.col('student.last_name'), 'student_last_name'], [Sequelize.col('student.email'), 'student_email'], [Sequelize.col('student.mobile'), 'student_mobile'], [Sequelize.col('student.profile'), 'student_profile'], [Sequelize.col('counsellors.id'), 'counsellors_id'], [Sequelize.col('counsellors.first_name'), 'counsellors_first_name'], [Sequelize.col('counsellors.middle_name'), 'counsellors_middle_name'], [Sequelize.col('counsellors.last_name'), 'counsellors_last_name'], [Sequelize.col('counsellors.email'), 'counsellors_email']]
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

  async rescheduleSession(req, res) {
    try {
      removenull(req.body)
      const { sessionId, reason, newCounsellorAvailbleId } = req.body
      const gotSession = await sessionsModel.findOne({ raw: true, where: { id: sessionId } })
      if (gotSession) {
        if (gotSession.status !== 'reschedule') {
          let transaction
          try {
            transaction = await sequelize.transaction()

            await sessionsModel.update({ status: 'reschedule' }, { where: { id: sessionId } }, { transaction })
            await counsellorAvailbleModel.update({ status: 'available' }, { where: { id: newCounsellorAvailbleId } }, { transaction })
            const availableData = await counsellorAvailbleModel.findOne({ raw: true, where: { id: newCounsellorAvailbleId } })
            await sessionsRescheduleModel.create({
              sessions_id: sessionId,
              reason
            }, { transaction })
            const newSession = await sessionsModel.create({
              counsellor_id: gotSession.counsellor_id,
              date: availableData.date,
              from_time: availableData.from_time,
              to_time: availableData.to_time,
              student_id: gotSession.student_id,
              counsellor_aval_id: newCounsellorAvailbleId,
              status: 'panding'
            }, { transaction })
            await counsellorAvailbleModel.update({ status: 'booked' }, { where: { id: availableData.id } }, { transaction })

            await transaction.commit()
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', 'Session re-scheduled'), data: newSession })
          } catch (error) {
            if (transaction) await transaction.rollback()
            return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
          }
        }
      }
      return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].no_sessions })
    } catch (error) {
      return await catchError('center.reschedulesession', error, req, res)
    }
  }

  async cancelSession(req, res) {
    try {
      removenull(req.body)
      const { sessionId, reason } = req.body
      const gotSession = await sessionsModel.findOne({ raw: true, where: { id: sessionId } })

      if (gotSession) {
        if (gotSession.status === 'panding' || gotSession.status === 'accepted') {
          await sessionsModel.update({ status: 'cancel' }, { where: { id: sessionId } })
          await counsellorAvailbleModel.update({ status: 'available' }, { where: { id: gotSession.counsellor_aval_id } })
          await sessionsCancelModel.create({
            sessions_id: sessionId,
            reason,
            created_by: 'center'
          })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cancel_success.replace('##', 'Session') })
        }
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].cannot_cancel })
      }
      return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].no_sessions })
    } catch (error) {
      return await catchError('center.cacelsession', error, req, res)
    }
  }

  async getByDate(req, res) {
    try {
      removenull(req.body)
      const { date, counsellor_id } = req.body

      const dateCurrent = moment().format('YYYY-MM-DD')
      const dateRequested = moment(date).format('YYYY-MM-DD')
      if (!(dateCurrent <= dateRequested)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_allowed_request })

      const dateTime = moment().utcOffset(330).format('HH:00:00')
      const query = [{
        model: counsellorAvailbleModel,
        as: 'availableTimes',
        where: {
          date,
          status: 'available',
          deleted_at: null
        },
        attributes: ['from_time', 'to_time', 'id', 'date', 'status', 'time_slot_id'],
        order: [['from_time', 'ASC']]
      }]

      if (dateCurrent === dateRequested) {
        query[0].where.from_time = {
          [Op.gt]: dateTime
        }
      }

      const availableSlots = await CounsellorModel.findAll({
        where: {
          id: counsellor_id,
          deleted_at: null,
          is_active: 'y'
        },
        include: query,
        attributes: ['id', 'first_name', 'middle_name', 'last_name', 'email', 'gender']
      })

      if (!availableSlots.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].counsellor_donot_have_time })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'available slots'), data: availableSlots })
    } catch (error) {
      return await catchError('counsellor.counsellorAvail', error, req, res)
    }
  }
}

module.exports = new CounsellorAvailService()
