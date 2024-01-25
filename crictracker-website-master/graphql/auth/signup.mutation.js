import { gql } from '@apollo/client'

export const SIGNUP = gql`
  mutation SignUp($input: signUpInput) {
    signUp(input: $input) {
      sMessage
    }
  }
`
export const USER_EXISTS = gql`
  mutation UserExists($input: userExistsInput) {
    userExists(input: $input) {
      sMessage
    }
  }
`
