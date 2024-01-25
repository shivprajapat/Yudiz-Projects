import {
  TRANSACTION_LIST,
  CLEAR_TRANSACTION_LIST,
  CLEAR_TRANSACTION_MESSAGE,
  CANCEL_WITHDRAW,
  PENDING_DEPOSITS,
  CLEAR_PENDING_DEPOSIT_LIST
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case TRANSACTION_LIST:
      return {
        ...state,
        transactionList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CANCEL_WITHDRAW:
      return {
        ...state,
        cancelWithdraw: action.payload.cancelWithdraw,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case PENDING_DEPOSITS:
      return {
        ...state,
        pendingDeposits: action.payload.pendingDeposits,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_PENDING_DEPOSIT_LIST:
      return {
        ...state,
        pendingDeposits: null
      }
    case CLEAR_TRANSACTION_LIST:
      return {
        ...state,
        cancelWithdraw: null,
        transactionList: null
      }
    case CLEAR_TRANSACTION_MESSAGE:
      return {
        ...state,
        resMessage: ''
      }
    default:
      return state
  }
}
