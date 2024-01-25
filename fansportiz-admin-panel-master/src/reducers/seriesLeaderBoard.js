import { ADD_SERIES_LEADERBOARD, ADD_SERIES_LEADERBOARD_CATEGORY, ADD_SERIES_LEDAERBOARD_PRICEBREAKUP, CLEAR_SERIESLEADERBOARD_MESSAGE, DELETE_SERIES, DELETE_SERIES_CATEGORY, DELETE_SERIES_PRIZEBREAKUP, LB_SERIES_LIST, PRIZE_CALCULATE, RANK_CALCULATE, SERIES_COUNT, SERIES_LB_CATEGORIES_TEMPLATE_LIST, SERIES_LB_CATEGORY_LIST, SERIES_LB_CATEGORY_TEMP_ID, SERIES_LEADERBOARD_CATEGORY_DETAILS, SERIES_LEADERBOARD_DETAILS, SERIES_LEADERBOARD_PRIZEBREAKUP, SERIES_LEADERBOARD_PRIZEBREAKUP_DETAILS, SERIES_LEADER_BOARD_USER_RANK, SERIES_NAME_LIST, UPDATE_SERIES_LEADERBOARD, UPDATE_SERIES_LEADERBOARD_CATEGORY, UPDATE_SERIES_LEDAERBOARD_PRICEBREAKUP, WIN_PRIZE_SERIES_DISTRIBUTION } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SERIES_LB_CATEGORIES_TEMPLATE_LIST:
      return {
        ...state,
        categoryTemplateList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SERIES_LB_CATEGORY_TEMP_ID:
      return {
        ...state,
        categoryTemplateIDList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SERIES_LB_CATEGORY_LIST:
      return {
        ...state,
        seriesLBCategoryList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case LB_SERIES_LIST:
      return {
        ...state,
        leaderboardSeriesList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SERIES_NAME_LIST:
      return {
        ...state,
        seriesNameList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SERIES_LEADERBOARD_DETAILS:
      return {
        ...state,
        seriesLeaderBoardDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SERIES_LEADERBOARD_CATEGORY_DETAILS:
      return {
        ...state,
        seriesLeaderBoardCategoryDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_SERIES_LEADERBOARD:
      return commonReducer(state, action)
    case ADD_SERIES_LEADERBOARD_CATEGORY:
      return commonReducer(state, action)
    case UPDATE_SERIES_LEADERBOARD_CATEGORY:
      return commonReducer(state, action)
    case DELETE_SERIES_CATEGORY:
      return commonReducer(state, action)
    case UPDATE_SERIES_LEADERBOARD:
      return {
        ...state,
        seriesLeaderBoardDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case SERIES_LEADERBOARD_PRIZEBREAKUP:
      return {
        ...state,
        seriesLBPrizeBreakUpList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SERIES_LEADERBOARD_PRIZEBREAKUP_DETAILS:
      return {
        ...state,
        seriesLeaderBoardPrizeBreakupDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_SERIES_LEDAERBOARD_PRICEBREAKUP:
      return commonReducer(state, action)
    case UPDATE_SERIES_LEDAERBOARD_PRICEBREAKUP:
      return {
        ...state,
        seriesLeaderBoardPrizeBreakupDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case RANK_CALCULATE:
      return commonReducer(state, action)
    case PRIZE_CALCULATE:
      return commonReducer(state, action)
    case WIN_PRIZE_SERIES_DISTRIBUTION:
      return commonReducer(state, action)
    case SERIES_LEADER_BOARD_USER_RANK:
      return {
        ...state,
        seriesLeaderBoardUserRankList: action.payload.data,
        isFullResponse: action.payload.isFullResponse,
        resStatus: action.payload.resStatus
      }
    case DELETE_SERIES:
      return commonReducer(state, action)
    case DELETE_SERIES_PRIZEBREAKUP:
      return commonReducer(state, action)
    case CLEAR_SERIESLEADERBOARD_MESSAGE:
      return {
        resMessage: ''
      }
    case SERIES_COUNT:
      return {
        ...state,
        seriesCount: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    default:
      return state
  }
}
