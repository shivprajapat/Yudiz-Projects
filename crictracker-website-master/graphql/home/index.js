export const miniScorecard = `
aFantasyTipsSlug
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
    sSlug
  }
}
oSeriesSeo {
  aCustomSeo {
    sSlug
    eTabType
  }
  sSlug
}
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
  iTeamId
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
