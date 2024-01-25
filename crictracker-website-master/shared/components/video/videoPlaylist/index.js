import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'

import videoStyles from '@assets/scss/pages/video.module.scss'
import Layout from '@shared/components/layout'
import ArticleGrid from '@shared-components/article/articleGrid'
import PageHeader from '@shared-components/pageHeader'
import { payload } from '../../../libs/category'
import { isBottomReached } from '@utils'
import { GET_PLAYLISTS_VIDEO } from '@graphql/videos/videos.query'

const VideoPlaylist = ({ playlist, videos }) => {
  const videoList = videos?.aResults
  const nTotal = videos?.nTotal
  const [videosData, setVideosData] = useState(videoList)
  const loading = useRef(false)
  const payloadVideos = useRef({ ...payload(8) })
  const total = useRef(nTotal)

  const [getPlaylistVideo, { data: categoryVideo }] = useLazyQuery(GET_PLAYLISTS_VIDEO)

  useEffect(() => {
    loading.current = false
    isBottomReached(videosData[videosData?.length - 1]?._id, isReached)
  }, [videosData])

  useEffect(() => {
    const value = categoryVideo?.getVideos
    if (value) {
      total.current = value?.oVideos?.nTotal
      setVideosData([...videosData, ...value?.aResults])
    }
  }, [categoryVideo])

  async function isReached(reach) {
    if (reach && !loading.current && videosData?.length < total.current) {
      loading.current = true
      setPayload()
      getMoreData()
    }
  }

  async function getMoreData() {
    const { data } = await getPlaylistVideo({ variables: { input: { iPlaylistId: playlist?.iId, oGetVideosPaginationInput: { ...payloadVideos.current }, eStatus: 'a' } } })
    return data?.getVideos?.aResults
  }

  function setPayload() {
    payloadVideos.current = { ...payloadVideos.current, nSkip: payloadVideos.current.nSkip + 1 }
  }

  return (
    <Layout>
      <main className="pt-3">
        <Container>
          <PageHeader
            name={playlist?.sTitle}
          />
          <Row className={videoStyles.videoList}>
            {
              videosData?.map((video) => {
                return (
                  <Col key={video?._id} lg={3} md={4} sm={6} id={video?._id}>
                    <ArticleGrid isVideo={true} data={video} />
                  </Col>
                )
              })
            }
          </Row>
        </Container>
      </main>
    </Layout>
  )
}

VideoPlaylist.propTypes = {
  videos: PropTypes.object,
  playlist: PropTypes.object
}

export default VideoPlaylist
