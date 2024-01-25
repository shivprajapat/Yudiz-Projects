const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const SettingSchema = new mongoose.Schema(
  {
    oWebSettings: { type: Object }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)

module.exports = gymDBConnect.model('setting', SettingSchema)
