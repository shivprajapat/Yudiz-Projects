import { Crypt } from 'hybrid-crypto-js'

import { PUBLIC_KEY, DESIGNATION, S3_PREFIX, NUMBER1TO10, CHECK_AMP, REACT_APP_ENV } from './constants'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const encryption = (data) => {
  const crypt = new Crypt()
  const encrypted = crypt.encrypt(PUBLIC_KEY, data)
  return encrypted.toString()
}

// Timer Function
export const countDownCalculations = (dateData) => {
  let diff = (Date.parse(new Date(Number(dateData))) - Date.parse(new Date())) / 1000
  const timeLeft = {
    years: 0,
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
    millisec: 0
  }

  if (diff >= 365.25 * 86400) {
    timeLeft.years = Math.floor(diff / (365.25 * 86400))
    diff -= timeLeft.years * 365.25 * 86400
  }
  if (diff >= 86400) {
    timeLeft.days = Math.floor(diff / 86400)
    diff -= timeLeft.days * 86400
  }
  if (diff >= 3600) {
    timeLeft.hours = Math.floor(diff / 3600)
    diff -= timeLeft.hours * 3600
  }
  if (diff >= 60) {
    timeLeft.min = Math.floor(diff / 60)
    diff -= timeLeft.min * 60
  }
  timeLeft.sec = diff
  return timeLeft
}

// Add 0 value in start
export const addLeadingZeros = (value) => {
  value = String(value)
  while (value.length < 2) {
    value = '0' + value
  }
  return value
}

// 10 Nov 2020, Tuesday, 7:30 PM IST
export const convertDate = (data) => {
  const t = new Date(Number(data))
  const Day = t.getDate()
  const Month = t.toLocaleString('en-us', { month: 'short', timeZone: 'Asia/Kolkata' })
  const Year = t.getFullYear()
  const sDay = t.getDay()
  const timeWithAMPM = t.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' })
  return Day + ' ' + Month + ' ' + Year + ', ' + daysOfWeek[sDay] + ', ' + timeWithAMPM + ' IST'
}

// comment date example : Aug 18 2020 11:34 AM
export const convertDateAMPM = (data) => {
  const t = new Date(Number(data))
  const Day = t.getDate()
  const Month = t.toLocaleString('en-us', { month: 'short' })
  const Year = t.getFullYear()
  const timeWithAMPM = t.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' })
  return Month + ' ' + Day + ' ' + Year + ' ' + timeWithAMPM
}

export const getDesignation = (type) => {
  return DESIGNATION.find((item) => type === item.value)?.label
}

// 16 Jan 2020, 16:00 IST
export const convertDt24hFormat = (data) => {
  const t = new Date(Number(data))
  const dateWithTime = t.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  })
  return dateWithTime + ' ' + 'IST'
}

// 12 jan 2021
export const convertDt24h = (data) => {
  const t = new Date(Number(data))
  const Day = t.getDate()
  const Month = t.toLocaleString('en-us', { month: 'short' })
  const Year = t.getFullYear()
  return Day + ' ' + Month + ' ' + Year
}

// only Date and month
export const dateMonth = (data) => {
  const t = new Date(Number(data))
  const Day = t.getDate()
  const Month = t.toLocaleString('en-us', { month: 'short' })
  return Month + ' ' + Day
}

// Convert Seconds into minutes
export const convertHMS = (value) => {
  const sec = parseInt(value, 10) // convert value to number if it's string
  let hours = Math.floor(sec / 3600) // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60) // get minutes
  let seconds = sec - hours * 3600 - minutes * 60 //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  if (hours > '00') {
    return hours + ':' + minutes + ':' + seconds // Return is HH : MM : SS
  } else {
    return minutes + ':' + seconds // MM : SS
  }
}

export const playerType = (data) => {
  switch (data) {
    case 'bbf':
      return 'Best Bowling Figure'
    case 'hrs':
      return 'Highest Run Scorer'
    case 'hs':
      return 'Highest Score'
    case 'hwt':
      return 'Highest Wicket Taker'
    default:
      return ''
  }
}

