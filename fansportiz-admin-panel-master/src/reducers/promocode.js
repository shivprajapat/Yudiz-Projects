import { ADD_PROMOCODE, CLEAR_PROMOCODE_MESSAGE, DELETE_PROMOCODE, PROMOCODE_DETAILS, PROMOCODE_LIST, PROMOCODE_STATISTICS_LIST, UPDATE_PROMOCODE } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case PROMOCODE_LIST:
      return {
        ...state,
        promocodeList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_PROMOCODE:
      return commonReducer(state, action)
    case UPDATE_PROMOCODE:
      return commonReducer(state, action)
    case DELETE_PROMOCODE:
      return commonReducer(state, action)
    case PROMOCODE_DETAILS:
      return {
        ...state,
        promocodeDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case PROMOCODE_STATISTICS_LIST:
      return {
        ...state,
        promocodeStatisticsDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_PROMOCODE_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
