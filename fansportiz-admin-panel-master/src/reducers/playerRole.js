import { CLEAR_PLAYER_ROLE_MESSAGE, PLAYER_ROLE_DETAILS, PLAYER_ROLE_LIST, UPDATE_PLAYER_ROLE_LIST } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case PLAYER_ROLE_LIST:
      return {
        ...state,
        playerRoleList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case 'BASEBALL_PLAYER_ROLE_LIST':
      return {
        ...state,
        baseballPlayerRoleList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case PLAYER_ROLE_DETAILS:
      return {
        ...state,
        playerRoleDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case 'BASEBALL_PLAYER_ROLE_DETAILS':
      return {
        ...state,
        baseballPlayerRoleDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_PLAYER_ROLE_LIST:
      return {
        ...state,
        playerRoleDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case 'UPDATE_BASEBALL_PLAYER_ROLE_LIST':
      return commonReducer(state, action)
    case CLEAR_PLAYER_ROLE_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
