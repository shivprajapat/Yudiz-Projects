import { auctionContractAbi } from './auctionContractAbi'
import { AUCTION_CONTRACT_ADDRESS } from './constants'
import initiateContractFunctionTransaction from './initiateContractFunctionTransaction'
import web3Provider from './web3Provider'

const cancelSale = async ({ blockchainNetwork, walletAccountStore, connectedAccount, setLoading, assetDetails, dispatch }) => {
  const web3 = web3Provider({ walletAccountStore, blockchainNetwork })

  const auctionContractAddress = AUCTION_CONTRACT_ADDRESS[blockchainNetwork]

  document.body.classList.add('global-loader')
  const auctionContract = await new web3.eth.Contract(auctionContractAbi, auctionContractAddress)
  document.body.classList.remove('global-loader')

  const contractFunction = auctionContract.methods.cancel(assetDetails.asset.id)

  const result = await initiateContractFunctionTransaction({ blockchainNetwork, contractFunction, walletAccountStore, connectedAccount, setLoading, dispatch })
  return result
}

export default cancelSale
