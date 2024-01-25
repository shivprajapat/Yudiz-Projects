const enums = {
  supportedLanguages: ['English', 'Hindi'],
  adminStatus: {
    value: ['A', 'I', 'D'],
    default: 'A',
    description: { A: 'Active', I: 'Inactive', D: 'Deleted' }
  },
  adminPermission: [
    'SUBADMIN',
    'PERMISSION',
    'ADMIN_ROLE',
    'USERS',
    'USER_CONTACT',
    'NOTIFICATION',
    'PUSHNOTIFICATION',
    'REPORT',
    'FIELDS'
  ],
  logOperationType: {
    value: ['C', 'U', 'D', 'S'],
    description: { C: 'Create', U: 'Update', D: 'Delete', S: 'Sync' }
  },
  otpType: {
    value: ['E', 'M'],
    description: { E: 'Email', M: 'Mobile' }
  },
  otpAuth: {
    value: ['R', 'F', 'L'],
    description: { R: 'Register', F: 'ForgotPass', L: 'Login' }
  },
  reviewOperationStatus: {
    value: ['G', 'R'],
    description: { G: 'Given', R: 'Received' }
  },
  requestType: {
    value: ['S', 'R'],
    description: { S: 'Sent', R: 'Received' }
  },
  requestStatus: {
    value: ['A', 'R', 'P', 'D'],
    default: 'P',
    description: { A: 'APPROVED', R: 'REJECTED', P: 'PENDING', D: 'DELETE' }
  },
  adminPermissionType: {
    value: ['R', 'W', 'N'],
    description: { R: 'Read', W: 'Write', N: 'None' }
  },
  adminType: {
    value: ['SU', 'SB'],
    description: { SU: 'Super', SB: 'Sub' }
  },
  status: {
    value: ['A', 'I', 'D'],
    default: 'A',
    description: { A: 'Active', I: 'Inactive', D: 'Deleted' }
  },
  adminLogKeys: ['P', 'SA', 'U', 'R', 'PM', 'PN', 'FE'], // P = Profile, SA = Sub Admin, U = User, R = Role, PM = Permission, PN = Push Notification, FE = Fields
  platform: ['A', 'I', 'W', 'O', 'AD'], // A = Android, I = iOS, W = Web, O = Other, AD = Admin
  adminLogTypes: ['L', 'PC', 'RP'], // L = Login, PC = Password Change, RP = ResetPassword
  reportsKeys: ['TU', 'RU', 'LU', 'TC', 'UU'], // TU = Total User, RU = Register User, LU = Login User, TC = Total Contacts
  userStatus: {
    value: ['A', 'I', 'D'],
    default: 'A',
    description: { A: 'Active', I: 'Inactive', D: 'Deleted' }
  }, // A = Active, B = Blocked, D = Deleted
  serviceType: {
    value: ['G', 'L'],
    description: { G: 'Global', L: 'Local' },
    default: 'L'
  }, // G=GLOBAL ,L= LOCAL
  notificationStatus: [0, 1], // 0 = Unread, 1 = Read
  notificationMode: [0, 1], // 0 = Disabled, 1 = Enabled
  notificationTypeStatus: ['Y', 'N'], // Y = Active, N = Not Active
  notificationPlatform: ['A', 'I', 'W', 'ALL'], // A = Android, I = iOS, W = Web, ALL = ALL
  logOperationName: {
    CU: 'CU', // CU = CREATE USER,
    CP: 'CP', // CP = CHANGE PASSWORD,
    FP: 'FP', // FP = FORGOT PASSWORD,
    DA: 'DA', // DP = DELETE ACCOUNT
    UU: 'UU', // UU = UPDATE USER
    ADU: 'ADU' // ADMIN USER UPDATE
  },
  adminLogOperationName: {
    CU: 'CU', // CU =  CITY UPDATE,
    CC: 'CC', // CA = CITY ADD
    CD: 'CD', // CD = CITY DELETE
    PRD: 'PRD', // PRD = PROFESSION DELETE ,
    PRC: 'PRC', // PRC = PROFESSION CREATE
    PRU: 'PRU', // PRU = PROFESSION UPDATE,
    PU: 'PU', // PU = PERMISSION UPDATE
    RU: 'RU', // RU = UPDATE ROLE,
    RD: 'RD', // RD = DELETE ROLE
    CR: 'CR', // CR = CREATE ROLE
    SAU: 'SAU' // SUB ADMIN UPDATE
  }
}

module.exports = enums
