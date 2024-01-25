import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { tableLoader } from '@shared/libs/allLoader'
import useTranslation from 'next-translate/useTranslation'
import { useSubscription } from '@apollo/client'
import { GET_LIVE_DATA } from '@graphql/match/match.subscription'
import ActiveBatterRow from './ActiveBatterRow'
import ActiveBowlerRow from './ActiveBowlerRow'
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'
import { getMatchPlayers } from '@shared/libs/match-detail'

const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })
const KeyStats = dynamic(() => import('@shared-components/match/keyStats'), {
  loading: () => (
    <div className="bg-white rounded p-3">
      <Skeleton width={'50%'} />
      <hr />
      <div className="d-flex justify-content-between">
        <Skeleton width={'40%'} />
        <Skeleton width={'15%'} />
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <Skeleton width={'40%'} />
        <Skeleton width={'15%'} />
      </div>
    </div>
  )
})
const FallWickets = dynamic(() => import('@shared-components/match/fallWickets'))

const MatchDetailLive = ({ styles, matchDetail, liveScoreData = [] }) => {
  const players = getMatchPlayers()
  const { t } = useTranslation()
  const labels1 = [`${t('common:Batter')}`, `${t('common:Runs')}`, `${t('common:Balls')}`, `${t('common:SR')}`, `${t('common:4s')}`, `${t('common:6s')}`]
  const labels2 = [`${t('common:Bowler')}`, `${t('common:Ov')}`, `${t('common:M')}`, `${t('common:R')}`, `${t('common:W')}`, `${t('common:Eco')}`]
  const { stateGlobalEvents, dispatchGlobalEvents } = useContext(GlobalEventsContext)

  const [liveData, setLiveData] = useState(liveScoreData[0])

  typeof window !== 'undefined' && useSubscription(GET_LIVE_DATA, {
    variables: { input: { iMatchId: matchDetail?._id } },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData?.data?.getMatchBySlug) {
        const ld = subscriptionData?.data?.getMatchBySlug?.LiveInnings
        dispatchGlobalEvents({
          type: 'MATCH_LIVE_INNING_DATA',
          payload: { ...stateGlobalEvents, liveInning: ld }
        })
        setLiveData(ld)
      }
    }
  })

  useEffect(() => {
    setLiveData(liveScoreData[0])
  }, [])

  return (
    <>
      {(liveScoreData && liveScoreData[0]?.aActiveBatters.length > 0 && liveScoreData[0]?.aActiveBowlers.length > 0) && <div>
        <Row className="gx-2 gx-md-3">
          <Col xl={8}>
            <div className={`${styles?.personTbl}`}>
              <ThemeTable labels={labels1} isBordered={true}>
                {liveData?.aActiveBatters?.map((element, index) => {
                  return (
                    <ActiveBatterRow element={{
                      ...element,
                      oBatter: players[element?.iBatterId] || element?.oBatter
                    }} index={index} key={index} />
                  )
                })}
              </ThemeTable>
              <ThemeTable labels={labels2} isBordered={true}>
                {liveData?.aActiveBowlers?.map((element, index) => {
                  return (
                    <ActiveBowlerRow element={{
                      ...element,
                      oBowler: players[element?.iBowlerId] || element?.oBowler
                    }} index={index} key={index} />
                  )
                })}
              </ThemeTable>
            </div>
          </Col>
          <Col xl={4}>
            <KeyStats tossData={matchDetail?.oToss} liveScoreData={liveData} />
          </Col>
        </Row>
        {liveScoreData[0]?.aFOWs.length !== 0 && <FallWickets data={liveData} />}
      </div>}
    </>
  )
}

MatchDetailLive.propTypes = {
  styles: PropTypes.any,
  matchDetail: PropTypes.object,
  liveScoreData: PropTypes.array
}
export default MatchDetailLive
