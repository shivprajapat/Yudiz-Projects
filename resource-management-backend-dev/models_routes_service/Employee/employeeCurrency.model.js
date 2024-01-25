const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')
const { status } = require('../../data')
// const { camelCase } = require('../../helper/utilities.services')

const EmployeeCurrency = Schema({
  eStatus: { type: String, default: 'Y', enum: status },
  iEmployeeId: { type: Schema.Types.ObjectId, ref: 'employees' },
  iCurrencyId: { type: Schema.Types.ObjectId, ref: 'currencies' },
  nCost: { type: Number, default: 0 },
  nCostPerMinutes: { type: Number, default: 0 },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'employees' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'employees' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('employeecurrencies', EmployeeCurrency)

EmployeeCurrency.pre('save', async function (next) {
  const employeeCurrency = this
  if (employeeCurrency.isModified('nCost')) {
    employeeCurrency.nCostPerMinutes = employeeCurrency.nCost / 60
  }

  next()
})

EmployeeCurrency.pre('findOneAndUpdate', async function (next) {
  if (this._update.nCost) {
    this._update.nCostPerMinutes = this._update.nCost / 60
  }

  next()
})
