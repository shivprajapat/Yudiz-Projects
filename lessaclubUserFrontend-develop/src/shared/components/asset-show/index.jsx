import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Dropdown } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { AiTwotoneSound } from 'react-icons/ai'
import { MdOutlineVideoLibrary } from 'react-icons/md'

import { checkStarIcon, threeDotsIcon, userProfileIcon } from 'assets/images'
import { ThreeDIcon } from 'assets/images/icon-components/icons'
import { GlbViewer } from 'modules/3DFiles'
import { getAction } from 'modules/shared'
import { removeWishlistAsset, wishlistAsset } from 'modules/wishlist/redux/service'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import AuctionStartsOrEndsIn from 'shared/components/auction-starts-or-ends-in'
import { GLB, GLTF, TOAST_TYPE } from 'shared/constants'
import { allRoutes } from 'shared/constants/allRoutes'
import { getStringWithCommas } from 'shared/utils'
import ShowZip from '../ShowZip'
import './style.scss'
import { toggleAssetVisibility } from 'modules/assets/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'

const AssetShow = ({
  isForSale,
  isPrivate,
  isCollected,
  isCreated,
  asset,
  isTrending,
  isWishlist,
  handleWishlistAsset,
  currentSelectedId,
  setCurrentSelectedId,
  isActionButtonVisible = true,
  getAssets,
  customStyles = ''
}) => {
  const userId = localStorage.getItem('userId')

  const audioFormats = ['ogg', 'mp3', 'wav']
  const videoFormats = ['webm', 'mp4']

  const assetDetails = isCreated ? asset : asset?.asset
  const fileType = assetDetails?.fileType
  const awsUrl = assetDetails?.awsUrl
  const thumbnailAwsUrl = assetDetails?.thumbnailAwsUrl
  const isRender3d = fileType === GLB || (fileType === GLTF && awsUrl)
  const is3dStillZip = fileType === GLTF && !awsUrl
  const isBasicAssetDetails = ['crates', 'order-details', 'mystery-box', 'loot-box'].includes(location.pathname.split('/')[1])

  const action = getAction(userId, asset)

  const dispatch = useDispatch()

  const [show, setShow] = useState(false)
  const target = useRef(null)

  const ActionButton = () =>
    !!action && (
      <Button className="white-btn" as={Link} to={`${allRoutes.assetDetails(asset?.id)}?onSale`}>
        {action}
      </Button>
    )

  const getAssetDetailsLink = () => {
    if (isCollected) {
      if (asset?.owner?.id === userId) {
        return `${allRoutes.resellAssetDetails('resell', asset?.assetId, asset?.assetId)}?onSale`
      } else {
        return `${allRoutes.assetDetails(asset?.asset?.id)}?basic`
      }
    } else if (isCreated) {
      return `${allRoutes.resellAssetDetails('created', asset?.id, asset?.id)}?onSale`
    } else if (isWishlist) {
      return `${allRoutes.assetDetails(asset?.assetOnSale?.id)}?onSale`
    } else if (isBasicAssetDetails) {
      return `${allRoutes.assetDetails(asset?.asset?.id)}?basic`
    } else {
      return `${allRoutes.assetDetails(asset?.id)}?onSale`
    }
  }

  const getAssetPrice = () => {
    if (isWishlist) {
      return getStringWithCommas(asset?.assetOnSale?.sellingPrice)
    } else if (asset?.auctionId) {
      return getStringWithCommas(asset?.auctionCurrentBid || asset?.auctionMinimumPrice)
    } else {
      return getStringWithCommas(asset?.sellingPrice)
    }
  }

  const getCreatorProfilePicUrl = () => {
    if (isWishlist) {
      return asset?.assetOnSale?.creator?.profilePicUrl
    } else return asset?.creator?.profilePicUrl
  }

  const getCreatorUserName = () => {
    if (isWishlist) {
      return asset?.assetOnSale?.creator?.userName
    } else return asset?.creator?.userName
  }

  const getCreatorId = () => {
    if (isWishlist) {
      return asset?.assetOnSale?.creator?.id
    } else return asset?.creator?.id
  }

  const togglVisibility = async () => {
    const response = await dispatch(toggleAssetVisibility({ assetId: asset.id, isPrivate: asset.isPrivate }))
    const isUpdateSuccess = response?.status === 200
    if (getAssets && isUpdateSuccess) {
      getAssets()
    }
    dispatch({
      type: SHOW_TOAST,
      payload: {
        message: isUpdateSuccess ? 'Updated Asset visibility' : 'Failed to update asset visibility',
        type: isUpdateSuccess ? TOAST_TYPE.Success : TOAST_TYPE.Error
      }
    })
  }

  const getAssetTypeIcon = () => {
    if (isRender3d) {
      return <ThreeDIcon />
    }
    if (audioFormats.includes(fileType)) {
      return <AiTwotoneSound />
    }
    if (videoFormats.includes(fileType)) {
      return <MdOutlineVideoLibrary />
    }
  }

  const getAssetTypeTitle = () => {
    if (isRender3d) {
      return 'This is a 3D asset'
    }
    if (audioFormats.includes(fileType)) {
      return 'This is an audio asset'
    }
    if (videoFormats.includes(fileType)) {
      return 'This is a video asset'
    }
  }

  return (
    <Col md="6" lg="4" xl="3" className={customStyles}>
      <div ref={target} onMouseEnter={() => setShow(asset?.id)} onMouseLeave={() => setShow(null)} className="single-grid-list">
        <div className="mark-priv-user d-flex justify-content-between align-items-center">
          <div className="user-details w-100 d-flex align-items-center">
            <div className="grid-user-img">
              <img src={getCreatorProfilePicUrl() || userProfileIcon} alt="user-img" className="img-fluid" />
              <img src={checkStarIcon} alt="user-img" className="img-fluid check-img" />
            </div>
            <div className='w-100 d-flex justify-content-between title'>
              <span className="user-id">{getCreatorUserName()}</span>
              <div className='asset-type' title={getAssetTypeTitle()}>
                {getAssetTypeIcon()}
              </div>
            </div>
            <Link to={allRoutes.creatorCollected(getCreatorId())}></Link>
          </div>
          {/* {isForSale && !isCreated && asset && asset?.creator && userId === asset?.creator?.id && (
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <img src={threeDots} alt="dot-icon" className="img-fluid" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>{isPrivate ? 'Mark as public' : 'Mark as private'}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          */}
          {isCollected && userId === asset?.owner?.id && (
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <img src={threeDotsIcon} alt="dot-icon" className="img-fluid" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={togglVisibility}>
                  {asset.isPrivate ? 'Mark as public' : 'Mark as private'}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <figure>
          {isRender3d && (
            <div className="three-d-asset three-d-asset-h">
              <GlbViewer
                artwork={awsUrl}
                thumbnail={thumbnailAwsUrl}
                showThumbnail={true}
                assetId={asset?.id}
                ignoreThumbnail={currentSelectedId === asset?.id}
                setCurrentSelectedId={setCurrentSelectedId}
              />
            </div>
          )}
          {is3dStillZip && (
            <div className="three-d-asset-h">
              <ShowZip />
            </div>
          )}

          {!isRender3d && !is3dStillZip && <img src={thumbnailAwsUrl || awsUrl} alt="detail-img" className="img-fluid" />}

          <span className="img-title">{assetDetails?.name}</span>
          {/* TODO: */}
          {isForSale && <p className="img-title-desc">{assetDetails?.description}</p>}
        </figure>
        {/* FOR REGULAR AUCTION AND FIXED PRICE LISTING */}
        {!isCreated && !isCollected && (
          <div className="auction">
            <div className="auc-inner d-flex justify-content-between">
              <div className="network-wrapper">
                {asset.blockchainNetwork}
              </div>
              <div className="auction-wrapper">
                {asset?.auctionId && (
                  <AuctionStartsOrEndsIn
                    auction={asset?.auction}
                    auctionEndTime={asset?.saleEndTime}
                    auctionStartTime={asset?.saleStartTime}
                    isAssetList
                  />
                )}
              </div>
              <div className="wishlist-wrapper">
                <Wishlist asset={asset} isWishlist={isWishlist} handleWishlistAsset={handleWishlistAsset} />
              </div>
            </div>
            <div className="price-bid d-flex align-items-center justify-content-between">
              <div className="price-sec">
                <span>
                  {asset?.auctionId ? (
                    <FormattedMessage id={asset?.auctionCurrentBid ? 'currentBid' : 'reservedPrice'} />
                  ) : (
                    <FormattedMessage id="price" />
                  )}
                </span>
                <h5>
                  {getAssetPrice()}
                  GBP
                </h5>
              </div>
              {isActionButtonVisible && <ActionButton />}
            </div>
          </div>
        )}
        {/* FOR REGULAR AUCTION AND FIXED PRICE LISTING FINISHES */}

        {/* {isForSale && asset && asset?.creator && userId === asset?.creator?.id && (
          <div className="coll-priv-btn d-flex flex-wrap justify-content-between">
            <Button className="white-btn">
              <FormattedMessage id="sellNft" />
            </Button>
            <Button className="theme-btn">
              <FormattedMessage id="giftNft" />
            </Button>
          </div>
        )} */}

        {/* FOR COLLECTED TAB ONLY */}
        {isCollected && userId === asset?.owner?.id && (
          <>
            <div className="d-flex flex-wrap justify-content-between">
              <span className="">{asset?.blockchainNetwork}</span>
              <span className="">{asset?.price} GBP </span>
            </div>
            <div className="coll-priv-btn d-flex flex-wrap justify-content-between">
              <ActionButton />
              <Button className="theme-btn" as={Link} to={allRoutes.giftAsset(asset?.id)}>
                <FormattedMessage id="giftNft" />
              </Button>
            </div>
          </>
        )}

        <Link to={getAssetDetailsLink()} className="grid-inner-link"></Link>
      </div>
      <Overlay target={target.current} show={isRender3d && show === asset?.id} placement="top">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            Click on the thumbnail to preview the asset
          </Tooltip>
        )}
      </Overlay>
    </Col>
  )
}
AssetShow.propTypes = {
  isForSale: PropTypes.bool,
  isPrivate: PropTypes.bool,
  isCollected: PropTypes.bool,
  isCreated: PropTypes.bool,
  asset: PropTypes.object,
  isTrending: PropTypes.bool,
  isWishlist: PropTypes.bool,
  handleWishlistAsset: PropTypes.func,
  currentSelectedId: PropTypes.number,
  setCurrentSelectedId: PropTypes.func,
  getAssets: PropTypes.func,
  isActionButtonVisible: PropTypes.bool,
  customStyles: PropTypes.string
}
export default AssetShow

const Wishlist = ({ asset, isWishlist, handleWishlistAsset }) => {
  const userId = localStorage.getItem('userId')
  const wishlistRef = useRef()
  const dispatch = useDispatch()
  useEffect(() => {
    if (asset?.wishlistByLoggedInUser || isWishlist) {
      wishlistRef.current.classList.add('active')
    }
  }, [asset, isWishlist])

  const handleWishlist = () => {
    if (wishlistRef.current.classList.contains('active')) {
      wishlistRef.current.classList.remove('active')
      dispatch(removeWishlistAsset({ assetOnSaleId: isWishlist ? asset?.assetOnSale?.id : asset?.id }))
      handleWishlistAsset(asset)
    } else {
      wishlistRef.current.classList.add('active')
      dispatch(wishlistAsset({ assetId: asset?.assetId, assetOnSaleId: asset?.id, userId: userId }))
    }
  }
  return <Button className="wishlist-btn" ref={wishlistRef} onClick={handleWishlist} />
}

Wishlist.propTypes = {
  asset: PropTypes.object,
  isWishlist: PropTypes.bool,
  handleWishlistAsset: PropTypes.func
}
