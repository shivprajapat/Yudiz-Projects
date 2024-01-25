import {
  VERSION_LIST,
  VERSION_DETAILS,
  CLEAR_VERSION_MESSAGE,
  UPDATE_VERSION,
  ADD_VERSION,
  GET_MAINTENANCE_MODE,
  UPDATE_MAINTENANCE_MODE,
  DELETE_VERSION
} from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case VERSION_LIST:
      return {
        ...state,
        versionList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case VERSION_DETAILS:
      return {
        ...state,
        versionDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_VERSION:
      return commonReducer(state, action)
    case UPDATE_VERSION:
      return commonReducer(state, action)
    case GET_MAINTENANCE_MODE:
      return {
        maintenanceMode: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_MAINTENANCE_MODE:
      return {
        mResMessage: action.payload.resMessage,
        mResStatus: action.payload.resStatus
      }
    case DELETE_VERSION:
      return commonReducer(state, action)
    case CLEAR_VERSION_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
