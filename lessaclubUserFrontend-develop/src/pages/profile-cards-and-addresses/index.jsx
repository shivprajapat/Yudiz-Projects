import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import AddEditAddressModal from './components/add-edit-address-modal'
import AddEditCardModal from './components/add-edit-card-modal'
import AddressListing from './components/address-listing'
import CardListing from './components/card-listing'
import CardHeading from './components/card-heading'
import { getAddress } from 'modules/address/redux/service'
import { getCards } from 'modules/card/redux/service'

const ProfileCardsAndAddresses = () => {
  const userId = localStorage.getItem('userId')
  const dispatch = useDispatch()

  const [showCard, setShowCard] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [addressData, setAddressData] = useState()
  const [cardData, setCardData] = useState()

  const getAddressStore = useSelector((state) => state.address.getAddress)
  const getCardStore = useSelector((state) => state.card.getCard)

  useEffect(() => {
    dispatch(getAddress({ userId: userId }))
    dispatch(getCards({ userId: userId }))
  }, [])

  useEffect(() => {
    if (getAddressStore?.addresses) {
      setAddressData(getAddressStore?.addresses)
    }
  }, [getAddressStore])

  useEffect(() => {
    if (getCardStore?.cards) {
      setCardData(getCardStore?.cards)
    }
  }, [getCardStore])

  const onChangeCardModal = () => {
    setShowCard((prev) => !prev)
  }
  const onChangeAddressModal = () => {
    setShowAddress((prev) => !prev)
  }

  return (
    <>
      {showCard && <AddEditCardModal show={showCard} handleClose={onChangeCardModal} />}
      {showAddress && <AddEditAddressModal show={showAddress} handleClose={onChangeAddressModal} />}

      <section className="cards-address">
        <Col xxl={8} lg={10} md={12} className="mx-auto">
          <CardHeading
            title="Your Saved Addresses"
            btnText="Add new Address"
            btnHandler={onChangeAddressModal}
            isActionDisabled={getAddressStore && getAddressStore?.addresses?.length > 0}
          />
          {addressData?.length > 0 ? (
            addressData?.map((item, index) => {
              return <AddressListing key={index} address={item} />
            })
          ) : (
            <h4 className="no-card-address-found">No Address Found</h4>
          )}
          <div className="card-listing">
            <CardHeading title="Your Saved Cards" btnText="Add new Card" btnHandler={onChangeCardModal} />
            {cardData?.length > 0 && (
              <Col md={9}>
                <div className="card-listing-heading-box">
                  <p>Cards</p>
                  <p>Expires on</p>
                </div>
              </Col>
            )}
            {cardData?.length > 0 ? (
              cardData?.map((item, index) => {
                return <CardListing key={index} card={item} />
              })
            ) : (
              <h4 className="no-card-address-found">No Cards Found</h4>
            )}
          </div>
        </Col>
      </section>
    </>
  )
}

export default ProfileCardsAndAddresses
