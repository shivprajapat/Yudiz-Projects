import { gql } from '@apollo/client'

export const GET_SEO_BY_ID = gql`
  query OSeoById($input: oSeoByIdInput) {
    oSeoById(input: $input) {
      sSlug
    }
  }
`
