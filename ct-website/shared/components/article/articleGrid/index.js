import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import articleStyles from '../style.module.scss'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { convertDt24h, convertHMS, dateCheck, getArticleImg, getImgURL } from '@utils'
import { BLUR_DATA_URL, DEFAULT_BLOG_READ } from '@shared/constants'
import calenderIcon from '@assets/images/icon/calender-icon.svg'
import clockIcon from '@assets/images/icon/clock-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))
function ArticleGrid({ data, isVideo }) {
  return (
    <article className={`${articleStyles.article} ${styles.articleGrid} ${isVideo && articleStyles.video}`} id={data?._id}>
      <Link href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
        <a className={`${articleStyles.postimg} ${styles.postimg} d-block block-img mb-2`}>
          {isVideo && (
            <MyImage
              src={getImgURL(data?.sThumbnailUrl) || noImage}
              alt={data?.sTitle}
              blurDataURL={BLUR_DATA_URL}
              placeholder="blur"
              height="80"
              width="128"
              layout="responsive"
              sizes="(max-width: 767px) 120px, (max-width: 991px) 180px, (max-width: 1190px) 200px, 240px"
            />
          )}
          {!isVideo && (
            <MyImage
              src={getArticleImg(data)?.sUrl || noImage}
              alt={getArticleImg(data)?.sText || data?.sSrtTitle}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              height="80"
              width="128"
              layout="responsive"
              sizes="(max-width: 767px) 120px, (max-width: 991px) 180px, (max-width: 1190px) 200px, 240px"
            />
          )}
          {isVideo && (
            <Badge bg="primary" className={`${styles.badge} ${articleStyles.badge} ${isVideo && 'video-badge'}`}>
              {data?.category} {convertHMS(data?.nDurationSeconds)}
            </Badge>
          )}
        </a>
      </Link>
      {data?.category && !isVideo(
        <Badge bg="primary" className={`${styles.badge} ${articleStyles.badge} ${data?.isVideo && 'video-badge'} mb-2`}>
          {data?.category}
        </Badge>
      )}
      <h4 className="small-head mb-2">
        <Link href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
          <a>{isVideo ? data?.sTitle : data?.sSrtTitle || data?.sTitle}</a>
        </Link>
      </h4>
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
ArticleGrid.propTypes = {
  isVideo: PropTypes.bool,
  data: PropTypes.object
}

export default ArticleGrid
