import axios from 'axios'

import { SHOW_TOAST } from 'modules/toast/redux/action'
import { store } from 'redux/store'
import { GLB, TOAST_TYPE, ZIP } from 'shared/constants'

export const range = (start, end) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

/**
 * @description gives get request params excluding falsy values
 * @param {Object} params
 * @returns {String} formatted query params
 */
export const setParamsForGetRequest = (params) => {
  const paramKeys = Object.keys(params)
  const paramValues = Object.values(params)
  const param = paramKeys.map((key, index) => {
    if (![null, ''].includes(paramValues[index])) {
      return `${key}=${paramValues[index]}`
    } else {
      return null
    }
  })
  const filteredParams = param.filter((i) => i !== null)
  return `?${filteredParams.join('&')}`
}
/**
 * @description gives changed object with changed field
 * @param {Object} dirtyFields - dirty fields of form
 * @param {Object} allValues - all values of form
 * @returns {Object} changed values
 */
export const getDirtyFormValues = (dirtyFields, allValues) => {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues
  return Object.fromEntries(Object.keys(dirtyFields).map((key) => [key, getDirtyFormValues(dirtyFields[key], allValues[key])]))
}

/**
 * @description scroll to top of page
 */
export const scrollTop = () => {
  document.body.scrollTop = 0 // For Safari
  document.documentElement.scrollTop = 0
}

/**
 * @description update file on aws s3
 * @param {Object} file - file object
 * @param {String} url - s3 url
 * @returns {Object} url with updated file
 */
export const updateToS3 = async (file, url) => {
  let fileUrl = null
  let response = null
  if (file) {
    const fileType = file.name.split('.').at(-1)
    let type

    switch (fileType) {
      case GLB:
        type = 'model/gltf-binary'
        break
      case ZIP:
        type = 'application/zip'
        break
      default:
        type = 'text/plain'
    }

    const blob = new Blob([file], { type })

    try {
      document.body.classList.add('global-loader')
      response = await axios.put(url, blob)
      document.body.classList.remove('global-loader')
    } catch (err) {
      document.body.classList.remove('global-loader')
      store.dispatch({
        type: SHOW_TOAST,
        payload: {
          message: err?.message || 'Error on updating file to S3.',
          type: TOAST_TYPE.Error
        }
      })
    }
    if (response?.config) {
      fileUrl = response.config.url.split('?')[0]
    }
  }
  return fileUrl
}

export const getParams = (url) => {
  const params = {}
  const query = url.split('?')[1]
  if (query) {
    query.split('&').forEach((param) => {
      const [key, value] = param.split('=')
      params[key] = value
    })
  }
  return params
}

export const removeParams = (url) => {
  const urlWithoutParams = url.split('?')[0]
  return urlWithoutParams
}

export const addLeadingZeros = (value) => {
  value = String(value)
  while (value.length < 2) {
    value = '0' + value
  }
  return value
}

export const dateCheck = (data) => {
  if (isNaN(Number(data))) {
    return new Date(data)
  } else {
    return new Date(Number(data))
  }
}

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

export const parseParams = (params = '') => {
  const urlParams = new URLSearchParams(params)
  const array = [] // For Array to hold the parameters
  const value = Object.fromEntries(urlParams.entries())
  Object.keys(value).forEach((key) => {
    if (array.includes(key)) {
      value[key] = value[key].split(',')
    }
  })
  return value
}

export const appendParams = (value) => {
  const params = parseParams(window.location.search)
  const data = { ...params, ...value }
  Object.keys(data).filter((e) => (data[e] === '' || !data[e].toString().length) && delete data[e])
  window.history.pushState({}, null, `${window.location.pathname}?${new URLSearchParams(data).toString()}`)
}

