import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { pageLoading } from '@shared/libs/allLoader'
import Error from '@shared/components/error'

const FixtureContent = dynamic(() => import('@shared-components/fixtureContent'), { loading: () => pageLoading() })
const ArchiveContent = dynamic(() => import('@shared-components/archiveContent'), { loading: () => pageLoading() })

const CricketSeriesArchive = ({ data, year, seoData }) => {
  return (
    <>
      <FixtureContent
        type="seriesArchive"
        seoData={{
          ...seoData,
          sTitle: 'Cricket Series Archives | Check Old Series Results, Scorecards & Stats',
          sDescription: 'Check out the all the international, domestic, T20s old cricket series scores, results, stats of ODI, T20s, & Tests on CricTracker'
        }}
      >
        <ArchiveContent data={data} year={year} />
      </FixtureContent>
    </>
  )
}

CricketSeriesArchive.propTypes = {
  data: PropTypes.object,
  year: PropTypes.object,
  seoData: PropTypes.object
}

export default Error(CricketSeriesArchive)

export async function getServerSideProps({ res, resolvedUrl, query }) {
  const [graphql, articleQuery, utils, seriesQuery] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@graphql/fixtures/fixtures.query')
  ])

  try {
    res.setHeader('Cache-Control', 'public, max-age=420')

    const { data: seoData } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '').split('?')[0] || '' } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const currentYear = new Date().getFullYear()

    const [seriesList, year] = await Promise.allSettled([
      graphql.default(seriesQuery.SERIES_ARCHIVE, { input: { eCategory: 'i', dYear: currentYear.toString(), sTimezone: utils.getTimeZone(), nLimit: 20, nSkip: 1 } }),
      graphql.default(seriesQuery.SERIES_YEAR)
    ])

    return {
      props: {
        data: seriesList?.value?.data,
        year: year?.value?.data,
        seoData: seoData?.getSeoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
