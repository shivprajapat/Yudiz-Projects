import {
  GET_PLAYER_SCORE_POINT,
  GET_PLAYER_SEASON_NAME,
  CLEAR_SEASON_NAME,
  CLEAR_SCORE_POINT,
  GET_LIST_MATCH_PLAYER,
  CLEAR_PLAYER_MESSAGE,
  GET_UNIQUE_PLAYER,
  GET_UNIQUE_PLAYER_LEAGUE
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_PLAYER_SCORE_POINT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        pointBreakUp: action.payload.data.aPointBreakup,
        nScoredPoints: action.payload.data.nScoredPoints
      }
    case GET_PLAYER_SEASON_NAME:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        playerData: action.payload.data.player,
        seasonMatch: action.payload.data.match
      }
    case CLEAR_SEASON_NAME:
      return {
        ...state,
        playerData: null,
        seasonMatch: null
      }
    case CLEAR_SCORE_POINT:
      return {
        ...state,
        pointBreakUp: null,
        nScoredPoints: null
      }
    case GET_LIST_MATCH_PLAYER:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        matchPlayerList: action.payload.data,
        matchPlayerMatchId: action.payload.matchPlayerMatchId,
        matchPlayer: action.payload.data.matchPlayer
      }
    case GET_UNIQUE_PLAYER:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        uniquePlayerList: action.payload.data
      }
    case GET_UNIQUE_PLAYER_LEAGUE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        uniquePlayerLeagueList: action.payload.data
      }
    case CLEAR_PLAYER_MESSAGE:
      return {
        ...state,
        resMessage: ''
      }
    default:
      return state
  }
}
