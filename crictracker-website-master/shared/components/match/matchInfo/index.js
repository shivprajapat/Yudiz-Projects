import React from 'react'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import { convertDate, dateCheck } from '@shared/utils'
// import weatherIcon from '@assets/images/icon/weather-icon.svg'
// import outfieldIcon from '@assets/images/icon/outfield-icon.svg'
// import pitchIcon from '@assets/images/icon/pitch-icon.svg'

const MatchInfo = ({ data }) => {
  function getTossDetail() {
    if (data?.oToss?.sText) {
      return data?.oToss?.sText
    } else if (data?.oToss?.oWinnerTeam?._id) {
      return `${data?.oToss?.oWinnerTeam?.sTitle} elected to ${data?.oToss?.eDecision === 'fielding' ? 'bowl' : 'bat'}`
    } else return '-'
  }

  return (
    <section className={`${styles.matchInfo}`}>
      <h4 className="text-uppercase">
        <Trans i18nKey="common:Info" />
      </h4>
      <div className={`${styles.list} font-semi mb-4 br-sm overflow-hidden`}>
        <div className={`${styles.item} d-flex light-bg`}>
          <p className={`${styles.label} mb-0 text-muted text-uppercase flex-shrink-0`}>
            <Trans i18nKey="common:Series" />
          </p>
          <p className="mb-0">{data?.oSeries?.sTitle || '-'}</p>
        </div>
        {/* <div className={`${styles.item} d-flex light-bg`}>
          <p className={`${styles.label} mb-0 text-muted text-uppercase flex-shrink-0`}>
            <Trans i18nKey="common:Match" />
          </p>
          <p className="mb-0">{data?.sTitle || '-'}</p>
        </div> */}
        <div className={`${styles.item} d-flex light-bg`}>
          <p className={`${styles.label} mb-0 text-muted text-uppercase flex-shrink-0`}>
            <Trans i18nKey="common:Date" /> &amp; <Trans i18nKey="common:Time" />
          </p>
          <p className="mb-0">{convertDate(dateCheck(data?.dStartDate)) || '-'}</p>
        </div>
        <div className={`${styles.item} d-flex light-bg`}>
          <p className={`${styles.label} mb-0 text-muted text-uppercase flex-shrink-0`}>
            <Trans i18nKey="common:Toss" />
          </p>
          <p className="mb-0">
            {getTossDetail()}
          </p>
        </div>
        <div className={`${styles.item} d-flex light-bg`}>
          <p className={`${styles.label} mb-0 text-muted text-uppercase flex-shrink-0`}>
            <Trans i18nKey="common:Venue" />
          </p>
          <p className="mb-0">{data?.oVenue?.sName || '-'}</p>
        </div>
        <div className={`${styles.item} d-flex light-bg`}>
          <p className={`${styles.label} mb-0 text-muted text-uppercase flex-shrink-0`}>
            <Trans i18nKey="common:Umpires" />
          </p>
          <p className="mb-0">{data?.sUmpires || '-'}</p>
        </div>
        <div className={`${styles.item} d-flex light-bg`}>
          <p className={`${styles.label} mb-0 text-muted text-uppercase flex-shrink-0`}>
            <Trans i18nKey="common:MatchReferee" />
          </p>
          <p className="mb-0">{data?.sReferee || '-'}</p>
        </div>
        {/* <div className={`${styles.item} ${styles.infoItem} d-flex flex-column flex-lg-row`}>
          <div className="d-flex flex-lg-column justify-content-between align-items-center align-items-lg-start flex-grow-1">
            <div className={`${styles.info} d-flex align-items-center text-muted text-uppercase`}>
              <div className={`${styles.icon}`}>
                <MyImage src={weatherIcon} alt="WEATHER" layout="responsive" />
              </div>
              <p className="mb-0">WEATHER CONDITION</p>
            </div>
            <p className="mb-0">Overcast</p>
          </div>
          <div className="d-flex flex-lg-column justify-content-between align-items-center align-items-lg-start flex-grow-1">
            <div className={`${styles.info} d-flex align-items-center text-muted text-uppercase`}>
              <div className={`${styles.icon}`}>
                <MyImage src={outfieldIcon} alt="outfield" layout="responsive" />
              </div>
              <p className="mb-0">WEATHER CONDITION</p>
            </div>
            <p className="mb-0">Dry</p>
          </div>
          <div className="d-flex flex-lg-column justify-content-between align-items-center align-items-lg-start flex-grow-1">
            <div className={`${styles.info} d-flex align-items-center text-muted text-uppercase`}>
              <div className={`${styles.icon}`}>
                <MyImage src={pitchIcon} alt="pitch" layout="responsive" />
              </div>
              <p className="mb-0">WEATHER CONDITION</p>
            </div>
            <p className="mb-0">Fast</p>
          </div>
        </div> */}
      </div>
    </section>
  )
}

MatchInfo.propTypes = {
  data: PropTypes.object
}

export default MatchInfo
