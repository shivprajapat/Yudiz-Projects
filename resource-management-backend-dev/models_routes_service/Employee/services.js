/* eslint-disable camelcase */
const { status, jsonStatus, messages } = require('../../helper/api.responses')
const EmployeeModel = require('./model')
const EmployeeCurrencyModel = require('./employeeCurrency.model')
const CurrencyModel = require('../Currency/model')
const s3 = require('../../helper/s3')
const { generateUploadUrl } = require('../../helper/s3')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const Logs = require('../Logs/model')
const DepartmentModel = require('../Department/model')
const JobProfileModel = require('../JobProfile/model')
const ProjectWiseEmployee = require('../Project/projectwiseemployee.model')
const ProjectModel = require('../Project/model')
const { subscribeUsers, unsubscribeUsers } = require('../../helper/firebase.service')
const { queuePush } = require('../../helper/redis')
const RoleModel = require('../Role/model')
const data = require('../../data')
const moment = require('moment')
const PermissionModel = require('../Permission/model')
// const { sendNotifications, sendTimedNotification, downloadExcel, sendEmailQueue, sendProjectNotifications } = require('../../queue')

const OtpModel = require('./employeeOtpVerification.model')
const skillModel = require('../Skill/model')
const ProjectWiseEmployeeModel = require('../Project/projectwiseemployee.model')
const OrgBranchModel = require('../OrganizationBranch/model')
const { ResourceManagementDB } = require('../../database/mongoose')

const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { ErrorResponseSender, catchError, pick, validateEmpId, validateEmail, validateMobile, validatePassword, hashPassword, encryption, projection, comparePassword, decryption, searchValidate, SuccessResponseSender, keygen } = require('../../helper/utilities.services')
const { sendEmail } = require('../../helper/email.service')

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await EmployeeModel.findOne({ _id: ObjectId(params) }).populate({
      path: 'iDepartmentId',
      select: 'sName sKey eStatus ',
      match: { eStatus: 'Y' }
    })
    if (data?.iDepartmentId?.sKey) {
      const jobProfile = await JobProfileModel.find({
        eStatus: 'Y',
        sPrefix: {
          $in: ['Superior', 'Head', 'Lead', 'Other', 'Manager']
        }
      }, { _id: 1 }).lean()

      const departmentId = await DepartmentModel.find({
        _id: data.iDepartmentId._id,
        eStatus: 'Y'
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

      const allEmployee = [...otherEmployee]
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
        sProjectName: data.sName,
        iCreatedBy: data.iLastUpdateBy,
        sType: 'employee',
        sUrl: url,
        sLogo: data?.sLogo,
        isRecorded: isRecorded === true ? 'Y' : 'N',
        isNotify: isNotify === true ? 'Y' : 'N'
      }

      const person = await EmployeeModel.findOne({ _id: data.iLastUpdateBy }, { sName: 1, sEmpId: 1, sLogo: 1 }).lean()

      const putData = {
        sPushToken,
        sTitle: 'Resource Management',
        sBody: `${data.sName}(${data.sEmpId})${sBody}by ${person.sName}`,
        sLogo: data?.sLogo || '',
        sType: 'employee',
        metadata,
        sUrl: url,
        aSenderId: ids,
        isRecorded: isRecorded === true ? 'Y' : 'N',
        isNotify: isNotify === true ? 'Y' : 'N'
      }

      // console.log('putData', putData)
      await queuePush('Employee:Notification', putData)
    }
  } catch (e) {
    console.log(e)
  }
}

