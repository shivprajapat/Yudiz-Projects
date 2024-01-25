const ReportModel = require('../report/model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, getPaginationValues } = require('../../helper/utilities.services')
const { getObject } = require('../../helper/cloudStorage.services')
const config = require('../../config/config')

class Transaction {
  async get (req, res) {
    try {
      const sPath = config.S3_TRANSACTION_REPORT_PATH
      const { id } = req?.params
      const reportInfo = await ReportModel.findOne({ _id: id })
      if (!reportInfo) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].report) })
      const sObjectUrl = await getObject({ sFileName: reportInfo?.sFileName, path: sPath })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].report), data: sObjectUrl })
    } catch (error) {
      catchError('c.get', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { page = 0, limit = 10, sorting } = getPaginationValues(req.query)
      const projectFields = {
        __v: 0,
        sPath: 0,
        sType: 0
      }
      const firstStage = { eStatus: { $ne: 'D' } }
      if (req?.query?.isBranch)firstStage.isBranch = req?.query.isBranch
      const [aReportList, count] = await Promise.all([
        ReportModel.find(firstStage, projectFields).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(),
        ReportModel.countDocuments(firstStage)
      ])
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].organization), data: { aReportList, count } })
    } catch (error) {
      catchError('Report.List', error, req, res)
    }
  }
}

module.exports = new Transaction()
