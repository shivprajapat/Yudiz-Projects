import WalletConnectProvider from '@walletconnect/web3-provider'

const rpc = {}
rpc[process.env.REACT_APP_ETHEREUM_CHAIN_ID] = process.env.REACT_APP_ETHEREUM_RPC
rpc[process.env.REACT_APP_POLYGON_CHAIN_ID] = process.env.REACT_APP_POLYGON_RPC

const WalletConnectProviderWithInfura = new WalletConnectProvider({
  rpc: rpc
})

export default WalletConnectProviderWithInfura
