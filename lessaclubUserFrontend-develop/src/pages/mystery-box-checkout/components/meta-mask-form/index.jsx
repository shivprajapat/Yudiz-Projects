import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { getNetworkSymbol, getStringWithCommas } from 'shared/utils'
import { web3Provider } from 'modules/blockchainNetwork'

const MetaMaskForm = ({ metaMaskFormMethods, onMetaMaskFormSubmit, hidden, loading, assetDetails, getNetworkPrice, bidAmount }) => {
  const [walletBalanceState, setWalletBalanceState] = useState(false)
  const [payBtnDisable, setPayBtnDisable] = useState(false)

  const { handleSubmit } = metaMaskFormMethods

  const walletAccountStore = useSelector((state) => state.wallet)

  useEffect(() => {
    if (assetDetails && walletAccountStore && walletAccountStore.account) {
      const setAccountBalance = async () => {
        // const web3 = new Web3(Web3.givenProvider)
        const web3 = web3Provider({ walletAccountStore, blockchainNetwork: assetDetails?.blockchainNetwork })
        const account = walletAccountStore.account
        document.body.classList.add('global-loader')
        const walletBalance = await web3.eth.getBalance(account)
        document.body.classList.remove('global-loader')
        const etherWalletBalance = web3.utils.fromWei(walletBalance, 'ether')
        setWalletBalanceState(etherWalletBalance)
      }
      setAccountBalance()
    }
  }, [walletAccountStore])

  useEffect(() => {
    if (assetDetails && assetDetails.price && walletBalanceState) {
      if (Number(walletBalanceState) < Number(assetDetails.price)) {
        setPayBtnDisable(true)
      }
    }
  }, [assetDetails, walletBalanceState])

  const assetGbpPrice = assetDetails?.auctionId ? bidAmount : assetDetails?.sellingPrice

  return (
    <Form hidden={hidden} autoComplete="off">
      {loading && (
        <h6 className="invalidFeedback">
          <FormattedMessage id="pleaseDoNotRefreshThePage" />
        </h6>
      )}
      {payBtnDisable && <FormattedMessage id="insufficientBalanceInYourWallet" />}

      <Form.Group className="form-group">
        <Form.Label>
          <FormattedMessage id="assetPrice" />
        </Form.Label>
        <Form.Control
          type="text"
          value={`£ ${getStringWithCommas(assetGbpPrice)} (${getNetworkPrice(assetGbpPrice)} ${getNetworkSymbol(
            assetDetails?.blockchainNetwork || 'Ethereum'
          )})`}
          disabled
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>
          <FormattedMessage id="walletBalance" />
        </Form.Label>
        {walletBalanceState ? <Form.Control type="text" disabled value={`${walletBalanceState} ETH`} /> : 'fetching...'}
      </Form.Group>

      <Button
        type="submit"
        disabled={loading || payBtnDisable}
        className="white-btn payment-btn"
        onClick={handleSubmit(onMetaMaskFormSubmit)}
      >
        {loading ? (
          <FormattedMessage id="paymentInProgress" />
        ) : payBtnDisable ? (
          <FormattedMessage id="pleaseFundYourWallet" />
        ) : (
          <FormattedMessage id="payNow" />
        )}
        {loading && <Spinner animation="border" size="sm" />}
      </Button>
    </Form>
  )
}
MetaMaskForm.propTypes = {
  metaMaskFormMethods: PropTypes.object,
  onMetaMaskFormSubmit: PropTypes.func,
  hidden: PropTypes.bool,
  loading: PropTypes.bool,
  assetDetails: PropTypes.object,
  getNetworkPrice: PropTypes.func,
  bidAmount: PropTypes.string
}
export default MetaMaskForm
