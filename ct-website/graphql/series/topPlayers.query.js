import { gql } from '@apollo/client'

export const TOP_PLAYERS = gql`
  query ListSeriesTopPlayers($input: oSeriesIdInput) {
    listSeriesTopPlayers(input: $input) {
      _id
      nHighest
      nRuns
      sBestInning
      eType
      eFullType
      oPlayer {
        eTagStatus
        sFirstName
        sFullName
        sCountry
        oSeo {
          sSlug
        }
        oImg {
          sUrl
          sText
        }
      }
      nWickets
      oSeries {
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
