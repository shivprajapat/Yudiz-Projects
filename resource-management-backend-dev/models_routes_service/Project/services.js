/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const fs = require('fs')
const path = require('path')
const s3 = require('../../helper/s3')
const config = require('../../config/config')
const ProjectModel = require('./model')
const Logs = require('../Logs/model')
const ProjectWiseEmployee = require('../Project/projectwiseemployee.model')
const ProjectWiseContractModel = require('../Project/projectwisecontract.model')
const ProjectWiseTechnology = require('../Project/projectwisetechnology.model')
const ProjectWiseClient = require('../Project/projectwiseclient.model')
const ProjectWiseTag = require('../Project/projectwisetag.model')
const ProjectWiseContract = require('../Project/projectwisecontract.model')
const ProjectWiseDepartment = require('../Project/projectwisedepartment.model')
const EmployeeModel = require('../Employee/model')
const DepartmentModel = require('../Department/model')
const DashboardProjectIndicatorModel = require('../DashBoard/dashboardProjectIndicator.model')
const DashboardProjectDepartmentModel = require('../DashBoard/dashboardProjectDepartment.model')
const DashboardCrIndicatorModel = require('../DashBoard/dashboardCrIndicator.model')
const DashboardCrDepartmentModel = require('../DashBoard/dashboardCrDepartment.model')
const WorkLogModel = require('../WorkLogs/model')
const CrWiseEmployeeModel = require('../ChangeRequest/crWiseEmployee.model')
const CrWiseDepartmentModel = require('../ChangeRequest/crWiseDepartment.model')
const ChangeRequestModel = require('../ChangeRequest/model')
const OrganizationDetailsModel = require('../organizationDetail/model')
const { status, messages, jsonStatus } = require('../../helper/api.responses')
const JobProfileModel = require('../JobProfile/model')
const { ResourceManagementDB } = require('../../database/mongoose')
const { catchError, SuccessResponseSender, ErrorResponseSender, searchValidate, isValidId, formatBytes, statusValidate, contractNameFormate, makeRandomeString } = require('../../helper/utilities.services')
const ProjectwiseemployeeModel = require('../Project/projectwiseemployee.model')
const mongoose = require('mongoose')
const { queuePush } = require('../../helper/redis')

const ObjectId = mongoose.Types.ObjectId

