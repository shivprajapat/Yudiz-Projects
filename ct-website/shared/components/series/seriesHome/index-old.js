import React, { useState, useEffect, useRef } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import { payload } from '../../../libs/category'
import { isBottomReached } from '@utils'
import { articleLoader } from '@shared/libs/allLoader'
import { GET_CATEGORY_NEWS_VIDEOS, GET_SERIES_NEWS_VIDEOS } from '@graphql/series/home.query'
import useOnScreen from '@shared/hooks/useOnScreen'

const TopPlayerRankings = dynamic(() => import('@shared-components/topPlayerRankings'))
const ArticleSmall = dynamic(() => import('@shared-components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared-components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const NoData = dynamic(() => import('@noData'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const SeriesHome = ({ data: { oArticles, oVideos }, playerData, category }) => {
  const { inView, observe } = useOnScreen()
  const [mixData, setMixData] = useState([...oArticles?.aResults, ...oVideos?.aResults])
  const payloadNews = useRef({ ...payload(7), eType: 'vn' })
  const total = useRef(oArticles?.nTotal + oVideos?.nTotal)
  const loading = useRef(false)
  const [isLoading, setIsLoading] = useState(false)

  const [getSeriesData, { data: seriesData }] = useLazyQuery(GET_SERIES_NEWS_VIDEOS)
  const [getCategoryData, { data: categoryData }] = useLazyQuery(GET_CATEGORY_NEWS_VIDEOS)

  useEffect(() => {
    loading.current = false
    setIsLoading(false)
    isBottomReached(mixData[mixData.length - 1]?._id, isReached)
  }, [mixData])

  useEffect(() => {
    const value = seriesData?.listSeriesArticlesVideosFront || categoryData?.listSimpleCategoryArticlesVideosFront
    if (value) {
      setMixData([...mixData, ...value.oArticles?.aResults, ...value.oVideos?.aResults])
    }
  }, [seriesData, categoryData])

  useEffect(() => {
    if (oArticles && oVideos) {
      setMixData([...oArticles?.aResults, ...oVideos?.aResults])
      total.current = oArticles?.nTotal + oVideos?.nTotal
    }
  }, [oArticles, oVideos])

  async function isReached(reach) {
    if (reach && !loading.current && mixData?.length < total.current) {
      loading.current = true
      setIsLoading(true)
      setPayload()
      getMoreData()
    }
  }
  async function getMoreData(type) {
    if (category?.eType === 'as') {
      const { data } = await getSeriesData({ variables: { input: { iSeriesId: category?.iSeriesId, ...payloadNews.current } } })
      return data?.listSeriesArticlesVideosFront
    } else {
      const { data } = await getCategoryData({ variables: { input: { iCategoryId: category?._id, ...payloadNews.current } } })
      return data?.listSimpleCategoryArticlesVideosFront
    }
  }

  function setPayload(type) {
    payloadNews.current.nSkip += 1
  }

  return (
    <>
      {mixData.length !== 0 && (
        <div className={styles.seriesHome}>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:latestArticle" />
          </h4>
          <section>
            <ArticleSmall isLarge={true} isVideo={mixData[0]?.__typename === 'oVideoData'} data={mixData[0]} />
            <Row>
              {mixData.slice(1)?.map((home, i) => {
                if (i < 6) {
                  return (
                    <Col lg={4} key={i + home?._id} sm={6} id={home?._id}>
                      <ArticleGrid data={home} isVideo={home?.__typename === 'oVideoData' && true} />
                    </Col>
                  )
                } else if (i >= 6 && i < 10) {
                  return (
                    <React.Fragment key={i + home?._id}>
                      {(i === 6 && playerData && playerData?.length !== 0) && (
                        <Col xs={12}>
                          <Ads
                            id="div-ad-gpt-138639789-1646635863-0"
                            adIdDesktop="Crictracker2022_Desktop_SP_MID_728x90"
                            adIdMobile="Crictracker2022_Mobile_SP_MID_300x250"
                            dimensionDesktop={[728, 90]}
                            dimensionMobile={[300, 250]}
                            mobile
                            className="mb-2 text-center"
                          />
                          <section>
                            <h4 className="text-uppercase" ref={observe}>
                              <Trans i18nKey="common:TopRankings" />
                            </h4>
                            {inView && <TopPlayerRankings data={playerData} />}
                          </section>
                        </Col>
                      )}
                      <Col md={6} key={i + home?._id} id={home?._id}>
                        <ArticleSmall data={home} isLarge={false} isVideo={home?.__typename === 'oVideoData' && true} />
                      </Col>
                    </React.Fragment>
                  )
                } else {
                  return (
                    <React.Fragment key={i + home?._id}>
                      {i === 12 && (
                        <>
                          <Ads
                            id="div-ad-gpt-138639789-1646635925-0"
                            adIdDesktop="Crictracker2022_Desktop_SP_MID2_728x90"
                            adIdMobile="Crictracker2022_Mobile_SP_MID2_300x250"
                            dimensionDesktop={[728, 90]}
                            dimensionMobile={[300, 250]}
                            mobile
                            className="mb-2 text-center"
                          />
                          <h4 className="text-uppercase">
                            <Trans i18nKey="common:MoreArticles" />
                          </h4>
                        </>
                      )}
                      {i === 18 && (
                        <Ads
                          id="div-ad-gpt-138639789-1646635975-0"
                          adIdDesktop="Crictracker2022_Desktop_SP_MID3_728x90"
                          adIdMobile="Crictracker2022_Mobile_SP_MID3_300x250"
                          dimensionDesktop={[728, 90]}
                          dimensionMobile={[300, 250]}
                          mobile
                          className="mb-3 text-center"
                        />
                      )}
                      <Col xs={12} key={i + home?._id} id={home?._id}>
                        <ArticleSmall id={home?._id} data={home} isLarge={true} isVideo={home?.__typename === 'oVideoData' && true} />
                      </Col>
                    </React.Fragment>
                  )
                }
              })}
            </Row>
          </section>
          {isLoading && articleLoader(['s', 's'])}
        </div>
      )}
      {mixData.length === 0 && <NoData />}
    </>
  )
}

SeriesHome.propTypes = {
  data: PropTypes.object,
  playerData: PropTypes.array,
  category: PropTypes.object
}

export default SeriesHome
