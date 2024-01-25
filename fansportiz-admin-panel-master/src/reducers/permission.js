import { ADD_PERMISSION_MATCH, CLEAR_PERMISSION_MESSAGE, PERMISSION_DETAILS, PERMISSION_LIST, PERMISSION_STATUS_LIST, UPDATE_PERMISSION } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case ADD_PERMISSION_MATCH:
      return commonReducer(state, action)
    case UPDATE_PERMISSION:
      return {
        ...state,
        permissionDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case PERMISSION_LIST:
      return {
        ...state,
        permissionList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case PERMISSION_STATUS_LIST:
      return {
        ...state,
        permissionStatusList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case PERMISSION_DETAILS:
      return {
        ...state,
        permissionDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_PERMISSION_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
