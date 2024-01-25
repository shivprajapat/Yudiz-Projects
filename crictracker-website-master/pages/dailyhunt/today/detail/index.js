import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import styles from '../../../live-scores/[...matchSlug]/style.module.scss'
import todayStyle from './style.module.scss'
import { tableLoader } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import NoIndexNoFollow from '@shared/components/no-index-follow'

const MatchHeader = dynamic(() => import('@shared-components/match/matchHeader'))
const RecentOver = dynamic(() => import('@shared-components/match/recentOver'), { ssr: false, loading: () => <div style={{ height: '40px' }} /> })
const MatchDetailLive = dynamic(() => import('@shared/components/match/matchDetailLive'))
const MatchDetailOverview = dynamic(() => import('@shared-components/match/matchDetailOverview'))
const MatchDetailScorecard = dynamic(() => import('@shared-components/match/matchDetailScorecard'), { loading: () => tableLoader() })

function TodayDetail({ matchDetail, matchOverView, liveScoreData, fullScoreboard, squadData }) {
  const getTab = () => {
    if ((matchDetail?.sStatusStr === 'live' || matchDetail?.sStatusStr === 'completed' || matchDetail?.sStatusStr === 'cancelled')) {
      if (matchDetail?.sStatusStr === 'live' && matchDetail?.sLiveGameStatusStr !== 'innings break') {
        return (
          <div className='info-dh'>
            <br />
            <MatchDetailLive styles={styles} matchDetail={matchDetail} liveScoreData={liveScoreData} />
            <MatchDetailScorecard style={styles} data={fullScoreboard} squad={squadData} matchDetail={matchDetail} matchOverView={matchOverView} />
          </div>
        )
      }
      return (
        <>
          <br />
          <MatchDetailScorecard style={styles} data={fullScoreboard} squad={squadData} matchDetail={matchDetail} matchOverView={matchOverView} />
        </>
      )
    } else if (matchOverView?.oTeam1 || matchOverView?.oTeam2) {
      return (
        <div className='info-dh'>
          <br />
          <MatchDetailOverview data={matchOverView} matchDetail={matchDetail} />
        </div>
      )
    }
  }

  return (
    <>
      <Head>
        <style>{`
          body { background-color: transparent !important; }
          .match-header-dh {border: 1px solid #e4e6eb; border-radius: 3px;}
          .rc-over-dh {border: 1px solid #e4e6eb; border-radius: 3px;}
          .info-dh .font-semi.mb-4.overflow-hidden {border: 1px solid #e4e6eb; border-radius: 3px;}
          .info-dh .common-box {border: 1px solid #e4e6eb; border-radius: 3px;}
          .info-dh table {border: 1px solid #e4e6eb; border-radius: 3px;}
          // .dh-list .slider-box-dh > div {width: 100%}
        `}</style>
        <NoIndexNoFollow />
      </Head>
      <div className={`container py-3 ${todayStyle.main}`}>
        <div className='match-header-dh'>
          <MatchHeader data={matchDetail} liveScoreData={[]} currentTab={''} showShareBtn={false} isDailyHuntMode />
        </div>
        {matchDetail?.sStatusStr !== 'scheduled' && (
          <div className='rc-over-dh'>
            <RecentOver matchDetail={matchDetail} />
          </div>
        )}
        {getTab()}
      </div>
    </>
  )
}

TodayDetail.propTypes = {
  matchDetail: PropTypes.object,
  liveScoreData: PropTypes.array,
  matchOverView: PropTypes.object,
  fullScoreboard: PropTypes.object,
  squadData: PropTypes.object
}

export default Error(TodayDetail)

export async function getServerSideProps({ res, resolvedUrl, query }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=7')

    const { eType, iSeriesId } = query

    if (!iSeriesId || !['first', 'second']?.includes(eType)) return { notFound: true }

    const queryGraphql = (await import('@shared-components/queryGraphql')).default

    const { DAILY_HUNT_WIDGET_MATCH_ID } = (await import('@graphql/daily-hunt/dailu-hunt.query'))
    const { data } = await queryGraphql(DAILY_HUNT_WIDGET_MATCH_ID, { input: { iSeriesId, eType } })

    if (!data?.dailyHuntWidget?.iMatchId) return { notFound: true }

    const { MATCH_DETAIL, LIVE_INNING_DATA, GET_MATCH_OVERVIEW, FULL_SCOREBOARD, GET_MATCH_SQUAD } = (await import('@graphql/match/match.query'))

    const { data: match } = await queryGraphql(MATCH_DETAIL, { input: { _id: data?.dailyHuntWidget?.iMatchId } })
    // const { data: match } = await queryGraphql(MATCH_DETAIL, { input: { _id: '63ef121f5a7ac0b1e893cc97' } }) // live
    // const { data: match } = await queryGraphql(MATCH_DETAIL, { input: { _id: '6391a3dd2146243958bb9fd9' } }) // result
    if ((match?.getMatchById?.sStatusStr === 'completed' || match?.getMatchById?.sStatusStr === 'live' || match?.getMatchById?.sStatusStr === 'cancelled')) {
      const { data: liveScoreData } = await queryGraphql(LIVE_INNING_DATA, { input: { iMatchId: match?.getMatchById?._id, nInningNumber: match?.getMatchById?.nLatestInningNumber } })
      const { data } = await queryGraphql(FULL_SCOREBOARD, { input: { iMatchId: match?.getMatchById?._id } })
      const { data: squadData } = await queryGraphql(GET_MATCH_SQUAD, { input: { iMatchId: match?.getMatchById?._id } })

      return {
        props: {
          matchDetail: match?.getMatchById,
          liveScoreData: liveScoreData?.fetchLiveInningsData,
          fullScoreboard: data,
          squadData: squadData
        }
      }
    } else {
      const { data } = await queryGraphql(GET_MATCH_OVERVIEW, { input: { iMatchId: match?.getMatchById?._id } })

      return {
        props: {
          matchDetail: match?.getMatchById,
          matchOverView: data?.getMatchOverviewFront
        }
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const handleApiError = (await import('@shared/utils')).handleApiError
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
