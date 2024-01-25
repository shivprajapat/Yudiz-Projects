import { CLEAR_PAYOUT_MESSAGE, PAYOUT_DETAILS, PAYOUT_LIST, UPDATE_PAYOUT } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case PAYOUT_LIST:
      return {
        ...state,
        payoutList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case PAYOUT_DETAILS:
      return {
        ...state,
        payoutDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case UPDATE_PAYOUT:
      return commonReducer(state, action)
    case CLEAR_PAYOUT_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
