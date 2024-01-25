/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const ORGBranchModel = require('./model')
const Logs = require('../Logs/model')
const EmployeeModel = require('../Employee/model')
const DepartmentModel = require('../Department/model')
const JobProfileModel = require('../JobProfile/model')

const { status, messages } = require('../../helper/api.responses')
const { catchError, projection, keygen, SuccessResponseSender, ErrorResponseSender, paginationValue, camelCase, searchValidate } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { ResourceManagementDB } = require('../../database/mongoose')

const { queuePush } = require('../../helper/redis')

const CountryModel = require('./country.model')
const StateModel = require('./state.model')
const CityModel = require('./city.model')

// async function notificationsender(req, params, sBody, isRecorded, isNotify) {
//   try {
//     const data = await OrganizationDetailModel.findOne({ _id: params }).lean()

//     // const nameObject = {
//     //   pm: ['pm', 'JR.BLOCKCHAIN DEVELOPER', 'PROJECT MANAGER', 'PROJECT MANAGER (PM)', '(PM)', 'PM (PROJECT MANAGER)'],
//     //   bde: ['bde', 'BUSINESS DEVELOPMENT EXECUTIVE', 'BUSINESS DEVELOPMENT EXECUTIVE (BDE)', 'BDE (BUSINESS DEVELOPMENT EXECUTIVE)', '(BDE)', 'BDE'],
//     //   bdm: ['bdm', 'BUSINESS DEVELOPMENT MANAGER', 'BUSINESS DEVELOPMENT MANAGER (BDM)', 'BDM (BUSINESS DEVELOPMENT MANAGER)', '(BDM)', 'BDM'],
//     //   hr: ['hr', 'HR', 'HR (HUMAN RESOURCE)', 'HUMAN RESOURCE', 'HUMAN RESOURCE (HR)', '(HR)', 'HR'],
//     //   qa: ['qa', 'QA', 'QA (QUALITY ASSURANCE)', 'QUALITY ASSURANCE', 'QUALITY ASSURANCE (QA)', '(QA)', 'QA'],
//     //   dev: ['dev', 'DEVELOPER', 'DEVELOPER (DEV)', 'DEV (DEVELOPER)', '(DEV)', 'DEV'],
//     //   techLead: ['techLead', 'TECHNICAL LEAD', 'TECHNICAL LEAD (TL)', 'TL (TECHNICAL LEAD)', '(TL)', 'TL'],
//     //   ba: ['ba', 'BUSINESS ANALYST', 'BUSINESS ANALYST (BA)', 'BA (BUSINESS ANALYST)', '(BA)', 'BA'],
//     //   admin: ['admin', 'ADMIN', 'ADMIN (ADMINISTRATOR)', 'ADMINISTRATOR', 'ADMINISTRATOR (ADMIN)', '(ADMIN)', 'ADMIN']
//     // }
//     // const q = [
//     //   {
//     //     $match: {
//     //       eStatus: 'Y'
//     //     }
//     //   },
//     //   {
//     //     $project: {
//     //       sName: 1,
//     //       iJobProfileId: 1,
//     //       aJwtTokens: 1,
//     //       dCreatedAt: 1,
//     //       dUpdatedAt: 1
//     //     }
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: 'jobprofiles',
//     //       let: { jobProfileId: '$iJobProfileId' },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $eq: ['$_id', '$$jobProfileId'] },
//     //                 { $eq: ['$eStatus', 'Y'] },
//     //                 {
//     //                   $or: [
//     //                     { $in: ['$sKey', nameObject.pm] },
//     //                     { $in: ['$sKey', nameObject.bde] },
//     //                     { $in: ['$sKey', nameObject.bdm] },
//     //                     { $in: ['$sKey', nameObject.hr] },
//     //                     { $in: ['$sKey', nameObject.qa] },
//     //                     { $in: ['$sKey', nameObject.dev] },
//     //                     { $in: ['$sKey', nameObject.techLead] },
//     //                     { $in: ['$sKey', nameObject.ba] },
//     //                     { $in: ['$sKey', nameObject.admin] }
//     //                   ]
//     //                 }

