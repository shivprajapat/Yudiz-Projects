
import Web3 from 'web3'
import magicLinkConnection from './connection'

const magicLinkWeb3 = ({ blockchainNetwork }) => {
  const magic = magicLinkConnection({ blockchainNetwork })
  const web3 = new Web3(magic.rpcProvider)
  return web3
}

export default magicLinkWeb3
