import { gql } from '@apollo/client'

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryByIdFront($input: oGetCategoryByIdFrontInput) {
    getCategoryByIdFront(input: $input) {
      _id
      iSeriesId
      eType
      sName
      sContent
      bIsFav
      oSeries {
        sSeriesType
        nTotalTeams,
        sSrtTitle,
        dStartDate,
        sTitle
      }
      oImg {
        sUrl
        sAttribute
        sCaption
        sText
      }
      oSeo {
        sSlug
      }
    }
  }
`

export const GET_FAVOURITE = gql`
  query ListFavourite($input: oListFavouriteInput) {
    listFavourite(input: $input) {
      aResults {
        sName
        iPageId
        oSeo {
          sSlug
        }
      }
      nTotal
    }
  }
`

export const GET_SERIES_REWRITE_URLS = gql`
  query GetSeriesCustomPages($input: getSeriesCustomPagesInput) {
    getSeriesCustomPages(input: $input) {
      eTabType
      sSlug
    }
  }
`
