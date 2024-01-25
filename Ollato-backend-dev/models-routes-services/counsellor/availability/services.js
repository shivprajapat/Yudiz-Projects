/* eslint-disable camelcase */
const { catchError, removenull, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const CounsellorAvailModel = require('../counsellor_availability.model')
const CounsellorModel = require('../counsellor.model')
const TimeSlotsModel = require('../timeslots.model')
const { Op, Sequelize } = require('sequelize')
const _ = require('lodash')
const moment = require('moment')

class CounsellorAvailService {
  async setCounsellor(req, res) {
    try {
      removenull(req.body)
      const { time_slot_id, date, counsellor_status, block_date } = req.body
      const counsellorAvail = []
      const forLoop = async _ => {
        for (let i = 0; i < date.length; i++) {
          const dateAvail = date[i]

          if (!block_date.includes(dateAvail)) {
            const timeSlot = async _ => {
              for (let time = 0; time < time_slot_id.length; time++) {
                const timeSlotDetails = await TimeSlotsModel.findOne({ where: { id: time_slot_id[time] } })
                // Check already slot added or not
                const checkSlot = await CounsellorAvailModel.findOne({
                  where: {
                    time_slot_id: timeSlotDetails.id,
                    counsellor_id: req.user.id,
                    status: counsellor_status,
                    date: dateAvail,
                    deleted_at: null
                  }
                })
                if (!checkSlot) {
                  const setCounselor = await CounsellorAvailModel.create({ time_slot_id: timeSlotDetails.id, counsellor_id: req.user.id, dateAvail, from_time: timeSlotDetails.from_time, to_time: timeSlotDetails.to_time, status: counsellor_status, date: dateAvail })
                  counsellorAvail.push(setCounselor)
                }
              }
            }
            await timeSlot()
          }
        }
      }
      await forLoop()
      if (counsellorAvail) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: counsellorAvail, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].counsellorAvailable) })
    } catch (error) {
      return await catchError('', error, req, res)
    }
  }

  async getAllCounsellorAvailabile(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      let today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      today = yyyy + '-' + mm + '-' + dd

      const query = {
        where: {
          counsellor_id: req.user.id,
          date: {
            [Op.ne]: null,
            [Op.gte]: today
          },
          deleted_at: {
            [Op.eq]: null
          }
        },
        attributes: ['date', [Sequelize.fn('COUNT', Sequelize.col('date')), 'date_count']],
        group: 'date',
        order: sorting,
        limit,
        offset: start
      }
      if (search) {
        Object.assign(query.where, {
          [Op.or]: [{ date: { [Op.like]: `%${search}%` } }]
        })
      }
      const counsellorAvail = await CounsellorAvailModel.findAll(query)
      const counsellorAvailCount = await CounsellorAvailModel.count({
        where: {
          counsellor_id: req.user.id,
          date: {
            [Op.ne]: null,
            [Op.gte]: today
          },
          deleted_at: {
            [Op.eq]: null
          }
        },
        attributes: ['date', [Sequelize.fn('COUNT', Sequelize.col('date')), 'date_count']],
        group: 'date'
      })

      const availableCounsellor = []
      for (let index = 0; index < counsellorAvail.length; index++) {
        const counsellor = {}
        const distinctDates = await CounsellorAvailModel.findAll({
          where: {
            counsellor_id: req.user.id,
            date: counsellorAvail[index].dataValues.date,
            deleted_at: null
          },
          order: [['from_time', 'ASC']]
        })
        const arrFromTime = []
        const arrToTime = []
        for (let i = 0; i < distinctDates.length; i++) {
          // sort date then push
          arrFromTime.push(distinctDates[i].dataValues.from_time)
          arrToTime.push(distinctDates[i].dataValues.to_time)
          counsellor.counsellor_id = distinctDates[i].dataValues.counsellor_id
          counsellor.is_active = distinctDates[i].dataValues.is_active
          counsellor.status = distinctDates[i].dataValues.status
          counsellor.created_by = distinctDates[i].dataValues.created_by
          counsellor.updated_by = distinctDates[i].dataValues.updated_by
          counsellor.deleted_at = distinctDates[i].dataValues.deleted_at
        }

        counsellor.date = counsellorAvail[index].dataValues.date
        counsellor.from_time = arrFromTime
        counsellor.to_time = arrToTime
        availableCounsellor.push(counsellor)
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: { rows: availableCounsellor, count: counsellorAvailCount.length }, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('counsellor.getAllCounsellor', error, req, res)
    }
  }

  async updateCounsellorAvailbility(req, res) {
    try {
      removenull(req.body)
      const { time_slot, date, counsellor_status, updateType, isActive } = req.body

      const exist = await CounsellorAvailModel.findOne({ where: { date, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await CounsellorAvailModel.update({ is_active: isActive }, { where: { date: date } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].counsellorAvailable) })
        } else {
          const counsellorAvail = await CounsellorAvailModel.findAll({ raw: true, where: { date, counsellor_id: req.user.id, deleted_at: null } })

          const difference = _.differenceWith(counsellorAvail, time_slot, function (o1, o2) {
            const optionId = parseInt(o2.id)
            return o1.id === optionId
          })

          // delete difference data
          for (let i = 0; i < difference.length; i++) {
            await CounsellorAvailModel.update({ deleted_at: new Date() }, { where: { id: difference[i].id } })
          }

          const forLoop = async _ => {
            for (let index = 0; index < time_slot.length; index++) {
              if (time_slot[index] && time_slot[index].id !== undefined) {
                await CounsellorAvailModel.update({ time_slot_id: time_slot[index].time_slot_id, from_time: time_slot[index].from_time, to_time: time_slot[index].to_time, counsellor_id: req.user.id, status: counsellor_status }, { where: { id: time_slot[index].id, deleted_at: null } })
              } else {
                const timeSlotDetails = await TimeSlotsModel.findOne({ raw: true, where: { id: time_slot[index].time_slot_id } })
                await CounsellorAvailModel.create({ time_slot_id: timeSlotDetails.id, counsellor_id: req.user.id, from_time: timeSlotDetails.from_time, to_time: timeSlotDetails.to_time, status: counsellor_status, date })
              }
            }
          }
          await forLoop()
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].counsellorAvailable) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].counsellorAvailable) })
      }
    } catch (error) {
      return await catchError('', error, req, res)
    }
  }

  async timeSlotAfterCurrTime(req, res) {
    try {
      const timeSlot = await TimeSlotsModel.findAll({
        where: {
          from_time: {
            [Op.gt]: moment().utcOffset(330).format('HH:00:00')
          }
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: timeSlot, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('', error, req, res)
    }
  }

  async getByDate(req, res) {
    try {
      removenull(req.body)
      const { date } = req.body

      const dateCurrent = moment().format('YYYY-MM-DD')
      const dateRequested = moment(date).format('YYYY-MM-DD')
      if (!(dateCurrent <= dateRequested)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_allowed_request })

      const dateTime = moment().utcOffset(330).format('HH:00:00')
      const query = [{
        model: CounsellorAvailModel,
        as: 'availableTimes',
        where: {
          date,
          status: 'available',
          deleted_at: null
        },
        attributes: ['from_time', 'to_time', 'id', 'date', 'status', 'time_slot_id'],
        order: [
          ['from_time', 'ASC']
        ]
      }]

      if (dateCurrent === dateRequested) {
        query[0].where.from_time = {
          [Op.gt]: dateTime
        }
      }

      const availableSlots = await CounsellorModel.findAll({
        where: {
          id: req.user.id,
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

  async getTimeSlot(req, res) {
    try {
      removenull(req.body)
      const timeSlotData = await TimeSlotsModel.findAll()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: timeSlotData })
    } catch (error) {
      return await catchError('testService.getAlltimeSlot', error, req, res)
    }
  }

  async deleteAvailability(req, res) {
    try {
      removenull(req.body)
      const { date } = req.body
      await CounsellorAvailModel.update({ deleted_at: new Date() }, { where: { date } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].counsellorAvailable) })
    } catch (error) {
      return await catchError('counsellor.deleteCounsellorAvail', error, req, res)
    }
  }
}

module.exports = new CounsellorAvailService()
