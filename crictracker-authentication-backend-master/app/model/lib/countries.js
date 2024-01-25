const mongoose = require('mongoose')

const country = new mongoose.Schema({
  sId: { type: String, trim: true },
  sSortName: { type: String, trim: true },
  sName: { type: String, trim: true }
}).index({ sId: 1, sName: 1 })

country.index({ sName: 1, sSortName: 1 })

const model = mongoose.model('countries', country)
module.exports = model
