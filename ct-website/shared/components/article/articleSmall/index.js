import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Row, Col, Badge } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import articleStyles from '../style.module.scss'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { convertDt24h, convertHMS, dateCheck, getArticleImg, getImgURL } from '@utils'
import { BLUR_DATA_URL, DEFAULT_BLOG_READ } from '@shared/constants'
import calenderIcon from '@assets/images/icon/calender-icon.svg'
import clockIcon from '@assets/images/icon/clock-icon.svg'
import { useRouter } from 'next/router'

const MyImage = dynamic(() => import('@shared/components/myImage'))
function ArticleSmall({ data, isLarge, isVideo, hideBadge }) {
  const router = useRouter()
  const isMobileWebView = router?.query?.isMobileWebView
  return (
    <article id={data?._id} className={`${articleStyles.article} ${styles.articleSmall} ${isVideo && articleStyles.video}`}>
      <Row className="row-8">
        <Col sm={3} xs={5}>
          <Link href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
            <a style={isMobileWebView && { pointerEvents: 'none' }} className={`${articleStyles.postimg} ${styles.postimg} d-block block-img`}>
              {isVideo && (
                <MyImage
                  src={getImgURL(data?.sThumbnailUrl) || noImage}
                  alt={data?.sTitle}
                  blurDataURL={BLUR_DATA_URL}
                  placeholder="blur"
                  height={10}
                  width={16}
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
                  height={10}
                  width={16}
                  layout="responsive"
                  sizes="(max-width: 767px) 120px, (max-width: 991px) 180px, (max-width: 1190px) 200px, 240px"
                />
              )}
              {isVideo && (
                <Badge bg="primary" className={`${styles.badge} ${articleStyles.badge} ${isVideo && 'video-badge'}`}>
                  {convertHMS(data?.nDurationSeconds)}
                </Badge>
              )}
            </a>
          </Link>
        </Col>
        <Col sm={9} xs={7} className="d-flex flex-column justify-content-between">
          <div>
            {data?.oCategory?.sName && !hideBadge && (
              <Badge
                bg={data?.ePlatformType === 'de' ? 'danger' : 'primary'}
                className={`${styles.badge} ${articleStyles.badge} ${data?.isVideo && 'video-badge'}  mb-1`}
              >
                <Link href={`/${data?.oCategory?.oSeo?.sSlug}` || ''} prefetch={false}>
                  <a style={isMobileWebView && { pointerEvents: 'none' }}>{data?.oCategory?.sName}</a>
                </Link>
              </Badge>
            )}
            {data && isLarge && (
              <>
                <h3 className={`${styles.title} small-head mb-2`}>
                  <Link href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
                    <a style={isMobileWebView && { pointerEvents: 'none' }}>{data?.sTitle}</a>
                  </Link>
                </h3>
                <p className="d-none d-sm-block">{data?.sSrtTitle || data?.sTitle}</p>
              </>
            )}
            {data && !isLarge && (
              <>
                <h4 className={`${styles.title} small-head mb-2`}>
                  <Link href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
                    <a style={isMobileWebView && { pointerEvents: 'none' }}>{data?.sSrtTitle || data?.sTitle}</a>
                  </Link>
                </h4>
              </>
            )}
          </div>
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
        </Col>
      </Row>
    </article>
  )
}
ArticleSmall.propTypes = {
  isLarge: PropTypes.bool,
  data: PropTypes.object,
  isVideo: PropTypes.bool,
  hideBadge: PropTypes.bool
}

export default ArticleSmall
