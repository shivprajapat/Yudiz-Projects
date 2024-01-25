import { gql } from '@apollo/client'

export const VERIFY_OTP = gql`
  mutation verifyOtp($nOtp: Int!, $sEmail: String!, $eAuth: String!, $eType: String!) {
    verifyOtp(input: { nOtp: $nOtp, sEmail: $sEmail, eAuth: $eAuth, eType: $eType }) {
      sMessage
    }
  }
`
export const RESET_PASSWORD = gql`
  mutation resetPassword($sEmail: String!, $sNewPassword: String!, $sConfirmNewPassword: String!) {
    resetPassword(input: { sEmail: $sEmail, sNewPassword: $sNewPassword, sConfirmNewPassword: $sConfirmNewPassword }) {
      sMessage
    }
  }
`
