const Roles = [
  {
    sBackGroundColor: 'hsl(0deg, 100%, 90%)',
    sTextColor: 'hsl(0deg, 65%, 50%)',
    sName: 'Super Admin',
    sKey: 'SUPER_ADMIN',
    aPermissions: [
      'VIEW_DASHBOARD',

      'CREATE_EMPLOYEE',
      'VIEW_EMPLOYEE',
      'UPDATE_EMPLOYEE',
      'DELETE_EMPLOYEE',

      'CREATE_PROJECT',
      'VIEW_PROJECT',
      'UPDATE_PROJECT',
      'DELETE_PROJECT',

      'CREATE_SKILL',
      'VIEW_SKILL',
      'UPDATE_SKILL',
      'DELETE_SKILL',

      'CREATE_DEPARTMENT',
      'VIEW_DEPARTMENT',
      'UPDATE_DEPARTMENT',
      'DELETE_DEPARTMENT',

      'CREATE_CLIENT',
      'VIEW_CLIENT',
      'UPDATE_CLIENT',
      'DELETE_CLIENT',

      'CREATE_WORKLOGS',
      'VIEW_WORKLOGS',
      'DELETE_WORKLOGS',

      'CREATE_CHANGE_REQUEST',
      'VIEW_CHANGE_REQUEST',
      'UPDATE_CHANGE_REQUEST',
      'DELETE_CHANGE_REQUEST',

      'CREATE_REVIEW',
      'VIEW_REVIEW',
      'UPDATE_REVIEW',
      'DELETE_REVIEW',

      'VIEW_PROJECT_OVERVIEW',

      'VIEW_S3BUCKETINFO',
      'CREATE_ORGANIZATION_DETAILS',
      'UPDATE_ORGANIZATION_DETAILS',
      'VIEW_ORGANIZATION_DETAILS',

      'UPDATE_LOGS',
      'CREATE_LOGS',
      'VIEW_LOGS',
      'DELETE_LOGS',

      'CREATE_WORKLOG_TAGS',
      'VIEW_WORKLOG_TAGS',
      'UPDATE_WORKLOG_TAGS',
      'DELETE_WORKLOG_TAGS',

      'CREATE_TECHNOLOGY',
      'VIEW_TECHNOLOGY',
      'UPDATE_TECHNOLOGY',
      'DELETE_TECHNOLOGY',

      'CREATE_PROJECT_TAG',
      'VIEW_PROJECT_TAG',
      'UPDATE_PROJECT_TAG',
      'DELETE_PROJECT_TAG',

      'CREATE_NOTIFICATION',
      'VIEW_NOTIFICATION',
      'UPDATE_NOTIFICATION',
      'DELETE_NOTIFICATION',

      'CREATE_JOB_PROFILE',
      'VIEW_JOB_PROFILE',
      'UPDATE_JOB_PROFILE',
      'DELETE_JOB_PROFILE',

      'CREATE_CURRENCY',
      'UPDATE_CURRENCY',
      'VIEW_CURRENCY',
      'DELETE_CURRENCY',

      'CREATE_ROLE',
      'UPDATE_ROLE',
      'VIEW_ROLE',
      'DELETE_ROLE',

      'CREATE_PERMISSION',
      'UPDATE_PERMISSION',
      'VIEW_PERMISSION',
      'DELETE_PERMISSION',

      'VIEW_USERPROFILE',
      'UPDATE_USERPROFILE',

      'DOWNLOAD_EMPLOYEE_EXCEL',
      'DOWNLOAD_DASHBOARD_EXCEL',
      'DOWNLOAD_LOGS_EXCEL',
      'DOWNLOAD_CHANGE_REQUEST_EXCEL',
      'DOWNLOAD_WORKLOGS_EXCEL',
      'DOWNLOAD_CLIENT_EXCEL',
      'DOWNLOAD_DEPARTMENT_EXCEL',
      'DOWNLOAD_SKILL_EXCEL',
      'DOWNLOAD_PROJECT_EXCEL',

      'CREATE_ORGANIZATION_BRANCH',
      'VIEW_ORGANIZATION_BRANCH',
      'UPDATE_ORGANIZATION_BRANCH',
      'DELETE_ORGANIZATION_BRANCH',

      'VIEW_CLOSED_PROJECT',
      'UPDATE_CLOSED_PROJECT',
      'VIEW_COST',

      'VIEW_DASHBOARD_FREE_RESOURCES',
      'VIEW_DASHBOARD_STATISTICS',
      'VIEW_DASHBOARD_MONTHLY_CHART',
      'VIEW_DASHBOARD_WORKLOGS',
      'VIEW_DASHBOARD_LATEST_PROJECTS',
      'VIEW_DASHBOARD_PROJECT_LINE',

      'VIEW_ALL_DASHBOARD_STATISTICS',

      'VIEW_ALL_DASHBOARD_MONTHLY_CHART',

      'VIEW_ALL_DASHBOARD_WORKLOGS',

      'VIEW_ALL_DASHBOARD_LATEST_PROJECTS',

      'VIEW_ALL_DASHBOARD_PROJECT_LINE',

      'VIEW_ALL_PROJECT_OVERVIEW',

      'VIEW_ALL_WORKLOGS',

      'VIEW_ALL_PROJECT',

      'VIEW_ALL_CLIENT',

      'VIEW_ALL_CLOSED_PROJECT'

    ],
    eStatus: 'Y',
    bIsDefault: false,
    bIsSystem: true
  },
  {
    sBackGroundColor: 'hsl(50deg, 100%, 90%)',
    sTextColor: 'hsl(50deg, 65%, 50%)',
    sName: 'Admin',
    sKey: 'ADMIN',
    aPermissions: [
      'VIEW_DASHBOARD',

      'CREATE_EMPLOYEE',
      'VIEW_EMPLOYEE',
      'UPDATE_EMPLOYEE',
      'DELETE_EMPLOYEE',

      'CREATE_PROJECT',
      'VIEW_PROJECT',
      'UPDATE_PROJECT',
      'DELETE_PROJECT',

      'CREATE_SKILL',
      'VIEW_SKILL',
      'UPDATE_SKILL',
      'DELETE_SKILL',

      'CREATE_DEPARTMENT',
      'VIEW_DEPARTMENT',
      'UPDATE_DEPARTMENT',
      'DELETE_DEPARTMENT',

      'CREATE_CLIENT',
      'VIEW_CLIENT',
      'UPDATE_CLIENT',
      'DELETE_CLIENT',

      'CREATE_WORKLOGS',
      'VIEW_WORKLOGS',
      'DELETE_WORKLOGS',

      'CREATE_CHANGE_REQUEST',
      'VIEW_CHANGE_REQUEST',
      'UPDATE_CHANGE_REQUEST',
      'DELETE_CHANGE_REQUEST',

      'CREATE_REVIEW',
      'VIEW_REVIEW',
      'UPDATE_REVIEW',
      'DELETE_REVIEW',

      'VIEW_PROJECT_OVERVIEW',

      'VIEW_S3BUCKETINFO',
      'CREATE_ORGANIZATION_DETAILS',
      'UPDATE_ORGANIZATION_DETAILS',
      'VIEW_ORGANIZATION_DETAILS',

      'UPDATE_LOGS',
      'CREATE_LOGS',
      'VIEW_LOGS',
      'DELETE_LOGS',

      'CREATE_WORKLOG_TAGS',
      'VIEW_WORKLOG_TAGS',
      'UPDATE_WORKLOG_TAGS',
      'DELETE_WORKLOG_TAGS',

      'CREATE_TECHNOLOGY',
      'VIEW_TECHNOLOGY',
      'UPDATE_TECHNOLOGY',
      'DELETE_TECHNOLOGY',

      'CREATE_PROJECT_TAG',
      'VIEW_PROJECT_TAG',
      'UPDATE_PROJECT_TAG',
      'DELETE_PROJECT_TAG',

      'CREATE_NOTIFICATION',
      'VIEW_NOTIFICATION',
      'UPDATE_NOTIFICATION',
      'DELETE_NOTIFICATION',

      'CREATE_JOB_PROFILE',
      'VIEW_JOB_PROFILE',
      'UPDATE_JOB_PROFILE',
      'DELETE_JOB_PROFILE',

      'CREATE_CURRENCY',
      'UPDATE_CURRENCY',
      'VIEW_CURRENCY',
      'DELETE_CURRENCY',

      'CREATE_ROLE',
      'UPDATE_ROLE',
      'VIEW_ROLE',
      'DELETE_ROLE',

      'CREATE_PERMISSION',
      'UPDATE_PERMISSION',
      'VIEW_PERMISSION',
      'DELETE_PERMISSION',

      'VIEW_USERPROFILE',
      'UPDATE_USERPROFILE',

      'DOWNLOAD_EMPLOYEE_EXCEL',
      'DOWNLOAD_DASHBOARD_EXCEL',
      'DOWNLOAD_LOGS_EXCEL',
      'DOWNLOAD_CHANGE_REQUEST_EXCEL',
      'DOWNLOAD_WORKLOGS_EXCEL',
      'DOWNLOAD_CLIENT_EXCEL',
      'DOWNLOAD_DEPARTMENT_EXCEL',
      'DOWNLOAD_SKILL_EXCEL',
      'DOWNLOAD_PROJECT_EXCEL',

      'CREATE_ORGANIZATION_BRANCH',
      'VIEW_ORGANIZATION_BRANCH',
      'UPDATE_ORGANIZATION_BRANCH',
      'DELETE_ORGANIZATION_BRANCH',

      'VIEW_CLOSED_PROJECT',
      'UPDATE_CLOSED_PROJECT',
      'VIEW_COST'

    ],
    bIsDefault: false,
    bIsSystem: true,
    eStatus: 'Y'
  },
  {
    sBackGroundColor: 'hsl(75deg, 100%, 90%)',
    sTextColor: 'hsl(75deg, 65%, 50%)',
    sName: 'Project Manager',
    sKey: 'PROJECT_MANAGER',
    aPermissions: [
      'VIEW_DASHBOARD',

      'CREATE_EMPLOYEE',
      'VIEW_EMPLOYEE',
      'UPDATE_EMPLOYEE',

      'CREATE_PROJECT',
      'VIEW_PROJECT',
      'UPDATE_PROJECT',
      'DELETE_PROJECT',

      'VIEW_SKILL',

      'VIEW_DEPARTMENT',

      'VIEW_CLIENT',

      'CREATE_WORKLOGS',
      'VIEW_WORKLOGS',
      'DELETE_WORKLOGS',

      'CREATE_CHANGE_REQUEST',
      'VIEW_CHANGE_REQUEST',
      'UPDATE_CHANGE_REQUEST',
      'DELETE_CHANGE_REQUEST',

      'CREATE_REVIEW',
      'VIEW_REVIEW',
      'UPDATE_REVIEW',
      'DELETE_REVIEW',

      'VIEW_PROJECT_OVERVIEW',

      'CREATE_WORKLOG_TAGS',
      'VIEW_WORKLOG_TAGS',
      'UPDATE_WORKLOG_TAGS',
      'DELETE_WORKLOG_TAGS',

      'CREATE_TECHNOLOGY',
      'VIEW_TECHNOLOGY',
      'UPDATE_TECHNOLOGY',
      'DELETE_TECHNOLOGY',

      'CREATE_PROJECT_TAG',
      'VIEW_PROJECT_TAG',
      'UPDATE_PROJECT_TAG',
      'DELETE_PROJECT_TAG',

      'VIEW_NOTIFICATION',
      'UPDATE_NOTIFICATION',
      'DELETE_NOTIFICATION',

      'VIEW_JOB_PROFILE',

      'VIEW_USERPROFILE',
      'UPDATE_USERPROFILE',
      'VIEW_COST'

    ],
    bIsDefault: false,
    bIsSystem: true,
    eStatus: 'Y'
  },
  {
    sBackGroundColor: 'hsl(25deg, 100%, 90%)',
    sTextColor: ' hsl(25deg, 65%, 50%)',
    sName: 'Functional Manager',
    sKey: 'FUNCTIONAL_MANAGER',
    aPermissions: [
      'VIEW_DASHBOARD',

      'CREATE_EMPLOYEE',
      'VIEW_EMPLOYEE',
      'UPDATE_EMPLOYEE',

      'CREATE_PROJECT',
      'VIEW_PROJECT',
      'UPDATE_PROJECT',
      'DELETE_PROJECT',

      'VIEW_SKILL',

      'VIEW_DEPARTMENT',

      'VIEW_CLIENT',

      'CREATE_WORKLOGS',
      'VIEW_WORKLOGS',
      'DELETE_WORKLOGS',

      'CREATE_CHANGE_REQUEST',
      'VIEW_CHANGE_REQUEST',
      'UPDATE_CHANGE_REQUEST',
      'DELETE_CHANGE_REQUEST',

      'CREATE_REVIEW',
      'VIEW_REVIEW',
      'UPDATE_REVIEW',
      'DELETE_REVIEW',

      'VIEW_PROJECT_OVERVIEW',

      'CREATE_WORKLOG_TAGS',
      'VIEW_WORKLOG_TAGS',
      'UPDATE_WORKLOG_TAGS',
      'DELETE_WORKLOG_TAGS',

      'CREATE_TECHNOLOGY',
      'VIEW_TECHNOLOGY',
      'UPDATE_TECHNOLOGY',
      'DELETE_TECHNOLOGY',

      'CREATE_PROJECT_TAG',
      'VIEW_PROJECT_TAG',
      'UPDATE_PROJECT_TAG',
      'DELETE_PROJECT_TAG',

      'VIEW_NOTIFICATION',
      'UPDATE_NOTIFICATION',
      'DELETE_NOTIFICATION',

      'VIEW_JOB_PROFILE',

      'VIEW_USERPROFILE',
      'UPDATE_USERPROFILE',
      'VIEW_COST'

    ],
    bIsDefault: false,
    bIsSystem: true,
    eStatus: 'Y'
  },
  {
    sBackGroundColor: 'hsl(250deg, 100%, 90%)',
    sTextColor: 'hsl(250deg, 65%, 50%)',
    sName: 'Sales',
    sKey: 'SALES',
    aPermissions: [
      'VIEW_DASHBOARD',

      'CREATE_EMPLOYEE',
      'VIEW_EMPLOYEE',
      'UPDATE_EMPLOYEE',

      'CREATE_PROJECT',
      'VIEW_PROJECT',
      'UPDATE_PROJECT',
      'DELETE_PROJECT',

      'VIEW_SKILL',

      'VIEW_DEPARTMENT',

      'VIEW_CLIENT',

      'CREATE_WORKLOGS',
      'VIEW_WORKLOGS',
      'DELETE_WORKLOGS',

      'CREATE_CHANGE_REQUEST',
      'VIEW_CHANGE_REQUEST',
      'UPDATE_CHANGE_REQUEST',
      'DELETE_CHANGE_REQUEST',

      'CREATE_REVIEW',
      'VIEW_REVIEW',
      'UPDATE_REVIEW',
      'DELETE_REVIEW',

      'VIEW_PROJECT_OVERVIEW',

      'CREATE_WORKLOG_TAGS',
      'VIEW_WORKLOG_TAGS',
      'UPDATE_WORKLOG_TAGS',
      'DELETE_WORKLOG_TAGS',

      'CREATE_TECHNOLOGY',
      'VIEW_TECHNOLOGY',
      'UPDATE_TECHNOLOGY',
      'DELETE_TECHNOLOGY',

      'CREATE_PROJECT_TAG',
      'VIEW_PROJECT_TAG',
      'UPDATE_PROJECT_TAG',
      'DELETE_PROJECT_TAG',

      'VIEW_NOTIFICATION',
      'UPDATE_NOTIFICATION',
      'DELETE_NOTIFICATION',

      'VIEW_JOB_PROFILE',

      'VIEW_USERPROFILE',
      'UPDATE_USERPROFILE',
      'VIEW_COST'

    ],
    bIsDefault: false,
    bIsSystem: true,
    eStatus: 'Y'
  },
  {
    sBackGroundColor: 'hsl(125deg, 100%, 90%)',
    sTextColor: 'hsl(125deg, 65%, 50%)',
    sName: 'Employees',
    sKey: 'EMPLOYEES',
    bIsDefault: true,
    bIsSystem: true,
    aPermissions: [
      'VIEW_DASHBOARD',

      'VIEW_EMPLOYEE',

      'VIEW_PROJECT',

      'VIEW_SKILL',

      'VIEW_DEPARTMENT',

      'VIEW_CLIENT',

      'CREATE_WORKLOGS',
      'VIEW_WORKLOGS',
      'DELETE_WORKLOGS',

      'VIEW_CHANGE_REQUEST',

      'VIEW_REVIEW',

      'VIEW_WORKLOG_TAGS',

      'VIEW_TECHNOLOGY',

      'VIEW_PROJECT_TAG',

      'VIEW_NOTIFICATION',
      'UPDATE_NOTIFICATION',
      'DELETE_NOTIFICATION',

      'VIEW_USERPROFILE'
    ],
    eStatus: 'Y'
  }
]

const PermissionModel = require('../models_routes_service/Permission/model')

class RoleSeeder {
  constructor() {
    this.RoleModel = require('../models_routes_service/Role/model')
    this.Roles = Roles
    this.Name = 'RoleSeeder'
  }

  async seedDb() {
    try {
      await this.RoleModel.deleteMany({})
      for (const role of Roles) {
        const permisison = []

        for (const permission of role.aPermissions) {
          const permissionExist = await PermissionModel.findOne({ sKey: permission, eStatus: 'Y' }).lean()
          if (permissionExist) {
            if (!permission.includes(permisison._id)) {
              permisison.push(permissionExist._id)
            }
          }
        }

        await this.RoleModel.create({
          sName: role.sName,
          sKey: role.sKey,
          aPermissions: permisison,
          eStatus: role.eStatus,
          bIsDefault: role?.bIsDefault || false,
          sBackGroundColor: role?.sBackGroundColor || '',
          sTextColor: role?.sTextColor || ''
        })

        // console.log('data Role', data)
      }

      console.log('Roles seeded successfully')
    } catch (error) {
      console.log(error)
      console.log('Roles seeding failed')
    } finally {
      console.log('Roles seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new RoleSeeder()
