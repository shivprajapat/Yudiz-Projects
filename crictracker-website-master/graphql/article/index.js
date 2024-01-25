export const articleDetailData = `
  _id
  dPublishDate
  dPublishDisplayDate
  dModifiedDate
  iEventId
  oDisplayAuthor {
    dCreated
    sDisplayName
    sNumber
    sUName
    sFName
    sUrl
    eDesignation
    _id
    bIsVerified
    oSeo {
      sSlug
    }
  }
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
  oAdvanceFeature {
    bAllowLike
    bAllowComments
    bRequireAdminApproval
    bExclusiveArticle
    bEditorsPick
    bAmp
  }
  sContent
  sAmpContent
  sDescription
  sSrtTitle
  sSubtitle
  sTitle
  dUpdated
  nCommentCount
  nDuration
  nClaps
  nViewCount
  nOViews
  aPlayer {
    sName
    _id
    eType
    eStatus
    oSeo {
      sSlug
    }
  }
  aSeries {
    sName
    eType
    _id
    oSeo {
      sSlug
    }
    eStatus
  }
  aTags {
    sName
    eType
    _id
    eStatus
    oSeo {
      sSlug
    }
  }
  aVenue {
    sName
    _id
    eStatus
    eType
    oSeo {
      sSlug
    }
  }
  oCategory {
    sName
    _id
    oSeo {
      sSlug
    }
    eStatus
  }
  aTeam {
    sName
    _id
    eType
    eStatus
    oSeo {
      sSlug
    }
  }
  oSeo {
    eType
  }
  oListicleArticle {
    nTotal
    oPageContent
    oAmpPageContent
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
  bIsListicleArticle
  iBookmarkedId
  bIsBookmarked
  bOld
`

export const articleListData = `
  _id
  sTitle
  sSrtTitle
  oSeo {
    sSlug
    }
  sDescription
  oImg {
    sUrl
    sText
    sCaption
    sAttribute
  }
  nDuration
  dPublishDate
  dPublishDisplayDate
  oCategory {
    sName
    _id
    oSeo {
      sSlug
    }
  }
  oTImg {
    sUrl
    sText
    sCaption
    sAttribute
  }
`

export const videoArticleData = `
  _id
  aThumbnails {
    sKey
    sUrl
  }
  oSeo {
    sSlug
  }
  dPublishDate
  sDuration
  sTitle
  sDescription
  nDurationSeconds
  sThumbnailUrl
  sThumbnailHeight
  sThumbnailWidth
`
export const liveArticleListData = `
    aResults {
        _id
        dPublishDate
        eStatus
        eType
        oAuthor {
          sFName
        }
        oPoll {
          nTotalVote
          sTitle
          dEndDate
          dStartDate
          aField {
            nVote
            sTitle
            _id
          }
          _id
        }
        iEventId
        sContent
        sAmpContent
        sTitle
        sEventId
        dCreated
        dEndDate
        dUpdated
      }
`
export const liveArticleEventData = `
    oEvent {
      oMatch {
          nLatestInningNumber
          sSubtitle
          oVenue {
            sLocation
          }
          oTeamScoreA {
            oTeam {
              oImg {
                sUrl
                sText
              }
              sAbbr
              sTitle
            }
            sScoresFull
          }
          oTeamScoreB {
            sScoresFull
            oTeam {
              oImg {
                sUrl
              }
              sAbbr
              sTitle
            }
          }
          sStatusStr
          sStatusNote
          sLiveGameStatusStr
          dStartDate
          oSeo {
            sSlug
          }
      }
      sEventName
      _id
      iMatchId
      oTeams {
        oTeamA {
          oFirstInningScore {
            sRun
            sWicket
          }
          oSecondInningScore {
            sRun
            sWicket
          }
          sLogoUrl
          sName
        }
        oTeamB {
          oFirstInningScore {
            sRun
            sWicket
          }
          oSecondInningScore {
            sRun
            sWicket
          }
          sLogoUrl
          sName
        }
        sScoreSummary
        sTeamAovers
        sTeamBovers
      }
      dEventDate
      dEventEndDate
      sLocation
    }
`
