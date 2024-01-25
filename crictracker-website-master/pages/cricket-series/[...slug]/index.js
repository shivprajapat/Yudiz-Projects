import React from 'react'
import PropTypes from 'prop-types'
import { Col, Container, Row } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import Layout from '@shared-components/layout'
import { pageHeaderLoader, scoreCardSliderLoader } from '@shared/libs/allLoader'
import { WIDGET } from '@shared/constants'
import { arraySortByOrder } from '@shared/utils'
import Error from '@shared/components/error'
import { ENUM_CRICKET_SERIES_PAGES, ENUM_SEO_SUBTYPE } from '@shared/enum'

const Fixtures = dynamic(() => import('@shared/components/series/fixtures'))
const CommonNav = dynamic(() => import('@shared/components/commonNav'))
const Standings = dynamic(() => import('@shared/components/series/standings'))
const Stats = dynamic(() => import('@shared/components/series/stats'))
const SeriesTeam = dynamic(() => import('@shared/components/series/seriesTeam'))
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const PageHeader = dynamic(() => import('@shared-components/pageHeader'), { loading: () => pageHeaderLoader() })
const SeriesSquads = dynamic(() => import('@shared/components/series/seriesSquads'))
const ScorecardSlider = dynamic(() => import('@shared-components/scorecardSlider'), { loading: () => scoreCardSliderLoader(), ssr: false })
const SeriesFantasyTipsList = dynamic(() => import('@shared/components/series/seriesFantasyTipsList'))

const SeriesPage = ({ seoData, fixturesData, fixturesFilter, roundData, standingData, type, seriesData, statsData, seriesTeamData, seriesArchivesData, error, seriesHeaderData, teamPlayer, matchTypeData, seriesFantasyTipsData, subPages, scoreCard }) => {
  const tab = () => {
    if (type === 'standings') {
      return <Standings round={roundData?.fetchSeriesRounds}
        // id={seoData?.iId}
        standing={standingData?.fetchSeriesStandings} />
    } else if (type === 'stats') {
      return <Stats seoData={seoData} data={statsData} typeData={seriesData} id={seoData?.iId} matchTypeData={matchTypeData?.listSeriesStatsFormat} />
    } else if (type === 'teams') {
      return <SeriesTeam data={seriesTeamData} id={seoData?.iId} />
    } else if (type === 'squads') {
      return <SeriesSquads team={seriesTeamData?.listSeriesTeams?.aTeams} players={teamPlayer} id={seoData?.iId} />
    } else if (type === 'fantasy-tips') {
      return <SeriesFantasyTipsList data={seriesFantasyTipsData} id={seoData?.iId} />
    } else {
      return <Fixtures data={fixturesData} teamVenueData={fixturesFilter} id={seoData?.iId} />
    }
  }

  function getNavItems() {
    const items = []
    subPages.forEach((t) => {
      if (ENUM_CRICKET_SERIES_PAGES[t?.eSubType]) {
        items.push({
          navItem: ENUM_CRICKET_SERIES_PAGES[t?.eSubType],
          url: `/${t?.sSlug}/`,
          active: t?.eSubType === seoData?.eSubType
        })
      } else if (t?.eSubType === null) { // Home Tab
        items.push({
          navItem: ENUM_CRICKET_SERIES_PAGES.f,
          url: `/${t?.sSlug}/`,
          active: t?.eSubType === seoData?.eSubType
        })
      }
    })
    const order = ['fixtures', 'standings', 'stats', 'teams', 'squads', 'fantasy-tips']
    return arraySortByOrder({ data: items, order, key: 'navItem' })
  }

  return (
    <Layout data={{ oSeo: seoData }} scoreCard={scoreCard}>
      <main className="pb-3 pt-3">
        {scoreCard?.length > 0 && (
          <ScorecardSlider data={scoreCard} seriesId={seriesHeaderData?._id} />
        )}
        <div className="common-section">
          <Container>
            <Row>
              <Col lg={9} className="left-content" >
                <PageHeader
                  name={seriesHeaderData?.sTitle}
                />
                <CommonNav items={getNavItems()} isSticky className="mt-3" />
                {tab()}
              </Col>
              <Col lg={3} className="common-sidebar">
                <AllWidget type={WIDGET.ranking} show />
                <AllWidget type={WIDGET.currentSeries} show />
              </Col>
            </Row>
          </Container>
        </div>
      </main>
    </Layout>
  )
}

