/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Spinner, ToggleButton } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { useSelector } from 'react-redux'

import { blockchainNetworkOptions, paymentModeOptions } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import { allRoutes } from 'shared/constants/allRoutes'
import { forceAsPositiveNumber, getNetworkSymbol } from 'shared/utils'
import { isWalletAddressValid } from 'modules/metaMask/utility'

const PaymentModeForm = ({ hidden, isAuction, assetDetails, paymentModeFormMethods, onFirstStepSubmit, loading, getNetworkPrice }) => {
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

  const [paymentOptions, setPaymentOptions] = useState([])

  const walletAccountStore = useSelector((state) => state.wallet)

  useEffect(() => {
    if (walletAccountStore) {
      setValue('walletAddress', walletAccountStore.account)
      clearErrors('walletAddress')
    }
  }, [walletAccountStore])

  useEffect(() => {
    if (assetDetails && assetDetails?.auctionId) {
      setPaymentOptions(paymentModeOptions.slice(0, 1))
    } else {
      setPaymentOptions(paymentModeOptions)
    }
  }, [assetDetails])

  const assetGbpPrice = isAuction ? assetDetails?.auction?.nextBid || 0.02 : assetDetails?.sellingPrice

  return (
    <>
      <Form autoComplete="off" hidden={hidden} className="payment-mode-form" id="payment-mode-form">
        <div className="payment-mode">
          <h4 className="title">Mode of Payment</h4>
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

        {assetDetails && !assetDetails?.blockchainNetwork && (
          <Form.Group className="form-group">
            <Form.Label>Blockchain Network</Form.Label>
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
          <span className="txt-left">Blockchain Network</span>
          <span className="txt-right">{assetDetails?.blockchainNetwork}</span>
        </div>
        <div className="bid-txt d-flex">
          <span className="txt-left">{isAuction ? 'You must bid at least' : 'Price'}</span>
          <span className="txt-right">
            {`£ ${assetGbpPrice} (${getNetworkPrice(assetGbpPrice)} ${getNetworkSymbol(assetDetails?.blockchainNetwork || 'Ethereum')})`}
          </span>
        </div>

        {paymentMode !== 'fiat Currency' && (
          <>
            {isAuction && (
              <Form.Group className="form-group">
                <Form.Label>Bid amount in GBP</Form.Label>
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
            {/* TODO: hide for now */}
            {/* <div className="balance d-flex justify-content-between">
              <span className="bal-left text-capitalize">Your Balance</span>
              <span className="bal-right">2000 ETH</span>
            </div> */}
          </>
        )}

        <Row>
          <Col lg={12}>
            {paymentMode === 'fiat Currency' && (
              <Form.Group className="form-group">
                <Form.Label>Wallet Address</Form.Label>
                <Form.Control
                  type="text"
                  name="walletAddress"
                  className={errors.walletAddress && 'error'}
                  {...register('walletAddress', {
                    required: validationErrors.required,
                    validate: (value) => isWalletAddressValid(value) || validationErrors.walletAddress
                  })}
                  placeholder={'Enter Wallet Address'}
                />
                {errors.walletAddress && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.walletAddress.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}
          </Col>
          <Col lg={12}>
            <Button
              type="submit"
              className="white-btn"
              form="payment-mode-form"
              onClick={handleSubmit(onFirstStepSubmit)}
              disabled={loading}
            >
              {assetDetails?.auctionId ? 'place bid' : 'next'}
              {loading && <Spinner animation="border" size="sm" />}
            </Button>
          </Col>
        </Row>
      </Form>
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
  getNetworkPrice: PropTypes.func
}
export default PaymentModeForm
