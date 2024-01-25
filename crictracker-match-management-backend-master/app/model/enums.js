
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
    value: ['caught', 'bowled', 'lbw', 'runout', 'hitwicket', 'stumped']
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
  eStatisticsTypesFullName: {
    value: ['Bowling Stats', 'Batting Stats', 'Team Stats'],
    default: 'Team Stats'
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
    value: ['hth', 'gl', 'ml', 'cs'],
    description: { hth: 'Head To Head', gl: 'Grand League', ml: 'Mega League', cs: 'CricTracker Special' }
  },
  eMatchFormat: {
    value: ['odi', 'test', 't20i', 'lista', 'firstclass', 't20', 'womenodi', 'woment20', 'youthodi', 'youtht20', 'others', 't10'],
    description: { odi: 'ODI', test: 'Test', t20i: 'T20I', lista: 'List A', firstclass: 'First Class', t20: 'T20', womenodi: 'Women ODI', woment20: 'Women T20', youthodi: 'Youth ODI', others: 'Others', t10: 'T10' }
  },
  // standings type come from EntitySports and it can't be changeable...
  eStandingsType: {
    value: ['complete', 'perround'],
    description: { complete: 'complete', perround: 'per round' },
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
    value: ['en', 'au', 'za', 'wi', 'nz', 'in', 'pk', 'lk', 'zw', 'bd', 'ie', 'af', 'rs', 'cnt', 'ae', 'sct', 'es', 'int'],
    description: { en: 'England', au: 'Australia', za: 'South Africa', wi: 'West Indies', nz: 'New Zealand', in: 'India', pk: 'Pakistan', lk: 'Sri Lanka', zw: 'Zimbabwe', bd: 'Bangladesh', ie: 'ireland', af: 'Afghanistan', rs: 'Serbia', cnt: 'France', ae: 'United Arab Emirates', sct: 'Scotland', es: 'Pakistan', int: 'International' }
  },
  eTopPlayerType: {
    value: ['hrs', 'hwt', 'hs', 'bbf'],
    description: { hrs: 'Highest Run Scorer', hwt: 'Highest Wicket Taker', hs: 'Highest Score', bbf: 'Best Bowling Figures' }
  },
  eTopPlayersType: {
    value: ['batting_most_runs', 'bowling_top_wicket_takers', 'batting_most_runs_innings', 'bowling_best_bowling_figures']
  },
  eTeamTypeEnum: {
    value: ['club', 'country'],
    description: { club: 'club team', country: 'country team' }
  },
  eCommentaryEvent: {
    value: ['b', 'oe', 'w', 'c', 'to', 'p11'],
    description: { b: 'Ball', oe: 'Over End', w: 'Wicket', c: 'custom', to: 'Toss Information', p11: 'Playing 11' },
    default: 'b'
  },
  eInternationalFormat: {
    value: ['odi', 'test', 't20i', 'womenodi', 'woment20'],
    description: { odi: 'One Day International', test: 'TEST', t20i: 'Twenty20 International', womenodi: 'Women ODI', woment20: 'Women T20' }
  },
  eCountType: {
    value: ['p', 't', 'fa'],
    description: { p: 'player', t: 'team', fa: 'fantasy article' }
  },
  eUpdateStatsType: {
    value: ['cancelled', 'completed'],
    description: { cancelled: 'Abandoned, canceled, no result', completed: 'match completed' }
  },
  eCommentStatus: {
    value: ['p', 'a', 'r', 'sp', 't', 'd', 'all'],
    description: { p: 'pending', a: 'approved', r: 'rejected', sp: 'spam', t: 'trash', d: 'delete', all: 'all comments(only for frontend)' },
    default: 'p'
  },
  eReportReasonType: {
    value: ['comment'],
    description: { comment: 'Reasons for comment report' },
    default: 'comment'
  },
  eLikeStatus: {
    value: ['like', 'dislike'],
    description: { like: 'Like Comment', dislike: 'Dislike Comment' }
  },
  eSeriesCategoryStatusEnum: {
    value: ['p', 'a'],
    description: { p: 'pending', a: 'active' },
    default: 'p'
  },
  eSubType: {
    value: [
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
  }
}

module.exports = enums
