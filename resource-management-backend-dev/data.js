const enums = {

  platform: ['A', 'I', 'W', 'O', 'AD'], // A = Android, I = iOS, W = Web, O = Other, AD = Admin

  status: ['Y', 'B', 'N'],
  eShowAllProjects: ['OWN', 'ALL'],

  adminLogTypes: ['L', 'PC', 'RP'], // L = Login, PC = Password Change, RP = ResetPassword
  supportedLanguage: ['English', 'Hindi'],
  grade: ['A', 'B', 'C', 'D'],
  active: ['Active', 'De-Active'],
  review: ['AD', 'BDE', 'TL', 'FM', 'PM'],
  projectType: ['Fixed', 'Dedicated'],
  costType: ['Monthly', 'Hourly'],
  interviewStatus: ['Profile shared', 'Interviewing', 'Selected', 'Not Selected'],
  availabilityStatus: ['Partially Available', 'Available', 'Not Available'],
  empStatus: ['Yes', 'No', 'Delete'],
  resumeStatus: ['Yes', 'No', 'Delete'],
  profileStatus: ['Yes', 'No', 'Delete'],
  devType: ['Dedicated', 'Fixed'],
  Grade: ['A', 'B', 'C', 'D'],
  depStatus: ['Yes', 'No', 'Delete'],
  skillStatus: ['Yes', 'No'],
  action: ['Create', 'Update', 'Delete'],
  path: ['WorkLogs', 'Employee', 'Client', 'Department', 'Interview', 'JobProfile', 'Project', 'Notification', 'ProjectTag', 'Skill', 'Technology', 'User', 'ProjectWiseEmployee', 'OrganizationDetails', 'Currency', 'Role', 'Permission', 'WorkLogs Tags', 'Cr', 'Log', 'DashBoard', 'ORGBranches', 'ProjectWiseDepartment'],
  score: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  empType: ['E', 'U', 'A', 'SA'],
  projectStatus: ['Pending', 'On Hold', 'In Progress', 'Completed', 'Closed'],
  hooks: [
    'validate',
    'save',
    'remove',
    'updateOne',
    'deleteOne',
    'deleteMany',
    'deleteOne',
    'findOneAndDelete',
    'findOneAndRemove',
    'findOneAndReplace',
    'findOneAndUpdate',
    'remove',
    'replaceOne',
    'update',
    'updateOne',
    'updateMany',
    'count',
    'countDocuments',
    'estimatedDocumentCount',
    'find',
    'findOne'
  ],
  hooksDDL: [
    'count',
    'countDocuments',
    'estimatedDocumentCount',
    'find',
    'findOne'
  ],
  currencyTakenFlag: ['G', 'L'],
  permissions: [
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

    'VIEW_COST'

  ],
  role: [
    'Admin',
    'Functional Manager',
    'Project Manager',
    'Team Lead',
    'Business Development Executive',
    'Employee',
    'Team Lead'
  ],
  RoleWisePermission: [
    {
      role: 'Admin',
      permissions: [
        'VIEW_DASHBOARD',

        'CREATE_EMPLOYEE',

        'VIEW_EMPLOYEE',

        'UPDATE_EMPLOYEE',

        'DELETE_EMPLOYEE',

        'DOWNLOAD_EMPLOYEE_EXCEL',

        'CREATE_PROJECT',

        'VIEW_PROJECT',

        'UPDATE_PROJECT',

        'DELETE_PROJECT',

        'DOWNLOAD_PROJECT_EXCEL',

        'CREATE_SKILL',

        'VIEW_SKILL',

        'UPDATE_SKILL',

        'DELETE_SKILL',

        'DOWNLOAD_SKILL_EXCEL',

        'CREATE_DEPARTMENT',

        'VIEW_DEPARTMENT',

        'UPDATE_DEPARTMENT',

        'DELETE_DEPARTMENT',

        'DOWNLOAD_DEPARTMENT_EXCEL',

        'CREATE_CLIENT',

        'VIEW_CLIENT',

        'UPDATE_CLIENT',

        'DELETE_CLIENT',

        'DOWNLOAD_CLIENT_EXCEL',

        'CREATE_WORKLOGS',

        'VIEW_WORKLOGS',

        'DELETE_WORKLOGS',

        'DOWNLOAD_WORKLOGS_EXCEL',

        'CREATE_CHANGE_REQUEST',

        'VIEW_CHANGE_REQUEST',

        'UPDATE_CHANGE_REQUEST',

        'DELETE_CHANGE_REQUEST',

        'DOWNLOAD_CHANGE_REQUEST_EXCEL',

        'CREATE_REVIEW',

        'VIEW_REVIEW',

        'UPDATE_REVIEW',

        'DELETE_REVIEW',

        'VIEW_PROJECT_OVERVIEW',

        'VIEW_COST'

      ],
      isDefault: true
    },
    {
      role: 'Functional Manager',
      permissions: [
        'VIEW_DASHBOARD',
        'CREATE_EMPLOYEE',
        'VIEW_EMPLOYEE',
        'CREATE_SKILL',
        'VIEW_COST'
      ],
      isDefault: true
    },
    {
      role: 'Project Manager',
      permissions: [
        'VIEW_DASHBOARD',
        'CREATE_EMPLOYEE',
        'VIEW_EMPLOYEE',
        'CREATE_SKILL',
        'VIEW_COST'
      ],
      isDefault: true
    },
    {
      role: 'Employee',
      permissions: [
        'VIEW_DASHBOARD',
        'VIEW_WORKLOGS',
        'CREATE_WORKLOGS',
        'DELETE_WORKLOGS',
        'DOWNLOAD_WORKLOGS_EXCEL'
      ]
    }
  ],
  extraPermissions_notExist: [

    '#_VIEW_DASHBOARD * for Porject Indicators',
    '#_VIEW_HOME * for Project chart',

    '#_VIEW_CLIENT_PROJECTS * for getClientProjects',

    '#_VIEW_EMPLOYEE * for getDepartmentWiseEmployee',

    '#_VIEW_PROJECT * for calc,cals,calcWorkLogsBasedProjects,calcWorkLogsBasedCrs',

    'ADMIN_ACTION',
    'SUPERADMIN_ACTION'
  ],
  modules: [
    'DASHBOARD',
    'EMPLOYEE',
    'PROJECT',
    'SKILL',
    'DEPARTMENT',
    'CLIENT',
    'WORKLOGS',
    'CHANGE_REQUEST',
    'REVIEW',
    'PROJECT_OVERVIEW',
    'S3BUCKETINFO',
    'ORGANIZATION_DETAILS',
    'LOGS',
    'WORKLOG_TAGS',
    'TECHNOLOGY',
    'PROJECT_TAG',
    'NOTIFICATION',
    'JOB_PROFILE',
    'CURRENCY',
    'ROLE',
    'PERMISSION',
    'USERPROFILE',
    'DOWNLOADS',
    'ORGANIZATION_BRANCH',
    'OTHERS'
  ],
  logger: [
    {
      name: 'CREATE EMPLOYEE',
      Year: '2020',
      dCreatedAt: '2020-01-01 00:00:00 +00:00',
      dUpdatedAt: '2020-01-01 00:00:00 +00:00'
    },
    {
      name: 'UPDATE EMPLOYEE',
      Year: '2020',
      dCreatedAt: '2020-01-01 00:00:00 +00:00'
    }
  ]

  // permissions based on role
  //   - Super Admin
  // - Admins
  // - Project Manager
  // - Functional Manager
  // - Sales
  // - Employees

  // Department
  // - HR
  // - Admin
  // - Sales
  // - Marketing
  // - UI/UX
  // - Designing
  // - Web Designing
  // - Web Development
  // - Mobile App Development
  // - Game Development
  // - Blockchain
  // - DevOps
  // - Management
  // - Business Analyst
  // - Quality Assurance
  // - Operation

}
module.exports = enums
