const enums = {
  eTagType: {
    value: ['p', 't', 'v', 'gt'],
    description: { p: 'player', t: 'team', v: 'venue', gt: 'general tag' },
    default: 'gt'
  },
  eTagStatus: {
    value: ['r', 'a', 'i', 'd'],
    description: { r: 'requested', a: 'active', i: 'inactive', d: 'deleted' },
    default: 'r'
  }
}

module.exports = enums
