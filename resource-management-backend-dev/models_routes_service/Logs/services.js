/* eslint-disable camelcase */
const { status, messages } = require('../../helper/api.responses')
const Excel = require('exceljs')
const Logs = require('./model')
const config = require('../../config/config')
const s3 = require('../../helper/s3')
const { queuePush } = require('../../helper/redis')
const moment = require('moment')
const mongoose = require('mongoose')
const { ResourceManagementDB } = require('../../database/mongoose')
const OrganizationDetail = require('../organizationDetail/model')

const LogYear = require('./logs.model')
const Network = require('./network.model')
const LogOverViews = require('./logsOverview.model')
const OrganizationDetailModel = require('../organizationDetail/model')
// console.log('LogYear', LogYear)

const EmployeeModel = require('../Employee/model')

const { ObjectId } = mongoose.Types
// const postmark = require('postmark')

const ProjectWiseContractModel = require('../Project/projectwisecontract.model')
const ProjectModel = require('../Project/model')

const { catchError, SuccessResponseSender, ErrorResponseSender, formatBytes, contractNameFormate } = require('../../helper/utilities.services')
const logsOverviewModel = require('./logsOverview.model')

async function notificationsender(req, params, sBody, option, isRecorded, isNotify, iLastUpdateBy, url = '') {
  // try {
  //   const data = await JobProfileModel.findOne({ _id: params }).lean()
  //   const department = await DepartmentModel.find({
  //     eStatus: 'Y',
  //     bIsSystem: true,
  //     sKey: {
  //       $in: ['HR', 'ADMIN', 'BUSINESSANALYST', 'PRODUCTDEVELOPMENT', 'OPERATION', 'MANAGEMENT', 'MARKETING', 'SALES']
  //     }
  //   }, { _id: 1 }).lean()

  //   const jobProfile = await JobProfileModel.find({
  //     eStatus: 'Y',
  //     sPrefix: {
  //       $in: ['Superior', 'Head', 'Lead', 'Other', 'Manager']
  //     }
  //   }, { _id: 1 }).lean()

  //   const allEmployee = await EmployeeModel.find({
  //     eStatus: 'Y',
  //     $or: [
  //       { iDepartmentId: { $in: department.map((item) => item._id) } },
  //       { iJobProfileId: { $in: jobProfile.map((item) => item._id) } }
  //     ]
  //   }, {
  //     _id: 1,
  //     aJwtTokens: 1
  //   }).lean()

  //   const sPushToken = []
  //   const ids = []

  //   if (allEmployee.length > 0) {
  //     for (const employee of allEmployee) {
  //       if (ids.indexOf(employee._id) === -1) {
  //         ids.push(employee._id)
  //       }
  //       if (employee.aJwtTokens.length) {
  //         for (const pushtoken of employee.aJwtTokens) {
  //           if (pushtoken?.sPushToken && sPushToken.indexOf(pushtoken.sPushToken) === -1) {
  //             sPushToken.push(pushtoken.sPushToken)
  //           }
  //         }
  //       }
  //     }
  //   }

  //   const metadata = {
  //     iJobProfileId: data._id,
  //     sName: data.sName,
  //     iCreatedBy: data.iLastUpdateBy,
  //     sType: 'jobProfile',
  //     sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg'
  //   }
  //   const person = await EmployeeModel.findOne({ _id: data.iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()
  //   const putData = { sPushToken, sTitle: 'Resource Management', sBody: `${data.sName}${sBody}by ${person.sName}(${person.sEmpId})`, sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg', sType: 'jobProfile', metadata, aSenderId: ids }

  //   await queuePush('Project:Notification', putData)
  // } catch (error) {
  //   console.log(error)
  // }
  try {
    if (option === 'process') {
      const Employee = await EmployeeModel.findOne({ eStatus: 'Y', _id: params }, { _id: 1, aJwtTokens: 1 }).lean()
      const sPushToken = []
      const ids = []
      if (Employee) {
        if (ids.indexOf(Employee._id) === -1) {
          ids.push(Employee._id)
        }
        if (Employee.aJwtTokens.length) {
          for (const pushtoken of Employee.aJwtTokens) {
            if (pushtoken?.sPushToken && sPushToken.indexOf(pushtoken.sPushToken) === -1) {
              sPushToken.push(pushtoken.sPushToken)
            }
          }
        }
      }
      const metadata = {
        iEmployeeId: Employee._id,
        sName: Employee.sName,
        iCreatedBy: Employee.iLastUpdateBy,
        sType: 'Employee',
        sUrl: url,
        sLogo: Employee?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
        isRecorded: isRecorded === true ? 'Y' : 'N',
        isNotify: isNotify === true ? 'Y' : 'N'
      }
      const person = await EmployeeModel.findOne({ _id: Employee.iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()
      const putData = {
        sPushToken,
        sTitle: 'Resource Management',
        sBody: `${Employee.sName}'s${sBody}by ${person.sName || 'rms'}(${person.sEmpId})`,
        sLogo: Employee?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
        sType: 'jobProfile',
        metadata,
        sUrl: url,
        aSenderId: ids,
        isRecorded: isRecorded === true ? 'Y' : 'N',
        isNotify: isNotify === true ? 'Y' : 'N'
      }

      await queuePush('Project:Notification', putData)
    }
    if (option === 'completed') {
      const Employee = await EmployeeModel.findOne({ eStatus: 'Y', _id: params }, { _id: 1, aJwtTokens: 1 }).lean()
      const sPushToken = []
      const ids = []
      if (Employee) {
        if (ids.indexOf(Employee._id) === -1) {
          ids.push(Employee._id)
        }
        if (Employee.aJwtTokens.length) {
          for (const pushtoken of Employee.aJwtTokens) {
            if (pushtoken?.sPushToken && sPushToken.indexOf(pushtoken.sPushToken) === -1) {
              sPushToken.push(pushtoken.sPushToken)
            }
          }
        }
      }
      const metadata = {
        iEmployeeId: Employee._id,
        sName: Employee.sName,
        iCreatedBy: Employee.iLastUpdateBy,
        sType: 'Employee',
        sUrl: url,
        sLogo: Employee?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
        isRecorded: isRecorded === true ? 'Y' : 'N',
        isNotify: isNotify === true ? 'Y' : 'N'
      }
      const person = await EmployeeModel.findOne({ _id: Employee.iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()
      const putData = {
        sPushToken,
        sTitle: 'Resource Management',
        sBody,
        sLogo: Employee?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
        sType: 'jobProfile',
        metadata,
        sUrl: url,
        aSenderId: ids,
        isRecorded: isRecorded === true ? 'Y' : 'N',
        isNotify: isNotify === true ? 'Y' : 'N'
      }

      await queuePush('Project:Notification', putData)
    }
  } catch (error) {
    console.log(error)
  }
}

class EmployeeLogs {
  // async sendMailPostmark(req, res) {
  //   try {
  //     const client = new postmark.ServerClient('6971ac56-118b-4fac-9ed1-f7f72de9741c')

  //     const send = await client.sendEmail({
  //       From: 'pranav.kakadiya@yudiz.com',
  //       To: 'kakadiyapranav111@gmail.com',
  //       Subject: 'Test',
  //       TextBody: 'Test'
  //     })

  //     return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].logs), send)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  async LogsDetails(req, res) {
    try {
      const { page = 0, limit = 5, search = '', eAction, eType, eModule, iSearchID, iUserId, sort = 'dCreatedAt', order = 'Desc', iJobProfileId, iDepartmentId, iRoleId, dStartAt, dEndAt } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1

      const q = [{
        $match: {
          eStatus: 'Y'
        }
      }]
      if (dStartAt?.trim() !== '' && dStartAt?.trim() !== null && dStartAt?.trim() !== undefined && dEndAt?.trim() !== '' && dEndAt?.trim() !== null && dEndAt?.trim() !== undefined) {
        const result = moment(dStartAt, 'YYYY-MM-DD', true).isValid()
        const result1 = moment(dEndAt, 'YYYY-MM-DD', true).isValid()
        if (result && result1) {
          const start = moment(dStartAt, 'YYYY-MM-DD').startOf('day')
          const end = moment(dEndAt, 'YYYY-MM-DD').endOf('day')
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
      if (search) {
        q.push({
          $match: {
            $or: [
              { eModule: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { sService: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { eAction: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { sEmpId: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { sJobProfile: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { sDepartment: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            ]
          }
        })
      }
      if (eAction) {
        q.push({ $match: { eAction } })
      }
      if (iSearchID) {
        q.push({ $match: { iID: iSearchID } })
      }
      if (eModule) { q.push({ $match: { eModule } }) }
      if (iUserId) {
        q.push({
          $match: {
            'eActionBy.iId': ObjectId(iUserId)
          }
        })
      }
      if (eType) {
        q.push({
          $match: {
            'eActionBy.eType': eType
          }
        })
      }
      if (iJobProfileId) {
        q.push({
          $match: {
            iJobProfileId
          }
        })
      }
      if (iDepartmentId) {
        q.push({
          $match: {
            iDepartmentId
          }
        })
      }

      if (iRoleId) {
        q.push({
          $match: {
            aRole: {
              $elemMatch: {
                iRoleId: ObjectId(iRoleId)
              }
            }
          }
        })
      }
      q.push({
        $project: {
          _id: 1,
          iId: 1,
          eActionBy: 1,
          eModule: 1,
          sService: 1,
          eAction: 1,
          aRole: { $ifNull: ['$aRole', [{ sName: 'Unknown', sKey: 'UNKNOWN', iRoleId: '3333333333333333333333cc' }]] },
          dCreatedAt: 1,
          sName: { $ifNull: ['$sName', 'unknown'] },
          sEmail: { $ifNull: ['$sEmail', 'unknown999@gmail.com'] },
          sEmpId: { $ifNull: ['$sEmpId', '0000'] },
          sDepartment: { $ifNull: ['$sDepartment', 'unknownab'] },
          sJobProfile: { $ifNull: ['$sJobProfile', 'unknowncd'] },
          iDepartmentId: { $ifNull: ['$iDepartmentId', '1111111111111111111111aa'] },
          iJobProfileId: { $ifNull: ['$iJobProfileId', '2222222222222222222222bb'] }
        }
      })

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      const sorting = { [sort]: orderBy }
      q.push({ $sort: sorting })

      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [logs, logsCount] = await Promise.all([Logs.aggregate(q, { allowDiskUse: true }), Logs.aggregate(count_query, { allowDiskUse: true })])

      // if (!q.length) {
      //   console.log('no query')
      //   try {
      //     [logs, logsCount] = await Promise.all([
      //       Logs.aggregate([
      //         {
      //           $skip: Number(page)
      //         },
      //         {
      //           $limit: Number(limit)
      //         }
      //       ], {
      //         allowDiskUse: true
      //       }),
      //       Logs.countDocuments()])
      //   } catch (error) {
      //     console.log(error)
      //   }
      // } else {
      //   [logs, logsCount] = await Promise.all([
      //     Logs.find({ $and: [...q] }, { oOldFields: 0, oNewFields: 0 }).sort(sorting).skip(Number(page)).limit(Number(limit)).allowDiskUse(),
      //     Logs.countDocuments({ $and: [...q] }).allowDiskUse()])
      // }

      if (req.path === '/DownloadExcel') {
        return logs
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].interview), { logs, count: logsCount })
      }
    } catch (error) {
      return catchError('EmployeeLogs.employeeLogsDetails', error, req, res)
    }
  }

  async updateProjectContract(req, res) {
    try {
      const { aContract, iContractGlobalId = undefined, dContractStartDate, dContractEndDate } = req.body
      if (req.body.flag === 3) {
        const projectExist = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()

        if (!projectExist) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

        let flag = {
          3: 'Y'
        }

        flag = { ...projectExist.flag, ...flag }

        if (iContractGlobalId) {
          const ProjectGlobalData = await ProjectWiseContractModel.findOne({ _id: iContractGlobalId, eStatus: 'Y' }).lean()

          if (!ProjectGlobalData) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].contract))

          const aProjectWiseContract = ProjectGlobalData.aContract.map(contract => contract.sContract)

          const aProjectBaseContract = req.body.aContract.map(contract => contract.sContract)

          const aProjectBaseContractToDelete = aProjectWiseContract.filter(contract => !aProjectBaseContract.includes(contract))

          const aProjectBaseContractToCreate = aProjectBaseContract.filter(contract => !aProjectWiseContract.includes(contract))

          await Promise.all(aProjectBaseContractToDelete.map(async (contract) => {
            return ProjectWiseContractModel.updateOne({ _id: iContractGlobalId, eStatus: 'Y' }
              , {
                $pull: { aContract: { sContract: contract } },
                iLastUpdateBy: req.employee._id,
                dContractStartDate: projectExist.eProjectType === 'Fixed' ? projectExist.dStartDate : dContractStartDate,
                dContractEndDate: projectExist.eProjectType === 'Fixed' ? projectExist.dEndDate : dContractEndDate
              })
          }))
          const objects = []

          for (const k in aProjectBaseContractToDelete) {
            objects.push({ Key: aProjectBaseContractToDelete[k] })
          }

          if (objects.length > 0) {
            const deleteParams = {
              Bucket: config.S3_BUCKET_NAME,
              Delete: {
                Objects: objects,
                Quiet: false
              }
            }
            await s3.deleteObjectsFromS3(deleteParams)
          }

          await Promise.all(aProjectBaseContractToCreate.map(async (contract) => {
            const getparams = {
              Bucket: config.S3_BUCKET_NAME,
              Key: contract
            }
            const data = await s3.getObjectDetails(getparams)

            data.sContentLength = formatBytes(data.ContentLength)

            return ProjectWiseContractModel.updateOne({ _id: iContractGlobalId, eStatus: 'Y' }, {
              $push: {
                aContract: {
                  sContract: contract,
                  sContentType: data.ContentType,
                  sContentLength: data.sContentLength,
                  dLastModified: data.LastModified,
                  sName: contractNameFormate(contract),
                  iCreatedBy: req.employee._id,
                  iLastUpdateBy: req.employee._id,
                  dContractStartDate: projectExist.eProjectType === 'Fixed' ? projectExist.dStartDate : dContractStartDate,
                  dContractEndDate: projectExist.eProjectType === 'Fixed' ? projectExist.dEndDate : dContractEndDate
                }
              }
            })
          }))

          const project = await ProjectModel.findByIdAndUpdate(req.body.iProjectId, { flag, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id })

          let take = `Logs${new Date().getFullYear()}`

          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: project._id, eModule: 'Project', sService: 'addProjectV2', eAction: 'Update', oNewFields: project, oOldFields: projectExist }
          await take.create(logs)
          // notificationsender(req, projectExist._id, ' project update ', true, true)
          return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].project), { projectId: project._id, eProjectType: project.eProjectType, flag })
        }
        if (iContractGlobalId === undefined || iContractGlobalId === null) {
          const contract = []

          for (const contractFile of req.body.aContract) {
            const getparams = {
              Bucket: config.S3_BUCKET_NAME,
              Key: contractFile.sContract
            }
            let data
            try {
              data = await s3.getObjectDetails(getparams)
            } catch (error) {
              console.log('ERROR', error)
              return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].error_with.replace('##', messages[req.userLanguage].Contract))
            }

            data.sContentLength = formatBytes(data.ContentLength)
            contract.push({
              sContract: contractFile.sContract,
              sContentType: data.ContentType,
              sContentLength: data.sContentLength,
              dLastModified: data.LastModified,
              sName: contractNameFormate(contractFile.sContract),
              iCreatedBy: req.employee._id,
              iLastUpdateBy: req.employee._id,
              eStatus: 'Y'
            })
          }

          // create project wise contract
          await ProjectWiseContractModel.create({
            iProjectId: req.body.iProjectId,
            aContract: contract,
            eStatus: 'Y',
            dContractStartDate: projectExist.eProjectType === 'Fixed' ? projectExist.dStartDate : dContractStartDate,
            dContractEndDate: projectExist.eProjectType === 'Fixed' ? projectExist.dEndDate : dContractEndDate,
            eProjectType: projectExist.eProjectType,
            iLastUpdateBy: req.employee._id
          })
          const project = await ProjectModel.findByIdAndUpdate(req.body.iProjectId, { flag, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id })
          let take = `Logs${new Date().getFullYear()}`

          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: project._id, eModule: 'Project', sService: 'addProjectV2', eAction: 'Update', oNewFields: project, oOldFields: projectExist }
          await take.create(logs)
          // notificationsender(req, projectExist._id, ' project update ', true, true)
          return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].project), { projectId: project._id, eProjectType: project.eProjectType, flag })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async ProjectFetch(req, res) {
    try {

    } catch (error) {
      console.log(error)
    }
  }

  async DownloadExcel(req, res) {
    try {
      const { sModule, requiredFields = [] } = req.body
      const module = sModule
      const date = moment().format('DD-MM-YYYY')
      const timestamp = Date.now()
      const model = {
        Logs: 'LogsDetails',
        Employee: 'EmployeeDetails',
        Department: 'getDepartments',
        Interview: 'interviewSearch',
        JobProfile: 'getJobProfiles',
        Project: 'getProjects',
        ProjectTag: 'getProjectTags',
        Skill: 'getSkills',
        Technology: 'search',
        Client: 'getClients',
        WorkLogs: 'getWorkLogs',
        ChangeRequest: 'getChangeRequest',
        DashBoard: 'projectIndicator'
      }

      if (!(module in model)) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].module))
      }

      if (requiredFields.length === 0) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].at_least_one_field_require)
      }

      for (const key in req.body.query) {
        if (req.body.query[key] === null || req.body.query[key] === undefined || req.body.query[key] === '') {
          delete req.body.query[key]
        }
      }

      const maxFields = {
        Technology: {
          Name: 'sName'
        },
        Project: {
          Name: 'sName',
          ProjectType: 'eProjectType',
          client: 'client',
          projecttag: 'projecttag',
          technology: 'technology',
          ProjectStatus: 'eProjectStatus',
          EndDate: 'dEndDate'
        },
        Skill: {
          Name: 'sName'
        },
        JobProfile: {
          Name: 'sName'
        },
        ProjectTag: {
          Name: 'sName'
        },
        Department: {
          Name: 'sName'
        },
        Client: {
          Name: 'sName',
          Email: 'sEmail',
          Country: 'sCountry'
        },
        Employee: {
          Name: 'sName',
          Department: 'sDepartment',
          Experience: 'nExperience',
          AvailabilityHours: 'nAvailabilityHours',
          Project: 'project',
          DepartmentId: 'iDepartmentId',
          Grade: 'eGrade',
          AvailabilityStatus: 'eAvailabilityStatus'
        },
        WorkLogs: {
          ProjectName: 'sProjectName',
          EmployeeName: 'sEmployeeName',
          WorkLogsType: 'eWorkLogsType',
          TaskTag: 'aTaskTag',
          CreatedAt: 'dCreatedAt',
          Minutes: 'nMinutes',
          LoggedInUser: 'isLoggedInUser'
        },
        ChangeRequest: {
          Name: 'sName',
          ProjectName: 'sProjectName',
          TimeLineDays: 'nTimeLineDays',
          CrStatus: 'eCrStatus'
        },
        DashBoard: {
          Name: 'sName',
          ProjectType: 'eProjectType',
          ProjectStatus: 'eProjectStatus',
          ProjectTechnologies: 'projectTechnologies',
          Cost: 'sCost',
          TimeLineDays: 'nTimeLineDays',
          StartDate: 'dStartDate',
          EndDate: 'dEndDate',
          Symbol: 'sSymbol',
          CurrencyName: 'sCurrencyName',
          projectIndicator_RemainingMinute: 'projectIndicator_nRemainingMinute',
          projectIndicator_RemainingCost: 'projectIndicator_nRemainingCost',
          projectIndicator_NonBillableMinute: 'projectIndicator_nNonBillableMinute',
          projectIndicator_NonBillableCost: 'projectIndicator_nNonBillableCost',
          TotalCr: 'total_cr',
          cr_total_RemainingMinute: 'cr_total_nRemainingMinute',
          cr_total_RemainingCost: 'cr_total_nRemainingCost',
          cr_total_NonBillableMinute: 'cr_total_nNonBillableMinute',
          cr_total_NonBillableCost: 'cr_total_nNonBillableCost',
          OnlyCr: 'only_cr'
        },
        Logs: {
          Name: 'sName',
          Email: 'sEmail',
          Department: 'sDepartment',
          JobProfile: 'sJobProfile',
          Module: 'eModule',
          Service: 'sService',
          Action: 'eAction',
          Role: 'aRole',
          CreatedAt: 'dCreatedAt',
          EmpId: 'sEmpId'
        }
      }

      if (module === 'DashBoard') {
        // requiredFields = maxFields[module]
        if (requiredFields.includes('OnlyCr')) {
          requiredFields.push(
            'cr_RemainingMinute',
            'cr_RemainingCost',
            'cr_NonBillableMinute',
            'cr_NonBillableCost',
            'cr_TimeLineDays',
            'cr_Cost',
            'cr_Minutes',
            'cr_Name'
          )

          maxFields[module] = {
            ...maxFields[module],
            cr_RemainingMinute: 'cr_nRemainingMinute',
            cr_RemainingCost: 'cr_nRemainingCost',
            cr_NonBillableMinute: 'cr_nNonBillableMinute',
            cr_NonBillableCost: 'cr_nNonBillableCost',
            cr_TimeLineDays: 'cr_nTimeLineDays',
            cr_Cost: 'cr_nCost',
            cr_Minutes: 'cr_nMinutes',
            cr_Name: 'cr_sName'
          }

          // maxFields[module].push(['cr_nRemainingMinute', 'cr_nRemainingCost', 'cr_nNonBillableMinute', 'cr_nNonBillableCost'])
        }
      }

      if (requiredFields.length) {
        if (requiredFields.length > Object.keys(maxFields[module]).length) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].fields))
        }

        for (const field of requiredFields) {
          if (!Object.keys(maxFields[module]).includes(field)) {
            return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].fields))
          }
        }

        // convert requiredFields to object
      }

      const requiredFieldsObj = {}
      for (const field of requiredFields) {
        requiredFieldsObj[field] = maxFields[module][field]
      }

      // console.log('requiredFieldsObj', Object.entries(requiredFieldsObj))

      // check also valid fields in requiredFields
      await queuePush('excelProcess', { module, requiredFields: requiredFieldsObj, date, timestamp, query: req.body.query, params: req.body.params, employee: req.employee, path: req.path })

      // const service = require(`../${module}/services`)
      // console.log('service', service)

      // const getService = model[module]

      // const getData = service[`${getService}`]

      // req.query = req.body.query
      // req.params = req.body.params
      // const start = performance.now()
      // const data1 = await getData(req, res)
      // const stop = performance.now()
      // const inSeconds = (stop - start) / 1000
      // const rounded = Number(inSeconds).toFixed(3)
      // console.log(`businessLogic: ${rounded}s`)
      // const workbook = new Excel.Workbook()
      // const worksheet = workbook.addWorksheet(`${module}`)
      // const j = []
      // for (let i = 0; i < requiredFields.length; i++) {
      //   j.push({ header: requiredFields[i], key: requiredFields[i], width: 50 })
      // }
      // worksheet.columns = j
      // worksheet.columns.forEach(column => {
      //   column.width = column.header.length < 12 ? 12 : column.header.length
      // })
      // worksheet.getRow(1).font = { bold: true }

      // const chunkSize = 1
      // const chunks = Math.ceil(data1.length / chunkSize)
      // let data2
      // const start1 = performance.now()

      // for (let i = 0; i < chunks; i++) {
      //   console.log('i---------------------------------------------------------------------------------------------------------', i)

      //   const start = i * chunkSize
      //   const end = (i + 1) * chunkSize
      //   const chunk = data1.slice(start, end)
      //   console.log('chunk', chunk)
      //   worksheet.addRows(chunk)

      //   const a = await workbook.xlsx.writeBuffer()
      //   console.log('a', a)

      //   // get size ofvariable
      //   const bytes = Buffer.byteLength(a)
      //   console.log('size', bytes)

      //   const decimals = 2; const k = 1024

      //   if (bytes === 0) return '0 Bytes'
      //   const dm = decimals < 0 ? 0 : decimals
      //   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      //   const i2 = Math.floor(Math.log(bytes) / Math.log(k))
      //   console.log(parseFloat((bytes / Math.pow(k, i2)).toFixed(dm)) + ' ' + sizes[i2])

      //   // convert to mb

      //   const params = {
      //     Bucket: config.S3_BUCKET_NAME,
      //     Key: `excel/${module}/${date}/${timestamp + '_' + req.employee._id + '_' + module}.xlsx`,
      //     Body: await workbook.xlsx.writeBuffer(),
      //     ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      //   }
      //   data2 = await s3.uploadFileToS3(params)
      // }

      // // generate chunk based file
      // // console.log('data2', chunks)
      // // for (let i = 0; i < chunks; i++) {
      // //   const workbook = new Excel.Workbook()
      // //   const worksheet = workbook.addWorksheet(`${module}`)
      // //   const j = []
      // //   for (let i = 0; i < requiredFields.length; i++) {
      // //     j.push({ header: requiredFields[i], key: requiredFields[i], width: 50 })
      // //   }
      // //   worksheet.columns = j
      // //   worksheet.columns.forEach(column => {
      // //     column.width = column.header.length < 12 ? 12 : column.header.length
      // //   })
      // //   worksheet.getRow(1).font = { bold: true }

      // //   const start = i * chunkSize
      // //   const end = (i + 1) * chunkSize
      // //   const chunk = data1.slice(start, end)
      // //   console.log('chunk', chunk)
      // //   worksheet.addRows(chunk)

      // //   console.log('workbook', await workbook.xlsx.writeBuffer())

      // //   await workbook.xlsx.writeFile(`./${timestamp + '_' + req.employee._id + '_' + module + '_' + i}.xlsx`)
      // // }

      // const stop1 = performance.now()
      // const inSeconds1 = (stop1 - start1) / 1000
      // const rounded1 = Number(inSeconds1).toFixed(3)
      // console.log(`businessLogic: ${rounded1}s`)

      // await queuePush('file_excel1', { file: data2.Key, NAME: req.employee.sName, employee: req.employee._id, email: 'pranav.kakadiya@yudiz.com', flag: 0, aJwtTokens: req.employee.aJwtTokens, type: 'Excel-Data', Key: data2.Key })

      // const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, eModule: 'EmployeeLogs', sService: 'DownloadExcel', eAction: 'Create' }
      // await Logs.create(logs)

      // await notificationsender(req, req.employee._id, ' excel is processing ', 'process', true, true, req.employee._id)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].you_will_get_in_email.replace('##', messages[req.userLanguage].excel))
    } catch (error) {
      console.log(error)
      return catchError('EmployeeLogs.DownloadExcel', error, req, res)
    }
  }

  async excelProcess(data) {
    try {
      const model = {
        Logs: 'LogsDetails',
        Employee: 'EmployeeDetails',
        Department: 'getDepartments',
        Interview: 'interviewSearch',
        JobProfile: 'getJobProfiles',
        Project: 'getProjects',
        ProjectTag: 'getProjectTags',
        Skill: 'getSkills',
        Technology: 'search',
        Client: 'getClients',
        WorkLogs: 'getWorkLogs',
        ChangeRequest: 'getChangeRequest',
        DashBoard: 'projectIndicator'
      }

      const service = require(`../${data.module}/services`)

      const getService = model[data.module]

      const getData = service[`${getService}`]
      const req = {}
      const res = {}
      req.employee = data.employee
      req.query = data.query
      req.params = data.params
      req.path = data.path
      const start = performance.now()
      const data1 = await getData(req, res)
      const stop = performance.now()
      const inSeconds = (stop - start) / 1000
      const rounded = Number(inSeconds).toFixed(3)
      // console.log(`businessLogic: ${rounded}s`)
      const workbook = new Excel.Workbook()
      const worksheet = workbook.addWorksheet(`${data.module}`)
      const j = []
      for (let i = 0; i < Object.entries(data.requiredFields).length; i++) {
        j.push({
          header: Object.entries(data.requiredFields)[i][0],
          key: Object.entries(data.requiredFields)[i][1],
          width: 50
        })
      }
      worksheet.columns = j
      worksheet.columns.forEach(column => {
        column.width = column.header.length < 12 ? 12 : column.header.length
      })
      worksheet.getRow(1).font = { bold: true }

      const chunkSize = 1000
      const chunks = Math.ceil(data1.length / chunkSize)
      let data2
      const start1 = performance.now()

      let bytes = 0

      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize
        const end = (i + 1) * chunkSize
        let chunk = data1.slice(start, end)

        // console.log('chunk', chunk)

        if (data.module === 'Project') {
          chunk = chunk.map((item) => {
            let clientName = ''
            let technologyName = ''
            let projecttagName = ''
            if (item.client.length !== 0 && Object.values(data.requiredFields).includes('client')) {
              item.client.forEach((client, index) => {
                clientName += client.sClientName
                if (index !== item.client.length - 1) {
                  clientName += ', '
                }
              })
            }

            if (item.technology.length !== 0 && Object.values(data.requiredFields).includes('technology')) {
              item.technology.forEach((technology, index) => {
                technologyName += technology.sTechnologyName
                if (index !== item.technology.length - 1) {
                  technologyName += ', '
                }
              })
            }

            if (item.projecttag.length !== 0 && Object.values(data.requiredFields).includes('projecttag')) {
              item.projecttag.forEach((projecttag, index) => {
                projecttagName += projecttag.sProjectTagName
                if (index !== item.projecttag.length - 1) {
                  projecttagName += ','
                }
              })
            }

            return { ...item, client: clientName, technology: technologyName, projecttag: projecttagName }
          })
        }

        if (data.module === 'Employee') {
          chunk = chunk.map((item) => {
            let DepartmentName = ''
            if (Object.values(data.requiredFields).includes('sDepartment')) {
              DepartmentName = item.sDepartment.sName
            }
            return { ...item, sDepartment: DepartmentName }
          })
        }

        if (data.module === 'WorkLogs') {
          chunk = chunk.map((item) => {
            let aTaskTagName = ''

            if (item.aTaskTag?.length !== 0 && Object.values(data.requiredFields).includes('aTaskTag')) {
              item.aTaskTag.forEach((aTaskTag, index) => {
                aTaskTagName += aTaskTag.sName
                if (index !== item.aTaskTag.length - 1) {
                  aTaskTagName += ','
                }
              })
            }

            if (item.eWorkLogsType === 'P' && Object.values(data.requiredFields).includes('eWorkLogsType')) item.eWorkLogsType = 'Project'

            if (item?.nMinutes && Object.values(data.requiredFields).includes('nMinutes')) {
              let hours = 0
              let days = 0
              let minutes = 0
              if (!item?.nMinutes) return `${days ? days + 'd' : ''} ${hours}h ${minutes}m`
              days = parseInt(item?.nMinutes / 1440)
              hours = parseInt((item?.nMinutes % 1440) / 60)
              minutes = parseInt((item?.nMinutes % 1440) % 60)

              item.nMinutes = `${days ? days + 'd' : ''} ${hours}h ${minutes}m`
            }
            // if (item.eWorkLogsType == 'CR') item.eWorkLogsType = 'Change Request'

            return { ...item, aTaskTag: aTaskTagName }
          })
        }

        if (data.module === 'DashBoard' && !Object.values(data.requiredFields).includes('only_cr')) {
          chunk = chunk.map((item) => {
            let nRemainingMinute = 0
            let nRemainingCost = 0
            let nNonBillableCost = 0
            let nNonBillableMinute = 0
            let cr_total_nNonBillableCost = 0
            let cr_total_nNonBillableMinute = 0
            let cr_total_nRemainingCost = 0
            let cr_total_nRemainingMinute = 0
            let total_cr = 0
            let technologyName = ''
            if (item.projectIndicator?.nRemainingMinute && Object.values(data.requiredFields).includes('nRemainingMinute')) {
              nRemainingMinute = item.projectIndicator.nRemainingMinute
            }
            if (item.projectIndicator?.nRemainingCost && Object.values(data.requiredFields).includes('nRemainingCost')) {
              nRemainingCost = item.projectIndicator.nRemainingCost
            }
            if (item.projectIndicator?.nNonBillableCost && Object.values(data.requiredFields).includes('nNonBillableCost')) {
              nNonBillableCost = item.projectIndicator.nNonBillableCost
            }
            if (item.projectIndicator?.nNonBillableMinute && Object.values(data.requiredFields).includes('nNonBillableMinute')) {
              nNonBillableMinute = item.projectIndicator.nNonBillableMinute
            }

            if (item.crIndicators?.length !== 0) {
              item.crIndicators.forEach((crIndicators) => {
                if (Object.values(data.requiredFields).includes('total_cr')) total_cr += 1
                if (Object.values(data.requiredFields).includes('cr_total_nRemainingMinute')) cr_total_nRemainingMinute += crIndicators.nRemainingMinute
                if (Object.values(data.requiredFields).includes('cr_total_nRemainingCost')) cr_total_nRemainingCost += crIndicators.nRemainingCost
                if (Object.values(data.requiredFields).includes('cr_total_nNonBillableCost')) cr_total_nNonBillableCost += crIndicators.nNonBillableCost
                if (Object.values(data.requiredFields).includes('cr_total_nNonBillableMinute')) cr_total_nNonBillableMinute += crIndicators.nNonBillableMinute

                // cr_total_nNonBillableCost += crIndicators.nNonBillableCost
                // cr_total_nNonBillableMinute += crIndicators.nNonBillableMinute
                // cr_total_nRemainingCost += crIndicators.nRemainingCost
                // cr_total_nRemainingMinute += crIndicators.nRemainingMinute
              })
            }

            if (item?.projectTechnologies?.length !== 0 && Object.values(data.requiredFields).includes('projectTechnologies')) {
              item.projectTechnologies.forEach((technology, index) => {
                technologyName += technology.sName
                if (index !== item.projectTechnologies.length - 1) {
                  technologyName += ', '
                }
              })
            }

            // item.projectIndicator = {
            //   ...item.projectIndicator,
            //   nRemainingMinute,
            //   nRemainingCost,
            //   nNonBillableCost,
            //   nNonBillableMinute
            // }

            return {
              ...item,
              projectIndicator_nRemainingMinute: nRemainingMinute,
              projectIndicator_nRemainingCost: nRemainingCost,
              projectIndicator_nNonBillableMinute: nNonBillableMinute,
              projectIndicator_nNonBillableCost: nNonBillableCost,
              total_cr,
              cr_total_nRemainingCost,
              cr_total_nRemainingMinute,
              cr_total_nNonBillableCost,
              cr_total_nNonBillableMinute,
              projectTechnologies: technologyName,
              only_cr: false
            }
          })
        }
        if (data.module === 'DashBoard' && Object.values(data.requiredFields).includes('only_cr')) {
          // console.log('---------------------------------------- only cr ----------------------------------------')

          const total = []

          // let nRemainingMinute = 0
          // let nRemainingCost = 0
          // let nNonBillableCost = 0
          // let nNonBillableMinute = 0
          // let cr_total_nNonBillableCost = 0
          // let cr_total_nNonBillableMinute = 0
          // let cr_total_nRemainingCost = 0
          // let cr_total_nRemainingMinute = 0
          // let total_cr = 0
          // let technologyName = ''
          // const crnRemainingMinute = 0
          // const crnRemainingCost = 0
          // const crnNonBillableCost = 0
          // const crnNonBillableMinute = 0

          chunk = chunk.map((item) => {
            let nRemainingMinute = 0
            let nRemainingCost = 0
            let nNonBillableCost = 0
            let nNonBillableMinute = 0
            let cr_total_nNonBillableCost = 0
            let cr_total_nNonBillableMinute = 0
            let cr_total_nRemainingCost = 0
            let cr_total_nRemainingMinute = 0
            let total_cr = 0
            let technologyName = ''
            const crnRemainingMinute = 0
            const crnRemainingCost = 0
            const crnNonBillableCost = 0
            const crnNonBillableMinute = 0
            let cr_nTimeLineDays = 0
            let cr_nCost = 0
            let cr_nMinutes = 0
            let cr_sName = ''

            if (item.projectIndicator?.nRemainingMinute && Object.values(data.requiredFields).includes('nRemainingMinute')) {
              nRemainingMinute = item.projectIndicator.nRemainingMinute
            }
            if (item.projectIndicator?.nRemainingCost && Object.values(data.requiredFields).includes('nRemainingCost')) {
              nRemainingCost = item.projectIndicator.nRemainingCost
            }
            if (item.projectIndicator?.nNonBillableCost && Object.values(data.requiredFields).includes('nNonBillableCost')) {
              nNonBillableCost = item.projectIndicator.nNonBillableCost
            }
            if (item.projectIndicator?.nNonBillableMinute && Object.values(data.requiredFields).includes('nNonBillableMinute')) {
              nNonBillableMinute = item.projectIndicator.nNonBillableMinute
            }

            if (item?.projectTechnologies?.length !== 0 && Object.values(data.requiredFields).includes('projectTechnologies')) {
              item.projectTechnologies.forEach((technology, index) => {
                technologyName += technology.sName
                if (index !== item.projectTechnologies.length - 1) {
                  technologyName += ', '
                }
              })
            }

            if (item.crIndicators?.length !== 0) {
              // console.log('----------------------------------------------  length crIndicators ----------------------------------------------')

              item.crIndicators.forEach((crIndicators) => {
                if (Object.values(data.requiredFields).includes('total_cr')) total_cr += 1
                if (Object.values(data.requiredFields).includes('cr_total_nRemainingMinute')) cr_total_nRemainingMinute += crIndicators.nRemainingMinute
                if (Object.values(data.requiredFields).includes('cr_total_nRemainingCost')) cr_total_nRemainingCost += crIndicators.nRemainingCost
                if (Object.values(data.requiredFields).includes('cr_total_nNonBillableCost')) cr_total_nNonBillableCost += crIndicators.nNonBillableCost
                if (Object.values(data.requiredFields).includes('cr_total_nNonBillableMinute')) cr_total_nNonBillableMinute += crIndicators.nNonBillableMinute
                if (Object.values(data.requiredFields).includes('cr_nTimeLineDays')) cr_nTimeLineDays = crIndicators.nTimeLineDays
                if (Object.values(data.requiredFields).includes('cr_nCost')) cr_nCost = crIndicators.nCost
                if (Object.values(data.requiredFields).includes('cr_nMinutes')) cr_nMinutes = crIndicators.nMinutes
                if (Object.values(data.requiredFields).includes('cr_sName')) cr_sName = crIndicators.sName

                // console.log('name', crIndicators.sName)

                // total_cr += 1
                // cr_total_nNonBillableCost += crIndicators.nNonBillableCost
                // cr_total_nNonBillableMinute += crIndicators.nNonBillableMinute
                // cr_total_nRemainingCost += crIndicators.nRemainingCost
                // cr_total_nRemainingMinute += crIndicators.nRemainingMinute

                if (Object.values(data.requiredFields).includes('only_cr')) {
                  total.push({
                    ...item,
                    projectIndicator_nRemainingMinute: nRemainingMinute,
                    projectIndicator_nRemainingCost: nRemainingCost,
                    projectIndicator_nNonBillableMinute: nNonBillableMinute,
                    projectIndicator_nNonBillableCost: nNonBillableCost,
                    total_cr,
                    cr_total_nRemainingCost,
                    cr_total_nRemainingMinute,
                    cr_total_nNonBillableCost,
                    cr_total_nNonBillableMinute,
                    projectTechnologies: technologyName,
                    cr_nRemainingMinute: crIndicators?.nRemainingMinute || 0,
                    cr_nRemainingCost: crIndicators?.nRemainingCost || 0,
                    cr_nNonBillableMinute: crIndicators?.nNonBillableMinute || 0,
                    cr_nNonBillableCost: crIndicators?.nNonBillableCost || 0,
                    only_cr: true,
                    cr_nTimeLineDays,
                    cr_nCost,
                    cr_nMinutes,
                    cr_sName
                  })
                } else {
                  total.push({
                    ...item,
                    projectIndicator_nRemainingMinute: nRemainingMinute,
                    projectIndicator_nRemainingCost: nRemainingCost,
                    projectIndicator_nNonBillableMinute: nNonBillableMinute,
                    projectIndicator_nNonBillableCost: nNonBillableCost,
                    total_cr,
                    cr_total_nRemainingCost,
                    cr_total_nRemainingMinute,
                    cr_total_nNonBillableCost,
                    cr_total_nNonBillableMinute,
                    projectTechnologies: technologyName,
                    cr_nRemainingMinute: crIndicators?.nRemainingMinute || 0,
                    cr_nRemainingCost: crIndicators?.nRemainingCost || 0,
                    cr_nNonBillableMinute: crIndicators?.nNonBillableMinute || 0,
                    cr_nNonBillableCost: crIndicators?.nNonBillableCost || 0,
                    only_cr: true,
                    cr_nTimeLineDays,
                    cr_nCost,
                    cr_nMinutes,
                    cr_sName
                  })
                }
              })
            } else {
              // console.log('---------------------------------------------- no length crIndicators ----------------------------------------------')
              total.push({
                ...item,
                projectIndicator_nRemainingMinute: nRemainingMinute,
                projectIndicator_nRemainingCost: nRemainingCost,
                projectIndicator_nNonBillableMinute: nNonBillableMinute,
                projectIndicator_nNonBillableCost: nNonBillableCost,
                total_cr,
                cr_total_nRemainingCost,
                cr_total_nRemainingMinute,
                cr_total_nNonBillableCost,
                cr_total_nNonBillableMinute,
                projectTechnologies: technologyName,
                cr_nRemainingMinute: crnRemainingMinute,
                cr_nRemainingCost: crnRemainingCost,
                cr_nNonBillableMinute: crnNonBillableCost,
                cr_nNonBillableCost: crnNonBillableMinute,
                only_cr: true,
                cr_nTimeLineDays,
                cr_nCost,
                cr_nMinutes,
                cr_sName
              })
            }
          })

          chunk = total
        }

        if (data.module === 'Client') {
          chunk = chunk.map((item) => {
            const obj = {}
            if (item.sName && Object.values(data.requiredFields).includes('sName')) {
              obj.sName = item.sName
            }
            if (item.sEmail && Object.values(data.requiredFields).includes('sEmail')) {
              obj.sEmail = item.sEmail
            }
            if (item.sCountry && Object.values(data.requiredFields).includes('sCountry')) {
              obj.sCountry = item.sCountry
            }
            return obj
          })
        }

        if (data.module === 'Logs') {
          // console.log('requiredFields', data.requiredFields)

          chunk = chunk.map((item) => {
            let roleName = ''

            if (item?.aRole?.length !== 0 && Object.values(data.requiredFields).includes('aRole')) {
              item?.aRole?.forEach((role, index) => {
                roleName += role?.sName || ''
                if (index !== item?.aRole?.length - 1) {
                  roleName += ', '
                }
              })
            }
            return { ...item, aRole: roleName }
          })
        }

        // console.log('chunk', chunk)

        worksheet.addRows(chunk)

        const a = await workbook.xlsx.writeBuffer()

        bytes = Buffer.byteLength(a)

        const params = {
          Bucket: config.S3_BUCKET_NAME,
          Key: `excel/${data.module}/${data.date}/${data.timestamp + '_' + req.employee._id + '_' + data.module}.xlsx`,
          Body: await workbook.xlsx.writeBuffer(),
          ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
        data2 = await s3.uploadFileToS3(params)
      }
      const decimals = 2; const k = 1024
      if (bytes === 0) return '0 Bytes'
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i2 = Math.floor(Math.log(bytes) / Math.log(k))
      const size = parseFloat((bytes / Math.pow(k, i2)).toFixed(dm)) + ' ' + sizes[i2]
      // console.log(parseFloat((bytes / Math.pow(k, i2)).toFixed(dm)) + ' ' + sizes[i2])

      // generate chunk based file
      // console.log('data2', chunks)
      // for (let i = 0; i < chunks; i++) {
      //   const workbook = new Excel.Workbook()
      //   const worksheet = workbook.addWorksheet(`${module}`)
      //   const j = []
      //   for (let i = 0; i < requiredFields.length; i++) {
      //     j.push({ header: requiredFields[i], key: requiredFields[i], width: 50 })
      //   }
      //   worksheet.columns = j
      //   worksheet.columns.forEach(column => {
      //     column.width = column.header.length < 12 ? 12 : column.header.length
      //   })
      //   worksheet.getRow(1).font = { bold: true }

      //   const start = i * chunkSize
      //   const end = (i + 1) * chunkSize
      //   const chunk = data1.slice(start, end)
      //   console.log('chunk', chunk)
      //   worksheet.addRows(chunk)

      //   console.log('workbook', await workbook.xlsx.writeBuffer())

      //   await workbook.xlsx.writeFile(`./${timestamp + '_' + req.employee._id + '_' + module + '_' + i}.xlsx`)
      // }

      const stop1 = performance.now()
      const inSeconds1 = (stop1 - start1) / 1000
      const rounded1 = Number(inSeconds1).toFixed(3)
      // console.log(`businessLogic: ${rounded1}s`)
      // await notificationsender(req, req.employee._id, ' you will get excel very soon in mail ', 'completed', true, true, req.employee._id, '')
      await queuePush('file_excel1', { file: data2.Key, NAME: req.employee.sName, employee: req.employee._id, email: 'pranav.kakadiya@yudiz.com', flag: 0, aJwtTokens: req.employee.aJwtTokens, type: 'Excel-Data', Key: data2.Key, size })
    } catch (error) {
      console.log(error)
    }
  }

  async getBucket(req, res) {
    try {
      const params = {
        Bucket: config.S3_BUCKET_NAME
      }
      const data = await s3.s3BucketSize(params)

      let maxFileSizeFile = 0
      let smallSizeFileFile = 0
      let maxFileSizeFileKey = {}
      let smallSizeFileFileKey = {}
      const typeOfFile = []
      let totalDocumentSize = 0

      maxFileSizeFile = data.Contents[0].Size
      smallSizeFileFile = data.Contents[0].Size
      typeOfFile.push(data.Contents[0].Key.split('.')[1])
      totalDocumentSize = data.Contents[0].Size

      // console.log('data.Contents.length', data.Contents.length)
      let maxindex = 0
      let minindex = 0
      for (let i = 1; i < data.Contents.length; i++) {
        totalDocumentSize += data.Contents[i].Size
        if (data.Contents[i].Size > maxFileSizeFile) {
          maxFileSizeFile = data.Contents[i].Size
          maxindex = i
        }
        if (data.Contents[i].Size < smallSizeFileFile) {
          smallSizeFileFile = data.Contents[i].Size
          minindex = i
        }
        const type = data.Contents[i].Key.split('.')[1]
        if (typeOfFile.indexOf(type) === -1) {
          typeOfFile.push(type)
        }
      }

      maxFileSizeFileKey = { ...data.Contents[maxindex], Size: formatBytes(data.Contents[maxindex].Size) }
      smallSizeFileFileKey = { ...data.Contents[minindex], Size: formatBytes(data.Contents[minindex].Size) }

      if (totalDocumentSize > 5368709120) {
        // console.log('totalDocumentSize exceeded', totalDocumentSize)
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].you_will_get_in_email.replace('##', messages[req.userLanguage].excel), {
        maxFileSizeFile: formatBytes(maxFileSizeFile),
        smallSizeFileFile: formatBytes(smallSizeFileFile),
        typeOfFile,
        maxFileSizeFileKey,
        smallSizeFileFileKey,
        maxindex,
        minindex,
        totalDocumentSize: formatBytes(totalDocumentSize)
      })
    } catch (error) {
      catchError('EmployeeLogs.s3BucketSize', error)
    }
  }

  async updateLogs(req, res) {
    try {
      const { aLogId } = req.body
      for (const log of aLogId) {
        const logExist = await Logs.findById({ _id: log }).lean()
        if (logExist) {
          await Logs.updateOne({ _id: log }, { eStatus: 'N' })
        }
      }
      return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].logs))
    } catch (error) {
      catchError('EmployeeLogs.updateLogs', error)
    }
  }

  async addLogs(req, res) {
    try {
      const { sName, Year = new Date().getFullYear() } = req.body

      let take = `LogYear${new Date().getFullYear()}`.replace(/\d+/g, Year)

      take = ResourceManagementDB.model(take, LogYear)

      const data = await take.create({ sName, sYear: Year })
      // await logsOverviewModel.updateOne({}, { $inc: { nLogCount: 1 } }, { upsert: true })

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].create_success.replace('##', messages[req.userLanguage].logs), data)
    } catch (error) {
      catchError('EmployeeLogs.addLogs', error)
    }
  }

  // async getLogs(req, res) {
  //   try {
  //     const { sName, Year = new Date().getFullYear(), page = 0, limit = 5, search } = req.query
  //     const data = []

  //     // const data = await LogYear+''.create({ sName })

  //     // const take = `LogYear${new Date().getFullYear()}`.replace(/\d+/g, Year)

  //     // console.log('take', take)
  //     const organizationDetails = await OrganizationDetail.findOne({}).lean()

  //     const collectionsNames = await ResourceManagementDB.db.listCollections().toArray()

  //     const filterCollections = collectionsNames.filter((collection) => {
  //       const regexExp = /^logyear[0-9]{4}/gi
  //       if (collection.name.match(regexExp)) {
  //         return collection
  //       }
  //     }).sort((a, b) => {
  //       const aYear = a.name.replace('logyear', '')
  //       const bYear = b.name.replace('logyear', '')
  //       return bYear - aYear
  //     })

  //     console.log('filterCollections', filterCollections)

  //     const a = await logsGet(Year, page, limit, data, organizationDetails?.nFoundedYear || 1947, filterCollections)

  //     return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].logs), { a })
  //   } catch (error) {
  //     catchError('EmployeeLogs.getLogs', error)
  //   }
  // }

  async getLogs(req, res) {
    try {
      const { sName, Year, page = 0, limit = 5, search, dStartDate = new Date(), dEndDate = new Date(new Date().setDate(new Date().getDate() - 5)), dCreatedAt = null } = req.query
      const data = []

      const organizationDetails = await OrganizationDetail.findOne({}).lean()

      const collectionsNames = await ResourceManagementDB.db.listCollections().toArray()

      let filterCollections = collectionsNames.filter((collection) => {
        const regexExp = /^logyear[0-9]{4}/gi
        if (collection.name.match(regexExp)) {
          collection.year = collection.name.replace('logyear', '')
          return collection
        }
      })

      // console.log(filterCollections)

      if (dStartDate && dEndDate) {
        filterCollections = filterCollections.filter((collection) => {
          const StartDate = new Date(dStartDate).getFullYear()
          const EndDate = new Date(dEndDate).getFullYear()
          const collectionYear = +collection.year
          if (collectionYear >= parseInt(StartDate) && collectionYear <= parseInt(EndDate)) {
            return collection
          } else {
            return null
          }
        })
      }

      // if (Year && !isNaN(+Year)) {
      //   console.log('Year', Year)
      //   const Years = collectionsNames.filter((collection) => {
      //     const regexExp = new RegExp(`^logyear${Year}`, 'gi')
      //     if (collection.name.match(regexExp)) {
      //       console.log('collection', collection)
      //       collection.year = collection.name.replace('logyear', '')
      //       return collection
      //     }
      //   })
      //   if (Years.length) {
      //     for (const y of Years) {
      //       console.log('y', y)
      //       const collectionYear = y.year
      //       if (!filterCollections.map((f) => f.year).includes(collectionYear)) {
      //         filterCollections.push(y)
      //       }
      //     }
      //   }
      // }

      filterCollections = filterCollections.sort((a, b) => {
        return b.year - a.year
      })

      // console.log('filterCollections', filterCollections)

      const filterProperty = {
        dStartDate,
        dEndDate
      }

      const searchProperty = {
        sName
      }

      const dbLength = filterCollections.length
      // console.log('dbLength', dbLength)
      // console.log('sName', sName)

      let a = []

      if (!(parseInt(dbLength))) {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].logs), { a: [] })
      } else {
        // console.log('filterCollections', filterCollections)
        a = await logsGet(+filterCollections[0].year, +page, +limit, data, organizationDetails?.nFoundedYear || 1947, filterCollections, searchProperty, filterProperty, dbLength, 0, dCreatedAt, 'year')
      }
      // const a = []
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].logs), { a: a.length ? a : [] })
    } catch (error) {
      catchError('EmployeeLogs.getLogs', error)
    }
  }

  async getNetLogs(req, res) {
    try {
      const { sName, Year, page = 0, limit = 5, search, dStartDate = new Date(), dEndDate = new Date(new Date().setDate(new Date().getDate() - 5)), dCreatedAt = null } = req.query
      const data = []

      const organizationDetails = await OrganizationDetail.findOne({}).lean()

      const collectionsNames = await ResourceManagementDB.db.listCollections().toArray()

      let filterCollections = collectionsNames.filter((collection) => {
        const regexExp = /^network[0-9]{6}/gi
        if (collection.name.match(regexExp)) {
          collection.year = collection.name.replace('network', '')
          return collection
        }
      })

      // console.log('filterCollections', filterCollections)

      if (dStartDate && dEndDate) {
        filterCollections = filterCollections.filter((collection) => {
          const StartDate = `${new Date(dStartDate).getFullYear()}${new Date(dStartDate).getMonth() + 1 < 10 ? `0${new Date(dStartDate).getMonth() + 1}` : new Date(dStartDate).getMonth() + 1}`
          const EndDate = `${new Date(dEndDate).getFullYear()}${new Date(dEndDate).getMonth() + 1 < 10 ? `0${new Date(dEndDate).getMonth() + 1}` : new Date(dEndDate).getMonth() + 1}`
          const collectionYear = +collection.year

          if (collectionYear >= parseInt(StartDate) && collectionYear <= parseInt(EndDate)) {
            return collection
          } else {
            return null
          }
        })
      }

      // console.log(filterCollections)

      filterCollections = filterCollections.sort((a, b) => {
        return b.year - a.year
      })

      const filterProperty = {
        dStartDate,
        dEndDate
      }

      const searchProperty = {
        sName
      }

      const dbLength = filterCollections.length

      let a = []

      if (!(parseInt(dbLength))) {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].logs), { a: [] })
      } else {
        // console.log('filterCollections[0].year', filterCollections[0].year)
        a = await logsGet(+filterCollections[0].year, +page, +limit, data, +`{${organizationDetails?.nFoundedYear}01}` || 194701, filterCollections, searchProperty, filterProperty, dbLength, 0, dCreatedAt, 'month')
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].logs), { a: a.length ? a : [] })
    } catch (error) {
      console.log(error)
    }
  }

  async updateYearLogs(req, res) {
    try {
      const { aLogId } = req.body
      let count = 0
      const data = []

      if (aLogId.length > 0) {
        for (const logs of aLogId) {
          let take = `LogYear${new Date().getFullYear()}`.replace(/\d+/g, logs.sYear)

          take = ResourceManagementDB.model(take, LogYear)

          const takeExist = await take.findById({ _id: logs._id }).lean()
          if (takeExist) {
            await take.findOneAndDelete({ _id: logs._id })
            count++
          }
        }
      }

      await logsOverviewModel.updateOne({}, { $inc: { nLogCount: -count } }, { upsert: true })

      return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].logs), data)
    } catch (error) {
      catchError('EmployeeLogs.updateLogs', error)
    }
  }

  async removeNetLogsCron(req, res) {
    try {
      // console.log('removeNetLogsCron')
      const OrganizationDetail = await OrganizationDetailModel.findOne({}).lean()
      // console.log('OrganizationDetail', OrganizationDetail)

      const removeDate = OrganizationDetail.dRemoveNetworkLogsDate
      // console.log('removeDate', removeDate)

      // get month and year form date
      const month = removeDate.getMonth() + 1
      const year = removeDate.getFullYear()

      // get all collections
      const collectionsNames = await ResourceManagementDB.db.listCollections().toArray()
      const filterCollections = collectionsNames.filter((collection) => {
        const regexExp = /^network[0-9]{5}/gi
        if (collection.name.match(regexExp)) {
          collection.year = +collection.name.split('network')[1].slice(0, 4)
          collection.month = +collection.name.split('network')[1].slice(4, 6)
          return collection.year <= year && collection.month <= month
        }
      })

      for (const collection of filterCollections) {
        const take = `network${collection.year}${collection.month}`

        const takeConnect = ResourceManagementDB.model(take, Network)

        // console.log('take', takeConnect)
        await takeConnect.updateMany({
          dCreatedAt: {
            $lte: new Date(removeDate)
          }
        }, { $set: { eStatus: 'D' } })
      }

      // for hard delete start

      // for (const collection of filterCollections) {
      //   const take = `network${collection.year}${collection.month}`

      //   const takeConnect = ResourceManagementDB.model(take, Network)

      //   console.log('take', takeConnect)
      //   await takeConnect.deleteMany({
      //     dCreatedAt: {
      //       $lte: new Date(removeDate)
      //     }
      //   })
      // }

      // for (const collection of filterCollections) {
      //   // drop collection from database
      //   // await ResourceManagementDB.db.dropCollection(collection.name)
      //   const count = await ResourceManagementDB.db.collection(collection.name).countDocuments()
      //   if (count === 0) await ResourceManagementDB.db.dropCollection(collection.name)
      // }

      // for hard delete stop

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].logs), { filterCollections })
    } catch (error) {
      catchError('EmployeeLogs.removeNetLogsCron', error)
    }
  }

  async removeOpLogsCron(req, res) {
    try {
      // console.log('removeOpLogsCron')
      const OrganizationDetail = await OrganizationDetailModel.findOne({}).lean()
      // console.log('OrganizationDetail', OrganizationDetail)

      const removeDate = OrganizationDetail.dRemoveNetworkLogsDate
      // console.log('removeDate', removeDate)

      const year = removeDate.getFullYear()

      // get all collections
      const collectionsNames = await ResourceManagementDB.db.listCollections().toArray()
      const filterCollections = collectionsNames.filter((collection) => {
        const regexExp = /^logs[0-9]{4}/gi
        if (collection.name.match(regexExp)) {
          collection.year = +collection.name.split('logs')[1].slice(0, 4)
          return collection.year <= year
        }
      })

      for (const collection of filterCollections) {
        const take = `logs${collection.year}`

        const takeConnect = ResourceManagementDB.model(take, Network)

        // console.log('take', takeConnect)
        await takeConnect.updateMany({
          dCreatedAt: {
            $lte: new Date(removeDate)
          }
        }, { $set: { eStatus: 'D' } })
      }

      // for hard delete start

      // for (const collection of filterCollections) {
      //   const take = `network${collection.year}`

      //   const takeConnect = ResourceManagementDB.model(take, Network)

      //   console.log('take', takeConnect)
      //   await takeConnect.deleteMany({
      //     dCreatedAt: {
      //       $lte: new Date(removeDate)
      //     }
      //   })
      // }

      // for (const collection of filterCollections) {
      //   // drop collection from database
      //   // await ResourceManagementDB.db.dropCollection(collection.name)
      //   const count = await ResourceManagementDB.db.collection(collection.name).countDocuments()
      //   if (count === 0) await ResourceManagementDB.db.dropCollection(collection.name)
      // }

      // for hard delete stop

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].logs), { filterCollections })
    } catch (error) {
      catchError('EmployeeLogs.removeNetLogsCron', error)
    }
  }
}

