import React from 'react'
import PropTypes from 'prop-types'
import { useAmp } from 'next/amp'
import { useRouter } from 'next/router'

import { getHeaderSidebarMenu } from '@shared/libs/menu'
import { makeBreadcrumbSchema, makeMatchDetailSchema, makeOrganizationSchema, makeSchema, makeSeriesSchema, makeSiteNavigationSchema, makeWebSiteSchema } from '@shared/libs/schems'

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
  return (
    <>
      {makeSchema(data, nav)?.['@context'] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(makeSchema(data, nav)) }}
        />
      )}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(makeOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(makeWebSiteSchema()) }}
      />
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
    </>
  )
}
AllSchema.propTypes = {
  data: PropTypes.object,
  matchDetail: PropTypes.object,
  scoreCard: PropTypes.array
}
export default AllSchema
