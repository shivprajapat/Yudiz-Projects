import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import pitch from '@assets/images/icon/pitch-icon.svg'
import weather from '@assets/images/icon/weather-icon.svg'
import wincup from '@assets/images/icon/wincup-icon.svg'
import flag from '@assets/images/icon/flag-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const InfoList = ({ fantasystyles, overViewData }) => {
  const { t } = useTranslation()
  return (
    <section className="common-section pb-0">
      <Row className={`${styles.list}`}>
        {overViewData?.sWeatherReport && (
          <Col sm={6}>
            <section className={`${styles.item} d-flex d-sm-block align-items-center justify-content-between mb-1 mb-md-4`}>
              <p
                className={`${fantasystyles?.itemTitle} ${styles.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}
              >
                <span className={`${styles.icon} me-2`}>
                  <MyImage src={weather} alt="weather" layout="responsive" />
                </span>
                <span>{t('common:WeatherReport')}</span>
              </p>
              <div className="big-text font-semi">{overViewData?.sWeatherReport}</div>
            </section>
          </Col>
        )}
        {overViewData?.sPitchCondition && (
          <Col sm={6}>
            <section id="pitch" className={`${styles.item} d-flex d-sm-block align-items-center justify-content-between mb-1 mb-md-4`}>
              <p
                className={`${fantasystyles?.itemTitle} ${styles.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}
              >
                <span className={`${styles.icon} me-2`}>
                  <MyImage src={pitch} alt="pitch" layout="responsive" />
                </span>
                <span>{t('common:PitchCondition')}</span>
              </p>
              <div className="big-text font-semi">{overViewData?.sPitchCondition}</div>
            </section>
          </Col>
        )}
        {overViewData?.sAvgScore && (
          <Col sm={6}>
            <section className={`${styles.item} d-flex d-sm-block align-items-center justify-content-between mb-1 mb-md-4`}>
              <p
                className={`${fantasystyles?.itemTitle} ${styles.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}
                >
                <span className={`${styles.icon} me-2`}>
                  <MyImage src={flag} alt="Score" layout="responsive" />
                </span>
                <span>{t('common:Avg1stInningScore')}</span>
              </p>
              <div className="big-text font-semi">{overViewData?.sAvgScore}</div>
            </section>
          </Col>
        )}
        {overViewData?.oWinnerTeam?.sTitle && (
          <Col sm={6}>
            <section className={`${styles.item} d-flex d-sm-block align-items-center justify-content-between mb-1 mb-md-4`}>
              <p
                className={`${fantasystyles?.itemTitle} ${styles.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}
              >
                <span className={`${styles.icon} me-2`}>
                  <MyImage src={wincup} alt="Prediction" layout="responsive" />
                </span>
                <span>{t('common:WinPrediction')}</span>
              </p>
              <div className="big-text font-semi">{overViewData?.oWinnerTeam?.sTitle}</div>
            </section>
          </Col>
        )}
      </Row>
    </section>
  )
}

InfoList.propTypes = {
  fantasystyles: PropTypes.any,
  overViewData: PropTypes.object
}

export default InfoList
