import {
  SEND_OTP,
  VERIFY_OTP,
  FORGOT_PASSWORD,
  REGISTER_USER,
  CHECK_EXIST,
  VALIDATE_TOKEN,
  TOKEN_LOGIN,
  LOGIN_USER,
  LOGOUT,
  CLEAR_MESSAGE_TYPE,
  CLEAR_AUTH_MESSAGE,
  CLEAR_VERIFY_OTP_MESSAGE,
  CLEAR_CHECKED_MESSAGE,
  CLEAR_SEND_OTP_MESSAGE,
  GOOGLE_LOGIN_USER,
  FIREBASE_TOKEN,
  DELETE_ACCOUNT,
  DELETE_ACCOUNT_REASONS
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case SEND_OTP:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        sendOtp: action.payload.sendOtp
      }
    case FIREBASE_TOKEN:
      return {
        ...state,
        FirebaseToken: action.payload.FirebaseToken
      }
    case VERIFY_OTP:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        otpVerified: action.payload.otpVerified
      }
    case REGISTER_USER:
      return {
        ...state,
        loginUser: action.payload.loginUser,
        loginPass: action.payload.loginPass,
        userData: action.payload.data,
        token: action.payload.token,
        registerSuccess: action.payload.registerSuccess,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        messageType: action.payload.messageType
      }
    case FORGOT_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CHECK_EXIST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        messageType: action.payload.messageType,
        isChecked: action.payload.isChecked
      }
    case LOGIN_USER:
      return {
        ...state,
        loginUser: action.payload.loginUser,
        loginPass: action.payload.loginPass,
        userData: action.payload.data,
        token: action.payload.token,
        nOtpSend: action.payload.nOtpSend,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case DELETE_ACCOUNT:
      return {
        ...state,
        token: undefined,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case DELETE_ACCOUNT_REASONS:
      return {
        ...state,
        deleteAccountReasons: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GOOGLE_LOGIN_USER:
      return {
        ...state,
        userData: action.payload.data,
        token: action.payload.token,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        socialRegisterData: action.payload.socialRegisterData
      }
    case TOKEN_LOGIN:
      return {
        ...state,
        token: action.payload.token,
        userData: action.payload.userData,
        resAuthMessage: action.payload.resAuthMessage
      }
    case VALIDATE_TOKEN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        verifiedToken: action.payload.tokenVerified
      }
    case LOGOUT:
      return {
        ...state,
        token: undefined
      }
    case CLEAR_AUTH_MESSAGE:
      return {
        ...state,
        resMessage: '',
        nOtpSend: null
      }
    case CLEAR_SEND_OTP_MESSAGE:
      return {
        ...state,
        sendOtp: null
      }
    case CLEAR_VERIFY_OTP_MESSAGE:
      return {
        ...state,
        otpVerified: null
      }
    case CLEAR_CHECKED_MESSAGE:
      return {
        ...state,
        isChecked: null
      }
    case CLEAR_MESSAGE_TYPE:
      return {
        ...state,
        messageType: ''
      }
    default:
      return state
  }
}
