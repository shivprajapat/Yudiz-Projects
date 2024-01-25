/*  eslint-disable */
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { removenull, catchError } = require('../../../helper/utilities.services')
const timeSlotModel = require('../../counsellor/timeslots.model')
class TimeSlotService {

  async getTimeSlot(req, res) {
    try {
      removenull(req.body)
      const timeSlotData = await timeSlotModel.findAll()

     return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: timeSlotData })
    } catch (error) {
      return await catchError('testService.getAlltimeSlot', error, req, res)
    }
  } 
}

module.exports = new TimeSlotService()
