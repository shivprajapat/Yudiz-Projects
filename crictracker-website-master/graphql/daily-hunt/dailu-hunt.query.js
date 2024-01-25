import { gql } from '@apollo/client'
import { miniScorecard } from '@graphql/home'
import { MATCH_DETAIL_RESPONSE_DH } from './daily-hunt.subscription'

export const DAILY_HUNT_WIDGET = gql`
  query DailyHuntWidget($input: dailyHuntWidgetInput) {
    dailyHuntWidget(input: $input) {
      ${miniScorecard}
    }
  }
`

export const DAILY_HUNT_WIDGET_MATCH_ID = gql`
  query DailyHuntWidget($input: dailyHuntWidgetInput) {
    dailyHuntWidget(input: $input) {
      iMatchId
    }
  }
`
export const MATCH_DETAIL_FOR_DH = gql`
  query GetMatchById($input: oGetMatchByIdInput) {
    getMatchById(input: $input) {
      ${MATCH_DETAIL_RESPONSE_DH}
    }
  }
`
