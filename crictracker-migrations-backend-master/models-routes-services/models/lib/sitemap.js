const mongoose = require('mongoose')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const sitemap = new mongoose.Schema({
  sKey: {
    type: String
  },
  url: [{
    _id: false,
    loc: {
      type: String
    },
    'news:news': [{
      _id: false,
      'news:publication': [{
        _id: false,
        'news:name': {
          type: String
        },
        'news:language': {
          type: String,
          default: 'en'
        }
      }],
      'news:publication_date': {
        type: Date
      },
      'news:title': {
        type: String
      },
      'news:keywords': {
        type: String
      }
    }],
    lastmod: {
      type: Date,
      default: new Date()
    },
    changefreq: {
      type: String
    },
    priority: {
      type: Number
    },
    'image:image': [{
      _id: false,
      'image:loc': {
        type: String
      },
      'image:title': {
        type: String
      },
      'image:caption': {
        type: String
      }
    }]
  }],
  sitemap: [{
    _id: false,
    loc: {
      type: String
    },
    lastmod: {
      type: Date,
      default: new Date()
    }
  }]
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

module.exports = ArticleDBConnect.model('sitemap', sitemap)
