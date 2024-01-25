import { gql } from '@apollo/client'

import { articleDetailData, articleListData, liveArticleEventData, liveArticleListData } from '@graphql/article'
import { fantasyArticleData } from '@graphql/fantasy-tips/fantasy-tips.query'

export const GET_ARTICLE_DETAILS = gql`
  query GetArticleFront($input: oGetArticleInput) {
    getArticleFront(input: $input) {
      ${articleDetailData}
    }
  }
`

export const GET_BOOKMARK_DETAILS = gql`
  query GetBookmarks($input: oGetBookmarkInput) {
    getBookmarks(input: $input) {
      bIsBookmarked
      _id
    }
  }
`

export const GET_PREVIEW_ARTICLE_DETAILS = gql`
  query GetPreviewArticleFront($input: oGetPreviewArticleFrontInput) {
    getPreviewArticleFront(input: $input) {
      ${articleDetailData}
    }
  }
`
export const GET_FANTASY_ARTICLE_PREVIEW = gql`
  query GetPreviewFantasyArticleFront($input: oGetPreviewFantasyArticleFrontInput) {
    getPreviewFantasyArticleFront(input: $input) {
      ${fantasyArticleData}
    }
  }
`

export const GET_ARTICLE_ID = gql`
  query GetSeoData($input: oSlugData) {
    getSeoData(input: $input) {
      _id
      aKeywords
      eStatus
      eType
      iId
      oFB {
        sUrl
        sTitle
        sDescription
      }
      oTwitter {
        sUrl
        sTitle
        sDescription
      }
      sCUrl
      sDescription
      sRobots
      sSlug
      sTitle
      eSchemaType
      eCode
      eTabType
      eSubType
    }
  }
`

export const LIST_COMMENTS = gql`
  query ListFrontComments($input: frontCommentInput) {
    listFrontComments(input: $input) {
      aResults {
        _id
        dCreated
        eStatus
        oCreatedBy {
          sUsername
          sFullName
          _id
        }
        sContent
      }
      nTotal
    }
  }
`
export const LIST_FANTASY_ARTICLE_COMMENTS = gql`
  query ListFantasyFrontComments($input: frontFantasyCommentInput) {
    listFantasyFrontComments(input: $input) {
      aResults {
        _id
        dCreated
        eStatus
        oCreatedBy {
          sUsername
          sFullName
          _id
        }
        sContent
      }
      nTotal
    }
  }
`

export const GET_REPORT_PROBLEM = gql`
  query ListFrontCommentReportReason {
    listFrontCommentReportReason {
      _id
      sTitle
    }
  }
`

export const GET_USER_CLAP = gql`
  query GetUserArticleClap($input: userArticleClapInput) {
    getUserArticleClap(input: $input) {
      nTotalClap
    }
  }
`
export const GET_NEWS_ARTICLE_TOTAL_CLAP = gql`
  query GetNewsArticleTotalClaps($input: userArticleTotalClapInput) {
    getNewsArticleTotalClaps(input: $input) {
      nTotalClap
    }
  }
`

export const UPDATE_NEWS_ARTICLE_VIEWS = gql`
  mutation UpdateNewsArticleViewsCount($input: oEditArticleViewsCount) {
    updateNewsArticleViewsCount(input: $input)
  }
`

export const UPDATE_FANTASY_ARTICLE_VIEWS = gql`
  mutation UpdateFantasyArticleViewCount($input: editFantasyArticleViewCount) {
  updateFantasyArticleViewCount(input: $input)
}
`

export const GET_USER_FANTASY_CLAP = gql`
  query GetUserFantasyArticleClap($input: userFantasyArticleClapInput) {
    getUserFantasyArticleClap(input: $input) {
      nTotalClap
    }
  }
`

export const GET_FANTASY_ARTICLE_TOTAL_CLAP = gql`
  query GetFantasyArticleTotalClaps($input: fantasyArticleTotalClapInput) {
    getFantasyArticleTotalClaps(input: $input) {
      nTotalClap
    }
  }
`

export const GET_RELATED_STORIES = gql`
  query GetRelatedStories($input: oGetRealatedStoriesInput) {
    getRelatedStories(input: $input) {
      aResults {
        ${articleListData}
      }
    }
  }
`

export const GET_TOP_ARTICLES = gql`
  query GetTopArticles($input: getTopArticlesInput) {
    getTopArticles(input: $input) {
      ${articleListData}
    }
  }
`

export const GET_RANDOM_ARTICLE = gql`
  query RandomArticles($input: randomArticlesInput) {
    randomArticles(input: $input) {
      ${articleListData}
    }
  }
`

export const GET_ARTICLE_BY_ID = gql`
  query getArticleById($input: getArticleByIdInput) {
    getArticleById(input: $input) {
      oSeo {
        sSlug
      }
    }
  }
`

export const GET_LIVE_BLOGS = gql`
  query ListLiveBlogContent($input: listLiveBlogContentFrontInput!) {
    listLiveBlogContentFront(input: $input) {
      ${liveArticleListData}
      ${liveArticleEventData}
    }
  }
`
