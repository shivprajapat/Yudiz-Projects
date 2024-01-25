import React, { useEffect, useState } from 'react'
import { useLazyQuery, useSubscription } from '@apollo/client'

import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import Slider from '@shared/components/slider'
import { RECENT_OVER } from '@graphql/match/match.query'
import { GET_RECENT_OVER } from '@graphql/match/match.subscription'

const RecentOver = ({ matchDetail }) => {
  const { t } = useTranslation()
  const { data: overSubscriptionData } = useSubscription(GET_RECENT_OVER, { variables: { input: { iMatchId: matchDetail?._id, nInningNumber: matchDetail?.nLatestInningNumber } } })
  const [getRecentOver, { data: recentOverData }] = useLazyQuery(RECENT_OVER, {
    variables: {
      input: {
        iMatchId: matchDetail?._id,
        nInningNumber: matchDetail?.nLatestInningNumber,
        nLimit: 5,
        nSkip: 0
      }
    }
  })
  const [overData, setOverData] = useState()

  useEffect(() => {
    matchDetail?.nLatestInningNumber && getRecentOver()
  }, [])

  useEffect(() => {
    recentOverData && setOverData(recentOverData?.listMatchOvers?.aResults)
  }, [recentOverData])

  useEffect(() => {
    if (overSubscriptionData) {
      if (overData[0]?.sOver === overSubscriptionData?.listMatchOvers?.sOver) {
        setOverData(overData?.map((item) => {
          if (item.sOver === overSubscriptionData?.listMatchOvers?.sOver) {
            return { ...item, aBall: overSubscriptionData?.listMatchOvers?.aBall }
          }
          return item
        }))
      } else {
        setOverData([overSubscriptionData?.listMatchOvers, ...overData])
      }
    }
  }, [overSubscriptionData])

  return (
    <>
      {overData?.length !== 0 && overData !== undefined && <section className={`${styles.recentOver} d-flex text-center align-items-center position-relative overflow-hidden`}>
        <p className={`${styles.label} mb-0`}>{t('common:Recent')}</p>
        <div className={`${styles.overSlider} over-slider xsmall-text`}>
          <Slider nav gap={0} navTransparent={true}>
            {overData?.map((over, index) => {
              return (
                <React.Fragment key={index}>
                  <div>
                    <div className={`${styles.list} d-flex align-items-center`}>
                      <span className={`${styles.run} ${styles.over} text-muted`}>
                        {over?.sOver}<span className="d-block">{t('common:Ov')}</span>
                      </span>
                      {over?.aBall?.slice(0).reverse().map((ball, index) => {
                        return (
                          <React.Fragment key={index}>
                            {ball?.sScore === '6' && <span className={`${styles.run} bg-primary border-primary text-white`}>{ball?.sScore}</span>}
                            {ball?.sScore === '4' && <span className={`${styles.run} bg-success border-success text-white`}>{ball?.sScore}</span>}
                            {ball?.sScore === 'w' && <span className={`${styles.run} ${styles.highlight} bg-danger border-danger text-white`}>{ball?.sScore?.toUpperCase()}</span>}
                            {(ball?.sScore !== 'w' && ((ball?.nRuns > 0 && ball?.nRuns < 4) || ball?.nRuns === 5 || ball?.nRuns > 6)) && <span className={`${styles.run} ${styles.highlight} bg-info border-info text-black`}>{ball?.sScore}</span>}
                            {(ball?.sScore === '4lb' || ball?.sScore === '4b') && <span className={`${styles.run} ${styles.highlight} bg-info border-info text-black`}>{ball?.sScore}</span>}
                            {ball?.sScore === '0' && <span className={styles.run}>{ball?.sScore}</span>}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
          </Slider>
        </div>
      </section>}
    </>
  )
}

RecentOver.propTypes = {
  matchDetail: PropTypes.object
}

export default RecentOver
