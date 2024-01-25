// @ts-check
const mongoose = require('mongoose')
const { notificationTypeStatus } = require('../../enums')
const Schema = mongoose.Schema
const { GraphDBConnect } = require('../../database/mongoose')

const NotificationTypesSchema = new Schema({
  sHeading: { type: String },
  sDescription: { type: String },
  eStatus: { type: String, enum: notificationTypeStatus, default: 'Y' },
  dCreatedAt: { type: Date, default: Date.now },
  dUpdatedAt: { type: Date }
})

module.exports = GraphDBConnect.model('notificationTypes', NotificationTypesSchema)
