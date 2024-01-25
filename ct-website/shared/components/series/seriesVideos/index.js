import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Row, Col } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import { payload } from '../../../libs/category'
import { isBottomReached } from '@utils'
import { articleLoader } from '@shared/libs/allLoader'
import { GET_CATEGORY_NEWS_VIDEOS, GET_SERIES_NEWS_VIDEOS } from '@graphql/series/home.query'

const ArticleSkeleton = dynamic(() => import('@shared/components/skeleton/components/articleSkeleton'), { ssr: false })
const NoData = dynamic(() => import('@noData'), { ssr: false })
const ArticleBig = dynamic(() => import('@shared-components/article/articleBig'), { loading: () => articleLoader(['g']) })
const ArticleGrid = dynamic(() => import('@shared-components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const SeriesVideos = ({ data, category, isClientOnly }) => {
  const [videosData, setVideosData] = useState(data?.aResults || [])
  const loading = useRef(false)
  const payloadVideos = useRef({ ...payload(6), eType: 'v' })

  const [getSeriesVideo, { data: seriesVideo, loading: seriesVideoLoading }] = useLazyQuery(GET_SERIES_NEWS_VIDEOS)
  const [getCategoryVideos, { data: simpleVideo, loading: simpleVideoLoading }] = useLazyQuery(GET_CATEGORY_NEWS_VIDEOS)

  const latestVideo = useRef(seriesVideo?.listSeriesArticlesVideosFront?.oVideos?.aResults?.length ||
    simpleVideo?.listSimpleCategoryArticlesVideosFront?.oVideos?.aResults?.length ||
    data?.aResults?.length)

  useEffect(() => {
    loading.current = false
    isBottomReached(videosData[videosData.length - 1]?._id, isReached)
  }, [videosData])

  useEffect(() => {
    const value = seriesVideo?.listSeriesArticlesVideosFront || simpleVideo?.listSimpleCategoryArticlesVideosFront
    if (value) {
      setVideosData([...videosData, ...value?.oVideos?.aResults])
      latestVideo.current = seriesVideo?.listSeriesArticlesVideosFront?.oVideos?.aResults?.length || simpleVideo?.listSimpleCategoryArticlesVideosFront?.oVideos?.aResults?.length
    }
  }, [seriesVideo, simpleVideo])

  useEffect(() => {
    if (isClientOnly) {
      if (category?.eType === 's') {
        getCategoryVideos({ variables: { input: { iCategoryId: category?._id, ...payloadVideos.current } } })
      }
    }
  }, [isClientOnly])

  async function isReached(reach) {
    if (reach && !loading.current && latestVideo.current === 6) {
      loading.current = true
      setPayload()
      getMoreData()
    }
  }

  async function getMoreData() {
    if (category?.eType === 'as') {
      // Series category
      const { data } = await getSeriesVideo({ variables: { input: { iSeriesId: category?.iSeriesId, ...payloadVideos.current } } })
      return data?.listSeriesArticlesVideosFront
    } else {
      // simple category
      const { data } = await getCategoryVideos({ variables: { input: { iCategoryId: category?._id, ...payloadVideos.current } } })
      return data?.listSimpleCategoryArticlesVideosFront
    }
  }

  function setPayload() {
    payloadVideos.current = { ...payloadVideos.current, nSkip: payloadVideos.current.nSkip + 1 }
  }
  return (
    <>
      {videosData?.length > 0 && (
        <div className={styles.seriesVideo}>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:Videos" />
          </h4>
          <Row>
            <Col>
              <ArticleBig data={videosData[0]} isVideo={true} />
            </Col>
            <Col lg={4}>
              {videosData[1] && <ArticleGrid data={videosData[1]} isVideo={true} />}
              {videosData[2] && <ArticleGrid data={videosData[2]} isVideo={true} />}
            </Col>
          </Row>
          <Row className="equal-height-article">
            {videosData?.map((video, i) => {
              if (i > 2) {
                return (
                  <React.Fragment key={video?._id}>
                    {i === 9 && (
                      <Col xs={12}>
                        <Ads
                          id="div-ad-gpt-139789-1646-Desktop_SP_MID2_728"
                          adIdDesktop="Crictracker2022_Desktop_SP_MID2_728x90"
                          adIdMobile="Crictracker2022_Mobile_SP_MID2_300x250"
                          dimensionDesktop={[728, 90]}
                          dimensionMobile={[300, 250]}
                          mobile
                          className="mb-2 text-center"
                        />
                      </Col>
                    )}
                    {i === 18 && (
                      <Col xs={12}>
                        <Ads
                          id="div-ad-gpt-138639789-1646635925-022_Desktop_SP_MID3_72"
                          adIdDesktop="Crictracker2022_Desktop_SP_MID3_728x90"
                          adIdMobile="Crictracker2022_Mobile_SP_MID3_300x250"
                          dimensionDesktop={[728, 90]}
                          dimensionMobile={[300, 250]}
                          mobile
                          className="mb-2 text-center"
                        />
                      </Col>
                    )}
                    <Col md={4} sm={6} id={video?._id}>
                      <ArticleGrid data={video} isVideo={true} />
                    </Col>
                  </React.Fragment>
                )
              } else return null
            })}
            {(seriesVideoLoading || simpleVideoLoading) && (
              <>
                <Col md={4} sm={6}>
                  <ArticleSkeleton type={'g'} />
                </Col>
                <Col md={4} sm={6}>
                  <ArticleSkeleton type={'g'} />
                </Col>
                <Col md={4} sm={6}>
                  <ArticleSkeleton type={'g'} />
                </Col>
              </>
            )}
          </Row>
        </div>
      )}
      {videosData?.length === 0 && <NoData />}
    </>
  )
}

SeriesVideos.propTypes = {
  data: PropTypes.object,
  category: PropTypes.object,
  isClientOnly: PropTypes.bool
}

export default SeriesVideos
