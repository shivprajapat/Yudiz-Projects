import { gql } from '@apollo/client'

export const GET_LIVE_BLOG_SUBSCRIPTION = gql`
  subscription ListLiveBlogContent($input: eventCommonInput) {
    listLiveBlogContent(input: $input) {
      liveBlogContent {
        _id
        iEventId
        sContent
        sTitle
        oPoll {
          _id
          nTotalVote
          sTitle
          dEndDate
          dStartDate
          aField {
            nVote
            sTitle
            _id
          }
        }
        eStatus
        dCreated
        oAuthor {
          sFName
        }
        eType
        dPublishDate
        sEventId
        dEndDate
        dUpdated
      }
      eOpType
    }
  }
`
export const GET_CUSTOM_SCORE_SUBSCRIPTION = gql`
  subscription Subscription($input: eventCommonInput) {
    getLiveMatchScore(input: $input) {
      oTeams {
        oTeamA {
          sName
          sLogoUrl
          oFirstInningScore {
            sRun
            sWicket
          }
          oSecondInningScore {
            sRun
            sWicket
          }
        }
        oTeamB {
          sName
          sLogoUrl
          oFirstInningScore {
            sRun
            sWicket
          }
          oSecondInningScore {
            sRun
            sWicket
          }
        }
        sTeamAovers
        sTeamBovers
        sScoreSummary
      }
    }
  }
`