export const scoreType = (data) => {
  switch (data) {
    case 'bbf':
      return 'Best'
    case 'hwt':
      return 'Wickets'
    case 'hs':
    case 'hrs':
      return 'Runs'
    default:
      return ''
  }
}

export const getArticleImg = (data) => {
  let img = {}
  if (data?.oTImg?.sUrl) img = { ...data?.oTImg }
  else img = { ...data?.oImg }
  img.sUrl = img.sUrl ? (img?.sUrl?.indexOf('www.crictracker.com') !== -1 ? img?.sUrl : S3_PREFIX + img?.sUrl) : ''
  return img
}

export const getMetaTagImg = (data, key) => {
  if (data?.oSeo && data?.oSeo[key]?.sUrl) return getImgURL(data?.oSeo[key]?.sUrl)
  else if (data?.oTImg?.sUrl) return getImgURL(data?.oTImg?.sUrl)
  else if (data?.oImg?.sUrl) return getImgURL(data?.oImg?.sUrl)
  else return ''
}

export const getImgURL = (url) => {
  return url ? (url?.indexOf('www.crictracker.com') !== -1 ? url : S3_PREFIX + url) : ''
}

export function debounce(func, immediate) {
  let timeout
  return function executedFunction() {
    const context = this
    const args = arguments

    const later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, 500)
    if (callNow) func.apply(context, args)
  }
}

// ONly show hour Ex. 3:45
export const hourFromTimeStamp = (data) => {
  const time = new Date(Number(data))
  return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}
// month and year
export const MonthYear = (data) => {
  const splitString = data.split('-')
  const d = new Date(data)
  const month = d.getMonth() + 1
  return months[month - 1] + ' ' + splitString[0]
}

// current date and month convert '2022-01-24'
export const currentDateMonth = (date) => {
  const currentMonth = date ? new Date(date).getMonth() + 1 : new Date().getMonth() + 1
  const currentYear = date ? new Date(date).getFullYear() : new Date().getFullYear()
  const currentDay = date ? new Date(date).getDate() : new Date().getDate()
  return currentYear + '-' + addLeadingZeros(currentMonth) + '-' + addLeadingZeros(currentDay)
}
// current to +7 and back 5 day
export const dayCal = (dayArray) => {
  const dt = new Date()
  let daysInPreviousMonth
  const currentDay = dt.getDate()
  const currentMonth = dt.getMonth()
  const currentYear = dt.getFullYear()
  let incYear = currentYear
  let decYear = currentYear
  let decDay = currentDay
  let incDay = currentDay
  let decMonth = currentMonth
  let incMonth = currentMonth
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  if (currentMonth === 0) {
    daysInPreviousMonth = new Date(currentYear - 1, 12, 0).getDate()
  } else {
    daysInPreviousMonth = new Date(currentYear, currentMonth - 1, 0).getDate()
  }
  for (let i = 5; i > 0; i--) {
    decDay = decDay - 1
    if (decDay < 1) {
      decDay = daysInPreviousMonth
      decMonth = currentMonth - 1
      if (decMonth === -1) {
        decMonth = 11
        decYear = currentYear - 1
        dayArray.push(decDay + ' ' + months[decMonth] + ' ' + decYear)
      } else {
        dayArray.push(decDay + ' ' + months[decMonth] + ' ' + decYear)
      }
    } else {
      dayArray.push(decDay + ' ' + months[decMonth] + ' ' + decYear)
    }
  }
  dayArray.reverse()
  for (let i = 0; i < 8; i++) {
    if (incDay > daysInCurrentMonth) {
      incDay = 1
      incMonth = currentMonth + 1
      if (incMonth === 12) {
        incMonth = 0
        incYear = incYear + 1
        dayArray.push(incDay + ' ' + months[incMonth] + ' ' + incYear)
      } else {
        dayArray.push(incDay + ' ' + months[incMonth] + ' ' + incYear)
      }
    } else {
      dayArray.push(incDay + ' ' + months[incMonth] + ' ' + incYear)
    }
    incDay = incDay + 1
  }
  return dayArray
}

