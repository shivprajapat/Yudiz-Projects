import { CLEAR_WITHDRAW_MESSAGE, UPDATE_WITHDRAW_PAYMENT_STATUS, WITHDRAWAL_TOTAL_COUNT, WITHDRAW_LIST } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case WITHDRAW_LIST:
      return {
        ...state,
        withdrawList: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus,
        isFullResponse: action.payload.isFullResponse
      }
    case UPDATE_WITHDRAW_PAYMENT_STATUS:
      return commonReducer(state, action)
    case WITHDRAWAL_TOTAL_COUNT:
      return {
        ...state,
        withdrawalsTotalCount: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_WITHDRAW_MESSAGE:
      return {
        resMessage: '',
        isFullResponse: false
      }
    default:
      return state
  }
}
