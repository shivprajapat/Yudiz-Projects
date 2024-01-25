import { ADD_SUB_ADMIN, ADMIN_IDS, ADMIN_LOGS, CLEAR_SUB_ADMIN_MESSAGE, LEAGUE_LOGS, MATCH_API_DETAILS, MATCH_API_LOGS, MATCH_LOGS, SINGLE_ADMIN_LOGS, SUB_ADMIN_DETAILS, SUB_ADMIN_LIST, UPDATE_SUB_ADMIN } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case ADD_SUB_ADMIN:
      return commonReducer(state, action)
    case UPDATE_SUB_ADMIN:
      return commonReducer(state, action)
    case SUB_ADMIN_LIST:
      return {
        ...state,
        subadminList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SUB_ADMIN_DETAILS:
      return {
        ...state,
        subadminDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADMIN_LOGS:
      return {
        ...state,
        adminLogsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SINGLE_ADMIN_LOGS:
      return {
        ...state,
        singleAdminLog: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADMIN_IDS:
      return {
        ...state,
        adminsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case MATCH_LOGS:
      return {
        ...state,
        matchLogs: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case LEAGUE_LOGS:
      return {
        ...state,
        leagueLogs: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case MATCH_API_LOGS:
      return {
        ...state,
        matchAPILogs: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case MATCH_API_DETAILS:
      return {
        ...state,
        matchAPIDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_SUB_ADMIN_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
