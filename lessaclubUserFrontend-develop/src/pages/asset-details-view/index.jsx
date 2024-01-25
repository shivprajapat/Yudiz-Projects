/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import './style.scss'
import ShareSocialMedia from 'shared/components/share-social-media'
import {
  assetDelistFromResale,
  auctionDelistFromResale,
  getAssetDetails,
  getAssetDetailsForAdmin,
  getAssetOnSale,
  getCreatedAssetDetails,
  getOwnedAssetIndexSearch
} from 'modules/assets/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import { bytesToSize, getNetworkSymbol, getStringWithCommas, parseParams } from 'shared/utils'
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
import { cancelSale, NETWORKS } from 'modules/blockchainNetwork'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import ReactPlayer from 'react-player'
import Reviews from './components/reviews'
import { AUCTION_STATUS } from 'modules/auction/constants'
import {
  CLEAR_ASSET_DETAILS_FOR_ADMIN_RESPONSE,
  CLEAR_ASSET_DETAILS_RESPONSE,
  CLEAR_ASSET_ON_SALE_DATA,
  CLEAR_CREATED_ASSET_DETAILS_RESPONSE,
  CLEAR_GET_OWNED_ASSET_INDEX_SEARCH_RESPONSE
} from 'modules/assets/redux/action'
import { CLEAR_AUCTION_BIDS_RESPONSE } from 'modules/auction/redux/action'
import {
  CLEAR_ORDER_CREATION_RESPONSE,
  CLEAR_ORDER_PAYMENT_RESPONSE,
  CLEAR_ORDER_UPDATE_RESPONSE,
  CLEAR_PENDING_ORDER_RESPONSE
} from 'modules/checkout/redux/action'

