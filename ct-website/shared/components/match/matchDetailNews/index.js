import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import { Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import styles from '@shared-components/series/seriesNews/style.module.scss'
import { articleLoader } from '@shared/libs/allLoader'
import { GET_SERIES_NEWS_VIDEOS } from '@graphql/series/home.query'
import { payload } from '../../../libs/category'
import { isBottomReached } from '@utils'

const ArticleSmall = dynamic(() => import('@shared-components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared-components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const NoData = dynamic(() => import('@noData'), { ssr: false })

const MatchDetailNews = ({ data, seriesId }) => {
  const [newsData, setNewsData] = useState(data?.aResults)
  const loading = useRef(false)
  const payloadNews = useRef({ ...payload(7) })
  const [isLoading, setIsLoading] = useState(false)

  const [getSeriesNews, { data: seriesNews }] = useLazyQuery(GET_SERIES_NEWS_VIDEOS)

  const latestNews = useRef(seriesNews?.listSeriesArticlesVideosFront?.oArticles?.aResults?.length || data?.aResults?.length)

  useEffect(() => {
    loading.current = false
    setIsLoading(false)
    isBottomReached(newsData[newsData.length - 1]?._id, isReached)
  }, [newsData])

  useEffect(() => {
    const value = seriesNews?.listSeriesArticlesVideosFront
    if (value) {
      setNewsData([...newsData, ...value?.oArticles?.aResults])
      latestNews.current = seriesNews?.listSeriesArticlesVideosFront?.oArticles?.aResults?.length
    }
  }, [seriesNews])

  async function isReached(reach) {
    if (reach && !loading.current && latestNews.current === 7) {
      setIsLoading(true)
      loading.current = true
      setPayload()
      getMoreData()
    }
  }

  async function getMoreData() {
    const { data } = await getSeriesNews({ variables: { input: { iSeriesId: seriesId, eType: 'n', ...payloadNews.current } } })
    return data?.listSeriesArticlesVideosFront
  }

  function setPayload() {
    payloadNews.current = { ...payloadNews.current, nSkip: payloadNews.current.nSkip + 1 }
  }

  return (
    <>
      {newsData?.length !== 0 && (
        <div className={styles.seriesHome}>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:LatestNews" />
          </h4>
          <Row>
            {newsData?.map((news, i) => {
              if (i === 0) {
                return (
                  <Col key={news._id} xs={12} id={news?._id}>
                    <ArticleSmall isLarge={true} data={news} />
                  </Col>
                )
              } else if (i > 0 && i < 7) {
                return (
                  <Col key={news._id} lg={4} sm={6} id={news?._id}>
                    <ArticleGrid data={news} />
                  </Col>
                )
              } else if (i >= 7 && i <= 12) {
                return (
                  <Col key={news?._id} md={6} id={news?._id}>
                    <ArticleSmall isLarge={false} data={news} />
                  </Col>
                )
              } else {
                return (
                  <React.Fragment key={news?._id}>
                    {i === 13 && (
                      <h4 className="text-uppercase">
                        <Trans i18nKey="common:MoreArticles" />
                      </h4>
                    )}
                    <Col xs={12} id={news?._id}>
                      <ArticleSmall isLarge={true} data={news} />
                    </Col>
                  </React.Fragment>
                )
              }
            })}
          </Row>
          {isLoading && articleLoader(['s', 's'])}
        </div>
      )}
      {newsData.length === 0 && <NoData />}
    </>
  )
}

MatchDetailNews.propTypes = {
  data: PropTypes.object,
  seriesId: PropTypes.string
}

export default MatchDetailNews
