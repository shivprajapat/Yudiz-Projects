const { status, jsonStatus, messages } = require('./api.response')
const Crypt = require('hybrid-crypto-js').Crypt
const crypt = new Crypt()
const config = require('../config/config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const catchError = (name, error, req, res) => {
  handleCatchError(error)
  return res.status(status.InternalServerError).json({
    status: jsonStatus.InternalServerError,
    message: messages[req.userLanguage].error
  })
}

const handleCatchError = (error) => {
  const { data = undefined, status = undefined } = error.response ?? {}

  if (!status) console.log('**********ERROR***********', error)
  else console.log('**********ERROR***********', { status, data })
}

const decryption = (password) => {
  const decryptedPass = crypt.decrypt(config.PRIVATE_KEY, password)
  return decryptedPass.message
}

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

const hashPassword = async (plainTextPassword) => {
  const salt = await bcrypt.genSalt(10)
  const Hash = await bcrypt.hash(plainTextPassword, salt)
  return Hash
}
const validPassword = async (password, userHash) => {
  const validPassword = await bcrypt.compare(password, userHash)
  return validPassword
}

const encodeToken = (body, expTime) => {
  try {
    return expTime ? jwt.sign(body, config.JWT_SECRET, { expiresIn: expTime }) : jwt.sign(body, config.JWT_SECRET)
  } catch (error) {
    return undefined
  }
}

const decodeToken = (token) => {
  try {
    return jwt.decode(token, config.JWT_SECRET)
  } catch (error) {
    return undefined
  }
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      return err ? err.message : decoded // return true if token expired
    })
  } catch (error) {
    return error ? error.message : error
  }
}

const removenull = (obj) => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName]
    }
  }
}

const getPaginationValues = (obj) => {
  const { page = 0, limit = 5, order = 'desc', sort = '_id', search } = obj

  const orderBy = order === 'desc' ? -1 : 1

  const sorting = { [sort]: orderBy }

  return { page: parseInt(page), limit: parseInt(limit <= 0 ? 1 : limit), sorting, search }
}

async function validateEmail (email) {
  const sRegexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return !!(email.match(sRegexEmail))
}

const addDayToDate = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + parseInt(days))
  date.setHours(0, 0, 0, 0)
  return date
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

module.exports = {
  catchError,
  handleCatchError,
  decryption,
  hashPassword,
  validPassword,
  pick,
  encodeToken,
  decodeToken,
  verifyToken,
  removenull,
  getPaginationValues,
  validateEmail,
  getIp,
  addDayToDate
}
