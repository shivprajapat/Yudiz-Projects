import { gql } from '@apollo/client'

export const GET_TEAM_PLAYER = gql`
  query ListSeriesSquad($input: listSeriesSquadInput) {
    listSeriesSquad(input: $input) {
      oTeam {
        oJersey {
          sUrl
          sText
        }
      }
      oPlayer {
        _id
        oSeo {
          sSlug
          eType
        }
        oImg {
          sUrl
          sText
        }
        sFullName
        sFirstName
        sCountry
        sCountryFull
        sPlayingRole
        eTagStatus
      }
    }
  }
`
