import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import Layout from '@shared-components/layout'
import queryGraphql from '@shared/components/queryGraphql'
import { pageLoading } from '@shared/libs/allLoader'
import { TOP_PLAYLISTS, LIST_CATEGORY_WISE_VIDEO, GET_TRENDING_VIDEO } from '@graphql/videos/videos.query'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'
import useWindowSize from '@shared/hooks/windowSize'

// const TopPlaylist = dynamic(() => import('@shared-components/video/topPlaylist'), { loading: () => pageLoading() })
const TrendingVideos = dynamic(() => import('@shared-components/video/trendingVideo'), { loading: () => pageLoading() })
const CategoryVideos = dynamic(() => import('@shared-components/video/categoryVideos'), { loading: () => pageLoading() })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const Videos = ({ trendingVideos, videos, playlist, seoData }) => {
  const [width] = useWindowSize()
  const categoryVideos = videos?.listCategoryWiseVideo?.aResults
  const trendingVideoList = trendingVideos?.getTrendingVideos?.aResults
  const totalCategory = videos?.listCategoryWiseVideo?.nTotal
  // const topPlaylist = playlist?.topPlaylists?.aResults

  return (
    <Layout data={{ oSeo: seoData?.getSeoData }}>
      <main className="common-section pb-0">
        <Container>
          <div className="d-none d-md-block my-3" style={{ minHeight: '90px' }}>
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
          <CategoryVideos data={categoryVideos} nTotal={totalCategory} />
          <Ads
            id="div-ad-gpt-138639789-1646636255-0"
            adIdDesktop="Crictracker2022_Desktop_SP_BTF_728x90"
            adIdMobile="Crictracker2022_Mobile_SP_BTF2_300x250"
            dimensionDesktop={[728, 90]}
            dimensionMobile={[300, 250]}
            mobile
            className={'text-center mb-4'}
          />
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

export async function getServerSideProps({ res, resolvedUrl }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '').split('?')[0] } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj
    const { data: playlist } = await queryGraphql(TOP_PLAYLISTS, { input: { oTopPlaylistsPaginationInput: { nLimit: 15, nSkip: 0 } } })
    const { data: videos } = await queryGraphql(LIST_CATEGORY_WISE_VIDEO, { input: { nLimit: 4, nSkip: 1 } })
    const { data: trendingVideos } = await queryGraphql(GET_TRENDING_VIDEO, { input: { nLimit: 5, nSkip: 1 } })
    return {
      props: {
        videos,
        playlist,
        seoData,
        trendingVideos
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}

export default Videos
