export const fantasyMatchPlayerStatsTypes = ['stBmr', 'stBhs', 'stBtwt', 'stBber']

export const fantasyMatchPlayerStats = [
  {
    navItem: 'Most Runs',
    internalName: 'stBmr'
  },
  {
    navItem: 'Best Strike Rate',
    internalName: 'stBhs'
  },
  {
    navItem: 'Most Wickets',
    internalName: 'stBtwt'
  },
  {
    navItem: 'Best Economy Rate',
    internalName: 'stBber'
  }
]

export function activeTabWiseData(tab, data) {
  if (tab === 'stBmr') {
    return `${data?.nRuns} Runs`
  } else if (tab === 'stBhs') {
    return parseFloat(data?.sStrike).toFixed(2)
  } else if (tab === 'stBtwt') {
    return `${data?.nWickets} Wkts`
  } else if (tab === 'stBber') {
    return data?.nEcon.toFixed(2)
  }
}
