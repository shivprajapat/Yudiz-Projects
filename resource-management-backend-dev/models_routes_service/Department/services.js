/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const DepartmentModel = require('./model')
const JobProfileModel = require('../JobProfile/model')
const Logs = require('../Logs/model')
const EmployeeModel = require('../Employee/model')

const { status, messages } = require('../../helper/api.responses')
const { catchError, projection, keygen, SuccessResponseSender, ErrorResponseSender, paginationValue, camelCase, searchValidate, getRandomColor, checkcolor } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const ProjectWiseDepartmentModel = require('../Project/projectwisedepartment.model')

const { queuePush } = require('../../helper/redis')
const config = require('../../config/config')

const { ResourceManagementDB } = require('../../database/mongoose')

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await DepartmentModel.findOne({ _id: params }).lean()

    // send notification to department
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
      iDepartmentId: data._id,
      sName: data.sName,
      iCreatedBy: iLastUpdateBy,
      sType: 'department',
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
      sType: 'department',
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

class Department {
  async addDepartment(req, res) {
    try {
      const { sName, sDescription, aDepartmentId = [], aHeadId = [] } = req.body
      const department = await DepartmentModel.findOne({ sKey: keygen(sName), eStatus: 'Y' }).lean()
      if (department) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].department))
      const sColor = await DepartmentModel.find({ eStatus: 'Y' }).lean()
      let s = getRandomColor()
      if (sColor.length) {
        s = checkcolor(s, sColor)
      }

      const ParentDepratmentData = {
        nTotal: 0,
        nMoved: 0
      }

      if (aDepartmentId.length) {
        for (const item of aDepartmentId) {
          const subDepartmentData = await DepartmentModel.findOne({ _id: item, eStatus: 'Y' }).lean()
          if (!subDepartmentData) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
          }
          // console.log(subDepartmentData)
          if (subDepartmentData.iParentId !== null) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].department_have_parent.replace('##', messages[req.userLanguage].department))
          }
          ParentDepratmentData.nTotal = ParentDepratmentData.nTotal + subDepartmentData.nTotal
          ParentDepratmentData.nMoved = ParentDepratmentData.nMoved + subDepartmentData.nMoved
        }
      }

      if (aHeadId.length) {
        for (const item of aHeadId) {
          const employee = await EmployeeModel.findOne({ _id: item, eStatus: 'Y' }).lean()
          if (!employee) {
            return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
          }
        }
      }

      const data = await DepartmentModel.create({ ...req.body, sKey: keygen(sName), sBackGroundColor: s.sBackGroundColor, sTextColor: s.sTextColor, iLastUpdateBy: req.employee._id, iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), ...ParentDepratmentData, aHeadId, sDescription })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)

      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Department', sService: 'addDepartment', eAction: 'Create', oNewFields: data }
      await take.create(logs)

      // update all child department set i parent id to data._id

      if (aDepartmentId.length) {
        await DepartmentModel.updateMany({ _id: { $in: aDepartmentId } }, {
          iParentId: data._id
        })
      }

      // await notificationsender(req, data._id, ' department is create ', true, true, req.employee._id, `${config.urlPrefix}/dashboard`)

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].department), {
        id: data._id
      })
    } catch (error) {
      return catchError('Department.addDepartment', error, req, res)
    }
  }

  async deleteDepartments(req, res) {
    try {
      const department = await DepartmentModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!department) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
      if (department.bIsSystem) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].assigned_to_system.replace('##', messages[req.userLanguage].Department))

      const employee = await EmployeeModel.findOne({ iDepartmentId: department._id, eStatus: 'Y' }).lean()
      if (employee) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].in_used_employee.replace('##', messages[req.userLanguage].department))

      const projectDepartments = await ProjectWiseDepartmentModel.findOne({ iDepartmentId: department._id, eStatus: 'Y' }).lean()
      if (projectDepartments) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].entity_exist_somewhere_in_Project.replace('##', messages[req.userLanguage].department))

      if (department && department.eStatus === 'Y') {
        const childDepartment = await DepartmentModel.findOne({ iParentId: req.params.id, eStatus: 'Y' }).lean()
        if (childDepartment) {
          return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].sub_department_have_child.replace('##', messages[req.userLanguage].department))
        }
        const data = await DepartmentModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)

        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data.id, eModule: 'Department', sService: 'deleteDepartments', eAction: 'Delete', oNewFields: data, oOldFields: department }
        await take.create(logs)

        // await notificationsender(req, req.params.id, ' department is delete ', true, true, req.employee._id, `${config.urlPrefix}/dashboard`)

        // cehck if department have child department

        return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].department))
      }
      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
    } catch (error) {
      return catchError('Department.deleteDepartments', error, req, res)
    }
  }

  async updateDepartments(req, res) {
    try {
      const { sName, sDescription, aDepartmentId = [], aHeadId = [] } = req.body
      const department = await DepartmentModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!department) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
      // if (department.bIsSystem) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].assigned_to_system.replace('##', messages[req.userLanguage].Department))

      if (department && department.eStatus === 'Y' && department.bIsSystem === false) {
        const departmentKey = await DepartmentModel.findOne({ sKey: keygen(sName), eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
        if (departmentKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].department))
        const data = await DepartmentModel.findByIdAndUpdate({ _id: req.params.id, eStatus: 'Y' }, { sName, sKey: keygen(sName), iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data.id, eModule: 'Department', sService: 'updateDepartments', eAction: 'Update', oNewFields: data, oOldFields: department }
        await take.create(logs)

        // await DepartmentModel.updateMany({ iParentId: req.params.id }, {
        //   iParentId: null
        // })

        const removeDepartmentData = {
          nTotal: 0,
          nMoved: 0
        }

        const updateDepartmentData = {
          nTotal: 0,
          nMoved: 0
        }

        const childDepartment = await DepartmentModel.find({ iParentId: req.params.id, eStatus: 'Y' }).lean()
        if (childDepartment.length) {
          for (const item of childDepartment) {
            removeDepartmentData.nTotal = removeDepartmentData.nTotal + item.nTotal
            removeDepartmentData.nMoved = removeDepartmentData.nMoved + item.nMoved
          }
        }

        if (aDepartmentId.length) {
          for (const item of aDepartmentId) {
            const subDepartmentData = await DepartmentModel.findOne({ _id: item, eStatus: 'Y' }).lean()
            if (!subDepartmentData) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
            }
            if (subDepartmentData.iParentId !== null && subDepartmentData.iParentId.toString() !== req.params.id) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].department_have_parent.replace('##', messages[req.userLanguage].department))
            }
            updateDepartmentData.nTotal = updateDepartmentData.nTotal + subDepartmentData.nTotal
            updateDepartmentData.nMoved = updateDepartmentData.nMoved + subDepartmentData.nMoved
          }
        }
        if (aHeadId.length) {
          for (const item of aHeadId) {
            const employee = await EmployeeModel.findOne({ _id: item, eStatus: 'Y' }).lean()
            if (!employee) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
            }
          }
        }

        await DepartmentModel.updateMany({ iParentId: req.params.id }, {
          iParentId: null
        })

        await DepartmentModel.findByIdAndUpdate({ _id: req.params.id }, {
          $inc: {
            nTotal: -removeDepartmentData.nTotal + updateDepartmentData.nTotal,
            nMoved: -removeDepartmentData.nMoved + updateDepartmentData.nMoved
          },
          aHeadId,
          sDescription
        }, { runValidators: true, new: true })

        if (aDepartmentId.length) {
          await DepartmentModel.updateMany({ _id: { $in: aDepartmentId } }, {
            iParentId: data._id
          })
        }

        // await notificationsender(req, req.params.id, ' department is update ', true, true, req.employee._id, `${config.urlPrefix}/dashboard`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].department))
      }
      if (department && department.eStatus === 'Y' && department.bIsSystem === true) {
        const departmentKey = await DepartmentModel.findOne({ sKey: keygen(sName), eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
        if (departmentKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].department))
        const data = await DepartmentModel.findByIdAndUpdate({ _id: req.params.id, eStatus: 'Y' }, { iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))

        let take = `Logs${new Date().getFullYear()}`

        take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data.id, eModule: 'Department', sService: 'updateDepartments', eAction: 'Update', oNewFields: data, oOldFields: department }
        await take.create(logs)

        // await DepartmentModel.updateMany({ iParentId: req.params.id }, {
        //   iParentId: null
        // })

        const removeDepartmentData = {
          nTotal: 0,
          nMoved: 0
        }

        const updateDepartmentData = {
          nTotal: 0,
          nMoved: 0
        }

        const childDepartment = await DepartmentModel.find({ iParentId: req.params.id, eStatus: 'Y' }).lean()
        if (childDepartment.length) {
          for (const item of childDepartment) {
            removeDepartmentData.nTotal = removeDepartmentData.nTotal + item.nTotal
            removeDepartmentData.nMoved = removeDepartmentData.nMoved + item.nMoved
          }
        }

        if (aDepartmentId.length) {
          for (const item of aDepartmentId) {
            const subDepartmentData = await DepartmentModel.findOne({ _id: item, eStatus: 'Y' }).lean()
            if (!subDepartmentData) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
            }
            if (subDepartmentData.iParentId !== null && subDepartmentData.iParentId.toString() !== req.params.id) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].department_have_parent.replace('##', messages[req.userLanguage].department))
            }
            updateDepartmentData.nTotal = updateDepartmentData.nTotal + subDepartmentData.nTotal
            updateDepartmentData.nMoved = updateDepartmentData.nMoved + subDepartmentData.nMoved
          }
        }
        if (aHeadId.length) {
          for (const item of aHeadId) {
            const employee = await EmployeeModel.findOne({ _id: item, eStatus: 'Y' }).lean()
            if (!employee) {
              return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee))
            }
          }
        }

        await DepartmentModel.updateMany({ iParentId: req.params.id }, {
          iParentId: null
        })

        await DepartmentModel.findByIdAndUpdate({ _id: req.params.id }, {
          $inc: {
            nTotal: -removeDepartmentData.nTotal + updateDepartmentData.nTotal,
            nMoved: -removeDepartmentData.nMoved + updateDepartmentData.nMoved
          },
          aHeadId,
          sDescription
        }, { runValidators: true, new: true })

        if (aDepartmentId.length) {
          await DepartmentModel.updateMany({ _id: { $in: aDepartmentId } }, {
            iParentId: data._id
          })
        }

        // await notificationsender(req, req.params.id, ' department is update ', true, true, req.employee._id, `${config.urlPrefix}/dashboard`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].department))
      }

      return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].department))
    } catch (error) {
      return catchError('Department.updateDepartments', error, req, res)
    }
  }

  async getDepartments(req, res) {
    try {
      let { page = 0, limit = 5, sorting = 'dCreatedAt', search = '' } = paginationValue(req.query)
      search = searchValidate(search)
      console.log(search)
      const query = search && search.length
        ? {
          $or: [{ sKey: { $regex: new RegExp(search, 'i') } },
          { sName: { $regex: new RegExp(search, 'i') } }
          ],
          eStatus: 'Y'
        }
        : { eStatus: 'Y' }
      // const [departments, total] = await Promise.all([DepartmentModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(), DepartmentModel.countDocuments({ ...query }).lean()])

      let departments = []
      let total = 0

      if (limit !== 'all') {
        [departments, total] = await Promise.all([DepartmentModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(), DepartmentModel.countDocuments({ ...query }).lean()])
      } else {
        [departments, total] = await Promise.all([DepartmentModel.find(query).sort(sorting).lean(), DepartmentModel.countDocuments({ ...query }).lean()])
      }

      if (req.path === '/DownloadExcel') {
        return departments
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].department), { departments, count: total })
      }
    } catch (error) {
      return catchError('Department.getDepartments', error, req, res)
    }
  }

  async getDepartmentWiseEmployee(req, res) {
    try {
      let { page = 0, limit = 5, sorting = 'dCreatedAt', search = '' } = paginationValue(req.query)
      const aDepartmentIds = req.body.aDepartmentIds
      search = searchValidate(search)
      const query = search && search.length
        ? {
          sName: { $regex: new RegExp(search, 'i') },
          eStatus: 'Y'

        }
        : { eStatus: 'Y' }

      if (req.body.aDepartmentIds.length) {
        query.iDepartmentId = { $in: aDepartmentIds }
      } else {
        query.iDepartmentId = { $in: [] }
      }

      const [employee, total] = await Promise.all([EmployeeModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(), EmployeeModel.countDocuments({ ...query }).lean()])
      if (req.path === '/DownloadExcel') {
        return employee
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].department), { employee, count: total })
      }
    } catch (error) {
      return catchError('Department.getDepartmentWiseEmployee', error, req, res)
    }
  }

  async getDepartmentSummery(req, res) {
    try {
      const { id } = req.params
      const department = await DepartmentModel.findOne({ _id: id, eStatus: 'Y' }).lean()
      if (!department) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
      }

      if (department?.aHeadId?.length) {
        const head = await EmployeeModel.find({ _id: { $in: department.aHeadId }, eStatus: 'Y' }, { sName: 1, sEmpId: 1 }).lean()
        department.aHeadId = head
      }

      const childDepartment = await DepartmentModel.find({ iParentId: id, eStatus: 'Y' }).lean()

      if (childDepartment.length) {
        for (const item of childDepartment) {
          if (item?.aHeadId?.length) {
            const head = await EmployeeModel.find({ _id: { $in: item.aHeadId }, eStatus: 'Y' }).lean()
            item.aHeadId = head
          }
        }
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].department), { department, childDepartment })
    } catch (error) {
      return catchError('Department.getDepartmentSummery', error, req, res)
    }
  }

  // ==========================================================subdepartment operation

  async deleteSubDepartment(req, res) {
    try {
      const { iParentId, iDepartmentId } = req.body
      const departmentExists = await DepartmentModel.findOne({ _id: iDepartmentId, eStatus: 'Y' }).lean()
      if (!departmentExists) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].department))
      }
      // if department exist in any of department parent id
      const departmentParentExists = await DepartmentModel.findOne({ _id: iParentId, eStatus: 'Y' }).lean()
      if (departmentParentExists) {
        return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].sub_department_have_child.replace('##', messages[req.userLanguage].department))
      }

      const data = await DepartmentModel.findByIdAndUpdate({ _id: iDepartmentId }, { iParentId: null }, { runValidators: true, new: true })

      await DepartmentModel.findByIdAndUpdate({ _id: iParentId }, { $inc: { nTotal: -data.nTotal, nMoved: -data.nMoved } }, { runValidators: true, new: true })

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].department))
    } catch (error) {
      return catchError('Department.deleteSubDepartment', error, req, res)
    }
  }

  async getDepartmentSummeryEmployee(req, res) {
    try {
      const { id } = req.params
      let { page = 0, limit = 5, eAvailabilityStatus, search = '', sort = 'dCreatedAt', order } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      search = searchValidate(search)
      const sorting = { [sort]: orderBy }

      const department = await DepartmentModel.findOne({ _id: id, eStatus: 'Y' }).lean()
      if (!department) {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].employee), { Employees: [], count: 0 })
      }

      const childDepartment = await DepartmentModel.find({ iParentId: id, eStatus: 'Y' }).lean()

      const childDepartmentIds = childDepartment.map((item) => ObjectId(item._id))
      const q = [
        {
          $match: { eEmpType: 'E', eStatus: 'Y', iDepartmentId: { $in: [...childDepartmentIds, ObjectId(id)] } }
        },
        {
          $lookup: {
            from: 'orgbranches',
            let: { branchId: '$iBranchId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$branchId'] } } },
              {
                $lookup: {
                  from: 'countries',
                  let: { countryId: '$iCountryId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$countryId'] } } },
                    { $project: { _id: 1, sName: 1 } }
                  ],
                  as: 'country'
                }
              },
              {
                $unwind: {
                  path: '$country',
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $lookup: {
                  from: 'states',
                  let: { stateId: '$iStateId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$stateId'] } } },
                    { $project: { _id: 1, sName: 1 } }
                  ],
                  as: 'state'
                }
              },
              {
                $unwind: {
                  path: '$state',
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $lookup: {
                  from: 'cities',
                  let: { cityId: '$iCityId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$cityId'] } } },
                    { $project: { _id: 1, sName: 1 } }
                  ],
                  as: 'city'
                }
              },
              {
                $unwind: {
                  path: '$city',
                  preserveNullAndEmptyArrays: true
                }
              }
            ],
            as: 'branch'
          }
        },
        {
          $unwind: {
            path: '$branch',
            preserveNullAndEmptyArrays: true
          }
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
            sDepartment: { $first: '$department' },
            sJobProfile: { $first: '$jobprofile' },
            nExperience: { $first: '$nExperience' },
            nAvailabilityHours: { $first: '$nAvailabilityHours' },
            projectwiseemployee: { $sum: 1 },
            iDepartmentId: { $first: '$iDepartmentId' },
            eGrade: { $first: '$eGrade' },
            dCreatedAt: { $first: '$dCreatedAt' },
            eAvailabilityStatus: { $first: '$eAvailabilityStatus' },
            branch: { $first: '$branch' },
            iJobProfileId: { $first: '$iJobProfileId' }
          }
        },
        {
          $project: {
            _id: '$_id',
            sName: '$sName',
            sDepartment: '$sDepartment',
            sJobProfile: '$sJobProfile',
            nExperience: '$nExperience',
            nAvailabilityHours: '$nAvailabilityHours',
            project: '$projectwiseemployee',
            // iDepartmentId: '$iDepartmentId',
            // iJobProfileId: '$iJobProfileId',
            eGrade: '$eGrade',
            dCreatedAt: '$dCreatedAt',
            eAvailabilityStatus: '$eAvailabilityStatus',
            branch: '$branch',
            iDepartmentId: '$iDepartmentId',
            iJobProfileId: '$iJobProfileId'
          }
        }
      ]
      // if (iDepartmentId) {
      //   q.push({ $match: { iDepartmentId: ObjectId(iDepartmentId) } })
      // }
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
        count = await EmployeeModel.countDocuments({
          eStatus: 'Y',
          eEmpType: 'E',
          iDepartmentId: [
            ...childDepartmentIds, ObjectId(id)
          ]
        }).lean()
      }

      if (req.path === '/DownloadExcel') {
        return Employees
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].employee), { Employees, count })
      }
    } catch (error) {
      return catchError('Department.getDepartmentSummeryEmployee', error, req, res)
    }
  }
}

module.exports = new Department()
