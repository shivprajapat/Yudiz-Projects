import React from 'react'
import PropTypes from 'prop-types'

import InnerHTML from '@shared/components/InnerHTML'
import ListicleArticleAMP from '../listicleArticleAMP'
import { addAmpAdsInsideParagraph, addEditorAds } from '@shared/utils'

const ArticleContentAMP = ({ article, isPreviewMode, seoData, latestArticles }) => {
  return (
    <>
      {article?.bIsListicleArticle ? (
        <ListicleArticleAMP article={article} />
      ) : (
        <InnerHTML className="content" html={addEditorAds(addAmpAdsInsideParagraph(article?.sAmpContent, '/138639789/Crictracker2022_AMP_MID_300x250', '/138639789/Crictracker2022_AMP_MID2_300x250', [1, 3]))} />
      )}
      {/* <div className="content" dangerouslySetInnerHTML={{ __html: article?.bIsListicleArticle ? article?.oListicleArticle?.sMainContent : article?.sAmpContent }}></div> */}
      <div className="d-flex justify-content-center">
        <amp-ad width="300" height="250"
          type="doubleclick"
          data-slot="/138639789/Crictracker2022_AMP_BTF_300x250">
        </amp-ad>
      </div>
      <div className="tagList d-flex flex-wrap">
        {article?.aSeries?.map((cat) => (
          <a key={cat?._id} href={'/' + cat?.oSeo?.sSlug}>
            <span className="badge bg-primary">
              {cat?.sName}
            </span>
          </a>
        ))}
        {article?.aTeam?.map((team) => (
          <a key={team?._id} href={'/' + team?.oSeo?.sSlug}>
            <span className="badge bg-primary">
              {team?.sName}
            </span>
          </a>
        ))}
        {article?.aPlayer?.map((player) => (
          <a key={player?._id} href={'/' + player?.oSeo?.sSlug}>
            <span className="badge bg-primary">
              {player?.sName}
            </span>
          </a>
        ))}
        {article?.aTags?.map((tag) => (
          <a key={tag?._id} href={'/' + tag?.oSeo?.sSlug}>
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
