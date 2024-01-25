import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import Layout from '@shared-components/layout'
import { matchDetailNav } from '@shared/constants/allNavBars'
import { navLoader, pageHeaderLoader, tableLoader } from '@shared/libs/allLoader'
import { checkIsGlanceView } from '@shared/utils'
import useWindowSize from '@shared/hooks/windowSize'
import Error from '@shared/components/error'
import { setMatchPlayer } from '@shared/libs/match-detail'
import { getDeviceInfo } from '@shared/libs/menu'

const Skeleton = dynamic(() => import('@shared/components/skeleton'), { ssr: false })
const MatchHeader = dynamic(() => import('@shared-components/match/matchHeader'), { loading: () => pageHeaderLoader() })
const RecentOver = dynamic(() => import('@shared-components/match/recentOver'), { loading: () => <div style={{ height: '40px' }} /> })
const CommonNav = dynamic(() => import('@shared-components/commonNav'), { loading: () => navLoader() })
const CurrentSeries = dynamic(() => import('@shared/components/widgets/currentSeries'))
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
const LiveArticle = dynamic(() => import('@shared/components/articleDetail/liveArticle'))
const Timeline = dynamic(() => import('@shared/components/articleDetail/timeline'), { ssr: false })
const TimelineDropdown = dynamic(() => import('@shared/components/articleDetail/timelineDropdown'), { ssr: false })

