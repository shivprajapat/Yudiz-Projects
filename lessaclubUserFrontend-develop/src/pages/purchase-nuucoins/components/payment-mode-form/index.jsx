import React from 'react'
import { Button, Col, Form, Row, ToggleButton } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

import { paymentModeOptions } from 'shared/constants'
import { getNetworkSymbol, getStringWithCommas } from 'shared/utils'
import { CHAIN_ID, NETWORKS } from 'modules/blockchainNetwork'

const PaymentModeForm = ({ hidden, paymentModeFormMethods, walletAccountStore, onFirstStepSubmit, nuuCoinPurchaseData, assetDetails, networkCurrencies }) => {
  const { watch, control, handleSubmit } = paymentModeFormMethods

  const paymentMode = watch('paymentMode')
  const gbpAmount = nuuCoinPurchaseData?.gbpAmount

  const chargeValue = parseFloat(gbpAmount) * 0.03
  const charges = parseFloat(chargeValue).toFixed(2)
  const totalPriceValue = parseFloat(gbpAmount) + chargeValue
  const totalPrice = parseFloat(totalPriceValue).toFixed(2)

  let networkPrice
  let networkSymbol
  let polygonSymbol
  if (paymentMode === 'Crypto Currency') {
    if (parseInt(CHAIN_ID[NETWORKS.POLYGON]) === parseInt(walletAccountStore.networkId)) {
      networkSymbol = getNetworkSymbol(NETWORKS.POLYGON)
    } else {
      networkSymbol = getNetworkSymbol(NETWORKS.ETHEREUM)
    }
    networkPrice = networkCurrencies[networkSymbol]
    polygonSymbol = getNetworkSymbol(NETWORKS.POLYGON)
  }

  const { blockchainNetwork } = assetDetails

  return (
    <>
      <Form autoComplete="off" hidden={hidden} className="payment-mode-form" id="payment-mode-form">
        <div className="payment-mode">
          <h4 className="title">
            <FormattedMessage id="modeOfPayment" />
          </h4>
          <div className="payment-tabs d-flex flex-wrap">
            {paymentModeOptions.slice(0, 2)?.map((type, index) => (
              <div className="list-nft-btns" key={index}>
                <Controller
                  name="paymentMode"
                  control={control}
                  render={({ field: { onChange, value = [] } }) => (
                    <ToggleButton
                      className="normal-btn"
                      key={index}
                      id={'payment-mode' + '-' + index}
                      type="radio"
                      name="paymentMode"
                      value={type.value}
                      checked={paymentMode === type.value}
                      onChange={(e) => {
                        onChange(e)
                      }}
                    >
                      {type.name}
                    </ToggleButton>
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {paymentMode === 'Crypto Currency' && (
          <>
            <div className="bid-txt d-flex justify-content-between">
              <span className="txt-left">
                <FormattedMessage id="nuuCoinValue" />
              </span>
              <span className="txt-right">{nuuCoinPurchaseData?.nuuCoinCount}</span>
            </div>

            <div className="bid-txt d-flex justify-content-between">
              <span className="txt-left">GBP {<FormattedMessage id="price" />}</span>
              <span className="txt-right">{`£ ${getStringWithCommas(nuuCoinPurchaseData?.gbpAmount)}`}</span>
            </div>
            <div className="bid-txt d-flex justify-content-between">
              <span className="txt-left"> {<FormattedMessage id="price" />}</span>
              <span className="txt-right">{`${networkSymbol} ${networkPrice} `}</span>
            </div>
            {!blockchainNetwork && (
              <div className="bid-txt d-flex justify-content-between">
                <span className="txt-left">{<FormattedMessage id="price" />}</span>
                <span className="txt-right">{`${polygonSymbol} ${networkCurrencies[polygonSymbol]}`}</span>
              </div>
            )}
          </>
        )}

        {paymentMode !== 'Crypto Currency' && (
          <>
            <div className="bid-txt d-flex justify-content-between">
              <span className="txt-left">
                <FormattedMessage id="nuuCoinValue" />
              </span>
              <span className="txt-right">{nuuCoinPurchaseData?.nuuCoinCount}</span>
            </div>

            <div className="bid-txt d-flex justify-content-between">
              <span className="txt-left">GBP {<FormattedMessage id="price" />}</span>
              <span className="txt-right">{`£ ${getStringWithCommas(nuuCoinPurchaseData?.gbpAmount)}`}</span>
            </div>

            <div className="bid-txt d-flex justify-content-between">
              <span className="txt-left">
                <FormattedMessage id="chargeAmount" />
              </span>
              <span className="txt-right">
                {`£ ${getStringWithCommas(charges)}`}
              </span>
            </div>

            <div className="bid-txt d-flex justify-content-between">
              <span className="txt-left">
                <FormattedMessage id="totalAmount" />
              </span>
              <span className="txt-right">
                {`£ ${getStringWithCommas(totalPrice)}`}
              </span>
            </div>

          </>
        )}

        <Row>
          <Col lg={12}>
            <Button
              type="submit"
              className="white-btn"
              form="payment-mode-form"
              onClick={handleSubmit(onFirstStepSubmit)}
              // disabled={loading}
            >
              <FormattedMessage id="next" />
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}
PaymentModeForm.propTypes = {
  hidden: PropTypes.bool,
  paymentModeFormMethods: PropTypes.object,
  onFirstStepSubmit: PropTypes.func,
  nuuCoinPurchaseData: PropTypes.object,
  assetDetails: PropTypes.object,
  walletAccountStore: PropTypes.object,
  networkCurrencies: PropTypes.object
}
export default PaymentModeForm
