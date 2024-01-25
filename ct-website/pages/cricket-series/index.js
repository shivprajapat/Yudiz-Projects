import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import queryGraphql from '@shared-components/queryGraphql'
import { CURRENT_FUTURE_SERIES } from '@graphql/fixtures/fixtures.query'
import { pageLoading } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'

const FixtureContent = dynamic(() => import('@shared-components/fixtureContent'), { loading: () => pageLoading() })
const CricketSeriesContent = dynamic(() => import('@shared-components/cricketSeriesContent'), { loading: () => pageLoading() })

function CricketSeries({ data, seoData }) {
  const { t } = useTranslation('common')
  return (
    <>
      <FixtureContent
        type="currentSeries"
        seoData={{
          ...seoData,
          sTitle: t('CricketSeries.Title'),
          sDescription: t('CricketSeries.Description')
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
    const { data } = await queryGraphql(CURRENT_FUTURE_SERIES, { input: { eCategory: 'i' } })
    return {
      props: {
        data,
        seoData: seoData?.getSeoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}
