let matchPlayers = {}

export const setMatchDetailTabTitle = (matchDetail, liveScoreData, isCurrentBatting) => {
  if (window !== undefined) {
    const batter1 = isCurrentBatting ? matchDetail?.oTeamScoreA : matchDetail?.oTeamScoreB
    const batter2 = isCurrentBatting ? matchDetail?.oTeamScoreB : matchDetail?.oTeamScoreA
    const batter = liveScoreData?.aActiveBatters || []
    const activeBatter = (matchDetail?.bIsCommentary && batter?.length > 0) ? `(${batter[0]?.oBatter?.sFullName} ${batter[0]?.nRuns}(${batter[0]?.nBallFaced}) ${batter[1]?.oBatter?.sFullName} ${batter[1]?.nRuns}(${batter[1]?.nBallFaced}))` : ''
    if (matchDetail?.sStatusStr === 'live') {
      if (matchDetail?.nLatestInningNumber === 1) {
        const title = `${batter1?.oTeam?.sAbbr} ${batter1?.sScoresFull} ${activeBatter} | ${matchDetail?.oSeo?.sTitle}`
        // console.log(title)
        return title
        // document.title = title
      } else if (matchDetail?.nLatestInningNumber > 1) {
        const title = `${batter1?.oTeam?.sAbbr} ${batter1?.sScoresFull} vs ${batter2?.oTeam?.sAbbr} ${batter2?.sScoresFull} ${activeBatter} | ${matchDetail?.oSeo?.sTitle}`
        // console.log(title)
        return title
        // document.title = title
      }
    } else if (matchDetail?.sStatusStr === 'completed' && matchDetail?.nLatestInningNumber > 1) {
      const lastBatting = matchDetail?.aInning[matchDetail?.aInning.length - 1]?.iBattingTeamId
      const first = lastBatting === matchDetail?.oTeamScoreA?.oTeam?._id ? matchDetail?.oTeamScoreA : matchDetail?.oTeamScoreB
      const second = lastBatting === matchDetail?.oTeamScoreA?.oTeam?._id ? matchDetail?.oTeamScoreB : matchDetail?.oTeamScoreA
      const title = `${first?.oTeam?.sAbbr} ${first?.sScores} (${first?.sOvers}) vs ${second?.oTeam?.sAbbr} ${second?.sScores} (${second?.sOvers}) ${activeBatter} | ${matchDetail?.oSeo?.sTitle}`
      // console.log({ title })
      return title
      // document.title = title
    }
  }
  return null
}

export const setMatchPlayer = ({ oTeam1 = {}, oTeam2 = {} }) => {
  const oTeam1TotalPlayer = oTeam1?.aPlayers?.length
  const allPlayers = [...oTeam1?.aPlayers, ...oTeam2?.aPlayers]
  const player = {}
  allPlayers.forEach((p, i) => {
    player[p?.oPlayer?._id] = {
      ...p,
      ...p?.oPlayer,
      oTeam: i >= oTeam1TotalPlayer ? { ...oTeam2?.oTeam, oJersey: oTeam2?.oTeam?.oJersey } : { ...oTeam1?.oTeam, oJersey: oTeam1?.oTeam?.oJersey }
    }
  })
  matchPlayers = player
}

export const getMatchPlayers = () => matchPlayers
