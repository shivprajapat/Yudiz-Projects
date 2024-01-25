const english = require('./english')
const hindi = require('./hindi')

const status = {
  statusOk: 200,
  statusInternalError: 500,
  statusBadRequest: 400,
  statusUnAuthorized: 401
}

module.exports = {
  english,
  hindi,
  status
}
