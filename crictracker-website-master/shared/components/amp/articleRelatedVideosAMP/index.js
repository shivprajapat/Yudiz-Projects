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
const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => articleLoader(['s']) })

export default function ArticleRelatedVideosAMP({ categoryId, articleId, type }) {
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

  return (
    <>
      <h1>{articleId},{categoryId},{type}, {isVideoList}</h1>
      {articles && <section className={`${styles.articleRelatedVideos}`}>
        {
          isVideoList ? <h3 className="small-head text-uppercase"><Trans i18nKey="common:TrendingVideo" /></h3> : <h3 className="small-head text-uppercase"><Trans i18nKey="common:RelatedStories" /></h3>
        }
        {
          articles?.map(video => {
            return <ArticleSmall isVideo={isVideoList} key={video._id} isLarge={true} data={video} />
          })
        }
      </section>}
    </>
  )
}

ArticleRelatedVideosAMP.propTypes = {
  categoryId: PropTypes.string,
  articleId: PropTypes.string,
  type: PropTypes.string
}
