const { body } = require('express-validator')

const importStudents = [
  body('title').matches(/^[aA-zZ0-9\s]+$/),
  body('last_name').matches(/^[aA-zZ0-9\s]+$/),
  body('email').matches(/^[aA-zZ0-9\s]+$/),
  body('mobile').matches(/^[aA-zZ0-9\s]+$/),
  body('country').matches(/^[aA-zZ0-9\s]+$/),
  body('state').matches(/^[aA-zZ0-9\s]+$/),
  body('city').matches(/^[aA-zZ0-9\s]+$/),
  body('grade').matches(/^[aA-zZ0-9\s]+$/),
  body('board').matches(/^[aA-zZ0-9\s]+$/),
  body('school').matches(/^[aA-zZ0-9\s]+$/)
]
module.exports = {
  importStudents
}
