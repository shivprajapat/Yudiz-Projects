import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Row, Col } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import { payload } from '../../../libs/category'
import { isBottomReached } from '@utils'
import { GET_TAG_ARTICLE } from '@graphql/tag/tag.query'
import { articleLoader } from '@shared/libs/allLoader'
import { GET_CATEGORY_NEWS_VIDEOS, GET_SERIES_NEWS_VIDEOS } from '@graphql/series/home.query'
import { HOME_FANTASY_ARTICLE } from '@graphql/home/home.query'
import { GET_RANDOM_ARTICLE } from '@graphql/article/article.query'

const ArticleSmall = dynamic(() => import('@shared-components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared-components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const NoData = dynamic(() => import('@noData'), { ssr: false })

const SeriesNews = ({ data, category, hideBadge, isClientOnly }) => {
  const [newsData, setNewsData] = useState(data?.aResults || [])
  const loading = useRef(false)
  const payloadNews = useRef({ ...payload(7) })
  const [isLoading, setIsLoading] = useState(false)

  const [getSeriesNews, { data: seriesNews }] = useLazyQuery(GET_SERIES_NEWS_VIDEOS)
  const [getCategoryNews, { data: simpleNews }] = useLazyQuery(GET_CATEGORY_NEWS_VIDEOS)
  const [tagArticle, { data: tagArticles }] = useLazyQuery(GET_TAG_ARTICLE)
  const [getfantasyArticles, { data: fantasyArticleData }] = useLazyQuery(HOME_FANTASY_ARTICLE)
  const [getRandomArticles, { data: randomArticle }] = useLazyQuery(GET_RANDOM_ARTICLE, {
    variables: { input: { nSample: 10 } },
    onCompleted: (article) => {
      article?.randomArticles && setNewsData(article?.randomArticles)
    }
  })

  const latestNews = useRef(getLengthForPagination())

  useEffect(() => {
    loading.current = false
    setIsLoading(false)
    latestNews.current = getLengthForPagination()
    if (newsData?.length && !randomArticle) isBottomReached(newsData[newsData.length - 1]?._id, isReached)
  }, [newsData])

  useEffect(() => {
    const value = tagArticles?.getTagArticlesFront || fantasyArticleData?.listFrontFantasyArticle
    if (value && value?.aResults?.length !== 0) {
      setNewsData([...newsData, ...value?.aResults])
    } else if (value && !newsData?.length) {
      getRandomArticles()
    }
  }, [tagArticles, fantasyArticleData])

  useEffect(() => {
    const value = seriesNews?.listSeriesArticlesVideosFront || simpleNews?.listSimpleCategoryArticlesVideosFront
    if (value && value?.oArticles?.aResults?.length !== 0) {
      setNewsData([...newsData, ...value?.oArticles?.aResults])
    } else if (value && !newsData?.length) {
      getRandomArticles()
    }
  }, [seriesNews, simpleNews])

  useEffect(() => {
    if (isClientOnly) {
      if (category?.eType === 'gt' || category?.eType === 'p' || category?.eType === 't') { // General tag, Player, and Team
        payloadNews.current.eType = category?.eType
        tagArticle({ variables: { input: { _id: category?.iId, ...payloadNews.current } } })
      } else if (category?.eType === 's' || category?.eType === 'fac') { // simple category
        getCategoryNews({ variables: { input: { iCategoryId: category?._id, eType: 'n', ...payloadNews.current } } })
      }
    } else if (!isClientOnly && data?.aResults?.length === 0) {
      // Only for series category page
      getRandomArticles()
    }
  }, [isClientOnly])

  async function isReached(reach) {
    if (reach && !loading.current && (latestNews.current === 7 || latestNews.current === 16)) {
      setIsLoading(true)
      loading.current = true
      setPayload(category?.eType === 'gt' || category?.eType === 'p' || category?.eType === 't')
      getMoreData()
    }
  }

  async function getMoreData() {
    if (category?.eType === 'as') {
      // Series category
      const { data } = await getSeriesNews({ variables: { input: { iSeriesId: category?.iSeriesId, eType: 'n', ...payloadNews.current } } })
      return data?.listSeriesArticlesVideosFront
    } else if (category?.eType === 'gt' || category?.eType === 'p' || category?.eType === 't') {
      // tag
      const { data } = await tagArticle({ variables: { input: { _id: category?.iId, ...payloadNews.current } } })
      return data?.getTagArticlesFront?.aResults
    } else if (category.eType === 'ct') {
      // for fantasy articles category
      const { data } = await getfantasyArticles({
        variables: { input: { iId: category?.iId, ...payloadNews.current } }
      })
      return data?.listFrontFantasyArticle
    } else {
      // simple category
      const { data } = await getCategoryNews({ variables: { input: { iCategoryId: category?._id, eType: 'n', ...payloadNews.current } } })
      return data?.listSimpleCategoryArticlesVideosFront
    }
  }

  function setPayload(isTag) {
    payloadNews.current = { ...payloadNews.current, nSkip: payloadNews.current.nSkip + 1 }
    if (isTag) payloadNews.current.eType = category?.eType
  }

  function getLengthForPagination() {
    return (
      seriesNews?.listSeriesArticlesVideosFront?.oArticles?.aResults?.length ||
      simpleNews?.listSimpleCategoryArticlesVideosFront?.oArticles?.aResults?.length ||
      tagArticles?.getTagArticlesFront?.aResults?.length ||
      fantasyArticleData?.listFrontFantasyArticle?.aResults?.length ||
      data?.aResults?.length
    )
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
                    <ArticleSmall isLarge={true} data={news} hideBadge={hideBadge} />
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
                    <ArticleSmall isLarge={false} data={news} hideBadge={hideBadge} />
                  </Col>
                )
              } else {
                return (
                  <React.Fragment key={news?._id}>
                    {i === 13 && (
                      <>
                        <Ads
                          id="div-ad-gpt-139789-1646-Desktop_SP_MID2_728"
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
                    {i === 17 && (
                      <Ads
                        id="div-ad-gpt-138639789-1646635925-022_Desktop_SP_MID3_72"
                        adIdDesktop="Crictracker2022_Desktop_SP_MID3_728x90"
                        adIdMobile="Crictracker2022_Mobile_SP_MID3_300x250"
                        dimensionDesktop={[728, 90]}
                        dimensionMobile={[300, 250]}
                        mobile
                        className="mb-2 text-center"
                      />
                    )}
                    <Col xs={12} id={news?._id}>
                      <ArticleSmall isLarge={true} data={news} hideBadge={hideBadge} />
                    </Col>
                  </React.Fragment>
                )
              }
            })}
          </Row>
          {isLoading && articleLoader(['s', 's'])}
        </div>
      )}
      {newsData?.length === 0 && <NoData />}
    </>
  )
}

SeriesNews.propTypes = {
  data: PropTypes.object,
  category: PropTypes.object,
  hideBadge: PropTypes.bool,
  isClientOnly: PropTypes.bool
}

export default SeriesNews
