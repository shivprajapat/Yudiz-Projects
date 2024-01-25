import React, { useEffect, useState } from 'react'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useLazyQuery } from '@apollo/client'
import { Button, Col, Row } from 'react-bootstrap'

import styles from './style.module.scss'
import { articleLoader } from '@shared/libs/allLoader'
import useOnScreen from '@shared/hooks/useOnScreen'
import { GET_RANDOM_ARTICLE } from '@graphql/article/article.query'
import CustomLink from '@shared/components/customLink'
import useWindowSize from '@shared/hooks/windowSize'

const TopPlayerRankings = dynamic(() => import('@shared-components/topPlayerRankings'))
const ArticleSmall = dynamic(() => import('@shared-components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared-components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const NoData = dynamic(() => import('@noData'), { ssr: false })

function SeriesHome({
  data: { oArticles = { aResults: [] }, oVideos = { aResults: [] }, fantasyArticle = { aResults: [] } }, playerData = [], category, onTabChanges, subPagesURLS
}) {
  const { inView, observe } = useOnScreen()
  const [width] = useWindowSize()
  const [newArticle, setNewsArticle] = useState(oArticles?.aResults)

  const [getRandomArticles] = useLazyQuery(GET_RANDOM_ARTICLE, {
    variables: { input: { nSample: 7 } },
    onCompleted: (article) => {
      article?.randomArticles && setNewsArticle(article?.randomArticles)
    }
  })

  function handleTabChange(tab) {
    const ele = document?.getElementById('client-common-nav')?.offsetTop
    window?.scrollTo({ top: ele - 60, behavior: 'smooth' })
    onTabChanges && onTabChanges(tab)
  }

  useEffect(() => {
    if (category?.eType === 'p' || category?.eType === 'gt' || category?.eType === 't') {
      if (newArticle?.length === 0 && fantasyArticle?.aResults?.length === 0) getRandomArticles()
    }
  }, [category])

  useEffect(() => {
    setNewsArticle(oArticles?.aResults)
  }, [oArticles])

  return (
    <>
      <div className={styles.seriesHome}>
        {category?._id !== '623184b5f5d229bacb010197' && newArticle?.length !== 0 && (
          <>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:latestArticle" />
            </h4>
            <section>
              <ArticleSmall isLarge={true} isVideo={newArticle?.[0]?.__typename === 'oVideoData'} data={newArticle?.[0]} isMobileBig />
              {width < 767 && ( // Only for mobile after 1st article
                <Ads
                  id="div-ad-gpt-138639789-Desktop_SP_ATF_728"
                  adIdDesktop="Crictracker2022_Desktop_SP_ATF_728x90"
                  adIdMobile="Crictracker2022_Mobile_SP_ATF_300x250"
                  dimensionDesktop={[728, 90]}
                  dimensionMobile={[300, 250]}
                  mobile
                  className="text-center mb-3"
                />
              )}
              <Row>
                {newArticle?.map((a, i) => {
                  if (i > 0) {
                    return (
                      <React.Fragment key={i + a?._id}>
                        <Col lg={4} sm={6} id={a?._id}>
                          <ArticleGrid data={a} isVideo={a?.__typename === 'oVideoData'} isMobileSmall />
                        </Col>
                        {i === 3 && (
                          <Col xs={12}>
                            {/* After 4th article and second row */}
                            <Ads
                              id="div-ad-gpt-139789-Crictracker2022_Desktop_SP_MID_728"
                              adIdDesktop="Crictracker2022_Desktop_SP_MID_728x90"
                              // adIdMobile="Crictracker2022_Mobile_SP_MID_300x250"
                              dimensionDesktop={[728, 90]}
                              // dimensionMobile={[300, 250]}
                              // mobile
                              className={'text-center mb-3 d-none d-md-block'}
                            />
                          </Col>
                        )}
                      </React.Fragment>
                    )
                  } else return null
                })}
              </Row>
              {newArticle?.length >= 7 && (
                <div className="text-center theme-text">
                  {onTabChanges ? (
                    <Button className='theme-btn small-btn' onClick={() => handleTabChange('news')}>
                      <Trans i18nKey="common:More" /> <Trans i18nKey="common:News" /> {'>'}
                    </Button>
                  ) : (
                    <CustomLink href={`/${subPagesURLS?.n?.sSlug}/`} prefetch={false}>
                      <a className="theme-btn small-btn">
                        <Trans i18nKey="common:More" /> <Trans i18nKey="common:News" /> {'>'}
                      </a>
                    </CustomLink>
                  )}
                </div>
              )}
            </section>
          </>
        )}
        {playerData && playerData?.length > 0 && (
          <section className="common-section">
            <h4 className="text-uppercase" ref={observe}>
              <Trans i18nKey="common:TopRankings" />
            </h4>
            {inView && <TopPlayerRankings subPagesURLS={subPagesURLS} data={playerData} />}
          </section>
        )}
        {fantasyArticle?.aResults?.length > 0 && (
          <>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:FantasyArticles" />
            </h4>
            <section>
              <ArticleSmall
                isLarge={true}
                isVideo={fantasyArticle?.aResults[0]?.__typename === 'oVideoData'}
                data={fantasyArticle?.aResults[0]}
                isMobileBig
              />
              <Row>
                {fantasyArticle?.aResults?.map((a, i) => {
                  if (i > 0) {
                    return (
                      <Col lg={4} key={i + a?._id} sm={6} id={a?._id}>
                        <ArticleGrid data={a} isVideo={a?.__typename === 'oVideoData'} isMobileSmall />
                      </Col>
                    )
                  } else return null
                })}
              </Row>
              {fantasyArticle?.aResults?.length >= 7 && (
                <div className="text-center theme-text">
                  {onTabChanges ? (
                    <Button className='theme-btn small-btn' onClick={() => handleTabChange('fantasyArticle')}>
                      <Trans i18nKey="common:More" /> <Trans i18nKey="common:FantasyArticles" /> {'>'}
                    </Button>
                  ) : (
                    <CustomLink href={`/${subPagesURLS?.ft?.sSlug}/`} prefetch={false}>
                      <a className="theme-btn small-btn">
                        <Trans i18nKey="common:More" /> <Trans i18nKey="common:FantasyArticles" /> {'>'}
                      </a>
                    </CustomLink>
                  )}
                </div>
              )}
            </section>
          </>
        )}
        {oVideos?.aResults?.length > 0 && (
          <>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:Videos" />
            </h4>
            <section>
              <ArticleSmall
                isLarge={true}
                isVideo={oVideos?.aResults[0]?.__typename === 'oVideoData'}
                data={oVideos?.aResults[0]}
                isMobileBig
              />
              <Row>
                {oVideos?.aResults?.map((a, i) => {
                  if (i > 0) {
                    return (
                      <Col lg={4} key={i + a?._id} sm={6} id={a?._id}>
                        <ArticleGrid data={a} isVideo={a?.__typename === 'oVideoData'} isMobileSmall />
                      </Col>
                    )
                  } else return null
                })}
              </Row>
              {oVideos?.aResults?.length >= 7 && (
                <div className="text-center theme-text">
                  {onTabChanges ? (
                    <Button className='theme-btn small-btn' onClick={() => handleTabChange('videos')}>
                      <Trans i18nKey="common:More" /> <Trans i18nKey="common:Videos" /> {'>'}
                    </Button>
                  ) : (
                    <CustomLink href={`/${subPagesURLS?.v?.sSlug}/`} prefetch={false} >
                      <a className="theme-btn small-btn">
                        <Trans i18nKey="common:More" /> <Trans i18nKey="common:Videos" /> {'>'}
                      </a>
                    </CustomLink>
                  )}
                </div>
              )}
            </section>
          </>
        )}
        {fantasyArticle?.aResults?.length === 0 && oVideos?.aResults?.length === 0 && newArticle?.length === 0 && playerData?.length === 0 && (
          <NoData />
        )}
      </div>
    </>
  )
}

SeriesHome.defaultProps = {
  data: { oArticles: {}, oVideos: {}, fantasyArticle: {} }
}

SeriesHome.propTypes = {
  data: PropTypes.object,
  playerData: PropTypes.array,
  category: PropTypes.object,
  subPagesURLS: PropTypes.object,
  onTabChanges: PropTypes.func
}

export default SeriesHome
