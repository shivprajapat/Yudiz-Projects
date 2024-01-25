import { gql } from '@apollo/client'

export const FOOTER_MENU = gql`
  query GetFrontFooter {
    getFrontFooter {
      eType
      aResults {
        sTitle
        sUrl
      }
    }
  }
`
