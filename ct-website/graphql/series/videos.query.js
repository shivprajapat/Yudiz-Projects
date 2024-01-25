import { gql } from '@apollo/client'
import { videoArticleData } from '@graphql/article'

export const GET_SINGLE_VIDEO = gql`
  query GetSingleVideo($input: oGetVideoById) {
    getSingleVideo(input: $input) {
      _id
      sTitle
      oPlayer {
        sEmbedUrl
      }
      sDescription
    }
  }
`

export const CATEGORY_RELATED_VIDEO = gql`
  query ListCategoryRelatedVideos($input: oListCategoryRelatedVideos) {
    listCategoryRelatedVideos(input: $input) {
      aResults {
        ${videoArticleData}
      }
      nTotal
    }
  }
`
