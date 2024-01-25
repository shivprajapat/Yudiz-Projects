/* eslint-disable no-unused-vars */
const OrganizationDetailModel = require('./model')
const Logs = require('../Logs/model')
const EmployeeModel = require('../Employee/model')
const DepartmentModel = require('../Department/model')
const JobProfileModel = require('../JobProfile/model')
const config = require('../../config/config')
const { status, messages, jsonStatus } = require('../../helper/api.responses')

const s3 = require('../../helper/s3')

const { catchError, projection, keygen, SuccessResponseSender, ErrorResponseSender, paginationValue, camelCase, searchValidate } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { ResourceManagementDB } = require('../../database/mongoose')

const { queuePush } = require('../../helper/redis')

async function notificationsender(req, params, sBody, isRecorded, isNotify) {
  try {
    const data = await OrganizationDetailModel.findOne({ _id: params }).lean()

    // const nameObject = {
    //   pm: ['pm', 'JR.BLOCKCHAIN DEVELOPER', 'PROJECT MANAGER', 'PROJECT MANAGER (PM)', '(PM)', 'PM (PROJECT MANAGER)'],
    //   bde: ['bde', 'BUSINESS DEVELOPMENT EXECUTIVE', 'BUSINESS DEVELOPMENT EXECUTIVE (BDE)', 'BDE (BUSINESS DEVELOPMENT EXECUTIVE)', '(BDE)', 'BDE'],
    //   bdm: ['bdm', 'BUSINESS DEVELOPMENT MANAGER', 'BUSINESS DEVELOPMENT MANAGER (BDM)', 'BDM (BUSINESS DEVELOPMENT MANAGER)', '(BDM)', 'BDM'],
    //   hr: ['hr', 'HR', 'HR (HUMAN RESOURCE)', 'HUMAN RESOURCE', 'HUMAN RESOURCE (HR)', '(HR)', 'HR'],
    //   qa: ['qa', 'QA', 'QA (QUALITY ASSURANCE)', 'QUALITY ASSURANCE', 'QUALITY ASSURANCE (QA)', '(QA)', 'QA'],
    //   dev: ['dev', 'DEVELOPER', 'DEVELOPER (DEV)', 'DEV (DEVELOPER)', '(DEV)', 'DEV'],
    //   techLead: ['techLead', 'TECHNICAL LEAD', 'TECHNICAL LEAD (TL)', 'TL (TECHNICAL LEAD)', '(TL)', 'TL'],
    //   ba: ['ba', 'BUSINESS ANALYST', 'BUSINESS ANALYST (BA)', 'BA (BUSINESS ANALYST)', '(BA)', 'BA'],
    //   admin: ['admin', 'ADMIN', 'ADMIN (ADMINISTRATOR)', 'ADMINISTRATOR', 'ADMINISTRATOR (ADMIN)', '(ADMIN)', 'ADMIN']
    // }
    // const q = [
    //   {
    //     $match: {
    //       eStatus: 'Y'
    //     }
    //   },
    //   {
    //     $project: {
    //       sName: 1,
    //       iJobProfileId: 1,
    //       aJwtTokens: 1,
    //       dCreatedAt: 1,
    //       dUpdatedAt: 1
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'jobprofiles',
    //       let: { jobProfileId: '$iJobProfileId' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ['$_id', '$$jobProfileId'] },
    //                 { $eq: ['$eStatus', 'Y'] },
    //                 {
    //                   $or: [
    //                     { $in: ['$sKey', nameObject.pm] },
    //                     { $in: ['$sKey', nameObject.bde] },
    //                     { $in: ['$sKey', nameObject.bdm] },
    //                     { $in: ['$sKey', nameObject.hr] },
    //                     { $in: ['$sKey', nameObject.qa] },
    //                     { $in: ['$sKey', nameObject.dev] },
    //                     { $in: ['$sKey', nameObject.techLead] },
    //                     { $in: ['$sKey', nameObject.ba] },
    //                     { $in: ['$sKey', nameObject.admin] }
    //                   ]
    //                 }

    //               ]
    //             }
    //           }
    //         },
    //         {
    //           $project: {
    //             sName: 1,
    //             iJobProfileId: 1,
    //             sKey: 1,
    //             aJwtTokens: 1
    //           }
    //         }
    //       ],
    //       as: 'iJobProfileId'
    //     }
    //   },
    //   { $unwind: { path: '$iJobProfileId', preserveNullAndEmptyArrays: false } }
    // ]

    // const allEmployee = await EmployeeModel.aggregate(q)
    const department = await DepartmentModel.find({
      eStatus: 'Y',
      bIsSystem: true,
      sKey: {
        $in: ['HR', 'ADMIN', 'MANAGEMENT']
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
      iOrganizationDetailId: data._id,
      sName: data.sName,
      iCreatedBy: data.iLastUpdateBy,
      sType: 'organizationdetail',
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
      sType: 'organizationdetail',
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

class OrganizationDetails {
  async addOrganizationDetails(req, res) {
    try {
      const { sName, nHoursPerDay, nDaysPerMonth, sLogo } = req.body

      if (nHoursPerDay <= 0 || nHoursPerDay > 24) {
        return ErrorResponseSender(res, status.NotAcceptable, messages[req.userLanguage].invalid_data.replace('##', messages[req.userLanguage].hours_per_day))
      }

      if (nDaysPerMonth <= 0 || nDaysPerMonth > 31) {
        return ErrorResponseSender(res, status.NotAcceptable, messages[req.userLanguage].invalid_data.replace('##', messages[req.userLanguage].days_per_month))
      }

      const detailsLength = await OrganizationDetailModel.findOne({ eStatus: 'Y' }).lean()
      if (detailsLength) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].organization_details))

      const details = await OrganizationDetailModel.findOne({ sKey: keygen(sName), eStatus: 'Y' }).lean()
      if (details) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].organization_details))

      const data = await OrganizationDetailModel.create({ ...req.body, sKey: keygen(sName), iLastUpdateBy: req.employee._id, iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f') })
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'OrganizationDetails', sService: 'addOrganizationDetails', eAction: 'Create', oNewFields: data }
      await take.create(logs)
      // notificationsender(req, data._id, ' organizationDetails is create ', true, true)
      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].organization_details))
    } catch (error) {
      return catchError('OrganizationDetails.addOrganizationDetails', error, req, res)
    }
  }

  async updateOrganizationDetails(req, res) {
    try {
      const { sName, nHoursPerDay, nDaysPerMonth, sLogo } = req.body
      const details = await OrganizationDetailModel.findById({ _id: req.params.id }).lean()
      if (!details) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].organization_details))

      if (nHoursPerDay <= 0 || nHoursPerDay > 24) {
        return ErrorResponseSender(res, status.NotAcceptable, messages[req.userLanguage].invalid_data.replace('##', messages[req.userLanguage].hours_per_day))
      }

      if (nDaysPerMonth <= 0 || nDaysPerMonth > 31) {
        return ErrorResponseSender(res, status.NotAcceptable, messages[req.userLanguage].invalid_data.replace('##', messages[req.userLanguage].days_per_month))
      }

      if (details && details.eStatus === 'Y') {
        const detailsKey = await OrganizationDetailModel.findOne({ sKey: keygen(sName), eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
        if (detailsKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].organization_details))

        let data
        if (sLogo !== details.sLogo) {
          data = await OrganizationDetailModel.findByIdAndUpdate({ _id: req.params.id }, { sName, sKey: keygen(sName), nHoursPerDay, iLastUpdateBy: req.employee._id, nDaysPerMonth, sLogo }, { runValidators: true, new: true })
          if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].organization_details))
        } else {
          const data = await OrganizationDetailModel.findByIdAndUpdate({ _id: req.params.id }, { sName, sKey: keygen(sName), nHoursPerDay, iLastUpdateBy: req.employee._id, nDaysPerMonth }, { runValidators: true, new: true })
          if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].organization_details))
        }
        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: req.params.id, eModule: 'OrganizationDetails', sService: 'updateOrganizationDetails', eAction: 'Update', oNewFields: data, oOldFields: details }
        await take.create(logs)
        // notificationsender(req, data._id, ' organizationDetails is update ', true, true)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].organization_details))
      }
      return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].organization_details))
    } catch (error) {
      return catchError('OrganizationDetails.updateOrganizationDetails', error, req, res)
    }
  }

  async getOrganizationDetails(req, res) {
    try {
      const details = await OrganizationDetailModel.findOne({ eStatus: 'Y' }).lean()

      if (req.path === '/DownloadExcel') {
        return details
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].department), { details })
      }
    } catch (error) {
      return catchError('OrganizationDetails.getOrganizationDetails', error, req, res)
    }
  }

  async getSignedUrl(req, res) {
    try {
      const { sFileName, sContentType } = req.body

      console.log(req.body)

      const bucket = `${config.s3Organization}/OrgDetails/`

      const data = await s3.generateUploadUrl(sFileName, sContentType, bucket)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      catchError('Project.getSignedUrl', error, req, res)
    }
  }
}

module.exports = new OrganizationDetails()
