/* eslint-disable no-unused-vars */
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
// import { decrement, increment } from '../../redux/counterSlice';

const baseUrl = process.env.REACT_APP_API_URL

async function walletConnect() {
  // web3
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: '27e484dcd9e3efcfd25a83a78777cdf1' // required
      }
    }
  }

  const web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: false, // optional
    providerOptions // required
  })

  if (typeof window.web3 !== 'undefined') {
    console.log('web3 is enabled')
    const acc = await window.ethereum.request({ method: 'eth_accounts' })
    console.log(acc)
    if (window.web3.currentProvider.isMetaMask === true) {
      console.log('MetaMask is active')
    } else {
      console.log('MetaMask is not available')
    }
  } else {
    alert('Please install Metamask')
    return
  }

  const provider = await web3Modal.connect()

  // Subscribe to provider disconnection
  provider.on('disconnect', (error) => {
    console.log(error)
    console.log('disconnect')
  })

  provider.on('accountsChanged', (accounts) => {
    console.log(accounts)
    if (!accounts.length) {
      web3Modal.clearCachedProvider()
      return 'disconnected'
    }
  })

  // Subscribe to chainId change
  provider.on('chainChanged', (chainId) => {
    console.log(chainId)
  })

  // Subscribe to provider connection
  provider.on('connect', (info) => {
    console.log(info)
  })

  const web3 = new Web3(provider)

  const account = await web3.eth.getAccounts()

  console.log('Got accounts', account)

  if (account) {
    const signature = await web3.eth.personal.sign('Hello world', account[0], '')
    const res = await fetch(`${baseUrl}/user/authenticate`, {
      method: 'POST',
      body: JSON.stringify({ signature, publicAddress: account[0] }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // console.log(jwtDecode((await res.json()).result?.accessToken));
    localStorage.setItem('address', account)
    localStorage.setItem('status', 'signed_in')

    return 'connected'
  }
}

export default walletConnect
