import { Crypt } from 'hybrid-crypto-js'
import AltAvatar from 'Assets/Icons/altImage.svg'
import { queryClient } from 'App'

export const floatingNumber = /[a-z]?[A-Z]?[-]?[ $&+,:;`=_?@#|/'<>-^*()%!]*/g

// export const floatingNumber = /^(?![0-9]+(\.?[0-9]?[0-9]?)?)/g

export const onlyInt = /\D+/g

// Function for Verify Length
export function verifyLength(value, length) {
  if (value.length >= length) {
    return true
  }
  return false
}

const allowedShowAllProjectJobLevel = [1, 2, 3]
export function showAllProjectByDefault(level) {
  if (allowedShowAllProjectJobLevel.some(i => i === level)) {
    return "ALL"
  }
  return "OWN"

}

export function checkConfirmPassword(password, newPassword) {
  if (newPassword === password && newPassword.trim().length > 0 && password.trim().length > 0) {
    return true
  }
  return false
}

export function formatDate(date, separator = '-') {
  const d = new Date(date).toString().split(' ')
  return date ? [d[2], months[d[1]], d[3]].join(separator) : '-'
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

export function removeToken(isLocalStorage) {
  console.warn('removing token')
  if (isLocalStorage) {
    localStorage.clear('')
  } else {
    localStorage.clear('')
    // sessionStorage.clear('')
  }
}

export function addToken(token, remember) {
  if (remember) {
    localStorage.setItem('token', token)
  } else {
    localStorage.setItem('token', token)
    // sessionStorage.setItem('token', token)
  }
}

export const appendParams = (value) => {
  const data = { ...value }
  data.search = encodeURIComponent(data?.search || '')
  Object.keys(data).forEach((e) => (data[e] === '' || typeof data[e] === 'object' || !data[e]?.toString().length) && delete data[e])

  window.history.replaceState({}, null, `${location.pathname}?${new URLSearchParams(data).toString()}`)
}

export const parseParams = (params = '') => {
  const urlParams = new URLSearchParams(decodeURIComponent(params))
  const rawParams = decodeURIComponent(params).replace('?', '').split('&')

  const extractedParams = {}
  if (rawParams[0]) {
    rawParams.forEach((item) => {
      item = item.split('=')
      extractedParams[item[0]] = urlParams.get(item[0]) ? urlParams.get(item[0]) : ''
    })
    return extractedParams
  } else {
    return extractedParams
  }
}

export function handleAlterImage(e, src, isStyled) {
  e.target.onerror = null
  e.target.style = isStyled ? 'width:55%;height:55%;' : ''
  e.target.src = src || AltAvatar
}

export function getSortedColumns(TableColumns, urlData) {
  return TableColumns?.map((column) =>
    column.connectionName === urlData?.sort
      ? { ...column, sort: urlData?.order === 'asc' ? 1 : urlData?.order === 'desc' ? -1 : 0 }
      : column
  )
}

export function blobImage(url) {
  const data = fetch(url)
  const blob = data.blob()

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

export function toaster(message, type = 'success') {
  queryClient.defaultOptions.message({ message, type })
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

export const projectStatusLabel = {
  pending: 'Pending',
  inProgress: 'In Progress',
  onHold: 'On Hold',
  completed: 'Completed',
  closed: 'Closed'
}

export function projectStatusColor(status) {
  switch (status) {
    case projectStatusLabel.onHold:
      return 'light-ola'
    case projectStatusLabel.completed:
      return 'light-green'
    case projectStatusLabel.pending:
      return 'light-gray'
    case projectStatusLabel.inProgress:
      return 'blue'
    case projectStatusLabel.closed:
      return 'red'
  }
}
export function projectStatusColorCode(status) {
  switch (status) {
    case projectStatusLabel.onHold:
      return '#ac7ab4'
    case projectStatusLabel.completed:
      return '#0ea085'
    case projectStatusLabel.pending:
      return '#f29b20'
    case projectStatusLabel.inProgress:
      return '#0487ff'
    case projectStatusLabel.closed:
      return '#e64c3b'
  }
}
export function employeeManagementAvailabilityStatus(status) {
  switch (status) {
    case 'Available':
      return 'green'
    case 'Not Available':
      return 'red'
    case 'Partially Available':
      return 'yellow'
  }
}
export function imageAppendUrl(url) {
  return 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + url
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

export function navigationTo(link) {
  emitEvent('navigateTo', link)
}

export function timeSelect() {
  let time = []
  let minute = ['00', '15', '30', '45']
  for (let i = 0; i < 24; i++) {
    minute.forEach((m) => time.push({ sName: String(i).padStart(2) + ':' + m, _id: String(i).padStart(2) + ':' + m }))
  }
  return time
}

export function hourSelect(min = 1, max = 24) {
  let time = []
  for (let i = min; i <= max; i++) {
    time.push({ sName: i + (i === 1 ? ' Hr' : ' Hrs'), _id: i })
  }
  return time
}

export function cell(data, optionalText = '-') {
  return data || optionalText
}

export function handleErrors(errors, errorSetter) {
  Array.isArray(errors) && errors?.forEach((error) => errorSetter(error.param, { type: 'custom', message: error.msg }))
}
export function changeDateFormat(date) {
  return typeof date === 'string' ? date?.substring(0, 10) : ''
}

export const monthsForChart = {
  1: 'january',
  2: 'february',
  3: 'march',
  4: 'april',
  5: 'may',
  6: 'june',
  7: 'july',
  8: 'august',
  9: 'september',
  10: 'october',
  11: 'november',
  12: 'december',
}

export const bottomReached = ({ target }) => {
  return target.offsetHeight + target.scrollTop >= target.scrollHeight
}

export function countHoursEquality(totalHours, expectedHours) {
  return +totalHours === +expectedHours
}
export function countDiff(totalHours, usedHours) {
  return +totalHours - +usedHours
}

export function convertMinutesToTime(min) {
  let hours = 0,
    days = 0,
    minutes = 0
  if (!min) return `${days ? days + 'd' : ''} ${hours}h ${minutes}m`
  days = parseInt(min / 1440)
  hours = parseInt((min % 1440) / 60)
  minutes = parseInt((min % 1440) % 60)

  return `${days ? days + 'd' : ''} ${hours}h ${minutes}m`
}

export const projectStatus = [
  { index: 1, label: projectStatusLabel.pending, value: projectStatusLabel.pending, color: projectStatusColorCode, associate: [1, 2, 3, 5] },
  { index: 2, label: projectStatusLabel.inProgress, value: projectStatusLabel.inProgress, associate: [2, 3, 4, 5] },
  { index: 3, label: projectStatusLabel.onHold, value: projectStatusLabel.onHold, associate: [2, 3, 4, 5] },
  { index: 4, label: projectStatusLabel.completed, value: projectStatusLabel.completed, associate: [4, 2] },
  { index: 5, label: projectStatusLabel.closed, value: projectStatusLabel.closed },
]

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision)
  var n = precision < 0 ? number : 0.01 / factor + number
  return Math.round(n * factor) / factor
}

export function convertMinutesToHour(m, precision = 2) {
  return precisionRound(m / 60, precision)
}

export function yearList(start, end) {
  let time = []
  for (let i = start; i <= end; i++) {
    time.push({ sName: i, _id: i })
  }
  return time
}

export function emitEvent(type, detail = {}, elem = document) {
  if (!type) return

  let event = new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail: detail,
  })

  return elem.dispatchEvent(event)
}

export function calculateMinutesBetweenTwoDates(startDate, endDate) {
  const isDateFormat = (d) => typeof d === 'object'
  startDate = isDateFormat(startDate) ? isDateFormat : new Date(startDate)
  endDate = isDateFormat(endDate) ? isDateFormat : new Date(endDate)
  var diff = endDate.getTime() - startDate.getTime()

  // output diff in in minutes
  return Math.floor(diff / 1000 / 60)
}

export function detectBrowser() {
  var N = navigator.appName,
    ua = navigator.userAgent,
    M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*([\d.]+)/i)
  // if (M && (tem = ua.match(/version\/([.\d]+)/i)) != null) M[2] = tem[1]
  M = M ? [M[1]] : [N, navigator.appVersion, '-?']
  return M.join('')
}

export const ExcelModules = {
  Technology: [{ label: 'Name', value: 'Name', isSelected: true }],
  Project: [
    { label: 'Name', value: 'Name', isSelected: true },
    { label: 'Project Type', value: 'ProjectType', isSelected: true },
    { label: 'Client', value: 'client', isSelected: true },
    { label: 'Project Tag', value: 'projecttag', isSelected: true },
    { label: 'Technology', value: 'technology', isSelected: true },
    { label: 'Project Status', value: 'ProjectStatus', isSelected: true },
    { label: 'End Date', value: 'EndDate', isSelected: true },
  ],
  Client: [
    { label: 'Name', value: 'Name', isSelected: true },
    { label: 'Email', value: 'Email', isSelected: true },
    { label: 'Country', value: 'Country', isSelected: true },
  ],
  Skill: [{ label: 'Name', value: 'Name', isSelected: true }],
  JobProfile: [{ label: 'Name', value: 'Name', isSelected: true }],
  ProjectTag: [{ label: 'Name', value: 'Name', isSelected: true }],
  Department: [{ label: 'Name', value: 'Name', isSelected: true }],
  Employee: [
    { label: 'Name', value: 'Name', isSelected: true },
    { label: 'Department', value: 'Department', isSelected: true },
    { label: 'Experience', value: 'Experience', isSelected: true },
    { label: 'Availability Hours', value: 'AvailabilityHours', isSelected: true },
    { label: 'Project', value: 'Project', isSelected: true },
    { label: 'Department Id', value: 'DepartmentId', isSelected: true },
    { label: 'Grade', value: 'Grade', isSelected: true },
    { label: 'Availability Status', value: 'AvailabilityStatus', isSelected: true },
  ],
  WorkLogs: [
    { label: 'Project', value: 'ProjectName', isSelected: true },
    { label: 'Employee', value: 'EmployeeName', isSelected: true },
    { label: 'WorkLog Type', value: 'WorkLogsType', isSelected: true },
    { label: 'Tags', value: 'TaskTag', isSelected: true },
    { label: 'Created At', value: 'CreatedAt', isSelected: true },
    { label: 'Minutes', value: 'Minutes', isSelected: true },
  ],
  ChangeRequest: [
    { label: 'Name', value: 'Name', isSelected: true },
    { label: 'Project', value: 'ProjectName', isSelected: true },
    { label: 'TimeLine Days', value: 'TimeLineDays', isSelected: true },
    { label: 'Cr Status', value: 'CrStatus', isSelected: true },
  ],
  DashBoard: [
    { label: 'Name', value: 'Name', isSelected: true },
    { label: 'Project Type', value: 'ProjectType', isSelected: true },
    { label: 'Project Status', value: 'ProjectStatus', isSelected: true },
    { label: 'Project Technologies', value: 'ProjectTechnologies', isSelected: true },
    { label: 'Cost', value: 'Cost', isSelected: true },
    { label: 'TimeLineDays', value: 'TimeLineDays', isSelected: true },
    { label: 'StartDate', value: 'StartDate', isSelected: true },
    { label: 'EndDate', value: 'EndDate', isSelected: true },
    { label: 'Symbol', value: 'Symbol', isSelected: true },
    { label: 'Currency Name', value: 'CurrencyName', isSelected: true },
    { label: 'projectIndicator RemainingMinute', value: 'projectIndicator_RemainingMinute', isSelected: true },
    { label: 'projectIndicator RemainingCost', value: 'projectIndicator_RemainingCost', isSelected: true },
    { label: 'projectIndicator NonBillableMinute', value: 'projectIndicator_NonBillableMinute', isSelected: true },
    { label: 'projectIndicator NonBillableCost', value: 'projectIndicator_NonBillableCost', isSelected: true },
    { label: 'Total Cr', value: 'TotalCr', isSelected: true },
    { label: 'cr total RemainingMinute', value: 'cr_total_RemainingMinute', isSelected: true },
    { label: 'cr total RemainingCost', value: 'cr_total_RemainingCost', isSelected: true },
    { label: 'cr total NonBillableMinute', value: 'cr_total_NonBillableMinute', isSelected: true },
    { label: 'cr total NonBillableCost', value: 'cr_total_NonBillableCost', isSelected: true },
    { label: 'Only Cr', value: 'OnlyCr', isSelected: true },
  ],
}

export function mapFilter(array, mapCallback, filterCallback) {
  const mappedData = Array.isArray(array) ? [] : {}
  for (const INDEX in array) {
    const singleItem = mapCallback ? mapCallback(array[INDEX]) : array[INDEX]
    const condition = filterCallback ? filterCallback(array[INDEX]) : true
    condition && (Array.isArray(array) ? mappedData.push(singleItem) : (mappedData[INDEX] = array[INDEX]))
  }
  return mappedData
}

export function createOption(input, keys = ['sName', '_id']) {
  return {
    [keys[0]]: input,
    [keys[1]]: input.toLowerCase().replace(/\W/g, ''),
  }
}

export function addNewOption({ value, module: moduleName, createOptionSelector, createNewOption }, mutationFm, valueSetterCallback) {
  let newOption = createOption(value, createOptionSelector)
  const newModuleName = ['department', 'technology', 'projectTag', 'jobprofile', 'skill'].includes(moduleName) ? 'Global' : moduleName
  const allmoduleNames = {
    Global: () =>
      mutationFm.mutate(value, {
        onSuccess: (data) => {
          newOption[createOptionSelector?.[1] || '_id'] = data.data.data.id || ''
          newOption = { ...newOption, ...data.data.data }
          createNewOption && createNewOption(moduleName, newOption)
          valueSetterCallback(newOption)
        },
      }),
  }
  allmoduleNames[newModuleName]()
}
export const permissions = [
  'VIEW_COST',
  'VIEW_DASHBOARD',
  'VIEW_DASHBOARD_FREE_RESOURCES',
  'VIEW_DASHBOARD_STATISTICS',
  'VIEW_DASHBOARD_MONTHLY_CHART',
  'VIEW_DASHBOARD_WORKLOGS',
  'VIEW_DASHBOARD_LATEST_PROJECTS',
  'VIEW_DASHBOARD_PROJECT_LINE',
  'CREATE_EMPLOYEE',
  'VIEW_EMPLOYEE',
  'UPDATE_EMPLOYEE',
  'DELETE_EMPLOYEE',
  'CREATE_PROJECT',
  'VIEW_PROJECT',
  'UPDATE_PROJECT',
  'DELETE_PROJECT',
  'CREATE_SKILL',
  'VIEW_SKILL',
  'UPDATE_SKILL',
  'DELETE_SKILL',
  'CREATE_DEPARTMENT',
  'VIEW_DEPARTMENT',
  'UPDATE_DEPARTMENT',
  'DELETE_DEPARTMENT',
  'CREATE_CLIENT',
  'VIEW_CLIENT',
  'UPDATE_CLIENT',
  'DELETE_CLIENT',
  'CREATE_WORKLOGS',
  'VIEW_WORKLOGS',
  'DELETE_WORKLOGS',
  'CREATE_CHANGE_REQUEST',
  'VIEW_CHANGE_REQUEST',
  'UPDATE_CHANGE_REQUEST',
  'DELETE_CHANGE_REQUEST',
  'CREATE_REVIEW',
  'VIEW_REVIEW',
  'UPDATE_REVIEW',
  'DELETE_REVIEW',
  'VIEW_PROJECT_OVERVIEW',
  'VIEW_S3BUCKETINFO',
  'CREATE_ORGANIZATION_DETAILS',
  'UPDATE_ORGANIZATION_DETAILS',
  'VIEW_ORGANIZATION_DETAILS',
  'UPDATE_LOGS',
  'CREATE_LOGS',
  'VIEW_LOGS',
  'DELETE_LOGS',
  'CREATE_WORKLOG_TAGS',
  'VIEW_WORKLOG_TAGS',
  'UPDATE_WORKLOG_TAGS',
  'DELETE_WORKLOG_TAGS',
  'CREATE_TECHNOLOGY',
  'VIEW_TECHNOLOGY',
  'UPDATE_TECHNOLOGY',
  'DELETE_TECHNOLOGY',
  'CREATE_PROJECT_TAG',
  'VIEW_PROJECT_TAG',
  'UPDATE_PROJECT_TAG',
  'DELETE_PROJECT_TAG',
  'CREATE_NOTIFICATION',
  'VIEW_NOTIFICATION',
  'UPDATE_NOTIFICATION',
  'DELETE_NOTIFICATION',
  'CREATE_JOB_PROFILE',
  'VIEW_JOB_PROFILE',
  'UPDATE_JOB_PROFILE',
  'DELETE_JOB_PROFILE',
  'CREATE_CURRENCY',
  'UPDATE_CURRENCY',
  'VIEW_CURRENCY',
  'DELETE_CURRENCY',
  'CREATE_ROLE',
  'UPDATE_ROLE',
  'VIEW_ROLE',
  'DELETE_ROLE',
  'CREATE_PERMISSION',
  'UPDATE_PERMISSION',
  'VIEW_PERMISSION',
  'DELETE_PERMISSION',
  'VIEW_USERPROFILE',
  'UPDATE_USERPROFILE',
  'DOWNLOAD_EMPLOYEE_EXCEL',
  'DOWNLOAD_DASHBOARD_EXCEL',
  'DOWNLOAD_LOGS_EXCEL',
  'DOWNLOAD_CHANGE_REQUEST_EXCEL',
  'DOWNLOAD_WORKLOGS_EXCEL',
  'DOWNLOAD_CLIENT_EXCEL',
  'DOWNLOAD_DEPARTMENT_EXCEL',
  'DOWNLOAD_SKILL_EXCEL',
  'DOWNLOAD_PROJECT_EXCEL',
  'CREATE_ORGANIZATION_BRANCH',
  'VIEW_ORGANIZATION_BRANCH',
  'UPDATE_ORGANIZATION_BRANCH',
  'DELETE_ORGANIZATION_BRANCH',
  'VIEW_CLOSED_PROJECT'
]

export const permissionsName = {
  VIEW_COST: 'VIEW_COST',
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  VIEW_DASHBOARD_FREE_RESOURCES: 'VIEW_DASHBOARD_FREE_RESOURCES',
  VIEW_DASHBOARD_STATISTICS: 'VIEW_DASHBOARD_STATISTICS',
  VIEW_DASHBOARD_MONTHLY_CHART: 'VIEW_DASHBOARD_MONTHLY_CHART',
  VIEW_DASHBOARD_WORKLOGS: 'VIEW_DASHBOARD_WORKLOGS',
  VIEW_DASHBOARD_LATEST_PROJECTS: 'VIEW_DASHBOARD_LATEST_PROJECTS',
  VIEW_DASHBOARD_PROJECT_LINE: 'VIEW_DASHBOARD_PROJECT_LINE',
  CREATE_EMPLOYEE: 'CREATE_EMPLOYEE',
  VIEW_EMPLOYEE: 'VIEW_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  CREATE_PROJECT: 'CREATE_PROJECT',
  VIEW_PROJECT: 'VIEW_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  CREATE_SKILL: 'CREATE_SKILL',
  VIEW_SKILL: 'VIEW_SKILL',
  UPDATE_SKILL: 'UPDATE_SKILL',
  DELETE_SKILL: 'DELETE_SKILL',
  CREATE_DEPARTMENT: 'CREATE_DEPARTMENT',
  VIEW_DEPARTMENT: 'VIEW_DEPARTMENT',
  UPDATE_DEPARTMENT: 'UPDATE_DEPARTMENT',
  DELETE_DEPARTMENT: 'DELETE_DEPARTMENT',
  CREATE_CLIENT: 'CREATE_CLIENT',
  VIEW_CLIENT: 'VIEW_CLIENT',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  DELETE_CLIENT: 'DELETE_CLIENT',
  CREATE_WORKLOGS: 'CREATE_WORKLOGS',
  VIEW_WORKLOGS: 'VIEW_WORKLOGS',
  DELETE_WORKLOGS: 'DELETE_WORKLOGS',
  CREATE_CHANGE_REQUEST: 'CREATE_CHANGE_REQUEST',
  VIEW_CHANGE_REQUEST: 'VIEW_CHANGE_REQUEST',
  UPDATE_CHANGE_REQUEST: 'UPDATE_CHANGE_REQUEST',
  DELETE_CHANGE_REQUEST: 'DELETE_CHANGE_REQUEST',
  CREATE_REVIEW: 'CREATE_REVIEW',
  VIEW_REVIEW: 'VIEW_REVIEW',
  UPDATE_REVIEW: 'UPDATE_REVIEW',
  DELETE_REVIEW: 'DELETE_REVIEW',
  VIEW_PROJECT_OVERVIEW: 'VIEW_PROJECT_OVERVIEW',
  VIEW_S3BUCKETINFO: 'VIEW_S3BUCKETINFO',
  CREATE_ORGANIZATION_DETAILS: 'CREATE_ORGANIZATION_DETAILS',
  UPDATE_ORGANIZATION_DETAILS: 'UPDATE_ORGANIZATION_DETAILS',
  VIEW_ORGANIZATION_DETAILS: 'VIEW_ORGANIZATION_DETAILS',
  UPDATE_LOGS: 'UPDATE_LOGS',
  CREATE_LOGS: 'CREATE_LOGS',
  VIEW_LOGS: 'VIEW_LOGS',
  DELETE_LOGS: 'DELETE_LOGS',
  CREATE_WORKLOG_TAGS: 'CREATE_WORKLOG_TAGS',
  VIEW_WORKLOG_TAGS: 'VIEW_WORKLOG_TAGS',
  UPDATE_WORKLOG_TAGS: 'UPDATE_WORKLOG_TAGS',
  DELETE_WORKLOG_TAGS: 'DELETE_WORKLOG_TAGS',
  CREATE_TECHNOLOGY: 'CREATE_TECHNOLOGY',
  VIEW_TECHNOLOGY: 'VIEW_TECHNOLOGY',
  UPDATE_TECHNOLOGY: 'UPDATE_TECHNOLOGY',
  DELETE_TECHNOLOGY: 'DELETE_TECHNOLOGY',
  CREATE_PROJECT_TAG: 'CREATE_PROJECT_TAG',
  VIEW_PROJECT_TAG: 'VIEW_PROJECT_TAG',
  UPDATE_PROJECT_TAG: 'UPDATE_PROJECT_TAG',
  DELETE_PROJECT_TAG: 'DELETE_PROJECT_TAG',
  CREATE_NOTIFICATION: 'CREATE_NOTIFICATION',
  VIEW_NOTIFICATION: 'VIEW_NOTIFICATION',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  CREATE_JOB_PROFILE: 'CREATE_JOB_PROFILE',
  VIEW_JOB_PROFILE: 'VIEW_JOB_PROFILE',
  UPDATE_JOB_PROFILE: 'UPDATE_JOB_PROFILE',
  DELETE_JOB_PROFILE: 'DELETE_JOB_PROFILE',
  CREATE_CURRENCY: 'CREATE_CURRENCY',
  UPDATE_CURRENCY: 'UPDATE_CURRENCY',
  VIEW_CURRENCY: 'VIEW_CURRENCY',
  DELETE_CURRENCY: 'DELETE_CURRENCY',
  CREATE_ROLE: 'CREATE_ROLE',
  UPDATE_ROLE: 'UPDATE_ROLE',
  VIEW_ROLE: 'VIEW_ROLE',
  DELETE_ROLE: 'DELETE_ROLE',
  CREATE_PERMISSION: 'CREATE_PERMISSION',
  UPDATE_PERMISSION: 'UPDATE_PERMISSION',
  VIEW_PERMISSION: 'VIEW_PERMISSION',
  DELETE_PERMISSION: 'DELETE_PERMISSION',
  VIEW_USERPROFILE: 'VIEW_USERPROFILE',
  UPDATE_USERPROFILE: 'UPDATE_USERPROFILE',
  DOWNLOAD_EMPLOYEE_EXCEL: 'DOWNLOAD_EMPLOYEE_EXCEL',
  DOWNLOAD_DASHBOARD_EXCEL: 'DOWNLOAD_DASHBOARD_EXCEL',
  DOWNLOAD_LOGS_EXCEL: 'DOWNLOAD_LOGS_EXCEL',
  DOWNLOAD_CHANGE_REQUEST_EXCEL: 'DOWNLOAD_CHANGE_REQUEST_EXCEL',
  DOWNLOAD_WORKLOGS_EXCEL: 'DOWNLOAD_WORKLOGS_EXCEL',
  DOWNLOAD_CLIENT_EXCEL: 'DOWNLOAD_CLIENT_EXCEL',
  DOWNLOAD_DEPARTMENT_EXCEL: 'DOWNLOAD_DEPARTMENT_EXCEL',
  DOWNLOAD_SKILL_EXCEL: 'DOWNLOAD_SKILL_EXCEL',
  DOWNLOAD_PROJECT_EXCEL: 'DOWNLOAD_PROJECT_EXCEL',
  CREATE_ORGANIZATION_BRANCH: 'CREATE_ORGANIZATION_BRANCH',
  VIEW_ORGANIZATION_BRANCH: 'VIEW_ORGANIZATION_BRANCH',
  UPDATE_ORGANIZATION_BRANCH: 'UPDATE_ORGANIZATION_BRANCH',
  DELETE_ORGANIZATION_BRANCH: 'DELETE_ORGANIZATION_BRANCH',
  VIEW_CLOSED_PROJECT :'VIEW_CLOSED_PROJECT'
}

export function isGranted(allowed) {
  // const token = localStorage.getItem('token') || sessionStorage.getItem('token') || queryClient.getQueryData('')
  const token = localStorage.getItem('token') || queryClient.getQueryData('')
  const data = token ? parseJwt(token) : null

  if (data?.aTotalPermissions?.length) {
    if (Array.isArray(allowed)) {
      const granted = !!allowed.filter((per) => data.aTotalPermissions.includes(per) || per === 'noRole').length
      return granted
    } else {
      const granted = data.aTotalPermissions.includes(allowed) || allowed === 'noRole'
      return granted
    }
  } else if (allowed === 'noRole') {
    return true
  } else {
    return false
  }
}

export function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export function convertObjectToFile(object) {
  const { sContract, sContentType, dLastModified, sName } = object

  // Fetch the file data or access it from the appropriate source
  // Assuming the file data is available as a data URL
  return fetch(sContract)
    .then(response => response.blob())
    .then(blob => {
      // Create a new File object
      const file = new File([blob], sName, { type: sContentType, lastModified: new Date(dLastModified) })
      return file
    })
    .catch(error => {
      console.error('Error fetching file data:', error)
      return null
    })
}

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!*_])[A-Za-z\d@#$%^&+=!*_]{8,}$/
