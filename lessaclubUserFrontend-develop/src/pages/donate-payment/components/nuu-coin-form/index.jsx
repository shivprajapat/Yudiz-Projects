import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { allRoutes } from 'shared/constants/allRoutes'
import { getStringWithCommas } from 'shared/utils'

const NuuCoinForm = ({ nuuCoinFormMethods, onNuuCoinFormSubmit, hidden, loading, donationPurchaseData, userData, nuuCoinsMultiplier }) => {
  const [payBtnDisable, setPayBtnDisable] = useState(false)

  const gbpAmount = donationPurchaseData?.amount

  const { handleSubmit } = nuuCoinFormMethods

  useEffect(() => {
    if (userData) {
      if (Number(userData?.coinCount || 0) < Number(gbpAmount)) {
        setPayBtnDisable(true)
      }
    }
  }, [userData, gbpAmount])

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
          <FormattedMessage id="assetPrice" />
        </Form.Label>
        <Form.Control
          type="text"
          value={`£ ${getStringWithCommas(gbpAmount)}`}
          disabled
        />
      </Form.Group>
      <Form.Group className="form-group">
        <Form.Label>
          <FormattedMessage id="nuuCoinValue" />
        </Form.Label>
        <Form.Control
          type="text"
          value={`${gbpAmount * nuuCoinsMultiplier} Nuucoins`}
          disabled
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>
          <FormattedMessage id="walletBalance" />
        </Form.Label>
        <Form.Control
          type="text"
          disabled
          value={`${userData?.coinCount || 0} Nuucoins (£ ${nuuCoinsMultiplier * userData?.coinCount})`}
        />
      </Form.Group>

      {!payBtnDisable && (
        <Button
          type="submit"
          disabled={loading || payBtnDisable}
          className="white-btn payment-btn"
          onClick={handleSubmit(onNuuCoinFormSubmit)}
        >
          {loading ? <FormattedMessage id="paymentInProgress" /> : <FormattedMessage id="payNow" />}
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
  getNetworkPrice: PropTypes.func,
  referralDiscount: PropTypes.object,
  donationPurchaseData: PropTypes.object,
  nuuCoinsMultiplier: PropTypes.number
}
export default NuuCoinForm
