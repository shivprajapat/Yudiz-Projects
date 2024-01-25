import React, { Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { gridListUserIcon } from 'assets/images'
import { getAuctionBids } from 'modules/auction/redux/service'
import { convertDateToLocaleString, getNetworkSymbol, getStringWithCommas } from 'shared/utils'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const AuctionBidList = ({ getNetworkPrice, assetDetails }) => {
  const dispatch = useDispatch()

  const [requestParams, setRequestParams] = useState({ page: 1, pageSize: 4, auctionId: assetDetails?.auctionId })
  const [bids, setBids] = useState()

  const auctionBidsStore = useSelector((state) => state.auction.auctionBids)

  useEffect(() => {
    if (auctionBidsStore) {
      setBids(auctionBidsStore)
    }
  }, [auctionBidsStore])

  useEffect(() => {
    dispatch(getAuctionBids(requestParams))
  }, [requestParams])

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <>
      <div className="asset-detail-list">
        {bids?.bid?.map((bid, index) => {
          return (
            <div key={index} className="asset-single-desc d-flex justify-content-between flex-wrap">
              <div className="single-desc-left d-flex align-items-center">
                <img src={bid?.user?.profilePicUrl || gridListUserIcon} className="img-fluid flex-shrink-0" alt="owner-img" />
                <div className="single-desc-inner">
                  <h6>Bid placed by @{bid?.user?.userName}</h6>
                  <span>{convertDateToLocaleString(bid?.auction?.createdAt)}</span>
                </div>
              </div>
              <div className="single-desc-right">
                <h5>
                  {getNetworkPrice(bid?.amount)} {getNetworkSymbol(assetDetails?.blockchainNetwork || 'Ethereum')}
                </h5>
                <span>£ {getStringWithCommas(bid?.amount)}</span>
              </div>
            </div>
          )
        })}
      </div>

      <Suspense fallback={<div />}>
        <CustomPagination
          className="asset-pagination"
          currentPage={requestParams?.page}
          totalCount={bids?.metaData?.totalItems}
          pageSize={5}
          onPageChange={handlePageChange}
        />
      </Suspense>
    </>
  )
}
AuctionBidList.propTypes = {
  getNetworkPrice: PropTypes.func,
  assetDetails: PropTypes.object
}
export default AuctionBidList
