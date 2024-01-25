import { ADD_SYSTEM_USER, CLEAR_SYSTEM_USERS_MESSAGE, GET_PROBABILITY, JOIN_BOT_IN_CONTEST, SYSTEM_USERS_TOTAL_COUNT, SYSTEM_USER_DETAILS, SYSTEM_USER_LIST } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SYSTEM_USER_LIST:
      return {
        ...state,
        systemUserList: action.payload.data,
        resStatus: action.payload.resStatus,
        isFullResponse: action.payload.isFullResponse
      }
    case SYSTEM_USER_DETAILS:
      return {
        ...state,
        systemUserDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_SYSTEM_USER:
      return commonReducer(state, action)
    case SYSTEM_USERS_TOTAL_COUNT:
      return {
        ...state,
        systemUsersTotalCount: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GET_PROBABILITY:
      return {
        ...state,
        probabilityForTeams: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case JOIN_BOT_IN_CONTEST:
      return {
        ...state,
        isTeamCreate: action.payload.isTeamCreate,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_SYSTEM_USERS_MESSAGE:
      return {
        resMessage: '',
        isFullResponse: false
      }
    default:
      return state
  }
}
