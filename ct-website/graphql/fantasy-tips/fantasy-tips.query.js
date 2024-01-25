import { gql } from '@apollo/client'
import { fantasyArticleListData } from '.'

export const fantasyArticleData = `
_id
dPublishDate
dPublishDisplayDate
nCommentCount
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
  sUrl
  oSeo {
    sSlug
  }
}
dUpdated
oOverview {
  oTeam1 {
    aBenchedPlayers {
      sShortName
    }
    aPlayers {
      sPlayingRole
      sShortName
      _id
    }
    iC
    oTeam {
      sTitle
    }
  }
  oTeam2 {
    aBenchedPlayers {
      sShortName
    }
    aPlayers {
      sPlayingRole
      sShortName
      _id
    }
    iC
    oTeam {
      sTitle
    }
  }
  sWeatherReport
  sWeatherCondition
  sPitchReport
  sPitchCondition
  sOutFieldCondition
  sNews
  sMatchPreview
  sAvgScore
  oWinnerTeam {
    sTitle
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
        sTitle
      }
    }
    oTeamB {
      nCount
      oTeam {
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
    }
    oPlayer {
      sFirstName
      sPlayingRole
      oImg {
        sUrl
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
  }
  dStartDate
  oVenue {
    sLocation
  }
  _id
  oTeamA {
    _id
    sTitle
  }
  oTeamB {
    sTitle
    _id
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
