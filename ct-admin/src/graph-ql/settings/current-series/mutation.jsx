import { gql } from '@apollo/client'

export const ADD_CURRENT_SERIES = gql`
  mutation AddCurrentSeries($input: oCurrentSeriesInput) {
    addCurrentSeries(input: $input) {
      sMessage
    }
  }
`
