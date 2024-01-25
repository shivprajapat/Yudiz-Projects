const express = require('express')

const app = express()

const { setProcessEnvUsingSecretManager, assumeRoleCheck, retriveNewToken } = require('./helper/s3')

// assumeRoleCheck()

assumeRoleCheck().then(() => {
  setProcessEnvUsingSecretManager().then(() => {
    require('./database/mongoose')
    require('./middlewares/index')(app)
    require('./queue')
    require('./middlewares/routes')(app)

    setInterval(() => {
      retriveNewToken()
    }, 1000 * 60)

    app.listen(process.env.PORT || 8082, () => {
      console.log('Magic happens on port :: ->' + process.env.PORT)
    })

    // assumeRoleParams

    // console.log(sts)

    // // const data = require('./data.js')`
    // const RoleModel = require('./models_routes_service/Role/model')
    // const PermissionModel = require('./models_routes_service/Permission/model')
    // const EmployeeModel = require('./models_routes_service/Employee/model')
    // const JobProfileModel = require('./models_routes_service/JobProfile/model')
    // // const LogsModel = require('./models_routes_service/Logs/model')

    // // async function addRole() {
    // //   try {
    // //     await RoleModel.deleteMany({})
    // //     for (let i = 0; i < data.role.length; i++) {
    // //       const exist = await RoleModel.findOne({ sName: data.role[i], sKey: data.role[i] })
    // //       if (!exist) {
    // //         const res = await RoleModel.create({ sName: data.role[i], sKey: data.role[i] })
    // //         console.log('res', res)
    // //       }
    // //     }
    // //   } catch (error) {
    // //     console.log('error', error)
    // //   }
    // // }

    // // // addRole()

    // // async function addPermission() {
    // //   try {
    // //     await PermissionModel.deleteMany({})
    // //     for (let i = 0; i < data.permissions.length; i++) {
    // //       const exist = await PermissionModel.findOne({ sName: data.permissions[i].toUpperCase(), sKey: data.permissions[i].toUpperCase() })
    // //       if (!exist) {
    // //         const res = await PermissionModel.create({ sName: data.permissions[i].toUpperCase(), sKey: data.permissions[i].toUpperCase() })
    // //         console.log('res', res)
    // //       }
    // //     }
    // //   } catch (error) {
    // //     console.log('error', error)
    // //   }
    // // }

    // // addPermission()

    // // async function updatePermission() {
    // //   try {
    // //     const permissions = await PermissionModel.find({})
    // //     for (const p of permissions) {
    // //       await PermissionModel.findOneAndUpdate({ _id: p._id }, { bIsActive: true, bIsDefault: true })
    // //     }
    // //     console.log('done')
    // //   } catch (error) {
    // //     console.log('error', error)
    // //   }
    // // }

    // // updatePermission()

    // // async function updatePermission() {
    // //   try {
    // //     const emp = await EmployeeModel.find({ eStatus: 'Y' }).lean()

    // //     for (const e of emp) {
    // //       const jobProfile = await EmployeeModel
    // //     }

    // //     // console.log('length: ', emp.length)
    // //   } catch (error) {
    // //     console.log('error', error)
    // //   }
    // // }

    // // updatePermission()

    // // async function updateRolePermission() {
    // //   try {
    // //     const Role = await RoleModel.find({ sKey: 'EMPLOYEE', eStatus: 'Y' }, { _id: 1 }).lean()
    // //     console.log('Role', Role.map(r => r._id.toString()))

    // //     const aRole = Role.map(r => r._id.toString())

    // //     const employee = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    // //     for (const e of employee) {
    // //       // req.body = pick(req.body, ['aRole'])

    // //       const Role = []
    // //       const Permission = []
    // //       let exist
    // //       for (const role of aRole) {
    // //         exist = await RoleModel.findOne({ _id: role, eStatus: 'Y' }).populate({
    // //           path: 'aPermissions',
    // //           match: { eStatus: 'Y', bIsActive: true },
    // //           select: '_id sName sKey eStatus bIsActive '
    // //         }).lean()
    // //         if (!exist) {
    // //           console.log('not exist role', exist.sName)
    // //         } else {
    // //           Role.push({
    // //             iRoleId: exist._id,
    // //             sName: exist.sName,
    // //             sKey: exist.sKey
    // //           })
    // //         }
    // //         for (const permission of exist.aPermissions) {
    // //           if (!Permission.find((p) => p.sKey === permission.sKey)) {
    // //             Permission.push({
    // //               sKey: permission.sKey
    // //             })
    // //           }
    // //         }
    // //       }
    // //       await EmployeeModel.findOneAndUpdate({ _id: e._id }, { aRole: Role, aTotalPermissions: Permission })
    // //     }
    // //   } catch (error) {
    // //     console.log('error', error)
    // //   }
    // // }

    // // updateRolePermission()
    // // async function permissions() {
    // //   // const a = [
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a35',
    // //   //     sName: 'VIEW_PROJECT_OVERVIEW',
    // //   //     sKey: 'VIEW_PROJECT_OVERVIEW',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.671Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:52.005Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a31',
    // //   //     sName: 'DELETE_REVIEW',
    // //   //     sKey: 'DELETE_REVIEW',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.639Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.987Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a2e',
    // //   //     sName: 'UPDATE_REVIEW',
    // //   //     sKey: 'UPDATE_REVIEW',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.607Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.969Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a29',
    // //   //     sName: 'VIEW_REVIEW',
    // //   //     sKey: 'VIEW_REVIEW',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.575Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.951Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a26',
    // //   //     sName: 'CREATE_REVIEW',
    // //   //     sKey: 'CREATE_REVIEW',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.542Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.933Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a22',
    // //   //     sName: 'DOWNLOAD_CHANGE_REQUEST_EXCEL',
    // //   //     sKey: 'DOWNLOAD_CHANGE_REQUEST_EXCEL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.509Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.911Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a1e',
    // //   //     sName: 'DELETE_CHANGE_REQUEST',
    // //   //     sKey: 'DELETE_CHANGE_REQUEST',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.475Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.893Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a1a',
    // //   //     sName: 'UPDATE_CHANGE_REQUEST',
    // //   //     sKey: 'UPDATE_CHANGE_REQUEST',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.437Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.874Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a16',
    // //   //     sName: 'VIEW_CHANGE_REQUEST',
    // //   //     sKey: 'VIEW_CHANGE_REQUEST',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.404Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.856Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a12',
    // //   //     sName: 'CREATE_CHANGE_REQUEST',
    // //   //     sKey: 'CREATE_CHANGE_REQUEST',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.373Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.839Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a0e',
    // //   //     sName: 'DOWNLOAD_WORKLOGS_EXCEL',
    // //   //     sKey: 'DOWNLOAD_WORKLOGS_EXCEL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.239Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.822Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a0a',
    // //   //     sName: 'DELETE_WORKLOGS',
    // //   //     sKey: 'DELETE_WORKLOGS',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.206Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.804Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a06',
    // //   //     sName: 'VIEW_WORKLOGS',
    // //   //     sKey: 'VIEW_WORKLOGS',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.174Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.785Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c5a02',
    // //   //     sName: 'CREATE_WORKLOGS',
    // //   //     sKey: 'CREATE_WORKLOGS',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.144Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.765Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c59fe',
    // //   //     sName: 'DOWNLOAD_CLIENT_EXCEL',
    // //   //     sKey: 'DOWNLOAD_CLIENT_EXCEL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.112Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.743Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c59fa',
    // //   //     sName: 'DELETE_CLIENT',
    // //   //     sKey: 'DELETE_CLIENT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.081Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.724Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c59f6',
    // //   //     sName: 'UPDATE_CLIENT',
    // //   //     sKey: 'UPDATE_CLIENT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.047Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.705Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070453cc68b6c80d0c59f2',
    // //   //     sName: 'VIEW_CLIENT',
    // //   //     sKey: 'VIEW_CLIENT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:59.015Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.685Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59ef',
    // //   //     sName: 'CREATE_CLIENT',
    // //   //     sKey: 'CREATE_CLIENT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.983Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.666Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59eb',
    // //   //     sName: 'DOWNLOAD_DEPARTMENT_EXCEL',
    // //   //     sKey: 'DOWNLOAD_DEPARTMENT_EXCEL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.951Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.646Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59e7',
    // //   //     sName: 'DELETE_DEPARTMENT',
    // //   //     sKey: 'DELETE_DEPARTMENT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.919Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.575Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59e3',
    // //   //     sName: 'UPDATE_DEPARTMENT',
    // //   //     sKey: 'UPDATE_DEPARTMENT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.884Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.554Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59df',
    // //   //     sName: 'VIEW_DEPARTMENT',
    // //   //     sKey: 'VIEW_DEPARTMENT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.852Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.533Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59da',
    // //   //     sName: 'CREATE_DEPARTMENT',
    // //   //     sKey: 'CREATE_DEPARTMENT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.819Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.509Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59d7',
    // //   //     sName: 'DOWNLOAD_SKILL_EXCEL',
    // //   //     sKey: 'DOWNLOAD_SKILL_EXCEL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.787Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.488Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59d3',
    // //   //     sName: 'DELETE_SKILL',
    // //   //     sKey: 'DELETE_SKILL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.754Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.466Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59cf',
    // //   //     sName: 'UPDATE_SKILL',
    // //   //     sKey: 'UPDATE_SKILL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.719Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.446Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59cb',
    // //   //     sName: 'VIEW_SKILL',
    // //   //     sKey: 'VIEW_SKILL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.686Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.427Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59c6',
    // //   //     sName: 'CREATE_SKILL',
    // //   //     sKey: 'CREATE_SKILL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.652Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.406Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59c3',
    // //   //     sName: 'DOWNLOAD_PROJECT_EXCEL',
    // //   //     sKey: 'DOWNLOAD_PROJECT_EXCEL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.616Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.385Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59bf',
    // //   //     sName: 'DELETE_PROJECT',
    // //   //     sKey: 'DELETE_PROJECT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.582Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.342Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59bb',
    // //   //     sName: 'UPDATE_PROJECT',
    // //   //     sKey: 'UPDATE_PROJECT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.548Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.319Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59b7',
    // //   //     sName: 'VIEW_PROJECT',
    // //   //     sKey: 'VIEW_PROJECT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.512Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.301Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59b1',
    // //   //     sName: 'CREATE_PROJECT',
    // //   //     sKey: 'CREATE_PROJECT',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.479Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.274Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59aa',
    // //   //     sName: 'DOWNLOAD_EMPLOYEE_EXCEL',
    // //   //     sKey: 'DOWNLOAD_EMPLOYEE_EXCEL',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.445Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.252Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c59a3',
    // //   //     sName: 'DELETE_EMPLOYEE',
    // //   //     sKey: 'DELETE_EMPLOYEE',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.411Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:51.062Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c599b',
    // //   //     sName: 'UPDATE_EMPLOYEE',
    // //   //     sKey: 'UPDATE_EMPLOYEE',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.376Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:50.950Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070452cc68b6c80d0c5995',
    // //   //     sName: 'VIEW_EMPLOYEE',
    // //   //     sKey: 'VIEW_EMPLOYEE',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:58.181Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:50.827Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070451cc68b6c80d0c5980',
    // //   //     sName: 'CREATE_EMPLOYEE',
    // //   //     sKey: 'CREATE_EMPLOYEE',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:57.960Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:50.699Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   },
    // //   //   {
    // //   //     _id: '64070451cc68b6c80d0c5963',
    // //   //     sName: 'VIEW_DASHBOARD',
    // //   //     sKey: 'VIEW_DASHBOARD',
    // //   //     eStatus: 'Y',
    // //   //     dCreatedAt: '2023-03-07T09:30:57.612Z',
    // //   //     dUpdatedAt: '2023-03-10T09:05:50.206Z',
    // //   //     __v: 0,
    // //   //     bIsActive: true,
    // //   //     bIsDefault: true
    // //   //   }
    // //   // ]

    // //   // const ids = []
    // //   // for (let i = 0; i < a.length; i++) {
    // //   //   ids.push(a[i]._id)
    // //   // }

    // //   // console.log(ids)
    // // }

    // // permissions()

    // // async function updateLogs() {
    // //   try {
    // //     const logs = await LogsModel.find({}).lean()

    // //     for (const l of logs) {
    // //       console.log(l)
    // //       // await LogsModel.updateOne({ _id: l._id }, { eStatus: 'Y' })
    // //     }

    // //     console.log('done')
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }

    // // updateLogs()
    // // const data = require('./data.js')
    // // async function CreatePermission() {
    // //   try {
    // //     // console.log('data.permissions.length', data.permissions.length)
    // //     if (data.permissions.length) {
    // //       for (const p of data.permissions) {
    // //         const permissionExist = await PermissionModel.findOne({ sKey: p }).lean()
    // //         if (!permissionExist) {
    // //           await PermissionModel.create({
    // //             sName: p,
    // //             sKey: p,
    // //             eStatus: 'Y',
    // //             bIsActive: true
    // //           })
    // //         }
    // //       }
    // //       console.log('done')
    // //     }
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }

    // // CreatePermission()

    // // async function addRoleAndPermisison() {
    // //   try {
    // //     const employeeExist = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    // //     // console.log('employeeExist', employeeExist.length)

    // //     for (const employee of employeeExist) {
    // //       const Role = []
    // //       const Permission = []
    // //       if (employee.sName === 'Admin' || employee.sName === 'Resourcer') {
    // //         const roleExit = await RoleModel.find({ sKey: { $in: ['ADMIN', 'EMPLOYEES'] }, eStatus: 'Y' }).populate(
    // //           {
    // //             path: 'aPermissions',
    // //             select: 'sKey sName bIsActive _id eStatus',
    // //             match: { eStatus: 'Y', bIsActive: true }
    // //           }
    // //         ).lean()

    // //         console.log('roleExit', roleExit)

    // //         for (const r of roleExit) {
    // //           console.log('r', r.sName, r.aPermissions.length)
    // //           if (!Role.includes(r._id)) {
    // //             Role.push({
    // //               iRoleId: r._id,
    // //               sName: r.sName,
    // //               sKey: r.sKey
    // //             })
    // //             for (const p of r.aPermissions) {
    // //               const index = Permission.findIndex((x) => x.sKey === p.sKey)
    // //               if (index !== -1) {
    // //                 if (r?._id && !Permission[index].aRoleId.includes(r._id)) {
    // //                   Permission[index].aRoleId.push(r._id)
    // //                 }
    // //               } else {
    // //                 Permission.push({
    // //                   sKey: p.sKey,
    // //                   aRoleId: r?._id ? [r._id] : []
    // //                 })
    // //               }
    // //             }
    // //           }
    // //         }
    // //         console.log('Role', Role)
    // //         console.log('Permission', Permission)
    // //         await EmployeeModel.updateOne({ _id: employee._id }, { aRole: Role, aTotalPermissions: Permission })
    // //       } else {
    // //         const roleExit = await RoleModel.find({ sKey: { $in: ['EMPLOYEES'] }, eStatus: 'Y' }).populate(
    // //           {
    // //             path: 'aPermissions',
    // //             select: 'sKey sName bIsActive _id eStatus',
    // //             match: { eStatus: 'Y', bIsActive: true }
    // //           }
    // //         ).lean()

    // //         console.log('roleExit', roleExit)

    // //         for (const r of roleExit) {
    // //           console.log('r', r.sName, r.aPermissions.length)
    // //           if (!Role.includes(r._id)) {
    // //             Role.push({
    // //               iRoleId: r._id,
    // //               sName: r.sName,
    // //               sKey: r.sKey
    // //             })
    // //             for (const p of r.aPermissions) {
    // //               const index = Permission.findIndex((x) => x.sKey === p.sKey)
    // //               if (index !== -1) {
    // //                 if (r?._id && !Permission[index].aRoleId.includes(r._id)) {
    // //                   Permission[index].aRoleId.push(r._id)
    // //                 }
    // //               } else {
    // //                 Permission.push({
    // //                   sKey: p.sKey,
    // //                   aRoleId: r?._id ? [r._id] : []
    // //                 })
    // //               }
    // //             }
    // //           }
    // //         }
    // //         console.log('Role', Role)
    // //         console.log('Permission', Permission)
    // //         await EmployeeModel.updateOne({ _id: employee._id }, { aRole: Role, aTotalPermissions: Permission })
    // //       }
    // //     }

    // //     console.log('done')
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }

    // async function addRoleAndPermisison() {
    //   try {
    //     const employeeExist = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    //     // console.log('employeeExist', employeeExist.length)

    //     let count = 0
    //     for (const employee of employeeExist) {
    //       const Role = []
    //       const Permission = []

    //       if (employee.aRole.length) {
    //         // console.log('employee', employee._id, count++, employee.sName, employee.aRole[0].sKey)

    //         const roleExit = await RoleModel.find({ sKey: employee.aRole[0].sKey, eStatus: 'Y' }).populate(
    //           {
    //             path: 'aPermissions',
    //             select: 'sKey sName bIsActive _id eStatus',
    //             match: { eStatus: 'Y', bIsActive: true }
    //           }
    //         ).lean()

    //         // console.log('roleExit', roleExit)

    //         for (const r of roleExit) {
    //           // console.log('r', r.sName, r.aPermissions.length)
    //           if (!Role.includes(r._id)) {
    //             Role.push({
    //               iRoleId: r._id,
    //               sName: r.sName,
    //               sKey: r.sKey
    //             })
    //             for (const p of r.aPermissions) {
    //               const index = Permission.findIndex((x) => x.sKey === p.sKey)
    //               if (index !== -1) {
    //                 if (r?._id && !Permission[index].aRoleId.includes(r._id)) {
    //                   Permission[index].aRoleId.push(r._id)
    //                 }
    //               } else {
    //                 Permission.push({
    //                   sKey: p.sKey,
    //                   aRoleId: r?._id ? [r._id] : []
    //                 })
    //               }
    //             }
    //           }
    //         }
    //         // console.log('Role', Role)
    //         // console.log('Permission', Permission)
    //         await EmployeeModel.updateOne({ _id: employee._id }, { aRole: Role, aTotalPermissions: Permission })
    //       } else {
    //         const roleExit = await RoleModel.find({ sKey: 'EMPLOYEES', eStatus: 'Y' }).populate(
    //           {
    //             path: 'aPermissions',
    //             select: 'sKey sName bIsActive _id eStatus',
    //             match: { eStatus: 'Y', bIsActive: true }
    //           }
    //         ).lean()

    //         // console.log('roleExit', roleExit)

    //         for (const r of roleExit) {
    //           console.log('r', r.sName, r.aPermissions.length)
    //           if (!Role.includes(r._id)) {
    //             Role.push({
    //               iRoleId: r._id,
    //               sName: r.sName,
    //               sKey: r.sKey
    //             })
    //             for (const p of r.aPermissions) {
    //               const index = Permission.findIndex((x) => x.sKey === p.sKey)
    //               if (index !== -1) {
    //                 if (r?._id && !Permission[index].aRoleId.includes(r._id)) {
    //                   Permission[index].aRoleId.push(r._id)
    //                 }
    //               } else {
    //                 Permission.push({
    //                   sKey: p.sKey,
    //                   aRoleId: r?._id ? [r._id] : []
    //                 })
    //               }
    //             }
    //           }
    //         }
    //         // console.log('Role', Role)
    //         // console.log('Permission', Permission)
    //         await EmployeeModel.updateOne({ _id: employee._id }, { aRole: Role, aTotalPermissions: Permission })
    //       }
    //     }

    //     // console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // addRoleAndPermisison()

    // // function permissionName(myStr) {
    // //   const splitArray = myStr.split('_')
    // //   const resultKey = []
    // //   for (const s of splitArray) {
    // //     resultKey.push(s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    // //   }
    // //   return resultKey.join(' ')
    // // }

    // // permissionKey('read dashboard')

    // // async function updatePermission() {
    // //   try {
    // //     const permissions = await PermissionModel.find({}).lean()
    // //     // console.log(permissions.length)
    // //     for (const p of permissions) {
    // //       // console.log(p.sName, p.sKey)
    // //       // await PermissionModel.updateOne({ _id: p._id }, { sName: permissionName(p.sName) })
    // //     }
    // //     console.log('done')
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }

    // // updatePermission()

    // const { logger, permissions } = require('./data.js')
    // const CryptoJS = require('crypto-js')
    // const { ResourceManagementDB } = require('./database/mongoose')
    // const LogYear = require('./models_routes_service/Logs/logs.model')

    // async function addLogger() {
    //   try {
    //     // const { sName, Year = new Date().getFullYear() } =
    //     // console.log('Year', Year)

    //     // const data = await LogYear+''.create({ sName })

    //     const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    //     const date = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26']
    //     const hour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    //     const minute = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    //     const second = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

    //     const outer = [
    //       {
    //         Year: 2016,
    //         TotalLogs: 10
    //       },
    //       {
    //         Year: 2017,
    //         TotalLogs: 10
    //       },
    //       {
    //         Year: 2018,
    //         TotalLogs: 10
    //       },
    //       {
    //         Year: 2019,
    //         TotalLogs: 10
    //       },
    //       {
    //         Year: 2020,
    //         TotalLogs: 10
    //       },
    //       {
    //         Year: 2021,
    //         TotalLogs: 10
    //       },
    //       {
    //         Year: 2022,
    //         TotalLogs: 10
    //       },
    //       {
    //         Year: 2023,
    //         TotalLogs: 10
    //       },
    //       {
    //         Year: 2024,
    //         TotalLogs: 10
    //       }
    //     ]

    //     let arrayOfData = []
    //     let chunk = 1

    //     for (const y of outer) {
    //       const startTime = new Date().getTime()
    //       // commment if not need
    //       let take = `LogYear${y.Year}`
    //       take = ResourceManagementDB.model(take, LogYear)
    //       // await take.deleteMany({})

    //       for (let i = 0; i < y.TotalLogs; i++) {
    //         // console.log('Year ', y.Year, ' i ', i)
    //         const m = month[Math.floor(Math.random() * month.length)]
    //         const d = date[Math.floor(Math.random() * date.length)]
    //         const h = hour[Math.floor(Math.random() * hour.length)]
    //         const min = minute[Math.floor(Math.random() * minute.length)]
    //         const s = second[Math.floor(Math.random() * second.length)]
    //         const name = permissions[Math.floor(Math.random() * permissions.length)]
    //         const a = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    //           'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    //         const data =
    //         {
    //           sName: `LogYear ${name} ${a[Math.floor(Math.random() * a.length)]}`,
    //           sYear: y.Year,
    //           dCreatedAt: new Date(`${y.Year}-${m}-${d} ${h}:${min}:${s}`),
    //           dUpdatedAt: new Date(`${y.Year}-${m}-${d} ${h}:${min}:${s}`)
    //         }

    //         let take = `LogYear${y.Year}`
    //         arrayOfData.push(data)

    //         if (arrayOfData.length === 50000) {
    //           console.log(chunk * 50000)
    //           chunk = chunk + 1
    //           take = ResourceManagementDB.model(take, LogYear)
    //           const aa = await take.insertMany(arrayOfData)
    //           // console.log('aa', aa)
    //           for (const a of aa) {
    //             await take.updateOne({ _id: a._id }, { $set: { uId: encryptKey(a.sYear) } })
    //           }
    //           arrayOfData = []
    //         }

    //         // console.log('output', output)
    //       }
    //       if (arrayOfData.length < 50000) {
    //         let take = `LogYear${y.Year}`
    //         take = ResourceManagementDB.model(take, LogYear)
    //         const aa = await take.insertMany(arrayOfData)
    //         // console.log('aa', aa)
    //         for (const a of aa) {
    //           await take.updateOne({ _id: a._id }, { $set: { uId: encryptKey(a.sYear) } })
    //         }
    //         arrayOfData = []
    //       }
    //       chunk = 1
    //       arrayOfData = []
    //       const endTime = new Date().getTime()
    //       console.log('Time taken in second', (endTime - startTime) / 1000)
    //     }

    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // addLogger()
    // const OrganizationDetail = require('./models_routes_service/organizationDetail/model')
    // async function deleteData() {
    //   try {
    //     const organizationDetails = await OrganizationDetail.findOne({}).lean()

    //     const collectionsNames = await ResourceManagementDB.db.listCollections().toArray()

    //     const filterCollections = collectionsNames.filter((collection) => {
    //       const regexExp = /^logyear[0-9]{4}/gi
    //       if (collection.name.match(regexExp)) {
    //         collection.year = collection.name.replace('logyear', '')
    //         return collection
    //       }
    //     })

    //     // console.log('filterCollections', filterCollections)
    //     for (const dbDel of filterCollections) {
    //       console.log('dbDel', dbDel.name)
    //       await ResourceManagementDB.db.dropCollection(dbDel.name)
    //     }
    //     //
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // deleteData()

    // const ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef'
    // const IV_VALUE = 'abcdef9876543210abcdef9876543210'
    // function encryptKey(value) {
    //   const encryptedKey = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY)
    //   const iv = CryptoJS.enc.Hex.parse(IV_VALUE)
    //   if (value) {
    //     const message = CryptoJS.enc.Utf8.parse(value)
    //     const encrypted = CryptoJS.AES.encrypt(message, encryptedKey, {
    //       iv,
    //       mode: CryptoJS.mode.CBC,
    //       padding: CryptoJS.pad.Pkcs7
    //     })
    //     const cipherText = encrypted.toString()
    //     return cipherText
    //   }
    // }

    // async function addRoleAndPermisison() {
    //   try {
    //     const employeeExist = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    //     // console.log('employeeExist', employeeExist.length)

    //     for (const employee of employeeExist) {
    //       const Role = []
    //       const Permission = []
    //       if (employee.sName === 'Super Admin' || employee.sName === 'Super Admin') {
    //         const roleExit = await RoleModel.find({ sKey: { $in: ['SUPERADMIN'] }, eStatus: 'Y' }).populate(
    //           {
    //             path: 'aPermissions',
    //             select: 'sKey sName bIsActive _id eStatus',
    //             match: { eStatus: 'Y', bIsActive: true }
    //           }
    //         ).lean()

    //         console.log('roleExit', roleExit)

    //         for (const r of roleExit) {
    //           console.log('r', r.sName, r.aPermissions.length)
    //           if (!Role.includes(r._id)) {
    //             Role.push({
    //               iRoleId: r._id,
    //               sName: r.sName,
    //               sKey: r.sKey,
    //               sBackGroundColor: r.sBackGroundColor,
    //               sTextColor: r.sTextColor
    //             })
    //             for (const p of r.aPermissions) {
    //               const index = Permission.findIndex((x) => x.sKey === p.sKey)
    //               if (index !== -1) {
    //                 if (r?._id && !Permission[index].aRoleId.includes(r._id)) {
    //                   Permission[index].aRoleId.push(r._id)
    //                 }
    //               } else {
    //                 Permission.push({
    //                   sKey: p.sKey,
    //                   aRoleId: r?._id ? [r._id] : []
    //                 })
    //               }
    //             }
    //           }
    //         }
    //         console.log('Role', Role)
    //         console.log('Permission', Permission)
    //         await EmployeeModel.updateOne({ _id: employee._id }, { aRole: Role, aTotalPermissions: Permission })
    //       } else {
    //         const roleExit = await RoleModel.find({ sKey: { $in: ['EMPLOYEES'] }, eStatus: 'Y' }).populate(
    //           {
    //             path: 'aPermissions',
    //             select: 'sKey sName bIsActive _id eStatus',
    //             match: { eStatus: 'Y', bIsActive: true }
    //           }
    //         ).lean()

    //         console.log('roleExit', roleExit)

    //         for (const r of roleExit) {
    //           console.log('r', r.sName, r.aPermissions.length)
    //           if (!Role.includes(r._id)) {
    //             Role.push({
    //               iRoleId: r._id,
    //               sName: r.sName,
    //               sKey: r.sKey,
    //               sBackGroundColor: r.sBackGroundColor,
    //               sTextColor: r.sTextColor
    //             })
    //             for (const p of r.aPermissions) {
    //               const index = Permission.findIndex((x) => x.sKey === p.sKey)
    //               if (index !== -1) {
    //                 if (r?._id && !Permission[index].aRoleId.includes(r._id)) {
    //                   Permission[index].aRoleId.push(r._id)
    //                 }
    //               } else {
    //                 Permission.push({
    //                   sKey: p.sKey,
    //                   aRoleId: r?._id ? [r._id] : []
    //                 })
    //               }
    //             }
    //           }
    //         }
    //         console.log('Role', Role)
    //         console.log('Permission', Permission)
    //         await EmployeeModel.updateOne({ _id: employee._id }, { aRole: Role, aTotalPermissions: Permission })
    //       }
    //     }

    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // addRoleAndPermisison()

    // // const RoleModel = require('./models_routes_service/Role/model')
    // // const { checkcolor, getRandomColor } = require('./helper/utilities.services')

    // // async function updateRoleAndPermisisonColor() {
    // //   try {
    // //     // console.log('updateRoleAndPermisisonColor')
    // //     const roleExist = await RoleModel.find({ }).lean()
    // //     // console.log(roleExist.length)
    // //     for (const role of roleExist) {
    // //       const sColor = await RoleModel.find({ }, {}).lean()
    // //       let s = getRandomColor()
    // //       if (sColor.length) {
    // //         s = checkcolor(s, sColor)
    // //       }
    // //       console.log(s)
    // //       await RoleModel.updateOne({ _id: role._id }, { sBackGroundColor: s.sBackGroundColor, sTextColor: s.sTextColor })
    // //     }
    // //     console.log('done')
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }
    // // updateRoleAndPermisisonColor()

    // // const RoleModel = require('./models_routes_service/Role/model')

    // // async function updateUserProfile() {
    // //   try {
    // //     const employeeModelExists = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    // //     let aRole = []
    // //     for (const e of employeeModelExists) {
    // //       if (e.aRole.length) {
    // //         // get role color forom roleModel
    // //         for (const r of e.aRole) {
    // //           const role = await RoleModel.findOne({ _id: r.iRoleId }).lean()
    // //           r.sBackGroundColor = role.sBackGroundColor
    // //           r.sTextColor = role.sTextColor
    // //           aRole.push(r)
    // //         }
    // //         await EmployeeModel.updateOne({ _id: e._id }, { aRole })
    // //       }
    // //       aRole = []
    // //     }
    // //     // console.log('done')
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }
    // // updateUserProfile()

    // // async function setIsdefaultRole() {
    // //   try {
    // //     const data = await RoleModel.find({}).lean()
    // //     for (const d of data) {
    // //       if (d.sKey === 'ADMIN') {
    // //         await RoleModel.updateOne({ _id: d._id }, { bIsDefault: false })
    // //       } else {
    // //         await RoleModel.updateOne({ _id: d._id }, { bIsDefault: false })
    // //       }
    // //     }
    // //     console.log('done')
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }

    // // setIsdefaultRole()

    // // const DepartmentModel = require('./models_routes_service/Department/model')

    // // const Departments = [
    // //   // {
    // //   //   sName: 'HR',
    // //   //   sKey: 'HR',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(200deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(200deg, 65%, 50%)',
    // //   //   bIsSystem: true
    // //   // },
    // //   // {
    // //   //   sName: 'Admin',
    // //   //   sKey: 'ADMIN',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(201deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(201deg, 65%, 50%)',
    // //   //   bIsSystem: true
    // //   // },
    // //   // {

    // //   //   sName: 'Sales',
    // //   //   sKey: 'SALES',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(202deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(202deg, 65%, 50%)',
    // //   //   bIsSystem: true
    // //   // },
    // //   // {

    // //   //   sName: 'Marketing',
    // //   //   sKey: 'MARKETING',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(203deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(203deg, 65%, 50%)',
    // //   //   bIsSystem: true
    // //   // },
    // //   {
    // //     sName: 'UI/UX',
    // //     sKey: 'UI/UX',
    // //     eStatus: 'Y',
    // //     sBackGroundColor: 'hsl(204deg, 100%, 90%)',
    // //     sTextColor: 'hsl(204deg, 65%, 50%)',
    // //     bIsSystem: false
    // //   },
    // //   {
    // //     sName: 'Designing',
    // //     sKey: 'DESIGNING',
    // //     eStatus: 'Y',
    // //     sBackGroundColor: 'hsl(205deg, 100%, 90%)',
    // //     sTextColor: 'hsl(205deg, 65%, 50%)',
    // //     bIsSystem: false
    // //   },
    // //   {
    // //     sName: 'Web Designing',
    // //     sKey: 'WEBDESIGNING',
    // //     eStatus: 'Y',
    // //     sBackGroundColor: 'hsl(206deg, 100%, 90%)',
    // //     sTextColor: 'hsl(206deg, 65%, 50%)',
    // //     bIsSystem: false
    // //   },
    // //   // {
    // //   //   sName: 'Web Development',
    // //   //   sKey: 'WEBDEVELOPMENT',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(207deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(207deg, 65%, 50%)',
    // //   //   bIsSystem: false
    // //   // },
    // //   // {
    // //   //   sName: 'Mobile App Development',
    // //   //   sKey: 'MOBILEAPPDEVELOPMENT',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(208deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(208deg, 65%, 50%)',
    // //   //   bIsSystem: false
    // //   // },
    // //   // {
    // //   //   sName: 'Game Development',
    // //   //   sKey: 'GAMEDEVELOPMENT',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(209deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(209deg, 65%, 50%)',
    // //   //   bIsSystem: false
    // //   // },
    // //   // {
    // //   //   sName: 'Blockchain',
    // //   //   sKey: 'BLOCKCHAIN',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(210deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(210deg, 65%, 50%)',
    // //   //   bIsSystem: false
    // //   // },
    // //   {
    // //     sName: 'DevOps',
    // //     sKey: 'DEVOPS',
    // //     eStatus: 'Y',
    // //     sBackGroundColor: 'hsl(211deg, 100%, 90%)',
    // //     sTextColor: 'hsl(211deg, 65%, 50%)',
    // //     bIsSystem: false
    // //   },
    // //   // {
    // //   //   sName: 'Management',
    // //   //   sKey: 'MANAGEMENT',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(212deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(212deg, 65%, 50%)',
    // //   //   bIsSystem: true
    // //   // },
    // //   //  {
    // //   //   sName: 'Business Analyst',
    // //   //   sKey: 'BUSINESSANALYST',
    // //   //   eStatus: 'Y',
    // //   //   sBackGroundColor: 'hsl(213deg, 100%, 90%)',
    // //   //   sTextColor: 'hsl(213deg, 65%, 50%)',
    // //   //   bIsSystem: true
    // //   // },
    // //   {
    // //     sName: 'Quality Assurance',
    // //     sKey: 'QUALITYASSURANCE',
    // //     eStatus: 'Y',
    // //     sBackGroundColor: 'hsl(214deg, 100%, 90%)',
    // //     sTextColor: 'hsl(214deg, 65%, 50%)',
    // //     bIsSystem: true
    // //   },
    // //   {
    // //     sName: 'Operation',
    // //     sKey: 'OPERATION',
    // //     eStatus: 'Y',
    // //     sBackGroundColor: 'hsl(215deg, 100%, 90%)',
    // //     sTextColor: 'hsl(215deg, 65%, 50%)',
    // //     bIsSystem: true
    // //   },
    // //   {
    // //     sName: 'Product Development',
    // //     sKey: 'PRODUCTDEVELOPMENT',
    // //     eStatus: 'Y',
    // //     sBackGroundColor: 'hsl(216deg, 100%, 90%)',
    // //     sTextColor: 'hsl(216deg, 65%, 50%)',
    // //     bIsSystem: true
    // //   }
    // // ]

    // // async function updateDepartment() {
    // //   try {
    // //     const data = await DepartmentModel.find({ eStatus: 'Y' }).lean()

    // // console.log(data)

    // // for (const d of data) {
    // //   const match = data.filter((item) => item.sTextColor === d.sTextColor)
    // //   if (match.length > 1) {
    // //     console.log(d)
    // //     console.log(match)
    // //   }
    // // }

    // // for (const d of data) {
    // //   console.log(d.sName, d.sKey)
    // //   // await DepartmentModel.updateOne({ _id: d._id }, { sName: d.sName.trim() })
    // // }

    // // await DepartmentModel.updateOne({ _id: data._id }, { sName: replace.sName, sKey: replace.sKey, sBackGroundColor: replace.sBackGroundColor, sTextColor: replace.sTextColor, bIsSystem: replace.bIsSystem })
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }

    // // updateDepartment()

    // // const PermissionModel = require('./models_routes_service/Permission/model')

    // // async function chengePermission() {
    // //   try {
    // // const permission = await PermissionModel.find({ sKey: { $regex: /^VIEW/ } }).lean()
    // // console.log(permission.map((p) => p.sKey))
    // // for (const p of permission) {
    // //   await PermissionModel.updateOne({ _id: p._id }, { sKey: p.sKey.replace('READ', 'VIEW') })
    // // }
    // //     console.log('done')
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }

    // // chengePermission()

    // // change userPermission
    // // const EmployeeModel = require('./models_routes_service/Employee/model')

    // // async function changeUserPermission() {
    // //   try {
    // //     const employees = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    // //     // console.log(employees.length)
    // //     for (const e of employees) {
    // //       // console.log(e.aTotalPermissions)
    // //       const permission = []
    // //       for (const p of e.aTotalPermissions) {
    // //         if (p.sKey.includes('READ')) {
    // //           permission.push({ ...p, sKey: p.sKey.replace('READ', 'VIEW') })
    // //         } else {
    // //           permission.push(p)
    // //         }
    // //         if (p.sKey.includes('BASIC_DETAILS')) {
    // //           permission.push({ ...p, sKey: p.sKey.replace('BASIC_DETAILS', 'ORGANIZATION_DETAILS') })
    // //         } else {
    // //           permission.push(p)
    // //         }
    // //       }
    // //       console.log(e.sName, permission)
    // //       const update = await EmployeeModel.updateOne({ _id: e._id }, { aTotalPermissions: permission })
    // //       console.log(update)
    // //     }
    // //   } catch (error) {
    // //     console.log(error)
    // //   }
    // // }

    // // changeUserPermission()

    // // script add

    // // script for add country state and city in database
    // const CountryModel = require('./models_routes_service/OrganizationBranch/country.model.js')
    // const StateModel = require('./models_routes_service/OrganizationBranch/state.model.js')
    // const CityModel = require('./models_routes_service/OrganizationBranch/city.model.js')
    // // const csc = require('./countries+states+cities.json')

    // async function addData() {
    //   try {
    //     // console.log(csc.length)
    //     for (const country of csc) {
    //       console.log('country', country.name, ' state', country.states.length)
    //       const countryExist = await CountryModel.create(
    //         {
    //           sName: country.name,

    //           sLatitude: country.latitude,
    //           sLongitude: country.longitude,
    //           sEmoji: country.emoji,
    //           sEmojiU: country.emojiU,
    //           eStatus: 'Y',
    //           sCountryCode: country.countryCode
    //         })
    //       if (country.states.length) {
    //         for (const state of country.states) {
    //           const stateExist = await StateModel.create(
    //             {
    //               sName: state.name,
    //               sStateCode: state.stateCode,
    //               sLatitude: state.latitude,
    //               sLongitude: state.longitude,
    //               eStatus: 'Y',
    //               iCountryId: countryExist._id
    //             })
    //           if (state.cities.length) {
    //             for (const city of state.cities) {
    //               await CityModel.create(
    //                 {
    //                   sName: city.name,
    //                   sLatitude: city.latitude,
    //                   sLongitude: city.longitude,
    //                   eStatus: 'Y',
    //                   iStateId: stateExist._id,
    //                   iCountryId: countryExist._id
    //                 })
    //             }
    //           }
    //         }
    //       }
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // addData()

    // // update employee branchId

    // // const EmployeeModel = require('./models_routes_service/Employee/model')
    // const BranchModel = require('./models_routes_service/OrganizationBranch/model')

    // async function updateEmployeeBranchId() {
    //   try {
    //     const employee = await EmployeeModel.find({}).lean()
    //     for (const e of employee) {
    //       const branch = await BranchModel.findOne({ eStatus: 'Y' }).lean()
    //       if (branch) {
    //         console.log(e.sName, branch.sName)
    //         await EmployeeModel.updateOne({ _id: e._id }, { iBranchId: branch._id })
    //       }
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // // updateEmployeeBranchId()

    // const DepartmentModel = require('./models_routes_service/Department/model')

    // async function updateDepartment() {
    //   try {
    //     const Departments = await DepartmentModel.find({}).lean()
    //     for (const d of Departments) {
    //       await DepartmentModel.findByIdAndUpdate(d._id, { iParentId: null, nTotal: 0, nMoved: 0 })
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // // updateDepartment()

    // async function updateDepartmentLaTLang() {
    //   try {
    //     const branch = await BranchModel.find({ eStatus: 'Y' }).lean()
    //     for (const b of branch) {
    //       await BranchModel.updateOne({ _id: b._id }, {
    //         sLatitude: '23.00138',
    //         sLongitude: '71.822451'
    //       })
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }

    // // updateDepartmentLaTLang()

    // // updateDepartmentByCount()

    // async function getdepartmentDetailRecursive() {
    //   const data = [
    //     {
    //       _id: '62a9c5afbe6064f125f3501f',
    //       sName: 'HR',
    //       sKey: 'hr',
    //       iParentId: null
    //     },
    //     // take other data have a parent id of hr]
    //     {
    //       _id: '62a9c5afbe6064f125f35011',
    //       sName: 'HR1',
    //       sKey: 'hr1',
    //       iParentId: '62a9c5afbe6064f125f3501f'
    //     },
    //     {
    //       _id: '62a9c5afbe6064f125f35012',
    //       sName: 'HR2',
    //       sKey: 'hr2',
    //       iParentId: '62a9c5afbe6064f125f3501f'
    //     },
    //     {
    //       _id: '62a9c5afbe6064f125f35111',
    //       sName: 'HR1.1',
    //       sKey: 'hr1.1',
    //       iParentId: '62a9c5afbe6064f125f35011'
    //     }
    //   ]

    //   const recursiveDepartment = async (id) => {
    //     const department = data.find((d) => d.iParentId === id)
    //     // console.log(department)
    //     if (department) {
    //       recursiveDepartment(department._id)
    //     }
    //   }

    //   const department = await recursiveDepartment('62a9c5afbe6064f125f3501f')
    //   console.log(department)
    // }

    // // getdepartmentDetailRecursive()

    // async function departmemntUpdate() {
    //   const department = await DepartmentModel.find({}).lean()
    //   for (const d of department) {
    //     await DepartmentModel.updateOne({ _id: d._id }, { iParentId: null })
    //   }
    //   console.log('done')
    // }

    // // departmemntUpdate()

    // const OrgBranchModel = require('./models_routes_service/OrganizationBranch/model')

    // async function updateBranchCount() {
    //   try {
    //     await OrgBranchModel.updateMany({}, { nCurrentEmployee: 0 })
    //     const Emplopyee = await EmployeeModel.find({ eStatus: 'Y' }).lean()

    //     // set all Branch count to 0
    //     await OrgBranchModel.updateMany({}, { $set: { nCurrentEmployee: 0 } })

    //     for (const e of Emplopyee) {
    //       await OrgBranchModel.updateOne({ _id: e.iBranchId }, { $inc: { nCurrentEmployee: 1 } })
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // updateBranchCount()

    // async function updateJobProfileCount() {
    //   try {
    //     await JobProfileModel.updateMany({}, { nTotal: 0 })
    //     const Emplopyees = await EmployeeModel.find({ eStatus: 'Y' })
    //     for (const e of Emplopyees) {
    //       // if job profile id exist t
    //       const JobProfileexits = await JobProfileModel.findOne({ _id: e.iJobProfileId })
    //       if (JobProfileexits) {
    //         console.log(e.sName, JobProfileexits.sName, JobProfileexits.nTotal, JobProfileexits.sPrefix, JobProfileexits.nTotal)
    //         await JobProfileModel.updateOne({ _id: e.iJobProfileId }, { $inc: { nTotal: 1 } })
    //       } else {
    //         console.log(e.sName, 'not found')
    //       }
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // // updateJobProfileCount()

    // async function updateDepartmentByCount() {
    //   try {
    //     await DepartmentModel.updateMany({}, { nTotal: 0 })
    //     const Employees = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    //     for (const e of Employees) {
    //       await DepartmentModel.updateOne({ _id: e.iDepartmentId }, {
    //         $inc: { nTotal: 1 }
    //       })
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // // updateDepartmentByCount()

    // async function updateJobProfile() {
    //   try {
    //     const jobProfiles = await JobProfileModel.find({ eStatus: 'Y' }).lean()
    //     for (const j of jobProfiles) {
    //       // if (!j.sLevel) {
    //       //   // console.log(j)
    //       //   await JobProfileModel.updateOne({ _id: j._id }, { sLevel: 'EMP' })
    //       // }
    //       console.log(j)
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // updateJobProfile()
    // const TechnologyModel = require('./models_routes_service/Technology/model')
    // async function updateTechnology() {
    //   try {
    //     const technologies = await TechnologyModel.find({ eStatus: 'Y' }).lean()
    //     for (const t of technologies) {
    //       await TechnologyModel.updateOne({ _id: t._id }, { sLogo: 'Technology/1685611880408_ascascac1.jpg' })
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // // updateTechnology()

    // const ProjectWisedepartmentModel = require('./models_routes_service/Project/projectwisedepartment.model')
    // const ProjectModel = require('./models_routes_service/Project/model')

    // async function updatepercentageCost() {
    //   try {
    //     //     Project B
    //     //     chatGpt
    //     // Resource Management
    //     //     TokenMics
    //     //     11n Wickets
    //     //     Ollato
    //     //     Rector
    //     // small project
    //     //     racing
    //     const Projects = await ProjectModel.find({ eStatus: 'Y', eProjectType: 'Fixed' }).lean()
    //     console.log(Projects.length)

    //     for (const p of Projects) {
    //       console.log(p.sCost)
    //       const projectWiseDepartment = await ProjectWisedepartmentModel.find({ iProjectId: p._id, eStatus: 'Y' }).lean()
    //       for (const pd of projectWiseDepartment) {
    //         // console.log(pd.nCost)
    //         console.log(pd.nCostInPercentage)
    //         const percentage = (pd.nCost / parseInt(p.sCost)) * 100
    //         console.log(percentage)
    //         await ProjectWisedepartmentModel.updateOne({ iProjectId: p._id, _id: pd._id }, { nCostInPercentage: percentage })
    //       }
    //     }

    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // // updatepercentageCost()

    // // backup database

    // async function updatePassword() {
    //   try {
    //     const employees = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    //     for (let i = 0; i < employees.length; i++) {
    //       if (!employees[i]?.sPassword) {
    //         // const password = await bcrypt.hash(employees[i].sPassword, 10)
    //         await EmployeeModel.updateOne({ _id: employees[i]._id }, { sPassword: '$2b$10$m7Y5OVcyBIJpJ9s3X4tAb.ruLZEMwt0NNaON.OIOjKCMZznT8oOMu' })
    //       }
    //     }
    //     console.log(employees.length)
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // updatePassword()

    // const EmployeeCurrencyModel = require('./models_routes_service/Employee/employeeCurrency.model')

    // async function updateEmployeeCurrency() {
    //   try {
    //     const employeeCurrencys = await EmployeeCurrencyModel.find({}).lean()
    //     for (const e of employeeCurrencys) {
    //       // console.log(e.nCost / 60)

    //       console.log(e.nCostPerMinutes)

    //       // const a = await EmployeeCurrencyModel.updateOne({ _id: e._id }, { nCostPerMinutes: e.nCost / 60 })
    //       // console.log(a)
    //       // const a = await EmployeeCurrencyModel.findByIdAndUpdate(e._id, { nCostPerMinutes: e.nCost / 60 })
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // // updateEmployeeCurrency()

    // async function updateNewFieldForShowAllProjects() {
    //   try {
    //     const employees = await EmployeeModel.find({}).lean()
    //     for (const e of employees) {
    //       // const a = await EmployeeModel.updateOne({ _id: e._id }, { eShowAllProjects: 'OWN' })
    //       // console.log('a')
    //       console.log(e.eShowAllProjects)
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // // updateNewFieldForShowAllProjects()

    // async function updatePasswordOfEmployee() {
    //   try {
    //     const employees = await EmployeeModel.find({}).lean()
    //     for (const e of employees) {
    //       // console.log(e)
    //       // const password = await bcrypt.hash(e.sPassword, 10)
    //       // await EmployeeModel.updateOne({ _id: e._id }, { sPassword: password })
    //       // console.log(e.aRole)
    //       let i = 0
    //       for (const r of e.aRole) {
    //         if (r.sName === 'Employees') {
    //           ++i
    //           // console.log(e.sName, r.sName, i)
    //         }
    //       }

    //       if (i > 0) {
    //         // const a = await EmployeeModel.updateOne({ _id: e._id }, { sPassword: '$2b$10$m7Y5OVcyBIJpJ9s3X4tAb.ruLZEMwt0NNaON.OIOjKCMZznT8oOMu' })
    //         // console.log(a)
    //       }
    //     }
    //     console.log('done')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // async function dataE() {
    //   try {
    //     const e = await EmployeeModel.aggregate([
    //       {
    //         $project: {
    //           iJobProfileId: {
    //             $toString: '$iJobProfileId'
    //           }
    //         }
    //       },
    //       {
    //         $group: {
    //           _id: '$iJobProfileId',
    //           // count: { $sum: 1 }
    //           data: { $push: '$$ROOT' }
    //           // sName: { $first: '$sName' }
    //         }
    //       },
    //       {
    //         $group: {
    //           _id: null,
    //           data: {
    //             $push: {
    //               k: '$_id',
    //               v: '$data'
    //             }
    //           }
    //         }
    //       },
    //       {
    //         $replaceRoot: {
    //           newRoot: { $arrayToObject: '$data' }
    //         }
    //       }
    //     ])
    //     console.log(JSON.stringify(e, null, 2))
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // dataE()

    // // updatePasswordOfEmployee()

    // const Projects = require('./models_routes_service/Project/model')
    // const ObjectId = require('mongoose').Types.ObjectId
    // const ProjectwiseemployeeModel = require('./models_routes_service/Project/projectwiseemployee.model')

    // async function getDataUsingScore() {
    //   try {
    //     // const totalProjectsFixed = await Projects.find({
    //     //   eStatus: 'Y',
    //     //   eProjectType: 'Fixed'
    //     // }).populate({
    //     //   path: '_id',
    //     //   match: {
    //     //     iEmployeeId: ObjectId(new ObjectId('6447b39a05d03ce9a0492a16'))
    //     //   }
    //     // })

    //     // const totalProjectsFixed2 = await ProjectwiseemployeeModel.find({ iEmployeeId: new ObjectId('6447b39a05d03ce9a0492a16'), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Fixed' } }).lean()

    //     // const newProjectDedicated = await Projects.find({ eStatus: 'Y', dCreatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } })

    //     // const newProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId('6447b39a05d03ce9a0492a16'), eStatus: 'Y', dCreatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Fixed' } }).lean()

    //     // // console.log(newProjectDedicated)
    //     // for (const n of newProjectDedicated) {
    //     //   console.log(n.dCreatedAt)
    //     // }

    //     // console.log(newProjectDedicated.length)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // getDataUsingScore()

    // async function updateProjectDateBased() {
    //   try {
    //     // const projects = await ProjectModel.find({ eStatus: 'Y' }).lean()
    //     // for (const e of projects) console.log('projectType', e.eProjectType, 'dStartAt', e.dStartDate, 'dContractStartdate', e.dContractStartDate, 'dContractEnddate', e.dContractEndSate)

    //     // const monthlyProjects = await Projects.aggregate([
    //     //   {
    //     //     $match: {
    //     //       eStatus: 'Y',
    //     //       eProjectStatus: { $nin: ['Cancelled'] },
    //     //       _id: { $in: [ObjectId('6450994c83d29a47014174cd'), ObjectId('6458d0d4e8f291b12b4da1a7')] },
    //     //       $expr: {
    //     //         $eq: [{ $year: '$dCreatedAt' }, 2023]
    //     //       }
    //     //     }
    //     //   },
    //     //   {
    //     //     $project: {
    //     //       _id: 1,
    //     //       sName: 1,
    //     //       sLogo: 1,
    //     //       eProjectType: 1,
    //     //       // if project type is fixed then use dStartDate else dContractStartDate
    //     //       dStartDate: {
    //     //         $cond: {
    //     //           if: { $eq: ['$eProjectType', 'Fixed'] },
    //     //           then: '$dStartDate',
    //     //           else: '$dContractStartDate'
    //     //         }
    //     //       }
    //     //     }
    //     //   },
    //     //   {
    //     //     $match: {
    //     //       $expr: {
    //     //         $eq: [{ $year: '$dStartDate' }, 2023]
    //     //       }
    //     //     }
    //     //   }

    //     // ])
    //     // console.log('monthlyProjects', 'monthlyProjects', monthlyProjects)

    //     // const mydate1 = new Date()

    //     // console.log(mydate1)
    //     // const latestFixedProjects = await Projects.aggregate([
    //     //   {
    //     //     $match: {
    //     //       eStatus: 'Y',
    //     //       eProjectStatus: { $in: ['In Progress'] },
    //     //       eProjectType: 'Fixed'
    //     //     }
    //     //   }, {
    //     //     $project: {
    //     //       _id: 1,
    //     //       sName: 1,
    //     //       sLogo: 1,
    //     //       eProjectStatus: 1,
    //     //       eProjectType: 1,
    //     //       dStartDate: { $ifNull: ['$dStartDate', new Date()] },
    //     //       dEndDate: { $ifNull: ['$dEndDate', new Date()] }
    //     //     }
    //     //   },
    //     //   {
    //     //     $project: {
    //     //       _id: 1,
    //     //       sName: 1,
    //     //       sLogo: 1,
    //     //       eProjectStatus: 1,
    //     //       eProjectType: 1,
    //     //       dStartDate: 1,
    //     //       dEndDate: 1,
    //     //       years: {
    //     //         $dateDiff:
    //     //         {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'year'
    //     //         }
    //     //       },
    //     //       months: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'month'
    //     //         }
    //     //       },
    //     //       days: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'day'
    //     //         }
    //     //       },
    //     //       hours: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'hour'
    //     //         }
    //     //       },
    //     //       weeks: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'week'
    //     //         }
    //     //       },
    //     //       milliseconds: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'millisecond'
    //     //         }
    //     //       }
    //     //     }
    //     //   }
    //     // ])
    //     // console.log('latestDedicatedProjects', latestFixedProjects)

    //     // const latestFixedProjects = await Projects.aggregate([
    //     //   {
    //     //     $match: {
    //     //       eStatus: 'Y',
    //     //       eProjectStatus: { $in: ['In Progress'] },
    //     //       eProjectType: 'Fixed'
    //     //     }
    //     //   }, {
    //     //     $project: {
    //     //       _id: 1,
    //     //       sName: 1,
    //     //       sLogo: 1,
    //     //       eProjectStatus: 1,
    //     //       eProjectType: 1,
    //     //       dStartDate: { $ifNull: ['$dStartDate', new Date()] },
    //     //       dEndDate: { $ifNull: ['$dEndDate', new Date()] }
    //     //     }
    //     //   },
    //     //   {
    //     //     $project: {
    //     //       _id: 1,
    //     //       sName: 1,
    //     //       sLogo: 1,
    //     //       eProjectStatus: 1,
    //     //       eProjectType: 1,
    //     //       dStartDate: 1,
    //     //       dEndDate: 1,
    //     //       years: {
    //     //         $dateDiff:
    //     //         {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'year'
    //     //         }
    //     //       },
    //     //       months: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'month'
    //     //         }
    //     //       },
    //     //       days: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'day'
    //     //         }
    //     //       },
    //     //       hours: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'hour'
    //     //         }
    //     //       },
    //     //       weeks: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'week'
    //     //         }
    //     //       },
    //     //       milliseconds: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'millisecond'
    //     //         }
    //     //       }
    //     //     }
    //     //   }
    //     // ])

    //     // const latestDedicatedProjects = await Projects.aggregate([
    //     //   {
    //     //     $match: {
    //     //       eStatus: 'Y',
    //     //       eProjectStatus: { $in: ['In Progress'] },
    //     //       eProjectType: 'Dedicated'
    //     //     }
    //     //   },
    //     //   {
    //     //     $project: {
    //     //       _id: 1,
    //     //       sName: 1,
    //     //       sLogo: 1,
    //     //       eProjectStatus: 1,
    //     //       eProjectType: 1,
    //     //       dStartDate: { $ifNull: ['$dContractStartDate', new Date()] },
    //     //       dEndDate: { $ifNull: ['$dContractEndDate', new Date()] }
    //     //     }
    //     //   },
    //     //   {
    //     //     $project: {
    //     //       _id: 1,
    //     //       sName: 1,
    //     //       sLogo: 1,
    //     //       eProjectStatus: 1,
    //     //       eProjectType: 1,
    //     //       dStartDate: 1,
    //     //       dEndDate: 1,
    //     //       years: {
    //     //         $dateDiff:
    //     //         {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'year'
    //     //         }
    //     //       },
    //     //       months: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'month'
    //     //         }
    //     //       },
    //     //       days: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'day'
    //     //         }
    //     //       },
    //     //       hours: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'hour'
    //     //         }
    //     //       },
    //     //       weeks: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'week'
    //     //         }
    //     //       },
    //     //       milliseconds: {
    //     //         $dateDiff: {
    //     //           startDate: '$dStartDate',
    //     //           endDate: '$dEndDate',
    //     //           unit: 'millisecond'
    //     //         }
    //     //       }
    //     //     }
    //     //   }

    //     // ])

    //     // const data = [...latestFixedProjects, ...latestDedicatedProjects].sort((a, b) => new Date(a?.milliseconds) - new Date(b?.milliseconds)).slice(0, 5)

    //     const monthlyProjects = await Projects.aggregate([
    //       {
    //         $match: {
    //           eStatus: 'Y',
    //           eProjectStatus: { $nin: ['Cancelled'] },
    //           $expr: {
    //             $and: [
    //               {
    //                 $eq: [{ $year: '$dCreatedAt' }, 2023]
    //               },
    //               {
    //                 $eq: [{ $month: '$dCreatedAt' }, 7]
    //               }
    //             ]
    //           }
    //         }
    //       },
    //       {
    //         $group: {
    //           _id: {
    //             $dayOfMonth: '$dCreatedAt'
    //           },
    //           dCreatedAt: { $first: '$dCreatedAt' },
    //           count: { $sum: 1 }
    //         }
    //       },
    //       {
    //         $sort: {
    //           _id: 1
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           date: '$_id',
    //           count: '$count',
    //           dCreatedAt: '$dCreatedAt'
    //         }
    //       }
    //     ])

    //     const data = {
    //       monthlyProjects
    //     }

    //     console.log(data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // updateProjectDateBased()

    // // let i = 0
    // // async function recall() {
    // //   console.log('recall', ++i)
    // //   await recall()
    // // }

    // // recall()

    // async function calcy() {
    //   const yearlyProjects = [
    //     { year: null, count: 15, dCreatedAt: null },
    //     { year: 2022, count: 1, dCreatedAt: '2022-07-03T00:00:00.000Z' },
    //     { year: 2023, count: 14, dCreatedAt: '2023-04 - 25T00:00:00.000Z' }
    //   ]

    //   if (yearlyProjects.length) {
    //     for (const y of yearlyProjects) {
    //       if (y.year === null) {
    //         yearlyProjects.splice(yearlyProjects.indexOf(y), 1)
    //       }
    //     }
    //   }

    //   if (yearlyProjects.length === 0) {
    //     return { maxYear: new Date().getFullYear(), minYear: new Date().getFullYear() }

    //     // console.log({ maxYear: new Date().getFullYear(), minYear: new Date().getFullYear() })
    //   }

    //   if (yearlyProjects.length === 1) {
    //     return { maxYear: yearlyProjects[0].year, minYear: yearlyProjects[0].year }
    //     // console.log({ maxYear: yearlyProjects[0].year, minYear: yearlyProjects[0].year })
    //   }

    //   if (yearlyProjects.length > 1) {
    //     // sort array
    //     yearlyProjects.sort((a, b) => b.year - a.year)
    //     return { maxYear: yearlyProjects[0].year, minYear: yearlyProjects[yearlyProjects.length - 1].year }
    //     // console.log({ maxYear: yearlyProjects[0].year, minYear: yearlyProjects[yearlyProjects.length - 1].year })
    //   }

    //   // console.log(yearlyProjects)
    // }

    // // calcy()

    // async function employeeRemove() {
    //   try {
    //     const employees = await EmployeeModel.find({
    //       sName: { $eq: 'Super Admin' }
    //     })

    //     for (const permission of employees[0].aTotalPermissions) {
    //       console.log(permission)
    //     }

    //     // delete all employee
    //     // await EmployeeModel.deleteMany({ sName: { $ne: 'Super Admin' } })

    //     // console.log(employees)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // employeeRemove()

    // async function removeBranches() {
    //   try {
    //     const branches = await OrgBranchModel.find({
    //       sName: { $ne: 'Bsquare' }
    //     })

    //     // delete all employee
    //     // await OrgBranchModel.deleteMany({ sName: { $ne: 'Bsquare' } })

    //     const Permissions = [
    //       {
    //         sName: 'View Dashboard',
    //         sKey: 'VIEW_DASHBOARD',
    //         sModule: 'DASHBOARD',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Employee',
    //         sKey: 'VIEW_EMPLOYEE',
    //         sModule: 'EMPLOYEE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Employee',
    //         sKey: 'CREATE_EMPLOYEE',
    //         sModule: 'EMPLOYEE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Employee',
    //         sKey: 'UPDATE_EMPLOYEE',
    //         sModule: 'EMPLOYEE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Employee',
    //         sKey: 'DELETE_EMPLOYEE',
    //         sModule: 'EMPLOYEE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Project',
    //         sKey: 'CREATE_PROJECT',
    //         sModule: 'PROJECT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Project',
    //         sKey: 'VIEW_PROJECT',
    //         sModule: 'PROJECT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Project',
    //         sKey: 'UPDATE_PROJECT',
    //         sModule: 'PROJECT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Project',
    //         sKey: 'DELETE_PROJECT',
    //         sModule: 'PROJECT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Skill',
    //         sKey: 'CREATE_SKILL',
    //         sModule: 'SKILL',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'VIEW_SKILL',
    //         sKey: 'VIEW_SKILL',
    //         sModule: 'SKILL',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'UPDATE_SKILL',
    //         sKey: 'UPDATE_SKILL',
    //         sModule: 'SKILL',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Skill',
    //         sKey: 'DELETE_SKILL',
    //         sModule: 'SKILL',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Department',
    //         sKey: 'CREATE_DEPARTMENT',
    //         sModule: 'DEPARTMENT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Department',
    //         sKey: 'VIEW_DEPARTMENT',
    //         sModule: 'DEPARTMENT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Department',
    //         sKey: 'UPDATE_DEPARTMENT',
    //         sModule: 'DEPARTMENT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Department',
    //         sKey: 'DELETE_DEPARTMENT',
    //         sModule: 'DEPARTMENT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Client',
    //         sKey: 'CREATE_CLIENT',
    //         sModule: 'CLIENT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },

    //       {
    //         sName: 'View Client',
    //         sKey: 'VIEW_CLIENT',
    //         sModule: 'CLIENT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Client',
    //         sKey: 'UPDATE_CLIENT',
    //         sModule: 'CLIENT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Client',
    //         sKey: 'DELETE_CLIENT',
    //         sModule: 'CLIENT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Worklogs',
    //         sKey: 'CREATE_WORKLOGS',
    //         sModule: 'WORKLOGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Worklogs',
    //         sKey: 'VIEW_WORKLOGS',
    //         sModule: 'WORKLOGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Worklogs',
    //         sKey: 'DELETE_WORKLOGS',
    //         sModule: 'WORKLOGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Change Request',
    //         sKey: 'CREATE_CHANGE_REQUEST',
    //         sModule: 'CHANGE_REQUEST',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Change Request',
    //         sKey: 'VIEW_CHANGE_REQUEST',
    //         sModule: 'CHANGE_REQUEST',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Change Request',
    //         sKey: 'UPDATE_CHANGE_REQUEST',
    //         sModule: 'CHANGE_REQUEST',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Change Request',
    //         sKey: 'DELETE_CHANGE_REQUEST',
    //         sModule: 'CHANGE_REQUEST',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Review',
    //         sKey: 'CREATE_REVIEW',
    //         sModule: 'REVIEW',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Review',
    //         sKey: 'VIEW_REVIEW',
    //         sModule: 'REVIEW',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Review',
    //         sKey: 'UPDATE_REVIEW',
    //         sModule: 'REVIEW',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Review',
    //         sKey: 'DELETE_REVIEW',
    //         sModule: 'REVIEW',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Project Overview',
    //         sKey: 'VIEW_PROJECT_OVERVIEW',
    //         sModule: 'PROJECT_OVERVIEW',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View S3BucketInfo',
    //         sKey: 'VIEW_S3BUCKETINFO',
    //         sModule: 'S3BUCKETINFO',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Organization Details',
    //         sKey: 'CREATE_ORGANIZATION_DETAILS',
    //         sModule: 'ORGANIZATION_DETAILS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Organization Details',
    //         sKey: 'UPDATE_ORGANIZATION_DETAILS',
    //         sModule: 'ORGANIZATION_DETAILS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Organization Details',
    //         sKey: 'VIEW_ORGANIZATION_DETAILS',
    //         sModule: 'ORGANIZATION_DETAILS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Logs',
    //         sKey: 'UPDATE_LOGS',
    //         sModule: 'LOGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Logs',
    //         sKey: 'CREATE_LOGS',
    //         sModule: 'LOGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Logs',
    //         sKey: 'VIEW_LOGS',
    //         sModule: 'LOGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Logs',
    //         sKey: 'DELETE_LOGS',
    //         sModule: 'LOGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Worklog Tags',
    //         sKey: 'CREATE_WORKLOG_TAGS',
    //         sModule: 'WORKLOG_TAGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Worklog Tags',
    //         sKey: 'VIEW_WORKLOG_TAGS',
    //         sModule: 'WORKLOG_TAGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Worklog Tags',
    //         sKey: 'UPDATE_WORKLOG_TAGS',
    //         sModule: 'WORKLOG_TAGS',
    //         eStatus: 'Y',
    //         bIsActive: true

    //       },
    //       {
    //         sName: 'Delete Worklog Tags',
    //         sKey: 'DELETE_WORKLOG_TAGS',
    //         sModule: 'WORKLOG_TAGS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Technology',
    //         sKey: 'CREATE_TECHNOLOGY',
    //         sModule: 'TECHNOLOGY',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Technology',
    //         sKey: 'VIEW_TECHNOLOGY',
    //         sModule: 'TECHNOLOGY',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Technology',
    //         sKey: 'UPDATE_TECHNOLOGY',
    //         sModule: 'TECHNOLOGY',
    //         eStatus: 'Y',
    //         bIsActive: true

    //       },
    //       {
    //         sName: 'Delete Technology',
    //         sKey: 'DELETE_TECHNOLOGY',
    //         sModule: 'TECHNOLOGY',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Project Tag',
    //         sKey: 'CREATE_PROJECT_TAG',
    //         sModule: 'PROJECT_TAG',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Project Tag',
    //         sKey: 'VIEW_PROJECT_TAG',
    //         sModule: 'PROJECT_TAG',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Project Tag',
    //         sKey: 'UPDATE_PROJECT_TAG',
    //         sModule: 'PROJECT_TAG',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Project Tag',
    //         sKey: 'DELETE_PROJECT_TAG',
    //         sModule: 'PROJECT_TAG',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Notification',
    //         sKey: 'CREATE_NOTIFICATION',
    //         sModule: 'NOTIFICATION',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Notification',
    //         sKey: 'VIEW_NOTIFICATION',
    //         sModule: 'NOTIFICATION',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Notification',
    //         sKey: 'UPDATE_NOTIFICATION',
    //         sModule: 'NOTIFICATION',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Notification',
    //         sKey: 'DELETE_NOTIFICATION',
    //         sModule: 'NOTIFICATION',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Currency',
    //         sKey: 'CREATE_CURRENCY',
    //         sModule: 'CURRENCY',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Currency',
    //         sKey: 'VIEW_CURRENCY',
    //         sModule: 'CURRENCY',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Currency',
    //         sKey: 'UPDATE_CURRENCY',
    //         sModule: 'CURRENCY',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Currency',
    //         sKey: 'DELETE_CURRENCY',
    //         sModule: 'CURRENCY',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Job Profile',
    //         sKey: 'CREATE_JOB_PROFILE',
    //         sModule: 'JOB_PROFILE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Job Profile',
    //         sKey: 'VIEW_JOB_PROFILE',
    //         sModule: 'JOB_PROFILE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Job Profile',
    //         sKey: 'UPDATE_JOB_PROFILE',
    //         sModule: 'JOB_PROFILE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       }, {
    //         sName: 'Delete Job Profile',
    //         sKey: 'DELETE_JOB_PROFILE',
    //         sModule: 'JOB_PROFILE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Role',
    //         sKey: 'CREATE_ROLE',
    //         sModule: 'ROLE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Role',
    //         sKey: 'VIEW_ROLE',
    //         sModule: 'ROLE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Role',
    //         sKey: 'UPDATE_ROLE',
    //         sModule: 'ROLE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Role',
    //         sKey: 'DELETE_ROLE',
    //         sModule: 'ROLE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Permission',
    //         sKey: 'CREATE_PERMISSION',
    //         sModule: 'PERMISSION',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       }, {
    //         sName: 'View Permission',
    //         sKey: 'VIEW_PERMISSION',
    //         sModule: 'PERMISSION',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Permission',
    //         sKey: 'UPDATE_PERMISSION',
    //         sModule: 'PERMISSION',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Permission',
    //         sKey: 'DELETE_PERMISSION',
    //         sModule: 'PERMISSION',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View UserProfile',
    //         sKey: 'VIEW_USERPROFILE',
    //         sModule: 'USERPROFILE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update UserProfile',
    //         sKey: 'UPDATE_USERPROFILE',
    //         sModule: 'USERPROFILE',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Download Employee Excel',
    //         sKey: 'DOWNLOAD_EMPLOYEE_EXCEL',
    //         sModule: 'DOWNLOADS', // or Module specific u can set
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Download Dashboard Excel',
    //         sKey: 'DOWNLOAD_DASHBOARD_EXCEL',
    //         sModule: 'DOWNLOADS', // or Module specific u can set
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Download Logs Excel',
    //         sKey: 'DOWNLOAD_LOGS_EXCEL',
    //         sModule: 'DOWNLOADS', // or Module specific u can set
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Download Change Request Excel',
    //         sKey: 'DOWNLOAD_CHANGE_REQUEST_EXCEL',
    //         sModule: 'DOWNLOADS', // or Module specific u can set
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Download Worklogs Excel',
    //         sKey: 'DOWNLOAD_WORKLOGS_EXCEL',
    //         sModule: 'DOWNLOADS', // or Module specific u can set
    //         eStatus: 'Y',
    //         bIsActive: true
    //       }, {
    //         sName: 'Download Client Excel',
    //         sKey: 'DOWNLOAD_CLIENT_EXCEL',
    //         sModule: 'DOWNLOADS', // or Module specific u can set
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Download Department Excel',
    //         sKey: 'DOWNLOAD_DEPARTMENT_EXCEL',
    //         sModule: 'DOWNLOADS', // or Module specific u can set
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Download Skill Excel',
    //         sKey: 'DOWNLOAD_SKILL_EXCEL',
    //         sModule: 'DOWNLOADS', // or Module specific u can set
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Download Project Excel',
    //         sKey: 'DOWNLOAD_PROJECT_EXCEL',
    //         sModule: 'DOWNLOADS', // or Module specific u can set
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Create Organization Branch',
    //         sKey: 'CREATE_ORGANIZATION_BRANCH',
    //         sModule: 'ORGANIZATION_BRANCH',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Organization Branch',
    //         sKey: 'VIEW_ORGANIZATION_BRANCH',
    //         sModule: 'ORGANIZATION_BRANCH',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Organization Branch',
    //         sKey: 'UPDATE_ORGANIZATION_BRANCH',
    //         sModule: 'ORGANIZATION_BRANCH',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Delete Organization Branch',
    //         sKey: 'DELETE_ORGANIZATION_BRANCH',
    //         sModule: 'ORGANIZATION_BRANCH',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Closed Project',
    //         sKey: 'VIEW_CLOSED_PROJECT',
    //         sModule: 'PROJECT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'Update Closed Project',
    //         sKey: 'UPDATE_CLOSED_PROJECT',
    //         sModule: 'PROJECT',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Cost',
    //         sKey: 'VIEW_COST',
    //         sModule: 'OTHERS',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Dashboard Free Resources',
    //         sKey: 'VIEW_DASHBOARD_FREE_RESOURCES',
    //         sModule: 'DASHBOARD',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Dashboard Statistics',
    //         sKey: 'VIEW_DASHBOARD_STATISTICS',
    //         sModule: 'DASHBOARD',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Dashboard Monthly Projects',
    //         sKey: 'VIEW_DASHBOARD_MONTHLY_PROJECTS',
    //         sModule: 'DASHBOARD',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Dashboard Worklogs',
    //         sKey: 'VIEW_DASHBOARD_WORKLOGS',
    //         sModule: 'DASHBOARD',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Dashboard Latest Projects',
    //         sKey: 'VIEW_DASHBOARD_LATEST_PROJECTS',
    //         sModule: 'DASHBOARD',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       },
    //       {
    //         sName: 'View Dashboard Project Line',
    //         sKey: 'VIEW_DASHBOARD_PROJECT_LINE',
    //         sModule: 'DASHBOARD',
    //         eStatus: 'Y',
    //         bIsActive: true
    //       }

    //     ]

    //     const aPermissions = [
    //       'VIEW_DASHBOARD',

    //       'CREATE_EMPLOYEE',
    //       'VIEW_EMPLOYEE',
    //       'UPDATE_EMPLOYEE',
    //       'DELETE_EMPLOYEE',

    //       'CREATE_PROJECT',
    //       'VIEW_PROJECT',
    //       'UPDATE_PROJECT',
    //       'DELETE_PROJECT',

    //       'CREATE_SKILL',
    //       'VIEW_SKILL',
    //       'UPDATE_SKILL',
    //       'DELETE_SKILL',

    //       'CREATE_DEPARTMENT',
    //       'VIEW_DEPARTMENT',
    //       'UPDATE_DEPARTMENT',
    //       'DELETE_DEPARTMENT',

    //       'CREATE_CLIENT',
    //       'VIEW_CLIENT',
    //       'UPDATE_CLIENT',
    //       'DELETE_CLIENT',

    //       'CREATE_WORKLOGS',
    //       'VIEW_WORKLOGS',
    //       'DELETE_WORKLOGS',

    //       'CREATE_CHANGE_REQUEST',
    //       'VIEW_CHANGE_REQUEST',
    //       'UPDATE_CHANGE_REQUEST',
    //       'DELETE_CHANGE_REQUEST',

    //       'CREATE_REVIEW',
    //       'VIEW_REVIEW',
    //       'UPDATE_REVIEW',
    //       'DELETE_REVIEW',

    //       'VIEW_PROJECT_OVERVIEW',

    //       'VIEW_S3BUCKETINFO',
    //       'CREATE_ORGANIZATION_DETAILS',
    //       'UPDATE_ORGANIZATION_DETAILS',
    //       'VIEW_ORGANIZATION_DETAILS',

    //       'UPDATE_LOGS',
    //       'CREATE_LOGS',
    //       'VIEW_LOGS',
    //       'DELETE_LOGS',

    //       'CREATE_WORKLOG_TAGS',
    //       'VIEW_WORKLOG_TAGS',
    //       'UPDATE_WORKLOG_TAGS',
    //       'DELETE_WORKLOG_TAGS',

    //       'CREATE_TECHNOLOGY',
    //       'VIEW_TECHNOLOGY',
    //       'UPDATE_TECHNOLOGY',
    //       'DELETE_TECHNOLOGY',

    //       'CREATE_PROJECT_TAG',
    //       'VIEW_PROJECT_TAG',
    //       'UPDATE_PROJECT_TAG',
    //       'DELETE_PROJECT_TAG',

    //       'CREATE_NOTIFICATION',
    //       'VIEW_NOTIFICATION',
    //       'UPDATE_NOTIFICATION',
    //       'DELETE_NOTIFICATION',

    //       'CREATE_JOB_PROFILE',
    //       'VIEW_JOB_PROFILE',
    //       'UPDATE_JOB_PROFILE',
    //       'DELETE_JOB_PROFILE',

    //       'CREATE_CURRENCY',
    //       'UPDATE_CURRENCY',
    //       'VIEW_CURRENCY',
    //       'DELETE_CURRENCY',

    //       'CREATE_ROLE',
    //       'UPDATE_ROLE',
    //       'VIEW_ROLE',
    //       'DELETE_ROLE',

    //       'CREATE_PERMISSION',
    //       'UPDATE_PERMISSION',
    //       'VIEW_PERMISSION',
    //       'DELETE_PERMISSION',

    //       'VIEW_USERPROFILE',
    //       'UPDATE_USERPROFILE',

    //       'DOWNLOAD_EMPLOYEE_EXCEL',
    //       'DOWNLOAD_DASHBOARD_EXCEL',
    //       'DOWNLOAD_LOGS_EXCEL',
    //       'DOWNLOAD_CHANGE_REQUEST_EXCEL',
    //       'DOWNLOAD_WORKLOGS_EXCEL',
    //       'DOWNLOAD_CLIENT_EXCEL',
    //       'DOWNLOAD_DEPARTMENT_EXCEL',
    //       'DOWNLOAD_SKILL_EXCEL',
    //       'DOWNLOAD_PROJECT_EXCEL',

    //       'CREATE_ORGANIZATION_BRANCH',
    //       'VIEW_ORGANIZATION_BRANCH',
    //       'UPDATE_ORGANIZATION_BRANCH',
    //       'DELETE_ORGANIZATION_BRANCH',

    //       'VIEW_CLOSED_PROJECT',
    //       'UPDATE_CLOSED_PROJECT',
    //       'VIEW_COST',

    //       'VIEW_DASHBOARD_FREE_RESOURCES',
    //       'VIEW_DASHBOARD_STATISTICS',
    //       'VIEW_DASHBOARD_MONTHLY_PROJECTS',
    //       'VIEW_DASHBOARD_WORKLOGS',
    //       'VIEW_DASHBOARD_LATEST_PROJECTS',
    //       'VIEW_DASHBOARD_PROJECT_LINE'

    //     ]

    //     // console.log(aPermissions.length)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // removeBranches()

    // async function checkData() {
    //   try {
    //     const a = `Network${new Date().getFullYear()
    //       }${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}`
    //     console.log(a)

    //     // const OrganizationDetails = await OrganizationDetail.find({})
    //     console.log(new Date(OrganizationDetails[0].dCreatedAt).getMonth() + 1)

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // checkData()

    // async function transfedatafromOneDbToOtherDb() {
    //   try {
    //     // create a connection to database first target second source using mongoClient
    //     const MongoClient = require('mongodb').MongoClient
    //     // /first source
    //     const DB_URI = 'mongodb+srv://pranav:pranav123@cluster0.fpjwy.mongodb.net/resource_managementa'
    //     const DB_NAME = 'resource_managementa'
    //     const OUTPUT_DIR = 'output-directory'
    //     const client = new MongoClient(DB_URI)

    //     await client.connect()

    //     // second target
    //     const DB_URI1 = 'mongodb://localhost:27017/resource_management'
    //     const DB_NAME1 = 'resource_management'
    //     const OUTPUT_DIR1 = 'output-directory'
    //     const client1 = new MongoClient(DB_URI1)

    //     await client1.connect()

    //     // get Collection from first source
    //     const db = client.db(DB_NAME)
    //     const collections = await db.collections()
    //     console.log(collections)

    //     // get Collection from second target

    //     const db1 = client1.db(DB_NAME1)
    //     const collections1 = await db1.collections()
    //     console.log(collections1)

    //     // trasfer data from one db to other db
    //     for (const c of collections) {
    //       const collectionName = c.s.namespace.collection
    //       const collectionData = await db.collection(c.s.namespace.collection).find({}).toArray()
    //       console.log(collectionName, collectionData.length)
    //       // console.log(collectionData)

    //       // check if c exist in db1
    //       const collectionExist = await db1.listCollections({ name: collectionName }).toArray()
    //       console.log('collectionExist', collectionExist)
    //       if (!collectionExist.length) {
    //         // create collection if not exist with same name and index which is in first source
    //         await db1.createCollection(collectionName)
    //         // index
    //         const indexes = await db.collection(collectionName).indexes()
    //         console.log('indexes', indexes)
    //         for (const i of indexes) {
    //           if (i.name !== '_id_') {
    //             await db1.collection(collectionName).createIndex(i.key)
    //           }
    //         }

    //         console.log('exist')

    //         // chunk data and insert
    //         const chunkSize = 10
    //         const chunkData = []
    //         for (let i = 0; i < collectionData.length; i += chunkSize) {
    //           chunkData.push(collectionData.slice(i, i + chunkSize))
    //         }

    //         for (const c of chunkData) {
    //           await db1.collection(collectionName).insertMany(c)
    //         }
    //       }
    //       console.log('done', collectionName)
    //     }
    //     console.log("all done ")
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // transfedatafromOneDbToOtherDb()

    // // whi

    // // function showAnimation() {
    // //   const animation = chalkAnimation.rainbow('Loading...');

    // //   // Simulate some asynchronous task here, like starting your server
    // //   setTimeout(() => {
    // //     // Stop the animation after the server has started or completed its tasks
    // //     animation.stop();
    // //     console.log('Server started!');
    // //     // You can continue with the rest of your code here
    // //   }, 5000); // Simulating a 5-second delay, replace this with your actual server startup process time
    // // }

    // // showAnimation();

    // // create a collection

    const mongoose = require('mongoose')
    const Schema = mongoose.Schema

    // const Score = Schema({
    //   sName: { type: String },
    //   nScore: { type: Number },
    //   iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
    // }, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

    // async function collectionCreate() {
    //   try {

    //     for (let i = 0; i < 10; i++) {
    //       let take = ResourceManagementDB.model(`score${i}`, Score)

    //       for (let j = 0; j < 10; j++) {
    //         const data = await take.create({
    //           //randome name,
    //           sName: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
    //           nScore: Math.floor(Math.random() * 100),
    //         })

    //         //drop collection
    //         // const data = await take.collection.drop()

    //         console.log(data)
    //       }
    //     }

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // collectionCreate()

    // async function getDataBasedOnnScoreWithPAgination() {
    //   try {

    //     const collectionsNames = await ResourceManagementDB.db.listCollections().toArray()

    //     console.log(collectionsNames)

    //     let filterCollections = collectionsNames.filter((collection) => {
    //       const regexExp = /^score[0-9]{1}/gi
    //       if (collection.name.match(regexExp)) {
    //         collection.year = collection.name.replace('score', '')
    //         return collection
    //       }
    //     })

    //     filterCollections = filterCollections.sort((a, b) => {
    //       return a.year - b.year
    //     })

    //     console.log(filterCollections)

    //     let allData = []

    //     // for (const collection of filterCollections) {
    //     //   const take = ResourceManagementDB.model(collection.name, Score)
    //     //   const data = await take.find({}).sort({ nScore: -1 }).limit(5).skip(0)
    //     //   //spread operator

    //     //   allData = [...allData, ...data]
    //     // }

    //     // sort data based on score from all db and get top 5

    //     // allData = allData.sort((a, b) => {

    //     // })

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // //after 5 sec

    // // setTimeout(() => {
    // //   getDataBasedOnnScoreWithPAgination()
    // // }, 5000);

    async function removeDocumentWhereIdExistFromAllColleciton(removalId) {
      try {
        const MongoClient = require('mongodb').MongoClient
        const DB_URI1 = 'mongodb+srv://pranav:pranav123@cluster0.fpjwy.mongodb.net/resource_managementa'
        const DB_NAME1 = 'resource_managementa'
        const OUTPUT_DIR1 = 'output-directory'
        const client1 = new MongoClient(DB_URI1)

        await client1.connect()

        const db1 = client1.db(DB_NAME1)
        const collections1 = await db1.collections()
        // console.log(collections1)

        for (const collection of collections1) {
          const collectionName = collection.s.namespace.collection
          const collectionData = await db1.collection(collectionName).find({}).toArray()
          console.log(collectionName, collectionData.length)

          for (const data of collectionData) {
            // _id exist anywhere in docuemnt then
            const keys = Object.keys(data)
            // console.log(keys)
            for (const key of keys) {
              if (data[key] instanceof mongoose.Types.ObjectId) {
                if (data[key].toString() === removalId) {
                  console.log('found1', collectionName, data._id, key, data[key].toString())

                  await db1.collection(collectionName).deleteOne({ _id: data._id })
                }

                // if (data[key].toString() === '60a7c3b3d1e8c0a3b8b4b0c3') {
                //   console.log('found')
                //   // await db1.collection(collectionName).deleteOne({_id:data._id})
                // }
              } else if (Array.isArray(data[key])) {
                for (const item of data[key]) {
                  if (item instanceof mongoose.Types.ObjectId) {
                    if (item.toString() === removalId) {
                      console.log('found111', collectionName, data._id, key, item.toString())
                      await db1.collection(collectionName).deleteOne({ _id: data._id })
                    }
                  }
                }
              }

              // else {

              // }

              // if (data[key].toString() === '60a7c3b3d1e8c0a3b8b4b0c3') {
              //   console.log('found')
              //   // await db1.collection(collectionName).deleteOne({_id:data._id})
              // }
            }
          }
        }

        console.log('done')
      } catch (error) {
        console.log(error)
      }
    }

    // removeDocumentWhereIdExistFromAllColleciton('64bd39b48538d29b29f15ec9')

    // // --add adata to movies collection

    // const path = require('path')
    // const csv = require('csvtojson')

    // async function addDataToMoviesCollection() {
    //   try {

    //     //read csv file and write in to json file

    //     const csvFilePath = path.join(__dirname, 'tmdb_5000_movies.csv')

    //     const jsonArray = await csv().fromFile(csvFilePath)

    //     //Movies Model

    //     console.log(jsonArray.length)

    //     for (const data of jsonArray) {

    //       let movie = {}
    //       let genres = []
    //       let production_companies = []
    //       let production_countries = []

    //       if (JSON.parse(data.genres).length) {

    //         for (const genre of JSON.parse(data.genres)) {
    //           genres.push({
    //             sGName: genre.name,
    //             sGCount: 0
    //           })
    //           // console.log(genre)
    //         }
    //       }

    //       if (JSON.parse(data.production_companies).length) {

    //         for (const production_company of JSON.parse(data.production_companies)) {
    //           production_companies.push({
    //             sPname: production_company.name,
    //           })
    //         }
    //       }

    //       if (JSON.parse(data.production_countries).length) {

    //         for (const production_country of JSON.parse(data.production_countries)) {
    //           production_countries.push({
    //             sPname: production_country.name,
    //             sCode: production_country.iso_3166_1
    //           })
    //         }
    //       }

    //       // console.log(genres)

    //       movie = {
    //         ...data,
    //         genres,
    //         production_companies,
    //         production_countries,
    //       }

    //       // console.log(movie)

    //       // console.log(data)

    //       // break;
    //       console.log(movie.id)

    //       const movi1e = await MoviesModel.create({
    //         nBudget: +movie?.budget || 0,
    //         aGenres: movie.genres,
    //         sHomePage: movie.homepage,
    //         sLanguage: movie.original_language,
    //         sOriginalTitle: movie.original_title,
    //         sOverView: movie.overview,
    //         nPopularity: +movie.popularity || 0,
    //         aProductionCompanies: movie.production_companies,
    //         aProductionCountries: movie.production_countries,
    //         dReleaseDate: movie?.release_date ? new Date(movie?.release_date) : new Date(),
    //         nRevenue: +movie.revenue || 0,
    //         nRunTime: +movie.runtime || 0,
    //         eStatus: movie.status,
    //         sTagLine: movie.tagline,
    //         sTitle: movie.title,
    //         nVoteAverage: +movie.vote_average || 0,
    //         nVoteCount: +movie.vote_count || 0,
    //       })

    //       // console.log(movi1e)

    //     }

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // async function addCast() {
    //   try {
    //     const csvFilePath = path.join(__dirname, 'tmdb_5000_credits.csv')

    //     const jsonArray = await csv().fromFile(csvFilePath)

    //     let i = 0
    //     for (const jsoncast of jsonArray) {
    //       i++
    //       const movie = await MoviesModel.findOne({ sTitle: jsoncast.title })

    //       if (movie) {
    //         const casts = JSON.parse(jsoncast.cast)
    //         //sort by order

    //         casts.sort((a, b) => {
    //           return a.order - b.order
    //         })

    //         const arrayCast = []
    //         for (const cast of casts) {
    //           arrayCast.push({
    //             sCname: cast.name,
    //             sCharacter: cast.character,
    //             nOrder: cast.order,
    //             eGender: cast.gender,
    //             nPopularity: cast?.popularity || 0,
    //           })
    //         }

    //         // console.log(arrayCast)

    //         // break;

    //         await MoviesModel.findByIdAndUpdate(movie._id, { aCast: arrayCast })

    //       }
    //       console.log(i)
    //     }

    //     console.log('done')

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // addCast()

    // // addDataToMoviesCollection()

    // const moment = require('moment')

    // async function getMoviesData() {
    //   try {
    //     const date = '2009-12-10'
    //     console.log(new Date(date))

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // getMoviesData()

    // const recentUserSearchMovie = [
    //   'Avatar',
    //   'Pirates of the Caribbean: At World\'s End',
    //   'Spectre',
    //   'The Dark Knight Rises',
    //   'John Carter',
    //   'Spider-Man 3',
    //   'Tangled',
    //   'Avengers: Age of Ultron',
    //   'Harry Potter and the Half-Blood Prince',
    //   'Batman v Superman: Dawn of Justice'
    // ]

    // async function getRecentUserSearchMovie() {

    //   try {
    //     const arrayMovie = []
    //     for (const name of recentUserSearchMovie) {
    //       const movie = await MoviesModel.find({ sTitle: name })
    //       arrayMovie.push({
    //         sTitle: movie[0].sTitle,
    //         aGenres: movie[0].aGenres,
    //         nPopularity: movie[0].nPopularity,
    //         nVoteAverage: movie[0].nVoteAverage,
    //         nVoteCount: movie[0].nVoteCount,
    //         dDate: new Date(2018, 11, 24, 10, Math.ceil(Math.random() * 60), 30, 0)
    //       })
    //     }

    //     //find freuent search movie

    //     const frequentSearchMovie = arrayMovie.sort((a, b) => {
    //       return b.dDate - a.dDate
    //     })

    //     const gener = {}

    //     for (const movie of frequentSearchMovie) {
    //       //count of gener of movie
    //       for (const genre of movie.aGenres) {
    //         if (gener[genre.sGName]) {
    //           gener[genre.sGName] = gener[genre.sGName] + 1
    //         } else {
    //           gener[genre.sGName] = 1
    //         }
    //       }
    //     }

    //     console.log(gener)

    //     //take top 3 gener of movie

    //     const top3Gener = Object.keys(gener).sort((a, b) => {
    //       return gener[b] - gener[a]
    //     }).slice(0, 3)

    //     console.log(top3Gener)

    //     const movie = await MoviesModel.findOne({ sTitle: 'Cars 2' })
    //     // console.log(movie)

    //     const currentGener = movie.aGenres.map((genre) => {
    //       return genre.sGName
    //     })

    //     const combinedGener = new Set([...top3Gener, ...currentGener])

    //     // convert set to array

    //     const combinedGenerArray = [...combinedGener]

    //     console.log(combinedGenerArray)

    //     //make a possibel of combined gener of 3 length

    //     const data = createPartsOfLength3(combinedGenerArray);

    //     console.log(data)

    //     const MovieName = []

    //     for (const d of data) {
    //       const movie = await MoviesModel.find({ 'aGenres.sGName': { $all: d } })
    //       for (const M of movie) MovieName.includes(M.sTitle) ? null : MovieName.push(M.sTitle)
    //     }

    //     console.log(MovieName)

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // getRecentUserSearchMovie()

    // function createPartsOfLength3(arr) {
    //   if (arr.length < 3) {
    //     return [];
    //   }

    //   const partsOfLength3 = [];
    //   for (let i = 0; i <= arr.length - 3; i++) {
    //     const part = arr.slice(i, i + 3);
    //     partsOfLength3.push(part);
    //   }

    //   return partsOfLength3;
    // }

    // async function permissionUpdate111() {
    //   try {

    //     const aPermissions = [
    //       // "CREATE_CHANGE_REQUEST",
    //       // "VIEW_CHANGE_REQUEST",
    //       // "UPDATE_CHANGE_REQUEST",
    //       // "DELETE_CHANGE_REQUEST",
    //       // "VIEW_S3BUCKETINFO",
    //       // "UPDATE_LOGS",
    //       // "CREATE_LOGS",
    //       // "VIEW_LOGS",
    //       // "DELETE_LOGS",
    //       // "CREATE_NOTIFICATION",
    //       // "VIEW_NOTIFICATION",
    //       // "UPDATE_NOTIFICATION",
    //       // "DELETE_NOTIFICATION",
    //       // "CREATE_CURRENCY",
    //       // "VIEW_CURRENCY",
    //       // "UPDATE_CURRENCY",
    //       // "DELETE_CURRENCY",
    //       // "CREATE_ROLE",
    //       // "VIEW_ROLE",
    //       // "UPDATE_ROLE",
    //       // "DELETE_ROLE",
    //       // "CREATE_PERMISSION",
    //       // "DELETE_PERMISSION",
    //       // "VIEW_USERPROFILE",
    //       // "UPDATE_USERPROFILE",
    //       // "DOWNLOAD_DASHBOARD_EXCEL",
    //       // "DOWNLOAD_LOGS_EXCEL",
    //       // "DOWNLOAD_CHANGE_REQUEST_EXCEL"
    //       // ,
    //       "VIEW_DASHBOARD",
    //       "CREATE_ORGANIZATION_DETAILS",
    //       "CREATE_WORKLOG_TAGS",
    //       "VIEW_WORKLOG_TAGS",
    //       "UPDATE_WORKLOG_TAGS",
    //       "DELETE_WORKLOG_TAGS",
    //       "VIEW_PROJECT_TAG",
    //       "UPDATE_PROJECT_TAG",
    //       "DELETE_PROJECT_TAG",
    //       "CREATE_CURRENCY",
    //       "VIEW_CURRENCY",
    //       "UPDATE_CURRENCY",
    //       "DELETE_CURRENCY",
    //       // "CREATE_ROLE",
    //       // "VIEW_ROLE",
    //       // "UPDATE_ROLE",
    //       // "DELETE_ROLE",
    //       "CREATE_PERMISSION",
    //       "VIEW_PERMISSION",
    //       "DELETE_PERMISSION"
    //       ,
    //       "VIEW_S3BUCKETINFO",
    //       "UPDATE_LOGS",
    //       "CREATE_LOGS",
    //       "VIEW_LOGS",
    //       "DELETE_LOGS",
    //       "CREATE_NOTIFICATION",
    //       "VIEW_NOTIFICATION",
    //       "UPDATE_NOTIFICATION",
    //       "DELETE_NOTIFICATION",
    //       "VIEW_USERPROFILE",
    //       "UPDATE_USERPROFILE",
    //       "DOWNLOAD_DASHBOARD_EXCEL",
    //       "DOWNLOAD_LOGS_EXCEL"
    //     ]

    //     for (const p of aPermissions) {
    //       const permission = await PermissionModel.findOne({
    //         sKey: p,
    //         bIsActive: true
    //       })

    //       console.log(permission)

    //       if (permission) {
    //         await PermissionModel.updateOne({
    //           _id: permission._id
    //         }, {
    //           eStatus: 'N'
    //         })
    //       }
    //     }

    //     console.log("done111")

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // permissionUpdate111()

    // const Roles = [
    //   {
    //     sBackGroundColor: 'hsl(0deg, 100%, 90%)',
    //     sTextColor: 'hsl(0deg, 65%, 50%)',
    //     sName: 'Super Admin',
    //     sKey: 'SUPERADMIN',
    //     aPermissions: [
    //       'VIEW_DASHBOARD',

    //       'CREATE_EMPLOYEE',
    //       'VIEW_EMPLOYEE',
    //       'UPDATE_EMPLOYEE',
    //       'DELETE_EMPLOYEE',

    //       'CREATE_PROJECT',
    //       'VIEW_PROJECT',
    //       'UPDATE_PROJECT',
    //       'DELETE_PROJECT',

    //       'CREATE_SKILL',
    //       'VIEW_SKILL',
    //       'UPDATE_SKILL',
    //       'DELETE_SKILL',

    //       'CREATE_DEPARTMENT',
    //       'VIEW_DEPARTMENT',
    //       'UPDATE_DEPARTMENT',
    //       'DELETE_DEPARTMENT',

    //       'CREATE_CLIENT',
    //       'VIEW_CLIENT',
    //       'UPDATE_CLIENT',
    //       'DELETE_CLIENT',

    //       'CREATE_WORKLOGS',
    //       'VIEW_WORKLOGS',
    //       'DELETE_WORKLOGS',

    //       'CREATE_CHANGE_REQUEST',
    //       'VIEW_CHANGE_REQUEST',
    //       'UPDATE_CHANGE_REQUEST',
    //       'DELETE_CHANGE_REQUEST',

    //       'CREATE_REVIEW',
    //       'VIEW_REVIEW',
    //       'UPDATE_REVIEW',
    //       'DELETE_REVIEW',

    //       'VIEW_PROJECT_OVERVIEW',

    //       'VIEW_S3BUCKETINFO',
    //       'CREATE_ORGANIZATION_DETAILS',
    //       'UPDATE_ORGANIZATION_DETAILS',
    //       'VIEW_ORGANIZATION_DETAILS',

    //       'UPDATE_LOGS',
    //       'CREATE_LOGS',
    //       'VIEW_LOGS',
    //       'DELETE_LOGS',

    //       'CREATE_WORKLOG_TAGS',
    //       'VIEW_WORKLOG_TAGS',
    //       'UPDATE_WORKLOG_TAGS',
    //       'DELETE_WORKLOG_TAGS',

    //       'CREATE_TECHNOLOGY',
    //       'VIEW_TECHNOLOGY',
    //       'UPDATE_TECHNOLOGY',
    //       'DELETE_TECHNOLOGY',

    //       'CREATE_PROJECT_TAG',
    //       'VIEW_PROJECT_TAG',
    //       'UPDATE_PROJECT_TAG',
    //       'DELETE_PROJECT_TAG',

    //       'CREATE_NOTIFICATION',
    //       'VIEW_NOTIFICATION',
    //       'UPDATE_NOTIFICATION',
    //       'DELETE_NOTIFICATION',

    //       'CREATE_JOB_PROFILE',
    //       'VIEW_JOB_PROFILE',
    //       'UPDATE_JOB_PROFILE',
    //       'DELETE_JOB_PROFILE',

    //       'CREATE_CURRENCY',
    //       'UPDATE_CURRENCY',
    //       'VIEW_CURRENCY',
    //       'DELETE_CURRENCY',

    //       'CREATE_ROLE',
    //       'UPDATE_ROLE',
    //       'VIEW_ROLE',
    //       'DELETE_ROLE',

    //       'CREATE_PERMISSION',
    //       'UPDATE_PERMISSION',
    //       'VIEW_PERMISSION',
    //       'DELETE_PERMISSION',

    //       'VIEW_USERPROFILE',
    //       'UPDATE_USERPROFILE',

    //       'DOWNLOAD_EMPLOYEE_EXCEL',
    //       'DOWNLOAD_DASHBOARD_EXCEL',
    //       'DOWNLOAD_LOGS_EXCEL',
    //       'DOWNLOAD_CHANGE_REQUEST_EXCEL',
    //       'DOWNLOAD_WORKLOGS_EXCEL',
    //       'DOWNLOAD_CLIENT_EXCEL',
    //       'DOWNLOAD_DEPARTMENT_EXCEL',
    //       'DOWNLOAD_SKILL_EXCEL',
    //       'DOWNLOAD_PROJECT_EXCEL',

    //       'CREATE_ORGANIZATION_BRANCH',
    //       'VIEW_ORGANIZATION_BRANCH',
    //       'UPDATE_ORGANIZATION_BRANCH',
    //       'DELETE_ORGANIZATION_BRANCH',

    //       'VIEW_CLOSED_PROJECT',
    //       'UPDATE_CLOSED_PROJECT',
    //       'VIEW_COST',

    //       'VIEW_DASHBOARD_FREE_RESOURCES',
    //       'VIEW_DASHBOARD_STATISTICS',
    //       'VIEW_DASHBOARD_MONTHLY_CHART',
    //       'VIEW_DASHBOARD_WORKLOGS',
    //       'VIEW_DASHBOARD_LATEST_PROJECTS',
    //       'VIEW_DASHBOARD_PROJECT_LINE'

    //     ],
    //     eStatus: 'Y',
    //     bIsDefault: false,
    //     bIsSystem: true
    //   },
    //   {
    //     sBackGroundColor: 'hsl(50deg, 100%, 90%)',
    //     sTextColor: 'hsl(50deg, 65%, 50%)',
    //     sName: 'Admin',
    //     sKey: 'ADMIN',
    //     aPermissions: [
    //       'VIEW_DASHBOARD',

    //       'CREATE_EMPLOYEE',
    //       'VIEW_EMPLOYEE',
    //       'UPDATE_EMPLOYEE',
    //       'DELETE_EMPLOYEE',

    //       'CREATE_PROJECT',
    //       'VIEW_PROJECT',
    //       'UPDATE_PROJECT',
    //       'DELETE_PROJECT',

    //       'CREATE_SKILL',
    //       'VIEW_SKILL',
    //       'UPDATE_SKILL',
    //       'DELETE_SKILL',

    //       'CREATE_DEPARTMENT',
    //       'VIEW_DEPARTMENT',
    //       'UPDATE_DEPARTMENT',
    //       'DELETE_DEPARTMENT',

    //       'CREATE_CLIENT',
    //       'VIEW_CLIENT',
    //       'UPDATE_CLIENT',
    //       'DELETE_CLIENT',

    //       'CREATE_WORKLOGS',
    //       'VIEW_WORKLOGS',
    //       'DELETE_WORKLOGS',

    //       'CREATE_CHANGE_REQUEST',
    //       'VIEW_CHANGE_REQUEST',
    //       'UPDATE_CHANGE_REQUEST',
    //       'DELETE_CHANGE_REQUEST',

    //       'CREATE_REVIEW',
    //       'VIEW_REVIEW',
    //       'UPDATE_REVIEW',
    //       'DELETE_REVIEW',

    //       'VIEW_PROJECT_OVERVIEW',

    //       'VIEW_S3BUCKETINFO',
    //       'CREATE_ORGANIZATION_DETAILS',
    //       'UPDATE_ORGANIZATION_DETAILS',
    //       'VIEW_ORGANIZATION_DETAILS',

    //       'UPDATE_LOGS',
    //       'CREATE_LOGS',
    //       'VIEW_LOGS',
    //       'DELETE_LOGS',

    //       'CREATE_WORKLOG_TAGS',
    //       'VIEW_WORKLOG_TAGS',
    //       'UPDATE_WORKLOG_TAGS',
    //       'DELETE_WORKLOG_TAGS',

    //       'CREATE_TECHNOLOGY',
    //       'VIEW_TECHNOLOGY',
    //       'UPDATE_TECHNOLOGY',
    //       'DELETE_TECHNOLOGY',

    //       'CREATE_PROJECT_TAG',
    //       'VIEW_PROJECT_TAG',
    //       'UPDATE_PROJECT_TAG',
    //       'DELETE_PROJECT_TAG',

    //       'CREATE_NOTIFICATION',
    //       'VIEW_NOTIFICATION',
    //       'UPDATE_NOTIFICATION',
    //       'DELETE_NOTIFICATION',

    //       'CREATE_JOB_PROFILE',
    //       'VIEW_JOB_PROFILE',
    //       'UPDATE_JOB_PROFILE',
    //       'DELETE_JOB_PROFILE',

    //       'CREATE_CURRENCY',
    //       'UPDATE_CURRENCY',
    //       'VIEW_CURRENCY',
    //       'DELETE_CURRENCY',

    //       'CREATE_ROLE',
    //       'UPDATE_ROLE',
    //       'VIEW_ROLE',
    //       'DELETE_ROLE',

    //       'CREATE_PERMISSION',
    //       'UPDATE_PERMISSION',
    //       'VIEW_PERMISSION',
    //       'DELETE_PERMISSION',

    //       'VIEW_USERPROFILE',
    //       'UPDATE_USERPROFILE',

    //       'DOWNLOAD_EMPLOYEE_EXCEL',
    //       'DOWNLOAD_DASHBOARD_EXCEL',
    //       'DOWNLOAD_LOGS_EXCEL',
    //       'DOWNLOAD_CHANGE_REQUEST_EXCEL',
    //       'DOWNLOAD_WORKLOGS_EXCEL',
    //       'DOWNLOAD_CLIENT_EXCEL',
    //       'DOWNLOAD_DEPARTMENT_EXCEL',
    //       'DOWNLOAD_SKILL_EXCEL',
    //       'DOWNLOAD_PROJECT_EXCEL',

    //       'CREATE_ORGANIZATION_BRANCH',
    //       'VIEW_ORGANIZATION_BRANCH',
    //       'UPDATE_ORGANIZATION_BRANCH',
    //       'DELETE_ORGANIZATION_BRANCH',

    //       'VIEW_CLOSED_PROJECT',
    //       'UPDATE_CLOSED_PROJECT',
    //       'VIEW_COST'

    //     ],
    //     bIsDefault: false,
    //     bIsSystem: true,
    //     eStatus: 'Y'
    //   },
    //   {
    //     sBackGroundColor: 'hsl(75deg, 100%, 90%)',
    //     sTextColor: 'hsl(75deg, 65%, 50%)',
    //     sName: 'Project Manager',
    //     sKey: 'PROJECTMANAGER',
    //     aPermissions: [
    //       'VIEW_DASHBOARD',

    //       'CREATE_EMPLOYEE',
    //       'VIEW_EMPLOYEE',
    //       'UPDATE_EMPLOYEE',

    //       'CREATE_PROJECT',
    //       'VIEW_PROJECT',
    //       'UPDATE_PROJECT',
    //       'DELETE_PROJECT',

    //       'VIEW_SKILL',

    //       'VIEW_DEPARTMENT',

    //       'VIEW_CLIENT',

    //       'CREATE_WORKLOGS',
    //       'VIEW_WORKLOGS',
    //       'DELETE_WORKLOGS',

    //       'CREATE_CHANGE_REQUEST',
    //       'VIEW_CHANGE_REQUEST',
    //       'UPDATE_CHANGE_REQUEST',
    //       'DELETE_CHANGE_REQUEST',

    //       'CREATE_REVIEW',
    //       'VIEW_REVIEW',
    //       'UPDATE_REVIEW',
    //       'DELETE_REVIEW',

    //       'VIEW_PROJECT_OVERVIEW',

    //       'CREATE_WORKLOG_TAGS',
    //       'VIEW_WORKLOG_TAGS',
    //       'UPDATE_WORKLOG_TAGS',
    //       'DELETE_WORKLOG_TAGS',

    //       'CREATE_TECHNOLOGY',
    //       'VIEW_TECHNOLOGY',
    //       'UPDATE_TECHNOLOGY',
    //       'DELETE_TECHNOLOGY',

    //       'CREATE_PROJECT_TAG',
    //       'VIEW_PROJECT_TAG',
    //       'UPDATE_PROJECT_TAG',
    //       'DELETE_PROJECT_TAG',

    //       'VIEW_NOTIFICATION',
    //       'UPDATE_NOTIFICATION',
    //       'DELETE_NOTIFICATION',

    //       'VIEW_JOB_PROFILE',

    //       'VIEW_USERPROFILE',
    //       'UPDATE_USERPROFILE',
    //       'VIEW_COST'

    //     ],
    //     bIsDefault: false,
    //     bIsSystem: true,
    //     eStatus: 'Y'
    //   },
    //   {
    //     sBackGroundColor: 'hsl(25deg, 100%, 90%)',
    //     sTextColor: ' hsl(25deg, 65%, 50%)',
    //     sName: 'Functional Manager',
    //     sKey: 'FUNCTIONALMANAGER',
    //     aPermissions: [
    //       'VIEW_DASHBOARD',

    //       'CREATE_EMPLOYEE',
    //       'VIEW_EMPLOYEE',
    //       'UPDATE_EMPLOYEE',

    //       'CREATE_PROJECT',
    //       'VIEW_PROJECT',
    //       'UPDATE_PROJECT',
    //       'DELETE_PROJECT',

    //       'VIEW_SKILL',

    //       'VIEW_DEPARTMENT',

    //       'VIEW_CLIENT',

    //       'CREATE_WORKLOGS',
    //       'VIEW_WORKLOGS',
    //       'DELETE_WORKLOGS',

    //       'CREATE_CHANGE_REQUEST',
    //       'VIEW_CHANGE_REQUEST',
    //       'UPDATE_CHANGE_REQUEST',
    //       'DELETE_CHANGE_REQUEST',

    //       'CREATE_REVIEW',
    //       'VIEW_REVIEW',
    //       'UPDATE_REVIEW',
    //       'DELETE_REVIEW',

    //       'VIEW_PROJECT_OVERVIEW',

    //       'CREATE_WORKLOG_TAGS',
    //       'VIEW_WORKLOG_TAGS',
    //       'UPDATE_WORKLOG_TAGS',
    //       'DELETE_WORKLOG_TAGS',

    //       'CREATE_TECHNOLOGY',
    //       'VIEW_TECHNOLOGY',
    //       'UPDATE_TECHNOLOGY',
    //       'DELETE_TECHNOLOGY',

    //       'CREATE_PROJECT_TAG',
    //       'VIEW_PROJECT_TAG',
    //       'UPDATE_PROJECT_TAG',
    //       'DELETE_PROJECT_TAG',

    //       'VIEW_NOTIFICATION',
    //       'UPDATE_NOTIFICATION',
    //       'DELETE_NOTIFICATION',

    //       'VIEW_JOB_PROFILE',

    //       'VIEW_USERPROFILE',
    //       'UPDATE_USERPROFILE',
    //       'VIEW_COST'

    //     ],
    //     bIsDefault: false,
    //     bIsSystem: true,
    //     eStatus: 'Y'
    //   },
    //   {
    //     sBackGroundColor: 'hsl(250deg, 100%, 90%)',
    //     sTextColor: 'hsl(250deg, 65%, 50%)',
    //     sName: 'Sales',
    //     sKey: 'SALES',
    //     aPermissions: [
    //       'VIEW_DASHBOARD',

    //       'CREATE_EMPLOYEE',
    //       'VIEW_EMPLOYEE',
    //       'UPDATE_EMPLOYEE',

    //       'CREATE_PROJECT',
    //       'VIEW_PROJECT',
    //       'UPDATE_PROJECT',
    //       'DELETE_PROJECT',

    //       'VIEW_SKILL',

    //       'VIEW_DEPARTMENT',

    //       'VIEW_CLIENT',

    //       'CREATE_WORKLOGS',
    //       'VIEW_WORKLOGS',
    //       'DELETE_WORKLOGS',

    //       'CREATE_CHANGE_REQUEST',
    //       'VIEW_CHANGE_REQUEST',
    //       'UPDATE_CHANGE_REQUEST',
    //       'DELETE_CHANGE_REQUEST',

    //       'CREATE_REVIEW',
    //       'VIEW_REVIEW',
    //       'UPDATE_REVIEW',
    //       'DELETE_REVIEW',

    //       'VIEW_PROJECT_OVERVIEW',

    //       'CREATE_WORKLOG_TAGS',
    //       'VIEW_WORKLOG_TAGS',
    //       'UPDATE_WORKLOG_TAGS',
    //       'DELETE_WORKLOG_TAGS',

    //       'CREATE_TECHNOLOGY',
    //       'VIEW_TECHNOLOGY',
    //       'UPDATE_TECHNOLOGY',
    //       'DELETE_TECHNOLOGY',

    //       'CREATE_PROJECT_TAG',
    //       'VIEW_PROJECT_TAG',
    //       'UPDATE_PROJECT_TAG',
    //       'DELETE_PROJECT_TAG',

    //       'VIEW_NOTIFICATION',
    //       'UPDATE_NOTIFICATION',
    //       'DELETE_NOTIFICATION',

    //       'VIEW_JOB_PROFILE',

    //       'VIEW_USERPROFILE',
    //       'UPDATE_USERPROFILE',
    //       'VIEW_COST'

    //     ],
    //     bIsDefault: false,
    //     bIsSystem: true,
    //     eStatus: 'Y'
    //   },
    //   {
    //     sBackGroundColor: 'hsl(125deg, 100%, 90%)',
    //     sTextColor: 'hsl(125deg, 65%, 50%)',
    //     sName: 'Employees',
    //     sKey: 'EMPLOYEES',
    //     bIsDefault: true,
    //     bIsSystem: true,
    //     aPermissions: [
    //       'VIEW_DASHBOARD',

    //       'VIEW_EMPLOYEE',

    //       'VIEW_PROJECT',

    //       'VIEW_SKILL',

    //       'VIEW_DEPARTMENT',

    //       'VIEW_CLIENT',

    //       'CREATE_WORKLOGS',
    //       'VIEW_WORKLOGS',
    //       'DELETE_WORKLOGS',

    //       'VIEW_CHANGE_REQUEST',

    //       'VIEW_REVIEW',

    //       'VIEW_WORKLOG_TAGS',

    //       'VIEW_TECHNOLOGY',

    //       'VIEW_PROJECT_TAG',

    //       'VIEW_NOTIFICATION',
    //       'UPDATE_NOTIFICATION',
    //       'DELETE_NOTIFICATION',

    //       'VIEW_USERPROFILE'
    //     ],
    //     eStatus: 'Y'
    //   }
    // ]
    // async function permisisonUpdate2() {
    //   try {

    //     for (const role of Roles) {
    //       //reomve permission which is status is N

    //       const aPermissions = role.aPermissions

    //       const permisisonRemoveFromRole = []
    //       const permissionId = []

    //       for (const p of aPermissions) {
    //         const permission = await PermissionModel.findOne({
    //           sKey: p,
    //           eStatus: 'Y'
    //         })
    //         if (!permission) {
    //           permisisonRemoveFromRole.push(p)
    //         }
    //       }

    //       for (const p of permisisonRemoveFromRole) {
    //         const permisison = await PermissionModel.findOne({
    //           sKey: p,
    //         })
    //         permissionId.push(permisison._id.toString())
    //       }
    //       console.log(permissionId)

    //       console.log(role.aPermissions.length)

    //       const rolePermission = await RoleModel.findOne({
    //         sKey: role.sKey
    //       })

    //       console.log(rolePermission)

    //       const rolePermissionId = rolePermission.aPermissions

    //       //filter permission id from role permission id

    //       const filteredPermissionId = rolePermissionId.filter((id) => {
    //         return !permissionId.includes(id.toString())
    //       })

    //       console.log(filteredPermissionId)

    //       //update role permission
    //       const RoleUopdate = await RoleModel.findByIdAndUpdate({
    //         _id: rolePermission._id
    //       }, {
    //         aPermissions: filteredPermissionId
    //       })

    //       console.log(RoleUopdate)

    //       console.log("done")

    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // permisisonUpdate2()

    // async function eachEmployeePermisisonUopdate() {
    //   try {
    //     const employees = await EmployeeModel.find({
    //       eStatus: 'Y'
    //     })

    //     const aTotalPermissions = []

    //     for (const e of employees) {
    //       console.log(e.sName)
    //       console.log(e.aRole)

    //       const role = await RoleModel.find({
    //         _id: {
    //           $in: e.aRole.map((id) => {
    //             return mongoose.Types.ObjectId(id.iRoleId)
    //           })
    //         }
    //       }).populate({
    //         path: 'aPermissions',
    //         select: 'sKey sName eStatus'
    //       })

    //       //aTotalPermission

    //       // {
    //       //   sKey:'VIEW_DASHBOARD',
    //       //   aRoleId:[
    //       //     ObjectId( '60a7c3b3d1e8c0a3b8b4b0c3')
    //       //   ]
    //       // }

    //       for (const r of role) {
    //         for (const p of r.aPermissions) {
    //           if (p.eStatus === 'Y') {
    //             const index = aTotalPermissions.findIndex((permission) => {
    //               return permission.sKey === p.sKey
    //             })

    //             if (index === -1) {
    //               aTotalPermissions.push({
    //                 sKey: p.sKey,
    //                 aRoleId: [r._id]
    //               })
    //             } else {
    //               aTotalPermissions[index].aRoleId.push(r._id)
    //             }
    //           }
    //         }
    //       }

    //       await EmployeeModel.findByIdAndUpdate({
    //         _id: e._id
    //       }, {
    //         aTotalPermissions: aTotalPermissions
    //       })

    //     }

    //     console.log(employees.length)
    //   } catch (error) {

    //   }
    // }

    // // eachEmployeePermisisonUopdate()
    // const ProjectWiseEmployeeModel = require('./models_routes_service/Project/projectwiseemployee.model')
    // async function EmployeeProjects() {
    //   try {

    //     const employeeProjects = await ProjectWiseEmployeeModel.find({ iEmployeeId: ObjectId('64b7d7a39dec64eea59abbbb'), eStatus: 'Y' }).lean()

    //     console.log('employeeProjects', employeeProjects)

    //     const otherProjectsEmployee = await ProjectModel.find({
    //       $or: [
    //         {
    //           iBAId: ObjectId('64b7d7a39dec64eea59abbbb')
    //         },
    //         {
    //           iBDId: ObjectId('64b7d7a39dec64eea59abbbb')
    //         },
    //         {
    //           iProjectManagerId: ObjectId('64b7d7a39dec64eea59abbbb')
    //         }
    //       ],
    //       eStatus: 'Y'
    //     })

    //     const totalProjects = new Set()

    //     for (const project of otherProjectsEmployee) {
    //       totalProjects.add(project._id)
    //     }

    //     for (const project of employeeProjects) {
    //       totalProjects.add(project.iProjectId)
    //     }

    //     const q = [
    //       {
    //         $match: {
    //           eStatus: 'Y',
    //           _id: {
    //             $in: [...totalProjects].map(
    //               (id) => mongoose.Types.ObjectId(id)
    //             )
    //           }
    //         }
    //       },
    //       {
    //         $lookup: {
    //           from: 'projectwiseclients',
    //           let: { projectId: '$_id' },
    //           pipeline: [
    //             { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
    //             {
    //               $lookup: {
    //                 from: 'clients',
    //                 let: { clientId: '$iClientId' },
    //                 pipeline: [
    //                   { $match: { $expr: { $eq: ['$_id', '$$clientId'] }, eStatus: 'Y' } },
    //                   { $project: { sClientName: '$sName' } }
    //                 ],
    //                 as: 'client'
    //               }
    //             },
    //             { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
    //             { $sort: { 'client.sClientName': 1 } },
    //             { $project: { client: '$client' } }
    //           ],
    //           as: 'client'
    //         }
    //       },
    //       {
    //         $unwind: {
    //           path: '$client',
    //           preserveNullAndEmptyArrays: true
    //         }
    //       },
    //       {
    //         $lookup: {
    //           from: 'projectwisetechnologies',
    //           let: { projectId: '$_id' },
    //           pipeline: [
    //             { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
    //             {
    //               $lookup: {
    //                 from: 'technologies',
    //                 let: { technologyId: '$iTechnologyId' },
    //                 pipeline: [
    //                   { $match: { $expr: { $eq: ['$_id', '$$technologyId'] }, eStatus: 'Y' } },
    //                   { $project: { sTechnologyName: '$sName' } }
    //                 ],
    //                 as: 'technology'
    //               }
    //             },
    //             { $unwind: { path: '$technology', preserveNullAndEmptyArrays: true } },
    //             { $sort: { 'technology.sTechnologyName': 1 } },
    //             { $project: { technology: '$technology' } }
    //           ],
    //           as: 'technology'
    //         }
    //       },
    //       {
    //         $unwind: {
    //           path: '$technology',
    //           preserveNullAndEmptyArrays: true
    //         }
    //       },
    //       {
    //         $lookup: {
    //           from: 'projectwisetags',
    //           let: { projectId: '$_id' },
    //           pipeline: [
    //             { $match: { $expr: { $eq: ['$iProjectId', '$$projectId'] }, eStatus: 'Y' } },
    //             {
    //               $lookup: {
    //                 from: 'projecttags',
    //                 let: { projectTagId: '$iProjectTagId' },
    //                 pipeline: [
    //                   { $match: { $expr: { $eq: ['$_id', '$$projectTagId'] }, eStatus: 'Y' } },
    //                   { $project: { sProjectTagName: '$sName', sBackGroundColor: '$sBackGroundColor', sTextColor: '$sTextColor' } }
    //                 ],
    //                 as: 'projecttag'
    //               }
    //             },
    //             { $unwind: { path: '$projecttag', preserveNullAndEmptyArrays: true } },
    //             { $sort: { 'projecttag.sProjectTagName': 1 } },
    //             { $project: { projecttag: '$projecttag' } }
    //           ],
    //           as: 'projecttag'
    //         }
    //       },
    //       {
    //         $unwind: {
    //           path: '$projecttag',
    //           preserveNullAndEmptyArrays: true
    //         }
    //       },
    //       {
    //         $group: {
    //           _id: '$_id',
    //           sName: { $first: '$sName' },
    //           eProjectType: { $first: '$eProjectType' },
    //           sLogo: { $first: '$sLogo' },
    //           eProjectStatus: { $first: '$eProjectStatus' },
    //           flag: { $first: '$flag' },
    //           client: { $addToSet: '$client.client' },
    //           technology: { $addToSet: '$technology.technology' },
    //           projecttag: { $addToSet: '$projecttag.projecttag' }
    //         }
    //       },
    //       {
    //         $project: {
    //           iProjectId: '$_id',
    //           eProjectType: '$eProjectType',
    //           sLogo: '$sLogo',
    //           sName: '$sName',
    //           client: '$client',
    //           technology: '$technology',
    //           projecttag: '$projecttag',
    //           eProjectStatus: '$eProjectStatus',
    //           flag: '$flag'
    //         }
    //       }
    //     ]

    //     const projects = await Projects.aggregate(q)

    //     console.log('projects', JSON.stringify(projects, null, 2))

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // EmployeeProjects()

    // async function nearToEnd() {
    //   try {
    //     const latestFixedProjects = await Projects.aggregate([
    //       {
    //         $match: {
    //           eStatus: 'Y',
    //           eProjectStatus: { $in: ['In Progress'] },
    //           eProjectType: 'Fixed'
    //         }
    //       }, {
    //         $project: {
    //           _id: 1,
    //           sName: 1,
    //           sLogo: 1,
    //           eProjectStatus: 1,
    //           eProjectType: 1,
    //           dStartDate: { $ifNull: ['$dStartDate', new Date()] },
    //           dEndDate: { $ifNull: ['$dEndDate', new Date()] }
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 1,
    //           sName: 1,
    //           sLogo: 1,
    //           eProjectStatus: 1,
    //           eProjectType: 1,
    //           dStartDate: 1,
    //           dEndDate: 1,
    //           years: {
    //             $dateDiff:
    //             {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'year'
    //             }
    //           },
    //           months: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'month'
    //             }
    //           },
    //           days: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'day'
    //             }
    //           },
    //           hours: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'hour'
    //             }
    //           },
    //           weeks: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'week'
    //             }
    //           },
    //           milliseconds: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'millisecond'
    //             }
    //           }
    //         }
    //       }
    //     ])

    //     const latestDedicatedProjects = await Projects.aggregate([
    //       {
    //         $match: {
    //           eStatus: 'Y',
    //           eProjectStatus: { $in: ['In Progress'] },
    //           eProjectType: 'Dedicated'
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 1,
    //           sName: 1,
    //           sLogo: 1,
    //           eProjectStatus: 1,
    //           eProjectType: 1,
    //           dStartDate: { $ifNull: ['$dContractStartDate', new Date()] },
    //           dEndDate: { $ifNull: ['$dContractEndDate', new Date()] }
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 1,
    //           sName: 1,
    //           sLogo: 1,
    //           eProjectStatus: 1,
    //           eProjectType: 1,
    //           dStartDate: 1,
    //           dEndDate: 1,
    //           years: {
    //             $dateDiff:
    //             {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'year'
    //             }
    //           },
    //           months: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'month'
    //             }
    //           },
    //           days: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'day'
    //             }
    //           },
    //           hours: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'hour'
    //             }
    //           },
    //           weeks: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'week'
    //             }
    //           },
    //           milliseconds: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'millisecond'
    //             }
    //           }
    //         }
    //       }

    //     ])

    //     const latestProjects = await Projects.aggregate([
    //       {
    //         $match: {
    //           eStatus: 'Y',
    //           eProjectStatus: { $in: ['In Progress'] },
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 1,
    //           sName: 1,
    //           sLogo: 1,
    //           eProjectStatus: 1,
    //           eProjectType: 1,
    //           dStartDate: new Date(),
    //           dEndDate: {
    //             $cond: {
    //               if: { $eq: ['$eProjectType', 'Fixed'] },
    //               then: { $ifNull: ['$dStartDate', new Date()] },
    //               else: { $ifNull: ['$dContractStartDate', new Date()] }
    //             }
    //           }
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 1,
    //           sName: 1,
    //           sLogo: 1,
    //           eProjectStatus: 1,
    //           eProjectType: 1,
    //           dStartDate: 1,
    //           dEndDate: 1,
    //           years: {
    //             $dateDiff:
    //             {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'year'
    //             }
    //           },
    //           months: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'month'
    //             }
    //           },
    //           days: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'day'
    //             }
    //           },
    //           hours: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'hour'
    //             }
    //           },
    //           weeks: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'week'
    //             }
    //           },
    //           milliseconds: {
    //             $dateDiff: {
    //               startDate: '$dStartDate',
    //               endDate: '$dEndDate',
    //               unit: 'millisecond'
    //             }
    //           }
    //         }
    //       }
    //     ])

    //     const data = [...latestProjects].sort((a, b) => new Date(b?.milliseconds) - new Date(a?.milliseconds)).slice(0, 5)

    //     // console.log('data', JSON.stringify(data, null, 2))

    //     // console.log('latestFixedProjects', JSON.stringify(latestProjects, null, 2))

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // // require('./movies.js')

    // //redis

    // const { redisClient } = require('./helper/redis')

    // async function pushRecord() {
    //   try {
    //     const data = await redisClient.rpush('users', JSON.stringify({ name: 'sachin', age: Math.random() }))
    //     console.log(data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // async function getRecord() {
    //   try {
    //     // const data = await redisClient.lrange('users', 0, 0)

    //     //pop range of 20 records

    //     const data = await redisClient.lrange('users', 0, 20)
    //     console.log(data.length)

    //     console.log(data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // // getRecord()
    // // pushRecord()

    // // nearToEnd()

    // const production = require('./config/production')
    // const development = require('./config/development')
    // const test = require('./config/test')
    // const staging = require('./config/staging')

    // compare two objects

    // function compareObjects(obj1, obj2) {
    //   const obj1Keys = []

    //   for (const key in obj1) {
    //     if (typeof obj1[key] === 'object') {
    //       compareObjects(obj1[key], obj2[key])

    //       console.log('1', key)
    //     } else {
    //       console.log('key', key)
    //       obj1Keys.push(key)
    //     }
    //   }

    //   console.log('obj1Keys', obj1Keys)
    // }

    // compareObjects(production, development)

    function traverseAndFlatten(currentNode, target, flattenedKey) {
      for (const key in currentNode) {
        if (currentNode.hasOwnProperty(key)) {
          let newKey
          if (flattenedKey === undefined) {
            newKey = key
          } else {
            newKey = flattenedKey + '.' + key
          }

          const value = currentNode[key]
          if (typeof value === 'object') {
            traverseAndFlatten(value, target, newKey)
          } else {
            target[newKey] = value
          }
        }
      }
    }

    function flatten(obj) {
      const flattenedObject = {}
      traverseAndFlatten(obj, flattenedObject)
      return flattenedObject
    }

    // const flattened = Object.keys(flatten(staging))
    // const flattened1 = Object.keys(flatten(test))

    // const filtered = flattened.filter((item) => {
    //   return !flattened1.includes(item)
    // })

    // filtering keys
    // console.log('filtered', filtered)
  }).catch((err) => {
    console.log('err', err)
  })
})

module.exports = app
