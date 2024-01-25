/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const RoleModel = require('./model')
const JobProfileModel = require('../JobProfile/model')
const DepartmentModel = require('../Department/model')
const Logs = require('../Logs/model')
const PermissionModel = require('../Permission/model')
const { status, messages } = require('../../helper/api.responses')
const { catchError, keygen, ErrorResponseSender, SuccessResponseSender, paginationValue, searchValidate, getRandomColor, checkcolor, generateConfig } = require('../../helper/utilities.services')
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
    const data = await RoleModel.findOne({ _id: params })

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
      iRoleId: data._id,
      sName: data.sName,
      iCreatedBy: data.iLastUpdateBy,
      sType: 'role',
      sUrl: url,
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
      sType: 'role',
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
class Role {
  async addRole(req, res) {
    try {
      const { sName, aPermission, bIsDefault = false } = req.body
      const role = await RoleModel.findOne({ sKey: keygen(sName), eStatus: 'Y' }).lean()
      if (role) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].role))

      if (aPermission.length !== 0) {
        for (const permission of aPermission) {
          const existPermission = await PermissionModel.findOne({ _id: permission, eStatus: 'Y' })
          if (!existPermission) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].permission))
        }
      }
      const sColor = await RoleModel.find({ eStatus: 'Y' }).lean()

      let s = getRandomColor()
      if (sColor.length) {
        s = checkcolor(s, sColor)
      }

      const data = await RoleModel.create([{ bIsDefault, sName, sKey: keygen(sName), sBackGroundColor: s.sBackGroundColor, sTextColor: s.sTextColor, iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id, aPermissions: aPermission }])
      // let take = `Logs${new Date().getFullYear()}`

      // take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Role', sService: 'addRole', eAction: 'Create', oNewFields: data, oBody: req.body, oParams: req.params, oQuery: req.query, sDbName: `Logs${new Date().getFullYear()}` }
      // await take.create(logs)

      await queuePush('logs', logs)

      // await notificationsender(req, data._id, ' role is create ', true, true, req.employee._id, `${config.urlPrefix}/role/${data._id}`)
      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].role), {
        id: data._id
      })
    } catch (error) {
      return catchError('Role.addRole', error, req, res)
    }
  }

  async deleteRole(req, res) {
    try {
      const role = await RoleModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!role) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))

      if (role.bIsSystem || role.bIsDefault) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].assigned_to_system.replace('##', messages[req.userLanguage].role))

      // console.log('1', role)
      // const employeeProfile = await EmployeeModel.findOne({ 'aSkills.iSkillId': { $in: [req.params.id] }, eStatus: 'Y' }, {}).lean()
      // if (employeeProfile) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].in_used_employee.replace('##', messages[req.userLanguage].skill))

      // checkn if role is exzist in empployee or not
      // const roleExistinEmployee = await EmployeeModel.findOne({ 'aRole.iRoleId': role._id }).lean()

      // if (roleExistinEmployee) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].assigned_to_employee.replace('##', messages[req.userLanguage].role))

      if (role && role.eStatus === 'Y') {
        const data = await RoleModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))
        // let take = `Logs${new Date().getFullYear()}`

        // take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Role', sService: 'deleteRole', eAction: 'Delete', oOldFields: data, oBody: req.body, oParams: req.params, oQuery: req.query, sDbName: `Logs${new Date().getFullYear()}` }

        await queuePush('logs', logs)

        // await take.create(logs)

        // await notificationsender(req, data._id, ' role is delete ', true, true, req.employee._id, `${config.urlPrefix}/role/${data._id}`)
        return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].role))
      }

      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))
    } catch (error) {
      return catchError('Role.deleteRole', error, req, res)
    }
  }

  async updateRole(req, res) {
    try {
      const { sName, aPermission } = req.body
      const role = await RoleModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!role) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))

      if (role && role.eStatus === 'Y') {
        const roleKey = await RoleModel.findOne({ sKey: keygen(sName), eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
        if (roleKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].role))

        // check all permission is valid or not
        const newPermission = []
        if (aPermission.length !== 0) {
          for (const permission of aPermission) {
            const existPermission = await PermissionModel.findOne({ _id: permission, eStatus: 'Y', bIsActive: true })
            // if (!existPermission) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].permission))
            // newPermission.push({
            //   sKey: existPermission.sKey
            // })
            if (existPermission) {
              if (newPermission.findIndex((p) => p === existPermission._id) === -1) { newPermission.push(existPermission._id) }
            }
          }
        }

        // if (applyInAll) {
        //   const employee = await EmployeeModel.find({ eStatus: 'Y' }).lean()
        //   if (employee.length !== 0) {
        //     for (const e of employee) {
        //       const permission = e.aPermissions
        //       if (e.aRoles.length !== 0) {
        //         const roleIndex = e.aRoles.findIndex((r) => r.iRoleId.toString() === req.params.id)
        //         if (roleIndex !== -1) {
        //           for (const np of newPermission) {
        //             const permissionIndex = permission.findIndex((p) => p.sKey === np.sKey)
        //             if (permissionIndex === -1) {
        //               permission.push(np)
        //             }
        //           }
        //         }
        //       }
        //       await EmployeeModel.findOneAndUpdate({ _id: e._id }, { aPermissions: permission }, { runValidators: true, new: true })
        //     }
        //   }
        // }
        const data = {}
        if (role.bIsSystem) {
          const data = await RoleModel.findByIdAndUpdate({ _id: req.params.id }, { iLastUpdateBy: req.employee._id, aPermissions: aPermission }, { runValidators: true, new: true })
        } else {
          const data = await RoleModel.findByIdAndUpdate({ _id: req.params.id }, { sName, sKey: keygen(sName), iLastUpdateBy: req.employee._id, aPermissions: aPermission }, { runValidators: true, new: true })
        }

        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))
        // let take = `Logs${new Date().getFullYear()}`

        // take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Role', sService: 'updateSkills', eAction: 'Update', oOldFields: role, oNewFields: data, oBody: req.body, oParams: req.params, oQuery: req.query, sDbName: `Logs${new Date().getFullYear()}` }

        await queuePush('logs', logs)
        // await take.create(logs)

        // await notificationsender(req, data._id, ' role is update ', true, true, req.employee._id, `${config.urlPrefix}/role/${data._id}`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].role))
      }

      return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].role))
    } catch (error) {
      return catchError('Role.updateRole', error, req, res)
    }
  }

  async getRoles(req, res) {
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

      // const [roles, total] = await Promise.all([RoleModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).populate({
      //   path: 'aPermissions',
      //   select: 'sKey sName eStatus bIsActive',
      //   match: { eStatus: 'Y', bIsActive: true }
      // }).lean(),
      let roles = []
      let total = 0

      if (limit !== 'all') {
        [roles, total] = await Promise.all([RoleModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).populate({
          path: 'aPermissions',
          select: 'sKey sName sModule eStatus bIsActive'
        }).lean(),
        RoleModel.countDocuments({ ...query }).lean()])
      } else {
        [roles, total] = await Promise.all([RoleModel.find(query).sort(sorting).lean(),
        RoleModel.countDocuments({ ...query }).lean()])
      }

      if (req.path === '/DownloadExcel') {
        return roles
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].role), { roles, count: total })
      }
    } catch (error) {
      return catchError('Role.getRoles', error, req, res)
    }
  }

  async getRole(req, res) {
    try {
      const { id } = req.params

      const data = await RoleModel.findOne({ _id: id, eStatus: 'Y' }).populate({
        path: 'aPermissions',
        match: { eStatus: 'Y' },
        select: 'sKey sName sModule eStatus bIsActive bIsSystem'
      }).lean()

      if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].role), data)
    } catch (error) {
      return catchError('Role.getRole', error, req, res)
    }
  }
}

module.exports = new Role()
