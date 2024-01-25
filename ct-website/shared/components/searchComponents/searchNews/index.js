import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import { GET_SEARCH_NEWS } from '@graphql/search/search.query'
import { isBottomReached } from '@shared/utils'

const ArticleSkeleton = dynamic(() => import('@shared/components/skeleton/components/articleSkeleton'), { ssr: false })
const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })
const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => <ArticleSkeleton type="s" /> })

function SearchNews({ news }) {
  const router = useRouter()
  const [data, setData] = useState(news?.aResults || [])
  const payload = useRef({ nLimit: 10, nSkip: 1, sSearch: router?.query?.q, sSortBy: 'dCreated', nOrder: -1 })
  const [loading, setLoading] = useState(false)
  const isLoading = useRef(false)
  const [getNews, { data: newsData }] = useLazyQuery(GET_SEARCH_NEWS, { variables: { input: payload.current } })

  const latestNews = useRef(newsData?.getArticleSearch?.aResults?.length || news?.aResults?.length)

  useEffect(() => {
    isLoading.current = false
    setLoading(false)
    isBottomReached(data[data.length - 1]?._id, isReached)
  }, [data])

  useEffect(() => {
    if (newsData?.getArticleSearch?.aResults) {
      setData([...data, ...newsData.getArticleSearch.aResults])
      latestNews.current = newsData?.getArticleSearch?.aResults?.length || news?.aResults?.length
    }
  }, [newsData])

  function isReached(reach) {
    if (reach && latestNews.current === payload.current.nLimit && !isLoading.current) {
      isLoading.current = true
      setLoading(true)
      payload.current.nSkip += 1
      getNews()
    }
  }

  return (
    <>
      <h4 className="text-uppercase">
        <Trans i18nKey="common:News" />
      </h4>
      {data?.map((n) => {
        return <ArticleSmall key={n._id} isLarge={true} data={n} />
      })}
      {loading && (
        <>
          <ArticleSkeleton type="s" />
          <ArticleSkeleton type="s" />
        </>
      )}
      {data?.length === 0 && <NoData />}
    </>
  )
}
SearchNews.propTypes = {
  news: PropTypes.object
}
export default SearchNews
