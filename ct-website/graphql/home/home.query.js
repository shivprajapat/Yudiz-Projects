import { gql } from '@apollo/client'
import { articleListData, videoArticleData } from '@graphql/article'
import { fantasyArticleListData } from '@graphql/fantasy-tips'
import { miniScorecard } from '@graphql/home'

export const MINI_SCORECARD = gql`
  query miniScoreCard {
    fetchMiniScorecardData {
      ${miniScorecard}
    }
  }
`

export const SERIES_MINI_SCORECARD = gql`
query ListSeriesScorecard($input: oListSeriesScorecardInput!) {
  listSeriesScorecard(input: $input) {
    ${miniScorecard}
    dEndDate
  }
}
`

export const HOME_PAGE_ARTICLE = gql`
  query GetHomePageArticle($input: getHomePageArticleInput) {
    getHomePageArticle(input: $input) {
      nTotal
      aResults {
        eType
        sName
        iSeriesId
        sSlug
        bScoreCard
        oScore {
          nLatestInningNumber
          sSubtitle
          oVenue {
            sLocation
          }
          oTeamScoreA {
            oTeam {
              oImg {
                sUrl
                sText
              }
              sAbbr
              sTitle
            }
            sScores
            sScoresFull
          }
          oTeamScoreB {
            sScoresFull
            sScores
            oTeam {
              oImg {
                sUrl
              }
              sAbbr
              sTitle
            }
          }
          oSeo {
            sSlug
          }
          sStatusStr
          sStatusNote
          sLiveGameStatusStr
          oSeries {
            sTitle
            nTotalTeams
          }
        }
        aArticle {
          sType
          ${articleListData}
        }
      }
    }
  }
`

export const HEADER_MENU = gql`
  query Results {
    getMenuTree {
      aResults {
        sTitle
        sSlug
        _id
        oChildren {
          _id
          sSlug
          sTitle
        }
        eMenuType
        eUrlTarget
        sUrl
      }
    }
  }
`
export const CRIC_SPECIAL = gql`
  query GetCricSpecial($input: getCricspecialInput!) {
    getCricSpecial(input: $input) {
      nTotal
      aResults {
        _id
        iArticleId
        dPublishDate
        sTitle
        nDuration
        oImg {
          sUrl
          sText
          sAttribute
          sCaption
        }
        oTImg {
          sUrl
          sText
          sCaption
          sAttribute
        }
        oCategory {
          sName
        }
        oSeo {
          sSlug
        }
      }
    }
  }
`
export const TRENDING_NEWS = gql`
  query GetTrendingNews($input: getTrendingNewsInput!) {
    getTrendingNews(input: $input) {
      nTotal
      aResults {
        sTitle
        oCategory {
          sName
        }
        _id
        dPublishDate
        iArticleId
        nDuration
        oSeo {
          sSlug
        }
      }
    }
  }
`

export const HOME_FANTASY_ARTICLE = gql`
  query ListFrontFantasyArticle($input: listFrontFantasyArticleInput) {
    listFrontFantasyArticle(input: $input) {
      ${fantasyArticleListData}
    }
  }
`
export const GET_SLIDER = gql`
  query GetFrontSlider {
    getFrontSlider {
      sSlug
      sName
      oImg {
        sUrl
        sText
        sCaption
        sAttribute
      }
      _id
      aSlide {
        sName
        sSlug
      }
      dUpdated
      dCreated
      bIsMulti
      eStatus
      nPriority
      eType
    }
  }
`

export const HOME_PAGE_WIDGET = gql`
  query GetHomeWidgets {
    getHomeWidgets {
      eType
      nPriority
      sPosition
    }
  }
`

export const HOME_PAGE_VIDEO = gql`
  query GetHomePageVideo($input: getHomePageVideoInput) {
    getHomePageVideo(input: $input) {
      nTotal
      aResults {
        _id
        iPlaylistId
        sName
        oSeo {
          sSlug
        }
        aVideos {
          sType
          ${videoArticleData}
        }
        oCategory {
          eType
        }
      }
    }
  }
`
