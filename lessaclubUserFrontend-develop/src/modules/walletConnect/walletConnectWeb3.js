import Web3 from 'web3'
import WalletConnectProviderWithInfura from './provider'

const WalletConnectWeb3 = new Web3(WalletConnectProviderWithInfura)

export default WalletConnectWeb3

// WalletConnectProviderWithInfura.on("accountsChanged", (accounts) => {
//   console.log(accounts);
// })

// // Subscribe to chainId change
// WalletConnectProviderWithInfura.on("chainChanged", (chainId) => {
//     console.log(chainId);
//   })

//   // Subscribe to session disconnection
//   WalletConnectProviderWithInfura.on("disconnect", (code, reason) => {
//     console.log(code, reason);
//   })

//   await WalletConnectProviderWithInfura.disconnect()
