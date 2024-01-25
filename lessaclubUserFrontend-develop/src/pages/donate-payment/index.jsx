import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

import './style.scss'
import { CardForm, PaymentModeForm, NuuCoinForm } from './components'
import { arrowBackIcon } from 'assets/images'
import WithAuth from 'shared/components/with-auth'
import MetaMaskForm from '../checkout/components/meta-mask-form'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import useDonationPayment from './hooks/use-donation-payment'

const DonationPayment = () => {
  const {
    formType,
    onPrevious,
    assetDetails,
    changeStep,
    onFirstStepSubmit,
    onCardSubmit,
    loading,
    paymentModeFormMethods,
    cardFormMethods,
    isForNewCard,
    setIsForNewCard,
    metaMaskFormMethods,
    onMetaMaskFormSubmit,
    getNetworkPrice,
    donationPurchaseData,
    paymentCardList,
    onCardSelect,
    selectedCard,
    connectWallet,
    onChangeSelectWallet,
    walletAccountStore,
    networkCurrencies,
    userData,
    nuuCoinFormMethods,
    onNuuCoinFormSubmit,
    nuuCoinsMultiplier
  } = useDonationPayment()

  return (
    <div className="purchase-nuucoins section-padding">
      {connectWallet && <SelectWalletModal show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} isCheckout networkGeneric />}
      <Container>
        <Row>
          <Col xxl={5} lg={8} md={8} className="mx-auto">
            <div className="purchase-nuucoins-tab">
              <Button className="back-btn" onClick={onPrevious}>
                <img src={arrowBackIcon} alt="arrowBackIcon" className="img-fluid" />
              </Button>

              <div className="steps-desc">
                <p>Step {(formType !== 'paymentMode') ? '2' : '1'} of 2</p>
                <div className="d-flex">
                  <span className="active"></span>
                  <span className={(formType !== 'paymentMode') ? 'active' : ''}></span>
                </div>
              </div>
              <PaymentModeForm
                nextStep={changeStep}
                paymentModeFormMethods={paymentModeFormMethods}
                hidden={formType !== 'paymentMode'}
                isAuction={!!assetDetails?.auctionId}
                assetDetails={assetDetails}
                onFirstStepSubmit={onFirstStepSubmit}
                loading={loading}
                donationPurchaseData={donationPurchaseData}
                getNetworkPrice={getNetworkPrice}
                walletAccountStore={walletAccountStore}
                networkCurrencies={networkCurrencies}
                userData={userData}
                nuuCoinsMultiplier={nuuCoinsMultiplier}
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
                paymentCardList={paymentCardList}
                onCardSelect={onCardSelect}
                selectedCard={selectedCard}
                donationPurchaseData={donationPurchaseData}
              />

              <MetaMaskForm
                hidden={formType !== 'metaMask'}
                metaMaskFormMethods={metaMaskFormMethods}
                onMetaMaskFormSubmit={onMetaMaskFormSubmit}
                loading={loading}
                assetDetails={assetDetails}
                getNetworkPrice={getNetworkPrice}
                assetGbpPrice={assetDetails?.price}
              />

              <NuuCoinForm
                hidden={formType !== 'nuuCoin'}
                nuuCoinFormMethods={nuuCoinFormMethods}
                onNuuCoinFormSubmit={onNuuCoinFormSubmit}
                loading={loading}
                donationPurchaseData={donationPurchaseData}
                getNetworkPrice={getNetworkPrice}
                userData={userData}
                nuuCoinsMultiplier={nuuCoinsMultiplier}
              />

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default WithAuth(DonationPayment)
