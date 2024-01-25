import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import ConfirmationModal from 'shared/components/confirmation-modal'
import { pencilEditIcon, deleteIcon } from 'assets/images'
import { deleteAddress, getAddress } from 'modules/address/redux/service'
import AddEditAddressModal from '../add-edit-address-modal'

const AddressListing = ({ address }) => {
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')

  const [confirmation, setConfirmation] = useState(false)
  const [showAddress, setShowAddress] = useState(false)

  const handleChangeConfirmation = () => setConfirmation(!confirmation)

  const handleConfirmation = () => {
    dispatch(
      deleteAddress(address?.id, () => {
        setConfirmation(false)
        dispatch(getAddress({ userId: userId }))
      })
    )
  }

  const onChangeAddressModal = () => {
    setShowAddress(!showAddress)
  }

  return (
    <>
      {confirmation && (
        <ConfirmationModal handleClose={handleChangeConfirmation} show={confirmation} handleConfirmation={handleConfirmation} />
      )}
      {showAddress && <AddEditAddressModal show={showAddress} handleClose={onChangeAddressModal} defaultValues={address} />}

      <div className="address-listing">
        <Row className="address-tab align-items-center">
          <Col md={10}>
            <Row className="align-items-center">
              <Col md={6}>
                <div className="address-box">
                  <span>{`${address?.firstName}  ${address?.lastName}`}</span>
                  <p>{address?.email}</p>
                  <p className="address-block">{`${address?.houseNumber} ${address?.streetName} ${address?.city} ${address?.state} ${address?.pinCode} ${address?.country}`}</p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={2}>
            <div className="card-button">
              <Button onClick={onChangeAddressModal}>
                <img src={pencilEditIcon} alt="edit" />
              </Button>
              <Button onClick={handleChangeConfirmation}>
                <img src={deleteIcon} alt="delete" />
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}
AddressListing.propTypes = {
  address: PropTypes.object
}
export default AddressListing
