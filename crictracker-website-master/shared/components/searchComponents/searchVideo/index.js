import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import { GET_SEARCH_VIDEO } from '@graphql/search/search.query'
import { isBottomReached } from '@shared/utils'

const ArticleSkeleton = dynamic(() => import('@shared/components/skeleton/components/articleSkeleton'), { ssr: false })
const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })
const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => <ArticleSkeleton type="s" /> })

function SearchVideo({ video }) {
  const router = useRouter()
  const [data, setData] = useState(video?.aResults || [])
  const [loading, setLoading] = useState(false)
  const payload = useRef({ nLimit: 10, nSkip: 1, sSearch: router?.query?.q, sSortBy: 'dCreated', nOrder: -1 })
  const isLoading = useRef(false)
  const [getVideo, { data: videoData }] = useLazyQuery(GET_SEARCH_VIDEO, { variables: { input: payload.current } })

  const latestVideo = useRef(videoData?.getVideoSearch?.aResults?.length || video?.aResults?.length)

  useEffect(() => {
    isLoading.current = false
    setLoading(false)
    isBottomReached(data[data.length - 1]?._id, isReached)
  }, [data])

  useEffect(() => {
    if (videoData?.getVideoSearch?.aResults) {
      setData([...data, ...videoData.getVideoSearch.aResults])
      latestVideo.current = videoData?.getVideoSearch?.aResults?.length
    }
  }, [videoData])

  function isReached(reach) {
    if (reach && latestVideo.current === payload.current.nLimit && !isLoading.current) {
      isLoading.current = true
      setLoading(true)
      payload.current.nSkip += 1
      getVideo()
    }
  }

  return (
    <>
      <h4 className="text-uppercase">
        <Trans i18nKey="common:Videos" />
      </h4>
      {data.map((v) => {
        return <ArticleSmall isVideo key={v._id} isLarge={true} data={v} />
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
SearchVideo.propTypes = {
  video: PropTypes.object
}
export default SearchVideo
