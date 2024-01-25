import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Button, Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import infoIcon from '@assets/images/icon/info-icon.svg'
import google from '@assets/images/icon/google-share.png'
import telegram from '@assets/images/icon/telegram-share.png'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { getDesignation, convertDt24hFormat, getImgURL, abbreviateNumber, dateCheck, checkPageNumberInSlug } from '@utils'
import { BLUR_DATA_URL, DEFAULT_BLOG_READ, GOOGLE_NEWS_LINK, TELEGRAM_NEWS_LINK, WIDGET } from '@shared/constants'
import { allRoutes } from '@shared/constants/allRoutes'
import { GlobalEventsContext } from '../global-events'
import useWindowSize from '@shared/hooks/windowSize'
import ErrorBoundary from '@shared/components/errorBoundary'
import useOnScreen from '@shared/hooks/useOnScreen'
// import { getToken } from '@shared/libs/menu'

const Layout = dynamic(() => import('@shared-components/layout'))
const BreadcrumbNav = dynamic(() => import('@shared-components/breadcrumbNav'))
const ArticleActions = dynamic(() => import('@shared-components/articleDetail/articleActions'))
const ArticleRelatedVideos = dynamic(() => import('@shared-components/articleDetail/articleRelatedVideos'), { ssr: false })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const TaboolaAds = dynamic(() => import('@shared/components/ads/taboola'), { ssr: false })
const MyImage = dynamic(() => import('@shared/components/myImage'))
const ViewIcon = dynamic(() => import('@shared-components/ctIcons/viewIcon'))
const ClockIcon = dynamic(() => import('@shared-components/ctIcons/clockIcon'))
const ExclusiveIcon = dynamic(() => import('@shared-components/ctIcons/exclusiveIcon'))
const EditorsPickIcon = dynamic(() => import('@shared-components/ctIcons/editorsPickIcon'))

