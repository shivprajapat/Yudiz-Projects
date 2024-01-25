import { gql } from '@apollo/client'

export const GET_TAG_BY_ID = gql`
  query GetTagByIdFront($input: oGetTagByIdFrontInput) {
    getTagByIdFront(input: $input) {
      _id
      eType
      sContent
      sName
      bIsFav
    }
  }
`

export const IS_TAG_FAVORITE = gql`
  query GetTagByIdFront($input: oGetTagByIdFrontInput) {
    getTagByIdFront(input: $input) {
      bIsFav
    }
  }
`

export const GET_TAG_ARTICLE = gql`
  query GetTagArticlesFront($input: oGetTagArticlesFrontInput) {
    getTagArticlesFront(input: $input) {
      aResults {
        _id
        sTitle
        sSubtitle
        dPublishDate
        sSrtTitle
        oTImg {
          sUrl
          sCaption
          sText
        }
        oImg {
          sUrl
          sText
          sCaption
          sAttribute
        }
        oSeo {
          sSlug
        }
      }
    }
  }
`
