import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'

export default function PollOptions({ oPollOption, handleVote, selectedOption, isPreview, totalPollCount, isWidgetPoll }) {
  const isActive = (id) => id && selectedOption === id ? 'active' : ''
  const pollPercentage = totalPollCount && totalPollCount >= oPollOption.nVote ? (oPollOption.nVote * 100) / totalPollCount : 0

  return (
    <>
      <div className={`${styles.item} d-flex align-items-center mb-2 pt-1 position-relative`}>
        <div
          className={`${styles.probabilityBg} flex-grow-1 position-relative ${isWidgetPoll ? '' : 'me-3 me-lg-4 me-xxl-5'} br-sm overflow-hidden`}
          onClick={() => !isPreview && handleVote({ iOptionId: oPollOption?._id || '' })}
        >
          <span
            className={`${styles.name} px-2 ${isWidgetPoll ? '' : 'px-md-3'} font-semi position-absolute w-100 top-50 start-0 text-nowrap overflow-hidden t-ellipsis translate-middle-y`}
          >
            {oPollOption?.sTitle}
          </span>
          <div className={`${styles.probability} ${styles[isActive(oPollOption?._id)]}`} style={{ width: pollPercentage + '%' }}></div>
          {/* ADD class with active %  ${styles.active} */}
        </div>
        <div className={`${styles.value} ${isWidgetPoll ? 'position-absolute end-0 top-50 translate-middle-y me-2' : ''} big-text text-end`}>{pollPercentage.toFixed(1) || 0}%</div>
      </div>
    </>
  )
}

PollOptions.propTypes = {
  oPollOption: PropTypes.object.isRequired,
  handleVote: PropTypes.func.isRequired,
  isPreview: PropTypes.bool,
  selectedOption: PropTypes.string,
  totalPollCount: PropTypes.number,
  isWidgetPoll: PropTypes.bool
}
