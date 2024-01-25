const { body, validationResult } = require('express-validator')
const { messages, _ } = require('../../global/index')
const { SubscriptionEnums } = require('../subscriptions')

const clientStore = [
  body('sName').not().isEmpty(),
  body('sUsername').not().isEmpty().custom(b => _.checkAlphanumeric(b)),
  body('sEmail').not().isEmpty().isEmail(),
  body('aSubscriptionType').custom(b => _.isArray(b) && b.length > 0 && b.every(v => SubscriptionEnums.eSubscriptionType.value.includes(v))),
  body('dSubscriptionStart').not().isEmpty(),
  body('dSubscriptionEnd').not().isEmpty(),
  body('nApiTotal').not().isEmpty(), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(messages.status.statusUnprocessableEntity).jsonp({ status: messages.status.statusUnprocessableEntity, errors: errors.array() })
    return next()
  }
]

const clientLogin = [
  body('sLogin').not().isEmpty(),
  body('sPassword').not().isEmpty(), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(messages.status.statusUnprocessableEntity).jsonp({ status: messages.status.statusUnprocessableEntity, errors: errors.array() })
    return next()
  }
]

const clientChangePassword = [
  body('sOldPassword').not().isEmpty(),
  body('sNewPassword').not().isEmpty(), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(messages.status.statusUnprocessableEntity).jsonp({ status: messages.status.statusUnprocessableEntity, errors: errors.array() })
    return next()
  }
]

const clientForgotPassword = [
  body('sLogin').not().isEmpty(), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(messages.status.statusUnprocessableEntity).jsonp({ status: messages.status.statusUnprocessableEntity, errors: errors.array() })
    return next()
  }
]

const clientResetPassword = [
  body('sVerificationToken').not().isEmpty(),
  body('sPassword').not().isEmpty(), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(messages.status.statusUnprocessableEntity).jsonp({ status: messages.status.statusUnprocessableEntity, errors: errors.array() })
    return next()
  }
]

const getGeneralApiStats = (req, res, next) => {
  try {
    const { nSkip, nLimit, dFetchStart, dFetchEnd } = req.query

    if (!nSkip) req.query.nSkip = 0
    if (!nLimit) req.query.nLimit = 10

    if ((dFetchStart || !dFetchEnd) || (!dFetchStart || dFetchEnd)) return res.status(419).send({ sMessage: 'Date filter missing' })
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).send({ sMessage: 'Dakkho thai gyo' })
  }
}

module.exports = {
  clientStore,
  clientLogin,
  clientChangePassword,
  clientForgotPassword,
  clientResetPassword,
  getGeneralApiStats
}
