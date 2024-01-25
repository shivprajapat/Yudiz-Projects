import { AUCTION_CONTRACT_ADDRESS } from './constants'
import { getGasPrice, toWei, checkSufficientBalance, handleError, checkNetwork } from './utility'
import web3Provider from './web3Provider'

const initiateContractFunctionTransaction = async ({ blockchainNetwork, contractFunction, walletAccountStore, connectedAccount, amountValue, setLoading, dispatch }) => {
  const web3 = web3Provider({ walletAccountStore, blockchainNetwork })

  const networkResult = await checkNetwork({ blockchainNetwork, web3, dispatch })
  if (!networkResult) {
    handleError({ dispatch, setLoading, error: null })
    return false
  }

  const amount = amountValue ? toWei({ web3, amount: amountValue }) : '0x0'

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

  const auctionContractAddress = AUCTION_CONTRACT_ADDRESS[blockchainNetwork]

  const txObject = {
    from: connectedAccount,
    value: amount,
    gasPrice: gasPrice
  }

  let result = null

  try {
    document.body.classList.add('global-loader')
    const gasEstimated = await web3.eth.estimateGas({
      to: auctionContractAddress,
      data: contractFunction.encodeABI(),
      ...txObject
    })

    result = await contractFunction.send({
      ...txObject,
      gas: gasEstimated
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

export default initiateContractFunctionTransaction
