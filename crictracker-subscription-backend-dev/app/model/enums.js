
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
    value: ['ar', 'ad', 'ct', 'tg', 'nar', 'mo', 'p'],
    description: { ar: 'article', ad: 'admin', ct: 'categories', tg: 'tags', nar: 'news article', mo: 'match overview', p: 'player' }
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
    value: ['odi', 'test', 't20i', 'lista', 'firstclass', 't20', 'womenodi', 'woment20', 'youthodi', 'youtht20', 'others', 't10']
  },
  // standings type come from EntitySports and it can't be changeable...
  eStandingsType: {
    value: ['completed', 'perround'],
    description: { completed: 'completed', perround: 'per round' },
    default: 'perround'
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
  eListTagStatus: {
    value: ['r', 'a', 'p'],
    description: { r: 'reject', a: 'approved', d: 'pending' },
    default: 'p'
  },
  eCVC: {
    value: ['c', 'v'],
    description: { c: 'captain', v: 'vice captain' }
  },
  ePlayingRole: {
    value: ['bat', 'bowl', 'all', 'wk', 'wkbat'],
    description: { bat: 'batter', bowl: 'bowler', all: 'all rounder', wk: 'wicket keeper', wkbat: 'wicket batter' }
  },
  eCountry: {
    value: ['en', 'au', 'za', 'wi', 'nz', 'in', 'pk', 'lk', 'zw', 'bd', 'ie', 'af'],
    description: { en: 'England', au: 'Australia', za: 'South Africa', wi: 'West Indies', nz: 'New Zealand', in: 'India', pk: 'Pakistan', lk: 'Sri Lanka', zw: 'Zimbabwe', bd: 'Bangladesh', ie: 'ireland', af: 'Afghanistan' }
  },
  eTopPlayerType: {
    value: ['hrs', 'hwt', 'hs', 'bbf'],
    description: { hrs: 'Highest Run Scorer', hwt: 'Highest Wicket Taker', hs: 'Highest Score', bbf: 'Best Bowling Figures' }
  }

}

module.exports = enums