SeriesPage.propTypes = {
  seoData: PropTypes.object,
  fixturesData: PropTypes.object,
  fixturesFilter: PropTypes.object,
  type: PropTypes.string,
  roundData: PropTypes.object,
  standingData: PropTypes.object,
  seriesData: PropTypes.object,
  statsData: PropTypes.object,
  seriesTeamData: PropTypes.object,
  seriesArchivesData: PropTypes.object,
  error: PropTypes.any,
  seriesHeaderData: PropTypes.object,
  matchTypeData: PropTypes.object,
  teamPlayer: PropTypes.array,
  seriesFantasyTipsData: PropTypes.object,
  subPages: PropTypes.array,
  scoreCard: PropTypes.array
}

export default Error(SeriesPage)

export async function getServerSideProps({ res, params, resolvedUrl, query }) {
  const [graphql, articleQuery, utils, routes, seriesQuery, homeQuery, seoQuery] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@shared/constants/allRoutes'),
    import('@graphql/cricket-series/cricket-series.query'),
    import('@graphql/home/home.query'),
    import('@graphql/seo/seo.query')
  ])
  const slug = utils.checkPageNumberInSlug([...params?.slug], false)?.slug?.join('/')

  try {
    res.setHeader('Cache-Control', 'public, max-age=420')

    const { data: idData } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: routes.allRoutes.cricketSeriesPages + slug } })
    const currentPage = ENUM_SEO_SUBTYPE[idData?.getSeoData?.eSubType]

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(idData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const api = []

    const { data: seriesHeaderData } = await graphql.default(seriesQuery.GET_SERIES_BY_ID, { input: { _id: idData?.getSeoData?.iId } })

    if (idData?.getSeoData?.eType === 'se') {
      api.push(
        graphql.default(seoQuery.GET_SUB_PAGE_BY_SLUG, { input: { sSlug: idData?.getSeoData?.sSlug } }),
        graphql.default(homeQuery.SERIES_MINI_SCORECARD, { input: { _id: idData?.getSeoData?.iId } })
      )

      if (currentPage === 'standings') {
        const { GET_ROUNDS, GET_STANDING_DATA } = (await import('@graphql/series/standings.query'))
        api.push(
          graphql.default(GET_ROUNDS, { input: { iSeriesId: idData?.getSeoData?.iId } }),
          graphql.default(GET_STANDING_DATA, { input: { iRoundId: null, iSeriesId: idData?.getSeoData?.iId } })
        )
        const [subPages, scoreCard, roundData, standingData] = await Promise.allSettled(api)
        return {
          props: {
            seoData: idData?.getSeoData,
            seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
            scoreCard: scoreCard?.value?.data?.listSeriesScorecard,
            subPages: subPages?.value?.data?.getSeosBySlug,
            type: currentPage,
            roundData: roundData?.value?.data,
            standingData: standingData?.value?.data
          }
        }
      } else if (currentPage === 'stats') {
        const { FETCH_SERIES_STATS_TYPE, STATS, MATCH_TYPES } = (await import('@graphql/series/stats.query'))
        const { data: seriesData } = await graphql.default(FETCH_SERIES_STATS_TYPE, { input: { eGroupTitle: 'All' } })

        // Get stats data base on selected filter
        let currentItemData
        if (idData?.getSeoData?.eSubType !== 'st') {
          const lastSlug = idData?.getSeoData?.sSlug?.split('/')?.slice(-1)[0]?.replaceAll('-', '_')
          currentItemData = seriesData?.fetchSeriesStatsTypes.filter((i) => {
            const slugType = i.sSeoType || i.sType
            return slugType === lastSlug
          })
        }

        if (seriesHeaderData?.getSeriesByIdFront?.sSeriesType === 'tour' || seriesHeaderData?.getSeriesByIdFront?.sSeriesType === 'series') {
          api.push(graphql.default(MATCH_TYPES, { input: { iSeriesId: idData?.getSeoData?.iId } }))
          const [subPages, scoreCard, matchTypeData] = await Promise.allSettled(api)
          const { data: statsData } = await graphql.default(STATS, {
            input: {
              iSeriesId: idData?.getSeoData?.iId,
              _id: idData?.getSeoData?.eSubType !== 'st' ? currentItemData[0]._id : seriesData?.fetchSeriesStatsTypes[0]?._id,
              eFormat: matchTypeData?.value?.data?.listSeriesStatsFormat[0]
            }
          })
          return {
            props: {
              seoData: idData?.getSeoData,
              seriesData: seriesData,
              statsData: statsData,
              matchTypeData: matchTypeData?.value?.data,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              type: currentPage,
              scoreCard: scoreCard?.value?.data?.listSeriesScorecard,
              subPages: subPages?.value?.data?.getSeosBySlug
            }
          }
        } else {
          api.push(graphql.default(STATS, {
            input: {
              iSeriesId: idData?.getSeoData?.iId,
              _id: idData?.getSeoData?.eSubType !== 'st' ? currentItemData[0]._id : seriesData?.fetchSeriesStatsTypes[0]?._id
            }
          }))
          const [subPages, scoreCard, statsData] = await Promise.allSettled(api)
          return {
            props: {
              seoData: idData?.getSeoData,
              seriesData: seriesData,
              statsData: statsData?.value?.data,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              type: currentPage,
              scoreCard: scoreCard?.value?.data?.listSeriesScorecard,
              subPages: subPages?.value?.data?.getSeosBySlug
            }
          }
        }
      } else if (currentPage === 'teams') {
        const { LIST_SERIES_TEAMS } = (await import('@graphql/series/teams.query'))
        api.push(graphql.default(LIST_SERIES_TEAMS, { input: { iSeriesId: idData?.getSeoData?.iId } }))
        const [subPages, scoreCard, seriesTeamData] = await Promise.allSettled(api)
        return {
          props: {
            seoData: idData?.getSeoData,
            seriesTeamData: seriesTeamData?.value?.data,
            seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
            type: currentPage,
            scoreCard: scoreCard?.value?.data?.listSeriesScorecard,
            subPages: subPages?.value?.data?.getSeosBySlug
          }
        }
      } else if (currentPage === 'fantasy-tips') {
        const { LIST_SERIES_FANTASY_TIPS } = (await import('@graphql/series/fantasy-tips.query'))
        api.push(
          graphql.default(LIST_SERIES_FANTASY_TIPS, { input: { iSeriesId: idData?.getSeoData?.iId, nOrder: -1, sSortBy: 'dStartDate' } })
        )
        const [subPages, scoreCard, seriesFantasyTipsData] = await Promise.allSettled(api)
        return {
          props: {
            seoData: idData?.getSeoData,
            seriesFantasyTipsData: seriesFantasyTipsData?.value?.data,
            seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
            type: currentPage,
            scoreCard: scoreCard?.value?.data?.listSeriesScorecard,
            subPages: subPages?.value?.data?.getSeosBySlug
          }
        }
      } else if (currentPage === 'squads') {
        const { LIST_SERIES_TEAMS } = (await import('@graphql/series/teams.query'))

        api.push(graphql.default(LIST_SERIES_TEAMS, { input: { iSeriesId: idData?.getSeoData?.iId } }))
        const [subPages, scoreCard, seriesTeamData] = await Promise.allSettled(api)

        if (seriesTeamData?.value?.data?.listSeriesTeams?.aTeams?.length) {
          const { GET_TEAM_PLAYER } = (await import('@graphql/series/squads.query'))
          const iTeamId = query?.teamId || seriesTeamData?.value?.data?.listSeriesTeams?.aTeams[0]?._id
          const { data: teamPlayer } = await graphql.default(GET_TEAM_PLAYER, { input: { iSeriesId: idData?.getSeoData?.iId, iTeamId } })
          return {
            props: {
              seoData: idData?.getSeoData,
              seriesTeamData: seriesTeamData?.value?.data,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              teamPlayer: teamPlayer?.listSeriesSquad,
              type: currentPage,
              scoreCard: scoreCard?.value?.data?.listSeriesScorecard,
              subPages: subPages?.value?.data?.getSeosBySlug
            }
          }
        } else {
          return {
            props: {
              seoData: idData?.getSeoData,
              seriesTeamData: seriesTeamData?.value?.data,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              type: currentPage,
              scoreCard: scoreCard?.value?.data?.listSeriesScorecard,
              subPages: subPages?.value?.data?.getSeosBySlug,
              teamPlayer: []
            }
          }
        }
      } else {
        const { FIXTURES_LIST, FETCH_TEAM_VENUE } = (await import('@graphql/series/fixtures.query'))
        api.push(
          graphql.default(FIXTURES_LIST, { input: { iSeriesId: idData?.getSeoData?.iId, nOrder: 1, sSortBy: 'dStartDate', iTeamId: query?.iTeamId || null, iVenueId: query?.iVenueId || null } }),
          graphql.default(FETCH_TEAM_VENUE, { input: { iSeriesId: idData?.getSeoData?.iId } })
        )
        const [subPages, scoreCard, fixturesData, teamData] = await Promise.allSettled(api)
        return {
          props: {
            seoData: idData?.getSeoData,
            fixturesData: fixturesData?.value?.data,
            seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
            fixturesFilter: teamData?.value?.data,
            scoreCard: scoreCard?.value?.data?.listSeriesScorecard,
            subPages: subPages?.value?.data?.getSeosBySlug
          }
        }
      }
    }
    return { notFound: true }
  } catch (e) {
    // console.log('cricket series:', e)
    res.setHeader('Cache-Control', 'no-cache')
    // return { props: { error: JSON.stringify(e) } }
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
