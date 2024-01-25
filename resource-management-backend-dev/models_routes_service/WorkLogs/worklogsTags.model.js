const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const WorkLogTags = Schema({
  sName: { type: String, default: '' },
  eStatus: { type: String, default: 'Y' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'employees' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'employees' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('worklogtags', WorkLogTags)
