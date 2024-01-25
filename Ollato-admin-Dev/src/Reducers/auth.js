import constants from '../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  userData: null,
  isAuthenticated: null,
  loading: null,
  data: null,
  isOTPSend: null,
  isForgotOTPSend: null,
  aData: null,
  universityData: null,
  registerData: null,
  isRegistered: null,
  isLogin: null,
  adminData: null,
  adminToken: null,
  isAdminEmailVerified: null,
  isAdminReset: null,
  boardsData: null,
  schoolData: null,
  gradeData: null,
  counsellorData: null,
  isLoggedOut: null,
  role_permission: [],
  isPasswordChanged: null,
  profileDataAdmin: null,
  isProfileEditedAdmin: null,
  dashboardDataAdmin: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        userData: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isAuthenticated: action.payload.isAuthenticated
      }
    case constants.CLEAR_LOGIN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isAuthenticated: null
      }
    case constants.FORGET_PASSWORD_VERIFY_EMAIL:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isForgotOTPSend: action.payload.isForgotOTPSend
      }
    case constants.CLEAR_FORGET_PASSWORD_VERIFY_EMAIL:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isForgotOTPSend: null
      }
    case constants.SEND_OTP:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isOTPSend: action.payload.isOTPSend
      }
    case constants.CLEAR_SEND_OTP:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isOTPSend: null
      }
    case constants.VERIFY_OTP:
      return {
        ...state,
        token: action.payload.token,
        userData: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isAuthenticated: action.payload.isAuthenticated
      }
    case constants.CLEAR_VERIFY_OTP:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isAuthenticated: null
      }
    case constants.DUMMY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        data: action.payload.data
      }
    case constants.CLEAR_DUMMY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        data: null
      }
    case constants.EMAIL_VERIFY_FORGOT_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        authToken: action.payload.authToken,
        isEmailVerified: action.payload.isEmailVerified
      }
    case constants.CLEAR_EMAIL_VERIFY_FORGOT_PASSWORD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        authToken: null,
        isEmailVerified: null
      }
    case constants.OTP_VERIFICATION_FORGOT_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isOtpVerified: action.payload.isOtpVerified
      }
    case constants.CLEAR_OTP_VERIFICATION_FORGOT_PASSWORD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isOtpVerified: null
      }
    case constants.RESET_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isReset: action.payload.isReset
      }
    case constants.CLEAR_RESET_PASSWORD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isReset: null
      }
    case constants.SEND_OTP_SIGNUP:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isEmailAddressVerified: action.payload.isEmailAddressVerified
      }
    case constants.CLEAR_SEND_OTP_SIGNUP:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isEmailAddressVerified: null
      }
    case constants.VERIFY_OTP_SIGNUP:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isOTPSignupVerified: action.payload.isOTPSignupVerified
      }
    case constants.CLEAR_VERIFY_OTP_SIGNUP:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isOTPSignupVerified: null
      }
    case constants.GET_ALL_STATES:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        statesData: action.payload.statesData
      }
    case constants.CLEAR_GET_ALL_STATES:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        statesData: null
      }
    case constants.GET_ALL_COUNTRIES:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        countriesData: action.payload.countriesData
      }
    case constants.CLEAR_GET_ALL_COUNTRIES:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        countriesData: null
      }
    case constants.GET_ALL_BOARDS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        boardsData: action.payload.boardsData
      }
    case constants.CLEAR_GET_ALL_BOARDS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        boardsData: null
      }
    case constants.GET_ALL_SCHOOLS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        schoolData: action.payload.schoolData
      }
    case constants.CLEAR_GET_ALL_SCHOOLS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        schoolData: null
      }
    case constants.GET_ALL_GRADE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        gradeData: action.payload.gradeData
      }
    case constants.CLEAR_GET_ALL_GRADE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        gradeData: null
      }
    case constants.GET_ALL_DISTRICTS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        districtData: action.payload.districtData
      }
    case constants.CLEAR_GET_ALL_DISTRICTS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        districtData: null
      }
    case constants.GET_ALL_QUALIFICATIONS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        qData: action.payload.qData
      }
    case constants.CLEAR_GET_ALL_QUALIFICATIONS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        qData: null
      }
    case constants.GET_ALL_COUNSELLOR:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        counsellorData: action.payload.counsellorData
      }
    case constants.CLEAR_GET_ALL_COUNSELLOR:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        counsellorData: null
      }
    case constants.GET_ALL_UNIVERSITIES:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        universityData: action.payload.universityData
      }
    case constants.CLEAR_GET_ALL_UNIVERSITIES:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        universityData: null
      }
    case constants.SIGNUP:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        registerData: action.payload.registerData,
        isRegistered: action.payload.isRegistered
      }
    case constants.CLEAR_SIGNUP:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        registerData: null,
        isRegistered: null
      }
    case constants.ADMIN_LOGIN:
      return {
        ...state,
        token: action.payload.token,
        adminData: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isLogin: action.payload.isLogin
        // role_permission: action.payload.role_permission
      }
    case constants.CLEAR_ADMIN_LOGIN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isLogin: null
        // role_permission: []
      }
    case constants.ADMIN_FORGOT_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        adminToken: action.payload.adminToken,
        loading: false,
        isAdminEmailVerified: action.payload.isAdminEmailVerified
      }
    case constants.CLEAR_ADMIN_FORGOT_PASSWORD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        adminToken: null,
        loading: true,
        isAdminEmailVerified: null
      }
    case constants.MOBILE_VERIFICATION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isMobileOTPVerification: action.payload.isMobileOTPVerification
      }
    case constants.CLEAR_MOBILE_VERIFICATION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isMobileOTPVerification: null
      }
    case constants.MOBILE_VERIFICATION_OTP_SEND:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isMobileOTPSend: action.payload.isMobileOTPSend
      }
    case constants.CLEAR_MOBILE_VERIFICATION_OTP_SEND:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isMobileOTPSend: null
      }
    case constants.ADMIN_RESET_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isAdminReset: action.payload.isAdminReset
      }
    case constants.CLEAR_ADMIN_RESET_PASSWORD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isAdminReset: null
      }
    case constants.ADMIN_LOGOUT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isLoggedOut: action.payload.isLoggedOut
      }
    case constants.CLEAR_ADMIN_LOGOUT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isLoggedOut: null
      }
    case constants.CLEAR_CHANGE_PASSWORD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isPasswordChanged: null
      }
    case constants.CHANGE_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isPasswordChanged: action.payload.isPasswordChanged
      }
    case constants.CENTER_LOGIN:
      return {
        ...state,
        // token: action.payload.token,
        userData: action.payload.userData,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isAuthenticated: action.payload.isAuthenticated
      }
    case constants.CLEAR_CENTER_LOGIN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isAuthenticated: null
      }
    case constants.CLEAR_VIEW_ADMIN_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        profileData: null,
        allTestCompleted: null
      }
    case constants.VIEW_ADMIN_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        profileDataAdmin: action.payload.profileDataAdmin
      }
    case constants.CLEAR_UPDATE_ADMIN_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isProfileEditedAdmin: null
      }
    case constants.UPDATE_ADMIN_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isProfileEditedAdmin: action.payload.isProfileEditedAdmin
      }
    case constants.GET_ADMIN_DASHBOARD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        dashboardDataAdmin: action.payload.dashboardDataAdmin,
        loading: false
      }
    case constants.CLEAR_GET_ADMIN_DASHBOARD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        dashboardDataAdmin: null,
        loading: true
      }
    default:
      return state
  }
}
