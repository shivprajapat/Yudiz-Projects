import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'
import { useQuery } from '@apollo/client'
import { Col, Row } from 'react-bootstrap'

import styles from './../style.module.scss'
import { HOME_PAGE_VIDEO } from '@graphql/home/home.query'
import { allRoutes } from '@shared/constants/allRoutes'
import { isBottomReached, mapArticleData } from '@shared/utils'
import { articleLoader } from '@shared/libs/allLoader'
import CustomLink from '@shared/components/customLink'

const ArticleBig = dynamic(() => import('@shared/components/article/articleBig'), { loading: () => articleLoader(['g']) })
const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared/components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const ArticleMedium = dynamic(() => import('@shared/components/article/articleMedium'), { loading: () => articleLoader(['s']) })
const ArticleList = dynamic(() => import('@shared/components/article/articleList'))
const NoData = dynamic(() => import('@noData'), { ssr: false })
// const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

function HomePageVideo() {
  const [video, setVideo] = useState([])
  const [loading, setLoading] = useState(true)
  const payload = useRef({ nLimit: 5, nSkip: 1 })
  const total = useRef(0)
  const isLoading = useRef(false)

  const { data, loading: loadingData, fetchMore } = useQuery(HOME_PAGE_VIDEO, {
    variables: { input: payload.current },
    onCompleted: () => {
      setLoading(false)
    }
  })

  useEffect(() => {
    if (data?.getHomePageVideo?.aResults?.length) {
      total.current = data?.getHomePageVideo?.nTotal
      const article = data?.getHomePageVideo?.aResults
      setVideo([...video, ...mapArticleData(article)])
    }
  }, [data])

  useEffect(() => {
    if (video?.length) {
      isLoading.current = false
      setLoading(false)
      isBottomReached(video[video.length - 1]?._id, isReached)
    }
  }, [video])

  function isReached(reach) {
    if (reach && video?.length < total.current && !isLoading.current) {
      isLoading.current = true
      setLoading(true)
      payload.current.nSkip += 1
      fetchMore({
        variables: { input: payload.current }
      })
    }
  }
  return (
    <>
      {video?.length !== 0 && (
        video?.map((vid, ind) => {
          return (
            <React.Fragment key={vid._id}>
              {/* {(ind === 2) && (
                <Ads
                  id="div-ad-gpt-138639789-1660201960-0"
                  adIdDesktop="Crictracker2022_Desktop_HP_MID_336x280"
                  dimensionDesktop={[336, 280]}
                  className={'text-center mb-2'}
                />
              )} */}
              <section id={vid._id} className={`${styles.homeArticles} mb-3 mb-md-4`}>
                <h4 className="line-title mb-2 mb-md-4 text-uppercase text-center overflow-hidden">
                  <CustomLink href={vid?.oCategory?.eType === 's' ? `/${vid?.oSeo?.sSlug}/?tab=videos` : allRoutes.seriesVideos(`/${vid?.oSeo?.sSlug}/`)} prefetch={false}>
                    <a className="rounded-pill position-relative d-inline-block"><span className="d-block text-nowrap overflow-hidden t-ellipsis">{vid?.sName}</span></a>
                    {/* <Button variant="link" className="d-flex align-items-center justify-content-center active">
            <NotificationIcon />
          </Button> */}
                  </CustomLink>
                </h4>
                {vid.aVideos.map((ar) => {
                  if (ar.sType === 'nBig') {
                    return <ArticleBig data={ar} key={ar._id} isVideo />
                  } else if (ar.sType === 'nMed') {
                    return <ArticleMedium data={ar} key={ar._id} isVideo />
                  } else if (ar.sType === 'nSmall') {
                    return <ArticleSmall data={ar} key={ar._id} isVideo />
                  } else if (ar.sType === 'nGrid') {
                    return (
                      <Row className={`gx-2 flex-nowrap article-grid-list scroll-list ${styles.articleGridList}`} key={ar.sType}>
                        {ar.mappedArticle.map((g) => {
                          return (
                            <Col key={g._id} xl={4} md={5} sm={5} xs="auto">
                              <ArticleGrid isVideo data={g} />
                            </Col>
                          )
                        })}
                      </Row>
                    )
                  } else if (ar.sType === 'nMedGrid') {
                    return (
                      <Row className={`gx-2 gx-md-3 common-box mb-2 ${styles.articleGridList} ${styles.articleGroup}`} key={ar.sType}>
                        {ar.mappedArticle.map((g) => {
                          return (
                            <Col key={g._id} sm={6}>
                              <ArticleGrid isVideo data={g} />
                            </Col>
                          )
                        })}
                      </Row>
                    )
                  } else if (ar.sType === 'nList') {
                    return <ArticleList isVideo data={ar.mappedArticle} key={ar.sType} />
                  }
                  return null
                })}
                <CustomLink href={vid?.oCategory?.eType === 's' ? `/${vid?.oSeo?.sSlug}/?tab=videos` : allRoutes.seriesVideos(`/${vid?.oSeo?.sSlug}/`)} className="theme-btn w-100 btn btn-primary" prefetch={false}>
                  <a className="theme-btn w-100 btn btn-primary">
                    <Trans i18nKey="common:MoreFrom" /> {vid.sName} &gt;
                  </a>
                </CustomLink>
              </section>
            </React.Fragment>
          )
        })
      )}
      {(loading || loadingData) && articleLoader(['g', 's', 's'])}
      {(video?.length === 0 && !loading) && <NoData />}
    </>
  )
}
export default HomePageVideo
