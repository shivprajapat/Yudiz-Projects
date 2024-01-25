/* eslint-disable no-useless-escape */
// RegEx
export const ONLY_NUMBER = /^[0-9]*$/
export const EMAIL =
  /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/
export const PASSWORD = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/
export const NO_SPACE = /^\S*$/
export const NO_SPECIAL_CHARACTER = /^[A-Za-z0-9 ]+$/
export const NUMBER1TO10 = /^[1-9][0-9]?$|^100$/
export const URL_REGEX =
/(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/
export const CHECK_AMP = /^.*(\?|\&)amp(|\=)(|\&.*)$/

export const S3_PREFIX = process.env.REACT_APP_S3_PREFIX || 'https://media.crictracker.com/'
export const GRAPHQL_URL = process.env.REACT_APP_API_URL || 'https://gateway.crictracker.com/graphql'
export const GRAPHQL_INTERNAL_URL = process.env.REACT_APP_INTERNAL_API_URL || GRAPHQL_URL
export const SUBSCRIPTION_URL = process.env.REACT_APP_SUBSCRIPTION_URL || 'wss://subscription-dev.crictracker.ml/graphql'
export const DOMAIN = process.env.REACT_APP_DOMAIN || 'http://localhost:3000/'
export const REACT_APP_ENV = process.env.REACT_APP_ENV || 'development'

export const SITE_NAME = 'CricTracker'
export const PUBLIC_GA_TRACKING_ID = 'UA-49665093-1'
// export const PUBLIC_GA_TRACKING_ID = 'G-JRXYQDGSVZ'
export const PUBLIC_GTM_ID = 'GTM-592XL34'
export const queryParamOtp = '?=otp'
export const ONLY_SPACE = /.*\S.*/

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

export const DESIGNATION = [
  { label: 'Jr. Staff Writer', value: 'jsw' },
  { label: 'Sr. Staff Writer', value: 'ssw' },
  { label: 'Jr. Correspondent', value: 'jc' },
  { label: 'Sr. Correspondent', value: 'sc' },
  { label: 'Sub-Editor', value: 'se' },
  { label: 'Assistant Editor', value: 'ae' },
  { label: 'Editor', value: 'e' },
  { label: 'Sr. Editor', value: 'sre' },
  { label: 'Consulting Editor', value: 'ce' },
  { label: 'Editor-in-Chief', value: 'eic' },
  { label: 'Freelancer Writer', value: 'frw' },
  { label: 'Freelancer Correspondent', value: 'fc' },
  { label: 'Jr. Statistician', value: 'js' },
  { label: 'Sr. Statistician', value: 'ss' },
  { label: 'Guest Writer', value: 'gw' },
  { label: 'Columnist', value: 'c' },
  { label: 'Featured Writer', value: 'fw' },
  { label: 'Author', value: 'a' }
]

export const DESIGNATION_IN_JOB = [
  { label: 'Content Manager', value: 'cm' },
  { label: 'Content Writer', value: 'cw' },
  { label: 'Editor', value: 'ed' },
  { label: 'HR', value: 'hr' },
  { label: 'SEO', value: 's' },
  { label: 'Social Media', value: 'sm' },
  { label: 'Video Editor', value: 'vd' }
]

export const OPENING_IN_JOB = [
  { label: 'Work From Anywhere', value: 'wfa' },
  { label: 'Work From Home', value: 'wfh' },
  { label: 'Work From Office', value: 'wfo' }
]

export const DEFAULT_BLOG_READ = '2'
export const GOOGLE_NEWS_LINK = 'https://bit.ly/3gshIcO'
export const TELEGRAM_NEWS_LINK = 'https://ttttt.me/crictracker'
export const TELEGRAM_URL = 'https://bit.ly/3n0jQL6'
export const FACEBOOK_URL = 'https://www.facebook.com/crictracker/'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/crictracker/ '
export const INSTAGRAM_URL = 'https://www.instagram.com/crictracker/'
export const TWITTER_URL = 'https://twitter.com/Cricketracker'
export const YOUTUBE_URL = 'https://www.youtube.com/c/Crictracker'
export const BLUR_DATA_URL = '/images/blur-image.jpg'
export const SPORTSINFO_URL = 'https://www.sports.info/'
export const CRICTRACKER_HINDI_URL = 'https://hindi.crictracker.com/'
export const CRICTRACKER_BENGALI_URL = 'https://bengali.crictracker.com/'

export const SUJJAD_FB_ACCOUNT = 'https://www.facebook.com/ImSujjad'
export const SUJJAD_TWITTER_ACCOUNT = 'https://twitter.com/ImSujjad'
export const SUJJAD_INSTA_ACCOUNT = 'https://www.instagram.com/imsujjad/'
export const SUJJAD_LINKDIN_ACCOUNT = 'https://www.linkedin.com/in/imsujjad/'

export const SAI_FB_ACCOUNT = 'https://www.facebook.com/ImSaiKishore'
export const SAI_TWITTER_ACCOUNT = 'https://twitter.com/DivingSlip'
export const SAI_LINKDIN_ACCOUNT = 'https://www.linkedin.com/in/sai-kishore-18609b51/'

export const WIDGET = {
  cricSpecial: 'cricSpecial',
  ranking: 'ranking',
  trendingNews: 'trendingNews',
  currentSeries: 'currentSeries',
  topTeams: 'topTeams'
}
