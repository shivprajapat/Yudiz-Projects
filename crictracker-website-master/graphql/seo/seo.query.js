import { gql } from '@apollo/client'

export const GET_SEO_BY_ID = gql`
  query OSeoById($input: oSeoByIdInput) {
    oSeoById(input: $input) {
      sSlug
    }
  }
`

export const GET_SUB_PAGE_BY_SLUG = gql`
  query GetSeosBySlug($input: oSeosByIdInput) {
    getSeosBySlug(input: $input) {
      sSlug
      eSubType
      sDTitle
      sContent
      sAmpContent
    }
  }
`
