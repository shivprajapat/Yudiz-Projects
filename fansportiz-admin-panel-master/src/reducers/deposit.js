import { CLEAR_DEPOSIT_MESSAGE, DEPOSIT_LIST, DEPOSIT_TOTAL_COUNT, UPDATE_DEPOSIT_PAYMENT_STATUS } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case DEPOSIT_LIST:
      return {
        ...state,
        depositList: action.payload.data,
        resStatus: action.payload.resStatus,
        isFullResponse: action.payload.isFullResponse
      }
    case UPDATE_DEPOSIT_PAYMENT_STATUS:
      return commonReducer(state, action)
    case DEPOSIT_TOTAL_COUNT:
      return {
        ...state,
        depositsTotalCount: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_DEPOSIT_MESSAGE:
      return {
        resMessage: '',
        isFullResponse: false
      }
    default:
      return state
  }
}