// const MatchDetailStandings = dynamic(() => import('@shared/components/match/matchDetailStandings'))
const NoData = dynamic(() => import('@noData'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const GlanceAd = dynamic(() => import('@shared-components/ads/glanceAd'), { ssr: false })
const Poll = dynamic(() => import('@shared-components/match/poll'))

const MatchDetail = ({ matchDetail, type, scorecard, fantasyData, fantasyPlatFormData, overViewData, commentaryData, matchOverView, squadData, upcomingData, newsData, recentOverData, liveScoreData, seoData, roundData, resultData, playingXI, liveArticleData, sideBarData }) => {
  setMatchPlayer(playingXI)
  const { t } = useTranslation()
  const [width] = useWindowSize()
  const router = useRouter()
  const [timelineData, setTimelineData] = useState()
  const commentaryOpen = useRef(false)
  const isGlanceView = checkIsGlanceView(router?.query)
  const { isMobile } = getDeviceInfo()
  const status = matchDetail?.sStatusStr

  const handleCommentary = () => {
    commentaryOpen.current = true
  }
  useEffect(() => {
    !timelineData && setTimelineData(liveArticleData?.oLiveArticleList)
  }, [liveArticleData?.oLiveArticleList])

  const tab = () => {
    // if (type === 'full-scorecard') return (!matchDetail?.bIsCommentary && (scorecard?.fetchLiveInningsData?.length === 0 || scorecard?.fetchLiveInningsData[0]?.aBatters?.length === 0)) ? <NoData /> : <MatchDetailScorecard style={styles} data={scorecard} squad={squadData} matchDetail={matchDetail} matchOverView={matchOverView} />
    if (type === 'full-scorecard') {
      if (matchDetail?.sStatusStr === 'live' || (scorecard?.fetchLiveInningsData?.length !== 0 && scorecard?.fetchLiveInningsData[0]?.aBatters?.length !== 0)) {
        return <MatchDetailScorecard style={styles} data={scorecard} squad={squadData} matchDetail={matchDetail} matchOverView={matchOverView} />
      } else {
        return <NoData />
      }
    } else if (type === 'fantasy-tips') {
      if (status === 'live' || status === 'completed') return <MatchDetailFantasyPlatForm data={fantasyPlatFormData?.getFantasyTipsFront} matchId={matchDetail?._id} overview={overViewData} />
      else return <MatchDetailFantasyTips style={styles} data={fantasyData?.getOverviewFront} />
    } else if (type === 'fixtures-and-results') return upcomingData.length !== 0 ? <MatchDetailUpcoming data={upcomingData} /> : <NoData />
    // else if (type === 'fantasy-tips' && (status === 'live' || status === 'completed'))
    // else if (type === 'live-commentary') return (((matchDetail?.bIsCommentary && commentaryData.length !== 0) || liveScoreData?.length !== 0) || commentaryOpen.current === true) ? <MatchDetailCommentary data={commentaryData} matchDetail={matchDetail} liveScoreData={liveScoreData} handleCommentary={handleCommentary} /> : <NoData />
    else if (type === 'results') return resultData.length !== 0 ? <MatchDetailUpcoming data={resultData} /> : <NoData />
    else if (type === 'overs') return recentOverData?.aResults?.length !== 0 ? <MatchDetailOvers data={recentOverData} matchDetail={matchDetail} /> : <NoData />
    else if (type === 'news') return newsData.nTotal === 0 ? <NoData title={<Trans i18nKey="common:NoNewsFound" />} /> : <MatchDetailNews data={newsData} seriesId={matchDetail?.oSeries?._id} />
    else if (type === 'live-blog' && liveArticleData?.iEventId) {
      return liveArticleData?.oLiveArticleList?.length ? (
        <>
          <TimelineDropdown timelineData={timelineData} />
          <div className='pt-1 d-flex flex-row w-100'>
            <div className={`${styles.liveArticleContainer} common-box`}>
              <LiveArticle setTimelineData={setTimelineData} disableMatchCard liveArticleList={liveArticleData?.oLiveArticleList} liveEventId={liveArticleData?.iEventId} />
            </div>
            <div className={`${styles.timelineContainer} ${styles.timelineMain} common-box mb-0 p-1`}>
              <Timeline timelineData={timelineData} />
            </div>
          </div>
        </>
      ) : <NoData />
    } else {
      if ((matchDetail?.sStatusStr === 'live' || matchDetail?.sStatusStr === 'completed' || matchDetail?.sStatusStr === 'cancelled') && ((matchDetail?.bIsCommentary && commentaryData?.length !== 0) || commentaryOpen.current)) {
        return <MatchDetailCommentary data={commentaryData} matchDetail={matchDetail} liveScoreData={liveScoreData} handleCommentary={handleCommentary} playingXI={playingXI} />
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
    if (type === 'news' || type === 'fantasy-tips' || type === 'live-blog') return 'Noindex, Follow'
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
    <Layout data={{ ...matchDetail, oSeo: changeSeoData(seoData) }} matchDetail={{ ...matchDetail, commentary: commentaryData }}>
      <main className={`${styles.matchPage} common-section`}>
        <Container>
          <div className="d-none d-md-block mb-3" style={{ minHeight: '90px', marginTop: '-15px' }}>
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
            <Col lg={9} className={`left-content ${isGlanceView ? 'mb-5' : ''}`}>
              <MatchHeader data={matchDetail} liveScoreData={liveScoreData} currentTab={type} />
              {matchDetail?.sStatusStr !== 'scheduled' && <RecentOver matchDetail={matchDetail} />}
              <div className={`mb-3 ${isGlanceView ? '' : 'mt-3'} d-flex`}>
                <Ads
                  id="div-ad-gpt-138639789-1660147282-1"
                  adIdDesktop="Crictracker2022_Desktop_LiveScore_ATF_728x90"
                  adIdMobile="Crictracker2022_Mobile_LiveScore_ATF_300x250"
                  dimensionDesktop={[728, 90]}
                  dimensionMobile={[300, 250]}
                  mobile
                  className={'text-center w-100'}
                />
              </div>
              {isGlanceView && (
                <GlanceAd
                  id={`div-gpt-ad-1896${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
                  adId="Crictracker_small_banner_top"
                  dimension={[[320, 100], [320, 50], [300, 50]]}
                  adUnitName="Crictracker_Sportstab_InArticleMedium_Mid1"
                  placementName="InArticleMedium"
                  className="d-flex justify-content-center"
                  width={320}
                  height={50}
                  pageName="Crictracker SportsTab"
                />
              )}
              <CommonNav
                items={matchDetailNav(
                  matchDetail?.oSeo?.sSlug,
                  router.asPath,
                  (matchDetail?.oSeries?.oCategory?.oSeo?.sSlug || matchDetail?.oSeries?.oSeo?.sSlug),
                  matchDetail?.sStatusStr,
                  matchDetail?.oSeries?.nTotalTeams,
                  matchDetail?.bIsCommentary,
                  matchDetail.iEventId,
                  isGlanceView
                )}
                isSticky
                isMatch
                className={`mt-3 ${styles.matchNav} 
                  ${(matchDetail?.sStatusStr === 'live' || matchDetail?.sStatusStr === 'completed' || matchDetail?.sStatusStr === 'cancelled') ? styles.navBottom : ''}
                  ${((matchDetail?.sStatusStr === 'live' && (matchDetail?.oLiveScore?.nRunrate > 0 || matchDetail?.oLiveScore?.sRequiredRunrate)) ||
                    (matchDetail?.sStatusStr === 'completed' && (matchDetail?.oMom?.sFullName || matchDetail?.oMos?.sFullName))) ? '' : styles.noBottomInfoNav}
                `}
              />
              {tab()}
            </Col>
            {(width > 991 || !isMobile) && (
              <Col lg={3} className="common-sidebar">
                <CurrentSeries data={sideBarData?.currentSeries} />
                {matchDetail?.aPoll?.map((p) => (
                  <Poll key={p?._id} details={p} isWidgetPoll />
                ))}
                {liveArticleData?.iEventId && liveArticleData?.oLiveArticleList?.length ? <div className={`${styles.timelineContainer} ${styles.timelineSidebar} common-box mb-0 p-1 w-100`}>
                  <Timeline timelineData={timelineData} />
                </div> : null}
                <Ads
                  id="div-ad-gpt-138639789-1660147282-0"
                  adIdDesktop="Crictracker2022_Desktop_LiveScore_RightATF_300x600"
                  dimensionDesktop={[300, 600]}
                  className="text-center sticky-ads position-sticky mb-2"
                />
              </Col>
            )}
          </Row>
        </Container>
      </main>
    </Layout>
  )
}

MatchDetail.propTypes = {
  type: PropTypes.string,
  matchDetail: PropTypes.object,
  scorecard: PropTypes.object,
  fantasyData: PropTypes.object,
  fantasyPlatFormData: PropTypes.object,
  overViewData: PropTypes.object,
  commentaryData: PropTypes.array,
  matchOverView: PropTypes.object,
  squadData: PropTypes.object,
  upcomingData: PropTypes.array,
  newsData: PropTypes.object,
  recentOverData: PropTypes.object,
  liveScoreData: PropTypes.array,
  seoData: PropTypes.object,
  roundData: PropTypes.array,
  resultData: PropTypes.array,
  playingXI: PropTypes.object,
  liveArticleData: PropTypes.object,
  sideBarData: PropTypes.object
}

export default Error(MatchDetail)

export async function getServerSideProps({ res, resolvedUrl, query }) {
  const [graphql, articleQuery, utils, routes, matchQuery, fixtureQuery, rankingsQuery] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@shared/constants/allRoutes'),
    import('@graphql/match/match.query'),
    import('@graphql/series/fixtures.query'),
    import('@graphql/globalwidget/rankings.query')
  ])

  const slug = resolvedUrl.split('?')[0].split('/').filter(x => x)
  const currentPage = slug[slug.length - 1]
  const mSlug = routes.matchDetailTabSlug.includes(currentPage) ? slug.slice(0, -1).join('/') : slug.join('/')

  try {
    res.setHeader('Cache-Control', 'public, max-age=120')

    const { data: seoData } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: mSlug } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    if (seoData?.getSeoData?.iId) {
      const { data: match } = await graphql.default(matchQuery.MATCH_DETAIL, { input: { _id: seoData?.getSeoData?.iId } })
      const api = [
        graphql.default(matchQuery.GET_MATCH_PLAYING_XI, { input: { iMatchId: seoData?.getSeoData?.iId } }),
        graphql.default(rankingsQuery.CURRENT_SERIES_LIST)
      ]

      if (slug.length > 2) {
        if (currentPage === 'full-scorecard') {
          api.push(
            graphql.default(matchQuery.FULL_SCOREBOARD, { input: { iMatchId: match?.getMatchById?._id } }),
            graphql.default(matchQuery.GET_MATCH_SQUAD, { input: { iMatchId: match?.getMatchById?._id } })
          )

          if (match?.getMatchById?.sStatusStr === 'completed' || match?.getMatchById?.sStatusStr === 'live') {
            api.push(graphql.default(matchQuery.GET_MATCH_OVERVIEW, { input: { iMatchId: match?.getMatchById?._id } }))
            const [playingXI, currentSeries, scoreBoard, squadData, overview] = await Promise.allSettled(api)
            return {
              props: {
                type: currentPage,
                matchDetail: match?.getMatchById,
                matchOverView: overview?.value?.data?.getMatchOverviewFront || null,
                scorecard: scoreBoard?.value?.data || null,
                squadData: squadData?.value?.data || null,
                seoData: seoData?.getSeoData,
                playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
                sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
              }
            }
          }
          const [playingXI, currentSeries, scoreBoard, squadData] = await Promise.allSettled(api)
          return {
            props: {
              type: currentPage,
              matchDetail: match?.getMatchById,
              scorecard: scoreBoard?.value?.data || null,
              squadData: squadData?.value?.data || null,
              seoData: seoData?.getSeoData,
              playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
              sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
            }
          }
        } else if (currentPage === 'fantasy-tips') {
          if (match?.getMatchById?.sStatusStr === 'live' || match?.getMatchById?.sStatusStr === 'completed') {
            api.push(
              graphql.default(matchQuery.FANTASY_TIPS_DETAILS, { input: { iMatchId: match?.getMatchById?._id } }),
              graphql.default(matchQuery.GET_FANTASY_PLATFORM, {
                input: {
                  iMatchId: match?.getMatchById?._id,
                  ePlatformType: 'de'
                  // -------NOTE----------
                  // Temporary remove platform dropdown will add in future as per client requirements
                  // data?.getOverviewFront?.aCricPrediction?.length === 0 ? 'de' : data?.getOverviewFront?.aCricPrediction[0]?.ePlatformType
                }
              })
            )
            const [playingXI, currentSeries, fantasyTips, fantasyPlatform] = await Promise.allSettled(api)
            return {
              props: {
                type: currentPage,
                matchDetail: match?.getMatchById,
                fantasyPlatFormData: fantasyPlatform?.value?.data || null,
                overViewData: fantasyTips?.value?.data?.getOverviewFront || null,
                seoData: seoData?.getSeoData,
                playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
                sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
              }
            }
          } else {
            api.push(graphql.default(matchQuery.FANTASY_TIPS_DETAILS, { input: { iMatchId: match?.getMatchById?._id } }))
            const [playingXI, currentSeries, fantasyTips] = await Promise.allSettled(api)

            return {
              props: {
                type: currentPage,
                matchDetail: match?.getMatchById,
                fantasyData: fantasyTips?.value?.data || null,
                seoData: seoData?.getSeoData,
                playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
                sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
              }
            }
          }
        } else if (currentPage === 'fixtures-and-results') {
          api.push(graphql.default(fixtureQuery.FIXTURES_LIST, { input: { iSeriesId: match?.getMatchById?.oSeries?._id, nOrder: 1, sSortBy: 'dStartDate', sStatusStr: 'scheduled' } }))
          const [playingXI, currentSeries, fixture] = await Promise.allSettled(api)
          return {
            props: {
              type: currentPage,
              matchDetail: match?.getMatchById,
              upcomingData: fixture?.value?.data?.fetchFixuresData || null,
              seoData: seoData?.getSeoData,
              playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
              sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
            }
          }
        } else if (currentPage === 'results') {
          api.push(graphql.default(fixtureQuery.FIXTURES_LIST, { input: { iSeriesId: match?.getMatchById?.oSeries?._id, nOrder: 1, sSortBy: 'dStartDate', sStatusStr: 'completed' } }))
          const [playingXI, currentSeries, fixture] = await Promise.allSettled(api)
          return {
            props: {
              type: currentPage,
              matchDetail: match?.getMatchById,
              resultData: fixture?.value?.data?.fetchFixuresData || null,
              seoData: seoData?.getSeoData,
              playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
              sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
            }
          }
        } else if (currentPage === 'news') {
          const { GET_SERIES_NEWS_VIDEOS } = (await import('@graphql/series/home.query'))
          api.push(graphql.default(GET_SERIES_NEWS_VIDEOS, {
            input: { iSeriesId: match?.getMatchById?.oSeries?._id, eType: 'n', nLimit: 7, nSkip: 1 }
          }))
          const [playingXI, currentSeries, news] = await Promise.allSettled(api)
          return {
            props: {
              type: currentPage,
              matchDetail: match?.getMatchById,
              newsData: news?.value?.data?.listSeriesArticlesVideosFront?.oArticles || null,
              seoData: seoData?.getSeoData,
              playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
              sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
            }
          }
        } else if (currentPage === 'overs') {
          api.push(graphql.default(matchQuery.GET_MATCH_OVERS, { input: { iMatchId: match?.getMatchById?._id, nLimit: 5, nSkip: 0, nInningNumber: match?.getMatchById?.nLatestInningNumber } }))
          const [playingXI, currentSeries, overs] = await Promise.allSettled(api)
          return {
            props: {
              type: currentPage,
              matchDetail: match?.getMatchById,
              recentOverData: overs?.value?.data?.listMatchOvers || null,
              seoData: seoData?.getSeoData,
              playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
              sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
            }
          }
        } else if (currentPage === 'live-blog') {
          const liveArticleData = {}
          if (match?.getMatchById?.iEventId) {
            const { getLiveArticleData } = (await import('@shared/libs/live-article'))
            api.push(getLiveArticleData({ iEventId: match?.getMatchById?.iEventId }))
          }

          const [playingXI, currentSeries, liveBlog] = await Promise.allSettled(api)
          liveArticleData.iEventId = match?.getMatchById?.iEventId
          liveArticleData.oLiveArticleList = liveBlog?.value?.oLiveArticleList || null
          liveArticleData.oLiveArticleEvent = liveBlog?.value?.oLiveArticleEvent || null

          return {
            props: {
              type: currentPage,
              matchDetail: match?.getMatchById,
              liveArticleData: liveArticleData,
              seoData: seoData?.getSeoData,
              playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
              sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
            }
          }
        }
        return { props: { error: JSON.stringify(seoData) } }
      } else {
        if ((match?.getMatchById?.sStatusStr === 'completed' || match?.getMatchById?.sStatusStr === 'live' || match?.getMatchById?.sStatusStr === 'cancelled') && match?.getMatchById?.bIsCommentary) {
          api.push(
            graphql.default(matchQuery.GET_COMMENTARY, { input: { iMatchId: match?.getMatchById?._id, nLimit: 15 } }),
            graphql.default(matchQuery.LIVE_INNING_DATA, { input: { iMatchId: match?.getMatchById?._id, nInningNumber: match?.getMatchById?.nLatestInningNumber } })
          )
          const [playingXI, currentSeries, commentary, liveScoreData] = await Promise.allSettled(api)
          return {
            props: {
              type: slug[slug.length - 1],
              commentaryData: commentary?.value?.data?.listMatchCommentaries || null,
              matchDetail: match?.getMatchById,
              liveScoreData: liveScoreData?.value?.data?.fetchLiveInningsData || null,
              seoData: seoData?.getSeoData,
              playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
              sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
            }
          }
        } else {
          api.push(graphql.default(matchQuery.GET_MATCH_OVERVIEW, { input: { iMatchId: match?.getMatchById?._id } }))

          const [playingXI, currentSeries, overview] = await Promise.allSettled(api)
          return {
            props: {
              matchDetail: match?.getMatchById,
              matchOverView: overview?.value?.data?.getMatchOverviewFront || null,
              seoData: seoData?.getSeoData,
              playingXI: playingXI?.value?.data?.getMatchOverviewFront || null,
              sideBarData: { currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries || null }
            }
          }
        }
      }
    } else {
      return { notFound: true }
    }
  } catch (e) {
    // console.log({ matchDetail: e })
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
