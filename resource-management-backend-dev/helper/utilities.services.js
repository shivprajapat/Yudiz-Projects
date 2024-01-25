/* eslint-disable no-useless-escape */
/* eslint-disable prefer-regex-literals */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */

const { messages, status, jsonStatus } = require('./api.responses')
const config = require('../config/config')
const Crypt = require('hybrid-crypto-js').Crypt
const crypt = new Crypt()
const bcrypt = require('bcrypt')
// const NetWorkModel = require('../models_routes_service/Logs/network.model')

// const { queuePush } = require('../helper/redis')

const removenull = (obj) => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName]
    }
  }
  return obj
}

const contractNameFormate = (name) => {
  return name.split('/').pop().split('_').splice(1).join('_')
}

function convertTOMinutes(data) {
  const time = data.split(':')
  const hour = parseInt(time[0])
  const minute = parseInt(time[1])
  const timeInMinutes = hour * 60 + minute
  return timeInMinutes
}
function convertMinsToHrsMins(minutes) {
  let h = Math.floor(minutes / 60)
  let m = minutes % 60
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  return h + ':' + m
}

const timeValidation = (sTime) => {
  return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(sTime)
}

const interviewTime = (employeeHours, clientHours, inputTime, gape) => {
  const employee = employeeHours.map(item => {
    return convertTOMinutes(item)
  })

  const client = clientHours.map(item => {
    return convertTOMinutes(item)
  })

  const slotMinutes = convertTOMinutes(inputTime)

  const interviewrTimeRange = convertTOMinutes(gape)

  if (slotMinutes + interviewrTimeRange > 1440) {
    return 'Not available'
  }

  if (slotMinutes + interviewrTimeRange < 0) {
    return 'Not available'
  }

  const resultEmployee = []
  const resultClient = []

  for (let i = 0; i < employee.length; i++) {
    if (slotMinutes > employee[i] - interviewrTimeRange && slotMinutes < employee[i] + interviewrTimeRange) {
      resultEmployee.push(employeeHours[i])
    }
  }

  for (let i = 0; i < client.length; i++) {
    if (slotMinutes > client[i] - interviewrTimeRange && slotMinutes < client[i] + interviewrTimeRange) {
      resultClient.push(clientHours[i])
    }
  }

  if (resultEmployee.length === 0 && resultClient.length === 0) {
    return 'OK'
  }
  if (resultEmployee.length > 0 && resultClient.length > 0) {
    return `employee and client are not availbale in ${resultEmployee} time slot`
  }

  if (resultEmployee.length > 0) {
    return `employee are not availbale in ${resultEmployee} time slot`
  }

  if (resultClient.length > 0) {
    return `client are not availbale in ${resultClient} time slot`
  }
}

const removenullundefined = (object, body) => {
  for (const key of body) {
    object[key] = !body[key] ? null : body[key]
  }
}

function makeRandomeString(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

const projectionFields = (body) => {
  const projection = {}
  for (const propName in body) {
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
    // eslint-disable-next-line array-callback-return
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
  handleCatchError(error)
  return res.status(status.InternalServerError).jsonp({
    status: jsonStatus.InternalServerError,
    message: messages[req.userLanguage].error
  })
}

const keygen = (sName) => {
  const sKey = camelCase(sName)
  const key = sKey.toUpperCase().replace(/\s{1,}/g, '')
  return key
}

const permissionKey = (sName) => {
  return sName.split(' ').map((item) => { return item.charAt(0).toUpperCase() + item.slice(1) }).join('_').toUpperCase()
}

const permissionName = (sName) => {
  return sName.split(' ').map((item) => { return item.charAt(0).toUpperCase() + item.slice(1) }).join(' ')
}

const handleCatchError = (error) => {
  if (process.env.NODE_ENV !== 'dev') { console.log('**********ERROR************', error) }
}

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

const projection = (keys) => {
  return keys.reduce((acc, elem) => {
    acc[elem] = 1
    return acc
  }, {})
}

const checkAlphanumeric = (input) => {
  const letters = /^[0-9a-zA-Z]+$/
  return !!(input.match(letters))
}

const validatePassword = (pass) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return !!(pass.match(regex))
}

const isUrl = (s) => {
  const regex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/)
  return s && s.match(regex)
}

const isEmptyObject = (obj) => {
  let result = false
  if (obj && obj.constructor === Object && Object.keys(obj).length === 0) {
    result = true
  }
  return result
}

function validateEmail(email) {
  const sRegexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return !!(email.match(sRegexEmail))
}

