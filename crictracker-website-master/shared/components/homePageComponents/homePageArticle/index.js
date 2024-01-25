import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
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
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'

const ArticleBig = dynamic(() => import('@shared/components/article/articleBig'), { loading: () => articleLoader(['g']) })
const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared/components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const ArticleMedium = dynamic(() => import('@shared/components/article/articleMedium'))
const ArticleList = dynamic(() => import('@shared/components/article/articleList'))
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
// const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const DownloadBanner = dynamic(() => import('@shared/components/downloadBanner'))
const LiveMatchCard = dynamic(() => import('@shared/components/liveMatchCard'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))

function HomePageArticle({ articles, widgetPosition }) {
  const [article, setArticle] = useState(mapArticleData(articles))
  const [loading, setLoading] = useState(false)
  const payload = useRef({ nLimit: 3, nSkip: 1 })
  const total = useRef(4)
  const isLoading = useRef(false)
  const [width] = useWindowSize()
  const { stateGlobalEvents } = useContext(GlobalEventsContext)

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

  useEffect(() => {
    if (stateGlobalEvents?.homeArticle?.length) {
      const cloneArticls = article
      stateGlobalEvents?.homeArticle.forEach((match) => {
        let currentMatch = cloneArticls.find(item => item?.oScore?.iMatchId === match?.iMatchId)
        if (currentMatch) {
          currentMatch = { ...currentMatch, oScore: { ...currentMatch?.oScore, ...match } }
          const index = cloneArticls.findIndex(s => s?.iSeriesId === currentMatch?.iSeriesId)
          cloneArticls[index] = currentMatch
        }
      })
      setArticle(cloneArticls)
    }
  }, [stateGlobalEvents])

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

  function getCustomURL(aCustomSeo = []) {
    const URLs = {}
    aCustomSeo?.forEach(e => {
      URLs[e?.eTabType] = `/${e?.sSlug}/`
    })
    return URLs
  }

  return (
    <>
      {article?.map((cat, ind) => {
        const rewriteURLs = cat?.eType === 'as' ? getCustomURL(cat?.oScore?.oSeriesSeo?.aCustomSeo) : {}
        return (
          <React.Fragment key={cat.sSlug}>
            {/* {(ind === 2) && (
              <>
                <DownloadBanner />
                <Ads
                  id="div-ad-gpt-138639789-1660201960-0"
                  adIdDesktop="Crictracker2022_Desktop_HP_MID_336x280"
                  dimensionDesktop={[336, 280]}
                  className={'text-center mb-2'}
                />
              </>
            )} */}
            <section id={cat.sSlug} className={`${styles.homeArticles} mb-3 mb-md-4`}>
              <h4 className="line-title mb-2 mb-md-4 text-uppercase text-center overflow-hidden">
                {cat?.sSlug ? (
                  <CustomLink href={allRoutes.seriesHome(cat.sSlug)} prefetch={false}>
                    <a className="rounded-pill mx-1 px-2 px-xl-3 position-relative d-inline-block">
                      <span className="d-none d-md-block text-nowrap overflow-hidden t-ellipsis">{cat.sName}</span>
                      <span className="d-block d-md-none text-nowrap overflow-hidden t-ellipsis">{cat?.oScore?.oSeries?.sSrtTitle || cat.sName}</span>
                    </a>
                    {/* <Button variant="link" className="d-flex align-items-center justify-content-center active">
                      <NotificationIcon />
                    </Button> */}
                  </CustomLink>
                ) : (
                  <span className="rounded-pill position-relative d-inline-block text-nowrap overflow-hidden t-ellipsis">{cat.sName}</span>
                )}
              </h4>
              {cat?.eType === 'as' && (
                <div className="small-text text-muted text-center">
                  <p>{cat?.oScore?.oSeries?.sTitle}</p>
                  <div className={`${styles.btnList} text-nowrap scroll-list d-flex mb-2 mb-lg-3`}>
                    <nav className="font-semi d-flex me-auto ms-auto text-uppercase xsmall-text">
                      <CustomLink href={rewriteURLs?.fixtures ? rewriteURLs?.fixtures : allRoutes.seriesFixtures(`/${cat.sSlug}/`)} prefetch={false}>
                        <a className="rounded-pill m-1 px-2 px-xl-3 py-1">
                          <Trans i18nKey="common:Fixtures" />
                        </a>
                      </CustomLink>
                      {cat?.oScore?.oSeries?.nTotalTeams > 2 && (
                        <CustomLink href={rewriteURLs?.standings ? rewriteURLs?.standings : allRoutes.seriesStandings(`/${cat.sSlug}/`)} prefetch={false}>
                          <a className="rounded-pill m-1 px-2 px-xl-3 py-1">
                            <Trans i18nKey="common:Standings" />
                          </a>
                        </CustomLink>
                      )}
                      <CustomLink href={rewriteURLs?.stats ? rewriteURLs?.stats : allRoutes.seriesStats(`/${cat.sSlug}/`)} prefetch={false}>
                        <a className="rounded-pill m-1 px-2 px-xl-3 py-1">
                          <Trans i18nKey="common:Stats" />
                        </a>
                      </CustomLink>
                      <CustomLink href={rewriteURLs?.squads ? rewriteURLs?.squads : allRoutes.seriesSquads(`/${cat.sSlug}/`)} prefetch={false}>
                        <a className="rounded-pill m-1 px-2 px-xl-3 py-1">
                          <Trans i18nKey="common:Squads" />
                        </a>
                      </CustomLink>
                      <CustomLink href={allRoutes.seriesFantasyTips(`/${cat.sSlug}/`)} prefetch={false}>
                        <a className="rounded-pill m-1 px-2 px-xl-3 py-1">
                          <Trans i18nKey="common:FantasyTips" />
                        </a>
                      </CustomLink>
                    </nav>
                  </div>
                  {(cat.bScoreCard && cat.oScore) &&
                    <div className={cat?.iCategoryId === '623184baf5d229bacb01030e' && width < 992 ? 'd-none' : ''}>
                      <LiveMatchCard data={cat.oScore} />
                    </div>
                  }
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
                    <Row className={`gx-2 flex-nowrap article-grid-list scroll-list ${styles.articleGridList}`} key={ar.sType}>
                      {ar.mappedArticle.map((g) => {
                        return (
                          <Col key={g._id} xl={4} md={5} sm={5} xs="auto">
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
              {cat?.sSlug && <CustomLink href={allRoutes.seriesHome(cat.sSlug)} className="theme-btn w-100 btn btn-primary" prefetch={false}>
                <a className="theme-btn w-100 btn btn-primary">
                  <Trans i18nKey="common:MoreFrom" /> {cat.sName} &gt;
                </a>
              </CustomLink>}
            </section>
            {ind === 1 && (
              <>
                {/* {width < 991 && <>
                  <OnMouseAndScroll>
                    <SeriesPointTable />
                    <SeriesKeyStats />
                  </OnMouseAndScroll>
                </>} */}
                <DownloadBanner />
              </>
            )}
            {((ind + 1) % 2 === 0) && (width < 991) && <AllWidget widgetPosition={widgetPosition} show={width < 991} index={((ind + 1) / 2) - 1} />}
          </React.Fragment>
        )
      })}
      {loading && articleLoader(['g', 's'])}
    </>
  )
}
HomePageArticle.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object),
  widgetPosition: PropTypes.arrayOf(PropTypes.object)
}
export default HomePageArticle
