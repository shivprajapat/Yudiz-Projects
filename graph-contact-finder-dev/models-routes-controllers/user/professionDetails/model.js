// @ts-check
const mongoose = require('mongoose')
const { GraphDBConnect } = require('../../../database/mongoose')
const userModel = require('../model')
const professionModel = require('../../admin/profession/model')
const cityModel = require('../../admin/city/model')
const enums = require('../../../enums')

const userSchema = new mongoose.Schema({
  iUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: userModel },
  iProfessionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: professionModel },
  aCityIds: [{ type: mongoose.Schema.Types.ObjectId, ref: cityModel }],
  sTitle: { type: String },
  sMobile: { type: String, trim: true },
  sSecondaryMobile: { type: String },
  sEmail: { type: String },
  sWebsiteURL: { type: String },
  sDescription: { type: String },
  eServiceType: { type: String, enums: enums?.serviceType?.value, default: enums?.serviceType?.default },
  eStatus: { type: String, enums: enums?.status, default: enums?.status?.default }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
userSchema.virtual('oProfession', {
  ref: professionModel,
  localField: 'iProfessionId',
  foreignField: '_id'
})

module.exports = GraphDBConnect.model('userProfession', userSchema)
