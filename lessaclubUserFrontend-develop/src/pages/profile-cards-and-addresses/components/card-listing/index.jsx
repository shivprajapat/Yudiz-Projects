import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { deleteIcon, creditCardIcon } from 'assets/images'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { deleteCard, getCards } from 'modules/card/redux/service'

const CardListing = ({ card }) => {
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')

  const [confirmation, setConfirmation] = useState(false)

  const handleChangeConfirmation = () => setConfirmation(!confirmation)

  const handleConfirmation = () => {
    dispatch(
      deleteCard(card?.id, () => {
        setConfirmation(false)
        dispatch(getCards({ userId: userId }))
      })
    )
  }

  return (
    <>
      {confirmation && (
        <ConfirmationModal handleClose={handleChangeConfirmation} show={confirmation} handleConfirmation={handleConfirmation} />
      )}

      <div className="card-listing-section">
        <Row className="address-tab align-items-center">
          <Col md={9}>
            <Row className="align-items-center">
              <Col md={8}>
                <div className="address-box">
                  <img src={creditCardIcon} className="card-img" alt="card" />
                  {`${card?.name} ending ${card?.last4digits}`}
                </div>
              </Col>
              <Col md={4} className="text-end">
                <div className="card-date">
                  <p>{`${card.expMonth}/${card.expYear}`}</p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            <div className="card-button">
              <Button onClick={handleChangeConfirmation}>
                <img src={deleteIcon} alt="" />
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}
CardListing.propTypes = {
  card: PropTypes.object
}
export default CardListing
