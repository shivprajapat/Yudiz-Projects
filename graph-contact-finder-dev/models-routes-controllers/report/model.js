// @ts-check
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { GraphDBConnect } = require('../../database/mongoose')
const { platform } = require('../../enums')

const Reports = new Schema({
  oTotalUser: {
    nTotalUsers: { type: Number, default: 0 },
    dUpdatedAt: { type: Date }
  },
  oRegisterUser: {
    nToday: { type: Number, default: 0 },
    nYesterday: { type: Number, default: 0 },
    nLastWeek: { type: Number, default: 0 },
    nLastMonth: { type: Number, default: 0 },
    nLastYear: { type: Number, default: 0 },
    aPlatformWiseUser: [{
      eTitle: { type: String, enum: platform, default: 'O' },
      nValue: { type: Number, default: 0 }
    }],
    dUpdatedAt: { type: Date }
  },
  oLoginUser: {
    nToday: { type: Number, default: 0 },
    nYesterday: { type: Number, default: 0 },
    nLastWeek: { type: Number, default: 0 },
    nLastMonth: { type: Number, default: 0 },
    nLastYear: { type: Number, default: 0 },
    dUpdatedAt: { type: Date }
  },
  oTotalContacts: {
    nTotalContacts: { type: Number, default: 0 },
    dUpdatedAt: { type: Date }
  },
  oUpdateUser: {
    nToday: { type: Number, default: 0 },
    nYesterday: { type: Number, default: 0 },
    nLastWeek: { type: Number, default: 0 },
    nLastMonth: { type: Number, default: 0 },
    nLastYear: { type: Number, default: 0 },
    dUpdatedAt: { type: Date }
  }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})

module.exports = GraphDBConnect.model('reports', Reports)
