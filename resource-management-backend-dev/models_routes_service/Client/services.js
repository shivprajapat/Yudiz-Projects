/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const ClientModel = require('./model')
const DepartmentModel = require('../Department/model')
const JobProfileModel = require('../JobProfile/model')
const Logs = require('../Logs/model')
const { status, messages } = require('../../helper/api.responses')
const { catchError, pick, validateEmail, validateMobile, SuccessResponseSender, ErrorResponseSender, paginationValue, searchValidate } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { queuePush } = require('../../helper/redis')

const ProjectWiseClient = require('../Project/projectwiseclient.model')
const EmployeeModel = require('../Employee/model')

const { ResourceManagementDB } = require('../../database/mongoose')
const config = require('../../config/config')

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await ClientModel.findOne({ _id: params }).lean()

    const department = await DepartmentModel.find({
      eStatus: 'Y',
      bIsSystem: true,
      sKey: {
        $in: ['HR', 'ADMIN', 'BUSINESSANALYST', 'PRODUCTDEVELOPMENT', 'OPERATION', 'MANAGEMENT', 'MARKETING', 'SALES']
      }
    }, { _id: 1 }).lean()

    const jobProfile = await JobProfileModel.find({
      eStatus: 'Y',
      sPrefix: {
        $in: ['Superior', 'Head', 'Lead', 'Other', 'Manager']
      }
    }, { _id: 1 }).lean()

    const allEmployee = await EmployeeModel.find({
      eStatus: 'Y',
      $or: [
        { iDepartmentId: { $in: department.map((item) => item._id) } },
        { iJobProfileId: { $in: jobProfile.map((item) => item._id) } }
      ]
    }, {
      _id: 1,
      aJwtTokens: 1
    }).lean()

    const sPushToken = []
    const ids = []

    if (allEmployee.length > 0) {
      for (const employee of allEmployee) {
        if (ids.indexOf(employee._id) === -1) {
          ids.push(employee._id)
        }
        if (employee.aJwtTokens.length) {
          for (const pushtoken of employee.aJwtTokens) {
            if (pushtoken?.sPushToken && sPushToken.indexOf(pushtoken.sPushToken) === -1) {
              sPushToken.push(pushtoken.sPushToken)
            }
          }
        }
      }
    }

    const metadata = {
      iClientId: data._id,
      sName: data.sName,
      iCreatedBy: iLastUpdateBy,
      sUrl: url,
      sType: 'client',
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    const person = await EmployeeModel.findOne({ _id: data.iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()

    const putData = {
      sPushToken,
      sTitle: 'Resource Management',
      sBody: `${data.sName}${sBody}by ${person.sName}(${person.sEmpId})`,
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      sType: 'client',
      sUrl: url,
      metadata,
      aSenderId: ids,
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    await queuePush('Project:Notification', putData)
  } catch (error) {
    console.log(error)
  }
}
class Client {
  async addClients(req, res) {
    try {
      const { sEmail, sMobNum } = req.body
      if (!validateEmail(sEmail)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email))
      if (!validateMobile(sMobNum)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobNum))
      const client = await ClientModel.findOne({ $or: [{ sEmail }, { sMobNum }], eStatus: 'Y' }).lean()
      if (client) {
        if (client && client.sEmail === sEmail) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email))
        if (client && client.sMobNum === sMobNum) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobNum))
      }
      const data = await ClientModel.create({ ...req.body, iLastUpdateBy: req.employee._id, iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f') })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Client', sService: 'addClients', eAction: 'Create', oNewFields: data }
      await take.create(logs)

      // await notificationsender(req, data._id, ' client is create ', true, true, req.employee._id, `${config.urlPrefix}/client-management/detail/${data._id}`)

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].client),
        {
          id: data._id
        })
    } catch (error) {
      return catchError('Client.addClients', error, req, res)
    }
  }

  async getClient(req, res) {
    try {
      const client = await ClientModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!client) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].client))
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].client), client)
    } catch (error) {
      return catchError('Client.getClient', error, req, res)
    }
  }

  async deleteClients(req, res) {
    try {
      const client = await ClientModel.findOne({ _id: req.params.id }, {}).lean()
      if (!client) { return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].client)) }
      if (client && client.eStatus === 'Y') {
        const data = await ClientModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].client))
        let take = `Logs${new Date().getFullYear()}`
        take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: client._id, eModule: 'Client', sService: 'deleteClients', eAction: 'Delete', oOldFields: client, oNewFields: data }
        await take.create(logs)
        // await notificationsender(req, data._id, ' client is delete ', true, true, req.employee._id, `${config.urlPrefix}/client-management`)
        return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].client))
      }
      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].client))
    } catch (error) {
      return catchError('Client.deleteClients', error, req, res)
    }
  }

  async updateClients(req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sMobNum', 'sEmail', 'sCountry', 'sOtherInfo'])
      const { sMobNum, sEmail } = req.body
      if (!validateEmail(sEmail)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email))
      if (!validateMobile(sMobNum)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobNum))
      const client = await ClientModel.findOne({ $or: [{ sMobNum }, { sEmail }], _id: { $ne: req.params.id }, eStatus: 'Y' }).lean()
      if (client) {
        if (client.sEmail === sEmail) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email))
        if (client.sMobNum === sMobNum) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobNum))
      }
      const oldClientData = await ClientModel.findById({ _id: req.params.id }).lean()
      if (oldClientData && oldClientData.eStatus === 'Y') {
        const data = await ClientModel.findByIdAndUpdate({ _id: req.params.id }, { ...req.body, iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].client))
        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: req.params.id, eModule: 'Client', sService: 'updateClients', eAction: 'Update', oNewFields: data, oOldFields: oldClientData }
        await take.create(logs)
        // await notificationsender(req, data._id, ' client is update ', true, true, req.employee._id, `${config.urlPrefix}/client-management/detail/${data._id}`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].client))
      }
      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].client))
    } catch (error) {
      return catchError('Client.updateClients', error, req, res)
    }
  }

  async getClients(req, res) {
    try {
      let { page = 0, limit = 5, sorting = 'dCreatedAt', search = '' } = paginationValue(req.query)
      search = searchValidate(search)
      const query = search && search.length
        ? {
          $or: [{ sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
          { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
          { sCountry: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
          ],
          eStatus: 'Y'
        }
        : { eStatus: 'Y' }
      let clients = []; let total = 0
      if (limit !== 'all') {
        [clients, total] = await Promise.all([ClientModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(), ClientModel.countDocuments({ ...query }).lean()])
      } else {
        [clients, total] = await Promise.all([ClientModel.find(query).sort(sorting).lean(), ClientModel.countDocuments({ ...query }).lean()])
      }
      if (req.path === '/DownloadExcel') {
        return clients
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].client), { clients, count: total })
      }
    } catch (error) {
      return catchError('Client.getClient', error, req, res)
    }
  }

  async getClientProjects(req, res) {
    try {
      const { id } = req.params
      const { page = 0, limit = 6, order, sort = 'dCreatedAt', eProjectStatus } = req.query
      const orderBy = order && order === 'desc' ? 1 : -1
      const sorting = { [sort]: orderBy }
      const q = [
        { $match: { iClientId: ObjectId(id), eStatus: 'Y' } },
        {
          $lookup: {
            from: 'projects',
            let: { projectId: '$iProjectId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$projectId'] }, eStatus: 'Y' } },
              { $project: { sProjectName: '$sName', eProjectStatus: '$eProjectStatus', sProjectDescription: '$sProjectDescription', sProjectCode: '$sProjectCode', dCreatedAt: '$dCreatedAt', dUpdatedAt: '$dUpdatedAt', sLogo: '$sLogo' } }
            ],
            as: 'project'
          }
        }, {
          $unwind: '$project'
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$$ROOT',
                '$project'
              ]
            }
          }
        },
        {
          $project: {
            _id: 0,
            iProjectId: '$_id',
            sProjectName: '$sProjectName',
            eProjectStatus: '$eProjectStatus',
            sProjectDescription: '$sProjectDescription',
            dCreatedAt: '$dCreatedAt',
            dUpdatedAt: '$dUpdatedAt',
            sLogo: '$sLogo'
          }
        }
      ]
      if (eProjectStatus) {
        q.splice(3, 0, { $match: { 'project.eProjectStatus': eProjectStatus } })
      }
      const count_query = [...q]
      count_query.push({ $count: 'count' })
      const [clientProject, count] = await Promise.all([ProjectWiseClient.aggregate(q).sort(sorting).skip(Number(page)).limit(Number(limit)), ProjectWiseClient.aggregate(count_query)])
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { clientProject, count: count[0]?.count || 0 })
    } catch (error) {
      return catchError('Client.getClient', error, req, res)
    }
  }
}

module.exports = new Client()
