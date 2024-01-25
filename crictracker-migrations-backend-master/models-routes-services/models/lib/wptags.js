const mongoose = require('mongoose')
const { ObjectId, Mixed } = mongoose.Schema.Types
const { MigrationDBConnect } = require('../../../db_services/mongoose')
const { eMigrationType } = require('../../enums')

const wptags = new mongoose.Schema(
  {
    term_id: {
      type: Number,
      alias: 'iTermId'
    },
    name: {
      type: String,
      alias: 'sName'
    },
    slug: {
      type: String,
      alias: 'sSlug'
    },
    term_taxonomy_id: {
      type: Number,
      alias: 'iTermTaxonomyId'
    },
    taxonomy: {
      type: String,
      alias: 'sTaxonomy'
    },
    description: {
      type: String,
      alias: 'sDescription'
    },
    count: {
      type: Number,
      alias: 'nCount'
    },
    aDocuments: [{ type: Mixed }],
    eStatus: { type: String, enum: ['a', 'd'], default: 'a' }, // a = active, d = delete
    iId: { type: ObjectId },
    sAssignedName: { type: String },
    bIsAssigned: { type: Boolean, default: false },
    eType: { type: String, enum: eMigrationType.value, required: true, default: eMigrationType.default },
    bIsMigrated: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
    toJSON: { virtuals: true }
  }
)

module.exports = MigrationDBConnect.model('wptags', wptags)
