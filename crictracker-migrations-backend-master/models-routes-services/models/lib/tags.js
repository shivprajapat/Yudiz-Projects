const mongoose = require('mongoose')
const { eTagType, eTagStatus } = require('../../enums')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const tag = new mongoose.Schema(
  {
    sName: {
      type: String, // note: unique validation removed because it was creating issue when a tag is deleted and same name tag is being created
      required: true,
      trim: true
    },
    sContent: {
      type: String,
      trim: true
    },
    nCount: {
      type: Number,
      default: 0
    },
    eType: {
      type: String,
      enum: eTagType.value,
      default: eTagType.default
    },
    iSubmittedBy: {
      type: mongoose.Schema.Types.ObjectId
    },
    iProcessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins'
    },
    eStatus: {
      type: String,
      enum: eTagStatus.value,
      default: eTagStatus.default
    },
    iId: { type: mongoose.Schema.Types.ObjectId } // playerId, teamId,venueId
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

module.exports = ArticleDBConnect.model('tags', tag)
