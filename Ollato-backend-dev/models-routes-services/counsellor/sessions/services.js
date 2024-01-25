/* eslint-disable camelcase */
const { removenull, getPaginationValues, randomStr } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const studentModel = require('../../student/auth/student.model')
const counsellorAvailbleModel = require('../../counsellor/counsellor_availability.model')
const CounsellorModel = require('../counsellor.model')
const sessionsModel = require('../sessions/session.model')
const sessionsCancelModel = require('../sessions/session.cancel.model')
const sessionsRescheduleModel = require('../sessions/session.reschedule.model')
const sessionsReportModel = require('./report.session.model')
const StudentReviewModel = require('../../student/counsellor/session.rate.model')
const StudentCalcTest = require('../../student/test/student.calc.test.model')
const PackagesModel = require('../../admin/package/package.model')
const StudentPackageModel = require('../../student/package/student.packages.model')
const CounsellorRevenueModel = require('../revenue/counsellor_revenue.model')
const CenterModel = require('../../center/Auth/center.model')
const CenterRevenueModel = require('../../center/revenue/center_revenue.model')
const { Op, Sequelize } = require('sequelize')
const CounsellorDetail = require('../counsellor_details.model')
const { sequelize } = require('../../../database/sequelize')

class CounsellorAvailService {
  async getAllCounsellorSessions(req, res) {
    try {
      removenull(req.body)
      const { sessionStatus } = req.body
      const { start, limit, search } = getPaginationValues(req.body)
      const query = {
        where: {
          counsellor_id: req.user.id,
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
          }
        ],
        order: [
          ['date', 'DESC'],
          ['from_time', 'DESC']
        ],
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
        await sessionsModel.update({ status: 'reject' }, { where: { id: sessionId } })
        await counsellorAvailbleModel.update({ status: 'available' }, { where: { id: getSession.counsellor_aval_id } })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].session) })
      }
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
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
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', 'Reported') })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].session) })
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
          await sessionsModel.update({ status: 'reschedule' }, { where: { id: sessionId } })
          await counsellorAvailbleModel.update({ status: 'available' }, { where: { id: gotSession.counsellor_aval_id } })
          const availableData = await counsellorAvailbleModel.findOne({ raw: true, where: { id: newCounsellorAvailbleId } })
          await sessionsRescheduleModel.create({
            sessions_id: sessionId,
            reason,
            rescheduled_by: 'counsellor'
          })
          const newSession = await sessionsModel.create({
            counsellor_id: gotSession.counsellor_id,
            date: availableData.date,
            from_time: availableData.from_time,
            to_time: availableData.to_time,
            student_id: gotSession.student_id,
            counsellor_aval_id: newCounsellorAvailbleId,
            status: 'accepted'
          })
          await counsellorAvailbleModel.update({ status: 'booked' }, { where: { id: availableData.id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', 'Session re-scheduled'), data: newSession })
        }
      }
      return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].no_sessions })
    } catch (error) {
      console.log('error: ', error)
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
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
            canceled_by: 'counsellor',
            created_by: 'counsellor'
          })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', 'Session cancel') })
        }
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].cannot_cancel })
      }
      return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].no_sessions })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async completeSession(req, res) {
    try {
      removenull(req.body)
      const { sessionId } = req.body
      const gotSession = await sessionsModel.findOne({ raw: true, where: { id: sessionId } })
      if (gotSession) {
        let transaction
        try {
          transaction = await sequelize.transaction()

          await sessionsModel.update({ status: 'completed' }, { where: { id: sessionId } }, { transaction })
          await counsellorAvailbleModel.update({ status: 'available' }, { where: { id: gotSession.counsellor_aval_id } }, { transaction })

          const counsellor = await CounsellorModel.findOne({ where: { id: gotSession.counsellor_id } })

          if ((gotSession.type === 'F2F' || gotSession.type === 'VIDEO') && counsellor.commission !== 0) {
            const studentPakages = await StudentPackageModel.findOne({ where: { id: gotSession.student_package_id } })
            const packages = await PackagesModel.findOne({ where: { id: studentPakages.package_id } })

            const commissionAmount = packages.amount * (counsellor.commission / 100)
            const total_amount = counsellor.total_amount + commissionAmount
            const remaining_amount = counsellor.remaining_amount + commissionAmount

            if (counsellor.center_id === null) {
              await CounsellorModel.update({ total_amount, remaining_amount }, { where: { id: gotSession.counsellor_id } }, { transaction })

              const sCustomId = randomStr(8, 'string')
              await CounsellorRevenueModel.create({ custom_id: sCustomId, counsellor_id: gotSession.counsellor_id, student_id: gotSession.student_id, package_id: packages.id, amount: commissionAmount }, { transaction })
            } else {
              await CenterModel.update({ total_amount, remaining_amount }, { where: { id: counsellor.center_id } }, { transaction })

              const sCustomId = randomStr(8, 'string')
              await CenterRevenueModel.create({ custom_id: sCustomId, center_id: counsellor.center_id, student_id: gotSession.student_id, package_id: packages.id, amount: commissionAmount }, { transaction })
            }
          }
          await transaction.commit()
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', 'Session completed') })
        } catch (error) {
          if (transaction) await transaction.rollback()
          return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
        }
      }
      return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].no_sessions })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }
}

module.exports = new CounsellorAvailService()
