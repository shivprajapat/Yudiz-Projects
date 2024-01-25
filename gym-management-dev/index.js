const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Server is working')
})
const config = require('./config/config')
require('./database/redis')
require('./database/mongoose')
require('./middlewares/index')(app)

require('./middlewares/routes')(app)

app.listen(config.PORT, () => {
  console.log(`Server is running on port :${config.PORT}`)
})

module.exports = app