//     //               ]
//     //             }
//     //           }
//     //         },
//     //         {
//     //           $project: {
//     //             sName: 1,
//     //             iJobProfileId: 1,
//     //             sKey: 1,
//     //             aJwtTokens: 1
//     //           }
//     //         }
//     //       ],
//     //       as: 'iJobProfileId'
//     //     }
//     //   },
//     //   { $unwind: { path: '$iJobProfileId', preserveNullAndEmptyArrays: false } }
//     // ]

//     // const allEmployee = await EmployeeModel.aggregate(q)
//     const department = await DepartmentModel.find({
//       eStatus: 'Y',
//       bIsSystem: true,
//       sKey: {
//         $in: ['HR', 'ADMIN', 'MANAGEMENT']
//       }
//     }, { _id: 1 }).lean()

//     // const jobProfile = await JobProfileModel.find({
//     //   eStatus: 'Y',
//     //   sPrefix: {
//     //     $in: ['Superior', 'Head', 'Lead', 'Other', 'Manager']
//     //   }
//     // }, { _id: 1 }).lean()

//     const allEmployee = await EmployeeModel.find({
//       eStatus: 'Y',
//       $or: [
//         { iDepartmentId: { $in: department.map((item) => item._id) } }
//         // { iJobProfileId: { $in: jobProfile.map((item) => item._id) } }
//       ]
//     }, {
//       _id: 1,
//       aJwtTokens: 1
//     }).lean()
//     const sPushToken = []
//     const ids = []

//     if (allEmployee.length > 0) {
//       for (const employee of allEmployee) {
//         if (ids.indexOf(employee._id) === -1) {
//           ids.push(employee._id)
//         }
//         if (employee.aJwtTokens.length) {
//           for (const pushtoken of employee.aJwtTokens) {
//             if (pushtoken?.sPushToken && sPushToken.indexOf(pushtoken.sPushToken) === -1) {
//               sPushToken.push(pushtoken.sPushToken)
//             }
//           }
//         }
//       }
//     }

//     const metadata = {
//       iOrganizationDetailId: data._id,
//       sName: data.sName,
//       iCreatedBy: data.iLastUpdateBy,
//       sType: 'organizationdetail',
//       sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
//       isRecorded: isRecorded === true ? 'Y' : 'N',
//       isNotify: isNotify === true ? 'Y' : 'N'
//     }

//     const person = await EmployeeModel.findOne({ _id: data.iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()

//     const putData = {
//       sPushToken,
//       sTitle: 'Resource Management',
//       sBody: `${data.sName}${sBody}by ${person.sName}(${person.sEmpId})`,
//       sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
//       sType: 'organizationdetail',
//       metadata,
//       aSenderId: ids,
//       isRecorded: isRecorded === true ? 'Y' : 'N',
//       isNotify: isNotify === true ? 'Y' : 'N'
//     }

//     await queuePush('Project:Notification', putData)
//   } catch (error) {
//     console.log(error)
//   }
// }

