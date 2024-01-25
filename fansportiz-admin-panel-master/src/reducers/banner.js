import { ADD_BANNER, BANNER_DETAILS, BANNER_LIST, BANNER_STATISTICS, CLEAR_BANNER_MESSAGE, CLEAR_BANNER_PROPS, DELETE_BANNER, UPDATE_BANNER } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case ADD_BANNER:
      return commonReducer(state, action)
    case BANNER_LIST:
      return {
        ...state,
        bannerList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case BANNER_DETAILS:
      return {
        ...state,
        bannerDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case UPDATE_BANNER:
      return commonReducer(state, action)
    case DELETE_BANNER:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case BANNER_STATISTICS:
      return {
        bannerStatisticsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_BANNER_MESSAGE:
      return {
        resMessage: ''
      }
    case CLEAR_BANNER_PROPS:
      return {
        bannerList: {},
        bannerDetails: {},
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
