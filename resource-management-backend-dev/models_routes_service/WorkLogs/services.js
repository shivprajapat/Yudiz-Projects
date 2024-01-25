const Logs = require('../Logs/model')
const WorkLogsModel = require('./model')
const WorkLogTagsModel = require('./worklogsTags.model')
const ProjectModel = require('../Project/model')
const EmployeeModel = require('../Employee/model')
const CrModel = require('../ChangeRequest/model')
const DashboardCrDepartmentModel = require('../DashBoard/dashboardCrDepartment.model')
const DashboardCrIndicatorModel = require('../DashBoard/dashboardCrIndicator.model')
const ProjectWiseEmployeeModel = require('../Project/projectwiseemployee.model')
const CrWiseEmployeeModel = require('../ChangeRequest/crWiseEmployee.model')
const EmployeeCurrencyModel = require('../Employee/employeeCurrency.model')
const CurrencyModel = require('../Currency/model')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const moment = require('moment')
const { queuePush } = require('../../helper/redis')
const JobProfileModel = require('../JobProfile/model')
const DepartmentModel = require('../Department/model')

const { ResourceManagementDB } = require('../../database/mongoose')

const { status, messages } = require('../../helper/api.responses')
const { pick, catchError, ErrorResponseSender, SuccessResponseSender } = require('../../helper/utilities.services')
const DashboardProjectDepartmentModel = require('../DashBoard/dashboardProjectDepartment.model')
const DashboardProjectIndicatorModel = require('../DashBoard/dashboardProjectIndicator.model')

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await WorkLogsModel.findOne({ _id: params }).lean()

    const projectData = await ProjectModel.findOne({
      _id: data.iProjectId,
      eStatus: 'Y'
    })

    let allEmployee = await EmployeeModel.find({ _id: { $in: [projectData.iProjectManagerId, projectData.iBAId, projectData.iBDId, data.iCreatedBy, iLastUpdateBy] }, eStatus: 'Y' }, {
      _id: 1,
      aJwtTokens: 1,
      iDepartmentId: 1,
      iJobProfileId: 1
    }).lean()

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
      iWorkLogId: data._id,
      sName: 'work log',
      iCreatedBy: iLastUpdateBy,
      sUrl: url,
      sType: 'worklog',
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    // sPushToken = sPushToken.filter((item) => {
    //   return item.match(/-/g).length === 4
    // })

    // console.log('sPushToken', sPushToken)

    const person = await EmployeeModel.findOne({ _id: data.iLastUpdateBy }, { sName: 1, sEmpId: 1 })
    const putData = {
      sPushToken,
      sTitle: 'Resource Management',
      sBody: `${sBody}by ${person?.sName || 'unknown'}(${person?.sEmpId || 0})`,
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      sType: 'worklog',
      metadata,
      sUrl: url,
      aSenderId: ids,
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    // console.log('putData', putData)

    await queuePush('Project:Notification', putData)
  } catch (error) {
    console.log(error)
  }
}

