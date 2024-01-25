import { gql } from '@apollo/client'

export const RESET_PASSWORD = gql`
  mutation ResetUserPassword($input: resetUserPasswordInput) {
    resetUserPassword(input: $input) {
      sMessage
    }
  }
`
