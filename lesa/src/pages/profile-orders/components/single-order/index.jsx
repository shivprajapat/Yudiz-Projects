import React from 'react'
import PropTypes from 'prop-types'

import { gridListUserIcon, checkStarIcon } from 'assets/images'
import { convertDateToLocaleString } from 'shared/utils'

const SingleOrder = ({ asset }) => {
  const isOrderFailed = () => {
    if ([5, 10, 14].includes(asset?.status)) {
      return true
    } else return false
  }

  return (
    <>
      <div className="order-main">
        <div className="order-list">
          <div className="order-top d-flex">
            <div className="order-top-inner d-flex">
              <span>Order Placed: </span>
              <span>{convertDateToLocaleString(asset?.updatedAt)}</span>
            </div>
            <div className="order-top-inner d-flex justify-content-md-center ">
              <span>Payment Method: </span>
              <span>{asset?.paymentCurrencyName}</span>
            </div>
            <div className="order-top-inner d-flex justify-content-md-end">
              <span>Order Id: </span>
              <span>{asset?.orderNumber}</span>
            </div>
          </div>
          <div className="order-bottom d-flex flex-wrap">
            <div className="order-img d-flex align-items-center">
              <img src={asset?.asset?.awsUrl} alt="order-img" className="img-fluid" />
              <div className="order-img-content">
                <span>{asset?.asset?.assetCategories[0]?.category?.name}</span>
                <div className="order-img-desc d-flex">
                  <h5>{asset?.asset?.name}</h5>
                  {asset?.asset?.isPhysical && <span className="asset">Physical Asset</span>}
                  {asset?.asset?.isExclusive && <span className="asset">Exclusive Asset</span>}
                </div>
              </div>
            </div>
            <div className="bought">
              <span>Bought for</span>
              <h5>{asset?.totalPrice} GBP</h5>
            </div>
            <div className="owned-by d-flex">
              <div className={`user-img flex-shrink-0 ${asset?.user?.kycStatus === 'Approved' && 'checkStar'} `}>
                <img src={asset?.user?.profilePicUrl || gridListUserIcon} alt="user-img" className="img-fluid" />
                <img src={checkStarIcon} className="tick-img img-fluid" />
              </div>
              <div className="owned-desc">
                <span>Created By</span>
                <span className="d-block user-id">@{asset?.asset?.creator?.userName}</span>
              </div>
            </div>
            <div className="result">
              <h5 className={`${isOrderFailed() ? 'failed' : 'success'}`}>{asset?.statusName}</h5>
              <span>{convertDateToLocaleString(asset?.updatedAt)}</span>
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
