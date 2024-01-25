import { CLEAR_AUTH_RESPONSE, LOGIN, TOKEN_LOGIN, LOGOUT, SEND_OTP, RESET_PASSWORD, CLEAR_MESSAGE, CLEAR_AUTH_PROPS, ERROR_MSG, CLEAR_ERROR_MSG } from '../actions/constants'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        adminData: action.payload.data,
        adminPermission: action.payload.permission,
        token: action.payload.token,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case TOKEN_LOGIN:
      return {
        ...state,
        token: action.payload.token,
        adminData: action.payload.adminData,
        adminPermission: action.payload.permission
      }
    case ERROR_MSG:
      return {
        error: action.payload.error
      }
    case CLEAR_ERROR_MSG:
      return {
        error: ''
      }
    case LOGOUT:
      return {
        token: undefined
      }
    case SEND_OTP:
      return {
        sendotpStatus: action.payload.resStatus,
        sendotpMessage: action.payload.resMessage
      }
    case RESET_PASSWORD:
      return {
        resetpwdStatus: action.payload.resStatus,
        resetpwdMessage: action.payload.resMessage
      }
    case CLEAR_MESSAGE:
      return {
        sendotpMessage: '',
        resetpwdMessage: ''
      }
    case CLEAR_AUTH_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_AUTH_PROPS:
      return {
        adminData: {},
        resStatus: false,
        resMessage: '',
        sendotpStatus: false,
        sendotpMessage: '',
        resetpwdStatus: false,
        resetpwdMessage: ''
      }
    default:
      return state
  }
}
