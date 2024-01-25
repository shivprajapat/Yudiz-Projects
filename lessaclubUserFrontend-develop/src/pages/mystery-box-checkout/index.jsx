import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import './style.scss'
import PaymentModeForm from './components/payment-mode-form'
import AddressForm from './components/address-form'
// import CardForm from './components/card-form'
import WithAuth from 'shared/components/with-auth'
import CommonModal from 'shared/components/common-modal'
import { checkBallIcon, arrowBackIcon } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import MetaMaskForm from './components/meta-mask-form'
import useCheckout from './hooks/use-checkout'
import NuuCoinForm from './components/nuu-coin-form'

const MysteryBoxCheckout = () => {
  const {
    formType,
    onPrevious,
    assetDetails,
    changeStep,
    onFirstStepSubmit,
    onSecondStepSubmit,
    loading,
    paymentModeFormMethods,
    addressFormMethods,
    show,
    connectWallet,
    onChangeSelectWallet,
    metaMaskFormMethods,
    onMetaMaskFormSubmit,
    getNetworkPrice,
    bidAmount,
    nuuCoinFormMethods,
    onNuuCoinFormSubmit,
    userData,
    referralDiscount
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
          description="please check your orders to see the mystery box."
        />
      )}
      <div className="checkout-page-inner">
        <Row>
          <Col lg={6} xl={7}>
            <div className="checkout-page-left text-center">
              <img src={assetDetails?.thumbnailUrl} alt="checkout-img" className="img-fluid" />
            </div>
          </Col>

          <Col lg={6} xl={5}>
            <div className="checkout-page-right">
              <Button className="back-btn d-flex justify-content-center align-items-center" onClick={onPrevious}>
                <img src={arrowBackIcon} alt="arrowBackIcon" className="img-fluid" />
              </Button>

              {!['card', 'metaMask', 'nuuCoin'].includes(formType) && (
                <div className="steps-desc">
                  <p>
                    <FormattedMessage id="step" /> {formType === 'address' ? '2' : '1'} of {assetDetails?.isPhysical ? '2' : '1'}
                  </p>
                  <div className="d-flex">
                    <span className="active"></span>
                    {assetDetails?.isPhysical && <span className={formType === 'address' ? 'active' : ''}></span>}
                  </div>
                </div>
              )}

              <PaymentModeForm
                nextStep={changeStep}
                paymentModeFormMethods={paymentModeFormMethods}
                hidden={formType !== 'paymentMode'}
                assetDetails={assetDetails}
                onFirstStepSubmit={onFirstStepSubmit}
                loading={loading}
                getNetworkPrice={getNetworkPrice}
                userData={userData}
                referralDiscount={referralDiscount}
              />

              <AddressForm
                hidden={formType !== 'address'}
                addressFormMethods={addressFormMethods}
                onSecondStepSubmit={onSecondStepSubmit}
                loading={loading}
                assetDetails={assetDetails}
                onPrevious={onPrevious}
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
              <NuuCoinForm
                hidden={formType !== 'nuuCoin'}
                nuuCoinFormMethods={nuuCoinFormMethods}
                onNuuCoinFormSubmit={onNuuCoinFormSubmit}
                loading={loading}
                assetDetails={assetDetails}
                getNetworkPrice={getNetworkPrice}
                bidAmount={bidAmount}
                userData={userData}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default WithAuth(MysteryBoxCheckout)
