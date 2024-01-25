export const miniScorecard = `
dStartDate
iBattingTeamId
iMatchId
oVenue {
  sLocation
  sName
}
nLatestInningNumber
oSeries {
  _id
  sTitle
  sSrtTitle
  nTotalTeams
  oSeo {
    aCustomSeo {
      eTabType
      sSlug
    }
    sSlug
  }
}
oSeriesSeo {
  sSlug
}
oTeamScoreA {
  oTeam {
    sAbbr
    oImg {
      sUrl
    }
    sTitle
  }
  sScoresFull
  iTeamId
}
oTeamScoreB {
  oTeam {
    sAbbr
    oImg {
      sUrl
    }
    sTitle
  }
  sScoresFull
  iTeamId
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
iWinnerId
`
