/* eslint-disable no-useless-escape */
const axios = require('axios')
const crypto = require('crypto')
const fs = require('fs')
const http = require('http')
const https = require('https')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const queryString = require('querystring')
const Sentry = require('@sentry/node')
const { redis: { redisFeedDb } } = require('../../utils')
const errorLogs = fs.createWriteStream('error.log', { flags: 'a' })
const messages = require('./messages')

const _ = {}
const config = require('../../config')

/**
 * Takes any stringified JSON object and parses
 * @param {*} data JSON string
 * @returns parsed JSON object
 */

_.parse = function (data) {
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

/**
 * This stringifies the JSON object
 * @param {*} data JSON object
 * @returns stringify the JSON object
 */

_.stringify = function (data) {
  return JSON.stringify(data)
}

/**
 * Deep clones an object || array
 * @param {*} data object || array
 * @returns deep cloned object or an array
 */

_.deepClone = function (data) {
  const originalData = !!data.toObject || !!data._doc ? data._doc : data
  if (originalData.constructor === Object) return this.cloneObject(originalData)
  if (originalData.constructor === Array) return this.cloneArray(originalData)
  return originalData
}

/**
 * Convertes normal id to ObjectId
 * @param {*} id stringId
 * @returns Object Id
 */

_.mongify = function (id) {
  return mongoose.Types.ObjectId(id)
}

/**
 * Clones an object
 * @param {*} object Object
 * @returns cloned object
 */

_.cloneObject = function (object) {
  const newData = {}
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; i += 1) {
    const eType = object[keys[i]] ? object[keys[i]].constructor : 'normal'
    switch (eType) {
      case 'normal':
        newData[keys[i]] = object[keys[i]]
        break
      case Array:
        newData[keys[i]] = this.cloneArray(object[keys[i]])
        break
      case Object:
        newData[keys[i]] = this.cloneObject(object[keys[i]])
        break
      default:
        newData[keys[i]] = object[keys[i]]
        break
    }
  }
  return newData
}

/**
 * Clones an array
 * @param {*} array
 * @returns cloned array
 */

_.cloneArray = function (array) {
  const newData = []
  for (let i = 0; i < array.length; i += 1) {
    const eType = array[i] ? array[i].constructor : 'normal'
    switch (eType) {
      case 'normal':
        newData.push(array[i])
        break
      case Array:
        newData.push(this.cloneArray(array[i]))
        break
      case Object:
        newData.push(this.cloneObject(array[i]))
        break
      default:
        newData.push(array[i])
        break
    }
  }
  return newData
}

_.clone = function (data = {}) {
  const originalData = data.toObject ? data.toObject() : data // for mongodb result operations
  const eType = originalData ? originalData.constructor : 'normal'
  if (eType === Object) return { ...originalData }
  if (eType === Array) return [...originalData]
  return data
  // return JSON.parse(JSON.stringify(data))
}

/**
 * helps picking the particular keys-values from an object
 * @param {*} obj input object
 * @param {*} array an array of to be picked variables
 * @returns picked variables stored in an variable
 */

_.pick = function (obj, array) {
  const clonedObj = this.clone(obj)
  return array.reduce((acc, elem) => {
    if (elem in clonedObj) acc[elem] = clonedObj[elem]
    return acc
  }, {})
}

/**
 * Gets a formatted recent date
 * @returns Date in format Oct 26, 2021, 1:12 PM
 */

