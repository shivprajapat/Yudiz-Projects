import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useAmp } from 'next/amp'

import Error from '@shared/components/error'
import { pageLoading } from '@shared/libs/allLoader'

const FantasyTipsList = dynamic(() => import('@shared/components/fantasyTips/fantasyTipsList'), { loading: () => pageLoading() })
const SeriesHomeAMP = dynamic(() => import('@shared/components/amp/seriesHomeAMP'), { loading: () => pageLoading() })
const CategoryContentAMP = dynamic(() => import('@shared/components/amp/categoryContentAMP'), { loading: () => pageLoading() })
export const config = { amp: 'hybrid' }
function FantasyTips({ fantasyTipsList, seoData, articles, category, sideBarData, filteredFantasyCricketTips }) {
  const isAmp = useAmp()

  if (isAmp) {
    return (
      <CategoryContentAMP seoData={seoData} category={{ ...category, oSeo: seoData }}>
        <SeriesHomeAMP data={articles} />
      </CategoryContentAMP>
    )
  } else {
    return (
      <FantasyTipsList
        sideBarData={sideBarData}
        data={fantasyTipsList}
        filteredFantasyCricketTips={filteredFantasyCricketTips}
        seoData={seoData}
        category={{ ...category, oSeo: seoData }}
      />
    )
  }
}

FantasyTips.propTypes = {
  fantasyTipsList: PropTypes.array,
  filteredFantasyCricketTips: PropTypes.array,
  seoData: PropTypes.object,
  articles: PropTypes.object,
  category: PropTypes.object,
  sideBarData: PropTypes.object
}

export default Error(FantasyTips)

export async function getServerSideProps({ req, res, query, resolvedUrl }) {
  const [graphql, articleQuery, utils, categoryQuery, homeQuery, fantasyQuery, widgetQuery] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@graphql/category/category.query'),
    import('@graphql/home/home.query'),
    import('@graphql/fantasy-tips/fantasy-tips.query'),
    import('@graphql/globalwidget/rankings.query')
  ])
  try {
    // Check amp exists in query params
    const { hasAmp, redirectionRules } = utils.hasAmpInQueryParams(req?.url)
    if (hasAmp) return redirectionRules

    if (query?.amp && Object.keys(query).length >= 2) {
      // If it's amp and have more than one params then remove param and redirect amp (For canonical)
      return { redirect: { permanent: true, destination: '/fantasy-cricket-tips/?amp=1' } }
    }

    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: seoData } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: 'fantasy-cricket-tips' } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const api = [graphql.default(categoryQuery.GET_CATEGORY_BY_ID, { input: { _id: seoData?.getSeoData?.iId } })]

    if (query?.amp) {
      api.push(graphql.default(homeQuery.HOME_FANTASY_ARTICLE, { input: { nLimit: 22, nSkip: 1 } }))
      const [category, fantasyData] = await Promise.allSettled(api)

      return {
        props: {
          seoData: seoData?.getSeoData,
          articles: { fantasyArticle: fantasyData.value?.data?.listFrontFantasyArticle },
          category: category?.value?.data?.getCategoryByIdFront
        }
      }
    } else {
      api.push(
        graphql.default(fantasyQuery.FANTASY_TIPS_LIST, { input: { dDay: query?.dDay || utils.currentDateMonth(), sSortBy: 'dStartDate', nOrder: 1, sTimezone: utils.getTimeZone(), nLimit: 50, nSkip: 1 } }),
        graphql.default(widgetQuery.CURRENT_SERIES_LIST),
        graphql.default(widgetQuery.RANKINGS, { input: { eMatchType: 'Tests', eRankType: 'Teams', nLimit: 5, nSkip: 0 } })
      )
      const [category, fantasyList, currentSeries, ranking] = await Promise.allSettled(api)

      const { eFormat, sSeries, sTeam } = query
      let filteredFantasyCricketTips = []

      if (eFormat || sSeries || sTeam) {
        const { filterFantasyTips } = (await import('@shared/libs/fantasyTipsFilter'))
        filteredFantasyCricketTips = filterFantasyTips(fantasyList?.value?.data?.listMatchFantasyTipsFront?.aResults, eFormat, sTeam, sSeries)
      }

      return {
        props: {
          filteredFantasyCricketTips: filteredFantasyCricketTips,
          fantasyTipsList: fantasyList?.value?.data?.listMatchFantasyTipsFront?.aResults,
          seoData: seoData?.getSeoData,
          category: category?.value?.data?.getCategoryByIdFront,
          sideBarData: {
            currentSeries: currentSeries?.value?.data?.getCurrentPopularSeries,
            ranking: ranking?.value?.data?.getRankings
          }
        }
      }
    }
  } catch (e) {
    console.log(e)
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
