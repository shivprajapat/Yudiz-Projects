import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

import './style.scss'
import { CardForm, PaymentModeForm } from './components'
import usePurchaseNuuCoins from './hooks/use-purchase-nuucoins'
import { arrowBackIcon } from 'assets/images'
import WithAuth from 'shared/components/with-auth'
import MetaMaskForm from '../checkout/components/meta-mask-form'
import SelectWalletModal from 'shared/components/select-wallet-modal'

const PurchaseNuuCoins = () => {
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
    nuuCoinPurchaseData,
    paymentCardList,
    onCardSelect,
    selectedCard,
    connectWallet,
    onChangeSelectWallet,
    walletAccountStore,
    networkCurrencies
  } = usePurchaseNuuCoins()

  return (
    <div className="purchase-nuucoins section-padding">
      {connectWallet && <SelectWalletModal networkGeneric={true} show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} isCheckout />}
      <Container>
        <Row>
          <Col xxl={5} lg={8} md={8} className="mx-auto">
            <div className="purchase-nuucoins-tab">
              <Button className="back-btn" onClick={onPrevious}>
                <img src={arrowBackIcon} alt="arrowBackIcon" className="img-fluid" />
              </Button>

              <div className="steps-desc">
                <p>Step {formType === 'card' ? '2' : '1'} of 2</p>
                <div className="d-flex">
                  <span className="active"></span>
                  <span className={formType === 'address' ? 'active' : ''}></span>
                </div>
              </div>

              <PaymentModeForm
                nextStep={changeStep}
                paymentModeFormMethods={paymentModeFormMethods}
                hidden={formType !== 'paymentMode'}
                isAuction={!!assetDetails?.auctionId}
                assetDetails={assetDetails}
                onFirstStepSubmit={onFirstStepSubmit}
                nuuCoinPurchaseData={nuuCoinPurchaseData}
                walletAccountStore={walletAccountStore}
                networkCurrencies={networkCurrencies}
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
                nuuCoinPurchaseData={nuuCoinPurchaseData}
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

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default WithAuth(PurchaseNuuCoins)
