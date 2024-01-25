import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

import InnerHTML from '@shared/components/InnerHTML'
import ListicleArticleAMP from '@shared/components/amp/listicleArticleAMP'
import { addAmpAdsInsideParagraph, addEditorAds } from '@shared/utils'
import LiveArticleAmp from '@shared/components/amp/liveArticleAmp'
import TipsNote from '@shared-components/amp/fantasyTips/tipsNote'
import { DownloadIcon } from '@shared/components/ctIcons'
import FollowUsAMP from '@shared/components/amp/articleDetailAMP/followUsAMP'

const ArticleContentAMP = ({ article, isPreviewMode, seoData, latestArticles }) => {
  // const { string } = pixFutureAMPString
  const { t } = useTranslation()

  function getArticleContent() {
    if (article?.bIsListicleArticle) {
      return <ListicleArticleAMP article={article} />
    } else if (article?.iEventId) {
      return (
        <>
          <Head>
            <script async custom-element='amp-fx-flying-carpet' src='https://cdn.ampproject.org/v0/amp-fx-flying-carpet-0.1.js'></script>
          </Head>
          <InnerHTML
            className='content text-break'
            html={article?.oLiveArticleAmpContent?.sFirstAmpContent}
          />
          <div className=''>
            <LiveArticleAmp liveArticleList={article?.oLiveArticleList} liveArticleEvent={article?.oLiveArticleEvent} liveEventId={article?.iEventId} />
          </div>
          <InnerHTML
            className='content text-break'
            html={article?.oLiveArticleAmpContent?.sLastAmpContent}
          />
        </>
      )
    } else {
      return <>
        <Head>
          <script async custom-element='amp-fx-flying-carpet' src='https://cdn.ampproject.org/v0/amp-fx-flying-carpet-0.1.js'></script>
        </Head>
        <InnerHTML
          className="content"
          html={
            addEditorAds(
              addAmpAdsInsideParagraph({
                content: article?.sAmpContent,
                ad1: '138639789/Crictracker2022_AMP_MID_300x250',
                ad2: '138639789/Crictracker2022_AMP_MID2_300x250',
                paragraph: [0, 1, 3],
                customAd: {
                  1: `
                    <div>
                      <amp-fx-flying-carpet height="300px">
                        <amp-ad width="300" height="600" layout="fixed" type="doubleclick" data-slot="138639789/Crictracker2022_AMP_FC_300x600" data-enable-refresh="30"></amp-ad>
                      </amp-fx-flying-carpet>
                    </div>
                    `,
                  0: `
                    <div style="display: flex; justify-content: center">
                      <amp-ad
                        width="300"
                        height="250"
                        type="doubleclick"
                        data-slot="/138639789/Crictracker2022_AMP_Teads_300x250"
                        data-multi-size-validation="false"
                        data-multi-size=""
                      ></amp-ad>
                    </div>
                  `
                }
                // Set position 3 if you want to add pixfuture live
                // pixFuture: { position: 500, string: string }
              })
            )
          }
        /></>
    }
  }

  return (
    <>
      <style jsx amp-custom global>{`
    .link-preview-height{height:100px}.link-preview-width{width:100px}.link-preview-overflow{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}.line-height-color{line-height:18px;color:var(--font-secondary)}.embed-link-preview{margin:4px 0;position:relative;border:1px solid var(--border-light);border-radius:20px;overflow:hidden}.embed-link-preview .link{position:absolute;top:0;left:0;width:100%}.ctLinkPreview{width:calc(100% - 120px);flex-direction:column;padding:5px 10px}.embed-link-preview .image-preview img{object-fit:cover}.ctLinkPreview .title{margin:5px 0;font-size:14px;font-weight:600}.ctLinkPreview .description{padding-top:5px;font-size:11px}.ctLinkPreview .url{flex:1}.ctLinkPreview .url a{font-size:12px}
        `}
      </style>
      {getArticleContent()}
      {/* <div className="content" dangerouslySetInnerHTML={{ __html: article?.bIsListicleArticle ? article?.oListicleArticle?.sMainContent : article?.sAmpContent }}></div> */}
      <div className="d-flex justify-content-center">
        <amp-ad
          width="300"
          height="250"
          type="doubleclick"
          data-slot="138639789/Crictracker2022_AMP_BTF_300x250"
          data-multi-size-validation="false"
          data-enable-refresh="30"
        />
      </div>
      <FollowUsAMP className="mb-3" />
      <TipsNote heading={t('common:DownloadOurApp')} headingIcon={<DownloadIcon />} isDownloadAppDisclaimer className="pt-0 pb-3" isArticleClass />
      <div className="tagList d-flex flex-wrap">
        {article?.aSeries?.map((cat) => (
          <a key={cat?._id} href={`/${cat?.oSeo?.sSlug}/`}>
            <span className="badge bg-primary">
              {cat?.sName}
            </span>
          </a>
        ))}
        {article?.aTeam?.map((team) => (
          <a key={team?._id} href={`/${team?.oSeo?.sSlug}/`}>
            <span className="badge bg-primary">
              {team?.sName}
            </span>
          </a>
        ))}
        {article?.aPlayer?.map((player) => (
          <a key={player?._id} href={`/${player?.oSeo?.sSlug}/`}>
            <span className="badge bg-primary">
              {player?.sName}
            </span>
          </a>
        ))}
        {article?.aTags?.map((tag) => (
          <a key={tag?._id} href={`/${tag?.oSeo?.sSlug}/`}>
            <span className="badge bg-primary">
              {tag?.sName}
            </span>
          </a>
        ))}
      </div>
    </>
  )
}

ArticleContentAMP.propTypes = {
  article: PropTypes.object,
  seoData: PropTypes.object,
  isPreviewMode: PropTypes.bool,
  latestArticles: PropTypes.array
}

export default ArticleContentAMP
