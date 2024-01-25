const enums = {
  eStatus: {
    value: ['d', 'r', 'ur', 'ap', 'rj'],
    description: { d: 'deleted', r: 'read', ur: 'unread', ap: 'approved', rj: 'rejected' },
    default: 'ur'
  },
  eDesignation: {
    value: ['cm', 'cw', 'ed', 'hr', 's', 'sm', 'vd', 'gr', 'sl', 'dm', 'bd', 'bm', 'gh', 'rm', 'an', 'coo', 'sw'],
    description: { cm: 'Content Manager', i: 'Content Writer', ed: 'Editor', hr: 'Human Resource', s: 'SEO', sm: 'Social Media', vd: 'Video Editor', gr: 'Graphics', sl: 'Sales', dm: 'Digital Marketing', bd: 'Business Development', bm: 'Brands Manager', gh: 'Growth Hack', rm: 'Revenue Manager', an: 'Animator', coo: 'Chief Operating Officer', sw: 'Staff Writer' }
  },
  eOpeningFor: {
    value: ['wfh', 'wfo', 'wfa'],
    description: { wfh: 'Work from home', wfo: 'Work from office', wfa: 'Anywhere (office/home)' },
    default: 'wfo'
  },
  eCountType: {
    value: ['jp'],
    description: { j: 'job post' }
  }

}

module.exports = enums
