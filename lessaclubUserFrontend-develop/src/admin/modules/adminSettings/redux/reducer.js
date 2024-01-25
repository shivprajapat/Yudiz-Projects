import {
  CLEAR_ADMIN_COMMISSION_SETTINGS,
  CLEAR_CREATE_ADMIN_GENERAL_SETTINGS_RESPONSE,
  CLEAR_GET_ADMIN_GENERAL_SETTINGS_RESPONSE,
  CLEAR_UPDATE_ADMIN_GENERAL_SETTINGS,
  CREATE_ADMIN_COMMISSION_SETTINGS,
  CREATE_ADMIN_GENERAL_SETTINGS,
  GET_ADMIN_COMMISSION_SETTINGS,
  GET_ADMIN_GENERAL_SETTINGS,
  UPDATE_ADMIN_COMMISSION_SETTINGS,
  UPDATE_ADMIN_GENERAL_SETTINGS
} from './action'

export const adminSettings = (state = {}, action = {}) => {
  switch (action.type) {
    case UPDATE_ADMIN_GENERAL_SETTINGS:
      return {
        ...state,
        adminGeneralSettings: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resError: action.payload.resError
      }
    case CLEAR_UPDATE_ADMIN_GENERAL_SETTINGS:
      return {
        ...state,
        adminGeneralSettings: {},
        resStatus: '',
        resMessage: ''
      }
    case GET_ADMIN_GENERAL_SETTINGS:
      return {
        ...state,
        singleAdminGeneralSettings: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_ADMIN_GENERAL_SETTINGS_RESPONSE:
      return {
        ...state,
        singleAdminGeneralSettings: {},
        resStatus: '',
        resMessage: ''
      }
    case CREATE_ADMIN_GENERAL_SETTINGS:
      return {
        ...state,
        singleAdminGeneralSettings: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_CREATE_ADMIN_GENERAL_SETTINGS_RESPONSE:
      return {
        ...state,
        singleAdminGeneralSettings: {},
        resStatus: '',
        resMessage: ''
      }
    case GET_ADMIN_COMMISSION_SETTINGS:
      return {
        ...state,
        adminCommissionSettings: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_ADMIN_COMMISSION_SETTINGS:
      return {
        ...state,
        adminCommissionSettings: {},
        resStatus: '',
        resMessage: ''
      }
    case UPDATE_ADMIN_COMMISSION_SETTINGS:
      return {
        ...state,
        adminCommissionSettings: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CREATE_ADMIN_COMMISSION_SETTINGS:
      return {
        ...state,
        adminCommissionSettings: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    default:
      return state
  }
}
