import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'

import { convertDate, dateCheck } from '@utils'
import { allRoutes } from '@shared/constants/allRoutes'
import broadcast from '@assets/images/icon/fantasy/broadcast-icon.svg'
import streaming from '@assets/images/icon/fantasy/streaming-icon.svg'

const MatchInfo = ({ matchData, broadcasting, fantasyOverview }) => {
  const { t } = useTranslation()
  const newDate = matchData?.dStartDate ? new Date(matchData?.dStartDate).toISOString() : ''
  const isTimeOver = (matchData?.dStartDate - new Date().getTime()) < 0
  return (
    <>
      <style jsx amp-custom>{`
     a{color:var(--theme-color-medium)}.item{background:var(--theme-light2);margin-bottom:8px}.item:last-child{margin-bottom:0}.item a{color:var(--theme-color-medium)}.item p:last-child{margin-bottom:0}.itemInfo .text-muted{margin-bottom:8px}.timer h4 span{margin:0px 2px 2px;padding:1px 9px;background:var(--theme-light);border-radius:8px}.timer p{justify-content:space-around}.broadcastItem{padding:8px 0px}.broadcast{text-align:left}.broadcast+.broadcast{border-left:1px solid var(--light)}.broadcastIcon{width:24px}@media(min-width: 768px){.time{padding:8px 18px;border:1px solid var(--light);border-radius:12px}}/*# sourceMappingURL=style.css.map */

      `}</style>
      <Head>
        {matchData?.dStartDate && !isTimeOver ? <script async custom-element="amp-date-countdown" src="https://cdn.ampproject.org/v0/amp-date-countdown-0.1.js"></script> : null}

        <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
      </Head>
      <div className="common-section match-information t-center">
        <div className="item itemInfo common-box mb-0 p-3 h-100 d-flex flex-column justify-content-center">
          <h3 className="small-head mb-2">
            <a href={allRoutes.matchDetail(matchData?.oSeo?.sSlug)} className="text-decoration-underline">
              {matchData?.sTitle}, {matchData?.sSubtitle}
            </a>
          </h3>
          <p className="text-muted">
            {matchData?.oSeries?.sTitle && matchData?.oSeries?.sTitle + ','} {convertDate(dateCheck(matchData?.dStartDate))}{' '}
            {matchData?.oVenue?.sName && ',' + matchData?.oVenue?.sName}{' '}
          </p>
          {
            matchData?.dStartDate && !isTimeOver &&
            <amp-date-countdown end-date={newDate} layout="fixed-height" height="70" >
              <template type="amp-mustache">
                <div className='timer d-inline-flex t-center flex-grow-1'>
                  <div className='countdown m-auto'>
                    <p className="theme-text font-semi mb-1">{t('common:MatchStartsIn')}</p>
                    <h4 className="theme-text d-flex mb-0">
                      <span>{'{{ dd }}'}</span>:
                      <span>{'{{ hh }}'}</span>:
                      <span>{'{{ mm }}'}</span>:
                      <span>{'{{ ss }}'}</span>
                    </h4>
                    <p className="d-flex mb-0 justify-content-around w-100">
                      <span>{t('common:Days')}</span>
                      <span>{t('common:Hrs')}</span>
                      <span>{t('common:Mins')}</span>
                      <span>{t('common:Sec')}</span>
                    </p>
                  </div>
                </div>
              </template>
            </amp-date-countdown>
          }
        </div>
        {(broadcasting || fantasyOverview?.sLiveStreaming) ? (
          <div className="item broadcastItem common-box h-100 d-flex align-items-center justify-content-center mb-0 p-1">
            {broadcasting && (
              <div className="broadcast d-flex py-md-2 px-2">
                <div className="broadcastIcon me-2 flex-shrink-0">
                  <amp-img src={broadcast.src} alt="pitch" layout="responsive" width="32" height="32"></amp-img>
                </div>
                <div>
                  <p className="theme-text font-bold mb-1 t-uppercase">{t('common:BroadCast')}</p>
                  <p className="big-text font-semi">{broadcasting}</p>
                </div>
              </div>
            )}
            {fantasyOverview?.sLiveStreaming && (
              <div className="broadcast d-flex py-md-2 px-2">
                <div className="broadcastIcon me-2 flex-shrink-0">
                  <amp-img src={streaming.src} alt="pitch" layout="responsive" width="32" height="32"></amp-img>
                </div>
                <div>
                  <p className="theme-text font-bold mb-1 t-uppercase">{t('common:LiveStream')}</p>
                  <p className="big-text font-semi">{fantasyOverview?.sLiveStreaming}</p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  )
}

MatchInfo.propTypes = {
  fantasystyles: PropTypes.any,
  matchData: PropTypes.object,
  fantasyOverview: PropTypes.object,
  broadcasting: PropTypes.string
}

export default MatchInfo
