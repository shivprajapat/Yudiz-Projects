/* eslint-disable indent */
/* eslint-disable camelcase */

const PermissionModel = require('./model')
const DepartmentModel = require('../Department/model')
const JobProfileModel = require('../JobProfile/model')
const Logs = require('../Logs/model')
const { status, messages, jsonStatus } = require('../../helper/api.responses')
const { uniqByKeepLast, catchError, keygen, ErrorResponseSender, SuccessResponseSender, paginationValue, searchValidate, getRandomColor, checkcolor, generateConfig, permissionName, permissionKey } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
// const { subscribeUsers, pushNotification, pushTopicNotification, unsubscribeUsers } = require('../../helper/firebase.service')
const { queuePush } = require('../../helper/redis')
const EmployeeModel = require('../Employee/model')
const nodemailer = require('nodemailer')
// const { google } = require('googleapis')
// const axios = require('axios')
// const OAuth2 = google.auth.OAuth2
const config = require('../../config/config')
const jwt = require('jsonwebtoken')

// const postmark = require('postmark')
const moment = require('moment')
const RoleModel = require('../Role/model')
const confg = require('../../config/config')

// const OneSignal = require('onesignal-node')

const { ResourceManagementDB } = require('../../database/mongoose')

// const oAuth2Client = new OAuth2(
//   // '203916001251-umcaatlm3clsp1qdba0vl3op19akmgfp.apps.googleusercontent.com',
//   // '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',
//   // 'https://developers.google.com/oauthplayground'
//   '203916001251-umcaatlm3clsp1qdba0vl3op19akmgfp.apps.googleusercontent.com',
//   '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',
//   'https://developers.google.com/oauthplayground'
// )

// oAuth2Client.setCredentials({ refresh_token: '1//04vQA9yuXqjKoCgYIARAAGAQSNwF-L9IrexqN80-4xFW1d9jJsv_JJ1WBirmbKjjAXbKTXUwd0LCRe80sW6O4DqJ5Rn0uV6mV60c' })

// Example request

// const { sendNotifications } = require('../../queue')