const AssetDetailsView = () => {
  const assetTypes = {
    ON_SALE: 'ON_SALE',
    BASIC_DATA: 'BASIC_DATA'
  }
  const { id, type } = useParams()
  const dispatch = useDispatch()
  const location = useLocation()
  const parsedParams = parseParams(location.search)

  const isAuthenticated = localStorage.getItem('userToken')
  const isOwnedAsset = type === 'resell'
  const isCreatedAsset = type === 'created'

  const [currentAssetType, setCurrentAssetType] = useState(null)
  const [share, setShare] = useState(false)
  const [assetDetails, setAssetDetails] = useState()
  const [currencyMultiplier, setCurrencyMultiplier] = useState({})
  const [networkCurrencies, setNetworkCurrencies] = useState({})
  const [showDelistConfirmation, setDelistConfirmation] = useState(false)
  const [auctionDelistConfirmation, setAuctionDelistConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [connectWallet, setConnectWallet] = useState(false)
  const [account, setAccount] = useState(null)
  const [delistFromResaleButton, showDelistFromResaleButton] = useState(false)
  const [delistAuctionFromResaleButton, showDelistAuctionFromResaleButton] = useState(true)
  const [auctionAssetDetails, setAuctionAssetDetails] = useState(null)

  const assetDetailStore = useSelector((state) => state.asset.assetDetails)
  const userId = useSelector((state) => state.auth.userId) || localStorage.getItem('userId')
  const exchangeRateStore = useSelector((state) => state.exchangeRate)
  const createdAssetDetailStore = useSelector((state) => state.asset.createdAssetDetails)
  const walletAccountStore = useSelector((state) => state.wallet)
  const delistFromResaleStore = useSelector((state) => state.asset.delistFromResale)
  const delistAuctionFromResaleStore = useSelector((state) => state.asset.delistAuctionFromResale)
  const ownedAssetSearchIndexStore = useSelector((state) => state.asset.ownedAssetSearchIndex)
  const assetDetailsForAdmin = useSelector((state) => state.asset.assetDetailsForAdmin)
  const userStore = useSelector((state) => state.user.user)
  const assetOnSaleStore = useSelector((state) => state.asset.assetOnSale)
  const fileType = assetDetails?.asset?.fileType || assetDetails?.fileType
  const awsUrl = assetDetails?.asset?.awsUrl || assetDetails?.awsUrl
  const isRender3d = fileType === GLB || (fileType === GLTF && awsUrl)
  const is3dStillZip = fileType === GLTF && !awsUrl
  const isRenderImage = ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileType)
  const isRenderReactPlayer = !isRender3d && !is3dStillZip && !isRenderImage
  const assetResMessage = useSelector((state) => state.asset.resMessage)

  const isCurrentUserOwner = userId === (assetDetails?.asset?.owner?.id || assetDetails?.asset?.currentOwnerId)
  const isCurrentUserCreator = userId === assetDetails?.creator?.id
  const isCurrentUserSeller = userId === (assetDetails?.sellerId || assetDetails?.seller?.id)
  useEffect(() => {
    if (Object.prototype.hasOwnProperty.call(parsedParams, 'onSale')) {
      setCurrentAssetType(assetTypes.ON_SALE)
    } else if (Object.prototype.hasOwnProperty.call(parsedParams, 'basic')) {
      setCurrentAssetType(assetTypes.BASIC_DATA)
    } else {
      setCurrentAssetType(assetTypes.BASIC_DATA)
    }

    return resetAssetDetails
  }, [])

  const resetAssetDetails = () => {
    dispatch({ type: CLEAR_GET_OWNED_ASSET_INDEX_SEARCH_RESPONSE })
    dispatch({ type: CLEAR_CREATED_ASSET_DETAILS_RESPONSE })
    dispatch({ type: CLEAR_AUCTION_BIDS_RESPONSE })
    dispatch({ type: CLEAR_ASSET_DETAILS_RESPONSE })
    dispatch({ type: CLEAR_ORDER_CREATION_RESPONSE })
    dispatch({ type: CLEAR_ORDER_UPDATE_RESPONSE })
    dispatch({ type: CLEAR_ORDER_PAYMENT_RESPONSE })
    dispatch({ type: CLEAR_PENDING_ORDER_RESPONSE })
    dispatch({ type: CLEAR_AUCTION_BIDS_RESPONSE })
    dispatch({ type: CLEAR_ASSET_DETAILS_FOR_ADMIN_RESPONSE })
    dispatch({ type: CLEAR_ASSET_ON_SALE_DATA })
  }

  useEffect(() => {
    if (isOwnedAsset && assetDetails?.asset?.currentAssetsOnSaleId) {
      const id = assetDetails.asset.currentAssetsOnSaleId
      dispatch(getAssetDetails(id, { wishlistByLoggedInUser: true }))
    }
  }, [assetDetails])

  useEffect(() => {
    if (assetDetailStore) {
      if (isOwnedAsset) {
        setAuctionAssetDetails(assetDetailStore.assetOnSale)
        return
      }

      if (!isOwnedAsset) {
        setAssetDetails(assetDetailStore.assetOnSale)
      }
      dispatch(
        getOwnedAssetIndexSearch({ wishlistByLoggedInUser: false, assetId: assetDetailStore?.assetOnSale?.asset?.id, userId: userId })
      )
      dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(assetDetails?.blockchainNetwork || 'Ethereum') }))
      dispatch(getExchangeRate({ convertSymbol: 'USD' }))
      if (!assetDetails?.blockchainNetwork) {
        dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(NETWORKS.POLYGON) }))
      }
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
  }, [ownedAssetSearchIndexStore, assetOnSaleStore])

  useEffect(() => {
    if (createdAssetDetailStore && createdAssetDetailStore.assetOnSale) {
      setAssetDetails(createdAssetDetailStore.assetOnSale)
    }
  }, [createdAssetDetailStore])

  useEffect(() => {
    if (assetDetailsForAdmin?.assets) {
      setAssetDetails({ asset: assetDetailsForAdmin?.assets })
    }
  }, [assetDetailsForAdmin])

  useEffect(() => {
    if (exchangeRateStore?.exchangeRateData?.exchangeRate) {
      const rateObj = exchangeRateStore?.exchangeRateData?.exchangeRate[0]
      if (rateObj) {
        const rate = rateObj.exchangeRate
        const convertSymbol = rateObj.convertSymbol
        setCurrencyMultiplier((prev) => {
          const newCurrencyMultiplier = prev
          newCurrencyMultiplier[convertSymbol] = rate
          return newCurrencyMultiplier
        })
        setNetworkCurrencies((prev) => {
          const newCurrencies = prev
          const price = assetGbpPrice()
          const networkPrice = getNetworkPrice(price, convertSymbol)
          newCurrencies[convertSymbol] = networkPrice
          return newCurrencies
        })
      }
    }
  }, [exchangeRateStore])

  useEffect(() => {
    if (id && currentAssetType) {
      if (isOwnedAsset) {
        dispatch(getOwnedAssetIndexSearch({ wishlistByLoggedInUser: false, assetId: id, userId: userId }))
      } else if (isCreatedAsset) {
        dispatch(getCreatedAssetDetails({ assetId: id, wishlistByLoggedInUser: true }))
      } else if (currentAssetType === assetTypes.ON_SALE) {
        dispatch(getAssetDetails(id, { wishlistByLoggedInUser: true }))
      } else if (currentAssetType === assetTypes.BASIC_DATA) {
        dispatch(getAssetDetailsForAdmin(id, { wishlistByLoggedInUser: true }))
      }
      dispatch(getAssetOnSale({ isSold: false, isExpired: false, assetId: id }))
    }
  }, [id, currentAssetType])

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
          message: assetResMessage,
          type: TOAST_TYPE.Error
        }
      })
    } else if (delistFromResaleStore) {
      setDelistConfirmation(false)
      showDelistFromResaleButton(false)
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: assetResMessage,
          type: TOAST_TYPE.Success
        }
      })
      dispatch(getOwnedAssetIndexSearch({ wishlistByLoggedInUser: false, assetId: delistFromResaleStore?.asset?.id, userId: userId }))
    }
  }, [delistFromResaleStore])

  useEffect(() => {
    if (delistAuctionFromResaleStore && delistAuctionFromResaleStore.errors) {
      setAuctionDelistConfirmation(false)
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: assetResMessage,
          type: TOAST_TYPE.Error
        }
      })
    } else if (delistAuctionFromResaleStore) {
      setAuctionDelistConfirmation(false)
      showDelistAuctionFromResaleButton(false)
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: assetResMessage,
          type: TOAST_TYPE.Success
        }
      })
    }
  }, [delistAuctionFromResaleStore])

  const showDelist = (ownedAsset) => {
    if (isOwnedAsset) {
      setAssetDetails(ownedAsset)
    }
    if (ownedAsset.isOnSale && assetDetails?.asset?.availableStock > 0) {
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
    if (isOwnedAsset || action === 'Resell') {
      return allRoutes.resellCreateAsset('resell', assetDetails?.id, assetDetails?.asset.id)
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
      return assetDetails?.sellingPrice || assetDetails?.asset?.currentPrice
    }
  }
  const getNetworkPrice = (price, symbol = 'ETH') => {
    return price * currencyMultiplier[symbol]
  }

  const handleDelistFromResellClick = () => {
    toggleConfirmationModal()
  }

  const handleDelistFromAuctionClick = () => {
    setAuctionDelistConfirmation(true)
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

  const handleAuctionDelistConfirmation = async () => {
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
        if (isOwnedAsset) {
          dispatch(auctionDelistFromResale({ id: auctionAssetDetails?.auction?.id }))
          setAuctionDelistConfirmation(false)
          return
        }
        dispatch(auctionDelistFromResale({ id: assetDetails?.auction?.id }))
        setAuctionDelistConfirmation(false)
      }
    }
  }

  const onChangeSelectWallet = () => {
    setConnectWallet((prev) => !prev)
  }

  const getDonation = () => {
    const amountInUSD = currencyMultiplier?.USD * assetDetails?.asset?.currentPrice
    const donationAmount = amountInUSD * (assetDetails?.sellerDonationPercentage / 100)
    return donationAmount
  }

  const action = getAction(userId, assetDetails)
  const giftAction = giftActionCondition(userId, assetDetails)
  const auction = assetDetails?.auction
  const gbpPrice = assetGbpPrice()
  const defaultNetworkSymbol = getNetworkSymbol(assetDetails?.blockchainNetwork || 'Ethereum')
  const gbpPriceToPrint = getStringWithCommas(gbpPrice)

  const showNetworkLinksAuctionCondition =
    assetDetails?.auction &&
    ((assetDetails?.auction?.statusName === AUCTION_STATUS.ENDED && assetDetails?.auction?.currentBidderId === userId) ||
      assetDetails?.auction?.createdBy === userId)

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
      {auctionDelistConfirmation && (
        <ConfirmationModal
          show={auctionDelistConfirmation}
          handleConfirmation={handleAuctionDelistConfirmation}
          handleClose={() => setAuctionDelistConfirmation(false)}
          loading={loading} // loading.current
          title={'Delist Confirmation'}
          description={'Are you sure to delist from resale?'}
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
                  {isRenderReactPlayer && (
                    <ReactPlayer
                      config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                      url={awsUrl}
                      controls
                      width="100%"
                      height="100%"
                    />
                  )}
                </div>
              </div>
              {assetDetails?.asset?.thumbnailAwsUrl && (
                <div className="thumb-row">
                  <OverlayTrigger placement="top" overlay={renderTooltip}>
                    <img src={assetDetails?.asset?.thumbnailAwsUrl} alt="thumbnail" />
                  </OverlayTrigger>
                </div>
              )}
              {isRender3d ? (
                <div className="asset-description d-flex flex-column flex-start mt-4 text-dark">
                  <label className="title">Original File:</label>
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
                    {isCurrentUserOwner ? (
                      <span>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`${window.location.origin}${allRoutes.previewAsset(assetDetails?.asset?.largerFileAwsUrl.split('/')[3])}`}
                        >
                          Click Here
                        </a>
                      </span>
                    ) : (
                      <span className="text-muted"> Purchase this asset to view the original file</span>
                    )}
                  </div>
                </div>
              ) : null}
            </Col>
            <Col md={12} lg={6}>
              <div className="asset-detail-content">
                <div className="asset-title">
                  <Row>
                    <Col md={6} lg={12} xl={6}>
                      <div className="asset-title-left">
                        <h4>{assetDetails?.asset?.name || assetDetails?.name}</h4>
                        <Button className="disable-btn" disabled>
                          {assetDetails?.asset?.blockchainNetwork || 'Blockchain network to be selected'}
                        </Button>
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
                      profileImage={assetDetails?.creator?.profilePicUrl || assetDetails?.asset?.creator?.profilePicUrl}
                      name={assetDetails?.creator?.userName || assetDetails?.asset?.creator?.userName}
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

                  <div className="prices">
                    <div className="section w-50">
                      <p className="edition">
                        <strong>
                          <span className="mr-1">£</span> {gbpPriceToPrint}
                        </strong>
                      </p>
                      <p className="edition">
                        <strong>
                          <span className="mr-1">{defaultNetworkSymbol}</span> {networkCurrencies[defaultNetworkSymbol]}
                        </strong>
                      </p>
                    </div>
                    <div className="section w-50">
                      {isCurrentUserCreator ? (
                        <p className="edition">
                          <strong>Royalty</strong>
                          <span>{assetDetails?.asset?.royaltyPercentage || 0}</span> %
                        </p>
                      ) : null}
                      {isCurrentUserSeller ? (
                        <p className="edition">
                          <strong>Donation</strong>
                          <span>
                            £ {getDonation()} ({assetDetails?.sellerDonationPercentage}%)
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {!assetDetails?.asset?.blockchainNetwork && (
                    <p className="edition">
                      <strong>
                        <span className="mr-1">{getNetworkSymbol(NETWORKS.POLYGON)}</span>{' '}
                        {networkCurrencies[getNetworkSymbol(NETWORKS.POLYGON)]}
                      </strong>
                    </p>
                  )}

                  <Button className="disable-btn mb-3" disabled>
                    {Number(assetDetails?.sellingPrice) >= 10000 ? 'Exclusive NFT' : 'Multichain NFT'}
                  </Button>

                  {assetDetails?.auctionId && (
                    <>
                      <p>
                        <Button className="disable-btn mb-3" disabled>
                          <FormattedMessage id="auctionStatus" />: {assetDetails?.auction?.statusName}
                        </Button>
                      </p>
                      {assetDetails?.auction?.statusName === AUCTION_STATUS.FAILED_TO_START && (
                        <p>
                          <Button className="disable-red-btn" disabled>
                            <FormattedMessage id="createNewAssetMessage" />
                          </Button>
                        </p>
                      )}
                    </>
                  )}

                  <div className="high-bid-btn d-flex flex-wrap">
                    {!!action && (
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

                    {!!giftAction && (
                      <Button
                        className={`black-btn ${giftAction ? '' : 'disabled'}`}
                        as={Link}
                        state={!isAuthenticated && { previousPath: location.pathname }}
                        to={isAuthenticated ? allRoutes.giftAsset(assetDetails?.asset?.id) : allRoutes.login}
                      >
                        {giftAction}
                      </Button>
                    )}

                    {!isOwnedAsset && delistFromResaleButton && !assetDetails?.auction?.id && (
                      <Button className="black-btn" onClick={handleDelistFromResellClick}>
                        Delist from resale
                      </Button>
                    )}
                    {isOwnedAsset && delistFromResaleButton && !auctionAssetDetails?.auction?.id && (
                      <Button className="black-btn" onClick={handleDelistFromResellClick}>
                        Delist from resale
                      </Button>
                    )}

                    {!isOwnedAsset &&
                      userId === assetDetails?.sellerId &&
                      assetDetails?.auction?.isOnResale &&
                      !assetDetails?.auction?.isExpired &&
                      !assetDetails?.auction?.currentBidderId &&
                      delistAuctionFromResaleButton && (
                        <Button className="black-btn" onClick={handleDelistFromAuctionClick}>
                          Auction Delist
                        </Button>
                    )}
                    {isOwnedAsset &&
                      userId === auctionAssetDetails?.sellerId &&
                      auctionAssetDetails?.auction?.isOnResale &&
                      !auctionAssetDetails?.auction?.isExpired &&
                      !auctionAssetDetails?.auction?.currentBidderId &&
                      delistAuctionFromResaleButton && (
                        <Button className="black-btn" onClick={handleDelistFromAuctionClick}>
                          Auction Delist
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

                {(isOwnedAsset || showNetworkLinksAuctionCondition) && (
                  <OwnedAssetLinks assetDetails={assetDetails} networkUrl={assetDetails?.networkUrl || assetDetails?.auction?.networkUrl} />
                )}

                <div className="asset-detail-desc">
                  <h6 className="text-dark">Description</h6>
                  <p>{assetDetails?.asset?.description}</p>
                </div>

                <div className="asset-detail-desc">
                  <h6 className="text-dark">Properties</h6>
                  <p>{assetDetails?.asset?.shortDescription}</p>
                </div>
                {assetDetails?.auctionId && <AuctionBidList getNetworkPrice={getNetworkPrice} assetDetails={assetDetails} />}
                <Reviews
                  userStore={userStore}
                  assetDetails={assetDetails}
                  isCurrentUserOwner={isCurrentUserOwner}
                  isCurrentUserCreator={isCurrentUserCreator}
                />
              </div>
            </Col>
          </Row>
        </div>
        <MoreFromArtist creatorId={assetDetails?.creator?.id} />
      </div>
    </>
  )
}

export default AssetDetailsView

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
