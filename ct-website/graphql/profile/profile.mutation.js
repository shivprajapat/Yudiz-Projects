import { gql } from '@apollo/client'

export const EDIT_PROFILE = gql`
  mutation UpdateProfile($input: profileInput) {
    updateProfile(input: $input) {
      sMessage
      oData {
        bIsEmailVerified
        bIsMobVerified
        bIsSocialUser
        dDOB
        eGender
        sBio
        sCity
        sEmail
        sFullName
        sMobNum
        sProPic
        sUsername
        oCountry {
          sSortName
          sName
          sId
        }
      }
    }
  }
`

export const GENERATE_PRE_SIGNED = gql`
  mutation GeneratePreSignedUrlMutation($generatePreSignedUrlInput: [generatePreSignedUrl]) {
    generatePreSignedUrl(input: $generatePreSignedUrlInput) {
      sS3Url
      sType
      sUploadUrl
    }
  }
`
export const UPDATE_PROFILE_PICTURE = gql`
  mutation UpdateProfileImage($input: oUpdateProfileImageInput!) {
    updateProfileImage(input: $input) {
      sProPic
      sMessage
    }
  }
`
