import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import './style.scss'
import ShareSocialMedia from 'shared/components/share-social-media'
import {
  assetDelistFromResale,
  getAssetDetails,
  getCreatedAssetDetails,
  getOwnedAssetDetails,
  getOwnedAssetIndexSearch
} from 'modules/assets/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import { bytesToSize, getNetworkSymbol, getStringWithCommas } from 'shared/utils'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { GLB, GLTF, TOAST_TYPE } from 'shared/constants'
import UserInfo from 'shared/components/user-info'
import AuctionStartsOrEndsIn from 'shared/components/auction-starts-or-ends-in'
import OwnedAssetLinks from './components/owned-asset-links'
import AuctionBidList from './components/auction-bid-list'
import MoreFromArtist from './components/more-from-artist'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { getAction, giftActionCondition } from 'modules/shared'
import DropStartsOrEndsIn from 'shared/components/drop-starts-or-ends-in'
import { GlbViewer } from 'modules/3DFiles'
import { removeWishlistAsset, wishlistAsset } from 'modules/wishlist/redux/service'
import ShowZip from 'shared/components/ShowZip'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { cancelSale } from 'modules/blockchainNetwork'
import SelectWalletModal from 'shared/components/select-wallet-modal'

const AssetDetails = () => {
  const { id, type } = useParams()
  const dispatch = useDispatch()
  const location = useLocation()

  const isAuthenticated = localStorage.getItem('userToken')
  const isOwnedAsset = type === 'resell'
  const isCreatedAsset = type === 'created'

  const [share, setShare] = useState(false)
  const [assetDetails, setAssetDetails] = useState()
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1)
  const [showDelistConfirmation, setDelistConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [connectWallet, setConnectWallet] = useState(false)
  const [account, setAccount] = useState(null)
  const [delistFromResaleButton, showDelistFromResaleButton] = useState(false)

  const assetDetailStore = useSelector((state) => state.asset.assetDetails)
  const userId = useSelector((state) => state.auth.userId) || localStorage.getItem('userId')
  const exchangeRateStore = useSelector((state) => state.exchangeRate)
  const createdAssetDetailStore = useSelector((state) => state.asset.createdAssetDetails)
  const walletAccountStore = useSelector((state) => state.wallet)
  const delistFromResaleStore = useSelector((state) => state.asset.delistFromResale)
  const ownedAssetSearchIndexStore = useSelector((state) => state.asset.ownedAssetSearchIndex)

  const fileType = assetDetails?.asset?.fileType
  const awsUrl = assetDetails?.asset?.awsUrl
  const isRender3d = fileType === GLB || (fileType === GLTF && awsUrl)
  const is3dStillZip = fileType === GLTF && !awsUrl
  const isRenderImage = !isRender3d && !is3dStillZip
  const isCurrentUserOwner = userId === (assetDetails?.asset?.owner?.id || assetDetails?.asset?.currentOwnerId)

  useEffect(() => {
    if (assetDetailStore) {
      if (!isOwnedAsset) {
        setAssetDetails(assetDetailStore.assetOnSale)
      }
      dispatch(
        getOwnedAssetIndexSearch({ wishlistByLoggedInUser: false, assetId: assetDetailStore?.assetOnSale?.asset?.id, userId: userId })
      )
    }
  }, [assetDetailStore])

  useEffect(() => {
    if (ownedAssetSearchIndexStore && ownedAssetSearchIndexStore.ownedAssets) {
      const length = ownedAssetSearchIndexStore.ownedAssets.length
      if (length > 0) {
        const ownedAsset = ownedAssetSearchIndexStore.ownedAssets[length - 1]
        if (isOwnedAsset) {
          setAssetDetails(ownedAsset)
        }
        showDelist(ownedAsset)
      }
    }
  }, [ownedAssetSearchIndexStore])

  useEffect(() => {
    if (createdAssetDetailStore && createdAssetDetailStore.assetOnSale) {
      setAssetDetails(createdAssetDetailStore.assetOnSale)
    }
  }, [createdAssetDetailStore])

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
      if (isOwnedAsset) {
        dispatch(getOwnedAssetIndexSearch({ wishlistByLoggedInUser: false, assetId: id, userId: userId }))
      } else if (isCreatedAsset) {
        dispatch(getCreatedAssetDetails({ assetId: id, wishlistByLoggedInUser: true }))
      } else {
        dispatch(getAssetDetails(id, { wishlistByLoggedInUser: true }))
      }
    }
  }, [id])

  useEffect(() => {
    if (walletAccountStore) {
      setAccount(walletAccountStore.account)
    }
  }, [walletAccountStore])

  useEffect(() => {
    if (delistFromResaleStore && delistFromResaleStore.errors) {
      setDelistConfirmation(false)
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: delistFromResaleStore.error,
          type: TOAST_TYPE.Error
        }
      })
    } else if (delistFromResaleStore) {
      setDelistConfirmation(false)
      showDelistFromResaleButton(false)
      dispatch(getOwnedAssetDetails(id, { wishlistByLoggedInUser: true }))
    }
  }, [delistFromResaleStore])

  const showDelist = (ownedAsset) => {
    if (isOwnedAsset) {
      setAssetDetails(ownedAsset)
    }
    if (ownedAsset.isOnSale) {
      showDelistFromResaleButton(true)
    } else {
      showDelistFromResaleButton(false)
    }
  }

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
      return assetDetails?.sellingPrice
    }
  }
  const getNetworkPrice = (price) => {
    return price * currencyMultiplier
  }

  const handleDelistFromResellClick = () => {
    toggleConfirmationModal()
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
        dispatch(assetDelistFromResale({ id: assetDetails?.asset?.id }))
      }
    }
  }

  const onChangeSelectWallet = () => {
    setConnectWallet((prev) => !prev)
  }

  const action = getAction(userId, assetDetails)
  const giftAction = giftActionCondition(userId, assetDetails)
  const auction = assetDetails?.auction

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Thumbnail
    </Tooltip>
  )

  return (
    <>
      {connectWallet && <SelectWalletModal show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} isCheckout />}
      {share && (
        <ShareSocialMedia
          show={share}
          handleClose={handleShare}
          asset={awsUrl}
          url={window.location.href}
          thumbnail={assetDetails?.asset?.thumbnailAwsUrl}
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
      <div className="asset-detail-page">
        <div className="asset-detail">
          <Row>
            <Col md={12} lg={6}>
              <div className="img-row">
                <div className="asset-detail-img">
                  {isRender3d && <GlbViewer artwork={awsUrl} ignoreThumbnail />}
                  {is3dStillZip && <ShowZip iconDark={true} />}
                  {isRenderImage && <img src={awsUrl} alt="detail-img" className="img-fluid" />}
                </div>
              </div>
              {assetDetails?.asset?.thumbnailAwsUrl && (
                <div className="thumb-row">
                  <OverlayTrigger placement="top" overlay={renderTooltip}>
                    <img src={assetDetails?.asset?.thumbnailAwsUrl} alt="thumbnail" />
                  </OverlayTrigger>
                </div>
              )}
              {
                isRender3d ? <div className="asset-description d-flex flex-column flex-start mt-4 text-dark">
                  <label className='title'>Original File:</label>
                  <div>
                    <label>Name</label>
                    <span>{assetDetails?.asset?.largerFileName}</span>
                  </div>
                  <div>
                    <label>Size</label>
                    <span>{bytesToSize(assetDetails?.asset?.largerFileSize)}</span>
                  </div>
                  <div>
                    <label>Link</label>
                    {
                      isCurrentUserOwner ? <span>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`${window.location.origin}${allRoutes.previewAsset(assetDetails?.asset?.largerFileAwsUrl.split('/')[3])}`}
                        >
                          Click Here
                        </a>
                      </span> : <span className='text-muted'> Purchase this asset to view the original file</span>
                    }
                  </div>
                </div> : null
              }
            </Col>
            <Col md={12} lg={6}>
              <div className="asset-detail-content">
                <div className="asset-title">
                  <Row>
                    <Col md={6} lg={12} xl={6}>
                      <div className="asset-title-left">
                        <h4>{assetDetails?.asset?.name}</h4>
                        {assetDetails?.asset?.isPhysical && (
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

                  <div className="asset-owner-artist d-flex flex-wrap">
                    {assetDetails?.asset?.currentOwnerId && (
                      <UserInfo
                        profileImage={assetDetails?.currentOwner?.profilePicUrl}
                        name={assetDetails?.asset?.currentOwner?.userName || assetDetails?.owner?.userName}
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

                    {!!giftAction && assetDetails?.auction?.currentBidderId !== userId && (
                      <Button
                        className={`black-btn ${giftAction ? '' : 'disabled'}`}
                        as={Link}
                        state={!isAuthenticated && { previousPath: location.pathname }}
                        to={isAuthenticated ? allRoutes.giftAsset(assetDetails?.asset?.id) : allRoutes.login}
                      >
                        {giftAction}
                      </Button>
                    )}

                    {delistFromResaleButton && (
                      <Button className="black-btn" onClick={handleDelistFromResellClick}>
                        Delist from resale
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
                  <h6 className="text-dark">Description</h6>
                  <p>{assetDetails?.asset?.description}</p>
                </div>

                <div className="asset-detail-desc">
                  <h6 className="text-dark">Properties</h6>
                  <p>{assetDetails?.asset?.shortDescription}</p>
                </div>

                {assetDetails?.auctionId && <AuctionBidList getNetworkPrice={getNetworkPrice} assetDetails={assetDetails} />}
              </div>
            </Col>
          </Row>
        </div>
        <MoreFromArtist creatorId={assetDetails?.creator?.id} />
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
