const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { status, questionCategory } = require('../../data')

const Question = new mongoose.Schema(
  {
    eCategory: { type: String, enum: questionCategory, required: true },
    sQuestion: { type: String },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)

module.exports = gymDBConnect.model('question', Question)
