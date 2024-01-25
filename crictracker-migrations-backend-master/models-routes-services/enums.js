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
    description: { fp: 'Forgot Password' }
  },
  eSeoType: {
    value: ['ar', 'ad', 'ct', 'gt', 'fa', 'mo', 'p', 't', 'v', 'cu', 'ma', 'cms', 'vi', 'pl', 'se', 'ca', 'st'],
    description: { ar: 'article', ad: 'admin', ct: 'categories', gt: 'general tags', fa: 'fantasy article', mo: 'match overview', p: 'player', t: 'team', v: 'venue', cu: 'custom seo', ma: 'Match', cms: 'CMS Page', vi: 'video', pl: 'playlist', se: 'series', jo: 'job', st: 'static pages' }
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
  eProvider: {
    value: ['es'],
    description: { es: 'entity sports' },
    default: 'es'
  },
  ePlatformType: {
    value: ['de', 'ew'], // de - Dream Eleven , ew- Eleven Wickets
    description: { de: 'Dream Eleven(11)', ew: 'Eleven(11) Wickets' }
  },
  eBattingPosition: {
    value: ['s', 'ns'], // s - striker , ns - non striker
    description: { s: 'striker', ns: 'non striker' }
  },
  eDismissal: {
    value: ['caught', 'bowled', 'lbw', 'runout', 'hitwicket']
  },
  eBowlingPosition: {
    value: ['ab', 'lb'], // ab - 'active bowler', lb - 'last bowler'
    description: { ab: 'active bowler', lb: 'last bowler' }
  },
  eDecision: {
    value: ['fielding', 'batting'],
    description: { fielding: 'fielding decision', batting: 'Batting decision' }
  },
  eStatisticsTypes: {
    value: ['Bwl', 'Bat', 'Team'],
    description: { Bwl: 'Bowling', Bat: 'Batting', Team: 'Team' },
    default: 'Team'
  },
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
  },
  eFantasyLeagueType: {
    value: ['hth', 'gl', 'mg', 'cs'],
    description: { hth: 'head to head', gl: 'grand league', mg: 'mega league', cs: 'cricTracker special' }
  },
  eMatchFormat: {
    value: ['odi', 'test', 't20i', 'lista', 'firstclass', 't20', 'womenodi', 'woment20', 'youthodi', 'youtht20', 'others', 't10'],
    description: { odi: 'ODI', test: 'Test', t20i: 'T20I', lista: 'List A', firstclass: 'First Class', t20: 'T20', womenodi: 'Women ODI', woment20: 'Women T20', youthodi: 'Youth ODI', others: 'Others', t10: 'T10' }
  },
  // standings type come from EntitySports and it can't be changeable...
  eStandingsType: {
    value: ['completed', 'per_round'],
    description: { completed: 'completed', per_round: 'per round' },
    default: 'per_round'
  },
  eTagType: {
    value: ['p', 't', 's', 'l', 'o', 'v', 'gt'],
    description: { p: 'player', t: 'team', s: 'series', l: 'league', v: 'venue', gt: 'general' }
  },
  eTagStatus: {
    value: ['r', 'a', 'i', 'd'],
    description: { r: 'requested', a: 'active', i: 'inactive', d: 'deleted' },
    default: 'r'
  },
  ePlayerTagStatus: {
    value: ['r', 'a', 'p'],
    description: { r: 'reject', a: 'approved', d: 'pending' },
    default: 'p'
  },
  eCVC: {
    value: ['c', 'v'],
    description: { c: 'captain', v: 'vice captain' }
  },
  eMigrationType: {
    value: ['player', 'team', 'simple', 'venue'],
    description: { player: 'player', team: 'team', simple: 'simple', venue: 'venue' },
    default: 'simple'
  },
  eListTagStatus: {
    value: ['r', 'a', 'p'],
    description: { r: 'reject', a: 'approved', d: 'pending' },
    default: 'p'
  },
  eCountType: {
    value: ['p', 't', 'fa'],
    description: { p: 'player', t: 'team', fa: 'fantasy article' }
  },
  ePermissionsKeys: {
    value: [
      'DELETE_ROLE',
      'ADD_SUBADMIN',
      'EDIT_ROLE',
      'EDIT_ARTICLE',
      'CREATE_ROLE',
      'CREATE_ARTICLE',
      'LIST_SUBADMIN',
      'EDIT_ACTIVE_TAG',
      'CREATE_TAG',
      'EDIT_CATEGORY',
      'LIST_ACTIVE_TAG',
      'CREATE_CATEGORY',
      'LIST_CATEGORY',
      'DELETE_CATEGORY',
      'VIEW_SUBADMIN',
      'LIST_REQUESTS_TAG',
      'LIST_ARTICLE',
      'PICK_ARTICLE',
      'PUBLISH_DATE_CHANGE_ARTICLE',
      'DISPLAY_AUTHOR_CHANGE_ARTICLE',
      'LIST_COMMENT',
      'LIST_ROLE',
      'CHANGE_STATUS_SUBADMIN',
      'DELETE_SUBADMIN',
      'EDIT_SUBADMIN',
      'VERIFY_SUBADMIN',
      'CHANGE_STATUS_CATEGORY',
      'DELETE_ACTIVE_TAG',
      'EDIT_TAG',
      'DELETE_REQUESTS_TAG',
      'APPROVE_REJECT_REQUESTS_TAG',
      'DELETE_REQUESTED_TAG',
      'CHANGE_STATUS_ACTIVE_TAG',
      'PUBLISH_ARTICLE',
      'LIST_PLAYLIST',
      'UPDATE_PLAYLIST',
      'FETCH_PLAYLIST',
      'DELETE_SEO',
      'UPDATE_SEO_STATUS',
      'ADD_SEO',
      'EDIT_SEO',
      'VIEW_SEO',
      'LIST_SEO',
      'DELETE_SEO_REDIRECT',
      'UPDATE_SEO_REDIRECT_STATUS',
      'ADD_SEO_REDIRECT',
      'EDIT_SEO_REDIRECT',
      'VIEW_SEO_REDIRECT',
      'LIST_SEO_REDIRECT',
      'CREATE_JOB',
      'EDIT_JOB',
      'GET_JOB',
      'LIST_JOB',
      'DELETE_JOB',
      'EDIT_ENQUIRY',
      'GET_ENQUIRY',
      'LIST_ENQUIRY',
      'DELETE_ENQUIRY'
    ]
  },
  eCategoryMigrationType: {
    value: ['s', 'as', 'p'],
    description: { s: 'simple', as: 'api series', p: 'parent' },
    default: 's'
  },
  eSeoRedirectType: {
    value: [308, 307, 410, 451],
    description: { 308: 'Moved permanently', 307: 'Temporary redirect', 410: 'Content Deleted', 451: 'Unavailable for Legal Reasons' }
  }

}

module.exports = enums
