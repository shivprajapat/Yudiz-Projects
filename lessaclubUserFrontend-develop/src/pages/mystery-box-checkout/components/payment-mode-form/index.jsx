import React, { useEffect, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import { blockchainNetworkOptions } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import { forceAsPositiveNumber, getStringWithCommas } from 'shared/utils'
import WalletAddressField from 'shared/components/wallet-address-field'

const PaymentModeForm = ({
  hidden,
  isAuction,
  assetDetails,
  paymentModeFormMethods,
  onFirstStepSubmit,
  loading,
  getNetworkPrice,
  userData,
  referralDiscount
}) => {
  const {
    register,
    formState: { errors },
    control,
    clearErrors,
    setValue,
    handleSubmit
  } = paymentModeFormMethods

  const paymentMode = 'Nuu coin'

  const [nuuCoinsMultiplier, setNuuCoinsMultiplier] = useState()

  const nuuCoinsStore = useSelector((state) => state.nuuCoins)

  useEffect(() => {
    if (nuuCoinsStore?.nuuCoinsDetails?.nuuCoin?.length) {
      setNuuCoinsMultiplier(nuuCoinsStore?.nuuCoinsDetails?.nuuCoin[0]?.coinRate)
    }
  }, [nuuCoinsStore])

  const assetGbpPrice = isAuction ? assetDetails?.auction?.nextBid : assetDetails?.price
  let discountedPrice = isAuction ? assetDetails?.auction?.nextBid : assetDetails?.price

  const chargeValue = parseFloat(assetGbpPrice) * 0.03
  const charges = parseFloat(chargeValue).toFixed(2)
  if (referralDiscount && referralDiscount.sellingPriceMinusDiscount) {
    discountedPrice = referralDiscount.sellingPriceMinusDiscount
  }
  const totalPriceValue = parseFloat(discountedPrice)
  const totalPrice = parseFloat(totalPriceValue).toFixed(2)

  return (
    <>
      {assetDetails && (
        <Form autoComplete="off" hidden={hidden} className="payment-mode-form" id="payment-mode-form-mystery">
          <h4 className="title">{assetDetails?.name}</h4>

          {assetDetails && !assetDetails?.blockchainNetwork && (
            <Form.Group className="form-group">
              <Form.Label>
                <FormattedMessage id="blockchainNetwork" />*
              </Form.Label>
              <Controller
                name="blockchainNetwork"
                control={control}
                rules={{ required: validationErrors.required }}
                render={({ field: { onChange, value = [] } }) => (
                  <Select
                    value={value}
                    className={`react-select ${errors.blockchainNetwork && 'error'}`}
                    classNamePrefix="select"
                    placeholder={'Select Blockchain Network'}
                    options={blockchainNetworkOptions.slice(0, -1)}
                    onChange={(e) => {
                      onChange(e)
                    }}
                  />
                )}
              />
              {errors.blockchainNetwork && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.blockchainNetwork.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}

          <div className="bid-txt d-flex">
            {assetDetails?.blockchainNetwork && (
              <>
                <span className="txt-left">
                  <FormattedMessage id="blockchainNetwork" />
                </span>
                <span className="txt-right">{assetDetails?.blockchainNetwork}</span>
              </>
            )}
          </div>
          <div className="bid-txt d-flex">
            <span className="txt-left">{isAuction ? 'You must bid at least' : 'Price'}</span>
            <span className="txt-right">{`£ ${getStringWithCommas(discountedPrice)}`}</span>
          </div>
          {referralDiscount && referralDiscount.referralDiscount && referralDiscount.sellingPriceMinusDiscount && (
            <>
              <div className="bid-txt d-flex">
                <span className="txt-left">Referral Discount</span>
                <span className="txt-right">{`£ ${getStringWithCommas(referralDiscount.referralDiscount)}`}</span>
              </div>
              <div className="bid-txt d-flex">
                <span className="txt-left">Total Price</span>
                <span className="txt-right">{`£ ${getStringWithCommas(referralDiscount.sellingPriceMinusDiscount)}`}</span>
              </div>
            </>
          )}
          {paymentMode === 'fiat Currency' && (
            <>
              <div className="bid-txt d-flex">
                <span className="txt-left">Charges</span>
                <span className="txt-right">{`£ ${getStringWithCommas(charges)}`}</span>
              </div>
              <div className="bid-txt d-flex">
                <span className="txt-left">Total</span>
                <span className="txt-right">{`£ ${getStringWithCommas(totalPrice)} `}</span>
              </div>
            </>
          )}

          {paymentMode !== 'fiat Currency' && (
            <>
              {isAuction && (
                <Form.Group className="form-group">
                  <Form.Label>
                    <FormattedMessage id="bidAmountInGBP" />
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="bidAmount"
                    onKeyDown={forceAsPositiveNumber}
                    onWheel={(e) => e.target.blur()}
                    placeholder="Enter Bid Amount"
                    className={errors.bidAmount && 'error'}
                    {...register('bidAmount', {
                      required: validationErrors.required,
                      validate: (value) => value >= assetGbpPrice || validationErrors.bidAmount
                    })}
                  />
                  {errors.bidAmount && (
                    <Form.Control.Feedback type="invalid" className="invalidFeedback">
                      {errors.bidAmount.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              )}
              {paymentMode === 'Nuu coin' && (
                <>
                  <div className="bid-txt d-flex">
                    <span className="txt-left">
                      <FormattedMessage id="nuuCoinValue" />
                    </span>
                    <span className="txt-right">{`${discountedPrice * nuuCoinsMultiplier} Nuucoins`}</span>
                  </div>
                  <div className="balance d-flex justify-content-between mb-5">
                    <span className="bal-left text-capitalize">
                      <FormattedMessage id="yourBalance" />
                    </span>
                    <span className="bal-right">{`${userData?.coinCount || 0} Nuucoins (£ ${
                      nuuCoinsMultiplier * userData?.coinCount
                    })`}</span>
                  </div>
                </>
              )}
            </>
          )}

          {paymentMode !== 'Crypto Currency' && (
            <WalletAddressField name="walletAddress" errors={errors} register={register} setValue={setValue} clearErrors={clearErrors} />
          )}

          <Button
            type="submit"
            className="white-btn"
            form="payment-mode-form-mystery"
            onClick={handleSubmit(onFirstStepSubmit)}
            disabled={loading}
          >
            {assetDetails?.auctionId ? <FormattedMessage id="placeBid" /> : <FormattedMessage id="next" />}
            {loading && <Spinner animation="border" size="sm" />}
          </Button>
        </Form>
      )}
    </>
  )
}
PaymentModeForm.propTypes = {
  hidden: PropTypes.bool,
  isAuction: PropTypes.bool,
  assetDetails: PropTypes.object,
  paymentModeFormMethods: PropTypes.object,
  onFirstStepSubmit: PropTypes.func,
  loading: PropTypes.bool,
  getNetworkPrice: PropTypes.func,
  userData: PropTypes.object,
  referralDiscount: PropTypes.object
}
export default PaymentModeForm
