import WalletConnectProviderWithInfura from './provider'

const disconnect = async () => {
  document.body.classList.add('global-loader')
  await WalletConnectProviderWithInfura.disconnect()
  document.body.classList.remove('global-loader')
}

export { disconnect }
