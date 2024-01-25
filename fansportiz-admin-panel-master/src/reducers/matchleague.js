import { ADD_MATCH_LEAGUE, ADD_SYSTEM_TEAMS, BANNER_MATCH_LEAGUE_LIST, BOT_COUNT_MATCH_LEAGUE, BOT_DETAILS_MATCH_CONTEST, CANCEL_MATCH_LEAGUE, CLEAR_MATCH_LEAGUE_MESSAGE, LEAGUE_COUNT, MATCH_LEAGUE_DETAILS, MATCH_LEAGUE_LIST, MATCH_LEAGUE_REPORT, NORMAL_BOT_TEAMS, POINT_CALCULATE, PROMO_USAGE_LIST, UPDATE_BOT_STATUS, USERS_CASHBACK_LIST, USER_LEAGUE_LIST, USER_TEAM_LIST, USER_TEAM_PLAYER_LIST } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case MATCH_LEAGUE_LIST:
      return {
        ...state,
        matchLeagueList: action.payload.data,
        resStatus: action.payload.resStatus,
        isFullResponse: action.payload.isFullResponse
      }
    case USER_LEAGUE_LIST:
      return {
        ...state,
        userLeagueList: action.payload.data,
        resStatus: action.payload.resStatus,
        isFullResponse: action.payload.isFullResponse
      }
    case USER_TEAM_LIST:
      return {
        ...state,
        userTeamList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case USER_TEAM_PLAYER_LIST:
      return {
        ...state,
        userTeamPlayerList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_MATCH_LEAGUE:
      return commonReducer(state, action)
    case ADD_SYSTEM_TEAMS:
      return commonReducer(state, action)
    case CANCEL_MATCH_LEAGUE:
      return commonReducer(state, action)
    case NORMAL_BOT_TEAMS:
      return commonReducer(state, action)
    case BANNER_MATCH_LEAGUE_LIST:
      return {
        ...state,
        bannerMatchLeagueList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case USERS_CASHBACK_LIST:
      return {
        ...state,
        usersCashbackList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case MATCH_LEAGUE_DETAILS:
      return {
        ...state,
        matchLeagueDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_BOT_STATUS:
      return commonReducer(state, action)
    case LEAGUE_COUNT:
      return {
        ...state,
        leagueCount: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case POINT_CALCULATE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resFlag: action.payload.resFlag,
        type: action.payload.type
      }
    case BOT_COUNT_MATCH_LEAGUE:
      return {
        ...state,
        botCountInMatchLeague: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case BOT_DETAILS_MATCH_CONTEST:
      return {
        ...state,
        systemBotDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case MATCH_LEAGUE_REPORT:
      return {
        ...state,
        matchLeagueReport: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case PROMO_USAGE_LIST:
      return {
        ...state,
        promoUsageList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_MATCH_LEAGUE_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
