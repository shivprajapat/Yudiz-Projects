import { CHAIN_ID, CHAIN_NAME } from './constants'
import {
  getGasPrice,
  toWei,
  checkSufficientBalance,
  handleError,
  checkNetwork,
  getNetworkId
} from './utility'
import web3Provider from './web3Provider'

const paymentTransfer = async ({
  blockchainNetwork,
  walletAccountStore,
  connectedAccount,
  sellingPrice,
  setLoading,
  assetDetails,
  dispatch
}) => {
  const web3 = web3Provider({ walletAccountStore, blockchainNetwork })

  if (blockchainNetwork) {
    const networkResult = await checkNetwork({ blockchainNetwork, web3, dispatch })
    if (!networkResult) {
      handleError({ dispatch, setLoading, error: null })
      return false
    }
  } else {
    const networkId = await getNetworkId({ web3 })
    const networkIdResult = Object.values(CHAIN_ID).filter((i) => parseInt(i) === parseInt(networkId))
    const networkResult = networkIdResult && networkIdResult.length > 0
    if (!networkResult) {
      handleError({ dispatch, setLoading, anotherError: `Please choose from networks: ${Object.values(CHAIN_NAME)}` })
      return false
    }
  }

  const amount = toWei({ web3, amount: sellingPrice })

  const balanceResponse = await checkSufficientBalance({
    web3,
    connectedAccount,
    amount,
    dispatch,
    setLoading
  })

  if (!balanceResponse) {
    return
  }

  const gasPrice = await getGasPrice({ web3 })

  let result = null

  try {
    document.body.classList.add('global-loader')
    result = await web3.eth.sendTransaction({
      from: connectedAccount,
      to: assetDetails?.sellerWalletAddress,
      value: amount,
      gasPrice
    })
    document.body.classList.remove('global-loader')
  } catch (error) {
    handleError({ dispatch, setLoading, error })
  }

  if (!result || !result.status) {
    handleError({ dispatch, setLoading })
  }

  return result
}

export default paymentTransfer
