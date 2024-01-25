import axios from 'axios'

export const range = (start, end) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export const localStorageUserId = localStorage.getItem('userId')
export const userToken = localStorage.getItem('userToken')

export const setParamsForGetRequest = (params) => {
  const paramKeys = Object.keys(params)
  const paramValues = Object.values(params)
  const param = paramKeys.map((key, index) => `${key}=${paramValues[index]}`)
  return `?${param.join('&')}`
}

export const getDirtyFormValues = (dirtyFields, allValues) => {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues
  return Object.fromEntries(Object.keys(dirtyFields).map((key) => [key, getDirtyFormValues(dirtyFields[key], allValues[key])]))
}

export const scrollTop = () => {
  document.body.scrollTop = 0 // For Safari
  document.documentElement.scrollTop = 0
}

export const updateToS3 = async (file, url, key) => {
  let fileUrl = null
  let response = null
  if (file) {
    const blob = new Blob([file], { type: 'text/plain' })
    try {
      response = await axios.put(url, blob)
    } catch (err) {
      console.error('Error on updating file to S3.', err)
    }
    if (response && response.config && response) {
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

export const forceTextInputAsNumber = (e) => {
  isNaN(parseInt(e.key, 10)) && !['Backspace', 'Enter', 'Tab'].includes(e.key) && e.preventDefault()
}

export const forceAsPositiveNumber = (e) => {
  if (['e', 'E', '+', '-'].includes(e.key) || [38, 40].includes(e.which)) {
    e.preventDefault()
  }
}

/**
 * handles card inputs
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

/**
 * checks if the time is past or not
 * @param {Date} date
 * @returns {Boolean}
 */
export const getTimeDiff = (date) => {
  const diff = (Date.parse(new Date(Number(date))) - Date.parse(new Date())) / 1000
  return diff
}

export async function getFileFromUrl(url, name, defaultType = 'image/jpeg') {
  try {
    const response = await fetch(url)
    const data = await response.blob()
    return new File([data], name, {
      type: data.type || defaultType
    })
  } catch (error) {
    console.log(error)
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
  if (num) return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const scrollToId = (id) => {
  return document.getElementById(id).scrollIntoView()
}