function ArticleDetail({ article, isPreviewMode, seoData, children, type }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { dispatchGlobalEvents: editGlobalEvent } = useContext(GlobalEventsContext)
  const [width] = useWindowSize()
  const [page, setPage] = useState(1)
  const { inView, observe } = useOnScreen()
  const [isPreview, setIsPreview] = useState(false)
  const isMobileWebView = router?.query?.isMobileWebView
  // const token = getToken()

  useEffect(() => {
    editGlobalEvent({
      type: 'UPDATE_ARTICLE_COMMENT_COUNT',
      payload: { commentCount: article?.nCommentCount }
    })
  }, [])

  useEffect(() => {
    const slug = router?.asPath?.split('/').filter(e => e)
    const { lastSlug } = checkPageNumberInSlug(slug)
    setPage(lastSlug ? (Number(lastSlug) || 1) : 1)
  }, [router?.asPath])

  useEffect(() => {
    if (isMobileWebView) {
      setIsPreview(true)
      document.body.classList.add('mobileWebView')
    }
  }, [router?.asPath])

  return (
    <Layout data={{ ...article, oSeo: { ...article?.oSeo, ...seoData } }} isPreviewMode={isPreviewMode}>
      <main className={`${styles.articlePage} ${isPreview && styles.mobileArticle}`}>
        <section className={`common-section ${isPreview && 'pt-0 pt-sm-4'}`}>
          <Container>
            {width < 768 && ( // Mcanvas ads for mobile only
              <Ads
                id="div-ad-desk-138639789-1662468567-0"
                adIdDesktop="Crictracker2022_Mcanvas_1x1"
                dimensionDesktop={[1, 1]}
                className={`p-0 ${styles?.mCanvasAd}`}
              />
            )}
            {!isPreviewMode && (
              <div className="d-none d-md-block mt-2" style={{ minHeight: '90px' }}>
                {width > 768 && ( // Desktop Top
                  <Ads
                    id="div-ad-gpt-138639789-1646637094-0"
                    adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                    dimensionDesktop={[970, 90]}
                    className="mb-4 text-center"
                    style={{ minHeight: '90px' }}
                  />
                )}
              </div>
            )}
            <Row className="justify-content-center">
              {/* <Col md={1} className="d-none d-xxl-block text-center">
                {!isPreviewMode && <ArticleActions article={article} type={type} seoData={seoData} />}
              </Col> */}
              <Col xxl={8} lg={8} md={11} className={isPreviewMode ? '' : 'left-content'}>
                <section className={`${styles.articleBlock} common-box`}>
                  <div className="d-flex flex-column flex-md-row align-items-start justify-content-between">
                    {!isPreviewMode && !isPreview && <BreadcrumbNav isArticle listicleCurrentPage={page} />}
                    <div className="d-flex mb-2 mb-md-0">
                      {article?.oAdvanceFeature?.bEditorsPick &&
                        <Badge bg="light" className={`${styles.advFeature} d-flex align-items-center text-capitalize`}><EditorsPickIcon />{t('common:EditorsPick')}</Badge>
                      }
                      {article?.oAdvanceFeature?.bExclusiveArticle &&
                        <Badge bg="light" className={`${styles.advFeature} d-flex align-items-center text-capitalize ms-2`}><ExclusiveIcon />{t('common:ExclusiveArticle')}</Badge>
                      }
                    </div>
                  </div>
                  {/* <article className="article-details-page"> */}
                  <article className='overflow-hidden'>
                    <h1 className={`${styles.title} pb-2 pb-sm-3`}>{article?.sTitle}</h1>
                    <h3 className={`${styles.subTitle} small-head text-secondary`}>{article?.sSubtitle}</h3>
                    {/* <span className={`${styles.subTitle} small-head text-secondary text-wrap`}>TOKEN: {token}</span> */}
                    {page <= 1 && (
                      <figure className="op-tracker">
                        <div className={`${styles.postImg} position-relative`}>
                          <MyImage
                            src={getImgURL(article?.oImg?.sUrl) || noImage}
                            alt={article?.oImg?.sText || article?.sSrtTitle}
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            height="160"
                            width="256"
                            layout="responsive"
                            sizes="(max-width: 767px) 240px, (max-width: 991px) 320px, (max-width: 1190px) 360px, 400px"
                          />
                          {article?.oImg?.sCaption !== 'null' && (
                            <div className={styles.captionBlock}>
                              <div className={`${styles.icon} rounded-circle`}>
                                <MyImage src={infoIcon} alt="info" height="24" width="24" layout="responsive" />
                              </div>
                              <div
                                className={`${styles.caption} xsmall-text d-inline-block`}
                                dangerouslySetInnerHTML={{ __html: article?.oImg?.sCaption }}
                              />
                            </div>
                          )}
                        </div>
                      </figure>
                    )}
                    <div className={`${styles.articleActionsMob} text-center`}>
                      {!isPreviewMode && <ArticleActions article={article} type={type} seoData={seoData} />}
                    </div>
                    <div className={`${styles.authorBlock} d-flex flex-wrap align-items-start mb-3`}>
                      <div className={`${styles.author} d-flex align-items-center font-semi mb-3`}>
                        <div className={`${styles.authorImg} rounded-circle overflow-hidden`}>
                          {
                            isMobileWebView ? <MyImage
                                src={getImgURL(article?.oDisplayAuthor?.sUrl) || noImage}
                                alt={article?.oDisplayAuthor?.sDisplayName}
                                placeholder="blur"
                                layout="responsive"
                                width="40"
                                height="40"
                                blurDataURL={BLUR_DATA_URL}
                                sizes="(max-width: 767px) 40px, (max-width: 991px) 40px, (max-width: 1190px) 40px, 40px"
                              /> : <Link href={allRoutes.authorDetail(article?.oDisplayAuthor?.oSeo?.sSlug)} prefetch={false}>
                            <a>
                              <MyImage
                                src={getImgURL(article?.oDisplayAuthor?.sUrl) || noImage}
                                alt={article?.oDisplayAuthor?.sDisplayName}
                                placeholder="blur"
                                layout="responsive"
                                width="40"
                                height="40"
                                blurDataURL={BLUR_DATA_URL}
                                sizes="(max-width: 767px) 40px, (max-width: 991px) 40px, (max-width: 1190px) 40px, 40px"
                              />
                            </a>
                          </Link>
                          }
                          <Link href={allRoutes.authorDetail(article?.oDisplayAuthor?.oSeo?.sSlug)} prefetch={false}>
                            <a style={isMobileWebView && { pointerEvents: 'none' }}>
                              <MyImage
                                src={getImgURL(article?.oDisplayAuthor?.sUrl) || noImage}
                                alt={article?.oDisplayAuthor?.sDisplayName}
                                placeholder="blur"
                                layout="responsive"
                                width="40"
                                height="40"
                                blurDataURL={BLUR_DATA_URL}
                                sizes="(max-width: 767px) 40px, (max-width: 991px) 40px, (max-width: 1190px) 40px, 40px"
                              />
                            </a>
                          </Link>
                        </div>
                        <div className={`${styles.authorDesc}`}>
                          <Link href={allRoutes.authorDetail(article?.oDisplayAuthor?.oSeo?.sSlug)} prefetch={false}>
                            <a style={isMobileWebView && { pointerEvents: 'none' }}>
                              {article?.oDisplayAuthor?.sDisplayName?.toUpperCase()}{' '}
                              {article?.oDisplayAuthor?.bIsVerified && (
                                <span className={`${styles.verfied} d-inline-block rounded-circle align-text-top`}></span>
                              )}
                            </a>
                          </Link>
                          <p className="mb-0 mt-1 xsmall-text text-secondary">{getDesignation(article?.oDisplayAuthor?.eDesignation)}</p>
                        </div>
                      </div>
                      {/* <Button className="theme-btn outline-btn xsmall-btn">
                        <Trans i18nKey="common:Follow" />
                      </Button> */}
                      <div className="ms-auto">
                        <p className={`${styles.views} mb-1`}>
                          <ViewIcon /> {t('common:View')} : {abbreviateNumber(article?.nViewCount || article?.nOViews)}
                        </p>
                        <p className={`${styles.views} ${styles.duration}`}>
                          <ClockIcon />
                          {article?.nDuration > 0 ? article?.nDuration : DEFAULT_BLOG_READ} {t('common:Minute')}{' '}
                          {t('common:Read')}
                        </p>
                      </div>
                      <p className={`${styles.dates} xsmall-text font-semi mb-0`}>
                        {((article?.dPublishDisplayDate || article?.dPublishDate) && width > 768) && (
                          <time className="op-published" dateTime={dateCheck(article?.dPublishDisplayDate || article?.dPublishDate)?.toISOString()}>
                            {t('common:Published')} - {convertDt24hFormat(dateCheck(article?.dPublishDisplayDate || article?.dPublishDate))} |
                          </time>
                        )}
                        <time className="op-modified" dateTime={(article?.dModifiedDate || article?.dPublishDisplayDate) && dateCheck(article?.dModifiedDate || article?.dPublishDisplayDate).toISOString()}>
                          {t('common:Updated')} - {convertDt24hFormat(dateCheck(article?.dModifiedDate || article?.dPublishDisplayDate))}
                        </time>
                      </p>
                    </div>
                    {width < 768 && ( // Mobile Below article image
                      <Ads
                        id="div-ad-gpt-138639789-1646637094-0"
                        adIdDesktop="Crictracker2022_Mobile_AP_ATF_300x250"
                        dimensionDesktop={[300, 250]}
                        className="mb-2 text-center"
                      />
                    )}
                    <div className={`${styles.followUs} d-flex flex-column flex-md-row align-items-center justify-content-center`}>
                      <p className="font-semi">
                        {t('common:GetEveryCricketUpdatesFollowUsOn')}
                      </p>
                      <div>
                        <Button href={GOOGLE_NEWS_LINK} target="_blank" className={`${styles.follow} theme-btn outline-btn small-btn`}>
                          <span className={`${styles.icon} d-inline-block`}>
                            <MyImage src={google} alt="google" layout="responsive" />
                          </span>
                          {t('common:GoogleNews')}
                        </Button>
                        <Button href={TELEGRAM_NEWS_LINK} target="_blank" className={`${styles.follow} theme-btn outline-btn small-btn`}>
                          <span className={`${styles.icon} d-inline-block`}>
                            <MyImage src={telegram} alt="google" layout="responsive" />
                          </span>
                          {t('common:Telegram')}
                        </Button>
                      </div>
                    </div>
                    {width > 768 && ( // Desktop after google/Telegram
                      <Ads
                        id="div-ad-gpt-Desktop_AP_ATF_728x90"
                        adIdDesktop="Crictracker2022_Desktop_AP_ATF_728x90"
                        adIdMobile="Crictracker2022_Mobile_AP_ATF_300x250"
                        dimensionDesktop={[728, 90]}
                        dimensionMobile={[300, 250]}
                        mobile
                        className={'text-center mb-4'}
                      />
                    )}
                    {children}
                  </article>
                </section>
                {/* Desktop/Mobile above related Video and article  */}
                {!isPreviewMode && (
                  <Ads
                    id="div-ad-gpt-138639789-1646637259-0"
                    adIdDesktop="Crictracker2022_Desktop_AP_BTF_728x90"
                    adIdMobile="Crictracker2022_Mobile_AP_BTF_300x250"
                    dimensionDesktop={[728, 90]}
                    dimensionMobile={[300, 250]}
                    mobile
                    className={'text-center mb-4'}
                  />
                )}
                <div ref={observe}>
                  {(!isPreviewMode && inView) && (
                    <>
                      {(article?.oCategory?._id || article?.iCategoryId) && (
                        <ArticleRelatedVideos categoryId={article?.oCategory?._id || article?.iCategoryId} articleId={article?._id} type={article?.oSeo?.eType} />
                      )}
                      <ErrorBoundary>
                        <TaboolaAds />
                      </ErrorBoundary>
                    </>
                  )}
                </div>
              </Col>
              <Col lg={4} xxl={3} className="common-sidebar">
                {!isPreviewMode && width > 768 && (
                  <>
                    <AllWidget type={WIDGET.currentSeries} show />
                    <AllWidget type={WIDGET.cricSpecial} show />
                    <AllWidget type={WIDGET.trendingNews} show />
                    <Ads
                      id="div-ad-gpt-138639789-1646637134-0"
                      adIdDesktop="Crictracker2022_Desktop_AP_RightATF_300x600"
                      dimensionDesktop={[300, 600]}
                      className="sticky-ads"
                    />
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </Layout>
  )
}

ArticleDetail.propTypes = {
  article: PropTypes.object,
  seoData: PropTypes.object,
  isPreviewMode: PropTypes.bool,
  children: PropTypes.node.isRequired,
  type: PropTypes.string
}

export default ArticleDetail
