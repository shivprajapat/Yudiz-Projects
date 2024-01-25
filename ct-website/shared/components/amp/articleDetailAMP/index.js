import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import Head from 'next/head'

import LayoutAmp from '@shared-components/layout/layoutAmp'
import BreadcrumbNavAMP from '@shared-components/amp/breadcrumbNavAMP'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { getDesignation, convertDt24hFormat, getArticleImg, getImgURL, abbreviateNumber, dateCheck, checkPageNumberInSlug } from '@utils'
import { DEFAULT_BLOG_READ, GOOGLE_NEWS_LINK, TELEGRAM_NEWS_LINK } from '@shared/constants'
import Link from 'next/link'
import { allRoutes } from '@shared/constants/allRoutes'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { articleLoader } from '@shared/libs/allLoader'
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
      <style jsx amp-custom global>{`
       .common-section.pb-0{padding-bottom:0}.postTitle{border-bottom:1px solid #d2d5d9}.articleBlock{padding:24px 30px;position:relative}.advFeature{padding:2px 12px;font-size:11px;line-height:16px;border-radius:2em;max-width:100%;background:#e7f0ff;color:#23272e;font-weight:500}.advFeature .icon{margin-right:2px;width:24px}.subTitle{margin-bottom:24px;font-weight:500}.authorBlock{margin-bottom:16px}.authorBlock .views svg{margin-right:6px;width:28px;height:28px}.authorBlock .dates{width:100%}amp-ad{display:block;margin:0px auto 12px}.author{margin-bottom:16px}.author .verfied{width:18px;height:18px;background:#5090f6 url(/static/checked-icon.svg) no-repeat center center/cover;border-radius:50%;vertical-align:middle}.author .authorImg{width:44px;height:44px;border-radius:50%;overflow:hidden}.author .authorDesc{padding:0 12px}.followUs{margin:24px 0;padding:16px 8px;background:#e7f0ff;border-radius:12px}.followUs p{margin:0px 8px;color:#0e3778}.articlePage .follow.theme-btn{margin:0 6px;padding-left:48px;position:relative}.articlePage .follow.theme-btn>span{position:absolute;width:40px;left:-2px;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}.content{font-size:18px;line-height:27px;color:var(--font-secondary)}.content p{margin-bottom:24px}.content a{color:#045de9}.content a:hover{color:"Noto Sans Display",sans-serif}.content ul,.content ol{margin-bottom:24px;padding-left:20px;font-size:16px;line-height:27px;font-weight:700}.content ul{list-style:disc}.content ol{list-style:decimal}.content li{padding-left:10px}.content blockquote{margin-bottom:24px;padding:16px 16px 20px 66px;background:#e7f0ff url(/static/quote-icon.svg) no-repeat 16px 14px/40px auto;font-size:21px;line-height:32px;color:#0e3778;font-style:italic;border-radius:16px}.content .table-responsive,.content .table-scroller{margin-bottom:16px;overflow-x:auto;-webkit-overflow-scrolling:touch}.content table{margin:0px;width:100%;font-size:14px;line-height:20px;border-spacing:0 4px;border-collapse:separate;border:none;white-space:nowrap}.content table p{margin:0}.content table tr:first-child th,.content table tr:first-child td{background:#045de9;font-weight:600;color:#fff}.content table th,.content table td{padding:4px 14px;height:44px;background:#f2f4f7}.content table th:first-child,.content table td:first-child{border-radius:8px 0 0 8px}.content table th:last-child,.content table td:last-child{border-radius:0 8px 8px 0}.content img{margin-bottom:24px;width:100%;max-width:100%;height:auto}.postImg{margin-bottom:24px;border-radius:16px;overflow:hidden}.iframeVideo{max-width:520px;border-radius:16px;overflow:hidden}.tagList span{margin:4px;display:inline-block;padding:4px 16px;background:#e7f0ff;color:#045de9;font-weight:600;border-radius:2em}.views .icon{width:20px;margin-right:4px}.views .icon.clock{width:16px;margin-left:4px;margin-right:6px}.social-share amp-social-share{margin:0px 8px;border-radius:8px;background-size:auto 80%}.custom-native-share{min-width:36px;background:#e7f0ff;font-size:12px;color:#23272e;border:none}.custom-native-share:focus{outline:none;box-shadow:none}.custom-native-share .icon{width:20px}@media(max-width: 1399px){.content{font-size:17px;line-height:26px}.content p{margin-bottom:22px}.content blockquote{font-size:19px;line-height:28px}}@media(max-width: 1199px){.articleBlock{padding:20px 24px}.followUs{margin:20px 0}.followUs p{color:#0e3778}.followUs button.follow{padding-left:42px}.followUs button.follow>span{width:36px}}@media(max-width: 991px){.content{font-size:16px;line-height:24px}.content p{margin-bottom:22px}.content blockquote{font-size:18px;line-height:30px}.content table{margin:-4px 0px 4px;border-spacing:0 6px}.content table th,.content table td{padding:4px 10px;height:40px}.content table th:first-child,.content table td:first-child{border-radius:4px 0 0 4px}.content table th:last-child,.content table td:last-child{border-radius:0 4px 4px 0}}@media(max-width: 767px){.followUs{margin:20px 0}.followUs p{margin-bottom:16px}.articlePage .follow.theme-btn{margin:0 4px;padding-left:44px}.dates p{display:flex;flex-direction:column}}@media(max-width: 575px){.articleBlock{margin:0px -12px;padding:16px 12px;border-radius:0}.subTitle{margin-bottom:12px}.postImg{margin:0 -12px 12px;border-radius:0px}.authorBlock{margin-bottom:16px}.content blockquote{padding:62px 16px 20px 16px}.content p,.content img,.content blockquote,.content ul,.content ol{margin-bottom:20px}.content ul,.content ol{padding-left:18px;font-size:14px;line-height:24px}.content li{padding-left:8px}.content .table-responsive,.content .table-scroller{margin-bottom:12px}.content table{margin:-3px 0px 3px;border-spacing:0 6px;font-size:13px}.content table th,.content table td{padding:2px 5px;height:30px}.content table th:first-child,.content table td:first-child{border-radius:3px 0 0 3px;padding-left:10px}.content table th:last-child,.content table td:last-child{border-radius:0 3px 3px 0;padding-right:10px}}/*# sourceMappingURL=style.css.map */

        `}
      </style>

      <LayoutAmp title="CricTracker | Article" data={{ ...article, oSeo: { ...article?.oSeo, ...seoData } }} isPreviewMode={isPreviewMode}>
        <main className="articlePage main-content">
          <amp-sticky-ad layout="nodisplay">
            <amp-ad
              width="320"
              height="50"
              type="doubleclick"
              data-slot="/138639789/Crictracker2022_AMP_Sticky_320x50"
            >
            </amp-ad>
          </amp-sticky-ad>
          <section className="common-section">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col col-xxl-8 col-lg-9 col-md-11">
                  <section className="articleBlock common-box">
                    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between">
                      {!isPreviewMode && <BreadcrumbNavAMP isArticle />}
                      <div className="d-flex mb-2 mb-md-0">
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
                    </div>
                    <article>
                      <h1 className="postTitle pb-2 pb-sm-3">{article?.sTitle}</h1>
                      <h3 className="subTitle small-head text-secondary">{article?.sSubtitle}</h3>
                      {page <= 1 && (
                        <div className="postImg">
                          <amp-img alt="post" src={getArticleImg(article)?.sUrl || noImage} width="712" height="475" layout="responsive" ></amp-img>
                        </div>
                      )}
                      <div className="authorBlock d-flex flex-wrap align-items-start">
                        <div className="author d-flex align-items-center font-semi">
                          <div className="authorImg">
                            <Link href={allRoutes.authorDetail(article?.oDisplayAuthor?.oSeo?.sSlug)} prefetch={false}>
                              <a>
                                <amp-img alt="author-name"
                                  src={getImgURL(article?.oDisplayAuthor?.sUrl) || '/static/person-placeholder.jpg'}
                                  width="44"
                                  height="44"
                                  layout="responsive" >
                                </amp-img>
                              </a>
                            </Link>
                          </div>
                          <div className="authorDesc">
                            <Link href={allRoutes.authorDetail(article?.oDisplayAuthor?.oSeo?.sSlug)} prefetch={false}>
                              <a>
                                {article?.oDisplayAuthor?.sDisplayName?.toUpperCase()}{' '}
                                {article?.oDisplayAuthor?.bIsVerified && (
                                  <span className="verfied d-inline-block align-text-top"></span>
                                )}
                              </a>
                            </Link>
                            <p className="mb-0 mt-1 xsmall-text text-secondary">{getDesignation(article?.oDisplayAuthor?.eDesignation)}</p>
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
                        <div className="dates d-flex align-items-start justify-content-between xsmall-text font-semi mb-0">
                          <p>
                            {(article?.dPublishDisplayDate || article?.dPublishDate) && (
                              <span><Trans i18nKey="common:Published" /> - {convertDt24hFormat(dateCheck(article?.dPublishDisplayDate || article?.dPublishDate))} | </span>
                            )}
                            <span><Trans i18nKey="common:Updated" /> - {convertDt24hFormat(dateCheck(article?.dModifiedDate || article?.dPublishDisplayDate))}</span>
                          </p>
                          <amp-social-share height="18" type="system" aria-label="Share" className="custom-native-share d-flex align-items-center">
                            <div className="icon d-block me-1">
                              <amp-img src="/static/share-dark-icon.svg" alt="google" width="40" height="40" layout="responsive" ></amp-img>
                            </div>
                            Share
                          </amp-social-share>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center">
                        <amp-ad width="300" height="250"
                          type="doubleclick"
                          data-slot="/138639789/Crictracker2022_AMP_ATF_300x250">
                        </amp-ad>
                      </div>
                      <div className="followUs d-flex flex-column flex-md-row align-items-center justify-content-center">
                        <p className="font-semi"><Trans i18nKey="common:GetEveryCricketUpdatesFollowUsOn" /> :</p>
                        <div>
                          <a href={GOOGLE_NEWS_LINK} target="_blank" rel="noreferrer" className="follow theme-btn outline-btn small-btn">
                            <span className="icon d-inline-block">
                              <amp-img src="/static/google-share.png" alt="google" width="40" height="40" layout="responsive" ></amp-img>
                            </span>
                            <Trans i18nKey="common:GoogleNews" />
                          </a>
                          <a href={TELEGRAM_NEWS_LINK} target="_blank" rel="noreferrer" className="follow theme-btn outline-btn small-btn">
                            <span className="icon d-inline-block">
                              <amp-img src="/static/telegram-share.png" alt="telegram" width="40" height="40" layout="responsive" ></amp-img>
                            </span>
                            <Trans i18nKey="common:Telegram" />
                          </a>
                        </div>
                      </div>
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
