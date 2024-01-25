import { gql } from '@apollo/client'

export const GET_SITE_MAP = gql`
  query Query($input: getSiteMapInput) {
    getSiteMap(input: $input)
  }
`
