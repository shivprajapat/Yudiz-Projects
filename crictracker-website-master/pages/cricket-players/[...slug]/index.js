import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Col, Container, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useAmp } from 'next/amp'

import { articleLoader, navLoader, pageLoading } from '@shared/libs/allLoader'
import useWindowSize from '@shared/hooks/windowSize'
import Layout from '@shared/components/layout'
import LayoutAmp from '@shared/components/layout/layoutAmp'
import Error from '@shared/components/error'
import { arraySortByOrder } from '@shared/utils'

const CurrentSeries = dynamic(() => import('@shared/components/widgets/currentSeries'), { loading: () => pageLoading() })

const CommonNav = dynamic(() => import('@shared-components/commonNav'), { loading: () => navLoader() })
const SeriesHome = dynamic(() => import('@shared/components/series/seriesHome'), { loading: () => articleLoader(['g', 's']) })
const SeriesNews = dynamic(() => import('@shared/components/series/seriesNews'), { loading: () => articleLoader(['g', 's']) })
const PlayerInfo = dynamic(() => import('@shared/components/player/playerInfo'), { loading: () => pageLoading() })
const PlayerRanking = dynamic(() => import('@shared/components/player/playerRanking'), { loading: () => pageLoading() })
const PopularPlayers = dynamic(() => import('@shared/components/player/popularPlayers'), { loading: () => pageLoading() })
const PlayerOverview = dynamic(() => import('@shared/components/player/playerOverview'), { loading: () => pageLoading() })
const PlayerBattingStats = dynamic(() => import('@shared/components/player/playerStats/playerBattingStats'), { loading: () => pageLoading() })
const PlayerBowlingStats = dynamic(() => import('@shared/components/player/playerStats/playerBowlingStats'), { loading: () => pageLoading() })
const PlayerRecentMatches = dynamic(() => import('@shared/components/player/playerStats/playerRecentMatches'), { loading: () => pageLoading() })
const NoData = dynamic(() => import('@noData'), { ssr: false })

// AMP components
const CommonNavAMP = dynamic(() => import('@shared/components/amp/commonNavAMP'), { loading: () => navLoader() })
const SeriesHomeAMP = dynamic(() => import('@shared/components/amp/seriesHomeAMP'), { loading: () => articleLoader(['g', 's']) })
const SeriesNewsAMP = dynamic(() => import('@shared/components/amp/series/seriesNewsAMP'), { loading: () => articleLoader(['g', 's']) })
const PlayerInfoAMP = dynamic(() => import('@shared/components/amp/playerAMP/playerInfoAMP'), { loading: () => pageLoading() })
const PlayerRankingAMP = dynamic(() => import('@shared/components/amp/playerAMP/playerRankingAMP'), { loading: () => pageLoading() })
const PopularPlayersAMP = dynamic(() => import('@shared/components/amp/playerAMP/popularPlayersAMP'), { loading: () => pageLoading() })
const PlayerOverviewAMP = dynamic(() => import('@shared/components/amp/playerAMP/playerOverviewAMP'), { loading: () => pageLoading() })
const PlayerBattingStatsAMP = dynamic(() => import('@shared/components/amp/playerAMP/playerBattingStatsAMP'), { loading: () => pageLoading() })
const PlayerBowlingStatsAMP = dynamic(() => import('@shared/components/amp/playerAMP/playerBowlingStatsAMP'), { loading: () => pageLoading() })
const PlayerRecentMatchesAMP = dynamic(() => import('@shared/components/amp/playerAMP/playerRecentMatchesAMP'), { loading: () => pageLoading() })

export const config = { amp: 'hybrid' }

