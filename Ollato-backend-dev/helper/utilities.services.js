/* eslint-disable camelcase */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/**
 * Utilities Services is for common, simple & reusable methods,
 * @method {removenull} is for removing null key:value pair from the passed object
 * @method {sendmail} is for generating trasport and sending mail with specified mailOptions Object And returns a promise ex: { from:'', to:'',subject: '', html: '' }
 */

const { messages, status, jsonStatus } = require('./api.responses')
const { PUBLIC_KEY } = require('../config/config-file')
const Crypt = require('hybrid-crypto-js').Crypt
const crypt = new Crypt()
const data = require('../data')
const Sentry = require('@sentry/node')

/**
 * It'll remove all nullish, not defined and blank properties of input object.
 * @param {object}
 */
const removenull = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName]
    }
  }
}

const removenullundefined = (object, body) => {
  for (const key of body) {
    object[key] = !body[key] ? null : body[key]
  }
}

const projectionFields = (body) => {
  const projection = {}
  for (var propName in body) {
    if (body[propName] === null || body[propName] === undefined) {
      projection[propName] = 0
    } else {
      projection[propName] = 1
    }
  }
  return projection
}

const removeDuplicates = (arr) => {
  if (toString.call(arr) === '[object Array]') {
    const uniqueNumbersArray = []
    arr.map(number => {
      if (!uniqueNumbersArray.includes(number)) {
        uniqueNumbersArray.push(number)
      }
    })
    return uniqueNumbersArray
  }
  return []
}

const catchError = (name, error, req, res) => {
  console.error('error', error)
  handleCatchError(error)
  return res.status(status.InternalServerError).jsonp({
    status: jsonStatus.InternalServerError,
    message: messages[req.userLanguage].error,
    module: name
  })
}

const handleCatchError = (error) => {
  if (process.env.NODE_ENV !== 'dev') Sentry.captureMessage(error)
  else return console.log('**********ERROR************', error)
}

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

const checkAlphanumeric = (input) => {
  var letters = /^[0-9a-zA-Z]+$/
  return !!(input.match(letters))
}

const validatePassword = (pass) => {
  // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  const regex = /^[a-zA-Z0-9!@#$%^&*]{6,}$/
  return !!(pass.match(regex))
}

const randomStr = (len, type) => {
  let char = ''
  if (type === 'string') {
    char = '0123456789abcdefghijklmnopqrstuvwxyz'
  } else if (type === 'otp') {
    char = '0123456789'
  }
  let val = ''
  for (var i = len; i > 0; i--) {
    val += char[Math.floor(Math.random() * char.length)]
  }
  if (val.length === len) {
    return val
  } else {
    randomStr(len, type)
  }
}

const capitalizeString = (val) => {
  var capVal = val.toLowerCase().split(' ')
  for (let i = 0; i < capVal.length; i++) {
    capVal[i] = capVal[i].charAt(0).toUpperCase() + capVal[i].substring(1)
  }
  return capVal.join(' ')
}

const defaultSearch = (val) => {
  let search
  if (val) {
    search = val.replace(/\\/g, '\\\\')
      .replace(/\$/g, '\\$')
      .replace(/\*/g, '\\*')
      .replace(/\+/g, '\\+')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/\)/g, '\\)')
      .replace(/\(/g, '\\(')
      .replace(/'/g, '\\\'')
      .replace(/"/g, '\\"')
    return search
  } else {
    return ''
  }
}

const isValidSportsType = (val) => {
  return data.category.find((type) => type === val.toUpperCase())
}

const getPaginationValues = (obj) => {
  let { start = 0, limit = 10, sort = 'created_at', order, search } = obj

  start = parseInt(start)
  limit = parseInt(limit)

  const orderBy = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC'

  if (sort === 'custom_id') { sort = 'id' }

  let sorting = ''
  if (obj.sorting) {
    sorting = [[obj.sorting, orderBy]]
  } else {
    sorting = [[sort, orderBy]]
  }

  search = defaultSearch(search)

  return { start, limit, sorting, search }
}

const getPaginationValues2 = (obj) => {
  const { start = 0, limit = 10, sort = 'dCreatedAt', order, search } = obj

  const orderBy = order && order === 'asc' ? 1 : -1

  const sorting = { [sort]: orderBy }

  return { start, limit, sorting, search }
}

const getStatisticsSportsKey = (categoryName) => {
  if (!data.category.includes(categoryName)) return ''
  return `o${categoryName.charAt(0).toUpperCase()}${categoryName.slice(1).toLowerCase()}`
}

const isUrl = (s) => {
  const regex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/)
  return s && s.match(regex)
}

const chunk = (array, size) => {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    const chunks = array.slice(i, i + size)
    result.push(chunks)
  }
  return result
}

