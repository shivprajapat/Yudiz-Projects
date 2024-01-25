import { isWalletAddressValid, handleError, checkNetwork } from './utility'

import web3Provider from './web3Provider'
import paymentTransfer from './paymentTransfer'
import resaleTransaction from './resaleTransaction'
import makeBid from './makeBid'
import cancelSale from './cancelSale'
import giftTransaction from './giftTransaction'
import { NETWORKS, CHAIN_ID, RPC_URL } from './constants'
import payoutTransaction from './payoutTransaction'

export {
  web3Provider,
  handleError,
  isWalletAddressValid,
  paymentTransfer,
  resaleTransaction,
  makeBid,
  checkNetwork,
  cancelSale,
  giftTransaction,
  payoutTransaction,
  NETWORKS,
  CHAIN_ID,
  RPC_URL
}
