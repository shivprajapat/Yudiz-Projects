/* eslint-disable no-useless-escape */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import { FormattedMessage } from 'react-intl'

// RegEx
export const ONLY_NUMBER = /^[0-9]*$/
export const EMAIL = /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
export const PASSWORD = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/
export const IFSC_CODE = /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/
export const ACCOUNT_NO = /^\d{9,18}$/
export const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
export const NO_SPACE = /^\S*$/
export const CUSTOM_URL = /^[A-Za-z0-9\-]+$/
export const CUSTOM_URL_WITH_SLASH = /^[A-Za-z0-9\-\/]+$/
export const NO_SPECIAL_CHARACTER = /^[A-Za-z0-9 ]+$/
export const NO_NEGATIVE = /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/
export const ONLY_DOT_AND_UNDERSCORE_WITH_NO_SPACE = /^[a-zA-Z0-9._]+$/

export const S3_PREFIX =
  process.env.REACT_APP_S3_PREFIX || 'https://crictracker-admin-panel-local-dev-08032022.s3.ap-south-1.amazonaws.com/'
export const API_URL = process.env.REACT_APP_API_URL || 'https://gateway.crictracker.com/graphql'
export const SUBSCRIPTION_URL = process.env.REACT_APP_SUBSCRIPTION_URL || 'wss://subscription-dev.crictracker.ml/graphql'
export const URL_PREFIX = process.env.REACT_APP_URL_PREFIX || 'https://cricweb-dev.crictracker.ml/'
export const PREVIEW_URL = process.env.REACT_APP_PREVIEW_URL || 'https://cricweb-dev.crictracker.ml/article-preview/'
export const ADMIN_URL = process.env.REACT_APP_ADMIN_URL || 'https://admin-dev.crictracker.ml'
export const APP_ENV = process.env.REACT_APP_ENV || 'development'
export const MATCH_MANAGEMENT_BASE_URL = process.env.MATCH_MANAGEMENT_BASE_URL || 'https://matchmanage.crictracker.com/api'
export const FETCH_PLAYLIST_URL =
  process.env.NODE_ENV === 'development' ? 'https://article-dev.crictracker.ml/api/fetch-playlist' : `${process.env.REACT_APP_PLAYLIST_URL}api/fetch-playlist`

