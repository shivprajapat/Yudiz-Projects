const { body } = require('express-validator')

const bookSession = [
  body('id').notEmpty(),
  body('counselorAvalId').notEmpty(),
  body('type').notEmpty().isIn(['VIDEO', 'F2F']),
  body('counsellorType').notEmpty().isIn(['career_counsellor', 'psychologist', 'overseas_counsellor', 'subject_expert'])
]

const counselorData = [
  body('id').notEmpty(),
  body('date').notEmpty()
]

const reschedule = [
  body('sessionId').notEmpty(),
  body('counsellorAvalId').notEmpty(),
  body('reason').notEmpty()
]
const cancel = [
  body('sessionId').notEmpty(),
  body('reason').notEmpty()
]
const getFilterAllCounsellor = [
  // body('date').isString(),
  // body('time').isString()
]

const rateSession = [
  body('session_id').notEmpty(),
  body('counsellor_id').notEmpty(),
  body('ratings').notEmpty().isInt({ lte: 5 }).withMessage('Only enter natural number with <= 5..!'),
  body('message').notEmpty().isString()
]

module.exports = {
  bookSession,
  reschedule,
  cancel,
  getFilterAllCounsellor,
  rateSession,
  counselorData
}
