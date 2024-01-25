import { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'

import { GET_FANTASY_ARTICLE_TOTAL_CLAP, GET_NEWS_ARTICLE_TOTAL_CLAP, GET_USER_CLAP, GET_USER_FANTASY_CLAP } from '@graphql/article/article.query'
import { ADD_CLAP, ADD_FANTASY_CLAP } from '@graphql/article/article.mutation'
import { getToken } from '@shared/libs/token'
import { setCookie } from '@shared/utils'

function useArticleLikeComment({ article, isPreview }) {
  const [currentClap, setCurrentClap] = useState(0)
  const [totalClaps, setTotalClaps] = useState(article?.nClaps)
  const [commentCount, setCommentCount] = useState(article?.nCommentCount || 0)
  const [showComments, setShowComments] = useState(false)
  const token = getToken()

  const [getNewsArticleClap] = useLazyQuery(GET_NEWS_ARTICLE_TOTAL_CLAP, {
    fetchPolicy: 'network-only',
    variables: { input: { _id: article?._id } },
    onCompleted: (data) => {
      setTotalClaps(data?.getNewsArticleTotalClaps?.nTotalClap)
    }
  })

  const [getUserClap] = useLazyQuery(GET_USER_CLAP, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data && data?.getUserArticleClap) {
        setCurrentClap(data?.getUserArticleClap?.nTotalClap)
      }
    }
  })

  const [getFantasyArticleClap] = useLazyQuery(GET_FANTASY_ARTICLE_TOTAL_CLAP, {
    fetchPolicy: 'network-only',
    variables: { input: { _id: article?._id } },
    onCompleted: (data) => {
      setTotalClaps(data?.getFantasyArticleTotalClaps?.nTotalClap)
    }
  })

  const [getUserFantasyClap] = useLazyQuery(GET_USER_FANTASY_CLAP, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data && data?.getUserFantasyArticleClap) {
        setCurrentClap(data?.getUserFantasyArticleClap?.nTotalClap)
      }
    }
  })

  const [addClap] = useMutation(ADD_CLAP)
  const [addFantasyClap] = useMutation(ADD_FANTASY_CLAP)

  function addGuestUserClaps(articleId, claps) {
    setCookie({ cName: articleId, cValue: claps, exDays: 2 })
  }

  function handleClap() {
    if (currentClap < 5) {
      setTotalClaps(totalClaps + 1)
      if (token) addGuestUserClaps(article._id, currentClap + 1)
      if (article?.oSeo?.eType === 'ar') {
        addClap({ variables: { input: { iArticleId: article?._id } } })
      } else {
        addFantasyClap({ variables: { input: { iArticleId: article?._id } } })
      }
      setCurrentClap(currentClap + 1)
    }
  }

  useEffect(() => {
    if (!isPreview) {
      if (token) {
        if (article?.oSeo?.eType === 'ar') {
          getUserClap({ variables: { input: { iArticleId: article?._id } } })
        } else {
          getUserFantasyClap({ variables: { input: { iArticleId: article?._id } } })
        }
      } else {
        if (article?.oSeo?.eType === 'ar') {
          getNewsArticleClap()
        } else {
          getFantasyArticleClap()
        }
      }
    }
  }, [article])

  return {
    currentClap,
    setCurrentClap,
    totalClaps,
    commentCount,
    setCommentCount,
    showComments,
    setShowComments,
    // getNewsArticleClap,
    // getUserClap,
    // getUserFantasyClap,
    // getFantasyArticleClap,
    handleAddClap: handleClap
  }
}
export default useArticleLikeComment
