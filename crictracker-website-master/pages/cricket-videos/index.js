import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import Layout from '@shared-components/layout'
import { pageLoading } from '@shared/libs/allLoader'
import useWindowSize from '@shared/hooks/windowSize'

// const TopPlaylist = dynamic(() => import('@shared-components/video/topPlaylist'), { loading: () => pageLoading() })
const TrendingVideos = dynamic(() => import('@shared-components/video/trendingVideo'), { loading: () => pageLoading() })
const CategoryVideos = dynamic(() => import('@shared-components/video/categoryVideos'), { loading: () => pageLoading() })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const Videos = ({ trendingVideos, videos, seoData }) => {
  const [width] = useWindowSize()
  const categoryVideos = videos?.listCategoryWiseVideo?.aResults
  const trendingVideoList = trendingVideos?.getTrendingVideos?.aResults
  // const topPlaylist = playlist?.topPlaylists?.aResults

  return (
    <Layout data={{ oSeo: seoData?.getSeoData }}>
      <main className="common-section pb-0">
        <Container>
          <div className="d-none d-md-block mb-3" style={{ minHeight: '90px', marginTop: '-10px' }}>
            {width > 767 && ( // Desktop top
              <Ads
                id="div-ad-gpt-138639789--0-Crictracker2022_Desktop_Top_970"
                adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                dimensionDesktop={[970, 90]}
                className={'text-center'}
                style={{ minHeight: '90px' }}
              />
            )}
          </div>
          {/* {topPlaylist?.length > 0 && <TopPlaylist data={topPlaylist} />} */}
          <TrendingVideos data={trendingVideoList} />
          {width < 767 && (
            <Ads
              id="div-ad-gpt-138639789-1646635806-0"
              adIdDesktop="Crictracker2022_Desktop_SP_ATF_728x90"
              adIdMobile="Crictracker2022_Mobile_SP_ATF_300x250"
              dimensionDesktop={[728, 90]}
              dimensionMobile={[300, 250]}
              mobile
              className={'text-center mb-4'}
            />
          )}
          <CategoryVideos data={categoryVideos} />
        </Container>
      </main>
    </Layout>
  )
}

Videos.propTypes = {
  videos: PropTypes.object,
  playlist: PropTypes.object,
  seoData: PropTypes.object,
  trendingVideos: PropTypes.object
}

export async function getServerSideProps({ res, resolvedUrl, query }) {
  const [graphql, articleQuery, utils, videoQuery] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@graphql/videos/videos.query')
  ])
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')

    const { data: seoData } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '').split('?')[0] } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const [videos, trendingVideos] = await Promise.allSettled([
      graphql.default(videoQuery.LIST_CATEGORY_WISE_VIDEO, { input: { nLimit: 4, nSkip: 1 } }),
      graphql.default(videoQuery.GET_TRENDING_VIDEO, { input: { nLimit: 5, nSkip: 1 } })
    ])

    return {
      props: {
        videos: videos?.value?.data,
        seoData,
        trendingVideos: trendingVideos?.value?.data
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}

export default Videos
