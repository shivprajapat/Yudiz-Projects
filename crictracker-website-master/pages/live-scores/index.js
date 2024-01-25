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

function Fixtures({ data, seoData }) {
  return (
    <FixtureContent
      type="currentMatches"
      seoData={{
        ...seoData,
        sTitle: 'Live Cricket Scores - Find Live Scores of all matches, teams and tournaments online | CricTracker',
        sDescription: 'Get All Matches Live Cricket Scores, full Scorecard Updates of all International and domestic cricket matches & related News only on CricTracker'
      }}
    >
      <CurrentMatches data={data} status={'l'} />
    </FixtureContent>
  )
}

Fixtures.propTypes = {
  data: PropTypes.object,
  seoData: PropTypes.object
}

export default Error(Fixtures)

export async function getServerSideProps({ res, resolvedUrl, query }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=120')

    const [seoData, matched] = await Promise.all([
      queryGraphql(GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '').split('?')[0] || '' } }),
      queryGraphql(CURRENT_MATCHES, { input: { eCategory: 'i', eStatus: 'l', sTimezone: getTimeZone(), nSkip: 1, nLimit: 10 } })
    ])
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.data?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    return {
      props: {
        data: matched?.data,
        seoData: seoData?.data?.getSeoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
