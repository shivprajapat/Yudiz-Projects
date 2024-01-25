/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const JobProfileModel = require('./model')
const DepartmentModel = require('../Department/model')
const EmployeeModel = require('../Employee/model')
const Logs = require('../Logs/model')
const { status, messages } = require('../../helper/api.responses')
const { catchError, keygen, SuccessResponseSender, ErrorResponseSender, paginationValue, searchValidate } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { queuePush } = require('../../helper/redis')

const { ResourceManagementDB } = require('../../database/mongoose')
const config = require('../../config/config')
async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await JobProfileModel.findOne({ _id: params }).lean()
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
      iJobProfileId: data._id,
      sName: data.sName,
      iCreatedBy: iLastUpdateBy,
      sType: 'jobProfile',
      sUrl: url,
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
      sType: 'jobProfile',
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

class JobProfile {
  async addJobProfiles(req, res) {
    try {
      const { sName, sPrefix = '' } = req.body
      const jobProfile = await JobProfileModel.findOne({ sKey: keygen(sName), sPrefix, eStatus: 'Y' }).lean()
      if (jobProfile) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].jobProfile))
      const data = await JobProfileModel.create({ ...req.body, sKey: keygen(sName), sPrefix, iLastUpdateBy: req.employee._id, iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f') })
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      console.log('take', take)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'JobProfile', sService: 'addJobProfiles', eAction: 'Create', oNewFields: data }
      await take.create(logs)

      // await notificationsender(req, data._id, ' jobProfile is create ', true, true, req.employee._id, `${config.urlPrefix}/jobProfile/detail/${data._id}`)
      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].jobProfile), {
        id: data._id
      })
    } catch (error) {
      return catchError('JobProfile.addJobProfiles', error, req, res)
    }
  }

  async deleteJobProfiles(req, res) {
    try {
      const jobProfile = await JobProfileModel.findOne({ _id: req.params.id }).lean()

      if (!jobProfile) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].jobProfile))

      if (jobProfile.bIsSystem) {
        return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].assigned_to_system.replace('##', messages[req.userLanguage].jobProfile))
      }

      const employee = await EmployeeModel.findOne({ iJobProfileId: jobProfile._id, eStatus: 'Y' }).lean()
      if (employee) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].in_used_employee.replace('##', messages[req.userLanguage].jobProfile))

      if (jobProfile && jobProfile.eStatus === 'Y') {
        const data = await JobProfileModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { new: true, runValidators: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].jobProfile, data))
        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)

        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'JobProfile', sService: 'deleteJobProfiles', eAction: 'Delete', oNewFields: data, oOldFields: jobProfile }
        await take.create(logs)

        // await notificationsender(req, data._id, ' jobProfile is delete ', true, true, req.employee._id, `${config.urlPrefix}/jobProfile/detail/${data._id}`)
        return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].jobProfile, data))
      }

      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].jobProfile))
    } catch (error) {
      return catchError('JobProfile.deleteJobProfiles', error, req, res)
    }
  }

  async updateJobProfiles(req, res) {
    try {
      const { sName, sPrefix = '' } = req.body
      const jobProfile = await JobProfileModel.findById({ _id: req.params.id }).lean()
      console.log(jobProfile)
      console.log('req.body', req.body)
      if (!jobProfile) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].jobProfile))
      if (jobProfile && jobProfile.eStatus === 'Y' && jobProfile.bIsSystem === false) {
        const jobProfileKey = await JobProfileModel.findOne({ sKey: keygen(sName), sPrefix, eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
        if (jobProfileKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].jobProfileKey))
        const data = await JobProfileModel.findByIdAndUpdate({ _id: req.params.id }, { ...req.body, sKey: keygen(sName), iLastUpdateBy: req.employee._id, sPrefix, nLevel: req.body.nLevel }, { new: true, runValidators: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].jobProfile))

        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)

        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'JobProfile', sService: 'updateJobProfiles', eAction: 'Update', oNewFields: data, oOldFields: jobProfile }
        await Logs.create(logs)

        // await notificationsender(req, data._id, ' jobProfile is update ', true, true, req.employee._id, `${config.urlPrefix}/jobProfile/detail/${data._id}`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].jobProfile))
      }
      if (jobProfile && jobProfile.eStatus === 'Y' && jobProfile.bIsSystem === true) {
        const jobProfileKey = await JobProfileModel.findOne({ sKey: keygen(sName), sPrefix, eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
        if (jobProfileKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].jobProfileKey))
        const data = await JobProfileModel.findByIdAndUpdate({ _id: req.params.id }, { iLastUpdateBy: req.employee._id, sDescription: req.body.sDescription, nLevel: req.body.nLevel }, { new: true, runValidators: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].jobProfile))

        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)

        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'JobProfile', sService: 'updateJobProfiles', eAction: 'Update', oNewFields: data, oOldFields: jobProfile }
        await take.create(logs)

        // await notificationsender(req, data._id, ' jobProfile is update ', true, true, req.employee._id, `${config.urlPrefix}/jobProfile/detail/${data._id}`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].jobProfile))
      }

      return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].jobProfile))
    } catch (error) {
      return catchError('JobProfile.updateJobProfiles', error, req, res)
    }
  }

  async getJobProfiles(req, res) {
    try {
      let { page, limit, sorting, search = '' } = paginationValue(req.query)
      search = searchValidate(search)
      const query = search && search.length
        ? {
          $or: [
            { sKey: { $regex: new RegExp(search, 'i') } },
            { sName: { $regex: new RegExp(search, 'i') } },
            { sPrefix: { $regex: new RegExp(search, 'i') } }
          ],
          eStatus: 'Y'
        }
        : { eStatus: 'Y' }
      let jobProfiles = []
      let jobProfilesCount = 0

      if (limit !== 'all') {
        [jobProfiles, jobProfilesCount] = await Promise.all([JobProfileModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)), JobProfileModel.countDocuments({ ...query }).lean()])
      } else {
        [jobProfiles, jobProfilesCount] = await Promise.all([JobProfileModel.find(query).sort(sorting).lean(), JobProfileModel.countDocuments({ ...query }).lean()])
      }

      if (req.path === '/DownloadExcel') {
        return jobProfiles
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].jobProfile), { jobProfiles, count: jobProfilesCount })
      }
    } catch (error) {
      return catchError('JobProfile.getJobProfiles', error, req, res)
    }
  }

  async getJobProfilesByflag(req, res) {
    try {
      let { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt', flag = '' } = req.query

      if (!flag || flag === '') return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].flag_required)

      const orderBy = order && order === 'asc' ? 1 : -1

      const nameObject = {
        pm: ['pm', 'PM', 'JR.BLOCKCHAIN DEVELOPER', 'PROJECT MANAGER', 'PROJECT MANAGER (PM)', '(PM)', 'PM (PROJECT MANAGER)'],
        bde: ['bde', 'BUSINESS DEVELOPMENT EXECUTIVE', 'BUSINESS DEVELOPMENT EXECUTIVE (BDE)', 'BDE (BUSINESS DEVELOPMENT EXECUTIVE)', '(BDE)', 'BDE'],
        bdm: ['bdm', 'BUSINESS DEVELOPMENT MANAGER', 'BUSINESS DEVELOPMENT MANAGER (BDM)', 'BDM (BUSINESS DEVELOPMENT MANAGER)', '(BDM)', 'BDM'],
        hr: ['hr', 'HR', 'HR (HUMAN RESOURCE)', 'HUMAN RESOURCE', 'HUMAN RESOURCE (HR)', '(HR)', 'HR'],
        qa: ['qa', 'QA', 'QA (QUALITY ASSURANCE)', 'QUALITY ASSURANCE', 'QUALITY ASSURANCE (QA)', '(QA)', 'QA'],
        dev: ['dev', 'DEVELOPER', 'DEVELOPER (DEV)', 'DEV (DEVELOPER)', '(DEV)', 'DEV'],
        techLead: ['techLead', 'TECHNICAL LEAD', 'TECHNICAL LEAD (TL)', 'TL (TECHNICAL LEAD)', '(TL)', 'TL'],
        ba: ['ba', 'BUSINESS ANALYST', 'BUSINESS ANALYST (BA)', 'BA (BUSINESS ANALYST)', '(BA)', 'BA'],
        admin: ['admin', 'ADMIN', 'ADMIN (ADMINISTRATOR)', 'ADMINISTRATOR', 'ADMINISTRATOR (ADMIN)', '(ADMIN)', 'ADMIN']
      }

      if (!nameObject[flag]) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].flag_not_found)

      const q = [
        {
          $match: {
            eStatus: 'Y'
          }
        },
        {
          $project: {
            sName: 1,
            iJobProfileId: 1,
            iDepartmentId: 1,
            dCreatedAt: 1,
            dUpdatedAt: 1
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
                      { $eq: ['$eStatus', 'Y'] },
                      { $in: [{ $toUpper: '$sKey' }, nameObject[flag]] }
                    ]
                  }
                }
              },
              {
                $project: {
                  sName: 1,
                  iJobProfileId: 1,
                  sKey: 1
                }
              }
            ],
            as: 'iJobProfileId'
          }
        },
        { $unwind: { path: '$iJobProfileId', preserveNullAndEmptyArrays: false } },
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
                  sName: 1,
                  iDepartmentId: 1
                }
              }
            ],
            as: 'iDepartmentId'
          }
        },
        { $unwind: { path: '$iDepartmentId', preserveNullAndEmptyArrays: false } }
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

      const [count, data] = await Promise.all([EmployeeModel.aggregate(count_query), EmployeeModel.aggregate(q)])

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].dataJobProfile[flag]), { data, count: count[0]?.count || 0 })
    } catch (error) {
      console.log(error)
      return catchError('JobProfile.getJobProfilesByflag', error, req, res)
    }
  }

  async getBaEmployee(req, res) {
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
            iJobProfileId: 1,
            iDepartmentId: 1,
            dCreatedAt: 1,
            dUpdatedAt: 1,
            sProfilePic: 1
          }
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
                      { $eq: ['$eStatus', 'Y'] },
                      { $eq: ['$sKey', 'BUSINESSANALYST'] }
                    ]
                  }
                }
              },
              {
                $project: {
                  sName: 1,
                  sKey: 1,
                  iDepartmentId: 1
                }
              }
            ],
            as: 'sDepartment'
          }
        },
        { $unwind: { path: '$sDepartment', preserveNullAndEmptyArrays: false } },
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
                  sKey: 1
                }
              }
            ],
            as: 'sJobProfile'
          }
        },
        { $unwind: { path: '$sJobProfile', preserveNullAndEmptyArrays: false } }
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

      const [count, data] = await Promise.all([EmployeeModel.aggregate(count_query), EmployeeModel.aggregate(q)])

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success, { data, count: count[0]?.count || 0 })
    } catch (error) {
      return catchError('JobProfile.getBaEmployee', error, req, res)
    }
  }

  async getBdeEmployee(req, res) {
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
            iJobProfileId: 1,
            iDepartmentId: 1,
            dCreatedAt: 1,
            dUpdatedAt: 1,
            sProfilePic: 1
          }
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
                      { $eq: ['$eStatus', 'Y'] },
                      { $eq: ['$sKey', 'SALES'] }
                    ]
                  }
                }
              },
              {
                $project: {
                  sName: 1,
                  sKey: 1,
                  iDepartmentId: 1
                }
              }
            ],
            as: 'sDepartment'
          }
        },
        { $unwind: { path: '$sDepartment', preserveNullAndEmptyArrays: false } },
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
                  sKey: 1
                }
              }
            ],
            as: 'sJobProfile'
          }
        },
        { $unwind: { path: '$sJobProfile', preserveNullAndEmptyArrays: false } }
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

      const [count, data] = await Promise.all([EmployeeModel.aggregate(count_query), EmployeeModel.aggregate(q)])

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success, { data, count: count[0]?.count || 0 })
    } catch (error) {
      return catchError('JobProfile.getBdeEmployee', error, req, res)
    }
  }

  async getPmEmployee(req, res) {
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
            iJobProfileId: 1,
            iDepartmentId: 1,
            dCreatedAt: 1,
            dUpdatedAt: 1,
            sProfilePic: 1
          }
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
                      { $eq: ['$eStatus', 'Y'] },
                      { $eq: ['$sKey', 'PRODUCTDEVELOPMENT'] }
                    ]
                  }
                }
              },
              {
                $project: {
                  sName: 1,
                  sKey: 1,
                  iDepartmentId: 1
                }
              }
            ],
            as: 'sDepartment'
          }
        },
        { $unwind: { path: '$sDepartment', preserveNullAndEmptyArrays: false } },
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
                  sKey: 1
                }
              }
            ],
            as: 'sJobProfile'
          }
        },
        { $unwind: { path: '$sJobProfile', preserveNullAndEmptyArrays: false } }
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

      const [count, data] = await Promise.all([EmployeeModel.aggregate(count_query), EmployeeModel.aggregate(q)])

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success, { data, count: count[0]?.count || 0 })
    } catch (error) {
      return catchError('JobProfile.getPmEmployee', error, req, res)
    }
  }

  async getJobProfileById(req, res) {
    try {
      const id = req.params.id
      const jobProfile = await JobProfileModel.findOne({ _id: id, eStatus: 'Y' }).lean()
      if (!jobProfile) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].jobProfile))
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].jobProfile), { jobProfile })
    } catch (error) {
      return catchError('JobProfile.getJobProfileById', error, req, res)
    }
  }
}

module.exports = new JobProfile()
