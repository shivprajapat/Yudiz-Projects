const { removenull, getPaginationValues, randomStr } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const counsellorModel = require('../../counsellor/counsellor.model')
const counsellorDetailsModel = require('../../counsellor/counsellor_details.model')
const counsellorAvailabilityModel = require('../../counsellor/counsellor_availability.model')
const sessionsModel = require('../../counsellor/sessions/session.model')
const sessionsRescheduleModel = require('../../counsellor/sessions/session.reschedule.model')
const sessionsCancelModel = require('../../counsellor/sessions/session.cancel.model')
const studentPackagesModel = require('../package/student.packages.model')
const StudentModel = require('../../student/auth/student.model')
const SessionsReportModel = require('../../counsellor/sessions/report.session.model')
const StudentReviewModel = require('./session.rate.model')
const StudentCalcTest = require('../test/student.calc.test.model')
const moment = require('moment')

const { Op } = require('sequelize')
const { Sequelize, sequelize } = require('../../../database/sequelize')

class CounsellorService {
  async getAllCounsellor(req, res) {
    try {
      removenull(req.body)

      const existPackage = await getStudentPackage(req.user.id)
      if (!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package })

      /** check user test */
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const counselors = await counsellorModel.findAll({
        where:
      {
        [Op.or]: [
          {
            first_name: {
              [Op.like]: `%${search}%`
            }
          },
          {
            last_name: {
              [Op.like]: `%${search}%`
            }
          }
        ],
        deleted_at: null,
        is_active: 'y',
        status: 'approved'
      },
        include: [{
          model: counsellorDetailsModel,
          as: 'details',
          attributes: []
        }],
        order: sorting,
        limit,
        offset: start,
        attributes: ['id', 'first_name', 'last_name', [Sequelize.col('details.profile_picture'), 'profile']]
      })
      if (!counselors.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'school') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: counselors })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async getCounsellor(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const existPackage = await getStudentPackage(req.user.id)
      if (!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package })

      const counsellor = await counsellorModel.findOne({
        where: { id, deleted_at: null, is_active: 'y', status: 'approved' },
        include: [
          {
            required: false,
            model: counsellorDetailsModel,
            as: 'details',
            where: { deleted_at: null },
            attributes: []
          },
          {
            model: counsellorAvailabilityModel,
            as: 'availableTimes',
            where: {
              status: 'available',
              deleted_at: null
            },
            attributes: ['date'],
            order: [['from_time', 'ASC']]
          }
        ],
        attributes: ['id', 'custom_id', 'first_name', 'last_name', 'avg_ratings', 'career_counsellor', 'psychologist', 'overseas_counsellor', 'gender',
          [Sequelize.col('details.profile_picture'), 'profile_picture']
        ]
      })
      if (!counsellor) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'data') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: { counsellor, existPackage } })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async getAvailableCounsellorOne(req, res) {
    try {
      removenull(req.body)
      const { date, id, availabilityStatus } = req.body

      const dateCurrent = moment().format('YYYY-MM-DD')
      const dateRequested = moment(date).format('YYYY-MM-DD')
      if (!(dateCurrent <= dateRequested)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_allowed_request })

      if (!availabilityStatus) {
        const existPackage = await getStudentPackage(req.user.id)
        if (!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package })
      }

      const dateTime = moment().utcOffset(330).format('HH:00:00')

      const query = {
        counsellor_id: id,
        deleted_at: null,
        is_active: 'y',
        date,
        status: 'available'
      }
      if (dateCurrent === dateRequested) {
        query.from_time = {
          [Op.gt]: dateTime
        }
      }
      const availableSlots = await counsellorAvailabilityModel.findAll({
        where: query,
        order: [
          ['from_time', 'ASC']
        ],
        attributes: ['id', 'from_time', 'to_time', 'counsellor_id', 'date', 'time_slot_id']
      })

      if (!availableSlots.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].counsellor_donot_have_time })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'available slots'), data: availableSlots })
    } catch (error) {
      console.log(error)
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
          model: StudentModel,
          as: 'student',
          attributes: []
        },
        {
          model: counsellorModel,
          as: 'counsellors',
          where: { deleted_at: null, is_active: 'y', status: 'approved' },
          attributes: []
        }],
        attributes: ['id', 'counsellor_id', 'counsellor_aval_id', 'student_package_id', 'date', 'from_time', 'to_time', 'type', 'status', [Sequelize.col('student.id'), 'student_id'], [Sequelize.col('student.first_name'), 'student_first_name'], [Sequelize.col('student.middle_name'), 'student_middle_name'], [Sequelize.col('student.last_name'), 'student_last_name'], [Sequelize.col('student.email'), 'student_email'], [Sequelize.col('student.mobile'), 'student_mobile'], [Sequelize.col('student.profile'), 'student_profile'], [Sequelize.col('counsellors.id'), 'counsellors_id'], [Sequelize.col('counsellors.first_name'), 'counsellors_first_name'], [Sequelize.col('counsellors.middle_name'), 'counsellors_middle_name'], [Sequelize.col('counsellors.last_name'), 'counsellors_last_name'], [Sequelize.col('counsellors.email'), 'counsellors_email']]
      })

      getSession.counsellors_profile = null
      const counsellorDetail = await counsellorDetailsModel.findOne({
        raw: true,
        where: {
          counsellor_id: getSession.counsellor_id
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
        const reportData = await SessionsReportModel.findOne({
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

  async sessionBook (req, res) {
    try {
      removenull(req.body)
      const { id, counselorAvalId, type, counsellorType } = req.body

      const existPackage = await getStudentPackage(req.user.id)
      if (!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package })

      const availableSlot = await counsellorAvailabilityModel.findOne({
        raw: true,
        where: {
          id: counselorAvalId,
          deleted_at: null,
          is_active: true,
          status: 'available'
        },
        attributes: ['from_time', 'to_time', 'id', 'date']
      })

      if (!availableSlot) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].session_slot_not_available })

      /** Book sesson */
      const bookSessionData = {
        counsellor_id: id,
        counsellor_aval_id: availableSlot.id,
        student_id: req.user.id,
        student_package_id: existPackage.id,
        date: availableSlot.date,
        from_time: availableSlot.from_time,
        to_time: availableSlot.to_time,
        status: 'panding',
        type,
        counsellor_type: counsellorType
      }

      const bookSession = await sessionsModel.create(bookSessionData)
      if (bookSession) {
        /** update counselor availablity slot */
        await counsellorAvailabilityModel.update({ status: 'booked' }, { where: { id: availableSlot.id } })
        /** update student package */
        const query = {}
        if (type === 'VIDEO') {
          query.videoCall = 0
        } else {
          query.f2fCall = 0
        }
        await studentPackagesModel.update(query, { where: { student_id: req.user.id, id: existPackage.id } })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', 'session booked'), data: bookSession })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async getAllSessions(req, res) {
    try {
      removenull(req.body)
      const { sessionStatus, date, time } = req.body
      const query = {
        student_id: req.user.id
      }
      let today = new Date()
      if (sessionStatus && sessionStatus !== 'all' && sessionStatus !== 'upcoming') {
        query.status = sessionStatus
      }
      if (sessionStatus === 'upcoming') {
        const dd = String(today.getDate()).padStart(2, '0')
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const yyyy = today.getFullYear()
        today = yyyy + '-' + mm + '-' + dd
        query.date = { [Op.gte]: today }
        query.status = 'accepted'
      }
      if (date) {
        query.date = date
      }
      if (time) {
        query.from_time = time
      }
      const gotSessions = await sessionsModel.findAll({
        where: query,
        include: [
          {
            model: counsellorModel,
            as: 'counsellors',
            required: false,
            include: [{
              model: counsellorDetailsModel,
              as: 'details',
              attributes: []
            }],
            attributes: []
          }
        ],
        attributes: ['id', 'counsellor_id', 'counsellor_aval_id', 'student_id', 'date', 'from_time', 'to_time', 'status', [Sequelize.col('counsellors.first_name'), 'counsellor_first_name'], [Sequelize.col('counsellors.middle_name'), 'counsellor_middle_name'], [Sequelize.col('counsellors.last_name'), 'counsellor_last_name'], [Sequelize.col('counsellors.email'), 'counsellor_email'], [Sequelize.col('counsellors->details.profile_picture'), 'counsellors_profile']]
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: gotSessions })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async rescheduleSession(req, res) {
    const t = await sequelize.transaction()
    try {
      removenull(req.body)
      const { sessionId, counsellorAvalId, reason } = req.body
      const gotSession = await sessionsModel.findOne({ raw: true, where: { id: sessionId } })

      if (gotSession) {
        await sessionsModel.update({ status: 'reschedule' }, { where: { id: sessionId } }, { transaction: t })
        await counsellorAvailabilityModel.update({ status: 'available' }, { where: { id: gotSession.counsellor_aval_id } }, { transaction: t })
        const availableData = await counsellorAvailabilityModel.findOne({ raw: true, where: { id: counsellorAvalId } }, { transaction: t })
        await sessionsRescheduleModel.create({
          sessions_id: sessionId,
          reason,
          rescheduled_by: 'student'
        }, { transaction: t })
        const newSession = await sessionsModel.create({
          counsellor_id: gotSession.counsellor_id,
          date: availableData.date,
          from_time: availableData.from_time,
          to_time: availableData.to_time,
          student_id: req.user.id,
          student_package_id: gotSession.student_package_id,
          counsellor_aval_id: counsellorAvalId,
          status: 'panding'
        }, { transaction: t })
        await counsellorAvailabilityModel.update({ status: 'booked' }, { where: { id: availableData.id }, transaction: t })
        await t.commit()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', 'Session re-scheduled'), data: newSession })
      }
      return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].no_sessions })
    } catch (error) {
      console.log('error: ', error)
      await t.rollback()
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
          await counsellorAvailabilityModel.update({ status: 'available' }, { where: { id: gotSession.counsellor_aval_id } })
          /** update student package */
          const type = gotSession.type
          const query = {}
          if (type === 'VIDEO') {
            query.videoCall = 1
          } else {
            query.f2fCall = 1
          }
          await studentPackagesModel.update(query, { where: { student_id: req.user.id, id: gotSession.student_package_id } })
          await sessionsCancelModel.create({
            sessions_id: sessionId,
            reason,
            canceled_by: 'student',
            created_by: 'student'
          })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'Session cancel') })
        }
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].cannot_cancel })
      }
      return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].no_sessions })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async getFilterAllCounsellor(req, res) {
    try {
      const { date, time, type } = req.body
      removenull(req.body)

      // const existPackage = await getStudentPackage(req.user.id)
      // if (!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package })

      const student = await StudentModel.findOne({ raw: true, where: { id: req.user.id } })
      if (!student) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', 'student') })

      const query = {}
      query.status = 'available'
      let today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      today = yyyy + '-' + mm + '-' + dd
      query.date = { [Op.gte]: today }
      if (date) {
        query.date = date
      }
      if (time) {
        query.from_time = time
      }
      query.deleted_at = {
        [Op.eq]: null
      }
      query.counsellor_id = {
        [Op.ne]: null
      }
      // Get all available timeslots to find counsellors
      const counsellorAvail = await counsellorAvailabilityModel.findAll({
        where: query,
        attributes: ['counsellor_id'],
        group: 'counsellor_id'
      })
      const gotCounsellorsId = await counsellorAvail.map((gotData) => gotData.counsellor_id)
      gotCounsellorsId.reverse()
      // get available counsellors by date
      const counsellorQuery = {}
      counsellorQuery.is_active = 'y'
      counsellorQuery.status = 'approved'
      counsellorQuery.deleted_at = {
        [Op.eq]: null
      }
      if (student.center_id) {
        counsellorQuery.center_id = {
          [Op.or]: [student.center_id, null]
        }
      }
      if (student.counselor_id) {
        counsellorQuery.id = student.counselor_id
      } else {
        counsellorQuery.id = {
          [Op.in]: gotCounsellorsId
        }
      }
      if (type) {
        if (type === 'career_counsellor') {
          counsellorQuery.career_counsellor = 1
        }
        if (type === 'psychologist') {
          counsellorQuery.psychologist = 1
        }
        if (type === 'overseas_counsellor') {
          counsellorQuery.overseas_counsellor = 1
        }
        if (type === 'subject_expert') {
          counsellorQuery.subject_expert = 1
        }
      }
      const gotCounsellors = await counsellorModel.findAll({
        where: counsellorQuery,
        include: [{
          model: counsellorDetailsModel,
          as: 'details',
          attributes: []
        }],
        attributes: ['id', 'custom_id', 'first_name', 'last_name', 'avg_ratings', 'career_counsellor', 'psychologist', 'overseas_counsellor', [Sequelize.col('details.profile_picture'), 'profile']]
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: gotCounsellors })
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
        await SessionsReportModel.create({
          reason,
          sessions_id: sessionId,
          report_by: reportBy
        })
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].report) })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].session) })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }

  async rateSession(req, res) {
    try {
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const { session_id, counsellor_id, ratings, message } = req.body

      const exist = await StudentReviewModel.findOne({ where: { student_id: req.user.id, session_id, counsellor_id, ratings: { [Op.ne]: null } } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].ratings) })

      const sCustomId = randomStr(8, 'string')
      const studentRatings = await StudentReviewModel.create({ custom_id: sCustomId, student_id: req.user.id, session_id, counsellor_id, ratings, message })

      const counsellor = await StudentReviewModel.findAll({
        where: { counsellor_id },
        attributes: [
          [Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('ratings'), 'integer')), 'avgAssetAmount']
        ]
      })

      const avgRatings = parseFloat(counsellor[0].dataValues.avgAssetAmount)
      await counsellorModel.update({ avg_ratings: avgRatings }, { where: { id: counsellor_id } })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: studentRatings, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].ratings) })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error, data: error })
    }
  }
}

/** Get student current package */
const getStudentPackage = async (studentId) => {
  const studentPackage = await studentPackagesModel.findOne({
    raw: true,
    where: {
      student_id: studentId,
      [Op.or]: [
        {
          videoCall: true
        },
        {
          f2fCall: true
        }
      ],
      isExpired: false,
      payment_status: 'C',
      expireDate: { [Op.gt]: new Date() }
    },
    order: [['created_at', 'ASC']],
    attributes: ['custom_id', 'f2fCall', 'id', 'onlineTest', 'package_id', 'student_id', 'testReport', 'videoCall']
  })
  return studentPackage
}

module.exports = new CounsellorService()
