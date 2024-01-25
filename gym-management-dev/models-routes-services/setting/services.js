// @ts-check
const SettingModelModel = require('./model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError } = require('../../helper/utilities.services')
const { operationName, operationCode } = require('../../data')
const { addLog } = require('../operationLog/service')

class Setting {
  async add (req, res) {
    try {
      const isSettingExists = await SettingModelModel.findOne({}, { _id: 1 }).lean()
      if (isSettingExists) {
        return res.status(status.BadRequest).json({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].setting)
        })
      }
      await SettingModelModel.create(req.body)
      await addLog({
        iOperationBy: req?.admin?._id,
        oOperationBody: { ip: req?.userIP, iCreatedBy: req.admin?._id, ...req.body },
        sOperationName: operationName?.SETTING_ADD,
        sOperationType: operationCode?.CREATE
      })
      return res.status(status.Create).json({
        status: jsonStatus.Create,
        message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].setting)
      })
    } catch (error) {
      catchError('Setting.Add', error, req, res)
    }
  }

  async update (req, res) {
    try {
      const setting = await SettingModelModel.findOne({ _id: req.params.id }).lean()
      if (!setting) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].setting)
        })
      }
      const updateResponse = await SettingModelModel.updateOne({ _id: req.params.id }, { ...req.body }, { runValidators: true })
      if (updateResponse?.modifiedCount) {
        await addLog({
          iOperationBy: req?.admin?._id,
          oOperationBody: { ip: req?.userIP, iCreatedBy: req.admin?._id, ...req.body, ...req.params },
          sOperationName: operationName?.SETTING_UPDATE,
          sOperationType: operationCode?.UPDATE
        })
        return res.status(status.OK).json({
          status: jsonStatus.OK,
          message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].setting)
        })
      }
      return res.status(status.NotFound).json({
        status: jsonStatus.NotFound,
        message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].setting)
      })
    } catch (error) {
      catchError('Setting.update', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const oSetting = await SettingModelModel.findOne({}).lean()
      if (!oSetting) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].setting)
        })
      }
      return res.status(status.OK).json({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].data),
        data: oSetting
      })
    } catch (error) {
      catchError('Setting.get', error, req, res)
    }
  }
}
module.exports = new Setting()
