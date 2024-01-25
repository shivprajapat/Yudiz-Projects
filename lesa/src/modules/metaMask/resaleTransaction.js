import Web3 from 'web3'

import { nftContractAbi } from '../smartContract'
import { getGasPrice, toWei, handleError } from '../metaMask'

const resaleTransaction = async ({ connectedAccount, setLoading, assetDetails, assetOnSalePayload, dispatch }) => {
  const web3 = new Web3(window.ethereum)
  let purchaseType = null
  let basePrice = null
  let salePrice = null
  if (assetOnSalePayload.auctionMinimumPrice) {
    purchaseType = 2
    basePrice = assetOnSalePayload.networkSellingPrice
    salePrice = 0
  } else {
    purchaseType = 1
    basePrice = assetOnSalePayload.networkSellingPrice
    salePrice = basePrice
  }
  basePrice = toWei({ web3, amount: basePrice })
  salePrice = toWei({ web3, amount: salePrice })

  const resaleData = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256'], [purchaseType, basePrice, salePrice])

  const auctionContractAddress = process.env.REACT_APP_ETHEREUM_AUCTION_CONTRACT_ADDRESS
  const nftContractAddress = process.env.REACT_APP_ETHEREUM_NFT_CONTRACT_ADDRESS

  const nftContract = await new web3.eth.Contract(nftContractAbi, nftContractAddress)

  const contractMethod = nftContract.methods.safeTransferFrom(connectedAccount, auctionContractAddress, assetDetails.ownedAsset.asset.id, resaleData)

  const gasPrice = await getGasPrice({ web3 })

  const txObject = {
    from: connectedAccount,
    value: 0,
    gasPrice: gasPrice
  }

  let result = null

  try {
    const gasEstimated = await web3.eth.estimateGas({
      to: nftContractAddress,
      data: contractMethod.encodeABI(),
      ...txObject
    })

    result = await contractMethod.send({
      ...txObject,
      gas: gasEstimated
    })
  } catch (error) {
    console.error(error)
    handleError({ dispatch, setLoading, error })
  }

  if (!result || !result.status) {
    handleError({ dispatch, setLoading })
  }

  return result
}

export default resaleTransaction
