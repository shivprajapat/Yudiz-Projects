// @ts-check
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { GraphDBConnect } = require('../../../database/mongoose')
const { status } = require('../../../enums')

const professionSchema = new Schema({
  sName: { type: String, trim: true, required: true },
  iProfessionId: { type: mongoose.Types.ObjectId },
  eStatus: { type: String, enum: status?.value, default: status?.default }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})

professionSchema.index({ sName: 1 })

module.exports = GraphDBConnect.model('profession', professionSchema)
