import {
  ADD_MATCH,
  CLEAR_MATCH_MESSAGE,
  FETCH_MATCH,
  GENERATE_PDF,
  LOAD_LIVE_LEADER_BOARD,
  MATCHES_TOTAL_COUNT,
  MATCH_DETAILS,
  MATCH_LIST,
  MATCH_DATA_REFRESH,
  MERGE_MATCH,
  POST_PREVIEW,
  PRIZE_DISTRIBUTION,
  UPCOMING_MATCH_LIST,
  UPDATE_MATCH,
  WIN_PRIZE_MATCH_DISTRIBUTION,
  SCORE_CARD,
  LIVE_INNINGS
} from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case MATCH_LIST:
      return {
        ...state,
        matchList: action.payload.data,
        resStatus: action.payload.resStatus,
        matchStatus: action.payload.status
      }
    case FETCH_MATCH:
      return commonReducer(state, action)
    case PRIZE_DISTRIBUTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        prizeFlag: action.payload.prizeFlag,
        type: action.payload.type
      }
    case WIN_PRIZE_MATCH_DISTRIBUTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        winFlag: action.payload.winFlag,
        type: action.payload.type
      }
    case ADD_MATCH:
      return {
        ...state,
        addedMatch: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case MATCH_DETAILS:
      return {
        ...state,
        matchDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case UPDATE_MATCH:
      return {
        ...state,
        matchDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case GENERATE_PDF:
      return commonReducer(state, action)
    case UPCOMING_MATCH_LIST:
      return {
        ...state,
        upcomingMatchList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case POST_PREVIEW:
      return {
        ...state,
        post: action.payload.data,
        resStatus: action.payload.resStatus

      }
    case MATCHES_TOTAL_COUNT:
      return {
        ...state,
        matchesTotalCount: action.payload.data,
        resStatus: action.payload.resStatus,
        matchStatus: action.payload.status
      }
    case LOAD_LIVE_LEADER_BOARD:
      return commonReducer(state, action)
    case MERGE_MATCH:
      return commonReducer(state, action)
    case MATCH_DATA_REFRESH:
      return commonReducer(state, action)
    case LIVE_INNINGS:
      return {
        ...state,
        liveInningsData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case SCORE_CARD:
      return {
        ...state,
        fullScoreCardData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_MATCH_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
