import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './../style.module.scss'
import { useQuery } from '@apollo/client'
import { HOME_FANTASY_ARTICLE } from '@graphql/home/home.query'
import { isBottomReached } from '@shared/utils'
import { articleLoader } from '@shared/libs/allLoader'
import useWindowSize from '@shared/hooks/windowSize'

const ArticleBig = dynamic(() => import('@shared/components/article/articleBig'), { loading: () => articleLoader(['g']) })
const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleMedium = dynamic(() => import('@shared/components/article/articleMedium'), { loading: () => articleLoader(['s']) })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const NoData = dynamic(() => import('@noData'), { ssr: false })
// const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

function HomePageFantasyArticle({ articles }) {
  const [article, setArticle] = useState(articles || [])
  const [loading, setLoading] = useState(true)
  const payload = useRef({ nLimit: 5, nSkip: 1, nOrder: -1, sSortBy: 'dPublishDisplayDate' })
  const [width] = useWindowSize()
  const total = useRef(6)
  const isLoading = useRef(false)

  const { data, loading: loadingData, fetchMore } = useQuery(HOME_FANTASY_ARTICLE, {
    variables: { input: payload.current },
    onCompleted: () => {
      setLoading(false)
    }
  })

  useEffect(() => {
    if (article?.length) {
      isLoading.current = false
      setLoading(false)
      isBottomReached(article[article.length - 1]?._id, isReached)
    }
  }, [article])

  useEffect(() => {
    if (data?.listFrontFantasyArticle) handleArticleResponse(data?.listFrontFantasyArticle)
  }, [data])

  function isReached(reach) {
    if (reach && total.current !== 0 && !isLoading.current) {
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
    setArticle([...article, ...data?.aResults])
  }
  return (
    <>
      {article?.length !== 0 && (
        <section className={`${styles.homeArticles} mb-3 mb-md-4`}>
          <div className="line-title mb-2 mb-md-4 text-uppercase text-center overflow-hidden">
            <h4 className="rounded-pill position-relative d-inline-block">
              <Trans i18nKey="common:FantasyNews" />
            </h4>
          </div>
          {article?.map((ar, i) => {
            if (i % 7 === 0) {
              return (
                <React.Fragment key={ar._id}>
                  {/* {i === 14 && (
                    <Ads
                      id="div-ad-gpt-138639789-1660201960-0"
                      adIdDesktop="Crictracker2022_Desktop_HP_MID_336x280"
                      dimensionDesktop={[336, 280]}
                      className={'text-center mb-2'}
                    />
                  )} */}
                  <ArticleBig data={ar} />
                  {(((i + 1) % 4 === 0) && (width < 991)) && <AllWidget show={width < 991} index={((i + 1) / 4) - 1} />}
                </React.Fragment>
              )
            } else if (i % 7 === 3) {
              return (
                <React.Fragment key={ar._id}>
                  <ArticleMedium data={ar} />
                  {(((i + 1) % 4 === 0) && (width < 991)) && <AllWidget show={width < 991} index={((i + 1) / 4) - 1} />}
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment key={ar._id}>
                  <ArticleSmall data={ar} />
                  {(((i + 1) % 4 === 0) && (width < 991)) && <AllWidget show={width < 991} index={((i + 1) / 4) - 1} />}
                </React.Fragment>
              )
            }
          })}
        </section>
      )}
      {(loading || loadingData) && articleLoader(['g', 's', 's'])}
      {(article?.length === 0 && !loading) && <NoData />}
    </>
  )
}
HomePageFantasyArticle.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object)
}
export default HomePageFantasyArticle
