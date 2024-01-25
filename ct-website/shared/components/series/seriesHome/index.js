import { useContext, useEffect, useState } from 'react'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'
import { Button, Col, Row } from 'react-bootstrap'

import styles from './style.module.scss'
import { articleLoader } from '@shared/libs/allLoader'
import { allRoutes } from '@shared/constants/allRoutes'
import useOnScreen from '@shared/hooks/useOnScreen'
import { GET_RANDOM_ARTICLE } from '@graphql/article/article.query'
import { REACT_APP_ENV } from '@shared/constants'
import { GlobalEventsContext } from '@shared/components/global-events'

const TopPlayerRankings = dynamic(() => import('@shared-components/topPlayerRankings'))
const ArticleSmall = dynamic(() => import('@shared-components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared-components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const PromotionFull = dynamic(() => import('@shared/components/adsPromotion/promotionFull'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const NoData = dynamic(() => import('@noData'), { ssr: false })

function SeriesHome({ data: { oArticles = { aResults: [] }, oVideos = { aResults: [] }, fantasyArticle = { aResults: [] } }, playerData = [], category, onTabChanges }) {
  const router = useRouter()
  const { inView, observe } = useOnScreen()
  const [newArticle, setNewsArticle] = useState(oArticles?.aResults)
  const [bannerData, setBannerData] = useState({})
  const { stateGlobalEvents } = useContext(GlobalEventsContext)

  const [getRandomArticles] = useLazyQuery(GET_RANDOM_ARTICLE, {
    variables: { input: { nSample: 7 } },
    onCompleted: (article) => {
      article?.randomArticles && setNewsArticle(article?.randomArticles)
    }
  })

  useEffect(() => {
    const matches = stateGlobalEvents?.seriesMiniScoreCardData
    const upcomingMatches = matches && matches.filter((data) => data?.sStatusStr === 'scheduled')
    matches && setBannerData(upcomingMatches?.length > 0 ? upcomingMatches[0] : matches[matches?.length - 1])
  }, [stateGlobalEvents])

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
        {newArticle?.length !== 0 && (
          <>
            {REACT_APP_ENV === 'staging' && category?.eType === 'as' && <PromotionFull match={bannerData}/>}
            <h4 className="text-uppercase">
              <Trans i18nKey="common:latestArticle" />
            </h4>
            <section>
              <ArticleSmall isLarge={true} isVideo={newArticle[0]?.__typename === 'oVideoData'} data={newArticle[0]} />
              <Row>
                {newArticle?.map((a, i) => {
                  if (i > 0) {
                    return (
                      <Col lg={4} key={i + a?._id} sm={6} id={a?._id}>
                        <ArticleGrid data={a} isVideo={a?.__typename === 'oVideoData'} />
                      </Col>
                    )
                  } else return null
                })}
              </Row>
              {newArticle?.length >= 16 && (
                <div className="text-center theme-text">
                  {onTabChanges ? (
                    <Button className='theme-btn small-btn' onClick={() => onTabChanges('news')}>
                      <Trans i18nKey="common:More" /> <Trans i18nKey="common:News" /> {'>'}
                    </Button>
                  ) : (
                    <Link
                      href={{
                        pathname: allRoutes.seriesNews(router.asPath)
                      }}
                      prefetch={false}
                    >
                      <a className="theme-btn small-btn">
                        <Trans i18nKey="common:More" /> <Trans i18nKey="common:News" /> {'>'}
                      </a>
                    </Link>
                  )}
                </div>
              )}
            </section>
          </>
        )}
        {playerData && playerData?.length !== 0 && (
          <section>
            <h4 className="text-uppercase" ref={observe}>
              <Trans i18nKey="common:TopRankings" />
            </h4>
            {inView && <TopPlayerRankings data={playerData} />}
            {/* After top ranking desktop/mobile */}
            <Ads
              id="div-ad-gpt-139789-Crictracker2022_Desktop_SP_MID_728"
              adIdDesktop="Crictracker2022_Desktop_SP_MID_728x90"
              adIdMobile="Crictracker2022_Mobile_SP_MID_300x250"
              dimensionDesktop={[728, 90]}
              dimensionMobile={[300, 250]}
              mobile
              className={'text-center mb-2'}
            />
          </section>
        )}
        {fantasyArticle?.nTotal > 0 && (
          <>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:FantasyArticles" />
            </h4>
            <section>
              <ArticleSmall isLarge={true} isVideo={fantasyArticle?.aResults[0]?.__typename === 'oVideoData'} data={fantasyArticle?.aResults[0]} />
              <Row>
                {fantasyArticle?.aResults?.map((a, i) => {
                  if (i > 0) {
                    return (
                      <Col lg={4} key={i + a?._id} sm={6} id={a?._id}>
                        <ArticleGrid data={a} isVideo={a?.__typename === 'oVideoData'} />
                      </Col>
                    )
                  } else return null
                })}
              </Row>
              {fantasyArticle?.nTotal > 7 && (
                <div className="text-center theme-text">
                  {onTabChanges ? (
                    <Button className='theme-btn small-btn' onClick={() => onTabChanges('fantasyArticle')}>
                      <Trans i18nKey="common:More" /> <Trans i18nKey="common:FantasyArticles" /> {'>'}
                    </Button>
                  ) : (
                    <Link
                      href={{
                        pathname: allRoutes.seriesFantasyTips(router.asPath)
                      }}
                      prefetch={false}
                    >
                      <a className="theme-btn small-btn">
                        <Trans i18nKey="common:More" /> <Trans i18nKey="common:FantasyArticles" /> {'>'}
                      </a>
                    </Link>
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
              <ArticleSmall isLarge={true} isVideo={oVideos?.aResults[0]?.__typename === 'oVideoData'} data={oVideos?.aResults[0]} />
              <Row>
                {oVideos?.aResults?.map((a, i) => {
                  if (i > 0) {
                    return (
                      <Col lg={4} key={i + a?._id} sm={6} id={a?._id}>
                        <ArticleGrid data={a} isVideo={a?.__typename === 'oVideoData'} />
                      </Col>
                    )
                  } else return null
                })}
              </Row>
              {oVideos?.aResults?.length >= 16 && (
                <div className="text-center theme-text">
                  {onTabChanges ? (
                    <Button className='theme-btn small-btn' onClick={() => onTabChanges('videos')}>
                      <Trans i18nKey="common:More" /> <Trans i18nKey="common:Videos" /> {'>'}
                    </Button>
                  ) : (
                    <Link
                      href={{
                        pathname: allRoutes.seriesVideos(router.asPath)
                      }}
                      prefetch={false}
                    >
                      <a className="theme-btn small-btn">
                        <Trans i18nKey="common:More" /> <Trans i18nKey="common:Videos" /> {'>'}
                      </a>
                    </Link>
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
  onTabChanges: PropTypes.func
}

export default SeriesHome
