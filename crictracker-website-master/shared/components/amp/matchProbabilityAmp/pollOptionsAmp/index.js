import React from 'react'
import PropTypes from 'prop-types'

export default function PollOptionsAmp({ oPollOption, handleVote, selectedOption, totalPollCount, isTemplate }) {
  const pollPercentage = totalPollCount && totalPollCount >= oPollOption?.nVote ? (oPollOption?.nVote * 100) / totalPollCount : 0
  return (
    <>
      <style jsx amp-custom>
        {`
        .name{width:100%;position:absolute;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);color:var(--font-color-light);white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.probabilityBackground{position:relative;border:1px solid var(--border-light);border-radius:8px}.probability{height:34px;background:rgba(80,144,246,.5);border-radius:8px}.value{width:40px}/*# sourceMappingURL=style.css.map */

        `}
      </style>
      <div className={`item ${isTemplate ? '' : 'mb-2'} d-flex align-items-center`} >

        <div className='probabilityBackground flex-grow-1 me-2'>
          <div className='name d-flex align-items-center px-2'>
            <span className="font-semi">{isTemplate ? '{{sTitle}}' : oPollOption?.sTitle}</span>
          </div>

          <div className='probability' style={{ width: (isTemplate ? '{{nVote}}' : pollPercentage) + '%' }}></div>

        </div>
        <div className='ms-2 value big-text text-end'>{isTemplate ? '{{nVote}}' : pollPercentage.toFixed(1)}%</div>
      </div>
    </>

  )
}

PollOptionsAmp.propTypes = {
  oPollOption: PropTypes.object,
  totalPollCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  handleVote: PropTypes.func,
  selectedOption: PropTypes.string,
  isTemplate: PropTypes.bool
}
