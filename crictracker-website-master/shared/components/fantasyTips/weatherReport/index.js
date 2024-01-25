import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import stadium from '@assets/images/icon/stadium-icon.svg'
import humidity from '@assets/images/icon/humidity-icon.svg'
import useWeatherIcon from '@shared/hooks/useWeatherIcon'
const MyImage = dynamic(() => import('@shared/components/myImage'))

const WeatherReport = ({ fantasystyles, fantasyArticleData }) => {
  const weatherData = fantasyArticleData?.WeatherReport?.data?.getWeatherCondition
  const { t } = useTranslation()
  const { getWeatherImage } = useWeatherIcon()
  return (
    <div className="common-section pt-3 pb-0" id="weatherReport">
      <p
        className={`${fantasystyles?.itemTitle} ${styles.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}
      >
        <span>{t('common:WeatherReport')}</span>
      </p>
      <div className={`${styles.title} d-flex align-items-center text-big font-semi mb-01`}>
        <span className={`${styles.icon} me-2`}>
          <MyImage src={stadium} alt="stadium" layout="responsive" />
        </span>
        <span>{fantasyArticleData?.oMatch?.oVenue?.sName}</span>
      </div>
      <div className={`${styles.weatherReport} d-flex justify-content-between align-items-center py-2 py-md-3 px-3 px-md-4 mb-2`}>
        <div className="d-flex align-items-center">
          {weatherData?.sIcon ? <div className={`${styles.weather} me-2 me-lg-4`}>
            {getWeatherImage(weatherData?.sIcon)}
          </div> : null}
          <div>
            <p className="mb-0 xsmall-text">{weatherData?.sMain}</p>
            <h3 className='small-head'> {weatherData?.nTemp?.toFixed(1)}°C</h3>
          </div>
        </div>
        <div className="d-sm-flex align-items-center">
          {weatherData?.nHumidity ? <p className="d-flex flex-row-reverse flex-sm-row align-items-center mb-0 ms-auto">
            <span className={`${styles.icon} me-sm-2 ms-2 ms-sm-0`}>
              <MyImage src={humidity} alt="humidity" layout="responsive" />
            </span>
            {weatherData?.nHumidity ? <span>{weatherData?.nHumidity}% (Humidity)</span> : null}
          </p> : null}
          {/* <p className="d-flex flex-row-reverse flex-sm-row align-items-center mb-0 ms-2 ms-md-4 mt-1 mt-sm-0">
            <span className={`${styles.icon} me-sm-2 ms-2 ms-sm-0`}>
              <MyImage src={rain} alt="humidity" layout="responsive" />
            </span>
            <span>Rain 7% Chance</span>
          </p> */}
        </div>
      </div>
    </div>
  )
}

WeatherReport.propTypes = {
  fantasystyles: PropTypes.any,
  fantasyArticleData: PropTypes.object
}

export default WeatherReport
