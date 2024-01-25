import React from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import { WarningIcon } from '../../ctIcons'
import { TELEGRAM_NEWS_LINK } from '@shared/constants'
import telegram from '../../../../assets/images/icon/telegram-share.png'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const TipsNote = (props) => {
  const { t } = useTranslation()
  return (
    <>
      <section className="common-section pb-0">
        <div className={`${styles.tipsNote} ${styles.note} bg-info`}>
          <p className={`${props?.fantasystyles?.itemTitle} ${styles.itemTitle} text-primary font-bold text-uppercase`}>
            {t('common:Note')}
          </p>
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
            {t('common:InformationOnTelegram')}
            <a href={TELEGRAM_NEWS_LINK} target="_blank" className={`${props.mainstyles.follow} ms-0 ms-md-2 mt-2 mt-md-0 theme-btn outline-btn small-btn flex-shrink-0`} rel="noreferrer">
              <span className={`${props.mainstyles.icon} d-inline-block`}>
                <MyImage src={telegram} alt="google" layout="responsive" />
              </span>
              {t('common:Telegram')}
            </a>
          </div>
        </div>
      </section>
      <section className="common-section pb-0">
        <div className={`${styles.tipsNote}`}>
          <p className={`${props?.fantasystyles?.itemTitle} text-primary font-bold text-uppercase d-flex align-items-center`}>
            <span className="me-2 d-block">
              <WarningIcon />
            </span>
            {t('common:Disclaimer')}
          </p>
          <div>{t('common:OwnDecisionNote')}</div>
        </div>
      </section>
    </>
  )
}

TipsNote.propTypes = {
  fantasystyles: PropTypes.any,
  mainstyles: PropTypes.any,
  title: PropTypes.any,
  info: PropTypes.any
}

export default TipsNote
