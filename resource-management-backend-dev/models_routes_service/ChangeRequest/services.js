/* eslint-disable camelcase */
const ChangeRequestModel = require('./model')
const Logs = require('../Logs/model')
const JobProfileModel = require('../JobProfile/model')
const WorkLogModel = require('../WorkLogs/model')
const EmployeeModel = require('../Employee/model')
const ProjectModel = require('../Project/model')
const ProjectWiseEmployeeModel = require('../Project/projectwiseemployee.model')
const CrWiseDepartmentModel = require('./crWiseDepartment.model')
const CrWiseEmployeeModel = require('./crWiseEmployee.model')
const DashboardCrIndicatorModel = require('../DashBoard/dashboardCrIndicator.model')
const DashboardCrDepartmentModel = require('../DashBoard/dashboardCrDepartment.model')
const { status, messages } = require('../../helper/api.responses')
const DepartmentModel = require('../Department/model')
const { catchError, pick, validateEmail, validateMobile, SuccessResponseSender, ErrorResponseSender, paginationValue, searchValidate, statusValidate } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { queuePush } = require('../../helper/redis')
const config = require('../../config/config')

const { ResourceManagementDB } = require('../../database/mongoose')

// send notitications to cr belong to which project

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await ChangeRequestModel.findOne({ _id: params }).lean()

    let projectData
    if (data.iProjectId) {
      projectData = await ProjectModel.findOne({ _id: data.iProjectId }).lean()
    }

    let allEmployee = await EmployeeModel.find({ _id: { $in: [projectData.iProjectManagerId, projectData.iBAId, projectData.iBDId, data.iCreatedBy, iLastUpdateBy] }, eStatus: 'Y' }, {
      _id: 1,
      aJwtTokens: 1,
      iDepartmentId: 1,
      iJobProfileId: 1
    }).lean()

    // get departmentrId from employee

    const departmentId = []

    for (const employee of allEmployee) {
      if (departmentId.indexOf(employee.iDepartmentId) === -1) {
        departmentId.push(employee.iDepartmentId)
      }
    }

    const jobProfile = await JobProfileModel.find({
      eStatus: 'Y',
      sPrefix: {
        $in: ['Superior', 'Head', 'Lead', 'Other', 'Manager']
      }
    }, { _id: 1 }).lean()

    const otherEmployee = await EmployeeModel.find({
      eStatus: 'Y',
      $and: [
        { iDepartmentId: { $in: departmentId } },
        { iJobProfileId: { $in: jobProfile.map((item) => item._id) } }
      ]
    }, {
      _id: 1,
      aJwtTokens: 1
    }).lean()

    allEmployee = [...allEmployee, ...otherEmployee]

    const ids = []
    const sPushToken = []

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
      iCrId: data._id,
      sName: data.sName,
      iCreatedBy: data.iLastUpdateBy,
      sUrl: url,
      sType: 'cr',
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    const person = await EmployeeModel.findOne({ _id: data.iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()

    const putData = { sPushToken, sTitle: 'Resource Management', sBody: `${data.sName}${sBody}by ${person.sName}(${person.sEmpId})`, sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg', sType: 'cr', metadata, aSenderId: ids, isRecorded: isRecorded === true ? 'Y' : 'N', isNotify: isNotify === true ? 'Y' : 'N', sUrl: url }

    await queuePush('Project:Notification', putData)
  } catch (error) {
    console.log(error)
  }
}

class ChangeRequest {
  async addChangeRequest(req, res) {
    try {
      req.body = pick(req.body, ['iProjectId', 'sName', 'sDescription', 'nTimeLineDays', 'nCost', 'dStartDate', 'dEndDate', 'nMinutes', 'aCrBaseDepartment', 'aCrBaseEmployee'])

      const projectExist = await ProjectModel.findOne({
        _id: req.body.iProjectId,
        eStatus: 'Y',
        eProjectType: 'Fixed',
        'flag.2': 'Y'
      }).lean()
      if (!projectExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const daysCount = (new Date(req.body.dEndDate).getTime() - new Date(req.body.dStartDate).getTime()) / (1000 * 3600 * 24)

      // console.log(daysCount, req.body.nTimeLineDays)

      // if (daysCount !== req.body.nTimeLineDays) {
      //   return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].date_grater_then)
      // };
      let dCost = 0
      let dMinutes = 0
      const nTimeLineDays = +req.body.nTimeLineDays
      let sDepartmentMinutes = 0
      let sDepartmentCosts = 0
      if (req.body.aCrBaseDepartment.length > 0) {
        req.body.aCrBaseDepartment.forEach((item) => {
          sDepartmentMinutes += parseInt(item.nMinutes)
          if (item.nMinutes === 0) dMinutes = 1
          sDepartmentCosts += parseInt(item.nCost)
          if (item.nCost === 0) dCost = 1
        })
      }

      if (dMinutes === 1) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].department_hours))
      } if (dCost === 1) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].department_cost))
      }

      // console.log('req.body', req.body)
      // console.log('timeLineDays', nTimeLineDays)
      // console.log('sDepartmentMinutes', sDepartmentMinutes)
      // console.log('sDepartmentCosts', sDepartmentCosts)

      if ((parseInt(nTimeLineDays) * 8 * 60) !== parseInt(sDepartmentMinutes)) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].timeLineError_cr)
      }

      if (parseInt(req.body.nCost) !== sDepartmentCosts) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].costError_cr)
      }

      // checkabout aCrEmployee is from project or not

      const employeeArray = []
      if (req.body.aCrBaseEmployee.length > 0) {
        //  aCrBaseEmployee: [
        //   { iEmployeeId: '63e2224ac916ef568fa61b0e' },
        //   { iEmployeeId: '63e2223bc916ef568fa61aec' }
        // ]
        for (const i of req.body.aCrBaseEmployee) {
          const projectWiseEmployee = await ProjectWiseEmployeeModel.findOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: i.iEmployeeId,
            eStatus: 'Y'
          }).lean()
          if (!projectWiseEmployee) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
          }
          employeeArray.push({
            ...projectWiseEmployee
          })
        }
      }

      const data = await ChangeRequestModel.create({
        sName: req.body.sName,
        iProjectId: req.body.iProjectId,
        eStatus: 'Y',
        sDescription: req.body.sDescription,
        nTimeLineDays: +req.body.nTimeLineDays,
        nCost: +req.body.nCost,
        dStartDate: req.body.dStartDate,
        dEndDate: req.body.dEndDate,
        eCrStatus: 'Pending',
        eProjectType: projectExist.eProjectType,
        iCreatedBy: req.employee._id,
        iLastUpdateBy: req.employee._id
      })

      if (req.body.aCrBaseDepartment?.length) {
        const aCrBasedDepartment = req.body.aCrBaseDepartment.map((item) => {
          return {
            iProjectId: req.body.iProjectId,
            iCrId: data._id,
            iDepartmentId: item.iDepartmentId,
            nMinutes: item.nMinutes,
            eStatus: 'Y',
            iCreatedBy: req.employee._id,
            iLastUpdateBy: req.employee._id,
            nCost: item.nCost,
            eProjectType: projectExist.eProjectType
          }
        })
        await CrWiseDepartmentModel.insertMany(aCrBasedDepartment)
      }

      if (employeeArray.length) {
        const aCrBasedEmployee = req.body.aCrBaseEmployee.map((item) => {
          return {
            iProjectId: req.body.iProjectId,
            iCrId: data._id,
            iEmployeeId: item.iEmployeeId,
            nMinutes: item?.nMinutes || 0,
            nAvailabilityMinutes: item?.nAvailabilityMinutes || 0,
            eStatus: 'Y',
            iCreatedBy: req.employee._id,
            iLastUpdateBy: req.employee._id,
            eProjectType: projectExist.eProjectType
          }
        })
        await CrWiseEmployeeModel.insertMany(aCrBasedEmployee)
      }

      const dashboardCr = await DashboardCrIndicatorModel.findOne({ _id: ObjectId(data._id) }).lean()

      if (!dashboardCr) {
        await DashboardCrIndicatorModel.create({
          iCrId: data._id,
          iProjectId: req.body.iProjectId,
          nMinutes: sDepartmentMinutes,
          nCost: req.body.nCost,
          nRemainingMinute: 0,
          nRemainingCost: 0,
          eStatus: 'Y',
          nTimeLineDays: req.body.nTimeLineDays,
          eProjectType: projectExist.eProjectType,
          iCreatedBy: req.employee._id,
          iLastUpdateBy: req.employee._id
        })

        const aCrBasedDepartment = req.body.aCrBaseDepartment.map((item) => {
          return {
            iProjectId: req.body.iProjectId,
            iCrId: data._id,
            iDepartmentId: item.iDepartmentId,
            nMinutes: item.nMinutes,
            eStatus: 'Y',
            iCreatedBy: req.employee._id,
            iLastUpdateBy: req.employee._id,
            nCost: item.nCost,
            eProjectType: projectExist.eProjectType
          }
        })

        // console.log('aCrBasedDepartment', aCrBasedDepartment)

        await DashboardCrDepartmentModel.insertMany(aCrBasedDepartment)
      }

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Cr', sService: 'addChangeRequest', eAction: 'Create', oNewFields: data }
      await take.create(logs)

      // await notificationsender(req, data._id, ' cr is create ', true, true, req.employee._id, `${config.urlPrefix}/change-request/detail/${data._id}`)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].change_request))
    } catch (error) {
      return catchError('ChangeRequest.addChangeRequest', error, req, res)
    }
  }

  async updateChangeRequest(req, res) {
    try {
      req.body = pick(req.body, ['iProjectId', 'eCrStatus', 'sName', 'sDescription', 'nTimeLineDays', 'nCost', 'dStartDate', 'dEndDate', 'nMinutes', 'aCrBaseDepartment', 'aCrBaseEmployee'])

      // console.log('req.body', req.params.id)
      // console.log('req.body', req.body)

      const crExist = await ChangeRequestModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      // console.log('crExist', crExist)
      if (!crExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].change_request))

      // console.log('crExist.eCrStatus', crExist.eCrStatus)
      // console.log('req.body.eCrStatus', req.body.eCrStatus)
      if (!statusValidate(crExist.eCrStatus, req.body.eCrStatus)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage]['cr ' + crExist.eCrStatus] + ' ' + messages[req.userLanguage].not_allowed_to_proceed)

      const projectExist = await ProjectModel.findById({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()
      if (!projectExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      // const nTimeLineDays = +req.body.nTimeLineDays
      // let sDepartmentMinutes = 0
      // if (req.body.aCrBaseDepartment.length > 0) {
      //   req.body.aCrBaseDepartment.forEach((item) => {
      //     sDepartmentMinutes += parseInt(item.nMinutes)
      //   })
      // }

      let dCost = 0
      let dMinutes = 0
      const nTimeLineDays = +req.body.nTimeLineDays
      let sDepartmentMinutes = 0
      let sDepartmentCosts = 0
      if (req.body.aCrBaseDepartment.length > 0) {
        req.body.aCrBaseDepartment.forEach((item) => {
          sDepartmentMinutes += parseInt(item.nMinutes)
          if (item.nMinutes === 0) dMinutes = 1
          sDepartmentCosts += parseInt(item.nCost)
          if (item.nCost === 0) dCost = 1
        })
      }

      if (dMinutes === 1) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].department_hours))
      } if (dCost === 1) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].department_cost))
      }

      if ((parseInt(nTimeLineDays) * 8 * 60) !== parseInt(sDepartmentMinutes)) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].timeLineError_cr)
      }

      if (parseInt(req.body.nCost) !== sDepartmentCosts) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].costError_cr)
      }

      // statusValidate(req.body.eCrStatus, crExist.eCrStatus)

      if (req.body.aCrBaseEmployee.length > 0) {
        for (const i of req.body.aCrBaseEmployee) {
          const projectWiseEmployee = await ProjectWiseEmployeeModel.findOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: i.iEmployeeId,
            eStatus: 'Y'
          }).lean()
          if (!projectWiseEmployee) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
          }
        }
      }

      const crWiseEmployee = await CrWiseEmployeeModel.find({ iCrId: req.params.id }).lean()
      const crWiseDepartment = await CrWiseDepartmentModel.find({ iCrId: req.params.id }).lean()
      const DashboardCrDepartment = await DashboardCrDepartmentModel.find({ iCrId: req.params.id }).lean()

      const crWiseEmployeeId = crWiseEmployee.map(employee => ({ iEmployeeId: employee.iEmployeeId.toString(), nMinutes: employee.nMinutes }))
      const crWiseDepartmentId = crWiseDepartment.map(department => ({ iDepartmentId: department.iDepartmentId.toString(), nMinutes: department.nMinutes }))
      const DashboardCrDepartmentId = DashboardCrDepartment.map(department => ({ iDepartmentId: department.iDepartmentId.toString(), nMinutes: department.nMinutes || 0, nRemainingMinute: department.nRemainingMinute || 0, nCost: department.nCost || 0, nRemainingCost: department.nRemainingCost || 0, iProjectId: department.iProjectId.toString(), iCrId: department.iCrId.toString() }))

      const aCrWiseEmployeeId = req.body.aCrBaseEmployee.map(employee => ({ iEmployeeId: employee.iEmployeeId.toString(), nMinutes: employee?.nMinutes || 0 }))
      const aCrWiseDepartmentId = req.body.aCrBaseDepartment.map(department => ({ iDepartmentId: department.iDepartmentId.toString(), nMinutes: department?.nMinutes || 0 }))

      const aCrWiseEmployeeIdsToDelete = crWiseEmployeeId.filter(employee => !aCrWiseEmployeeId.map(employee => employee.iEmployeeId).includes(employee.iEmployeeId))
      const aCrWiseDepartmentIdsToDelete = crWiseDepartmentId.filter(department => !aCrWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      const aDashboardCrDepartmentIdsToDelete = DashboardCrDepartmentId.filter(department => !aCrWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      const aCrWiseEmployeeIdsToCreate = aCrWiseEmployeeId.filter(employee => !crWiseEmployeeId.map(employee => employee.iEmployeeId).includes(employee.iEmployeeId))
      const aCrWiseDepartmentIdsToCreate = aCrWiseDepartmentId.filter(department => !crWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      const aDashboardCrDepartmentIdsToCreate = aCrWiseDepartmentId.filter(department => !DashboardCrDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      if (aCrWiseDepartmentIdsToDelete.length > 0) {
        const query = {
          iCrId: req.params.id,
          eStatus: 'Y'
        }
        query.iDepartmentId = {
          $in: aCrWiseDepartmentIdsToDelete.map(department => department.iDepartmentId)
        }
        const worklogs = await WorkLogModel.find(query).lean()

        if (worklogs.length > 0) {
          return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))
        }
      }

      if (aCrWiseEmployeeIdsToDelete.length > 0) {
        const query = {
          iCrId: req.params.id,
          eStatus: 'Y'
        }
        query.iEmployeeId = {
          $in: aCrWiseEmployeeIdsToDelete.map(employee => employee.iEmployeeId)
        }
        // console.log(query)
        const worklogs = await WorkLogModel.find(query).lean()

        if (worklogs.length > 0) {
          return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))
        }
      }

      await Promise.all(aCrWiseEmployeeIdsToDelete.map(async (employee) => {
        // console.log(employee)
        // console.log(req.params.id)

        return CrWiseEmployeeModel.updateOne({ iEmployeeId: employee.iEmployeeId, iCrId: req.params.id }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })
      }
      ))

      await Promise.all(aCrWiseDepartmentIdsToDelete.map(async (department) => {
        return CrWiseDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iCrId: req.params.id }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })
      }
      ))

      await Promise.all(aDashboardCrDepartmentIdsToDelete.map(async (department) => {
        return DashboardCrDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId, iCrId: req.params.id }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })
      }
      ))

      await Promise.all(aCrWiseEmployeeId.map(async (employee) => {
        // console.log(employee)
        return CrWiseEmployeeModel.updateOne({ iEmployeeId: employee.iEmployeeId, iCrId: req.params.id }, { nMinutes: employee?.nMinutes || 0, eStatus: 'Y', iLastUpdateBy: req.employee._id })
      }))

      await Promise.all(aCrWiseDepartmentId.map(async (department) => {
        return CrWiseDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iCrId: req.params.id }, { nMinutes: department?.nMinutes || 0, eStatus: 'Y', iLastUpdateBy: req.employee._id })
      }))

      const aDashboardProjectDepartmentId = DashboardCrDepartmentId.filter(department => aCrWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
      await Promise.all(aDashboardProjectDepartmentId.map(async (department) => {
        return DashboardCrDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId, iCrId: req.params.id }, { nMinutes: department?.nMinutes || 0, eStatus: 'Y', nRemainingMinute: department?.nRemainingMinute || 0, nCost: department?.nCost || 0, nRemainingCost: department?.nRemainingCost || 0, iLastUpdateBy: req.employee._id })
      }))

      await Promise.all(aCrWiseEmployeeIdsToCreate.map(async (employee) => {
        return CrWiseEmployeeModel.create({
          iProjectId: req.body.iProjectId,
          iEmployeeId: employee.iEmployeeId,
          nMinutes: employee?.nMinutes || 0,
          iCrId: req.params.id,
          eStatus: 'Y',
          iCreatedBy: req.employee._id,
          iLastUpdateBy: req.employee._id
        })
      }))

      await Promise.all(aCrWiseDepartmentIdsToCreate.map(async (department) => {
        return CrWiseDepartmentModel.create({
          iProjectId: req.body.iProjectId,
          iDepartmentId: department.iDepartmentId,
          nMinutes: department?.nMinutes || 0,
          iCrId: req.params.id,
          eStatus: 'Y',
          iCreatedBy: req.employee._id,
          iLastUpdateBy: req.employee._id
        })
      }))

      await Promise.all(aDashboardCrDepartmentIdsToCreate.map(async (department) => {
        return DashboardCrDepartmentModel.create({
          iProjectId: req.body.iProjectId,
          iDepartmentId: department.iDepartmentId,
          nMinutes: department?.nMinutes || 0,
          iCrId: req.params.id,
          eStatus: 'Y',
          nRemainingMinute: department?.nRemainingMinute || 0,
          nCost: department?.nCost || 0,
          nRemainingCost: department?.nRemainingCost || 0,
          iCreatedBy: req.employee._id,
          iLastUpdateBy: req.employee._id
        })
      })
      )

      if (aCrWiseDepartmentIdsToDelete.length > 0) {
        const employee = await CrWiseEmployeeModel.find({ eStatus: 'Y', iCrId: req.params.id }).populate({ path: 'iEmployeeId', eStatus: 'Y', select: 'sName iDepartmentId' }).sort({ sName: 1 }).lean()
        const aEmployeeToDelete = employee.filter(employee => aCrWiseDepartmentIdsToDelete.map(department => department.iDepartmentId.toString()).includes(employee.iEmployeeId.iDepartmentId.toString()))
        await Promise.all(aEmployeeToDelete.map(async (employee) => {
          return CrWiseEmployeeModel.updateOne({ iEmployeeId: employee.iEmployeeId._id, iCrId: ObjectId(req.params.id) }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })
        }))
      }

      // console.log('eCrStatus', req.body.eCrStatus)
      const data = await ChangeRequestModel.updateOne({ _id: req.params.id }, { $set: { eCrStatus: req.body.eCrStatus, nTimeLineDays, nCost: req.body.nCost, dEndDate: req.body.dEndDate, dStartDate: req.body.dStartDate, iLastUpdateBy: req.employee._id } }, { new: true, runValidators: true })
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Cr', sService: 'updateChangeRequest', eAction: 'Update', oNewFields: data, oOldFields: crExist }
      await take.create(logs)
      // await notificationsender(req, data._id, ' cr is update ', true, true, req.employee._id, `${config.urlPrefix}/change-request/detail/${data._id}`)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].change_request))
    } catch (error) {
      return catchError('ChangeRequest.updateChangeRequest', error, req, res)
    }
  }

  async deleteChangeRequest(req, res) {
    try {
      const crExist = await ChangeRequestModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!crExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].change_request))

      const query = {
        iCrId: req.params.id,
        eStatus: 'Y'
      }

      const worklogs = await WorkLogModel.find(query).lean()
      if (worklogs.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].worklogExist)

      const data = await ChangeRequestModel.findOneAndUpdate({ _id: req.params.id }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } }, {
        new: true,
        runValidators: true
      })

      if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].change_request))

      await CrWiseEmployeeModel.updateMany({ iCrId: req.params.id }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })

      await CrWiseDepartmentModel.updateMany({ iCrId: req.params.id }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })

      await DashboardCrDepartmentModel.updateMany({ iCrId: req.params.id }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })

      await DashboardCrIndicatorModel.updateMany({ iCrId: req.params.id }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data.id, eModule: 'Cr', sService: 'deleteChangeRequest', eAction: 'Delete', oNewFields: data, oOldFields: crExist }
      await take.create(logs)
      // await notificationsender(req, data._id, ' cr is delete ', true, true, req.employee._id, `${config.urlPrefix}/change-request`)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].change_request))
    } catch (error) {
      return catchError('ChangeRequest.deleteChangeRequest', error, req, res)
    }
  }

  async getChangeRequest(req, res) {
    try {
      // projectId

      // console.log('getChange Request')

      let { page = 0, limit = 5, iProjectId, search = '', sort = 'dCreatedAt', order } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      search = searchValidate(search)
      const sorting = { [sort]: orderBy }
      const q = [
        {
          $match: { eStatus: 'Y' }
        },
        {
          $lookup: {
            from: 'crwiseemployees',
            let: { crId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iCrId', '$$crId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'employees',
                  let: { employeeId: '$iEmployeeId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$employeeId'] }, eStatus: 'Y' } }

                  ],
                  as: 'employee'
                }
              },
              { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
              { $sort: { 'employee.sName': 1 } },
              {
                $project: {
                  sName: '$employee.sName',
                  nHours: '$nHours',
                  iEmployeeId: '$iEmployeeId',
                  iCrId: '$iCrId'
                }
              }
            ],
            as: 'crwiseemployees'
          }
        },
        {
          $lookup: {
            from: 'crwisedepartments',
            let: { crId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iCrId', '$$crId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'departments',
                  let: { departmentId: '$iDepartmentId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$departmentId'] }, eStatus: 'Y' } },
                    { $project: { sName: 1 } }
                  ],
                  as: 'department'
                }
              },
              { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
              { $sort: { 'department.sName': 1 } },
              {
                $project: {
                  sName: '$department.sName',
                  nHours: '$nHours',
                  iDepartmentId: '$iDepartmentId',
                  iCrId: '$iCrId'
                }
              }
            ],
            as: 'crwisedepartments'
          }
        },
        {
          $lookup: {
            from: 'projects',
            let: { projectId: '$iProjectId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$projectId'] }, eStatus: 'Y' } },
              { $project: { sName: 1 } }
            ],
            as: 'project'
          }
        },
        { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
        { $addFields: { sProjectName: '$project.sName' } }
      ]

      if (search) {
        q.push({
          $match: {
            $or: [
              { sProjectName: { $regex: search, $options: 'i' } },
              { 'crwiseemployees.sName': { $regex: search, $options: 'i' } },
              { 'crwisedepartments.sName': { $regex: search, $options: 'i' } },
              { sName: { $regex: search, $options: 'i' } }
            ]
          }
        })
      }

      if (iProjectId) {
        q[0].$match.iProjectId = ObjectId(iProjectId)
      }

      const count_query = [...q]
      count_query.push({ $count: 'count' })

      sort = sort === 'sProjectName' ? 'sProjectName' : sort
      sort = sort === 'technology' ? 'technology.sTechnologyName' : sort
      sort = sort === 'projecttag' ? 'projecttag.sProjectTagName' : sort
      sort = sort === 'sName' ? 'sName' : sort
      sort = sort === 'dEndDate' ? 'dEndDate' : sort

      q.push({ $sort: sorting })

      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, crs] = await Promise.all([ChangeRequestModel.aggregate(count_query), ChangeRequestModel.aggregate(q)])

      if (req.path === '/DownloadExcel') {
        return crs
      } else {
        return SuccessResponseSender(res, status.Success, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].change_request), { count: count[0]?.count || 0, crs })
      }
    } catch (error) {
      return catchError('ChangeRequest.getChangeRequest', error, req, res)
    }
  }

  async getChangeRequestById(req, res) {
    try {
      const { id } = req.params.id

      const q = [
        {
          $match: { eStatus: 'Y', _id: id }
        },
        {
          $lookup: {
            from: 'crwiseemployees',
            let: { crId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iCrId', '$$crId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'employees',
                  let: { employeeId: '$iEmployeeId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$employeeId'] }, eStatus: 'Y' } }

                  ],
                  as: 'employee'
                }
              },
              { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
              { $sort: { 'employee.sName': 1 } },
              {
                $project: {
                  sName: '$employee.sName',
                  nHours: '$nHours',
                  iEmployeeId: '$iEmployeeId',
                  iCrId: '$iCrId'
                }
              }
            ],
            as: 'crwiseemployees'
          }
        },
        {
          $lookup: {
            from: 'crwisedepartments',
            let: { crId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iCrId', '$$crId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'departments',
                  let: { departmentId: '$iDepartmentId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$departmentId'] }, eStatus: 'Y' } },
                    { $project: { sName: 1 } }
                  ],
                  as: 'department'
                }
              },
              { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
              { $sort: { 'department.sName': 1 } },
              {
                $project: {
                  sName: '$department.sName',
                  nHours: '$nHours',
                  iDepartmentId: '$iDepartmentId',
                  iCrId: '$iCrId'
                }
              }
            ],
            as: 'crwisedepartments'
          }
        },
        {
          $lookup: {
            from: 'projects',
            let: { projectId: '$iProjectId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$projectId'] }, eStatus: 'Y' } },
              { $project: { sName: 1 } }
            ],
            as: 'project'
          }
        },
        { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
        { $addFields: { sProjectName: '$project.sName' } }
      ]

      const count_query = [...q]
      count_query.push({ $count: 'count' })

      const [count, crs] = await Promise.all([ChangeRequestModel.aggregate(count_query), ChangeRequestModel.aggregate(q)])

      return SuccessResponseSender(res, status.Success, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].change_request), { count: count[0]?.count || 0, crs })
    } catch (error) {
      return catchError('ChangeRequest.getChangeRequestById', error, req, res)
    }
  }

  async getProjectCrs(req, res) {
    try {
      const { id } = req.params
      let { page = 0, limit = 5, search = '', sort = 'dCreatedAt', order } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      search = searchValidate(search)
      const sorting = { [sort]: orderBy }

      const q = [
        {
          $match: { eStatus: 'Y', iProjectId: ObjectId(id) }
        },
        {
          $lookup: {
            from: 'projects',
            let: { projectId: '$iProjectId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$projectId'] },
                  eStatus: 'Y'
                }
              },
              {
                $project: {
                  sName: 1,
                  _id: 1
                }
              }
            ],
            as: 'project'
          }
        },
        {
          $unwind: {
            path: '$project',
            preserveNullAndEmptyArrays: true
          }
        }
      ]

      if (search) {
        q.push({
          $match: {
            $or: [
              { sName: { $regex: search, $options: 'i' } },
              { 'project.sName': { $regex: search, $options: 'i' } }
            ]
          }
        })
      }

      const count_query = [...q]
      count_query.push({ $count: 'count' })

      q.push({ $sort: sorting })

      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, project] = await Promise.all([ChangeRequestModel.aggregate(count_query), ChangeRequestModel.aggregate(q)])

      // console.log(count, project)
      // console.log(req.userLanguage)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { count: count[0]?.count || 0, project })
    } catch (error) {
      return catchError('ChangeRequest.getProjectCrs', error, req, res)
    }
  }

  async addCrDepartment(req, res) {
    try {
      const { iProjectId, iDepartmentId, nMinutes, nCost, iCrId } = req.body

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const department = await DepartmentModel.findOne({ _id: ObjectId(iDepartmentId), eStatus: 'Y' })
      if (!department) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

      const cr = await ChangeRequestModel.findOne({ _id: ObjectId(iCrId), iProjectId, eStatus: 'Y' })
      if (!cr) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].change_request))

      const crWiseDepartment = await CrWiseDepartmentModel.create({ iProjectId, iDepartmentId, nMinutes, nCost, eProjectType: project.eProjectType, iCrId, iCreatedBy: req.employee._id, iLastUpdateBy: req.employee._id })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: cr._id, eModule: 'Cr', sService: 'addCrDepartment', eAction: 'Create', oNewFields: crWiseDepartment }
      await take.create(logs)

      // await notificationsender(req, cr._id, ' cr department is create', true, true, req.employee._id, `${config.urlPrefix}/change-request/detail/${cr._id}`)

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].department), { crWiseDepartment })
    } catch (error) {
      catchError('ChangeRequest.addCrDepartment', error, req, res)
    }
  }

  async updateCrdepartment(req, res) {
    try {
      const { iProjectId, iDepartmentId, nMinutes, nCost, iCrId } = req.body

      const cr = await ChangeRequestModel.findOne({ _id: ObjectId(iCrId), iProjectId, eStatus: 'Y' })
      if (!cr) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].change_request))

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const department = await DepartmentModel.findOne({ _id: ObjectId(iDepartmentId), eStatus: 'Y' })
      if (!department) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

      const crDepartment = await CrWiseDepartmentModel.findOne({ iProjectId, iDepartmentId, iCrId, eStatus: 'Y' })
      if (!crDepartment) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

      const data = await CrWiseDepartmentModel.findOneAndUpdate({ iProjectId, iDepartmentId, iCrId, eStatus: 'Y' }, { nMinutes, nCost, iLastUpdateBy: req.employee._id }, { new: true, runValidators: true })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: cr._id, eModule: 'Cr', sService: 'updateCrdepartment', eAction: 'Update', oNewFields: data, oOldFields: crDepartment }
      await take.create(logs)

      // await notificationsender(req, cr._id, ' cr department is update', true, true, req.employee._id, `${config.urlPrefix}/change-request/detail/${cr._id}`)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].department), { data })
    } catch (error) {
      catchError('ChangeRequest.updateCrdepartment', error, req, res)
    }
  }

  async deleteCrdepartments(req, res) {
    try {
      const { iProjectId, iDepartmentId, iCrId } = req.query

      const cr = await ChangeRequestModel.findOne({ _id: ObjectId(iCrId), iProjectId, eStatus: 'Y' })
      if (!cr) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].change_request))

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const department = await DepartmentModel.findOne({ _id: ObjectId(iDepartmentId), eStatus: 'Y' })
      if (!department) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

      const crDepartment = await CrWiseDepartmentModel.findOne({ iProjectId, iDepartmentId, iCrId, eStatus: 'Y' })
      if (!crDepartment) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

      const crWiseDepartment = await CrWiseDepartmentModel.findOneAndUpdate({ iProjectId, iDepartmentId, iCrId, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { new: true, runValidators: true })

      const crWiseEmployee = await CrWiseEmployeeModel.find({ iProjectId, iCrId, eStatus: 'Y' })
      if (crWiseEmployee.length > 0) {
        const employeeIds = crWiseEmployee.map((item) => item.iEmployeeId)
        const employee = await EmployeeModel.find({ _id: { $in: employeeIds }, eStatus: 'Y' })
        if (employee.length > 0) {
          const departmentIds = employee.map((item) => item.iDepartmentId)
          if (departmentIds.includes(iDepartmentId)) {
            await CrWiseEmployeeModel.updateMany({ iProjectId, iCrId, iEmployeeId: { $in: employeeIds }, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
          }
        }
      }

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: cr._id, eModule: 'Cr', sService: 'deleteCrdepartments', eAction: 'Delete', oNewFields: crWiseDepartment, oOldFields: crDepartment }
      await take.create(logs)

      // await notificationsender(req, cr._id, ' cr department is delete', true, true, req.employee._id, `${config.urlPrefix}/change-request/detail/${cr._id}`)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].department), { crWiseDepartment })
    } catch (error) {
      catchError('ChangeRequest.deleteCrdepartments', error, req, res)
    }
  }

  async addCrEmployee(req, res) {
    try {
      const { iProjectId, iEmployeeId, iCrId } = req.body

      const cr = await ChangeRequestModel.findOne({ _id: ObjectId(iCrId), iProjectId, eStatus: 'Y' })
      if (!cr) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].change_request))

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const employee = await EmployeeModel.findOne({ _id: ObjectId(iEmployeeId), eStatus: 'Y' })
      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      const crWiseDepartment = await CrWiseDepartmentModel.find({ iProjectId, eStatus: 'Y' })

      if (crWiseDepartment.length > 0) {
        const projectWiseDepartmentIds = crWiseDepartment.map((item) => item.iDepartmentId)
        if (!projectWiseDepartmentIds.includes(employee.iDepartmentId)) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
      }

      const projectWiseEmployee = await CrWiseEmployeeModel.create({ iProjectId, iEmployeeId, iCrId, eStatus: 'Y', eProjectType: project.eProjectType })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: cr._id, eModule: 'Cr', sService: 'addCrEmployee', eAction: 'Create', oNewFields: projectWiseEmployee }
      await take.create(logs)

      // await notificationsender(req, cr._id, ' cr employee is create ', true, true, req.employee._id, `${config.urlPrefix}/change-request/detail/${cr._id}`)

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].employee), { projectWiseEmployee })
    } catch (error) {
      catchError('ChangeRequest.addCrEmployee', error, req, res)
    }
  }

  async deleteCrEmployee(req, res) {
    try {
      const { iProjectId, iEmployeeId, iCrId } = req.query

      const cr = await ChangeRequestModel.findOne({ _id: ObjectId(iCrId), iProjectId, eStatus: 'Y' })
      if (!cr) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].change_request))

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const employee = await EmployeeModel.findOne({ _id: ObjectId(iEmployeeId), eStatus: 'Y' })
      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      const projectWiseEmployeeExist = await CrWiseEmployeeModel.findOne({ iProjectId, iEmployeeId, iCrId, eStatus: 'Y' })
      if (!projectWiseEmployeeExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      const projectWiseEmployee = await CrWiseEmployeeModel.findOneAndUpdate({ iProjectId, iCrId, iEmployeeId, eStatus: 'Y' }, { eStatus: 'N' }, { new: true, runValidators: true })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: cr._id, eModule: 'Cr', sService: 'deleteCrEmployee', eAction: 'Delete', oNewFields: projectWiseEmployee, oOldFields: projectWiseEmployeeExist }
      await take.create(logs)

      // await notificationsender(req, cr._id, ' cr employee is delete ', true, true, req.employee._id, `${config.urlPrefix}/change-request/detail/${cr._id}`)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].employee), { projectWiseEmployee })
    } catch (error) {
      catchError('ChangeRequest.deleteCrEmployee', error, req, res)
    }
  }

  async updateCrdepartments(req, res) {
    try {
      const { aCrBaseDepartment, nCost, nTimeLineDays, dStartDate, dEndDate } = req.body
      const { iCrId } = req.params

      const cr = await ChangeRequestModel.findOne({ _id: ObjectId(iCrId), eStatus: 'Y' })
      if (!cr) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].change_request))

      // const daysCount = (new Date(dEndDate).getTime() - new Date(dStartDate).getTime()) / (1000 * 3600 * 24)

      // if (daysCount < 0 || daysCount === 0 || daysCount !== req.body.nTimeLineDays) {
      //   return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].date_grater_then)
      // };

      let sDepartmentMinutes = 0
      let sDepartmentCosts = 0
      if (aCrBaseDepartment.length > 0) {
        req.body.aCrBaseDepartment.forEach((item) => {
          sDepartmentMinutes += parseInt(item.nMinutes)
          sDepartmentCosts += parseInt(item.nCost)
        })
      }

      if ((parseInt(nTimeLineDays) * 60 * 8 * 60) !== parseInt(sDepartmentMinutes)) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].timeLineError_project)
      }

      if (parseInt(nCost) !== sDepartmentCosts) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].costError_project)
      }
      const crWiseDepartment = await CrWiseDepartmentModel.find({ iCrId: req.params.iCrId }).lean()
      const DashboardCrDepartment = await DashboardCrDepartmentModel.find({ iCrId: req.body.iCrId }).lean()
      const crWiseDepartmentId = crWiseDepartment.map(department => ({ ...department, iDepartmentId: department.iDepartmentId.toString(), nMinutes: department.nMinutes }))
      const DashboardCrDepartmentId = DashboardCrDepartment.map(department => ({ ...department, iDepartmentId: department.iDepartmentId.toString(), nMinutes: department.nMinutes || 0, nRemainingMinute: department.nRemainingMinute || 0, nCost: department.nCost || 0, nRemainingCost: department.nRemainingCost || 0, iProjectId: department.iProjectId.toString(), iCrId: department.iCrId.toString() }))
      const aCrWiseDepartmentId = req.body.aCrWiseDepartment.map(department => ({ ...department, iDepartmentId: department.iDepartmentId.toString(), nMinutes: department?.nMinutes || 0 }))
      const aCrWiseDepartmentIdsToDelete = crWiseDepartmentId.filter(department => !aCrWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      const aDashboardCrDepartmentIdsToDelete = DashboardCrDepartmentId.filter(department => !aCrWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
      const aCrWiseDepartmentIdsToCreate = aCrWiseDepartmentId.filter(department => !crWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      const aDashboardCrDepartmentIdsToCreate = aCrWiseDepartmentId.filter(department => !DashboardCrDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      await Promise.all(aCrWiseDepartmentIdsToDelete.map(async (department) => {
        return CrWiseDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iCrId: req.params.iProjectId }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })
      }
      ))

      await Promise.all(aDashboardCrDepartmentIdsToDelete.map(async (department) => {
        return DashboardCrDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId, iCrId: req.body.iCrId }, { $set: { eStatus: 'N' } })
      }
      ))

      await Promise.all(aCrWiseDepartmentId.map(async (department) => {
        return CrWiseDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iCrId: req.params.iProjectId }, { nMinutes: department?.nMinutes || 0, eStatus: 'Y', iLastUpdateBy: req.employee._id })
      }))

      const aDashboardProjectDepartmentId = DashboardCrDepartmentId.filter(department => aCrWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
      await Promise.all(aDashboardProjectDepartmentId.map(async (department) => {
        return DashboardCrDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId, iCrId: req.body.iCrId }, { nMinutes: department?.nMinutes || 0, eStatus: 'Y', nRemainingMinute: department?.nRemainingMinute || 0, nCost: department?.nCost || 0, nRemainingCost: department?.nRemainingCost || 0 })
      }))

      await Promise.all(aCrWiseDepartmentIdsToCreate.map(async (department) => {
        return CrWiseDepartmentModel.create({
          iProjectId: req.body.iProjectId,
          iDepartmentId: department.iDepartmentId,
          nMinutes: department?.nMinutes || 0,
          iCrId: req.params.iCrId,
          eStatus: 'Y',
          iCreatedBy: req.employee._id,
          iLastUpdateBy: req.employee._id
        })
      }))

      await Promise.all(aDashboardCrDepartmentIdsToCreate.map(async (department) => {
        return DashboardCrDepartmentModel.create({
          iProjectId: req.body.iProjectId,
          iDepartmentId: department.iDepartmentId,
          nMinutes: department?.nMinutes || 0,
          iCrId: req.params.iCrId,
          eStatus: 'Y',
          nRemainingMinute: department?.nRemainingMinute || 0,
          nCost: department?.nCost || 0,
          nRemainingCost: department?.nRemainingCost || 0
        })
      })
      )

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: cr._id, eModule: 'Cr', sService: 'updateCrdepartments', eAction: 'Update', oNewFields: cr, oOldFields: cr }
      await take.create(logs)

      // await notificationsender(req, cr._id, ' cr department is update ', true, true, req.employee._id, `${config.urlPrefix}/change-request/detail/${cr._id}`)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].department))
    } catch (error) {
      catchError('ChangeRequest.updateCrdepartments', error, req, res)
    }
  }

  async etc(req, res) {
    try {
      // console.log('req.body')
      const { id } = req.query

      const cr = await ChangeRequestModel.findOne({ _id: ObjectId(id) }).lean()
      // console.log(cr)

      const employee = await CrWiseEmployeeModel.find({ eStatus: 'Y', iCrId: id }).populate({ path: 'iEmployeeId', eStatus: 'Y', select: 'sName iDepartmentId' }).sort({ sName: 1 }).lean()
      // console.log(employee)

      const aCrWiseDepartmentIdsToDelete = await CrWiseDepartmentModel.find({ eStatus: 'Y' }).select('iDepartmentId')

      // console.log(aCrWiseDepartmentIdsToDelete)

      const aEmployeeToDelete = employee.filter(employee => aCrWiseDepartmentIdsToDelete.map(department => department.iDepartmentId.toString()).includes(employee.iEmployeeId.iDepartmentId.toString()))
      await Promise.all(aEmployeeToDelete.map(async (employee) => {
        // console.log(employee)
        const data = await CrWiseEmployeeModel.find({ eStatus: 'Y', iEmployeeId: employee.iEmployeeId._id, iCrId: req.params.iCrId }).lean()
        // console.log(data)
        // console.log(employee.iEmployeeId._id)
        return CrWiseEmployeeModel.updateOne({ iEmployeeId: employee.iEmployeeId._id, iCrId: ObjectId(id) }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })
      }))

      // console.log(aEmployeeToDelete)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success, employee)
    } catch (error) {
      return ErrorResponseSender(res, status.InternalServerError, error.message)
    }
  }

  async getChangeRequestByCrId(req, res) {
    try {
      const { id } = req.params

      const q = [
        {
          $match: { eStatus: 'Y', _id: ObjectId(id) }
        },
        {
          $lookup: {
            from: 'projects',
            let: { projectId: '$iProjectId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$projectId'] },
                  eStatus: 'Y'
                }
              },
              {
                $project: {
                  sName: 1,
                  _id: 1
                }
              }
            ],
            as: 'project'
          }
        },
        {
          $unwind: {
            path: '$project',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'crwiseemployees',
            let: { crId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$iCrId', '$$crId'] },
                  eStatus: 'Y'
                }
              },
              {
                $lookup: {
                  from: 'employees',
                  let: { employeeId: '$iEmployeeId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$employeeId'] },
                        eStatus: 'Y'
                      }
                    },
                    {
                      $project: {
                        _id: 1,
                        sName: 1,
                        iDepartmentId: 1
                      }
                    }
                  ],
                  as: 'employee'
                }
              },
              {
                $unwind: {
                  path: '$employee',
                  preserveNullAndEmptyArrays: false
                }
              },
              {
                $project: {
                  _id: '$employee._id',
                  sName: '$employee.sName',
                  iDepartmentId: '$employee.iDepartmentId'
                }
              }
            ],
            as: 'crwiseemployees'
          }
        },
        {
          $lookup: {
            from: 'crwisedepartments',
            let: { crId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$iCrId', '$$crId'] }
                }
              },
              {
                $lookup: {
                  from: 'departments',
                  let: { departmentId: '$iDepartmentId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$departmentId'] },
                        eStatus: 'Y'
                      }
                    },
                    {
                      $project: {
                        _id: 1,
                        sName: 1
                      }
                    }
                  ],
                  as: 'department'
                }
              },
              {
                $unwind: {
                  path: '$department',
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $project: {
                  _id: '$department._id',
                  sName: '$department.sName',
                  nMinutes: { $ifNull: ['$nMinutes', 0] },
                  nCost: { $ifNull: ['$nCost', 0] },
                  iProjectId: { $ifNull: ['$iProjectId', 0] }
                }
              }
            ],
            as: 'crwisedepartments'
          }
        }
      ]

      const cr = await ChangeRequestModel.aggregate(q)
      if (!cr.length) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].change_request))

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].change_request), { cr: cr[0] })
    } catch (error) {
      catchError('ChangeRequest.getChangeRequestByCrId', error, req, res)
    }
  }
}

module.exports = new ChangeRequest()
