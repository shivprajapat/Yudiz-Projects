/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const TechnologyModel = require('./model')
const DepartmentModel = require('../Department/model')
const JobProfileModel = require('../JobProfile/model')
const Logs = require('../Logs/model')
const EmployeeModel = require('../Employee/model')
const { status, messages, jsonStatus } = require('../../helper/api.responses')
const { queuePush } = require('../../helper/redis')
const { catchError, projection, keygen, SuccessResponseSender, ErrorResponseSender, paginationValue, searchValidate } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const projectwisetechnologyModel = require('../Project/projectwisetechnology.model')
const ObjectId = mongoose.Types.ObjectId
const s3 = require('../../helper/s3')
const config = require('../../config/config')

const { ResourceManagementDB } = require('../../database/mongoose')

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await TechnologyModel.findOne({ _id: params }).lean()

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
      iTechnology: data._id,
      sName: data.sName,
      iCreatedBy: data.iLastUpdateBy,
      sType: 'technology',
      sUrl: url,
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
      sType: 'technology',
      metadata,
      sUrl: url,
      aSenderId: ids,
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    await queuePush('Project:Notification', putData)
  } catch (error) {
    console.log(error)
  }
}

class Technology {
  async addTechnology(req, res) {
    try {
      const { sName, sLogo } = req.body
      const technology = await TechnologyModel.findOne({ sName, eStatus: 'Y' }).lean()
      if (!sLogo) {
        req.body.sLogo = 'Technology/1685611880408_ascascac1.jpg'
      }
      if (technology) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].technology))
      const data = await TechnologyModel.create({ ...req.body, sKey: keygen(sName), iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f') })
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Technology', sService: 'addTechnology', eAction: 'Create', oNewFields: data }
      await take.create(logs)

      // await notificationsender(req, data._id, ' technology is create ', true, true, req.employee._id, `${config.urlPrefix}/technology/${data._id}`)

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].technology), {
        id: data._id
      })
    } catch (error) {
      return catchError('Technology.addTechnology', error, req, res)
    }
  }

  async deleteTechnologies(req, res) {
    try {
      const technology = await TechnologyModel.findById({ _id: req.params.id }).lean()
      if (!technology) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].technology))

      const project = await projectwisetechnologyModel.findOne({ iTechnologyId: technology._id, eStatus: 'Y' }).lean()
      if (project) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].used_in_project.replace('##', messages[req.userLanguage].technology))

      if (technology && technology.eStatus === 'Y') {
        const data = await TechnologyModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].technology))
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Technology', sService: 'deleteTechnology', eAction: 'Delete', oOldFields: technology }
        await Logs.create(logs)

        // await notificationsender(req, data._id, ' technology is delete ', true, true, req.employee._id, `${config.urlPrefix}/technology/${data._id}`)
        return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].technology))
      }

      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].technology))
    } catch (error) {
      console.log(error)
      return catchError('Technology.deleteTechnologies', error, req, res)
    }
  }

  async updateTechnologies(req, res) {
    try {
      let { sName, sLogo } = req.body
      const technology = await TechnologyModel.findById({ _id: req.params.id }).lean()
      if (!technology) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].technology))
      if (technology && technology.eStatus === 'Y') {
        const technologyKey = await TechnologyModel.findOne({ sKey: keygen(sName), eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
        if (technologyKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].technology))

        if (!sLogo) {
          sLogo = 'Technology/1685611880408_ascascac1.jpg'
        }

        const data = await TechnologyModel.findByIdAndUpdate({ _id: req.params.id }, { sName, sKey: keygen(sName), iLastUpdateBy: req.employee._id, sLogo }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].technology))
        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Technology', sService: 'updateTechnology', eAction: 'Update', oOldFields: technology, oNewFields: data }
        await take.create(logs)

        // await notificationsender(req, data._id, ' technology is update ', true, true, req.employee._id, `${config.urlPrefix}/technology/${data._id}`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].technology))
      }

      return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].technology))
    } catch (error) {
      return catchError('Technology.updateTechnologies', error, req, res)
    }
  }

  async getTechnologies(req, res) {
    const showDetail = projection(['sName', 'iCreatedBy', 'eStatus'])
    try {
      const { page = 0, limit = 5 } = req.query
      if (limit === 'all') {
        const technologies = await TechnologyModel.find({ eStatus: 'Y' }, showDetail).lean()
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].technology), { technologies })
      }
      const [technologies, technologyCount] = await Promise.all([TechnologyModel.find({ eStatus: 'Y' }, showDetail).skip(Number(page)).limit(Number(limit)).lean(), TechnologyModel.countDocuments({ eStatus: 'Y' })])
      let isNext = true
      if (technologyCount <= (Number(page) + 1) * Number(limit)) isNext = false
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].technology), { technologies, count: technologyCount, isNext })
    } catch (error) {
      return catchError('Technology.getTechnologies', error, req, res)
    }
  }

  async search(req, res) {
    try {
      let { page, limit, sorting, search = '' } = paginationValue(req.query)

      search = searchValidate(search)
      const query = search && search.length
        ? {
          $or: [{ sKey: { $regex: new RegExp(search, 'i') } },
          { sName: { $regex: new RegExp(search, 'i') } }
          ],
          eStatus: 'Y'
        }
        : { eStatus: 'Y' }

      let technology = []; let total = 0

      if (limit !== 'all') {
        [technology, total] = await Promise.all([TechnologyModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(), TechnologyModel.countDocuments({ ...query }).lean()])
      } else {
        [technology, total] = await Promise.all([TechnologyModel.find(query).sort(sorting).lean(), TechnologyModel.countDocuments({ ...query }).lean()])
      }

      if (req.path === '/DownloadExcel') {
        return technology
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].technology), { technology, count: total })
      }
    } catch (error) {
      return catchError('Technology.search', error, req, res)
    }
  }

  async getSignedUrl(req, res) {
    try {
      const { sFileName, sContentType } = req.body

      console.log(req.body)

      const bucket = `${config.s3Technology}/`

      const data = await s3.generateUploadUrl(sFileName, sContentType, bucket)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      catchError('Project.getSignedUrl', error, req, res)
    }
  }

  async getTechnologyById(req, res) {
    try {
      const { id } = req.params
      const technology = await TechnologyModel.findOne({ _id: id, eStatus: 'Y' }).lean()
      if (!technology) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].technology))
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].technology), { technology })
    } catch (error) {
      catchError('Technology.getTechnologyById', error, req, res)
    }
  }
}

module.exports = new Technology()
