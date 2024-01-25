import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'
import Timer from 'shared/components/timer'
import { getTimeDiff } from 'shared/utils'

const AuctionStartsOrEndsIn = ({ auctionEndTime, auctionStartTime, isAssetList }) => {
  const isAuctionStarted = getTimeDiff(auctionStartTime) <= 0
  const isAuctionEndsInFuture = getTimeDiff(auctionEndTime) > 0

  return (
    <div className="auction-starts-ends">
      <div className={isAssetList ? 'asset-list-timer' : 'asset-detail-timer d-flex'}>
        {isAuctionEndsInFuture ? (
          <>
            <span className="d-block">{`Auction ${isAuctionStarted ? 'ends' : 'starts'} in`}</span>
            <strong>
              <Timer date={isAuctionStarted ? auctionEndTime : auctionStartTime} />
            </strong>
          </>
        ) : (
          <span className="d-block">Auction has ended</span>
        )}
      </div>
    </div>
  )
}
AuctionStartsOrEndsIn.propTypes = {
  auctionEndTime: PropTypes.number,
  auctionStartTime: PropTypes.number,
  isAssetList: PropTypes.bool
}
export default AuctionStartsOrEndsIn
