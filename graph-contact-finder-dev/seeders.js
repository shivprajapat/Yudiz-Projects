// @ts-check
const fs = require('fs')

const notificationTypesModel = require('./models-routes-controllers/notification/notificationTypes.model')

const notificationTypesPath = '../relation-seeders/notificationTypes.json'

async function globeFeeder (sFilePath, Model, flag) {
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

async function fileExist (path, Model, flag) {
  fs.stat(path, async function (err, stat) {
    if (err == null) {
      await globeFeeder(path, Model, flag)
    } else if (err.code === 'ENOENT') {
      console.log('File does not exist at this location')
    } else {
      throw new Error(err)
    }
  })
}

function executeFeeder (flag) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await fileExist(notificationTypesPath, notificationTypesModel, flag)
        resolve()
      } catch (error) {
        console.log(error.message)
      }
    })()
  })
}
executeFeeder()
