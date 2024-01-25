import React from 'react'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'
// import { useRouter } from 'next/router'

// import { allRoutes } from '@shared/constants/allRoutes'
import TopPlayerRankingsAMP from '@shared/components/amp/topPlayerRankingsAMP'
import ArticleGrid from '@shared/components/amp/articleAMP/articleGrid'
import ArticleSmall from '@shared/components/amp/articleAMP/articleSmall'
import NoDataAMP from '@shared/components/amp/noDataAMP'

function SeriesHomeAMP({ data: { oArticles, oVideos, fantasyArticle }, playerData, category, isClientOnly, showMoreBtn, subPagesURLS }) {
  // const router = useRouter()
  // const url = router?.asPath?.replace('?amp=1', '')
  return (
    <>
      <style jsx amp-custom>{`
      .text-center { text-align: center}
      `}
      </style>
      <div className="main-content seriesHome">
        {category?._id !== '623184b5f5d229bacb010197' && oArticles?.aResults?.length > 0 && (
          <>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:latestArticle" />
            </h4>
            <section>
              <ArticleGrid isLarge={true} isVideo={oArticles?.aResults[0]?.__typename === 'oVideoData'} data={oArticles?.aResults[0]} />
              <div className="d-flex justify-content-center mb-3">
                <amp-ad
                  width="300"
                  height="250"
                  type="doubleclick"
                  data-slot="138639789/Crictracker2022_AMP_SP_ATF_300x250"
                  data-multi-size-validation="false"
                  data-enable-refresh="30"
                />
              </div>
              {oArticles?.aResults?.slice(0, 16).map((a, i) => {
                if (i > 0) {
                  return (
                    <React.Fragment key={i + a?._id}>
                      <ArticleSmall id={a?._id} data={a} isVideo={a?.__typename === 'oVideoData'} />
                      {i === 3 && (
                        <div className="text-center">
                          <amp-ad
                            width="300"
                            height="250"
                            type="doubleclick"
                            data-slot="138639789/Crictracker2022_AMP_SP_MID_300x250"
                            data-multi-size-validation="false"
                            data-enable-refresh="30"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  )
                } else return null
              })}
              {showMoreBtn && oArticles?.aResults?.length >= 16 && (
                <div className="text-center">
                  <a className="theme-btn small-btn" href={isClientOnly ? '?amp=1&tab=news' : `/${subPagesURLS?.n?.sSlug}/?amp=1`}>
                    <Trans i18nKey="common:More" /> <Trans i18nKey="common:News" /> {'>'}
                  </a>
                </div>
              )}
            </section>
          </>
        )}
        {playerData && playerData?.length !== 0 && (
          <section>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:TopRankings" />
            </h4>
            <TopPlayerRankingsAMP subPagesURLS={subPagesURLS} data={playerData} />
          </section>
        )}
        {fantasyArticle?.aResults?.length > 0 && (
          <>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:FantasyArticles" />
            </h4>
            <section>
              <ArticleGrid isLarge={true} isVideo={fantasyArticle?.aResults[0]?.__typename === 'oVideoData'} data={fantasyArticle?.aResults[0]} />
              {fantasyArticle?.aResults?.map((a, i) => {
                if (i > 0) {
                  return (
                    <ArticleSmall key={i + a?._id} id={a?._id} data={a} isVideo={a?.__typename === 'oVideoData'} />
                  )
                } else return null
              })}
              {showMoreBtn && fantasyArticle?.aResults?.length > 7 && (
                <div className="text-center">
                  <a className="theme-btn small-btn" href={isClientOnly ? '?amp=1&tab=fantasyArticle' : `/${subPagesURLS?.ft?.sSlug}/?amp=1`}>
                    <Trans i18nKey="common:More" /> <Trans i18nKey="common:FantasyArticles" /> {'>'}
                  </a>
                </div>
              )}
            </section>
          </>
        )}
        {oVideos?.aResults?.length > 0 && (
          <>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:Videos" />
            </h4>
            <section>
              <ArticleGrid isLarge={true} isVideo={oVideos?.aResults[0]?.__typename === 'oVideoData'} data={oVideos?.aResults[0]} />
              {oVideos?.aResults?.slice(0, 7).map((a, i) => {
                if (i > 0) {
                  return (
                    <ArticleSmall key={i + a?._id} id={a?._id} data={a} isVideo={a?.__typename === 'oVideoData'} />
                  )
                } else return null
              })}
              {/* <div className='mb-3 text-center'>
                <amp-ad
                  width="300"
                  height="250"
                  type="doubleclick"
                  data-slot="138639789/Crictracker2022_AMP_SP_MID2_300x250"
                  data-multi-size-validation="false"
                  data-enable-refresh="30"
                />
              </div> */}
              {showMoreBtn && oVideos?.aResults?.length >= 16 && (
                <div className="text-center">
                  <a className="theme-btn small-btn" href={isClientOnly ? '?amp=1&tab=videos' : `/${subPagesURLS?.v?.sSlug}/?amp=1`}>
                    <Trans i18nKey="common:More" /> <Trans i18nKey="common:Videos" /> {'>'}
                  </a>
                </div>
              )}
            </section>
          </>
        )}
        {!fantasyArticle?.aResults?.length && !oVideos?.aResults?.length && !oArticles?.aResults?.length && (
          <NoDataAMP />
        )}
      </div>
    </>
  )
}
SeriesHomeAMP.propTypes = {
  data: PropTypes.object,
  playerData: PropTypes.array,
  category: PropTypes.object,
  subPagesURLS: PropTypes.object,
  isClientOnly: PropTypes.bool,
  showMoreBtn: PropTypes.bool
}

export default SeriesHomeAMP
