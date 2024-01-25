const enums = {
  eStatus: {
    value: ['d', 'r', 'ur'],
    description: { d: 'deleted', r: 'read', ur: 'unread' },
    default: 'ur'
  },
  eQueryType: {
    value: ['s', 'e', 'a'],
    description: { s: 'Site Feedback', e: 'Editorial Feedback', a: 'App Feedback' },
    default: 's'
  },
  eContactQueryType: {
    value: ['g', 't', 'ad', 'ct'],
    description: { g: 'General Issue', t: 'Technical Issue', ad: 'advertise', ct: 'content' },
    default: 'g'
  },
  eCountType: {
    value: ['f'],
    description: { f: 'feedback' }
  }
}

module.exports = enums
