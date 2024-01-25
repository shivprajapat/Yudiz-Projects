import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import liveblogStyle from '../liveArticle/liveBlogCard/style.module.scss'
import { convertDateAMPM, dateCheck } from '@shared/utils'
import { PollIcon } from '@shared/components/ctIcons'

export default function Timeline({ timelineData, className, handleClose, ...props }) {
  function scrollIntoView(data) {
    const id = `${data?._id}_${data?.iEventId}_${data?.sEventId}`
    const element = document.getElementById(id)
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    handleClose && handleClose()
  }

  return (
    <div className={`${styles.timeline} p-2 ${className || ''}`} {...props}>
      <h3 className={`${styles.timelineTitle} text-uppercase`}>Timeline</h3>
      <div className={`${styles.timelineList} `}>
      {timelineData?.map(timelineContent => (
        <div key={timelineContent._id} onClick={() => scrollIntoView(timelineContent)} className={`${liveblogStyle[timelineContent?.eType === 'poll' ? 'iconBox' : 'liveBox']} ${styles.timelineCard} small-text border-0`}>
          {timelineContent?.eType === 'poll' ? <div className={`${liveblogStyle.icon} position-absolute`}>
          <PollIcon />
        </div> : null}
          <span className={`${styles.date} d-block`}>{convertDateAMPM(dateCheck(new Date()))} </span>
          <h2 className={`${styles.title}`}>{timelineContent.sTitle}</h2>
        </div>
      ))}
      </div>
    </div>
  )
}

Timeline.propTypes = {
  timelineData: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleClose: PropTypes.func,
  className: PropTypes.string
}
