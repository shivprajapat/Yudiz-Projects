import React from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

import './style.scss'
import Timer from 'shared/components/timer'
import { getTimeDiff } from 'shared/utils'

const DropStartsOrEndsIn = ({ endTime, startTime, isAssetList }) => {
  const labels = {
    drop: useIntl().formatMessage({ id: 'drop' }),
    ends: useIntl().formatMessage({ id: 'ends' }),
    starts: useIntl().formatMessage({ id: 'starts' }),
    in: useIntl().formatMessage({ id: 'in' }),
    notStarted: useIntl().formatMessage({ id: 'notStarted' }),
    auctionYetToStart: useIntl().formatMessage({ id: 'auctionYetToStart' }),
    auctionHasEnded: useIntl().formatMessage({ id: 'auctionHasEnded' })
  }

  const isAuctionStarted = getTimeDiff(startTime) <= 0
  const isAuctionEndsInFuture = getTimeDiff(endTime) > 0

  return (
    <div className="drop-starts-ends d-block">
      <div className={isAssetList ? 'asset-list-timer' : 'asset-detail-timer d-flex'}>
        {isAuctionEndsInFuture ? (
          <>
            <span className="">{`${labels.drop} ${isAuctionStarted ? `${labels.ends}` : `${labels.starts}`} ${labels.in}`}</span>
            <strong>
              <Timer date={isAuctionStarted ? endTime : startTime} />
            </strong>
          </>
        ) : (
          <span className="d-block">Drop Ended</span>
        )}
      </div>
    </div>
  )
}
DropStartsOrEndsIn.propTypes = {
  endTime: PropTypes.number,
  startTime: PropTypes.number,
  isAssetList: PropTypes.bool
}
export default DropStartsOrEndsIn
