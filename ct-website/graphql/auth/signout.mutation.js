import { gql } from '@apollo/client'

export const SIGN_OUT = gql`
  mutation UserLogout {
    userLogout {
      sMessage
    }
  }
`
