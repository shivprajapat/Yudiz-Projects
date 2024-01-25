const express = require('express')
const config = require('./config/config-file')
const cron = require('node-cron')
const cors = require('cors')
const { packageExpire, studentImportAdmin, studentImportCenter, testArchive } = require('./helper/cron.task')
const http = require('http')
const morgan = require('morgan')
const { getStudentTestReport } = require('./models-routes-services/student/test/services')
const ReportGenerationModel = require('./models-routes-services/student/test/test_report/report.generation.model')
const { handleCatchError } = require('./helper/utilities.services')

const app = express()
global.appRootPath = __dirname

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Verification', 'x-forwarded-for'],
  exposedHeaders: ['Authorization', 'Verification', 'x-forwarded-for']
}

app.use(morgan('dev', { skip: (req) => req.path === '/ping' || req.path === '/favicon.ico' }))

require('./middlewares/index')(app)

require('./middlewares/routes')(app)

// Function to serve all static files
// inside public directory.
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.use(cors(corsOptions))

// httpServer = http.Server(app);

// app.listen(config.PORT, () => {
//   console.log('Magic happens on port :' + config.PORT)
// })

app.use((error, req, res, next) => {
  console.log(error)
  const message = `This is unexpected field -> "${error.field}"`
  console.log(message)
  return res.status(500).send(message)
})

cron.schedule('0 0 * * *', () => {
  // console.log('running a task every day 12 am')
  packageExpire()
})

cron.schedule('0 2 * * *', () => {
  // console.log('running a task every day 12 am')
  testArchive()
})

cron.schedule('*/2 * * * *', () => {
  // console.log('running a task every 10 min')
  studentImportAdmin()
})

cron.schedule('*/10 * * * *', () => {
  // console.log('running a task every 10 min')
  studentImportCenter()
})

setInterval(async () => {
  try {
    const customId = await ReportGenerationModel.findOne({ raw: true, where: { is_generated: false } })
    if (customId) {
      const isFinishedTest = await getStudentTestReport(customId.test_custom_id)
      if (isFinishedTest) {
        await ReportGenerationModel.update({ is_generated: true }, { where: { id: customId.id } })
      } else {
        console.log('Error while generating report')
      }
    }
  } catch (error) {
    return handleCatchError(error)
  }
}, 2000)

const httpServer = http.createServer(app)
httpServer.timeout = 2000000000
httpServer.listen(config.PORT, '0.0.0.0', () => console.log('Magic happens on port :' + config.PORT))

module.exports = app
