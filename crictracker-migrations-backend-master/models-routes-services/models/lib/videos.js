const mongoose = require('mongoose')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const videos = new mongoose.Schema(
  {
    sKey: { type: String, required: true },
    iPlaylistId: { type: mongoose.Types.ObjectId, ref: 'playlists' },
    bHasCustomThumbnail: { type: Boolean, default: false },
    bIsLicensedContent: { type: Boolean, default: false },
    sCaption: { type: String, trim: true },
    sDefinition: { type: String, trim: true },
    sDimension: { type: String, trim: true },
    sDuration: { type: String },
    nDurationSeconds: { type: Number },
    dPublishDate: { type: Date },
    sTitle: { type: String, required: true, trim: true },
    sDescription: { type: String, trim: true },
    aThumbnails: { type: Array },
    sThumbnailUrl: { type: String, trim: true },
    sThumbnailWidth: { type: String, trim: true },
    sThumbnailHeight: { type: String, trim: true },
    aTags: { type: Array },
    oStatus: {
      sUploadStatus: { type: String },
      sFailureReason: { type: String },
      sRejectionReason: { type: String },
      sPrivacyStatus: { type: String },
      dPublishDate: { type: Date },
      sLicense: { type: String },
      bIsEmbeddable: { type: Boolean, default: false },
      bIsPublicStatsViewable: { type: Boolean, default: false },
      bIsMadeForKids: { type: Boolean, default: false },
      bIsSelfDeclaredMadeForKids: { type: Boolean, default: false }
    },
    oStats: {
      nViewCount: { type: Number },
      nLikeCount: { type: Number },
      nDislikeCount: { type: Number },
      nFavoriteCount: { type: Number },
      nCommentCount: { type: Number }
    },
    oPlayer: {
      sEmbedHtml: { type: String },
      sEmbedUrl: { type: String },
      sEmbedHeight: { type: String },
      sEmbedWidth: { type: String }
    },
    iCategoryId: { type: mongoose.Types.ObjectId, ref: 'categories' },
    iParentId: { type: mongoose.Types.ObjectId, ref: 'categories' },
    oPgToken: {
      bFPage: { // isFirstPage
        type: Boolean
      },
      sPgToken: {
        type: String
      }
    },
    eStatus: {
      type: String
    },
    nViewCount: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sKey: 1, sTitle: 1 }).index({ dCreated: -1 })

videos.index({ iPlaylistId: 1 })

videos.virtual('oPlaylist', {
  ref: 'playlists',
  localField: 'iPlaylistId',
  foreignField: '_id',
  justOne: true
})

videos.virtual('oCategory', {
  ref: 'categories',
  localField: 'iCategoryId',
  foreignField: '_id',
  justOne: true
})

module.exports = ArticleDBConnect.model('videos', videos)
