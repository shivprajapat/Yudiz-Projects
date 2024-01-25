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

// export const URL_PREFIX = process.env.REACT_APP_URL_PREFIX || 'https://feed-dev.crictracker.ml'
export const URL_PREFIX = process.env.REACT_APP_URL_PREFIX || 'https://feed-api.crictracker.ml/'
export const APP_ENV = process.env.REACT_APP_ENV || 'development'

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

export const SUBSCRIPTION_TYPES = [
  { label: <FormattedMessage id='api' />, value: 'api' },
  { label: <FormattedMessage id='article' />, value: 'article' },
  { label: <FormattedMessage id='exclusive' />, value: 'exclusive' },
  { label: <FormattedMessage id='category' />, value: 'category' }
]
