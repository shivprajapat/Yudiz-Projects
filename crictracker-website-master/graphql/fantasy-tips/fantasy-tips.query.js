import { gql } from '@apollo/client'
import { fantasyArticleListData } from '.'

export const fantasyArticleData = `
_id
dPublishDate
dPublishDisplayDate
dModifiedDate
dUpdated
nCommentCount
sAmpPreview
sTitle
sSubtitle
oSeo {
  _id
  sSlug
  sTitle
  eType
}
sSrtTitle
sMustPick
sMatchPreview
sEditorNotes
oImg {
  sText
  sCaption
  sAttribute
  sUrl
}
oTImg {
  sText
  sCaption
  sAttribute
  sUrl
}
oOtherInfo {
  sExpertAdvice
}
oDisplayAuthor {
  eDesignation
  sDisplayName
  bIsVerified
  sUrl
  oSeo {
    sSlug
  }
}
aPoll {
  _id
  aField {
    nVote
    sTitle
    _id
  }
  dEndDate
  eStatus
  nTotalVote
  sTitle
}
oOverview {
  oTeam1 {
    aBenchedPlayers {
      sShortName
      eTagStatus
      oSeo {
        sSlug
      }
    }
    aPlayers {
      sPlayingRole
      sShortName
      eTagStatus
      oSeo {
        sSlug
      }
      _id
    }
    iC
    iVC
    iWK
    oTeam {
      sTitle
      _id
      oJersey {
        sUrl
        sText
      }
    }
  }
  oTeam2 {
    aBenchedPlayers {
      sShortName
      eTagStatus
      oSeo {
        sSlug
      }
    }
    aPlayers {
      sPlayingRole
      sShortName
      eTagStatus
      oSeo {
        sSlug
      }
      _id
    }
    iC
    iVC
    iWK
    oTeam {
      sTitle
      _id
      oJersey {
        sUrl
        sText
      }
    }
  }
  sWeatherReport
  sWeatherCondition
  sPitchReport
  sPitchCondition
  nPaceBowling
  nSpinBowling
  nBattingPitch
  nBowlingPitch
  sBroadCastingPlatform
  sLiveStreaming
  sOutFieldCondition
  sNews
  sMatchPreview
  sAvgScore
  oWinnerTeam {
    sTitle
    oImg {
      sUrl
    }
    sAbbr
  }
}
sVideoUrl
ePlatformType
iCategoryId
aBudgetPicksFan {
  sDescription
  oPlayerFan {
    _id
    nRating
    oPlayer {
      sFirstName
      sPlayingRole
      oImg {
        sUrl
        sText
      }
      sShortName
    }
    eRole
    oTeam {
      sAbbr
      _id
    }
  }
}
aLeague {
  eLeague
  aTeam {
    aSelectedPlayerFan {
      _id
      oPlayer {
        sFirstName
        sShortName
        sPlayingRole
        oImg {
          sUrl
          sText
        }
      }
      nRating
      eRole
      oTeam {
        sAbbr
        _id
      }
    }
    oVCFan {
      _id
      oPlayer {
        _id
      }
      nRating
      eRole
      oTeam {
        sAbbr
      }
    }
    oCapFan {
      _id
      oPlayer {
        _id
      }
      nRating
      eRole
      oTeam {
        sTitle
        sAbbr
      }
    }
    oTPFan {
      _id
      oPlayer {
        _id
      }
      nRating
      eRole
      oTeam {
        sAbbr
      }
    }
    oTeamA {
      nCount
      oTeam {
        _id
        sTitle
        sAbbr
      }
    }
    oTeamB {
      nCount
      oTeam {
        _id
        sAbbr
        sTitle
      }
    }
  }
  eLeagueFull
}
aAvoidPlayerFan {
  sDescription
  oPlayerFan {
    oTeam {
      sAbbr
      _id
    }
    oPlayer {
      sFirstName
      sPlayingRole
      oImg {
        sUrl
        sText
      }
      sShortName
    }
    nRating
    eRole
  }
}
aCVCFan {
  sDescription
  eType
  oPlayerFan {
    oTeam {
      sAbbr
      _id
    }
    oPlayer {
      sFirstName
      sPlayingRole
      oImg {
        sUrl
        sText
      }
      sShortName
    }
    nRating
    eRole
  }
}
aTopicPicksFan {
  sDescription
  oPlayerFan {
    oTeam {
      sAbbr
      _id
    }
    oPlayer {
      sFirstName
      sPlayingRole
      oImg {
        sUrl
        sText
      }
      sShortName
    }
    nRating
    eRole
  }
}
oMatch {
  sTitle
  sStatusStr
  sSubtitle
  oSeo {
    sSlug
  }
  oSeries {
    sTitle
    _id
  }
  dStartDate
  oVenue {
    _id
    sLocation
    sName
  }
  _id
  oTeamA {
    _id
    sTitle
    sAbbr
    oImg {
      sUrl
    }
  }
  oTeamB {
    sTitle
    _id
    sAbbr
    oImg {
      sUrl
    }
  }
}
oAdvanceFeature {
  bAllowComments
  bAmp
  bBrandedContent
  bEditorsPick
  bExclusiveArticle
  bFBEnable
  bRequireAdminApproval
  bPlayerStats
  bPitchReport
  bTeamForm
}
nClaps
nViewCount
nOViews
nDuration
aTagsData {
  _id
  sName
  eType
  oSeo {
    sSlug
  }
}
aPlayerTag {
  _id
  oSeo {
    sSlug
  }
  eType
  sName
}
aSeriesCategory {
  _id
  oSeo {
    sSlug
  }
  eType
  sName
}
aTeamTag {
  _id
  sName
  eType
  oSeo {
    sSlug
  }
}
`

