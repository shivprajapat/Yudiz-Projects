import { gql } from '@apollo/client'

export const GET_CMS_PAGE = gql`
  query GetUserCMSPage($input: oGetCmsById!) {
    getUserCMSPage(input: $input) {
      sTitle
      sContent
      sAmpContent
    }
  }
`
export const INSERT_CONTACT = gql`
  mutation InsertContact($input: addContactInput) {
    insertContact(input: $input) {
      sMessage
    }
  }
`
export const GET_CONTACT_QUERY_TYPE = gql`
  query GetContactQueryType {
    getContactQueryType {
      sLabel
      sValue
    }
  }
`
