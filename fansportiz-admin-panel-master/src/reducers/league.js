import { DELETE_PRIZE_BREAKUP, CLEAR_DELETE_PRIZE_BREAKUP, ADD_LEAGUE, ADD_LEAGUE_PRIZE, ALL_LEAGUES, CLEAR_LEAGUE_MESSAGE, DELETE_LEAGUE, GAME_CATEGORY_LIST, LEAGUE_DETAILS, LEAGUE_LIST, LEAGUE_NAME_LIST, LEAGUE_PRIZE_DETAILS, LEAGUE_PRIZE_LIST, UPDATE_LEAGUE, UPDATE_LEAGUE_PRIZE, USER_LEAGUE_LIST, COPY_LEAGUE } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case LEAGUE_LIST:
      return {
        ...state,
        LeagueList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case USER_LEAGUE_LIST:
      return {
        ...state,
        userLeaguesList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case LEAGUE_PRIZE_LIST:
      return {
        ...state,
        LeaguePrizeList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case LEAGUE_NAME_LIST:
      return {
        ...state,
        LeagueNameList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ALL_LEAGUES:
      return {
        ...state,
        allLeagues: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case DELETE_LEAGUE:
      return commonReducer(state, action)
    case GAME_CATEGORY_LIST:
      return {
        ...state,
        GamecategoryList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_LEAGUE:
      return {
        ...state,
        addedLeague: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case ADD_LEAGUE_PRIZE:
      return commonReducer(state, action)
    case UPDATE_LEAGUE:
      return {
        ...state,
        LeagueDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case UPDATE_LEAGUE_PRIZE:
      return commonReducer(state, action)
    case LEAGUE_DETAILS:
      return {
        ...state,
        LeagueDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case LEAGUE_PRIZE_DETAILS:
      return {
        ...state,
        LeaguePriceDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_LEAGUE_MESSAGE:
      return {
        resMessage: ''
      }
    case DELETE_PRIZE_BREAKUP:
      return {
        ...state,
        isDeletedPrizeBreakup: action.payload.isDeletedPrizeBreakup,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case COPY_LEAGUE:
      return {
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_DELETE_PRIZE_BREAKUP:
      return {
        isDeletedPrizeBreakup: null
      }
    default:
      return state
  }
}
