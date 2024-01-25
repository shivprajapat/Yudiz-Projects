import { gql } from '@apollo/client'

export const GET_ARCHIVES = gql`
query ListSeriesCTArchive($input: oListSeriesCTArchiveInput!) {
  listSeriesCTArchive(input: $input) {
    _id
    oSeo {
      sSlug
    }
    oSeries {
      sTitle
      sSeason
      dStartDate
      dEndDate
      oSeo {
        sSlug
      }
    }
  }
}
`
