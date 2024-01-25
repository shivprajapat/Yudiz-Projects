import { Magic } from 'magic-sdk'
import { ConnectExtension } from '@magic-ext/connect'

import { CHAIN_ID, NETWORKS, RPC_URL } from 'modules/blockchainNetwork'

const magicLinkConnection = ({ blockchainNetwork }) => {
  let network = blockchainNetwork
  if (!network) {
    network = NETWORKS.ETHEREUM
  }
  const rpcUrl = RPC_URL[network]
  const chainId = CHAIN_ID[network]

  const customNodeOptions = {
    rpcUrl: rpcUrl,
    chainId: chainId
  }

  const magic = new Magic(process.env.REACT_APP_MAGIC_LINK_PUBLIC_KEY, {
    network: customNodeOptions,
    locale: 'en_US',
    extensions: [new ConnectExtension()]
  })
  return magic
}

export default magicLinkConnection
