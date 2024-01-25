const enums = {
  eStatus: {
    value: ['a', 'i', 'd'],
    description: { a: 'active', i: 'inactive', d: 'deleted' },
    default: 'a'
  },
  eDesignation: {
    value: ['jsw', 'ssw', 'jc', 'sc', 'se', 'ae', 'e', 'sre', 'ce', 'eic', 'frw', 'fc', 'js', 'ss', 'gw', 'c', 'fw', 'a'],
    description: { jsw: 'Jr.Staff Writer', ssw: 'Sr.Staff Writer', jc: 'Jr.Correspondent', sc: 'Sr.Correspondent', se: 'Sub Editor', ae: 'Assistant Editor', e: 'Editor', sre: 'Sr.Editor', ce: 'Consulting Editor', eic: 'Editor In Chief', frw: 'Freelance Writer', fc: 'Freelance Correspondent', js: 'Jr.Statistician', ss: 'Sr.Statistician', gw: 'Guest Writer', c: 'Columnist', fw: 'Featured Writer', a: 'Author' },
    default: 'a'
  },
  eUserType: {
    value: ['su', 'sb', 'writer', 'reviewer'],
    description: { su: 'superAdmin', sb: 'subAdmin' },
    default: 'sb'
  },
  eOtpVerificationType: {
    value: ['e', 'm'],
    description: { e: 'email', m: 'mobile' },
    default: 'email'
  },
  eOtpVerificationAuthType: {
    value: ['f'],
    description: { f: 'Forgot Password' }
  },
  eSeoType: {
    value: ['ar', 'ad', 'ct', 'gt', 'fa', 'mo', 'p', 't', 'v', 'cu', 'ma', 'cms', 'vi', 'pl', 'se', 'ca', 'st', 'jo'],
    description: { ar: 'article', ad: 'admin', ct: 'categories', gt: 'general tags', fa: 'fantasy article', mo: 'match overview', p: 'player', t: 'team', v: 'venue', cu: 'custom seo', ma: 'Match', cms: 'CMS Page', vi: 'video', pl: 'playlist', se: 'series', jo: 'job', st: 'static pages' }
  },
  eSeoSubType: {
    value: [
      null,
      'n',
      'v',
      'f',
      's',
      'st',
      't',
      'sq',
      'ar',
      'ft',
      'sc',
      'o',
      'far',
      'r',
      'c',
      'u',
      'p',
      'stBhsi',
      'stBha',
      'stBhs',
      'stBmc',
      'stBmr6i',
      'stBm4',
      'stBmr4i',
      'stBmr',
      'stBmri',
      'stBmr50',
      'stBms',
      'stBtwt',
      'stBberi',
      'stBba',
      'stBber',
      'stBbsr',
      'stBbsri',
      'stBfiw',
      'stBbbf',
      'stBmrci',
      'stBfow',
      'stBm',
      'stTtr',
      'stTtr100',
      'stTtw',
      'stBmf'
    ],
    description: {
      n: 'news',
      v: 'videos',
      f: 'fixtures',
      s: 'standings',
      st: 'stats',
      t: 'teams',
      sq: 'squads',
      ar: 'archives',
      ft: 'fantasy tips',
      sc: 'score card',
      o: 'overs',
      far: 'fixtures-and-results',
      r: 'results',
      c: 'commentary',
      u: 'upcoming',
      p: 'photos',
      stBhsi: 'batting-highest-strikerate-innings',
      stBha: 'batting-highest-average',
      stBhs: 'batting-highest-strikerate',
      stBmc: 'batting-most-centuries',
      stBmr6i: 'batting-most-run6-innings',
      stBm4: 'batting-most-fours',
      stBmr4i: 'batting-most-run4-innings',
      stBmr: 'batting-most-runs',
      stBmri: 'batting-most-runs-innings',
      stBmr50: 'batting-most-run50',
      stBms: 'batting-most-sixes',
      stBtwt: 'bowling-top-wicket-takers',
      stBberi: 'bowling-best-economy-rates-innings',
      stBba: 'bowling-best-averages',
      stBber: 'bowling-best-economy-rates',
      stBbsr: 'bowling-best-strike-rates',
      stBbsri: 'bowling-best-strike-rates-innings',
      stBfiw: 'bowling-five-wickets',
      stBbbf: 'bowling-best-bowling-figures',
      stBmrci: 'bowling-most-runs-conceded-innings',
      stBfow: 'bowling-four-wickets',
      stBm: 'bowling-maidens',
      stTtr: 'team-total-runs',
      stTtr100: 'team-total-run100',
      stTtw: 'team-total-wickets',
      stBmf: 'batting-most-fifties'
    }
  },
  eSocialLinkType: {
    value: ['i', 'f', 't', 'l'],
    description: { i: 'instagram', f: 'facebook', t: 'twitter', l: 'linkedin' }
  },
  eUserTokenType: {
    value: ['a', 'u'],
    description: { u: 'user', a: 'admin' }
  },
  ePermissionType: {
    value: ['content', 'admin', 'analytics']
  },
  eGender: {
    value: ['m', 'f', 'o'],
    description: { m: 'male', f: 'female', o: 'other' }
  },
  eTagType: {
    value: ['p', 't', 's', 'l', 'o', 'v', 'g'],
    description: { p: 'player', t: 'team', s: 'series', l: 'league', v: 'venue', g: 'general' }
  },
  eTagStatus: {
    value: ['r', 'a', 'i', 'd'],
    description: { r: 'requested', a: 'active', i: 'inactive', d: 'deleted' },
    default: 'r'
  },
  eCategoryType: {
    value: ['SIMPLE', 'API_SERIES', 'TOURNAMENT'],
    description: { SIMPLE: 'Simple Category', API_SERIES: 'API Series Category', TOURNAMENT: 'Tournament Category' }
  },
  eState: {
    value: ['d', 'p', 'r', 'cr', 'cs', 'pub', 't'],
    description: { d: 'draft', p: 'pending', r: 'rejected', cr: 'changesRemaining', cs: 'changesSubmitted', pub: 'published', t: 'trash' },
    default: 'd'
  },
  eArticleType: {
    value: ['i', 'v'],
    description: { i: 'Image', v: 'Video' },
    default: 'i'
  },
  eSeoRedirectType: {
    value: [308, 307, 410, 451],
    description: { 308: 'Moved permanently', 307: 'Temporary redirect', 410: 'Content Deleted', 451: 'Unavailable for Legal Reasons' }
  }
}

module.exports = enums
