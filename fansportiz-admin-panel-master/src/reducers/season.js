import { CLEAR_SEASON_MESSAGE, SEASON_DATA_EXPORT, SEASON_DETAILS, SEASON_LIST, UPDATE_SEASON, USERS_LIST_IN_SEASON } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SEASON_LIST:
      return {
        ...state,
        seasonList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SEASON_DETAILS:
      return {
        ...state,
        seasonDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case USERS_LIST_IN_SEASON:
      return {
        ...state,
        usersListInSeason: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SEASON_DATA_EXPORT:
      return {
        ...state,
        fullSeasonList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_SEASON:
      return commonReducer(state, action)
    case CLEAR_SEASON_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