export const formatDate = (date) => {
  const d = new Date(date)
  const month = `0${d.getMonth() + 1}`.slice(-2)
  const day = `0${d.getDate()}`.slice(-2)
  const year = d.getFullYear()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const formatToIso = (date) => {
  const d = new Date(date)
  return d.toISOString()
}

export const forceTextInputAsNumber = (e) => {
  isNaN(parseInt(e.key, 10)) && !['Backspace', 'Enter', 'Tab'].includes(e.key) && e.preventDefault()
}

export const forceAsPositiveNumber = (e) => {
  if (['e', 'E', '+', '-'].includes(e.key) || [38, 40].includes(e.which)) {
    e.preventDefault()
  }
}

/**
 * @description handles card inputs
 * @param {Event} e keyup event
 * @param {Boolean} isExpiryDate boolean to check the field is expiry date or not
 * @returns {Value} card format XXXX XXXX XXXX XXXX and XX/XX
 */
export const handleCardKeyUp = (e, isExpiryDate) => {
  const spaces = isExpiryDate ? 2 : 4
  const { target } = e
  if (target.value === target.lastValue) return
  let caretPosition = target.selectionStart
  const sanitizedValue = target.value.replace(/[^0-9]/gi, '')
  const parts = []

  for (let i = 0, len = sanitizedValue.length; i < len; i += spaces) {
    parts.push(sanitizedValue.substring(i, i + spaces))
  }

  for (let i = caretPosition - 1; i >= 0; i--) {
    const c = target.value[i]
    if (c < '0' || c > '9') {
      caretPosition--
    }
  }
  caretPosition += Math.floor(caretPosition / spaces)

  target.value = target.lastValue = parts.join(isExpiryDate ? '/' : ' ')
  target.selectionStart = target.selectionEnd = caretPosition
}

// 12 jan 2021
export const convertDateToLocaleString = (date) => {
  const t = new Date(Number(date))
  const Day = t.getDate()
  const Month = t.toLocaleString('en-us', { month: 'short' })
  const Year = t.getFullYear()
  return Day + ' ' + Month + ' ' + Year
}

// Jan-12-2021
export const convertDateToMDY = (date) => {
  const t = new Date(Number(date))
  const Day = t.getDate()
  const Month = t.toLocaleString('en-us', { month: 'short' })
  const Year = t.getFullYear()
  return Month + '-' + Day + '-' + Year
}

/**
 * @param {Date} date -- timestamp
 * @returns difference between two dates
 */
export const getTimeDiff = (date) => {
  const diff = (Date.parse(new Date(Number(date))) - Date.parse(new Date())) / 1000
  return diff
}

export async function getFileFromUrl(url, name, defaultType = 'image/jpeg') {
  try {
    document.body.classList.add('global-loader')
    const response = await fetch(url)
    const data = await response.blob()
    document.body.classList.remove('global-loader')
    return new File([data], name, {
      type: data.type || defaultType
    })
  } catch (error) {
    document.body.classList.remove('global-loader')
    console.error(error?.message)
    // store.dispatch({
    //   type: SHOW_TOAST,
    //   payload: {
    //     message: error?.message || 'Error on getting the file from url.',
    //     type: TOAST_TYPE.Error
    //   }
    // })
  }
}

export const getNetworkSymbol = (network) => {
  switch (network) {
    case 'Ethereum':
      return 'ETH'
    case 'Polygon':
      return 'MATIC'
    case 'Solana':
      return 'SOL'
    default:
      return 'ETH'
  }
}

export const getStringWithCommas = (num) => {
  let value = null
  if (num) {
    const numberValues = num.toString().split('.')
    if (numberValues[0]) {
      value = numberValues[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    if (numberValues[1]) {
      value = value + '.' + numberValues[1]
    }
    return value
  }
}

/**
 * @param {string} id
 * @returns scroll to provided id element
 */
export const scrollToId = (id) => {
  return document.getElementById(id).scrollIntoView()
}

/**
 * @description debounce to delay network requests
 * @param {Function} -- callback function to be called after the delay
 * @param {Number} -- delay in milliseconds
 * @returns {Function} -- debounced function
 */
export const debounce = (callbackFn, delay = 500) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callbackFn(...args)
    }, delay)
  }
}

/**
 * @description - Get time zone of your machine -> Ex -> 'Asia/Calcutta'
 * @returns {string} string
 */
export const getTimeZone = () => {
  let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (timezone === 'Asia/Kolkata') {
    timezone = 'Asia/Calcutta'
  }
  return timezone
}

export const getQueryVariable = (variable) => {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return null
}

export const orderStatus = {
  PENDING: 0,
  ADDRESS_SAVED: 1,
  PAYMENT_NOT_STARTED: 2,
  PAYMENT_PENDING: 3,
  PAYMENT_SUCCESS: 4,
  PAYMENT_FAILED: 5,
  AUCTION_PAYMENT_SUCCESS: 6,
  AUCTION_INPROGRESS: 7,
  AUCTION_ORDER_SUCCESS: 8,
  TRANSFER_NFT_SUCCESS: 9,
  TRANSFER_NFT_FAILED: 10,
  CANCELLED: 11,
  TRANSFER_NFT_PENDING: 12,
  REFUND_PAYMENT_PENDING: 13,
  REFUND_PAYMENT_SUCCESS: 14,
  REFUND_PAYMENT_FAILED: 15,
  COMPLETED: 16,
  INCOMPLETE: 17,
  MANUAL_LOGISTICS_SELECTED: 18,
  AUTOMATED_LOGISTICS_SELECTED: 19,
  PACKAGE_PACKED: 20,
  PACKAGE_POSTED: 21,
  PACKAGE_IN_TRANSIT: 22,
  PACKAGE_OUT_FOR_DELIVERY: 23,
  PACKAGE_DELIVERED: 24,
  PACKAGE_NOT_DELIVERED: 25,
  BUYER_CONFIRMED_PACKAGE_DELIVERED: 26,
  BUYER_CONFIRMED_PACKAGE_NOT_DELIVERED: 27
}

export const bytesToSize = (bytes = 0) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

export const resetParams = (url) => {
  window.history.pushState({}, null, `${window.location.pathname}`)
}
