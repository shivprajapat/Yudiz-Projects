import { gql } from '@apollo/client'
export const CURRENT_MATCHES = gql`
  query ListAllFixtures($input: oListAllFixturesInput) {
    listAllFixtures(input: $input) {
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
        nLatestInningNumber
        sResult
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

export const SERIES_ARCHIVE = gql`
  query ListSeriesArchive($input: oListSeriesArchiveInput) {
    listSeriesArchive(input: $input) {
      dStartDate
      oCategory {
        oSeo {
          sSlug
        }
        eStatus
      }
      dEndDate
      sTitle
      oSeo {
        sSlug
      }
      _id
    }
  }
`

export const CURRENT_FUTURE_SERIES = gql`
  query ListFixtureSeries($input: oListFixtureSeriesInput) {
    listFixtureSeries(input: $input) {
      sMonth
      aSeries {
        _id
        dStartDate
        dEndDate
        sTitle
        oSeo {
          sSlug
        }
        oCategory {
          oSeo {
            sSlug
          }
        }
      }
    }
  }
`
export const SERIES_YEAR = gql`
  query Query {
    listSeriesYear
  }
`

export const FIXTURE_FILTER = gql`
query ListAllFixturesFilter($input: oListAllFixturesFilter) {
  listAllFixturesFilter(input: $input) {
    aSeries {
      sTitle
      _id
    }
    aTeam {
      _id
      sTitle
    }
    aVenue {
      _id
      sName
    }
  }
}
`
