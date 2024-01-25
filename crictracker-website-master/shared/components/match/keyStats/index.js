import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'

const KeyStats = ({ tossData, liveScoreData }) => {
  const { t } = useTranslation()
  const runs = liveScoreData?.sLastFiveOvers?.split('/')
  const wicket = runs && runs[1]?.split(' ')
  return (
    <section className={`${styles.keyStats} common-box p-0 mb-3 br-sm`}>
      <div className={`${styles.head}`}>
        <p className="text-uppercase text-primary fw-bold mb-0">{t('common:KeyStats')}</p>
      </div>
      <div className={`${styles.content} mx-2 d-flex flex-wrap justify-content-between`}>
        <p
          className={`${styles.item} ${styles.halfItem} py-2 py-md-3 pe-2 pe-md-0 text-secondary col-6 col-xl-12 d-flex flex-column flex-sm-row justify-content-between mb-2 mb-md-0`}
        >
          <span className="text-dark font-semi flex-shrink-0 d-block d-lg-inline">{t('common:Partnership')} :</span>
          <span className="text-sm-end">{liveScoreData?.oCurrentPartnership?.nRuns !== null ? liveScoreData?.oCurrentPartnership?.nRuns + '(' + liveScoreData?.oCurrentPartnership?.nBalls + ')' : '-' }</span>
        </p>
        <p
          className={`${styles.item} ${styles.halfItem} py-2 py-md-3 ps-2 ps-md-0 text-secondary col-6 col-xl-12 d-flex flex-column flex-sm-row justify-content-between mb-2 mb-md-0`}
        >
          <span className="text-dark font-semi flex-shrink-0 d-block d-lg-inline">{t('common:Last')} 5 {t('common:Overs')} :</span>
          <span className="text-sm-end">{runs ? runs[0] + ` ${t('common:Runs')}, ` : '-'} {wicket && wicket[0] + ` ${t('common:Wickets')}` } </span>
        </p>
        <p className={`${styles.item} py-2 py-md-3 text-secondary col-lg-12 col-12 d-flex flex-column flex-sm-row justify-content-between mb-0`}>
          <span className="text-dark font-semi flex-shrink-0">{t('common:LastWickets')} :</span>
          <span className="text-sm-end">{(liveScoreData?.oLastWicket === null || liveScoreData?.oLastWicket?.oBatter === null) ? '-' : liveScoreData?.oLastWicket?.oBatter?.sFullName + ' ' + liveScoreData?.oLastWicket?.nRuns + '(' + liveScoreData?.oLastWicket?.nBallFaced + ') ' + '- ' + liveScoreData?.oLastWicket?.sHowOut}</span>
        </p>
        <p className={`${styles.item} py-2 py-md-3 text-secondary col-lg-12 col-12 d-flex flex-column flex-sm-row justify-content-between mb-0`}>
          <span className="text-dark font-semi flex-shrink-0">{t('common:Toss')} :</span>
          <span className="text-sm-end">{tossData?.oWinnerTeam === null ? '-' : tossData?.oWinnerTeam?.sTitle + ' (' + tossData?.eDecision + ')'}</span>
        </p>
      </div>
    </section>
  )
}

KeyStats.propTypes = {
  tossData: PropTypes.object,
  liveScoreData: PropTypes.object
}

export default KeyStats