// async function logsGet(Year, page, limit, data, nFoundedYear, collectionExist = []) {
//   try {
//     console.log(Year, page, limit, nFoundedYear)

//     const take = `LogYear${new Date().getFullYear()}`.replace(/\d+/g, Year)

//     const collectionExist = await ResourceManagementDB.db.listCollections().toArray()

//     const isExist = collectionExist.find((collection) => {
//       return collection.name === take.toLocaleLowerCase()
//     })

//     if (isExist) {
//       const takeConnect = ResourceManagementDB.model(take, LogYear)
//       const a = await takeConnect.find().lean()
//       console.log('a.length', a.length)
//       for (let i = 0; i < a.length; i++) {
//         data.push(a[i])
//       }
//     }

//     console.log(data)

//     console.log('data.length', data.length)

//     if (data.length >= limit) {
//       return data.splice(page, limit)
//     }

//     Year = parseInt(Year) - 1 >= nFoundedYear ? parseInt(Year) - 1 : nFoundedYear
//     if (Year === nFoundedYear) return data

//     return logsGet(Year, page, limit, data, nFoundedYear, collectionExist)
//   } catch (error) {
//     console.log(error)
//     return data.length > 0 ? data : []
//   }
// }

// async function logsGet(Year, page, limit, data, nFoundedYear, collectionExist = [], searchProperty = {}, filterProperty = {}, dbLength, i = 0) {
//   try {
//     console.log(Year, page, limit, nFoundedYear, collectionExist[i].year, searchProperty.sName)

