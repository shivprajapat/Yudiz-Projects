import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { pageLoading } from '@shared/libs/allLoader'
import Error from '@shared/components/error'

const FixtureContent = dynamic(() => import('@shared-components/fixtureContent'), { loading: () => pageLoading() })
const CricketSeriesContent = dynamic(() => import('@shared-components/cricketSeriesContent'), { loading: () => pageLoading() })

function CricketSeries({ data, seoData }) {
  return (
    <>
      <FixtureContent
        type="currentSeries"
        seoData={{
          ...seoData,
          sTitle: 'Cricket Series: Schedule, Fixtures - Upcoming International, domestic and T20 Series, India',
          sDescription: 'Check the Cricket series schedule for all future T20, ODI, and domestic matches along with date, match timings, ground details, and more on CricTracker'
        }}
      >
        <CricketSeriesContent data={data} />
      </FixtureContent>
    </>
  )
}

CricketSeries.propTypes = {
  data: PropTypes.object,
  seoData: PropTypes.object
}

export default Error(CricketSeries)

export async function getServerSideProps({ res, resolvedUrl, query }) {
  const [graphql, articleQuery, utils, fixtureQuery] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@graphql/fixtures/fixtures.query')
  ])

  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const url = resolvedUrl?.split('?')[0]

    const [seo, fixture] = await Promise.all([
      graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: url.replaceAll('/', '') || '' } }),
      graphql.default(fixtureQuery.CURRENT_FUTURE_SERIES, { input: { eCategory: 'i' } })
    ])

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seo?.data?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    return {
      props: {
        data: fixture?.data,
        seoData: seo?.data?.getSeoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
