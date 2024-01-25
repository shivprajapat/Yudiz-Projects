import PropTypes from 'prop-types'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useQuery, useSubscription } from '@apollo/client'
import { useState } from 'react'

import Error from '@shared/components/error'
import style from '@shared/components/scorecardSlider/style.module.scss'
import Logo from '@assets/images/logo-color.svg'
import NoIndexNoFollow from '@shared/components/no-index-follow'
import { TODAY_MATCH_DAILY_HUNT_SUBSCRIPTION } from '@graphql/daily-hunt/daily-hunt.subscription'
import { MATCH_DETAIL_FOR_DH } from '@graphql/daily-hunt/dailu-hunt.query'

const ScoreCard = dynamic(() => import('@shared/components/scorecardSlider/scorecard'))
const MyImage = dynamic(() => import('@shared/components/myImage'))

function DailyHuntTodaySlider({ match, iSeriesId }) {
  const [matchData, setMatchData] = useState(match)

  useQuery(MATCH_DETAIL_FOR_DH, {
    variables: { input: { _id: match?.iMatchId } },
    onCompleted: (data) => {
      if (data && data.getMatchById) {
        handleSubscriptionData({ oMatchDetailsFront: data.getMatchById, LiveInnings: {} })
      }
    }
  })

  typeof window !== 'undefined' && useSubscription(TODAY_MATCH_DAILY_HUNT_SUBSCRIPTION, {
    // variables: { input: { iMatchId: match?.iMatchId } },
    variables: { input: { iMatchId: '63ef121f5a7ac0b1e893cc97' } },
    onSubscriptionData: ({ subscriptionData }) => {
      handleSubscriptionData(subscriptionData?.data?.getMatchBySlug)
    }
  })

  function handleSubscriptionData(sData = {}) {
    const { LiveInnings, oMatchDetailsFront } = sData
    const mapData = {
      ...matchData,
      ...LiveInnings,
      ...oMatchDetailsFront,
      oTeamScoreA: {
        ...oMatchDetailsFront?.oTeamScoreA,
        iTeamId: oMatchDetailsFront?.oTeamScoreA?.oTeam?._id
      },
      oTeamScoreB: {
        ...oMatchDetailsFront?.oTeamScoreB,
        iTeamId: oMatchDetailsFront?.oTeamScoreB?.oTeam?._id
      },
      iWinnerId: oMatchDetailsFront?.oWinner?._id
    }
    setMatchData(mapData)
  }

  return (
    <>
      <Head>
        <style>{`
          body { background-color: transparent !important; }
          .dh-list .slider-box-dh {border: 1px solid #e4e6eb}
          .dh-list .slider-box-dh > div {width: 100%}
        `}</style>
        <NoIndexNoFollow />
      </Head>
      <div className='container'>
        <div className='pt-3 d-flex align-items-center justify-content-center'>
          {/* <h4 className='mb-0'>{"Today's Match"}</h4> */}
          <p className='m-0 d-flex align-items-center'>Powered by
            <span style={{ width: '100px' }} className="ms-1">
              <MyImage src={Logo} layout="responsive" />
            </span>
          </p>
        </div>
        <div className={`${style?.scorecardSlider} dh-list border-0`}>
          <ScoreCard
            card={matchData}
            // key={card?._id}
            seriesId={iSeriesId}
            className="pe-none slider-box-dh"
            isDailyHuntMode
          />
        </div>
      </div>
    </>
  )
}
DailyHuntTodaySlider.propTypes = {
  match: PropTypes.object,
  iSeriesId: PropTypes.string
}

export default Error(DailyHuntTodaySlider)

export async function getServerSideProps({ res, query, resolvedUrl }) {
  res.setHeader('Cache-Control', 'public, max-age=120')
  try {
    const { iSeriesId, eType } = query

    if (!iSeriesId || !['first', 'second']?.includes(eType)) return { notFound: true }

    const queryGraphql = (await import('@shared-components/queryGraphql')).default
    const { DAILY_HUNT_WIDGET } = (await import('@graphql/daily-hunt/dailu-hunt.query'))

    const { data } = await queryGraphql(DAILY_HUNT_WIDGET, { input: { iSeriesId, eType } })

    if (!data?.dailyHuntWidget?.iMatchId) return { notFound: true }
    return {
      props: { match: data?.dailyHuntWidget, iSeriesId }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const handleApiError = (await import('@shared/utils')).handleApiError
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
