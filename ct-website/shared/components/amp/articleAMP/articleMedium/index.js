import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Badge } from 'react-bootstrap'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import articleStyles from '../style.module.scss'
import { convertDt24h, convertHMS, dateCheck, getArticleImg, getImgURL } from '@shared/utils'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { BLUR_DATA_URL, DEFAULT_BLOG_READ } from '@shared/constants'
import calenderIcon from '@assets/images/icon/calender-icon.svg'
import clockIcon from '@assets/images/icon/clock-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))
function ArticleMedium({ data, isVideo }) {
  return (
    <article id={data?._id} className={`${articleStyles.article} ${styles.articleMedium} ${isVideo && articleStyles.video}`}>
      <Row className="row-8">
        <Col xs={5} sm={6}>
          <Link href={`/${data?.oSeo?.sSlug || '404'}`} prefetch={false}>
            <a>
              <div className={`${articleStyles.postimg} ${styles.postimg} block-img`}>
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
                    {convertHMS(data?.nDurationSeconds)}
                  </Badge>
                )}
              </div>
            </a>
          </Link>
        </Col>
        <Col xs={7} sm={6} className="d-flex flex-column justify-content-between">
          <div>
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
                <a>{data?.sTitle}</a>
              </Link>
            </h3>
            {data?.sDescription && <p className={`${articleStyles.desc}`}>{data?.sDescription}</p>}
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
ArticleMedium.propTypes = {
  data: PropTypes.object,
  isVideo: PropTypes.bool
}
export default ArticleMedium
