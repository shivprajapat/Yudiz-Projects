import { gql } from '@apollo/client'

export const CHANGE_PASSWORD = gql`
  mutation UserChangePassword($input: changePasswordInput) {
    userChangePassword(input: $input) {
      sMessage
    }
  }
`