class Employee {
  async CreateEmployee(req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sEmpId', 'sEmail', 'sMobNum', 'iDepartmentId', 'iJobProfileId', 'nExperience', 'eGrade', 'sResumeLink', 'nAvailabilityHours', 'aSkills', 'nAvailabilityHours', 'eAvailabilityStatus', 'sProfilePic', 'sResumeLink', 'aRole', 'aPermissions', 'iBranchId', 'eShowAllProjects'])

      // console.log(req.body)

      const { sEmail, sMobNum, sEmpId } = req.body
      if (!validateEmpId(sEmpId)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].empId) })
      if (!validateEmail(sEmail)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })
      if (!validateMobile(sMobNum)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobNum) })
      const exist = await EmployeeModel.findOne({ $or: [{ sEmail }, { sEmpId }, { sMobNum }], eStatus: 'Y' }).lean()
      if (exist) {
        if (exist.sMobNum === sMobNum) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobNum) })
        if (exist.sEmpId === sEmpId) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].empId) })
        return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
      }

      // if (!req.body?.aRole || req.body?.aRole?.length === 0) {
      //   return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].required.replace('##', messages[req.userLanguage].role) })
      // }

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

      // const Role = []
      // const Permission = []
      // for (const role of req.body.aRole) {
      //   const exist = await RoleModel.findOne({ _id: role, eStatus: 'Y' }).populate({
      //     path: 'aPermissions',
      //     match: { eStatus: 'Y', bIsActive: true },
      //     select: '_id sName sKey eStatus bIsActive'
      //   }).lean()
      //   if (!exist) {
      //     return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].role) })
      //   } else {
      //     Role.push({
      //       iRoleId: exist._id,
      //       sName: exist.sName,
      //       sKey: exist.sKey
      //     })
      //   }
      //   for (const permission of exist.aPermissions) {
      //     if (Permission.findIndex(x => x.sKey === permission.sKey) === -1) {
      //       Permission.push({
      //         aRole: role === undefined ? [] : [role],
      //         sKey: permission.sKey
      //       })
      //     } else {
      //       const index = Permission.findIndex(x => x.sKey === permission.sKey)
      //       if (role) {
      //         Permission[index].aRole.push(role)
      //       }
      //     }
      //   }
      // }

      // grouping permissions
      // const groupedPermissions = Permission.reduce((r, a) => {
      //   r[a.sKey] = [...r[a.sKey] || [], a.aRole]
      //   return r
      // })

      // req.body.aRole = Role
      // req.body.aTotalPermissions = Permission

      const EmployeeData = await EmployeeModel.create({ ...req.body, iCreatedBy: req.employee._id, aRole: userRole, aTotalPermissions: permission, iLastUpdateBy: req.employee._id, sPassword: '$2b$10$m7Y5OVcyBIJpJ9s3X4tAb.ruLZEMwt0NNaON.OIOjKCMZznT8oOMu' })

      console.log('EMployeeData', EmployeeData)

      if (req.body?.sProfilePic && req.body?.sProfilePic !== '') {
        const params = {
          Bucket: config.S3_BUCKET_NAME,
          Key: req.body.sProfilePic
        }
        const data = await s3.getObject(params)

        if (data) {
          try {
            const params1 = {
              Bucket: config.S3_BUCKET_NAME,
              Key: `Employee/${EmployeeData._id}/${req.body.sProfilePic}`,
              Body: data.Body,
              ContentType: data.ContentType
            }
            await s3.uploadFileToS3(params1)
            const params2 = {
              Bucket: config.S3_BUCKET_NAME,
              Key: req.body.sProfilePic
            }
            await s3.deleteObject(params2)
            await EmployeeModel.updateOne({ _id: EmployeeData._id }, { sProfilePic: params1.Key })
          } catch (error) {
            console.log(error)
          }
        }
      }

      if (req.body?.sResumeLink && req.body?.sResumeLink !== '') {
        const params = {
          Bucket: config.S3_BUCKET_NAME,
          Key: req.body.sResumeLink
        }

        const data = await s3.getObject(params)

        if (data) {
          try {
            const params1 = {
              Bucket: config.S3_BUCKET_NAME,
              Key: `Employee/${EmployeeData._id}/${req.body.sResumeLink.split('/').pop()}`,
              Body: data.Body,
              ContentType: data.ContentType
            }
            await s3.uploadFileToS3(params1)
            const params2 = {
              Bucket: config.S3_BUCKET_NAME,
              Key: req.body.sResumeLink
            }
            await s3.deleteObject(params2)
            await EmployeeModel.updateOne({ _id: EmployeeData._id }, { sResumeLink: params1.Key })
          } catch (error) {
            console.log(error)
          }
        }
      }

      // console.log('EmployeeData', EmployeeData)

      // const sendingToken = []

      // for (const token of req.employee.aJwtTokens) {
      //   if (token.sPushToken !== null && token.sPushToken !== undefined && token.sPushToken !== '') {
      //     sendingToken.push(token.sPushToken)
      //   }
      // }
      // await pushNotificationUsingTokens(sendingToken, 'Resource Management', `${req.body.sName} employee is created`)

      // const data = EmployeeData.sEmail
      // const token = jwt.sign({ data }, config.JWT_SECRET, {
      //   expiresIn: config.JWT_VALIDITY
      // })
      // const userLink = new OtpModel({
      //   sLogin: sEmail,
      //   sVerificationToken: token,
      //   sType: 'set-password'
      // })
      // await userLink.save()
      // const body = {
      //   type: 'set-password',
      //   NAME: EmployeeData.sName,
      //   EMAIL: EmployeeData.sEmail,
      //   RESET: config.resetLink.replace('add_token', token)
      // }
      // console.log(body)
      // sendEmail(body)

      const data = EmployeeData.sEmail
      const token = jwt.sign({ data }, config.JWT_SECRET, {
        expiresIn: config.JWT_VALIDITY
      })
      const userLink = new OtpModel({
        sLogin: sEmail,
        sVerificationToken: token,
        sType: 'set-link',
        dStartAt: moment(),
        dCreatedAt: moment().add(5, 'minutes').toDate()
      })
      await userLink.save()
      const body = {
        type: 'Set-Password',
        NAME: EmployeeData.sName,
        EMAIL: EmployeeData.sEmail,
        RESET: config.resetLink.replace('add_token', token).replace('reset-link', 'set-link')
      }
      sendEmail(body)

      await DepartmentModel.findByIdAndUpdate({ _id: req.body.iDepartmentId }, { $inc: { nTotal: 1 } })
      await OrgBranchModel.findByIdAndUpdate({ _id: req.body.iBranchId }, { $inc: { nCurrentEmployee: 1 } })
      await JobProfileModel.findByIdAndUpdate({
        _id: req.body.iJobProfileId
      }, {
        $inc: {
          nTotal: 1
        }
      })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: EmployeeData._id, eModule: 'Employee', sService: 'CreateEmployee', eAction: 'Create', oNewFields: EmployeeData }
      await take.create(logs)

      // await notificationsender(req, EmployeeData._id, ' employee is create ', true, true, req.employee._id, `${config.urlPrefix}/employee-management/detail/${EmployeeData._id}`)

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].create_success.replace('##', messages[req.userLanguage].employee), { _id: EmployeeData._id })
    } catch (error) {
      return catchError('Employee.CreateEmployee', error, req, res)
    }
  }

  async login(req, res) {
    try {
      let { sLogin, sPassword, sPushToken } = req.body

      sLogin = sLogin.toLowerCase().trim()
      const isEmail = validateEmail(sLogin)
      const query = isEmail ? { sEmail: sLogin } : { sMobNum: sLogin }
      const employee = await EmployeeModel.findOne({ ...query, eStatus: 'Y' }).lean()
      if (!employee) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].Credentials) })
      if (employee.eStatus === 'B' || employee.eStatus === 'D') { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].blocked }) }
      if (!employee.sPassword) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].Credentials) })
      if (!comparePassword(sPassword, employee.sPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].Credentials) })

      const userPermission = []
      for (const permission of employee.aTotalPermissions) {
        userPermission.push(permission.sKey)
      }

      const newToken = {
        sToken: jwt.sign({ _id: employee._id, eStatus: employee.eStatus, aTotalPermissions: userPermission }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY }),
        sPushToken
      }
      if (employee.aJwtTokens.length < 20) {
        employee.aJwtTokens.push(newToken)
      } else {
        const tokenUnsubscribe = employee.aJwtTokens.shift()

        if (tokenUnsubscribe?.sPushToken) {
          unsubscribeUsers(tokenUnsubscribe.sPushToken, 'All')
        }
        employee.aJwtTokens.push(newToken)
      }
      const data = await EmployeeModel.findByIdAndUpdate({ _id: employee._id }, { aJwtTokens: employee.aJwtTokens }, { runValidators: true, new: true })
      if (!data) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].Credentials) })

      if (req.body?.sPushToken) {
        // subscribeUsers(req.body.sPushToken)
      }
      // const putData = { sTopic: 'All', sTitle: 'Resource Management', sBody: `${employee.sName} is logged in`, sIcon: 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/Default/90px-CC_some_rights_reserved.jpg', sLink: 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/Default/90px-CC_some_rights_reserved.jpg' }
      // queuePush('Welcome:Notification', putData)

      // const logs = { eActionBy: { eType: employee.eEmpType, iId: employee._id }, iId: data._id, eModule: 'Employee', sService: 'login', eAction: 'Update' }
      // Logs.create(logs)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].loggedIn), newToken })
    } catch (error) {
      return catchError('Employee.login', error, req, res)
    }
  }

  async EmployeeDetail(req, res) {
    try {
      const id = req.params.id
      const EmployeeDetail = await EmployeeModel.findOne({ _id: id, eStatus: 'Y', eEmpType: 'E' }, {
        aJwtTokens: 0
      }).populate('iDepartmentId', 'sName').populate('iJobProfileId', 'sName sPrefix').populate('iBranchId', 'sName isHeadquarter').lean()
      if (!EmployeeDetail) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee) })

      const EmployeeCurrency = await EmployeeCurrencyModel.find({ iEmployeeId: EmployeeDetail._id, eStatus: 'Y' }, { iEmployeeId: 1, iCurrencyId: 1, nCost: 1 }).populate('iCurrencyId', 'sName sSymbol nUSDCompare').lean()
      if (!EmployeeCurrency.length) EmployeeDetail.EmployeeCurrency = []
      else {
        const currency = []
        for (const i of EmployeeCurrency) {
          currency.push({
            iCurrencyId: i.iCurrencyId._id,
            sName: i.iCurrencyId.sName,
            sSymbol: i.iCurrencyId.sSymbol,
            nUSDCompare: i.iCurrencyId.nUSDCompare,
            iEmployeeId: i.iEmployeeId,
            nCost: i.nCost
          })
        }
        EmployeeDetail.EmployeeCurrency = currency
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].employee), EmployeeDetail })
    } catch (error) {
      return catchError('Employee.EmployeeDetails', error, req, res)
    }
  }

  async employeeExists(req, res) {
    try {
      let { search } = req.query
      search = searchValidate(search)
      const employeeCount = await EmployeeModel.countDocuments({
        $or: [{ sEmail: { $regex: new RegExp(search, 'i') } },
        { sPassword: { $regex: new RegExp(search, 'i') } },
        { sMobNum: { $regex: new RegExp(search, 'i') } },
        { sEmpId: { $regex: new RegExp(search, 'i') } }
        ],
        eStatus: 'Y'
      }).lean()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].matched), result: (employeeCount > 0) })
    } catch (error) {
      return catchError('Employee.employeeExists', error, req, res)
    }
  }

  async EmployeeDetails(req, res) {
    console.log('EmployeeDetails')
    try {
      let { page = 0, limit = 5, iDepartmentId, eAvailabilityStatus, search = '', sort = 'dCreatedAt', order } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      search = searchValidate(search)
      const sorting = { [sort]: orderBy }
      const q = [
        {
          $match: { eEmpType: 'E', eStatus: 'Y' }
        },
        {
          $lookup: {
            from: 'departments',
            let: { departmentId: '$iDepartmentId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$departmentId'] } } },
              { $project: { _id: 1, sName: 1 } }
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
          $lookup: {
            from: 'jobprofiles',
            let: { jobprofileId: '$iJobProfileId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$jobprofileId'] } } },
              { $project: { _id: 1, sName: 1, sPrefix: 1 } }
            ],
            as: 'jobprofile'
          }
        },
        {
          $unwind: {
            path: '$jobprofile',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'projectwiseemployees',
            let: { employeeId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$iEmployeeId', '$$employeeId'] } } },
              { $project: { _id: 0, iProjectId: 1 } }
            ],
            as: 'projectwiseemployee'
          }
        },
        {
          $unwind: {
            path: '$projectwiseemployee',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            sName: { $first: '$sName' },
            sEmail: { $first: '$sEmail' },
            sDepartment: { $first: '$department' },
            nExperience: { $first: '$nExperience' },
            nAvailabilityHours: { $first: '$nAvailabilityHours' },
            projectwiseemployee: { $sum: 1 },
            iDepartmentId: { $first: '$iDepartmentId' },
            eGrade: { $first: '$eGrade' },
            dCreatedAt: { $first: '$dCreatedAt' },
            eAvailabilityStatus: { $first: '$eAvailabilityStatus' },
            sEmpId: { $first: '$sEmpId' },
            iJobProfileId: { $first: '$iJobProfileId' },
            sJobProfile: { $first: '$jobprofile' },
            sProfilePic: { $first: '$sProfilePic' }
          }
        },
        {
          $project: {
            _id: '$_id',
            sName: '$sName',
            sEmail: '$sEmail',
            sDepartment: '$sDepartment',
            nExperience: '$nExperience',
            nAvailabilityHours: '$nAvailabilityHours',
            project: '$projectwiseemployee',
            iDepartmentId: '$iDepartmentId',
            eGrade: '$eGrade',
            dCreatedAt: '$dCreatedAt',
            eAvailabilityStatus: '$eAvailabilityStatus',
            sEmpId: '$sEmpId',
            iJobProfileId: '$iJobProfileId',
            sProfilePic: '$sProfilePic',
            sJobProfile: '$sJobProfile'
          }
        }
      ]
      if (iDepartmentId) {
        q.push({ $match: { iDepartmentId: ObjectId(iDepartmentId) } })
      }
      if (eAvailabilityStatus) {
        q.push({ $match: { eAvailabilityStatus } })
      }
      sort = ['sName', 'sDepartment', 'nExperience', 'nAvailabilityHours', 'project', 'iDepartmentId', 'eGrade', 'dCreatedAt', 'eAvailabilityStatus'].includes(sort) ? sort : 'dCreatedAt'
      if (search) {
        q.push({
          $match: {
            $or: [
              { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { sEmpId: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { 'sDepartment.sName': { $regex: new RegExp('^.*' + search + '.*', 'i') } }
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
      const Employees = await EmployeeModel.aggregate(q)
      const query = ['eAvailabilityStatus', 'iDepartmentId', 'search']
      let count = 0
      if (query.some(item => Object.keys(req.query).includes(item))) {
        count = await EmployeeModel.aggregate(count_query)
        count = count[0]?.count || 0
      } else {
        count = await EmployeeModel.countDocuments({ eStatus: 'Y', eEmpType: 'E' }).lean()
      }

      if (req.path === '/DownloadExcel') {
        return Employees
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].employee), { Employees, count })
      }
    } catch (error) {
      return catchError('Employee.EmployeeDetails', error, req, res)
    }
  }

  async getSignedUrl(req, res) {
    try {
      const { sFileName, sContentType } = req.body

      const bucket = `${config.s3Employee}/`

      const data = await generateUploadUrl(`${sFileName}`, sContentType, bucket)
      console.log(data)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      catchError('Employee.getSignedUrl', error, req, res)
    }
  }

  async EmployeeUpdate(req, res) {
    try {
      const id = req.params.id
      const EmployeeData = await EmployeeModel.findById({ _id: id })
      if (!EmployeeData) {
        return res.status(status.NotFound).send({ success: true, status: status.NotFound, message: messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].employee) })
      }
      req.body = pick(req.body, ['sName', 'sMobNum', 'sEmpId', 'sProfilePic', 'iDepartmentId', 'iJobProfileId', 'nExperience', 'eGrade', 'sResumeLink', 'aSkills', 'eAvailabilityStatus', 'nAvailabilityHours', 'iBranchId', 'eShowAllProjects'])
      const { sMobNum, sEmpId } = req.body
      if (!validateEmpId(sEmpId)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].empId) })
      if (!validateMobile(sMobNum)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobNum) })
      const EmployeeExist = await EmployeeModel.findOne({ $or: [{ sMobNum }, { sEmpId }], _id: { $ne: id }, eStatus: 'Y' }).lean()
      if (EmployeeExist) {
        if (EmployeeExist.sMobNum === sMobNum) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobNum) })
        if (EmployeeExist.sEmpId === sEmpId) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].empId) })
      }

      // check if department is changed or not

      if (req.body.iDepartmentId && req.body.iDepartmentId !== EmployeeData.iDepartmentId.toString()) {
        // check if Employee is assigned to any project or not
        const project = await ProjectWiseEmployeeModel.findOne({ iEmployeeId: id, eStatus: 'Y', iDepartmentId: EmployeeData.iDepartmentId }).lean()
        if (project) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].project) })
      }

      // const s3Params = {
      //   Bucket: config.S3_BUCKET_NAME,
      //   Key: EmployeeData.sProfilePic
      // }
      // if (EmployeeData.sProfilePic.split('/')[0] !== ('Default') && EmployeeData.sProfilePic !== sProfilePic) {
      //   await s3.deleteObject(s3Params)
      // }

      // const Role = []
      // const Permission = []

      // if (!req.body?.aRole || req.body?.aRole?.length === 0) {
      //   return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].required.replace('##', messages[req.userLanguage].role) })
      // }

      // if (!req.body.aRole.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].role_required })

      // const role = []
      // const permission = []
      // for (const p of req.body.aPermissions) {
      //   const permissionExit = await PermissionModel.findOne({ sKey: p.sKey, eStatus: 'Y', bIsActive: true }).lean()
      //   if (!permissionExit) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].permission))

      //   for (const r of p.aRoleId) {
      //     if (!role.find(x => x === r)) {
      //       role.push(r)
      //     }
      //   }
      //   permission.push({
      //     sKey: permissionExit.sKey,
      //     aRoleId: role.length ? role : []
      //   })
      // }
      // const userRole = []
      // for (const r of role) {
      //   const roleExit = await RoleModel.findOne({ _id: r, eStatus: 'Y' }).lean()
      //   if (!roleExit) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role))
      //   userRole.push({
      //     iRoleId: roleExit._id,
      //     sName: roleExit.sName,
      //     sKey: roleExit.sKey
      //   })
      // }

      // let flag = false
      // if (req.body.aRole.length === EmployeeData.aRole.length && req.body.aRole.every((v, i) => v.iRoleId === EmployeeData.aRole[i].iRoleId)) {
      //   flag = true
      // }

      // if (!flag) {
      //   // const Role = []
      //   // const Permission = []

      //   // for (const role of req.body.aRole) {
      //   //   const exist = await RoleModel.findOne({ _id: role, eStatus: 'Y' }).populate({
      //   //     path: 'aPermissions',
      //   //     match: { eStatus: 'Y', bIsActive: true },
      //   //     select: '_id sName sKey eStatus bIsActive'
      //   //   }).lean()
      //   //   if (!exist) {
      //   //     return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].role) })
      //   //   } else {
      //   //     Role.push({
      //   //       iRoleId: exist._id,
      //   //       sName: exist.sName,
      //   //       sKey: exist.sKey
      //   //     })
      //   //   }
      //   //   for (const permission of exist.aPermissions) {
      //   //     if (!Permission.find((p) => p.sKey === permission.sKey)) {
      //   //       Permission.push({
      //   //         sKey: permission.sKey
      //   //       })
      //   //     }
      //   //   }
      //   // }

      //   // const removeRole = []
      //   // const removePermission = []
      //   // for (const role of EmployeeData.aRole) {
      //   //   const exist = await RoleModel.findOne({ _id: role, eStatus: 'Y' }).populate({
      //   //     path: 'aPermissions',
      //   //     match: { eStatus: 'Y', bIsActive: true },
      //   //     select: '_id sName sKey eStatus bIsActive'
      //   //   }).lean()
      //   //   if (!exist) {
      //   //     continue
      //   //   } else {
      //   //     removeRole.push({
      //   //       iRoleId: exist._id,
      //   //       sName: exist.sName,
      //   //       sKey: exist.sKey
      //   //     })
      //   //   }
      //   //   for (const permission of exist.aPermissions) {
      //   //     if (!Permission.find((p) => p.sKey === permission.sKey)) {
      //   //       removePermission.push({
      //   //         sKey: permission.sKey
      //   //       })
      //   //     }
      //   //   }
      //   // }

      //   // for (const permission of EmployeeData.aTotalPermissions) {
      //   //   if (removePermission.find((p) => p.sKey === permission.sKey)) {
      //   //     continue
      //   //   } else {
      //   //     if (!Permission.find((p) => p.sKey === permission.sKey)) {
      //   //       Permission.push({
      //   //         sKey: permission.sKey
      //   //       })
      //   //     }
      //   //   }
      //   // }
      //   // req.body.aRole = Role
      //   // req.body.aTotalPermissions = Permission

      //   for (const role of req.body.aRole) {
      //     const exist = await RoleModel.findOne({ _id: role, eStatus: 'Y' }).populate({
      //       path: 'aPermissions',
      //       match: { eStatus: 'Y', bIsActive: true },
      //       select: '_id sName sKey eStatus bIsActive'
      //     }).lean()
      //     if (!exist) {
      //       return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].role) })
      //     } else {
      //       Role.push({
      //         iRoleId: exist._id,
      //         sName: exist.sName,
      //         sKey: exist.sKey
      //       })
      //     }
      //     for (const permission of exist.aPermissions) {
      //       if (Permission.findIndex(x => x.sKey === permission.sKey) === -1) {
      //         Permission.push({
      //           aRole: role === undefined ? [] : [role],
      //           sKey: permission.sKey
      //         })
      //       } else {
      //         const index = Permission.findIndex(x => x.sKey === permission.sKey)
      //         if (role) {
      //           Permission[index].aRole.push(role)
      //         }
      //       }
      //     }
      //   }
      //   req.body.aRole = Role
      //   req.body.aTotalPermissions = Permission
      // } else {
      //   req.body.aRole = EmployeeData.aRole
      //   req.body.aTotalPermissions = EmployeeData.aTotalPermissions
      // }

      if (req.body?.sProfilePic && req.body.sProfilePic !== EmployeeData.sProfilePic && Boolean(req.body.sProfilePic.length)) {
        try {
          const params = {
            Bucket: config.S3_BUCKET_NAME,
            Key: req.body.sProfilePic
          }

          const data = await s3.getObject(params)
          console.log(data)
          if (data) {
            if (EmployeeData?.sProfilePic) {
              const s3Params = {
                Bucket: config.S3_BUCKET_NAME,
                Key: EmployeeData.sProfilePic
              }
              await s3.deleteObject(s3Params)
            }

            const params1 = {
              Bucket: config.S3_BUCKET_NAME,
              Key: `Employee/${EmployeeData._id}/${req.body.sProfilePic.split('/').pop()}`,
              Body: data.Body,
              ContentType: data.ContentType
            }
            await s3.uploadFileToS3(params1)
            const params2 = {
              Bucket: config.S3_BUCKET_NAME,
              Key: req.body.sProfilePic
            }
            await s3.deleteObject(params2)
            console.log('params1', params1)
            req.body.sProfilePic = params1.Key
          }
        } catch (error) {
          console.log('skuhis', error)
          req.body.sProfilePic = EmployeeData.sProfilePic
        }
      }

      if (req?.body?.sResumeLink && req.body.sResumeLink !== EmployeeData.sResumeLink && Boolean(req.body.sProfilePic.length)) {
        try {
          const params = {
            Bucket: config.S3_BUCKET_NAME,
            Key: req.body.sResumeLink
          }

          const data = await s3.getObject(params)
          if (data) {
            if (EmployeeData?.sResumeLink) {
              const s3Params = {
                Bucket: config.S3_BUCKET_NAME,
                Key: EmployeeData.sResumeLink
              }
              await s3.deleteObject(s3Params)
            }
            const params1 = {
              Bucket: config.S3_BUCKET_NAME,
              Key: `Employee/${EmployeeData._id}/${req.body.sResumeLink.split('/').pop()}`,
              Body: data.Body,
              ContentType: data.ContentType
            }
            await s3.uploadFileToS3(params1)
            const params2 = {
              Bucket: config.S3_BUCKET_NAME,
              Key: req.body.sResumeLink
            }
            await s3.deleteObject(params2)
            req.body.sResumeLink = params1.Key
          }
        } catch (error) {
          console.log('skuhis', error)
          req.body.sResumeLink = EmployeeData.sResumeLink
        }
      }

      const skills = await skillModel.find({ eStatus: 'Y' }, { _id: 1, sName: 1 }).lean()
      const aSkills = req.body.aSkills.map(skill => {
        return {
          iSkillId: skill.iSkillId,
          sName: skill.sName,
          eScore: skill.eScore
        }
      })
      const aSkillsData = aSkills.filter(skill => {
        return skills.some(skills => {
          return skills._id.toString() === skill.iSkillId.toString()
        })
      }
      )
      const newdataEmployee = await EmployeeModel.findByIdAndUpdate({ _id: id }, { ...req.body, aSkills: aSkillsData }, { new: true, runValidators: true })
      const oNewFields = { ...req.body, aSkills: aSkillsData }
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: EmployeeData._id, eModule: 'Employee', sService: 'EmployeeUpdate', eAction: 'Update', oNewFields, oOldFields: EmployeeData }
      await take.create(logs)

      // if employee department chage then update in projectwiseemployee
      if (req.body.iDepartmentId && req.body.iDepartmentId !== EmployeeData.iDepartmentId) {
        await DepartmentModel.findByIdAndUpdate({ _id: req.body.iDepartmentId }, { $inc: { nTotal: 1 } })
        await DepartmentModel.findByIdAndUpdate({ _id: EmployeeData.iDepartmentId }, { $inc: { nTotal: -1 } })
      }

      if (req.body.iBranchId && req.body.iBranchId !== EmployeeData.iBranchId) {
        await OrgBranchModel.findByIdAndUpdate({ _id: req.body.iBranchId }, { $inc: { nCurrentEmployee: 1 } })
        await OrgBranchModel.findByIdAndUpdate({ _id: EmployeeData.iBranchId }, { $inc: { nCurrentEmployee: -1 } })
      }

      if (req.body.iJobProfileId && req.body.iJobProfileId !== EmployeeData.iJobProfileId) {
        await JobProfileModel.findByIdAndUpdate({ _id: req.body.iJobProfileId }, { $inc: { nTotal: 1 } })
        await JobProfileModel.findByIdAndUpdate({ _id: EmployeeData.iJobProfileId }, { $inc: { nTotal: -1 } })
      }

      // await notificationsender(req, newdataEmployee._id, ' employeedetails is update ', true, true, req.employee._id, `${config.urlPrefix}/employee-management/detail/${newdataEmployee._id}`)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].employee) })
    } catch (error) {
      return catchError('Employee.EmployeeUpdate', error, req, res)
    }
  }

  async signUp(req, res) {
    try {
      let { sEmail, sPassword, sEmpId, sMobNum } = req.body
      if (!validateEmail(sEmail)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].email) })
      if (!validateEmpId(sEmpId)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].empId) })
      if (!validateMobile(sMobNum)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobNum) })
      sPassword = decryption(sPassword)
      if (!validatePassword(sPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].password) })
      const employeeExist = await EmployeeModel.findOne({ $or: [{ sEmail }, { sMobNum }, { sEmpId }], eStatus: 'Y' }).lean()
      if (employeeExist && employeeExist.sEmail === sEmail) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
      if (employeeExist && employeeExist.sMobNum === sMobNum) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobNum) })
      if (employeeExist && employeeExist.sEmpId === sEmpId) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].empId) })
      sPassword = hashPassword(sPassword)

      const jobProfile = await JobProfileModel.findOne({ sKey: keygen('Admin'), eStatus: 'Y' }).lean()
      if (!jobProfile) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].job_profile) })

      const department = await DepartmentModel.findOne({ sKey: keygen('HR'), eStatus: 'Y' }).lean()
      if (!department) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].department) })

      const data = await EmployeeModel.create({ ...req.body, sPassword, iJobProfileId: jobProfile._id, iDepartmentId: department._id })

      // const updateProfile = await EmployeeModel.findByIdAndUpdate({ _id: data._id }, { iJobProfileId: jobProfile._id, iDepartmentId: department._id }, { new: true, runValidators: true })
      // if (!updateProfile) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].update_fail.replace('##', messages[req.userLanguage].employee) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].username), data })
    } catch (error) {
      return catchError('Employee.signUp', error, req, res)
    }
  }

  async dgenerate(req, res) {
    try {
      const { sPassword } = req.body
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: decryption(sPassword) })
    } catch (error) {
      return catchError('Employee.dgenerate', error, req, res)
    }
  }

  async EmployeeDelete(req, res) {
    try {
      const employee = await EmployeeModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()

      if (!employee) {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].employee) })
      }

      if (employee._id.toString() === req.params._id) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_allowed_to_delete.replace('##', messages[req.userLanguage].employee) })
      }

      const [project, projectWiseEmployee] = await Promise.all([
        ProjectModel.findOne({
          $or: [{
            iBAId: employee._id,
            iBDId: employee._id,
            iProjectManagerId: employee._id
          }],
          eStatus: 'Y'
        }),
        ProjectWiseEmployee.findOne({
          iEmployeeId: employee._id,
          eStatus: 'Y'
        })
      ])

      if (project || projectWiseEmployee) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].entity_exist_somewhere_in_Project.replace('##', messages[req.userLanguage].employee) })
      }

      const data = await EmployeeModel.findByIdAndUpdate({ _id: req.params.id, eStatus: 'Y' }, { eStatus: 'N' }, { new: true, runValidators: true })

      await DepartmentModel.findByIdAndUpdate({ _id: employee.iDepartmentId }, { $inc: { nTotal: -1 } })
      await OrgBranchModel.findByIdAndUpdate({ _id: employee.iBranchId }, { $inc: { nTotal: -1 } })
      await JobProfileModel.findByIdAndUpdate({ _id: employee.iJobProfileId }, { $inc: { nTotal: -1 } })

      // const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Employee', sService: 'EmployeeDelete', eAction: 'Delete', oOldFields: employee, oNewFields: data }
      // await Logs.create(logs)
      // await notificationsender(req, data._id, ' employee is delete ', true, true, req.employee._id, `${config.urlPrefix}/employee-management/detail/${data._id}`)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].employee) })
    } catch (error) {
      return catchError('Employee.EmployeeDelete', error, req, res)
    }
  }

  async generate(req, res) {
    try {
      const { sPassword } = req.body
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: encryption(sPassword) })
    } catch (error) {
      return catchError('Employee.generate', error, req, res)
    }
  }

  async employeeProfile(req, res) {
    try {
      const userData = await EmployeeModel.findById({ _id: req.employee._id, eStatus: 'Y' }).populate('iJobProfileId').populate('iDepartmentId').lean()
      if (!userData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].profile) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].profile), data: userData })
    } catch (error) {
      return catchError('Employee.employeeProfile', error, req, res)
    }
  }

  async logout(req, res) {
    try {
      const sToken = req.header('Authorization')

      const sPushToken = []

      const token = await EmployeeModel.findById({ _id: req.employee._id, eStatus: 'Y' })
      if (!token) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].token) })

      for (const pushToken of token.aJwtTokens) {
        if (pushToken.sToken !== sToken) {
          if (!sPushToken.includes(pushToken.sPushToken) && pushToken?.sPushToken) {
            sPushToken.push(pushToken.sPushToken)
          }
        }
      }

      // unsubscribeUsers(sPushToken, 'All')

      const data = await EmployeeModel.findByIdAndUpdate({ _id: req.employee._id, eStatus: 'Y' }, { $pull: { aJwtTokens: { sToken: { $ne: sToken } } } }, { new: true, runValidators: true })
      let take = `Logs${new Date().getFullYear()}`

      take = await ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Employee', sService: 'logout', eAction: 'Update', oNewFields: data }
      await take.create(logs)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_logout })
    } catch (error) {
      return catchError('Employee.logout', error, req, res)
    }
  }

  async reset_password(req, res) {
    try {
      const type = req.query.type
      console.log(type)
      if (type !== 'otp' && type !== 'reset-link' && type !== 'set-link') {
        return res.status(status.NotFound).send({ success: false, status: status.NotFound, message: messages[req.userLanguage].typeNotFound })
      }
      if (type === 'otp') {
        req.body = pick(req.body, ['sNewPassword', 'sConfirmPassword', 'sCode', 'sLogin'])
        const { sNewPassword, sConfirmPassword, sCode, sLogin } = req.body
        if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass })
        const exist = await OtpModel.findOne({ sLogin, sCode })
        if (!exist || exist.sCode !== sCode) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].verify_otp_err })
        const isEmail = validateEmail(sLogin)
        const query = isEmail ? { sEmail: sLogin } : { sMobNum: sLogin }
        const employee = await EmployeeModel.findOne(query).lean()
        if (employee) {
          if (sNewPassword === sConfirmPassword) {
            const password = hashPassword(sNewPassword)
            await Promise.all([
              EmployeeModel.findByIdAndUpdate(employee._id, { $set: { sPassword: password } }, { new: true }),
              OtpModel.findOneAndDelete({ sLogin, sCode })
            ])
            return res.status(status.OK).send({ success: true, status: status.OK, messages: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].password) })
          } else {
            return res.status(status.NotAcceptable).send({ success: false, status: status.NotAcceptable, messages: messages[req.userLanguage].new_confirm_password_same })
          }
        } else {
          return res.status(status.NotFound).send({ success: false, status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee) })
        }
      }
      if (type === 'reset-link') {
        req.body = pick(req.body, ['sNewPassword', 'sConfirmPassword'])
        const sVerificationToken = req.query.token
        const { sNewPassword, sConfirmPassword } = req.body
        if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass })
        const tokenData = await OtpModel.findOne({ sVerificationToken })
        if (!tokenData) {
          return res.status(status.NotFound).send({ success: false, status: status.NotFound, message: messages[req.userLanguage].TokenNotFound })
        }
        if (tokenData) {
          if (sNewPassword === sConfirmPassword) {
            const password = hashPassword(sNewPassword)

            const dataEmployee = await EmployeeModel.findOne({ sEmail: tokenData.sLogin, eStatus: 'Y' })

            if (!dataEmployee) {
              return res.status(status.NotFound).send({ success: false, status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee) })
            }

            const data = await EmployeeModel.findByIdAndUpdate({ _id: dataEmployee._id, eStatus: 'Y' }, { $set: { sPassword: password } }, { new: true })

            console.log(data)

            const check = await OtpModel.findOneAndDelete({ sVerificationToken })
            console.log(check)
            let take = `Logs${new Date().getFullYear()}`

            take = ResourceManagementDB.model(take, Logs)
            const logs = { eActionBy: { eType: data.eEmpType, iId: data._id }, iId: data._id, eModule: 'Employee', sService: 'reset_password', eAction: 'Create', oNewFields: data }
            await take.create(logs)
            return res.status(status.OK).send({ success: true, status: status.OK, messages: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].password) })
          } else {
            return res.status(status.NotAcceptable).send({ success: false, status: status.NotAcceptable, messages: messages[req.userLanguage].new_confirm_password_same })
          }
        }
      }
      if (type === 'set-link') {
        req.body = pick(req.body, ['sNewPassword', 'sConfirmPassword'])
        const sVerificationToken = req.query.token
        const { sNewPassword, sConfirmPassword } = req.body

        if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass })
        const tokenData = await OtpModel.findOne({ sVerificationToken })

        if (!tokenData) {
          return res.status(status.NotFound).send({ success: false, status: status.NotFound, message: messages[req.userLanguage].TokenNotFound })
        }
        if (tokenData) {
          if (sNewPassword === sConfirmPassword) {
            const password = hashPassword(sNewPassword)

            const dataEmployee = await EmployeeModel.findOne({ sEmail: tokenData.sLogin, eStatus: 'Y' })

            if (!dataEmployee) {
              return res.status(status.NotFound).send({ success: false, status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee) })
            }

            const data = await EmployeeModel.findByIdAndUpdate({ _id: dataEmployee._id, eStatus: 'Y' }, { $set: { sPassword: password } }, { new: true })

            console.log(data)

            const check = await OtpModel.findOneAndDelete({ sVerificationToken })
            console.log(check)
            let take = `Logs${new Date().getFullYear()}`

            take = ResourceManagementDB.model(take, Logs)

            const logs = { eActionBy: { eType: data.eEmpType, iId: data._id }, iId: data._id, eModule: 'Employee', sService: 'reset_password', eAction: 'Create', oNewFields: data }
            await take.create(logs)
            return res.status(status.OK).send({ success: true, status: status.OK, messages: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].password) })
          } else {
            return res.status(status.NotAcceptable).send({ success: false, status: status.NotAcceptable, messages: messages[req.userLanguage].new_confirm_password_same })
          }
        }
      }
    } catch (error) {
      return catchError('reset_password', error, req, res)
    }
  }

  async forgot_password(req, res) {
    try {
      req.body = pick(req.body, ['sLogin'])
      console.log(req.body)
      const { sLogin } = req.body
      const isEmail = validateEmail(sLogin)
      const query = isEmail ? { sEmail: sLogin } : { sMobNum: sLogin }
      const type = isEmail ? 'reset-link' : 'otp'
      const EmployeeData = await EmployeeModel.findOne(query)
      if (!EmployeeData) {
        return res.status(status.NotFound).send({ success: true, status: status.NotFound, messages: messages[req.userLanguage].We_cannot_find_an_account_with_that_email_address })
      }
      if (type === 'otp') {
        const generateOtp = Math.floor(1000 + Math.random() * 9000)
        const userOtp = new OtpModel({
          sLogin,
          sCode: generateOtp,
          sType: type
        })
        await userOtp.save()
        // sendOtp(EmployeeData.sEmpName, EmployeeData.sEmail, generateOtp)
        return res.status(status.OK).send({ success: true, status: status.OK, type, messages: messages[req.userLanguage].email_sent })
      }
      if (type === 'reset-link') {
        const data = EmployeeData.sEmail
        const token = jwt.sign({ data }, config.JWT_SECRET, {
          expiresIn: config.JWT_VALIDITY
        })
        const userLink = new OtpModel({
          sLogin,
          sVerificationToken: token,
          sType: type,
          dCreatedAt: moment().add(10, 'minutes').toDate()
        })
        await userLink.save()
        const body = {
          type: 'Reset-Password',
          NAME: EmployeeData.sName,
          EMAIL: EmployeeData.sEmail,
          RESET: config.resetLink.replace('add_token', token)
        }
        console.log(body)
        sendEmail(body)
        return res.status(status.OK).send({ success: true, status: status.OK, type, messages: messages[req.userLanguage].email_sent })
      } else {
        return res.status(status.NotFound).send({ success: true, status: status.NotFound, messages: messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].type) })
      }
    } catch (error) {
      return catchError('Employee.forgot_password', error, req, res)
    }
  }

  async changePassword(req, res) {
    const sToken = req.header('Authorization')
    try {
      req.body = pick(req.body, ['sCurrentPassword', 'sNewPassword', 'sConfirmPassword'])
      const { sCurrentPassword, sNewPassword, sConfirmPassword } = req.body
      const employee = await EmployeeModel.findById({ _id: req.employee._id, eStatus: 'Y' }).lean()
      if (!employee) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].Credentials) })
      if (!comparePassword(sCurrentPassword, employee.sPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].currentPassword) })
      if (sConfirmPassword !== sNewPassword) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].new_confirm_password_same })
      if (sCurrentPassword === sNewPassword) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].current_new_field_same })
      if (!validatePassword(sNewPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass })
      const [dataHash, dataToken] = await Promise.all([EmployeeModel.findByIdAndUpdate({ _id: req.employee._id, eStatus: 'Y' }, { sPassword: hashPassword(sNewPassword) }, { runValidators: true }), EmployeeModel.findByIdAndUpdate({ _id: req.employee._id, eStatus: 'Y' }, { $pull: { aJwtTokens: { sToken: { $ne: sToken } } } }, { runValidators: true })])
      if (!dataHash || !dataToken) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].Credentials) })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: employee._id, eModule: 'Employee', sService: 'changePassword', eAction: 'Update', oNewFields: dataHash, oOldFields: employee }
      await take.create(logs)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].password) })
    } catch (error) {
      return catchError('Employee.changePassword', error, req, res)
    }
  }

  async updateUserProfile(req, res) {
    const showDetail = projection(['sMobNum', 'sName', 'sProfilePic', 'sEmpId', 'iJobProfileId', 'iDepartmentId'])
    try {
      req.body = pick(req.body, ['sMobNum', 'sProfilePic', 'sEmpId', 'iJobProfileId', 'sName', 'iDepartmentId'])
      const { sMobNum, sProfilePic, sEmpId, iJobProfileId, iDepartmentId } = req.body
      if (!validateEmpId(sEmpId)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].empId) })
      if (!validateMobile(sMobNum)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobNum) })
      const userExist = await EmployeeModel.findOne({ $or: [{ sMobNum }, { sEmpId }], _id: { $ne: req.employee._id }, eStatus: 'Y' }, showDetail).lean()
      if (userExist) {
        if (userExist.sMobNum === sMobNum) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobNum) })
        if (userExist.sEmpId === sEmpId) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].empId) })
      }
      if (iJobProfileId && iDepartmentId) {
        const [jobProfile, department] = await Promise.all([JobProfileModel.findById({ _id: iJobProfileId, eStatus: 'Y' }).lean(), DepartmentModel.findById({ _id: iDepartmentId, eStatus: 'Y' }).lean()])
        if (!jobProfile) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].jobProfile) })
        if (!department) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department) })
      }
      const oldUserData = await EmployeeModel.findById(req.employee._id).lean()
      const s3Params = {
        Bucket: config.S3_BUCKET_NAME,
        Key: oldUserData.sProfilePic
      }
      if (oldUserData.sProfilePic.split('/')[0] !== ('Default') && oldUserData.sProfilePic !== sProfilePic) {
        const data = await s3.deleteObject(s3Params)
        if (data.DeleteMarker) console.log('Deleted s3 object')
      }
      const data = await EmployeeModel.findByIdAndUpdate({ _id: req.employee._id, eStatus: 'Y' }, { ...req.body }, { runValidators: true, new: true }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Employee', sService: 'updateUserProfile', eAction: 'Update', oNewFields: data, oOldFields: oldUserData }
      await take.create(logs)
      // await notificationsender(req, data._id, ' employee updated profile ', true, true, req.employee._id, `${config.urlPrefix}/employee-management/detail/${data._id}`)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].profile) })
    } catch (error) {
      return catchError('Employee.updateUserProfile', error, req, res)
    }
  }

  async getLoginUser(req, res) {
    try {
      const data = await EmployeeModel.findById({ _id: req.employee._id, eStatus: 'Y' }, { sName: 1, sEmail: 1 }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].loggedInEmployee) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].loggedInEmployee), data })
    } catch (error) {
      return catchError('Employee.getLoginUser', error, req, res)
    }
  }

  async getUser(req, res) {
    try {
      // const { page = 0, limit = 5, eProjectStatus } = req.query
      const id = req.employee._id
      const userDetail = await EmployeeModel.aggregate([
        { $match: { _id: id, eStatus: 'Y' } },
        {
          $project: {
            aJwtTokens: 0,
            dCreatedAt: 0,
            dUpdatedAt: 0,
            __v: 0,
            sPassword: 0,
            eAvailabilityStatus: 0,
            nAvailabilityHours: 0,
            iCreatedBy: 0
          }
        },
        {
          $lookup:
          {
            from: 'jobprofiles',
            let: { jobprofileid: '$iJobProfileId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$jobprofileid'] }, eStatus: 'Y' } },
              { $project: { _id: 1, sName: 1 } }
            ],
            as: 'jobprofile'
          }
        },
        {
          $unwind: { path: '$jobprofile', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup:
          {
            from: 'departments',
            let: { departmentid: '$iDepartmentId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$departmentid'] }, eStatus: 'Y' } },
              { $project: { _id: 1, sName: 1 } }
            ],
            as: 'department'
          }
        },
        {
          $unwind: { path: '$department', preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: '$_id',
            sName: { $first: '$sName' },
            sDepartment: { $first: '$department' },
            nExperience: { $first: '$nExperience' },
            eGrade: { $first: '$eGrade' },
            sEmail: { $first: '$sEmail' },
            sMobNum: { $first: '$sMobNum' },
            sProfilePic: { $first: '$sProfilePic' },
            sEmpId: { $first: '$sEmpId' },
            eDevType: { $first: '$eDevType' },
            sResumeLink: { $first: '$sResumeLink' },
            sJobProfile: { $first: '$jobprofile' },
            // project: { $addToSet: '$project' },
            aSkills: { $first: '$aSkills' }
          }
        }
      ])
      if (!userDetail.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].user), user: userDetail[0] })
    } catch (error) {
      return catchError('Employee.getUser', error, req, res)
    }
  }

  async getUserProjects(req, res) {
    try {
      const { page = 0, limit = 6, order, sort = 'dCreatedAt', eProjectStatus } = req.query
      const orderBy = order && order === 'desc' ? 1 : -1
      const sorting = { [sort]: orderBy }
      const q = [
        { $match: { iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' } },
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
      const [userProject, count] = await Promise.all([ProjectWiseEmployee.aggregate(q).sort(sorting).skip(Number(page)).limit(Number(limit)), ProjectWiseEmployee.aggregate(count_query)])
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { userProject, count: count[0]?.count || 0 })
    } catch (error) {
      return catchError('Department.getClient', error, req, res)
    }
  }

  async updateUserSkills(req, res) {
    try {
      const id = req.employee._id
      const data = await EmployeeModel.findByIdAndUpdate({ _id: id, eStatus: 'Y' }, { aSkills: req.body.aSkills }, { runValidators: true }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].user) })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Employee', sService: 'updateUserSkills', eAction: 'Update', oNewFields: data }
      await take.create(logs)
      // await notificationsender(req, data._id, ' employee skills updated ', true, true, req.employee._id, `${config.urlPrefix}/employee-management/detail/${data._id}`)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].skill) })
    } catch (error) {
      return catchError('Employee.updateUserSkills', error, req, res)
    }
  }

  async getAllEmployee(req, res) {
    try {
      let { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt' } = req.query

      const orderBy = order && order === 'asc' ? 1 : -1

      const q = [
        {
          $match: {
            eStatus: 'Y'
          }
        },
        {
          $project: {
            sName: 1,
            sEmpId: 1,
            dCreatedAt: 1,
            iJobProfileId: 1
          }
        },
        {
          $lookup: {
            from: 'jobprofiles',
            let: { jobProfileId: '$iJobProfileId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$jobProfileId'] },
                      { $eq: ['$eStatus', 'Y'] }
                    ]
                  }
                }
              },
              {
                $project: {
                  sName: 1,
                  iJobProfileId: 1,
                  sKey: 1,
                  dCreatedAt: 1
                }
              }
            ],
            as: 'iJobProfileId'
          }
        },
        {
          $project: {
            sName: 1,
            sEmpId: 1,
            dCreatedAt: 1,
            iJobProfileId: {
              $cond: {
                if: { $eq: [{ $size: '$iJobProfileId' }, 0] },
                then: '(none)',
                else: {
                  $arrayElemAt: ['$iJobProfileId._id', 0]
                }
              }
            },
            sJobProfileName: {
              $cond: {
                if: { $eq: [{ $size: '$iJobProfileId' }, 0] },
                then: '(none)',
                else: {
                  $arrayElemAt: ['$iJobProfileId.sName', 0]
                }
              }
            },
            sJobProfileKey: {
              $cond: {
                if: { $eq: [{ $size: '$iJobProfileId' }, 0] },
                then: '(none)',
                else: {
                  $arrayElemAt: ['$iJobProfileId.sKey', 0]
                }
              }
            }
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

      const [count, employee] = await Promise.all([EmployeeModel.aggregate(count_query), EmployeeModel.aggregate(q)])
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].projectManager), { employee, count: count[0]?.count || 0 })
    } catch (error) {
      console.log(error)
      return catchError('JobProfile.getJobProfilesByPM', error, req, res)
    }
  }

  async addDeviceToken(req, res) {
    try {
      const token = req.header('Authorization')
      const { deviceToken } = req.body

      const { _id } = req.employee

      const employee = await EmployeeModel.findOne({
        _id,
        eStatus: 'Y',
        aJwtTokens: { $elemMatch: { sToken: token } }
      }).lean()
      let flag = false
      const tokenArray = []
      if (employee) {
        for (const t of employee.aJwtTokens) {
          if (t.sToken === token) {
            flag = true
            tokenArray.push({ ...t, sPushToken: deviceToken })
          } else {
            tokenArray.push(t)
          }
        }
      }

      if (flag) {
        await EmployeeModel.updateOne({ _id }, { aJwtTokens: tokenArray })
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].projectManager), { employee, tokenArray })
    } catch (error) {
      return catchError('Employee.addDeviceToken', error, req, res)
    }
  }

  async addCurrency(req, res) {
    try {
      const { iEmployeeId, nPaid, aCurrency } = req.body
      const employeeExist = await EmployeeModel.findOne({ _id: iEmployeeId, eStatus: 'Y' })
      if (!employeeExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee) })

      for (const c of aCurrency) {
        await EmployeeCurrencyModel.create({
          iEmployeeId,
          iCurrencyId: c.iCurrencyId,
          nCost: (Number((c.nCost).toFixed(2))),
          eStatus: 'Y',
          iCreatedBy: req.employee._id,
          iLastUpdateBy: req.employee._id
        })
      }
      const EmployeeExist = await EmployeeModel.findByIdAndUpdate({ _id: iEmployeeId }, { nPaid, iLastUpdateBy: req.employee._id }, {})

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: employeeExist._id, eModule: 'Employee', sService: 'addCurrency', eAction: 'Create', oNewFields: EmployeeExist }

      await take.create(logs)
      // await notificationsender(req, EmployeeExist._id, ' employee currency added ', true, true, req.employee, `${config.urlPrefix}/employee-management/detail/${EmployeeExist._id}`)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].currency))
    } catch (error) {
      return catchError('Employee.addCurrency', error, req, res)
    }
  }

  async updateCurrency(req, res) {
    try {
      const { iEmployeeId, nPaid, aCurrency } = req.body
      console.log(req.body)
      const employeeExist = await EmployeeModel.findOne({ _id: iEmployeeId, eStatus: 'Y' })
      if (!employeeExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee) })

      const EmployeeCurrency = await EmployeeCurrencyModel.find({ iEmployeeId, eStatus: 'Y' }).lean()

      if (!aCurrency.length) {
        // const currency = await CurrencyModel.find({ eStatus: 'Y' }).lean()
        for (const c of aCurrency) {
          await EmployeeCurrencyModel.create({
            iEmployeeId,
            iCurrencyId: c.iCurrencyId,
            nCost: (Number(Number(c.nCost).toFixed(2))),
            eStatus: 'Y',
            iCreatedBy: req.employee._id,
            iLastUpdateBy: req.employee._id
          })
        }
        const EmployeeUpdate = await EmployeeModel.findByIdAndUpdate(iEmployeeId, { nPaid }, { new: true })
        console.log(EmployeeUpdate)

        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)

        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: employeeExist._id, eModule: 'Employee', sService: 'updateCurrency', eAction: 'Update', oNewFields: EmployeeUpdate }

        await take.create(logs)
        // await notificationsender(req, EmployeeUpdate._id, ' employee currency updated ', true, true, req.employee._id, `${config.urlPrefix}/employee-management/detail/${EmployeeUpdate._id}`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].currency))
      } else {
        // const currencyIds = EmployeeCurrency.map((c) => {
        //   return {
        //     ...c,
        //     iCurrencyId: c.iCurrencyId.toString(),
        //     iEmployeeId: c.iEmployeeId.toString()
        //   }
        // })

        // const inputCurrencyIds = aCurrency.map((c) => {
        //   return {
        //     ...c,
        //     iCurrencyId: c.iCurrencyId.toString(),
        //     iEmployeeId: iEmployeeId.toString()
        //   }
        // })

        // const currencyIdsToBeDeleted = currencyIds.filter((c) => {
        //   return !inputCurrencyIds.some((i) => i.iCurrencyId === c.iCurrencyId)
        // })
        // const currencyIdsTOBeCreated = inputCurrencyIds.filter((c) => {
        //   return !currencyIds.some((i) => i.iCurrencyId === c.iCurrencyId)
        // })
        // const currencyIdsTOBeUpdated = inputCurrencyIds.filter((c) => {
        //   return inputCurrencyIds.some((i) => i.iCurrencyId === c.iCurrencyId)
        // })

        // console.log('currencyIdsToBeDeleted', currencyIdsToBeDeleted)
        // console.log('currencyIdsTOBeCreated', currencyIdsTOBeCreated)
        // console.log('currencyIdsTOBeUpdated', currencyIdsTOBeUpdated)

        // for (const c of currencyIdsToBeDeleted) {
        //   await EmployeeCurrencyModel.updateOne({ iEmployeeId: c.iEmployeeId, iCurrencyId: c.iCurrencyId, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })
        // }
        // for (const c of currencyIdsTOBeCreated) {
        //   await EmployeeCurrencyModel.create({
        //     iEmployeeId,
        //     iCurrencyId: c.iCurrencyId,
        //     nCost: (Number((c.nCost).toFixed(2))),
        //     eStatus: 'Y',
        //     iCreatedBy: req.employee._id,
        //     iLastUpdateBy: req.employee._id
        //   })
        // }
        // for (const c of currencyIdsTOBeUpdated) {
        //   const a = await EmployeeCurrencyModel.updateOne({ iEmployeeId: c.iEmployeeId, iCurrencyId: c.iCurrencyId, eStatus: 'Y' }, {
        //     nCost: (Number((c.nCost).toFixed(2))),
        //     iLastUpdateBy: req.employee._id
        //   })
        //   console.log(a)
        // }

        // delete all currency
        await EmployeeCurrencyModel.updateMany({ iEmployeeId, eStatus: 'Y' }, { eStatus: 'N', iLastUpdateBy: req.employee._id })

        // add new currency
        for (const c of aCurrency) {
          await EmployeeCurrencyModel.create({
            iEmployeeId,
            iCurrencyId: c.iCurrencyId,
            // convert to number and fix to 2 decimal places
            nCost: (Number(Number(c.nCost).toFixed(2))),
            eStatus: 'Y',
            iCreatedBy: req.employee._id,
            iLastUpdateBy: req.employee._id
          })
        }

        const EmployeeUpdate = await EmployeeModel.findByIdAndUpdate(iEmployeeId, { nPaid }, { new: true })
        console.log(EmployeeUpdate)

        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: employeeExist._id, eModule: 'Employee', sService: 'updateCurrency', eAction: 'Update', oNewFields: EmployeeUpdate }

        await take.create(logs)
        await notificationsender(req, EmployeeUpdate._id, ' employee currency updated ', true, true, req.employee._id, `${config.urlPrefix}/employee-management/detail/${EmployeeUpdate._id}`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].currency))
      }
    } catch (error) {
      return catchError('Employee.updateCurrency', error, req, res)
    }
  }

  async cewp(req, res) {
    try {
      req.body = pick(req.body, ['aRole'])

      const Role = []
      const Permission = []
      let exist
      for (const role of req.body.aRole) {
        exist = await RoleModel.findOne({ _id: role, eStatus: 'Y' }).populate({
          path: 'aPermissions',
          match: { eStatus: 'Y', bIsActive: true },
          select: '_id sName sKey eStatus bIsActive '
        }).lean()
        console.log(exist)
        if (!exist) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].role) })
        } else {
          Role.push({
            iRoleId: exist._id,
            sName: exist.sName,
            sKey: exist.sKey
          })
        }
        for (const permission of exist.aPermissions) {
          if (!Permission.find((p) => p.sKey === permission.sKey)) {
            Permission.push({
              sKey: permission.sKey
            })
          }
        }
      }
      console.log(Role)

      req.body.aRole = Role
      req.body.aTotalPermissions = Permission

      // console.log(req.employee)

      // update employee role
      const check = await EmployeeModel.findOneAndUpdate({ _id: req.employee._id }, { aRole: req.body.aRole, aTotalPermissions: req.body.aTotalPermissions })
      console.log(check)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success, {
        aRole: req.body.aRole,
        aPermissions: req.body.aTotalPermissions
      })
    } catch (error) {
      return catchError('Employee.cewp', error, req, res)
    }
  }

  async setpassword(req, res) {
    try {
      const data = 'pranav.kakadiya@yudiz.com'
      const token = jwt.sign({ data }, config.JWT_SECRET, {
        expiresIn: config.JWT_VALIDITY
      })
      const userLink = new OtpModel({
        sLogin: 'pranav.kakadiya@yudiz.com',
        sVerificationToken: token,
        sType: 'Set-Password',
        dStartAt: moment(),
        dCreatedAt: moment().add(5, 'minutes').toDate()
      })

      await userLink.save()
      const body = {
        type: 'Set-Password',
        NAME: 'ramesh',
        EMAIL: 'pranav.kakadiya@yudiz.com',
        RESET: config.resetLink.replace('add_token', token).replace('reset-link', 'set-link')
      }

      sendEmail(body)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success)
    } catch (error) {
      catchError('Employee.setpassword', error, req, res)
    }
  }

  async employeeCurrencies(req, res) {
    try {
      const { iEmployeeId, iCurrencyId } = req.query

      const employeeCurrency = await EmployeeCurrencyModel.findOne({ iEmployeeId, iCurrencyId, eStatus: 'Y' }).lean()

      // therea astatus change from not found to ok

      if (!employeeCurrency) return res.status(status.OK).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].currency) })

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace(messages[req.userLanguage].currency), employeeCurrency)
    } catch (error) {
      catchError('Employee.employeeCurrencies', error, req, res)
    }
  }

  // async animation(req, res) {
  //   try {
  //     res.setHeader('Content-Type', 'text/event-stream')
  //     res.setHeader('Cache-Control', 'no-cache')
  //     res.setHeader('Connection', 'keep-alive')

  //     let isServerClosed = false

  //     // Send random numbers at an interval of 1 second (1000 milliseconds)
  //     const intervalId = setInterval(() => {
  //       if (isServerClosed) {
  //         return
  //       }
  //       // Generate a random number between 1 and 100
  //       // const randomNumber = Math.floor(Math.random() * 100) + 1
  //       // Send the random number as an SSE event

  //       // read the file

  //       const data = fs.readFileSync(path.join(__dirname, 'man1.txt'))
  //       console.log(data.toString())

  //       // send the frame
  //       res.write(`data: ${data}\n\n`)
  //     }, 100)

  //     // Stop sending data after 10 seconds (10,000 milliseconds)
  //     setTimeout(() => {
  //       isServerClosed = true
  //       clearInterval(intervalId)
  //       // Send a special event to indicate the end of the stream
  //       console.log('closing')
  //       res.end()
  //     }, 1100) // Adjust the duration as needed

  //     // Handle the client disconnect event
  //     req.on('close', () => {
  //       clearInterval(intervalId)
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  async animation(req, res) {
    try {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const intervalId = setInterval(() => {
        res.write(`data: ${new Date().toJSON()}\n\n`)
      }, 100)

      setTimeout(() => {
        res.write('data: working Perfect\n\n')
        clearInterval(intervalId)
        res.end()
      }, 10000)

      req.on('close', () => {
        clearInterval(intervalId)
      })
    } catch (error) {
      res.send('not Working')
      console.log(error)
    }
  }
}

// setTimeout(() => {
//   sendNotifications()
//   sendProjectNotifications()
// }, 2000)

// setTimeout(() => {
//   sendTimedNotification()
// }, 1000)

// setTimeout(() => {
//   downloadExcel()
//   sendEmailQueue()
//   // preflightDownloadExcel()
// }, 1000)

module.exports = new Employee()
