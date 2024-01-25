import React from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { plusIcon, mastercardIcon } from 'assets/images'

import { validationErrors } from 'shared/constants/validationErrors'
import { forceTextInputAsNumber, handleCardKeyUp } from 'shared/utils'

const CardForm = ({ hidden, cardFormMethods, onCardSubmit, isForNewCard, setIsForNewCard, loading }) => {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = cardFormMethods

  const handleNewCard = () => {
    setIsForNewCard(true)
  }

  return (
    <Form hidden={hidden} autoComplete="off" id="card-form">
      <div className="checkout-cards">
        {isForNewCard && (
          <Row>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  name="card"
                  placeholder="XXXX XXXX XXXX XXXX"
                  className={errors.card && 'error'}
                  onKeyUp={handleCardKeyUp}
                  maxLength={19}
                  minLength={19}
                  {...register('card', {
                    required: validationErrors.required,
                    minLength: { value: 16, message: validationErrors.creditCard }
                  })}
                />
                {errors.card && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.card.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="text"
                  name="exp"
                  minLength={5}
                  maxLength={5}
                  placeholder="MM/YY"
                  onKeyUp={(e) => handleCardKeyUp(e, true)}
                  className={errors.expiryDate && 'error'}
                  {...register('expiryDate', {
                    required: validationErrors.required
                  })}
                />
                {errors.expiryDate && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.expiryDate.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="XXX"
                  name="cvv"
                  minLength={3}
                  maxLength={3}
                  className={errors.cvv && 'error'}
                  onKeyDown={(e) => forceTextInputAsNumber(e)}
                  {...register('cvv', {
                    required: validationErrors.required,
                    minLength: { value: 3, message: validationErrors.cvv }
                  })}
                />
                {errors.cvv && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.cvv.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
        )}
        {!isForNewCard && (
          <>
            <div className="card-title d-flex justify-content-between align-items-center">
              <h6 className="text-capitalize">Your Saved Cards</h6>
              <Button className="normal-btn" onClick={handleNewCard}>
                Add New Card
                <img src={plusIcon} className="img-fluid" />
              </Button>
            </div>
            <div className="card-list">
              <span>Cards</span>
              <div className="card-single-list d-flex justify-content-between">
                <div className="list-left d-flex">
                  <img src={mastercardIcon} alt="master-card" className="img-fluid mastercard flex-shrink-0" />
                  <div className="expiry d-flex">
                    <span className="expiry-txt">Mastero ending in 8653 </span>
                    <span className="expiry-date">07/2039</span>
                  </div>
                </div>
                <Form.Check type="radio" name="demo" label="xyz" id="first-radio" />
              </div>
              <div className="card-single-list d-flex justify-content-between">
                <div className="list-left d-flex">
                  <img src={mastercardIcon} alt="master-card" className="img-fluid mastercard flex-shrink-0" />
                  <div className="expiry d-flex">
                    <span className="expiry-txt">Mastero ending in 8653 </span>
                    <span className="expiry-date">07/2039</span>
                  </div>
                </div>
                <Form.Check type="radio" name="demo" label="" id="second-radio" />{' '}
              </div>
              <div className="card-single-list d-flex justify-content-between">
                <div className="list-left d-flex">
                  <img src={mastercardIcon} alt="master-card" className="img-fluid mastercard flex-shrink-0" />
                  <div className="expiry d-flex">
                    <span className="expiry-txt">Mastero ending in 8653 </span>
                    <span className="expiry-date">07/2039</span>
                  </div>
                </div>
                <Form.Check type="radio" name="demo" label="" id="third-radio" />{' '}
              </div>
            </div>
          </>
        )}
      </div>
      <Button type="submit" className="white-btn payment-btn" onClick={handleSubmit(onCardSubmit)} form="card-form" disabled={loading}>
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
  setIsForNewCard: PropTypes.func,
  loading: PropTypes.bool
}
export default CardForm