export const FANTASY_TIPS_LIST = gql`
  query ListMatchFantasyTipsFront($input: oListMatchFantasyTipsFrontInput) {
    listMatchFantasyTipsFront(input: $input) {
      aResults {
        _id
        dStartDate
        aFantasyTips {
          ePlatformType
          _id
          oSeo {
            sSlug
          }
        }
        oSeries {
          sTitle
          oSeo {
            sSlug
          }
        }
        oTeamA {
          sAbbr
          oImg {
            sUrl
          }
          sTitle
        }
        oTeamB {
          sAbbr
          oImg {
            sUrl
          }
          sTitle
        }
        oVenue {
          sLocation
        }
        sFormatStr
        sSubtitle
      }
    }
  }
`

export const GET_FANTASY_DETAILS = gql`
query GetFrontFantasyArticle($input: getFantasyArticleInput) {
  getFrontFantasyArticle(input: $input) {
    ${fantasyArticleData}
  }
}
`
export const GET_FANTASY_TEAM_FORM = gql`
  query GetRecentMatchesOfTeam($input: getRecentMatchesOfTeamInput) {
    getRecentMatchesOfTeam(input: $input) {
      _id
      oSeries {
        oCategory {
          sName
        }
      sAbbr
      }
      oWinner {
        sTitle
        sAbbr
        _id
      }
      oSeo {
        sSlug
      }
      sSubtitle
      sTitle
      sStatusStr
      sStatusNote
      sResult
      sLiveMatchNote
      sWinMargin
      oTeamScoreA {
        oTeam {
          sAbbr
        }
      }
      oTeamScoreB {
        oTeam {
          sAbbr
        }
      }
    }
  }
`
export const GET_FANTASY_WEATHER_REPORT = gql`
  query GetWeatherCondition($input: getWeatherConditionInput) {
    getWeatherCondition(input: $input) {
      sMain
      sDescription
      sIcon
      nTemp
      nHumidity
      nVisibility
      nWindSpeed
      nClouds
    }
  }
`

// export const GET_FANTASY_PLAYER_DATA = gql`
// query ListFantasyPlayersInfo($input: oListFantasyPlayerInfoInput) {
//   listFantasyPlayersInfo(input: $input) {
//     eRole
//     nRating
//     oPlayer {
//       sFullName
//       _id
//     }
//     oTeam {
//       _id
//     }
//   }
// }
// `

export const GET_FANTASY_RELATED_STORIES = gql`
query GetRelatedFantasyStories($input: oGetRealatedFantasyStoriesInput) {
  getRelatedFantasyStories(input: $input) {
    ${fantasyArticleListData}
  }
}
`
export const FANTASY_PLAYERS_STATS = gql`
query FetchFantasyPlayerStats($input: fetchFantasyPlayerStatsInput) {
  fetchFantasyPlayerStats(input: $input) {
    eSeriesStatsType
    aData {
      _id
      oPlayer {
        sFirstName
        sFullName
        oSeo {
          sSlug
        }
        oImg {
          sUrl
          sText
        }
        sPlayingRole
        eTagStatus
      }
      nMatches
      nWickets
      sStrike
      nRuns
      nEcon
      oTeam {
        _id
        sTitle
        sAbbr
      }
    }
  }
}
`
