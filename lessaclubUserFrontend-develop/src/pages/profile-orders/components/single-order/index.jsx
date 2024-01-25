import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { userProfileIcon, checkStarIcon } from 'assets/images'
import { convertDateToLocaleString, getStringWithCommas, orderStatus } from 'shared/utils'
import { GlbViewer } from 'modules/3DFiles'
import ShowZip from 'shared/components/ShowZip'
import { GLB, GLTF } from 'shared/constants'
import { allRoutes } from 'shared/constants/allRoutes'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const SingleOrder = ({ asset }) => {
  const navigate = useNavigate()
  const [isShowBtn, setIsShowBtn] = useState(false)

  const isOrderFailed = () => {
    if ([5, 10, 14].includes(asset?.status)) {
      return true
    } else return false
  }

  let awsUrl = asset?.asset?.awsUrl
  const thumbnailUrl = asset?.asset?.thumbnailAwsUrl
  let paymentCurrencyType = asset?.paymentCurrencyName || '-'
  let assetName = asset?.asset?.name
  let totalPrice = `£ ${asset?.totalPrice ? getStringWithCommas(asset?.totalPrice) : '-'}`
  let createdBy = asset?.asset?.creator?.userName
  let orderType = asset?.auctionId ? 'Auction Asset' : 'Fixed Asset'
  let btnText

  const fileType = asset?.asset?.fileType
  const isRender3d = fileType === GLB || (fileType === GLTF && awsUrl)
  const is3dStillZip = fileType === GLTF && !awsUrl
  const isRenderImage = !isRender3d && !is3dStillZip
  const orderStatusFromAsset = asset?.status

  const noShowButtonStatusList = [
    orderStatus.PAYMENT_PENDING,
    orderStatus.PAYMENT_FAILED,
    orderStatus.CANCELLED,
    orderStatus.REFUND_PAYMENT_PENDING,
    orderStatus.REFUND_PAYMENT_SUCCESS,
    orderStatus.REFUND_PAYMENT_FAILED,
    orderStatus.INCOMPLETE
  ]
  const showButtonStatusList = [
    orderStatus.PENDING,
    orderStatus.ADDRESS_SAVED,
    orderStatus.PAYMENT_NOT_STARTED,
    orderStatus.AUCTION_PAYMENT_SUCCESS,
    orderStatus.AUCTION_INPROGRESS,
    orderStatus.AUCTION_ORDER_SUCCESS,
    orderStatus.PAYMENT_SUCCESS,
    orderStatus.TRANSFER_NFT_SUCCESS,
    orderStatus.TRANSFER_NFT_FAILED,
    orderStatus.TRANSFER_NFT_PENDING,
    orderStatus.COMPLETED,
    orderStatus.MANUAL_LOGISTICS_SELECTED,
    orderStatus.AUTOMATED_LOGISTICS_SELECTED,
    orderStatus.PACKAGE_PACKED,
    orderStatus.PACKAGE_POSTED,
    orderStatus.PACKAGE_IN_TRANSIT,
    orderStatus.PACKAGE_OUT_FOR_DELIVERY,
    orderStatus.PACKAGE_DELIVERED,
    orderStatus.PACKAGE_NOT_DELIVERED,
    orderStatus.BUYER_CONFIRMED_PACKAGE_DELIVERED,
    orderStatus.BUYER_CONFIRMED_PACKAGE_NOT_DELIVERED
  ]

  if (asset?.mysteryBoxId) {
    awsUrl = asset.mysteryBox?.thumbnailUrl
    paymentCurrencyType = asset?.statusName === 'Cancelled' ? '-' : 'Nuucoin'
    assetName = asset.mysteryBox?.name
    totalPrice = `£ ${asset?.statusName !== 'Cancelled' ? getStringWithCommas(asset?.totalPrice) : '-'}`
    createdBy = asset.mysteryBox?.creator?.userName
    orderType = 'Mystery Box'
  }

  if (asset?.lootBoxId) {
    awsUrl = asset.lootBox?.thumbnailUrl
    paymentCurrencyType = asset?.statusName === 'Cancelled' ? '-' : 'Nuucoin'
    assetName = asset.lootBox?.name
    totalPrice = `£ ${asset?.statusName !== 'Cancelled' ? getStringWithCommas(asset?.totalPrice) : '-'}`
    createdBy = asset.lootBox?.creator?.userName
    orderType = 'Loot Box'
  }

  if ([6, 7].includes(asset?.status)) {
    btnText = 'Details'
  }
  if ([4, 9, 10, 12, 16, 8].includes(asset?.status)) {
    btnText = 'View Order'
  }

  if (asset?.status >= 18 && asset?.status <= 27) {
    btnText = 'Track Order'
  }

  if ([0, 1, 2].includes(asset?.status)) {
    btnText = 'Edit Order'
  }

  const goToOrderDetails = (order) => {
    if ([4, 9, 12, 10, 16, 8, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].includes(asset?.status)) {
      navigate(`${allRoutes.orderDetails}?orderId=${order.id}`)
    }
  }

  const gotoAssetDetails = (assetId) => {
    navigate(`${allRoutes.assetDetails(assetId)}?onSale`)
  }

  const clickHandler = (e) => {
    e.preventDefault()
    if ([6, 7].includes(asset?.status)) {
      gotoAssetDetails(asset?.assetsOnSaleId)
    }

    if ([4, 9, 10, 12, 16, 8, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].includes(asset?.status)) {
      goToOrderDetails(asset)
    }

    if ([0, 1, 2].includes(asset?.status)) {
      if (asset?.lootBoxId) {
        navigate(allRoutes.lootBoxCheckout(asset.lootBoxId))
      } else if (asset?.mysteryBoxId) {
        navigate(allRoutes.mysteryBoxCheckout(asset?.mysteryBoxId))
      } else {
        navigate(allRoutes.checkout(asset?.assetsOnSaleId))
      }
    }
  }

  useEffect(() => {
    if (noShowButtonStatusList.includes(orderStatusFromAsset)) {
      setIsShowBtn(false)
    } else if (showButtonStatusList.includes(orderStatusFromAsset)) {
      setIsShowBtn(true)
    }
  }, [orderStatusFromAsset])

  return (
    <>
      <div className="order-main">
        <div className="order-list">
          <div className="order-top d-flex flex-wrap">
            <div className="order-top-inner d-flex">
              <span>Order Placed: </span>
              <span>{convertDateToLocaleString(asset?.updatedAt)}</span>
            </div>
            <div className="order-top-inner d-flex">
              <span>Asset Type: </span>
              <span>{orderType}</span>
            </div>

            <div className="order-top-inner d-flex justify-content-md-center">
              <span>Payment Method: </span>
              <span>{asset?.orderType === 3 ? 'Gift' : paymentCurrencyType}</span>
            </div>

            <div className="order-top-inner d-flex">
              <span>Order Id: </span>
              <span>{asset?.orderNumber}</span>
            </div>
          </div>
          <div className="order-bottom d-flex flex-wrap">
            <div
              className="order-img d-flex"
              style={[4, 16].includes(asset?.status) ? { cursor: 'pointer' } : {}}
              onClick={() => goToOrderDetails(asset)}
            >
              {isRender3d && <GlbViewer artwork={awsUrl} showThumbnail={true} thumbnail={asset?.asset?.thumbnailAwsUrl} />}
              {is3dStillZip && <ShowZip iconDark={true} />}
              {isRenderImage && <img src={thumbnailUrl || awsUrl} alt="order-img" className="img-fluid" />}
              <div className="order-img-content">
                <span>{asset?.asset?.assetCategories[0]?.category?.name}</span>
                <div className="order-img-desc d-flex">
                  <h5>{assetName}</h5>
                  {asset?.asset?.isPhysical && <span className="asset">Physical Asset</span>}
                  {asset?.asset?.isExclusive && <span className="asset">Exclusive Asset</span>}
                </div>
              </div>
            </div>

            <div className="bought">
              <span>Bought for</span>
              <h5>{totalPrice}</h5>
            </div>
            <div className="owned-by d-flex">
              <div className={`user-img flex-shrink-0 ${asset?.user?.kycStatus === 'Approved' && 'checkStar'} `}>
                <img src={asset?.user?.profilePicUrl || userProfileIcon} alt="user-img" className="img-fluid" />
                <img src={checkStarIcon} className="tick-img img-fluid" />
              </div>
              <div className="owned-desc">
                <span>Created By</span>
                <span className="d-block user-id">@{createdBy}</span>
              </div>
            </div>
            <div className="flex-fill result d-flex flex-column align-items-center justify-content-center gap-3 flex-wrap">
              <div className="d-flex flex-column align-items-center">
                <h5 className={`${isOrderFailed() ? 'failed' : 'success'}`}>{asset?.statusName}</h5>
                <span>{convertDateToLocaleString(asset?.updatedAt)}</span>
              </div>
              {isShowBtn && (
                <Button className="white-btn" onClick={clickHandler}>
                  {btnText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
SingleOrder.propTypes = {
  asset: PropTypes.object.isRequired
}
export default SingleOrder
