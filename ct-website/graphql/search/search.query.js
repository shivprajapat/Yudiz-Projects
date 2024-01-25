import { gql } from '@apollo/client'
import { articleListData, videoArticleData } from '@graphql/article'

export const GET_SEARCH_PLAYER = gql`
  query AResults($input: oPaginationInput) {
    getPlayerSearch(input: $input) {
      aResults {
        _id
        oSeo {
          sSlug
          eType
        }
        oImg {
          sUrl
        }
        sFullName
        sLastName
        sFirstName
        sCountry
        sCountryFull
        sPlayingRole
        eTagStatus
      }
    }
  }
`
export const GET_SEARCH_SERIES = gql`
  query AResults($input: oPaginationInput) {
    getSeriesSearch(input: $input) {
      aResults {
        _id
        sTitle
        sSeason
        oSeo {
          sSlug
          eType
        }
        iCategoryId
        oCategory {
          oSeo {
            sSlug
          }
        }
      }
    }
  }
`

export const GET_SEARCH_TEAM = gql`
  query AResults($input: oPaginationInput) {
    getTeamSearch(input: $input) {
      aResults {
        _id
        sTitle
        oImg {
          sUrl
        }
        oSeo {
          sSlug
          eType
        }
        eTagStatus
      }
    }
  }
`

export const GET_SEARCH_NEWS = gql`
  query GetArticleSearch($input: oSearchArticleInput) {
    getArticleSearch(input: $input) {
      aResults {
        ${articleListData}
      }
    }
  }
`
export const GET_SEARCH_VIDEO = gql`
  query AResults($input: oPaginationInput) {
    getVideoSearch(input: $input) {
      aResults {
        ${videoArticleData}
      }
    }
  }
`
