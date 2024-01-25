import { gql } from '@apollo/client'

export const GET_SERIES_BY_ID = gql`
query GetSeriesByIdFront($input: oGetSeriesByIdFrontInput!) {
  getSeriesByIdFront(input: $input) {
    _id
    sTitle
    sSeriesType
    nTotalTeams
    iCategoryId
  }
}
`
