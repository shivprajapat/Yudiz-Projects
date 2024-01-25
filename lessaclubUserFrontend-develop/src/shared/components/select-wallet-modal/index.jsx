import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import './style.scss'
import { metamaskIcon, walletConnect, magicLinkIcon } from 'assets/images'
import { SuccessIcon } from 'assets/images/icon-components/icons'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { connectWallet } from 'modules/wallet/redux/service'
import { CLEAR_CONNECT_WALLET, CLEAR_WALLET_ACCOUNT, WALLET_ACCOUNT } from 'modules/wallet/redux/action'
import {
  disconnect as walletConnectDisconnect,
  WalletConnectProviderWithInfura,
  WalletConnectWeb3,
  WALLET_CONNECT
} from 'modules/walletConnect'
import { METAMASK, MetaMaskWeb3 } from 'modules/metaMask'
import { checkNetwork } from 'modules/blockchainNetwork'
import { MAGIC_LINK, magicLinkWeb3, disconnect as magicLinkDisconnect } from 'modules/magicLink'

const SelectWalletModal = ({ blockchainNetwork, networkGeneric, onCloseSelectWallet, show, selectedWallet }) => {
  const dispatch = useDispatch()
  const walletAccountStore = useSelector((state) => state.wallet)

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async (networkId) => {
        const networkResult = await checkNetwork({ blockchainNetwork, networkGeneric, web3: MetaMaskWeb3, dispatch, networkId })
        if (!networkResult) {
          await disconnectWallet({ showMessage: true, blockchainNetwork })
          return null
        }
      })
    }
    WalletConnectProviderWithInfura.on('chainChanged', async (networkId) => {
      const networkResult = await checkNetwork({ blockchainNetwork, networkGeneric, web3: MetaMaskWeb3, dispatch, networkId })
      if (!networkResult) {
        await disconnectWallet({ showMessage: true, blockchainNetwork })
        return null
      }
    })
  }, [])

  const connectMetamask = async () => {
    await disconnectWallet({ showMessage: true, blockchainNetwork })
    if (!window.ethereum) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Please install MetaMask',
          type: TOAST_TYPE.Error
        }
      })
      return
    }
    document.body.classList.add('global-loader')
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    document.body.classList.remove('global-loader')
    const account = accounts[0]
    dispatch({ type: CLEAR_WALLET_ACCOUNT })

    if (!account) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Please login to MetaMask',
          type: TOAST_TYPE.Error
        }
      })
    }
    if (account) {
      const networkResult = await checkNetwork({ blockchainNetwork, networkGeneric, web3: MetaMaskWeb3, dispatch })
      dispatch({ type: WALLET_ACCOUNT, payload: { account: account, walletName: 'MetaMask', networkId: networkResult } })

      if (!networkResult) {
        await disconnectWallet({ showMessage: false, blockchainNetwork })
        //  onCloseSelectWallet()
        return null
      }
      // dispatch({
      //   type: SHOW_TOAST,
      //   payload: {
      //     message: 'MetaMask account found',
      //     type: TOAST_TYPE.Success
      //   }
      // })
      // dispatch({ type: WALLET_ACCOUNT, payload: { account: account, walletName: 'MetaMask' } })
      dispatch(connectWallet({ walletAddress: account, walletName: 'MetaMask' }))
      onCloseSelectWallet()
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Wallet Connected',
          type: TOAST_TYPE.Success
        }
      })
    }
    return account
  }

  const connectWalletConnectProvider = async () => {
    // await disconnectWallet({ showMessage: true, blockchainNetwork })
    // document.body.classList.add('global-loader')
    const enabled = await WalletConnectProviderWithInfura.enable()
    // document.body.classList.remove('global-loader')

    //  const networkResult = await checkNetwork({ blockchainNetwork, networkGeneric, web3: MetaMaskWeb3, dispatch, networkId })
    // if (!networkResult) {
    //   await disconnectWallet({ showMessage: true, blockchainNetwork })
    //   return null
    // }
    // Need wallet connects network
    // , networkId: networkResult

    WalletConnectProviderWithInfura.on('accountsChanged', (accounts) => {
      const account = accounts[0]
      dispatch({ type: CLEAR_WALLET_ACCOUNT })
      dispatch({ type: WALLET_ACCOUNT, payload: { account: account, walletName: 'Wallet Connect' } })
    })

    if (!enabled) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Wallet Connection wallet did not connect',
          type: TOAST_TYPE.Error
        }
      })
      return
    }

    const web3 = WalletConnectWeb3
    document.body.classList.add('global-loader')
    const accounts = await web3.eth.getAccounts()
    document.body.classList.remove('global-loader')
    const account = accounts[0]
    dispatch({ type: CLEAR_WALLET_ACCOUNT })
    dispatch({ type: WALLET_ACCOUNT, payload: { account: account, walletName: 'Wallet Connect' } })

    if (!account) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Please login to Wallet Connect app',
          type: TOAST_TYPE.Error
        }
      })
    }
    if (account) {
      const networkResult = await checkNetwork({ blockchainNetwork, networkGeneric, web3, dispatch })
      if (!networkResult) {
        await disconnectWallet({ showMessage: false, blockchainNetwork })
        //  onCloseSelectWallet()
        return null
      }
      // dispatch({
      //   type: SHOW_TOAST,
      //   payload: {
      //     message: 'Wallet Connect account found',
      //     type: TOAST_TYPE.Success
      //   }
      // })
      dispatch(connectWallet({ walletAddress: account, walletName: 'Wallet Connect' }))
      onCloseSelectWallet()
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Wallet Connected',
          type: TOAST_TYPE.Success
        }
      })
    }
    return account
  }

  const connectMagicLinkProvider = async () => {
    const web3 = magicLinkWeb3({ blockchainNetwork })
    document.body.classList.add('global-loader')
    const accounts = await web3.eth.getAccounts()
    document.body.classList.remove('global-loader')
    const account = accounts[0]
    dispatch({ type: CLEAR_WALLET_ACCOUNT })
    dispatch({ type: WALLET_ACCOUNT, payload: { account: account, walletName: 'Magic Link' } })

    if (!account) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Please login to Wallet Connect app',
          type: TOAST_TYPE.Error
        }
      })
    }
    if (account) {
      const networkResult = await checkNetwork({ blockchainNetwork, networkGeneric, web3, dispatch })
      if (!networkResult) {
        await disconnectWallet({ showMessage: false, blockchainNetwork })
        //  onCloseSelectWallet()
        return null
      }
      // dispatch({
      //   type: SHOW_TOAST,
      //   payload: {
      //     message: 'Wallet Connect account found',
      //     type: TOAST_TYPE.Success
      //   }
      // })
      dispatch(connectWallet({ walletAddress: account, walletName: 'Magic Link' }))
      onCloseSelectWallet()
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Wallet Connected',
          type: TOAST_TYPE.Success
        }
      })
      document.body.classList.remove('global-loader')
    }
    return account
  }

  const disconnectWallet = async ({ showMessage, blockchainNetwork }) => {
    await walletConnectDisconnect()
    await magicLinkDisconnect({ blockchainNetwork })
    dispatch(connectWallet({ walletAddress: null, walletName: null }))
    dispatch({ type: CLEAR_CONNECT_WALLET })
    dispatch({ type: CLEAR_WALLET_ACCOUNT })
    // onCloseSelectWallet()
    if (showMessage) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Wallet Disconnected',
          type: TOAST_TYPE.Success
        }
      })
    }
  }

  const checkSelectedWallet = (walletType) => {
    if (!selectedWallet) return true
    return selectedWallet === walletType
  }

  return (
    <Modal backdrop="static" show={show} onHide={onCloseSelectWallet} centered className="modal-medium connect-wallet-modal">
      <Modal.Header closeButton>
       {!selectedWallet ? <Modal.Title>
          <FormattedMessage id="selectAWallet" />
        </Modal.Title> : null}
        <p className="text-center">
          <FormattedMessage id="byConnectingYourWalletYourAgreeToOur" /> <br></br>{' '}
          <FormattedMessage id="termsOfServiceAndOurPrivacyPolicy" />
        </p>
      </Modal.Header>
      <Modal.Body>
        <ul className="wallet-links">
          {checkSelectedWallet(METAMASK) ? <li>
            {walletAccountStore?.account && walletAccountStore?.walletName === METAMASK ? (
              <div className="border border-3 border-dark rounded-3 p-3 shadow">
                <div className="d-flex flex-column wallet-msg alert alert-info text-center">
                  <span className="success-msg">
                    <SuccessIcon /> <FormattedMessage id="connected" />
                  </span>
                  <span>
                    <FormattedMessage id="walletAddress" />: {walletAccountStore?.account}
                  </span>
                </div>
                <Button
                  onClick={() => disconnectWallet({ showMessage: true, blockchainNetwork })}
                  className="d-flex justify-content-between align-items-center"
                >
                  Disconnect <img src={metamaskIcon} alt="metamask-img" className="img-fluid" />
                </Button>
              </div>
            ) : (
              <Button className="d-flex justify-content-between align-items-center" onClick={() => connectMetamask()}>
                <span>
                  <FormattedMessage id="metaMask" />
                </span>
                <img src={metamaskIcon} alt="metamask-img" className="img-fluid" />
              </Button>
            )}
          </li> : null}

          {checkSelectedWallet(WALLET_CONNECT) ? <li>
            {!!walletAccountStore?.account && walletAccountStore?.walletName === WALLET_CONNECT ? (
              <div className="border border-3 border-dark rounded-3 p-3 shadow">
                <div className="d-flex flex-column wallet-msg alert alert-info text-center">
                  <span className="success-msg">
                    <SuccessIcon /> <FormattedMessage id="connected" />
                  </span>
                  <span>
                    <FormattedMessage id="walletAddress" />: {walletAccountStore?.account}
                  </span>
                </div>
                <Button
                  onClick={() => disconnectWallet({ showMessage: true, blockchainNetwork })}
                  className="d-flex justify-content-between align-items-center"
                >
                  Disconnect <img src={walletConnect} alt="wallet-connect-img" className="img-fluid traced-img connect-wallet-connect-icon" />
                </Button>
              </div>
            ) : (
              <Button className="d-flex justify-content-between align-items-center" onClick={() => connectWalletConnectProvider()}>
                <span>
                  <FormattedMessage id="walletConnect" />
                </span>
                <img src={walletConnect} alt="wallet-connect-img" className="img-fluid traced-img connect-wallet-connect-icon" />
              </Button>
            )}
          </li> : null}
          {checkSelectedWallet(MAGIC_LINK) ? <li>
            {!!walletAccountStore?.account && walletAccountStore?.walletName === MAGIC_LINK ? (
              <div className="border border-3 border-dark rounded-3 p-3 shadow">
                <div className="d-flex flex-column wallet-msg alert alert-info text-center">
                  <span className="success-msg">
                    <SuccessIcon /> <FormattedMessage id="connected" />
                  </span>
                  <span>
                    <FormattedMessage id="walletAddress" />: {walletAccountStore?.account}
                  </span>
                </div>
                <Button
                  onClick={() => disconnectWallet({ showMessage: true, blockchainNetwork })}
                  className="d-flex justify-content-between align-items-center"
                >
                  Disconnect <img src={magicLinkIcon} alt="metamask-img" className="img-fluid traced-img connect-magic-link-icon" />
                </Button>
              </div>
            ) : (
              <Button className="d-flex justify-content-between align-items-center" onClick={() => connectMagicLinkProvider()}>
                <span>Magic Link</span>
                <img src={magicLinkIcon} alt="magic-link-img" className="img-fluid traced-img connect-magic-link-icon" />
              </Button>
            )}
          </li> : null}
        </ul>
      </Modal.Body>
    </Modal>
  )
}
SelectWalletModal.propTypes = {
  onCloseSelectWallet: PropTypes.func,
  show: PropTypes.bool,
  blockchainNetwork: PropTypes.string,
  networkGeneric: PropTypes.bool,
  selectedWallet: PropTypes.any
}
export default SelectWalletModal
