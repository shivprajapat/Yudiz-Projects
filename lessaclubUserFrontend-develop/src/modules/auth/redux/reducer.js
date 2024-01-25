import { CLEAR_AUTH_RESPONSE, FORGOT_PASSWORD, FORGOT_PASSWORD_EMAIL, LOGIN, SET_PASSWORD, SIGNUP } from './action'

export const auth = (state = {}, action = {}) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case SIGNUP:
      return {
        ...state,
        signup: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case SET_PASSWORD:
      return {
        ...state,
        setPassword: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case FORGOT_PASSWORD:
      return {
        ...state,
        forgotPassword: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case FORGOT_PASSWORD_EMAIL:
      return {
        ...state,
        forgotPasswordEmail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_AUTH_RESPONSE:
      return {
        token: null,
        userId: null,
        signup: null,
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
