const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { GraphDBConnect } = require('../../database/mongoose')

const PushNotification = new Schema({
  iAdminId: { type: Schema.Types.ObjectId },
  sTitle: { type: String, require: true },
  sDescription: { type: String, require: true },
  dScheduledTime: { type: Date, required: true },
  sTopic: { type: String },
  sUserToken: { type: String }
},
{
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
}
)

module.exports = GraphDBConnect.model('pushNotifications', PushNotification)
