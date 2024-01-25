import { gql } from '@apollo/client'
import { articleListData, videoArticleData } from '@graphql/article'

export const GET_SERIES_NEWS_VIDEOS = gql`
  query OArticles($input: oListSeriesArticlesVideosFront) {
    listSeriesArticlesVideosFront(input: $input) {
      oArticles {
        aResults {
          ${articleListData}
        }
      }
      oVideos {
        aResults {
          ${videoArticleData}
        }
      }
    }
  }
`

export const GET_CATEGORY_NEWS_VIDEOS = gql`
  query OVideos($input: oListSimpleCategoryArticlesVideosFront) {
    listSimpleCategoryArticlesVideosFront(input: $input) {
      oVideos {
        aResults {
          ${videoArticleData}
        }
      }
      oArticles {
        aResults {
          ${articleListData}
        }
      }
    }
  }
`

export const GET_FANTASY_ARTICLE_OF_CATEGORY = gql`
  query ListFrontTagCategoryFantasyArticle($input: listFrontFantasyArticleInput) {
    listFrontTagCategoryFantasyArticle(input: $input) {
      aResults {
        # sMatchPreview
        ePlatformType
        _id
        sTitle
        sSubtitle
        sSrtTitle
        oSeo {
          sSlug
        }
        # sMatchPreview
        oImg {
          sUrl
          sText
          sCaption
          sAttribute
        }
        dPublishDate
        oCategory {
          sName
          _id
          eType
          oSeo {
            sSlug
          }
        }
        ePlatformType
        nDuration
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
