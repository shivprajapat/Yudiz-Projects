/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import './style.scss'
import { AddressForm, CardForm, MetaMaskForm, PaymentModeForm } from './components'

import usePurchaseNuucoins from './hooks/use-purchase-nuucoins'
import { arrowBackIcon } from 'assets/images'

const PurchaseNuucoins = () => {
  const location = useLocation()
  const {
    formType,
    onPrevious,
    assetDetails,
    changeStep,
    onFirstStepSubmit,
    onCardSubmit,
    onSecondStepSubmit,
    loading,
    paymentModeFormMethods,
    addressFormMethods,
    cardFormMethods,
    show,
    connectWallet,
    onChangeSelectWallet,
    isForNewCard,
    setIsForNewCard,
    metaMaskFormMethods,
    onMetaMaskFormSubmit,
    getNetworkPrice,
    bidAmount
  } = usePurchaseNuucoins()

  return (
    <div className="purchase-nuucoins section-padding">
      <Container>
        <Row>
          <Col xxl={5} lg={8} md={8} className="mx-auto">
            <div className="purchase-nuucoins-tab">
              {formType !== 'paymentMode' && (
                <Button className="back-btn" onClick={onPrevious}>
                  <img src={arrowBackIcon} alt="arrowBackIcon" className="img-fluid" />
                </Button>
              )}

              {!['card', 'metaMask'].includes(formType) && (
                <div className="steps-desc">
                  <p>Step {formType === 'address' ? '2' : '1'} of 2</p>
                  <div className="d-flex">
                    <span className="active"></span>
                    <span className={formType === 'address' ? 'active' : ''}></span>
                  </div>
                </div>
              )}

              <PaymentModeForm
                nextStep={changeStep}
                paymentModeFormMethods={paymentModeFormMethods}
                hidden={formType !== 'paymentMode'}
                isAuction={!!assetDetails?.auctionId}
                assetDetails={assetDetails}
                onFirstStepSubmit={onFirstStepSubmit}
                loading={loading}
                getNetworkPrice={getNetworkPrice}
              />

              <AddressForm
                hidden={formType !== 'address'}
                addressFormMethods={addressFormMethods}
                onSecondStepSubmit={onSecondStepSubmit}
                loading={loading}
                assetDetails={assetDetails}
                onPrevious={onPrevious}
              />

              <CardForm
                nextStep={changeStep}
                previous={changeStep}
                hidden={formType !== 'card'}
                cardFormMethods={cardFormMethods}
                onCardSubmit={onCardSubmit}
                isForNewCard={isForNewCard}
                setIsForNewCard={setIsForNewCard}
                loading={loading}
              />

              <MetaMaskForm
                hidden={formType !== 'metaMask'}
                metaMaskFormMethods={metaMaskFormMethods}
                onMetaMaskFormSubmit={onMetaMaskFormSubmit}
                loading={loading}
                assetDetails={assetDetails}
                getNetworkPrice={getNetworkPrice}
                bidAmount={bidAmount}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default PurchaseNuucoins
