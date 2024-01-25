export const RANKING_TYPE = {
  Teams: 'teams',
  Batsmen: 'batting',
  Bowlers: 'bowling',
  AllRounders: 'all-rounder'
}

// export const RANKING_FORMATE_TYPE = {
//   test: 'test',
//   odi: 'odi',
//   t20i: 't20i'
// }

const RANKING_PAYLOAD = {
  teams: 'Teams',
  batting: 'Batsmen',
  bowling: 'Bowlers',
  'all-rounder': 'AllRounders',
  test: 'Tests',
  odi: 'Odis',
  t20i: 'T20s'
}

export const getRankingType = (type) => {
  const lastIndex = type.lastIndexOf('-')
  const before = type.slice(0, lastIndex)
  const after = type.slice(lastIndex + 1)
  return { eRankType: RANKING_PAYLOAD[before], eMatchType: RANKING_PAYLOAD[after], before, after }
}
