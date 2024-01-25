const router = require('express').Router()
const { getAdminName } = require('./services/admin')

router.get('/fetch-name/:iAdminId?', getAdminName)

router.get('/ping', (req, res) => {
  return res.status(200).send({ sMessage: 'pong' })
})

router.all('*', (req, res) => {
  return res.status(400).jsonp({
    status: 400,
    messages: 'Bad Route'
  })
})

module.exports = router
