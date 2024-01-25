import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { articleLoader } from '@shared/libs/allLoader'
import { allRoutes } from '@shared/constants/allRoutes'
import TopPlayerRankingsAMP from '../topPlayerRankingsAMP'

// const TopPlayerRankings = dynamic(() => import('@shared-components/topPlayerRankings'))
const ArticleSmall = dynamic(() => import('@shared-components/amp/articleAMP/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared-components//amp/articleAMP/articleGrid'), { loading: () => articleLoader(['g']) })
const NoData = dynamic(() => import('@noData'), { ssr: false })

function SeriesHomeAMP({ data: { oArticles, oVideos, fantasyArticle }, playerData, category }) {
  const router = useRouter()
  const url = router?.asPath?.replace('?amp=1', '')
  return (
    <>
      <style jsx amp-custom>{`
      
.text-center { text-align: center}

      `}
      </style>
      <div className="main-content seriesHome">
        {fantasyArticle?.aResults?.length > 0 && (
          <>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:FantasyArticles" />
            </h4>
            <section>
              <ArticleSmall isLarge={true} isVideo={fantasyArticle?.aResults[0]?.__typename === 'oVideoData'} data={fantasyArticle?.aResults[0]} />
              <div className="row">
                {fantasyArticle?.aResults?.map((a, i) => {
                  if (i > 0) {
                    return (
                      <div className="col-lg-4 col-sm-6" key={i + a?._id} id={a?._id}>
                        <ArticleGrid data={a} isVideo={a?.__typename === 'oVideoData'} />
                      </div>
                    )
                  } else return null
                })}
              </div>
              {/* {fantasyArticle?.aResults?.length > 7 && (
                <div className="text-center">
                  <a className="theme-btn small-btn" href={`${allRoutes.seriesFantasyArticles(url)}?amp=1`}>
                    <Trans i18nKey="common:More" /> <Trans i18nKey="common:FantasyArticles" /> {'>'}
                  </a>
                </div>
              )} */}
            </section>
          </>
        )}
        {playerData && playerData?.length !== 0 && (
          <section>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:TopRankings" />
            </h4>
            <TopPlayerRankingsAMP data={playerData} />
          </section>
        )}
        {oArticles?.aResults?.length > 0 && (
          <>
            <h4 className="text-uppercase">
              <Trans i18nKey="common:latestArticle" />
            </h4>
            <section>
              <ArticleSmall isLarge={true} isVideo={oArticles?.aResults[0]?.__typename === 'oVideoData'} data={oArticles?.aResults[0]} />
              <div className="row">
                {oArticles?.aResults?.slice(0, 16).map((a, i) => {
                  if (i > 0) {
                    return (
                      <div className="col-lg-4 col-sm-6" key={i + a?._id} id={a?._id}>
                        <ArticleGrid data={a} isVideo={a?.__typename === 'oVideoData'} />
                      </div>
                    )
                  } else return null
                })}
              </div>
              {oArticles?.aResults?.length >= 16 && (
                <div className="text-center">
                  <a className="theme-btn small-btn" href={category?.eType === 's' || category?.eType === 'fac' ? '?amp=1&tab=news' : `${allRoutes.seriesNews(url)}?amp=1`}>
                    <Trans i18nKey="common:More" /> <Trans i18nKey="common:News" /> {'>'}
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
              <ArticleSmall isLarge={true} isVideo={oVideos?.aResults[0]?.__typename === 'oVideoData'} data={oVideos?.aResults[0]} />
              <div className="row">
                {oVideos?.aResults?.slice(0, 7).map((a, i) => {
                  if (i > 0) {
                    return (
                      <div className="col-lg-4 col-sm-6" key={i + a?._id} id={a?._id}>
                        <ArticleGrid data={a} isVideo={a?.__typename === 'oVideoData'} />
                      </div>
                    )
                  } else return null
                })}
              </div>
              {oVideos?.aResults?.length >= 16 && (
                <div className="text-center">
                  <a className="theme-btn small-btn" href={category?.eType === 's' || category?.eType === 'fac' ? '?amp=1&tab=videos' : `${allRoutes.seriesVideos(url)}?amp=1`}>
                    <Trans i18nKey="common:More" /> <Trans i18nKey="common:Videos" /> {'>'}
                  </a>
                </div>
              )}
            </section>
          </>
        )}
        {!fantasyArticle?.aResults?.length && !oVideos?.aResults?.length && !oArticles?.aResults?.length && (
          <NoData />
        )}
      </div>
    </>
  )
}
SeriesHomeAMP.propTypes = {
  data: PropTypes.object,
  playerData: PropTypes.array,
  category: PropTypes.object
}

export default SeriesHomeAMP