const ObjectId = mongoose.Types.ObjectId

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await PermissionModel.findOne({ _id: params })
    console.log(data)

    const department = await DepartmentModel.find({
      eStatus: 'Y',
      bIsSystem: true,
      sKey: {
        $in: ['HR', 'ADMIN']
      }
    }, { _id: 1 }).lean()

    // const jobProfile = await JobProfileModel.find({
    //   eStatus: 'Y',
    //   sPrefix: {
    //     $in: ['Superior', 'Head', 'Lead', 'Other', 'Manager']
    //   }
    // }, { _id: 1 }).lean()

    const allEmployee = await EmployeeModel.find({
      eStatus: 'Y',
      $or: [
        { iDepartmentId: { $in: department.map((item) => item._id) } }
        // { iJobProfileId: { $in: jobProfile.map((item) => item._id) } }
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
      iPermissionId: data._id,
      sName: data.sName,
      iCreatedBy: data.iLastUpdateBy,
      sUrl: url,
      sType: 'permission',
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
      sBody: `${data.sName}${sBody}by ${person.sName}(${person.sEmpId})`,
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      sType: 'permission',
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

async function notificationForUpdatePermission(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await EmployeeModel.findOne({ eStatus: 'Y', _id: params }).populate({
      path: 'iDepartmentId',
      select: 'sName sKey eStatus'
    })
    const departmentList = ['ADMIN', 'PRODUCTDEVELOPMENT', 'OPERATION', 'MANAGEMENT']
    if (!data?.iDepartmentId?.sKey) {
      departmentList.push(data?.iDepartmentId?.sKey)
    }

    const department = await DepartmentModel.find({
      eStatus: 'Y',
      bIsSystem: true,
      sKey: {
        $in: departmentList
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
      iEmployeeId: data._id,
      sName: data.sName,
      iCreatedBy: data.iLastUpdateBy,
      sType: 'permission',
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
      sType: 'permission',
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

class Permission {
  async addPermission(req, res) {
    try {
      const { sName, sModule } = req.body
      const permission = await PermissionModel.findOne({ $or: [{ sName: permissionName(sName) }, { sKey: permissionKey(sName) }], eStatus: 'Y' }).lean()
      if (permission) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].permission))

      const data = await PermissionModel.create([{ sName: permissionName(sName), sKey: permissionKey(sName), sModule: sModule.toUpperCase(), iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id, bIsActive: true }])

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Permission', sService: 'addPermission', eAction: 'Create', oNewFields: data }
      await take.create(logs)

      // await notificationsender(req, data._id, ' permission is create ', true, true, req.employee._id, `${config.urlPrefix}/permission/${data._id}`)
      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].permission), {
        id: data._id
      })
    } catch (error) {
      return catchError('Permission.addPermission', error, req, res)
    }
  }

  async deletePermission(req, res) {
    try {
      const permission = await PermissionModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!permission) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))

      // const employeeProfile = await EmployeeModel.findOne({ 'aSkills.iSkillId': { $in: [req.params.id] }, eStatus: 'Y' }).lean()
      // if (employeeProfile) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].in_used_employee.replace('##', messages[req.userLanguage].skill))

      const permissionExistInRole = await RoleModel.findOne({
        aPermissions: {
          $elemMatch: {
            $eq: ObjectId(permission._id)
          }
        }
      })

      if (permissionExistInRole) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].assigned_to_role.replace('##', messages[req.userLanguage].permission))

      const permissionExistInEmployee = await EmployeeModel.findOne({ 'aTotalPermissions.sKey': permission.sKey }).lean()
      if (permissionExistInEmployee) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].assigned_to_employee.replace('##', messages[req.userLanguage].permission))

      if (permission && permission.eStatus === 'Y') {
        const data = await PermissionModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Permission', sService: 'deletePermission', eAction: 'Delete', oOldFields: data }

        await Logs.create(logs)

        // await notificationsender(req, data._id, ' permission is delete ', true, true, req.employee.iLastUpdateBy, `${config.urlPrefix}/permission/${data._id}`)
        return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].permission))
      }

      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))
    } catch (error) {
      return catchError('Permission.deletePermission', error, req, res)
    }
  }

  async updatePermission(req, res) {
    try {
      const { sName, bIsActive } = req.body
      const permission = await PermissionModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!permission) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))
      if (permission && permission.eStatus === 'Y') {
        const permissionKey = await PermissionModel.findOne({ eStatus: 'Y', _id: { $ne: req.params.id }, sName: permissionName(sName) }).lean()
        if (permissionKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].permission))
        const data = await PermissionModel.findByIdAndUpdate({ _id: req.params.id, eStatus: 'Y' }, { bIsActive, iLastUpdateBy: req.employee._id, sName: permissionName(sName) }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))

        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Permission', sService: 'updatePermission', eAction: 'Update', oOldFields: permission, oNewFields: data }
        await take.create(logs)
        // await notificationsender(req, data._id, ' permission is update ', true, true, req.employee._id, `${config.urlPrefix}/permission/${data._id}`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].permission))
      }
      return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].permission))
    } catch (error) {
      return catchError('Permission.updatePermission', error, req, res)
    }
  }

  async getPermissions(req, res) {
    try {
      let { page, limit, sorting, search = '' } = paginationValue(req.query)
      search = searchValidate(search)
      const query = search && search.length
        ? {
          $or: [{ sKey: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
          { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
          ],
          eStatus: 'Y'
        }
        : { eStatus: 'Y' }

      let permissions = []; let total = 0

      if (limit !== 'all') {
        [permissions, total] = await Promise.all([PermissionModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(), PermissionModel.countDocuments({ ...query }).lean()])
      } else {
        [permissions, total] = await Promise.all([PermissionModel.find(query).sort(sorting).lean(), PermissionModel.countDocuments({ ...query }).lean()])
      }

      if (req.path === '/DownloadExcel') {
        return permissions
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].permission), { permissions, count: total })
      }
    } catch (error) {
      return catchError('Permission.getPermissions', error, req, res)
    }
  }

  async updateUserPermission(req, res) {
    try {
      const { iEmployeeId, aPermissions } = req.body

      const user = await EmployeeModel.findById({ _id: iEmployeeId, eStatus: 'Y' }).lean()
      if (!user) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user))

      // if (aRole.length === 0) {
      //   return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].required.replace('##', messages[req.userLanguage].role) })
      // }

      // const role = []
      // const permission = []
      // for (const role of aRole) {
      //   const roleExit = await RoleModel.findOne({ _id: role, eStatus: 'Y' }).populate(
      //     {
      //       path: 'aPermissions',
      //       select: 'sKey sName bIsActive _id eStatus',
      //       match: { eStatus: 'Y', bIsActive: true }
      //     }
      //   ).lean()
      //   if (!roleExit) {
      //     return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))
      //   } else {
      //     role.push({
      //       iRoleId: roleExit._id,
      //       sName: roleExit.sName,
      //       sKey: roleExit.sKey
      //     })
      //     for (const permisison of roleExit.aPermissions) {
      //       permission.push({
      //         iPermissionId: permisison._id,
      //         iRoleId: roleExit._id
      //       })
      //     }
      //   }

      //   let permissionCheck = aPermissions.map(JSON.stringify)
      //   permissionCheck = new Set(permissionCheck)
      //   permissionCheck = Array.from(permissionCheck).map(JSON.parse)

      //   for (const permisison of permissionCheck) {
      //     const permissionExit = await PermissionModel.findOne({ _id: permisison, eStatus: 'Y', bIsActive: true }).lean()
      //     if (!permissionExit) {
      //       return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))
      //     }
      //   }

      //   // if (roleExit) {
      //   //   if (roleExit.aPermissions.length > 0) {
      //   //     for (const permission of aPermissions) {
      //   //       const permissionExit = roleExit.aPermissions.find(p => p._id.toString() === permission.toString())
      //   //       if (!permissionExit) {
      //   //         return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))
      //   //       }
      //   //     }
      //   //   }
      //   // }
      // }

      // const roles = []
      // if (aRole.length > 0) {
      //   for (const r of aRole) {
      //     const role = await RoleModel.findOne({ _id: r._id, eStatus: 'Y' }).populate(
      //       {
      //         path: 'aPermissions',
      //         select: 'sKey sName bIsActive _id eStatus',
      //         match: { eStatus: 'Y', bIsActive: true }
      //       }
      //     ).lean()
      //     if (role) {
      //       role.push({
      //         iRoleId: role._id,
      //         sName: role.sName,
      //         sKey: role.sKey,
      //         aPermissions: role.aPermissions
      //       })
      //     } else {
      //       return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))
      //     }
      //   }
      // }

      // const permissions = []
      // if (aPermissions.length > 0) {
      //   for (const p of aPermissions) {
      //     const permission = await PermissionModel.findOne({ _id: p._id, eStatus: 'Y', bIsActive: true }).lean()
      //     if (!permission) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))
      //     permissions.push({
      //       sKey: permission.sKey
      //     })
      //   }
      // }

      // let roleCheck = []
      // for (const p of permissions) {
      //   for (const r of roles) {
      //     const permission = r.aPermissions.some((x) => x.sKey === p.sKey)
      //     if (permission) {
      //       if (roleCheck.some((x) => x.sKey === r.sKey)) {
      //         continue
      //       } else {
      //         roleCheck.push({
      //           iRoleId: r._id,
      //           sName: r.sName,
      //           sKey: r.sKey
      //         })
      //       }
      //       if (roleCheck.length === roles.length) break
      //     }
      //   }
      // }

      // if (roleCheck.length === 0) {
      //   roleCheck = user.aRole
      // }
      // if (aPermissions.length === 0 || permissions.length === 0) {
      //   permissions = user.aPermissions
      // }

      // const permission = [
      //   {
      //     sKey: 'user',
      //     aRoleId: ['5f9f1b0b1b9d2c2b8c8b8b8b', '5f9f1b0b1b9d2c2b8c8b8b8c']
      //   },
      //   {
      //     sKey: 'role',
      //     aRoleId: []
      //   },
      //   {
      //     sKey: 'permission',
      //     aRoleId: ['5f9f1b0b1b9d2c2b8c8b8b8c']
      //   }
      // ]

      // permission check
      const role = []
      const permission = []
      for (const p of req.body.aPermissions) {
        let permissionRole = []
        const permissionExit = await PermissionModel.findOne({ sKey: p.sKey, eStatus: 'Y', bIsActive: true }).lean()
        if (!permissionExit) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))

        for (const r of p.aRoleId) {
          if (!permissionRole.find(x => x === r)) {
            permissionRole.push(r)
          }
          if (!role.find(x => x === r)) {
            role.push(r)
          }
        }
        permission.push({
          sKey: permissionExit.sKey,
          aRoleId: permissionRole.length ? permissionRole : []
        })
        permissionRole = []
      }
      const userRole = []
      for (const r of role) {
        const roleExit = await RoleModel.findOne({ _id: ObjectId(r), eStatus: 'Y' }).lean()
        if (!roleExit) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))
        userRole.push({
          iRoleId: roleExit._id,
          sName: roleExit.sName,
          sKey: roleExit.sKey,
          sBackGroundColor: roleExit.sBackGroundColor,
          sTextColor: roleExit.sTextColor
        })
      }

      // console.log('userRole', userRole)
      // console.log('permission', JSON.stringify(permission))

      // if (!userRole.length) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].at_least_one.replace('##', messages[req.userLanguage].role))

      const data = await EmployeeModel.findByIdAndUpdate({ _id: iEmployeeId, eStatus: 'Y' }, { aTotalPermissions: aPermissions, aRoles: userRole, iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Permission', sService: 'updateUserPermission', eAction: 'Update', oOldFields: user, oNewFields: data }
      await take.create(logs)
      // await notificationForUpdatePermission(req, data._id, ' permission is update ', true, true, req.employee._id, `${config.urlPrefix}/employee/${data._id}`)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].user))
    } catch (error) {
      catchError('Permission.updateUserPermission', error, req, res)
    }
  }

  async updatePermissions(req, res) {
    try {
      const { aPermissions } = req.body

      for (const p of aPermissions) {
        const permission = await PermissionModel.findOne({ _id: p._id, eStatus: 'Y' }).lean()
        if (!permission) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))
      }

      for (const p of aPermissions) {
        const permission = await PermissionModel.findOneAndUpdate({ _id: p._id, eStatus: 'Y' }, { bIsActive: p.bIsActive, iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!permission) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].permission))
    } catch (error) {
      catchError('Permission.updatePermissions', error, req, res)
    }
  }
}

module.exports = new Permission()
