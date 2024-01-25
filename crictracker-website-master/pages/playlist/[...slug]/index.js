import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import Layout from '@shared-components/layout'
import queryGraphql from '@shared/components/queryGraphql'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { GET_PLAYLISTS_VIDEO } from '@graphql/videos/videos.query'
import { pageLoading } from '@shared/libs/allLoader'
import { allRoutes } from '@shared/constants/allRoutes'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'
const VideoPlaylist = dynamic(() => import('@shared-components/video/videoPlaylist'), { loading: () => pageLoading() })

const Playlist = ({ idData, data, error }) => {
  const playlist = idData?.getSeoData
  const videos = data?.getVideos
  return (
    <Layout data={{ oSeo: playlist }}>
      <VideoPlaylist playlist={playlist} videos={videos} />
    </Layout>
  )
}

Playlist.propTypes = {
  data: PropTypes.object,
  error: PropTypes.object,
  idData: PropTypes.object
}

export async function getServerSideProps({ params, res, resolvedUrl, query }) {
  const slug = params.slug
  const mSlug = allRoutes.playlist + slug.join('/')
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: mSlug } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const { data } = await queryGraphql(GET_PLAYLISTS_VIDEO, {
      input: { iPlaylistId: seoData?.getSeoData?.iId, oGetVideosPaginationInput: { nLimit: 8, nSkip: 0 }, eStatus: 'a' }
    })
    return {
      props: {
        data,
        idData: seoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}

export default Playlist
