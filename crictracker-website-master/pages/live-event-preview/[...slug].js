import React, { useEffect } from 'react'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import { setPreviewMode } from '@shared/libs/menu'
import { pageLoading } from '@shared/libs/allLoader'
import { handleApiError } from '@shared/utils'
const LiveArticle = dynamic(() => import('@shared/components/articleDetail/liveArticle'))

const LiveEventPreview = ({ article }) => {
  setPreviewMode(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.add('light-mode')
    }
  }, [])

  useEffect(() => {
    if (!router.query.token) {
      handleError()
    }
  }, [router])

  function handleError() {
    router.replace('/404')
  }

  if (article) {
    return <div className=' common-section '>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-2'></div>
          <div className='col-lg-8 common-box p-3'>
            <LiveArticle liveArticleList={article?.oLiveArticleList} liveArticleEvent={article?.oLiveArticleEvent} liveEventId={article?.iEventId} />
          </div>
          <div className='col-lg-2'></div>
        </div>
      </div>
    </div >
  } else return pageLoading()
}

export default LiveEventPreview

LiveEventPreview.propTypes = {
  article: PropTypes.object,
  seoData: PropTypes.object
}

export async function getServerSideProps({ params, query, resolvedUrl }) {
  try {
    const iEventId = params.slug?.[0]
    const { getLiveArticleData } = (await import('@shared/libs/live-article'))
    const { oLiveArticleList, oLiveArticleEvent } = await getLiveArticleData({ iEventId, token: query?.token })
    return { props: { article: { iEventId, oLiveArticleList, oLiveArticleEvent } } }
  } catch (e) {
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
