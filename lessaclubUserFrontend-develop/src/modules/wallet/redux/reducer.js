import { CLEAR_CONNECT_WALLET, CLEAR_WALLET_ACCOUNT, CONNECT_WALLET, WALLET_ACCOUNT } from './action'

export const wallet = (state = {}, action = {}) => {
  switch (action.type) {
    case CONNECT_WALLET:
      return {
        ...state,
        connectWallet: action.payload.data,
        account: action.payload.data?.users?.publicAddress,
        walletName: action.payload.data?.users?.walletType,
        networkId: state.networkId,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case WALLET_ACCOUNT:
      return {
        ...state,
        account: action.payload.account,
        walletName: action.payload.walletName,
        networkId: action.payload.networkId
      }

    case CLEAR_CONNECT_WALLET:
      return {
        ...state,
        connectWallet: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_WALLET_ACCOUNT:
      return {
        ...state,
        account: null,
        walletName: null,
        networkId: null
      }
    default:
      return state
  }
}
