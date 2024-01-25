const UserModel = require('../user/model')
const ReportModel = require('./model')
const { catchError, responseMessage } = require('../../helpers/utilityServices')

class Report {
  async fetchReport (req, res) {
    try {
      const data = await ReportModel.find({}, { dCreatedAt: 0, dUpdatedAt: 0, __v: 0 }).lean()
      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Report', data?.[0])
    } catch (error) {
      return catchError(req, res)
    }
  }

  async fetchUserReport (req, res) {
    try {
      let report
      const { eKey } = req.body

      const dateQuery = getDates()

      if (eKey === 'TU') {
        const oTotalUser = {}
        oTotalUser.nTotalUsers = await getUserCount({ bIsUser: true })
        report = { oTotalUser: { ...oTotalUser, dUpdatedAt: new Date() } }
      } else if (eKey === 'RU') {
        const oRegisterUser = {}
        oRegisterUser.nToday = await getUserCount({ bIsUser: true, dCreatedAt: dateQuery.toDay })
        oRegisterUser.nYesterday = await getUserCount({ bIsUser: true, dCreatedAt: dateQuery.yesterDay })
        oRegisterUser.nLastWeek = await getUserCount({ bIsUser: true, dCreatedAt: dateQuery.week })
        oRegisterUser.nLastMonth = await getUserCount({ bIsUser: true, dCreatedAt: dateQuery.month })
        oRegisterUser.nLastYear = await getUserCount({ bIsUser: true, dCreatedAt: dateQuery.year })
        report = { oRegisterUser: { ...oRegisterUser, dUpdatedAt: new Date() } }
      } else if (eKey === 'LU') {
        const oLoginUser = {}
        oLoginUser.nToday = await getUserCount({ bIsUser: true, dLoginAt: dateQuery.toDay }).lean()
        oLoginUser.nYesterday = await getUserCount({ bIsUser: true, dLoginAt: dateQuery.yesterDay }).lean()
        oLoginUser.nLastWeek = await getUserCount({ bIsUser: true, dLoginAt: dateQuery.week }).lean()
        oLoginUser.nLastMonth = await getUserCount({ bIsUser: true, dLoginAt: dateQuery.month }).lean()
        oLoginUser.nLastYear = await getUserCount({ bIsUser: true, dLoginAt: dateQuery.year }).lean()
        report = { oLoginUser: { ...oLoginUser, dUpdatedAt: new Date() } }
      } else if (eKey === 'TC') {
        const oTotalContacts = {}
        oTotalContacts.nTotalContacts = await getUserCount({ bIsUser: false })
        report = { oTotalContacts: { ...oTotalContacts, dUpdatedAt: new Date() } }
      } else if (eKey === 'UU') {
        const oUpdateUser = {}
        oUpdateUser.nToday = await getUserCount({ bIsUser: true, dUpdatedAt: dateQuery.toDay }).lean()
        oUpdateUser.nYesterday = await getUserCount({ bIsUser: true, dUpdatedAt: dateQuery.yesterDay }).lean()
        oUpdateUser.nLastWeek = await getUserCount({ bIsUser: true, dUpdatedAt: dateQuery.week }).lean()
        oUpdateUser.nLastMonth = await getUserCount({ bIsUser: true, dUpdatedAt: dateQuery.month }).lean()
        oUpdateUser.nLastYear = await getUserCount({ bIsUser: true, dUpdatedAt: dateQuery.year }).lean()
        report = { oUpdateUser: { ...oUpdateUser, dUpdatedAt: new Date() } }
      } else {
        return responseMessage(req, res, 'BadRequest', 'invalidEntry', 'Key')
      }
      await ReportModel.findOneAndUpdate({}, { ...report }, { upsert: true, new: true, runValidators: true }).lean()

      return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'Report', { data: { ...report } })
    } catch (error) {
      return catchError(req, res)
    }
  }
}

module.exports = new Report()

function getDates () {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const first = today.getDate() - today.getDay() // First day is the day of the month - the day of the week
  const last = first + 6 // last day is the first day + 6

  const weekStart = new Date(today.setDate(first))
  const weekEnd = new Date(today.setDate(last))

  today.setDate(new Date().getDate())

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const yearStart = new Date(today.getFullYear(), 0, 1)
  const yearEnd = new Date(today.getFullYear(), 11, 31)

  const dates = {
    toDay: {
      $gte: new Date(today.setHours(0, 0, 0)).toJSON(),
      $lt: new Date(today.setHours(23, 59, 59)).toJSON()
    },
    yesterDay: {
      $gte: new Date(yesterday.setHours(0, 0, 0)).toJSON(),
      $lt: new Date(yesterday.setHours(23, 59, 59)).toJSON()
    },
    week: {
      $gte: new Date(weekStart.setHours(0, 0, 0)).toJSON(),
      $lt: new Date(weekEnd.setHours(23, 59, 59)).toJSON()
    },
    month: {
      $gte: new Date(monthStart.setHours(0, 0, 0)).toJSON(),
      $lt: new Date(monthEnd.setHours(23, 59, 59)).toJSON()
    },
    year: {
      $gte: new Date(yearStart.setHours(0, 0, 0)).toJSON(),
      $lt: new Date(yearEnd.setHours(23, 59, 59)).toJSON()
    }
  }

  return dates
}

function getUserCount (condition) {
  return UserModel.countDocuments(condition).lean()
}
