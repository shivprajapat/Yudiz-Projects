import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation UserLogin($input: userLogin) {
    userLogin(input: $input) {
      sMessage
      oData {
        sToken
      }
    }
  }
`
