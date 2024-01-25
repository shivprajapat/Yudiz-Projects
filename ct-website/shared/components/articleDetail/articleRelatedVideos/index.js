import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import { articleLoader } from '@shared/libs/allLoader'
import { GET_TRENDING_VIDEO } from '@graphql/videos/videos.query'
import { GET_RELATED_STORIES } from '@graphql/article/article.query'
import { GET_FANTASY_RELATED_STORIES } from '@graphql/fantasy-tips/fantasy-tips.query'
import Slider from '@shared/components/slider'
import { sendMobileWebViewEvent } from '@shared/utils'
import { useRouter } from 'next/router'
const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => articleLoader(['s']) })

export default function ArticleRelatedVideos({ categoryId, articleId, type }) {
  const router = useRouter()
  const [articles, setArticles] = useState()
  const [isVideoList, setIsVideoList] = useState(true)
  const [getArticle] = useLazyQuery(GET_RELATED_STORIES, {
    onCompleted: (data) => {
      if (data) {
        setArticles(data.getRelatedStories?.aResults)
      }
    }
  })

  const [getFantasyArticle] = useLazyQuery(GET_FANTASY_RELATED_STORIES, {
    onCompleted: (data) => {
      if (data) {
        setArticles(data.getRelatedFantasyStories?.aResults)
      }
    }
  })

  const [getVideos] = useLazyQuery(GET_TRENDING_VIDEO, {
    onCompleted: (data) => {
      if (data?.getTrendingVideos?.aResults.length !== 0) {
        setArticles(data?.getTrendingVideos?.aResults)
      } else {
        setIsVideoList(false)
        getArticle({ variables: { input: { oGetRelatedStoriesIdInput: { iCategoryId: categoryId, iArticleId: articleId }, oPaginationInput: { nSkip: 1, nLimit: 6 } } } })
      }
    }
  })

  useEffect(() => {
    if (type === 'ar') {
      getVideos({ variables: { input: { nSkip: 1, nLimit: 6 } } })
    } else {
      setIsVideoList(false)
      getFantasyArticle({ variables: { input: { oGetRelatedFantasyStoriesIdInput: { iCategoryId: categoryId, iFantasyArticleId: articleId }, oPaginationInput: { nSkip: 1, nLimit: 6 } } } })
    }
  }, [type])

  const handleEvent = (isVideoList, id) => {
    if (router?.query?.isMobileWebView) {
      sendMobileWebViewEvent(`${isVideoList ? 'video' : 'article'}:${id}`)
    }
  }

  return (
    <>
      {articles && <section className={`${styles.articleRelatedVideos}`}>
        {
          isVideoList ? <h3 className="small-head text-uppercase"><Trans i18nKey="common:TrendingVideo" /></h3> : <h3 className="small-head text-uppercase"><Trans i18nKey="common:RelatedStories" /></h3>
        }
        <Slider nav autoplay single>
          {
            articles?.map(video => {
              return (
                <div key={video._id} className={`${styles.item}`} onClick={() => handleEvent(isVideoList, video?._id)}>
                  <ArticleSmall isVideo={isVideoList} isLarge={true} data={video} />
                </div>
              )
            })
          }
        </Slider>

      </section>}
    </>
  )
}

ArticleRelatedVideos.propTypes = {
  categoryId: PropTypes.string,
  articleId: PropTypes.string,
  type: PropTypes.string
}
