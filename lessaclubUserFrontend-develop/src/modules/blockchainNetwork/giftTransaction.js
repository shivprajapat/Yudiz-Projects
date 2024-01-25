import { nftContractAbi } from '../smartContract'
import { NFT_CONTRACT_ADDRESS } from './constants'
import { getGasPrice, handleError, checkNetwork } from './utility'
import web3Provider from './web3Provider'

const giftTransaction = async ({ blockchainNetwork, walletAccountStore, connectedAccount, setLoading, assetDetails, receiverAddress, dispatch }) => {
  const web3 = web3Provider({ walletAccountStore, blockchainNetwork })

  if (!receiverAddress) {
    handleError({ dispatch, setLoading, error: { message: 'Please enter receiver wallet address' } })
    return false
  }

  document.body.classList.add('global-loader')
  const networkResult = await checkNetwork({ blockchainNetwork, web3, dispatch })
  document.body.classList.remove('global-loader')
  if (!networkResult) {
    handleError({ dispatch, setLoading, error: null })
    return false
  }

  const nftContractAddress = NFT_CONTRACT_ADDRESS[blockchainNetwork]

  document.body.classList.add('global-loader')
  const nftContract = await new web3.eth.Contract(nftContractAbi, nftContractAddress)
  document.body.classList.remove('global-loader')

  const contractMethod = nftContract.methods.safeTransferFrom(
    connectedAccount,
    receiverAddress,
    assetDetails.id
  )

  document.body.classList.add('global-loader')
  const gasPrice = await getGasPrice({ web3 })
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
    result = await contractMethod.send({
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

export default giftTransaction
