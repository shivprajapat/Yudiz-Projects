const mongoose = require('mongoose')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const homepagemodels = new mongoose.Schema({
  nBig: {
    type: Number,
    default: 0
  },
  nMed: {
    type: Number,
    default: 0
  },
  nSmall: {
    type: Number,
    default: 0
  },
  nGrid: {
    type: Number,
    default: 0
  },
  nMedGrid: {
    type: Number,
    default: 0
  },
  nList: {
    type: Number,
    default: 0
  },
  nTotal: {
    type: Number,
    default: 0
  },
  eStatus: {
    type: String
  }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

module.exports = ArticleDBConnect.model('homepagemodels', homepagemodels)
