import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Col, Container, Row } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import queryGraphql from '@shared-components/queryGraphql'
import Layout from '@shared-components/layout'
import { GET_ARTICLE_ID } from '@graphql//article/article.query'
import { LIST_SERIES_TEAMS } from '@graphql/series/teams.query'
import { FIXTURES_LIST, FETCH_TEAM_VENUE } from '@graphql/series/fixtures.query'
import { GET_ROUNDS, GET_STANDING_DATA } from '@graphql/series/standings.query'
import { FETCH_SERIES_STATS_TYPE, STATS, MATCH_TYPES } from '@graphql/series/stats.query'
import { pageHeaderLoader, scoreCardSliderLoader } from '@shared/libs/allLoader'
import { seriesNav } from '@shared/constants/allNavBars'
import { allRoutes, cricketSeriesSlug } from '@shared/constants/allRoutes'
import { GET_SERIES_BY_ID } from '@graphql/cricket-series/cricket-series.query'
import { WIDGET } from '@shared/constants'
import { GET_TEAM_PLAYER } from '@graphql/series/squads.query'
import { checkPageNumberInSlug, checkRedirectionStatus, handleApiError } from '@shared/utils'
import { LIST_SERIES_FANTASY_TIPS } from '@graphql/series/fantasy-tips.query'
import { SERIES_MINI_SCORECARD } from '@graphql/home/home.query'

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

