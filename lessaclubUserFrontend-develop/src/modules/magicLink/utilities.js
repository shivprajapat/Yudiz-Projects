import magicLinkConnection from './connection'

const disconnect = async ({ blockchainNetwork }) => {
  document.body.classList.add('global-loader')
  await magicLinkConnection({ blockchainNetwork }).connect.disconnect()
  document.body.classList.remove('global-loader')
}

export { disconnect }
