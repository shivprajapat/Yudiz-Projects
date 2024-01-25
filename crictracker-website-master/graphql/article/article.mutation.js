import { gql } from '@apollo/client'

export const ADD_BOOKMARK = gql`
  mutation AddUserBookmark($input: addUserBookmarkInput) {
    addUserBookmark(input: $input) {
      _id
      sMessage
    }
  }
`

export const REMOVE_BOOKMARK = gql`
  mutation DeleteBookmark($input: deleteBookmark) {
    deleteBookmark(input: $input) {
      sMessage
    }
  }
`

export const ADD_COMMENT = gql`
  mutation AddUserComment($input: addUserCommentInput) {
    addUserComment(input: $input) {
      sMessage
      oData {
        _id
        sContent
        dCreated
        oCreatedBy {
          sUsername
          sFullName
          _id
        }
      }
    }
  }
`
export const ADD_FANTASY_ARTICLE_COMMENT = gql`
  mutation AddFantasyUserComment($input: addFantasyUserCommentInput) {
    addFantasyUserComment(input: $input) {
      sMessage
      oData {
        _id
        sContent
        dCreated
        oCreatedBy {
          sUsername
          sFullName
          _id
        }
      }
    }
  }
`

export const DELETE_COMMENT = gql`
  mutation DeleteFrontComment($input: deleteFrontCommentInput) {
    deleteFrontComment(input: $input) {
      sMessage
    }
  }
`
export const DELETE_FANTASY_ARTICLE_COMMENT = gql`
  mutation DeleteFantasyComment($input: deleteFantasyCommentInput) {
    deleteFantasyComment(input: $input) {
      sMessage
    }
  }
`

export const REPORT_COMMENT = gql`
  mutation ReportComment($input: reportCommentInput) {
    reportComment(input: $input) {
      sMessage
    }
  }
`
export const REPORT_FANTASY_ARTICLE_COMMENT = gql`
  mutation ReportFantasyComment($input: reportFantasyCommentInput) {
    reportFantasyComment(input: $input) {
      sMessage
    }
  }
`
export const ADD_CLAP = gql`
  mutation UpdateArticleClap($input: updateArticleClapInput) {
    updateArticleClap(input: $input) {
      sMessage
    }
  }
`

export const ADD_FANTASY_CLAP = gql`
  mutation UpdateFantasyArticleClap($input: updateFantasyArticleClapInput) {
    updateFantasyArticleClap(input: $input) {
      nTotalClap
      sMessage
    }
  }
`

export const ADD_POLL_ANSWER = gql`
  mutation UpdatePollCount($input: updatePollCountInput) {
    updatePollCount(input: $input) {
      sMessage
    }
  }
`
