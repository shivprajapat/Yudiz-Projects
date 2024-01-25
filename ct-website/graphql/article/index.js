export const articleDetailData = `
  _id
  dPublishDate
  dPublishDisplayDate
  dModifiedDate
  oDisplayAuthor {
    dCreated
    sDisplayName
    sNumber
    sUName
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
  bIsListicleArticle
  iBookmarkedId
  bIsBookmarked
  bOld
`

export const articleListData = `
  _id
  sTitle
  sSubtitle
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
