export function getPlayerRoleType(role) {
  const playerRoles = {
    Batsmen: 'Batter',
    Bowlers: 'Bowler',
    AllRounders: 'All Rounder'
  }
  return playerRoles[role]
}

export function getMatchType(type) {
  const matchTypes = {
    T20s: 'T20',
    Odis: 'ODI',
    Tests: 'TEST'
  }
  return matchTypes[type]
}
