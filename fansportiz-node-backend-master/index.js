const express = require('express')

const config = require('./config/config')

const app = express()
global.appRootPath = __dirname

require('./database/mongoose')

require('./helper/grpcServer')

require('./middlewares/index')(app)

require('./middlewares/routes')(app)

require('./helper/grpcServer')

app.listen(config.PORT, () => {
  console.log('Magic happens on port :' + config.PORT)
})

module.exports = app