// exclude year
export const excludeYear = (data) => {
  const yearSplit = data.split(' ')
  return yearSplit[0] + ' ' + yearSplit[1]
}

// // decode day
export const decodeDay = (data) => {
  const daySplit = data.split(' ')
  const monthNumber = monthCheck(daySplit[1])
  return daySplit[2] + '-' + monthNumber + '-' + daySplit[0]
}

// current to + 7 and back 5 month
export const monthCal = (monthArray) => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  let decMonth = currentMonth
  let incMonth = currentMonth
  let decYear = currentYear
  let incYear = currentYear
  for (let i = 5; i > 0; i--) {
    decMonth = decMonth - 1
    if (decMonth < 0) {
      decMonth = 11
      decYear = currentYear - 1
      monthArray.push(months[decMonth] + ' ' + decYear)
    } else {
      monthArray.push(months[decMonth] + ' ' + decYear)
    }
  }
  monthArray.reverse()
  for (let i = 0; i < 8; i++) {
    if (incMonth > 11) {
      incMonth = 0
      incYear = currentYear + 1
      monthArray.push(months[incMonth] + ' ' + incYear)
    } else {
      monthArray.push(months[incMonth] + ' ' + incYear)
    }
    incMonth = incMonth + 1
  }
  return monthArray
}

// current date and month convert
export const currentMonthYear = () => {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  return currentYear + '-' + currentMonth
}

// decode month
export const decodeMonth = (data) => {
  const monthSplit = data.split(' ')
  const monthNumber = monthCheck(monthSplit[0])
  return monthSplit[1] + '-' + monthNumber
}

export const monthCheck = (data) => {
  switch (data) {
    case 'Jan':
      return '01'
    case 'Feb':
      return '02'
    case 'Mar':
      return '03'
    case 'Apr':
      return '04'
    case 'May':
      return '05'
    case 'Jun':
      return '06'
    case 'Jul':
      return '07'
    case 'Aug':
      return '08'
    case 'Sep':
      return '09'
    case 'Oct':
      return '10'
    case 'Nov':
      return '11'
    case 'Dec':
      return '12'
    default:
      return ''
  }
}

// is Bottom reached
export function isBottomReached(id, callBack) {
  function handleScroll() {
    const ele = typeof window !== 'undefined' && document.getElementById(id)
    if (ele) {
      callBack(ele.offsetTop <= window.scrollY + window.innerHeight)
    }
  }
  window.addEventListener('scroll', handleScroll, false)
  // window.removeEventListener('scroll', handleScroll, false)
  // // document.body.addEventListener('scroll', (e) => {
  // document.getElementById('inner-body').onscroll = (e) => {
  //   const ele = document.getElementById(id)
  //   console.log(e.target?.scrollTop)
  //   if (ele) {
  //     callBack(ele.offsetTop <= e.target?.scrollTop + window.innerHeight)
  //   } else {
  //     document.getElementById('body').onscroll = null
  //   }
  // }
  // }, { capture: true })
  // window.onscroll = () => {
  //   const ele = document.getElementById(id)
  //   if (ele) {
  //     callBack(ele.offsetTop <= window.scrollY + window.innerHeight)
  //   } else {
  //     document.getElementsByTagName('body')[0].onscroll = null
  //   }
  // }
}

export const bottomReached = ({ target }) => {
  return target.offsetHeight + target.scrollTop + 5 >= target.scrollHeight
}

// Image Type check function

