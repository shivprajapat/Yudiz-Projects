const { handleCatchError } = require('../../../helper/utilities.services')
const { sendNotification } = require('../../queue/notificationQueue')
const UserModel = require('../model')
const StatisticsModel = require('../statistics/model')
const StateModel = require('../states')
const CItyModel = require('../cities')

async function sendNotificationUser (call, callback) {
  try {
    await sendNotification(call.request.aPushToken, call.request.sTitle, call.request.sMessage)
    callback(null, {})
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}
async function findUsers(call, callback) {
  try {
    const query = call.request.query ? JSON.parse(call.request.query) : {}
    const projection = call.request.projection ? JSON.parse(call.request.projection) : {}
    const sorting = call.request.sorting ? JSON.parse(call.request.sorting) : {}

    const userData = await UserModel.find(query, projection).sort(sorting).lean()
    callback(null, { userData: JSON.stringify(userData) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}
async function findUser(call, callback) {
  try {
    const query = call.request.query ? JSON.parse(call.request.query) : {}
    const projection = call.request.projection ? JSON.parse(call.request.projection) : {}
    const sorting = call.request.sorting ? JSON.parse(call.request.sorting) : {}

    const userData = await UserModel.findOne(query, projection).sort(sorting).lean()
    callback(null, { userData: JSON.stringify(userData) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}
async function countUsers(call, callback) {
  try {
    const query = JSON.parse(call.request.query)

    const count = await UserModel.countDocuments(query)
    callback(null, { count: JSON.stringify(count) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}
async function updateUserStatistics(call, callback) {
  try {
    const query = call.request.query ? JSON.parse(call.request.query) : {}
    const values = call.request.values ? JSON.parse(call.request.values) : {}
    const options = call.request.options ? JSON.parse(call.request.options) : {}

    const count = await StatisticsModel.updateOne(query, values, options)
    callback(null, { count })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

async function findCity(call, callback) {
  try {
    const query = call.request.query ? JSON.parse(call.request.query) : {}
    const projection = call.request.projection ? JSON.parse(call.request.projection) : {}

    const data = await CItyModel.findOne(query, projection).lean()
    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

async function findState(call, callback) {
  try {
    const query = call.request.query ? JSON.parse(call.request.query) : {}
    const projection = call.request.projection ? JSON.parse(call.request.projection) : {}

    const data = await StateModel.findOne(query, projection).lean()
    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}
module.exports = {
  findUser,
  sendNotificationUser,
  findUsers,
  countUsers,
  updateUserStatistics,
  findCity,
  findState
}
