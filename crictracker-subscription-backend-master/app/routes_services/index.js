const router = require('express').Router()

router.all('*', (req, res) => {
  return res.status(400).jsonp({
    status: 400,
    messages: 'Bad Route'
  })
})
module.exports = router