export const checkImageType = (e) => {
  try {
    if (e === 'image/png' || e === 'image/jpeg' || e === 'image/jpg' || e === 'image/webp') {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

// Check types of Prediction game type ( Ex. 11Wickets, Dream11)

export const gameType = (data) => {
  switch (data) {
    case 'de':
      return 'Dream 11'
    case 'ew':
      return '11 Wickets'
    default:
      return ''
  }
}

/**
 * Set cookie with expiry date in days.
 * It's only work on client side
 * @param {string} cName cookie name
 * @param {string} cValue cookie value
 * @param {number} exDays exDays should be a number of days
 */
export const setCookie = (cName, cValue, exDays) => {
  if (typeof window !== 'undefined') {
    const d = new Date()
    d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + d.toUTCString()
    document.cookie = cName + '=' + cValue + ';' + expires + ';path=/'
  }
}
/**
 * get cookie value.
 * It's only work on client side
 * @param {string} cName cookie name
 * @returns {string} cookie value
 */
export const getCookie = (cName) => {
  if (typeof window !== 'undefined') {
    const name = cName + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }
}
/**
 * delete all cookies.
 * It's also work on client side
 */
export const clearCookie = () => {
  const cookies = document.cookie.split(';')
  cookies.forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })
}
// platformType option
export const optionsPlatFormType = [
  { value: 'de', label: 'Dream 11' },
  { value: 'ew', label: '11 Wickets' }
]

// league types
export const leagueType = (data) => {
  switch (data) {
    case 'hth':
      return 'Head To Head'
    case 'gl':
      return 'Grand League'
    case 'ml':
      return 'Mega League'
    case 'cs':
      return 'Crictracker Special'
    default:
      return ''
  }
}

// Test String = test-string
export const getStringJoinByDash = (str) => str.toLowerCase().split(' ').join('-')

/**
*(1) = 1,
*(12) = 12,
*(123) = 123,
*(1234) = 1.2K,
*(12345) = 12.3K,
*(123456) = 123.5K,
*(1234567) = 1.2M,
*(12345678) = 12.3M,
*(123456789) = 123.5M
@param {number} n
 */
export const abbreviateNumber = (n) => {
  if (n < 1e3) return n
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K'
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
}

export const stripHtml = (content) => {
  if (content) {
    const str = content.toString()
    return str.replace(/(<([^>]+)>)/gi, '')
  } else return ''
}
/**
 * @description - Capitalize first letter of string For example: 'hello test' => 'Hello Test'
 * @param {string} string
 * @returns {string} string
 */
export const capitalizeFirstLetter = (str) => {
  const arr = str.split(' ')
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }
  return arr.join(' ')
}

export function getFileInfo(file, mime) {
  const pos = file.name.lastIndexOf('.')
  if (mime === 'image/jpeg') {
    const filename = `${String(file.name).substr(0, pos < 0 ? String(file.name).length : pos)}.jpg`
    return {
      filename,
      mime: 'image/jpeg'
    }
  }
  return {
    filename: file.name,
    mime: file.type
  }
}

export const uploadImage = (data) => {
  return Promise.all(data.map((item) => fetch(item.sUploadUrl, { method: 'put', body: item.file })))
}

export const dateCheck = (data) => {
  if (isNaN(Number(data))) {
    return new Date(data)
  } else {
    return new Date(Number(data))
  }
}

/**
 * @description - Get time zone of your machine -> Ex -> 'Asia/Calcutta'
 * @returns {string} string
 */
export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const getDateForOlderThanEighteen = () => {
  const maxYear = Number(new Date().getFullYear()) - 18
  const maxDate = new Date()
  maxDate.setFullYear(maxYear)
  return maxDate.toISOString().split('T')[0]
}
/**
 * Get playing role Enum.
 * @param {string} role Playing role Enum
 * @returns {string} Playing role enum value
 */
export const getPlayerRole = (role) => {
  switch (role) {
    case 'bowl':
      return 'Bowler'
    case 'bat':
      return 'Batter'
    case 'all':
      return 'All Rounder'
    case 'wk':
      return 'Wicket Keeper'
    default:
      return ''
  }
}
/**
 * Map article according to it's type
 * @param {Array of Object} article Article array of object
 * @returns {Array of Object} Mapped article
 */
export const mapArticleData = (data) => {
  const type = ['nList', 'nGrid', 'nMedGrid']
  return data?.map((c) => {
    const ar = []
    const key = c.aArticle ? 'aArticle' : 'aVideos'
    const array = c.aArticle || c?.aVideos
    array.forEach((a) => {
      if (type.includes(a.sType)) {
        if (ar[ar.length - 1]?.sType === a.sType) {
          ar[ar.length - 1] = { ...ar[ar.length - 1], mappedArticle: [...ar[ar.length - 1].mappedArticle, a] }
        } else {
          ar.push({ sType: a.sType, mappedArticle: [a] })
        }
      } else {
        ar.push(a)
      }
    })
    return {
      ...c,
      [key]: ar
    }
  })
}

