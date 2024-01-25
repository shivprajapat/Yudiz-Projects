import React from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

import './style.scss'
import Timer from 'shared/components/timer'
import { getTimeDiff } from 'shared/utils'

const AuctionStartsOrEndsIn = ({ auction, auctionEndTime, auctionStartTime, isAssetList }) => {
  const labels = {
    auction: useIntl().formatMessage({ id: 'auction' }),
    ends: useIntl().formatMessage({ id: 'ends' }),
    starts: useIntl().formatMessage({ id: 'starts' }),
    in: useIntl().formatMessage({ id: 'in' }),
    notStarted: useIntl().formatMessage({ id: 'notStarted' }),
    auctionYetToStart: useIntl().formatMessage({ id: 'auctionYetToStart' }),
    auctionHasEnded: useIntl().formatMessage({ id: 'auctionHasEnded' })
  }

  const isAuctionStarted = getTimeDiff(auctionStartTime) <= 0
  const isAuctionEndsInFuture = getTimeDiff(auctionEndTime) > 0

  return (
    <div className="auction-starts-ends">
      <div className={isAssetList ? 'asset-list-timer' : 'asset-detail-timer d-flex'}>
        {isAuctionEndsInFuture ? (
          <>
            <span className="d-block">{`${labels.auction} ${isAuctionStarted ? `${labels.ends}` : `${labels.starts}`} ${labels.in}`}</span>
            <strong>
              <Timer date={isAuctionStarted ? auctionEndTime : auctionStartTime} />
            </strong>
          </>
        ) : (
          <span className="d-block">
            {auction?.statusName === `${labels.notStarted}` ? `${labels.auctionYetToStart}` : `${labels.auctionHasEnded}`}
          </span>
        )}
      </div>
    </div>
  )
}
AuctionStartsOrEndsIn.propTypes = {
  auction: PropTypes.object,
  auctionEndTime: PropTypes.number,
  auctionStartTime: PropTypes.number,
  isAssetList: PropTypes.bool
}
export default AuctionStartsOrEndsIn
