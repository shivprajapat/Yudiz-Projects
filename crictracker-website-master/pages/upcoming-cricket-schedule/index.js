import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import queryGraphql from '@shared-components/queryGraphql'
import { CURRENT_MATCHES } from '@graphql/fixtures/fixtures.query'
import { checkRedirectionStatus, currentMonthYear, getTimeZone, handleApiError } from '@shared/utils'
import { pageLoading } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'

const FixtureContent = dynamic(() => import('@shared-components/fixtureContent'), { loading: () => pageLoading() })
const ScheduleContent = dynamic(() => import('@shared-components/scheduleContent'), { loading: () => pageLoading() })

function CricketSchedule({ data, seoData }) {
  return (
    <FixtureContent type='scheduleByMonth' seoData={seoData}>
      <ScheduleContent data={data} />
    </FixtureContent>
  )
}

CricketSchedule.propTypes = {
  data: PropTypes.object,
  seoData: PropTypes.object
}

export default Error(CricketSchedule)

export async function getServerSideProps({ res, resolvedUrl, query }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=120')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '').split('?')[0] || '' } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj
    const { data } = await queryGraphql(CURRENT_MATCHES, { input: { eCategory: 'i', dByMonth: currentMonthYear(), sTimezone: getTimeZone(), nLimit: 10, nSkip: 1 } })
    return {
      props: {
        data,
        seoData: seoData?.getSeoData
      }
    }
  } catch (e) {
    // console.log({ e })
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