//     const take = `LogYear${new Date().getFullYear()}`.replace(/\d+/g, collectionExist[i].year)

//     console.log('take', take)

//     const takeConnect = ResourceManagementDB.model(take, LogYear)

//     const obj = {}

//     if (searchProperty.sName) {
//       obj.sName = { $regex: searchProperty.sName, $options: 'i' }
//     }
//     if (filterProperty.dStartDate && filterProperty.dEndDate) {
//       obj.dCreatedAt = {
//         $gte: new Date(filterProperty.dStartDate),
//         $lte: new Date(filterProperty.dEndDate)
//       }
//     }

//     const a = await takeConnect.find(
//       obj
//     ).sort({ dCreatedAt: -1 }).lean()
//     for (let i = 0; i < a.length; i++) {
//       data.push(a[i])
//     }

//     console.log('data.length & limit', data.length, limit)

//     if (data.length >= limit) {
//       return data.splice(page, limit)
//     }

//     // set limit
//     // limit = limit - data.length > 0 ? limit - data.length : limit

//     // }
//     // console.log('before limit', limit)
//     // limit = data.length < limit ? limit - data.length : limit
//     // console.log('after limit', limit)

//     console.log('b Year', Year)
//     Year = parseInt(Year) - 1 >= nFoundedYear ? parseInt(Year) - 1 : nFoundedYear
//     console.log('a Year', Year)
//     if (Year === nFoundedYear) return data
//     console.log('data.length', 'data.length')
//     if (i + 1 === dbLength) return data.splice(page, limit)

