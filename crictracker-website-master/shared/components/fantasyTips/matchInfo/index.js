import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import { countDownCalculations, convertDate, addLeadingZeros, dateCheck } from '@utils'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '@shared/components/customLink'
import broadcast from '@assets/images/icon/fantasy/broadcast-icon.svg'
import streaming from '@assets/images/icon/fantasy/streaming-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const MatchInfo = ({ fantasystyles, matchData, broadcasting, fantasyOverview }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const [timer, setTimer] = useState({
    days: '00',
    hours: '00',
    min: '00',
    sec: '00'
  })

  useEffect(() => {
    setInterval(
      () => {
        const startDate = countDownCalculations(dateCheck(matchData?.dStartDate))
        startDate && setTimer(startDate)
      },
      0,
      1000
    )
  }, [])
  return (
    <>
      <p
        id="matchInfo" className={`${fantasystyles?.itemTitle} ${styles.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}
      >
        <span>{t('common:MatchInformation')}</span>
      </p>
      <section className={`${styles.matchInfo} text-center`}>
        <Row className="g-2">
          <Col md={(broadcasting || fantasyOverview?.sLiveStreaming) ? 9 : 12}>
            <div className={`${styles.item} common-box mb-0 p-3 h-100 d-flex flex-column justify-content-center`}>
              <h3 className="small-head mb-2">
                <CustomLink href={allRoutes.matchDetail(matchData?.oSeo?.sSlug)} prefetch={false}>
                  <a className="text-decoration-underline">
                    {matchData?.sTitle}, {matchData?.sSubtitle}
                  </a>
                </CustomLink>
              </h3>
              <p className="text-muted mb-0">
                {matchData?.oSeries?.sTitle && matchData?.oSeries?.sTitle + ','} {convertDate(dateCheck(matchData?.dStartDate))}
                {matchData?.oVenue?.sName && ',  ' + matchData?.oVenue?.sName}
              </p>
              {!router.asPath.includes('article-preview') && matchData?.sStatusStr === 'scheduled' && !(timer.sec <= 0 && timer.hours <= 0 && timer.min <= 0 && timer.days <= 0) &&
                <div className="mt-2">
                  <div className={`${styles.timer} d-inline-flex flex-column align-items-center align-items-center`}>
                    <p className='text-primary font-semi mb-1'>{t('common:MatchStartsIn')}</p>
                    <h4 className="text-primary d-flex mb-0 fw-bold">
                      <span className={`${styles.time} br-sm px-2`}>{addLeadingZeros(timer?.days)}</span>:<span className={`${styles.time} br-sm px-2`}>{addLeadingZeros(timer?.hours)}</span>:<span className={`${styles.time} br-sm px-2`}>{addLeadingZeros(timer?.min)}</span>:
                      <span className={`${styles.time} br-sm px-2`}>{addLeadingZeros(timer?.sec)}</span>
                    </h4>
                    <p className="d-flex mb-0 justify-content-around w-100">
                      <span>{t('common:Days')}</span>
                      <span>{t('common:Hrs')}</span>
                      <span>{t('common:Mins')}</span>
                      <span>{t('common:Sec')}</span>
                    </p>
                  </div>
                </div>
              }
            </div>
          </Col>
          {(broadcasting || fantasyOverview?.sLiveStreaming) ? (
            <Col md={3}>
              <div className={`${styles.item} common-box h-100 d-flex flex-md-column justify-content-center text-start mb-0 px-0 px-md-2 px-xxl-3 py-2 py-md-1`}>
                {broadcasting && (
                  <div className={`${styles.broadcast} d-flex py-md-2 px-2 px-md-0`}>
                    <div className={`${styles.broadcastIcon} me-2 flex-shrink-0`}>
                      <MyImage src={broadcast} alt="pitch" layout="responsive" width="32" height="32" />
                    </div>
                    <div className="d-flex flex-column">
                      <p className="theme-text fw-bold text-uppercase mb-01">{t('common:BroadCast')}</p>
                      <p className="big-text font-semi">{broadcasting}</p>
                    </div>
                  </div>
                )}
                {fantasyOverview?.sLiveStreaming && (
                  <div className={`${styles.broadcast} d-flex py-md-2 px-2 px-md-0`}>
                    <div className={`${styles.broadcastIcon} me-2 flex-shrink-0`}>
                      <MyImage src={streaming} alt="pitch" layout="responsive" width="32" height="32" />
                    </div>
                    <div className="d-flex flex-column">
                      <p className="theme-text fw-bold text-uppercase mb-01">{t('common:LiveStream')}</p>
                      <p className="big-text font-semi">{fantasyOverview?.sLiveStreaming}</p>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          ) : null}
        </Row>
      </section >
    </>
  )
}

MatchInfo.propTypes = {
  fantasystyles: PropTypes.object,
  matchData: PropTypes.object,
  fantasyOverview: PropTypes.object,
  broadcasting: PropTypes.string
}

export default MatchInfo
