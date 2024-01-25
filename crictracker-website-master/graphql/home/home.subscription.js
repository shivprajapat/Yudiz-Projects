import { gql } from '@apollo/client'
import { miniScorecard } from '@graphql/home'

export const MINI_SCORECARD_SUBSCRIPTION = gql`
subscription Subscription {
  fetchMiniScorecardData {
    ${miniScorecard}
  }
}
`
