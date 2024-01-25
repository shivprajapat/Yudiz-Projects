import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import styles from './style.module.scss'
import Trans from 'next-translate/Trans'
import { APP_STORE_URL, PLAY_STORE_URL } from '@shared/constants'
const MyImage = dynamic(() => import('@shared/components/myImage'))

const TipsNote = (props) => {
  return (
    <>
      <section className={`common-section pb-0 ${props?.className}`}>
        <div className={`${styles.tipsNote} ${props?.isBgPrimary ? styles.note : ''} ${props?.isBgPrimary && 'bg-info'} br-lg`}>
          <p className={`${styles?.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}>
            {
              props?.headingIcon && (
                <span className={`${styles.icon} me-2 d-block`}>
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
                <a href={props?.link} target="_blank" className={`${styles.follow} ms-0 ms-md-2 mt-2 mt-md-0 theme-btn outline-btn small-btn flex-shrink-0`} rel="noreferrer">
                  <span className="d-inline-block position-absolute top-50 translate-middle-y">
                    <MyImage src={props?.linkImage} alt="google" layout="responsive" />
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
  link: PropTypes.string,
  linkImage: PropTypes.object,
  className: PropTypes.string,
  heading: PropTypes.string,
  descText: PropTypes.string,
  headingIcon: PropTypes.any,
  linkText: PropTypes.string,
  isBgPrimary: PropTypes.bool,
  isDownloadAppDisclaimer: PropTypes.bool
}

export default TipsNote
