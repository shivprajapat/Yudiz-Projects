import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import AssetShare from 'shared/components/asset-share'
import { getAssetDetails, getCreatedAssetDetails, getOwnedAssetDetails } from 'modules/assets/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import { getNetworkSymbol, getStringWithCommas, localStorageUserId } from 'shared/utils'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import UserInfo from 'shared/components/user-info'
import AuctionStartsOrEndsIn from '../../shared/components/auction-starts-or-ends-in'
import OwnedAssetLinks from './components/owned-asset-links'
import AuctionBidList from './components/auction-bid-list'
import MoreFromArtist from './components/more-from-artist'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { getAction } from 'modules/shared'

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

  const assetDetailStore = useSelector((state) => state.asset.assetDetails)
  const ownedAssetDetailStore = useSelector((state) => state.asset.ownedAssetDetails)
  const userId = useSelector((state) => state.auth.userId) || localStorageUserId
  const exchangeRateStore = useSelector((state) => state.exchangeRate)
  const createdAssetDetailStore = useSelector((state) => state.asset.createdAssetDetails)

  useEffect(() => {
    if (assetDetailStore && !isOwnedAsset) {
      setAssetDetails(assetDetailStore.assetOnSale)
    }
  }, [assetDetailStore])

  useEffect(() => {
    if (ownedAssetDetailStore && isOwnedAsset) {
      setAssetDetails(ownedAssetDetailStore.ownedAsset)
    }
  }, [ownedAssetDetailStore])

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
        dispatch(getOwnedAssetDetails(id))
      } else if (isCreatedAsset) {
        dispatch(getCreatedAssetDetails({ assetId: id }))
      } else {
        dispatch(getAssetDetails(id))
      }
    }
  }, [id])

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
    } else return assetDetails?.sellingPrice
  }
  const getNetworkPrice = (price) => {
    return price * currencyMultiplier
  }

  const currentOwnerName = assetDetails?.asset?.currentOwner?.userName || assetDetails?.owner?.userName

  const action = getAction(userId, assetDetails)

  return (
    <>
      {share && <AssetShare show={share} handleClose={handleShare} assetImage={assetDetails?.asset?.awsUrl} />}

      <div className="asset-detail-page">
        <div className="asset-detail">
          <Row>
            <Col md={12} lg={6}>
              <div className="asset-detail-img">
                <img src={assetDetails?.asset?.awsUrl} alt="detail-img" className="img-fluid" />
              </div>
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
                            Physical Asset
                          </Button>
                        )}
                      </div>
                    </Col>
                    {assetDetails?.auctionId && (
                      <Col md={6} lg={12} xl={6}>
                        <AuctionStartsOrEndsIn auctionEndTime={assetDetails?.saleEndTime} auctionStartTime={assetDetails?.saleStartTime} />
                      </Col>
                    )}
                  </Row>

                  <div className="asset-owner-artist d-flex flex-wrap">
                    {assetDetails?.asset?.currentOwnerId && (
                      <UserInfo
                        name={currentOwnerName}
                        isOwner
                        isDark
                        link={allRoutes.creatorCollected(assetDetails?.asset?.currentOwnerId)}
                      />
                    )}
                    <UserInfo name={assetDetails?.creator?.userName} isDark link={allRoutes.creatorCollected(assetDetails?.creator?.id)} />
                  </div>
                </div>

                <div className="asset-high-bid">
                  {assetDetails?.auctionId && assetDetails?.auction?.currentBidder && (
                    <p className="place-by">Highest bid placed by @{assetDetails?.auction?.currentBidder?.userName} </p>
                  )}

                  <p className="edition">
                    <strong>
                      <span className="mr-1">£</span> {getStringWithCommas(assetGbpPrice())}
                    </strong>{' '}
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
                        Auction Status: {assetDetails?.auction?.statusName}
                      </Button>
                    </p>
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

                    <Button className="black-border-btn" onClick={handleShare}>
                      Share
                    </Button>

                    <div className="fav-icon d-flex align-items-center">
                      <Button className="wishlist-btn"></Button>
                      <span>190</span>
                    </div>
                  </div>
                </div>

                {isOwnedAsset && <OwnedAssetLinks assetDetails={assetDetails} />}

                <div className="asset-detail-desc">
                  <p>{assetDetails?.asset?.description}</p>
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
