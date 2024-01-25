// @ts-check
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { GraphDBConnect } = require('../../database/mongoose')
const UserModel = require('../user/model')
const AdminModel = require('../admin/model')
const NotificationTypesModel = require('./notificationTypes.model')
const ObjectId = mongoose.Types.ObjectId
const { notificationStatus, notificationMode } = require('../../enums')

const NotificationsSchema = new Schema({
  iUserId: { type: ObjectId, ref: UserModel },
  iAdminId: { type: ObjectId, ref: AdminModel },
  sTitle: { type: String },
  sMessage: { type: String },
  eStatus: { type: Number, enum: notificationStatus, default: 0 },
  eMode: { type: Number, enum: notificationMode, default: 1 },
  iType: { type: ObjectId, ref: NotificationTypesModel },
  dExpTime: { type: Date },
  aReadIds: { type: [ObjectId], ref: UserModel, default: [] }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})

NotificationsSchema.index({ iUserId: 1, iType: 1, dExpTime: 1 })

module.exports = GraphDBConnect.model('notifications', NotificationsSchema)
