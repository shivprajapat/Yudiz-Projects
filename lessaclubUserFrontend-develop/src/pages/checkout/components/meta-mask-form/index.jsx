import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
// import Web3 from 'web3'

import { getNetworkSymbol, getStringWithCommas } from 'shared/utils'
import { web3Provider } from 'modules/blockchainNetwork'

const MetaMaskForm = ({ referralDiscount, metaMaskFormMethods, paymentModeFormMethods, onMetaMaskFormSubmit, hidden, loading, assetDetails, getNetworkPrice, assetGbpPrice }) => {
  const [walletBalanceState, setWalletBalanceState] = useState(false)
  const [payBtnDisable, setPayBtnDisable] = useState(false)

  const { handleSubmit } = metaMaskFormMethods

  let referralDiscountValue = 0
  let discountedPrice = 0
  if (referralDiscount && referralDiscount.sellingPriceMinusDiscount && !assetDetails?.auctionId) {
    discountedPrice = referralDiscount.sellingPriceMinusDiscount
    referralDiscountValue = referralDiscount.referralDiscount
  }
  const walletAccountStore = useSelector((state) => state.wallet)

  useEffect(() => {
    if (walletAccountStore && walletAccountStore.account) {
      const setAccountBalance = async () => {
        document.body.classList.add('global-loader')
        // const web3 = new Web3(Web3.givenProvider)
        const web3 = web3Provider({ walletAccountStore, blockchainNetwork })
        // const web3 = web3Provider({ walletAccountStore })
        const account = walletAccountStore.account
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
      if (Number(walletBalanceState) < Number(assetDetails.networkPrice)) {
        // assetDetails.price
        setPayBtnDisable(true)
      }
    }
  }, [assetDetails, walletBalanceState])

  // const assetGbpPrice = assetDetails?.auctionId ? bidAmount : assetDetails?.sellingPrice
  const blockchainNetworkEntered = paymentModeFormMethods?.watch('blockchainNetwork')
  const blockchainNetwork = blockchainNetworkEntered?.value || assetDetails?.blockchainNetwork
  const networkSymbol = getNetworkSymbol(blockchainNetwork)

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
          <FormattedMessage id="price" />
        </Form.Label>
        <>{
          referralDiscountValue && !assetDetails?.auctionId ? (<Form.Control
            type="text"
            value={`£ ${getStringWithCommas(discountedPrice)} (${getNetworkPrice(discountedPrice, networkSymbol)} ${networkSymbol})`}
            disabled
          />) : (<Form.Control
            type="text"
            value={`£ ${getStringWithCommas(assetGbpPrice)} (${getNetworkPrice(assetGbpPrice, networkSymbol)} ${networkSymbol})`}
            disabled
          />)
        }
        </>
        <>{
          referralDiscountValue && !assetDetails?.auctionId ? (<div className="discount d-flex justify-content-between">
            <span className="bal-left text-capitalize">
              <FormattedMessage id="referralDiscount" />
            </span>
            <span className="bal-right">{`- £ ${getStringWithCommas(referralDiscountValue)}`}</span>
          </div>) : null
        }
        </>

      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>
          <FormattedMessage id="walletBalance" />
        </Form.Label>
        {walletBalanceState ? <Form.Control type="text" disabled value={`${walletBalanceState} ${networkSymbol}`} /> : 'fetching...'}
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
      </Button>
    </Form>
  )
}
MetaMaskForm.propTypes = {
  metaMaskFormMethods: PropTypes.object,
  paymentModeFormMethods: PropTypes.object,
  onMetaMaskFormSubmit: PropTypes.func,
  hidden: PropTypes.bool,
  loading: PropTypes.bool,
  assetDetails: PropTypes.object,
  getNetworkPrice: PropTypes.func,
  assetGbpPrice: PropTypes.any,
  referralDiscount: PropTypes.object
}
export default MetaMaskForm
