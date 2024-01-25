import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import './style.scss'
import { metamaskIcon, tracedIcon } from 'assets/images'

import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { connectWallet } from 'modules/wallet/redux/service'
import { CLEAR_WALLET_ACCOUNT, WALLET_ACCOUNT } from 'modules/wallet/redux/action'

const SelectWalletModal = ({ onCloseSelectWallet, show }) => {
  const dispatch = useDispatch()
  const walletAccountStore = useSelector((state) => state.wallet)

  const connectMetamask = async () => {
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
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    dispatch({ type: CLEAR_WALLET_ACCOUNT })
    dispatch({ type: WALLET_ACCOUNT, payload: { account: account } })

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
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'MetaMask account found',
          type: TOAST_TYPE.Success
        }
      })
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
  return (
    <Modal backdrop="static" show={show} onHide={onCloseSelectWallet} centered className="modal-medium connect-wallet-modal">
      <Modal.Header closeButton>
        <Modal.Title>Select a wallet</Modal.Title>
        <p className="text-center">
          By connecting your wallet, your agree to our <br></br> Terms of Service and our Privacy Policy
        </p>
      </Modal.Header>
      <Modal.Body>
        <ul className="wallet-links">
          <li>
            <Button className="d-flex justify-content-between align-items-center" onClick={() => connectMetamask()}>
              <span>MetaMask</span>
              <img src={metamaskIcon} alt="metamask-img" className="img-fluid" />
            </Button>
            {walletAccountStore?.account && (
              <div className="d-flex flex-column wallet-msg">
                <span className="success-msg">connected</span>
                <span>Wallet Address: {walletAccountStore?.account}</span>
              </div>
            )}
          </li>

          <li>
            <Button className="d-flex justify-content-between align-items-center">
              <span>WalletConnect</span>
              <img src={tracedIcon} alt="metamask-img" className="img-fluid traced-img" />
            </Button>
          </li>
        </ul>
      </Modal.Body>
    </Modal>
  )
}
SelectWalletModal.propTypes = {
  onCloseSelectWallet: PropTypes.func,
  show: PropTypes.bool
}
export default SelectWalletModal
