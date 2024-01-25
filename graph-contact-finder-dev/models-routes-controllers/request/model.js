// @ts-check
const mongoose = require('mongoose')
const { GraphDBConnect } = require('../../database/mongoose')
const UserModel = require('../user/model')
const userProfessionModel = require('../user/professionDetails/model')
const Schema = mongoose.Schema
const enums = require('../../enums')

const RequestSchema = new Schema({
  iRequestBy: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
  iRequestTo: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
  iUserProfessionId: { type: mongoose.Schema.Types.ObjectId, ref: userProfessionModel },
  sDescription: { type: String },
  eStatus: { type: String, enum: enums.requestStatus?.value, default: enums.requestStatus?.default }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})
RequestSchema.index({ iRequestBy: 1, iRequestTo: 1 })
module.exports = GraphDBConnect.model('request', RequestSchema)
