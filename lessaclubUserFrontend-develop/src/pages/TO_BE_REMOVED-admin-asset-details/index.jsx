import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import './style.scss'
import ShareSocialMedia from 'shared/components/share-social-media'
import { assetDelistFromResale, getAssetDetailsForAdmin } from 'modules/assets/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import { getNetworkSymbol, getStringWithCommas } from 'shared/utils'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { GLB, GLTF, TOAST_TYPE } from 'shared/constants'
import AuctionStartsOrEndsIn from 'shared/components/auction-starts-or-ends-in'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { getAction } from 'modules/shared'
import DropStartsOrEndsIn from 'shared/components/drop-starts-or-ends-in'
import { GlbViewer } from 'modules/3DFiles'
import { removeWishlistAsset, wishlistAsset } from 'modules/wishlist/redux/service'
import ShowZip from 'shared/components/ShowZip'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { cancelSale } from 'modules/blockchainNetwork'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import OwnedAssetLinks from 'pages/TO_BE_REMOVED-asset-details/components/owned-asset-links'
import UserInfo from 'shared/components/user-info'

const AssetDetails = () => {
  const { id, type } = useParams()
  const dispatch = useDispatch()
  const location = useLocation()

  const isAuthenticated = localStorage.getItem('userToken')
  const isOwnedAsset = type === 'resell'

  const [share, setShare] = useState(false)
  const [assetDetails, setAssetDetails] = useState()
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1)
  const [showDelistConfirmation, setDelistConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [connectWallet, setConnectWallet] = useState(false)
  const [account, setAccount] = useState(null)

  const userId = useSelector((state) => state.auth.userId) || localStorage.getItem('userId')
  const exchangeRateStore = useSelector((state) => state.exchangeRate)
  const walletAccountStore = useSelector((state) => state.wallet)
  const assetDetailsForAdmin = useSelector((state) => state.asset.assetDetailsForAdmin)

  const fileType = assetDetails?.fileType
  const awsUrl = assetDetails?.awsUrl
  const isRender3d = fileType === GLB || (fileType === GLTF && awsUrl)
  const is3dStillZip = fileType === GLTF && !awsUrl
  const isRenderImage = !isRender3d && !is3dStillZip

  useEffect(() => {
    if (assetDetails?.id) {
      dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(assetDetails?.blockchainNetwork || 'Ethereum') }))
    }
  }, [assetDetails])

  useEffect(() => {
    if (exchangeRateStore?.exchangeRateData?.exchangeRate) {
      setCurrencyMultiplier(exchangeRateStore?.exchangeRateData?.exchangeRate[0]?.exchangeRate)
    }
  }, [exchangeRateStore])

  useEffect(() => {
    if (id) {
      dispatch(getAssetDetailsForAdmin(id))
    }
  }, [id])

  useEffect(() => {
    if (assetDetailsForAdmin?.assets) {
      setAssetDetails(assetDetailsForAdmin?.assets)
    }
  }, [assetDetailsForAdmin])

  useEffect(() => {
    if (walletAccountStore) {
      setAccount(walletAccountStore.account)
    }
  }, [walletAccountStore])

  const handleShare = () => {
    setShare(!share)
  }
  const handleCheckoutRedirection = () => {
    if (!isAuthenticated) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Please Login to continue',
          type: TOAST_TYPE.Error
        }
      })
    }
  }

  const getCheckoutAndResellLink = () => {
    if (isOwnedAsset) {
      return allRoutes.resellCreateAsset('resell', assetDetails?.id)
    } else {
      return allRoutes.checkout(assetDetails?.id)
    }
  }

  const assetGbpPrice = () => {
    if (type === 'resell') {
      return assetDetails?.price
    } else if (assetDetails?.auctionId) {
      return assetDetails?.auctionCurrentBid || assetDetails?.auctionMinimumPrice
    } else {
      return assetDetails?.currentPrice
    }
  }
  const getNetworkPrice = (price) => {
    return price * currencyMultiplier
  }

  const toggleConfirmationModal = () => {
    setDelistConfirmation((prev) => !prev)
  }

  const handleConfirmation = async () => {
    if (!account) {
      setConnectWallet(true)
    } else {
      setConnectWallet(false)
      document.body.classList.add('global-loader')
      const result = await cancelSale({
        blockchainNetwork: assetDetails?.blockchainNetwork,
        walletAccountStore,
        connectedAccount: account,
        setLoading: setLoading,
        assetDetails,
        dispatch
      })
      if (result && result.status) {
        document.body.classList.remove('global-loader')
        dispatch(assetDelistFromResale({ id: assetDetails?.id }))
      }
    }
  }

  const onChangeSelectWallet = () => {
    setConnectWallet((prev) => !prev)
  }

  const action = getAction(userId, assetDetails)
  const auction = assetDetails?.auction

  return (
    <>
      {connectWallet && <SelectWalletModal show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} isCheckout />}
      {share && (
        <ShareSocialMedia
          show={share}
          handleClose={handleShare}
          asset={awsUrl}
          url={window.location.href}
          thumbnail={assetDetails?.thumbnailAwsUrl}
        />
      )}
      {showDelistConfirmation && (
        <ConfirmationModal
          show={showDelistConfirmation}
          handleConfirmation={handleConfirmation}
          handleClose={toggleConfirmationModal}
          loading={loading} // loading.current
          title={'Delist Confirmation'}
          description={'Are you sure to delist from sale?'}
        />
      )}
      <div className="admin-asset-detail-page">
        <div className="asset-detail">
          <Row>
            <Col md={12} lg={6}>
              <div className="img-row">
                <div className="asset-detail-img w-100 h-100">
                  {isRender3d && <GlbViewer artwork={awsUrl} ignoreThumbnail />}
                  {is3dStillZip && <ShowZip iconDark={true} />}
                  {isRenderImage && <img src={awsUrl} alt="detail-img" className="img-fluid" />}
                </div>
              </div>
              <div className="img-row">
                <img src={assetDetails?.thumbnailAwsUrl} alt="" />
              </div>
            </Col>
            <Col md={12} lg={6}>
              <div className="asset-detail-content">
                <div className="asset-title">
                  <Row>
                    <Col md={6} lg={12} xl={6}>
                      <div className="asset-title-left">
                        <h4>{assetDetails?.name}</h4>
                        {assetDetails?.isPhysical && (
                          <Button className="disable-btn" disabled>
                            <FormattedMessage id="physicalAsset" />
                          </Button>
                        )}
                      </div>
                    </Col>
                    {auction?.id && (
                      <Col md={6} lg={12} xl={6}>
                        <AuctionStartsOrEndsIn
                          auction={auction}
                          auctionEndTime={assetDetails?.saleEndTime}
                          auctionStartTime={assetDetails?.saleStartTime}
                        />
                      </Col>
                    )}
                    {assetDetails?.isDropNeeded && (
                      <Col md={6} lg={12} xl={6}>
                        <DropStartsOrEndsIn
                          endTime={assetDetails?.currentNftDrop?.endTime}
                          startTime={assetDetails?.currentNftDrop?.startTime}
                        />
                      </Col>
                    )}
                  </Row>
                </div>

                <div className="asset-high-bid">
                  {assetDetails?.auction?.currentBidder &&
                    (assetDetails?.auction?.currentBidderId === userId ? (
                      <p className="place-by" style={{ color: 'green' }}>
                        You are the highest bidder
                      </p>
                    ) : (
                      <p className="place-by">Highest bid placed by @{assetDetails?.auction?.currentBidder?.userName} </p>
                    ))}

                  {assetDetails?.asset?.availableStock <= 0 && (
                    <p className="place-by invalidFeedback">
                      <FormattedMessage id="outOfStock" />
                    </p>
                  )}
                  <div className="asset-owner-artist d-flex flex-wrap py-4">
                    {assetDetails?.currentOwnerId && (
                      <UserInfo
                        profileImage={assetDetails?.currentOwner?.profilePicUrl}
                        name={assetDetails?.currentOwner?.userName || assetDetails?.owner?.userName}
                        isOwner
                        isDark
                        link={allRoutes.creatorCollected(assetDetails?.asset?.currentOwnerId)}
                      />
                    )}
                    <UserInfo
                      profileImage={assetDetails?.creator?.profilePicUrl}
                      name={assetDetails?.creator?.userName}
                      isDark
                      isArtist
                      link={allRoutes.creatorCollected(assetDetails?.creator?.id)}
                    />
                  </div>
                  <p className="edition">
                    <strong>
                      <span className="mr-1">£</span> {getStringWithCommas(assetGbpPrice())}
                    </strong>
                    (
                    <span>{`${getNetworkPrice(getStringWithCommas(assetGbpPrice()))} ${getNetworkSymbol(
                      assetDetails?.blockchainNetwork || 'Ethereum'
                    )}`}</span>
                    )
                  </p>

                  <Button className="disable-btn mb-3" disabled>
                    {Number(assetDetails?.sellingPrice) >= 10000 ? 'Exclusive NFT' : 'Multichain NFT'}
                  </Button>

                  {assetDetails?.auctionId && (
                    <p>
                      <Button className="disable-btn mb-3" disabled>
                        <FormattedMessage id="auctionStatus" />: {assetDetails?.auction?.statusName}
                      </Button>
                    </p>
                  )}

                  <div className="high-bid-btn d-flex flex-wrap">
                    {!!action && assetDetails?.auction?.currentBidderId !== userId && (
                      <Button
                        className={`black-btn ${action ? '' : 'disabled'}`}
                        as={Link}
                        state={!isAuthenticated && { previousPath: location.pathname }}
                        to={isAuthenticated ? getCheckoutAndResellLink() : allRoutes.login}
                        onClick={handleCheckoutRedirection}
                      >
                        {action}
                      </Button>
                    )}

                    <Button className="black-border-btn" onClick={handleShare}>
                      <FormattedMessage id="share" />
                    </Button>

                    <div className="fav-icon d-flex align-items-center">
                      <Wishlist asset={assetDetails} />
                    </div>
                  </div>
                </div>

                {isOwnedAsset && <OwnedAssetLinks assetDetails={assetDetails} />}

                <div className="asset-detail-desc">
                  <p>{assetDetails?.description}</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default AssetDetails

const Wishlist = ({ asset }) => {
  const userId = localStorage.getItem('userId')
  const wishlistRef = useRef()
  const countRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    countRef.current = Number(asset?.wishlistCount) || 0
    if (asset?.wishlistByLoggedInUser) {
      wishlistRef.current.classList.add('active')
    }
  }, [asset])

  const handleWishlist = () => {
    if (wishlistRef.current.classList.contains('active')) {
      wishlistRef.current.classList.remove('active')
      countRef.current = countRef.current - 1
      dispatch(removeWishlistAsset({ assetOnSaleId: asset?.id }))
    } else {
      wishlistRef.current.classList.add('active')
      countRef.current = countRef.current + 1
      dispatch(wishlistAsset({ assetId: asset?.assetId, assetOnSaleId: asset?.id, userId: userId }))
    }
  }
  return (
    <>
      <Button className="wishlist-btn" ref={wishlistRef} onClick={handleWishlist}></Button>
      <span>{countRef.current}</span>
    </>
  )
}

Wishlist.propTypes = {
  asset: PropTypes.object
}
