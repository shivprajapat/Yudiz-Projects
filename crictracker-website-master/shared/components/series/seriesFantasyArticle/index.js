import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'

import styles from './style.module.scss'
import Trans from 'next-translate/Trans'
import { payload } from '@shared/libs/category'
import { GET_FANTASY_ARTICLE_OF_CATEGORY } from '@graphql/series/home.query'
import { isBottomReached } from '@shared/utils'
import { articleLoader } from '@shared/libs/allLoader'
import { Col, Row } from 'react-bootstrap'
import useWindowSize from '@shared/hooks/windowSize'

const ArticleSmall = dynamic(() => import('@shared-components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared-components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const NoData = dynamic(() => import('@noData'), { ssr: false })

function SeriesFantasyArticle({ data, category, isClientOnly }) {
  const [article, setArticle] = useState(data?.aResults || [])
  const loading = useRef(false)
  const payloadVideos = useRef({ ...payload(7) })
  const [isLoading, setIsLoading] = useState(false)
  const [width] = useWindowSize()

  const [getArticle, { data: newArticle }] = useLazyQuery(GET_FANTASY_ARTICLE_OF_CATEGORY)

  const latestArticle = useRef(newArticle?.listFrontTagCategoryFantasyArticle?.aResults?.length || data?.aResults?.length)

  useEffect(() => {
    loading.current = false
    setIsLoading(false)
    isBottomReached(article[article.length - 1]?._id, isReached)
  }, [article])

  useEffect(() => {
    const value = newArticle?.listFrontTagCategoryFantasyArticle
    if (value) {
      setArticle([...article, ...value?.aResults])
    }
    latestArticle.current = newArticle?.listFrontTagCategoryFantasyArticle?.aResults?.length || data?.aResults?.length
  }, [newArticle])

  useEffect(() => {
    if (isClientOnly) {
      getArticle({ variables: { input: { iId: category?._id, ...payloadVideos.current } } })
    }
  }, [isClientOnly])

  async function isReached(reach) {
    if (reach && !loading.current && latestArticle.current === payloadVideos.current.nLimit) {
      loading.current = true
      setIsLoading(true)
      setPayload()
      getMoreData()
    }
  }

  async function getMoreData() {
    const { data } = await getArticle({ variables: { input: { iId: category?._id, ...payloadVideos.current } } })
    return data?.listFrontTagCategoryFantasyArticle
  }

  function setPayload() {
    payloadVideos.current = { ...payloadVideos.current, nSkip: payloadVideos.current.nSkip + 1 }
  }

  return (
    <>
      {article?.length !== 0 && (
        <div className={styles.seriesVideo}>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:FantasyArticles" />
          </h4>
          <Row>
            {article?.map((news, i) => {
              if (i === 0) {
                return (
                  <React.Fragment key={news._id}>
                    <Col xs={12} id={news?._id}>
                      <ArticleSmall isLarge={true} data={news} />
                    </Col>
                    {width < 767 && ( // Only for mobile after 1st article
                      <Col xs={12}>
                        <Ads
                          id="div-ad-gpt-138639789-Desktop_SP_ATF_728"
                          adIdDesktop="Crictracker2022_Desktop_SP_ATF_728x90"
                          adIdMobile="Crictracker2022_Mobile_SP_ATF_300x250"
                          dimensionDesktop={[728, 90]}
                          dimensionMobile={[300, 250]}
                          mobile
                          className="text-center mb-3"
                        />
                      </Col>
                    )}
                  </React.Fragment>
                )
              } else if (i > 0 && i < 7) {
                return (
                  <React.Fragment key={news._id}>
                    <Col lg={4} sm={6} id={news?._id}>
                      <ArticleGrid data={news} />
                    </Col>
                    {/* After 4th article and second row */}
                    {i === 3 && (
                      <Col xs={12}>
                        <Ads
                          id="div-ad-gpt-138639789-1646635863-0"
                          adIdDesktop="Crictracker2022_Desktop_SP_MID_728x90"
                          // adIdMobile="Crictracker2022_Mobile_SP_MID_300x250"
                          dimensionDesktop={[728, 90]}
                          // dimensionMobile={[300, 250]}
                          // mobile
                          className="mb-2 text-center d-none d-md-block"
                        />
                      </Col>
                    )}
                  </React.Fragment>
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
                      <>
                        {/* <Ads
                          id="div-ad-gpt-138639789-1646635925-0"
                          adIdDesktop="Crictracker2022_Desktop_SP_MID2_728x90"
                          dimensionDesktop={[728, 90]}
                          className="mb-2 text-center"
                        /> */}
                        <h4 className="text-uppercase">
                          <Trans i18nKey="common:MoreArticles" />
                        </h4>
                      </>
                    )}
                    {/* {i === 17 && (
                      <Ads
                        id="div-ad-gpt-138639789-1646635975-0"
                        adIdDesktop="Crictracker2022_Desktop_SP_MID3_728x90"
                        adIdMobile="Crictracker2022_Mobile_SP_MID3_300x250"
                        dimensionDesktop={[728, 90]}
                        dimensionMobile={[300, 250]}
                        mobile
                        className="mb-3 text-center"
                      />
                    )} */}
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
      {article?.length === 0 && <NoData />}
    </>
  )
}
SeriesFantasyArticle.propTypes = {
  data: PropTypes.object,
  category: PropTypes.object,
  isClientOnly: PropTypes.bool
}
export default SeriesFantasyArticle