async function notificationsenderForWorkLogsTags(req, params, sBody, isRecorded, isNotify, iLastUpdateBy) {
  try {
    const data = await WorkLogTagsModel.findOne({ _id: params }).lean()

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
      iWorklogTagId: data._id,
      sName: data.sName,
      iCreatedBy: iLastUpdateBy,
      sType: 'worklog tag',
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    const person = await EmployeeModel.findOne({ _id: iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()

    const putData = {
      sPushToken,
      sTitle: 'Resource Management',
      sBody: `${data.sName}${sBody}by ${person.sName}(${person.sEmpId})`,
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      sType: 'worklog tag',
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

class WorkLogs {
  async addWorkLogs(req, res) {
    try {
      req.body = pick(req.body, ['iProjectId', 'dTaskStartTime', 'dTaskEndTime', 'sTaskDetails', 'iCrId', 'nMinutes', 'aTaskTag', 'bIsNonBillable'])

      req.body.iEmployeeId = req.employee._id

      let project
      if (req.body.iProjectId) {
        project = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).populate({ path: 'iCurrencyId', select: 'sName sSymbol nUSDCompare' }).lean()
        if (!project) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
        }
        if (project.eProjectStatus === 'Pending' || project.eProjectStatus === 'Completed') {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].project_not_in_progress + ' ' + messages[req.userLanguage].not_allowed_to_proceed)
        }
      }

      let employee
      if (req.body.iEmployeeId) {
        employee = await EmployeeModel.findOne({ _id: req.body.iEmployeeId }).lean()
        if (!employee) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        } else {
          req.body.iDepartmentId = employee.iDepartmentId
        }
      }

      const sCurrencyName = project.iCurrencyId.sName
      const sCurrencySymbol = project.iCurrencyId.sSymbol
      // console.log('sCurrencyName', sCurrencyName)
      // console.log('sCurrencySymbol', sCurrencySymbol)

      const EmployeeGet = await EmployeeCurrencyModel.findOne({ iEmployeeId: req.body.iEmployeeId, iCurrencyId: project.iCurrencyId._id, eStatus: 'Y' })

      if (req.body.dTaskStartTime && req.body.dTaskEndTime) {
        const startTime = new Date(req.body.dTaskStartTime)
        const endTime = new Date(req.body.dTaskEndTime)
        // if (startTime < new Date() || endTime < new Date()) {
        //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].date_grater_then)
        // }
        const diff = endTime.getTime() - startTime.getTime()
        // console.log(diff)

        if (diff < 0) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid_date)
        }

        const nMinutes = (diff / (1000 * 60)).toFixed(1)
        // console.log(nMinutes)

        if (nMinutes >= 24 * 60) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].date_less_then_24)
        }

        req.body.nMinutes = nMinutes
      }

      let employeeChargeableBase = 0
      let Calculation
      let currencyTakenFlag = 'G'
      if (!EmployeeGet) {
        const data = await CurrencyModel.findOne({ _id: project.iCurrencyId._id, eStatus: 'Y' }).lean()
        if (data) {
          employeeChargeableBase = data.nUSDCompare
          Calculation = (Number((+req.body.nMinutes / 60).toFixed(2)) * parseFloat(employee.nPaid * employeeChargeableBase)).toFixed(2)
        }
      } else {
        employeeChargeableBase = EmployeeGet.nCost
        currencyTakenFlag = 'L'
        Calculation = (Number((+req.body.nMinutes / 60).toFixed(2)) * parseFloat(employeeChargeableBase)).toFixed(2)
      }

      const projectType = project.eProjectType

      if (projectType === 'Dedicated') {
        const startTime = new Date(req.body.dTaskStartTime)
        const endTime = new Date(req.body.dTaskEndTime)

        const query = {
          iProjectId: req.body.iProjectId,
          iEmployeeId: req.body.iEmployeeId,
          eStatus: 'Y'
        }

        const projectEmployeeExist = await ProjectWiseEmployeeModel.findOne(query).lean()

        if (!projectEmployeeExist) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        }

        // check if employee is on month

        // let employee
        // if (req.body.iEmployeeId) {
        //   employee = await EmployeeModel.findOne({ _id: req.body.iEmployeeId }).lean()
        //   if (!employee) {
        //     return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        //   } else {
        //     req.body.iDepartmentId = employee.iDepartmentId
        //   }
        // }

        if (req.body.iProjectId) {
          req.body.eWorkLogsType = 'P'
          if (!req.body.bIsNonBillable) {
            await DashboardProjectIndicatorModel.updateOne({ iProjectId: req.body.iProjectId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation } })
          } else {
            await DashboardProjectIndicatorModel.updateOne({ iProjectId: req.body.iProjectId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation, nNonBillableMinute: +req.body.nMinutes, nNonBillableCost: Calculation } })
          }
        }
        if (req.body.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: +req.body.nMinutes,
              nNonBillableCost: Calculation,
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: Calculation
            }
          })
        } else {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: Calculation
            }
          })
        }

        const data = await WorkLogsModel.create({ ...req.body, iCreatedBy: req.employee._id, iLastUpdatedBy: req.employee._id, nMinutes: +req.body.nMinutes, nCost: Calculation, eProjectType: project.eProjectType, sCurrencyName, sCurrencySymbol, eCurrencyTakenFlag: currencyTakenFlag })

        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)

        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'WorkLogs', sService: 'addWorkLogs', eAction: 'Create', oNewFields: data }
        await take.create(logs)
        // notificationsender(req, data._id, ' worklog is create ', true, true, req.employee._id)

        return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].workLogs))
      } else {
        let cr
        if (req.body.iCrId) {
          cr = await CrModel.findOne({ _id: req.body.iCrId, iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()
          if (!cr) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].changeRequest))
          }
          if (project.eProjectStatus === 'Pending' || project.eProjectStatus === 'Completed') {
            return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].change_request_not_in_progress + ' ' + messages[req.userLanguage].not_allowed_to_proceed)
          }
        }

        const query = {
          iProjectId: req.body.iProjectId,
          iEmployeeId: req.body.iEmployeeId,
          eStatus: 'Y'
        }

        // if (req.body.iCrId && req.body.iProjectId) {
        //   const startTime = new Date(req.body.dTaskStartTime)
        //   const endTime = new Date(req.body.dTaskEndTime)
        //   // console.log(startTime, endTime)
        //   // console.log(new Date(cr.dStartDate), new Date(cr.dEndDate))
        //   // if (!(startTime >= new Date(cr.dStartDate)) || !(endTime <= new Date(cr.dEndDate))) {
        //   //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].in_between_date.replace('##', messages[req.userLanguage].change_request))
        //   // }
        // } else {
        //   const startTime = new Date(req.body.dTaskStartTime)
        //   const endTime = new Date(req.body.dTaskEndTime)
        //   // console.log(startTime, endTime)
        //   // console.log(new Date(project.dStartDate), new Date(project.dEndDate))
        //   // if (!(startTime >= new Date(project.dStartDate)) || !(endTime <= new Date(project.dEndDate))) {
        //   //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].in_between_date.replace('##', messages[req.userLanguage].project))
        //   // }
        // }

        if (req.body.iCrId) {
          query.iCrId = req.body.iCrId

          const employeeExistInCr = await CrWiseEmployeeModel.findOne(query).lean()
          if (!employeeExistInCr) {
            return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
          }
        }

        const projectEmployeeExist = await ProjectWiseEmployeeModel.findOne(query).lean()

        if (!projectEmployeeExist) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        }

        let employee
        if (req.body.iEmployeeId) {
          employee = await EmployeeModel.findOne({ _id: req.body.iEmployeeId }).lean()
          if (!employee) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
          } else {
            req.body.iDepartmentId = employee.iDepartmentId
          }
        }

        // if (req.body.dTaskStartTime && req.body.dTaskEndTime) {
        //   const startTime = new Date(req.body.dTaskStartTime)
        //   const endTime = new Date(req.body.dTaskEndTime)
        //   // if (startTime < new Date() || endTime < new Date()) {
        //   //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].date_grater_then)
        //   // }
        //   const diff = endTime.getTime() - startTime.getTime()
        //   console.log(diff)

        //   if (diff < 0) {
        //     return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid_date)
        //   }

        //   const nMinutes = (diff / (1000 * 60)).toFixed(1)
        //   console.log(nMinutes)

        //   if (nMinutes >= 24 * 60) {
        //     return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].date_less_then_24)
        //   }

        //   req.body.nMinutes = nMinutes
        // }

        // console.log(req.body)

        if (req.body.iCrId && req.body.iProjectId) {
          req.body.eWorkLogsType = 'CR'
          // console.log(req.body.iCrId, req.body.iProjectId, employee.iDepartmentId)
          const crDepartment = await DashboardCrDepartmentModel.findOne({ iCrId: req.body.iCrId, iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }).lean()
          if (!crDepartment) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
          }
          if (!req.body.bIsNonBillable) {
            await DashboardCrDepartmentModel.updateOne({ iCrId: req.body.iCrId, iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation } })
            await DashboardCrIndicatorModel.updateOne({ iCrId: req.body.iCrId, iProjectId: req.body.iProjectId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation } })
          } else {
            await DashboardCrDepartmentModel.updateOne({ iCrId: req.body.iCrId, iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation, nNonBillableMinute: +req.body.nMinutes, nNonBillableCost: Calculation } })
            await DashboardCrIndicatorModel.updateOne({ iCrId: req.body.iCrId, iProjectId: req.body.iProjectId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation, nNonBillableMinute: +req.body.nMinutes, nNonBillableCost: Calculation } })
          }
        } else {
          if (req.body.iProjectId) {
            req.body.eWorkLogsType = 'P'
            const projectDepartment = await DashboardProjectDepartmentModel.findOne({ iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }).lean()
            if (!projectDepartment) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
            }
            if (!req.body.bIsNonBillable) {
              await DashboardProjectDepartmentModel.updateOne({ iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation } })
              await DashboardProjectIndicatorModel.updateOne({ iProjectId: req.body.iProjectId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation } })
            } else {
              await DashboardProjectDepartmentModel.updateOne({ iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation, nNonBillableMinute: +req.body.nMinutes, nNonBillableCost: Calculation } })
              await DashboardProjectIndicatorModel.updateOne({ iProjectId: req.body.iProjectId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: Calculation, nNonBillableMinute: +req.body.nMinutes, nNonBillableCost: Calculation } })
            }
          }
        }

        console.log(req.body)

        if (req.body.eWorkLogsType === 'CR') {
          if (req.body.bIsNonBillable) {
            console.log('CR non', req.body.iCrId, req.body.iProjectId, req.body.iEmployeeId, req.body.nMinutes, Calculation)
            const a = await CrWiseEmployeeModel.updateOne({
              iCrId: req.body.iCrId,
              iProjectId: req.body.iProjectId,
              iEmployeeId: req.body.iEmployeeId,
              eStatus: 'Y'
            }, {
              $inc: {
                nNonBillableMinute: +req.body.nMinutes,
                nNonBillableCost: Calculation,
                nRemainingMinute: +req.body.nMinutes,
                nRemainingCost: Calculation
              }
            })
            const b = await ProjectWiseEmployeeModel.updateOne({
              iProjectId: req.body.iProjectId,
              iEmployeeId: req.body.iEmployeeId,
              eStatus: 'Y'
            }, {
              $inc: {
                nNonBillableMinute: +req.body.nMinutes,
                nNonBillableCost: Calculation,
                nRemainingMinute: +req.body.nMinutes,
                nRemainingCost: Calculation
              }
            })
            console.log(a, b)
            // await Promise.all(CrWiseEmployeeModel.updateOne({
            //   iCrId: req.body.iCrId,
            //   iProjectId: req.body.iProjectId,
            //   iEmployeeId: req.body.iEmployeeId,
            //   eStatus: 'Y'
            // }, {
            //   $inc: {
            //     nNonBillableMinute: +req.body.nMinutes,
            //     nNonBillableCost: Calculation,
            //     nRemainingMinute: +req.body.nMinutes,
            //     nRemainingCost: Calculation
            //   }
            // }),
            // ProjectWiseEmployeeModel.updateOne({
            //   iProjectId: req.body.iProjectId,
            //   iEmployeeId: req.body.iEmployeeId,
            //   eStatus: 'Y'
            // }, {
            //   $inc: {
            //     nNonBillableMinute: +req.body.nMinutes,
            //     nNonBillableCost: Calculation,
            //     nRemainingMinute: +req.body.nMinutes,
            //     nRemainingCost: Calculation
            //   }
            // }))
          } else {
            console.log('CR', req.body.iCrId, req.body.iProjectId, req.body.iEmployeeId, req.body.nMinutes, Calculation)
            try {
              const a = await CrWiseEmployeeModel.updateOne({
                iCrId: req.body.iCrId,
                iProjectId: req.body.iProjectId,
                iEmployeeId: req.body.iEmployeeId,
                eStatus: 'Y'
              }, {
                $inc: {
                  nRemainingMinute: +req.body.nMinutes,
                  nRemainingCost: Calculation
                }
              })
              const b = await ProjectWiseEmployeeModel.updateOne({
                iProjectId: req.body.iProjectId,
                iEmployeeId: req.body.iEmployeeId,
                eStatus: 'Y'
              }, {
                $inc: {
                  nRemainingMinute: +req.body.nMinutes,
                  nRemainingCost: Calculation
                }
              })
              console.log(a, b)
              // await Promise.all(CrWiseEmployeeModel.updateOne({
              //   iCrId: req.body.iCrId,
              //   iProjectId: req.body.iProjectId,
              //   iEmployeeId: req.body.iEmployeeId.toString(),
              //   eStatus: 'Y'
              // }, {
              //   $inc: {
              //     nRemainingMinute: +req.body.nMinutes,
              //     nRemainingCost: Calculation
              //   }
              // }),
              // ProjectWiseEmployeeModel.updateOne({
              //   iProjectId: req.body.iProjectId,
              //   iEmployeeId: req.body.iEmployeeId,
              //   eStatus: 'Y'
              // }, {
              //   $inc: {
              //     nRemainingMinute: +req.body.nMinutes,
              //     nRemainingCost: Calculation
              //   }
              // }))
            } catch (error) {
              console.log(error)
            }
          }
        } else {
          if (req.body.bIsNonBillable) {
            await ProjectWiseEmployeeModel.updateOne({
              iProjectId: req.body.iProjectId,
              iEmployeeId: req.body.iEmployeeId,
              eStatus: 'Y'
            }, {
              $inc: {
                nNonBillableMinute: +req.body.nMinutes,
                nNonBillableCost: Calculation,
                nRemainingMinute: +req.body.nMinutes,
                nRemainingCost: Calculation
              }
            })
          } else {
            await ProjectWiseEmployeeModel.updateOne({
              iProjectId: req.body.iProjectId,
              iEmployeeId: req.body.iEmployeeId,
              eStatus: 'Y'
            }, {
              $inc: {
                nRemainingMinute: +req.body.nMinutes,
                nRemainingCost: Calculation
              }
            })
          }
        }

        const data = await WorkLogsModel.create({ ...req.body, iCreatedBy: req.employee._id, iLastUpdatedBy: req.employee._id, nMinutes: +req.body.nMinutes, nCost: Calculation, eProjectType: project.eProjectType, sCurrencyName, sCurrencySymbol, eCurrencyTakenFlag: currencyTakenFlag })

        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)

        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'WorkLogs', sService: 'addWorkLogs', eAction: 'Create', oNewFields: data }
        await take.create(logs)
        // notificationsender(req, data._id, ' worklog is create ', true, true, req.employee._id)
        return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].workLogs))
      }
    } catch (error) {
      console.log(error)
      return catchError('WorkLogs.addWorkLogs', error, req, res)
    }
  }

  async addWorkLogsV2(req, res) {
    try {
      req.body = pick(req.body, ['iProjectId', 'dTaskStartTime', 'dTaskEndTime', 'sTaskDetails', 'iCrId', 'nMinutes', 'aTaskTag', 'bIsNonBillable'])

      req.body.iEmployeeId = req.employee._id

      let project
      if (req.body.iProjectId) {
        project = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).populate({ path: 'iCurrencyId', select: 'sName sSymbol nUSDCompare' }).lean()
        if (!project) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
        }
        if (project.eProjectStatus === 'Pending' || project.eProjectStatus === 'Completed') {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].project_not_in_progress + ' ' + messages[req.userLanguage].not_allowed_to_proceed)
        }
      }

      let employee
      if (req.body.iEmployeeId) {
        employee = await EmployeeModel.findOne({ _id: req.body.iEmployeeId }).lean()
        if (!employee) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        } else {
          req.body.iDepartmentId = employee.iDepartmentId
        }
      }

      const sCurrencyName = project.iCurrencyId.sName
      const sCurrencySymbol = project.iCurrencyId.sSymbol
      const nCurrencyValue = project.iCurrencyId.nUSDCompare

      if (req.body.dTaskStartTime && req.body.dTaskEndTime) {
        const startTime = new Date(req.body.dTaskStartTime)
        const endTime = new Date(req.body.dTaskEndTime)
        const diff = endTime.getTime() - startTime.getTime()
        if (diff < 0) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid_date)
        }
        // const nMinutes = (diff / (1000 * 60)).toFixed(1)
        if (req.body.nMinutes >= 24 * 60) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].date_less_then_24)
        }
        // req.body.nMinutes = nMinutes
      }

      const EmployeeGet = await EmployeeCurrencyModel.findOne({ iEmployeeId: req.body.iEmployeeId, iCurrencyId: project.iCurrencyId._id, eStatus: 'Y' })

      // let employeeChargeableBase = 0
      // if (!EmployeeGet) {
      //   employeeChargeableBase = nCurrencyValue
      // } else {
      //   employeeChargeableBase = EmployeeGet?.nCost || 0
      // }

      const projectType = project.eProjectType

      if (projectType === 'Dedicated') {
        console.log('Dedicated')

        const query = {
          iProjectId: req.body.iProjectId,
          iEmployeeId: req.body.iEmployeeId,
          eStatus: 'Y'
        }

        const projectEmployeeExist = await ProjectWiseEmployeeModel.findOne(query).lean()

        if (!projectEmployeeExist) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        }
        req.body.eWorkLogsType = 'P'

        if (req.body.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: +req.body.nMinutes,
              nNonBillableCost: +((+req.body.nMinutes) * projectEmployeeExist.nCost),
              nOrgNonBillableMinute: +req.body.nMinutes,
              nOrgNonBillableCost: (((+req.body.nMinutes) * EmployeeGet?.nCost) / 60),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
            }
          })

          const data = await WorkLogsModel.create({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            iDepartmentId: employee.iDepartmentId,
            dTaskStartTime: req.body.dTaskStartTime,
            dTaskEndTime: req.body.dTaskEndTime,
            nCost: +((+req.body.nMinutes) * projectEmployeeExist.nCost),
            nMinutes: +req.body.nMinutes,
            sTaskDetails: req.body.sTaskDetails,
            eStatus: 'Y',
            aTaskTag: req.body.aTaskTag,
            iCreatedBy: req.employee._id,
            iLastUpdateBy: req.employee._id,
            eWorkLogsType: 'P',
            bIsNonBillable: req.body.bIsNonBillable,
            eProjectType: project.eProjectType,
            sCurrencyName,
            sCurrencySymbol,
            nCurrencyValue,
            nClientCost: +projectEmployeeExist.nCost,
            nOrgCost: +(EmployeeGet?.nCost / 60)
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
            }
          })
          let take = `Logs${new Date().getFullYear()}`
          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'WorkLogs', sService: 'addWorkLogs', eAction: 'Create', oNewFields: data }
          await take.create(logs)

          // await ProjectModel.updateOne({
          //   iProjectId: req.body.iProjectId,
          //   eStatus: 'Y'
          // }, {
          //   sCost: ((+project?.sCost || 0) + (((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)).toString(),
          //   nTimeLineDays: +((+project?.nTimeLineDays || 0) + (+req.body.nMinutes / (60 * 24)))
          // })
        } else {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: +((+req.body.nMinutes) * projectEmployeeExist.nCost),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
            }
          })

          const data = await WorkLogsModel.create({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            iDepartmentId: employee.iDepartmentId,
            dTaskStartTime: req.body.dTaskStartTime,
            dTaskEndTime: req.body.dTaskEndTime,
            nCost: +((+req.body.nMinutes) * projectEmployeeExist.nCost),
            nMinutes: +req.body.nMinutes,
            sTaskDetails: req.body.sTaskDetails,
            eStatus: 'Y',
            aTaskTag: req.body.aTaskTag,
            iCreatedBy: req.employee._id,
            iLastUpdateBy: req.employee._id,
            eWorkLogsType: 'P',
            bIsNonBillable: req.body.bIsNonBillable,
            eProjectType: project.eProjectType,
            sCurrencyName,
            sCurrencySymbol,
            nCurrencyValue,
            nClientCost: +projectEmployeeExist.nCost,
            nOrgCost: +(EmployeeGet?.nCost / 60)
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            nRemainingMinute: +req.body.nMinutes,
            nRemainingCost: +((+req.body.nMinutes) * projectEmployeeExist.nCost),
            nOrgRemainingMinute: +req.body.nMinutes,
            nOrgRemainingCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
          })

          let take = `Logs${new Date().getFullYear()}`
          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'WorkLogs', sService: 'addWorkLogs', eAction: 'Create', oNewFields: data }
          await take.create(logs)
          // await ProjectModel.updateOne({
          //   iProjectId: req.body.iProjectId,
          //   eStatus: 'Y'
          // }, {
          //   sCost: ((+project?.sCost || 0) + (((+req.body.nMinutes) * projectEmployeeExist?.nCost) / 60)).toString(),
          //   nTimeLineDays: +((+project?.nTimeLineDays || 0) + (+req.body.nMinutes / (60 * 24)))
          // })
        }
        return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].workLogs))
      } else {
        const query = {
          iProjectId: req.body.iProjectId,
          iEmployeeId: req.body.iEmployeeId,
          eStatus: 'Y'
        }

        const projectEmployeeExist = await ProjectWiseEmployeeModel.findOne(query).lean()

        if (!projectEmployeeExist) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        }
        req.body.eWorkLogsType = 'P'

        if (req.body.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: +req.body.nMinutes,
              nNonBillableCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60),
              nOrgNonBillableMinute: +req.body.nMinutes,
              nOrgNonBillableCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
            }
          })

          const data = await WorkLogsModel.create({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            iDepartmentId: employee.iDepartmentId,
            dTaskStartTime: req.body.dTaskStartTime,
            dTaskEndTime: req.body.dTaskEndTime,
            nCost: (((+req.body.nMinutes) * EmployeeGet?.nCost) / 60),
            nMinutes: +req.body.nMinutes,
            sTaskDetails: req.body.sTaskDetails,
            eStatus: 'Y',
            aTaskTag: req.body.aTaskTag,
            iCreatedBy: req.employee._id,
            iLastUpdateBy: req.employee._id,
            eWorkLogsType: 'P',
            bIsNonBillable: req.body.bIsNonBillable,
            eProjectType: project.eProjectType,
            sCurrencyName,
            sCurrencySymbol,
            nCurrencyValue,
            nOrgCost: (EmployeeGet?.nCost / 60)
          })

          await DashboardProjectDepartmentModel.updateOne({
            iProjectId: req.body.iProjectId,
            iDepartmentId: employee.iDepartmentId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: +req.body.nMinutes,
              nNonBillableCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
            }
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: +req.body.nMinutes,
              nNonBillableCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60),
              nOrgNonBillableMinute: +req.body.nMinutes,
              nOrgNonBillableCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
            }
          }
          )
          let take = `Logs${new Date().getFullYear()}`
          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'WorkLogs', sService: 'addWorkLogs', eAction: 'Create', oNewFields: data }
          await take.create(logs)
        } else {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: (((+req.body.nMinutes) * EmployeeGet?.nCost) / 60),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: (((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
            }
          })

          const data = await WorkLogsModel.create({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            iDepartmentId: employee.iDepartmentId,
            dTaskStartTime: req.body.dTaskStartTime,
            dTaskEndTime: req.body.dTaskEndTime,
            nCost: (((+req.body.nMinutes) * EmployeeGet?.nCost) / 60),
            nMinutes: +req.body.nMinutes,
            sTaskDetails: req.body.sTaskDetails,
            eStatus: 'Y',
            aTaskTag: req.body.aTaskTag,
            iCreatedBy: req.employee._id,
            iLastUpdateBy: req.employee._id,
            eWorkLogsType: 'P',
            bIsNonBillable: req.body.bIsNonBillable,
            eProjectType: project.eProjectType,
            sCurrencyName,
            sCurrencySymbol,
            nCurrencyValue,
            nOrgCost: (EmployeeGet?.nCost / 60)
          })

          await DashboardProjectDepartmentModel.updateOne({
            iProjectId: req.body.iProjectId,
            iDepartmentId: employee.iDepartmentId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: (((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
            }
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: (((+req.body.nMinutes) * EmployeeGet?.nCost) / 60),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * EmployeeGet?.nCost) / 60)
            }
          })
          let take = `Logs${new Date().getFullYear()}`
          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'WorkLogs', sService: 'addWorkLogs', eAction: 'Create', oNewFields: data }
          await take.create(logs)
        }
        return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].workLogs))
      }
    } catch (error) {
      console.log(error)
      return catchError('WorkLogs.addWorkLogs', error, req, res)
    }
  }

  async getWorkLogs(req, res) {
    console.log('getWorkLogs')
    try {
      const { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt', project = 'all', person = 'me', date = '' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1
      const q = [{
        $match: {
          eStatus: 'Y'
        }
      },
      {
        $lookup: {
          from: 'projects',
          let: { iProjectId: '$iProjectId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$iProjectId'] } } },
            { $project: { sName: 1 } }
          ],
          as: 'project'
        }
      },
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'employees',
          let: { iEmployeeId: '$iEmployeeId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$iEmployeeId'] } } },
            { $project: { sName: 1 } }
          ],
          as: 'employee'
        }
      },
      {
        $unwind: {
          path: '$employee',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'changerequests',
          let: { iCrId: '$iCrId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$iCrId']
                },
                eStatus: 'Y'
              }
            },
            {
              $project: {
                sName: 1
              }
            }
          ],
          as: 'cr'
        }
      },
      {
        $unwind: {
          path: '$cr',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          sProjectName: '$project.sName',
          sEmployeeName: '$employee.sName',
          _id: 1,
          iProjectId: 1,
          iCrId: { $ifNull: ['$iCrId', null] },
          sCrName: { $ifNull: ['$cr.sName', null] },
          iEmployeeId: 1,
          iDepartmentId: 1,
          dTaskStartTime: 1,
          dTaskEndTime: 1,
          nCost: 1,
          nMinutes: 1,
          sTaskDetails: 1,
          eStatus: 1,
          aTaskTag: 1,
          iCreatedBy: 1,
          eWorkLogsType: 1,
          dCreatedAt: 1,
          dUpdatedAt: 1
        }
      }
      ]

      if (date.trim() !== '' && date.trim() !== null && date.trim() !== undefined) {
        const result = moment(date, 'YYYY-MM-DD', true).isValid()
        if (result) {
          const start = moment(date, 'YYYY-MM-DD').startOf('day')
          const end = moment(date, 'YYYY-MM-DD').endOf('day')
          q.push({
            $match: {
              dCreatedAt: {
                $gte: start.toDate(),
                $lte: end.toDate()
              }
            }
          })
        }
      }

      const jobProfileData = await EmployeeModel.findOne({ _id: req.employee._id }, { iJobProfileId: 1 }).populate({ path: 'iJobProfileId', select: 'nLevel' }).lean()

      console.log(jobProfileData)
      const jobLevelMatch = 3

      if (project === 'all' && person === 'all') {
        if (jobProfileData.iJobProfileId.nLevel <= jobLevelMatch) {
          // const projectEmployee = await ProjectWiseEmployeeModel.find({ eStatus: 'Y', iEmployeeId: ObjectId(req.employee._id) }, { iProjectId: 1 }).lean()
          // const department = await DepartmentModel.findOne({ eStatus: 'Y', _id: ObjectId(req.employee.iDepartmentId) }).lean()
          const query = [
            {
              $match: {
                eStatus: 'Y',
                'flag.2': 'Y'
              }
            }
          ]

          // if (!['OPERATION', 'ADMIN', 'HR', 'MANAGEMENT'].includes(department.sKey)) {
          //   query[0].$match.$or = [
          //     { iBDId: ObjectId(req.employee._id) },
          //     { iProjectManagerId: ObjectId(req.employee._id) },
          //     { iBAId: ObjectId(req.employee._id) },
          //     { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
          //   ]
          // }

          const projects = await ProjectModel.aggregate(query)

          console.log(projects)

          // let projects = await ProjectModel.find(query).distinct('_id').lean()

          // let projectWiseEmployee = await ProjectWiseEmployeeModel.find({ iEmployeeId: req.employee._id }).distinct('iProjectId').lean()

          // projectWiseEmployee = projectWiseEmployee.map((project) => {
          //   return project.toString()
          // })

          // projects = projects.map((project) => {
          //   return project.toString()
          // })

          // let filterProjects = [...projects]

          // for (let i = 0; i < projectWiseEmployee.length; i++) {
          //   if (!filterProjects.includes(projectWiseEmployee[i])) {
          //     filterProjects.push(projectWiseEmployee[i])
          //   }
          // }

          // filterProjects = filterProjects.map((project) => ObjectId(project))

          // q[0].$match.iProjectId = {
          //   $in: [
          //     ...projects.map((project) => ObjectId(project._id))
          //   ]
          // }
        } else {
          const projectEmployee = await ProjectWiseEmployeeModel.find({ eStatus: 'Y', iEmployeeId: ObjectId(req.employee._id) }, { iProjectId: 1 }).lean()
          const department = await DepartmentModel.findOne({ eStatus: 'Y', _id: ObjectId(req.employee.iDepartmentId) }).lean()
          const query = [
            {
              $match: {
                eStatus: 'Y',
                'flag.2': 'Y'
              }
            }
          ]

          if (!['OPERATION', 'ADMIN', 'HR', 'MANAGEMENT'].includes(department.sKey)) {
            query[0].$match.$or = [
              { iBDId: ObjectId(req.employee._id) },
              { iProjectManagerId: ObjectId(req.employee._id) },
              { iBAId: ObjectId(req.employee._id) },
              { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
            ]
          }

          const projects = await ProjectModel.aggregate(query)

          console.log(projects)

          // let projects = await ProjectModel.find(query).distinct('_id').lean()

          // let projectWiseEmployee = await ProjectWiseEmployeeModel.find({ iEmployeeId: req.employee._id }).distinct('iProjectId').lean()

          // projectWiseEmployee = projectWiseEmployee.map((project) => {
          //   return project.toString()
          // })

          // projects = projects.map((project) => {
          //   return project.toString()
          // })

          // let filterProjects = [...projects]

          // for (let i = 0; i < projectWiseEmployee.length; i++) {
          //   if (!filterProjects.includes(projectWiseEmployee[i])) {
          //     filterProjects.push(projectWiseEmployee[i])
          //   }
          // }

          // filterProjects = filterProjects.map((project) => ObjectId(project))

          q[0].$match.iProjectId = {
            $in: [
              ...projects.map((project) => ObjectId(project._id))
            ]
          }
        }
      }

      if (project !== 'all' && person === 'all') {
        // scenario common
        q[0].$match.iProjectId = ObjectId(project)
      }
      if (project === 'all' && person !== 'all') {
        const query = {
          $or:
            [
              { iEmployeeId: req.employee._id },
              { iBAId: req.employee._id },
              { iBDId: req.employee._id },
              { iProjectManagerId: req.employee._id }
              // { iCreatedBy: req.employee._id },
              // { iLastUpdateBy: req.employee._id }
            ],
          eStatus: 'Y',
          'flag.2': 'Y'
        }

        let projects = await ProjectModel.find(query).distinct('_id').lean()

        let projectWiseEmployee = await ProjectWiseEmployeeModel.find({ iEmployeeId: req.employee._id }).distinct('iProjectId').lean()

        projectWiseEmployee = projects.map((project) => {
          return project.toString()
        })

        projects = projects.map((project) => {
          return project.toString()
        })

        let filterProjects = [...projects]

        for (let i = 0; i < projectWiseEmployee.length; i++) {
          if (!filterProjects.includes(projectWiseEmployee[i])) {
            filterProjects.push(projectWiseEmployee[i])
          }
        }

        filterProjects = filterProjects.map((project) => ObjectId(project))

        q[0].$match.iProjectId = { $in: filterProjects }
        q[0].$match.iEmployeeId = ObjectId(req.employee._id)
      }
      if (project !== 'all' && person !== 'all') {
        q[0].$match.iProjectId = ObjectId(project)
        q[0].$match.iEmployeeId = ObjectId(req.employee._id)
      }

      if (search) {
        q[0].$match.$or = [
          { sName: { $regex: search, $options: 'i' } }
        ]
      }

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, worklogs] = await Promise.all([WorkLogsModel.aggregate(count_query), WorkLogsModel.aggregate(q)])

      for (const worklog of worklogs) {
        if (worklog.iEmployeeId.toString() === req.employee._id.toString()) {
          worklog.isLoggedInUser = true
        } else {
          worklog.isLoggedInUser = false
        }
      }

      if (req.path === '/DownloadExcel') {
        return worklogs
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].workLogs), { worklogs, count: count[0]?.count || 0 })
      }
    } catch (error) {
      return catchError('WorkLogs.getWorkLogs', error, req, res)
    }
  }

  async getWorkLogsV2(req, res) {
    console.log('getWorkLogsV2')
    try {
      const { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt', project = 'all', person = 'me', date = '' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1
      const q = [{
        $match: {
          eStatus: 'Y'
        }
      },
      {
        $lookup: {
          from: 'projects',
          let: { iProjectId: '$iProjectId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$iProjectId'] } } },
            { $project: { sName: 1 } }
          ],
          as: 'project'
        }
      },
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'employees',
          let: { iEmployeeId: '$iEmployeeId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$iEmployeeId'] } } },
            { $project: { sName: 1 } }
          ],
          as: 'employee'
        }
      },
      {
        $unwind: {
          path: '$employee',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'changerequests',
          let: { iCrId: '$iCrId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$iCrId']
                },
                eStatus: 'Y'
              }
            },
            {
              $project: {
                sName: 1
              }
            }
          ],
          as: 'cr'
        }
      },
      {
        $unwind: {
          path: '$cr',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          sProjectName: '$project.sName',
          sEmployeeName: '$employee.sName',
          _id: 1,
          iProjectId: 1,
          iCrId: { $ifNull: ['$iCrId', null] },
          sCrName: { $ifNull: ['$cr.sName', null] },
          iEmployeeId: 1,
          iDepartmentId: 1,
          dTaskStartTime: 1,
          dTaskEndTime: 1,
          nCost: {
            $cond: {
              if: { $eq: [req.employee.bViewCost, true] },
              then: { $ifNull: ['$nCost', 0] },
              else: '$$REMOVE'
            }
          },
          nMinutes: 1,
          sTaskDetails: 1,
          eStatus: 1,
          aTaskTag: 1,
          iCreatedBy: 1,
          eWorkLogsType: 1,
          dCreatedAt: 1,
          dUpdatedAt: 1
        }
      }
      ]

      if (date.trim() !== '' && date.trim() !== null && date.trim() !== undefined) {
        const result = moment(date, 'YYYY-MM-DD', true).isValid()
        if (result) {
          const start = moment(date, 'YYYY-MM-DD').startOf('day')
          const end = moment(date, 'YYYY-MM-DD').endOf('day')
          q.push({
            $match: {
              dCreatedAt: {
                $gte: start.toDate(),
                $lte: end.toDate()
              }
            }
          })
        }
      }

      const jobProfileData = await EmployeeModel.findOne({ _id: req.employee._id }, { iJobProfileId: 1, eShowAllProjects: 1 }).populate({ path: 'iJobProfileId', select: 'nLevel' }).lean()

      console.log(jobProfileData)
      const jobLevelMatch = 3

      if (project === 'all' && person === 'all') {
        if (jobProfileData.eShowAllProjects === 'ALL') {
          // const projectEmployee = await ProjectWiseEmployeeModel.find({ eStatus: 'Y', iEmployeeId: ObjectId(req.employee._id) }, { iProjectId: 1 }).lean()
          // const department = await DepartmentModel.findOne({ eStatus: 'Y', _id: ObjectId(req.employee.iDepartmentId) }).lean()
          const query = [
            {
              $match: {
                eStatus: 'Y',
                'flag.2': 'Y'
              }
            }
          ]

          // if (!['OPERATION', 'ADMIN', 'HR', 'MANAGEMENT'].includes(department.sKey)) {
          //   query[0].$match.$or = [
          //     { iBDId: ObjectId(req.employee._id) },
          //     { iProjectManagerId: ObjectId(req.employee._id) },
          //     { iBAId: ObjectId(req.employee._id) },
          //     { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
          //   ]
          // }

          const projects = await ProjectModel.aggregate(query)

          console.log(projects)

          // let projects = await ProjectModel.find(query).distinct('_id').lean()

          // let projectWiseEmployee = await ProjectWiseEmployeeModel.find({ iEmployeeId: req.employee._id }).distinct('iProjectId').lean()

          // projectWiseEmployee = projectWiseEmployee.map((project) => {
          //   return project.toString()
          // })

          // projects = projects.map((project) => {
          //   return project.toString()
          // })

          // let filterProjects = [...projects]

          // for (let i = 0; i < projectWiseEmployee.length; i++) {
          //   if (!filterProjects.includes(projectWiseEmployee[i])) {
          //     filterProjects.push(projectWiseEmployee[i])
          //   }
          // }

          // filterProjects = filterProjects.map((project) => ObjectId(project))

          // q[0].$match.iProjectId = {
          //   $in: [
          //     ...projects.map((project) => ObjectId(project._id))
          //   ]
          // }
        } else {
          const projectEmployee = await ProjectWiseEmployeeModel.find({ eStatus: 'Y', iEmployeeId: ObjectId(req.employee._id) }, { iProjectId: 1 }).lean()
          const department = await DepartmentModel.findOne({ eStatus: 'Y', _id: ObjectId(req.employee.iDepartmentId) }).lean()
          const query = [
            {
              $match: {
                eStatus: 'Y',
                'flag.2': 'Y'
              }
            }
          ]

          // console.log('projectEmployee', projectEmployee)

          // if (!['OPERATION', 'ADMIN', 'HR', 'MANAGEMENT'].includes(department.sKey)) {
          query[0].$match.$or = [
            { iBDId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
          ]
          // }

          const projects = await ProjectModel.aggregate(query)

          console.log(projects)

          // let projects = await ProjectModel.find(query).distinct('_id').lean()

          // let projectWiseEmployee = await ProjectWiseEmployeeModel.find({ iEmployeeId: req.employee._id }).distinct('iProjectId').lean()

          // projectWiseEmployee = projectWiseEmployee.map((project) => {
          //   return project.toString()
          // })

          // projects = projects.map((project) => {
          //   return project.toString()
          // })

          // let filterProjects = [...projects]

          // for (let i = 0; i < projectWiseEmployee.length; i++) {
          //   if (!filterProjects.includes(projectWiseEmployee[i])) {
          //     filterProjects.push(projectWiseEmployee[i])
          //   }
          // }

          // filterProjects = filterProjects.map((project) => ObjectId(project))

          q[0].$match.iProjectId = {
            $in: [
              ...projects.map((project) => ObjectId(project._id))
            ]
          }
        }
      }

      if (project !== 'all' && person === 'all') {
        // scenario common
        q[0].$match.iProjectId = ObjectId(project)
      }
      if (project === 'all' && person !== 'all') {
        const query = {
          $or:
            [
              { iEmployeeId: req.employee._id },
              { iBAId: req.employee._id },
              { iBDId: req.employee._id },
              { iProjectManagerId: req.employee._id }
              // { iCreatedBy: req.employee._id },
              // { iLastUpdateBy: req.employee._id }
            ],
          eStatus: 'Y',
          'flag.2': 'Y'
        }

        let projects = await ProjectModel.find(query).distinct('_id').lean()

        let projectWiseEmployee = await ProjectWiseEmployeeModel.find({ iEmployeeId: req.employee._id }).distinct('iProjectId').lean()

        projectWiseEmployee = projects.map((project) => {
          return project.toString()
        })

        projects = projects.map((project) => {
          return project.toString()
        })

        let filterProjects = [...projects]

        for (let i = 0; i < projectWiseEmployee.length; i++) {
          if (!filterProjects.includes(projectWiseEmployee[i])) {
            filterProjects.push(projectWiseEmployee[i])
          }
        }

        filterProjects = filterProjects.map((project) => ObjectId(project))

        q[0].$match.iProjectId = { $in: filterProjects }
        q[0].$match.iEmployeeId = ObjectId(req.employee._id)
      }
      if (project !== 'all' && person !== 'all') {
        q[0].$match.iProjectId = ObjectId(project)
        q[0].$match.iEmployeeId = ObjectId(req.employee._id)
      }

      if (search) {
        q[0].$match.$or = [
          { sName: { $regex: search, $options: 'i' } }
        ]
      }

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, worklogs] = await Promise.all([WorkLogsModel.aggregate(count_query), WorkLogsModel.aggregate(q)])

      for (const worklog of worklogs) {
        if (worklog.iEmployeeId.toString() === req.employee._id.toString()) {
          worklog.isLoggedInUser = true
        } else {
          worklog.isLoggedInUser = false
        }
      }

      if (req.path === '/DownloadExcel') {
        return worklogs
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].workLogs), { worklogs, count: count[0]?.count || 0 })
      }
    } catch (error) {
      return catchError('WorkLogs.getWorkLogsV2', error, req, res)
    }
  }

  async deleteWorkLogs(req, res) {
    try {
      const workLogs = await WorkLogsModel.findOne({ _id: req.params.id })
      console.log(workLogs)
      console.log(req.employee._id)

      if (!workLogs) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].workLogs))
      }

      // check if worklog is created by logged in user

      if (workLogs.iEmployeeId.toString() !== req.employee._id.toString()) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_allowed_to_delete.replace('##', messages[req.userLanguage].workLogs))
      }

      if (workLogs?.iCrId && workLogs?.iProjectId) {
        const crDepartment = await DashboardCrDepartmentModel.findOne({ iCrId: workLogs.iCrId, iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId }).lean()
        if (!crDepartment) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].changeRequest))
        }
        if (!workLogs.bIsNonBillable) {
          await DashboardCrDepartmentModel.updateOne({ iCrId: workLogs.iCrId, iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
          await DashboardCrIndicatorModel.updateOne({ iCrId: workLogs.iCrId, iProjectId: workLogs.iProjectId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
          await CrWiseEmployeeModel.updateOne({ iCrId: workLogs.iCrId, iProjectId: workLogs.iProjectId, iEmployeeId: workLogs.iEmployeeId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
          await ProjectWiseEmployeeModel.updateOne({ iProjectId: workLogs.iProjectId, iEmployeeId: workLogs.iEmployeeId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
        } else {
          await DashboardCrDepartmentModel.updateOne({ iCrId: workLogs.iCrId, iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)), nNonBillableMinute: -(parseInt(workLogs?.nNonBillableMinute || 0)), nNonBillableCost: -(parseInt(workLogs?.nNonBillableCost || 0)) } })
          await DashboardCrIndicatorModel.updateOne({ iCrId: workLogs.iCrId, iProjectId: workLogs.iProjectId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)), nNonBillableMinute: -(parseInt(workLogs?.nNonBillableMinute || 0)), nNonBillableCost: -(parseInt(workLogs?.nNonBillableCost || 0)) } })
          await CrWiseEmployeeModel.updateOne({ iCrId: workLogs.iCrId, iProjectId: workLogs.iProjectId, iEmployeeId: workLogs.iEmployeeId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)), nNonBillableMinute: -(parseInt(workLogs?.nNonBillableMinute || 0)), nNonBillableCost: -(parseInt(workLogs?.nNonBillableCost || 0)) } })
          await ProjectWiseEmployeeModel.updateOne({ iProjectId: workLogs.iProjectId, iEmployeeId: workLogs.iEmployeeId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)), nNonBillableMinute: -(parseInt(workLogs?.nNonBillableMinute || 0)), nNonBillableCost: -(parseInt(workLogs?.nNonBillableCost || 0)) } })
        }
      } else {
        if (workLogs.iProjectId) {
          const projectType = await ProjectModel.findById({ _id: workLogs.iProjectId })
          console.log(projectType)

          if (projectType.eProjectType === 'Dedicated') {
            if (!workLogs.bIsNonBillable) {
              await DashboardProjectIndicatorModel.updateOne({ iProjectId: workLogs.iProjectId, eStatus: 'Y' }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
              await ProjectWiseEmployeeModel.updateOne({ iProjectId: workLogs.iProjectId, iEmployeeId: workLogs.iEmployeeId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
            } else {
              await DashboardProjectIndicatorModel.updateOne({ iProjectId: workLogs.iProjectId, eStatus: 'Y' }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)), nNonBillableMinute: -(parseInt(workLogs?.nNonBillableMinute || 0)), nNonBillableCost: -(parseInt(workLogs?.nNonBillableCost || 0)) } })
              await ProjectWiseEmployeeModel.updateOne({ iProjectId: workLogs.iProjectId, iEmployeeId: workLogs.iEmployeeId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)), nNonBillableMinute: -(parseInt(workLogs?.nNonBillableMinute || 0)), nNonBillableCost: -(parseInt(workLogs?.nNonBillableCost || 0)) } })
            }
            const data = await WorkLogsModel.findOneAndUpdate({ _id: req.params.id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdatedBy: req.employee._id }, { new: true })

            const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'WorkLogs', sService: 'deleteWorkLogs', eAction: 'Delete', oOldFields: data }
            await Logs.create(logs)
            return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].workLogs))
          } else {
            const projectDepartment = await DashboardProjectDepartmentModel.findOne({ iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId }).lean()
            if (!projectDepartment) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
            }
            if (!workLogs.bIsNonBillable) {
              await DashboardProjectDepartmentModel.updateOne({ iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId, eStatus: 'Y' }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
              await DashboardProjectIndicatorModel.updateOne({ iProjectId: workLogs.iProjectId, eStatus: 'Y' }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
              await ProjectWiseEmployeeModel.updateOne({ iProjectId: workLogs.iProjectId, iEmployeeId: workLogs.iEmployeeId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
            } else {
              await DashboardProjectDepartmentModel.updateOne({ iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId, eStatus: 'Y' }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)), nNonBillableMinute: -(parseInt(workLogs?.nNonBillableMinute || 0)), nNonBillableCost: -(parseInt(workLogs?.nNonBillableCost || 0)) } })
              await DashboardProjectIndicatorModel.updateOne({ iProjectId: workLogs.iProjectId, eStatus: 'Y' }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)), nNonBillableMinute: -(parseInt(workLogs?.nNonBillableMinute || 0)), nNonBillableCost: -(parseInt(workLogs?.nNonBillableCost || 0)) } })
              await ProjectWiseEmployeeModel.updateOne({ iProjectId: workLogs.iProjectId, iEmployeeId: workLogs.iEmployeeId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)), nNonBillableMinute: -(parseInt(workLogs?.nNonBillableMinute || 0)), nNonBillableCost: -(parseInt(workLogs?.nNonBillableCost || 0)) } })
            }
          }
        }
      }
      const data = await WorkLogsModel.findOneAndUpdate({ _id: req.params.id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdatedBy: req.employee._id }, { new: true })

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'WorkLogs', sService: 'deleteWorkLogs', eAction: 'Delete', oOldFields: data }
      await Logs.create(logs)
      // notificationsender(req, data._id, ' worklog is delete ', true, true, req.employee._id)
      return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].workLogs))
    } catch (error) {
      return catchError('WorkLogs.deleteWorkLogs', error, req, res)
    }
  }

  async deleteWorkLogsV2(req, res) {
    try {
      const workLogs = await WorkLogsModel.findOne({ _id: req.params.id })
      // console.log(workLogs)
      // console.log(req.employee._id)

      if (!workLogs) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].workLogs))
      }

      // check if worklog is created by logged in user

      if (workLogs.iEmployeeId.toString() !== req.employee._id.toString()) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_allowed_to_delete.replace('##', messages[req.userLanguage].workLogs))
      }

      // project
      const project = await ProjectModel.findOne({ _id: workLogs.iProjectId, eStatus: 'Y' }).lean()
      if (!project) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
      }

      if (project.eProjectType === 'Dedicated') {
        if (workLogs.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: workLogs.iProjectId,
            iEmployeeId: workLogs.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: -(+workLogs.nMinutes),
              nNonBillableCost: -((+workLogs.nMinutes) * workLogs.nClientCost),
              nOrgNonBillableMinute: -(+workLogs.nMinutes),
              nOrgNonBillableCost: -(((+workLogs.nMinutes) * workLogs.nOrgCost)),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -(((+workLogs.nMinutes) * workLogs.nOrgCost))
            }
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: workLogs.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -(((+workLogs.nMinutes) * workLogs.nOrgCost))
            }
          })
        } else {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: workLogs.iProjectId,
            iEmployeeId: workLogs.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: -(+workLogs.nMinutes),
              nRemainingCost: -((+workLogs.nMinutes) * workLogs.nClientCost),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -((+workLogs.nMinutes) * workLogs.nOrgCost)
            }
          })
          const a = await DashboardProjectIndicatorModel.updateOne({
            iProjectId: workLogs.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: -(+workLogs.nMinutes),
              nRemainingCost: -((+workLogs.nMinutes) * workLogs.nClientCost),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -((+workLogs.nMinutes) * workLogs.nOrgCost)
            }
          })
          console.log(a)

          // await ProjectModel.updateOne({
          //   iProjectId: req.body.iProjectId,
          //   eStatus: 'Y'
          // }, {
          //   sCost: ((+project?.sCost || 0) - (workLogs.nClientCost)).toString(),
          //   nTimeLineDays: +((+project?.nTimeLineDays || 0) - (+workLogs.nMinutes))
          // })
        }
      } else {
        if (workLogs.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: workLogs.iProjectId,
            iEmployeeId: workLogs.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: -(+workLogs.nMinutes),
              nNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost)),
              nOrgNonBillableMinute: -(+workLogs.nMinutes),
              nOrgNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost)),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost))
            }
          })

          await DashboardProjectDepartmentModel.updateOne({
            iProjectId: workLogs.iProjectId,
            iDepartmentId: workLogs.iDepartmentId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: -(+workLogs.nMinutes),
              nNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost))
            }
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: workLogs.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: -(+workLogs.nMinutes),
              nNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost)),
              nOrgNonBillableMinute: -(+workLogs.nMinutes),
              nOrgNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost)),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost))
            }
          })
        } else {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: workLogs.iProjectId,
            iEmployeeId: workLogs.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: -(+workLogs.nMinutes),
              nRemainingCost: -((+workLogs.nMinutes) * workLogs?.nOrgCost),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -((+workLogs.nMinutes) * workLogs?.nOrgCost)
            }
          })
          await DashboardProjectDepartmentModel.updateOne({
            iProjectId: workLogs.iProjectId,
            iDepartmentId: workLogs.iDepartmentId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: -(+workLogs.nMinutes),
              nRemainingCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost))
            }
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: workLogs.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: -(+workLogs.nMinutes),
              nRemainingCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost)),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost))
            }

          })
        }
      }

      const data = await WorkLogsModel.findOneAndUpdate({ _id: req.params.id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdatedBy: req.employee._id }, { new: true })

      return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].workLogs))
    } catch (error) {
      return catchError('WorkLogs.deleteWorkLogs', error, req, res)
    }
  }

  // worklogs we add and delete not update
  async updateWorkLogs(req, res) {
    try {
      const { id } = req.params
      req.body = pick(req.body, ['iProjectId', 'iEmployeeId', 'dTaskStartTime', 'dTaskEndTime', 'sTaskDetails', 'iCrId', 'nMinutes', 'aTaskTag'])

      const workLogs = await WorkLogsModel.findOne({ _id: id })

      if (!workLogs) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].workLogs))
      }

      if (req.body.iProjectId) {
        const project = await ProjectModel.findOne({ _id: req.body.iProjectId }).lean()
        console.log(project)
        if (!project) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
        }
      }

      let employee
      if (req.body.iEmployeeId) {
        employee = await EmployeeModel.findOne({ _id: req.body.iEmployeeId }).lean()
        console.log(employee)
        if (!employee) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        } else {
          req.body.iDepartmentId = employee.iDepartmentId
        }
      }

      if (req.body.dTaskStartTime && req.body.dTaskEndTime) {
        const startTime = new Date(req.body.dTaskStartTime)
        const endTime = new Date(req.body.dTaskEndTime)
        if (startTime < new Date() || endTime < new Date()) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].date_grater_then)
        }
        const diff = endTime.getTime() - startTime.getTime()
        console.log(diff)

        if (diff < 0) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid_date)
        }

        const minutes = (diff / (1000 * 60))

        if (minutes >= 24 * 60) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].date_less_then_24)
        }

        req.body.nMinutes = minutes
      }

      if (req.body.iCrId) {
        const cr = await CrModel.findOne({ _id: req.body.iCrId, iProjectId: req.body.iProjectId }).lean()
        console.log(cr)
        if (!cr) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].changeRequest))
        }
      }

      if (workLogs) {
        if (workLogs.iCrId && workLogs.iProjectId) {
          const crDepartment = await DashboardCrDepartmentModel.findOne({ iCrId: Object(workLogs.iCrId), iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId }).lean()
          if (!crDepartment) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].changeRequest))
          }
          await DashboardCrDepartmentModel.updateOne({ iCrId: workLogs.iCrId, iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
          await DashboardCrIndicatorModel.updateOne({ iCrId: workLogs.iCrId, iProjectId: workLogs.iProjectId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
        } else {
          if (workLogs.iProjectId) {
            const projectDepartment = await DashboardProjectDepartmentModel.findOne({ iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId }).lean()
            if (!projectDepartment) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
            }
            await DashboardProjectDepartmentModel.updateOne({ iProjectId: workLogs.iProjectId, iDepartmentId: workLogs.iDepartmentId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
            await DashboardProjectIndicatorModel.updateOne({ iProjectId: workLogs.iProjectId }, { $inc: { nRemainingMinute: (parseInt(-workLogs.nMinutes)), nRemainingCost: (parseInt(-workLogs.nCost)) } })
          }
        }
      }

      let worksLogsUpdate
      if (req.body.iProjectId && req.body.iCrId) {
        worksLogsUpdate = await WorkLogsModel.findOneAndUpdate({ _id: id }, {
          iProjectId: req.body.iProjectId,
          iCrId: req.body.iCrId,
          iEmployeeId: req.body,
          iDepartmentId: employee.iDepartmentId,
          dTaskStartTime: req.body.dTaskStartTime,
          dTaskEndTime: req.body.dTaskEndTime,
          nMinutes: req.body.nMinutes,
          sTaskDetails: req.body.sTaskDetails,
          eStatus: 'Y',
          eTaskTag: 'Development',
          iCreatedBy: workLogs.iCreatedBy,
          iLastUpdateBy: req.employee._id,
          eWorkLogsType: 'C',
          aTaskTag: req.body.aTaskTag
        }, { new: true })
      } else {
        worksLogsUpdate = await WorkLogsModel.findOneAndUpdate({ _id: id }, {
          iProjectId: req.body.iProjectId,
          iEmployeeId: req.body,
          iCrId: null,
          iDepartmentId: employee.iDepartmentId,
          dTaskStartTime: req.body.dTaskStartTime,
          dTaskEndTime: req.body.dTaskEndTime,
          nMinutes: req.body.nMinutes,
          sTaskDetails: req.body.sTaskDetails,
          eStatus: 'Y',
          eTaskTag: 'Development',
          iCreatedBy: workLogs.iCreatedBy,
          iLastUpdateBy: req.employee._id,
          eWorkLogsType: 'P',
          aTaskTag: req.body.aTaskTag
        }, { new: true })
      }

      if (worksLogsUpdate) {
        if (worksLogsUpdate.iCrId && worksLogsUpdate.iProjectId) {
          const crDepartment = await DashboardCrDepartmentModel.findOne({ _id: req.body.iCrId, iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }).lean()
          if (!crDepartment) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].changeRequest))
          }
          await DashboardCrDepartmentModel.updateOne({ _id: req.body.iCrId, iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: (Number((+req.body.nMinutes / 60).toFixed(2)) * parseInt(employee.nPaid)) } })
          await DashboardCrIndicatorModel.updateOne({ _id: req.body.iCrId, iProjectId: req.body.iProjectId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: (Number((+req.body.nMinutes / 60).toFixed(2)) * parseInt(employee.nPaid)) } })
        } else {
          if (worksLogsUpdate.iProjectId) {
            const projectDepartment = await DashboardProjectDepartmentModel.findOne({ iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }).lean()
            if (!projectDepartment) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
            }

            await DashboardProjectDepartmentModel.updateOne({ iProjectId: req.body.iProjectId, iDepartmentId: employee.iDepartmentId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: (Number((+req.body.nMinutes / 60).toFixed(2)) * parseInt(employee.nPaid)) } })
            await DashboardProjectIndicatorModel.updateOne({ iProjectId: req.body.iProjectId }, { $inc: { nRemainingMinute: req.body.nMinutes, nRemainingCost: (Number((+req.body.nMinutes / 60).toFixed(2)) * parseInt(employee.nPaid)) } })
          }
        }
      }
    } catch (error) {
      return catchError('WorkLogs.updateWorkLogs', error, req, res)
    }
  }

  async updateWorkLogsV2(req, res) {
    try {
      const { id } = req.params
      req.body = pick(req.body, ['iProjectId', 'iEmployeeId', 'dTaskStartTime', 'dTaskEndTime', 'sTaskDetails', 'iCrId', 'nMinutes', 'aTaskTag', 'bIsNonBillable'])

      req.body.iEmployeeId = req.employee._id.toString()

      const workLogs = await WorkLogsModel.findOne({ _id: id, eStatus: 'Y' })
      if (!workLogs) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].workLogs))

      console.log(req.body)

      console.log(req.body.iProjectId !== workLogs.iProjectId.toString())
      console.log(req.body.iProjectId)
      console.log(workLogs.iProjectId.toString())

      if (req.body.iProjectId !== workLogs.iProjectId.toString()) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].project_not_same.replace('##', messages[req.userLanguage].project))

      const project = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      if (req.body.iEmployeeId !== workLogs.iEmployeeId.toString()) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].employee_not_same.replace('##', messages[req.userLanguage].employee))

      const employee = await EmployeeModel.findOne({ _id: req.body.iEmployeeId, eStatus: 'Y' }).lean()
      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      if (req.body.dTaskStartTime && req.body.dTaskEndTime) {
        const startTime = new Date(req.body.dTaskStartTime)
        const endTime = new Date(req.body.dTaskEndTime)
        const diff = endTime.getTime() - startTime.getTime()
        if (diff < 0) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid_date)
        }
        // const nMinutes = (diff / (1000 * 60)).toFixed(1)
        if (req.body.nMinutes >= 24 * 60) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].date_less_then_24)
        }
        // req.body.nMinutes = nMinutes
      }

      if (project.eProjectType === 'Dedicated') {
        const query = {
          iProjectId: req.body.iProjectId,
          iEmployeeId: req.body.iEmployeeId,
          eStatus: 'Y'
        }

        const projectEmployeeExist = await ProjectWiseEmployeeModel.findOne(query).lean()

        if (!projectEmployeeExist) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        }

        if (workLogs.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: -(+workLogs.nMinutes),
              nNonBillableCost: -((+workLogs.nMinutes) * workLogs.nClientCost),
              nOrgNonBillableMinute: -(+workLogs.nMinutes),
              nOrgNonBillableCost: -(((+workLogs.nMinutes) * workLogs.nOrgCost)),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -(((+workLogs.nMinutes) * workLogs.nOrgCost))
            }
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -(((+workLogs.nMinutes) * workLogs.nOrgCost))
            }
          })
        }
        if (!workLogs.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: -(+workLogs.nMinutes),
              nRemainingCost: -((+workLogs.nMinutes) * workLogs.nClientCost),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -((+workLogs.nMinutes) * workLogs.nOrgCost)
            }
          })
          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: -(+workLogs.nMinutes),
              nRemainingCost: -((+workLogs.nMinutes) * workLogs.nClientCost),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -((+workLogs.nMinutes) * workLogs.nOrgCost)
            }
          })

          // await ProjectModel.updateOne({
          //   iProjectId: req.body.iProjectId,
          //   eStatus: 'Y'
          // }, {
          //   sCost: ((+project?.sCost || 0) - (((+workLogs.nMinutes) * workLogs.nClientCost))).toString(),
          //   nTimeLineDays: +((+project?.nTimeLineDays || 0) - (+workLogs.nMinutes))
          // })
        }

        if (req.body.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: +req.body.nMinutes,
              nNonBillableCost: (+req.body.nMinutes) * workLogs.nClientCost,
              nOrgNonBillableMinute: +req.body.nMinutes,
              nOrgNonBillableCost: (((+req.body.nMinutes) * workLogs.nOrgCost)),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: (((+req.body.nMinutes) * workLogs.nOrgCost))
            }
          })
          await WorkLogsModel.findByIdAndUpdate({ _id: id }, {
            dTaskStartTime: req.body.dTaskStartTime,
            dTaskEndTime: req.body.dTaskEndTime,
            nCost: (+req.body.nMinutes) * workLogs.nClientCost,
            nMinutes: +req.body.nMinutes,
            sTaskDetails: req.body.sTaskDetails,
            eStatus: 'Y',
            aTaskTag: req.body.aTaskTag,
            iLastUpdateBy: req.employee._id,
            eWorkLogsType: 'P',
            bIsNonBillable: req.body.bIsNonBillable,
            eProjectType: project.eProjectType
          })
          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * workLogs.nOrgCost))
            }
          })
        } else {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: +((+req.body.nMinutes) * workLogs.nClientCost),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * workLogs.nOrgCost))
            }
          })
          await WorkLogsModel.findByIdAndUpdate({ _id: id }, {
            dTaskStartTime: req.body.dTaskStartTime,
            dTaskEndTime: req.body.dTaskEndTime,
            nCost: (+req.body.nMinutes) * workLogs.nClientCost,
            nMinutes: +req.body.nMinutes,
            sTaskDetails: req.body.sTaskDetails,
            eStatus: 'Y',
            aTaskTag: req.body.aTaskTag,
            iLastUpdateBy: req.employee._id,
            eWorkLogsType: 'P',
            bIsNonBillable: req.body.bIsNonBillable,
            eProjectType: project.eProjectType
          })
          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: +((+req.body.nMinutes) * workLogs.nClientCost),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * workLogs.nOrgCost))
            }
          })
        }
      } else {
        const query = {
          iProjectId: req.body.iProjectId,
          iEmployeeId: req.body.iEmployeeId,
          eStatus: 'Y'
        }

        const projectEmployeeExist = await ProjectWiseEmployeeModel.findOne(query).lean()

        if (!projectEmployeeExist) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
        }

        if (workLogs.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: -(+workLogs.nMinutes),
              nNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost)),
              nOrgNonBillableMinute: -(+workLogs.nMinutes),
              nOrgNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost)),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost))
            }
          })
          await DashboardProjectDepartmentModel.updateOne({
            iProjectId: workLogs.iProjectId,
            iDepartmentId: workLogs.iDepartmentId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: -(+workLogs.nMinutes),
              nNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost))
            }
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: workLogs.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: -(+workLogs.nMinutes),
              nNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost)),
              nOrgNonBillableMinute: -(+workLogs.nMinutes),
              nOrgNonBillableCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost)),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost))
            }
          })
        }

        if (!workLogs.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: -(+workLogs.nMinutes),
              nRemainingCost: -((+workLogs.nMinutes) * workLogs?.nOrgCost),
              nOrgRemainingMinute: -(+workLogs.nMinutes),
              nOrgRemainingCost: -((+workLogs.nMinutes) * workLogs?.nOrgCost)
            }
          })
          await DashboardProjectDepartmentModel.updateOne({
            iProjectId: req.body.iProjectId,
            iDepartmentId: employee.iDepartmentId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: -(+workLogs.nMinutes),
              nRemainingCost: -(((+workLogs.nMinutes) * workLogs?.nOrgCost))
            }
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              $inc: {
                nRemainingMinute: -(+workLogs.nMinutes),
                nRemainingCost: -((+workLogs.nMinutes) * workLogs?.nOrgCost),
                nOrgRemainingMinute: -(+workLogs.nMinutes),
                nOrgRemainingCost: -((+workLogs.nMinutes) * workLogs?.nOrgCost)
              }
            }
          })
        }

        if (req.body.bIsNonBillable) {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: +req.body.nMinutes,
              nNonBillableCost: (((+req.body.nMinutes) * workLogs?.nOrgCost)),
              nOrgNonBillableMinute: +req.body.nMinutes,
              nOrgNonBillableCost: (((+req.body.nMinutes) * workLogs?.nOrgCost)),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: (((+req.body.nMinutes) * workLogs?.nOrgCost))
            }
          })

          await WorkLogsModel.findByIdAndUpdate({ _id: id }, {
            dTaskStartTime: req.body.dTaskStartTime,
            dTaskEndTime: req.body.dTaskEndTime,
            nCost: (+req.body.nMinutes) * workLogs.nOrgCost,
            nMinutes: +req.body.nMinutes,
            sTaskDetails: req.body.sTaskDetails,
            eStatus: 'Y',
            aTaskTag: req.body.aTaskTag,
            iLastUpdateBy: req.employee._id,
            eWorkLogsType: 'P',
            bIsNonBillable: req.body.bIsNonBillable,
            eProjectType: project.eProjectType
          })
          await DashboardProjectDepartmentModel.updateOne({
            iProjectId: req.body.iProjectId,
            iDepartmentId: employee.iDepartmentId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: +req.body.nMinutes,
              nNonBillableCost: +(((+req.body.nMinutes) * workLogs.nOrgCost))
            }
          })

          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nNonBillableMinute: +req.body.nMinutes,
              nNonBillableCost: +(((+req.body.nMinutes) * workLogs.nOrgCost)),
              nOrgNonBillableMinute: +req.body.nMinutes,
              nOrgNonBillableCost: +(((+req.body.nMinutes) * workLogs.nOrgCost)),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: +(((+req.body.nMinutes) * workLogs.nOrgCost))
            }
          }
          )
        } else {
          await ProjectWiseEmployeeModel.updateOne({
            iProjectId: req.body.iProjectId,
            iEmployeeId: req.body.iEmployeeId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: (+req.body.nMinutes) * workLogs?.nOrgCost,
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: (+req.body.nMinutes) * workLogs?.nOrgCost
            }
          })

          await WorkLogsModel.findByIdAndUpdate({ _id: id }, {
            dTaskStartTime: req.body.dTaskStartTime,
            dTaskEndTime: req.body.dTaskEndTime,
            nCost: (+req.body.nMinutes) * workLogs.nOrgCost,
            nMinutes: +req.body.nMinutes,
            sTaskDetails: req.body.sTaskDetails,
            eStatus: 'Y',
            aTaskTag: req.body.aTaskTag,
            iLastUpdateBy: req.employee._id,
            eWorkLogsType: 'P',
            bIsNonBillable: req.body.bIsNonBillable,
            eProjectType: project.eProjectType
          })
          await DashboardProjectDepartmentModel.updateOne({
            iProjectId: req.body.iProjectId,
            iDepartmentId: employee.iDepartmentId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: +(((+req.body.nMinutes) * workLogs.nOrgCost))
            }
          })
          await DashboardProjectIndicatorModel.updateOne({
            iProjectId: req.body.iProjectId,
            eStatus: 'Y'
          }, {
            $inc: {
              nRemainingMinute: +req.body.nMinutes,
              nRemainingCost: (((+req.body.nMinutes) * workLogs.nOrgCost)),
              nOrgRemainingMinute: +req.body.nMinutes,
              nOrgRemainingCost: (((+req.body.nMinutes) * workLogs.nOrgCost))
            }
          })
        }
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].workLogs))
    } catch (error) {
      return catchError('WorkLogs.updateWorkLogs', error, req, res)
    }
  }

  async addWorkLogsTags(req, res) {
    try {
      const { sName } = req.body

      const workLogsTag = await WorkLogTagsModel.findOne({ sName }).lean()

      if (workLogsTag) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogsTag))
      }

      const newWorkLogsTag = await WorkLogTagsModel.create({
        sName,
        iCreatedBy: req.employee._id,
        iLastUpdateBy: req.employee._id
      })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: newWorkLogsTag._id, eModule: 'WorkLogs Tags', sService: 'addWorkLogsTags', eAction: 'Create', oNewFields: newWorkLogsTag }
      await take.create(logs)
      // notificationsenderForWorkLogsTags(req, newWorkLogsTag.id, ' worklogs tag is create ', true, true, req.employee._id)

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].workLogsTag), newWorkLogsTag)
    } catch (error) {
      return catchError('WorkLogs.addWorkLogsTags', error, req, res)
    }
  }

  async getWorkLogsTags(req, res) {
    try {
      const { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const q = [{
        $match: { eStatus: 'Y' }
      }]

      if (search) {
        q.push({
          $match: {
            $or: [
              { sName: { $regex: search, $options: 'i' } }
            ]
          }
        })
      }
      const count_query = [...q]

      count_query.push({ $count: 'count' })

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, worklogstags] = await Promise.all([WorkLogTagsModel.aggregate(count_query), WorkLogTagsModel.aggregate(q)])
      if (req.path === '/DownloadExcel') {
        return worklogstags
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].workLogsTag), { worklogstags, count: count[0]?.count || 0 })
      }
    } catch (error) {
      return catchError('WorkLogs.getWorkLogsTags', error, req, res)
    }
  }

  async deleteWorkLogsTags(req, res) {
    try {
      const { id } = req.params

      const workLogsTag = await WorkLogTagsModel.findOne({ _id: id }).lean()
      if (!workLogsTag) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].workLogsTag))

      await WorkLogTagsModel.updateOne({ _id: id }, { eStatus: 'N', iLastUpdateBy: req.employee._id })

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: workLogsTag._id, eModule: 'WorkLogs Tags', sService: 'deleteWorkLogsTags', eAction: 'Delete', oOldFields: workLogsTag }
      await Logs.create(logs)
      // notificationsenderForWorkLogsTags(req, workLogsTag.id, ' worklogs tag is delete ', true, true, req.employee._id)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].workLogsTag))
    } catch (error) {
      return catchError('WorkLogs.deleteWorkLogsTags', error, req, res)
    }
  }

  async updateWorkLogsTags(req, res) {
    try {
      const { id } = req.params
      const { sName } = req.body

      const workLogsTag = await WorkLogTagsModel.findOne({ eStatus: 'Y', _id: { $ne: req.params.id }, sName }).lean()
      if (workLogsTag) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogsTag))

      const data = await WorkLogTagsModel.update({ _id: id }, { $set: { sName, iLastUpdateBy: req.employee._id } })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: id, eModule: 'WorkLogs Tags', sService: 'updateWorkLogsTags', eAction: 'Update', oNewFields: req.body, oOldFields: data }
      await take.create(logs)
      // notificationsenderForWorkLogsTags(req, id, ' worklogs tag is update ', true, true, req.employee._id)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].workLogsTag))
    } catch (error) {
      return catchError('WorkLogs.updateWorkLogsTags', error, req, res)
    }
  }

  async getWorkLogsById(req, res) {
    try {
      const { id } = req.params

      const q = [{
        $match: {
          eStatus: 'Y',
          _id: mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'projects',
          let: { iProjectId: '$iProjectId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$iProjectId'] } } },
            { $project: { sName: 1 } }
          ],
          as: 'project'
        }
      },

      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          sProjectName: '$project.sName',
          _id: 1,
          iProjectId: 1,
          iCrId: 1,
          iEmployeeId: 1,
          iDepartmentId: 1,
          dTaskStartTime: 1,
          dTaskEndTime: 1,
          nCost: 1,
          nMinutes: 1,
          sTaskDetails: 1,
          eStatus: 1,
          aTaskTag: 1,
          iCreatedBy: 1,
          eWorkLogsType: 1,
          dCreatedAt: 1,
          dUpdatedAt: 1,
          bIsNonBillable: 1
        }
      }
      ]

      const worklog = await WorkLogsModel.aggregate(q)

      if (!worklog) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].workLogs))
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].workLogs), { worklog: worklog[0] })
    } catch (error) {
      return catchError('WorkLogs.getWorkLogsById', error, req, res)
    }
  }

  async test(req, res) {
    try {
      const data = await EmployeeModel.find({ eStatus: 'Y' }).lean()
      const data1 = await EmployeeModel.find({ eStatus: 'Y' }).lean()
      console.log('data', data.length)
      console.log('data1', data1.length)
      const jobProfile = await JobProfileModel.find({ eStatus: 'Y' }).lean()
      console.log('jobProfile', jobProfile.length)
      const jobProfile1 = await JobProfileModel.find({ eStatus: 'Y' }).lean()
      console.log('jobProfile1', jobProfile1.length)
      const starttime = new Date()
      ok1(jobProfile1.length)
      const endtime = new Date()
      console.log('time', endtime - starttime)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].workLogs), { data, data1, jobProfile, jobProfile1 })
    } catch (error) {
      console.log(error)
    }
  }
}

async function ok1(a) {
  try {
    console.log('a', a)
    const project = await ProjectModel.find({ eStatus: 'Y' }).lean()
    const project1 = await ProjectModel.find({ eStatus: 'Y' }).lean()

    console.log(project.length, 'ok1 project')
    console.log(project1.length, 'ok1 project1')

    const dataaa = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    console.log(dataaa.length, 'ok1 employee')
  } catch (error) {
    console.log(error)
  }
}

module.exports = new WorkLogs()
