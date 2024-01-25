const enums = {
  ePollStatus: {
    value: ['pub', 's', 'ex', 'd'],
    description: { pb: 'publish', s: 'scheduled', ex: 'expired', d: 'deleted' },
    default: 'pub'
  },
  eStatus: {
    value: ['a', 'i', 'd'],
    description: { a: 'active', i: 'inactive', d: 'deleted' },
    default: 'a'
  },
  eUrlTarget: {
    value: ['_blank', '_self', '_parent', '_top', 'framename'],
    description: {
      _blank: 'Opens the linked document in a new window or tab',
      _self: 'Opens the linked document in the same frame as it was clicked (this is default)',
      _parent: 'Opens the linked document in the parent frame',
      _top: 'Opens the linked document in the full body of the window',
      framename: 'Opens the linked document in the named iframe'
    },
    default: '_self'
  },
  eMenuType: {
    value: ['self', 'outside'],
    description: { self: 'Menu item withing website', outside: 'Menu item outside website' },
    default: 'self'
  },
  eRankType: {
    value: ['Batsmen', 'Bowlers', 'AllRounders', 'Teams'],
    description: { Batsmen: 'Batsmen Ranks', Bowlers: 'Bowlers Ranks', AllRounders: 'AllRounders Ranks', Teams: 'Teams Ranks' }
  },
  eMatchType: {
    value: ['Odis', 'Tests', 'T20s'],
    description: { Odis: 'ODIs Ranks', Tests: 'Tests Ranks', T20s: 'T20s' }
  },
  eFooterType: {
    value: ['TOP_SERIES', 'TOP_PLAYERS', 'TOP_TEAMS', 'MORE'],
    description: { TOP_SERIES: 'Top Series', TOP_PLAYERS: 'Top Players', TOP_TEAMS: 'Top Teams', MORE: 'More' },
    default: 'MORE'
  },
  eGender: {
    value: ['M', 'W'],
    description: { M: 'Male', W: 'Women' }
  }
}

module.exports = enums
