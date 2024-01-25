const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')
const { empType } = require('../../data')

const Notification = Schema({
  sHeading: { type: String },
  sMessage: { type: String },
  sUrl: { type: String },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'employees' },
  eEmpType: { type: String, enum: empType, default: 'E' },
  eStatus: { type: String, default: 'Y' },
  aSenderId: { type: [Schema.Types.ObjectId], ref: 'employees', default: [] },
  sType: { type: String },
  aReadIds: { type: [Schema.Types.ObjectId], ref: 'employees', default: [] },
  redirectUrl: { type: String },
  isReadByAll: { type: Boolean, default: false },
  sLogo: { type: String, default: 'Default/magenta_explorer-wallpaper-3840x2160.jpg' },
  metadata: { type: Object, default: {} }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Notification.index({ sHeading: 1 })
Notification.index({ sMessage: 1 })
Notification.index({ aReadIds: 1 })
Notification.index({ iCreatedBy: 1 })
Notification.index({ aSenderId: 1 })

module.exports = ResourceManagementDB.model('Notifications', Notification)
