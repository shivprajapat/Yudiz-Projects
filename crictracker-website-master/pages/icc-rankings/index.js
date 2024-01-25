import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import Layout from '@shared/components/layout'
const IccRankingContent = dynamic(() => import('@shared/components/icc-ranking-components/iccRankingContent'))

function ICCRankings({ rankingOverviewData, seoData }) {
  return (
    <Layout
      data={{
        oSeo: seoData
      }}
    >
      <IccRankingContent type="M" rankingOverviewData={rankingOverviewData} />
    </Layout>
  )
}

ICCRankings.propTypes = {
  rankingOverviewData: PropTypes.array,
  seoData: PropTypes.object
}

export default ICCRankings

export async function getServerSideProps({ res, resolvedUrl, query, req }) {
  const [graphql, articleQuery, utils, routes, rankingQuery] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@shared/constants/allRoutes'),
    import('@graphql/globalwidget/rankings.query')
  ])

  try {
    res.setHeader('Cache-Control', 'public, max-age=420')

    const [seoData, overViewData] = await Promise.allSettled([
      graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: routes.allRoutes.iccRankings?.slice(1, -1) } }),
      graphql.default(rankingQuery.RANKINGS_OVERVIEW, { input: { eGender: 'M' } })
    ])

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.value?.data?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    return {
      props: {
        rankingOverviewData: overViewData?.value?.data?.getRankingsOverview,
        seoData: seoData?.value?.data?.getSeoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
