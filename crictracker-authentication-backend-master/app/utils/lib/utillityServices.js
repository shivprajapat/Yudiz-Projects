/* eslint-disable no-useless-escape */

function isNumeric(x) {
  if (isNaN(x)) {
    return false
  }
  return true
}

module.exports = {
  isNumeric
}
