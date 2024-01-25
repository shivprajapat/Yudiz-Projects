import { gql } from '@apollo/client'

export const ADD_FAVOURITE = gql`
  mutation AddFavourite($input: oAddFavouriteInput!) {
    addFavourite(input: $input) {
      sMessage
    }
  }
`
export const DELETE_FAVOURITE = gql`
  mutation DeleteFavourite($input: oDeleteFavouriteInput!) {
    deleteFavourite(input: $input) {
      sMessage
      oData {
        _id
      }
    }
  }
`
