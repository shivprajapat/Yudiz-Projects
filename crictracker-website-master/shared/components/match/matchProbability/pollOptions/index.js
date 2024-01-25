import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'

export default function PollOptions({ oPollOption, handleVote, selectedOption, isPreview, totalPollCount, isExpired, isWidgetPoll }) {
  const isActive = (id) => id && selectedOption === id ? 'active' : ''
  const pollPercentage = totalPollCount && totalPollCount >= oPollOption.nVote ? (oPollOption.nVote * 100) / totalPollCount : 0

  return (
    <>
      {isWidgetPoll ? (
        <div
          className={`${styles.probabilityBg} ${styles.widgetBG} flex-grow-1 position-relative br-sm overflow-hidden`}
          onClick={() => !isPreview && handleVote({ iOptionId: oPollOption?._id || '' })}
        >
          <span
            className={`${styles.name} ${
              isExpired ? 'text-start' : `${!selectedOption && 'text-center'}`
            }  px-2 px-md-3 font-semi position-absolute top-50 start-0 text-nowrap overflow-hidden t-ellipsis translate-middle-y`}
            style={{ width: !selectedOption ? '100%' : '85%' }}
          >
            {oPollOption?.sTitle}
          </span>
          <div
            className={`${styles.probability} ${styles[isActive(oPollOption?._id)]}`}
            style={{ width: isExpired || selectedOption ? pollPercentage + '%' : '0' }}
          >
            {(isExpired || selectedOption) && (
              <div className={`${styles.value} position-absolute w-100 top-50 translate-middle-y pe-2 text-end`}>
                {pollPercentage.toFixed(1) || 0}%
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`${styles.item} d-flex align-items-center mb-2 mb-md-3`}>
          <div
            className={`${styles.probabilityBg} flex-grow-1 position-relative me-3 me-lg-4 me-xxl-5 br-sm overflow-hidden`}
            onClick={() => !isPreview && handleVote({ iOptionId: oPollOption?._id || '' })}
          >
            <span
              className={`${styles.name} px-2 px-md-3 font-semi position-absolute w-100 top-50 start-0 text-nowrap overflow-hidden t-ellipsis translate-middle-y`}
            >
              {oPollOption?.sTitle}
            </span>
            <div className={`${styles.probability} ${styles[isActive(oPollOption?._id)]}`} style={{ width: pollPercentage + '%' }}></div>
          </div>
          <div className={`${styles.value} big-text text-end`}>{pollPercentage.toFixed(1) || 0}%</div>
        </div>
      )}
    </>
  )
}

PollOptions.propTypes = {
  oPollOption: PropTypes.object.isRequired,
  handleVote: PropTypes.func.isRequired,
  isPreview: PropTypes.bool,
  selectedOption: PropTypes.string,
  totalPollCount: PropTypes.number,
  isExpired: PropTypes.bool,
  isWidgetPoll: PropTypes.bool
}
