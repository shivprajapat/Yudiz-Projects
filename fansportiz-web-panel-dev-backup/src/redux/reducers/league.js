import {
  MATCH_LEAGUE_LIST,
  MATCH_LEAGUE_DETAILS,
  JOIN_LEAGUE,
  JOIN_LEAGUE_LIST,
  CLEAR_LEAGUE_MESSAGE,
  CLEAR_JOIN_LEAGUE_MESSAGE,
  CLEAR_JOIN_LEAGUE_LIST
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case MATCH_LEAGUE_LIST:
      return {
        ...state,
        matchLeagueList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case MATCH_LEAGUE_DETAILS:
      return {
        ...state,
        matchLeagueDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case JOIN_LEAGUE:
      return {
        ...state,
        joinedLeague: action.payload.joinedLeague,
        amountData: action.payload.data,
        MatchLeagueId: action.payload.MatchLeagueId,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resjoinMessage: action.payload.resMessage
      }
    case JOIN_LEAGUE_LIST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        joinedLeagueList: action.payload.joinedLeague
      }
    case CLEAR_JOIN_LEAGUE_LIST:
      return {
        ...state,
        joinedLeagueList: null
      }
    case CLEAR_LEAGUE_MESSAGE:
      return {
        ...state,
        resMessage: '',
        resStatus: null
      }
    case CLEAR_JOIN_LEAGUE_MESSAGE:
      return {
        ...state,
        joinedLeague: null,
        resjoinMessage: '',
        amountData: null,
        resMessage: null,
        resStatus: null
      }
    default:
      return state
  }
}
