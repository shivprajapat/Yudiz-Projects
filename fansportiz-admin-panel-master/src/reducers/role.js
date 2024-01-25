import { ACTIVE_ROLE_LIST, ADD_ROLE, CLEAR_ROLE_MESSAGE, DELETE_ROLE, ROLE_DETAILS, ROLE_LIST, UPDATE_ROLE } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case ROLE_LIST:
      return {
        ...state,
        rolesList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ACTIVE_ROLE_LIST:
      return {
        activeRolesList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ROLE_DETAILS:
      return {
        ...state,
        roleDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_ROLE:
      return commonReducer(state, action)
    case UPDATE_ROLE:
      return {
        ...state,
        roleDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case DELETE_ROLE:
      return commonReducer(state, action)
    case CLEAR_ROLE_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
