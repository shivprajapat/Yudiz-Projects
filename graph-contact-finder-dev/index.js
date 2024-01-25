const app = require('./app')
const config = require('./config')
app.listen(config.PORT, () => {
  console.log('Server is listening on port no:', config.PORT)
})
