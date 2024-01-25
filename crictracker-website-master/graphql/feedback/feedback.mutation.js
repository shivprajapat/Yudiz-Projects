import { gql } from '@apollo/client'

export const INSERT_FEEDBACK = gql`
mutation InsertFeedback($input: addFeedbackInput) {
  insertFeedback(input: $input) {
    sMessage
  }
}
`
