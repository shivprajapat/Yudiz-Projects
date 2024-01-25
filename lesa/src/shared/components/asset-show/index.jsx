import React from 'react'
import { Button, Col, Dropdown } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import './style.scss'
import { gridListUserIcon, threeDotsIcon, checkStarIcon } from 'assets/images'
import { getStringWithCommas, localStorageUserId } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'
import AuctionStartsOrEndsIn from 'shared/components/auction-starts-or-ends-in'
import { getAction } from 'modules/shared'

const AssetShow = ({ isForSale, isPrivate, isCollected, isCreated, asset }) => {
  const userId = useSelector((state) => state.auth.userId) || localStorageUserId
  const assetDetails = isCreated ? asset : asset?.asset

  const action = getAction(userId, asset)

  const ActionButton = () =>
    !!action && (
      <Button className="white-btn" as={Link} to={allRoutes.assetDetails(asset?.id)}>
        {action}
      </Button>
    )

  const getAssetDetailsLink = () => {
    if (isCollected) {
      return allRoutes.resellAssetDetails('resell', asset?.id)
    } else if (isCreated) {
      return allRoutes.resellAssetDetails('created', asset?.id)
    } else {
      return allRoutes.assetDetails(asset?.id)
    }
  }

  return (
    <Col md="6" lg="4" xl="3">
      <div className="single-grid-list">
        <div className="mark-priv-user d-flex justify-content-between align-items-center">
          <div className="user-details d-flex align-items-center">
            <div className="grid-user-img">
              <img src={gridListUserIcon} alt="user-img" className="img-fluid" />
              <img src={checkStarIcon} alt="user-img" className="img-fluid check-img" />
            </div>
            <span className="user-id">{asset?.creator?.userName}</span>
            <Link to={allRoutes.creatorCollected(asset?.creator?.id)}></Link>
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
          )} */}
          {isCollected && userId === asset?.owner?.id && (
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <img src={threeDotsIcon} alt="dot-icon" className="img-fluid" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>{isPrivate ? 'Mark as public' : 'Mark as private'}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <figure>
          <img src={assetDetails?.awsUrl} alt="nft" className="img-fluid" loading="lazy" />
          <span className="img-title">{assetDetails?.name}</span>
          {/* TODO: */}
          {isForSale && <p className="img-title-desc">{assetDetails?.description}</p>}
          {/* <p className="img-title-desc">{asset?.asset?.description}</p> */}
        </figure>
        {/* TODO: improvements */}
        {/* FOR REGULAR AUCTION AND FIXED PRICE LISTING */}
        {asset?.auctionId && (
          <div className="auction">
            <div className="auc-inner d-flex justify-content-between">
              <Button className="wishlist-btn flex-shrink-0"> </Button>
              <AuctionStartsOrEndsIn auctionEndTime={asset?.saleEndTime} auctionStartTime={asset?.saleStartTime} isAssetList />
            </div>
            <div className="price-bid d-flex align-items-center justify-content-between">
              <div className="price-sec">
                <span>
                  <FormattedMessage id={asset?.auctionCurrentBid ? 'currentBid' : 'reservedPrice'} />
                </span>
                <h5>{getStringWithCommas(asset?.auctionCurrentBid || asset?.auctionMinimumPrice)} GBP</h5>
              </div>

              <ActionButton />
            </div>
          </div>
        )}

        {!isCreated && !isCollected && !asset?.auctionId && (
          <div className="auction">
            <div className="auc-inner d-flex justify-content-between">
              <Button className="wishlist-btn flex-shrink-0"> </Button>
            </div>
            <div className="price-bid d-flex align-items-center justify-content-between">
              <div className="price-sec">
                <span>
                  <FormattedMessage id="price" />
                </span>
                <h5>{getStringWithCommas(asset?.sellingPrice)} GBP</h5>
              </div>
              <ActionButton />
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
              <Button className="theme-btn">
                <FormattedMessage id="giftNft" />
              </Button>
            </div>
          </>
        )}

        <Link to={getAssetDetailsLink()} className="grid-inner-link"></Link>
      </div>
    </Col>
  )
}
AssetShow.propTypes = {
  isForSale: PropTypes.bool,
  isPrivate: PropTypes.bool,
  isCollected: PropTypes.bool,
  isCreated: PropTypes.bool,
  asset: PropTypes.object
}
export default AssetShow
