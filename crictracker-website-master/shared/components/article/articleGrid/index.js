import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
// import articleStyles from '../style.module.scss'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { convertDt24h, convertHMS, dateCheck, getArticleImg, getVideoImgURL } from '@utils'
import { BLUR_DATA_URL_BASE64, DEFAULT_BLOG_READ } from '@shared/constants'
import calenderIcon from '@assets/images/icon/calender-icon.svg'
import clockIcon from '@assets/images/icon/clock-icon.svg'
import CustomLink from '@shared/components/customLink'

const ArticleStyles = dynamic(() => import('@shared/components/article/articleStyle'))
const MyImage = dynamic(() => import('@shared/components/myImage'))
function ArticleGrid({ data, isVideo, isMobileSmall }) {
  const { t } = useTranslation()
  return (
    <ArticleStyles>
      {(articleStyles) => (
        <article className={`${articleStyles.article} ${styles.articleGrid} ${isVideo && articleStyles.video} ${isMobileSmall ? 'flex-sm-column align-items-top' : 'flex-column'} ${isMobileSmall ? styles.mobileSmall : ''} d-flex light-bg br-lg c-transition`} id={data?._id}>
          <CustomLink href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
            <a className={`${articleStyles.postimg} ${styles.postimg} d-block ${isMobileSmall ? 'mb-0 mb-sm-2' : 'mb-2'} overflow-hidden br-md position-relative a-transition`}>
              {isVideo && (
                <MyImage
                  src={getVideoImgURL(data?.aThumbnails, 'high') || noImage}
                  alt={data?.sTitle}
                  blurDataURL={BLUR_DATA_URL_BASE64}
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
                  blurDataURL={BLUR_DATA_URL_BASE64}
                  height="80"
                  width="128"
                  layout="responsive"
                  sizes="(max-width: 767px) 120px, (max-width: 991px) 180px, (max-width: 1190px) 200px, 240px"
                />
              )}
              {isVideo && (
                <Badge bg="primary" className={`${articleStyles.badge} ${articleStyles.videoBadge} ${isVideo && 'video-badge'} position-absolute start-0 bottom-0 ms-2 mb-2`}>
                  {data?.category} {convertHMS(data?.nDurationSeconds)}
                </Badge>
              )}
              {
                data?.iEventId && (
                  <div className={`${articleStyles.livePost} position-absolute`}>
                    <div className={`${articleStyles.liveIcon} position-relative d-inline-block rounded-circle bg-danger`} />{t('common:Live')}
                  </div>
                )
              }
            </a>
          </CustomLink>
          <div className="d-flex flex-column flex-grow-1">
            {data?.category && !isVideo(
              <Badge bg="primary" className={`${styles.badge} ${articleStyles.badge} ${data?.isVideo && 'video-badge'} mb-1`}>
                {data?.category}
              </Badge>
            )}
            <h4 className="small-head mb-2">
              <CustomLink href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
                <a className="overflow-hidden line-clamp-3">{isVideo ? data?.sTitle : data?.sSrtTitle || data?.sTitle}</a>
              </CustomLink>
            </h4>
            {(data?.dPublishDisplayDate || data?.dPublishDate || data?.nDuration?.toString()) && (
              <div className={`${articleStyles.articleInfo} ${styles.articleInfo} text-muted d-flex mt-auto`}>
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
          </div>
        </article>
      )}
    </ArticleStyles>
  )
}
ArticleGrid.propTypes = {
  isVideo: PropTypes.bool,
  isMobileSmall: PropTypes.bool,
  data: PropTypes.object
}

export default ArticleGrid
