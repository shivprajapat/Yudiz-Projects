import {
  MATCH_LIST,
  MATCH_DETAILS,
  MY_UPCOMING_MATCH_LIST,
  MY_LIVE_MATCH_LIST,
  MY_COMPLETED_MATCH_LIST,
  GET_HOME_BANNER,
  CLEAR_MATCH_MESSAGE,
  CLEAR_MATCH_LIST,
  GET_ACTIVE_SPORTS,
  GET_BANNER_STATICS
} from '../constants'

export default (state = { }, action) => {
  switch (action.type) {
    case MATCH_LIST:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        matchList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case MATCH_DETAILS:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        matchDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GET_ACTIVE_SPORTS:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        activeSports: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case MY_UPCOMING_MATCH_LIST:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        matchList: action.payload.data,
        // matchDetailList: action.payload.aMatches,
        resStatus: action.payload.resStatus
      }
    case MY_LIVE_MATCH_LIST:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        matchList: action.payload.data,
        // matchDetailList: action.payload.aMatches,
        resStatus: action.payload.resStatus
      }
    case MY_COMPLETED_MATCH_LIST:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        matchList: action.payload.data,
        // matchDetailList: action.payload.aMatches,
        resStatus: action.payload.resStatus
      }
    case GET_HOME_BANNER:
      return {
        ...state,
        bannerData: action.payload.bannerData,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case GET_BANNER_STATICS:
      return {
        ...state,
        bannerData: action.payload.bannerData,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_MATCH_LIST:
      return {
        ...state,
        matchList: null
      }
    case CLEAR_MATCH_MESSAGE:
      return {
        ...state,
        resMessage: '',
        matchDetails: null
      }
    default:
      return state
  }
}
