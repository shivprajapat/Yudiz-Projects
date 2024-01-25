import React from 'react'
import PropTypes from 'prop-types'
import { useAmp } from 'next/amp'
import { useRouter } from 'next/router'

import { getHeaderSidebarMenu } from '@shared/libs/menu'
import { makeBreadcrumbSchema, makeLiveBlogSchema, makeMatchDetailArticleSchema, makeMatchDetailSchema, makeOrganizationSchema, makeSchema, makeSeriesSchema, makeSiteNavigationSchema, makeWebSiteSchema } from '@shared/libs/schems'

function AllSchema({ data, matchDetail, scoreCard = [] }) {
  const isAmp = useAmp()
  const router = useRouter()
  const [url] = router?.asPath?.split('?')
  const nav = url?.split('/')?.filter((x) => x)
  const sliderData = getHeaderSidebarMenu()
  const scoreCardData = scoreCard?.filter((s) => (s.sStatusStr === 'scheduled' || s.sStatusStr === 'live') && s)

  function getMatchDetailSchema() {
    function getScript(seo) {
      return (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(makeMatchDetailSchema(seo, matchDetail))
        }} />
      )
    }
    if ((nav.includes('live-scores') && nav?.length === 2)) {
      return matchDetail ? getScript(data?.oSeo) : null
    } else if (nav?.includes('full-scorecard')) {
      return matchDetail ? getScript({ ...data?.oSeo, sSlug: `${data?.oSeo?.sSlug}/full-scorecard` }) : null
    } else return null
  }

  // const liveBlogSchema = {
  //   '@type': 'LiveBlogPosting',
  //   '@context': 'https://schema.org',
  //   headline: 'TNPL Auction 2023 Live Updates on Players Sold, Unsold, Purse Remaining & Full Squad Details - TNPL Auction LIVE Updates',
  //   datePublished: '2023-02-23T16:02:00+05:30',
  //   dateModified: '2023-02-23T16:02:00+05:30',
  //   coverageStartTime: '2023-02-23T16:02:00+05:30',
  //   coverageEndTime: '2023-02-24T23:59:00+05:30',
  //   url: 'https://www.crictracker.com/cricket-news/tnpl-auction-2023-live-updates-on-players-sold-unsold-purse-remaining-full-squad-details-tnpl-auction-live-updates',
  //   description: 'TNPL Auction 2023 Live: Get all the latest 2023 TNPL Auction live updates, Commentary of players sold, unsold, purse remaining &amp; Full squads of all Teams. Follow live minute-by-minute updates on CricTracker',
  //   author: [{ '@type': 'Person', name: 'Kshitij Kumar', sameAs: 'https://www.crictracker.com/author/kshitij/' }],
  //   publisher: { '@type': 'Organization', name: 'CricTracker', logo: { '@type': 'ImageObject', url: 'https://www.crictracker.com/images/logo.png', width: '200', height: '40' } },
  //   about: {
  //     '@type': 'Event',
  //     name: 'TNPL Auction 2023 Live Updates on Players Sold, Unsold, Purse Remaining & Full Squad Details - TNPL Auction LIVE Updates',
  //     startDate: '2023-02-23T16:02:00+05:30',
  //     endDate: '2023-02-24T23:59:00+05:30',
  //     eventAttendanceMode: 'mixed',
  //     eventStatus: 'Live',
  //     image: 'https://www.crictracker.com/images/logo.png',
  //     location: {
  //       address: 'India',
  //       name: 'India'
  //     }
  //   }
  // }

  return (
    <>
      {data?.oSeo?.eType === 'ar' && data?.iEventId && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(makeLiveBlogSchema(data, data.oLiveArticleEvent, data.oLiveArticleList)) }}
        />
      )}
      {(data?.oSeo?.eType === 'ma' && nav.includes('live-scores') && nav?.length === 2) && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(makeMatchDetailArticleSchema(data)) }}
          />
        </>
      )}
      {makeSchema(data, nav)?.['@context'] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(makeSchema(data, nav)) }}
        />
      )}
      {getMatchDetailSchema()}
      {scoreCardData?.length !== 0 && makeSeriesSchema(scoreCardData)?.map((j, i) => {
        return (
          <script
            key={`match${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }}
          />
        )
      })}

      {nav?.length !== 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(makeBreadcrumbSchema(nav, isAmp)) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(makeSiteNavigationSchema(sliderData, isAmp)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(makeWebSiteSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(makeOrganizationSchema()) }}
      />
    </>
  )
}
AllSchema.propTypes = {
  data: PropTypes.object,
  matchDetail: PropTypes.object,
  scoreCard: PropTypes.array
}
export default AllSchema