class ORGBranches {
  async addOrganizationBranchDetails(req, res) {
    try {
      let { sName, sAddress, sLatitude, sLongitude, iStateId, iCityId, iCountryId, bIsHeadquarter, nSeatingCapacity, sDescription } = req.body

      bIsHeadquarter = !!(bIsHeadquarter === 'true' || bIsHeadquarter === true)

      // console.log(req.body)

      // find if branch already exist
      const branchExist = await ORGBranchModel.findOne({
        sKey: keygen(sName),
        iCityId,
        eStatus: 'Y'
      })
      if (branchExist) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].organization_branch))
      }

      //   check if one headquarter already exist or not change in message response
      if (bIsHeadquarter) {
        const headquarterExist = await ORGBranchModel.findOne({
          bIsHeadquarter: true,
          eStatus: 'Y'
        })
        if (headquarterExist) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].headQuarter))
        }
      }

      // check if country exist or not
      if (iCountryId) {
        const country = await CountryModel.findOne({ _id: iCountryId, eStatus: 'Y' }).lean()
        if (!country) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].notFound.replace('##', messages[req.userLanguage].country))
        }
      }
      if (iStateId) {
        const state = await StateModel.findOne({ _id: iStateId, eStatus: 'Y', iCountryId }).lean()
        if (!state) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].notFound.replace('##', messages[req.userLanguage].state))
        }
      }
      if (iCityId) {
        const city = await CityModel.findOne({ _id: iCityId, eStatus: 'Y', iStateId, iCountryId }).lean()
        if (!city) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].notFound.replace('##', messages[req.userLanguage].city))
        }
      }

      const branch = await ORGBranchModel.create({
        sName,
        sKey: keygen(sName),
        sAddress,
        sLatitude,
        sLongitude,
        iStateId,
        iCityId,
        iCountryId,
        bIsHeadquarter,
        nSeatingCapacity,
        eStatus: 'Y',
        sDescription
      })

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].create_success.replace('##', messages[req.userLanguage].organization_branch))
    } catch (error) {
      return catchError('ORGBranches.addOrganizationBranchDetails', error, req, res)
    }
  }

  async updateOrganizationBranchDetails(req, res) {
    try {
      const { id } = req.params
      let { sName, sAddress, sLatitude, sLongitude, iStateId, iCityId, iCountryId, bIsHeadquarter, nSeatingCapacity, sDescription } = req.body

      bIsHeadquarter = !!(bIsHeadquarter === 'true' || bIsHeadquarter === true)

      // find if branch already exist
      const branchExist = await ORGBranchModel.findOne({
        _id: { $ne: id },
        sKey: keygen(sName),
        iCityId,
        eStatus: 'Y'
      })
      if (branchExist) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].organization_branch))
      }

      if (iCountryId) {
        const country = await CountryModel.findOne({ _id: iCountryId, eStatus: 'Y' }).lean()
        if (!country) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].notFound.replace('##', messages[req.userLanguage].country))
        }
      }
      if (iStateId) {
        const state = await StateModel.findOne({ _id: iStateId, eStatus: 'Y' }).lean()
        if (!state) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].notFound.replace('##', messages[req.userLanguage].state))
        }
      }

      if (iCityId) {
        const city = await CityModel.findOne({ _id: iCityId, eStatus: 'Y' }).lean()
        if (!city) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].notFound.replace('##', messages[req.userLanguage].city))
        }
      }

      //   check if one headquarter already exist or not change in message response
      if (bIsHeadquarter) {
        const headquarterExist = await ORGBranchModel.findOne({
          _id: { $ne: id },
          bIsHeadquarter: true,
          eStatus: 'Y'
        })
        if (headquarterExist) {
          return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].headQuarter))
        }
      }

      const branch = await ORGBranchModel.findOneAndUpdate({ _id: id, eStatus: 'Y' }, {
        sName,
        sKey: keygen(sName),
        sAddress,
        sLatitude,
        sLongitude,
        iStateId,
        iCityId,
        iCountryId,
        bIsHeadquarter,
        nSeatingCapacity,
        dUpdatedAt: Date.now(),
        sDescription
      })

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].organization_branch))
    } catch (error) {
      return catchError('ORGBranches.updateOrganizationBranchDetails', error, req, res)
    }
  }

  async getOrganizationBranchDetails(req, res) {
    try {
      let { page, limit, sorting, search = '' } = paginationValue(req.query)
      search = searchValidate(search)
      console.log(search)
      const query = search && search.length
        ? {
          $or: [{ sKey: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
          { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
          ],
          eStatus: 'Y'
        }
        : { eStatus: 'Y' }

      let branch = []
      let total = 0

      if (limit !== 'all') {
        [branch, total] = await Promise.all([ORGBranchModel.find(query)
          .populate({
            path: 'iCountryId',
            match: { eStatus: 'Y' }
          })
          .populate({
            path: 'iStateId',
            match: { eStatus: 'Y' }
          }).populate({
            path: 'iCityId',
            match: { eStatus: 'Y' }
          }).sort(sorting)
          .skip(Number(page))
          .limit(Number(limit)).lean(),
        ORGBranchModel.countDocuments({ ...query }).lean()])
      } else {
        [branch, total] = await Promise.all([ORGBranchModel.find(query)
          .populate({
            path: 'iCountryId',
            match: { eStatus: 'Y' }
          })
          .populate({
            path: 'iStateId',
            match: { eStatus: 'Y' }
          }).populate({
            path: 'iCityId',
            match: { eStatus: 'Y' }
          }).sort(sorting),
        ORGBranchModel.countDocuments({ ...query }).lean()])
      }

      if (req.path === '/DownloadExcel') {
        return branch
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].organization_branch), { branch, count: total })
      }
    } catch (error) {
      return catchError('ORGBranches.getOrganizationBranchDetails', error, req, res)
    }
  }

  async getOrganizationBranchDetailsById(req, res) {
    try {
      const { id } = req.params
      const organizationBranch = await ORGBranchModel.aggregate([
        {
          $match: {
            _id: ObjectId(id),
            eStatus: 'Y'
          }
        },
        {
          $lookup: {
            from: 'countries',
            let: { countryId: '$iCountryId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$countryId'] },
                      { $eq: ['$eStatus', 'Y'] }
                    ]
                  }
                }
              }
            ],
            as: 'iCountryId'
          }
        },
        {
          $unwind: {
            path: '$iCountryId',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'states',
            let: { stateId: '$iStateId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$stateId'] },
                      { $eq: ['$eStatus', 'Y'] }
                    ]
                  }
                }
              }
            ],
            as: 'iStateId'
          }
        },
        {
          $unwind: {
            path: '$iStateId',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'cities',
            let: { cityId: '$iCityId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$cityId'] },
                      { $eq: ['$eStatus', 'Y'] }
                    ]
                  }
                }
              }
            ],
            as: 'iCityId'
          }
        },
        {
          $unwind: {
            path: '$iCityId',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            sName: 1,
            sKey: 1,
            sAddress: 1,
            sLatitude: 1,
            sLongitude: 1,
            bIsHeadquarter: 1,
            nSeatingCapacity: 1,
            sDescription: 1,
            iCountryId: {
              $ifNull: ['$iCountryId', null]
            },
            iStateId: {

              $ifNull: ['$iStateId', null]

            },
            iCityId: {

              $ifNull: ['$iCityId', null]

            }
          }
        }
      ])

      if (!organizationBranch) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].notFound.replace('##', messages[req.userLanguage].organization_branch))
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].organization_branch), { organizationBranch: organizationBranch[0] })
    } catch (error) {
      return catchError('ORGBranches.getOrganizationBranchDetailsById', error, req, res)
    }
  }

  async deleteOrganizationBranchDetailsById(req, res) {
    try {
      const { id } = req.params

      const branchExist = await ORGBranchModel.findOne({
        _id: id,
        eStatus: 'Y'
      })
      if (!branchExist) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].organization_branch))
      }

      if (branchExist.bIsHeadquarter) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].at_least_one.replace('##', messages[req.userLanguage].headQuarter))
      }

      //   check if Employee has this branch
      const employeeExist = await EmployeeModel.findOne({
        iBranchId: id,
        eStatus: 'Y'
      })
      if (employeeExist) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].branch_have_employee)
      }

      const branch = await ORGBranchModel.findOneAndUpdate({ _id: id, eStatus: 'Y' }, {
        eStatus: 'N',
        dUpdatedAt: Date.now()
      })

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].organization_branch))
    } catch (error) {
      return catchError('ORGBranches.deleteOrganizationBranchDetailsById', error, req, res)
    }
  }

  async getCountryDetails(req, res) {
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

      const [country, total] = await Promise.all([CountryModel.find(query).skip(Number(page)).limit(Number(limit)).lean(), CountryModel.countDocuments({ ...query }).lean()])
      if (req.path === '/DownloadExcel') {
        return country
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].country), { country, count: total })
      }
    } catch (error) {
      return catchError('ORGBranches.getCountryDetails', error, req, res)
    }
  }

  async getStateDetails(req, res) {
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

      if (req.query.iCountryId) {
        query.iCountryId = req.query.iCountryId
      }
      console.log(query)

      const [state, total] = await Promise.all([StateModel.find(query).skip(Number(page)).limit(Number(limit)).lean(), StateModel.countDocuments({ ...query }).lean()])
      if (req.path === '/DownloadExcel') {
        return state
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].state), { state, count: total })
      }
    } catch (error) {
      return catchError('ORGBranches.getStateDetails', error, req, res)
    }
  }

  async getCityDetails(req, res) {
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

      if (req.query.iCountryId && req.query.iStateId) {
        query.iCountryId = req.query.iCountryId
        query.iStateId = req.query.iStateId
      }

      const [city, total] = await Promise.all([CityModel.find(query).skip(Number(page)).limit(Number(limit)).lean(), CityModel.countDocuments({ ...query }).lean()])
      if (req.path === '/DownloadExcel') {
        return city
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].city), { city, count: total })
      }
    } catch (error) {
      return catchError('ORGBranches.getCityDetails', error, req, res)
    }
  }
}

module.exports = new ORGBranches()
