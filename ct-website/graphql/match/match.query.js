import { gql } from '@apollo/client'
import { scorecardData, commentaryData, oversData, liveInningData } from '@graphql/match'

export const FULL_SCOREBOARD = gql`
  query FetchLiveInningsData($input: liveInningsInput) {
    fetchLiveInningsData(input: $input) {
      ${scorecardData}
    }
  }
`

export const LIVE_INNING_DATA = gql`
  query FetchLiveInningsData($input: liveInningsInput) {
    fetchLiveInningsData(input: $input) {
      ${liveInningData}
    }
  }
`

export const MATCH_DETAIL = gql`
  query GetMatchById($input: oGetMatchByIdInput) {
    getMatchById(input: $input) {
      _id
      dEndDate
      bIsCommentary
      oSeo {
        sSlug
        sTitle
        sRobots
        sDescription
        sCUrl
        oTwitter {
          sUrl
          sTitle
          sDescription
        }
        oFB {
          sUrl
          sTitle
          sDescription
        }
        eType
        eStatus
        aKeywords
        _id
        iId
      }
      sResult
      nLatestInningNumber
      sDescription
      sTitle
      sSubtitle
      sStatusStr
      sStatusNote
      sLiveMatchNote
      sLiveGameStatusStr
      sFormatStr
      sEquation
      dStartDate
      oSeries {
        sAbbr
        sSeason
        sTitle
        sStatus
        nTotalTeams
        _id
        oSeo {
          sSlug
        }
        oCategory {
          oSeo {
            sSlug
          }
        }
      }
      oWinner {
        _id
      }
      oTeamScoreA {
        sScoresFull
        sScores
        sOvers
        oTeam {
          _id
          sAbbr
          oImg {
            sUrl
          }
          sTitle
        }
      }
      oVenue {
        sLocation
        sName
      }
      oToss {
        sText
        oWinnerTeam {
          _id
          sAbbr
          oImg {
            sUrl
          }
          sTitle
        }
        eDecision
      }
      oTeamScoreB {
        sScoresFull
        sScores
        sOvers
        oTeam {
          _id
          sAbbr
          oImg {
            sUrl
          }
          sTitle
        }
      }
      oLiveScore {
        nRunrate
        sRequiredRunrate
      }
      aInning {
        sShortName
        nInningNumber
        oBattingTeam {
          sTitle
        }
        iBattingTeamId
      }
      oMom {
        sFullName
        eTagStatus
        oSeo {
          sSlug
        }
      }
      oMos {
        sFullName
        eTagStatus
        oSeo {
          sSlug
        }
      }
      sUmpires
      sReferee
    }
  }
`

export const FANTASY_TIPS_DETAILS = gql`
  query GetOverviewFront($input: oGetOverviewFrontInput) {
    getOverviewFront(input: $input) {
      aCricPrediction {
        _id
        ePlatformType
        oSeo {
          sSlug
        }
      }
      oTeam1 {
        aBenchedPlayers {
          sShortName
          sPlayingRole
          _id
        }
        oTeam {
          sTitle
        }
        aPlayers {
          sShortName
          sPlayingRole
          _id
        }
        iC
      }
      oTeam2 {
        oTeam {
          sTitle
        }
        aPlayers {
          sShortName
          sPlayingRole
          _id
        }
        iC
        aBenchedPlayers {
          _id
          sPlayingRole
          sShortName
        }
      }
      sMatchPreview
      sNews
      sPitchCondition
      sPitchReport
      sWeatherReport
      sWeatherCondition
      sAvgScore
    }
  }
`

export const GET_FANTASY_PLATFORM = gql`
  query GetFantasyTipsFront($input: oGetFantasyTipsFrontInput) {
    getFantasyTipsFront(input: $input) {
      _id
      oSeo {
        sSlug
      }
      oTeamB {
        sTitle
        _id
      }
      oTeamA {
        sTitle
        _id
      }
      dUpdated
      aLeague {
        aTeam {
          aSelectedPlayerFan {
            _id
            oTeam {
              sTitle
              _id
            }
            oPlayer {
              sFullName
              sFirstName
              sPlayingRole
              sShortName
            }
            nRating
            eRole
          }
          oTeamA {
            nCount
            oTeam {
              sAbbr
              sTitle
            }
          }
          oTeamB {
            nCount
            oTeam {
              sAbbr
              sTitle
            }
          }
          oCapFan {
            _id
          }
          oVCFan {
            _id
          }
          oTPFan {
            _id
          }
        }
        eLeague
      }
    }
  }
`

export const GET_COMMENTARY = gql`
  query ListMatchCommentaries($input: oListMatchCommentaryFrontInput) {
    listMatchCommentaries(input: $input) {
      ${commentaryData}
    }
  }
`

// export const GET_MATCH_INFO = gql`
//   query GetMatchInfoFront($input: oGetMatchInfoFrontInput) {
//     getMatchInfoFront(input: $input) {
//       sPitchCondition
//       oTeam1 {
//         oTeam {
//           sTitle
//         }
//         aPlayers {
//           bPlaying11
//           sRoleStr
//           oPlayer {
//             sPlayingRole
//             sFullName
//           }
//         }
//       }
//       oMatch {
//         dStartDate
//         sTitle
//         oSeries {
//           sTitle
//         }
//         oVenue {
//           sName
//         }
//         sUmpires
//         sReferee
//         oToss {
//           sText
//         }
//       }
//       oTeam2 {
//         oTeam {
//           sTitle
//         }
//         aPlayers {
//           bPlaying11
//           sRoleStr
//           oPlayer {
//             sPlayingRole
//             sFullName
//           }
//         }
//       }
//       oWinnerTeam {
//         sTitle
//       }
//       sAvgScore
//       sWeatherReport
//     }
//   }
// `

export const GET_MATCH_OVERVIEW = gql`
  query GetMatchOverviewFront($input: oGetMatchOverviewFrontInput!) {
    getMatchOverviewFront(input: $input) {
      aCricPrediction {
        ePlatformType
        oSeo {
          sSlug
        }
      }
      oTeam1 {
        aPlayers {
          bPlaying11
          oPlayer {
            sFullName
            sFirstName
          }
          sRoleStr
        }
        oTeam {
          sTitle
        }
      }
      oTeam2 {
        aPlayers {
          bPlaying11
          oPlayer {
            sFullName
            sFirstName
          }
          sRoleStr
        }
        oTeam {
          sTitle
        }
      }
      sMatchPreview
      sPitchCondition
      sWeatherReport
      sAvgScore
      oWinnerTeam {
        sTitle
      }
    }
  }
`

export const GET_MATCH_SQUAD = gql`
  query ListMatchSquad($input: oListMatchSquadInput) {
    listMatchSquad(input: $input) {
      bPlaying11
      iPlayerId
      oTeam {
        sAbbr
        sTitle
        _id
      }
      sName
      sRoleStr
    }
  }
`

export const RECENT_OVER = gql`
query ListMatchOvers($input: oListMatchOverFrontInput) {
  listMatchOvers(input: $input) {
    nTotal
    aResults {
      ${oversData}
    }
  }
}
`
