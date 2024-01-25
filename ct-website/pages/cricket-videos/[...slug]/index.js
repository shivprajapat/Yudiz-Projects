import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import Layout from '@shared-components/layout'
import queryGraphql from '@shared/components/queryGraphql'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { GET_SINGLE_VIDEO, CATEGORY_RELATED_VIDEO } from '@graphql/series/videos.query'
import { pageLoading } from '@shared/libs/allLoader'
import { allRoutes } from '@shared/constants/allRoutes'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'
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

export async function getServerSideProps({ res, params }) {
  const slug = params.slug
  const mSlug = allRoutes.cricketVideos + slug.join('/')
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: mSlug } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const { data } = await queryGraphql(CATEGORY_RELATED_VIDEO, {
      input: { _id: seoData?.getSeoData?.iId, oGetVideosPaginationInput: { nLimit: 10, nSkip: 0 } }
    })
    const { data: video } = await queryGraphql(GET_SINGLE_VIDEO, { input: { _id: seoData?.getSeoData?.iId } })
    return {
      props: {
        data,
        video,
        seoData: seoData?.getSeoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}

export default CricketVideos
