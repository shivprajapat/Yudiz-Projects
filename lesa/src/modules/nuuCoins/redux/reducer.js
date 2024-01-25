import {
  INTERNAL_WALLET_NUU_COINS,
  CLEAR_INTERNAL_WALLET_NUU_COINS_RESPONSE,
  NUU_COINS_DETAILS,
  CLEAR_NUU_COINS_DETAILS_RESPONSE
} from './action'

export const nuuCoins = (state = {}, action = {}) => {
  switch (action.type) {
    case INTERNAL_WALLET_NUU_COINS:
      return {
        ...state,
        internalWallet: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_INTERNAL_WALLET_NUU_COINS_RESPONSE:
      return {
        ...state,
        internalWallet: null,
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
    case CLEAR_NUU_COINS_DETAILS_RESPONSE:
      return {
        ...state,
        nuuCoinsDetails: null,
        resStatus: false,
        resMessage: ''
      }

    default:
      return state
  }
}
