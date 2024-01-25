import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import PropTypes from 'prop-types'

import { GOOGLE_NEWS_LINK, TELEGRAM_NEWS_LINK, INSTAGRAM_URL, YOUTUBE_URL, TWITTER_URL } from '@shared/constants'

function FollowUsAMP({ className }) {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom >{`
      .followUs{background:var(--theme-light);border-radius:8px}.followUs p{color:var(--theme-dark2)}.followList{width:calc(100% - 110px)}.justify-content-around{justify-content:space-around}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <div className={`followUs ${className} p-2 d-flex align-items-center justify-content-around`}>
        <p className="font-semi mb-0">
          <span className="d-none d-md-inline">{t('common:GetEveryCricketUpdates')} </span>
          {t('common:FollowUsOn')}:
        </p>
        <div className="d-flex followList justify-content-around">
          <a href={GOOGLE_NEWS_LINK} target="_blank" className="follow" rel="noreferrer">
            <span className="icon d-block">
              <amp-img src="/static/google-news-icon.svg" alt="google" width="24" height="24" layout="fixed" >
              </amp-img>
            </span>
          </a>
          <a href={TELEGRAM_NEWS_LINK} target="_blank" className="follow" rel="noreferrer">
            <span className="icon d-block">
              <amp-img src="/static/telegram-color-icon.svg" alt="google" layout="fixed" height="24" width="24">
              </amp-img>
            </span>
          </a>
          <a href={INSTAGRAM_URL} target="_blank" className="follow" rel="noreferrer">
            <span className="icon d-block">
              <amp-img src="/static/instagram-color-icon.svg" alt="google" layout="fixed" height="24" width="24">
              </amp-img>
            </span>
          </a>
          <a href={YOUTUBE_URL} target="_blank" className="follow" rel="noreferrer">
            <span className="icon d-block">
              <amp-img src="/static/youtube-color-icon.svg" alt="google" layout="fixed" height="24" width="24">
              </amp-img>
            </span>
          </a>
          <a href={TWITTER_URL} target="_blank" className="follow" rel="noreferrer">
            <span className="icon d-block">
              <amp-img src="/static/twitter-color-icon.svg" alt="google" layout="fixed" height="24" width="24">
              </amp-img>
            </span>
          </a>
        </div>
      </div>
    </>
  )
}

FollowUsAMP.propTypes = {
  className: PropTypes.string
}
export default FollowUsAMP
