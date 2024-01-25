import { CLEAR_CONNECT_WALLET, CLEAR_WALLET_ACCOUNT, CONNECT_WALLET, WALLET_ACCOUNT } from './action'

export const wallet = (state = {}, action = {}) => {
  switch (action.type) {
    case CONNECT_WALLET:
      return {
        ...state,
        connectWallet: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case WALLET_ACCOUNT:
      return {
        ...state,
        account: action.payload.account
      }

    case CLEAR_CONNECT_WALLET:
      return {
        ...state,
        connectWallet: '',
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_WALLET_ACCOUNT:
      return {
        ...state,
        account: ''
      }
    default:
      return state
  }
}
