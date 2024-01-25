import React, { useEffect, useState } from 'react'
import { Button, Form, ToggleButton } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'

import UserInfo from 'shared/components/user-info'
import { blockchainNetworkOptions, paymentModeOptions, TOAST_TYPE } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import { allRoutes } from 'shared/constants/allRoutes'
import { forceAsPositiveNumber, getStringWithCommas } from 'shared/utils'
import WalletAddressField from 'shared/components/wallet-address-field'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { CLEAR_WALLET_ACCOUNT } from 'modules/wallet/redux/action'
import { disconnect } from 'modules/walletConnect'

const PaymentModeForm = ({
  hidden,
  isAuction,
  assetDetails,
  paymentModeFormMethods,
  onFirstStepSubmit,
  loading,
  getNetworkPrice,
  userData,
  payoutToCreator,
  payoutToSeller,
  referralDiscount,
  soldEditionCount
}) => {
  const {
    watch,
    register,
    formState: { errors },
    control,
    clearErrors,
    setValue,
    handleSubmit
  } = paymentModeFormMethods

  const paymentMode = watch('paymentMode')
  const dispatch = useDispatch()
  const [paymentOptions, setPaymentOptions] = useState([])
  const [nuuCoinsMultiplier, setNuuCoinsMultiplier] = useState()
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1)

  const nuuCoinsStore = useSelector((state) => state.nuuCoins)
  const exchangeRateStore = useSelector((state) => state.exchangeRate)

  useEffect(() => {
    if (assetDetails && assetDetails?.auctionId) {
      setPaymentOptions(paymentModeOptions.slice(0, 1))
    } else {
      setPaymentOptions(paymentModeOptions)
    }
  }, [assetDetails])

  useEffect(() => {
    if (nuuCoinsStore?.nuuCoinsDetails?.nuuCoin?.length) {
      setNuuCoinsMultiplier(nuuCoinsStore?.nuuCoinsDetails?.nuuCoin[0]?.coinRate)
    }
  }, [nuuCoinsStore])

  useEffect(() => {
    setCurrencyMultiplier(null)
    if (assetDetails?.id) {
      dispatch(getExchangeRate({ convertSymbol: 'USD' }))
    }
  }, [assetDetails, paymentMode])

  useEffect(() => {
    if (exchangeRateStore?.exchangeRateData?.exchangeRate) {
      setCurrencyMultiplier(exchangeRateStore?.exchangeRateData?.exchangeRate[0]?.exchangeRate)
    }
  }, [exchangeRateStore])

  const assetGbpPrice = isAuction ? assetDetails?.auction?.nextBid : assetDetails?.sellingPrice
  let discountedPrice = isAuction ? assetDetails?.auction?.nextBid : assetDetails?.sellingPrice
  const chargeValue = parseFloat(assetGbpPrice) * 0.03
  const charges = parseFloat(chargeValue).toFixed(2)
  let newSellerPayout = payoutToSeller
  let newCreatorPayout = payoutToCreator

  if (referralDiscount && referralDiscount.sellingPriceMinusDiscount && !assetDetails?.auctionId) {
    discountedPrice = referralDiscount.sellingPriceMinusDiscount
    newCreatorPayout = (discountedPrice * (assetDetails?.asset.royaltyPercentage / 100)).toFixed(2)
    newSellerPayout = (discountedPrice - newCreatorPayout).toFixed(2)
  }
  const totalPriceValue = parseFloat(discountedPrice) + chargeValue
  const totalPrice = parseFloat(totalPriceValue).toFixed(2)
  useEffect(() => {
    if (paymentMode === 'fiat Currency' && currencyMultiplier && Number(totalPrice) < 10 * currencyMultiplier) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: `The price of the asset has to be minimum 10 USD (${10 * currencyMultiplier} GBP) to make a purchase using fiat payment`,
          type: TOAST_TYPE.Error
        }
      })
    }
  }, [totalPrice, paymentMode])

  const blockchainNetworkChangeHandler = async () => {
    dispatch({ type: CLEAR_WALLET_ACCOUNT })
    await disconnect()
  }

  return (
    <>
      {assetDetails && (
        <Form autoComplete="off" hidden={hidden} className="payment-mode-form" id="payment-mode-form">
          <h4 className="title">{assetDetails?.asset?.name}</h4>
          <div className="owner-artist d-flex flex-wrap">
            {assetDetails?.asset?.currentOwnerId && (
              <UserInfo
                profileImage={assetDetails?.currentOwner?.profilePicUrl}
                name={assetDetails?.asset?.currentOwner?.userName || assetDetails?.owner?.userName}
                isOwner
                link={allRoutes.creatorCollected(assetDetails?.asset?.currentOwnerId)}
              />
            )}
            <UserInfo
              profileImage={assetDetails?.creator?.profilePicUrl}
              name={assetDetails?.creator?.userName}
              isArtist
              link={allRoutes.creatorCollected(assetDetails?.creator?.id)}
            />
          </div>
          <div className="payment-mode">
            <h6>
              <FormattedMessage id="modeOfPayment" />
            </h6>
            <div className="payment-tabs d-flex flex-wrap">
              {assetDetails &&
                paymentOptions?.map((type, index) => (
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
                      blockchainNetworkChangeHandler()
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

          <div className="mt-5 mb-5">
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
              <span className="txt-right">{`£ ${getStringWithCommas(assetGbpPrice)}`}</span>
            </div>
            {soldEditionCount && soldEditionCount > 0 && (
              <>
                {paymentMode === 'Crypto Currency' && (
                  <div className="bid-txt d-flex">
                    <span className="txt-left">Payout to Creator</span>
                    <span className="txt-right">{`£ ${getStringWithCommas(newCreatorPayout)}`}</span>
                  </div>
                )}

                {paymentMode === 'Crypto Currency' && (
                  <div className="bid-txt d-flex">
                    <span className="txt-left">Payout to Seller</span>
                    <span className="txt-right">{`£ ${getStringWithCommas(newSellerPayout)}`}</span>
                  </div>
                )}
              </>
            )}

            {referralDiscount && referralDiscount.referralDiscount && referralDiscount.sellingPriceMinusDiscount && !assetDetails?.auctionId && (
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
          </div>

          {paymentMode !== 'Crypto Currency' && (
            <WalletAddressField name="walletAddress" errors={errors} register={register} setValue={setValue} clearErrors={clearErrors} />
          )}

          <Button
            type="submit"
            className="white-btn"
            form="payment-mode-form"
            onClick={handleSubmit(onFirstStepSubmit)}
            disabled={loading || (paymentMode === 'fiat Currency' && currencyMultiplier && ((Number(totalPrice) < 10) * currencyMultiplier))}
          >
            {assetDetails?.auctionId ? <FormattedMessage id="placeBid" /> : <FormattedMessage id="next" />}
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
  payoutToCreator: PropTypes.number,
  payoutToSeller: PropTypes.number,
  referralDiscount: PropTypes.object,
  soldEditionCount: PropTypes.number
}
export default PaymentModeForm
