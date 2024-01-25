// @ts-check
const { body, query, param } = require('express-validator')
const { reviewOperationStatus } = require('../../enums')

const add = [
  body('iReviewTo').isMongoId(),
  body('nRating').isInt({ min: 0, max: 5 }),
  body('sDescription').trim().notEmpty().optional()
]

const list = [
  query('eOperationType').trim().isIn(reviewOperationStatus?.value)
]

const update = [
  param('id').isMongoId(),
  body('iReviewTo').isMongoId(),
  body('nRating').isInt({ min: 0, max: 5 }),
  body('sDescription').trim().notEmpty().optional()
]

const deleteReview = [
  param('id').isMongoId()
]
module.exports = { add, list, deleteReview, update }
