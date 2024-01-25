import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import Layout from '@shared-components/layout'
import { pageLoading } from '@shared/libs/allLoader'

const VideoDetails = dynamic(() => import('@shared/components/video/videoDetails'), { loading: () => pageLoading() })

const CricketVideos = ({ video, data, seoData }) => {
  const videoList = data?.listCategoryRelatedVideos?.aResults
  const videoData = video?.getSingleVideo

  return (
    <Layout data={{ oSeo: seoData }}>
      <VideoDetails videoData={videoData} videoList={videoList} />
    </Layout>
  )
}

CricketVideos.propTypes = {
  data: PropTypes.object,
  video: PropTypes.object,
  seoData: PropTypes.object
}

export async function getServerSideProps({ res, params, resolvedUrl, query }) {
  const [graphql, articleQuery, utils, videoQuery, routes] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@graphql/series/videos.query'),
    import('@shared/constants/allRoutes')
  ])

  const slug = params.slug
  const mSlug = routes.allRoutes.cricketVideos + slug.join('/')
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')

    const { data: seoData } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: mSlug } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const [related, video] = await Promise.allSettled([
      graphql.default(videoQuery.CATEGORY_RELATED_VIDEO, {
        input: { _id: seoData?.getSeoData?.iId, oGetVideosPaginationInput: { nLimit: 10, nSkip: 0 } }
      }),
      graphql.default(videoQuery.GET_SINGLE_VIDEO, { input: { _id: seoData?.getSeoData?.iId } })
    ])

    return {
      props: {
        data: related?.value?.data,
        video: video?.value?.data,
        seoData: seoData?.getSeoData
      }
    }
  } catch (e) {
    console.log({ videos: e })
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}

export default CricketVideos