const ejs = require('ejs')

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url = '') {
  console.log('params', params, sBody)
  const data = await ProjectModel.findOne({ _id: ObjectId(params) }).lean()

  let allEmployee = await EmployeeModel.find({ _id: { $in: [data.iProjectManagerId, data.iBAId, data.iBDId, data.iCreatedBy, data.iLastUpdateBy] }, eStatus: 'Y' }).lean()

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
    iProjectId: data._id,
    sProjectName: data.sName,
    iCreatedBy: data.iLastUpdateBy,
    sUrl: url,
    sType: 'project',
    sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
    isRecorded: isRecorded === true ? 'Y' : 'N',
    isNotify: isNotify === true ? 'Y' : 'N'
  }

  const person = await EmployeeModel.findOne({ _id: data.iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()
  const putData = {
    sPushToken,
    sTitle: 'Resource Management',
    sBody: `${data.sName}${sBody}by ${person.sName}(${person.sEmpId})`,
    sLogo: data.sLogo,
    sType: 'project',
    metadata,
    sUrl: url,
    aSenderId: ids,
    isRecorded: isRecorded === true ? 'Y' : 'N',
    isNotify: isNotify === true ? 'Y' : 'N'
  }

  await queuePush('Project:Notification', putData)
}

class Project {
  async addProject(req, res) {
    try {
      const { sName, aProjectBaseEmployee, aTechnology, aProjectTag, aClient, aContract } = req.body
      const project = await ProjectModel.findOne({ sName, eStatus: 'Y' }).lean()
      if (project) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].project))
      const projectId = await ProjectModel.create({ ...req.body, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f') })
      const projectWiseEmployee = await Promise.all(aProjectBaseEmployee.map(async (employee) => {
        return ProjectWiseEmployee.create({
          iProjectId: projectId._id,
          iEmployeeId: employee.iEmployeeId
        })
      }
      ))

      const projectTag = await Promise.all(aProjectTag.map(async (tag) => {
        return ProjectWiseTag.create({
          iProjectId: projectId._id,
          iProjectTagId: tag.iProjectTagId
        })
      }
      ))

      const projectTechnology = await Promise.all(aTechnology.map(async (technology) => {
        return ProjectWiseTechnology.create({
          iProjectId: projectId._id,
          iTechnologyId: technology.iTechnologyId
        })
      }
      ))

      const clients = await Promise.all(aClient.map(async (client) => {
        return ProjectWiseClient.create({
          iProjectId: projectId._id,
          iClientId: client.iClientId
        })
      }
      ))

      const contract = await Promise.all(aContract.map(async (contract) => {
        return ProjectWiseContract.create({
          iProjectId: projectId._id,
          sContract: contract.sContract
        })
      }
      ))
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: projectId._id, eModule: 'Project', sService: 'addProject', eAction: 'Create', oNewFields: projectId }
      await take.create(logs)
      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].project))
    } catch (error) {
      return catchError('Project.addProject', error, req, res)
    }
  }

  async addProjectV2(req, res) {
    try {
      const { sName, aTechnology, aProjectTag, sLogo, aClient, aContract, iContractGlobalId = undefined, dContractStartDate, dContractEndDate } = req.body
      let projectExist

      if (req.body.flag === 1) {
        if (req.body.iProjectId && isValidId(req.body.iProjectId)) {
          const projectExist = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()

          if (!projectExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

          // if (projectExist.eProjectType !== req.body.eProjectType) {
          //   return ErrorResponseSender(res, status.UnprocessableEntity, messages[req.userLanguage].project_type_not_change)
          // }

          // if (projectExist.eProjectType === 'pending') {
          //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].project_in_progress + ' ' + messages[req.userLanguage].not_allowed_to_proceed)
          // }
          // if (projectExist.flag[3] === 'Y') {
          if (!statusValidate(projectExist.eProjectStatus, req.body.eProjectStatus)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage]['project ' + projectExist.eProjectStatus] + ' ' + messages[req.userLanguage].not_allowed_to_proceed)
          // }

          const ProjectName = await ProjectModel.findOne({ sName, eStatus: 'Y', _id: { $ne: req.body.iProjectId } }).lean()
          if (ProjectName) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].project))

          let flag = {
            1: 'Y'
          }

          flag = { ...projectExist.flag, ...flag }
          // remove flag 3 (projectExist.eProjectType !== req.body.eProjectType && projectExist.flag[3] !== 'Y')
          if (projectExist.eProjectType !== req.body.eProjectType && projectExist.eProjectStatus === 'Pending') {
            const aProjectBaseDepartmentIdsToDelete = await ProjectWiseDepartment.find({ iProject: req.body.iProjectId, eStatus: 'Y' })
            if (aProjectBaseDepartmentIdsToDelete.length > 0) {
              const query = {
                iProjectId: req.body.iProjectId,
                eStatus: 'Y'
              }
              query.iDepartmentId = {
                $in: aProjectBaseDepartmentIdsToDelete.map(department => department.iDepartmentId.toString())
              }

              const worklogs = await WorkLogModel.find(query).lean()

              if (worklogs.length > 0) {
                return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))
              }

              const crDepartment = await CrWiseDepartmentModel.find(query).lean()
              if (crDepartment.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].department)

              const departmentEmployee = await ProjectWiseEmployee.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).populate({ path: 'iEmployeeId', eStatus: 'Y', select: 'sName iDepartmentId' }).sort({ sName: 1 }).lean()
              const departmentEmployeeIds = departmentEmployee.map(employee => employee.iEmployeeId.iDepartmentId.toString())

              const aProjectBaseDepartmentIdsToDeleteWithEmployee = aProjectBaseDepartmentIdsToDelete.filter(department => departmentEmployeeIds.includes(department.iDepartmentId))
              if (aProjectBaseDepartmentIdsToDeleteWithEmployee.length > 0) {
                return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].employee))
              }
            }

            const aProjectBaseEmployeeIdsToDelete = await ProjectWiseEmployee.find({ iProject: req.body.iProjectId, eStatus: 'Y' })
            if (aProjectBaseEmployeeIdsToDelete.length > 0) {
              const query = {
                iProjectId: req.body.iProjectId,
                eStatus: 'Y'
              }
              query.iEmployeeId = {
                $in: aProjectBaseEmployeeIdsToDelete.map(employee => employee.iEmployeeId)
              }
              const worklogs = await WorkLogModel.find(query).lean()

              if (worklogs.length > 0) {
                return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))
              }

              const crEmployee = await CrWiseEmployeeModel.find(query).lean()
              if (crEmployee.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].employee))
            }

            if (aProjectBaseDepartmentIdsToDelete.length > 0 || aProjectBaseEmployeeIdsToDelete.length > 0) {
              console.log('aProjectBaseDepartmentIdsToDelete', aProjectBaseDepartmentIdsToDelete.length)
              console.log('aProjectBaseEmployeeIdsToDelete', aProjectBaseEmployeeIdsToDelete.length)
              await ProjectWiseEmployee.updateMany({ iProject: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
              await ProjectWiseDepartment.updateMany({ iProject: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
              await DashboardProjectDepartmentModel.updateMany({ iProjectId: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
              await DashboardProjectIndicatorModel.updateMany({ iProjectId: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
              await DashboardCrIndicatorModel.updateMany({ iProjectId: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
              await DashboardCrDepartmentModel.updateMany({ iProjectId: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
              await ChangeRequestModel.updateMany({ iProjectId: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
              await CrWiseEmployeeModel.updateMany({ iProjectId: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
              await CrWiseDepartmentModel.updateMany({ iProjectId: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
            }

            flag = {
              2: 'N'
            }
            flag = { ...projectExist.flag, ...flag }
            if (projectExist.eProjectType === 'Fixed') {
              req.body.nTimeLineDays = 0
              req.body.sCost = 0
              req.body.dStartDate = null
              req.body.dEndDate = null
            }
            if (projectExist.eProjectType === 'Dedicated') {
              req.body.dBillingCycleDate = null
              req.body.dNoticePeriodDate = null
            }
          } else if (projectExist.eProjectType !== req.body.eProjectType && projectExist.eProjectStatus !== 'Pending') {
            // else if (projectExist.eProjectType !== req.body.eProjectType && projectExist.flag[3] === 'Y')
            return ErrorResponseSender(res, status.UnprocessableEntity, messages[req.userLanguage].project_type_not_change)
          }

          console.log('flag', req.body.sLogo)

          if (projectExist.sLogo !== sLogo) {
            try {
              const params = {
                Bucket: config.S3_BUCKET_NAME,
                Key: sLogo
              }

              const data = await s3.getObject(params)
              if (data) {
                if (projectExist.sLogo) {
                  const s3Params = {
                    Bucket: config.S3_BUCKET_NAME,
                    Key: projectExist.sLogo
                  }
                  await s3.deleteObject(s3Params)
                }

                const params1 = {
                  Bucket: config.S3_BUCKET_NAME,
                  Key: `Project/${projectExist._id}/${sLogo.split('/').pop()}`,
                  Body: data.Body,
                  ContentType: data.ContentType
                }
                await s3.uploadFileToS3(params1)
                const params2 = {
                  Bucket: config.S3_BUCKET_NAME,
                  Key: sLogo
                }
                await s3.deleteObject(params2)
                console.log('params1', params1)
                req.body.sLogo = params1.Key
              }
            } catch (error) {
              console.log('skuhis', error)
              req.body.sLogo = projectExist.sLogo
            }
          }
          // else if (projectExist.sLogo !== sLogo && !projectExist.sLogo) {
          //   try {
          //     const params = {
          //       Bucket: config.S3_BUCKET_NAME,
          //       Key: sLogo
          //     }

          //     const data = await s3.getObject(params)
          //     if (data) {
          //       const params1 = {
          //         Bucket: config.S3_BUCKET_NAME,
          //         Key: `Project/${projectExist._id}/${sLogo.split('/').pop()}`,
          //         Body: data.Body,
          //         ContentType: data.ContentType
          //       }
          //       await s3.uploadFileToS3(params1)
          //       const params2 = {
          //         Bucket: config.S3_BUCKET_NAME,
          //         Key: sLogo
          //       }
          //       await s3.deleteObject(params2)
          //       console.log('params1', params1)
          //       req.body.sLogo = params1.Key
          //     }
          //   } catch (error) {
          //     console.log('skuhis', error)
          //     req.body.sLogo = projectExist.sLogo
          //   }
          // }

          const project = await ProjectModel.findByIdAndUpdate(req.body.iProjectId, { ...req.body, flag, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id }, { new: true, runValidator: true }).lean()
          console.log('project', project)
          if (!project) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

          // const projectWiseTechnology = await ProjectWiseTechnology.find({ iProjectId: req.body.iProjectId }).lean()
          // const projectWiseTag = await ProjectWiseTag.find({ iProjectId: req.body.iProjectId }).lean()
          // const projectWiseClient = await ProjectWiseClient.find({ iProjectId: req.body.iProjectId }).lean()

          if (aTechnology.length > 0) {
            await ProjectWiseTechnology.updateMany({
              iProjectId: req.body.iProjectId
            }, { eStatus: 'N' })

            await Promise.all(aTechnology.map(async (technology) => {
              return ProjectWiseTechnology.create({
                iProjectId: req.body.iProjectId,
                eStatus: 'Y',
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id,
                eProjectType: req.body.eProjectType,
                iTechnologyId: ObjectId(technology.iTechnologyId)
              })
            }))

            // const projectWiseTechnologyId = projectWiseTechnology.map(technology => technology.iTechnologyId.toString())
            // const aProjectBaseTechnologyId = aTechnology.map(technology => technology.iTechnologyId.toString())
            // const aProjectBaseTechnologyIdsToDelete = projectWiseTechnologyId.filter(technology => !aProjectBaseTechnologyId.includes(technology))
            // const aProjectBaseTechnologyIdsToCreate = aProjectBaseTechnologyId.filter(technology => !projectWiseTechnologyId.includes(technology))
            // await Promise.all([ProjectWiseTechnology.updateMany({ iTechnologyId: { $in: aProjectBaseTechnologyIdsToDelete } }, { eStatus: 'N' }),
            //   ProjectWiseTechnology.updateMany({ iTechnologyId: { $in: aProjectBaseTechnologyId } }, { eStatus: 'Y', iLastUpdateBy: req.employee._id, eProjectType: req.body.eProjectType })])
            // if (aProjectBaseTechnologyIdsToCreate.length > 0) {
            //   await Promise.all(aProjectBaseTechnologyIdsToCreate.map(async (employee) => {
            //     return ProjectWiseTechnology.create({
            //       iProjectId: req.body.iProjectId,
            //       eStatus: 'Y',
            //       iCreatedBy: req.employee._id,
            //       iLastUpdateBy: req.employee._id,
            //       eProjectType: req.body.eProjectType,
            //       iTechnologyId: employee
            //     })
            //   }
            //   ))
            // }
          }

          if (aProjectTag.length > 0) {
            await ProjectWiseTag.updateMany({
              iProjectId: req.body.iProjectId
            }, {
              eStatus: 'N'
            })

            await Promise.all(aProjectTag.map(async (tag) => {
              return ProjectWiseTag.create({
                iProjectId: req.body.iProjectId,
                eStatus: 'Y',
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id,
                eProjectType: req.body.eProjectType,
                iProjectTagId: ObjectId(tag.iProjectTagId)
              })
            }))

            // const projectWiseTagId = projectWiseTag.map(tag => tag.iProjectTagId.toString())
            // const aProjectBaseTagId = aProjectTag.map(tag => tag.iProjectTagId.toString())
            // const aProjectBaseTagIdsToDelete = projectWiseTagId.filter(tag => !aProjectBaseTagId.includes(tag))
            // const aProjectBaseTagIdsToCreate = aProjectBaseTagId.filter(tag => !projectWiseTagId.includes(tag))
            // await Promise.all([ProjectWiseTag.updateMany({ iProjectTagId: { $in: aProjectBaseTagIdsToDelete } }, { eStatus: 'N' }),
            //   ProjectWiseTag.updateMany({ iProjectTagId: { $in: aProjectBaseTagId } }, { eStatus: 'Y', iLastUpdateBy: req.employee._id, eProjectType: req.body.eProjectType })])
            // if (aProjectBaseTagIdsToCreate.length > 0) {
            //   await Promise.all(aProjectBaseTagIdsToCreate.map(async (tag) => {
            //     return ProjectWiseTag.create({
            //       iProjectId: req.body.iProjectId,
            //       iProjectTagId: tag,
            //       eStatus: 'Y',
            //       iCreatedBy: req.employee._id,
            //       iLastUpdateBy: req.employee._id,
            //       eProjectType: req.body.eProjectType
            //     })
            //   }
            //   ))
            // }
          }

          if (aClient.length > 0) {
            await ProjectWiseClient.updateMany(
              { iProjectId: req.body.iProjectId },
              { eStatus: 'N' }
            )
            await Promise.all(aClient.map(async (client) => {
              ProjectWiseClient.create({
                iProjectId: req.body.iProjectId,
                iClientId: ObjectId(client.iClientId),
                eStatus: 'Y',
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id,
                eProjectType: req.body.eProjectType
              })
            }))

            // const projectWiseClientId = projectWiseClient.map(client => client.iClientId.toString())
            // const aProjectBaseClientId = aClient.map(client => client.iClientId.toString())
            // const aProjectBaseClientIdsToDelete = projectWiseClientId.filter(client => !aProjectBaseClientId.includes(client))
            // const aProjectBaseClientIdsToCreate = aProjectBaseClientId.filter(client => !projectWiseClientId.includes(client))
            // await Promise.all([ProjectWiseClient.updateMany({ iClientId: { $in: aProjectBaseClientIdsToDelete } }, { eStatus: 'N' }),
            //   ProjectWiseClient.updateMany({ iClientId: { $in: aProjectBaseClientId } }, { eStatus: 'Y', iLastUpdateBy: req.employee._id, eProjectType: req.body.eProjectType })])
            // if (aProjectBaseClientIdsToCreate.length > 0) {
            //   console.log('aProjectBaseClientIdsToCreate', aProjectBaseClientIdsToCreate)
            //   await Promise.all(aProjectBaseClientIdsToCreate.map(async (client) => {
            //     return ProjectWiseClient.create({
            //       iProjectId: req.body.iProjectId,
            //       iClientId: client,
            //       eStatus: 'Y',
            //       iCreatedBy: req.employee._id,
            //       iLastUpdateBy: req.employee._id,
            //       eProjectType: req.body.eProjectType
            //     })
            //   }
            //   ))
            // }
          }

          let take = `Logs${new Date().getFullYear()}`

          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: req.body.iProjectId, eModule: 'Project', sService: 'addProjectV2', eAction: 'Update', oNewFields: project, oOldFields: projectExist }

          await take.create(logs)
          // notificationsender(req, projectExist._id, ' project is update ', true, true)
          return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].project), { projectId: project._id, eProjectType: project.eProjectType, flag, eProjectStatus: project.eProjectStatus })
        }
        let projectId
        try {
          const project = await ProjectModel.findOne({ sName, eStatus: 'Y' }).lean()

          if (project) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].project))

          const flag = {
            1: 'Y',
            2: 'N',
            3: 'N'
          }

          projectId = await ProjectModel.create({ ...req.body, flag, iCreatedBy: req.employee._id, iLastUpdateBy: req.employee._id, eProjectStatus: 'Pending' })

          if (req.body.sLogo) {
            const params = {
              Bucket: config.S3_BUCKET_NAME,
              Key: req.body.sLogo
            }
            let data
            try {
              data = await s3.getObject(params)
              if (data) {
                try {
                  const params1 = {
                    Bucket: config.S3_BUCKET_NAME,
                    Key: `Project/${projectId._id}/${req.body.sLogo.split('/').pop()}`,
                    Body: data.Body,
                    ContentType: data.ContentType
                  }
                  await s3.uploadFileToS3(params1)
                  const params2 = {
                    Bucket: config.S3_BUCKET_NAME,
                    Key: req.body.sLogo
                  }
                  await s3.deleteObject(params2)
                  await ProjectModel.updateOne({ _id: projectId._id }, { sLogo: params1.Key })
                } catch (error) {
                  console.log(error)
                }
              }
            } catch (error) {
              console.log(error)
              // await ProjectModel.deleteOne({ _id: projectId._id })
              // return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].image))
            }
          }

          if (aTechnology.length > 0) {
            await Promise.all(aTechnology.map(async (technology) => {
              return ProjectWiseTechnology.create({
                iProjectId: projectId._id,
                iTechnologyId: technology.iTechnologyId,
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id,
                eProjectType: projectId.eProjectType,
                eStatus: 'Y'
              })
            }
            ))
          }

          if (aProjectTag.length > 0) {
            await Promise.all(aProjectTag.map(async (tag) => {
              console.log(tag)
              return ProjectWiseTag.create({
                iProjectId: projectId._id,
                iProjectTagId: tag.iProjectTagId,
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id,
                eProjectType: projectId.eProjectType,
                eStatus: 'Y'
              })
            }
            ))
          }

          if (aClient.length > 0) {
            await Promise.all(aClient.map(async (client) => {
              return ProjectWiseClient.create({
                iProjectId: projectId._id,
                iClientId: client.iClientId,
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id,
                eProjectType: projectId.eProjectType,
                eStatus: 'Y'
              })
            }))
          }

          let take = `Logs${new Date().getFullYear()}`

          take = ResourceManagementDB.model(take, Logs)

          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: projectId._id, eModule: 'Project', sService: 'addProjectV2', eAction: 'Create', oNewFields: projectId }

          // // pass id to notificationPushTokenCollect method
          // // eslint-disable-next-line no-undef

          await take.create(logs)
          // notificationsender(req, projectId._id, ' project is create ', true, true)

          return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].project), { projectId: projectId._id, eProjectType: projectId.eProjectType, flag: projectId.flag, eProjectStatus: projectId.eProjectStatus })
        } catch (error) {
          return ErrorResponseSender(res, status.InternalServerError, error.message)
        }
      } if (req.body.flag === 2) {
        projectExist = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()

        if (!projectExist) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

        if (projectExist.eProjectType === 'Fixed') {
          let flag = {
            2: 'Y'
          }

          const aProjectBaseEmployee = await ProjectWiseEmployee.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()
          const aProjectBaseDepartment = await ProjectWiseDepartment.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()
          console.log('aProjectBaseDepartment', aProjectBaseDepartment)
          const nTimeLineDays = req.body.nTimeLineDays
          let sDepartmentMinutes = 0
          let sDepartmentCosts = 0
          if (aProjectBaseDepartment.length > 0) {
            aProjectBaseDepartment.forEach((item) => {
              sDepartmentMinutes += parseInt(item.nMinutes)
              sDepartmentCosts += item.nCost
            })
          }
          console.log(sDepartmentMinutes, (parseInt(nTimeLineDays) * 8 * 60))

          if ((parseInt(nTimeLineDays) * 8 * 60) !== parseInt(sDepartmentMinutes)) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].timeLineError_project)
          }
          console.log(sDepartmentCosts, req.body.sCost)
          if (parseInt(req.body.sCost) !== sDepartmentCosts) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].costError_project)
          }

          flag = { ...projectExist.flag, ...flag }

          const project = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()

          const projectWiseEmployee = await ProjectWiseEmployee.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()

          const projectWiseDepartment = await ProjectWiseDepartment.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()
          const DashboardProjectDepartment = await DashboardProjectDepartmentModel.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()

          const projectWiseEmployeeId = projectWiseEmployee.map(employee => ({ ...employee, iEmployeeId: employee.iEmployeeId.toString(), nMinutes: employee.nMinutes }))
          const projectWiseDepartmentId = projectWiseDepartment.map(department => ({ ...department, iDepartmentId: department.iDepartmentId.toString(), nMinutes: department.nMinutes || 0, nCost: department.nCost || 0 }))

          console.log('projectWiseDepartmentId', projectWiseDepartmentId)

          let DashboardProjectDepartmentId = []
          if (project.eProjectType === 'Fixed') {
            DashboardProjectDepartmentId = DashboardProjectDepartment.map(department => ({ ...department, iDepartmentId: department.iDepartmentId.toString(), nMinutes: department.nMinutes || 0, nRemainingMinute: department.nRemainingMinute || 0, nCost: department.nCost || 0, nRemainingCost: department.nRemainingCost || 0 }))
          }
          console.log('DashboardProjectDepartmentId', DashboardProjectDepartmentId)

          const aProjectBaseEmployeeId = aProjectBaseEmployee.map(employee => ({ ...employee, iEmployeeId: employee.iEmployeeId.toString(), nMinutes: employee?.nMinutes || 0 }))
          const aProjectBaseDepartmentId = aProjectBaseDepartment.map(department => ({ ...department, iDepartmentId: department.iDepartmentId.toString(), nMinutes: department?.nMinutes || 0, nCost: department?.nCost || 0 }))

          const aProjectBaseEmployeeIdsToDelete = projectWiseEmployeeId.filter(employee => !aProjectBaseEmployeeId.map(employee => employee.iEmployeeId).includes(employee.iEmployeeId))
          const aProjectBaseDepartmentIdsToDelete = projectWiseDepartmentId.filter(department => !aProjectBaseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

          if (aProjectBaseDepartmentIdsToDelete.length > 0) {
            const query = {
              iProjectId: req.body.iProjectId,
              eStatus: 'Y'
            }
            query.iDepartmentId = {
              $in: aProjectBaseDepartmentIdsToDelete.map(department => department.iDepartmentId)
            }
            const worklogs = await WorkLogModel.find(query).lean()

            if (worklogs.length > 0) {
              return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))
            }

            const crDepartment = await CrWiseDepartmentModel.find(query).lean()

            if (crDepartment.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].department))

            const departmentEmployee = await ProjectWiseEmployee.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).populate({ path: 'iEmployeeId', eStatus: 'Y', select: 'sName iDepartmentId' }).sort({ sName: 1 }).lean()
            const departmentEmployeeIds = departmentEmployee.map(employee => employee.iEmployeeId.iDepartmentId.toString())

            const aProjectBaseDepartmentIdsToDeleteWithEmployee = aProjectBaseDepartmentIdsToDelete.filter(department => departmentEmployeeIds.includes(department.iDepartmentId))
            if (aProjectBaseDepartmentIdsToDeleteWithEmployee.length > 0) {
              return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].employee))
            }
          }

          if (aProjectBaseEmployeeIdsToDelete.length > 0) {
            const query = {
              iProjectId: req.body.iProjectId,
              eStatus: 'Y'
            }
            query.iEmployeeId = {
              $in: aProjectBaseEmployeeIdsToDelete.map(employee => employee.iEmployeeId)
            }
            const worklogs = await WorkLogModel.find(query).lean()

            if (worklogs.length > 0) {
              return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))
            }

            const crEmployee = await CrWiseEmployeeModel.find(query).lean()
            if (crEmployee.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].employee))
          }

          let aDashboardProjectDepartmentIdsToDelete = []
          if (project.eProjectType === 'Fixed') {
            aDashboardProjectDepartmentIdsToDelete = DashboardProjectDepartmentId.filter(department => !aProjectBaseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
          }
          // console.log('aProjectBaseEmployeeIdsToDelete', aProjectBaseEmployeeIdsToDelete)
          // console.log('aProjectBaseDepartmentIdsToDelete', aProjectBaseDepartmentIdsToDelete)
          // console.log('aDashboardProjectDepartmentIdsToDelete', aDashboardProjectDepartmentIdsToDelete)

          const aProjectBaseEmployeeIdsToCreate = aProjectBaseEmployeeId.filter(employee => !projectWiseEmployeeId.map(employee => employee.iEmployeeId).includes(employee.iEmployeeId))
          const aProjectBaseDepartmentIdsToCreate = aProjectBaseDepartmentId.filter(department => !projectWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

          let aDashboardProjectDepartmentIdsToCreate = []
          if (project.eProjectType === 'Fixed') {
            aDashboardProjectDepartmentIdsToCreate = aProjectBaseDepartmentId.filter(department => !DashboardProjectDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
          }

          console.log('aProjectBaseEmployeeIdsToCreate', aProjectBaseEmployeeIdsToCreate)
          console.log('aProjectBaseDepartmentIdsToCreate', aProjectBaseDepartmentIdsToCreate)
          console.log('aDashboardProjectDepartmentIdsToCreate', aDashboardProjectDepartmentIdsToCreate)

          await Promise.all(aProjectBaseEmployeeIdsToDelete.map(async (employee) => {
            return ProjectWiseEmployee.updateOne({ iEmployeeId: employee.iEmployeeId, iProjectId: req.body.iProjectId, eStatus: 'Y' }, {
              $set: {
                eStatus: 'N',
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id
              }
            })
          }
          ))

          await Promise.all(aProjectBaseDepartmentIdsToDelete.map(async (department) => {
            return ProjectWiseDepartment.updateOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId, eStatus: 'Y' }, {
              $set: {
                eStatus: 'N',
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id
              }
            })
          }
          ))

          if (project.eProjectType === 'Fixed') {
            let nRemainingMinute = 0
            let nRemainingCost = 0
            for (const department of aDashboardProjectDepartmentIdsToDelete) {
              const dashboardProjectDepartment = await DashboardProjectDepartmentModel.findOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId, eStatus: 'Y' })
              if (dashboardProjectDepartment) {
                nRemainingMinute += dashboardProjectDepartment?.nRemainingMinute || 0
                nRemainingCost += dashboardProjectDepartment?.nRemainingCost || 0
              }
            }
            await DashboardProjectIndicatorModel.updateOne({ iProjectId: req.body.iProjectId, eStatus: 'Y' }, { $inc: { nRemainingMinute: -nRemainingMinute, nRemainingCost: -nRemainingCost } })
            await Promise.all(aDashboardProjectDepartmentIdsToDelete.map(async (department) => {
              return DashboardProjectDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId, eStatus: 'Y' }, { $set: { eStatus: 'N' } })
            }
            ))
          }

          // await Promise.all(aProjectBaseEmployeeId.map(async(employee) => {
          //   return ProjectWiseEmployee.updateOne({ iEmployeeId: employee.iEmployeeId, iProjectId: req.body.iProjectId }, { nMinutes: employee?.nMinutes || 0, eStatus: 'Y' })
          // }))
          // await Promise.all(aProjectBaseDepartmentId.map(async(department) => {
          //   return ProjectWiseDepartment.updateOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId }, { nMinutes: department?.nMinutes || 0, eStatus: 'Y' })
          // }))

          if (project.eProjectType === 'Fixed') {
            const aDashboardProjectDepartmentId = DashboardProjectDepartmentId.filter(department => aProjectBaseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
            console.log('aDashboardProjectDepartmentId', aDashboardProjectDepartmentId)

            await Promise.all(aDashboardProjectDepartmentId.map(async (department) => {
              return DashboardProjectDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId, eStatus: 'Y' }, {
                nMinutes: department?.nMinutes || 0,
                eStatus: 'Y',
                nRemainingMinute: department?.nRemainingMinute || 0,
                nCost: department?.nCost || 0,
                nRemainingCost: department?.nRemainingCost || 0,
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id
              })
            }))

            let nRemainingMinute = 0
            let nRemainingCost = 0
            for (const department of aDashboardProjectDepartmentId) {
              const dashboardProjectDepartment = await DashboardProjectDepartmentModel.findOne({ iDepartmentId: department.iDepartmentId, iProjectId: req.body.iProjectId, eStatus: 'Y' })
              if (dashboardProjectDepartment) {
                nRemainingMinute += dashboardProjectDepartment?.nRemainingMinute || 0
                nRemainingCost += dashboardProjectDepartment?.nRemainingCost || 0
              }
            }
            console.log(nRemainingMinute, nRemainingCost)
            await DashboardProjectIndicatorModel.updateOne({ iProjectId: req.body.iProjectId, eStatus: 'Y' }, {
              nRemainingMinute,
              nRemainingCost,
              iCreatedBy: req.employee._id,
              iLastUpdateBy: req.employee._id
            })
          }

          await Promise.all(aProjectBaseEmployeeIdsToCreate.map(async (employee) => {
            try {
              const Employee = await EmployeeModel.findOne({ iEmployeeId: employee.iEmployeeId, eStatus: 'Y' })
              return ProjectWiseEmployee.create({
                iProjectId: req.body.iProjectId,
                iEmployeeId: employee.iEmployeeId,
                nMinutes: employee?.nMinutes || 0,
                nCost: employee?.nCost || 0,
                iDepartmentId: Employee.iDepartmentId,
                nAvailabilityMinutes: employee?.nAvailabilityMinutes || 0,
                eProjectType: project.eProjectType,
                eStatus: 'Y'
              })
            } catch (error) {
              console.log('error', error)
            }
          }))

          // for that it have seperate api

          // await Promise.all(aProjectBaseDepartmentIdsToCreate.map(async (department) => {
          //   return ProjectWiseDepartment.create({
          //     iProjectId: req.body.iProjectId,
          //     iDepartmentId: department.iDepartmentId,
          //     nMinutes: department?.nMinutes || 0,
          //     nCost: department?.nCost || 0
          //   })
          // }))

          // for that it have seperate api

          await Promise.all(aDashboardProjectDepartmentIdsToCreate.map(async (department) => {
            return DashboardProjectDepartmentModel.create({
              iProjectId: req.body.iProjectId,
              iDepartmentId: department.iDepartmentId,
              nMinutes: department?.nMinutes || 0,
              nCost: department?.nCost || 0,
              nRemainingMinute: department?.nRemainingMinute || 0,
              nRemainingCost: department?.nRemainingCost || 0,
              eStatus: 'Y',
              nNonBillableMinutes: department?.nNonBillableMinutes || 0,
              nNonBillableCost: department?.nNonBillableCost || 0,
              eProjectType: project.eProjectType,
              iCreatedBy: req.employee._id,
              iLastUpdateBy: req.employee._id
            })
          }))

          const dashboardProject = await DashboardProjectIndicatorModel.findOne({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()
          console.log('dashboardProject', dashboardProject)

          if (!dashboardProject) {
            await DashboardProjectIndicatorModel.create({
              iProjectId: req.body.iProjectId,
              nMinutes: sDepartmentMinutes,
              sCost: req.body.sCost,
              nRemainingMinute: 0,
              nRemainingCost: 0,
              eStatus: 'Y',
              nTimeLineDays: req.body.nTimeLineDays,
              eProjectType: project.eProjectType,
              iCreatedBy: req.employee._id,
              iLastUpdateBy: req.employee._id
            })
          } else {
            console.log({
              nMinutes: sDepartmentMinutes,
              nRemainingMinute: dashboardProject.nRemainingMinute,
              nRemainingCost: dashboardProject.nRemainingCost,
              sCost: req.body.sCost,
              eStatus: 'Y',
              nTimeLineDays: req.body.nTimeLineDays,
              eProjectType: project.eProjectType
            })
            await DashboardProjectIndicatorModel.updateOne({ iProjectId: req.body.iProjectId, eStatus: 'Y' },
              {
                nMinutes: sDepartmentMinutes,
                nRemainingMinute: dashboardProject.nRemainingMinute,
                nRemainingCost: dashboardProject.nRemainingCost,
                sCost: req.body.sCost,
                eStatus: 'Y',
                nTimeLineDays: req.body.nTimeLineDays,
                eProjectType: project.eProjectType,
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id
              })
          }

          const data = await ProjectModel.findByIdAndUpdate(req.body.iProjectId, { ...req.body, flag, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id })
          let take = `Logs${new Date().getFullYear()}`

          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Project', sService: 'addProjectV2', eAction: 'Update', oNewFields: data, oOldFields: projectExist }
          await take.create(logs)
          // notificationsender(req, data._id, ' project is update ', true, true)

          if (aProjectBaseDepartmentIdsToDelete.length > 0) {
            const employee = await CrWiseEmployeeModel.find({ eStatus: 'Y', iCrId: req.params.iCrId }).populate({ path: 'iEmployeeId', eStatus: 'Y', select: 'sName iDepartmentId' }).sort({ sName: 1 }).lean()
            const aEmployeeToDelete = employee.filter(employee => aProjectBaseDepartmentIdsToDelete.map(department => department.iDepartmentId.toString()).includes(employee.iEmployeeId.iDepartmentId.toString()))
            await Promise.all(aEmployeeToDelete.map(async (employee) => {
              return CrWiseEmployeeModel.updateOne({ iEmployeeId: employee.iEmployeeId._id, iCrId: ObjectId(req.params.iCrId), eStatus: 'Y' }, { $set: { eStatus: 'N', iLastUpdateBy: req.employee._id } })
            }))
          }

          return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].project), { projectId: project._id, eProjectType: project.eProjectType, flag })
        } else {
          let flag = {
            2: 'Y'
          }
          flag = { ...projectExist.flag, ...flag }
          console.log(flag)

          const dashboardProject = await DashboardProjectIndicatorModel.findOne({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()
          console.log('dashboardProject', dashboardProject)

          if (!dashboardProject) {
            await DashboardProjectIndicatorModel.create({
              iProjectId: req.body.iProjectId,
              // nMinutes: sDepartmentMinutes,
              sCost: req.body.sCost,
              nRemainingMinute: 0,
              nRemainingCost: 0,
              eStatus: 'Y',
              nTimeLineDays: req.body.nTimeLineDays,
              eProjectType: projectExist.eProjectType,
              iCreatedBy: req.employee._id,
              iLastUpdateBy: req.employee._id
            })
          } else {
            await DashboardProjectIndicatorModel.updateOne({ iProjectId: req.body.iProjectId, eStatus: 'Y' },
              {
                // nMinutes: sDepartmentMinutes,
                nRemainingMinute: dashboardProject.nRemainingMinute,
                nRemainingCost: dashboardProject.nRemainingCost,
                sCost: req.body.sCost,
                eStatus: 'Y',
                nTimeLineDays: req.body.nTimeLineDays,
                eProjectType: projectExist.eProjectType,
                iCreatedBy: req.employee._id,
                iLastUpdateBy: req.employee._id
              })
          }
          const project = await ProjectModel.findByIdAndUpdate({ _id: ObjectId(req.body.iProjectId), eStatus: 'Y' }, { flag, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id, dBillingCycleDate: req.body.dBillingCycleDate, dNoticePeriodDate: req.body.dNoticePeriodDate }, { runValidator: true, new: true })

          let take = `Logs${new Date().getFullYear()}`

          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: project._id, eModule: 'Project', sService: 'addProjectV2', eAction: 'Update', oNewFields: project, oOldFields: projectExist }
          await take.create(logs)
          // notificationsender(req, project._id, ' project is update ', true, true)

          return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].project), { projectId: project._id, eProjectType: project.eProjectType, flag })
        }
      }
      if (req.body.flag === 3.1) {
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

          const deleteParams = {
            Bucket: config.S3_BUCKET_NAME,
            Delete: {
              Objects: objects,
              Quiet: false
            }
          }
          await s3.deleteObjectsFromS3(deleteParams)

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
          // get Object details from s3
          for (const contractFile of req.body.aContract) {
            const getparams = {
              Bucket: config.S3_BUCKET_NAME,
              Key: contractFile.sContract
            }
            const data = await s3.getObjectDetails(getparams)

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
            eProjectType: projectExist.eProjectType
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
      if (req.body.flag === 3.2) {
        const projectExist = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()

        if (!projectExist) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

        let flag = {
          3: 'Y'
        }

        flag = { ...projectExist.flag, ...flag }

        const project = await ProjectModel.findByIdAndUpdate(req.body.iProjectId, { ...req.body, flag, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id })

        if (!project) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

        const ProjectWiseContract = await ProjectWiseContractModel.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()

        const ProjectWiseContractName = ProjectWiseContract.map(contract => contract.sContract)

        const aProjectBaseContract = aContract.map(contract => contract.sContract)

        console.log('Cotract all', aContract)

        const aProjectBaseContractsToDelete = ProjectWiseContractName.filter(contract => !aProjectBaseContract.includes(contract))

        const aProjectBaseContractsToCreate = aProjectBaseContract.filter(contract => !ProjectWiseContractName.includes(contract))

        await Promise.all(aProjectBaseContractsToDelete.map(async (contract) => {
          return ProjectWiseContractModel.updateOne({ iProjectId: req.body.iProjectId, sContract: contract, eStatus: 'Y' }, { eStatus: 'N' })
        }))

        console.log('contractDelete', aProjectBaseContractsToDelete)
        console.log('contractCreate', aProjectBaseContractsToCreate)

        if (aProjectBaseContractsToDelete.length > 0) {
          const objects = []

          await Promise.all(aProjectBaseContractsToCreate.map(async (contract) => {
            return ProjectWiseContractModel.create({
              iProjectId: req.body.iProjectId,
              sContract: contract,
              eStatus: 'Y',
              sDocumentName: contract.sDocumentName,
              eProjectType: projectExist.eProjectType
            })
          }))
          let take = `Logs${new Date().getFullYear()}`

          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: project._id, eModule: 'Project', sService: 'addProjectV2', eAction: 'Update', oNewFields: project, oOldFields: projectExist }
          await take.create(logs)
          // notificationsender(req, projectExist._id, ' project update ', true, true)
          for (const k in aProjectBaseContractsToDelete) {
            objects.push({ Key: aProjectBaseContractsToDelete[k] })
          }
          const deleteParams = {
            Bucket: config.S3_BUCKET_NAME,
            Delete: {
              Objects: objects,
              Quiet: false
            }
          }
          await s3.deleteObjectsFromS3(deleteParams)
        }

        if (aProjectBaseContractsToCreate.length > 0) {
          await Promise.all(aProjectBaseContractsToCreate.map(async (contract) => {
            const getparams = {
              Bucket: config.S3_BUCKET_NAME,
              Key: contract
            }
            const data = await s3.getObjectDetails(getparams)

            data.sContentLength = formatBytes(data.ContentLength)

            return ProjectWiseContractModel.create({
              iProjectId: req.body.iProjectId,
              sContract: contract,
              sContentType: data.ContentType,
              sContentLength: data.sContentLength,
              dLastModified: data.LastModified,
              eStatus: 'Y',
              eProjectType: projectExist.eProjectType,
              sDocumentName: contract.sDocumentName
            })
          }))
        }

        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].project), { projectId: project._id, eProjectType: project.eProjectType, flag })
      }
      // original
      if (req.body.flag === 31) {
        const projectExist = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()

        if (!projectExist) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

        let flag = {
          3: 'Y'
        }

        flag = { ...projectExist.flag, ...flag }

        const project = await ProjectModel.findByIdAndUpdate(req.body.iProjectId, { ...req.body, flag, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id })

        if (!project) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

        const ProjectWiseContract = await ProjectWiseContractModel.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()

        // const ProjectWiseContractName = ProjectWiseContract.map(contract => contract.sContract)

        // const aProjectBaseContract = aContract.map(contract => contract.sContract)

        console.log('Cotract all', aContract)

        const aProjectBaseContractsToDelete = ProjectWiseContract.filter(contract => {
          return !aContract.map(contract => contract.sContract).includes(contract.sContract)
        })

        // const aProjectBaseContractsToCreate = aProjectBaseContract.filter(contract => !ProjectWiseContractName.includes(contract))

        const aProjectBaseContractsToCreate = aContract.filter(contract => {
          return !ProjectWiseContract.map(contract => contract.sContract).includes(contract.sContract)
        })

        await Promise.all(aProjectBaseContractsToDelete.map(async (contract) => {
          return ProjectWiseContractModel.updateOne({ iProjectId: req.body.iProjectId, sContract: contract.sContract, eStatus: 'Y' }, { eStatus: 'N' })
        }))

        console.log('contractDelete', aProjectBaseContractsToDelete)
        console.log('contractCreate', aProjectBaseContractsToCreate)

        if (aProjectBaseContractsToDelete.length > 0) {
          const objects = []

          await Promise.all(aProjectBaseContractsToCreate.map(async (contract) => {
            return ProjectWiseContractModel.create({
              iProjectId: req.body.iProjectId,
              sContract: contract.sContract,
              eStatus: 'Y',
              sDocumentName: contract.sDocumentName,
              eProjectType: projectExist.eProjectType
            })
          }))
          let take = `Logs${new Date().getFullYear()}`

          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: project._id, eModule: 'Project', sService: 'addProjectV2', eAction: 'Update', oNewFields: project, oOldFields: projectExist }
          await take.create(logs)
          // notificationsender(req, projectExist._id, ' project update ', true, true)
          for (const k in aProjectBaseContractsToDelete) {
            objects.push({ Key: aProjectBaseContractsToDelete[k].sContract })
          }
          const deleteParams = {
            Bucket: config.S3_BUCKET_NAME,
            Delete: {
              Objects: objects,
              Quiet: false
            }
          }
          await s3.deleteObjectsFromS3(deleteParams)
        }

        if (aProjectBaseContractsToCreate.length > 0) {
          await Promise.all(aProjectBaseContractsToCreate.map(async (contract) => {
            const getparams = {
              Bucket: config.S3_BUCKET_NAME,
              Key: contract.sContract
            }
            const data = await s3.getObjectDetails(getparams)

            data.sContentLength = formatBytes(data.ContentLength)

            return ProjectWiseContractModel.create({
              iProjectId: req.body.iProjectId,
              sContract: contract.sContract,
              sContentType: data.ContentType,
              sContentLength: data.sContentLength,
              dLastModified: data.LastModified,
              eStatus: 'Y',
              eProjectType: projectExist.eProjectType,
              sDocumentName: contract.sDocumentName
            })
          }))
        }

        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].project), { projectId: project._id, eProjectType: project.eProjectType, flag })
      }
      if (req.body.flag === 3) {
        const projectExist = await ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()

        if (!projectExist) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

        let flag = {
          3: 'Y'
        }

        flag = { ...projectExist.flag, ...flag }

        const project = await ProjectModel.findByIdAndUpdate(req.body.iProjectId, { ...req.body, flag, iCreatedBy: req?.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id })

        if (!project) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

        const ProjectWiseContract = await ProjectWiseContractModel.find({ iProjectId: req.body.iProjectId, eStatus: 'Y' }).lean()

        // const ProjectWiseContractName = ProjectWiseContract.map(contract => contract.sContract)

        // const aProjectBaseContract = aContract.map(contract => contract.sContract)

        console.log('Cotract all', aContract)

        const aProjectBaseContractsToDelete = ProjectWiseContract.filter(contract => {
          return !aContract.map(contract => contract.sContract).includes(contract.sContract)
        })

        // const aProjectBaseContractsToCreate = aProjectBaseContract.filter(contract => !ProjectWiseContractName.includes(contract))

        const aProjectBaseContractsToCreate = aContract.filter(contract => {
          return !ProjectWiseContract.map(contract => contract.sContract).includes(contract.sContract)
        })

        await Promise.all(aProjectBaseContractsToDelete.map(async (contract) => {
          return ProjectWiseContractModel.updateOne({ iProjectId: req.body.iProjectId, sContract: contract.sContract, eStatus: 'Y' }, { eStatus: 'N' })
        }))

        console.log('contractDelete', aProjectBaseContractsToDelete)
        console.log('contractCreate', aProjectBaseContractsToCreate)

        if (aProjectBaseContractsToDelete.length > 0) {
          const objects = []

          // await Promise.all(aProjectBaseContractsToCreate.map(async (contract) => {
          //   return ProjectWiseContractModel.create({
          //     iProjectId: req.body.iProjectId,
          //     sContract: contract.sContract,
          //     eStatus: 'Y',
          //     sDocumentName: contract.sDocumentName,
          //     eProjectType: projectExist.eProjectType
          //   })
          // }))

          let take = `Logs${new Date().getFullYear()}`

          take = ResourceManagementDB.model(take, Logs)
          const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: project._id, eModule: 'Project', sService: 'addProjectV2', eAction: 'Update', oNewFields: project, oOldFields: projectExist }
          await take.create(logs)
          // notificationsender(req, projectExist._id, ' project update ', true, true)
          for (const k in aProjectBaseContractsToDelete) {
            objects.push({ Key: aProjectBaseContractsToDelete[k].sContract })
          }
          const deleteParams = {
            Bucket: config.S3_BUCKET_NAME,
            Delete: {
              Objects: objects,
              Quiet: false
            }
          }
          await s3.deleteObjectsFromS3(deleteParams)
        }

        if (aProjectBaseContractsToCreate.length > 0) {
          await Promise.all(aProjectBaseContractsToCreate.map(async (contract) => {
            const getparams = {
              Bucket: config.S3_BUCKET_NAME,
              Key: contract.sContract
            }
            const data = await s3.getObjectDetails(getparams)

            data.sContentLength = formatBytes(data.ContentLength)

            return ProjectWiseContractModel.create({
              iProjectId: req.body.iProjectId,
              sContract: contract.sContract,
              sContentType: data.ContentType,
              sContentLength: data.sContentLength,
              dLastModified: data.LastModified,
              eStatus: 'Y',
              eProjectType: projectExist.eProjectType,
              sDocumentName: contract?.sDocumentName || contractNameFormate(contract.sContract) || makeRandomeString(10)
            })
          }))
        }

        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].project), { projectId: project._id, eProjectType: project.eProjectType, flag })
      }
    } catch (error) {
      return catchError('Project.addProjectValidate', error, req, res)
    }
  }

  async deleteProject(req, res) {
    try {
      const { id } = req.params

      const projectExist = await ProjectModel.findOne({ _id: id, eStatus: 'Y' })
      if (!projectExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      console.log('projectExist', projectExist)

      if (projectExist.eProjectStatus !== 'Pending') {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].project_status.replace('##', messages[req.userLanguage][projectExist.eProjectStatus]))
      }

      if (projectExist.eProjectStatus === 'Pending') {
        await ProjectWiseEmployee.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
        await ProjectWiseContractModel.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
        await ProjectWiseDepartment.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
        await ProjectWiseClient.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
        await ProjectWiseTechnology.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })

        const project = await ProjectModel.updateOne({ _id: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
        if (!project) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

        await DashboardProjectIndicatorModel.updateOne({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })

        if (projectExist.eProjectType === 'Fixed') {
          await DashboardProjectDepartmentModel.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
          await DashboardCrIndicatorModel.updateOne({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
          await DashboardCrDepartmentModel.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
        } else {
          await DashboardProjectDepartmentModel.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
          await DashboardCrIndicatorModel.updateOne({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
          await DashboardCrDepartmentModel.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
        }
      } else {
        if (projectExist.eProjectType === 'Fixed') {
          console.log('else------------------------------------------------------')
          const worklogs = await WorkLogModel.find({ iProjectId: id, eStatus: 'Y' }).lean()
          if (worklogs.length > 0) {
            return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))
          }
          console.log('worklogs', worklogs)
          const crs = await ChangeRequestModel.find({ iProjectId: id, eStatus: 'Y' }).lean()
          if (crs.length > 0) {
            return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].project_cr))
          }
          console.log('crs', crs)
          const departments = await ProjectWiseDepartment.find({ iProjectId: id, eStatus: 'Y' }).lean()
          if (departments.length > 0) {
            return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].project_department))
          }
          console.log('departments', departments)
          const employees = await ProjectWiseEmployee.find({ iProjectId: id, eStatus: 'Y' }).lean()
          if (employees.length > 0) {
            return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].project_employees))
          }
          console.log('employees', employees)

          const project = await ProjectModel.findByIdAndUpdate({ _id: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
          if (!project) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

          await DashboardProjectIndicatorModel.updateOne({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })

          if (projectExist.eProjectType === 'Fixed') {
            await DashboardProjectDepartmentModel.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
            await DashboardCrIndicatorModel.updateOne({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
            await DashboardCrDepartmentModel.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
          }
        } else {
          const worklogs = await WorkLogModel.find({ iProjectId: id, eStatus: 'Y' }).lean()
          if (worklogs.length > 0) {
            return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))
          }

          const departments = await ProjectWiseDepartment.find({ iProjectId: id, eStatus: 'Y' }).lean()
          if (departments.length > 0) {
            return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].project_department))
          }
          const employees = await ProjectWiseEmployee.find({ iProjectId: id, eStatus: 'Y' }).lean()
          if (employees.length > 0) {
            return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].project_employees))
          }
          const project = await ProjectModel.findByIdAndUpdate({ _id: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
          if (!project) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].project))

          await DashboardProjectIndicatorModel.updateOne({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })

          if (projectExist.eProjectType === 'Dedicated') {
            await DashboardProjectDepartmentModel.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
            await DashboardCrIndicatorModel.updateOne({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
            await DashboardCrDepartmentModel.updateMany({ iProjectId: id, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
          }
        }
      }

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: projectExist._id, eModule: 'Project', sService: 'deleteProject', eAction: 'Delete', oOldFields: projectExist }
      await Logs.create(logs)

      try {
        // notificationsender(req, projectExist._id, ' project delete ', true, true)
      } catch (error) {
        console.log('error', error)
      }

      return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].project))
    } catch (error) {
      return catchError('Project.deleteProject', error, req, res)
    }
  }

  async getProject(req, res) {
    try {
      const projectType = await ProjectModel.findById({ _id: ObjectId(req.params.id), eStatus: 'Y' }, { eProjectType: 1 }).lean()

      console.log(req.employee.aTotalPermissions)
      console.log('projectType', projectType)

      console.log('-------------------------------------------------', req.employee.bViewCost)

      const query = [
        {
          $match: { eStatus: 'Y', _id: ObjectId(req.params.id) }
        },
        {
          $lookup: {
            from: 'projectwiseclients',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'clients',
                  let: { clientId: '$iClientId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$clientId'] }, eStatus: 'Y' } },
                    { $project: { sClientName: '$sName' } }
                  ],
                  as: 'client'
                }
              },
              { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
              { $sort: { 'client.sClientName': 1 } },
              {
                $project:
                {
                  _id: '$client._id',
                  sClientName: '$client.sClientName'
                }
              }
            ],
            as: 'client'
          }
        },
        {
          $lookup: {
            from: 'projectwisecontracts',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              { $project: { sContract: '$sContract', sContentLength: '$sContentLength', sContentType: '$sContentType', dLastModified: '$dLastModified', sName: '$sName', sDocumentName: '$sDocumentName' } }
            ],
            as: 'projectwisecontract'
          }
        },
        {
          $unwind: { path: '$projectwisecontract', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'projectwisetechnologies',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'technologies',
                  let: { technologyId: '$iTechnologyId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$technologyId'] }, eStatus: 'Y' } },
                    { $project: { sTechnologyName: '$sName' } }
                  ],
                  as: 'technology'
                }
              },
              { $unwind: { path: '$technology', preserveNullAndEmptyArrays: true } },
              { $sort: { 'technology.sTechnologyName': 1 } },
              {
                $project: {
                  _id: '$technology._id',
                  sTechnologyName: '$technology.sTechnologyName'
                }
              }
            ],
            as: 'technology'
          }
        },
        {
          $lookup: {
            from: 'projectwisedepartments',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'departments',
                  let: { departmentId: '$iDepartmentId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$departmentId'] }, eStatus: 'Y' } },
                    { $project: { sDepartmentName: '$sName' } }
                  ],
                  as: 'department'
                }
              },
              { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
              { $sort: { 'department.sDepartmentName': 1 } },
              {
                $project: {
                  sDepartmentName: '$department.sDepartmentName',
                  _id: '$iDepartmentId',
                  nMinutes: '$nMinutes',
                  nCost: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nCost', 0] },
                      else: '$$REMOVE'
                    }
                  },
                  // nCost: { $ifNull: ['$nCost', 0] },
                  nCostInPercentage: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nCostInPercentage', 0] },
                      else: '$$REMOVE'
                    }
                    // $ifNull: ['$nCostInPercentage', 0]
                  }
                }
              }
            ],
            as: 'department'
          }
        },
        {
          $lookup: {
            from: 'projectwisetags',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'projecttags',
                  let: { projectTagId: '$iProjectTagId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$projectTagId'] }, eStatus: 'Y' } },
                    { $project: { sProjectTagName: '$sName', sBackGroundColor: '$sBackGroundColor', sTextColor: '$sTextColor' } }
                  ],
                  as: 'projecttag'
                }
              },
              { $unwind: { path: '$projecttag', preserveNullAndEmptyArrays: true } },
              { $sort: { 'projecttag.sProjectTagName': 1 } },
              {
                $project: {
                  _id: '$projecttag._id',
                  sProjectTagName: '$projecttag.sProjectTagName',
                  sBackGroundColor: '$projecttag.sBackGroundColor',
                  sTextColor: '$projecttag.sTextColor'
                }
              }
            ],
            as: 'projecttag'
          }
        },
        {
          $lookup: {
            from: 'employees',
            let: { iBAId: '$iBAId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$iBAId'] }, eStatus: 'Y' } },
              { $project: { sEmployeeName: '$sName' } }
            ],
            as: 'BA'
          }
        },
        {
          $unwind: { path: '$BA', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'employees',
            let: { iPMId: '$iProjectManagerId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$iPMId'] }, eStatus: 'Y' } },
              { $project: { sEmployeeName: '$sName' } }
            ],
            as: 'ProjectManager'
          }
        },
        {
          $unwind: { path: '$ProjectManager', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'employees',
            let: { iBDId: '$iBDId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$iBDId'] }, eStatus: 'Y' } },
              { $project: { sEmployeeName: '$sName' } }
            ],
            as: 'BD'
          }
        },
        {
          $unwind: { path: '$BD', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'employees',
            let: { iEstimateBy: '$iEstimateBy' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$iEstimateBy'] }, eStatus: 'Y' } },
              { $project: { sEmployeeName: '$sName' } }
            ],
            as: 'Estimator'
          }
        },
        {
          $unwind: { path: '$Estimator', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'projectwiseemployees',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'employees',
                  let: { employeeId: '$iEmployeeId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$employeeId'] }, eStatus: 'Y' } },
                    { $project: { sEmployeeName: '$sName', iDepartmentId: '$iDepartmentId' } }
                  ],
                  as: 'employee'
                }
              },
              { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
              { $sort: { 'employee.sEmployeeName': 1 } },
              {
                $project: {
                  _id: '$employee._id',
                  sEmployeeName: '$employee.sEmployeeName',
                  nHours: { $ifNull: ['$nHours', 0] },
                  iDepartmentId: '$employee.iDepartmentId',
                  sReview: '$sReview',
                  nAvailabilityMinutes: { $ifNull: ['$nAvailabilityMinutes', 0] },
                  nCost: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nCost', 0] },
                      else: '$$REMOVE'
                    }
                  },
                  // nCost: { $ifNull: ['$nCost', 0] },
                  eCostType: '$eCostType',
                  nClientCost: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nClientCost', 0] },
                      else: '$$REMOVE'
                    }
                  }
                  // nClientCost: { $ifNull: ['$nClientCost', 0] }
                }
              }
            ],
            as: 'employee'
          }
        },
        {
          $lookup: {
            from: 'currencies',
            let: { currencyId: '$iCurrencyId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$currencyId']
                  },
                  eStatus: 'Y'
                }
              },
              {
                $project: {
                  _id: 1,
                  sName: 1,
                  sSymbol: 1
                }
              }
            ],
            as: 'currency'
          }
        },
        {
          $unwind: { path: '$currency', preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: '$_id',
            sName: { $first: '$sName' },
            eProjectType: { $first: '$eProjectType' },
            sProjectDescription: { $first: '$sProjectDescription' },
            sLogo: { $first: '$sLogo' },
            eCostType: { $first: '$eCostType' },
            // sCost: {
            //   $cond: {
            //     if: { $eq: [req.employee.bViewCost, true] },
            //     then: { $ifNull: ['$sCost', 0] },
            //     else: '$$REMOVE'
            //   }
            // },
            sCost: { $first: '$sCost' },
            dBillingCycleDate: { $first: '$dBillingCycleDate' },
            dNoticePeriodDate: { $first: '$dNoticePeriodDate' },
            nMaxHours: { $first: '$nMaxHours' },
            nMinHours: { $first: '$nMinHours' },
            dContractStartDate: { $first: '$dContractStartDate' },
            dContractEndDate: { $first: '$dContractEndDate' },
            nTimeLineDays: { $first: '$nTimeLineDays' },
            dStartDate: { $first: '$dStartDate' },
            dEndDate: { $first: '$dEndDate' },
            eProjectStatus: { $first: '$eProjectStatus' },
            technology: { $first: '$technology' },
            department: { $first: '$department' },
            projecttag: { $first: '$projecttag' },
            contract: { $addToSet: '$projectwisecontract' },
            employee: { $first: '$employee' },
            BA: { $first: '$BA' },
            ProjectManager: { $first: '$ProjectManager' },
            BD: { $first: '$BD' },
            flag: { $first: '$flag' },
            sClient: { $first: '$client' },
            sCurrency: { $first: '$currency' },
            Estimator: { $first: '$Estimator' }
          }
        }
      ]

      if (projectType.eProjectType === 'Fixed') {
        query[15].$lookup.pipeline[query[15].$lookup.pipeline.length - 1] = {
          $project: {
            _id: '$employee._id',
            sEmployeeName: '$employee.sEmployeeName',
            nHours: '$nHours',
            iDepartmentId: '$employee.iDepartmentId',
            sReview: '$sReview',
            nMinutes: { $ifNull: ['$nMinutes', 0] },
            nAvailabilityMinutes: { $ifNull: ['$nAvailabilityMinutes', 0] },
            nMaxMinutes: { $ifNull: ['$nMaxMinutes', 0] },
            nMinMinutes: { $ifNull: ['$nMinMinutes', 0] },
            nCost: {
              $cond: {
                if: { $eq: [req.employee.bViewCost, true] },
                then: { $ifNull: ['$nCost', 0] },
                else: '$$REMOVE'
              }
            }
            // nCost: { $ifNull: ['$nCost', 0] }
          }
        }
      }

      const project = await ProjectModel.aggregate(query)

      if (project.length) {
        const query = [{
          $match: { eStatus: 'Y', iProjectId: ObjectId(req.params.id), iCrId: null }
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
          $project: {
            sProjectName: '$project.sName',
            sEmployeeName: '$employee.sName',
            _id: 1,
            iProjectId: 1,
            iCrId: 1,
            iEmployeeId: 1,
            iDepartmentId: 1,
            dTaskStartTime: 1,
            dTaskEndTime: 1,
            nCost: 1,
            // nCost: {
            //   $cond: {
            //     if: { $eq: [req.employee.bViewCost, true] },
            //     then: { $ifNull: ['$nCost', 0] },
            //     else: '$$REMOVE'
            //   }
            // },
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

        query.push({ $skip: parseInt(0) })
        query.push({ $limit: parseInt(5) })

        const logs = await WorkLogModel.aggregate(query)
        if (logs.length) {
          project[0].worklogs = logs
        } else {
          project[0].worklogs = []
        }
      }

      console.log('project', project)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { project: project[0] })
    } catch (error) {
      return catchError('Project.getProjects', error, req, res)
    }
  }

  async getProjects(req, res) {
    try {
      let { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt', iTechnologyId, eProjectType, iDepartmentId, iEmployeeId } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      console.log('req.query', req.query)

      const q = [
        {
          $match: { eStatus: 'Y', eProjectStatus: { $ne: 'Closed' } }
        },
        {
          $lookup: {
            from: 'projectwisetechnologies',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'technologies',
                  let: { technologyId: '$iTechnologyId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$technologyId'] }, eStatus: 'Y' } },
                    { $project: { sTechnologyName: '$sName' } }
                  ],
                  as: 'technology'
                }
              },
              { $unwind: { path: '$technology', preserveNullAndEmptyArrays: true } },
              { $sort: { 'technology.sTechnologyName': 1 } },
              { $project: { _id: '$technology._id', sTechnologyName: '$technology.sTechnologyName' } }
            ],
            as: 'technology'
          }
        },
        {
          $lookup: {
            from: 'projectwisetags',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'projecttags',
                  let: { projectTagId: '$iProjectTagId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$projectTagId'] }, eStatus: 'Y' } },
                    { $project: { sProjectTagName: '$sName', sBackGroundColor: '$sBackGroundColor', sTextColor: '$sTextColor' } }
                  ],
                  as: 'projecttag'
                }
              },
              { $unwind: { path: '$projecttag', preserveNullAndEmptyArrays: true } },
              { $sort: { 'projecttag.sProjectTagName': 1 } },
              {
                $project:
                {
                  _id: '$projecttag._id',
                  sProjectTagName: '$projecttag.sProjectTagName',
                  sBackGroundColor: '$projecttag.sBackGroundColor',
                  sTextColor: '$projecttag.sTextColor'
                }
              }
            ],
            as: 'projecttag'
          }
        },
        {
          $lookup: {
            from: 'projectwiseclients',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'clients',
                  let: { clientId: '$iClientId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$clientId'] }, eStatus: 'Y' } },
                    { $project: { sClientName: '$sName' } }
                  ],
                  as: 'client'
                }
              },
              { $unwind: { path: '$client', preserveNullAndEmptyArrays: false } },
              { $sort: { 'client.sClientName': 1 } },
              {
                $project:
                {
                  _id: '$client._id',
                  sClientName: '$client.sClientName'
                }
              }
              // { $replaceRoot: { newRoot: '$client' } }
            ],
            as: 'client'
          }
        },
        {
          $lookup: {
            from: 'projectwisedepartments',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'departments',
                  let: { departmentId: '$iDepartmentId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$departmentId'] }, eStatus: 'Y' } },
                    { $project: { sDepartmentName: '$sName' } }
                  ],
                  as: 'department'
                }
              },
              { $unwind: { path: '$department', preserveNullAndEmptyArrays: false } },
              { $sort: { 'department.sDepartmentName': 1 } },
              { $project: { sDepartmentName: '$department.sDepartmentName', iDepartmentId: '$department._id' } }
            ],
            as: 'department'
          }
        },
        {
          $lookup: {
            from: 'projectwiseemployees',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'employees',
                  let: { employeeId: '$iEmployeeId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$employeeId'] }, eStatus: 'Y' } },
                    { $project: { sEmployeeName: '$sName' } }
                  ],
                  as: 'employee'
                }
              },
              { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
              { $sort: { 'employee.sEmployeeName': 1 } },
              { $project: { sEmployeeName: '$employee.sEmployeeName', iEmployeeId: '$employee._id' } }
            ],
            as: 'employee'
          }
        },
        {
          $project: {
            _id: '$_id',
            sName: '$sName',
            client: '$client',
            technology: '$technology',
            projecttag: '$projecttag',
            dCreatedAt: '$dCreatedAt',
            dEndDate: '$dEndDate',
            eProjectType: '$eProjectType',
            department: '$department',
            employee: '$employee',
            eProjectStatus: 1
          }
        }
      ]

      if (eProjectType) {
        q[0].$match.eProjectType = eProjectType
      }

      if (iDepartmentId) {
        q.push({ $match: { 'department.iDepartmentId': ObjectId(iDepartmentId) } })
      }

      if (iEmployeeId) {
        q.push({ $match: { 'employee.iEmployeeId': ObjectId(iEmployeeId) } })
      }

      if (search) {
        q.push({
          $match: {
            $or: [
              { sName: { $regex: search, $options: 'i' } },
              { 'client.sClientName': { $regex: search, $options: 'i' } },
              { 'technology.sTechnologyName': { $regex: search, $options: 'i' } },
              { 'projecttag.sProjectTagName': { $regex: search, $options: 'i' } }
            ]
          }
        })
      }

      if (iTechnologyId) {
        q.push({ $match: { 'technology._id': ObjectId(iTechnologyId) } })
      }

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      sort = sort === 'client' ? 'client.sClientName' : sort
      sort = sort === 'technology' ? 'technology.sTechnologyName' : sort // not working beacuse of array of object in technology
      sort = sort === 'projecttag' ? 'projecttag.sProjectTagName' : sort// not working beacuse of array of object in projecttag
      sort = sort === 'sName' ? 'sName' : sort
      sort = sort === 'dEndDate' ? 'dEndDate' : sort

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, projects] = await Promise.all([ProjectModel.aggregate(count_query), ProjectModel.aggregate(q)])
      if (req.path === '/DownloadExcel') {
        return projects
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { projects, count: count[0]?.count || 0 })
      }
    } catch (error) {
      console.log(error)
      return catchError('Project.getProjects', error, req, res)
    }
  }

  async getProjectByEmployee(req, res) {
    try {
      let { page = 0, limit = 5, order, sort = 'dCreatedAt' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const iEmployeeId = req.params?.id

      const employeeLogin = await EmployeeModel.findOne({ eStatus: 'Y', _id: ObjectId(req.employee._id) }).populate({
        path: 'iDepartmentId',
        select: 'sName sKey'
      }).lean()

      // const q = [
      //   {
      //     $match: { eStatus: 'Y' }
      //   },
      //   {
      //     $project: {
      //       iProjectId: '$iProjectId',
      //       iEmployeeId: '$iEmployeeId',
      //       dCreatedAt: '$dCreatedAt'
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: 'projects',
      //       let: { projectId: '$iProjectId' },
      //       pipeline: [
      //         { $match: { $expr: { $eq: ['$_id', '$$projectId'] }, eStatus: 'Y' } },
      //         { $project: { sName: '$sName', dEndDate: '$dEndDate', eProjectType: '$eProjectType' } }
      //       ],
      //       as: 'project'
      //     }
      //   },
      //   {
      //     $unwind: '$project'
      //   },
      //   {
      //     $lookup: {
      //       from: 'projectwiseclients',
      //       let: { projectId: '$project._id' },
      //       pipeline: [
      //         { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
      //         {
      //           $lookup: {
      //             from: 'clients',
      //             let: { clientId: '$iClientId' },
      //             pipeline: [
      //               { $match: { $expr: { $eq: ['$_id', '$$clientId'] }, eStatus: 'Y' } },
      //               { $project: { sClientName: '$sName' } }
      //             ],
      //             as: 'client'
      //           }
      //         },
      //         { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
      //         { $sort: { 'client.sClientName': 1 } },
      //         { $project: { client: '$client' } },
      //         { $replaceRoot: { newRoot: '$client' } }
      //       ],
      //       as: 'client'
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: 'projectwisetechnologies',
      //       let: { projectId: '$iProjectId' },
      //       pipeline: [
      //         { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
      //         {
      //           $lookup: {
      //             from: 'technologies',
      //             let: { technologyId: '$iTechnologyId' },
      //             pipeline: [
      //               { $match: { $expr: { $eq: ['$_id', '$$technologyId'] }, eStatus: 'Y' } },
      //               { $project: { sTechnologyName: '$sName' } }
      //             ],
      //             as: 'technology'
      //           }
      //         },
      //         { $unwind: { path: '$technology', preserveNullAndEmptyArrays: true } },
      //         { $sort: { 'technology.sTechnologyName': 1 } },
      //         { $project: { technology: '$technology' } },
      //         { $replaceRoot: { newRoot: '$technology' } }

      //       ],
      //       as: 'technology'
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: 'projectwisetags',
      //       let: { projectId: '$iProjectId' },
      //       pipeline: [
      //         { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
      //         {
      //           $lookup: {
      //             from: 'projecttags',
      //             let: { projectTagId: '$iProjectTagId' },
      //             pipeline: [
      //               { $match: { $expr: { $eq: ['$_id', '$$projectTagId'] }, eStatus: 'Y' } },
      //               { $project: { sProjectTagName: '$sName', sBackGroundColor: '$sBackGroundColor', sTextColor: '$sTextColor' } }
      //             ],
      //             as: 'projecttag'
      //           }
      //         },
      //         { $unwind: { path: '$projecttag', preserveNullAndEmptyArrays: true } },
      //         { $sort: { 'projecttag.sProjectTagName': 1 } },
      //         { $project: { projecttag: '$projecttag' } },
      //         { $replaceRoot: { newRoot: '$projecttag' } }
      //       ],
      //       as: 'projecttag'
      //     }
      //   },
      //   {
      //     $project: {
      //       iProjectId: '$iProjectId',
      //       iEmployeeId: '$iEmployeeId',
      //       dCreatedAt: '$dCreatedAt',
      //       sName: '$project.sName',
      //       dEndDate: '$project.dEndDate',
      //       eProjectType: '$project.eProjectType',
      //       client: '$client',
      //       technology: '$technology',
      //       projecttag: '$projecttag'
      //     }
      //   }
      // ]

      const q = [
        {
          $match: { eStatus: 'Y', iEmployeeId: ObjectId(iEmployeeId) }
        },
        {
          $project: {
            iProjectId: '$iProjectId',
            iEmployeeId: '$iEmployeeId',
            dCreatedAt: '$dCreatedAt'
          }
        },
        {
          $lookup: {
            from: 'projects',
            let: { projectId: '$iProjectId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$projectId'] }, eStatus: 'Y' } },
              { $project: { sName: '$sName', dEndDate: '$dEndDate', eProjectType: '$eProjectType' } }
            ],
            as: 'project'
          }
        },
        { $unwind: { path: '$project', preserveNullAndEmptyArrays: false } },
        {
          $lookup: {
            from: 'projectwiseclients',
            let: { projectId: '$iProjectId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'clients',
                  let: { clientId: '$iClientId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$clientId'] }, eStatus: 'Y' } },
                    { $project: { sClientName: '$sName' } }
                  ],
                  as: 'client'
                }
              },
              { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
              { $sort: { 'client.sClientName': 1 } },
              { $project: { client: '$client' } }
            ],
            as: 'client'
          }
        },
        {
          $unwind: { path: '$client', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'projectwisetechnologies',
            let: { projectId: '$iProjectId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'technologies',
                  let: { technologyId: '$iTechnologyId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$technologyId'] }, eStatus: 'Y' } },
                    { $project: { sTechnologyName: '$sName' } }
                  ],
                  as: 'technology'
                }
              },
              { $unwind: { path: '$technology', preserveNullAndEmptyArrays: true } },
              { $sort: { 'technology.sTechnologyName': 1 } },
              { $project: { technology: '$technology' } }
            ],
            as: 'technology'
          }
        },
        {
          $unwind: { path: '$technology', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'projectwisetags',
            let: { projectId: '$iProjectId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'projecttags',
                  let: { projectTagId: '$iProjectTagId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$projectTagId'] }, eStatus: 'Y' } },
                    { $project: { sProjectTagName: '$sName', sBackGroundColor: '$sBackGroundColor', sTextColor: '$sTextColor' } }
                  ],
                  as: 'projecttag'
                }
              },
              { $unwind: { path: '$projecttag', preserveNullAndEmptyArrays: true } },
              { $sort: { 'projecttag.sProjectTagName': 1 } },
              { $project: { projecttag: '$projecttag' } }
            ],
            as: 'projecttag'
          }
        },
        {
          $unwind: { path: '$projecttag', preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: '$_id',
            iProjectId: { $first: '$iProjectId' },
            iEmployeeId: { $first: '$iEmployeeId' },
            dCreatedAt: { $first: '$dCreatedAt' },
            project: { $first: '$project' },
            client: { $addToSet: '$client.client' },
            technology: { $addToSet: '$technology.technology' },
            projecttag: { $addToSet: '$projecttag.projecttag' }
          }
        },
        {
          $project: {
            iProjectId: '$iProjectId',
            iEmployeeId: '$iEmployeeId',
            dCreatedAt: '$dCreatedAt',
            dEndDate: '$project.dEndDate',
            eProjectType: '$project.eProjectType',
            sName: '$project.sName',
            client: '$client',
            technology: '$technology',
            projecttag: '$projecttag'
          }
        }
        // {
        //   $project: {
        //     iProjectId: '$iProjectId',
        //     iEmployeeId: '$iEmployeeId',
        //     dCreatedAt: '$dCreatedAt',
        //     sName: '$project.sName',
        //     dEndDate: '$project.dEndDate',
        //     eProjectType: '$project.eProjectType',
        //     client: '$client',
        //     technology: '$technology',
        //     projecttag: '$projecttag'
        //   }
        // },
        // {
        //   $group:{

        //   }
        // }
      ]

      // if (['OPERATION', 'ADMIN', 'HR', 'MANAGEMENT'].includes(employeeLogin.iDepartmentId.sKey)) {
      //   q[0].$match.iEmployeeId = ObjectId(iEmployeeId)
      //   console.log('q[0].$match.iEmployeeId', iEmployeeId)
      //   console.log('query', q)
      // }

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      sort = sort === 'client' ? 'client.sClientName' : sort
      sort = sort === 'technology' ? 'technology.sTechnologyName' : sort
      sort = sort === 'projecttag' ? 'projecttag.sProjectTagName' : sort
      sort = sort === 'sName' ? 'sName' : sort
      sort = sort === 'dEndDate' ? 'dEndDate' : sort

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      q.push({ $skip: parseInt(page) })
      q.push({ $limit: parseInt(limit) })

      const [count, projects] = await Promise.all([ProjectWiseEmployee.aggregate(count_query), ProjectWiseEmployee.aggregate(q)])

      // projects = projects.map(item => ({ ...item, projecttag: item.projecttag.sort((a, b) => a.sProjectTagName > b.sProjectTagName), technology: item.technology.sort((a, b) => a.sTechnologyName > b.sTechnologyName), client: item.client.sort((a, b) => a.sClientName > b.sClientName) }))

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { projects, count: count[0]?.count || 0 })
    } catch (error) {
      catchError('Project.getReviewByEmployee', error, req, res)
    }
  }

  async getSignedUrl(req, res) {
    try {
      const { sFileName, sContentType, iProjectId } = req.body

      const bucket = `${config.s3Project}/${iProjectId}/Contract/`

      const data = await s3.generateUploadUrl(sFileName, sContentType, bucket)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      catchError('Project.getSignedUrl', error, req, res)
    }
  }

  async getSignedUrlForImage(req, res) {
    try {
      const { sFileName, sContentType } = req.body

      console.log('sFileName', sFileName)

      const bucket = `${config.s3Project}/`

      const data = await s3.generateUploadUrl(sFileName, sContentType, bucket)
      console.log(data)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      console.log(error)
      catchError('Project.getSignedUrl', error, req, res)
    }
  }

  async getS3Contract(req, res) {
    try {
      const { sFileName } = req.body

      const getparams = {
        Bucket: config.S3_BUCKET_NAME,
        Key: sFileName
      }
      const data = await s3.getObjectDetails(getparams)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      catchError('Project.deleteS3Contract', error, req, res)
    }
  }

  async getReviewByEmployee(req, res) {
    try {
      let { page = 0, limit = 5, order, sort = 'dCreatedAt' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const iEmployeeId = req.params?.id

      // const q = [
      //   {
      //     $match: { iEmployeeId: ObjectId(iEmployeeId), eStatus: 'Y' }
      //   },
      //   {
      //     $lookup: {
      //       from: 'projects',
      //       let: { projectId: '$iProjectId' },
      //       pipeline: [
      //         { $match: { $expr: { $eq: ['$_id', '$$projectId'] }, eStatus: 'Y' } },
      //         { $project: { sName: '$sName', dEndDate: '$dEndDate', eProjectType: '$eProjectType' } }
      //       ],
      //       as: 'project'
      //     }
      //   },
      //   {
      //     $unwind: { path: '$project', preserveNullAndEmptyArrays: true }
      //   },
      //   {
      //     $lookup: {
      //       from: 'projectwiseclients',
      //       let: { projectId: '$project._id' },
      //       pipeline: [
      //         { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
      //         {
      //           $lookup: {
      //             from: 'clients',
      //             let: { clientId: '$iClientId' },
      //             pipeline: [
      //               { $match: { $expr: { $eq: ['$_id', '$$clientId'] }, eStatus: 'Y' } },
      //               { $project: { sClientName: '$sName' } }
      //             ],
      //             as: 'client'
      //           }
      //         },
      //         // { $unwind: { path: '$client', preserveNullAndEmptyArrays: false } },
      //         { $sort: { 'client.sClientName': 1 } },
      //         { $project: { client: '$client' } }
      //       ],
      //       as: 'client'
      //     }
      //   },
      //   {
      //     $unwind: { path: '$client', preserveNullAndEmptyArrays: true }
      //   }
      // ]
      const q = [
        {
          $match: { eStatus: 'Y', iEmployeeId: ObjectId(iEmployeeId) }
        },
        {
          $lookup: {
            from: 'projects',
            let: { projectId: '$iProjectId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$projectId'] }, eStatus: 'Y' } },
              { $project: { sName: '$sName', dEndDate: '$dEndDate', eProjectType: '$eProjectType' } }
            ],
            as: 'project'
          }
        },
        { $unwind: { path: '$project', preserveNullAndEmptyArrays: false } },
        {
          $lookup: {
            from: 'projectwiseclients',
            let: { projectId: '$iProjectId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'clients',
                  let: { clientId: '$iClientId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$clientId'] }, eStatus: 'Y' } },
                    { $project: { sClientName: '$sName' } }
                  ],
                  as: 'client'
                }
              },
              { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
              { $sort: { 'client.sClientName': 1 } },
              { $project: { client: '$client' } }
            ],
            as: 'client'
          }
        },
        {
          $unwind: { path: '$client', preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: '$_id',
            iProjectId: { $first: '$iProjectId' },
            iEmployeeId: { $first: '$iEmployeeId' },
            dCreatedAt: { $first: '$dCreatedAt' },
            project: { $first: '$project' },
            client: { $addToSet: '$client.client' },
            iDepartmentId: { $first: '$iDepartmentId' },
            nMinutes: { $first: '$nMinutes' },
            nAvailabilityMinutes: { $first: '$nAvailabilityMinutes' },
            sReview: { $first: '$sReview' },
            eProjectType: { $first: '$eProjectType' },
            nMaxMinutes: { $first: '$nMaxMinutes' },
            nMinMinutes: { $first: '$nMinMinutes' },
            eStatus: { $first: '$eStatus' }
            // nRemainingMinute: { $first: '$nRemainingMinute' },
            // nRemainingCost: { $first: '$nRemainingCost' },
            // nNonBillableMinute: { $first: '$nNonBillableMinute' },
            // nNonBillableCost: { $first: '$nNonBillableCost' },
            // nCost: { $first: '$nCost' }
          }
        }
        // {
        //   $project: {
        //     _id: 1,
        //     iProjectId: 1,
        //     iEmployeeId: 1,
        //     dCreatedAt: 1,
        //     project: 1,
        //     client: 1,
        //     iDepartmentId: 1,
        //     nMinutes: 1,
        //     nAvailabilityMinutes: 1,
        //     sReview: 1,
        //     eProjectType: 1,
        //     nMaxMinutes: 1,
        //     nMinMinutes: 1,
        //     eStatus: 1,
        //     nRemainingMinute: 1,
        //     nRemainingCost: {
        //       $cond: {
        //         if: { $eq: [req.employee.bViewCost, true] },
        //         then: { $ifNull: ['$nRemainingCost', 0] },
        //         else: '$$REMOVE'
        //       }
        //     },
        //     nNonBillableMinute: { $first: '$nNonBillableMinute' },
        //     nNonBillableCost: {
        //       $cond: {
        //         if: { $eq: [req.employee.bViewCost, true] },
        //         then: { $ifNull: ['$nNonBillableCost', 0] },
        //         else: '$$REMOVE'
        //       }
        //     },
        //     nCost: {
        //       $cond: {
        //         if: { $eq: [req.employee.bViewCost, true] },
        //         then: { $ifNull: ['$nCost', 0] },
        //         else: '$$REMOVE'
        //       }
        //     }
        //   }
        // }
      ]

      // currently error occur inside the review get

      // const employeeLogin = await EmployeeModel.findOne({ eStatus: 'Y', _id: ObjectId(req.employee._id) }).populate({
      //   path: 'iDepartmentId',
      //   select: 'sName sKey'
      // }).lean()

      // if (['OPERATION', 'ADMIN', 'HR', 'MANAGEMENT'].includes(employeeLogin.iDepartmentId.sKey)) {
      //   q[0].$match.iEmployeeId = ObjectId(iEmployeeId)
      //   console.log('q[0].$match.iEmployeeId', iEmployeeId)
      //   console.log('query', q)
      // }

      sort = sort === 'client' ? 'client.sClientName' : sort
      sort = sort === 'sName' ? 'sName' : sort

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      q.push({ $skip: parseInt(page) })
      q.push({ $limit: parseInt(limit) })

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      const [count, projects] = await Promise.all([ProjectWiseEmployee.aggregate(count_query), ProjectWiseEmployee.aggregate(q)])

      console.log('projects', projects)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { projects, count: count[0]?.count || 0 })
    } catch (error) {
      catchError('Project.getInterViewByEmployee', error, req, res)
    }
  }

  async downloadFileFromS3(req, res) {
    try {
      const fileKey = req.body.sFileName

      console.log('Trying to download file', fileKey)

      const params = {
        Bucket: config.S3_BUCKET_NAME,
        Key: fileKey
      }

      console.log('options', params)

      const filePath = path.join(__dirname, '../../downloads/')
      console.log('filePath', filePath)
      // await s3.getObject(options, (err, data) => {
      //   if (err) console.error(err)
      //   fs.writeFileSync(filePath, data.Body.toString())
      //   console.log(`${filePath} has been created!`)
      // })

      // const data = await s3.getObject(params).promise(  )
      // const contents = data.Body.toString()

      // if (!contents) {
      //   throw new Error(`File is empty: ${filePath}.`)
      // }

      // return contents

      // dowanlod file at specific path
      // const data = await s3.getObject(params)
      // const contents = data.Body.toString()

      // const readStream = await s3.getObject(params)

      const data = await s3.getObject(params)

      // const data = fs.writeFile(filePath, Body, (err) => {
      //   if (err) {
      //     throw new Error(err)
      //   } else {
      //     return filePath
      //   }
      // }
      // )

      console.log('data', data)

      // create file using buffer
      // const data = await s3.getObject(params)

      // const data = await s3.getObject(params)
      // const contents = data.Body.toString()

      // if (!contents) {
      //   throw new Error(`File is empty: ${filePath}.`)
      // }

      // return contents

      // dowanlod file at specific path
      // const data = await s3.getObject(params)
      // const contents = data.Body.toString()

      // console.log(readStream)

      // console.log('readStream', readStream.Body)

      // const buffer = Buffer.from(readStream.Body)

      // const writeStream = fs.createWriteStream(filePath, { flags: 'w', encoding: 'utf8', mode: 0o666, autoClose: true })

      // writeStream.write(buffer)
      // writeStream.end()

      // fs.createWriteStream(filePath).write(buffer)

      // const writeStream = fs.createWriteStream(path.join(__dirname, '../downloads/' + fileKey))
      // readStream.pipe(writeStream)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].download), data })
    } catch (error) {
      catchError('Project.downloadFileFromS3', error, req, res)
    }
  }

  async deleteContractByProject(req, res) {
    try {
      const { id } = req.params
      const { sFileName } = req.body

      const project = await ProjectModel.findById(id).lean()

      if (!project) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
      }

      const projectContract = await ProjectWiseContract.find({ iProjectId: id }, { sContract: 1 }).lean()

      // check if project has contract
      if (projectContract.length === 0) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].contract))
      }

      const check = projectContract.find(contract => contract.sContract === sFileName) || {}

      if (!check.sContract) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].contract))
      }

      const params = {
        Bucket: config.S3_BUCKET_NAME,
        Key: sFileName
      }

      const deleteFile = await s3.deleteObjectFromS3(params)

      if (!deleteFile.DeleteMarker) {
        // write below for contract can't delete
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].contract))
      }

      const deleteContract = await ProjectWiseContract.findOneAndDelete({ iProjectId: id, sContract: sFileName })

      if (!deleteContract) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].contract))
      }
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: project._id, eModule: 'Project', sService: 'deleteContractByProject', eAction: 'Delete', oOldFields: project }
      await Logs.create(logs)
      // notificationsender(req, project._id, ' contract is delete ', true, true)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].delete), { project })
    } catch (error) {
      catchError('Project.deleteContractByProject', error, req, res)
    }
  }

  async addReviewByEmployee(req, res) {
    try {
      const { id } = req.params
      const { iProjectId, sReview } = req.body

      console.log('id', id)
      console.log('iProjectId', iProjectId)
      console.log('sReview', sReview)

      const [employee, project] = await Promise.all([EmployeeModel.findOne({ _id: ObjectId(id), eStatus: 'Y' }), ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })])

      if (!employee) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
      }

      if (!project) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
      }

      const data = await ProjectWiseEmployee.findOneAndUpdate({ iProjectId, iEmployeeId: id, eStatus: 'Y' }, { $set: { sReview } }, { new: true })
      if (!data) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].review))
      }
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data.iEmployeeId, eModule: 'ProjectWiseEmployee', sService: 'addReviewByEmployee', eAction: 'Create', oNewFields: data }
      await take.create(logs)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].review), { data })
    } catch (error) {
      catchError('Project.addReviewByEmployee', error, req, res)
    }
  }

  async updateReviewByEmployee(req, res) {
    try {
      const { id } = req.params
      const { iProjectId, sReview } = req.body

      const [employee, project] = await Promise.all([EmployeeModel.findOne({ _id: ObjectId(id), eStatus: 'Y' }), ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })])

      if (!employee) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
      }

      if (!project) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
      }

      const data = await ProjectWiseEmployee.findOneAndUpdate({ iProjectId, iEmployeeId: id, eStatus: 'Y' }, { $set: { sReview } }, { new: true })

      if (!data) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].review))
      }
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data.iEmployeeId, eModule: 'ProjectWiseEmployee', sService: 'updateReviewByEmployee', eAction: 'Update', oNewFields: data }
      await take.create(logs)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].review), { data })
    } catch (error) {
      catchError('Project.updateReviewByEmployee', error, req, res)
    }
  }

  async deleteReviewByEmployee(req, res) {
    try {
      const { id } = req.params
      const { iProjectId } = req.body

      const [employee, project] = await Promise.all(
        [
          EmployeeModel.findOne({ _id: ObjectId(id), eStatus: 'Y' }),
          ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
        ]
      )

      if (!employee) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
      }

      if (!project) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
      }

      const data = await ProjectWiseEmployee.findOneAndUpdate({ iProjectId, iEmployeeId: id, eStatus: 'Y' }, { $set: { sReview: '' } }, { new: true })

      if (!data) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].review))
      }
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data.iEmployeeId, eModule: 'ProjectWiseEmployee', sService: 'deleteReviewByEmployee', eAction: 'Delete', oNewFields: data }
      await take.create(logs)

      return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].review), { data })
    } catch (error) {
      catchError('Project.deleteReviewByEmployee', error, req, res)
    }
  }

  async getProjectsByEmployee(req, res) {
    try {
      const { id } = req.params

      let { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const q = [
        {
          $match: {
            eStatus: 'Y', _id: ObjectId(id)
          }
        },
        {
          $project: {
            _id: 1,
            sName: 1
          }
        },
        {
          $lookup: {
            from: 'projectwiseemployees',
            let: { iProjectId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$iProjectId', '$$iProjectId'] },
                      { $eq: ['$eStatus', 'Y'] }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  iEmployeeId: 1,
                  iProjectId: 1,
                  dCreatedAt: 1
                }
              },
              {
                $lookup: {
                  from: 'employees',
                  let: { iEmployeeId: '$iEmployeeId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$_id', '$$iEmployeeId'] },
                            { $eq: ['$eStatus', 'Y'] }
                          ]
                        }
                      }
                    },
                    {
                      $project: {
                        _id: 1,
                        sName: 1,
                        sEmpId: 1
                      }
                    }
                  ],
                  as: 'employee'
                }
              },
              { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
              {
                $project: {
                  _id: '$employee._id',
                  sName: '$employee.sName',
                  sEmpId: '$employee.sEmpId',
                  dCreatedAt: 1
                }
              }
            ],
            as: 'projectWiseEmployee'
          }
        },
        {
          $unwind: { path: '$projectWiseEmployee', preserveNullAndEmptyArrays: false }
        },
        {
          $project: {
            _id: 1,
            iEmployeeId: '$projectWiseEmployee._id',
            sEmployeeName: '$projectWiseEmployee.sName',
            sEmpId: '$projectWiseEmployee.sEmpId',
            dCreatedAt: '$projectWiseEmployee.dCreatedAt',
            sName: 1
          }
        }
      ]

      if (search) {
        q.push({
          $match: {
            sName: { $regex: search, $options: 'i' }
          }
        })
      }

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      sort = sort === 'sName' ? 'sName' : sort

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })

      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, employee] = await Promise.all([
        ProjectModel.aggregate(count_query),
        ProjectModel.aggregate(q)
      ])

      if (req.path === '/DownloadExcel') {
        return employee
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].employee), { employee, count: count[0]?.count || 0 })
      }
    } catch (error) {
      catchError('Project.getProjectsByEmployee', error, req, res)
    }
  }

  async updateProjectdepartment(req, res) {
    try {
      let { iProjectId, iDepartmentId, nMinutes = 0, nCost = 0, sCost = '0', nTimeLineDays = 0, dStartDate, dEndDate, nCostInPercentage = 0 } = req.body

      if (nMinutes === '' || nMinutes === null || nMinutes === undefined) nMinutes = 0
      if (nCost === '' || nCost === null || nCost === undefined) nCost = 0
      if (nCostInPercentage === '' || nCostInPercentage === null || nCostInPercentage === undefined) nCostInPercentage = 0
      if (nTimeLineDays === '' || nTimeLineDays === null || nTimeLineDays === undefined) nTimeLineDays = 0

      // if (nCostInPercentage === 0) {
      //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].costInPercentage))
      // }
      // if (nMinutes === 0) {
      //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].hours))
      // }
      // if (nCost === 0) {
      //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].cost))
      // }

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const department = await DepartmentModel.findOne({ _id: ObjectId(iDepartmentId), eStatus: 'Y' })
      if (!department) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

      const projectDepartment = await ProjectWiseDepartment.findOne({ iProjectId, iDepartmentId, eStatus: 'Y' })
      if (!projectDepartment) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

      if (project.flag['2'] === 'Y') {
        const aProjectBaseDepartment = await ProjectWiseDepartment.find({ iProjectId, eStatus: 'Y' })
        const nTimeLineDays = project.nTimeLineDays
        let sDepartmentMinutes = 0
        let sDepartmentCosts = 0
        if (aProjectBaseDepartment.length > 0) {
          aProjectBaseDepartment.forEach((item) => {
            sDepartmentMinutes += parseInt(item.nMinutes)
            sDepartmentCosts += parseInt(item.nCost)
          })
        }

        console.log(sDepartmentMinutes)
        console.log(sDepartmentCosts)

        if ((parseInt(nTimeLineDays) * 8 * 60) !== (parseInt(sDepartmentMinutes) + parseInt(nMinutes) - parseInt(projectDepartment.nMinutes))) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].timeLineError_project)
        }

        if ((parseInt(project.sCost) + parseInt(nCost)) - parseInt(projectDepartment.nCost) !== sDepartmentCosts) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].costError_project)
        }
      }
      const obj = {}

      if (nMinutes) {
        obj.nMinutes = nMinutes
      } if (nCost) {
        obj.nCost = nCost
      } if (nCostInPercentage) {
        obj.nCostInPercentage = nCostInPercentage
      }
      const data = await ProjectWiseDepartment.findOneAndUpdate({ iProjectId, iDepartmentId, eStatus: 'Y' }, obj, { new: true })

      await ProjectModel.updateOne({
        _id: ObjectId(iProjectId),
        eStatus: 'Y'
      }, {
        sCost: sCost.toString(),
        nTimeLineDays,
        dStartDate,
        dEndDate
      })

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].department), { data })
    } catch (error) {
      catchError('Project.updateProjectdepartment', error, req, res)
    }
  }

  async addProjectdepartments(req, res) {
    try {
      let { iProjectId, iDepartmentId, nMinutes = 0, nCost = 0, nCostInPercentage = 0 } = req.body

      // if (nMinutes === 0) {
      //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].hours))
      // }
      // if (nCost === 0) {
      //   return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].cost))
      // }

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      console.log(project.sCost)

      // if (project.flag['2'] === 'Y') {
      //   const aProjectBaseDepartment = await ProjectWiseDepartment.find({ iProjectId, eStatus: 'Y' })
      //   console.log(aProjectBaseDepartment)
      //   // const daysCount = (new Date(project.dEndDate).getTime() - new Date(project.dStartDate).getTime()) / (1000 * 3600 * 24)
      //   // console.log(daysCount)

      //   // if (daysCount < 0 || daysCount === 0 || daysCount !== project.nTimeLineDays) {
      //   //   console.log('date grater then')
      //   //   return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].date_grater_then)
      //   // };

      //   const nTimeLineDays = project.nTimeLineDays
      //   let sDepartmentMinutes = 0
      //   let sDepartmentCosts = 0
      //   if (aProjectBaseDepartment.length > 0) {
      //     aProjectBaseDepartment.forEach((item) => {
      //       sDepartmentMinutes += parseInt(item.nMinutes)
      //       sDepartmentCosts += parseInt(item.nCost)
      //     })
      //   }

      //   console.log(sDepartmentMinutes)
      //   console.log(sDepartmentCosts)

      //   if ((parseInt(nTimeLineDays) * 24 * 60) !== (parseInt(sDepartmentMinutes) + parseInt(nMinutes))) {
      //     return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].timeLineError_project)
      //   }

      //   if ((parseInt(project.sCost) + parseInt(nCost)) !== sDepartmentCosts) {
      //     return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].costError_project)
      //   }
      // }
      if (nMinutes === 0) nMinutes = 60

      // nCost = parseInt(nCostInPercentage) * parseInt(project?.sCost || 1) / 100

      const department = await DepartmentModel.findOne({ _id: iDepartmentId, eStatus: 'Y' })
      if (!department) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

      const projectWiseDepartment = await ProjectWiseDepartment.create({ iProjectId, iDepartmentId, nMinutes, nCost, eProjectType: project.eProjectType, nCostInPercentage })
      console.log('============================================')
      console.log('projectWiseDepartment', projectWiseDepartment)
      console.log('============================================')

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].department), { projectWiseDepartment })
    } catch (error) {
      catchError('Project.addProjectdepartments', error, req, res)
    }
  }

  async deleteProjectdepartments(req, res) {
    try {
      const { iProjectId, iDepartmentId } = req.query
      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const department = await DepartmentModel.findOne({ _id: ObjectId(iDepartmentId), eStatus: 'Y' })
      if (!department) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

      const worklog = await WorkLogModel.find({ iProjectId, iDepartmentId, eStatus: 'Y' })
      if (worklog.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))

      const crDepartment = await CrWiseDepartmentModel.find({ iProjectId, iDepartmentId, eStatus: 'Y' }).lean()
      if (crDepartment.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].department))

      const projectWiseDepartment = await ProjectWiseDepartment.updateOne({ iProjectId, iDepartmentId, eStatus: 'Y' }, { eStatus: 'N' })

      const projectWiseEmployee = await ProjectWiseEmployee.find({ iProjectId, eStatus: 'Y' })
      if (projectWiseEmployee.length > 0) {
        const employeeIds = projectWiseEmployee.map((item) => item.iEmployeeId)
        const employee = await EmployeeModel.find({ _id: { $in: employeeIds }, eStatus: 'Y' })
        if (employee.length > 0) {
          const departmentIds = employee.map((item) => item.iDepartmentId)
          if (departmentIds.includes(iDepartmentId)) {
            await ProjectWiseEmployee.updateMany({ iProjectId, iEmployeeId: { $in: employeeIds }, eStatus: 'Y' }, { eStatus: 'N' })
          }
        }
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].department), { projectWiseDepartment })
    } catch (error) {
      catchError('Project.deleteProjectdepartments', error, req, res)
    }
  }

  async addProjectEmployee(req, res) {
    try {
      let { iProjectId, iEmployeeId, eCostType, nAvailabilityMinutes = 0, nMaxMinutes = 0, nMinMinutes = 0, nCost = 0 } = req.body

      const details = await OrganizationDetailsModel.findOne({ eStatus: 'Y' })
      const nMaxHoursPerDay = details?.nMaxHoursPerDay || 8

      // if (nAvailabilityMinutes > (nMaxHoursPerDay * 60) || nAvailabilityMinutes <= 0) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero_and_less_than_100.replace('##', messages[req.userLanguage].availability_hours).replace('100', nMaxHoursPerDay))

      if (nAvailabilityMinutes === 0) nAvailabilityMinutes = 60

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const employee = await EmployeeModel.findOne({ _id: ObjectId(iEmployeeId), eStatus: 'Y' })
      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      const projectWiseEmployee = await ProjectWiseEmployee.findOne({ iProjectId, iEmployeeId, eStatus: 'Y' })
      if (projectWiseEmployee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].employee))

      if (project.eProjectType === 'Fixed') {
        const projectWiseDepartment = await ProjectWiseDepartment.find({ iProjectId, eStatus: 'Y' })

        if (projectWiseDepartment.length > 0) {
          const projectWiseDepartmentIds = projectWiseDepartment.map((item) => item.iDepartmentId.toString())
          if (!projectWiseDepartmentIds.includes(employee.iDepartmentId.toString())) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
        }

        await ProjectWiseEmployee.create({ iProjectId, iEmployeeId, nAvailabilityMinutes, iDepartmentId: employee.iDepartmentId, eProjectType: project.eProjectType, eCostType, nMaxMinutes, nMinMinutes, nCost })
      } else {
        if (!eCostType || !['Monthly', 'Hourly'].includes(eCostType)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].cost_type_required)

        // const organizationDetail = await OrganizationDetailsModel.findOne({ eStatus: 'Y' }, { nDaysPerMonth: 1 }).lean()

        // // if (eCostType === 'Monthly') {
        // //   nCost = nCost/organizationDetail.nDaysPerMonth

        // // } else {

        // // }

        await ProjectWiseEmployee.create({ iProjectId, iEmployeeId, nAvailabilityMinutes, iDepartmentId: employee.iDepartmentId, eProjectType: project.eProjectType, eCostType, nMaxMinutes, nMinMinutes, nCost })
      }
      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].employee))
    } catch (error) {
      catchError('Project.addProjectEmployee', error, req, res)
    }
  }

  async addProjectEmployeeV2(req, res) {
    try {
      const { iProjectId, iEmployeeId, eCostType, nAvailabilityMinutes = 0, nMaxMinutes = 0, nMinMinutes = 0, nCost = 0, nClientCost = 0 } = req.body

      const employeeExits = await EmployeeModel.findOne({ _id: ObjectId(iEmployeeId), eStatus: 'Y' })
      if (!employeeExits) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      const projectExists = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!projectExists) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      if (projectExists.eProjectType === 'Fixed') {
        const projectWiseDepartment = await ProjectWiseDepartment.find({ iProjectId, eStatus: 'Y' })
        if (projectWiseDepartment.length > 0) {
          const projectWiseDepartmentIds = projectWiseDepartment.map((item) => item.iDepartmentId.toString())
          if (!projectWiseDepartmentIds.includes(employeeExits.iDepartmentId.toString())) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
        }

        await ProjectWiseEmployee.create({ iProjectId, iEmployeeId, nAvailabilityMinutes, iDepartmentId: employeeExits.iDepartmentId, eProjectType: employeeExits.eProjectType, eCostType })

        return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].employee))
      }

      if (projectExists.eProjectType === 'Dedicated') {
        const projectWiseDepartment = await ProjectWiseDepartment.find({ iProjectId, eStatus: 'Y' })

        if (!eCostType || !['Monthly', 'Hourly'].includes(eCostType)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].cost_type_required)

        if (projectWiseDepartment.length > 0) {
          const projectWiseDepartmentIds = projectWiseDepartment.map((item) => item.iDepartmentId.toString())
          if (!projectWiseDepartmentIds.includes(employeeExits.iDepartmentId.toString())) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
        }

        await ProjectWiseEmployee.create({ iProjectId, iEmployeeId, nAvailabilityMinutes, iDepartmentId: employeeExits.iDepartmentId, eProjectType: employeeExits.eProjectType, eCostType, nMaxMinutes, nMinMinutes, nCost, nClientCost })

        return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].employee))
      }
    } catch (error) {
      catchError('Project.addProjectEmployee', error, req, res)
    }
  }

  async updateProjectemployee(req, res) {
    try {
      const { iProjectId, iEmployeeId, eCostType, nAvailabilityMinutes, nMaxMinutes, nMinMinutes, nCost } = req.body
      const details = await OrganizationDetailsModel.findOne({ eStatus: 'Y' })
      const nMaxHoursPerDay = details?.nMaxHoursPerDay || 8

      if (nAvailabilityMinutes > (nMaxHoursPerDay * 60) || nAvailabilityMinutes <= 0) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero_and_less_than_100.replace('##', messages[req.userLanguage].availability_hours).replace('100', nMaxHoursPerDay))

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const employee = await EmployeeModel.findOne({ _id: ObjectId(iEmployeeId), eStatus: 'Y' })
      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      const projectWiseEmployee = await ProjectWiseEmployee.findOne({ iProjectId, iEmployeeId, eStatus: 'Y' })
      if (!projectWiseEmployee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].employee))

      if (project.eProjectType === 'Fixed') {
        await ProjectWiseEmployee.updateOne({ iProjectId, iEmployeeId, eStatus: 'Y' }, { nAvailabilityMinutes: nAvailabilityMinutes || projectWiseEmployee.nAvailabilityMinutes, iDepartmentId: employee.iDepartmentId, eProjectType: project.eProjectType })
      } else {
        if (!eCostType || !['Monthly', 'Hourly'].includes(eCostType)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].cost_type_required)
        await ProjectWiseEmployee.updateOne({ iProjectId, iEmployeeId, eStatus: 'Y' }, { nAvailabilityMinutes: nAvailabilityMinutes || projectWiseEmployee.nAvailabilityMinutes, iDepartmentId: employee.iDepartmentId, eProjectType: project.eProjectType, eCostType, nMaxMinutes, nMinMinutes, nCost })
      }
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].employee))
    } catch (error) {
      catchError('Project.updateProjectemployee', error, req, res)
    }
  }

  async updateProjectemployeeV2(req, res) {
    try {
      const { iProjectId, iEmployeeId, eCostType, nAvailabilityMinutes, nMaxMinutes, nMinMinutes, nCost, nClientCost } = req.body

      const details = await OrganizationDetailsModel.findOne({ eStatus: 'Y' })
      const nMaxHoursPerDay = details?.nMaxHoursPerDay || 8

      if (nAvailabilityMinutes > (nMaxHoursPerDay * 60) || nAvailabilityMinutes <= 0) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero_and_less_than_100.replace('##', messages[req.userLanguage].availability_hours).replace('100', nMaxHoursPerDay))

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const employee = await EmployeeModel.findOne({ _id: ObjectId(iEmployeeId), eStatus: 'Y' })
      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      const projectWiseEmployee = await ProjectWiseEmployee.findOne({ iProjectId, iEmployeeId, eStatus: 'Y' })
      if (!projectWiseEmployee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].employee))

      if (project.eProjectType === 'Fixed') {
        await ProjectWiseEmployee.updateOne({ iProjectId, iEmployeeId, eStatus: 'Y' }, { nAvailabilityMinutes: nAvailabilityMinutes || projectWiseEmployee.nAvailabilityMinutes, iDepartmentId: employee.iDepartmentId, eProjectType: project.eProjectType })

        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].employee))
      } else {
        if (!eCostType || !['Monthly', 'Hourly'].includes(eCostType)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].cost_type_required)
        await ProjectWiseEmployee.updateOne({ iProjectId, iEmployeeId, eStatus: 'Y' }, { nAvailabilityMinutes: nAvailabilityMinutes || projectWiseEmployee.nAvailabilityMinutes, iDepartmentId: employee.iDepartmentId, eProjectType: project.eProjectType, eCostType, nMaxMinutes, nMinMinutes, nCost, nClientCost })

        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].employee))
      }
    } catch (error) {
      catchError('Project.updateProjectemployee', error, req, res)
    }
  }

  async xyz(req, res) {
    try {
      const { iEmployeeId } = req.body

      const employee = await EmployeeModel.findOne({ _id: ObjectId(iEmployeeId), eStatus: 'Y' })
      console.log(employee)
      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].employee))
    } catch (error) {
      catchError('Project.xyz', error, req, res)
    }
  }

  async deleteProjectEmployee(req, res) {
    try {
      const { iProjectId, iEmployeeId } = req.query
      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const employee = await EmployeeModel.findOne({ _id: ObjectId(iEmployeeId), eStatus: 'Y' })
      if (!employee) return ErrorResponseSender(res, status.ResourceNotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))

      const worklogs = await WorkLogModel.find({ iProjectId, iEmployeeId, eStatus: 'Y' }).lean()
      if (worklogs.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))

      const change_request = await CrWiseEmployeeModel.find({ iProjectId, iEmployeeId, eStatus: 'Y' }).lean()
      if (change_request.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].change_request))

      const projectWiseEmployee = await ProjectWiseEmployee.updateOne({ iProjectId, iEmployeeId, eStatus: 'Y' }, { eStatus: 'N' })
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].employee), { projectWiseEmployee })
    } catch (error) {
      catchError('Project.deleteProjectEmployee', error, req, res)
    }
  }

  async updateProjectdepartments(req, res) {
    try {
      console.log('req.body', req.body)
      const { aProjectBaseDepartment, nCost, nTimeLineDays, dStartDate, dEndDate } = req.body
      const { iProjectId } = req.params

      console.log('aProjectBaseDepartment', aProjectBaseDepartment)

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      if (project.flag['2'] !== 'Y') {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_allow_action)
      }

      if (nCost === 0) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].cost))
      }
      if (nTimeLineDays === 0) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].timeLineDays))
      }

      let dCost = 0
      let dMinutes = 0

      const daysCount = (new Date(dEndDate).getTime() - new Date(dStartDate).getTime()) / (1000 * 3600 * 24)
      console.log('daysCount', daysCount)

      let sDepartmentMinutes = 0
      let sDepartmentCosts = 0
      if (aProjectBaseDepartment.length > 0) {
        aProjectBaseDepartment.forEach((item) => {
          sDepartmentMinutes += parseInt(item.nMinutes)
          if (item.nMinutes === 0) dMinutes = 0
          sDepartmentCosts += item.nCost
          if (item.nCost === 0) dCost = 0
        })
      }

      // if (dMinutes === 0) {
      //   return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].department_hours))
      // } if (dCost === 0) {
      //   return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].should_be_grater_than_zero.replace('##', messages[req.userLanguage].department_cost))
      // }

      if ((parseInt(nTimeLineDays) * 8 * 60) !== parseInt(sDepartmentMinutes)) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].timeLineError_project)
      }

      if (nCost !== sDepartmentCosts) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].costError_project)
      }
      console.log('sDepartmentMinutes', sDepartmentMinutes)

      const projectWiseDepartment = await ProjectWiseDepartment.find({ iProjectId, eStatus: 'Y' }).lean()

      const projectWiseDepartmentId = projectWiseDepartment.map(department => ({ ...department, iDepartmentId: department.iDepartmentId.toString(), nMinutes: department.nMinutes || 0, nCost: department.nCost || 0 }))

      const aProjectBaseDepartmentId = aProjectBaseDepartment.map(department => ({ ...department, iDepartmentId: department.iDepartmentId.toString(), nMinutes: department?.nMinutes || 0, nCost: department?.nCost || 0 }))

      const aProjectBaseDepartmentIdsToDelete = projectWiseDepartmentId.filter(department => !aProjectBaseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      const aProjectBaseDepartmentIdsToUpdate = aProjectBaseDepartmentId.filter(department => projectWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
      const aDashboardProjectDepartmentIdsToUpdate = aProjectBaseDepartmentIdsToUpdate.filter(department => projectWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      const aProjectBaseDepartmentIdsToCreate = aProjectBaseDepartmentId.filter(department => !projectWiseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))

      console.log('projectWiseDepartmentId', projectWiseDepartmentId)
      console.log('aProjectBaseDepartmentIdsToDelete', aProjectBaseDepartmentIdsToDelete)
      console.log('aProjectBaseDepartmentIdsToUpdate', aProjectBaseDepartmentIdsToUpdate)
      console.log('aProjectBaseDepartmentIdsToCreate', aProjectBaseDepartmentIdsToCreate)

      if (aProjectBaseDepartmentIdsToDelete.length > 0) {
        console.log('aProjectBaseDepartmentIdsToDelete', aProjectBaseDepartmentIdsToDelete)
        const query = {
          iProjectId: ObjectId(iProjectId),
          eStatus: 'Y'
        }
        query.iDepartmentId = {
          $in: aProjectBaseDepartmentIdsToDelete.map(department => department.iDepartmentId)
        }
        const worklogs = await WorkLogModel.find(query).lean()

        if (worklogs.length > 0) {
          return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workLogs))
        }

        const crDepartment = await CrWiseDepartmentModel.find(query).lean()
        if (crDepartment.length > 0) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].change_request))

        const departmentEmployee = await ProjectWiseEmployee.find({ iProjectId: ObjectId(iProjectId), eStatus: 'Y' }).populate({ path: 'iEmployeeId', eStatus: 'Y', select: 'sName iDepartmentId' }).sort({ sName: 1 }).lean()
        const departmentEmployeeIds = departmentEmployee.map(employee => employee.iEmployeeId.iDepartmentId.toString())

        const aProjectBaseDepartmentIdsToDeleteWithEmployee = aProjectBaseDepartmentIdsToDelete.filter(department => departmentEmployeeIds.includes(department.iDepartmentId))
        if (aProjectBaseDepartmentIdsToDeleteWithEmployee.length > 0) {
          console.log('aProjectBaseDepartmentIdsToDeleteWithEmployee', aProjectBaseDepartmentIdsToDeleteWithEmployee)
          return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].employee))
        }
      }

      // await Promise.all(aProjectBaseDepartmentIdsToDelete.map(async (department) => {
      //   console.log('department delete', department)
      //   return ProjectWiseDepartment.updateOne({ iDepartmentId: ObjectId(department.iDepartmentId), iProjectId: ObjectId(iProjectId) }, { eStatus: 'N' })
      // }
      // ))

      // for (let i = 0; i < aProjectBaseDepartmentIdsToDelete.length; i++) {
      //   console.log('department delete', aProjectBaseDepartmentIdsToDelete[i])
      //   const a = await ProjectWiseDepartment.updateOne({ iDepartmentId: aProjectBaseDepartmentIdsToDelete[i].iDepartmentId, iProjectId }, { $set: { eStatus: 'N' } })
      //   console.log('a', a)
      // }

      const DashboardProjectDepartment = await DashboardProjectDepartmentModel.find({ iProjectId, eStatus: 'Y' }).lean()
      let DashboardProjectDepartmentId = []
      if (project.eProjectType === 'Fixed') {
        DashboardProjectDepartmentId = DashboardProjectDepartment.map(department => ({ ...department, iDepartmentId: department.iDepartmentId.toString(), nMinutes: department.nMinutes || 0, nRemainingMinute: department.nRemainingMinute || 0, nCost: department.nCost || 0, nRemainingCost: department.nRemainingCost || 0 }))
      }

      let aDashboardProjectDepartmentIdsToDelete = []
      if (project.eProjectType === 'Fixed') {
        aDashboardProjectDepartmentIdsToDelete = DashboardProjectDepartmentId.filter(department => !aProjectBaseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
      }
      let aDashboardProjectDepartmentIdsToCreate = []
      if (project.eProjectType === 'Fixed') {
        aDashboardProjectDepartmentIdsToCreate = aProjectBaseDepartmentId.filter(department => !DashboardProjectDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
      }

      console.log('DashboardProjectDepartmentId', DashboardProjectDepartmentId)
      console.log('aDashboardProjectDepartmentIdsToDelete', aDashboardProjectDepartmentIdsToDelete)
      console.log('aDashboardProjectDepartmentIdsToCreate', aDashboardProjectDepartmentIdsToCreate)

      if (project.eProjectType === 'Fixed') {
        let nRemainingMinute = 0
        let nRemainingCost = 0
        for (const department of aDashboardProjectDepartmentIdsToDelete) {
          const dashboardProjectDepartment = await DashboardProjectDepartmentModel.findOne({ iDepartmentId: department.iDepartmentId, iProjectId, eStatus: 'Y' })
          if (dashboardProjectDepartment) {
            nRemainingMinute += dashboardProjectDepartment.nRemainingMinute || 0
            nRemainingCost += dashboardProjectDepartment.nRemainingCost || 0
          }
        }
        console.log('nRemainingMinute for delete', nRemainingMinute)
        console.log('nRemainingCost for delete', nRemainingCost)
        await DashboardProjectIndicatorModel.updateOne({ iProjectId, eStatus: 'Y' }, { $inc: { nRemainingMinute: -nRemainingMinute, nRemainingCost: -nRemainingCost }, eProjectType: project.eProjectType })

        await Promise.all(aDashboardProjectDepartmentIdsToDelete.map(async (department) => {
          return DashboardProjectDepartmentModel.updateOne({ iDepartmentId: ObjectId(department.iDepartmentId), iProjectId: ObjectId(iProjectId), eStatus: 'Y' }, { eStatus: 'N' })
        }
        ))
      }
      if (project.eProjectType === 'Fixed') {
        const aDashboardProjectDepartmentId = DashboardProjectDepartmentId.filter(department => aProjectBaseDepartmentId.map(department => department.iDepartmentId).includes(department.iDepartmentId))
        await Promise.all(aDashboardProjectDepartmentId.map(async (department) => {
          return DashboardProjectDepartmentModel.updateOne({ iDepartmentId: department.iDepartmentId, iProjectId, eStatus: 'Y' }, { nMinutes: department?.nMinutes || 0, eStatus: 'Y', nRemainingMinute: department?.nRemainingMinute || 0, nCost: department?.nCost || 0, nRemainingCost: department?.nRemainingCost || 0, eProjectType: project.eProjectType })
        }))
        let nRemainingMinute = 0
        let nRemainingCost = 0
        for (const department of aDashboardProjectDepartmentId) {
          const dashboardProjectDepartment = await DashboardProjectDepartmentModel.findOne({ iDepartmentId: department.iDepartmentId, iProjectId })
          if (dashboardProjectDepartment) {
            nRemainingMinute += dashboardProjectDepartment.nRemainingMinute || 0
            nRemainingCost += dashboardProjectDepartment.nRemainingCost || 0
          }
        }
        console.log('nRemainingMinute for update', nRemainingMinute)
        console.log('nRemainingCost for update', nRemainingCost)
        await DashboardProjectIndicatorModel.updateOne({ iProjectId, eStatus: 'Y' }, { nRemainingMinute, nRemainingCost, eProjectType: project.eProjectType })
      }

      await Promise.all(aDashboardProjectDepartmentIdsToCreate.map(async (department) => {
        return DashboardProjectDepartmentModel.create({
          iProjectId,
          iDepartmentId: department.iDepartmentId,
          nMinutes: department?.nMinutes || 0,
          nCost: department?.nCost || 0,
          nRemainingMinute: 0,
          nRemainingCost: 0,
          eStatus: 'Y',
          eProjectType: project.eProjectType
        })
      }))

      const dashboardProject = await DashboardProjectIndicatorModel.findOne({ iProjectId, eStatus: 'Y' }).lean()

      if (!dashboardProject) {
        await DashboardProjectIndicatorModel.create({
          iProjectId,
          nMinutes: sDepartmentMinutes,
          sCost: nCost,
          nRemainingMinute: 0,
          nRemainingCost: 0,
          eStatus: 'Y',
          nTimeLineDays,
          eProjectType: project.eProjectType
        })
      } else {
        await DashboardProjectIndicatorModel.updateOne({ iProjectId, eStatus: 'Y' },
          {
            nMinutes: sDepartmentMinutes,
            nRemainingMinute: dashboardProject.nRemainingMinute || 0,
            nRemainingCost: dashboardProject.nRemainingCost || 0,
            sCost: nCost,
            eStatus: 'Y',
            nTimeLineDays,
            eProjectType: project.eProjectType
          })
      }

      const updateProject = await ProjectModel.updateOne({
        _id: iProjectId,
        eStatus: 'Y'
      }, {
        nTimeLineDays,
        sDepartmentMinutes,
        sCost: nCost,
        iLastUpdateBy: req.employee._id,
        dStartDate: req.body.dStartDate,
        dEndDate: req.body.dEndDate,
        eProjectType: project.eProjectType
      })

      await Promise.all(aProjectBaseDepartmentIdsToCreate.map(async (department) => {
        return ProjectWiseDepartment.create({
          iProjectId,
          iDepartmentId: department.iDepartmentId,
          nMinutes: department?.nMinutes || 0,
          nCost: department?.nCost || 0,
          eStatus: 'Y',
          nCostInPercentage: department?.nCostInPercentage || 0,
          eProjectType: project.eProjectType
        })
      }))

      await Promise.all(aProjectBaseDepartmentIdsToUpdate.map(async (department) => {
        return ProjectWiseDepartment.updateOne({ iDepartmentId: ObjectId(department.iDepartmentId), iProjectId: ObjectId(iProjectId), eStatus: 'Y' }, { nMinutes: department?.nMinutes || 0, nCost: department?.nCost || 0, eStatus: 'Y', eProjectType: project.eProjectType, nCostInPercentage: department?.nCostInPercentage || 0 })
      }))

      await Promise.all(aDashboardProjectDepartmentIdsToUpdate.map(async (department) => {
        console.log('department', department)
        return DashboardProjectDepartmentModel.updateOne({ iDepartmentId: ObjectId(department.iDepartmentId), iProjectId: ObjectId(iProjectId), eStatus: 'Y' }, { nMinutes: department?.nMinutes || 0, nCost: department?.nCost || 0, eStatus: 'Y', eProjectType: project.eProjectType })
      }))

      await Promise.all(aProjectBaseDepartmentIdsToDelete.map(async (department) => {
        return ProjectWiseDepartment.updateOne({
          iDepartmentId: ObjectId(department.iDepartmentId),
          iProjectId: ObjectId(iProjectId),
          eStatus: 'Y'
        }, { eStatus: 'N' })
      }
      ))

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].department))
    } catch (error) {
      catchError('Project.updateProjectdepartments', error, req, res)
    }
  }

  async getEmployeeProjects(req, res) {
    try {
      let { page = 0, limit = 5, order, sort = 'dCreatedAt', search = '' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const q = [
        {
          $match: { eStatus: 'Y', 'flag.2': 'Y' }
        },
        {
          $project: {
            _id: 1,
            sName: 1,
            eProjectType: 1,
            iCurrencyId: 1,
            sLogo: 1,
            eCostType: 1,
            sCost: {
              $cond: {
                if: { $eq: [req.employee.bViewCost, true] },
                then: { $ifNull: ['$sCost', '0'] },
                else: '$$REMOVE'
              }
            },
            sProjectDescription: 1,
            eProjectStatus: 1
          }
        }
      ]

      const projectEmployee = await ProjectwiseemployeeModel.find({ eStatus: 'Y', iEmployeeId: ObjectId(req.employee._id) }, { iProjectId: 1 }).lean()
      const department = await DepartmentModel.findOne({ eStatus: 'Y', _id: ObjectId(req.employee.iDepartmentId) }).lean()

      // const query = {
      //   $or:
      //       [
      //         { iEmployeeId: req.employee._id },
      //         { iBAId: req.employee._id },
      //         { iPMId: req.employee._id },
      //         { iProjectManagerId: req.employee._id },
      //         { iCreatedBy: req.employee._id },
      //         { iLastUpdateBy: req.employee._id }
      //       ],
      //   eStatus: 'Y',
      //   'flag.2': 'Y'
      // }

      // if (!['OPERATION', 'ADMIN', 'HR', 'MANAGEMENT'].includes(department.sKey)) {
      //   q[0].$match.$or = [
      //     { iBDId: ObjectId(req.employee._id) },
      //     { iProjectManagerId: ObjectId(req.employee._id) },
      //     { iBAId: ObjectId(req.employee._id) },
      //     { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
      //   ]
      // }

      const jobProfileData = await EmployeeModel.findOne({ _id: req.employee._id }, { iJobProfileId: 1, eShowAllProjects: 1 }).populate({ path: 'iJobProfileId', select: 'nLevel' }).lean()

      // console.log(jobProfileData)
      const jobLevelMatch = 3

      // if (!(jobProfileData.iJobProfileId.nLevel <= jobLevelMatch)) {
      //   q[0].$match.$or = [
      //     // { iBDId: ObjectId(req.employee._id) },
      //     // { iProjectManagerId: ObjectId(req.employee._id) },
      //     // { iBAId: ObjectId(req.employee._id) },
      //     { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
      //   ]
      // }

      // if (jobProfileData.eShowAllProjects === 'OWN') {
      q[0].$match.$or = [
        { iBDId: ObjectId(req.employee._id) },
        { iProjectManagerId: ObjectId(req.employee._id) },
        { iBAId: ObjectId(req.employee._id) },
        { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
      ]
      // }

      // else {
      // }

      // let project = await ProjectModel.find(query).distinct('_id').lean()

      // let projectWiseEmployee = await ProjectWiseEmployee.find({ iEmployeeId: req.employee._id }).distinct('iProjectId').lean()

      // projectWiseEmployee = projectWiseEmployee.map((project) => {
      //   return project.toString()
      // })

      // project = project.map((project) => {
      //   return project.toString()
      // })

      // let filterProjects = [...project]

      // for (let i = 0; i < projectWiseEmployee.length; i++) {
      //   if (!filterProjects.includes(projectWiseEmployee[i])) {
      //     filterProjects.push(projectWiseEmployee[i])
      //   }
      // }

      // filterProjects = filterProjects.map((project) => ObjectId(project))

      // q.push({
      //   $match: { _id: { $in: filterProjects } }
      // })

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

      sort = sort === 'client' ? 'client.sClientName' : sort
      sort = sort === 'technology' ? 'technology.sTechnologyName' : sort
      sort = sort === 'projecttag' ? 'projecttag.sProjectTagName' : sort
      sort = sort === 'sName' ? 'sName' : sort
      sort = sort === 'dEndDate' ? 'dEndDate' : sort

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      q.push({ $skip: parseInt(page) })
      q.push({ $limit: parseInt(limit) })

      const [count, projects] = await Promise.all([ProjectModel.aggregate(count_query), ProjectModel.aggregate(q)])
      // console.log('projects', projects)
      // console.log('count', count)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { projects, count: count[0]?.count || 0 })
    } catch (error) {
      return catchError('Project.getEmployeeProjects', error, req, res)
    }
  }

  async getProjectAllocatedEmployees(req, res) {
    try {
      const { id } = req.params
      const { page = 0, limit = 5, order, sort = 'dCreatedAt', search = '' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const project = await ProjectModel.findOne({ _id: ObjectId(id), eStatus: 'Y' }).lean()
      if (!project) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))
      }
      console.log('project', project)
      const q = [
        {
          $match: { iProjectId: ObjectId(id), eStatus: 'Y' }
        },
        {
          $lookup: {
            from: 'employees',
            let: { employeeId: '$iEmployeeId' },
            pipeline: [{
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$employeeId'] },
                    { $eq: ['$eStatus', 'Y'] }
                  ]
                }
              }
            }, {
              $project: { sName: 1, _id: 1 }
            }],
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
            from: 'projects',
            let: { projectId: '$iProjectId' },
            pipeline: [{
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$projectId'] },
                    { $eq: ['$eStatus', 'Y'] }
                  ]
                }
              }
            }, {
              $project: { sName: 1, _id: 1 }
            }],
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

      q.push()

      if (search) {
        q.push({
          $match: {
            $or: [
              { sName: { $regex: search, $options: 'i' } },
              { 'employee.sName': { $regex: search, $options: 'i' } },
              { 'project.sName': { $regex: search, $options: 'i' } }
            ]
          }
        })
      }

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      q.push({ $skip: parseInt(page) })
      q.push({ $limit: parseInt(limit) })

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      const [count, employee] = await Promise.all([ProjectWiseEmployee.aggregate(count_query), ProjectWiseEmployee.aggregate(q)])
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].employee), { employee, count: count[0]?.count || 0 })
    } catch (error) {
      return catchError('Project.getProjectAllocatedEmployees', error, req, res)
    }
  }

  async calc(req, res) {
    try {
      const { id } = req.query

      let op = 0; let od = 0; let dp = 0; let dd = 0
      let otp = 0; let otd = 0; let dtp = 0; let dtd = 0

      const project = await ProjectModel.findOne({ _id: ObjectId(id), eStatus: 'Y', eProjectType: 'Fixed' }).lean()
      console.log('project', project)
      op = project.sCost
      otp = project.nTimeLineDays

      const ProjectDepartments = await ProjectWiseDepartment.find({ iProjectId: ObjectId(id), eStatus: 'Y' }).lean()
      console.log('ProjectDepartments', ProjectDepartments)

      for (const i of ProjectDepartments) {
        od = od + i.nCost
        otd = otd + i.nMinutes
      }

      const dashboardProject = await DashboardProjectIndicatorModel.findOne({ iProjectId: ObjectId(id), eStatus: 'Y' }).lean()
      console.log('dashboardProject', dashboardProject)
      dp = dashboardProject.sCost
      dtp = dashboardProject.nTimeLineDays

      const dashboardProjectDepartments = await DashboardProjectDepartmentModel.find({ iProjectId: ObjectId(id), eStatus: 'Y' }).lean()
      console.log('dashboardProjectDepartments', dashboardProjectDepartments)

      for (const i of dashboardProjectDepartments) {
        dd = dd + i.nCost
        dtd = dtd + i.nMinutes
      }

      if (op !== dp || od !== dd || otp !== dtp || otd !== dtd) {
        console.log('project', project)
        console.log('op ', op, ' dp ', dp, ' od ', od, ' dd ', dd, ' otp ', otp, ' dtp ', dtp, ' otd ', otd, ' dtd ', dtd)
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { project })
    } catch (error) {
      return catchError('Project.calc', error, req, res)
    }
  }

  async cals(req, res) {
    try {
      let op = 0; let od = 0; let dp = 0; let dd = 0
      let otp = 0; let otd = 0; let dtp = 0; let dtd = 0
      const successful = []
      const unSuccessful = []

      const project = await ProjectModel.find({ eStatus: 'Y', eProjectType: 'Fixed' }).lean()

      for (const p of project) {
        op = p?.sCost || 0
        otp = p?.nTimeLineDays || 0

        const ProjectDepartments = await ProjectWiseDepartment.find({ iProjectId: p._id, eStatus: 'Y' }).lean()

        for (const i of ProjectDepartments) {
          od = od + i?.nCost || 0
          otd = otd + i?.nMinutes || 0
        }

        const dashboardProject = await DashboardProjectIndicatorModel.findOne({ iProjectId: ObjectId(p._id), eStatus: 'Y' }).lean()
        dp = dashboardProject?.sCost || 0
        dtp = dashboardProject?.nTimeLineDays || 0

        const dashboardProjectDepartments = await DashboardProjectDepartmentModel.find({ iProjectId: ObjectId(p._id), eStatus: 'Y' }).lean()

        for (const i of dashboardProjectDepartments) {
          dd = dd + i?.nCost || 0
          dtd = dtd + i?.nMinutes || 0
        }

        if (op !== dp || od !== dd || otp !== dtp || otd !== dtd) {
          unSuccessful.push({
            projectName: p.sName,
            projectId: p._id,
            projectType: p.eProjectType,
            projectStatus: p.eProjectStatus,
            'project cost': op,
            'dashboard cost': dp,
            'project department cost': od,
            'dashboard department cost': dd,
            'project timeline in days': otp,
            'dashboard timeline in days ': dtp,
            'project department allocation time in minutes': otd,
            'dashboard department allocation time in minutes': dtd
          })
        } else {
          successful.push({
            projectName: p.sName,
            projectId: p._id,
            projectType: p.eProjectType,
            projectStatus: p.eProjectStatus,
            'project cost': op,
            'dashboard cost': dp,
            'project department cost': od,
            'dashboard department cost': dd,
            'project timeline in days': otp,
            'dashboard timeline in days ': dtp,
            'project department allocation time in minutes': otd,
            'dashboard department allocation time in minutes': dtd
          })
        }
        op = 0; od = 0; dp = 0; dd = 0; otp = 0; otd = 0; dtp = 0; dtd = 0
      }

      console.log('successful', successful)
      console.log('unSuccessful', unSuccessful)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { done: 'done', successful, unSuccessful })
    } catch (error) {
      return catchError('Project.cals', error, req, res)
    }
  }

  async calcWorkLogsBasedProjects(req, res) {
    try {
      let count = 0
      const projects = await ProjectModel.find({ eStatus: 'Y' }).lean()
      const successFull = []
      const unSuccessFull = []
      for (const i of projects) {
        const dashboard = await DashboardProjectIndicatorModel.findOne({ iProjectId: i._id, eStatus: 'Y' }).lean()
        if (dashboard) {
          console.log('dashboard', dashboard?.nRemainingCost || 0)
          console.log('dashboard', dashboard?.nRemainingMinute || 0)
          count++
          const workLogs = await WorkLogModel.find({
            iProjectId: i._id,
            eStatus: 'Y',
            eWorkLogsType: 'P'
          }).lean()
          let total = 0
          let totalCost = 0
          let totalMinute = 0
          for (const j of workLogs) {
            totalCost = totalCost + j?.nCost || 0
            totalMinute = totalMinute + j?.nMinutes || 0
            total++
          }
          if ((dashboard?.nRemainingCost || 0) === totalCost && (dashboard?.nRemainingMinute || 0) === totalMinute) {
            successFull.push({
              projectName: i.sName,
              projectId: i._id,
              projectType: i.eProjectType,
              projectStatus: i.eProjectStatus,
              'total worklogs': total,
              'total cost': totalCost,
              'total minute': totalMinute,
              'dashboard remaining cost': dashboard?.nRemainingCost || 0,
              'dashboard remaining minute': dashboard?.nRemainingMinute || 0
            })
          } else {
            unSuccessFull.push({
              projectName: i.sName,
              projectId: i._id,
              projectType: i.eProjectType,
              projectStatus: i.eProjectStatus,
              'total worklogs': total,
              'total cost': totalCost,
              'total minute': totalMinute,
              'dashboard remaining cost': dashboard?.nRemainingCost || 0,
              'dashboard remaining minute': dashboard?.nRemainingMinute || 0
            })
          }
        }
      }
      console.log('count', count)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { done: 'done for Project only', successFull, unSuccessFull })
    } catch (error) {
      catchError('Project.calcWorkLogsBased', error, req, res)
    }
  }

  async calcWorkLogsBasedCrs(req, res) {
    try {
      let count = 0
      const crs = await ChangeRequestModel.find({ eStatus: 'Y' }).lean()
      const successFull = []
      const unSuccessFull = []
      for (const i of crs) {
        console.log('i', i.sName)
        const dashboard = await DashboardCrIndicatorModel.findOne({ iCrId: i._id, eStatus: 'Y' }).lean()
        if (dashboard) {
          console.log('dashboard', dashboard?.nRemainingCost || 0)
          console.log('dashboard', dashboard?.nRemainingMinute || 0)
          count++
          const workLogs = await WorkLogModel.find({
            iCrId: i._id,
            eStatus: 'Y',
            eWorkLogsType: 'CR'
          }).lean()
          let total = 0
          let totalCost = 0
          let totalMinute = 0
          for (const j of workLogs) {
            totalCost = totalCost + j?.nCost || 0
            totalMinute = totalMinute + j?.nMinutes || 0
            total++
          }
          console.log('total', total)

          if ((dashboard?.nRemainingCost || 0) === totalCost && (dashboard?.nRemainingMinute || 0) === totalMinute) {
            successFull.push({
              crName: i.sName,
              crId: i._id,
              projectId: i.iProjectId,
              eCrStatus: i?.eCrStatus || 'Pending',
              eProjectType: i?.eProjectType || 'Fixed',
              'total worklogs': total,
              'total cost': totalCost,
              'total minute': totalMinute,
              'dashboard remaining cost': dashboard?.nRemainingCost || 0,
              'dashboard remaining minute': dashboard?.nRemainingMinute || 0
            })
          } else {
            unSuccessFull.push({
              crName: i.sName,
              crId: i._id,
              projectId: i.iProjectId,
              eCrStatus: i?.eCrStatus || 'Pending',
              eProjectType: i?.eProjectType || 'Fixed',
              'total worklogs': total,
              'total cost': totalCost,
              'total minute': totalMinute,
              'dashboard remaining cost': dashboard?.nRemainingCost || 0,
              'dashboard remaining minute': dashboard?.nRemainingMinute || 0
            })
          }
        }
      }
      console.log('count', count)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].change_request), { done: 'done for CR only', successFull, unSuccessFull })
    } catch (error) {
      catchError('Project.calcWorkLogsBasedCrs', error, req, res)
    }
  }

  async getDepartmentProjectsDash(req, res) {
    try {
      const project = await ProjectModel.find({ eStatus: 'Y', eProjectType: 'Fixed' }).lean()
      const data = {}
      let count = 0
      const successFull = []
      const unSuccessFull = []
      for (const p of project) {
        const projectDepartments = await ProjectWiseDepartment.find({ iProjectId: p._id, eStatus: 'Y' }).populate({
          path: 'iDepartmentId',
          select: 'sName'
        }).lean()
        let totalProjectDepartment = 0
        const dataProjectDepartment = []
        for (const pd of projectDepartments) {
          totalProjectDepartment++
          dataProjectDepartment.push(pd)
        }
        let totalDashDepartment = 0
        const dataDashDepartment = []
        const dashboarddepartments = await DashboardProjectDepartmentModel.find({ iProjectId: p._id, eStatus: 'Y' }).populate({
          path: 'iDepartmentId',
          select: 'sName'
        }).lean()
        for (const dd of dashboarddepartments) {
          totalDashDepartment++
          dataDashDepartment.push(dd)
        }
        count = count + 1
        if (totalProjectDepartment !== totalDashDepartment) {
          unSuccessFull.push({
            projectName: p.sName,
            totalProjectDepartment,
            totalDashDepartment,
            dataProjectDepartment,
            dataDashDepartment
          })
        } else {
          successFull.push({
            projectName: p.sName,
            totalProjectDepartment,
            totalDashDepartment,
            dataProjectDepartment,
            dataDashDepartment
          })
        }
      }
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { done: 'done for Project only', data, successFull, unSuccessFull })
    } catch (error) {
      catchError('Project.getDepartmentProjectsDash', error, req, res)
    }
  }

  async getDepartmentCrDash(req, res) {
    try {
      const crs = await ChangeRequestModel.find({ eStatus: 'Y' }).lean()
      const data = {}
      let count = 0
      const successFull = []
      const unSuccessFull = []
      for (const c of crs) {
        const crDepartments = await CrWiseDepartmentModel.find({ iCrId: c._id, eStatus: 'Y' }).populate({
          path: 'iDepartmentId',
          select: 'sName'
        }).lean()
        let totalcrDepartment = 0
        const datacrDepartment = []
        for (const pd of crDepartments) {
          totalcrDepartment++
          datacrDepartment.push(pd)
        }
        let totalDashDepartment = 0
        const dataDashDepartment = []
        const dashboarddepartments = await DashboardCrDepartmentModel.find({ iCrId: c._id, eStatus: 'Y' }).populate({
          path: 'iDepartmentId',
          select: 'sName'
        }).lean()
        for (const dd of dashboarddepartments) {
          totalDashDepartment++
          dataDashDepartment.push(dd)
        }
        count = count + 1
        if (totalcrDepartment !== totalDashDepartment) {
          unSuccessFull.push({
            crName: c.sName,
            totalcrDepartment,
            totalDashDepartment,
            datacrDepartment,
            dataDashDepartment
          })
        } else {
          successFull.push({
            crName: c.sName,
            totalcrDepartment,
            totalDashDepartment,
            datacrDepartment,
            dataDashDepartment
          })
        }
      }
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].change_request), { done: 'done for CR only', data, successFull, unSuccessFull })
    } catch (error) {
      catchError('Project.getDepartmentCrDash', error, req, res)
    }
  }

  async checks3post(req, res) {
    try {
      const { ContentType, fileName } = req.body

      const obj = [
        {
          '.rtf': 'application/rtf'
        },
        {
          '.jpg': 'image/jpg'
        },
        {
          '.jpeg': 'image/jpeg'
        },
        {
          '.png': 'image/png'
        },
        {
          '.doc': 'application/msword'
        },
        {
          '.docx': 'application/msword'
        },
        {
          '.pdf': 'application/pdf'
        },
        {
          '.xml': 'application/xml'
        },
        {
          '.xlsx': 'application/vnd.ms-excel'
        },
        {
          '.xlsm': 'application/vnd.ms-excel'
        },
        {
          '.xlsb': 'application/vnd.ms-excel'
        },
        {
          '.xltx': 'application/vnd.ms-excel'
        },
        {
          '.xls': 'application/vnd.ms-excel'
        },
        {
          '.txt': 'text/plain'
        },
        {
          '.csv': 'text/csv'
        },
        {
          '.xps': 'application/vnd.ms-xpsdocument'
        },
        {
          '.ppt': 'application/vnd.ms-powerpoint'
        },
        {
          '.pptx': 'application/vnd.ms-powerpoint'
        },
        {
          '.zip': 'application/zip'
        },
        {
          '.rar': 'application/x-rar-compressed'
        },
        {
          '.7z': 'application/x-7z-compressed'
        }
      ]

      const extension = fileName.split('.').pop()
      if (!extension) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalidFileExtension)
      }

      const find = obj.find((i) => i[`.${extension}`])
      console.log('find', Object.values(find)[0])

      if (!find) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalidFileExtension)

      console.log('ContentType', ContentType)
      const data = await s3.generateUploadUrlForS3UsingPost(Object.values(find)[0], fileName)
      console.log('data', data)
      const emailTemplatePath = path.join(
        __dirname,
        '../../view',
        '1.html'
      )
      const template = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' })

      const datazHtml = ejs.render(template, {
        url: data.url.url,
        algorithm: data.url.fields['X-Amz-Algorithm'],
        credential: data.url.fields['X-Amz-Credential'],
        date: data.url.fields['X-Amz-Date'],
        policy: data.url.fields.Policy,
        key: data.url.fields.key,
        signature: data.url.fields['X-Amz-Signature'],
        ContentType: data.url.fields['Content-Type'],
        success_action_status: data.url.fields.success_action_status
      })
      console.log('datazHtml', datazHtml)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { data, datazHtml })
    } catch (error) {
      return catchError('Project.checks3post', error, req, res)
    }
  }

  async getProjectDepartments(req, res) {
    try {
      const { id } = req.query
      const projectExist = await ProjectModel.findOne({ _id: ObjectId(id), eStatus: 'Y' })
      if (!projectExist) return ErrorResponseSender(res, status.NOT_FOUND, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].project))

      let { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const q = [
        {
          $match: { iProjectId: ObjectId(id), eStatus: 'Y' }
        },
        {
          $lookup: {
            from: 'departments',
            let: { departmentId: '$iDepartmentId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$departmentId'] },
                      { $eq: ['$eStatus', 'Y'] }
                    ]
                  }
                }
              },
              {
                $project: {
                  sName: 1
                }
              }
            ],
            as: 'department'
          }
        }, {
          $unwind: {
            path: '$department',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            iProjectId: 1,
            iDepartmentId: 1,
            sName: '$department.sName'
          }
        }
      ]

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

      sort = sort === 'client' ? 'client.sClientName' : sort
      sort = sort === 'technology' ? 'technology.sTechnologyName' : sort
      sort = sort === 'projecttag' ? 'projecttag.sProjectTagName' : sort
      sort = sort === 'sName' ? 'sName' : sort
      sort = sort === 'dEndDate' ? 'dEndDate' : sort

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, projectDepartments] = await Promise.all([ProjectWiseDepartment.aggregate(count_query), ProjectWiseDepartment.aggregate(q)])

      if (req.path === '/DownloadExcel') {
        return projectDepartments
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { projectDepartments, count: count[0]?.count || 0 })
      }
    } catch (error) {
      return catchError('Project.getProjectDepartments', error, req, res)
    }
  }

  async projectEmployeeOfDepartment(req, res) {
    console.log('req.body', 'req.body')
    try {
      let employee = []
      let count = 0

      let { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt' } = req.query

      const { aDepartmentIds, id } = req.body

      const orderBy = order && order === 'asc' ? 1 : -1
      const projectExist = await ProjectModel.findOne({ _id: ObjectId(id), eStatus: 'Y' })
      if (!projectExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].project), { employee, count })

      if (aDepartmentIds.length > 0) {
        const checkMongoId = aDepartmentIds.every((id) => ObjectId.isValid(id))
        if (!checkMongoId) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].department), { employee, count })
      }
      const q = [
        {
          $match: { iProjectId: ObjectId(id), eStatus: 'Y' }
        },
        {
          $lookup: {
            from: 'employees',
            let: { employeeId: '$iEmployeeId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$employeeId'] },
                      { $eq: ['$eStatus', 'Y'] },
                      { $in: ['$iDepartmentId', aDepartmentIds.map((id) => ObjectId(id))] }
                    ]
                  }
                }
              },
              {
                $project: {
                  sName: 1,
                  sEmpId: 1,
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
            _id: 1,
            iProjectId: 1,
            iEmployeeId: 1,
            sName: '$employee.sName',
            sEmployeeId: '$employee.sEmpId',
            iDepartmentId: '$employee.iDepartmentId'
          }
        }
      ]

      // console.log(q[1].$lookup.pipeline[0].$match.$expr.$and[2].$in)

      if (search) {
        q.push({
          $match: {
            $or: [
              { sEmployeeName: { $regex: search, $options: 'i' } }
            ]
          }
        })
      }

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      sort = sort === 'client' ? 'client.sClientName' : sort
      sort = sort === 'technology' ? 'technology.sTechnologyName' : sort
      sort = sort === 'projecttag' ? 'projecttag.sProjectTagName' : sort
      sort = sort === 'sName' ? 'sName' : sort
      sort = sort === 'dEndDate' ? 'dEndDate' : sort

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      employee = await ProjectWiseEmployee.aggregate(q)
      count = await ProjectWiseEmployee.aggregate(count_query)

      if (req.path === '/DownloadExcel') {
        return employee
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { employee, count: count[0]?.count || 0 })
      }
    } catch (error) {
      return catchError('Project.projectEmployeeOfDepartment', error, req, res)
    }
  }

  async getProjectEmployee(req, res) {
    try {
      const { iProjectId, iEmployeeId } = req.body

      // if (!iProjectId) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].project))

      const project = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].project))

      const q = [
        {
          $match: { iProjectId: ObjectId(iProjectId), iEmployeeId: ObjectId(iEmployeeId), eStatus: 'Y' }
        },
        {
          $lookup: {
            from: 'employees',
            let: { employeeId: '$iEmployeeId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$employeeId'] },
                      { $eq: ['$eStatus', 'Y'] }
                    ]
                  }
                }
              },
              {
                $project: {
                  sName: 1,
                  sEmpId: 1,
                  _id: 1
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
        }
      ]
      const employee = await ProjectWiseEmployee.aggregate(q)
      console.log('employee', employee)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { employee: employee[0] })
    } catch (error) {
      catchError('Project.getProjectEmployee', error, req, res)
    }
  }

  async deleteProject1(req, res) {
    try {
      const { id } = req.params
      const project = await ProjectModel.findOne({ _id: ObjectId(id), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].project))
    } catch (error) {
      catchError('Project.deleteProject', error, req, res)
    }
  }

  async projectContract(req, res) {
    try {
      const { iProjectId, sContract } = req.body

      const projectExist = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!projectExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].project))

      const aProjectBaseContracts = await ProjectWiseContractModel.findOne({ iProjectId: ObjectId(iProjectId), eStatus: 'Y', sContract })

      if (aProjectBaseContracts) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].alreadyExist.replace('##', messages[req.userLanguage].contract))

      const getparams = {
        Bucket: config.S3_BUCKET_NAME,
        Key: sContract
      }
      const data = await s3.getObjectDetails(getparams)

      data.sContentLength = formatBytes(data.ContentLength)

      const projectContract = await ProjectWiseContractModel.create({
        iProjectId: req.body.iProjectId,
        sContract,
        sContentType: data.ContentType,
        sContentLength: data.sContentLength,
        dLastModified: data.LastModified,
        eStatus: 'Y',
        eProjectType: projectExist.eProjectType,
        iCreatedBy: req.employee._id,
        iLastUpdateBy: req.employee._id,
        sName: sContract.split('/')[sContract.split('/').length - 1]
      })

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].create_success.replace('##', messages[req.userLanguage].contract), { projectContract })
    } catch (error) {
      catchError('Project.projectContract', error, req, res)
    }
  }

  async deleteS3Contract(req, res) {
    try {
      const { sContract, id, iProjectId } = req.body

      const projectExist = await ProjectModel.findOne({ _id: ObjectId(iProjectId), eStatus: 'Y' })
      if (!projectExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].project))

      const objects = []

      if (id) {
        const projectContract = await ProjectWiseContractModel.findOne({ _id: ObjectId(id), eStatus: 'Y' })
        if (!projectContract) objects.push(projectContract.sFileName)
      }
      if (sContract && !objects.length) {
        const projectContract = await ProjectWiseContractModel.findOne({ sContract, eStatus: 'Y' })
        if (!projectContract) objects.push(projectContract.sFileName)
      }

      if (!objects.length) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].contract))

      const keys = []

      for (const k in objects) {
        keys.push({ Key: sContract[k] })
      }

      keys.map(item => console.log(item))

      const deleteParams = {
        Bucket: config.S3_BUCKET_NAME,
        Delete: {
          Objects: keys,
          Quiet: false
        }
      }

      await s3.deleteObjectsFromS3(deleteParams)

      await ProjectWiseContractModel.updateOne({ _id: ObjectId(id), eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].contract) })
    } catch (error) {
      catchError('Project.deleteS3Contract', error, req, res)
    }
  }

  // extra
  async getEmployeeProject(req, res) {
    try {
      const { iEmployeeId } = req.params
      const { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt', eProjectType = 'Fixed' } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1

      const employeeExist = await EmployeeModel.findOne({ _id: ObjectId(iEmployeeId), eStatus: 'Y' })
      if (!employeeExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].employee))

      // const projectGroup = await ProjectWiseEmployee.aggregate([
      //   {
      //     $match: { iEmployeeId: ObjectId(iEmployeeId), eStatus: 'Y' }
      //   },
      //   {
      //     $project: {
      //       iProjectId: 1,
      //       iEmployeeId: 1,
      //       eStatus: 1,
      //       nRemainingCost: { $ifNull: ['$nRemainingCost', 0] },
      //       nRemainingMinute: { $ifNull: ['$nRemainingMinute', 0] }
      //     }
      //   },
      //   {
      //     $group: {
      //       _id: '$iProjectId',
      //       iEmployeeId: { $first: '$iEmployeeId' },
      //       eStatus: { $first: '$eStatus' },
      //       nRemainingCost: { $sum: '$nRemainingCost' },
      //       nRemainingMinute: { $sum: '$nRemainingMinute' }
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: 'projects',
      //       let: { iProjectId: '$_id' },
      //       pipeline: [
      //         {
      //           $match: {
      //             $expr: {
      //               $and: [
      //                 { $eq: ['$_id', '$$iProjectId'] },
      //                 { $eq: ['$eStatus', 'Y'] }
      //               ]
      //             }
      //           }
      //         },
      //         {
      //           $project: {
      //             _id: 1,
      //             sProjectName: 1,

      //           }
      //         }
      //       ]
      //     }
      //   }
      // ])
      const q = []

      if (eProjectType === 'Fixed') {
        q.push(
          {
            $match: { iEmployeeId: ObjectId(iEmployeeId), eStatus: 'Y' }
          },
          {
            $project: {
              iProjectId: 1,
              iEmployeeId: 1,
              eStatus: 1,
              iDepartmentId: 1,
              nCost: { $ifNull: ['$nCost', 0] },
              nMinutes: { $ifNull: ['$nMinutes', 0] },
              nHours: { $ifNull: ['$nHours', 0] },
              eWorkLogsType: 1,
              sCurrencySymbol: 1,
              iCrId: 1,
              crCount: { $cond: [{ $ne: ['$iCrId', null] }, 1, 0] }
            }
          },
          {
            $group: {
              _id: '$iProjectId',
              iEmployeeId: { $first: '$iEmployeeId' },
              eStatus: { $first: '$eStatus' },
              iDepartmentId: { $first: '$iDepartmentId' },
              nCost: { $sum: '$nCost' },
              nMinutes: { $sum: '$nMinutes' },
              nHours: { $sum: '$nHours' },
              iProjectId: { $first: '$iProjectId' },
              eWorkLogsType: { $addToSet: '$eWorkLogsType' },
              sCurrencySymbol: { $addToSet: '$sCurrencySymbol' },
              crCount: { $sum: '$crCount' },
              iCrId: {
                $addToSet: {
                  $cond: [
                    { $ne: ['$iCrId', null] }, '$iCrId', null
                  ]
                }
              }
            }
          },
          {
            $lookup: {
              from: 'projects',
              let: { iProjectId: '$iProjectId' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$_id', '$$iProjectId'] },
                        { $eq: ['$eStatus', 'Y'] }
                      ]
                    }
                  }
                },
                {
                  $project: {
                    _id: 1,
                    sName: 1,
                    eProjectStatus: 1,
                    eProjectType: 1,
                    nTimeLineDays: { $ifNull: ['$nTimeLineDays', 0] },
                    sCost: {
                      $convert: {
                        input: '$sCost',
                        to: 'int',
                        onError: 0,
                        onNull: 0
                      }
                    }
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
        )
      }

      if (eProjectType === 'Dedicated') {
        q.push(
          {
            $match: { iEmployeeId: ObjectId(iEmployeeId), eStatus: 'Y' }
          },
          {
            $project: {
              iProjectId: 1,
              iEmployeeId: 1,
              eStatus: 1,
              iDepartmentId: 1,
              nCost: { $ifNull: ['$nCost', 0] },
              nMinutes: { $ifNull: ['$nMinutes', 0] },
              nHours: { $ifNull: ['$nHours', 0] },
              eWorkLogsType: 1,
              sCurrencySymbol: 1,
              iCrId: 1,
              crCount: { $cond: [{ $ne: ['$iCrId', null] }, 1, 0] }
            }
          },
          {
            $group: {
              _id: '$iProjectId',
              iEmployeeId: { $first: '$iEmployeeId' },
              eStatus: { $first: '$eStatus' },
              iDepartmentId: { $first: '$iDepartmentId' },
              nCost: { $sum: '$nCost' },
              nMinutes: { $sum: '$nMinutes' },
              nHours: { $sum: '$nHours' },
              iProjectId: { $first: '$iProjectId' },
              eWorkLogsType: { $addToSet: '$eWorkLogsType' },
              sCurrencySymbol: { $addToSet: '$sCurrencySymbol' },
              crCount: { $sum: '$crCount' },
              iCrId: {
                $addToSet: {
                  $cond: [
                    { $ne: ['$iCrId', null] }, '$iCrId', null
                  ]
                }
              }
            }
          },
          {
            $lookup: {
              from: 'projects',
              let: { iProjectId: '$iProjectId' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$_id', '$$iProjectId'] },
                        { $eq: ['$eStatus', 'Y'] }
                      ]
                    }
                  }
                },
                {
                  $project: {
                    _id: 1,
                    sName: 1,
                    eProjectStatus: 1,
                    eProjectType: 1,
                    nTimeLineDays: { $ifNull: ['$nTimeLineDays', 0] },
                    sCost: {
                      $convert: {
                        input: '$sCost',
                        to: 'int',
                        onError: 0,
                        onNull: 0
                      }
                    }
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
        )
      }

      if (eProjectType) {
        q[0].$match.eProjectType = eProjectType
      }

      if (search) {
        q.push({
          $match: {
            $or: [
              { 'project.sName': { $regex: search, $options: 'i' } }
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

      const [count, worklogs] = await Promise.all([WorkLogModel.aggregate(count_query), WorkLogModel.aggregate(q)])
      if (req.path === '/DownloadExcel') {
        return worklogs
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { worklogs, count: count[0]?.count || 0 })
      }
    } catch (error) {
    }
  }

  async getTotalEmployeeRevenue(req, res) {
    try {
      const { iEmployeeId } = req.params
      const worklogs = await WorkLogModel.aggregate([
        {
          $match: { iEmployeeId: ObjectId(iEmployeeId), eStatus: 'Y' }
        },
        {
          $project: {
            iProjectId: 1,
            nCost: { $ifNull: ['$nCost', 0] },
            sCurrencySymbol: 1,
            nMinutes: { $ifNull: ['$nMinutes', 0] }
          }
        },
        {
          $group: {
            _id: '$sCurrencySymbol',
            nCost: { $sum: '$nCost' },
            nMinutes: { $sum: '$nMinutes' },
            iProjectId: { $addToSet: '$iProjectId' }
          }
        }
      ])

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { worklogs })
    } catch (error) {
      catchError('Project.getTotalEmployeeRevenue', error, req, res)
    }
  }

  async getClosedProjects(req, res) {
    try {
      let { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt', iTechnologyId, eProjectType, iDepartmentId, iEmployeeId } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      console.log('req.query', req.query)

      const jobProfileData = await EmployeeModel.findOne({ _id: req.employee._id }, { iJobProfileId: 1, eShowAllProjects: 1 }).populate({ path: 'iJobProfileId', select: 'nLevel' }).lean()

      const q = [
        {
          $match: { eStatus: 'Y', eProjectStatus: { $eq: 'Closed' } }
        },
        {
          $lookup: {
            from: 'projectwisetechnologies',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'technologies',
                  let: { technologyId: '$iTechnologyId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$technologyId'] }, eStatus: 'Y' } },
                    { $project: { sTechnologyName: '$sName' } }
                  ],
                  as: 'technology'
                }
              },
              { $unwind: { path: '$technology', preserveNullAndEmptyArrays: true } },
              { $sort: { 'technology.sTechnologyName': 1 } },
              { $project: { _id: '$technology._id', sTechnologyName: '$technology.sTechnologyName' } }
            ],
            as: 'technology'
          }
        },
        {
          $lookup: {
            from: 'projectwisetags',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'projecttags',
                  let: { projectTagId: '$iProjectTagId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$projectTagId'] }, eStatus: 'Y' } },
                    { $project: { sProjectTagName: '$sName', sBackGroundColor: '$sBackGroundColor', sTextColor: '$sTextColor' } }
                  ],
                  as: 'projecttag'
                }
              },
              { $unwind: { path: '$projecttag', preserveNullAndEmptyArrays: true } },
              { $sort: { 'projecttag.sProjectTagName': 1 } },
              {
                $project:
                {
                  _id: '$projecttag._id',
                  sProjectTagName: '$projecttag.sProjectTagName',
                  sBackGroundColor: '$projecttag.sBackGroundColor',
                  sTextColor: '$projecttag.sTextColor'
                }
              }
            ],
            as: 'projecttag'
          }
        },
        {
          $lookup: {
            from: 'projectwiseclients',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'clients',
                  let: { clientId: '$iClientId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$clientId'] }, eStatus: 'Y' } },
                    { $project: { sClientName: '$sName' } }
                  ],
                  as: 'client'
                }
              },
              { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
              { $sort: { 'client.sClientName': 1 } },
              {
                $project:
                {
                  _id: '$client._id',
                  sClientName: '$client.sClientName'
                }
              }
              // { $replaceRoot: { newRoot: '$client' } }
            ],
            as: 'client'
          }
        },
        {
          $lookup: {
            from: 'projectwisedepartments',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'departments',
                  let: { departmentId: '$iDepartmentId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$departmentId'] }, eStatus: 'Y' } },
                    { $project: { sDepartmentName: '$sName' } }
                  ],
                  as: 'department'
                }
              },
              { $unwind: { path: '$department', preserveNullAndEmptyArrays: false } },
              { $sort: { 'department.sDepartmentName': 1 } },
              { $project: { sDepartmentName: '$department.sDepartmentName', iDepartmentId: '$department._id' } }
            ],
            as: 'department'
          }
        },
        {
          $lookup: {
            from: 'projectwiseemployees',
            let: { projectId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
              {
                $lookup: {
                  from: 'employees',
                  let: { employeeId: '$iEmployeeId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$employeeId'] }, eStatus: 'Y' } },
                    { $project: { sEmployeeName: '$sName' } }
                  ],
                  as: 'employee'
                }
              },
              { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
              { $sort: { 'employee.sEmployeeName': 1 } },
              { $project: { sEmployeeName: '$employee.sEmployeeName', iEmployeeId: '$employee._id' } }
            ],
            as: 'employee'
          }
        },
        {
          $project: {
            _id: '$_id',
            sName: '$sName',
            client: '$client',
            technology: '$technology',
            projecttag: '$projecttag',
            dCreatedAt: '$dCreatedAt',
            dEndDate: '$dEndDate',
            eProjectType: '$eProjectType',
            department: '$department',
            employee: '$employee',
            eProjectStatus: 1
          }
        }
      ]

      if (jobProfileData.eShowAllProjects === 'OWN') {
        const projectEmployee = await ProjectwiseemployeeModel.find({ eStatus: 'Y', iEmployeeId: ObjectId(req.employee._id) }, { iProjectId: 1 }).lean()
        const department = await DepartmentModel.findOne({ eStatus: 'Y', _id: ObjectId(req.employee.iDepartmentId) }).lean()

        q[0].$match.$or = [
          { iBDId: ObjectId(req.employee._id) },
          { iProjectManagerId: ObjectId(req.employee._id) },
          { iBAId: ObjectId(req.employee._id) },
          { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
        ]
      }

      if (eProjectType) {
        q[0].$match.eProjectType = eProjectType
      }

      if (iDepartmentId) {
        q.push({ $match: { 'department.iDepartmentId': ObjectId(iDepartmentId) } })
      }

      if (iEmployeeId) {
        q.push({ $match: { 'employee.iEmployeeId': ObjectId(iEmployeeId) } })
      }

      if (search) {
        q.push({
          $match: {
            $or: [
              { sName: { $regex: search, $options: 'i' } },
              { 'client.sClientName': { $regex: search, $options: 'i' } },
              { 'technology.sTechnologyName': { $regex: search, $options: 'i' } },
              { 'projecttag.sProjectTagName': { $regex: search, $options: 'i' } }
            ]
          }
        })
      }

      if (iTechnologyId) {
        q.push({ $match: { 'technology._id': ObjectId(iTechnologyId) } })
      }

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      sort = sort === 'client' ? 'client.sClientName' : sort
      sort = sort === 'technology' ? 'technology.sTechnologyName' : sort // not working beacuse of array of object in technology
      sort = sort === 'projecttag' ? 'projecttag.sProjectTagName' : sort// not working beacuse of array of object in projecttag
      sort = sort === 'sName' ? 'sName' : sort
      sort = sort === 'dEndDate' ? 'dEndDate' : sort

      const sorting = { [sort]: orderBy }

      q.push({ $sort: sorting })
      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, projects] = await Promise.all([ProjectModel.aggregate(count_query), ProjectModel.aggregate(q)])
      if (req.path === '/DownloadExcel') {
        return projects
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { projects, count: count[0]?.count || 0 })
      }
    } catch (error) {
      console.log(error)
      return catchError('Project.getClosedProjects', error, req, res)
    }
  }

  async projectRetrive(req, res) {
    try {
      const { id } = req.params
      const project = await ProjectModel.findOne({ _id: ObjectId(id), eStatus: 'Y' })
      if (!project) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].project))

      const projectRetrive = await ProjectModel.findByIdAndUpdate({ _id: ObjectId(id), eStatus: 'Y' }, { eProjectStatus: 'In Progress', iLastUpdateBy: req.employee._id }, { new: true })

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].project))
    } catch (error) {
      catchError('Project.projectRetrive', error, req, res)
    }
  }
}

module.exports = new Project()