/**
 * Trim Values
 */
export const trimAllValues = (formData) => {
  Object.keys(formData).forEach((item) => {
    if (typeof formData[item] === 'string') {
      formData[item] = formData[item].trim()
    } else if (typeof formData[item] === 'object') {
      formData[item] = trimAllValues(formData[item])
    } else if (Array.isArray(formData[item])) {
      formData[item] = formData[item].forEach((j) => {
        trimAllValues(j)
      })
    }
  })
  return formData
}

/**
 * Search from array of object
 * @param {Array of Object} data all array of object where you want to search
 * @param {string} searchTxt search text to search
 * @param {string} fieldName for which field you want to search
 * @returns {Array of Object} matched array of object
 */
export const searchFromArray = (data, searchTxt, fieldName) => {
  const searchData = []
  data.filter((item) => {
    item[fieldName].toLowerCase().toString().indexOf(searchTxt.toLowerCase()) > -1 && searchData.push(item)
    return item
  })
  return searchData
}

/**
 * Repalce Large name to Short Name
 * @param Team1 Object
 * @param Team2 Object
 * @param statusNote string
 * @returns Replaced String
 */
export const replaceStringToShort = (teamA, teamB, data) => {
  if (data?.includes(teamA?.sTitle)) {
    return data.replace(teamA?.sTitle, teamA?.sAbbr)
  } else if (data?.includes(teamB?.sTitle)) {
    return data.replace(teamB?.sTitle, teamB?.sAbbr)
  } else {
    return data
  }
}

/**
 * Send an event to the mobile app webView
 * @param event string
 * @developer Kuldip Dobariya
 */
export const sendMobileWebViewEvent = (event) => {
  if (window !== 'undefined') {
    window.addEventListener('message', window?.ReactNativeWebView?.postMessage(event), false)
  }
}

export const badgeColorDecide = (data) => {
  switch (data) {
    case 'live':
      return 'danger'
    case 'completed':
      return 'success'
    case 'scheduled':
      return 'primary'
    default:
      return ''
  }
}
/**
 * Check SEO status code and return object to completable with next js
 * @param data Object
 * @param statusNote string
 * @returns Modified Object
 * @developer Kuldip Dobariya
 */
export const checkRedirectionStatus = (data) => {
  if (data?.eCode) {
    const obj = { redirectStatus: true, eCode: data.eCode }
    if (data?.eCode === 308 || data?.eCode === 307) {
      return {
        ...obj,
        returnObj: { redirect: { permanent: data?.eCode === 301, destination: '/' + data?.sSlug } }
      }
    } else if (data?.eCode === 410 || data?.eCode === 451) {
      return {
        ...obj,
        props: { statusCode: data?.eCode }
      }
    } else return {}
  } else {
    return {
      redirectStatus: false
    }
  }
}

/**
 * Check slug and if found number (1 to 100) in last item then return without slug array and last number
 * @param slug array
 * @returns Object with keys modified slug and number
 * @developer Kuldip Dobariya
 */
export const checkPageNumberInSlug = (slug) => {
  const { slug: mSlug, params } = checkQueryParams(slug)
  const lastSlug = mSlug[mSlug.length - 1]
  const secondLast = mSlug[mSlug.length - 2]
  if (NUMBER1TO10.test(lastSlug)) {
    mSlug.pop()
    return { slug: mSlug, lastSlug, params }
  } else if (secondLast === 'stats') {
    mSlug.pop()
    return { slug: mSlug, secondLast, lastSlug, params }
  } else {
    return { slug: mSlug, lastSlug, params }
  }
}

/**
 * Check query params exists in string of array
 * @param slug string array
 * @returns Array of string
 * @returns Query params
 * @developer Kuldip Dobariya
 */
export const checkQueryParams = (slug) => {
  const toString = slug?.toString()
  if (toString.includes('?')) {
    const params = slug[slug.length - 1]
    slug.pop()
    return { slug, params }
  } else {
    return { slug, params: null }
  }
}

