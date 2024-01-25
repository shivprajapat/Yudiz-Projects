const generalEnglish = require('../lang/english/general')
const generalHindi = require('../lang/hindi/general')
const wordEnglish = require('../lang/english/words')
const wordHindi = require('../lang/hindi/words')

const message = {
  English: {
    ...generalEnglish,
    ...wordEnglish
  },
  Hindi: {
    ...generalHindi,
    ...wordHindi
  }
}

module.exports = message
