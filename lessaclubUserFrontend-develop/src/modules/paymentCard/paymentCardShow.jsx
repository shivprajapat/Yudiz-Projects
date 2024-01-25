import React from 'react'
import PropTypes from 'prop-types'

import { creditCardIcon } from 'assets/images'

const PaymentCardShow = ({ card, onCardSelect, selectedCard }) => {
  return (
    <div className="card-list" key={card.id}>
      <div className="card-single-list d-flex justify-content-between">
        <div className="list-left d-flex">
          <img src={creditCardIcon} alt="credit-card" className="img-fluid mastercard flex-shrink-0" />
          <div className="expiry d-flex">
            <span className="expiry-txt">XXXX-XXXX-XXXX-{card.last4digits} </span>
            <span className="expiry-date">
              {card.expMonth}/{card.expYear}
            </span>
          </div>
        </div>
        <input type="radio" name="selectCard" value={card.id} checked={selectedCard === parseInt(card.id)} onChange={onCardSelect} />
      </div>
    </div>
  )
}

PaymentCardShow.propTypes = {
  card: PropTypes.object,
  onCardSelect: PropTypes.func,
  selectedCard: PropTypes.any
}

export default PaymentCardShow
