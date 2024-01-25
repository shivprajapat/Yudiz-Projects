import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import Web3 from 'web3'

const web3 = new Web3(window.ethereum)

const isWalletAddressValid = (address) => web3.utils.isAddress(address)

const getGasPrice = async ({ web3 }) => {
  const gasPrice = await web3.eth.getGasPrice()
  return web3.utils.toBN(gasPrice).add(web3.utils.toBN('20000000000'))
}

const toWei = ({ web3, amount }) => {
  return web3.utils.toWei(parseFloat(amount).toFixed(14).toString(), 'ether')
}

const checkSufficientBalance = async ({ web3, connectedAccount, amount, dispatch, setLoading }) => {
  const walletBalance = await web3.eth.getBalance(connectedAccount)

  if (parseInt(walletBalance) < parseInt(amount)) {
    dispatch({
      type: SHOW_TOAST,
      payload: {
        message: "Oops! You don't have sufficient balance to purchase this product. Please topup your wallet with Ether. Thank you.",
        type: TOAST_TYPE.Error
      }
    })
    setLoading(false)
    return false
  }
  return true
}

const handleError = ({ dispatch, setLoading, error }) => {
  document.body.classList.remove('global-loader')
  dispatch({
    type: SHOW_TOAST,
    payload: {
      message: error ? error?.message : 'Oops! Transaction has been failed please try again!!',
      type: TOAST_TYPE.Error
    }
  })
  setLoading(false)
}

export { getGasPrice, toWei, checkSufficientBalance, handleError, isWalletAddressValid }
