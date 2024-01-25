const enums = {
  eCategoryType: {
    value: ['s', 'as', 'pct', 'fac'],
    description: { s: 'Simple Category', as: 'API Series Category', pct: 'parent Category', fac: 'Fantasy Article Category' },
    default: 's'
  },
  ePlatformType: {
    value: ['de', 'ew'], // de - Dream Eleven , ew- Eleven Wickets
    description: { de: 'Dream Eleven(11)', ew: 'Eleven(11) Wickets' }
  }
}

module.exports = enums
