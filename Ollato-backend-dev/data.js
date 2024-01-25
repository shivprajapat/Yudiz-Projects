const enums = {
  status: ['y', 'n'],
  availableStatus: ['available', 'booked', 'block'],
  sessionsStatus: ['panding', 'accepted', 'reject', 'reschedule', 'cancel', 'completed'],
  packageType: ['subcription', 'addon'],
  reportBy: ['counsellor', 'student'],
  supportedLanguage: ['en', 'hi'],

  adminLogTypes: ['L', 'PC', 'RP'], // L = Login, PC = Password Change, RP = Reset Password
  adminStatus: ['Y', 'B', 'D'],
  adminType: ['super', 'sub'],
  adminLogKeys: ['D', 'W', 'P', 'KYC', 'BD', 'SUB', 'AD', 'AW', 'PC', 'L', 'PB'], // D = DEPOSIT, W = WITHDRAW, P = PROFILE, BD = BANK DETAILS, SA = SUBADMIN, AD = ADMIN DEPOSIT, AW = ADMIN WITHDRAW, PC = PROMOCODE, L = LEAGUE, PB = PRIZE BREAKUP
  permissionType: ['access', 'add', 'edit', 'delete', 'view'],
  permissionModule: ['package', 'university', 'board', 'school', 'student', 'center', 'counsellor'],
  adminPay: ['PAY'],

  kycStatus: ['P', 'A', 'R', 'N'], // P = Pending, A = Accepted, R = Rejected, N = Not uploaded
  bankStatus: ['P', 'A', 'R', 'N'], // P = Pending, A = Accepted, R = Rejected, N = Not uploaded

  notificationStatus: [0, 1],
  notificationTopic: ['All', 'Web', 'IOS', 'Android'],
  notificationMessageKeys: ['PLAY_RETURN', 'MATCH_TIPS', 'LINEUPS'],
  notificationPlatform: ['A', 'I', 'W', 'ALL'], // A = Android, I = iOS, W = Web, ALL = ALL

  authLogType: ['R', 'L', 'PC', 'RP'],

  userType: ['U', 'B'],
  userGender: ['M', 'F', 'O'],
  socialType: ['G', 'F', 'A', 'T'],
  userStatus: ['Y', 'N', 'D'],

  otpType: ['E', 'M'], // Email | Mobile
  otpAuth: ['R', 'F', 'V', 'L'], // Register | ForgotPass | Verification | Login

  withdrawPaymentGetaways: ['ADMIN', 'PAYTM', 'AMAZON', 'CASHFREE'],

  payoutOptionType: ['INSTANT', 'STD'],

  paymentStatus: ['P', 'S', 'C', 'R'], // P = pending, S = success, C = cancelled, R = refunded
  payoutStatus: ['P', 'S', 'C', 'R', 'I'], // P = pending, S = success, C = cancelled, R = refunded, I = Initiated

  tdsStatus: ['P', 'A'], // pending active

  reportsKeys: ['TU', 'RU', 'LU', 'TUT', 'W', 'BE', 'UB', 'TDS'],
  filterReportKeys: ['USER_REPORT', 'USERTEAM_REPORT', 'PARTICIPANT_REPORT', 'WIN_REPORT', 'WIN_RETURN_REPORT', 'PRIVATE_LEAGUE_REPORT', 'PLAY_REPORT', 'PLAY_RETURN_REPORT', 'CASHBACK_REPORT', 'CASHBACK_RETURN_REPORT', 'CREATOR_BONUS_REPORT', 'CREATOR_BONUS_RETURN_REPORT'],
  sportsReportsKeys: ['TP', 'TT', 'TB', 'UT', 'LP', 'TW', 'TWR', 'CNCLL', 'CMPL', 'CL', 'PR', 'PL', 'CC', 'CR', 'CB', 'CBR'],
  allReportKeys: ['TU', 'RU', 'LU', 'TUT', 'W', 'BE', 'UB', 'TP', 'TT', 'TB', 'UT', 'LP', 'TW', 'CNCLL', 'CMPL', 'CL', 'PR', 'PL', 'CC', 'CR', 'CB'],

  dashboardKeys: ['RUDW', 'RUMW', 'RUYW', 'UTDW', 'UTMW', 'UTYW', 'DDW', 'DMW', 'DYW', 'WDW', 'WMW', 'WYW'],

  seriesStatus: ['P', 'L', 'CMP'],
  nationality: ['Indian', 'Other'],
  sessionsType: ['VIDEO', 'F2F'],
  counsellorType: ['career_counsellor', 'psychologist', 'overseas_counsellor', 'subject_expert'],

  adminPermissionType: ['R', 'W', 'N'], // R = READ, W = WRITE, N = NONE - Access Rights

  issueType: ['C', 'F'], // C = Complaints, F = Feedbacks
  settingKeys: ['BG', 'IMG'],
  cssTypes: ['COMMON', 'CONDITION'],
  versionType: ['A', 'I'], // A = Android, I = iOS
  rewardOn: ['REGISTER', 'FIRST_DEPOSIT', 'FIRST_LEAGUE_JOIN'],
  botType: ['N', 'CP'], // N = Normal Bot, CP = Copy Bot,
  totalCountKeys: ['UC', 'SUC', 'TXC', 'DC', 'WC', 'MC', 'PC', 'TC'], // UC = users count, SUC = system users count, TXC = transaction count, DC = deposit count, WC = withdrawl count, MC = match count, PC = player count, TC = team count

  copyTeamTypes: ['SAME', 'ROTATE', 'RANDOM'],

  userTypeForJoinLeague: ['U', 'B', 'CB', 'CMB'], // U = USER, B = BOT, CB = COPY_BOT, CMB = COMBINATION_BOT

  smsProvider: ['MSG91'],
  rescheduledBy: ['student', 'counsellor'],
  canceleddBy: ['student', 'counsellor'],
  counsellorStatus: ['pending', 'approved', 'rejected'],
  redeemStatus: ['pending', 'paid', 'rejected'],
  couponType: ['fixed_amount', 'percentage']
}

module.exports = enums
