import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './../style.module.scss'
import { allRoutes } from '@shared/constants/allRoutes'
import { useLazyQuery } from '@apollo/client'
import { isBottomReached, mapArticleData } from '@utils'
import { HOME_PAGE_ARTICLE } from '@graphql/home/home.query'
import { articleLoader } from '@shared/libs/allLoader'
import useWindowSize from '@shared/hooks/windowSize'
import LiveMatchCard from '@shared/components/liveMatchCard'
import { REACT_APP_ENV } from '@shared/constants'

const ArticleBig = dynamic(() => import('@shared/components/article/articleBig'), { loading: () => articleLoader(['g']) })
const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared/components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const ArticleMedium = dynamic(() => import('@shared/components/article/articleMedium'))
const ArticleList = dynamic(() => import('@shared/components/article/articleList'))
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const PromotionSmall = dynamic(() => import('@shared/components/adsPromotion/promotionSmall'))

function HomePageArticle({ articles }) {
  const [article, setArticle] = useState(mapArticleData(articles))
  const [loading, setLoading] = useState(false)
  const payload = useRef({ nLimit: 3, nSkip: 1 })
  const total = useRef(4)
  const isLoading = useRef(false)
  const [width] = useWindowSize()

  // const { data, fetchMore } = useQuery(HOME_PAGE_ARTICLE, { variables: { input: payload.current } })
  const [fetchMore, { data }] = useLazyQuery(HOME_PAGE_ARTICLE, { variables: { input: payload.current } })

  // const latestArticle = data?.getHomePageArticle?.aResults?.length

  useEffect(() => {
    isLoading.current = false
    setLoading(false)
    isBottomReached(article[article.length - 1]?.sSlug, isReached)
  }, [article])

  useEffect(() => {
    if (data?.getHomePageArticle) {
      handleArticleResponse(data?.getHomePageArticle)
    }
  }, [data])

  async function isReached(reach) {
    if (reach && !isLoading.current && total.current !== 0) {
      isLoading.current = true
      setLoading(true)
      payload.current.nSkip += 1
      fetchMore({
        variables: { input: payload.current }
      })
    }
  }

  function handleArticleResponse(data) {
    total.current = data?.aResults?.length
    setArticle([...article, ...mapArticleData(data?.aResults)])
  }
  return (
    <>
      {article?.map((cat, ind) => {
        return (
          <React.Fragment key={cat.sSlug}>
            {(width < 991 && ind === 1 && REACT_APP_ENV === 'staging') && <PromotionSmall />}
            {(ind === 2) && (
              <Ads
                id="div-ad-gpt-138639789-1660201960-0"
                adIdDesktop="Crictracker2022_Desktop_HP_MID_336x280"
                adIdMobile="Crictracker2022_Mobile_HP_MID_300x250"
                dimensionDesktop={[336, 280]}
                dimensionMobile={[300, 250]}
                mobile
                className={'text-center mb-2'}
              />
            )}
            {(ind === 4) && (
              <Ads
                id="div-ad-gpt-138639789-1660201960-1"
                adIdDesktop="Crictracker2022_Desktop_HP_MID2_336x280"
                adIdMobile="Crictracker2022_Mobile_HP_MID2_300x250"
                dimensionDesktop={[336, 280]}
                dimensionMobile={[300, 250]}
                mobile
                className={'text-center mb-2'}
              />
            )}
            <section id={cat.sSlug} className={`${styles.homeArticles}`}>
              <h4 className="line-title">
                {cat?.sSlug ? <Link href={allRoutes.seriesHome(cat.sSlug)} prefetch={false}>
                  <a><span className="d-block text-nowrap overflow-hidden">{cat.sName}</span></a>
                  {/* <Button variant="link" className="d-flex align-items-center justify-content-center active">
            <NotificationIcon />
          </Button> */}
                </Link> : <p>{cat.sName}</p>}
              </h4>
              {cat?.eType === 'as' && (
                <div className={`${styles.seriesInfo} text-center`}>
                  <p>{cat?.oScore?.oSeries?.sTitle}</p>
                  <div className={`${styles.btnList} text-nowrap scroll-list d-flex`}>
                    <nav className="font-semi d-flex me-auto ms-auto text-uppercase">
                      <Link href={allRoutes.seriesStats(`/${cat.sSlug}/`)} prefetch={false}>
                        <a>
                          <Trans i18nKey="common:Stats" />
                        </a>
                      </Link>
                      <Link href={allRoutes.seriesFixtures(`/${cat.sSlug}/`)} prefetch={false}>
                        <a>
                          <Trans i18nKey="common:Fixtures" />
                        </a>
                      </Link>
                      <Link href={allRoutes.seriesSquads(`/${cat.sSlug}/`)} prefetch={false}>
                        <a>
                          <Trans i18nKey="common:Squads" />
                        </a>
                      </Link>
                      <Link href={allRoutes.seriesFantasyTips(`/${cat.sSlug}/`)} prefetch={false}>
                        <a>
                          <Trans i18nKey="common:FantasyTips" />
                        </a>
                      </Link>
                      {cat?.oScore?.oSeries?.nTotalTeams > 2 && (
                        <Link href={allRoutes.seriesStandings(`/${cat.sSlug}/`)} prefetch={false}>
                          <a>
                            <Trans i18nKey="common:Standings" />
                          </a>
                        </Link>
                      )}
                    </nav>
                  </div>
                  {(cat.bScoreCard && cat.oScore) && <LiveMatchCard data={cat.oScore} />}
                </div>
              )}
              {/* <LiveMatchCard /> */}
              {cat.aArticle.map((ar) => {
                if (ar.sType === 'nBig') {
                  return <ArticleBig data={ar} key={ar._id} />
                } else if (ar.sType === 'nSmall') {
                  return <ArticleSmall data={ar} key={ar._id} />
                } else if (ar.sType === 'nGrid') {
                  return (
                    <Row className={`row-4 flex-nowrap article-grid-list scroll-list ${styles.articleGridList}`} key={ar.sType}>
                      {ar.mappedArticle.map((g) => {
                        return (
                          <Col key={g._id} md={4} sm={5} xs="auto">
                            <ArticleGrid data={g} />
                          </Col>
                        )
                      })}
                    </Row>
                  )
                } else if (ar.sType === 'nList') {
                  return <ArticleList data={ar.mappedArticle} key={ar.sType} id={ar?._id} />
                } else if (ar.sType === 'nMed') {
                  return <ArticleMedium data={ar} key={ar._id} />
                }
                return null
              })}
              {cat?.sSlug && <Link href={allRoutes.seriesHome(cat.sSlug)} className="theme-btn full-btn btn btn-primary" prefetch={false}>
                <a className="theme-btn full-btn btn btn-primary">
                  <Trans i18nKey="common:MoreFrom" /> {cat.sName} &gt;
                </a>
              </Link>}
            </section>
            {((ind + 1) % 2 === 0) && (width < 991) && <AllWidget show={width < 991} index={((ind + 1) / 2) - 1} />}
          </React.Fragment>
        )
      })}
      {loading && articleLoader(['g', 's'])}
    </>
  )
}
HomePageArticle.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object)
}
export default HomePageArticle
