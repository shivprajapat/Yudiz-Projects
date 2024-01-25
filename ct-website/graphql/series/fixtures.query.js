import { gql } from '@apollo/client'

export const FIXTURES_LIST = gql`
  query FetchFixuresData($input: oFixuresInput) {
    fetchFixuresData(input: $input) {
      _id
      oTeamScoreA {
        sScoresFull
        oTeam {
          _id
          sAbbr
          sTitle
          oImg {
            sUrl
          }
        }
      }
      oTeamScoreB {
        sScoresFull
        oTeam {
          _id
          sAbbr
          sTitle
          oImg {
            sUrl
          }
        }
      }
      oWinner {
        _id
      }
      sTitle
      sSubtitle
      sResult
      nLatestInningNumber
      dStartDate
      sStatusStr
      sStatusNote
      sFormatStr
      oVenue {
        sName
        sLocation
      }
      oSeries {
        sTitle
        sSeason
        oSeo {
          sSlug
        }
        oCategory {
          oSeo {
            sSlug
          }
        }
      }
      oSeo {
        sSlug
      }
    }
  }
`

export const FETCH_TEAM_VENUE = gql`
  query FetchSeriesData($input: oSeriesIdInput) {
    fetchSeriesData(input: $input) {
      aTeams {
        _id
        sTitle
        sAbbr
        sCountry
      }
      aVenues {
        _id
        sCity
        sLocation
        sName
      }
    }
  }
`
