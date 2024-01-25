import Web3 from 'web3'

import { SHOW_TOAST } from 'modules/toast/redux/action'
import { CLEAR_WALLET_ACCOUNT } from 'modules/wallet/redux/action'
import { disconnect } from 'modules/walletConnect'
import { TOAST_TYPE } from 'shared/constants'
import { CHAIN_ID, CHAIN_NAME } from './constants'

const isWalletAddressValid = ({ walletAccountStore, address }) => {
  const web3 = new Web3(process.env.REACT_APP_WEB3_PROVIDER)
  return web3.utils.isAddress(address)
}

const getGasPrice = async ({ web3 }) => {
  document.body.classList.add('global-loader')
  const gasPrice = await web3.eth.getGasPrice()
  document.body.classList.remove('global-loader')
  return web3.utils.toBN(gasPrice).add(web3.utils.toBN('20000000000'))
}

const toWei = ({ web3, amount, decimals = 14 }) => {
  return web3.utils.toWei(parseFloat(amount).toFixed(decimals).toString(), 'ether')
}

const checkSufficientBalance = async ({ web3, connectedAccount, amount, dispatch, setLoading }) => {
  document.body.classList.add('global-loader')
  const walletBalance = await web3.eth.getBalance(connectedAccount)
  document.body.classList.remove('global-loader')

  if (parseInt(walletBalance) < parseInt(amount)) {
    dispatch({
      type: SHOW_TOAST,
      payload: {
        message: "Oops! You don't have sufficient balance to purchase this product. Please topup your wallet with cryto curency. Thank you.",
        type: TOAST_TYPE.Error
      }
    })
    setLoading(false)
    return false
  }
  return true
}

const handleError = ({ dispatch, setLoading, error, anotherError }) => {
  document.body.classList.remove('global-loader')
  setLoading(false)
  // console.log(error)
  // if (error?.message.includes('Not owner of the token') || error?.message.includes('operator query for nonexistent token')) {
  //   error.message = 'Asset does not belong to the connected wallet address'
  // }
  const errorMessage = error?.message || anotherError || (error && 'Oops! Transaction has been failed please try again!!')

  if (errorMessage) {
    dispatch({
      type: SHOW_TOAST,
      payload: {
        message: errorMessage,
        type: TOAST_TYPE.Error
      }
    })
  }
}

const getNetworkId = async ({ networkId, web3 }) => {
  let blockchainNetworkId = networkId
  if (!networkId && web3) {
    document.body.classList.add('global-loader')
    blockchainNetworkId = await web3.eth.net.getId()
    document.body.classList.remove('global-loader')
  }
  return blockchainNetworkId
}

const checkNetwork = async ({ blockchainNetwork, networkGeneric, dispatch, networkId, web3 }) => {
  // const web3 = web3Provider({ walletAccountStore })
  // const web3 = new Web3(process.env.REACT_APP_WEB3_PROVIDER)

  const blockchainNetworkId = await getNetworkId({ networkId, web3 })

  if (!networkGeneric) {
    if ((parseInt(blockchainNetworkId) !== parseInt(CHAIN_ID[blockchainNetwork]))) {
      dispatch({ type: CLEAR_WALLET_ACCOUNT })
      await disconnect()
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Connect to wallet and please choose the blockchain network ' + CHAIN_NAME[blockchainNetwork],
          type: TOAST_TYPE.Error
        }
      })
      return false
    }
  }
  return blockchainNetworkId
}

export {
  getGasPrice,
  toWei,
  checkSufficientBalance,
  handleError,
  isWalletAddressValid,
  checkNetwork,
  getNetworkId
}
