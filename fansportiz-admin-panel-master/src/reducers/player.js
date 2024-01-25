import { ADD_PLAYER, CLEAR_PLAYER_MESSAGE, PLAYERS_LIST, PLAYERS_TOTAL_COUNT, PLAYER_DETAILS, UPDATE_PLAYER } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case PLAYERS_LIST:
      return {
        ...state,
        playersList: action.payload.data,
        resStatus: action.payload.resStatus,
        isSearch: action.payload.isSearch
      }
    case 'BASEBALL_PLAYER_LIST':
      return {
        ...state,
        baseballPlayerList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_PLAYER:
      return commonReducer(state, action)
    case 'ADD_BASEBALL_PLAYER':
      return commonReducer(state, action)
    case PLAYER_DETAILS:
      return {
        ...state,
        playerDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case 'BASEBALL_PLAYER_DETAILS':
      return {
        ...state,
        baseballplayerDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_PLAYER:
      return {
        ...state,
        playerDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case PLAYERS_TOTAL_COUNT:
      return {
        ...state,
        playersTotalCount: action.payload.data,
        resStatus: action.payload.data
      }
    case 'CRICKET_BASEBALL_PLAYER':
      return commonReducer(state, action)
    case CLEAR_PLAYER_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
