import { gql } from '@apollo/client'

export const APPLY_JOB = gql`
  mutation ApplyJob($input: applyJobInput) {
    applyJob(input: $input) {
      sMessage
    }
  }
`
export const GENERATE_CV_PRE_SIGNED_URL = gql`
  mutation GenerateCVPreSignedUrl($input: [generateCVPreSignedUrl]) {
    generateCVPreSignedUrl(input: $input) {
      sS3Url
      sType
      sUploadUrl
    }
  }
`
