import { gql } from '@apollo/client'
import { commentaryData, liveInningData, oversData, scorecardData } from '@graphql/match'

export const FULL_SCOREBOARD = gql`
subscription FetchLiveInningsData($input: liveInningsInput) {
  fetchLiveInningsData(input: $input) {
    ${scorecardData}
  }
}
`

export const GET_COMMENTARY_SUBSCRIPTION = gql`
subscription ListMatchCommentaries($input: oListCommentariesInput) {
  listMatchCommentaries(input: $input) {
    ${commentaryData}
  }
}
`
export const GET_RECENT_OVER = gql`
subscription Subscription($input: oListMatchOverFrontInput) {
  listMatchOvers(input: $input) {
    ${oversData}
  }
}
`
export const MATCH_DETAIL_FOR_CLIENT = gql`
  query GetMatchById($input: oGetMatchByIdInput) {
    getMatchById(input: $input) {
      oTeamScoreA {
        sScoresFull
      }
      oTeamScoreB {
        sScoresFull
      }
      sStatusNote
      nLatestInningNumber
      oLiveScore {
        nRunrate
        sRequiredRunrate
      }
    }
  }
`

export const GET_MATCH_HEADER = gql`
subscription GetMatchBySlug($input: oListCommentariesInput) {
  getMatchBySlug(input: $input) {
    oMatchDetailsFront {
      oTeamScoreA {
        sScoresFull
      }
      oTeamScoreB {
        sScoresFull
      }
      sStatusNote
      nLatestInningNumber
      oLiveScore {
        nRunrate
        sRequiredRunrate
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
    }
  }
}
`

export const GET_LIVE_DATA = gql`
subscription Subscription($input: oListCommentariesInput) {
  getMatchBySlug(input: $input) {
    LiveInnings {
      ${liveInningData}
    }
  }
}
`
