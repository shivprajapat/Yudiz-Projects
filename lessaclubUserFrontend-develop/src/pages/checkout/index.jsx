import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

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
import NuuCoinForm from './components/nuu-coin-form'
import { GlbViewer } from 'modules/3DFiles'
import ShowZip from 'shared/components/ShowZip'
import { GLB, GLTF } from 'shared/constants'

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
    bidAmount,
    nuuCoinFormMethods,
    onNuuCoinFormSubmit,
    userData,
    paymentCardList,
    onCardSelect,
    selectedCard,
    isAuction,
    payoutToCreator,
    payoutToSeller,
    referralDiscount
  } = useCheckout()

  const fileType = assetDetails?.asset?.fileType
  const awsUrl = assetDetails?.asset?.awsUrl
  const thumbnailUrl = assetDetails?.asset?.thumbnailAwsUrl
  const isRender3d = fileType === GLB || (fileType === GLTF && awsUrl)
  const is3dStillZip = fileType === GLTF && !awsUrl
  const isRenderImage = !isRender3d && !is3dStillZip
  const blockchainNetworkEntered = paymentModeFormMethods.watch('blockchainNetwork')
  const blockchainNetwork = blockchainNetworkEntered?.value || assetDetails?.asset?.blockchainNetwork
  return (
    <>
      {connectWallet && (
        <SelectWalletModal
          blockchainNetwork={blockchainNetwork}
          show={connectWallet}
          onCloseSelectWallet={onChangeSelectWallet}
          isCheckout
        />
      )}

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
            {(isRender3d || is3dStillZip) && (
              <div className="checkout-page-left text-center h-100">
                {isRender3d && (
                  <GlbViewer artwork={awsUrl} showThumbnail={true} thumbnail={assetDetails?.asset?.thumbnailAwsUrl} ignore3DRender={true} />
                )}
                {is3dStillZip && <ShowZip iconDark={true} />}
              </div>
            )}

            {isRenderImage && awsUrl && (
              <div className="checkout-page-left text-center">
                <img src={thumbnailUrl || awsUrl} alt="checkout-img" className="img-fluid" />
              </div>
            )}
          </Col>

          <Col lg={6} xl={5}>
            <div className="checkout-page-right">
              <Button className="back-btn d-flex justify-content-center align-items-center" onClick={onPrevious}>
                <img src={arrowBackIcon} alt="arrowBackIcon" className="img-fluid" />
              </Button>

              {!['card', 'metaMask', 'nuuCoin'].includes(formType) && (
                <div className="steps-desc">
                  <p>
                    <FormattedMessage id="step" /> {formType === 'address' ? '2' : '1'} of {assetDetails?.asset?.isPhysical ? '2' : '1'}
                  </p>
                  <div className="d-flex">
                    <span className="active"></span>
                    {assetDetails?.asset?.isPhysical && <span className={formType === 'address' ? 'active' : ''}></span>}
                  </div>
                </div>
              )}

              <PaymentModeForm
                nextStep={changeStep}
                paymentModeFormMethods={paymentModeFormMethods}
                hidden={formType !== 'paymentMode'}
                isAuction={isAuction}
                assetDetails={assetDetails}
                onFirstStepSubmit={onFirstStepSubmit}
                loading={loading}
                getNetworkPrice={getNetworkPrice}
                userData={userData}
                payoutToCreator={payoutToCreator}
                payoutToSeller={payoutToSeller}
                referralDiscount={referralDiscount}
                soldEditionCount={assetDetails?.asset?.soldEditionCount}
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
                paymentCardList={paymentCardList}
                onCardSelect={onCardSelect}
                selectedCard={selectedCard}
                assetDetails={assetDetails}
                referralDiscount={referralDiscount}
              />

              <MetaMaskForm
                hidden={formType !== 'metaMask'}
                metaMaskFormMethods={metaMaskFormMethods}
                paymentModeFormMethods={paymentModeFormMethods}
                onMetaMaskFormSubmit={onMetaMaskFormSubmit}
                loading={loading}
                assetDetails={assetDetails}
                getNetworkPrice={getNetworkPrice}
                assetGbpPrice={assetDetails?.auctionId ? bidAmount : assetDetails?.sellingPrice}
                payoutToCreator={payoutToCreator}
                payoutToSeller={payoutToSeller}
                referralDiscount={referralDiscount}
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
                referralDiscount={referralDiscount}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default WithAuth(Checkout)
