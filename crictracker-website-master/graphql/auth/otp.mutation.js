import { gql } from '@apollo/client'

export const SEND_OTP = gql`
  mutation SendOTP($input: sendOTPInput) {
    sendOTP(input: $input) {
      sMessage
      oData {
        sCode
        sToken
      }
    }
  }
`

export const VERIFY_OTP = gql`
  mutation VerifyUserOTP($input: verifyUserOTPInput) {
    verifyUserOTP(input: $input) {
      oData {
        sCode
      }
      sMessage
    }
  }
`
