import React from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import PaymentCardShow from 'modules/paymentCard/paymentCardShow'
import { getStringWithCommas } from 'shared/utils'

const CardForm = ({ hidden, cardFormMethods, onCardSubmit, loading, paymentCardList, onCardSelect, selectedCard, assetDetails }) => {
  const { handleSubmit } = cardFormMethods
  const assetGbpPrice = assetDetails?.sellingPrice
  const chargeValue = parseFloat(assetGbpPrice) * 0.03
  const charges = parseFloat(chargeValue).toFixed(2)
  const totalPriceValue = parseFloat(assetGbpPrice) + chargeValue
  const totalPrice = parseFloat(totalPriceValue).toFixed(2)

  return (
    <Form hidden={hidden} autoComplete="off" id="card-form-mystery" className="payment-mode-form">
      <div>
        <div className="checkout-cards">
          <>
            {paymentCardList?.cards?.length ? (
              paymentCardList?.cards.map((card) => (
                <PaymentCardShow key={card.id} card={card} onCardSelect={onCardSelect} selectedCard={selectedCard} />
              ))
            ) : (
              <h4 className="my-5 d-flex align-items-center justify-content-center">
                <FormattedMessage id="noDataFound" />
              </h4>
            )}
          </>
        </div>

        <div className="balance d-flex justify-content-between mb-5">
          <span className="bal-left text-capitalize">
            <FormattedMessage id="price" />
          </span>
          <span className="bal-right">{`£ ${getStringWithCommas(assetGbpPrice)}`}</span>
        </div>

        <div className="balance d-flex justify-content-between mb-5">
          <span className="bal-left text-capitalize">
            <FormattedMessage id="chargeAmount" />
          </span>
          <span className="bal-right">{`£ ${getStringWithCommas(charges)}`}</span>
        </div>

        <div className="balance d-flex justify-content-between mb-5">
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
        form="card-form-mystery"
        disabled={loading}
      >
        Buy NFT
        {loading && <Spinner animation="border" size="sm" />}
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
  assetDetails: PropTypes.object
}
export default CardForm
