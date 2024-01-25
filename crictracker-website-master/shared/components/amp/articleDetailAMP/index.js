import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import LayoutAmp from '@shared-components/layout/layoutAmp'
import BreadcrumbNavAMP from '@shared-components/amp/breadcrumbNavAMP'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { convertDt24hFormat, getArticleImg, abbreviateNumber, dateCheck, checkPageNumberInSlug } from '@utils'
import { DEFAULT_BLOG_READ } from '@shared/constants'
import { allRoutes } from '@shared/constants/allRoutes'
import { articleLoader } from '@shared/libs/allLoader'
import CustomLink from '@shared/components/customLink'

const ArticleSmall = dynamic(() => import('@shared-components/amp/articleAMP/articleSmall'), { loading: () => articleLoader(['s']) })

const ArticleDetailAMP = ({ article, isPreviewMode, seoData, children, latestArticles }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const slug = router?.asPath?.split('/').filter(e => e)
  const { lastSlug } = checkPageNumberInSlug(slug)
  const page = Number(lastSlug) || 1

  return (
    <>
      <Head>
        <link rel="preload" href={getArticleImg(article)?.sUrl || noImage} as="image" />
      </Head>
      {/* Article Details CSS */}
      <style jsx amp-custom global>{`
      .text-danger{color:#f14f4f}.common-section.pb-0{padding-bottom:0}.articleBlockSec{padding:5px 0px 10px}.postTitle{font-size:18px;line-height:22px;color:var(--font-color-light)}.articleBlock{margin:0px -12px;padding:16px 12px;background:var(--light-mode-bg)}.advFeature{padding:2px 12px;font-size:11px;line-height:16px;border-radius:2em;max-width:100%;background:var(--theme-light);color:var(--font-color);font-weight:500}.advFeature .icon{margin-right:2px;width:24px}@media(prefers-color-scheme: dark){.advFeature .icon{filter:brightness(0) invert(1) opacity(0.7)}}.subTitle{font-weight:500;font-size:14px;line-height:19px;border-top:1px solid var(--border-light)}.authorBlock .views svg{margin-right:6px;width:28px;height:28px}.authorBlock .dates{width:100%}amp-ad{display:block;margin:0px auto 12px}.author .verfied{width:18px;height:18px;background:url(/static/verified_badge.svg) no-repeat center center/cover;border-radius:50%;vertical-align:middle}.articlePage .follow.theme-btn{margin:0 6px;padding-left:48px;position:relative}.articlePage .follow.theme-btn>span{position:absolute;width:40px;left:-2px;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}.content{font-size:16px;line-height:24px;color:var(--font-secondary)}.content p{margin-bottom:14px}.content a{color:var(--theme-color-medium);text-decoration:underline}.content a:hover{color:"Noto Sans Display",Noto Sans Display fallback}.content ul,.content ol{margin-bottom:14px;padding-left:20px;font-size:16px;line-height:27px;font-weight:700}.content ul{list-style:disc}.content ol{list-style:decimal}.content li{padding-left:10px}.content blockquote{margin-bottom:14px;padding:16px 16px 20px 66px;background:#e7f0ff url(/static/quote-icon.svg) no-repeat 16px 14px/40px auto;font-size:21px;line-height:32px;color:#0e3778;font-style:italic;border-radius:16px}.content .table-responsive,.content .table-scroller{margin-bottom:16px;overflow-x:auto;-webkit-overflow-scrolling:touch}.content table{margin:0px;width:100%;font-size:14px;line-height:20px;border-spacing:0 4px;border-collapse:separate;border:none;white-space:nowrap}.content table p{margin:0}.content table tr:first-child th,.content table tr:first-child td{background:#045de9;font-weight:600;color:#fff}.content table th,.content table td{padding:3px 14px;height:42px;background:var(--light-bg);border:none}.content table th:first-child,.content table td:first-child{border-radius:8px 0 0 8px}.content table th:last-child,.content table td:last-child{border-radius:0 8px 8px 0}.content amp-img{margin-bottom:24px;width:100%;max-width:100%;height:auto}figure{margin-bottom:24px;width:100%;position:relative;border-radius:16px;overflow:hidden}figure img{margin-bottom:0px;border-radius:16px}figure figcaption{font-style:italic;color:#7b7b7b;font-size:12px;line-height:14px;text-align:center;margin-top:5px}figure figcaption:empty{display:none}.postImg{position:relative;margin-bottom:24px;border-radius:16px;overflow:hidden}.postImg .captionBlock{position:absolute;left:12px;bottom:12px;width:calc(100% - 24px)}.postImg .icon{border-radius:16px;position:absolute;bottom:0;left:0;width:24px;height:24px;background:var(--light-mode-bg);cursor:pointer;z-index:2}@media(prefers-color-scheme: dark){.postImg .icon img{-webkit-filter:brightness(0) invert(1) opacity(0.7);filter:brightness(0) invert(1) opacity(0.7)}}.postImg .overlay{max-width:100%;padding:4px 10px 4px 26px;line-height:16px;border-radius:12px;-webkit-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;transition:all .3s ease-in-out;background:var(--light-mode-bg)}.postImg .overlay *{margin:0}.liveUpdate{background:var(--light-bg);padding:3px 8px;margin-top:-4px;border-radius:8px;display:inline-block}.liveUpdate .liveIcon{margin:0px 8px 0px 4px;position:relative;top:-1px;width:8px;height:8px;display:inline-block;border-radius:50%;background:#f14f4f;box-shadow:0 0 0 3px rgba(241,79,79,.5),0 0 0 6px rgba(241,79,79,0)}.iframeVideo{max-width:520px;border-radius:16px;overflow:hidden}.tagList span{margin:4px;display:inline-block;padding:4px 16px;background:var(--theme-light);color:var(--theme-color-light);font-weight:600;border-radius:2em}.views .icon{width:20px;margin-right:4px}.views .icon.clock{width:16px;margin-left:4px;margin-right:6px}.social-share amp-social-share{margin:0px 8px;border-radius:8px;background-size:auto 80%}.custom-native-share{margin-top:-4px;background:var(--light-bg);border:none;border-radius:50%}.custom-native-share:focus{outline:none;box-shadow:none}.custom-native-share .icon{width:20px;height:20px;background:url(/static/share-dark-icon.svg) no-repeat center center/100% auto}@media(prefers-color-scheme: dark){.custom-native-share .icon{filter:brightness(0) invert(1) opacity(0.7)}}@media(max-width: 991px){.content blockquote{font-size:18px;line-height:30px}.content table{margin:-4px 0px 4px;border-spacing:0 6px}.content table th,.content table td{padding:4px 10px;height:40px}.content table th:first-child,.content table td:first-child{border-radius:4px 0 0 4px}.content table th:last-child,.content table td:last-child{border-radius:0 4px 4px 0}}@media(max-width: 767px){.articlePage .follow.theme-btn{margin:12px 4px 0;padding-left:44px}.dates p{display:flex;flex-direction:column}}@media(max-width: 575px){.postImg{margin:0 -12px 12px;border-radius:0px}.content blockquote{padding:62px 16px 20px 16px}.content ul,.content ol{padding-left:18px;font-size:14px;line-height:24px}.content li{padding-left:8px}.content .table-responsive,.content .table-scroller{margin-bottom:12px}.content table{margin:-3px 0px 3px;border-spacing:0 6px;font-size:13px}.content table th,.content table td{padding:2px 5px;height:30px}.content table th:first-child,.content table td:first-child{border-radius:3px 0 0 3px;padding-left:10px}.content table th:last-child,.content table td:last-child{border-radius:0 3px 3px 0;padding-right:10px}}/*# sourceMappingURL=style.css.map */

      `}</style>

      {/* Twitter CSS */}
      <style jsx amp-custom global>{`
       .ctTweet{width:530px;max-width:100%;background:var(--light-color-medium);border:1px solid;border-color:var(--border-light);border-radius:14px}.ctTweet>*{font-size:16px;line-height:1.5}.ctTweet .tweetUserImg{width:42px;height:42px;object-fit:cover;border-radius:50%}.ctTweet .quotedTweet{border:1px solid var(--border-light);border-radius:10px}.ctTweet a{pointer-events:none}.ctTweet .twitterVerified{width:15px}.ctTweet amp-video.tweetImg{width:100%;height:100%}.ctTweet amp-video{aspect-ratio:initial;height:100%;width:100%;object-fit:cover}.ctTweet .twitterLogo{width:20px}.ctTweet .tweetUser{gap:10px}.ctTweet img{margin-bottom:0px;object-fit:cover}.ctTweet .tweetBody .tweetBody-verticle-rule{margin-left:11px;flex-shrink:0}.ctTweet .tweetBody .tweetBody-verticle-rule>.vr{width:2px;height:100%;background-color:var(--border-light)}.ctTweet .tweetBody p:not(:last-child){margin-bottom:8px}.ctTweet .tweetBody a{color:#045de9}.ctTweet .tweetBody video{aspect-ratio:initial;height:100%;width:100%;object-fit:cover}.ctTweet .tweetImgList{gap:2px}.ctTweet .tweetVideoBlock{width:100%}.ctTweet .tweetFooter{color:inherit}.ctTweet .tweetImg{width:calc(50% - 2px);margin:1px;border-radius:6px;object-fit:cover;overflow:hidden}.ctTweet .imgCount3{display:block;width:100%}.ctTweet .imgCount3 .tweetImg{float:left}.ctTweet .imgCount3 .tweetImg:nth-child(1){height:302px;margin:0 2px 0 0}.ctTweet .imgCount3 .tweetImg:not(:nth-child(1)){height:150px}.ctTweet .tweetFooterItem .tweetFooterIcon{width:20px}.ctTweet>img{margin-bottom:0}.ctTweet .quotedTweetHead>*{font-size:14px}.ctTweet .quotedTweetBody>*{font-size:14px}.ctTweet .quotedTweetHead>.tweetUser>.tweetUserInfo{display:flex;gap:8px;align-items:center}.ctTweet .quotedTweetHead>.tweetUser>.tweetUserImg{width:32px;height:32px}.ctTweet .tweetDivider{width:100%;height:1px;border-radius:50%;background:var(--border-light)}.ctTweet .tweetCreatedTime{font-size:16px;opacity:.7}.ct-insta-frame{border:1px solid #d2d5d9}@media(max-width: 575px){.ctTweet>*{font-size:14px}.quotedTweetHead>.tweetUser>.tweetUserInfo{flex-direction:column;align-items:flex-start;gap:0px}.w-100{width:100%}}/*# sourceMappingURL=style.css.map */
      
      `}</style>
      {/* For view count update */}
      {/* <amp-state id="shirts" src="/api/health-check/"/> */}
      <LayoutAmp title="CricTracker | Article" data={{ ...article, oSeo: { ...article?.oSeo, ...seoData } }} isPreviewMode={isPreviewMode}>
        <main className="articlePage main-content">
          <amp-sticky-ad layout="nodisplay">
            <amp-ad
              width="320"
              height="50"
              type="doubleclick"
              data-slot="138639789/Crictracker2022_AMP_Sticky_320x50"
              data-multi-size-validation="false"
              data-enable-refresh="30"
            />
          </amp-sticky-ad>
          <section className="pt-1 pb-3">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col col-xxl-8 col-lg-9 col-md-11">
                  <section className="articleBlock">
                    <div className="d-flex align-items-start justify-content-between">
                      {!isPreviewMode && <BreadcrumbNavAMP isArticle />}
                      <amp-social-share height="24" width="24" type="system" aria-label="Share" className="custom-native-share d-flex align-items-center justify-content-center ms-auto">
                        <div className="icon d-block"></div>
                      </amp-social-share>
                      {article?.iEventId && <div className='text-danger liveUpdate ms-1'><div className='liveIcon'></div>Live</div>}
                    </div>
                    {(article?.oAdvanceFeature?.bEditorsPick || article?.oAdvanceFeature?.bExclusiveArticle) && (
                      <div className="d-flex mb-2">
                        {article?.oAdvanceFeature?.bEditorsPick &&
                          <span className="advFeature d-flex align-items-center text-capitalize">
                            <span className="icon">
                              <amp-img alt="author-name"
                                src="/static/editors-pick-icon.svg"
                                width="32"
                                height="32"
                                layout="responsive" >
                              </amp-img>
                            </span>
                            {t('common:EditorsPick')}
                          </span>
                        }
                        {article?.oAdvanceFeature?.bExclusiveArticle &&
                          <span className="advFeature d-flex align-items-center text-capitalize ms-2">
                            <span className="icon">
                              <amp-img alt="author-name"
                                src="/static/exclusive-icon.svg"
                                width="32"
                                height="32"
                                layout="responsive" >
                              </amp-img>
                            </span>
                            {t('common:ExclusiveArticle')}
                          </span>
                        }
                      </div>
                    )}
                    <article>
                      <h1 className="postTitle mb-2">{article?.sTitle}</h1>
                      <h2 className="subTitle small-head mb-2 pt-2">{article?.sSubtitle}</h2>
                      <div className="authorBlock d-flex flex-wrap align-items-center mb-2">
                        <div className="author d-flex align-items-center font-semi">
                          <div className="authorDesc me-2">
                            <CustomLink href={allRoutes.authorDetail(article?.oDisplayAuthor?.oSeo?.sSlug)} prefetch={false}>
                              <a className="my-1 d-inline-flex">
                                <span className="text-muted">{t('common:By')}&nbsp;</span>
                                {article?.oDisplayAuthor?.sDisplayName}{' '}
                                {article?.oDisplayAuthor?.bIsVerified && (
                                  <span className="verfied d-inline-block align-text-top ms-1"></span>
                                )}
                              </a>
                            </CustomLink>
                            {seoData?.eSchemaType !== 'ar' && (
                              <p className="mb-0 xsmall-text">
                                <span><Trans i18nKey="common:Updated" /> - {convertDt24hFormat(dateCheck(article?.dModifiedDate || article?.dUpdated))}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="views ms-auto">
                          <div className="d-flex align-items-center">
                            <span className="icon">
                              <amp-img alt="view"
                                src="/static/view-icon.svg"
                                width="24"
                                height="24"
                                layout="responsive" >
                              </amp-img>
                            </span>
                            <span className="ms-1"><Trans i18nKey="common:View" /> : {abbreviateNumber(article?.nViewCount || article?.nOViews)}</span>
                          </div>
                          <div className="d-flex align-items-center mt-1">
                            <span className="icon clock">
                              <amp-img alt="clock"
                                src="/static/clock-icon.svg"
                                width="24"
                                height="24"
                                layout="responsive" >
                              </amp-img>
                            </span>
                            <span className="text-primary">
                              {article?.nDuration > 0 ? article?.nDuration : DEFAULT_BLOG_READ} <Trans i18nKey="common:Minute" /> <Trans i18nKey="common:Read" />
                            </span>
                          </div>
                        </div>
                      </div>
                      {page <= 1 && (
                        <div className="postImg">
                          <amp-img alt="post" src={getArticleImg(article)?.sUrl || noImage} width="712" height="475" layout="responsive" ></amp-img>
                          {article?.oImg?.sCaption && (
                            <div className="captionBlock">
                              <div className="icon rounded-circle overflow-hidden" >
                                <amp-img tabIndex={article?._id} role='imgSource' on="tap:myOverlay.toggleVisibility" src="/static/info-icon.svg" alt="info" height="24" width="24" layout="responsive" />
                              </div>
                              <div id="myOverlay" hidden={true} className="overlay xsmall-text d-inline-block">
                                <p>{article?.oImg?.sCaption}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="d-flex justify-content-center">
                        <amp-ad
                          width="300"
                          height="250"
                          type="doubleclick"
                          data-slot="138639789/Crictracker2022_AMP_ATF_300x250"
                          data-multi-size-validation="false"
                          data-enable-refresh="30"
                        />
                      </div>
                      {/* <div className="demo-demo">
                        <amp-iframe width="200" height="100" sandbox="allow-scripts allow-same-origin allow-top-navigation" layout="responsive" frameborder="0" resizable src="https://v.24liveblog.com/iframe/?id=3184107989264086957" style={{ position: 'relative' }}>
                          <amp-img layout='fill' src='https://cdn.24liveblog.com/transparent.png' placeholder></amp-img><div overflow role='button' aria-label='Read more' style={{ background: '#0088cc', color: '#fff', borderRadius: '4px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%)', fontSize: '12px', fontWeight: '300', padding: '5px 20px' }}>Start View Liveblog</div>
                        </amp-iframe>
                      </div> */}
                      {children}
                    </article>
                  </section>
                </div>
                <div className='col col-xxl-8 col-lg-9 col-md-11'>
                  {latestArticles?.length > 0 && (
                    <>
                      <h4 className="text-uppercase">
                        <Trans i18nKey="common:latestArticle" />
                      </h4>
                      <section>
                        {latestArticles.map((a, i) => <ArticleSmall data={a} key={i} />)}
                      </section>
                    </>
                  )}
                </div>
                {/* {REACT_APP_ENV !== 'production' && ( */}
                <div className='col col-xxl-8 col-lg-9 col-md-11'>
                  <amp-embed width='100' height='100'
                    type='taboola'
                    layout='responsive'
                    data-publisher='crictracker'
                    data-mode='alternating-thumbnails-amp'
                    data-placement='Below Article Thumbnails AMP'
                    data-target_type='mix'
                    data-article='auto'
                    data-url=''>
                  </amp-embed>
                </div>
                {/* )} */}
              </div>
            </div>
          </section>
        </main>
        {/* {!isPreviewMode && <Comments showComments={showComments} handleComments={handleComments} articleId={article?._id} commentData={commentData.current} count={commentCount.current} />} */}
        {/* <CommentsAMP handleComments={handleComments} articleId={article?._id} commentData={commentData.current} count={commentCount.current} /> */}
      </LayoutAmp>
    </>
  )
}

ArticleDetailAMP.propTypes = {
  article: PropTypes.object,
  seoData: PropTypes.object,
  isPreviewMode: PropTypes.bool,
  children: PropTypes.node.isRequired,
  latestArticles: PropTypes.array
}

export default ArticleDetailAMP
