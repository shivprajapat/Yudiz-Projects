/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/**
 * Utilities Services is for common, simple & reusable methods,
 */

const { messages, status, jsonStatus } = require('./api.responses')
const { PUBLIC_KEY } = require('../config/config')
const Crypt = require('hybrid-crypto-js').Crypt
const crypt = new Crypt()
const Sentry = require('@sentry/node')
const { imageFormat } = require('../data')

/**
 * It'll remove all nullish, not defined and blank properties of input object.
 * @param {object}
 */
const removenull = (obj) => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName]
    }
  }
}

const getPaginationValues2 = (obj) => {
  const { start = 0, limit = 10, sort = 'dCreatedAt', order, search } = obj

  const orderBy = order && order === 'asc' ? 1 : -1

  const sorting = { [sort]: orderBy }

  return { start, limit, sorting, search }
}

const catchError = (name, error, req, res) => {
  handleCatchError(error)
  return res.status(status.InternalServerError).jsonp({
    status: jsonStatus.InternalServerError,
    message: messages[req.userLanguage].error
  })
}

const handleCatchError = (error) => {
  if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
  console.log('**********ERROR***********', error)
}

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

const encryption = function (field) {
  const encrypted = crypt.encrypt(PUBLIC_KEY, field)
  return encrypted.toString()
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
 * to convert string / number to fix length decimal value
 * @param  {number || string} number
 * @param  {number} length=2
 * @return  {number}
 */
const convertToDecimal = (number, length = 2) => Number(parseFloat(number).toFixed(length))

function checkValidImageType (sFileName, sContentType) {
  const extension = sFileName.split('.').pop().toLowerCase()
  const valid = imageFormat.find(format => format.extension === extension && format.type === sContentType)
  return !!valid
}

module.exports = {
  removenull,
  catchError,
  handleCatchError,
  pick,
  encryption,
  getIp,
  convertToDecimal,
  getPaginationValues2,
  checkValidImageType
}
