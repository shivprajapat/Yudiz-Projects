const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { GraphDBConnect } = require('../../../database/mongoose')
const { status } = require('../../../enums')

const citySchema = new Schema({
  sName: { type: String, trim: true, required: true },
  eStatus: { type: String, enum: status?.value, default: status?.default }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})

module.exports = GraphDBConnect.model('city', citySchema)