const SeriesPage = ({ seoData, fixturesData, fixturesFilter, roundData, standingData, type, seriesData, statsData, seriesTeamData, seriesArchivesData, error, seriesHeaderData, teamPlayer, matchTypeData, seriesFantasyTipsData, tabSeo, scoreCard }) => {
  const router = useRouter()
  const tab = () => {
    if (type === 'standings') {
      return <Standings round={roundData?.fetchSeriesRounds} id={seoData?.iId} standing={standingData?.fetchSeriesStandings} />
    } else if (type === 'stats') {
      return <Stats data={statsData} typeData={seriesData} id={seoData?.iId} matchTypeData={matchTypeData?.listSeriesStatsFormat} />
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

  return (
    <Layout data={{ oSeo: { ...seoData, ...tabSeo } }} scoreCard={scoreCard}>
      <main className="pb-3 pt-3">
        <ScorecardSlider data={scoreCard} seriesId={seriesHeaderData?._id} />
        <div className="common-section">
          <Container>
            <Row>
              <Col lg={9} className="left-content" >
                <PageHeader
                  name={seriesHeaderData?.sTitle}
                />
                <div className="mt-3">
                  <CommonNav items={seriesNav(seoData?.sSlug, router.asPath, seriesHeaderData?.nTotalTeams)} />
                </div>
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
  tabSeo: PropTypes.object,
  scoreCard: PropTypes.object
}

export default SeriesPage

export async function getServerSideProps({ res, params }) {
  const { slug: cSlug, lastSlug } = checkPageNumberInSlug(params.slug)
  const currentPage = cSlug[cSlug.length - 1]
  const url = cricketSeriesSlug.includes(currentPage) ? cSlug.slice(0, -1).join('/') : cSlug.join('/')

  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: allRoutes.cricketSeriesPages + url } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(idData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const { data: seriesHeaderData } = await queryGraphql(GET_SERIES_BY_ID, { input: { _id: idData?.getSeoData?.iId } })

    if (idData?.getSeoData?.eType === 'se') {
      const { data: scoreCard } = await queryGraphql(SERIES_MINI_SCORECARD, { input: { _id: idData?.getSeoData?.iId } })

      if (currentPage === 'standings') {
        if (seriesHeaderData?.getSeriesByIdFront?.nTotalTeams > 2) { // check team size is more than 2 or not
          // get tab seo
          // let tabSeo = null
          // if (!idData?.getSeoData?.eTabType) {
          //   try {
          //     const { data: pageSeo } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: `${allRoutes.cricketSeriesPages}${url}/${currentPage}` } })
          //     tabSeo = pageSeo?.getSeoData

          //     // Check tab Redirection
          //     const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(tabSeo)
          //     if (redirectStatus && props) {
          //       res.statusCode = eCode
          //       return { props }
          //     } else if (redirectStatus) return returnObj
          //   } catch (e) {
          //     console.error(e)
          //   }
          // }

          const { data: roundData } = await queryGraphql(GET_ROUNDS, { input: { iSeriesId: idData?.getSeoData?.iId } })
          const { data: standingData } = await queryGraphql(GET_STANDING_DATA, { input: { iRoundId: null, iSeriesId: idData?.getSeoData?.iId } })
          return {
            props: {
              seoData: idData?.getSeoData,
              roundData: roundData,
              standingData: standingData,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              type: currentPage,
              scoreCard: scoreCard?.listSeriesScorecard
              // tabSeo
            }
          }
        } else {
          return { notFound: true }
        }
      } else if (currentPage === 'stats') {
        const { data: seriesData } = await queryGraphql(FETCH_SERIES_STATS_TYPE, { input: { eGroupTitle: 'All' } })

        // get tab seo
        // let tabSeo = null
        // if (!idData?.getSeoData?.eTabType) {
        //   try {
        //     const { data: pageSeo } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: `${allRoutes.cricketSeriesPages}${url}/${currentPage}` } })
        //     tabSeo = pageSeo?.getSeoData
        //     // Check tab Redirection
        //     const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(tabSeo)
        //     if (redirectStatus && props) {
        //       res.statusCode = eCode
        //       return { props }
        //     } else if (redirectStatus) return returnObj
        //   } catch (e) {
        //     console.error(e)
        //   }
        // }

        // Get stats data base on selected filter
        let currentItemData
        if (lastSlug !== 'stats') {
          currentItemData = seriesData?.fetchSeriesStatsTypes.filter((i) => {
            const slugType = i.sSeoType || i.sType
            return slugType === lastSlug.split('-').join('_')
          })
        }

        if (seriesHeaderData?.getSeriesByIdFront?.sSeriesType === 'tour' || seriesHeaderData?.getSeriesByIdFront?.sSeriesType === 'series') {
          const { data: matchTypeData } = await queryGraphql(MATCH_TYPES, { input: { iSeriesId: idData?.getSeoData?.iId } })
          const { data: statsData } = await queryGraphql(STATS, { input: { iSeriesId: idData?.getSeoData?.iId, _id: lastSlug !== 'stats' ? currentItemData[0]._id : seriesData?.fetchSeriesStatsTypes[0]?._id, eFormat: matchTypeData?.listSeriesStatsFormat[0] } })
          return {
            props: {
              seoData: idData?.getSeoData,
              seriesData: seriesData,
              statsData: statsData,
              matchTypeData: matchTypeData,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              type: currentPage,
              scoreCard: scoreCard?.listSeriesScorecard
              // tabSeo
            }
          }
        } else {
          const { data: statsData } = await queryGraphql(STATS, { input: { iSeriesId: idData?.getSeoData?.iId, _id: lastSlug !== 'stats' ? currentItemData[0]._id : seriesData?.fetchSeriesStatsTypes[0]?._id } })
          return {
            props: {
              seoData: idData?.getSeoData,
              seriesData: seriesData,
              statsData: statsData,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              type: currentPage,
              scoreCard: scoreCard?.listSeriesScorecard
              // tabSeo
            }
          }
        }
      } else if (currentPage === 'teams') {
        if (seriesHeaderData?.getSeriesByIdFront?.nTotalTeams > 2) {
          // get tab seo
          // let tabSeo = null
          // if (!idData?.getSeoData?.eTabType) {
          //   try {
          //     const { data: pageSeo } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: `${allRoutes.cricketSeriesPages}${url}/${currentPage}` } })
          //     tabSeo = pageSeo?.getSeoData
          //     // Check tab Redirection
          //     const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(tabSeo)
          //     if (redirectStatus && props) {
          //       res.statusCode = eCode
          //       return { props }
          //     } else if (redirectStatus) return returnObj
          //   } catch (e) {
          //     console.error(e)
          //   }
          // }

          const { data: seriesTeamData } = await queryGraphql(LIST_SERIES_TEAMS, { input: { iSeriesId: idData?.getSeoData?.iId } })
          return {
            props: {
              seoData: idData?.getSeoData,
              seriesTeamData: seriesTeamData,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              type: currentPage,
              scoreCard: scoreCard?.listSeriesScorecard
            }
          }
        } else {
          return { notFound: true }
        }
      } else if (currentPage === 'fantasy-tips') {
        const { data: seriesFantasyTipsData } = await queryGraphql(LIST_SERIES_FANTASY_TIPS, { input: { iSeriesId: idData?.getSeoData?.iId, nOrder: -1, sSortBy: 'dStartDate' } })
        return {
          props: {
            seoData: idData?.getSeoData,
            seriesFantasyTipsData: seriesFantasyTipsData,
            seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
            type: currentPage,
            scoreCard: scoreCard?.listSeriesScorecard
          }
        }
      } else if (currentPage === 'squads') {
        const { data: seriesTeamData } = await queryGraphql(LIST_SERIES_TEAMS, { input: { iSeriesId: idData?.getSeoData?.iId } })
        // get tab seo
        // let tabSeo = null
        // if (!idData?.getSeoData?.eTabType) {
        //   try {
        //     const { data: pageSeo } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: `${allRoutes.cricketSeriesPages}${url}/${currentPage}` } })
        //     tabSeo = pageSeo?.getSeoData
        //     // Check tab Redirection
        //     const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(tabSeo)
        //     if (redirectStatus && props) {
        //       res.statusCode = eCode
        //       return { props }
        //     } else if (redirectStatus) return returnObj
        //   } catch (e) {
        //     console.error(e)
        //   }
        // }

        if (seriesTeamData?.listSeriesTeams?.aTeams?.length) {
          const iTeamId = seriesTeamData?.listSeriesTeams?.aTeams[0]?._id
          const { data: teamPlayer } = await queryGraphql(GET_TEAM_PLAYER, { input: { iSeriesId: idData?.getSeoData?.iId, iTeamId } })
          return {
            props: {
              seoData: idData?.getSeoData,
              seriesTeamData: seriesTeamData,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              teamPlayer: teamPlayer?.listSeriesSquad,
              type: currentPage,
              scoreCard: scoreCard?.listSeriesScorecard
              // tabSeo
            }
          }
        } else {
          return {
            props: {
              seoData: idData?.getSeoData,
              seriesTeamData: seriesTeamData,
              seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
              type: currentPage,
              scoreCard: scoreCard?.listSeriesScorecard
              // tabSeo
            }
          }
        }
      } else {
        const { data: fixturesData } = await queryGraphql(FIXTURES_LIST, { input: { iSeriesId: idData?.getSeoData?.iId, nOrder: 1, sSortBy: 'dStartDate' } })
        const { data: teamData } = await queryGraphql(FETCH_TEAM_VENUE, { input: { iSeriesId: idData?.getSeoData?.iId } })
        return {
          props: {
            seoData: idData?.getSeoData,
            fixturesData: fixturesData,
            seriesHeaderData: seriesHeaderData?.getSeriesByIdFront,
            fixturesFilter: teamData,
            scoreCard: scoreCard?.listSeriesScorecard
          }
        }
      }
    }
    return { notFound: true }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    // return { props: { error: JSON.stringify(e) } }
    const status = handleApiError(e)
    return status
  }
}
