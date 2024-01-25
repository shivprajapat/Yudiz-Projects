import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))

const InfoList = ({ overViewData }) => {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>{`
      .list{margin:0px -12px;display:flex;display:-webkit-flex;-webkit-flex-wrap:wrap;flex-wrap:wrap}.item{margin:0 12px 24px;width:calc(50% - 24px)}.icon{display:block;width:24px;margin-right:4px}@media(max-width: 575px){.item{width:100%;margin-bottom:16px}}/*# sourceMappingURL=style.css.map */
      `}</style>
      <section className="common-section pb-0">
        <div className="list">
          {overViewData?.sWeatherReport && (
            <section className="item">
              <TitleBlock title={
                <>
                  {/* <span className="icon me-2">
                    <amp-img src="/static/weather-icon.svg" alt="weather" width="24" height="24" layout="responsive"></amp-img>
                  </span> */}
                  <span>{t('common:WeatherReport')}</span>
                </>
              }
              />
              <div className="big-text font-semi">{overViewData?.sWeatherReport}</div>
            </section>
          )}
          {overViewData?.sPitchCondition && (
            <section id="pitch" className="item">
              <TitleBlock title={
                <>
                  {/* <span className="icon me-2">
                    <amp-img src="/static/pitch-icon.svg" alt="pitch" width="24" height="24" layout="responsive"></amp-img>
                  </span> */}
                  <span>{t('common:PitchCondition')}</span>
                </>
              }
              />
              <div className="big-text font-semi">{overViewData?.sPitchCondition}</div>
            </section>
          )}
          {overViewData?.sAvgScore && (
            <section className="item">
              <TitleBlock title={
                <>
                  {/* <span className="icon me-2">
                    <amp-img src="/static/flag-icon.svg" alt="Score" width="24" height="24" layout="responsive"></amp-img>
                  </span> */}
                  <span>{t('common:Avg1stInningScore')}</span>
                </>
              }
              />
              <div className="big-text font-semi">{overViewData?.sAvgScore}</div>
            </section>
          )}
          {overViewData?.oWinnerTeam?.sTitle && (
            <section className="item">
              <TitleBlock title={
                <>
                  {/* <span className="icon me-2">
                    <amp-img src="/static/wincup-icon.svg" alt="Prediction" width="24" height="24" layout="responsive"></amp-img>
                  </span> */}
                  <span>{t('common:WinPrediction')}</span>
                </>
              }
              />
              <div className="big-text font-semi">{overViewData?.oWinnerTeam?.sTitle}</div>
            </section>
          )}
        </div>
      </section>
    </>
  )
}

InfoList.propTypes = {
  fantasystyles: PropTypes.any,
  overViewData: PropTypes.object
}

export default InfoList
