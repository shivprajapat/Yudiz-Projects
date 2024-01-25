const enums = {
  eState: {
    value: ['d', 'p', 'r', 'cr', 'cs', 'pub', 't', 's'],
    description: { d: 'draft', p: 'pending', r: 'rejected', cr: 'changesRemaining', cs: 'changesSubmitted', pub: 'published', t: 'trash', s: 'scheduled publish' },
    default: 'd'
  },
  eArticleType: {
    value: ['i', 'v'],
    description: { i: 'image', v: 'video' },
    default: 'i'
  },
  eArticleVisibilityType: {
    value: ['pb', 'pr'],
    description: { pb: 'public', pr: 'private' },
    default: 'pb'
  }
}

module.exports = enums
