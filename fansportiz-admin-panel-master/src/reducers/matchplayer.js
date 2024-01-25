import { ADD_MATCH_PLAYER, CLEAR_MATCH_PLAYER_MESSAGE, DELETE_MATCH_PLAYER, FETCH_MATCH_PLAYER, FETCH_MATCH_PLAYER_11, FETCH_PLAYING_EIGHT, FETCH_PLAYING_SEVEN, GENERATE_CRICKET_SCORE_POINT, GENERATE_SCORE_POINT, GET_RANK_CALCULATE, GET_WIN_RETURN, LINEUPSOUT, MATCH_PLAYER_DETAILS, MATCH_PLAYER_LIST, MATCH_PLAYER_SCORE_POINT_LIST, SEASON_POINT, UPDATE_MATCH_PLAYER, UPDATE_MP_SCORE_POINT } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case MATCH_PLAYER_LIST:
      return {
        ...state,
        matchPlayerList: action.payload.data,
        isMatchAPIGenerated: action.payload.isMatchAPIGenerated,
        resStatus: action.payload.resStatus
      }
    case MATCH_PLAYER_SCORE_POINT_LIST:
      return {
        ...state,
        matchPlayerScorePointList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case DELETE_MATCH_PLAYER:
      return commonReducer(state, action)
    case FETCH_MATCH_PLAYER:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus,
        isMatchAPIGenerated: action.payload.isMatchAPIGenerated
      }
    case FETCH_MATCH_PLAYER_11:
      return commonReducer(state, action)
    case FETCH_PLAYING_SEVEN:
      return commonReducer(state, action)
    case FETCH_PLAYING_EIGHT:
      return commonReducer(state, action)
    case GENERATE_CRICKET_SCORE_POINT:
      return commonReducer(state, action)
    case GENERATE_SCORE_POINT:
      return commonReducer(state, action)
    case GET_RANK_CALCULATE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resFlag: action.payload.resFlag,
        type: action.payload.type
      }
    case GET_WIN_RETURN:
      return commonReducer(state, action)
    case LINEUPSOUT:
      return commonReducer(state, action)
    case MATCH_PLAYER_DETAILS:
      return {
        ...state,
        matchPlayerDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case UPDATE_MATCH_PLAYER:
      return commonReducer(state, action)
    case ADD_MATCH_PLAYER:
      return commonReducer(state, action)
    case UPDATE_MP_SCORE_POINT:
      return commonReducer(state, action)
    case SEASON_POINT:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_MATCH_PLAYER_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
