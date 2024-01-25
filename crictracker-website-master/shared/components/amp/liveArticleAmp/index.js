import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import LiveBlogCardAmp from './liveBlogCardAmp'
import EventTimerAmp from '@shared/components/amp/liveArticleAmp/eventTimerAmp'
import EventMatchCardAmp from '@shared/components/amp/liveArticleAmp/eventMatchCardAmp'
import { ARTICLE_REST_URL } from '@shared/constants'
import useTranslation from 'next-translate/useTranslation'

export default function LiveArticleAmp({ liveArticleList, liveArticleEvent, liveEventId }) {
  const { t } = useTranslation()
  const liveArticleListLastIndex = liveArticleList?.length - 1
  const lastsEventId = liveArticleListLastIndex >= 14 ? liveArticleList[liveArticleListLastIndex]?.sEventId : ''
  return (
    <>
      <style jsx amp-custom global>
        {`
.liveMain{border-left:1px solid var(--border-light);padding-bottom:10px}div[role=list]{padding:0px 8px}.live-update-btn{position:fixed;bottom:70px;z-index:999999999;left:50%;transform:translateX(-50%);cursor:pointer}button[load-more-clickable=""]{height:28px;padding:0 10px;background-color:#5090f6;font-size:12px}.noLiveArticles{margin:8px 0;padding:16px;text-align:center}/*# sourceMappingURL=style.css.map */

     `}
      </style>
      <Head>
        <script async custom-element="amp-list" src="https://cdn.ampproject.org/v0/amp-list-0.1.js"></script>
        <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
        <script async custom-element="amp-date-display" src="https://cdn.ampproject.org/v0/amp-date-display-0.1.js"></script>
      </Head>

      {liveArticleEvent?.oMatch || liveArticleEvent?.oTeams ? <EventMatchCardAmp data={liveArticleEvent} liveEventId={liveEventId} /> : null}

      <EventTimerAmp data={liveArticleEvent?.dEventDate} />

      <amp-live-list
        id="live-blog-list"
        data-poll-interval="16000"
        data-max-items-per-page="150"
      >

        <div update='' >
          <button on='tap:live-blog-list.update' className='live-update-btn theme-btn small-btn btn btn-primary' id='live-update-btn'>
            new updates
          </button>
        </div>
        <div items='' className={`${liveArticleList?.length ? 'liveMain' : ''} mt-4 mx-2`}>
          {liveArticleList?.map((liveArticle, index) => (
            <LiveBlogCardAmp key={liveArticle._id} data={liveArticle} lastArticle={liveArticleListLastIndex === index} />
          ))}
        </div>
      </amp-live-list>
      {liveArticleList?.length === 0 && <div className='noLiveArticles'>{t('common:NoLiveArticlesYet')}</div>}
      <template type="amp-mustache" id="date-template">
        {'{{ monthNameShort }}'} {'{{ day }}'} {'{{ year }}'} {'{{ hour12 }}'}:{'{{ minuteTwoDigit }}'} {'{{ dayPeriod }}'}
      </template >

      <amp-list
        height='100'
        width='auto'
        layout='fixed-height'
        className={ARTICLE_REST_URL}
        src={`${ARTICLE_REST_URL}/api/listLiveBlogContent?sEventId=${lastsEventId}&iEventId=${liveEventId}&nLimit=5`}
        // src={`https://article.crictracker.com/api/listLiveBlogContent?sEventId=${lastsEventId}&iEventId=${liveEventId}&nLimit=5`}
        binding="no"
        load-more="manual"
        load-more-bookmark="next"
      >
        <template type="amp-mustache">
          <LiveBlogCardAmp isTemplate />
        </template>
        <amp-list-load-more load-more-end=''></amp-list-load-more>
        <div fallback=''>
          FALLBACK
        </div>
        <div placeholder=''>
          Loading...
        </div>

      </amp-list>
    </>
  )
}

LiveArticleAmp.propTypes = {
  data: PropTypes.object,
  liveArticleList: PropTypes.arrayOf(PropTypes.object),
  liveArticleEvent: PropTypes.object,
  liveEventId: PropTypes.string
}
