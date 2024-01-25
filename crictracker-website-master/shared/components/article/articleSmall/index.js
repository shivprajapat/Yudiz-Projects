import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Badge } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

// import styles from './style.module.scss'
// import articleStyles from '../style.module.scss'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { convertDt24h, convertHMS, dateCheck, getArticleImg, getImgURL } from '@utils'
import { BLUR_DATA_URL_BASE64, DEFAULT_BLOG_READ } from '@shared/constants'
import calenderIcon from '@assets/images/icon/calender-icon.svg'
import clockIcon from '@assets/images/icon/clock-icon.svg'
import CustomLink from '@shared/components/customLink'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const ArticleStyles = dynamic(() => import('@shared/components/article/articleStyle'))
function ArticleSmall({ data, isLarge, isVideo, hideBadge, isMobileBig }) {
  const { t } = useTranslation()
  return (
    <ArticleStyles>
      {(articleStyles) => (
        <article id={data?._id} className={`${articleStyles.article} ${articleStyles.articleSmall} ${isVideo && articleStyles.video} light-bg br-lg c-transition`}>
          <Row className="gx-2 gx-md-3">
            <Col sm={3} xs={isMobileBig ? '12' : '5'}>
              <CustomLink href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
                <a className={`${articleStyles.postimg} ${isMobileBig && 'mb-2 mb-sm-0'} d-block br-md overflow-hidden position-relative a-transition`}>
                  {isVideo && (
                    <MyImage
                      src={getImgURL(data?.sThumbnailUrl) || noImage}
                      alt={data?.sTitle}
                      blurDataURL={BLUR_DATA_URL_BASE64}
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
                      blurDataURL={BLUR_DATA_URL_BASE64}
                      height={10}
                      width={16}
                      layout="responsive"
                      sizes="(max-width: 767px) 120px, (max-width: 991px) 180px, (max-width: 1190px) 200px, 240px"
                    />
                  )}
                  {isVideo && (
                    <Badge bg="primary" className={`${articleStyles.badge} ${articleStyles.videoBadge} ${isVideo && 'video-badge'} position-absolute start-0 bottom-0 ms-2 mb-2`}>
                      {convertHMS(data?.nDurationSeconds)}
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
            </Col>
            <Col sm={9} xs={isMobileBig ? '12' : '7'} className="d-flex flex-column justify-content-between">
              <div>
                {data?.oCategory?.sName && !hideBadge && (
                  <Badge
                    bg={data?.ePlatformType === 'de' ? 'danger' : 'primary'}
                    className={`${articleStyles.badge} ${data?.isVideo && 'video-badge'} mb-1`}
                  >
                    <CustomLink href={`/${data?.oCategory?.oSeo?.sSlug}` || ''} prefetch={false}>
                      <a>{data?.oCategory?.sName}</a>
                    </CustomLink>
                  </Badge>
                )}
                {data && isLarge && (
                  <>
                    <h3 className="small-head mb-2">
                      <CustomLink href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
                        <a className="overflow-hidden line-clamp-3">{data?.sTitle}</a>
                      </CustomLink>
                    </h3>
                    <p className="d-none d-sm-block">{data?.sSrtTitle || data?.sTitle}</p>
                  </>
                )}
                {data && !isLarge && (
                  <>
                    <h4 className="small-head mb-2">
                      <CustomLink href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
                        <a className="overflow-hidden line-clamp-3">{data?.sSrtTitle || data?.sTitle}</a>
                      </CustomLink>
                    </h4>
                  </>
                )}
              </div>
              {(data?.dPublishDisplayDate || data?.dPublishDate || data?.nDuration?.toString()) && (
                <div className={`${articleStyles.articleInfo} text-muted d-flex`}>
                  {(data?.dPublishDisplayDate || data?.dPublishDate) && (
                    <span className="d-flex align-items-center">
                      <span className={`${articleStyles.icon} d-block`}>
                        <MyImage src={calenderIcon} alt="Calender" layout="responsive" />
                      </span>
                      {convertDt24h(dateCheck(data?.dPublishDisplayDate || data?.dPublishDate))}
                    </span>
                  )}
                  <span className="d-flex align-items-center">
                    <span className={`${articleStyles.icon} d-block`}>
                      <MyImage src={clockIcon} alt="Clock" layout="responsive" />
                    </span>
                    {data?.nDuration > 0 ? data?.nDuration : DEFAULT_BLOG_READ} <Trans i18nKey="common:Minute" />
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </article>
      )}
    </ArticleStyles>
  )
}
ArticleSmall.propTypes = {
  isLarge: PropTypes.bool,
  data: PropTypes.object,
  isVideo: PropTypes.bool,
  hideBadge: PropTypes.bool,
  isMobileBig: PropTypes.bool
}

export default ArticleSmall
