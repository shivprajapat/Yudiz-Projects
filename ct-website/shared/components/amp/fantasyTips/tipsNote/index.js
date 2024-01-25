import React from 'react'
import PropTypes from 'prop-types'

import { TELEGRAM_NEWS_LINK } from '@shared/constants'
import useTranslation from 'next-translate/useTranslation'

const TipsNote = (props) => {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>{`
        .d-flex{display:flex;display:-webkit-flex}.img{width:24px;margin-right:8px}.itemTitle{margin:0 0 12px;padding-bottom:12px;border-bottom:1px solid #e4e6eb;font-weight:600;text-transform:uppercase;color:#045de9;-webkit-align-items:center;align-items:center}.tipsNote{padding:12px;background:#f2f4f7;border-radius:16px}.tipsNote .icon{width:28px}.tipsNote.note{color:#0e3778;background:#e7f0ff}.tipsNote.note .itemTitle{border-bottom-color:#a6c8ff}.noteInfo{-webkit-align-items:center;align-items:center}.follow{margin:0 6px;padding:6px 16px 6px 48px;display:inline-block;font-size:12px;line-height:18px;font-weight:700;color:#045de9;border:1px solid #a6c8ff;border-radius:2em;position:relative;-webkit-align-items:center;align-items:center;text-decoration:none}.follow .icon{position:absolute;width:40px;left:-2px;top:50%;transform:translateY(-50%)}/*# sourceMappingURL=style.css.map */

      `}</style>
      <section className="common-section pb-0">
        <div className="tipsNote note bg-info">
          <p className="itemTitle text-primary font-bold text-uppercase">
            {t('common:Note')}
          </p>
          <div className="d-flex noteInfo flex-column flex-md-row align-items-start align-items-md-center">
            {t('common:InformationOnTelegram')}
            <a href={TELEGRAM_NEWS_LINK} target="_blank" rel="noreferrer" className="follow ms-0 ms-md-2 mt-2 mt-md-0 theme-btn outline-btn small-btn flex-shrink-0">
              <span className="icon d-inline-block">
                <amp-img src="/static/telegram-share.png" alt="Telegram" width="24" height="24" layout="responsive"></amp-img>
              </span>
              {t('common:Telegram')}
            </a>
          </div>
        </div>
      </section>
      <section className="common-section pb-0">
        <div className="tipsNote">
          <div className="itemTitle text-primary font-bold text-uppercase d-flex align-items-center">
            <div className="img me-2">
              <amp-img src="/static/warning-icon.svg" alt="warning" width="24" height="24" layout="responsive"></amp-img>
            </div>
            {t('common:Disclaimer')}
          </div>
          <div>{t('common:OwnDecisionNote')}</div>
        </div>
      </section>
    </>
  )
}

TipsNote.propTypes = {
  title: PropTypes.any,
  info: PropTypes.any
}

export default TipsNote
