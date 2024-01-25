import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import { addAdsInsideParagraph, addEditorAds, checkIsGlanceView } from '@shared/utils'
import InnerHTML from '@shared/components/InnerHTML'
import useTranslation from 'next-translate/useTranslation'
import { DownloadIcon } from '@shared/components/ctIcons'
import useOnMouseAndScroll from '@shared/hooks/useOnMouseAndScroll'

const ListicleArticle = dynamic(() => import('../listicleArticle'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const GlanceAd = dynamic(() => import('@shared/components/ads/glanceAd'))
const TipsNote = dynamic(() => import('@shared/components/fantasyTips/tipsNote'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))
const LiveArticle = dynamic(() => import('@shared/components/articleDetail/liveArticle'))
const FollowUs = dynamic(() => import('@shared/components/articleDetail/followUs'))
const CommonContent = dynamic(() => import('@shared/components/commonContent'))
const VuuklePlugin = dynamic(() => import('@shared/components/vuukle-plugin'))
function ArticleContent({ article }) {
  const router = useRouter()
  const isMobileWebView = router?.query?.isMobileWebView
  const { t } = useTranslation()
  const isGlanceView = checkIsGlanceView(router?.query)
  const { isLoaded } = useOnMouseAndScroll()

  useEffect(async () => {
    const ReactDOM = (await import('react-dom'))

    if (isGlanceView) {
      const fixAd1 = document.getElementById('fixed-ads-1')
      if (fixAd1) { // After 2nd paragraph
        ReactDOM.render(<GlanceAd
          id="div-gpt-ad-5"
          adId="Crictracker_mrec_mid"
          dimension={[[300, 250], [336, 280], 'fluid']}
          adUnitName="Crictracker_English_InArticleMedium_Mid2"
          placementName="InArticleMedium"
          className="d-flex justify-content-center"
          width={300}
          height={250}
          router={router}
          pageName="crictracker.com"
        />, fixAd1)
      }
    } else {
      // const { refreshGoogleAds } = (await import('@shared/libs/ads'))
      const gtAd1 = document.getElementById('gt-ads-1')
      if (gtAd1) { // Editor ads one
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-1660131756-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID3_728x90"
          // adIdMobile="Crictracker2022_Mobile_AP_MID3_300x250"
          dimensionDesktop={[728, 90]}
          // dimensionMobile={[300, 250]}
          // mobile
          className={'text-center mb-2 mb-md-3 d-none d-md-block'}
        />, gtAd1)
      }
      const gtAd2 = document.getElementById('gt-ads-2')
      if (gtAd2) { // Editor ads Two
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-1660131756-1"
          adIdDesktop="Crictracker2022_Desktop_AP_MID4_728x90"
          // adIdMobile="Crictracker2022_Mobile_AP_MID4_300x250"
          dimensionDesktop={[728, 90]}
          // dimensionMobile={[300, 250]}
          // mobile
          className={'text-center mb-2 mb-md-3 d-none d-md-block'}
        />, gtAd2)
      }
      const fixedAd2 = document.getElementById('fixed-ads-3')
      if (fixedAd2) { // After 3rd paragraph fixed ads
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-Desktop_AP_MID-1646637168-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_MID_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
          mobile
          className={'text-center'}
        />, fixedAd2)
      }
      const fixedAd5 = document.getElementById('fixed-ads-6')
      if (fixedAd5) { // After 6th paragraph fixed ads
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789_Desktop_AP_MID2_728-46637168-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID2_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_MID2_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
          mobile
          className={'text-center'}
        />, fixedAd5)
      }
      const videoAds = document.getElementById('video-ads')
      if (videoAds) { // Video ads after 1st paragraph
        ReactDOM.render(<Ads
          id="div-ad-desk-138639789-1684933887-0"
          adIdDesktop="Crictracker2022_Inread_1x1"
          dimensionDesktop={[1, 1]}
          className={'text-center'}
        />, videoAds)
      }
      // refreshGoogleAds()
    }
  }, [article?._id])

  function getArticleContent() {
    if (article?.bIsListicleArticle) {
      return <ListicleArticle article={article} outerStyle={styles} />
    } else if (article?.iEventId) {
      return (
        <>
          {article?.oLiveArticleContent?.sFirstContent ? (
            <CommonContent>
              <InnerHTML
                className={`${styles.content} text-break`} id="content"
                html={article?.oLiveArticleContent?.sFirstContent}
              />
            </CommonContent>
          ) : null}
          <div className={styles.content}>
            <LiveArticle liveArticleList={article?.oLiveArticleList} liveArticleEvent={article?.oLiveArticleEvent} liveEventId={article?.iEventId} />
          </div>
          {article?.oLiveArticleContent?.sLastContent ? (
            <CommonContent>
              <InnerHTML
                className={`${styles.content} text-break`} id="content"
                html={article?.oLiveArticleContent?.sLastContent}
              />
            </CommonContent>
          ) : null}
        </>
      )
    } else {
      return (
        <CommonContent>
          <InnerHTML
            className={`${styles.content} text-break`} id="content"
            // html={addEditorAds(addAdsInsideParagraph(article?.sContent, [0, 1, 2, 5]))}
            html={addEditorAds(addAdsInsideParagraph(article?.sContent, [1, 3, 6], isGlanceView ? 0 : 1))}
          />
        </CommonContent>
      )
    }
  }

  const Tag = (p) => (
    <CustomLink key={p?.item?._id} href={'/' + p?.item?.oSeo?.sSlug} prefetch={false}>
      <a target='_blank' className={`badge bg-primary m-1 font-semi py-1 px-3 ${p?.item?.eStatus === 'i' ? 'disabled' : ''}`}>
        {p?.item?.sName}
      </a>
    </CustomLink>
  )
  return (
    <>

      {getArticleContent()}
      {isLoaded && <VuuklePlugin />}
      {(!isGlanceView && !isMobileWebView) && (
        <>
          <FollowUs className="mb-3 mb-lg-4" />
          <TipsNote heading={t('common:DownloadOurApp')} headingIcon={<DownloadIcon />} isDownloadAppDisclaimer className="pt-0 pb-3" />
        </>
      )}
      <div className={`${styles.tagList} d-flex flex-lg-wrap pb-2 pb-lg-0 mx-n1 overflow-auto`}>
        {article?.aSeries?.map((item, index) => <Tag key={item?._id} item={item} index={index} />)}
        {article?.aTeam?.map((item, index) => <Tag key={item?._id} item={item} index={index} />)}
        {article?.aPlayer?.map((item, index) => <Tag key={item?._id} item={item} index={index} />)}
        {article?.aTags?.map((item, index) => <Tag key={item?._id} item={item} index={index} />)}
        {/* <Ads
          id="div-ad-gpt-138639789-1646637259-0"
          adIdDesktop="Crictracker2022_Desktop_AP_BTF_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_BTF_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
        /> */}
      </div>
    </>
  )
}
ArticleContent.propTypes = {
  article: PropTypes.object
}

export default ArticleContent
