import { gql } from '@apollo/client'

export const GET_FEEDBACK_QUERY_TYPE = gql`
  query GetFeedbackQueryType {
    getFeedbackQueryType {
      sValue
      sLabel
    }
  }
`
