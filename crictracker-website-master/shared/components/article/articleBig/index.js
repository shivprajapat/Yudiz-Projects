import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

// import styles from './style.module.scss'
// import articleStyles from '../style.module.scss'
import { convertDt24h, convertHMS, dateCheck, getArticleImg, getVideoImgURL } from '@utils'
import { BLUR_DATA_URL_BASE64, DEFAULT_BLOG_READ } from '@shared/constants'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import calenderIcon from '@assets/images/icon/calender-icon.svg'
import clockIcon from '@assets/images/icon/clock-icon.svg'
import CustomLink from '@shared/components/customLink'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const ArticleStyles = dynamic(() => import('@shared/components/article/articleStyle'))

function ArticleBig({ data, isVideo }) {
  const { t } = useTranslation()
  return (
    <ArticleStyles>
      {(articleStyles) => (
        <article className={`${articleStyles.article} ${isVideo && articleStyles.video + ' ' + articleStyles.video} light-bg br-lg c-transition`} id={data?._id}>
          <CustomLink href={`/${data?.oSeo?.sSlug || '404'}`} prefetch={false}>
            <a className={`${articleStyles.postimg} d-block mb-2 mb-md-3 br-md overflow-hidden position-relative a-transition`}>
              {isVideo && (
                <MyImage
                  src={getVideoImgURL(data?.aThumbnails, 'standard') || noImage}
                  alt={data?.sTitle}
                  blurDataURL={BLUR_DATA_URL_BASE64}
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
                  blurDataURL={BLUR_DATA_URL_BASE64}
                  placeholder="blur"
                  height="160"
                  width="256"
                  layout="responsive"
                  sizes="(max-width: 767px) 240px, (max-width: 991px) 320px, (max-width: 1190px) 360px, 400px"
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
          {data?.oCategory?.sName && (
            <Badge
              bg={data?.ePlatformType === 'de' ? 'danger' : 'primary'}
              className={`${articleStyles.badge} ${isVideo && 'video-badge'} mb-1`}
            >
              <CustomLink href={data?.oCategory?.oSeo?.sSlug || ''} prefetch={false}>
                <a>{data?.oCategory?.sName}</a>
              </CustomLink>
            </Badge>
          )}
          <h3 className="small-head mb-2">
            <CustomLink href={`/${data?.oSeo?.sSlug || '404'}`} prefetch={false}>
              <a className="overflow-hidden line-clamp-3">{data?.sSrtTitle || data?.sTitle}</a>
            </CustomLink>
          </h3>
          {/* <p className={`${articleStyles.desc}`}>{data?.sDescription}</p> */}
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
        </article>
      )}
    </ArticleStyles>
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
