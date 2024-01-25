import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import stadium from '@assets/images/icon/stadium-icon.svg'
// import rain from '@assets/images/icon/rain-icon.svg'
import humidity from '@assets/images/icon/humidity-icon.svg'
import useWeatherIcon from '@shared/hooks/useWeatherIcon'

const WeatherReport = ({ fantasyArticleData }) => {
  const weatherData = fantasyArticleData?.WeatherReport?.data?.getWeatherCondition
  const { t } = useTranslation()
  const { getWeatherImage } = useWeatherIcon()
  return (
    <>
      <style jsx amp-custom>{`
      .weatherReport{background:var(--theme-light);margin-bottom:8px;border-radius:0px 0px 8px 8px}.title{margin-bottom:2px;padding:8px 12px;background:var(--theme-light);border-radius:8px 8px 0 0}.icon{width:24px}[data-mode=dark] .icon{-webkit-filter:brightness(0) invert(1) opacity(0.4);filter:brightness(0) invert(1) opacity(0.4)}.itemTitle{margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--light)}.weather{width:42px;filter:drop-shadow(-8px 5px 12px rgba(2, 0, 26, 0.12))}.weather h3{margin-bottom:-2px}/*# sourceMappingURL=style.css.map */

      `}</style>
      <style jsx amp-custom global>{`
       .weather svg { width: 42px; height: 30px; }
       `}</style>
      <div>
        <p
          className="itemTitle theme-text font-bold t-uppercase d-flex align-items-center"
        >
          <span>{t('common:WeatherReport')}</span>
        </p>
        <div className="title d-flex align-items-center text-big font-semi">
          <span className="icon me-2">
            <amp-img src={stadium.src} alt="stadium" width="24" height="24" layout="responsive"></amp-img>
          </span>
          <span>{fantasyArticleData?.oMatch?.oVenue?.sName}</span>
        </div>
        <div className="weatherReport common-box d-flex justify-content-between align-items-center py-2 py-md-3 px-3 px-md-4 mb-2">
          <div className="d-flex align-items-center">
            {weatherData?.sIcon ? <div className="weather me-2 me-lg-4">
              {getWeatherImage(weatherData?.sIcon)}
            </div> : null}
            <div>
              <p className="mb-0 xsmall-text">{weatherData?.sMain}</p>
              <h3 className='small-head mb-0'>{weatherData?.nTemp?.toFixed(1)}°C</h3>
            </div>
          </div>
          <div className="d-sm-flex align-items-center">
            <p className="d-flex justify-content-end align-items-center mb-0 ms-auto">
              {weatherData?.nHumidity ? <span className="icon me-sm-2 ms-2 ms-sm-0">
                <amp-img src={humidity.src} alt="humidity" width="24" height="24" layout="responsive"></amp-img>
              </span> : null}
              {weatherData?.nHumidity ? <span>{weatherData?.nHumidity}% (Humidity)</span> : null}
            </p>
            {/* <p className="d-flex justify-content-end align-items-center mb-0 ms-2 ms-md-4 mt-1 mt-sm-0">
              <span>Rain 7% Chance</span>
              <span className="icon me-sm-2 ms-2 ms-sm-0">
                <amp-img src={rain.src} alt="humidity" width="24" height="24" layout="responsive"></amp-img>
              </span>
            </p> */}
          </div>
        </div>
      </div >
    </>
  )
}

WeatherReport.propTypes = {
  fantasyArticleData: PropTypes.object
}

export default WeatherReport
