import React from 'react'
import { Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import PaymentCardShow from 'modules/paymentCard/paymentCardShow'
import { getStringWithCommas } from 'shared/utils'

const CardForm = ({ hidden, cardFormMethods, onCardSubmit, loading, paymentCardList, onCardSelect, selectedCard, donationPurchaseData }) => {
  const { handleSubmit } = cardFormMethods
  const gbpAmount = donationPurchaseData?.amount
  const chargeValue = parseFloat(gbpAmount) * 0.03
  const charges = parseFloat(chargeValue).toFixed(2)
  const totalPriceValue = parseFloat(gbpAmount) + chargeValue
  const totalPrice = parseFloat(totalPriceValue).toFixed(2)

  return (
    <Form hidden={hidden} autoComplete="off" id="card-form">
      <div className="checkout-cards">
        <div className="card-list">
          {paymentCardList?.cards?.length ? (
            paymentCardList?.cards.map((card) => (
              <PaymentCardShow key={card.id} card={card} onCardSelect={onCardSelect} selectedCard={selectedCard} />
            ))
          ) : (
            <h4 className="my-5 d-flex align-items-center justify-content-center">
              <FormattedMessage id="noDataFound" />
            </h4>
          )}
        </div>
      </div>

      <div className="bid-txt d-flex justify-content-between">
        <span className="txt-left">
          <FormattedMessage id="price" />
        </span>
        <span className="txt-right">{`£ ${getStringWithCommas(donationPurchaseData?.amount)}`}</span>
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
      <Button type="submit" className="white-btn payment-btn" onClick={handleSubmit(onCardSubmit)} form="card-form" disabled={loading}>
        Donate
      </Button>
    </Form>
  )
}
CardForm.propTypes = {
  hidden: PropTypes.bool,
  cardFormMethods: PropTypes.object,
  onCardSubmit: PropTypes.func,
  isForNewCard: PropTypes.bool,
  setIsForNewCard: PropTypes.func,
  loading: PropTypes.bool,
  paymentCardList: PropTypes.object,
  onCardSelect: PropTypes.func,
  selectedCard: PropTypes.any,
  donationPurchaseData: PropTypes.object
}
export default CardForm