/**
 * Check the api status and return object as per next accept
 * @param error graphql api error
 * @returns object as per next accept
 * @developer Kuldip Dobariya
 */
export const handleApiError = (error) => {
  console.error(error)
  let status
  if (error?.graphQLErrors?.length) status = JSON.parse(error?.graphQLErrors[0]?.extensions?.exception?.message)?.status
  else status = error?.networkError?.statusCode

  if (status === 404) {
    return { notFound: true }
  } else {
    return { props: { error: JSON.stringify(error) } }
  }
}

/**
 * Javascript sort array of objects using array of priority
 * @param data array of object
 * @param order string array (what you want to order it)
 * @param key string (Object key name)
 * @returns order array
 * @developer Kuldip Dobariya
 */
export const arraySortByOrder = ({ data = [], order, key }) => {
  return data.sort((x, y) => order.indexOf(x[key]) - order.indexOf(y[key]))
}

/**
 * Javascript sort string array using array of priority
 * @param data Array of string
 * @param key string (Object key name)
 * @returns order array
 * @developer Kuldip Dobariya
 */
export const stringArraySortByOrder = ({ data = [], order = [] }) => {
  const reverse = order?.reverse()
  return data.sort((a, b) => reverse.indexOf(b) - reverse.indexOf(a))
}

/**
 * Add custom tag inside string HTML below function add tag after 3rd and 5th paragraph
 * @param content String HTML
 * @param paragraph number array (Paragraph number which you want to add ads)
 * @param vAdPosition Video ads position default 0
 * @returns content with custom tag
 * @developer Kuldip Dobariya
 */
export const addAdsInsideParagraph = (content, paragraph = [], vAdPosition = 0) => {
  if (content) {
    let flag = 0
    for (let i = -1; (i = content?.indexOf('</p>', i + 1)) !== -1; i++) {
      if (paragraph.includes(flag)) {
        content =
          content?.slice(0, i + 4) +
          `<div class="mb-4" id="${flag === vAdPosition ? 'video-ads' : `fixed-ads-${flag}`}"></div>` +
          content.slice(i + 4)
      }
      flag++
    }
    return content
  } else return content
}

/**
 * Add custom tag inside string HTML below function add tag after 3rd and 5th paragraph
 * @param content String HTML
 * @param dataSlot3 String Ad data slot path
 * @param dataSlot6 String Ad data slot path
 * @param paragraph number array (Paragraph number which you want to add ads)
 * @returns content with custom tag
 * @developer Kuldip Dobariya
 */
export const addAmpAdsInsideParagraph = (content, dataSlot3, dataSlot6, paragraph = []) => {
  if (content) {
    let flag = 0
    for (let i = -1; (i = content?.indexOf('</p>', i + 1)) !== -1; i++) {
      if (paragraph.includes(flag)) {
        content =
          content?.slice(0, i + 4) +
          `<div style="display: flex; justify-content: center"><amp-ad width="300" height="250" type="doubleclick" data-slot=${
            flag === 2 ? dataSlot3 : dataSlot6
          } id="${flag === 0 ? 'video-ads' : `fixed-ads-${flag}`}"></amp-ad></div>` +
          content.slice(i + 4)
      }
      flag++
    }
    return content
  } else return content
}

/**
 * Replace this <gt-ads>&nbsp;&nbsp;</gt-ads> to this <div id="gt-ads-${n}" class="article-ads"></div>
 * @param str String HTML
 * @returns Modified string html
 * @developer Kuldip Dobariya
 */
export const addEditorAds = (str) => {
  let n = 0
  const N = 2
  return str?.replace(/<gt-ads>&nbsp;&nbsp;<\/gt-ads>+/g, (match) => (n++ < N ? `<div id="gt-ads-${n}" class="article-ads"></div>` : match))
}

/**
 * Check amp is enable from backend or not
 * @param article Article responce from the api
 * @param query next js query object
 * @returns REdirection rule as per next js
 * @developer Kuldip Dobariya
 */
