import React from 'react'
import { Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import PaymentCardShow from 'modules/paymentCard/paymentCardShow'
import { getStringWithCommas } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'

const CardForm = ({ referralDiscount, hidden, cardFormMethods, onCardSubmit, loading, paymentCardList, onCardSelect, selectedCard, assetDetails }) => {
  const { handleSubmit } = cardFormMethods
  const assetGbpPrice = assetDetails?.sellingPrice
  let discountedPrice = assetDetails?.sellingPrice
  let referralDiscountValue = 0
  if (referralDiscount && referralDiscount.sellingPriceMinusDiscount && !assetDetails?.auctionId) {
    discountedPrice = referralDiscount.sellingPriceMinusDiscount
    referralDiscountValue = referralDiscount.referralDiscount
  }
  const chargeValue = parseFloat(assetGbpPrice) * 0.03
  const charges = parseFloat(chargeValue).toFixed(2)
  const totalPriceValue = parseFloat(discountedPrice) + chargeValue
  const totalPrice = parseFloat(totalPriceValue).toFixed(2)

  return (
    <Form hidden={hidden} autoComplete="off" id="card-form" className="payment-mode-form">
      <div>
        <div className="checkout-cards">
          <>
            {paymentCardList?.cards?.length ? (
              paymentCardList?.cards.map((card) => (
                <PaymentCardShow key={card.id} card={card} onCardSelect={onCardSelect} selectedCard={selectedCard} />
              ))
            ) : (
              <div className="no-card-link">
                No cards Found, <Link to={allRoutes.profileCardsAndAddresses}>Click here</Link> to add your card
              </div>
            )}
          </>
        </div>

        <div className="balance d-flex justify-content-between">
          <span className="bal-left text-capitalize">
            <FormattedMessage id="price" />
          </span>
          <span className="bal-right">{`£ ${getStringWithCommas(assetGbpPrice)}`}</span>
        </div>

        <div className="balance d-flex justify-content-between">
          <span className="bal-left text-capitalize">
            <FormattedMessage id="chargeAmount" />
          </span>
          <span className="bal-right">{`+ £ ${getStringWithCommas(charges)}`}</span>
        </div>
        <>{
          referralDiscountValue && !assetDetails?.auctionId ? (<div className="balance d-flex justify-content-between">
              <span className="bal-left text-capitalize">
                <FormattedMessage id="referralDiscount" />
              </span>
              <span className="bal-right">{`- £ ${getStringWithCommas(referralDiscountValue)}`}</span>
            </div>) : null
        }
        </>
        <div className="balance d-flex justify-content-between">
          <span className="bal-left text-capitalize">
            <FormattedMessage id="totalAmount" />
          </span>
          <span className="bal-right">{`£ ${getStringWithCommas(totalPrice)}`}</span>
        </div>
      </div>
      <Button
        type="submit"
        className="white-btn payment-btn"
        onClick={handleSubmit(onCardSubmit)}
        form="card-form"
        disabled={!selectedCard || loading}
      >
        Buy NFT
      </Button>
    </Form>
  )
}
CardForm.propTypes = {
  hidden: PropTypes.bool,
  cardFormMethods: PropTypes.object,
  onCardSubmit: PropTypes.func,
  isForNewCard: PropTypes.bool,
  loading: PropTypes.bool,
  paymentCardList: PropTypes.object,
  onCardSelect: PropTypes.func,
  selectedCard: PropTypes.any,
  assetDetails: PropTypes.object,
  referralDiscount: PropTypes.object
}
export default CardForm
