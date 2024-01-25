import {
  ALL_LEADERBOARD_LIST,
  MY_TEAMS_LEADERBOARD_LIST,
  CLEAR_ALL_LEADERBOARD_LIST,
  CLEAR_MY_TEAMS_LEADERBOARD_MESSAGE,
  CLEAR_LEADERBOARD_MESSAGE,
  SERIES_LEADERBOARD_LIST,
  GET_SERIES_CATEGORY,
  LEADERSHIP_BOARD_LIST,
  GET_LEADERBOARD_ALL_RANK,
  GET_LEADERBOARD_MY_RANK,
  GET_LEADERBOARD_CATEGORY_DETAILS,
  CLEAR_GET_SERIES_CATEGORY,
  CLEAR_SERIES_LEADERBOARD_LIST
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case ALL_LEADERBOARD_LIST:
      return {
        ...state,
        allLeaderBoardList: action.payload.data,
        bCached: action.payload.bCached,
        bFullResponse: action.payload.bFullResponse,
        nPutTime: action.payload.nPutTime,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case LEADERSHIP_BOARD_LIST:
      return {
        ...state,
        leadershipBoard: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_LEADERBOARD_MY_RANK:
      return {
        ...state,
        leaderboardMyRank: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_LEADERBOARD_CATEGORY_DETAILS:
      return {
        ...state,
        leaderboardCategoryDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_LEADERBOARD_ALL_RANK:
      return {
        ...state,
        leaderboardAllRank: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case SERIES_LEADERBOARD_LIST:
      return {
        ...state,
        seriesList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_SERIES_LEADERBOARD_LIST:
      return {
        ...state,
        seriesList: null
      }
    case GET_SERIES_CATEGORY:
      return {
        ...state,
        getCategoryList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_SERIES_CATEGORY:
      return {
        ...state,
        getCategoryList: null
      }
    case MY_TEAMS_LEADERBOARD_LIST:
      return {
        ...state,
        myTeamsLeaderBoardList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_ALL_LEADERBOARD_LIST:
      return {
        ...state,
        allLeaderBoardList: null,
        bFullResponse: null,
        nPutTime: null
      }
    case CLEAR_MY_TEAMS_LEADERBOARD_MESSAGE:
      return {
        ...state,
        myTeamsLeaderBoardList: []
      }
    case CLEAR_LEADERBOARD_MESSAGE:
      return {
        ...state,
        resMessage: '',
        resStatus: null
      }
    default:
      return state
  }
}
