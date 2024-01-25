import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import Layout from '@shared/components/layout'

const ICCRankingsLayout = dynamic(() => import('@shared/components/icc-ranking-components/layout'))

function MensRanking({ rankingData, eMatchType, eRankType, seoData }) {
  return (
    <Layout
      data={{
        oSeo: seoData
      }}
    >
      <ICCRankingsLayout type='M' rankingData={rankingData} eMatchType={eMatchType} eRankType={eRankType} />
    </Layout>
  )
}
export default MensRanking

MensRanking.propTypes = {
  rankingData: PropTypes.array,
  eMatchType: PropTypes.string,
  eRankType: PropTypes.string,
  seoData: PropTypes.object
}

export async function getServerSideProps({ res, resolvedUrl, query }) {
  const [graphql, articleQuery, utils, routes, rankingQuery, rankingEnum] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@shared/constants/allRoutes'),
    import('@graphql/globalwidget/rankings.query'),
    import('@shared/enum/icc-ranking')
  ])

  try {
    res.setHeader('Cache-Control', 'public, max-age=420')

    const { eMatchType, eRankType } = rankingEnum.getRankingType(query?.type)
    const [seoData, rankings] = await Promise.allSettled([
      graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: `${routes.allRoutes?.iccRankings?.slice(1)}${query?.type}` } }),
      graphql.default(rankingQuery.RANKINGS, { input: { eMatchType, eRankType, nLimit: 10, nSkip: 0, eGender: 'M' } })
    ])

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.value?.data?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    return {
      props: {
        rankingData: rankings?.value?.data?.getRankings?.aResults,
        eMatchType,
        eRankType,
        seoData: seoData?.value?.data?.getSeoData
      }
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