const pushPayload = ({
  title,
  body,
  token,
  dataPayload = {}
}) => {
  return {
    apns: {
      headers: {
        'apns-priority': '10'
      },
      payload: {
        aps: { sound: 'default' }
      }
    },
    android: {
      priority: 'high'
    },
    notification: {
      title: title,
      body: body
    },
    data: {
      sound: 'default',
      priority: 'high',
      ...dataPayload
    },
    token: token
  }
}

const multiCastPushPayload = ({
  tokens,
  dataCast = {}
}) => {
  return {
    apns: {
      headers: {
        'apns-priority': '10'
      },
      payload: {
        aps: { sound: 'default' }
      }
    },
    android: {
      priority: 'high'
    },
    data: {
      sound: 'default',
      priority: 'high',
      ...dataCast
    },
    tokens: tokens
  }
}

const bunchMultiCastNotification = (tokens, pushData, size = 500) => {
  const result = []
  const tokenChunk = chunk(tokens, size)
  for (const token of tokenChunk) {
    result.push(multiCastPushPayload({
      tokens: token,
      data: pushData
    }))
  }
  return result
}

const replaceText = (str, object) => {
  const stringStartSymbol = '{{'
  const stringEndSymbol = '}}'
  if (isEmptyObject(object)) {
    return str
  }
  for (const txt in object) {
    const msg = stringStartSymbol + txt + stringEndSymbol
    str = str.replace(new RegExp(msg, 'g'), object[txt])
  }
  return str
}

const isEmptyObject = (obj) => {
  let result = false
  if (obj && obj.constructor === Object && Object.keys(obj).length === 0) {
    result = true
  }
  return result
}

const encryption = function (field) {
  const encrypted = crypt.encrypt(PUBLIC_KEY, field)
  return encrypted.toString()
}

const changeObjectKey = function (obj, subKey) {
  const keys = Object.keys(obj)
  const result = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    result[`${subKey}${key}`] = obj[key]
  }
  return result
}

const sortArray = function (arr, sortBy) {
  arr.sort(function(a, b) {
    let i = 0; let result = 0
    while (i < sortBy.length && result === 0) {
      result = sortBy[i].direction * (a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0))
      i++
    }
    return result
  })
  return arr
}

async function validateEmail (email) {
  const sRegexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return sRegexEmail.test(email)
}

const getIp = function (req) {
  try {
    let ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',') : []
    ip = ip[0] || req.socket.remoteAddress
    return ip
  } catch (error) {
    handleCatchError(error)
    return req.socket.remoteAddress
  }
}

/**
 * This function will validate mobile number that is 10 digit or not.
 * @param {*} 1234567890 Mobile Number
 * return true if matched result of mobile number otherwise return false.
 */
function validateMobile (mobile) {
  // return !!mobile.match(/^\d{10}$/)
  const sRegexEmail = /^\d{10}$/
  return sRegexEmail.test(mobile)
}

/**
 * to validate pin code
 * @param  {number} pin
 * @return { boolean }
 */
function validatePIN (pin) {
  return /^\d{6}$/.test(pin)
}
async function getUniqueString(len = 8, model) {
  const char = '0123456789abcdefghijklmnopqrstuvwxyz'

  let val = ''
  for (var i = len; i > 0; i--) {
    val += char[Math.floor(Math.random() * char.length)]
  }
  let stringValue = ''
  if (val.length === len) {
    stringValue = val
  } else {
    return getUniqueString(len, model)
  }
  const existCustomId = await model.findOne({ raw: true, where: { custom_id: stringValue } })
  if (existCustomId) {
    return getUniqueString(len, model)
  }
  return stringValue
}

async function getIncrementNumber(type = 'student', id) {
  if (type === 'student' && id === '') {
    id = 'OSC000001'
    return id
  } else if (type === 'counsellor' && id === '') {
    id = 'OCC000001'
    return id
  } else if (type === 'center' && id === '') {
    id = 'OCNC000001'
    return id
  } else if (type === 'admin' && id === '') {
    id = 'OAC000001'
    return id
  }
  const strings = id.replace(/[0-9]/g, '')
  let digits = (parseInt(id.replace(/[^0-9]/g, '')) + 1).toString()
  if (digits.length < 6) { digits = ('00000' + digits).substr(-6) }
  id = strings + digits
  return id
}

module.exports = {
  getUniqueString,
  removenull,
  catchError,
  handleCatchError,
  pick,
  checkAlphanumeric,
  randomStr,
  capitalizeString,
  removeDuplicates,
  isUrl,
  isValidSportsType,
  defaultSearch,
  getPaginationValues,
  projectionFields,
  chunk,
  pushPayload,
  multiCastPushPayload,
  bunchMultiCastNotification,
  replaceText,
  encryption,
  isEmptyObject,
  changeObjectKey,
  sortArray,
  validateEmail,
  getPaginationValues2,
  getIp,
  validateMobile,
  validatePassword,
  getStatisticsSportsKey,
  validatePIN,
  removenullundefined,
  getIncrementNumber
}
