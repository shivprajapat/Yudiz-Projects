const router = require('express').Router()
const rankingServices = require('./services/ranking')

const pingResponse = (req, res) => res.status(messages.english.statusOk).jsonp({ sStatus: messages.english.statusOk, sMessage: 'ping' })

router.get('/icc-ranking', rankingServices.updateIccRanking)
router.get('/ping', pingResponse)

router.all('*', (req, res) => {
  return res.status(400).jsonp({
    status: 400,
    messages: 'Bad Route'
  })
})
module.exports = router
