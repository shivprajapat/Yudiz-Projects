import { gql } from '@apollo/client'

export const GET_PLAYERS = gql`
  query GetPlayerByIdFront($input: oGetPlayerByIdFrontInput) {
    getPlayerByIdFront(input: $input) {
      _id
      sContent
      sAmpContent
      sFullName
      sFirstName
      sNationality
      sPlayingRole
      sCountryFull
      sBowlingStyle
      sBattingStyle
      sBirthPlace
      dBirthDate
      sNickName
      oSeo {
        sSlug
      }
      oStats {
        nPriority
        sMatchStatsTypes
        oBatting {
          nMatches
          nInnings
          nRuns
          sAverage
          sStrikeRate
          nHighest
          nRun100
          nRun50
          nPlayedBalls
          nNotOut
        }
        oBowling {
          nWkt5i
          nWkt4i
          nMatches
          nInnings
          sBestBowlingInning
          sOvers
          sEconomy
          sStrikeRate
          sAverage
          nRuns
          nWickets
        }
      }
      aTeam {
        oTeam {
          _id
          eTagStatus
          oSeo {
            sSlug
          }
          sTitle
          sAbbr
          oImg {
            sUrl
            sText
          }
        }
      }
      oImg {
        sText
        sUrl
      }
      oPrimaryTeam {
        oJersey {
          sUrl
          sText
        }
      }
    }
  }
`

export const GET_PLAYER_RECENT_MATCH = gql`
query GetRecentMatchesOfPlayer($input: getRecentMatchesOfPlayerInput) {
  getRecentMatchesOfPlayer(input: $input) {
    sFormatStr
    sPlayingRole
    aMatchData {
      _id
      oVenue {
        _id
        sLocation
      }
      aBattingData {
        bIsBatting
        nRuns
        sStrikeRate
        iBatterId
      }
      aBowlingData {
        iBowlerId
        sOvers
        nRunsConceded
        sEcon
        nWickets
      }
      aMatch {
        dStartDate
        sFormatStr
        sTitle
        sShortTitle
      }
    }
  }
}
`

export const GET_POPULAR_PLAYER = gql`
  query GetPopularPlayers($input: getPopularPlayerInput) {
    getPopularPlayers(input: $input) {
      _id
      sFirstName
      sFullName
      eTagStatus
      oSeo {
        sSlug
      }
      oImg {
        sText
        sUrl
      }
      oPrimaryTeam {
        oJersey {
          sUrl
          sText
        }
      }
    }
  }
`
export const GET_PLAYER_RANKING = gql`
query GetPlayerRanking($input: getPlayerRankingInput) {
  getPlayerRanking(input: $input) {
    _id
    nRank
    eRankType
    eMatchType
  }
}
`
