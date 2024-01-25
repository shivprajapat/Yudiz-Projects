import axios from '../../../axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { CLEAR_CONNECT_WALLET, CONNECT_WALLET } from './action'

const errMsg = 'Server is unavailable.'
export const connectWallet = (payload, logOut) => (dispatch) => {
  dispatch({ type: CLEAR_CONNECT_WALLET })

  axios
    .post(apiPaths.connectWallet, payload)
    .then(({ data }) => {
      dispatch({ type: CONNECT_WALLET, payload: { data: data.result, resMessage: '', resStatus: true } })
      logOut && logOut()
    })
    .catch((error) => {
      dispatch({
        type: CONNECT_WALLET,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response ? error.response.data.message : errMsg,
          type: TOAST_TYPE.Error
        }
      })
    })
}

export const connectMetaMask = () => (dispatch) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (accounts) => {
      dispatch(connectWallet({ walletAddress: accounts[0], walletName: 'MetaMask' }))
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Wallet Connected',
          type: TOAST_TYPE.Success
        }
      })
    })
    window.ethereum.on('accountsChanged', (accounts) => {
      let message = 'Wallet Disconnected'
      let walletName = null
      let walletAddress = null
      if (accounts[0]) {
        message = 'Wallet Connected'
        walletName = 'MetaMask'
        walletAddress = accounts[0]
      }
      dispatch(connectWallet({ walletAddress, walletName }))
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message,
          type: TOAST_TYPE.Success
        }
      })
    })
  }
}
