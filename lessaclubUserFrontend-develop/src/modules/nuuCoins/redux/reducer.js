import {
  GET_NUU_COINS_TRANSACTION_LIST,
  CLEAR_GET_NUU_COINS_TRANSACTION_LIST_RESPONSE,
  NUU_COINS_DETAILS,
  CLEAR_NUU_COINS_DETAILS_RESPONSE,
  NUU_COINS_PURCHASE_CREATE,
  CLEAR_NUU_COINS_PURCHASE_UPDATE_RESPONSE,
  NUU_COINS_PURCHASE,
  NUU_COINS_PURCHASE_UPDATE,
  CLEAR_NUU_COINS_PURCHASE,
  CLEAR_NUU_COINS_PURCHASE_CREATE_RESPONSE
} from './action'

export const nuuCoins = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_NUU_COINS_TRANSACTION_LIST:
      return {
        ...state,
        nuuCoinsTransactionList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_NUU_COINS_TRANSACTION_LIST_RESPONSE:
      return {
        ...state,
        nuuCoinsTransactionList: null,
        resStatus: false,
        resMessage: ''
      }
    case NUU_COINS_DETAILS:
      return {
        ...state,
        nuuCoinsDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case NUU_COINS_PURCHASE_CREATE:
      return {
        ...state,
        nuuCoinsPurchaseCreate: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        error: action.payload.error
      }
    case NUU_COINS_PURCHASE_UPDATE:
      return {
        ...state,
        nuuCoinsPurchaseUpdate: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case NUU_COINS_PURCHASE:
      return {
        ...state,
        nuuCoinsPurchaseCreateUsingCard: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_NUU_COINS_PURCHASE:
      return {
        ...state,
        nuuCoinsPurchaseCreateUsingCard: null,
        resStatus: false,
        resMessage: ''
      }

    case CLEAR_NUU_COINS_PURCHASE_UPDATE_RESPONSE:
      return {
        ...state,
        nuuCoinsPurchaseUpdate: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_NUU_COINS_DETAILS_RESPONSE:
      return {
        ...state,
        nuuCoinsDetails: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_NUU_COINS_PURCHASE_CREATE_RESPONSE:
      return {
        ...state,
        nuuCoinsPurchaseCreate: null,
        resStatus: false,
        resMessage: '',
        error: false
      }

    default:
      return state
  }
}