//     return logsGet(Year, page, limit, data, nFoundedYear, collectionExist, searchProperty, filterProperty, dbLength, i + 1)
//   } catch (error) {
//     console.log(error)
//     return data.length > 0 ? data : []
//   }
// }

// async function logsGet(Year, page, limit, data, nFoundedYear, collectionExist = [], searchProperty = {}, filterProperty = {}, dbLength, i = 0, dCreatedAt,flag) {
//   try {
//     console.log('logsGet', Year, page, limit, data, nFoundedYear, collectionExist, searchProperty, filterProperty, dbLength, i, dCreatedAt,flag)
//     // console.log(Year, page, limit, nFoundedYear, collectionExist[i].year, searchProperty.sName)

//     const take = `LogYear${new Date().getFullYear()}`.replace(/\d+/g, collectionExist[i].year)

//     // console.log('take', take)

//     const takeConnect = ResourceManagementDB.model(take, LogYear)

//     const obj = {}

//     if (searchProperty.sName) {
//       obj.sName = { $regex: searchProperty.sName, $options: 'i' }
//     }
//     if (filterProperty.dStartDate && filterProperty.dEndDate) {
//       obj.dCreatedAt = {
//         $gte: new Date(filterProperty.dStartDate),
//         $lte: new Date(filterProperty.dEndDate)
//       }
//     }
//     if (dCreatedAt) {
//       obj.dCreatedAt = {
//         $lt: dCreatedAt
//       }
//     }

