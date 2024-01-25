import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

import { allRoutes } from 'shared/constants/allRoutes'
import { getNuuCoinsDetails } from 'modules/nuuCoins/redux/service'
import { getStringWithCommas } from 'shared/utils'

const NuuCoinForm = ({ nuuCoinFormMethods, onNuuCoinFormSubmit, hidden, loading, assetDetails, userData, bidAmount, getNetworkPrice }) => {
  const dispatch = useDispatch()
  const [payBtnDisable, setPayBtnDisable] = useState(false)
  const [nuuCoinsMultiplier, setNuuCoinsMultiplier] = useState()

  const nuuCoinsStore = useSelector((state) => state.nuuCoins)
  const referralDiscountData = useSelector((state) => state.checkout.referralDiscount)
  const referralDiscountPrice = referralDiscountData?.referral?.sellingPriceMinusDiscount
  const referralDiscountedPrice = referralDiscountData?.referral?.referralDiscount
  const isReferralData = referralDiscountData && Object.keys(referralDiscountData).length !== 0

  const assetNuuCoinPrice = assetDetails?.price

  const { handleSubmit } = nuuCoinFormMethods

  useEffect(() => {
    if (userData) {
      if (Number(userData?.coinCount || 0) < Number(assetNuuCoinPrice)) {
        setPayBtnDisable(true)
      }
    }
  }, [userData, assetNuuCoinPrice])

  useEffect(() => {
    dispatch(getNuuCoinsDetails({ date: (+new Date() / 1000) | 0 }))
  }, [])

  useEffect(() => {
    if (nuuCoinsStore?.nuuCoinsDetails?.nuuCoin?.length) {
      setNuuCoinsMultiplier(nuuCoinsStore?.nuuCoinsDetails?.nuuCoin[0]?.coinRate)
    }
  }, [nuuCoinsStore])

  return (
    <Form hidden={hidden} autoComplete="off">
      {loading && (
        <h6 className="invalidFeedback">
          <FormattedMessage id="pleaseDoNotRefreshThePage" />
        </h6>
      )}
      {payBtnDisable && (
        <div className="invalidFeedback">
          <FormattedMessage id="insufficientBalanceInYourWallet" />
        </div>
      )}

      <Form.Group className="form-group">
        <Form.Label>
          <FormattedMessage id="nuuCoinValue" />
        </Form.Label>
        <Form.Control
          type="text"
          value={`${isReferralData ? referralDiscountPrice : assetNuuCoinPrice} Nuucoins (£ ${
            isReferralData ? nuuCoinsMultiplier * referralDiscountPrice : nuuCoinsMultiplier * assetNuuCoinPrice
          })`}
          disabled
        />
      </Form.Group>

      <>
        {isReferralData ? (
          <div className="balance d-flex justify-content-between">
            <span className="bal-left text-capitalize">
              <FormattedMessage id="referralDiscount" />
            </span>
            <span className="bal-right">{`- £ ${getStringWithCommas(referralDiscountedPrice)}`}</span>
          </div>
        ) : null}
      </>

      <Form.Group className="form-group">
        <Form.Label>
          <FormattedMessage id="walletBalance" />
        </Form.Label>
        <Form.Control type="text" disabled value={`${userData?.coinCount || 0} Nuucoins (£ ${nuuCoinsMultiplier * userData?.coinCount})`} />
      </Form.Group>

      {!payBtnDisable && (
        <Button
          type="submit"
          disabled={loading || payBtnDisable}
          className="white-btn payment-btn"
          onClick={handleSubmit(onNuuCoinFormSubmit)}
        >
          {loading ? <FormattedMessage id="paymentInProgress" /> : <FormattedMessage id="payNow" />}
          {loading && <Spinner animation="border" size="sm" />}
        </Button>
      )}
      {payBtnDisable && (
        <>
          <Button className="white-btn payment-btn" as={Link} to={allRoutes.nuuCoins}>
            <FormattedMessage id="clickHereToPurchaseNuuCoins" />
          </Button>
        </>
      )}
    </Form>
  )
}
NuuCoinForm.propTypes = {
  nuuCoinFormMethods: PropTypes.object,
  onNuuCoinFormSubmit: PropTypes.func,
  hidden: PropTypes.bool,
  loading: PropTypes.bool,
  assetDetails: PropTypes.object,
  userData: PropTypes.object,
  bidAmount: PropTypes.string,
  getNetworkPrice: PropTypes.func
}
export default NuuCoinForm
