import Web3 from 'web3'

import { getGasPrice, toWei, checkSufficientBalance, handleError } from './utility'

const paymentTransfer = async ({ connectedAccount, sellingPrice, setLoading, assetDetails, dispatch }) => {
  const web3 = new Web3(window.ethereum)

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
    result = await web3.eth.sendTransaction({
      from: connectedAccount,
      to: assetDetails?.sellerWalletAddress,
      value: amount,
      gasPrice
    })
  } catch (error) {
    handleError({ dispatch, setLoading, error })
  }

  if (!result || !result.status) {
    handleError({ dispatch, setLoading })
  }

  return result
}

export default paymentTransfer
