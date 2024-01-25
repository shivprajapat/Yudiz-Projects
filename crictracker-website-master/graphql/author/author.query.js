import { gql } from '@apollo/client'

export const LIST_AUTHORS = gql`
  query ListAuthors($input: listAuthorInput) {
    listAuthors(input: $input) {
      aResults {
        _id
        sFName
        sUrl
        nArticleCount
        nViewCount
        eDesignation
        oSeo {
          sSlug
        }
        bIsVerified
      }
    }
  }
`

export const GET_AUTHOR_BY_ID = gql`
  query GetAuthor($input: getAuthorInput) {
    getAuthor(input: $input) {
      sFName
      sDisplayName
      nArticleCount
      nViewCount
      sBio
      sUrl
      eDesignation
      bIsVerified
    }
  }
`

export const GET_AUTHOR_ARTICLES = gql`
  query GetAuthorArticles($input: authorArticleInput) {
    getAuthorArticles(input: $input) {
      aResults {
        _id
        dUpdated
        dCreated
        dPublishDate
        dPublishDisplayDate
        dModifiedDate
        sTitle
        nViewCount
        nOViews
        oCategory {
          sName
          oSeo {
            sSlug
          }
        }
        oSeo {
          sSlug
        }
      }
      nTotal
    }
  }
`
export const GET_AUTHOR_FANTASY_ARTICLES = gql`
  query GetAuthorFantasyArticles($input: authorFantasyArticleInput) {
    getAuthorFantasyArticles(input: $input) {
      aResults {
        _id
        sTitle
        nViewCount
        nOViews
        dUpdated
        dCreated
        dPublishDate
        dPublishDisplayDate
        dModifiedDate
        ePlatformType
        oCategory {
          sName
          oSeo {
            sSlug
          }
        }
        oSeo {
          sSlug
        }
      }
      nTotal
    }
  }
`
