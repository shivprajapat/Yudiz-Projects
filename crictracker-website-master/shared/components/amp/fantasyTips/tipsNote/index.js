import React from 'react'
import PropTypes from 'prop-types'

import { APP_STORE_URL, PLAY_STORE_URL } from '@shared/constants'
import Trans from 'next-translate/Trans'

const TipsNote = (props) => {
  return (
    <>
      <style jsx amp-custom>{`
      .img{width:24px;margin-right:8px}.itemTitle{margin:0 0 8px;padding-bottom:8px;border-bottom:1px solid var(--light);font-weight:600;text-transform:uppercase;color:var(--theme-color-medium);-webkit-align-items:center;align-items:center}.tipsNote{padding:12px;background:var(--light-bg);border-radius:16px}.tipsNote .icon{width:24px}.tipsNote.note{color:var(--theme-dark2);background:var(--theme-light)}.tipsNote.note .itemTitle{border-bottom-color:var(--theme-medium)}.noteInfo{-webkit-align-items:center;align-items:center}.follow{margin:0 6px;padding:6px 16px 6px 48px;display:inline-block;font-size:12px;line-height:18px;font-weight:700;color:var(--theme-color-light);border:1px solid var(--theme-medium);border-radius:2em;position:relative;-webkit-align-items:center;align-items:center;text-decoration:none}.follow .icon{position:absolute;width:40px;left:-2px;top:50%;transform:translateY(-50%)}@media(prefers-color-scheme: dark){.img{-webkit-filter:brightness(0) invert(1) opacity(0.7);filter:brightness(0) invert(1) opacity(0.7)}}/*# sourceMappingURL=style.css.map */

      `}</style>
      <section className='pb-3 pt-0'>
        <div className={`tipsNote ${props?.isBgPrimary && 'note'} ${props?.isBgPrimary && 'bg-info'}`}>
          <p className='itemTitle text-primary font-bold text-uppercase d-flex align-items-center'>
            {
              props?.headingIcon && (
                <span className='icon me-2 d-block'>
                  {props?.headingIcon}
                </span>
              )
            }
            {props?.heading}
          </p>
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
            {props?.isDownloadAppDisclaimer && (
              <div className=''>
                <Trans i18nKey="common:ForBetterExpDownloadApp" />&nbsp;
                <a href={APP_STORE_URL} rel="noreferrer" className='text-primary' target='_blank'><Trans i18nKey="common:IOSStore" /></a> and&nbsp;
                <a href={PLAY_STORE_URL} rel="noreferrer" className='text-primary' target='_blank'><Trans i18nKey="common:GooglePlayStore" /></a>
              </div>
            )
            }
            {props?.descText}
            {
              props?.link && (
                <a href={props?.link} target="_blank" className='follow ms-0 ms-md-2 mt-2 mt-md-0 theme-btn outline-btn small-btn flex-shrink-0' rel="noreferrer">
                  <span className="d-inline-block">
                    <amp-img src={props?.linkImage} width="24" height="24" layout="responsive" />
                  </span>
                  {props?.linkText}
                </a>
              )
            }
          </div>
        </div>
      </section>
    </>
  )
}

TipsNote.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  linkImage: PropTypes.string,
  isArticleClass: PropTypes.bool,
  heading: PropTypes.string,
  descText: PropTypes.string,
  headingIcon: PropTypes.any,
  linkText: PropTypes.string,
  isBgPrimary: PropTypes.bool,
  isDownloadAppDisclaimer: PropTypes.bool
}

export default TipsNote
