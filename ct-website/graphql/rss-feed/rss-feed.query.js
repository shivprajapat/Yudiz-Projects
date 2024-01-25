import { gql } from '@apollo/client'

export const GET_RSS_FEED = gql`
  query Query($input: getRssFeedInput) {
    getRssFeed(input: $input)
  }
`
