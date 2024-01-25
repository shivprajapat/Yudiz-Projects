import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import pitchIcon from '@assets/images/icon/pitch-icon.svg'
import teamsIcon from '@assets/images/icon/teams-color-icon.svg'
import captainIcon from '@assets/images/icon/captain-icon.svg'
import teamFormIcon from '@assets/images/icon/teamform-icon.svg'
import matchInfoIcon from '@assets/images/icon/fantasy/match-info-icon.svg'
import xiIcon from '@assets/images/icon/fantasy/xi-icon.svg'
import notAvailableIcon from '@assets/images/icon/fantasy/not-available-icon.svg'
import avoidPlayerIcon from '@assets/images/icon/fantasy/avoid-player-icon.svg'
import weatherIcon from '@assets/images/icon/fantasy/weather-icon.svg'
import expertAdvIcon from '@assets/images/icon/fantasy/expert-adv-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const TableOfContent = ({ data, fantasystyles }) => {
  const { t } = useTranslation()
  const handleTab = (id) => {
    const element = document.querySelector(id)
    window.scrollTo({ top: element.offsetTop + 100, behavior: 'smooth' })
    // element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <>
      <p className={`${fantasystyles?.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}>
        {t('common:TableOfContents')}
      </p>
      <div className={`${styles.sectionNav} d-flex mx-n1 text-nowrap flex-nowrap flex-md-wrap mx-n1`}>
        <a
          className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
          onClick={(e) => handleTab('#matchInfo')}
        >
          <span className={`${styles.icon} flex-shrink-0 me-1`}>
            <MyImage src={matchInfoIcon} alt="matchInfo" layout="responsive" />
          </span>
          <span>
            <Trans i18nKey="common:MatchInfo" />
          </span>
        </a>
        {data?.oOverview && (
          <a
            className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
            onClick={(e) => handleTab('#playingXI')}
          >
            <span className={`${styles.icon} flex-shrink-0 me-1`}>
              <MyImage src={xiIcon} alt="playingXI" layout="responsive" />
            </span>
            <span>
              <Trans i18nKey="common:PlayingXI" />
            </span>
          </a>
        )}
         <a
          className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
          onClick={(e) => handleTab('#cVc')}
        >
          <span className={`${styles.icon} flex-shrink-0 me-1`}>
            <MyImage src={captainIcon} alt="captain" layout="responsive" />
          </span>
          <span>
            <Trans i18nKey="common:CnVC" />
          </span>
        </a>
        <a
          className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
          onClick={(e) => handleTab('#team')}
        >
          <span className={`${styles.icon} flex-shrink-0 me-1`}>
            <MyImage src={teamsIcon} alt="team" layout="responsive" />
          </span>
          <span>
            <Trans i18nKey="common:Teams" />
          </span>
        </a>
        {data?.WeatherReport?.data?.getWeatherCondition && (
          <a
            className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
            onClick={(e) => handleTab('#weatherReport')}
          >
            <span className={`${styles.icon} flex-shrink-0 me-1`}>
              <MyImage src={weatherIcon} alt="weatherReport" layout="responsive" />
            </span>
            <span>
              <Trans i18nKey="common:WeatherReport" />
            </span>
          </a>
        )}
        <a
          className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
          onClick={(e) => handleTab('#teamForm')}
        >
          <span className={`${styles.icon} flex-shrink-0 me-1`}>
            <MyImage src={teamFormIcon} alt="captain" layout="responsive" />
          </span>
          <span>
            <span className="d-none d-sm-inline">
              <Trans i18nKey="common:Team" />
              &nbsp;
            </span>
            <Trans i18nKey="common:Form" />
          </span>
        </a>
        {data?.oOverview && (
          <a
            className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
            onClick={(e) => handleTab('#availabilityNews')}
          >
            <span className={`${styles.icon} flex-shrink-0 me-1`}>
              <MyImage src={notAvailableIcon} alt="availabilityNews" layout="responsive" />
            </span>
            <span>
              <Trans i18nKey="common:InjuryNews" />
            </span>
          </a>
        )}
        {data?.oOverview && (
          <a
            className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
            onClick={(e) => handleTab('#pitch')}
          >
            <span className={`${styles.icon} flex-shrink-0 me-1`}>
              <MyImage src={pitchIcon} alt="pitch" layout="responsive" />
            </span>
            <span>
              <Trans i18nKey="common:Pitch" />
            </span>
          </a>
        )}
        {data?.aAvoidPlayer?.length !== 0 && (
          <a
            className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
            onClick={(e) => handleTab('#avoidablePlayers')}
          >
            <span className={`${styles.icon} flex-shrink-0 me-1`}>
              <MyImage src={avoidPlayerIcon} alt="avoidablePlayers" layout="responsive" />
            </span>
            <span>
              <Trans i18nKey="common:AvoidablePlayers" />
            </span>
          </a>
        )}
        {data?.oOtherInfo?.sExpertAdvice.length !== 0 && (
          <a
            className="theme-btn secondary-btn px-2 px-xl-3 py-2 d-flex align-items-center justify-content-center flex-shrink-0 mx-1 mt-md-1 mb-01"
            onClick={(e) => handleTab('#expertAdvice')}
          >
            <span className={`${styles.icon} flex-shrink-0 me-1`}>
              <MyImage src={expertAdvIcon} alt="expertAdvice" layout="responsive" />
            </span>
            <span>
              <Trans i18nKey="common:ExpertAdvice" />
            </span>
          </a>
        )}
      </div>
    </>
  )
}

TableOfContent.propTypes = {
  data: PropTypes.object,
  fantasystyles: PropTypes.object
}

export default TableOfContent
