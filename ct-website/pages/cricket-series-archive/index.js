import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import queryGraphql from '@shared-components/queryGraphql'
import { SERIES_ARCHIVE, SERIES_YEAR } from '@graphql/fixtures/fixtures.query'
import { pageLoading } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { checkRedirectionStatus, getTimeZone, handleApiError } from '@shared/utils'

const FixtureContent = dynamic(() => import('@shared-components/fixtureContent'), { loading: () => pageLoading() })
const ArchiveContent = dynamic(() => import('@shared-components/archiveContent'), { loading: () => pageLoading() })

const CricketSeriesArchive = ({ data, year, seoData }) => {
  const { t } = useTranslation('common')
  return (
    <>
      <FixtureContent
        type="seriesArchive"
        seoData={{
          ...seoData,
          sTitle: t('CricketSeriesArchive.Title'),
          sDescription: t('CricketSeriesArchive.Description')
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

export async function getServerSideProps({ res, resolvedUrl }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '').split('?')[0] || '' } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj
    const currentYear = new Date().getFullYear()
    const { data } = await queryGraphql(SERIES_ARCHIVE, { input: { eCategory: 'i', dYear: currentYear.toString(), sTimezone: getTimeZone(), nLimit: 20, nSkip: 1 } })
    const { data: year } = await queryGraphql(SERIES_YEAR)
    return {
      props: {
        data,
        year,
        seoData: seoData?.getSeoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}
