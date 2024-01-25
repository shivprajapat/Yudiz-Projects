const mongoose = require('mongoose')
const cachegoose = require('recachegoose')
const fs = require('fs')
const { REDIS_HOST, REDIS_PORT } = require('./config/config')
const { handleCatchError } = require('./helper/utilities.services')
const scorePath = '../fantasy-seeders/scorepoints.json'

const paymentOptionPath = '../fantasy-seeders/paymentoptions.json'
const payoutOptionPath = '../fantasy-seeders/payoutoptions.json'
const PaymentOptionModel = require('./models-routes-services/paymentOptions/model')
const PayoutOptionModel = require('./models-routes-services/payoutOptions/model')

require('./database/mongoose')
cachegoose(mongoose, {
  engine: 'redis',
  host: REDIS_HOST,
  port: REDIS_PORT
})

function executeFeeder(flag) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await fileExist(paymentOptionPath, PaymentOptionModel, flag)
        await fileExist(payoutOptionPath, PayoutOptionModel, flag)
        resolve()
      } catch (error) {
        handleCatchError(error)
      }
    })()
  })
}

async function fileExist(path, Model, flag) {
  fs.stat(path, async function(err, stat) {
    if (err == null) {
      await globeFeeder(path, Model, flag)
    } else if (err.code === 'ENOENT') {
      console.log(`File does not exist at this location ${scorePath}`)
    } else {
      throw new Error(err)
    }
  })
}

async function globeFeeder(sFilePath, Model, flag) {
  try {
    if (flag) {
      const feedData = fs.readFileSync(sFilePath)
      const parsedData = JSON.parse(feedData)
      await Model.deleteMany()
      await Model.insertMany(parsedData)
    } else {
      const feedData = fs.readFileSync(sFilePath)
      const parsedData = JSON.parse(feedData)
      const data = await Model.find({}).lean()
      if (!data.length) {
        await Model.insertMany(parsedData)
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

executeFeeder()
