import gql from 'graphql-tag'

export const GET_POLL_BY_ID = gql`
  query GetPollById($input: getPollInput!) {
    getPollById(input: $input) {
      _id
      aField {
        nVote
        sTitle
      }
      dEndDate
      dStartDate
      nTotalVote
      eStatus
      sTitle
    }
  }
`

export const GET_ALL_POLL = gql`
  query ListPoll($input: listPollInput!) {
    listPoll(input: $input) {
      aPolls {
        _id
        aField {
          _id
          nVote
          sTitle
        }
        dEndDate
        dStartDate
        eStatus
        nTotalVote
        sTitle
      }
      nTotal
    }
  }
`

export const ADD_GLOBAL_POLL = gql`
  mutation AddPoll($input: addPollInput!) {
    addPoll(input: $input) {
      oData {
        _id
        aField {
          sTitle
          nVote
          _id
        }
        dEndDate
        dStartDate
        eStatus
        nTotalVote
        sTitle
      }
      sMessage
    }
  }
`

export const UPDATE_GLOBAL_POLL = gql`
  mutation EditPoll($input: editPollInput!) {
    editPoll(input: $input) {
      sMessage
    }
  }
`
export const DELETE_POLLS = gql`
  mutation BulkDeletePoll($input: bulkDeletePollInput) {
    bulkDeletePoll(input: $input) {
      sMessage
    }
  }
`

export const GET_HOME_WIDGETS = gql`
  query GetHomeWidgets {
    getHomeWidgets {
      _id
      eType
      mValue {
        _id
        sTitle
      }
      nPriority
      sPosition
    }
  }
`
export const EDIT_HOME_WIDGETS = gql`
  mutation UpdateHomeWidgets($input: [updateHomeWidgetsInput!]!) {
    updateHomeWidgets(input: $input)
  }
`
