import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import queryGraphql from '@shared-components/queryGraphql'
import { CURRENT_MATCHES } from '@graphql/fixtures/fixtures.query'
import { pageLoading } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { checkRedirectionStatus, getTimeZone, handleApiError } from '@shared/utils'

const FixtureContent = dynamic(() => import('@shared-components/fixtureContent'), { loading: () => pageLoading() })
const CurrentMatches = dynamic(() => import('@shared/components/current-matches'))

function AllFixtures({ data, seoData }) {
  return (
    <FixtureContent type="currentMatches" seoData={seoData}>
      <CurrentMatches data={data} status={'r'} />
    </FixtureContent>
  )
}

AllFixtures.propTypes = {
  data: PropTypes.object,
  seoData: PropTypes.object
}

export default Error(AllFixtures)

export async function getServerSideProps({ res, resolvedUrl }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=5')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.slice(1, -1) } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj
    const { data } = await queryGraphql(CURRENT_MATCHES, { input: { eCategory: 'i', eStatus: 'r', sTimezone: getTimeZone() } })
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
