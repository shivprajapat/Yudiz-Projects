import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import { GOOGLE_NEWS_LINK, TELEGRAM_NEWS_LINK, INSTAGRAM_URL, YOUTUBE_URL, TWITTER_URL, THREADS_URL } from '@shared/constants'
import google from '@assets/images/icon/google-news-icon.svg'
import telegram from '@assets/images/icon/telegram-color-icon.svg'
import youtube from '@assets/images/icon/youtube-color-icon.svg'
import instagram from '@assets/images/icon/instagram-color-icon.svg'
import twitter from '@assets/images/icon/twitter-color-icon.svg'
import threads from '@assets/images/icon/threads-logo.svg'
const MyImage = dynamic(() => import('@shared/components/myImage'))

function FollowUs({ className }) {
  const { t } = useTranslation()
  return (
    <div className={`${styles.followUs} ${className} p-1 py-md-3 px-xl-4 d-flex align-items-center justify-content-around br-sm overflow-hidden`}>
      <p className="font-semi mb-0">
        <span className="d-none d-md-inline">{t('common:GetEveryCricketUpdates')} </span>
        {t('common:FollowUsOn')}:
      </p>
      <div className={`${styles.followList} d-flex justify-content-around`}>
        <a href={GOOGLE_NEWS_LINK} target="_blank" className={`${styles.follow} mx-1`} rel="noreferrer">
          <span className={`${styles.icon} d-block`}>
            <MyImage src={google} alt="google" layout="responsive" height="32" width="32" />
          </span>
        </a>
        <a href={TELEGRAM_NEWS_LINK} target="_blank" className={`${styles.follow} mx-1`} rel="noreferrer">
          <span className={`${styles.icon} d-block`}>
            <MyImage src={telegram} alt="telegram" layout="responsive" height="32" width="32" />
          </span>
        </a>
        <a href={INSTAGRAM_URL} target="_blank" className={`${styles.follow} mx-1`} rel="noreferrer">
          <span className={`${styles.icon} d-block`}>
            <MyImage src={instagram} alt="instagram" layout="responsive" height="32" width="32" />
          </span>
        </a>
        <a href={YOUTUBE_URL} target="_blank" className={`${styles.follow} mx-1`} rel="noreferrer">
          <span className={`${styles.icon} d-block`}>
            <MyImage src={youtube} alt="youtube" layout="responsive" height="32" width="32" />
          </span>
        </a>
        <a href={THREADS_URL} target="_blank" className={`${styles.follow} mx-1`} rel="noreferrer">
          <span className={`${styles.icon} d-block`}>
            <MyImage src={threads} alt="threads" layout="responsive" height="32" width="32" />
          </span>
        </a>
        <a href={TWITTER_URL} target="_blank" className={`${styles.follow} mx-1`} rel="noreferrer">
          <span className={`${styles.icon} d-block`}>
            <MyImage src={twitter} alt="twitter" layout="responsive" height="32" width="32" />
          </span>
        </a>
      </div>
    </div>
  )
}

FollowUs.propTypes = {
  className: PropTypes.string
}
export default FollowUs
