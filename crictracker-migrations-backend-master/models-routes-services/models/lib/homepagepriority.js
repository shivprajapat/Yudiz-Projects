const mongoose = require('mongoose')
const { GlobalWidgetDBConnect } = require('../../../db_services/mongoose')

const homePagePriority = new mongoose.Schema(
  {
    iId: {
      type: String,
      required: true
    },
    sName: {
      type: String,
      required: true
    },
    eType: {
      type: String,
      required: true
    },
    nSort: {
      type: Number,
      required: true
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

module.exports = GlobalWidgetDBConnect.model('homepagepriority', homePagePriority)
