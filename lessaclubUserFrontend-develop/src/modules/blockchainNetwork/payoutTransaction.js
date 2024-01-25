import { PAYOUT_CONTRACT_ADDRESS } from './constants'
import { payoutContractAbi } from './payoutContractAbi'
import { getGasPrice, toWei, checkSufficientBalance, handleError, checkNetwork } from './utility'
import web3Provider from './web3Provider'

const payoutTransaction = async ({
  blockchainNetwork,
  walletAccountStore,
  connectedAccount,
  setLoading,
  dispatch,
  order,
  asset,
  getNetworkPrice,
  getNetworkSymbol,
  settings
}) => {
  const web3 = web3Provider({ walletAccountStore, blockchainNetwork })
  const contractAddress = PAYOUT_CONTRACT_ADDRESS[blockchainNetwork]

  document.body.classList.add('global-loader')
  const contract = await new web3.eth.Contract(payoutContractAbi, contractAddress)
  document.body.classList.remove('global-loader')

  const networkSymbol = getNetworkSymbol(blockchainNetwork)

  const receivers = getReceivers({
    web3,
    order,
    asset,
    networkSymbol,
    getNetworkPrice,
    settings
  })

  const totalPriceValues = receivers.map((array) => {
    return parseInt(array[1])
  })

  let amount = totalPriceValues.reduce((a, b) => a + b, 0)
  amount = parseInt(amount).toString()

  const contractFunction = contract.methods.makePayment(order.id, receivers, order.blockchainPayoutSignature)

  const networkResult = await checkNetwork({ blockchainNetwork, web3, dispatch })
  if (!networkResult) {
    handleError({ dispatch, setLoading, error: null })
    return false
  }

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

  const txObject = {
    from: connectedAccount,
    value: amount,
    gasPrice: gasPrice
  }

  let result = null

  try {
    document.body.classList.add('global-loader')
    const gasEstimated = await web3.eth.estimateGas({
      to: contractAddress,
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

const getReceivers = ({
  web3,
  order,
  asset,
  networkSymbol,
  getNetworkPrice,
  settings
}) => {
  const receivers = []
  let amount

  if (asset.currentOwnerId) {
    amount = getNetworkPrice(order.royaltyAmount, networkSymbol)
    receivers.push([asset.creatorWalletAddress, (toWei({ web3, amount: amount })).toString()])
  }
  if (settings && order.sellerDonationAmount) {
    amount = getNetworkPrice(order.sellerDonationAmount, networkSymbol)
    receivers.push([settings.donationWalletAddress, (toWei({ web3, amount: amount })).toString()])
  }
  amount = getNetworkPrice(order.sellerPayoutAmount, networkSymbol)
  receivers.push([order.fromWalletAddress, (toWei({ web3, amount: amount })).toString()])

  amount = getNetworkPrice(order.commissionAmount, networkSymbol)
  receivers.push([process.env.REACT_APP_CUSTODIAN_WALLET_ADDRESS, (toWei({ web3, amount: amount })).toString()])

  return receivers
}

export default payoutTransaction
