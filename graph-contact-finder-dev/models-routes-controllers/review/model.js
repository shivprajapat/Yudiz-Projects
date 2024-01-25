// @ts-check
const mongoose = require('mongoose')
const { GraphDBConnect } = require('../../database/mongoose')
const UserModel = require('../user/model')
const Schema = mongoose.Schema
const enums = require('../../enums')

const reviewSchema = new Schema({
  iReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
  iReviewTo: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
  sDescription: { type: String },
  nRating: { type: Number },
  eStatus: { type: String, enum: enums?.status?.value, default: enums?.status?.default }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})
reviewSchema.index({ iReviewedBy: 1, iReviewTo: 1 })
module.exports = GraphDBConnect.model('review', reviewSchema)
