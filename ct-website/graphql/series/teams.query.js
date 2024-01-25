import { gql } from '@apollo/client'

export const LIST_SERIES_TEAMS = gql`
  query ListSeriesTeams($input: oSeriesIdInput) {
    listSeriesTeams(input: $input) {
      iSeriesId
      aTeams {
        _id
        bTagEnabled
        eProvider
        eTagStatus
        oImg {
          sUrl
          sText
          sCaption
          sAttribute
        }
        oSeo {
          sSlug
        }
        sAbbr
        sAltName
        sCountry
        sCountryFull
        sTeamKey
        sTeamType
        oImg {
          sUrl
        }
        sTitle
      }
    }
  }
`
