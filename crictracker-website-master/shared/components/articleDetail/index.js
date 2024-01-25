import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import infoIcon from '@assets/images/icon/info-icon.svg'

import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { convertDt24hFormat, getImgURL, abbreviateNumber, dateCheck, checkPageNumberInSlug, checkIsGlanceView } from '@utils'
import { BLUR_DATA_URL_BASE64, DEFAULT_BLOG_READ, IS_GLANCE_MLIB, WIDGET } from '@shared/constants'
import { allRoutes } from '@shared/constants/allRoutes'
import useWindowSize from '@shared/hooks/windowSize'
import useOnScreen from '@shared/hooks/useOnScreen'
import Layout from '@shared/components/layout'
import useArticleLikeComment from '@shared/hooks/useArticleLikeComment'

const BreadcrumbNav = dynamic(() => import('@shared-components/breadcrumbNav'))
const ArticleActions = dynamic(() => import('@shared-components/articleDetail/articleActions'))
const LikeComment = dynamic(() => import('@shared-components/articleDetail/likeComment'))
const ArticleRelatedVideos = dynamic(() => import('@shared-components/articleDetail/articleRelatedVideos'), { ssr: false })
const CurrentSeries = dynamic(() => import('@shared/components/widgets/currentSeries'))
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const TaboolaAds = dynamic(() => import('@shared/components/ads/taboola'), { ssr: false })
const MyImage = dynamic(() => import('@shared/components/myImage'))
const ViewIcon = dynamic(() => import('@shared-components/ctIcons/viewIcon'), { ssr: false })
const ClockIcon = dynamic(() => import('@shared-components/ctIcons/clockIcon'), { ssr: false })
const ExclusiveIcon = dynamic(() => import('@shared-components/ctIcons/exclusiveIcon'), { ssr: false })
const EditorsPickIcon = dynamic(() => import('@shared-components/ctIcons/editorsPickIcon'), { ssr: false })
const GlanceAd = dynamic(() => import('@shared-components/ads/glanceAd'), { ssr: false })
const RelatedArticle = dynamic(() => import('@shared-components/articleDetail/relatedArticles'), { ssr: false })
const CustomLink = dynamic(() => import('../customLink'))
const LazyLoad = dynamic(() => import('@shared/components/lazyLoad'), { ssr: false })
const OnMouseAndScroll = dynamic(() => import('@shared/components/lazyLoad/onMouseAndScroll'), { ssr: false })
const ErrorBoundary = dynamic(() => import('@shared/components/errorBoundary'))
const Poll = dynamic(() => import('@shared-components/match/poll'))

