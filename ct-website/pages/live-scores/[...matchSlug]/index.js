import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import { FULL_SCOREBOARD, MATCH_DETAIL, FANTASY_TIPS_DETAILS, GET_FANTASY_PLATFORM, GET_COMMENTARY, GET_MATCH_OVERVIEW, GET_MATCH_SQUAD, RECENT_OVER, LIVE_INNING_DATA } from '@graphql/match/match.query'
import { FIXTURES_LIST } from '@graphql/series/fixtures.query'
import { GET_SERIES_NEWS_VIDEOS } from '@graphql/series/home.query'
import queryGraphql from '@shared-components/queryGraphql'
import Layout from '@shared-components/layout'
import { matchDetailNav } from '@shared/constants/allNavBars'
import { matchDetailTabSlug } from '@shared/constants/allRoutes'
import { navLoader, pageHeaderLoader, tableLoader } from '@shared/libs/allLoader'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { WIDGET } from '@shared/constants'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'
import useWindowSize from '@shared/hooks/windowSize'

const Skeleton = dynamic(() => import('@shared/components/skeleton'), { ssr: false })
const MatchHeader = dynamic(() => import('@shared-components/match/matchHeader'), { loading: () => pageHeaderLoader() })
const RecentOver = dynamic(() => import('@shared-components/match/recentOver'), { ssr: false })
const CommonNav = dynamic(() => import('@shared-components/commonNav'), { loading: () => navLoader() })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const MatchDetailOverview = dynamic(() => import('@shared-components/match/matchDetailOverview'), {
  loading: () => (
    <div className="bg-white rounded p-3">
      {Array.from(Array(5)).map((e, i) => {
        return (
          <React.Fragment key={i}>
            <div className="d-flex">
              <Skeleton width={'10%'} className={'me-3'} />
              <Skeleton width={'25%'} />
            </div>
            <hr />
          </React.Fragment>
        )
      })}
    </div>
  )
})
const MatchDetailScorecard = dynamic(() => import('@shared-components/match/matchDetailScorecard'), { loading: () => tableLoader() })
const MatchDetailFantasyTips = dynamic(() => import('@shared/components/match/matchDetailFantasyTips'), { loading: () => tableLoader() })
const MatchDetailFantasyPlatForm = dynamic(() => import('@shared/components/match/matchDetailFantasyPlatForm'), {
  loading: () => tableLoader()
})
const MatchDetailCommentary = dynamic(() => import('@shared/components/match/matchDetailCommentary'), { loading: () => tableLoader() })
const MatchDetailUpcoming = dynamic(() => import('@shared/components/match/matchDetailUpcoming'), { loading: () => tableLoader() })
const MatchDetailNews = dynamic(() => import('@shared/components/match/matchDetailNews'), { loading: () => tableLoader() })
const MatchDetailOvers = dynamic(() => import('@shared/components/match/matchDetailOvers'), { loading: () => tableLoader() })
// const MatchDetailStandings = dynamic(() => import('@shared/components/match/matchDetailStandings'))
const NoData = dynamic(() => import('@noData'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const MatchDetail = ({ matchDetail, error, type, scorecard, fantasyData, status, fantasyPlatFormData, matchId, overViewData, commentaryData, matchOverView, squadData, upcomingData, newsData, recentOverData, liveScoreData, seoData, standingData, roundData, resultData, seriesTotalTeams }) => {
  const { t } = useTranslation()
  const [width] = useWindowSize()
  const router = useRouter()
  const commentaryOpen = useRef(false)
  const handleCommentary = () => {
    commentaryOpen.current = true
  }

  const tab = () => {
    if (type === 'full-scorecard') return (scorecard?.fetchLiveInningsData?.length === 0 || scorecard?.fetchLiveInningsData[0]?.aBatters?.length === 0) ? <NoData /> : <MatchDetailScorecard style={styles} data={scorecard} squad={squadData} matchDetail={matchDetail} matchOverView={matchOverView} />
    else if (type === 'fantasy-tips' && (status === 'scheduled')) return <MatchDetailFantasyTips style={styles} data={fantasyData?.getOverviewFront} />
    else if (type === 'fantasy-tips' && (status !== 'scheduled')) return <MatchDetailFantasyPlatForm data={fantasyPlatFormData?.getFantasyTipsFront} matchId={matchId} overview={overViewData} />
    // else if (type === 'live-commentary') return (((matchDetail?.bIsCommentary && commentaryData.length !== 0) || liveScoreData?.length !== 0) || commentaryOpen.current === true) ? <MatchDetailCommentary data={commentaryData} matchDetail={matchDetail} liveScoreData={liveScoreData} handleCommentary={handleCommentary} /> : <NoData />
    else if (type === 'fixtures-and-results') return upcomingData.length !== 0 ? <MatchDetailUpcoming data={upcomingData} /> : <NoData />
    else if (type === 'results') return resultData.length !== 0 ? <MatchDetailUpcoming data={resultData} /> : <NoData />
    else if (type === 'overs') return recentOverData?.aResults?.length !== 0 ? <MatchDetailOvers data={recentOverData} matchDetail={matchDetail} /> : <NoData />
    else if (type === 'news') return newsData.nTotal === 0 ? <NoData title={<Trans i18nKey="common:NoNewsFound" />} /> : <MatchDetailNews data={newsData} seriesId={matchDetail?.oSeries?._id} />
    // else if (type === 'standings') return standingData.length > 0 ? <MatchDetailStandings data={standingData} roundData={roundData}/> : <NoData/>
    else {
      if ((matchDetail?.sStatusStr === 'live' || matchDetail?.sStatusStr === 'completed' || matchDetail?.sStatusStr === 'cancelled') && ((matchDetail?.bIsCommentary && commentaryData?.length !== 0) || commentaryOpen.current)) {
        return <MatchDetailCommentary data={commentaryData} matchDetail={matchDetail} liveScoreData={liveScoreData} handleCommentary={handleCommentary} />
      } else if (matchDetail?.sTitle !== null && (matchOverView?.oTeam1 || matchOverView?.oTeam2)) {
        return <MatchDetailOverview data={matchOverView} matchDetail={matchDetail} />
      } else {
        return <NoData />
      }
    }
  }

  function changeSeoData(data) {
    return {
      ...data,
      sTitle: makeTitle(matchDetail),
      sDescription: makeDescription(matchDetail),
      sRobots: getRobots(matchDetail, data)
    }
  }

  function getRobots(match, seo) {
    if (type === 'news' || type === 'fantasy-tips') return 'Noindex, Follow'
    else return seo?.sRobots
  }

  function makeTitle(match) {
    const matchShortName = `${match?.oTeamScoreA?.oTeam?.sAbbr} ${t('common:VS')} ${match?.oTeamScoreB?.oTeam?.sAbbr}`
    const matchFullName = `${match?.oTeamScoreA?.oTeam?.sTitle} vs ${match?.oTeamScoreB?.oTeam?.sTitle}`

    if (type === 'full-scorecard') {
      return `${matchFullName} ${match?.sSubtitle} ${match?.oSeries?.sSeason} Full Scorecard & Updates`
    } else if (type === 'news') {
      return `${matchShortName} ${match?.oSeries?.sSeason} ${t('common:LatestNews')} | ${t('common:LiveScoreNNews')}`
    } else if (type === 'overs') {
      return `${matchShortName} ${t('common:Overs')} | ${matchFullName} ${t('common:LiveScoreOverTitle')}`
    } else if (type === 'fixtures-and-results') {
      return `${matchShortName} ${match?.oSeries?.sSeason} ${t('common:Schedule')} | ${t('common:LiveScoreNUpcoming')}`
    } else if (type === 'results') {
      return `${matchShortName} ${match?.oSeries?.sSeason} ${t('common:ResultsAfter')} ${match?.nLatestInningNumber} | ${t('common:Yesterday')} ${matchShortName} ${t('common:MatchResults')}`
    } else {
      const { team1Abbr, team2Abbr, matchNo, team1Name, team2Name } = {
        team1Abbr: match?.oTeamScoreA?.oTeam?.sAbbr,
        team2Abbr: match?.oTeamScoreB?.oTeam?.sAbbr,
        matchNo: match?.sSubtitle,
        team1Name: match?.oTeamScoreA?.oTeam?.sTitle,
        team2Name: match?.oTeamScoreB?.oTeam?.sTitle
      }
      if (match?.sStatusStr === 'live' || match?.sStatusStr === 'completed' || match?.sStatusStr === 'cancelled') {
        return `${team1Abbr} vs ${team2Abbr} Live Score${matchNo ? `, ${matchNo}` : ''} | ${team1Name} vs ${team2Name} ${matchNo} Live Score & Ball by Ball Commentary Updates`
      } else {
        return `${team1Abbr} vs ${team2Abbr} Live Score${matchNo ? `, ${matchNo}` : ''} | ${team1Name} vs ${team2Name} Score & Updates of ${matchNo}`
      }
    }
  }

  function makeDescription(match) {
    const matchName = `${match?.oTeamScoreA?.oTeam?.sAbbr} vs ${match?.oTeamScoreB?.oTeam?.sAbbr}`

    if (type === 'full-scorecard') {
      return `${matchName} ${match?.sSubtitle} ${match?.oSeries?.sSeason} Full Scorecard: Get the live & detailed ${matchName} ${match?.sSubtitle} ${match?.oSeries?.sSeason} scorecard, players score & fall of wickets information on CricTracker.`
    } else if (type === 'news') {
      return `${matchName} ${match?.oSeries?.sSeason} : ${t('common:ScorecardNews')} ${matchName} ${t('common:ScorecardNewsDescription')}`
    } else if (type === 'overs') {
      return `${matchName} ${t('common:ScorecardOvers')} ${matchName} ${match?.sFormatStr} ${t('common:ScorecardOverDescription')}`
    } else if (type === 'fixtures-and-results') {
      return `${matchName} ${match?.oSeries?.sSeason}: ${t('common:ScorecardNews')} ${matchName} ${t('common:ScorecardUpcomingDescription')}`
    } else if (type === 'results') {
      return `${matchName} ${match?.oSeries?.sSeason} ${t('common:ScorecardResultCheckout')} ${matchName} ${match?.oSeries?.sSeason} ${t('common:MatchResultsAfter')} ${match?.sSubtitle} ${t('common:ScorecardResultsDescription')}`
    } else {
      const { team1Abbr, team2Abbr, matchNo } = {
        team1Abbr: match?.oTeamScoreA?.oTeam?.sAbbr,
        team2Abbr: match?.oTeamScoreB?.oTeam?.sAbbr,
        matchNo: match?.sSubtitle
      }
      return `${team1Abbr} vs ${team2Abbr} ${matchNo}, Live Score: Get all the latest ${team1Abbr} vs ${team2Abbr} Live Score of ${matchNo} along with ball by ball commentary & updates on CricTracker.`
    }
  }

  return (
    <Layout data={{ oSeo: changeSeoData(seoData) }} matchDetail={matchDetail}>
      <main className={`${styles.matchPage} common-section`}>
        <Container>
          <div className="d-none d-md-block my-3" style={{ minHeight: '90px' }}>
            {width > 767 && ( // Desktop top
              <Ads
                id="div-ad-gpt-138639789--0-Crictracker2022_Desktop_Top_970"
                adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                dimensionDesktop={[970, 90]}
                className={'text-center'}
                style={{ minHeight: '90px' }}
              />
            )}
          </div>
          <Row>
            <Col lg={9} className="left-content">
              <MatchHeader data={matchDetail} />
              {matchDetail?.sStatusStr !== 'scheduled' && <RecentOver matchDetail={matchDetail} />}
              <div className="mt-3">
                <CommonNav
                  items={matchDetailNav(matchDetail?.oSeo?.sSlug, router.asPath, (matchDetail?.oSeries?.oCategory?.oSeo?.sSlug || matchDetail?.oSeries?.oSeo?.sSlug), matchDetail?.sStatusStr, matchDetail?.oSeries?.nTotalTeams, matchDetail?.bIsCommentary)}
                  isMatch
                />
              </div>
              <Ads
                id="div-ad-gpt-138639789-1660147282-1"
                adIdDesktop="Crictracker2022_Desktop_LiveScore_ATF_728x90"
                adIdMobile="Crictracker2022_Mobile_LiveScore_ATF_300x250"
                dimensionDesktop={[728, 90]}
                dimensionMobile={[300, 250]}
                mobile
                className={'text-center mb-3'}
              />
              {tab()}
            </Col>
            <Col lg={3} className="common-sidebar">
              <AllWidget type={WIDGET.currentSeries} show />
              {width > 991 && (
                <Ads
                  id="div-ad-gpt-138639789-1660147282-0"
                  adIdDesktop="Crictracker2022_Desktop_LiveScore_RightATF_300x600"
                  adIdMobile="Crictracker2022_Mobile_LiveScore_BTF2_336x280"
                  dimensionDesktop={[300, 600]}
                  dimensionMobile={[336, 280]}
                  mobile
                  className="text-center sticky-ads"
                />
              )}
            </Col>
          </Row>
          <Ads
            id="div-ad-gpt-138639789-1660147282-4"
            adIdDesktop="Crictracker2022_Desktop_LiveScore_BTF_728x90"
            adIdMobile="Crictracker2022_Mobile_LiveScore_BTF_300x250"
            dimensionDesktop={[728, 90]}
            dimensionMobile={[300, 250]}
            mobile
            className="mt-2 text-center"
          />
        </Container>
      </main>
    </Layout>
  )
}

MatchDetail.propTypes = {
  type: PropTypes.string,
  matchDetail: PropTypes.object,
  scorecard: PropTypes.object,
  error: PropTypes.any,
  fantasyData: PropTypes.object,
  status: PropTypes.string,
  fantasyPlatFormData: PropTypes.object,
  matchId: PropTypes.string,
  overViewData: PropTypes.object,
  commentaryData: PropTypes.array,
  matchOverView: PropTypes.object,
  squadData: PropTypes.object,
  upcomingData: PropTypes.array,
  newsData: PropTypes.object,
  recentOverData: PropTypes.object,
  liveScoreData: PropTypes.array,
  seoData: PropTypes.object,
  standingData: PropTypes.array,
  roundData: PropTypes.array,
  resultData: PropTypes.array,
  handleCommentary: PropTypes.func,
  seriesTotalTeams: PropTypes.number
}

export default MatchDetail

export async function getServerSideProps({ res, resolvedUrl }) {
  const slug = resolvedUrl.split('?')[0].split('/').filter(x => x)
  const currentPage = slug[slug.length - 1]
  const mSlug = matchDetailTabSlug.includes(currentPage) ? slug.slice(0, -1).join('/') : slug.join('/')
  try {
    res.setHeader('Cache-Control', 'public, max-age=7')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: mSlug } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const { data: match } = await queryGraphql(MATCH_DETAIL, { input: { _id: seoData?.getSeoData?.iId } })

    if (slug.length > 2) {
      if (currentPage === 'full-scorecard') {
        const { data } = await queryGraphql(FULL_SCOREBOARD, { input: { iMatchId: match?.getMatchById?._id } })
        const { data: squadData } = await queryGraphql(GET_MATCH_SQUAD, { input: { iMatchId: match?.getMatchById?._id } })
        if (match?.getMatchById?.sStatusStr === 'completed' || match?.getMatchById?.sStatusStr === 'live') {
          const { data: overviewInfo } = await queryGraphql(GET_MATCH_OVERVIEW, { input: { iMatchId: match?.getMatchById?._id } })
          return {
            props: {
              type: currentPage,
              matchDetail: match?.getMatchById,
              matchOverView: overviewInfo?.getMatchOverviewFront,
              scorecard: data,
              squadData: squadData,
              seoData: seoData?.getSeoData
            }
          }
        }
        return {
          props: {
            type: currentPage,
            matchDetail: match?.getMatchById,
            scorecard: data,
            squadData: squadData,
            seoData: seoData?.getSeoData
          }
        }
      } else if (currentPage === 'fantasy-tips') {
        if (match?.getMatchById?.sStatusStr === 'live' || match?.getMatchById?.sStatusStr === 'completed') {
          const { data } = await queryGraphql(FANTASY_TIPS_DETAILS, { input: { iMatchId: match?.getMatchById?._id } })
          const { data: fantasyPlatform } = await queryGraphql(GET_FANTASY_PLATFORM, {
            input: {
              iMatchId: match?.getMatchById?._id,
              ePlatformType:
                data?.getOverviewFront?.aCricPrediction?.length === 0 ? 'de' : data?.getOverviewFront?.aCricPrediction[0]?.ePlatformType
            }
          })
          return {
            props: {
              type: currentPage,
              matchDetail: match?.getMatchById,
              status: match?.getMatchById?.sStatusStr,
              fantasyPlatFormData: fantasyPlatform,
              matchId: match?.getMatchById?._id,
              overViewData: data?.getOverviewFront,
              seoData: seoData?.getSeoData
            }
          }
        } else {
          const { data } = await queryGraphql(FANTASY_TIPS_DETAILS, { input: { iMatchId: match?.getMatchById?._id } })
          return {
            props: {
              type: currentPage,
              matchDetail: match?.getMatchById,
              status: match?.getMatchById?.sStatusStr,
              fantasyData: data,
              seoData: seoData?.getSeoData
            }
          }
        }
      } else if (currentPage === 'fixtures-and-results') {
        const { data } = await queryGraphql(FIXTURES_LIST, { input: { iSeriesId: match?.getMatchById?.oSeries?._id, nOrder: 1, sSortBy: 'dStartDate', sStatusStr: 'scheduled' } })
        return {
          props: {
            type: currentPage,
            matchDetail: match?.getMatchById,
            upcomingData: data?.fetchFixuresData,
            seoData: seoData?.getSeoData
          }
        }
      } else if (currentPage === 'results') {
        const { data } = await queryGraphql(FIXTURES_LIST, { input: { iSeriesId: match?.getMatchById?.oSeries?._id, nOrder: 1, sSortBy: 'dStartDate', sStatusStr: 'completed' } })
        return {
          props: {
            type: currentPage,
            matchDetail: match?.getMatchById,
            resultData: data?.fetchFixuresData,
            seoData: seoData?.getSeoData
          }
        }
      } else if (currentPage === 'news') {
        const { data } = await queryGraphql(GET_SERIES_NEWS_VIDEOS, {
          input: { iSeriesId: match?.getMatchById?.oSeries?._id, eType: 'n', nLimit: 7, nSkip: 1 }
        })
        return {
          props: {
            type: currentPage,
            matchDetail: match?.getMatchById,
            newsData: data?.listSeriesArticlesVideosFront?.oArticles,
            seoData: seoData?.getSeoData
          }
        }
      } else if (currentPage === 'overs') {
        const { data } = await queryGraphql(RECENT_OVER, { input: { iMatchId: match?.getMatchById?._id, nLimit: 5, nSkip: 0, nInningNumber: 1 } })
        return {
          props: {
            type: currentPage,
            matchDetail: match?.getMatchById,
            recentOverData: data?.listMatchOvers,
            seoData: seoData?.getSeoData
          }
        }
      }
      return { props: { error: JSON.stringify(seoData) } }
    } else {
      if ((match?.getMatchById?.sStatusStr === 'completed' || match?.getMatchById?.sStatusStr === 'live' || match?.getMatchById?.sStatusStr === 'cancelled') && match?.getMatchById?.bIsCommentary) {
        // For commentary
        const { data } = await queryGraphql(GET_COMMENTARY, { input: { iMatchId: match?.getMatchById?._id, nLimit: 15 } })
        const { data: liveScoreData } = await queryGraphql(LIVE_INNING_DATA, { input: { iMatchId: match?.getMatchById?._id, nInningNumber: match?.getMatchById?.nLatestInningNumber } })
        return {
          props: {
            type: slug[slug.length - 1],
            commentaryData: data?.listMatchCommentaries,
            matchDetail: match?.getMatchById,
            liveScoreData: liveScoreData?.fetchLiveInningsData,
            seoData: seoData?.getSeoData
          }
        }
      } else {
        // For overview
        const { data } = await queryGraphql(GET_MATCH_OVERVIEW, { input: { iMatchId: match?.getMatchById?._id } })
        return {
          props: {
            matchDetail: match?.getMatchById,
            matchOverView: data?.getMatchOverviewFront,
            seoData: seoData?.getSeoData
          }
        }
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    console.error(JSON.stringify(e))
    // return { props: { error:  } }
    const status = handleApiError(e)
    return status
  }
}
