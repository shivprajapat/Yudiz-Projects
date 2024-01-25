import { CLEAR_PAYMENT_MESSAGE, PAYMENT_DETAILS, PAYMENT_LIST, UPDATE_PAYMENT } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case PAYMENT_LIST:
      return {
        ...state,
        paymentList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case PAYMENT_DETAILS:
      return {
        ...state,
        PaymentDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case UPDATE_PAYMENT:
      return commonReducer(state, action)
    case CLEAR_PAYMENT_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