function ArticleDetail({ article, isPreviewMode, seoData, children, type }) {
  const router = useRouter()
  const { t } = useTranslation()
  const [width] = useWindowSize()
  const { inView, observe } = useOnScreen()
  const mobileWebViewtheme = router?.query?.theme
  const isMobileWebView = router?.query?.isMobileWebView
  const isGlanceView = checkIsGlanceView(router?.query)
  const [isPreview, setIsPreview] = useState(!!isMobileWebView)
  const page = useMemo(() => {
    const slug = router?.asPath?.split('/').filter(e => e)
    const { lastSlug } = checkPageNumberInSlug(slug)
    return lastSlug ? (Number(lastSlug) || 1) : 1
  }, [router?.asPath])

  const {
    currentClap,
    setCurrentClap,
    totalClaps,
    commentCount,
    setCommentCount,
    showComments,
    setShowComments,
    handleAddClap
  } = useArticleLikeComment({ article, isPreview: isPreviewMode })
  // const token = getToken()

  useEffect(() => {
    if (isMobileWebView) {
      setIsPreview(true)
      document.body.classList.add('mobileWebView')
      if (mobileWebViewtheme === 'dark') {
        document.body.setAttribute('data-mode', 'dark')
      } else {
        document.body.setAttribute('data-mode', 'light')
      }
    }
  }, [router?.asPath])

  useEffect(async () => {
    if (isGlanceView && !IS_GLANCE_MLIB) {
      const { refreshGoogleAds } = (await import('@shared/libs/ads'))
      const SECONDS_TO_WAIT_AFTER_VIABILITY = 30
      const interval = setInterval(() => {
        refreshGoogleAds()
      }, SECONDS_TO_WAIT_AFTER_VIABILITY * 1000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [])

  return (
    <Layout data={{ ...article, oSeo: { ...article?.oSeo, ...seoData } }} isPreviewMode={isPreviewMode}>
      <main className={`${styles.articlePage} ${isPreview && styles.mobileArticle}`}>
        <section className={`${styles.articleBlockSec} common-section ${isPreview && 'pt-0 pt-sm-4'}`}>
          <div className="container">
            {width < 768 && ( // Mcanvas ads for mobile only
              <LazyLoad>
                <Ads
                  id="div-ad-desk-138639789-1662468567-0"
                  adIdDesktop="Crictracker2022_Mcanvas_1x1"
                  dimensionDesktop={[1, 1]}
                  className={`p-0 ${styles?.mCanvasAd}`}
                />
              </LazyLoad>
            )}
            {isGlanceView && (
              <GlanceAd
                id="div-gpt-ad-1"
                adId="Crictracker_mrec_top"
                dimension={[[300, 250], [336, 280]]}
                className="mb-2 d-flex justify-content-center"
                adUnitName="Crictracker_English_InArticleMedium_Top"
                placementName="InArticleMedium"
                width={300}
                height={250}
                pageName="crictracker.com"
              />
            )}
            {!isPreviewMode && (
              <div className="d-none d-md-block mb-4 ads-box overflow-hidden" style={{ minHeight: '90px', marginTop: '-10px' }}>
                {width > 768 && ( // Desktop Top
                  <LazyLoad>
                    <Ads
                      id="div-ad-gpt-138639789-1646637094-0"
                      adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                      dimensionDesktop={[970, 90]}
                      className="text-center"
                      style={{ minHeight: '90px' }}
                    />
                  </LazyLoad>
                )}
              </div>
            )}
            <div className="row justify-content-center justify-content-lg-start">
              <div className={`col-lg-8 col-md-11 ${isPreviewMode ? '' : 'left-content'}`}>
                <section className={`${styles.articleBlock} common-box position-relative`}>
                  <div className={`d-flex flex-wrap flex-md-nowrap align-items-start justify-content-between ${article?.oAdvanceFeature?.bEditorsPick && article?.oAdvanceFeature?.bExclusiveArticle && 'flex-column flex-sm-row'}`}>
                    {!isPreviewMode && !isPreview && !isGlanceView && <BreadcrumbNav isArticle listicleCurrentPage={page} />}
                    {(article?.oAdvanceFeature?.bEditorsPick || article?.oAdvanceFeature?.bExclusiveArticle) &&
                      <div className={`${styles.advanceFeature} d-flex mb-2 mb-md-0 ms-md-auto me-1`}>
                        {article?.oAdvanceFeature?.bEditorsPick &&
                          <span className={`badge bg-light" ${styles.advFeature} d-flex align-items-center text-capitalize`}><EditorsPickIcon />{t('common:EditorsPick')}</span>
                        }
                        {article?.oAdvanceFeature?.bExclusiveArticle &&
                          <span className={`badge bg-light" ${styles.advFeature} d-flex align-items-center text-capitalize ms-2`}><ExclusiveIcon />{t('common:ExclusiveArticle')}</span>
                        }
                      </div>
                    }
                    {article?.iEventId && <p className={`text-danger ${styles.liveUpdate} mb-0`}><div className={styles.liveIcon} />{t('common:Live')}</p>}
                  </div>
                  <article>
                    <h1 className={`${styles.title}`}>{article?.sTitle}</h1>
                    <h2 className={`${styles.subTitle} small-head mb-2 mb-md-3 pt-2 pt-md-3`}>{article?.sSubtitle}</h2>
                    <div className={`${styles.authorBlock} d-flex flex-wrap align-items-start mb-2 mb-md-3`}>
                      <div className={`${styles.author} font-semi`}>
                        <div className={`${styles.authorDesc} pe-2 my-1 mb-md-2 mt-md-0`}>
                          <CustomLink href={allRoutes.authorDetail(article?.oDisplayAuthor?.oSeo?.sSlug)} prefetch={false}>
                            <a className={`text-capitalize ${isGlanceView || isMobileWebView ? 'pe-none' : ''}`}>
                              <span className="text-muted">{t('common:By')} </span>
                              {article?.oDisplayAuthor?.sDisplayName}{' '}
                              <OnMouseAndScroll>
                                {article?.oDisplayAuthor?.bIsVerified && (
                                  <span className={`${styles.verfied} d-inline-block rounded-circle align-text-top`}></span>
                                )}
                              </OnMouseAndScroll>
                            </a>
                          </CustomLink>
                          {/* <p className="mb-0 mt-1 xsmall-text text-secondary">{getDesignation(article?.oDisplayAuthor?.eDesignation)}</p> */}
                        </div>
                        {seoData?.eSchemaType !== 'ar' && (
                          <p className={`${styles.dates} w-100 xsmall-text font-semi mb-0`}>
                            {(article?.dPublishDisplayDate || article?.dPublishDate) && (
                              <time className="op-published d-none d-md-inline-block" dateTime={dateCheck(article?.dPublishDisplayDate || article?.dPublishDate)?.toISOString()}>
                                {t('common:Published')} - {convertDt24hFormat(dateCheck(article?.dPublishDisplayDate || article?.dPublishDate))} |&nbsp;
                              </time>
                            )}
                            <time className="op-modified" dateTime={(article?.dModifiedDate || article?.dUpdated) && dateCheck(article?.dModifiedDate || article?.dUpdated).toISOString()}>
                              {t('common:Updated')} - {convertDt24hFormat(dateCheck(article?.dModifiedDate || article?.dUpdated))}
                            </time>
                          </p>
                        )}
                      </div>
                      {/* <Button className="theme-btn outline-btn xsmall-btn">
                        <Trans i18nKey="common:Follow" />
                      </Button> */}
                      <div className="ms-auto">
                        <p className={`${styles.views} d-flex align-items-center mb-1`}>
                          <span className={styles.iconOuter}><ViewIcon /></span> {t('common:View')} : {abbreviateNumber(article?.nViewCount || article?.nOViews)}
                        </p>
                        <p className={`${styles.views} ${styles.duration} mb-0 d-flex align-items-center`}>
                          <span className={styles.iconOuter}><ClockIcon /></span>
                          {article?.nDuration > 0 ? article?.nDuration : DEFAULT_BLOG_READ} {t('common:Minute')}{' '}
                          {t('common:Read')}
                        </p>
                      </div>
                    </div>

                    {page <= 1 && (
                      <figure className="op-tracker mb-0 order-2 order-md-1">
                        <div className={`${styles.postImg} position-relative overflow-hidden br-lg`}>
                          <MyImage
                            fetchpriority="high"
                            src={getImgURL(article?.oImg?.sUrl) || noImage}
                            alt={article?.oImg?.sText || article?.sSrtTitle}
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL_BASE64}
                            height="160"
                            width="256"
                            layout="responsive"
                            loading="eager"
                            sizes="(max-width: 767px) 240px, (max-width: 991px) 320px, (max-width: 1190px) 360px, (max-width: 1400px) 700px, (max-width: 1920px) 800px"
                          />
                          {article?.oImg?.sCaption && (
                            <div className={`${styles.captionBlock} position-absolute`}>
                              <div className={`${styles.icon} light-bg position-absolute start-0 bottom-0 rounded-circle overflow-hidden`}>
                                <MyImage isLoadOnInteraction src={infoIcon} alt="info" height="24" width="24" layout="responsive" />
                              </div>
                              <div
                                className={`${styles.caption} light-bg py-1 ps-4 pe-2 mw-100 xsmall-text d-inline-block br-md c-transition`}
                                dangerouslySetInnerHTML={{ __html: article?.oImg?.sCaption }}
                              />
                            </div>
                          )}
                        </div>
                      </figure>
                    )}

                    <div className={`${styles.articleActionsMob} light-bg position-sticky text-center`}>
                      {!isPreviewMode && (
                        <ArticleActions
                          article={article}
                          type={type}
                          seoData={seoData}
                          currentClap={currentClap}
                          setCurrentClap={setCurrentClap}
                          totalClaps={totalClaps}
                          commentCount={commentCount}
                          setCommentCount={setCommentCount}
                          showComments={showComments}
                          setShowComments={setShowComments}
                          handleAddClap={handleAddClap}
                        />
                      )}
                    </div>
                    {isGlanceView && (
                      <GlanceAd
                        id="div-gpt-ad-2"
                        adId="Crictracker_small_banner_top"
                        dimension={[[320, 100], [320, 50], [300, 50]]}
                        adUnitName="Crictracker_English_InArticleMedium_Mid1"
                        placementName="InArticleMedium"
                        className="d-flex justify-content-center"
                        width={300}
                        height={250}
                        pageName="crictracker.com"
                      />
                    )}
                    {!(isMobileWebView || isGlanceView) && (
                      <div className='d-flex d-md-none flex-column' style={{ height: '260px' }}>
                        {width < 768 && ( // Mobile Below article image
                          <LazyLoad>
                            <Ads
                              id="div-ad-gpt-138639789-1646637094-0"
                              adIdDesktop="Crictracker2022_Mobile_AP_ATF_300x250"
                              dimensionDesktop={[300, 250]}
                              className="text-center mb-3"
                            />
                          </LazyLoad>
                        )}
                      </div>
                    )}
                    {width > 768 && ( // Desktop after google/Telegram
                      <LazyLoad>
                        <Ads
                          id="div-ad-gpt-Desktop_AP_ATF_728x90"
                          adIdDesktop="Crictracker2022_Desktop_AP_ATF_728x90"
                          adIdMobile="Crictracker2022_Mobile_AP_ATF_300x250"
                          dimensionDesktop={[728, 90]}
                          dimensionMobile={[300, 250]}
                          mobile
                          className={'text-center mb-4'}
                        />
                      </LazyLoad>
                    )}
                    {children}
                    {((article?.oSeo?.eType === 'ar' && article?.oAdvanceFeature?.bAllowLike) || (article?.oSeo?.eType === 'fa') || (article?.oAdvanceFeature?.bAllowComments)) && (
                      <LikeComment
                        article={article}
                        totalClaps={totalClaps}
                        commentCount={commentCount}
                        setShowComments={setShowComments}
                        handleAddClap={handleAddClap}
                      />
                    )}
                  </article>
                </section>
                {/* Desktop/Mobile above related Video and article  */}
                {isGlanceView && (
                  <GlanceAd
                    id="div-gpt-ad-3"
                    adId="Crictracker_mrec_bottom"
                    dimension={[[300, 250], [336, 280], 'fluid']}
                    className="mt-2 d-flex justify-content-center"
                    adUnitName="Crictracker_English_InArticleMedium_Mid3"
                    placementName="InArticleMedium"
                    width={300}
                    height={250}
                    pageName="crictracker.com"
                  />
                )}
                {!isPreviewMode && (
                  <LazyLoad>
                    <Ads
                      id="div-ad-gpt-138639789-1646637259-0"
                      adIdDesktop="Crictracker2022_Desktop_AP_BTF_728x90"
                      adIdMobile="Crictracker2022_Mobile_AP_BTF_300x250"
                      dimensionDesktop={[728, 90]}
                      dimensionMobile={[300, 250]}
                      mobile
                      className={'text-center mb-4'}
                    />
                  </LazyLoad>
                )}
                <div ref={observe}>
                  {isGlanceView && inView && (
                    <RelatedArticle categoryId={article?.oCategory?._id || article?.iCategoryId} articleId={article?._id} type={article?.oSeo?.eType} />
                  )}
                  {(!isGlanceView && !isPreviewMode && !isPreview && inView) && (
                    <>
                      {/* {(width < 768) && <PixFuture />} */}
                      {(width > 768 && (article?.oCategory?._id || article?.iCategoryId)) && (
                        <ArticleRelatedVideos categoryId={article?.oCategory?._id || article?.iCategoryId} articleId={article?._id} type={article?.oSeo?.eType} />
                      )}
                      <ErrorBoundary>
                        <TaboolaAds />
                      </ErrorBoundary>
                    </>
                  )}
                </div>
              </div>
              <div className="col-xxl-3 col-lg-4 common-sidebar">
                {!isPreviewMode && width > 768 && (
                  <>
                    <CurrentSeries />
                    {article?.aPoll?.map((p) => (
                      <Poll key={p?._id} details={p} isWidgetPoll />
                    ))}
                    <OnMouseAndScroll>
                      <AllWidget type={WIDGET.cricSpecial} show />
                      <AllWidget type={WIDGET.trendingNews} show />
                      {/* <PixFuture /> */}
                      <Ads
                        id="div-ad-gpt-138639789-1646637134-0"
                        adIdDesktop="Crictracker2022_Desktop_AP_RightATF_300x600"
                        dimensionDesktop={[300, 600]}
                        className="sticky-ads position-sticky mb-2"
                      />
                    </OnMouseAndScroll>
                  </>
                )}
              </div>
            </div>
          </div>
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
