import { gql } from '@apollo/client'

export const RANKINGS = gql`
  query GetRankings($input: getRankInput!) {
    getRankings(input: $input) {
      aResults {
        nPoints
        _id
        nRank
        nRating
        sName
        sTeam
        dUpdated
        oTeams {
          eTagStatus
          oSeo {
            sSlug 
          }
        }
        oPlayer {
          sCountry
          sCountryFull
          eTagStatus
          oSeo {
            sSlug
          }
        }
      }
    }
  }
`
export const RANKINGS_OVERVIEW = gql`
  query GetRankingsOverview($input: getRankingsOverviewInput) {
    getRankingsOverview(input: $input) {
      eRank
      aRanking {
        dUpdated
        _id
        # eGender
        eMatchType
        nRating
        nRank
        eRankType
        oPlayer {
          sFirstName
          sFullName
          sCountry
          eTagStatus
          oSeo {
            sSlug
          }
          oImg {
            sUrl
            sText
          }
        }
        oJersey {
          sUrl
          sText
        }
        oTeams {
          sTitle
          oImg {
            sUrl
            sText
          }
          eTagStatus
          oSeo {
            sSlug
          }
        }
      }
    }
  }
`
export const TOP_TEAMS = gql`
  query GetRankings($input: getRankInput!) {
    getRankings(input: $input) {
      aResults {
        _id
        sName
        oTeams {
          eTagStatus
          oSeo {
            sSlug
          }
          oImg {
            sUrl
          }
        }
      }
    }
  }
`

export const CURRENT_SERIES_LIST = gql`
  query GetCurrentPopularSeries {
    getCurrentPopularSeries {
      aResults {
        _id
        oSeries {
          oCategory {
            oSeo {
              sSlug
            }
          }
          oSeo {
            sSlug
          }
          sTitle
        }
      }
    }
  }
`
export const GET_POLL_BY_ID_FRONT = gql`
query GetPollByIdFront($input: getPollInput!) {
  getPollByIdFront(input: $input) {
    _id
    aField {
      _id
      nVote
      sTitle
    }
    dEndDate
    eStatus
    nTotalVote
    sTitle
  }
}
`