export const isAMPEnable = (article, query) => {
  const obj = { isRedirect: true }
  if (query?.amp && !article?.oAdvanceFeature?.bAmp) {
    return {
      ...obj,
      redirectObj: { redirect: { permanent: true, destination: `/${query?.slug?.join('/')}/` } }
    }
  }
  return { isRedirect: false }
}

/**
 * Convert string query params to object
 * @param params string
 * @returns Query params object
 * @developer Kuldip Dobariya
 */
export const parseParams = (params = '') => {
  const urlParams = new URLSearchParams(params)
  const value = Object.fromEntries(urlParams.entries())
  return value
}

/**
 * check has amp in query param or not
 * @param url string URL
 * @returns REdirection rule as per next js
 * @developer Kuldip Dobariya
 */
export const hasAmpInQueryParams = (urlWithParams = '') => {
  const obj = { hasAmp: true }
  if (CHECK_AMP.test(urlWithParams) && !urlWithParams.includes('_next')) {
    const [url, queryString] = urlWithParams?.split('?')
    const params = parseParams(queryString)
    params.amp = 1
    const queryParams = new URLSearchParams(params).toString()
    return {
      ...obj,
      redirectionRules: { redirect: { permanent: true, destination: `${url}?${queryParams}` } }
    }
  }
  return { hasAmp: false }
}

/**
 * check has mobile web view in params
 * @param req URL request object
 * @param query URL object query
 * @returns token and isMobileWebView flag
 * @developer Kuldip Dobariya
 */
export const hasMobileWebView = (req, query) => {
  return { token: req?.headers?.authorization, isMobileWebView: query?.isMobileWebView }
}

/**
 * Check listicle article current page and if found more than total page redirect to normal page
 * @param Article Article Object as per graph ql
 * @param currentPage listicle article Current page
 * @param url Current page URL
 * @param requestURL Request url with query params if exists
 * @returns Redirection rule as per next js
 * @developer Kuldip Dobariya
 */
export const isListicleArticlePage = (article, currentPage, articleURL, requestURL) => {
  const page = Number(currentPage)
  const obj = { applyRedirection: true }

  if (article?.bIsListicleArticle && !isNaN(page) && (!(article?.oListicleArticle?.nTotal >= page) || page < 2)) {
    const [, queryString] = requestURL?.split('?')
    const params = parseParams(queryString)
    return {
      ...obj,
      redirectionRule: { redirect: { permanent: true, destination: `/${articleURL}/${params?.amp ? '?amp=1' : ''}` } }
    }
  }

  return { applyRedirection: false }
}

/**
 * Add hours into the date
 * @param hour Hours should be the number
 * @param date Date type
 * @returns Modified hours date
 * @developer Kuldip Dobariya
 */
export const addHoursIntoDate = ({ h = 1, d }) => {
  const date = dateCheck(d)
  date.setTime(date.getTime() - h * 60 * 60 * 1000)
  return date
}

/**
 * Convert date in to the YYYY-MM-DD T HH:MM:SS+05:30 (2022-09-19T07:26:55+05:30)
 * @param date Date type
 * @returns Converted date
 * @developer Kuldip Dobariya
 */
export const convertDateToISTWithFormate = (date) => {
  const d = date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  })
  const nd = new Date(d)
  const year = nd.getFullYear()
  const month = nd.getMonth() + 1
  const day = nd.getDate()
  const hour = nd.getHours()
  const minutes = nd.getMinutes()
  const second = nd.getSeconds()
  return `${year}-${addLeadingZeros(month)}-${addLeadingZeros(day)}T${addLeadingZeros(hour)}:${addLeadingZeros(minutes)}:${addLeadingZeros(
    second
  )}+05:30`
}

/**
 * @description get robots txt
 * @returns Robots txt rules
 * @developer Kuldip Dobariya
 */
export const getRobotsTxt = () => {
  if (REACT_APP_ENV === 'production') {
    return `User-Agent: *
Allow: /

Disallow: /search/*
Disallow: /tag/*

Sitemap: https://www.crictracker.com/sitemap.xml
Sitemap: https://www.crictracker.com/news-sitemap.xml`
  } else {
    return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow: /
`
  }
}
