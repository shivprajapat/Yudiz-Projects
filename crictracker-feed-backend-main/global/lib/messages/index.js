const english = require('./english')
const hindi = require('./hindi')

const status = {
  statusOk: 200,
  statusInternalError: 500,
  statusBadRequest: 400,
  statusUnAuthorized: 401,
  statusNotfound: 404,
  statusUnprocessableEntity: 422,
  statusResourceExist: 409,
  statusTooManyRequests: 429
}

const jsonStatus = {
  statusOk: 200,
  statusInternalError: 500,
  statusBadRequest: 400,
  statusUnAuthorized: 401,
  statusNotfound: 404,
  statusUnprocessableEntity: 422,
  statusResourceExist: 409,
  statusTooManyRequests: 429
}

module.exports = {
  english,
  hindi,
  status,
  jsonStatus
}
