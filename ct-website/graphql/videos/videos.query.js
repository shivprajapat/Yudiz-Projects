import { gql } from '@apollo/client'
import { videoArticleData } from '@graphql/article'

export const TOP_PLAYLISTS = gql`
  query TopPlaylists($input: oTopPlaylistsInput) {
    topPlaylists(input: $input) {
      aResults {
        _id
        sTitle
        sThumbnailUrl
        oSeo {
          sSlug
          eType
        }
        oCategory {
          eType
        }
      }
      nTotal
    }
  }
`

export const LIST_CATEGORY_WISE_VIDEO = gql`
  query ListCategoryWiseVideo($input: oPaginationInput) {
    listCategoryWiseVideo(input: $input) {
      aResults {
        _id
        oSeo {
          sSlug
          eType
        }
        sName
        aVideos {
          ${videoArticleData}
        }
        oCategory {
          eType
        }
      }
      nTotal
    }
  }
`

export const GET_PLAYLISTS_VIDEO = gql`
query GetVideos($input: oGetVideosInput) {
  getVideos(input: $input) {
    nTotal
    aResults {
      ${videoArticleData}
    }
  }
}
`

export const GET_TRENDING_VIDEO = gql`
  query GetTrendingVideos($input: oPaginationInput) {
    getTrendingVideos(input: $input) {
      nTotal
      aResults {
        ${videoArticleData}
      }
    }
  }
`
