import { nftContractAbi } from '../smartContract'
import { AUCTION_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from './constants'
import { getGasPrice, toWei, handleError, checkNetwork } from './utility'
import web3Provider from './web3Provider'

const resaleTransaction = async ({ blockchainNetwork, walletAccountStore, connectedAccount, setLoading, assetDetails, assetOnSalePayload, dispatch }) => {
  console.log('resaleTransaction')
  const web3 = web3Provider({ walletAccountStore, blockchainNetwork })
  console.log('web3')
  console.log(web3)

  document.body.classList.add('global-loader')
  const networkResult = await checkNetwork({ blockchainNetwork, web3, dispatch })
  console.log('networkResult')
  console.log(networkResult)
  document.body.classList.remove('global-loader')
  if (!networkResult) {
    handleError({ dispatch, setLoading, error: null })
    return false
  }

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
  console.log('resaleData')

  const nftContractAddress = NFT_CONTRACT_ADDRESS[blockchainNetwork]
  const auctionContractAddress = AUCTION_CONTRACT_ADDRESS[blockchainNetwork]

  document.body.classList.add('global-loader')
  const nftContract = await new web3.eth.Contract(nftContractAbi, nftContractAddress)
  console.log('nftContract')
  console.log(nftContract)
  document.body.classList.remove('global-loader')

  const contractMethod = nftContract.methods.safeTransferFrom(
    connectedAccount,
    auctionContractAddress,
    assetDetails?.ownedAsset?.asset?.id || assetDetails?.asset?.id,
    resaleData
  )
  console.log('contractMethod')
  console.log(contractMethod)
  document.body.classList.add('global-loader')
  const gasPrice = await getGasPrice({ web3 })
  console.log('gasPrice')
  console.log(gasPrice)
  document.body.classList.remove('global-loader')

  const txObject = {
    from: connectedAccount,
    value: 0,
    gasPrice: gasPrice
  }

  let result = null

  try {
    document.body.classList.add('global-loader')
    const gasEstimated = await web3.eth.estimateGas({
      to: nftContractAddress,
      data: contractMethod.encodeABI(),
      ...txObject
    })
    console.log('gasEstimated')
    console.log(gasEstimated)
    result = await contractMethod.send({
      ...txObject,
      gas: gasEstimated
    })
    console.log('result')
    console.log(result)
    document.body.classList.remove('global-loader')
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
