import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { tableLoader } from '@shared/libs/allLoader'
import useTranslation from 'next-translate/useTranslation'
import { useSubscription } from '@apollo/client'
import { GET_LIVE_DATA } from '@graphql/match/match.subscription'
import Link from 'next/link'

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

const MatchDetailLive = ({ styles, matchDetail, liveScoreData }) => {
  const { t } = useTranslation()
  const labels1 = [`${t('common:Batter')}`, `${t('common:Runs')}`, `${t('common:Balls')}`, `${t('common:SR')}`, `${t('common:4s')}`, `${t('common:6s')}`]
  const labels2 = [`${t('common:Bowler')}`, `${t('common:Ov')}`, `${t('common:M')}`, `${t('common:R')}`, `${t('common:W')}`, `${t('common:Eco')}`]

  const [liveData, setLiveData] = useState()

  typeof window !== 'undefined' && useSubscription(GET_LIVE_DATA, {
    variables: { input: { iMatchId: matchDetail?._id } },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData?.data?.getMatchBySlug) {
        setLiveData(subscriptionData?.data?.getMatchBySlug?.LiveInnings)
      }
    }
  })

  useEffect(() => {
    setLiveData(liveScoreData[0])
  }, [])

  return (
    <>
      {(liveScoreData && liveScoreData[0]?.aActiveBatters.length !== 0 && liveScoreData[0]?.aActiveBowlers.length !== 0) && <div>
        <Row className="row-8">
          <Col xl={8}>
            <div className={`${styles?.personTbl}`}>
              <ThemeTable labels={labels1} isBordered={true}>
                {liveData?.aActiveBatters?.map((element, index) => {
                  return (
                    <tr key={index} className={`${element.highlight && 'highlight'}`}>
                      <td>{element?.oBatter?.eTagStatus === 'a' ? <Link href={`/${element?.oBatter?.oSeo?.sSlug}`} prefetch={false}><a>{element?.oBatter?.sFullName || element?.oBatter?.sShortName}</a></Link> : element?.oBatter?.sFullName || element?.oBatter?.sShortName}{index === 0 && '*'}</td>
                      <td>{element?.nRuns}</td>
                      <td>{element?.nBallFaced}</td>
                      <td>{element?.sStrikeRate}</td>
                      <td>{element?.nFours}</td>
                      <td>{element?.nSixes}</td>
                    </tr>
                  )
                })}
              </ThemeTable>
              <ThemeTable labels={labels2} isBordered={true}>
                {liveData?.aActiveBowlers?.map((element, index) => {
                  return (
                    <tr key={index} className={`${element.highlight && 'highlight'}`}>
                      <td>{element?.oBowler?.eTagStatus === 'a' ? <Link href={`/${element?.oBowler?.oSeo?.sSlug}`} prefetch={false}><a>{element?.oBowler?.sFullName || element?.oBatter?.sShortName}</a></Link> : element?.oBowler?.sFullName || element?.oBatter?.sShortName}{index === 0 && '*'}</td>
                      <td>{element?.sOvers}</td>
                      <td>{element?.nMaidens}</td>
                      <td>{element?.nRunsConceded}</td>
                      <td>{element?.nWickets}</td>
                      <td>{element?.sEcon}</td>
                    </tr>
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
