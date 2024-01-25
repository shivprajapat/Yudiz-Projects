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
        oPlayer {
          sCountry
          sCountryFull
        }
        dUpdated
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
