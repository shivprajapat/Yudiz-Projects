// @ts-check
const utilityServices = {}
const jwt = require('jsonwebtoken')
const config = require('../config')
const { status, message } = require('../responses')
const mobileNumberRegEx = /^[0-9]{10}$/
const passwordRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
const nameRegEx = /^[A-Za-z\s]*$/
const AdminLogModel = require('../models-routes-controllers/admin/logs.model')
const UserLogModel = require('../models-routes-controllers/user/logs.model')
const pushNotificationModel = require('../models-routes-controllers/notification/pushNotification.model')
const FieldModel = require('../models-routes-controllers/admin/profession/model')
const { randomInt } = require('crypto')

utilityServices.jwtSign = (payload, expiresIn) => {
  try {
    const newToken = {
      sToken: jwt.sign(
        payload,
        config?.JWT_SECRET_KEY,
        { expiresIn }
      )
    }
    return newToken
  } catch (error) {
    return error
  }
}

utilityServices.generateRandomData = async (req, limit) => {
  function makeId (length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
                charactersLength))
    }
    return result
  }

  const obj = await utilityServices.getFieldObj()
  const fieldArray = Object.keys(obj)

  const arr = []
  for (let i = 0; i < limit; i++) {
    const number = Math.floor(3000000000 + Math.random() * 80000000)
    const name = makeId(5) + ' ' + makeId(5)
    const eField = fieldArray[Math.floor(Math.random() * (fieldArray.length - 2))]
    const fnRes = obj[eField]
    const eDesignation = fnRes[Math.floor(Math.random() * (fnRes.length - 1))]
    const object = { sName: name, sMobileNumber: number.toString(), eField, eDesignation }
    arr.push(object)
  }
  req.fObj = obj
  return arr
}

utilityServices.checkDuplicate = (arr) => {
  return [...new Set(arr)]
}

utilityServices.pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

utilityServices.removeNull = (object) => {
  for (const propName in object) {
    if (object[propName] === null || object[propName] === undefined || object[propName] === '') {
      delete object[propName]
    }
  }
}

utilityServices.catchError = (req, res) => {
  return res.status(status.InternalServerError).jsonp({
    status: status.InternalServerError,
    message: message[req.userLanguage].InternalServerError
  })
}

utilityServices.getIp = (req) => {
  try {
    let ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',') : []
    ip = ip[0] || req.socket.remoteAddress
    return ip
  } catch (error) {
    return req.socket.remoteAddress
  }
}
utilityServices.defaultSearch = (val) => {
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

utilityServices.getPaginationValues = (obj) => {
  let { nPage = 1, nLimit = 10, sSort = '_id', sOrder, sSearch } = obj
  nPage = parseInt(nPage)
  nLimit = parseInt(nLimit)

  const nOrderBy = sOrder && sOrder === 'asc' ? 1 : -1
  const oSorting = { [sSort]: nOrderBy }
  if (sSearch) sSearch = utilityServices.defaultSearch(sSearch)

  return { nPage, nLimit, oSorting, sSearch }
}

utilityServices.isMobileNumber = (sMobileNumber) => {
  return mobileNumberRegEx.test(sMobileNumber)
}

utilityServices.isValidPassword = (sPassword) => {
  return passwordRegEx.test(sPassword)
}

utilityServices.isValidName = (sName) => {
  return nameRegEx.test(sName)
}
utilityServices.adminLog = async (req, res, logData) => {
  try {
    await AdminLogModel.create({ ...logData })
  } catch (error) {
    utilityServices.catchError(req, res)
  }
}
utilityServices.userLog = async (req, res, logData) => {
  try {
    await UserLogModel.create({ ...logData })
  } catch (error) {
    utilityServices.catchError(req, res)
  }
}

utilityServices.responseMessage = (req, res, Status, Message, Replace, ...args) => {
  try {
    let mes
    if (Replace === '') {
      mes = message[req.userLanguage][Message]
    } else {
      mes = message[req.userLanguage][Message].replace('##', message[req.userLanguage][Replace])
    }
    const st = status[Status]
    if (args.length === 0) {
      return res.status(st).jsonp({
        status: st,
        message: mes
      })
    }
    return res.status(st).jsonp({
      status: st,
      message: mes,
      data: args[0]
    })
  } catch (error) {
    utilityServices.catchError(req, res)
  }
}

utilityServices.savePushNotification = async (obj) => {
  const data = { ...obj, dScheduledTime: new Date() }
  await pushNotificationModel.create(data)
}

utilityServices.getFieldObj = async () => {
  try {
    const fields = await FieldModel.find({}, { _id: 0, sName: 1, aDesignations: 1 })
    const obj = {}
    fields.forEach(e => {
      obj[e.sName] = e.aDesignations
    })
    return obj
  } catch (error) {
    throw new Error(error)
  }
}

function generateNumber (min, max) {
  return randomInt(min, max)
}

utilityServices.generateOTP = (nLength) => {
  const digits = '0123456789'
  let OTP = ''
  for (let i = 0; i < nLength; i++) {
    OTP += digits[generateNumber(0, 10)]
  }
  if (Number(OTP).toString().length !== nLength) {
    return this.generateOTP(nLength)
  }
  return OTP
}

utilityServices.generateGraphKey = (key) => {
  return key.split(' ').join('')
}

utilityServices.arrayToObject = (array, keyField) => {
  return array?.reduce(
    (obj, item) => Object.assign(obj, { [item?.[keyField]]: item }), {})
}

module.exports = utilityServices
