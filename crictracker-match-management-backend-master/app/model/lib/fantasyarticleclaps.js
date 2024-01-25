const mongoose = require('mongoose')
const enums = require('../enums')

const fantasyarticleclaps = new mongoose.Schema({
  iUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  iArticleId: { type: mongoose.Schema.Types.ObjectId, ref: 'fantasyarticles' },
  nClapCount: {
    type: Number
  },
  eStatus: {
    type: String,
    enum: enums.eStatus.value,
    default: enums.eStatus.default
  }
},
{ timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ eStatus: 1 })

module.exports = mongoose.model('fantasyarticleclaps', fantasyarticleclaps)
