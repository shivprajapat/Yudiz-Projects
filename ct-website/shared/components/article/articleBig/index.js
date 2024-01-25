import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Badge } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import articleStyles from '../style.module.scss'
import { convertDt24h, convertHMS, dateCheck, getArticleImg, getImgURL } from '@utils'
import { BLUR_DATA_URL, DEFAULT_BLOG_READ } from '@shared/constants'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import calenderIcon from '@assets/images/icon/calender-icon.svg'
import clockIcon from '@assets/images/icon/clock-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))
function ArticleBig({ data, isVideo }) {
  return (
    <article className={`${articleStyles.article} ${styles.articleBig} ${isVideo && articleStyles.video + ' ' + articleStyles.video}`} id={data?._id}>
      <Link href={`/${data?.oSeo?.sSlug || '404'}`} prefetch={false}>
        <a className={`${articleStyles.postimg} ${styles.postimg} d-block block-img mb-3`}>
          {isVideo && (
            <MyImage
              src={getImgURL(data?.sThumbnailUrl) || noImage}
              alt={data?.sTitle}
              blurDataURL={BLUR_DATA_URL}
              placeholder="blur"
              height="160"
              width="256"
              layout="responsive"
              sizes="(max-width: 767px) 240px, (max-width: 991px) 320px, (max-width: 1190px) 360px, 400px"
            />
          )}
          {!isVideo && (
            <MyImage
              src={getArticleImg(data)?.sUrl || noImage}
              alt={getArticleImg(data)?.sText || data?.sSrtTitle}
              blurDataURL={BLUR_DATA_URL}
              placeholder="blur"
              height="160"
              width="256"
              layout="responsive"
              sizes="(max-width: 767px) 240px, (max-width: 991px) 320px, (max-width: 1190px) 360px, 400px"
            />
          )}
          {isVideo && (
            <Badge bg="primary" className={`${styles.badge} ${articleStyles.badge} ${isVideo && 'video-badge'}`}>
              {data?.category} {convertHMS(data?.nDurationSeconds)}
            </Badge>
          )}
        </a>
      </Link>
      {data?.oCategory?.sName && (
        <Badge
          bg={data?.ePlatformType === 'de' ? 'danger' : 'primary'}
          className={`${styles.badge} ${articleStyles.badge} ${isVideo && 'video-badge'}`}
        >
          <Link href={data?.oCategory?.oSeo?.sSlug || ''} prefetch={false}>
            <a>{data?.oCategory?.sName}</a>
          </Link>
        </Badge>
      )}
      <h3 className="small-head">
        <Link href={`/${data?.oSeo?.sSlug || '404'}`} prefetch={false}>
          <a>{data?.sSrtTitle || data?.sTitle}</a>
        </Link>
      </h3>
      {/* <p className={`${articleStyles.desc}`}>{data?.sDescription}</p> */}
      {(data?.dPublishDisplayDate || data?.dPublishDate || data?.nDuration?.toString()) && (
        <div className={`${articleStyles.articleInfo} ${styles.articleInfo} d-flex`}>
          {(data?.dPublishDisplayDate || data?.dPublishDate) && (
            <span className="d-flex align-items-center">
              <span className={`${articleStyles.icon} ${styles.icon} d-block`}>
                <MyImage src={calenderIcon} alt="Calender" layout="responsive" />
              </span>
              {convertDt24h(dateCheck(data?.dPublishDisplayDate || data?.dPublishDate))}
            </span>
          )}
          <span className="d-flex align-items-center">
            <span className={`${articleStyles.icon} ${styles.icon} d-block`}>
              <MyImage src={clockIcon} alt="Clock" layout="responsive" />
            </span>
            {data?.nDuration > 0 ? data?.nDuration : DEFAULT_BLOG_READ} <Trans i18nKey="common:Minute" />
          </span>
        </div>
      )}
    </article>
  )
}
ArticleBig.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
  imgURL: PropTypes.any,
  isVideo: PropTypes.bool,
  date: PropTypes.string,
  time: PropTypes.string,
  data: PropTypes.object
}

export default ArticleBig
