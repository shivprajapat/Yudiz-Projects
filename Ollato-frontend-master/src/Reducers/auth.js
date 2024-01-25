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
  isVerified: null,
  token: null,
  isReset: null,
  authToken: null,
  isEmailVerified: null,
  isOtpVerified: null,
  gradesData: null,
  countriesData: null,
  statesData: null,
  districtData: null,
  studentData: null,
  isRegistered: null,
  isEmailAddressVerified: null,
  isOTPSignupVerified: null,
  isMobileOTPVerification: null,
  isMobileOTPSend: null,
  isLoggedOut: null,
  questionsArray: null,
  dataArray: null,
  profileData: null,
  isPasswordChanged: null,
  boardsDataArray: null,
  allTestCompleted: null,
  remainingTestIdS: null,
  isLoading: null,
  schoolDataArray: null,
  isProfileEdited: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        userData: action.payload.userData,
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
        isForgotOTPSend: action.payload.isForgotOTPSend,
        token: action.payload.token
      }
    case constants.CLEAR_FORGET_PASSWORD_VERIFY_EMAIL:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isForgotOTPSend: null,
        token: null
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
    case constants.VERIFY_FORGOT_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isVerified: action.payload.isVerified
      }
    case constants.CLEAR_VERIFY_FORGOT_PASSWORD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isVerified: null
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
    case constants.GET_ALL_GRADES:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        gradesData: action.payload.gradesData
      }
    case constants.CLEAR_GET_ALL_GRADES:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        gradesData: null
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
    case constants.CLEAR_GET_ALL_SCHOOLS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        schoolDataArray: null
      }
    case constants.GET_ALL_SCHOOLS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        schoolDataArray: action.payload.schoolDataArray
      }
    case constants.SIGNUP_STUDENT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        studentData: action.payload.studentData,
        isRegistered: action.payload.isRegistered
      }
    case constants.CLEAR_SIGNUP_STUDENT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        studentData: null,
        isRegistered: null
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
    case constants.LOGOUT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isLoggedOut: action.payload.isLoggedOut
      }
    case constants.CLEAR_GET_ALL_QUESTIONS_BY_ID:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        questionsArray: null,
        alredyGiven: null,
        remainingTestIdS: null,
        isLoading: true
      }
    case constants.GET_ALL_QUESTIONS_BY_ID:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        questionsArray: action.payload.questionsArray,
        alredyGiven: action.payload.alredyGiven,
        isLoading: action.payload.isLoading
      }
    case constants.CLEAR_LOGOUT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isLoggedOut: null
      }
    case constants.CLEAR_SUBMIT_OPTION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isAnswerAdded: null
      }
    case constants.SUBMIT_OPTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isAnswerAdded: action.payload.isAnswerAdded
      }
    case constants.CLEAR_QUESTIONS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        dataArray: null,
        alredyGiven: null
      }
    case constants.QUESTIONS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        dataArray: action.payload.dataArray,
        alredyGiven: action.payload.alredyGiven
      }
    case constants.CLEAR_FINISH_TEST:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isTestCompleted: null,
        remainingTestIdS: null,
        isLoading: true
      }
    case constants.FINISH_TEST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isTestCompleted: action.payload.isTestCompleted,
        allTestCompleted: action.payload.allTestCompleted,
        remainingTestIdS: action.payload.remainingTestIdS,
        isLoading: action.payload.isLoading
      }
    case constants.CLEAR_VIEW_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        profileData: null,
        allTestCompleted: null
      }
    case constants.VIEW_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        profileData: action.payload.profileData
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
    case constants.CLEAR_GET_ALL_BOARDS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        boardsDataArray: null
      }
    case constants.GET_ALL_BOARDS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        boardsDataArray: action.payload.boardsDataArray
      }
    case constants.CLEAR_GET_ALL_SCHOOL_DETAILS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        schoolDataArray: null
      }
    case constants.GET_ALL_SCHOOL_DETAILS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        schoolDataArray: action.payload.schoolDataArray
      }
    case constants.CLEAR_UPDATE_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isProfileEdited: null
      }
    case constants.UPDATE_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isProfileEdited: action.payload.isProfileEdited
      }
    default:
      return state
  }
}
