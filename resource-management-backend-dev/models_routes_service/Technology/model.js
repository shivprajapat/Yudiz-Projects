const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const Technology = Schema({
  sName: { type: String },
  sKey: { type: String },
  eStatus: { type: String, default: 'Y', enum: status },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  sBackGroundColor: { type: String, default: 'hsl(285deg, 100%, 90%)' },
  sTextColor: { type: String, default: 'hsl(285deg, 65%, 50%)' },
  sLogo: { type: String, default: 'Technology/1685611880408_ascascac1.jpg' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Technology.index({ sName: 1 })
Technology.index({ sKey: 1 })
Technology.index({ dCreatedAt: 1 })
Technology.index({ iLastUpdateBy: 1 })
Technology.index({ iCreatedBy: 1 })

Technology.pre('save', async function (next) {
  const technology = this
  if (technology.isModified('sName')) {
    technology.sName = camelCase(technology.sName)
  }
  if (technology.isModified('sKey')) {
    technology.sKey = keygen(technology.sName)
  }
  next()
})

Technology.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sName = camelCase(this._update.sName)
  }
  if (this._update.sKey) {
    this._update.sKey = keygen(this._update.sName)
  }
  next()
})

module.exports = ResourceManagementDB.model('technologies', Technology)
