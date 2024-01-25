const { Crypt } = require('hybrid-crypto-js')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const https = require('https')
const mongoose = require('mongoose')
const queryString = require('querystring')
const http = require('http')
const { redis } = require('../../app/utils')
const { AuthenticationError } = require('apollo-server-errors')

const crypt = new Crypt()

const _ = {}

const config = {
  BASE_URL: process.env.BASE_URL,
  VERIFICATION_CODE_LENGTH: process.env.VERIFICATION_CODE_LENGTH,
  JWT_SECRET: process.env.JWT_SECRET
}

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
 * Makes an hash for the password.
 * @param {*} password String
 * @returns encrypted password.
 */

_.encryptPassword = function (password) {
  return crypto.createHmac('sha256', config.JWT_SECRET).update(password).digest('hex')
}

/**
 * Asymmetric encrypt for an string
 * @param {*} sValue String
 * @returns envrypted string
 */

_.asymmetricEncrypt = function (sValue) {
  try {
    return crypt.encrypt(process.env.PUBLIC_KEY, sValue)
  } catch (error) {
    return error
  }
}

/**
 * Asymmetric decrypt for an string
 * @param {*} sValue encrypted string
 * @returns decrypted string
 */

_.asymmetricDecrypt = function (sValue) {
  try {
    return crypt.decrypt(process.env.PRIVATE_KEY, sValue)
  } catch (error) {
    return error
  }
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
    const ipLimit = await redis.redisAuthDb.incr(`${path}:${ip}`)
    if (ipLimit > threshold) {
      return { status: 'Limit reached' }
    } else {
      const ttl = await redis.redisAuthDb.ttl(`${path}:${ip}`)
      if (ttl === -1) {
        await redis.redisAuthDb.expire(`${path}:${ip}`, time)
      }
      return { status: 'Limit remaining' }
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
    return expTime ? jwt.sign(body, config.JWT_SECRET, { expiresIn: expTime }) : jwt.sign(body, config.JWT_SECRET)
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

_.axios = function (option, callback = () => { }) {
  return axios(option)
    .then((response) => callback(null, _.parse(response.data)))
    .catch((error) => callback(error.message))
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
 * This checks the validation of the account number.
 * @param {*} accountNumber account number in string.
 * @returns true or false depending on whether account number is right or not.
 */

_.isAccountNumber = function (accountNumber) {
  const regeX = /^\d{9,18}$/
  return !regeX.test(accountNumber)
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
 * @param {*} message the message that we want to pass to FE
 * @param {*} data the data that we want to pass to FE
 * @param {*} prefix prefix if you want to replace anything from the message
 * @param {*} language language that FE asks
 * @returns the formatted message.
 */

_.resolve = (message, data, prefix, context) => {
  const { userLanguage } = context
  const response = { sMessage: messages[userLanguage][message] }

  if (data) Object.assign(response, data)
  if (prefix) response.sMessage = response.sMessage.replace('##', messages[userLanguage][prefix])

  return response
}

/**
 * Checks whether the slug is valid or not.
 * @param {*} slug the slug that we want to check.
 * @returns true or false checking whether the slug is valid or not
 */

_.isSlug = (slug) => {
  const regeX = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/
  return !regeX.test(slug)
}

/**
 * This is used to throw error formattedly.
 * @param {*} message error message
 * @param {*} language language of the client.
 * @param {*} prefix replace anything with prefix if there.
 */

_.throwError = (message, context, prefix) => {
  const { userLanguage } = context

  let response = messages[userLanguage][message]
  if (prefix) response = response.replace('##', messages[userLanguage][prefix])
  if (message === 'authorizationError' || message === 'accountDeactivated' || message === 'accountDeactivated') throw new AuthenticationError(_.stringify({ message: response }))

  throw new Error(_.stringify({ message: response }))
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

_.stripHtml = (content) => {
  const str = content.toString()
  return str.replace(/(<([^>]+)>)/ig, '')
}

module.exports = _
