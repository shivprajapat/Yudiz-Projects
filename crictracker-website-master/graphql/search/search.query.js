import { gql } from '@apollo/client'

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
          sText
        }
        oPrimaryTeam {
          oJersey {
            sUrl
            sText
          }
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
            eType
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
        _id
        sTitle
        sSrtTitle
        oSeo {
          sSlug
          eType
          }
        sDescription
        oImg {
          sUrl
          sText
          sCaption
          sAttribute
        }
        nDuration
        dPublishDate
        dPublishDisplayDate
        oCategory {
          sName
          _id
          oSeo {
            sSlug
          }
        }
        oTImg {
          sUrl
          sText
          sCaption
          sAttribute
        }
      }
    }
  }
`
export const GET_SEARCH_VIDEO = gql`
  query AResults($input: oPaginationInput) {
    getVideoSearch(input: $input) {
      aResults {
        _id
        aThumbnails {
          sKey
          sUrl
        }
        oSeo {
          sSlug
          eType
        }
        dPublishDate
        sDuration
        sTitle
        sDescription
        nDurationSeconds
        sThumbnailUrl
        sThumbnailHeight
        sThumbnailWidth
      }
    }
  }
`
