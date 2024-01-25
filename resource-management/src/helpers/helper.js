import { Crypt } from 'hybrid-crypto-js'
import AltAvatar from 'Assets/Icons/altImage.svg'
import { queryClient } from 'App'

// Function for Verify Length
export function verifyLength(value, length) {
  if (value.length >= length) {
    return true
  }
  return false
}

export function checkConfirmPassword(password, newPassword) {
  if (newPassword === password && newPassword.trim().length > 0 && password.trim().length > 0) {
    return true
  }
  return false
}

export function formatDate(date) {
  const d = new Date(date).toString().split(' ')
  return date ? [d[2], months[d[1]], d[3]].join('/') : '--'
}

export const months = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
}

export function checkLength(data = '') {
  if (data?.trim()?.length !== 0) return false
  return true
}

export function removeSpaces(data) {
  return data?.trim()
}

export function removeAllSpaces(data) {
  return new Promise((resolve) => {
    Object.keys(data).forEach((k) => {
      data[k] = removeSpaces(data[k])
    })
    resolve(data)
  })
  // Object.keys(data).forEach((k) => {
  //   data[k] = removeSpaces(data[k])
  // })
}

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzftQUP2TnEYhQDNXbPTO
ycxgROnuIPL8ZnGuinn+ibSdLrMlfe07brSCpfMS508fpaySYGfKGRB4Y/NU+2Ac
xwbbwLvgO8qf/+X1sSjElCRQkch/qPmbVRKuqlTejoB7Fvt7rDlVsDmoE6C9My31
ou+gQyisCQvi99+iyE3mDEESu5qv7YnuEIS3KqE6LJ/c2tHX+8fXVy7LFNv7RCvw
EctCMC6Enm426wnc6QHi0HDrprmkWM0ecS4Ls30F8yjO327/NMnDD/7ZY/4kT1Fl
1cpmLnmHP7WmJ3uDkbFlcyjoSv8Qc5Xwua7PWj8KXHNJZ65uMTslNs9mb+nbg/cF
gQIDAQAB
-----END PUBLIC KEY-----`

export function encryption(sPassword) {
  const crypt = new Crypt()
  const encrypted = crypt.encrypt(publicKey, sPassword)
  return encrypted.toString()
}

export const addQueryParams = (value) => {
  const data = { ...value }
  Object.keys(data).forEach((e) => (data[e] === '' || typeof data[e] === 'object' || !data[e]?.toString().length) && delete data[e])
  return new URLSearchParams(data)?.toString()
}

export function checkObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id)
}

export function removeToken() {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

export function addToken(token, remember) {
  if (remember) {
    localStorage.setItem('token', token)
  } else {
    sessionStorage.setItem('token', token)
  }
}

export const appendParams = (value) => {
  const data = { ...value }
  data.search = encodeURIComponent(data?.search || '')
  Object.keys(data).filter((e) => (data[e] === '' || typeof data[e] === 'object' || !data[e].toString().length) && delete data[e])

  window.history.replaceState({}, null, `${location.pathname}?${new URLSearchParams(data).toString()}`)
}

export const parseParams = (params = '') => {
  const urlParams = new URLSearchParams(decodeURIComponent(params))
  const rawParams = decodeURIComponent(params).replace('?', '').split('&')
  const array = ['search']
  const extractedParams = {}
  if (rawParams[0]) {
    rawParams.forEach((item) => {
      item = item.split('=')
      extractedParams[item[0]] = array.includes(item[0])
        ? urlParams.get(item[0])
          ? urlParams.get(item[0]).split(',')
          : []
        : Number(item[1]) || item[1]
    })
    return extractedParams
  } else {
    return extractedParams
  }
}

export function handleAlterImage(e, src) {
  e.target.onerror = null
  e.target.src = src || AltAvatar
}

export function getSortedColumns(TableColumns, urlData) {
  return TableColumns?.map((column) =>
    column.connectionName === urlData?.sort
      ? { ...column, sort: urlData?.order === 'asc' ? 1 : urlData?.order === 'desc' ? -1 : 0 }
      : column
  )
}

export async function blobImage(url) {
  const data = await fetch(url)
  const blob = await data.blob()

  const nUrl = URL.createObjectURL(blob)
  return nUrl
}

export const countries = {
  Afghanistan: 'af',
  'land Islands': 'ax',
  Albania: 'al',
  Algeria: 'dz',
  'American Samoa': 'as',
  AndorrA: 'ad',
  Angola: 'ao',
  Anguilla: 'ai',
  Antarctica: 'aq',
  'Antigua and Barbuda': 'ag',
  Argentina: 'ar',
  Armenia: 'am',
  Aruba: 'aw',
  Australia: 'au',
  Austria: 'at',
  Azerbaijan: 'az',
  Bahamas: 'bs',
  Bahrain: 'bh',
  Bangladesh: 'bd',
  Barbados: 'bb',
  Belarus: 'by',
  Belgium: 'be',
  Belize: 'bz',
  Benin: 'bj',
  Bermuda: 'bm',
  Bhutan: 'bt',
  Bolivia: 'bo',
  'Bosnia and Herzegovina': 'ba',
  Botswana: 'bw',
  'Bouvet Island': 'bv',
  Brazil: 'br',
  'British Indian Ocean Territory': 'io',
  'Brunei Darussalam': 'bn',
  Bulgaria: 'bg',
  'Burkina Faso': 'bf',
  Burundi: 'bi',
  Cambodia: 'kh',
  Cameroon: 'cm',
  Canada: 'ca',
  'Cape Verde': 'cv',
  'Cayman Islands': 'ky',
  'Central African Republic': 'cf',
  Chad: 'td',
  Chile: 'cl',
  China: 'cn',
  'Christmas Island': 'cx',
  'Cocos (Keeling) Islands': 'cc',
  Colombia: 'co',
  Comoros: 'km',
  Congo: 'cg',
  'Congo, The Democratic Republic of the': 'cd',
  'Cook Islands': 'ck',
  'Costa Rica': 'cr',
  "Cote D'Ivoire": 'ci',
  Croatia: 'hr',
  Cuba: 'cu',
  Cyprus: 'cy',
  'Czech Republic': 'cz',
  Denmark: 'dk',
  Djibouti: 'dj',
  Dominica: 'dm',
  'Dominican Republic': 'do',
  Ecuador: 'ec',
  Egypt: 'eg',
  'El Salvador': 'sv',
  'Equatorial Guinea': 'gq',
  Eritrea: 'er',
  Estonia: 'ee',
  Ethiopia: 'et',
  'Falkland Islands (Malvinas)': 'fk',
  'Faroe Islands': 'fo',
  Fiji: 'fj',
  Finland: 'fi',
  France: 'fr',
  'French Guiana': 'gf',
  'French Polynesia': 'pf',
  'French Southern Territories': 'tf',
  Gabon: 'ga',
  Gambia: 'gm',
  Georgia: 'ge',
  Germany: 'de',
  Ghana: 'gh',
  Gibraltar: 'gi',
  Greece: 'gr',
  Greenland: 'gl',
  Grenada: 'gd',
  Guadeloupe: 'gp',
  Guam: 'gu',
  Guatemala: 'gt',
  Guernsey: 'gg',
  Guinea: 'gn',
  'Guinea-Bissau': 'gw',
  Guyana: 'gy',
  Haiti: 'ht',
  'Heard Island and Mcdonald Islands': 'hm',
  'Holy See (Vatican City State)': 'va',
  Honduras: 'hn',
  'Hong Kong': 'hk',
  Hungary: 'hu',
  Iceland: 'is',
  India: 'in',
  Indonesia: 'id',
  'Iran, Islamic Republic Of': 'ir',
  Iraq: 'iq',
  Ireland: 'ie',
  'Isle of Man': 'im',
  Israel: 'il',
  Italy: 'it',
  Jamaica: 'jm',
  Japan: 'jp',
  Jersey: 'je',
  Jordan: 'jo',
  Kazakhstan: 'kz',
  Kenya: 'ke',
  Kiribati: 'ki',
  "Korea, Democratic People'S Republic of": 'kp',
  'Korea, Republic of': 'kr',
  Kuwait: 'kw',
  Kyrgyzstan: 'kg',
  "Lao People'S Democratic Republic": 'la',
  Latvia: 'lv',
  Lebanon: 'lb',
  Lesotho: 'ls',
  Liberia: 'lr',
  'Libyan Arab Jamahiriya': 'ly',
  Liechtenstein: 'li',
  Lithuania: 'lt',
  Luxembourg: 'lu',
  Macao: 'mo',
  'Macedonia, The Former Yugoslav Republic of': 'mk',
  Madagascar: 'mg',
  Malawi: 'mw',
  Malaysia: 'my',
  Maldives: 'mv',
  Mali: 'ml',
  Malta: 'mt',
  'Marshall Islands': 'mh',
  Martinique: 'mq',
  Mauritania: 'mr',
  Mauritius: 'mu',
  Mayotte: 'yt',
  Mexico: 'mx',
  'Micronesia, Federated States of': 'fm',
  'Moldova, Republic of': 'md',
  Monaco: 'mc',
  Mongolia: 'mn',
  Montenegro: 'me',
  Montserrat: 'ms',
  Morocco: 'ma',
  Mozambique: 'mz',
  Myanmar: 'mm',
  Namibia: 'na',
  Nauru: 'nr',
  Nepal: 'np',
  Netherlands: 'nl',
  'Netherlands Antilles': 'an',
  'New Caledonia': 'nc',
  'New Zealand': 'nz',
  Nicaragua: 'ni',
  Niger: 'ne',
  Nigeria: 'ng',
  Niue: 'nu',
  'Norfolk Island': 'nf',
  'Northern Mariana Islands': 'mp',
  Norway: 'no',
  Oman: 'om',
  Pakistan: 'pk',
  Palau: 'pw',
  'Palestinian Territory, Occupied': 'ps',
  Panama: 'pa',
  'Papua New Guinea': 'pg',
  Paraguay: 'py',
  Peru: 'pe',
  Philippines: 'ph',
  Pitcairn: 'pn',
  Poland: 'pl',
  Portugal: 'pt',
  'Puerto Rico': 'pr',
  Qatar: 'qa',
  Reunion: 're',
  Romania: 'ro',
  'Russian Federation': 'ru',
  RWANDA: 'rw',
  'Saint Helena': 'sh',
  'Saint Kitts and Nevis': 'kn',
  'Saint Lucia': 'lc',
  'Saint Pierre and Miquelon': 'pm',
  'Saint Vincent and the Grenadines': 'vc',
  Samoa: 'ws',
  'San Marino': 'sm',
  'Sao Tome and Principe': 'st',
  'Saudi Arabia': 'sa',
  Senegal: 'sn',
  Serbia: 'rs',
  Seychelles: 'sc',
  'Sierra Leone': 'sl',
  Singapore: 'sg',
  Slovakia: 'sk',
  Slovenia: 'si',
  'Solomon Islands': 'sb',
  Somalia: 'so',
  'South Africa': 'za',
  'South Georgia and the South Sandwich Islands': 'gs',
  Spain: 'es',
  'Sri Lanka': 'lk',
  Sudan: 'sd',
  Suriname: 'sr',
  'Svalbard and Jan Mayen': 'sj',
  Swaziland: 'sz',
  Sweden: 'se',
  Switzerland: 'ch',
  'Syrian Arab Republic': 'sy',
  'Taiwan, Province of China': 'tw',
  Tajikistan: 'tj',
  'Tanzania, United Republic of': 'tz',
  Thailand: 'th',
  'Timor-Leste': 'tl',
  Togo: 'tg',
  Tokelau: 'tk',
  Tonga: 'to',
  'Trinidad and Tobago': 'tt',
  Tunisia: 'tn',
  Turkey: 'tr',
  Turkmenistan: 'tm',
  'Turks and Caicos Islands': 'tc',
  Tuvalu: 'tv',
  Uganda: 'ug',
  Ukraine: 'ua',
  'United Arab Emirates': 'ae',
  'United Kingdom': 'gb',
  'United States': 'us',
  'United States Minor Outlying Islands': 'um',
  Uruguay: 'uy',
  Uzbekistan: 'uz',
  Vanuatu: 'vu',
  Venezuela: 've',
  'Viet Nam': 'vn',
  'Virgin Islands, British': 'vg',
  'Virgin Islands, U.S.': 'vi',
  'Wallis and Futuna': 'wf',
  'Western Sahara': 'eh',
  Yemen: 'ye',
  Zambia: 'zm',
  Zimbabwe: 'zw',
}

export function getFlagImage(countryCode) {
  return countryCode?.toUpperCase()?.replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()))
}

export const HTMLParser = (str) => {
  const parser = new DOMParser()
  return parser.parseFromString(str, 'text/html')
}

export function toaster(message, type) {
  queryClient.defaultOptions.message(message, type)
}

export function randomColor() {
  return `hsl(${Math.ceil(Math.random() * 360 + 1)}, 65%, 65%)`
}

export function changeColorSat(color) {
  const c = color?.split(',')
  c[1] = '100%'
  c[2] = '90%)'
  return c.join(', ')
}

export function projectStatusColor(status) {
  switch (status) {
    case 'On Hold':
      return 'light-ola'
    case 'Completed':
      return 'light-green'
    case 'Pending':
      return 'light-gray'
    case 'In Progress':
      return 'blue'
  }
}
export function interviewStatus(status) {
  switch (status) {
    case 'Interviewing':
      return 'interviewing'
    case 'Selected':
      return 'selected'
    case 'Profile Shared':
      return 'profile-shared'
    case 'Not Selected':
      return 'not-selected'
  }
}
let nav

export function navTo(data) {
  nav = data
}

export function navigationTo(link) {
  nav(link)
}

export function timeSelect() {
  let time = []
  let minute = ['00', '30']
  for (let i = 0; i < 24; i++) {
    minute.forEach((m) => time.push({ sName: String(i).padStart(2) + ':' + m, _id: String(i).padStart(2) + ':' + m }))
  }
  return time
}