// Encryption key
export const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyLJhj3L0BOqiIEjnYLdB
gAwf4elZ7lJOqzSsllw9SuNsWv12C8GTVmAlKMbw3YKNcF2+a/DSY22UJQ3gSNT7
xWr0rhwHTsltBbyf+Rgd/OmXTxTPFMe8CfcPHk8mq4G/V+kkBINhYXPh1X74v2zK
YcKKJE/H4fZxHnnb7K8REUotOk2+1Vu0Fy+cr5obi9RKC9iMrh/gVugE16uQbi6X
XKHqo/Jri791PWN/h+wBy/EYh3feD/w5/WahuUlW7HbUmvtmEXwFjaTvf3Oj1BGs
dRmYFO2QXh4139MhwE4GBbbeLqagOrplXyrh9AmgOH8nlEYuyJf0gEggQLhdjY9M
o9PS8WQqS/v8pxl1Yd3xAb6jMwjKfVWwsSniEekW+Mgnqss1OkwUTD92a3+QDY9q
c/DmdyXayw/t4po0io6AuN/Q5Twqzof4Gvc0Nh9jwH9Ei9ywTruOADtl2TkiyEu0
0CIpliRSUoaX8NKHCYrCDGh+IX93f1NNgbchSJD8TI2QJl+/64Lw78Mta7KV0yGi
ajrlhia45HeYtfjv7cnSLpR13KHNSzGHFakgPM4REYVUJUm3rZe9CvEQvZCXEByh
aHnZB/YrTAdTGTrI1A7RSCTVjhc5mShrM9iGXcBLULlYU3DVCxfWddzi5QTkeeLD
JY5kgGKVxP5OgSXr/gT7zHUCAwEAAQ==
-----END PUBLIC KEY-----`

export const TOAST_TYPE = {
  Error: 'danger',
  Success: 'success'
}

export const FANTASY_PLATFORM = {
  de: 'fantasy-cricket-tips/dream11-',
  ew: 'fantasy-cricket-tips/11wickets-'
}

export const TAG_STATIC_SLUG = {
  gt: 'tag/',
  p: 'cricket-players/',
  t: 'cricket-teams/'
}

export const RESEND_OTP_S = 30

export const PERMISSION_CATEGORY = {
  content: 'content',
  admin: 'admin',
  analytics: 'analytics'
}
export const SOCIAL_LIST = [
  { label: <FormattedMessage id="twitter" />, value: 't' },
  { label: <FormattedMessage id="facebook" />, value: 'f' },
  { label: <FormattedMessage id="instagram" />, value: 'i' },
  { label: <FormattedMessage id="linkedIn" />, value: 'l' }
]
// export const META_ROBOTS = [
//   <FormattedMessage id="followIndex" />,
//   <FormattedMessage id="followNoIndex" />,
//   <FormattedMessage id="nofollowIndex" />,
//   <FormattedMessage id="noFollowNoIndex" />
// ]
export const META_ROBOTS = ['Follow, Index', 'Follow, No Index', 'Nofollow, Index', 'No follow, No Index']

export const DESIGNATION = [
  { label: <FormattedMessage id="jrStaffWriter" />, value: 'jsw' },
  { label: <FormattedMessage id="srStaffWriter" />, value: 'ssw' },
  { label: <FormattedMessage id="jrCorrespondent" />, value: 'jc' },
  { label: <FormattedMessage id="srCorrespondent" />, value: 'sc' },
  { label: <FormattedMessage id="subEditor" />, value: 'se' },
  { label: <FormattedMessage id="assistantEditor" />, value: 'ae' },
  { label: <FormattedMessage id="editor" />, value: 'e' },
  { label: <FormattedMessage id="srEditor" />, value: 'sre' },
  { label: <FormattedMessage id="consultingEditor" />, value: 'ce' },
  { label: <FormattedMessage id="editorInChief" />, value: 'eic' },
  { label: <FormattedMessage id="freelancerWriter" />, value: 'frw' },
  { label: <FormattedMessage id="freelancerCorrespondent" />, value: 'fc' },
  { label: <FormattedMessage id="jrStatistician" />, value: 'js' },
  { label: <FormattedMessage id="srStatistician" />, value: 'ss' },
  { label: <FormattedMessage id="guestWriter" />, value: 'gw' },
  { label: <FormattedMessage id="columnist" />, value: 'c' },
  { label: <FormattedMessage id="featuredWriter" />, value: 'fw' },
  { label: <FormattedMessage id="author" />, value: 'a' }
]

export const DESIGNATION_IN_JOB = [
  { label: <FormattedMessage id="contentManager" defaultMessage="Content Manager" />, value: 'cm' },
  { label: <FormattedMessage id="contentWriter" defaultMessage="Content Writer" />, value: 'cw' },
  { label: <FormattedMessage id="editor" defaultMessage="Editor" />, value: 'ed' },
  { label: <FormattedMessage id="humanResource" defaultMessage="HR" />, value: 'hr' },
  { label: <FormattedMessage id="seo" defaultMessage="SEO" />, value: 's' },
  { label: <FormattedMessage id="socialMedia" defaultMessage="Social Media" />, value: 'sm' },
  { label: <FormattedMessage id="videoEditor" defaultMessage="Video Editor" />, value: 'vd' }
]
export const OPENING_IN_JOB = [
  { label: <FormattedMessage id="workFromAnyWhere" />, value: 'wfa' },
  { label: <FormattedMessage id="workFromHome" />, value: 'wfh' },
  { label: <FormattedMessage id="workFromOffice" />, value: 'wfo' }
]

export const TEAM_TYPES = [
  { label: <FormattedMessage id="club" />, value: 'club' },
  { label: <FormattedMessage id="country" />, value: 'country' }
]
// export const USER_CUSTOM_FILTER = [
//   <FormattedMessage id="customRole" />,
//   <FormattedMessage id="verifiedUsers" />,
//   <FormattedMessage id="activeUsers" />,
//   <FormattedMessage id="deactivateUsers" />
// ]
export const USER_CUSTOM_FILTER = ['custom Role', 'verified Users', 'active Users', 'deactivate Users']

export const FRONT_USER_FILTER = [
  { label: <FormattedMessage id="activateUsers" />, value: 'a' },
  { label: <FormattedMessage id="deActiveUsers" />, value: 'i' }
]

export const COMMENT_STATUS = [
  { sType: <FormattedMessage id="all" />, _id: 'all' },
  { sType: <FormattedMessage id="pending" />, _id: 'p' },
  { sType: <FormattedMessage id="reject" />, _id: 'r' },
  { sType: <FormattedMessage id="spam" />, _id: 'sp' },
  { sType: <FormattedMessage id="trash" />, _id: 't' },
  { sType: <FormattedMessage id="approved" />, _id: 'a' }
]

export const E_TYPE = [
  { label: <FormattedMessage id="general" />, value: 'gt' },
  { label: <FormattedMessage id="player" />, value: 'p' },
  { label: <FormattedMessage id="team" />, value: 't' },
  { label: <FormattedMessage id="venue" />, value: 'v' }
]

export const REJECT_REASON = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
  { label: 'Custom', value: 'custom' }
]

export const ARTICLE_VISIBILITY = [
  { label: <FormattedMessage id="public" />, value: 'pb' },
  { label: <FormattedMessage id="private" />, value: 'pr' }
]

export const PLATFORM_TYPE = [
  { label: <FormattedMessage id="dream11" />, value: 'de' },
  { label: <FormattedMessage id="11wickets" />, value: 'ew' }
]

export const E_CVC = [
  { label: <FormattedMessage id="captain" />, value: 'c' },
  { label: <FormattedMessage id="viceCaptain" />, value: 'v' }
]

export const FANTASY_LEAGUE_TYPE = [
  { label: <FormattedMessage id="headToHead" />, value: 'hth' },
  { label: <FormattedMessage id="grandLeague" />, value: 'gl' },
  { label: <FormattedMessage id="megaLeague" />, value: 'ml' },
  { label: <FormattedMessage id="cricTrackerSpecial" />, value: 'cs' }
]

export const ROLES = [
  { label: <FormattedMessage id="batter" />, value: 'bat' },
  { label: <FormattedMessage id="bowler" />, value: 'bowl' },
  { label: <FormattedMessage id="allRounder" />, value: 'all' },
  { label: <FormattedMessage id="wicketKeeper" />, value: 'wk' },
  { label: <FormattedMessage id="wicketBatter" />, value: 'wkbat' }
]

export const SEO_REDIRECTS_TYPE_BY_CODE = [
  { label: <FormattedMessage id="movedPermanently" />, value: 308 },
  // { label: <FormattedMessage id="found" />, value: 302 },
  { label: <FormattedMessage id="temporaryRedirect" />, value: 307 },
  { label: <FormattedMessage id="contentDeleted" />, value: 410 },
  { label: <FormattedMessage id="unAvailableForLegalReasons" />, value: 451 }
]
export const PLAYER_CREDITS = [
  { label: 5, value: 5 },
  { label: 5.5, value: 5.5 },
  { label: 6, value: 6 },
  { label: 6.5, value: 6.5 },
  { label: 7, value: 7 },
  { label: 7.5, value: 7.5 },
  { label: 8, value: 8 },
  { label: 8.5, value: 8.5 },
  { label: 9, value: 9 },
  { label: 9.5, value: 9.5 },
  { label: 10, value: 10 },
  { label: 10.5, value: 10.5 },
  { label: 11, value: 11 },
  { label: 11.5, value: 11.5 },
  { label: 12, value: 12 }
]

export const TAG_MIGRATION_TYPES = [
  { label: <FormattedMessage id="simple" />, value: 'simple' },
  { label: <FormattedMessage id="player" />, value: 'player' },
  { label: <FormattedMessage id="team" />, value: 'team' },
  { label: <FormattedMessage id="venue" />, value: 'venue' }
]

export const PRIORITY = [
  { label: '01', value: 1 },
  { label: '02', value: 2 },
  { label: '03', value: 3 },
  { label: '04', value: 4 },
  { label: '05', value: 5 }
]

export const FANTASY_TIPS_TYPES = [
  { label: <FormattedMessage id="odi" />, value: 'odi' },
  { label: <FormattedMessage id="test" />, value: 'test' },
  { label: <FormattedMessage id="t20i" />, value: 't20i' },
  { label: <FormattedMessage id="lista" />, value: 'lista' },
  { label: <FormattedMessage id="firstclass" />, value: 'firstclass' },
  { label: <FormattedMessage id="t20" />, value: 't20' },
  { label: <FormattedMessage id="womenodi" />, value: 'womenodi' },
  { label: <FormattedMessage id="woment20" />, value: 'woment20' },
  { label: <FormattedMessage id="youthodi" />, value: 'youthodi' },
  { label: <FormattedMessage id="youtht20" />, value: 'youtht20' },
  { label: <FormattedMessage id="others" />, value: 'others' },
  { label: <FormattedMessage id="t10" />, value: 't10' }
]

export const CONTENT_ROLES = [
  { label: <FormattedMessage id="article" />, value: 'article' },
  { label: <FormattedMessage id="categoryRole" />, value: 'category' },
  { label: <FormattedMessage id="tag" />, value: 'tag' },
  { label: <FormattedMessage id="comment" />, value: 'comment' },
  { label: <FormattedMessage id="contact" />, value: 'contact' },
  { label: <FormattedMessage id="feedback" />, value: 'feedback' },
  { label: <FormattedMessage id="slug" />, value: 'slug' },
  { label: <FormattedMessage id="fantasyArticle" />, value: 'fantasyArticle' },
  { label: <FormattedMessage id="playlist" />, value: 'playlist' },
  { label: <FormattedMessage id="series" />, value: 'series' },
  { label: <FormattedMessage id="cms" />, value: 'cms' },
  { label: <FormattedMessage id="job" />, value: 'job' },
  { label: <FormattedMessage id="player" />, value: 'player' },
  { label: <FormattedMessage id="tags" />, value: 'tags' }
]

export const ADMIN_ROLES = [
  { label: <FormattedMessage id="role" />, value: 'role' },
  { label: <FormattedMessage id="admin" />, value: 'admin' },
  { label: <FormattedMessage id="user" />, value: 'user' }
]

export const ANALYTICS_ROLES = [
  { label: <FormattedMessage id="seoRedirect" />, value: 'seoRedirect' },
  { label: <FormattedMessage id="seo" />, value: 'seo' }
]
