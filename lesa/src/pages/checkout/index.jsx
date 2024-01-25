import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'

import './style.scss'
import PaymentModeForm from './components/payment-mode-form'
import AddressForm from './components/address-form'
import CardForm from './components/card-form'
import WithAuth from 'shared/components/with-auth'
import CommonModal from 'shared/components/common-modal'
import { checkBallIcon, arrowBackIcon } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import MetaMaskForm from './components/meta-mask-form'
import useCheckout from './hooks/use-checkout'

const Checkout = () => {
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
  } = useCheckout()

  return (
    <>
      {connectWallet && <SelectWalletModal show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} isCheckout />}

      {show && (
        <CommonModal
          show={show}
          icon={checkBallIcon}
          titleId="orderPlacedSuccessfully"
          btnTxtId="backToHome"
          btnLink={allRoutes.home}
          background
        />
      )}
      <div className="checkout-page-inner">
        <Row>
          <Col lg={6} xl={7}>
            <div className="checkout-page-left text-center">
              <img src={assetDetails?.asset?.awsUrl} alt="checkout-img" className="img-fluid" />
            </div>
          </Col>

          <Col lg={6} xl={5}>
            <div className="checkout-page-right">
              {formType !== 'paymentMode' && (
                <Button className="back-btn d-flex justify-content-center align-items-center" onClick={onPrevious}>
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
      </div>
    </>
  )
}

export default WithAuth(Checkout)