function Player({ playerDetails, playerRecentMatch, popularPlayers, playerRanking, seoData, articles }) {
  const [width] = useWindowSize()
  const isAmp = useAmp()
  const router = useRouter()
  const tab = router?.query?.slug[1]
  const subPagesURLS = {
    n: {
      sSlug: `${playerDetails?.oSeo?.sSlug}/news`
    }
  }
  const playerInfo = useMemo(() => {
    return {
      ...playerDetails,
      oStats: arraySortByOrder({ data: playerDetails?.oStats, order: [...Array(100).keys()], key: 'nPriority' })
    }
  }, [playerDetails])

  function getNavItems() {
    const items = [
      {
        navItem: 'Overview',
        url: `/${playerDetails?.oSeo?.sSlug}/`,
        active: router?.asPath === `/${playerDetails?.oSeo?.sSlug}/${isAmp ? '?amp=1' : ''}`
      },
      {
        navItem: 'News',
        url: `/${playerDetails?.oSeo?.sSlug}/news/`,
        active: router?.asPath === `/${playerDetails?.oSeo?.sSlug}/news/${isAmp ? '?amp=1' : ''}`
      },
      {
        navItem: 'Stats',
        url: `/${playerDetails?.oSeo?.sSlug}/stats/`,
        active: router?.asPath === `/${playerDetails?.oSeo?.sSlug}/stats/${isAmp ? '?amp=1' : ''}`
      }
    ]
    return items
  }

  function getNav() {
    if (isAmp) {
      return <CommonNavAMP items={getNavItems()} isSticky />
    } else {
      return <CommonNav items={getNavItems()} isSticky />
    }
  }

  if (isAmp) {
    return (
      <LayoutAmp data={{ oSeo: seoData }}>
        <div className="my-3 my-md-4 pb-4">
          <div className="container pb-3">
            <PlayerInfoAMP playerDetails={playerInfo} />
            {getNav()}
            {tab === 'stats' ? (
              <>
                <PlayerRankingAMP playerRanking={playerRanking} />
                <PlayerBattingStatsAMP playerDetails={playerInfo} />
                <PlayerBowlingStatsAMP playerDetails={playerInfo} />
                <PlayerRecentMatchesAMP playerDetails={playerInfo} playerRecentMatch={playerRecentMatch} />
                <PopularPlayersAMP popularPlayers={popularPlayers} />
              </>
            ) : tab === 'news' ? (
              <SeriesNewsAMP data={articles?.oArticles} />
            ) : (
              <>
                <PlayerOverviewAMP playerDetails={playerInfo} />
                <PlayerRankingAMP playerRanking={playerRanking} />
                <PlayerBattingStatsAMP playerDetails={playerInfo} />
                <PlayerBowlingStatsAMP playerDetails={playerInfo} />
                <PlayerRecentMatchesAMP playerDetails={playerInfo} playerRecentMatch={playerRecentMatch} />
                {articles?.oArticles?.aResults?.length > 0 && (
                  <SeriesHomeAMP subPagesURLS={subPagesURLS} data={articles} category={articles} showMoreBtn />
                )}
                <br />
                <PopularPlayersAMP popularPlayers={popularPlayers} />
              </>
            )}
          </div>
        </div>
      </LayoutAmp>
    )
  } else {
    return (
      <Layout data={{ oSeo: seoData }}>
        <main className="my-3 my-md-4">
          <Container>
            <Row>
              <Col md={3}>
                <PlayerInfo playerDetails={playerInfo} />
                <div className='d-none d-md-block'>
                  <PlayerRanking playerRanking={playerRanking} />
                  <CurrentSeries />
                  <PopularPlayers popularPlayers={popularPlayers} />
                </div>
              </Col>
              <Col md={9}>
                {getNav()}
                {tab === 'stats' ? (
                  <>
                    <PlayerRanking playerRanking={playerRanking} className="d-md-none" />
                    <PlayerBattingStats playerDetails={playerInfo} />
                    <PlayerBowlingStats playerDetails={playerInfo} />
                    <PlayerRecentMatches playerDetails={playerInfo} playerRecentMatch={playerRecentMatch} />
                    {width > 767 && playerRanking?.length === 0 && playerRecentMatch?.length === 0 && playerDetails?.oStats?.length === 0 && (
                      <NoData />
                    )}
                  </>
                ) : tab === 'news' ? (
                  <SeriesNews data={articles?.oArticles} category={{ ...articles, iId: seoData?.iId, eType: seoData?.eType }} />
                ) : (
                  <>
                    <PlayerOverview playerDetails={playerInfo} />
                    <PlayerRanking playerRanking={playerRanking} className="d-md-none" />
                    <PlayerBattingStats playerDetails={playerInfo} />
                    <PlayerBowlingStats playerDetails={playerInfo} />
                    <PlayerRecentMatches playerDetails={playerInfo} playerRecentMatch={playerRecentMatch} />
                    {articles?.oArticles?.aResults?.length > 0 && (
                      <SeriesHome subPagesURLS={subPagesURLS} data={articles} category={articles} />
                    )}
                  </>
                )}
                {tab !== 'news' && (
                  <>
                    {!tab && <br />}
                    <PopularPlayers popularPlayers={popularPlayers} className="d-md-none" />
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </main>
      </Layout>
    )
  }
}

Player.propTypes = {
  playerDetails: PropTypes.object,
  playerRecentMatch: PropTypes.array,
  popularPlayers: PropTypes.array,
  playerRanking: PropTypes.array,
  seoData: PropTypes.object,
  articles: PropTypes.object
}

export async function getServerSideProps({ req, res, params, query, resolvedUrl }) {
  const [graphql, articleQuery, playerLib, utils, playerQuery, tagQuery] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/libs/meta-details/player'),
    import('@shared/utils'),
    import('@graphql/players/players.query'),
    import('@graphql/tag/tag.query')
  ])
  // Check amp exists in query params
  const { hasAmp, redirectionRules } = utils.hasAmpInQueryParams(req?.url)
  if (hasAmp) return redirectionRules
  const slug = utils.checkPageNumberInSlug([...params?.slug], false)?.slug?.join('/')

  try {
    res.setHeader('Cache-Control', 'public, max-age=420')

    const { data: seo } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: `cricket-players/${slug.split('/')[0]}` } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seo?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const apis = [
      graphql.default(playerQuery.GET_PLAYERS, { input: { _id: seo?.getSeoData?.iId } }),
      graphql.default(playerQuery.GET_POPULAR_PLAYER, { input: { iPlayerId: seo?.getSeoData?.iId, nLimit: 5 } }),
      graphql.default(playerQuery.GET_PLAYER_RANKING, { input: { iPlayerId: seo?.getSeoData?.iId } })
    ]

    const tab = slug.split('/')[1]

    if (!tab) {
      apis.push(
        graphql.default(tagQuery.GET_TAG_ARTICLE, { input: { _id: seo?.getSeoData?.iId, eType: seo?.getSeoData?.eType, nLimit: 16, nSkip: 0, sSortBy: 'dCreated', nOrder: -1 } }),
        graphql.default(playerQuery.GET_PLAYER_RECENT_MATCH, {
          input: { _id: seo?.getSeoData?.iId, aFormatStr: query?.amp ? ['all', 'test', 'odi', 't20'] : ['all'] }
        })
      )
      const [playerDetails, popularPlayers, playerRanking, article, playerRecentMatch] = await Promise.allSettled(apis)
      return {
        props: {
          playerDetails: playerDetails?.value?.data?.getPlayerByIdFront,
          playerRecentMatch: playerRecentMatch?.value?.data?.getRecentMatchesOfPlayer,
          popularPlayers: popularPlayers?.value?.data?.getPopularPlayers,
          playerRanking: playerRanking?.value?.data?.getPlayerRanking,
          seoData: playerLib.getPlayerSeoData({ tab, seoData: seo?.getSeoData, player: playerDetails?.value?.data?.getPlayerByIdFront }),
          articles: { oArticles: { ...article?.value?.data?.getTagArticlesFront } }
        }
      }
    } else if (tab === 'stats') {
      apis.push(
        graphql.default(playerQuery.GET_PLAYER_RECENT_MATCH, {
          input: { _id: seo?.getSeoData?.iId, aFormatStr: query?.amp ? ['all', 'test', 'odi', 't20'] : ['all'] }
        })
      )
      const [playerDetails, popularPlayers, playerRanking, playerRecentMatch] = await Promise.allSettled(apis)
      return {
        props: {
          playerDetails: playerDetails?.value?.data?.getPlayerByIdFront,
          playerRecentMatch: playerRecentMatch?.value?.data?.getRecentMatchesOfPlayer,
          popularPlayers: popularPlayers?.value?.data?.getPopularPlayers,
          playerRanking: playerRanking?.value?.data?.getPlayerRanking,
          seoData: playerLib.getPlayerSeoData({ tab, seoData: seo?.getSeoData, player: playerDetails?.value?.data?.getPlayerByIdFront })
        }
      }
    } else if (tab === 'news') {
      apis.push(
        graphql.default(tagQuery.GET_TAG_ARTICLE, { input: { _id: seo?.getSeoData?.iId, eType: seo?.getSeoData?.eType, nLimit: 16, nSkip: 0, sSortBy: 'dCreated', nOrder: -1 } })
      )
      const [playerDetails, popularPlayers, playerRanking, article] = await Promise.allSettled(apis)
      return {
        props: {
          playerDetails: playerDetails?.value?.data?.getPlayerByIdFront,
          popularPlayers: popularPlayers?.value?.data?.getPopularPlayers,
          playerRanking: playerRanking?.value?.data?.getPlayerRanking,
          seoData: playerLib.getPlayerSeoData({ tab, seoData: seo?.getSeoData, player: playerDetails?.value?.data?.getPlayerByIdFront }),
          articles: { oArticles: { ...article?.value?.data?.getTagArticlesFront } }
        }
      }
    } else {
      return {
        notFound: true
      }
    }
  } catch (e) {
    console.log(e)
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}

export default Error(Player)
