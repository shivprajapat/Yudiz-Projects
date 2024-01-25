import Web3 from 'web3'

import { auctionContractAbi } from './constants/auctionContractAbi'
import { getGasPrice, toWei, checkSufficientBalance, handleError } from '../metaMask'

const metaMaskBid = async ({ connectedAccount, bidAmount, setLoading, assetDetails, dispatch }) => {
  const web3 = new Web3(window.ethereum)

  const amount = toWei({ web3, amount: bidAmount })

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

  const auctionContractAddress = process.env.REACT_APP_ETHEREUM_AUCTION_CONTRACT_ADDRESS

  const auctionContract = await new web3.eth.Contract(auctionContractAbi, auctionContractAddress)

  const bidMethod = auctionContract.methods.bid(assetDetails.asset.id)

  const txObject = {
    from: connectedAccount,
    value: amount,
    gasPrice: gasPrice
  }

  let result = null

  try {
    const gasEstimated = await web3.eth.estimateGas({
      to: auctionContractAddress,
      data: bidMethod.encodeABI(),
      ...txObject
    })

    result = await bidMethod.send({
      ...txObject,
      gas: gasEstimated
    })
  } catch (error) {
    handleError({ dispatch, setLoading, error })
  }

  if (!result || !result.status) {
    handleError({ dispatch, setLoading })
  }

  return result
}

export default metaMaskBid
