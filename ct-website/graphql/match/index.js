export const scorecardData = `
iBattingTeamId
aBatters {
  eDismissal
  nBallFaced
  nFours
  nRuns
  nSixes
  oBatter {
    sShortName
    sFullName
    eTagStatus
    oSeo {
      sSlug
    }
  }
  sHowOut
  sStrikeRate
  iBatterId
}
aBowlers {
  nMaidens
  oBowler {
    sShortName
    sFullName
    eTagStatus
    oSeo {
      sSlug
    }
  }
  nWickets
  sEcon
  sOvers
  nNoBalls
  nWides
  nRunsConceded
}
aFOWs {
  nScoreDismissal
  nWicketNumber
  oBatter {
    sShortName
    sFullName
    eTagStatus
    oSeo {
      sSlug
    }
  }
  sOverDismissal
}
nInningNumber
oExtraRuns {
  nByes
  nWides
  nNoBalls
  nLegByes
  nTotal
  nPenalty
}
sName
sResultStr
oEquations {
  nRuns
  nWickets
  sOvers
  sRunRate
}
`

export const commentaryData = `
sOver
sBall
sScore
sHowOut
sCommentary
nRuns
eEvent
aBatters {
  oBatter {
    sShortName
    sFullName
  }
  nRuns
  nBallFaced
}
oWicketBatter {
  sFullName
  sShortName
}
aBowlers {
  oBowler {
    sShortName
    sFullName
  }
  nMaidens
  nRunsConceded
  nWickets
  sOvers
}
nInningNumber
sEventId
aOverScores
nBatterRuns
nBatterBalls
`

export const oversData = `
oOver {
  aBatters {
    oBatter {
      sFullName
    }
  }
  aBowlers {
    oBowler {
      sFullName
    }
  }
}
nOverTotal
aBall {
  sScore
  sBall
  nRuns
  sOver
  sEventId
}
oOver {
  sScore
}
sOver
nInningNumber
`

export const liveInningData = `
aActiveBatters {
  oBatter {
    sFullName
    sShortName
    sTitle
    eTagStatus
    oSeo {
      sSlug
    }
  }
  nSixes
  nRuns
  nFours
  nBallFaced
  sStrikeRate
}
aActiveBowlers {
  oBowler {
    sFullName
    eTagStatus
    oSeo {
      sSlug
    }
  }
  sEcon
  sOvers
  nWickets
  nRunsConceded
  nMaidens
}
oCurrentPartnership {
  nBalls
  nRuns
}
sLastFiveOvers
oLastWicket {
  oBatter {
    sFullName
  }
  sHowOut
  nRuns
  nBallFaced
}
aFOWs {
  nScoreDismissal
  nWicketNumber
  oBatter {
    sShortName
    sFullName
    eTagStatus
    oSeo {
      sSlug
    }
  }
  sOverDismissal
}
`
