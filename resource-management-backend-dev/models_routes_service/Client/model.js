const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase } = require('../../helper/utilities.services')

const countries = require('../../helper/countryCode')

const Client = Schema({
  sName: { type: String },
  sMobNum: { type: String },
  sEmail: { type: String },
  sCountry: { type: String },
  sCode: { type: String },
  sOtherInfo: { type: String },
  eStatus: { type: String, default: 'Y', enum: status },
  sFlagImage: { type: String },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Client.index({ sEmail: 1 })
Client.index({ sMobNum: 1 })
Client.index({ iCreatedBy: 1 })
Client.index({ iLastUpdateBy: 1 })

Client.pre('save', async function (next) {
  const client = this
  if (client.isModified('sName')) {
    client.sName = camelCase(client.sName)
  }
  if (client.isModified('sCountry')) {
    client.sCode = countries.find(country => country.name === client.sCountry).code
    client.sFlagImage = `https://jr-web-developer.s3.ap-south-1.amazonaws.com/flags/${client.sCode}.png`
  }
  next()
})

Client.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sName = camelCase(this._update.sName)
  }
  if (this._update.sEmail) {
    this._update.sEmail = this._update.sEmail.toLowerCase()
  }
  if (this._update.sCountry) {
    this._update.sCode = countries.find(country => country.name === this._update.sCountry).code
    this._update.sFlagImage = `https://jr-web-developer.s3.ap-south-1.amazonaws.com/flags/${this._update.sCode}.png`
  }
  next()
})

module.exports = ResourceManagementDB.model('clients', Client)
