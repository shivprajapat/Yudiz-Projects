import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import Trans from 'next-translate/Trans'
import { useLazyQuery } from '@apollo/client'
import { GET_RELATED_STORIES } from '@graphql/article/article.query'
import { GET_FANTASY_RELATED_STORIES } from '@graphql/fantasy-tips/fantasy-tips.query'
import { articleLoader } from '@shared/libs/allLoader'

const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => articleLoader(['s']) })

function RelatedArticle({ type, categoryId, articleId }) {
  const [article, setArticles] = useState([])

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

  useEffect(() => {
    if (type === 'ar') {
      getArticle({
        variables: {
          input: {
            oGetRelatedStoriesIdInput: { iCategoryId: categoryId, iArticleId: articleId }, oPaginationInput: { nSkip: 1, nLimit: 3 }
          }
        }
      })
    } else {
      getFantasyArticle({
        variables: {
          input: {
            oGetRelatedFantasyStoriesIdInput: { iCategoryId: categoryId, iFantasyArticleId: articleId }, oPaginationInput: { nSkip: 1, nLimit: 3 }
          }
        }
      })
    }
  }, [])

  if (article?.length) {
    return (
      <>
        <h4 className="text-uppercase">
          <Trans i18nKey="common:latestArticle" />
        </h4>
        <section>
          {article.map((a, i) => <ArticleSmall data={a} key={`${i}${a?._id}`} />)}
        </section>
      </>
    )
  } else return null
}

RelatedArticle.propTypes = {
  type: PropTypes.string,
  categoryId: PropTypes.string,
  articleId: PropTypes.string
}

export default RelatedArticle