//     const a = await takeConnect.find(
//       obj
//     ).sort({ _id: -1 }).lean()
//     for (let i = 0; i < a.length; i++) {
//       data.push(a[i])
//     }

//     // console.log('data.length & limit', data.length, limit)

//     if (data.length >= limit) {
//       return data.splice(page, limit)
//     }

//     console.log('b Year', Year)
//     Year = parseInt(Year) - 1 >= nFoundedYear ? parseInt(Year) - 1 : nFoundedYear
//     console.log('a Year', Year)
//     if (Year === nFoundedYear) return data
//     console.log('data.length', 'data.length')
//     if (i + 1 === dbLength) return data.splice(page, limit)

//     return logsGet(Year, page, limit, data, nFoundedYear, collectionExist, searchProperty, filterProperty, dbLength, i + 1, dCreatedAt,flag)
//   } catch (error) {
//     console.log(error)
//     return data.length > 0 ? data : []
//   }
// }

async function logsGet(Year, page, limit, data, nFoundedYear, collectionExist = [], searchProperty = {}, filterProperty = {}, dbLength, i = 0, dCreatedAt, flag) {
  try {
    // console.log('logsGet', Year, page, limit, data, nFoundedYear, collectionExist, searchProperty, filterProperty, dbLength, i, dCreatedAt, flag)
    // console.log(Year, page, limit, nFoundedYear, collectionExist[i].year, searchProperty.sName)

    let take
    let takeConnect

    if (flag === 'month') {
      take = `Network${new Date().getFullYear()}`.replace(/\d+/g, collectionExist[i].year)
      takeConnect = ResourceManagementDB.model(take, Network)
    } else {
      take = `LogYear${new Date().getFullYear()}`.replace(/\d+/g, collectionExist[i].year)
      takeConnect = ResourceManagementDB.model(take, LogYear)
    }

    const obj = {}

    if (searchProperty.sName) {
      obj.sName = { $regex: searchProperty.sName, $options: 'i' }
    }
    if (filterProperty.dStartDate && filterProperty.dEndDate) {
      obj.dCreatedAt = {
        $gte: new Date(filterProperty.dStartDate),
        $lte: new Date(filterProperty.dEndDate)
      }

      // console.log('obj.dCreatedAt', obj.dCreatedAt)
    }
    if (dCreatedAt) {
      obj.dCreatedAt = {
        $lt: dCreatedAt
      }
    }

    // console.log(obj)

    // console.log('takeConnect', takeConnect)

    const a = await takeConnect.find(
      obj
    ).sort({ dCreatedAt: -1 }).limit(limit).lean()
    for (let i = 0; i < a.length; i++) {
      data.push(a[i])
    }

    // console.log(a)

    // console.log('data.length & limit', data.length, limit)

    if (data.length >= limit) {
      return data.splice(page, limit)
    }

    // console.log('b Year', Year)
    if (flag === 'month') {
      const month = parseInt(collectionExist[i].year.toString().slice(4, 6))

      if (month === 1) {
        Year = parseInt(collectionExist[i].year.toString().slice(0, 4)) - 1 >= nFoundedYear ? parseInt(collectionExist[i].year.toString().slice(0, 4)) - 1 : nFoundedYear
        const postFixmonth = 12
        Year = `${Year}${postFixmonth}`
      } else if (month === 10) {
        const postFixmonth = month - 1
        Year = `${Year}0${postFixmonth}`
      } else {
        const postFixmonth = month - 1
        Year = `${Year}${postFixmonth}`
      }
    } else {
      Year = parseInt(Year) - 1 >= nFoundedYear ? parseInt(Year) - 1 : nFoundedYear
    }
    // console.log('a Year', Year)
    if (Year === nFoundedYear) return data
    // console.log('data.length', 'data.length')
    if (i + 1 === dbLength) return data.splice(page, limit)

    return logsGet(Year, page, limit, data, nFoundedYear, collectionExist, searchProperty, filterProperty, dbLength, i + 1, dCreatedAt, flag)
  } catch (error) {
    console.log(error)
    return data.length > 0 ? data : []
  }
}

module.exports = new EmployeeLogs()
