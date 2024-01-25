import { CLEAR_SPORT_MESSAGE, SPORTS_LIST, SPORT_DETAILS, UPDATE_SPORT } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SPORTS_LIST:
      return {
        ...state,
        sportsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_SPORT:
      return commonReducer(state, action)
    case SPORT_DETAILS:
      return {
        ...state,
        sportDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_SPORT_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