function validateEmpId(empId) {
  const sRegexEmpId = /^[A-Za-z0-9 _@.!~/#&+-]{4,12}$/
  return !!(empId.match(sRegexEmpId))
}

function validateMobile(mobile) {
  const regex = /^\d{10}$/
  return mobile.match(regex)
}

function encryption(field) {
  const encrypted = crypt.encrypt(config.PUBLIC_KEY, field)
  return encrypted.toString()
}

const hashPassword = (password) => {
  const hashedPass = bcrypt.hashSync(password, config.SALT)
  return hashedPass
}

const comparePassword = (password, passHash) => {
  const comparedPassword = bcrypt.compareSync(password, passHash)
  return comparedPassword
}

const getIp = function (req) {
  try {
    let ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',') : []

    console.log(ip)

    ip = ip[0] || req.socket.remoteAddress

    console.log(ip)
    return ip
  } catch (error) {
    handleCatchError(error)
    return req.socket.remoteAddress
  }
}

const getPath = function (req) {
  try {
    const path = req.path
    return path
  } catch (error) {
    handleCatchError(error)
    return req.baseUrl
  }
}
const decryption = function (password) {
  const decrypted = crypt.decrypt(config.PRIVATE_KEY, password)
  const decryptedData = decrypted.message
  return decryptedData.toString()
}

const SuccessResponseSender = (res, statusCode = 200, message = 'successfully done', data = []) => {
  return res.status(statusCode).jsonp({
    statusCode,
    message,
    data
  })
}

const ErrorResponseSender = (res, statusCode = 500, message = 'internal server error', data = []) => {
  return res.status(statusCode).jsonp({
    statusCode,
    message,
    data
  })
}

const paginationValue = (value) => {
  const { page = 0, limit = 5, order, sort = 'dCreatedAt', search, eShow = 'OWN' } = value

  const orderBy = order && order === 'asc' ? 1 : -1

  const sorting = { [sort]: orderBy }

  return { page, limit, order, sorting, search, eShow }
}

const camelCase = (str) => {
  return str.toLowerCase().replace(/\s{1,}/g, ' ').split(' ').map(o => o.charAt(0).toUpperCase() + o.slice(1)).join(' ')
}

const searchValidate = (search) => {
  return search.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&')
}