_.formattedDate = function () {
  return new Date().toLocaleString('en-us', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

/**
 * Api rate limiter for all the apis in redis
 * @param {*} ip IP of the user
 * @param {*} path the api path
 * @param {*} threshold the limit the api is called
 * @param {*} time the time when the restriction over
 * @returns Object with status
 */

_.apiRateLimiter = async (ip, path, threshold, time) => {
  try {
    const ipLimit = await redisFeedDb.incr(`${path}:${ip}`)
    if (ipLimit > threshold) {
      return 'LIMIT_REACHED'
    } else {
      const ttl = await redisFeedDb.ttl(`${path}:${ip}`)
      if (ttl === -1) {
        await redisFeedDb.expire(`${path}:${ip}`, time)
      }
      return 'LIMIT_REMAIN'
    }
  } catch (error) {
    return error
  }
}

/**
 * Makes the salt of the string
 * @param {*} length the length of the salt
 * @param {*} type type of the input
 * @returns salt
 */

_.salt = function (length, type) {
  if (process.env.NODE_ENV !== 'prod') return 1234
  if (type === 'string') {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
  }

  let min = 1
  let max = 9
  for (let i = 1; i < length; i += 1) {
    min += '0'
    max += '9'
  }
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Gives a random number of size provieded size means length
 * @param {*} size Size of the number length
 * @returns gives the number with the size provieded
 */

_.randomCode = function (size) {
  const code = Math.floor(Math.random() * 100000 + 99999).toString()
  return code.slice(code.length - size)
}

/**
 * For signing jwt token
 * @param {*} body the body you want to encode
 * @param {*} expTime the expire time of the token
 * @returns signed jwt token
 */

_.encodeToken = function (body, expTime) {
  try {
    return expTime ? jwt.sign(this.clone(body), config.JWT_SECRET, { expiresIn: expTime }) : jwt.sign(this.clone(body), config.JWT_SECRET)
  } catch (error) {
    return undefined
  }
}

// _.decodeToken = function (token) {
//   try {
//     return jwt.decode(token, config.JWT_SECRET)
//   } catch (error) {
//     return undefined
//   }
// }

/**
 * Gives the decoded token with error if expired
 * @param {*} token signed jwt token
 * @returns decoded tone or error with expired
 */

_.decodeToken = function (token) {
  try {
    return jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
      return err ? err.message : decoded // return true if token expired
    })
  } catch (error) {
    return error ? error.message : error
  }
}

/**
 * This is used to send http request.
 * @param {*} body the body of the request.
 * @param {*} options options for the request.
 * @param {*} callback callback to get data.
 */

_.request = function (body, options, callback) {
  const httpRequest = options.isSecure ? https : http
  delete options.isSecure
  const req = httpRequest.request(options, function (res) {
    const chunks = []

    res.on('data', (chunk) => chunks.push(chunk))
    res.on('error', (error) => callback(error))
    res.on('end', () => callback(null, _.parse(Buffer.concat(chunks))))
  })

  const requetsBody = options.headers['Content-Type'] === 'application/x-www-form-urlencoded' ? queryString.stringify(body) : _.stringify(body)
  req.write(requetsBody)
  req.end()
}

/**
 * To send request using axios
 * @param {*} option Options for axios request
 * @param {*} callback get data using callback
 */

_.axios = async function (option) {
  const axiosRequest = await axios(option)
  return axiosRequest.data
}

/**
 * This checks the validation of the email.
 * @param {*} email the email string
 * @returns true or false depending on whether email is right or not.
 */

_.isEmail = function (email) {
  const regeX = /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
  return !regeX.test(email)
}

/**
 * This checks the validation of the username.
 * @param {*} name username in string.
 * @returns true or false depending on whether username is right or not.
 */

_.isUserName = function (name) {
  // eslint-disable-next-line no-useless-escape
  const regeX = /^[a-z0-9\._-]{3,18}$/
  return !regeX.test(name)
}

/**
 * Check whether the password is alpha numeric
 * @param {*} password the password in string
 * @returns true or false depending on whether password is alphanumeric or not.
 */

_.isPassword = function (password) {
  const regeX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/
  return !regeX.test(password)
}
/**
 * This is to check whether object ids are equal or not.
 * @param {*} id1 objectId or string
 * @param {*} id2 objectId or string
 * @returns true or false depending whether the ids are equal or not.
 */

_.isEqualId = (id1, id2) => (id1 ? id1.toString() : id1) === (id2 ? id2.toString() : id2)

/**
 * to make the response and send to the FE
 * @param {Request} req the message that we want to pass to FE
 * @param {Response} res the message that we want to pass to FE
 * @param {String} message the message that we want to pass to FE
 * @param {String} statusKey the status key that we want to pass to FE
 * @param {object} data the data that we want to pass to FE
 * @param {String} prefix prefix if you want to replace anything from the message
 * @param {object} header the headers that we want to pass to FE
 * @returns {object} the formatted message.
 */

_.response = (req, res, message, statusKey = 'statusOk', data = {}, prefix, header = undefined, customObj = false) => {
  const { userLanguage } = req
  if (customObj) {
    return res.status(messages.status[statusKey]).header(header).send(data)
  } else {
    let responseMessage = messages[userLanguage][message]
    if (prefix) responseMessage = responseMessage?.replace('##', messages[userLanguage][prefix])
    return res.status(messages.status[statusKey]).header(header).send({ status: messages.jsonStatus[statusKey], message: responseMessage, data })
  }
}

/**
 * Checks the validation of isfc code.
 * @param {*} isfc the isfc code.
 * @returns ture or false depending on whether the isfc is valid or not
 */

_.isIsfc = (isfc) => {
  const regeX = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/
  return !regeX.test(isfc)
}

/**
 * Strips html and give back the string data.
 * @param {*} content html content
 * @returns removed html from the string.
 */

_.stripHtml = (content) => {
  const str = content.toString()
  return str.replace(/(<([^>]+)>)/ig, '')
}

/**
 * Gives random element from array.
 * @param {*} array the array you want to choose random from.
 * @returns random element
 */
_.randomFromArray = function (array) {
  return array[Math.floor(Math.random() * array.length)]
}

_.isInvalidStr = function (str) {
  return !str.trim()?.split(' ')?.join('')?.length
}

_.removenull = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName]
    }
  }
}

_.checkAlphanumeric = (input) => {
  var letters = /^[0-9a-zA-Z]+$/
  if (input.match(letters)) return true
  else return false
}

_.isArray = (value) => {
  return Array.isArray(value)
}

_.catchError = (name, error, req, res) => {
  console.log(name, error)
  errorLogs.write(`${name} => ${new Date().toString()} => ${error.toString()}\r\n`)
  Sentry.captureException(error)
  return res.status(messages.status.statusInternalError).jsonp({
    status: messages.jsonStatus.statusInternalError,
    message: messages[req.userLanguage].serverError
  })
}

module.exports = _
