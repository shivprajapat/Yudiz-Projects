import { gql } from '@apollo/client'

export const GET_USER = gql`
  query GetUser {
    getUser {
      _id
      bIsEmailVerified
      bIsMobVerified
      dDOB
      eGender
      sBio
      sCity
      sEmail
      sFullName
      oCountry {
        sSortName
        sName
      }
      sMobNum
      sProPic
      sUsername
      nBookmarkCount
    }
  }
`

export const LIST_COUNTRY = gql`
  query ListFrontCountry($input: listFrontCountryInput) {
    listFrontCountry(input: $input) {
      aResults {
        _id
        sId
        sName
        sSortName
      }
      nTotal
    }
  }
`

export const SAVED_ARTICLES = gql`
query ListBookmarks($input: bookmarkPaginationInput) {
  listBookmarks(input: $input) {
    nTotal
    aResults {
      oArticle {
        _id
        dPublishDate
        oImg {
          sAttribute
          sCaption
          sText
          sUrl
        }
        oSeo {
          sSlug
        }
        sTitle
        nViewCount
        oCategory {
          _id
          sName
          oSeo {
            sSlug
          }
          sContent
        }
      }
      oFantasyArticle {
        _id
        dPublishDate
        oImg {
          sAttribute
          sCaption
          sText
          sUrl
        }
        oSeo {
          sSlug
        }
        sTitle
        nViewCount
      }
      oVideo {
        _id
        sTitle
        dPublishDate
        sThumbnailUrl
        nDurationSeconds
        oSeo {
          sSlug
        }
      }
      _id
      eBookmarkType
    }
  }
}
`
