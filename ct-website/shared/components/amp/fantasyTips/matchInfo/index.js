import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Row, Col } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { countDownCalculations, convertDate, addLeadingZeros, dateCheck } from '@utils'
import { allRoutes } from '@shared/constants/allRoutes'

const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))

const MatchInfo = ({ matchData }) => {
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
      <style jsx amp-custom>{`
      `}</style>
      <section className="common-section pb-0">
        <TitleBlock title={<Trans i18nKey="common:MatchInformation" />} />
        <Row className="align-items-center">
          <Col xl={6} md={7}>
            <h3 className="small-head mb-2">
              <Link href={allRoutes.matchDetail(matchData?.oSeo?.sSlug)} prefetch={false}>
                <a>
                  {matchData?.sTitle}, {matchData?.sSubtitle}
                </a>
              </Link>
            </h3>
            <p className="text-muted">
              {matchData?.oSeries?.sTitle && matchData?.oSeries?.sTitle + ','} {convertDate(dateCheck(matchData?.dStartDate))}{' '}
              {matchData?.oVenue?.sLocation && ',' + matchData?.oVenue?.sLocation}{' '}
            </p>
          </Col>
          {matchData?.sStatusStr === 'scheduled' && !(timer.sec <= 0 && timer.hours <= 0 && timer.min <= 0 && timer.days <= 0) && <Col xl={6} md={5} className="d-flex">
            <h4 className={`${styles.time} ms-md-auto mt-2 mt-md-0 d-flex flex-md-column text-md-center font-semi text-mute`}>
              <Trans i18nKey="common:StartsIn" />: &nbsp;
              <span className="text-primary"> {addLeadingZeros(timer?.days)}<Trans i18nKey="common:D" /> {addLeadingZeros(timer?.hours)}<Trans i18nKey="common:H" /> {addLeadingZeros(timer?.min)}<Trans i18nKey="common:Min" /> {addLeadingZeros(timer?.sec)}<Trans i18nKey="common:S" /></span>
            </h4>
          </Col>}
        </Row>
      </section>
    </>
  )
}

MatchInfo.propTypes = {
  fantasystyles: PropTypes.any,
  matchData: PropTypes.object
}

export default MatchInfo