const searchValidateCurrency = (search) => {
  search = search.replace(/[-[\]{}()*+?.,\\/^$|#]/g, '').trim()
  search = search.replace(/\s+/g, ' ').trim()
  return search
}

const isValidNumberForCurrency = (data) => {
  return /[-[\]{}()*+?,\\/^$|#]/g.test(data.toString())
}

const isValidId = (id) => {
  return /^[0-9a-f]{24}$/i.test(id)
}

const getRandomNumber = (limit) => {
  return Math.floor((Math.random() * limit))
}

const getRandomColor = () => {
  const h = getRandomNumber(361)
  return { sTextColor: `hsl(${h}deg, ${65}%, ${50}%)`, sBackGroundColor: `hsl(${h}deg, ${100}%, ${90}%)` }
}

const setBackgroundColor = () => {
  const { sBackGroundColor, sTextColor } = getRandomColor()

  if (sBackGroundColor === `hsl(${208}deg, ${100}%, ${90}%)` && sTextColor === `hsl(${208}deg, ${65}%, ${50}%)`) {
    return setBackgroundColor()
  }

  return { sBackGroundColor, sTextColor }
}

const isValidNumber = (data) => {
  return /^[0-9]*$/.test(data)
}

const checkcolor = (color, arr) => {
  try {
    if (arr.length === 0) return color
    if (arr.find(x => x.sBackGroundColor === color.sBackGroundColor)) {
      return checkcolor(setBackgroundColor(), arr)
    } else {
      return color
    }
  } catch (error) {
    handleCatchError(error)
    const yudizColor = [{ sTextColor: `hsl(${169}deg, ${65}%, ${50}%)`, sBackGroundColor: `hsl(${169}deg, ${100}%, ${90}%)` },
    { sTextColor: `hsl(${285}deg, ${65}%, ${50}%)`, sBackGroundColor: `hsl(${285}deg, ${100}%, ${90}%)` },
    { sTextColor: `hsl(${219}deg, ${65}%, ${50}%)`, sBackGroundColor: `hsl(${219}deg, ${100}%, ${90}%)` },
    { sTextColor: `hsl(${204}deg, ${65}%, ${50}%)`, sBackGroundColor: `hsl(${204}deg, ${100}%, ${90}%)` },
    { sTextColor: `hsl(${6}deg, ${65}%, ${50}%)`, sBackGroundColor: `hsl(${6}deg, ${100}%, ${90}%)` },
    { sTextColor: `hsl(${35}deg, ${65}%, ${50}%)`, sBackGroundColor: `hsl(${35}deg, ${100}%, ${90}%)` }]
    return yudizColor[Math.floor((Math.random() * yudizColor.length))]
  }
}

const formatBytes = (bytes, decimals = 2, k = 1024) => {
  if (bytes === 0) return '0 Bytes'
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const statusValidate = (currentStatus = 'Pending', newStatus) => {
  const status = ['Pending', 'On Hold', 'In Progress', 'Completed', 'Closed']

  if (currentStatus === newStatus) return true
  const obj = {
    Pending: ['On Hold', 'In Progress', 'Closed'],
    'On Hold': ['In Progress', 'Completed', 'Closed'],
    'In Progress': ['On Hold', 'Completed', 'Closed'],
    Completed: ['In Progress'],
    Closed: []
  }

  if (obj[currentStatus].includes(newStatus)) return true
  return false
}

const generateConfig = (url, accessToken) => {
  return {
    method: 'get',
    url,
    headers: {
      Authorization: `Bearer ${accessToken} `,
      'Content-type': 'application/json'
    }
  }
}

const generateConfigPost = (url, data) => {
  return {
    method: 'post',
    url,
    data,
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }
}

const uniqByKeepLast = (data, key) => {
  return [

    ...new Map(

      data.map(x => [key(x), x])

    ).values()

  ]
}

const calculateYear = (yearlyProjects) => {
  if (yearlyProjects.length) {
    for (const y of yearlyProjects) {
      if (y.year === null) {
        yearlyProjects.splice(yearlyProjects.indexOf(y), 1)
      }
    }
  }

  if (yearlyProjects.length === 0) {
    return [new Date().getFullYear()]
  }

  if (yearlyProjects.length === 1) {
    return [yearlyProjects[0].year]
  }

  if (yearlyProjects.length > 1) {
    yearlyProjects.sort((a, b) => b.year - a.year)
    const maxYear = yearlyProjects[0].year
    const minYear = yearlyProjects[yearlyProjects.length - 1].year
    const years = []
    for (let i = minYear; i <= maxYear; i++) {
      years.push(i)
    }
    return years
  }
}

const loggerMiddleware = function (req, res, next) {
  const { method, url, headers } = req

  // Log the request information
  // console.log(`[Request] ${method} ${url}`)
  // console.log('[Request Headers]', headers)

  // eTag for request)

  // Store the original response.end() function
  // const originalEnd = res.end

  // Create a new function to override response.end()
  // res.end = function (chunk, encoding) {
  //   // Log the response information
  //   console.log(`[Response] ${method} ${url}`)
  //   console.log('[Response Headers]', res.getHeaders())
  //   console.log('[Response Body]', chunk && chunk.toString())

  //   // Restore the original response.end() function
  //   res.end = originalEnd

  //   // Call the original response.end() function
  //   res.end(chunk, encoding)
  // }

  // req an res time calculation
  const start = new Date()
  let time = 0
  res.on('finish', async () => {
    const end = new Date()
    time = end.getTime() - start.getTime()
    // console.log(`[Response] ${method} ${url} ${time}ms`)
    // console.log('[Response Headers]', res.getHeaders())
    // reponse status code
    console.log('[Response Status Code]', res.statusCode)
    await NetworkModel.create({
      sUrl: url,
      statusCode: res.statusCode
    })
  })

  // await queuePush('network', { method, url, headers, time })

  // Call the next middleware in the chain
  next()
}

module.exports = {
  removenull,
  catchError,
  handleCatchError,
  pick,
  checkAlphanumeric,
  removeDuplicates,
  isUrl,
  projectionFields,
  isEmptyObject,
  validateEmail,
  validateMobile,
  validatePassword,
  removenullundefined,
  encryption,
  validateEmpId,
  hashPassword,
  comparePassword,
  interviewTime,
  getIp,
  getPath,
  decryption,
  projection,
  keygen,
  SuccessResponseSender,
  ErrorResponseSender,
  paginationValue,
  camelCase,
  searchValidate,
  isValidId,
  convertMinsToHrsMins,
  timeValidation,
  setBackgroundColor,
  isValidNumber,
  checkcolor,
  getRandomColor,
  formatBytes,
  contractNameFormate,
  statusValidate,
  isValidNumberForCurrency,
  searchValidateCurrency,
  generateConfig,
  generateConfigPost,
  uniqByKeepLast,
  permissionKey,
  permissionName,
  makeRandomeString,
  calculateYear
  // loggerMiddleware
}
