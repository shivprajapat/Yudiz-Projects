import React, { useEffect, useState } from 'react'
import { Form, InputGroup, ToggleButton, Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Controller } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { poundIcon, cryptoIcon } from 'assets/images'
import { nftTypes, ONLY_POSITIVE_DECIMAL } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { forceAsPositiveNumber } from 'shared/utils'
import WalletAddressField from 'shared/components/wallet-address-field'
import SelectWalletModal from 'shared/components/select-wallet-modal'

const StepTwo = ({ register, errors, control, setValue, hidden, watch, stepOneValue, clearErrors }) => {
  const dispatch = useDispatch()
  const { type } = useParams()

  const minimumBidPrice = watch('minimumBidPrice')
  const isExclusive = watch('isExclusive')

  const currencyConverterStore = useSelector((state) => state.currencyConverter)
  const exchangeRateStore = useSelector((state) => state.exchangeRate)
  const walletAccountStore = useSelector((state) => state.wallet)
  const userStore = useSelector((state) => state.user.user)

  const [connectWallet, setConnectWallet] = useState(false)

  const labels = {
    royaltyPercentage: useIntl().formatMessage({ id: 'enterYourRoyaltyPercentage' }),
    donation: useIntl().formatMessage({ id: 'enterYourDonation' }),
    shortDescription: useIntl().formatMessage({ id: 'enterTheProductShortDescription' }),
    walletAddress: useIntl().formatMessage({ id: 'enterYourWalletAddress' })
  }

  useEffect(() => {
    if (minimumBidPrice && Number(minimumBidPrice) >= 10000) {
      setValue('isExclusive', true)
    } else {
      setValue('isExclusive', false)
    }
  }, [minimumBidPrice])

  useEffect(() => {
    if (currencyConverterStore.convertedData) {
      setValue('networkSellingPrice', Number(currencyConverterStore?.convertedData?.quote?.ETH?.price))
    }
  }, [currencyConverterStore])

  useEffect(() => {
    dispatch(getExchangeRate({ convertSymbol: 'ETH' }))
  }, [])

  useEffect(() => {
    if (exchangeRateStore?.exchangeRateData?.exchangeRate && minimumBidPrice) {
      const exchangedRate = exchangeRateStore?.exchangeRateData?.exchangeRate[0]?.exchangeRate
      setValue('networkSellingPrice', exchangedRate * minimumBidPrice)
    }
  }, [exchangeRateStore, minimumBidPrice])

  useEffect(() => {
    if (walletAccountStore) {
      setValue('walletAddress', walletAccountStore.account)
    }
  }, [walletAccountStore])

  const onBlurMinimumBidPrice = (e) => {
    if (e.target.value) {
      setValue('minimumBidPrice', e.target.value)
    }
  }

  const onChangeSelectWallet = () => {
    setConnectWallet((prev) => !prev)
  }

  return (
    <>
      <Form hidden={hidden} className="step-two" autoComplete="off" id="stepTwoForm">
        {!type && (
          <Form.Group className="form-group form-control-margin">
            <Form.Label>
              <FormattedMessage id="royalty" /> (<FormattedMessage id="inPercentage" />)
            </Form.Label>
            <Form.Control
              type="number"
              name="royaltyPercentage"
              onKeyDown={forceAsPositiveNumber}
              onWheel={(e) => e.target.blur()}
              className={errors.royaltyPercentage && 'error'}
              {...register('royaltyPercentage', {
                required: validationErrors.required,
                pattern: { value: ONLY_POSITIVE_DECIMAL, message: validationErrors.percentage },
                validate: (value) => {
                  if (value > 50) {
                    return validationErrors.royaltyMaxPercentage
                  }
                  return true
                }
              })}
              placeholder={labels.royaltyPercentage}
            />
            {errors.royaltyPercentage && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.royaltyPercentage.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        )}

        <Form.Group className="form-group">
          <Form.Label>
            <FormattedMessage id="donation" /> (<FormattedMessage id="inPercentage" />)
          </Form.Label>
          <Form.Control
            type="number"
            name="donationPercentage"
            onKeyDown={forceAsPositiveNumber}
            onWheel={(e) => e.target.blur()}
            className={errors.donationPercentage && 'error'}
            {...register('donationPercentage', {
              required: validationErrors.required,
              validate: (value) => {
                if (value < 0.5) {
                  return validationErrors.donationMinPercentage
                }
                if (value > 10) {
                  return validationErrors.donationMaxPercentage
                }
                return true
              }
            })}
            placeholder={labels.donation}
          />
          {errors.donationPercentage && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.donationPercentage.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>
            {stepOneValue.artworkHiddenType === 'auction' ? <FormattedMessage id="minimumBid" /> : <FormattedMessage id="sellingPrice" />}
          </Form.Label>
          <div className="d-flex min-bid">
            <div className="min-bid-inner">
              <InputGroup className={errors.minimumBidPrice && 'error'}>
                <InputGroup.Text className="d-flex justify-content-center align-items-center">
                  <img src={poundIcon} alt="pound-icon" className="img-fluid" /> <span>GBP</span>
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  name="minimumBidPrice"
                  onKeyDown={forceAsPositiveNumber}
                  onWheel={(e) => e.target.blur()}
                  {...register('minimumBidPrice', {
                    valueAsNumber: true,
                    required: validationErrors.required,
                    pattern: { value: ONLY_POSITIVE_DECIMAL, message: validationErrors.price },
                    validate: (value) => {
                      if (!userStore?.kycVerified && value && Number(value) >= 10000) {
                        return 'Please complete your KYC'
                      } else {
                        return value > 0 || validationErrors.price
                      }
                    }
                  })}
                  onBlur={onBlurMinimumBidPrice}
                />
              </InputGroup>
              {errors.minimumBidPrice && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.minimumBidPrice.message}
                </Form.Control.Feedback>
              )}
            </div>
            <div className="min-bid-inner">
              <InputGroup>
                <InputGroup.Text className="d-flex justify-content-center align-items-center">
                  <img src={cryptoIcon} alt="pound-icon" className="img-fluid" /> <span>ETH</span>
                </InputGroup.Text>
                <Form.Control type="number" name="networkSellingPrice" {...register('networkSellingPrice')} disabled />
              </InputGroup>
            </div>
          </div>
        </Form.Group>

        <div className="artwork-price">
          <div className="artwork-price-inner d-flex">
            {nftTypes.map((type, index) => (
              <div className="artwork-price-btn" key={index}>
                <Controller
                  name="isExclusive"
                  control={control}
                  render={({ field: { onChange, value = [] } }) => (
                    <ToggleButton
                      key={index}
                      id={`artwork-chain-${index}`}
                      type="radio"
                      name="isExclusive"
                      disabled
                      className="normal-btn"
                      value={type.value}
                      checked={isExclusive ? type.value === 'exclusive' : type.value === 'multiChain'}
                      onChange={(e) => onChange(e)}
                    >
                      {type.name}
                    </ToggleButton>
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <Form.Group className="form-group">
          <Form.Label>
            <FormattedMessage id="properties" />{' '}
            <Form.Text className="text-muted mx-1">
              (<FormattedMessage id="max1500CharactersAllowed" />)
            </Form.Text>
          </Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            maxLength={1500}
            name="shortDescription"
            className={errors.shortDescription && 'error'}
            {...register('shortDescription', {
              required: validationErrors.required
            })}
            placeholder={labels.shortDescription}
          />
          {errors.shortDescription && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.shortDescription.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <WalletAddressField name="walletAddress" errors={errors} register={register} setValue={setValue} clearErrors={clearErrors} />
        {connectWallet && <SelectWalletModal networkGeneric={true} show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} />}
        <Form.Group className="form-group">
          <Button
            className="white-btn"
            onClick={onChangeSelectWallet}
          >
            Connect Wallet
          </Button>
        </Form.Group>
      </Form>
    </>
  )
}
StepTwo.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
  control: PropTypes.object,
  hidden: PropTypes.bool,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  stepOneValue: PropTypes.object,
  clearErrors: PropTypes.func
}
export default StepTwo
