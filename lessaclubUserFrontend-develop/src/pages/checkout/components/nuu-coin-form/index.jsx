import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

import { allRoutes } from 'shared/constants/allRoutes'
import { getStringWithCommas } from 'shared/utils'
import { getNuuCoinsDetails } from 'modules/nuuCoins/redux/service'

const NuuCoinForm = ({ referralDiscount, nuuCoinFormMethods, onNuuCoinFormSubmit, hidden, loading, assetDetails, userData, bidAmount, getNetworkPrice }) => {
  const dispatch = useDispatch()
  const [payBtnDisable, setPayBtnDisable] = useState(false)
  const [nuuCoinsMultiplier, setNuuCoinsMultiplier] = useState()

  const nuuCoinsStore = useSelector((state) => state.nuuCoins)

  const assetGbpPrice = assetDetails?.auctionId ? bidAmount : assetDetails?.sellingPrice

  let referralDiscountValue = 0
  let discountedPrice = 0
  if (referralDiscount && referralDiscount.sellingPriceMinusDiscount && !assetDetails?.auctionId) {
    discountedPrice = referralDiscount.sellingPriceMinusDiscount
    referralDiscountValue = referralDiscount.referralDiscount
  }

  const { handleSubmit } = nuuCoinFormMethods

  useEffect(() => {
    if (userData) {
      if (Number(userData?.coinCount || 0) < Number(assetGbpPrice)) {
        setPayBtnDisable(true)
      }
    }
  }, [userData, assetGbpPrice])

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
          <FormattedMessage id="assetPrice" />
        </Form.Label>
        <>{
          referralDiscountValue && !assetDetails?.auctionId ? (<Form.Control
            type="text"
            value={`£ ${getStringWithCommas(discountedPrice)}`}
            disabled
          />) : (<Form.Control
            type="text"
            value={`£ ${getStringWithCommas(assetGbpPrice)}`}
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
          <FormattedMessage id="nuuCoinValue" />
        </Form.Label>
        <>{
          referralDiscountValue && !assetDetails?.auctionId ? (<Form.Control
            type="text"
            value={`${discountedPrice * nuuCoinsMultiplier} Nuucoins`}
            disabled
          />) : (<Form.Control
            type="text"
            value={`${assetGbpPrice * nuuCoinsMultiplier} Nuucoins`}
            disabled
          />)
        }
        </>
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
  referralDiscount: PropTypes.object
}
export default NuuCoinForm
