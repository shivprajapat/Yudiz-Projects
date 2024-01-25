const enums = {
  eSubscriptionType: {
    value: ['api', 'article', 'exclusive', 'category'],
    description: { api: 'Api quota based limit', article: 'Unique article based limit', exclusive: 'Exclusive Article based limit' },
    default: 'api'
  },
  eStatus: {
    value: ['a', 'u', 'i', 'd'],
    description: { a: 'active', u: 'upcoming', i: 'inactive', d: 'deleted' },
    default: 'a'
  }
}

module.exports = enums
