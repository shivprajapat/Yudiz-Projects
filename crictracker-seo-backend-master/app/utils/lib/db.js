const mongoose = require('mongoose')
const staticSeo = require('../../../seos.json')
const { DB_URL, CONNECTION } = require('.././../../config')
const db = {}

db.initialize = () => {
  try {
    mongoose
      .connect(DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        maxPoolSize: CONNECTION,
        readPreference: 'secondaryPreferred'
      })
      .then(() => {
        console.log('Database Connected')
      })
      .catch((error) => {
        console.log('Connection Error', error)
      })
    staticSeo.forEach(async (ele) => {
      const count = await mongoose.models?.seos.countDocuments({ sSlug: ele?.sSlug })
      if (!count) await mongoose.models?.seos.create(ele)
    })
    mongoose.syncIndexes().then(() => { }).catch(() => { })
  } catch (error) {
    return error
  }
}

module.exports = db
