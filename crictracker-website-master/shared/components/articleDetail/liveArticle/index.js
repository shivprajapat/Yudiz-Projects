import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import style from './style.module.scss'
import liveArtcleStyle from './liveBlogCard/style.module.scss'
import dynamic from 'next/dynamic'
import { Button } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery, useSubscription } from '@apollo/client'
import { isBottomReached, notificationSound } from '@shared/utils'
import { liveArticleListLoader } from '@shared/libs/allLoader'
import { GET_LIVE_BLOGS } from '@graphql/article/article.query'
import { GET_LIVE_BLOG_SUBSCRIPTION } from '@graphql/article/article.subscription'
import EventMatchCard from '@shared/components/articleDetail/liveArticle/eventMatchCard'
const LiveBlogCard = dynamic(() => import('@shared/components/articleDetail/liveArticle/liveBlogCard'))
const EventTimer = dynamic(() => import('@shared/components/articleDetail/liveArticle/eventTimer'))

function LiveArticle({ setTimelineData, liveArticleList, liveArticleEvent, liveEventId, disableMatchCard, ...props }) {
  const { t } = useTranslation()
  const [showTimer, setShowTimer] = useState(new Date().getTime() < liveArticleEvent?.dEventDate)
  const [liveBlogData, setLiveBlogsData] = useState(liveArticleList)
  const [enableBtn, setEnableBtn] = useState(liveArticleList?.length >= 15)
  const btnDisabled = useRef(false)
  const loading = useRef(false)
  const lastData = useRef(0)
  const payloads = useRef({
    nLimit: 15,
    iEventId: liveEventId,
    sEventId: liveArticleList?.[liveArticleList?.length - 1]?.sEventId
  })

  function setLiveBlogs(data) {
    setLiveBlogsData(data)
    setTimelineData && setTimelineData(data)
  }

  const handleHideTimer = () => setShowTimer(false)

  const [getMoreLiveBlogs, { data: updatedLiveBlogs, loading: isContentLoading }] = useLazyQuery(GET_LIVE_BLOGS, { onCompleted: () => { } })

  const operations = {
    delete: (data) => setLiveBlogs(liveBlogData.filter(lb => lb._id !== data?._id)),
    update: (data) => setLiveBlogs(liveBlogData.map(lb => lb._id === data?._id ? data : lb)),
    add: (data) => {
      notificationSound()
      setLiveBlogs(LiveBlogs => [data, ...LiveBlogs])
    }
  }

  typeof window !== 'undefined' && useSubscription(GET_LIVE_BLOG_SUBSCRIPTION, {
    variables: { input: { iEventId: liveEventId } },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      operations[data?.listLiveBlogContent?.eOpType || 'add'](data?.listLiveBlogContent?.liveBlogContent)
    }
  })

  const handleLoadMore = () => {
    getMoreLiveBlogs({ variables: { input: { ...payloads.current } } })
    setEnableBtn(false)
    btnDisabled.current = true
  }

  useEffect(() => {
    if (liveBlogData?.length) {
      const lastItem = liveBlogData?.[liveBlogData?.length - 1]
      const id = `${lastItem?._id}_${lastItem?.iEventId}_${lastItem?.sEventId}`
      payloads.current.sEventId = lastItem?.sEventId
      payloads.current.iEventId = lastItem?.iEventId
      if (btnDisabled.current) {
        loading.current = false
        isBottomReached(id, isReached)
      }
    }
  }, [liveBlogData])

  useEffect(() => {
    if (updatedLiveBlogs) {
      setLiveBlogs([...liveBlogData, ...updatedLiveBlogs?.listLiveBlogContentFront?.aResults])
      lastData.current = updatedLiveBlogs?.listLiveBlogContentFront?.aResults?.length
    }
  }, [updatedLiveBlogs])

  async function isReached(reach) {
    if (reach && !loading.current && lastData.current > 14) {
      loading.current = true
      getMoreLiveBlogs({ variables: { input: { ...payloads.current } } })
    }
  }

  return (
    <div {...props}>
      {!disableMatchCard ? <>
        {/* live Event MatchScore */}
        {liveArticleEvent?.oMatch || liveArticleEvent?.oTeams ? <EventMatchCard data={liveArticleEvent} liveEventId={liveEventId} /> : null}

        {/* live Event Countdown */}
        {showTimer && <EventTimer data={liveArticleEvent?.dEventDate} showTimer={showTimer} handleHideTimer={handleHideTimer} />}
      </> : null}
      {/* live article cards */}
      {
        liveBlogData?.length ? (<div className={`${style.liveMain} w-100 my-4 pb-2`}>
          {liveBlogData.map((liveBlog) => <LiveBlogCard data={liveBlog} key={liveBlog._id} />)}
          {isContentLoading && liveArticleListLoader(liveArtcleStyle)}
        </div>) : <div className={`${style.noLiveArticles} light-bg text-center p-3 my-3 br-lg overflow-hidden`}>{t('common:NoLiveArticlesYet')}</div>
      }
      {
        enableBtn && <div className="text-center my-3">
          <Button className="theme-btn" onClick={handleLoadMore}>{t('common:LoadMore')}</Button>
        </div>
      }
    </div >
  )
}

LiveArticle.propTypes = {
  liveArticleList: PropTypes.array,
  liveArticleEvent: PropTypes.object,
  liveEventId: PropTypes.string,
  setTimelineData: PropTypes.func,
  disableMatchCard: PropTypes.bool
}
export default LiveArticle
