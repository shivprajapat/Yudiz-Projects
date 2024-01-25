import { gql } from '@apollo/client'
// import { miniScorecard } from '@graphql/home'

export const MATCH_DETAIL_RESPONSE_DH = `
dStartDate
# iBattingTeamId
# iMatchId
oVenue {
  sLocation
  sName
}
nLatestInningNumber
oSeries {
  _id
  sTitle
  # sSrtTitle
  nTotalTeams
  oSeo {
    sSlug
  }
}
# oSeriesSeo {
#   aCustomSeo {
#     sSlug
#     eTabType
#   }
#   sSlug
# }
oTeamScoreA {
  oTeam {
    sAbbr
    oImg {
      sUrl
    }
    sTitle
    _id
  }
  sScoresFull
  # iTeamId
}
oTeamScoreB {
  oTeam {
    sAbbr
    oImg {
      sUrl
    }
    sTitle
    _id
  }
  sScoresFull
  # iTeamId
}
sStatusNote
sTitle
sSubtitle
sStatusStr
sLiveGameStatusStr
oSeo {
  sSlug
  sDescription
  sTitle
}
# iWinnerId
oWinner {
  _id
}
`

export const TODAY_MATCH_DAILY_HUNT_SUBSCRIPTION = gql`
  subscription GetMatchBySlug($input: oListCommentariesInput) {
    getMatchBySlug(input: $input) {
      oMatchDetailsFront {
        ${MATCH_DETAIL_RESPONSE_DH}
      }
      LiveInnings {
        # iWinnerId
        iBattingTeamId
        iMatchId
      }
    }
  }
`
