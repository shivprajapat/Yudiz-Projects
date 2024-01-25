/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const ProjectTagModel = require('./model')
const DepartmentModel = require('../Department/model')
const JobProfileModel = require('../JobProfile/model')
const Logs = require('../Logs/model')
const { status, messages } = require('../../helper/api.responses')
const { catchError, projection, keygen, SuccessResponseSender, ErrorResponseSender, paginationValue, searchValidate, setBackgroundColor, checkcolor, getRandomColor } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const projectwisetagModel = require('../Project/projectwisetag.model')
const ObjectId = mongoose.Types.ObjectId
const { queuePush } = require('../../helper/redis')
const EmployeeModel = require('../Employee/model')
const { ResourceManagementDB } = require('../../database/mongoose')
const config = require('../../config/config')

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await ProjectTagModel.findOne({ _id: params }).lean()

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
      iProjectTagId: data._id,
      sName: data.sName,
      iCreatedBy: data.iLastUpdateBy,
      sType: 'tag',
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
      sType: 'tag',
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
class ProjectTag {
  async addProjectTag(req, res) {
    try {
      const { sName } = req.body
      const projectTag = await ProjectTagModel.findOne({ sKey: keygen(sName), eStatus: 'Y' }).lean()
      if (projectTag) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].projectTag))
      const sColor = await ProjectTagModel.find({ eStatus: 'Y' }).lean()
      let s = getRandomColor()
      if (sColor.length) {
        s = checkcolor(s, sColor)
      }
      const data = await ProjectTagModel.create({ ...req.body, sKey: keygen(sName), sBackGroundColor: s.sBackGroundColor, sTextColor: s.sTextColor, iLastUpdateBy: req.employee._id, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f') })
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'ProjectTag', sService: 'addProjectTag', eAction: 'Create', oNewFields: data }
      await take.create(logs)

      // await notificationsender(req, data._id, ' projectTag is create ', true, true, req.employee._id, `${config.urlPrefix}/projectTag/${data._id}`)
      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].projectTag), {
        id: data._id,
        sBackGroundColor: data.sBackGroundColor,
        sTextColor: data.sTextColor
      })
    } catch (error) {
      return catchError('ProjectTag.addProjectTag', error, req, res)
    }
  }

  async deleteProjectTags(req, res) {
    try {
      const projectTag = await ProjectTagModel.findById({ _id: req.params.id }).lean()
      if (!projectTag) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].projectTag))

      const project = await projectwisetagModel.findOne({ iProjectTagId: req.params.id, eStatus: 'Y' }).lean()
      if (project) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].used_in_project.replace('##', messages[req.userLanguage].projectTag))

      if (projectTag && projectTag.eStatus === 'Y') {
        const data = await ProjectTagModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].projectTag))
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'ProjectTag', sService: 'deleteProjectTags', eAction: 'Delete', oOldFields: data }
        await Logs.create(logs)

        // await notificationsender(req, data._id, ' projectTag is delete ', true, true, req.employee._id, `${config.urlPrefix}/projectTag/${data._id}`)
        return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].projectTag))
      }

      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].projectTag))
    } catch (error) {
      return catchError('ProjectTag.deleteProjectTags', error, req, res)
    }
  }

  async updateProjectTags(req, res) {
    try {
      const { sName } = req.body
      const projectTag = await ProjectTagModel.findById({ _id: req.params.id }).lean()
      if (!projectTag) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].projectTag))
      if (projectTag && projectTag.eStatus === 'Y' && projectTag.sKey !== keygen(sName)) {
        const projectTagKey = await ProjectTagModel.findOne({ sKey: keygen(sName), eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
        if (projectTagKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].projectTag))
        const data = await ProjectTagModel.findByIdAndUpdate({ _id: req.params.id }, { sName, sKey: keygen(sName), iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].projectTag))
        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'ProjectTag', sService: 'updateProjectTags', eAction: 'Update', oOldFields: projectTag, oNewFields: data }
        await take.create(logs)
        // await notificationsender(req, data._id, ' projectTag is update ', true, true, req.employee._id, `${config.urlPrefix}/projectTag/${data._id}`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].projectTag))
      }
      return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].projectTag))
    } catch (error) {
      return catchError('ProjectTag.updateProjectTags', error, req, res)
    }
  }

  async getProjectTags(req, res) {
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
      let projectTag = []; let total = 0

      if (limit !== 'all') {
        [projectTag, total] = await Promise.all([ProjectTagModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(), ProjectTagModel.countDocuments({ ...query }).lean()])
      } else {
        [projectTag, total] = await Promise.all([ProjectTagModel.find(query).sort(sorting).lean(), ProjectTagModel.countDocuments({ ...query }).lean()])
      }

      if (req.path === '/DownloadExcel') {
        return projectTag
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].projectTag), { projectTag, count: total })
      }
    } catch (error) {
      return catchError('ProjectTag.getProjectTags', error, req, res)
    }
  }
}

module.exports = new ProjectTag()
