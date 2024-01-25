import { magicLinkWeb3 } from 'modules/magicLink'
import { MetaMaskWeb3 } from 'modules/metaMask'
import { WalletConnectWeb3 } from 'modules/walletConnect'

const web3Provider = ({ walletAccountStore, blockchainNetwork }) => {
  let web3 = null
  if (walletAccountStore && walletAccountStore.account) {
    web3 = getWeb3(walletAccountStore.walletName, blockchainNetwork)
  }
  return web3
}

const getWeb3 = (walletName, blockchainNetwork) =>
  ({
    MetaMask: MetaMaskWeb3,
    'Wallet Connect': WalletConnectWeb3,
    'Magic Link': magicLinkWeb3({ blockchainNetwork })
  }[walletName])

export default web3Provider
