import React from 'react'
import PropTypes from 'prop-types'
import Error from '@shared/components/error'
import dynamic from 'next/dynamic'

import { pageLoading } from '@shared/libs/allLoader'

export const config = { amp: 'hybrid' }
const CategoryMain = dynamic(() => import('@shared/components/categoryMain'), { loading: () => pageLoading() })

function CricketPlayer({ seoData, category }) {
  if (seoData?.eType === 'ct') {
    return (
      <CategoryMain category={category} seoData={seoData} />
    )
  }
  return null
}

CricketPlayer.propTypes = {
  seoData: PropTypes.object,
  category: PropTypes.object
}

export default Error(CricketPlayer)

export async function getServerSideProps({ req, res, params, query, resolvedUrl }) {
  const [graphql, articleQuery, ENUM, utils, categoryAPI] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/enum'),
    import('@shared/utils'),
    import('@shared-libs/category')
  ])

  // Check amp exists in query params
  const { hasAmp, redirectionRules } = utils.hasAmpInQueryParams(req?.url)
  if (hasAmp) return redirectionRules

  try {
    const { data: seo } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: 'cricket-players' } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seo?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    if (seo?.getSeoData?.eType === 'ct') { // For Simple and series category
      const tabType = ENUM.ENUM_SEO_SUBTYPE[seo?.getSeoData?.eSubType]

      res.setHeader('Cache-Control', 'public, max-age=420')

      const value = await categoryAPI.getCategorySSRData(seo?.getSeoData, tabType, query?.amp, query)
      if (value?.notFound) return value

      return {
        props: {
          seoData: seo?.getSeoData,
          category: value
        }
      }
    } else return { notFound: true }
  } catch (e) {
    // console.log({ slug: e })
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
