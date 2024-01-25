const admins = require('./lib/admins')
const tokens = require('./lib/tokens')
const kycs = require('./lib/kycs')
const otps = require('./lib/otps')
const permissions = require('./lib/permissions')
const roles = require('./lib/roles')
const adminroles = require('./lib/adminroles')
const users = require('./lib/users')
const authlogs = require('./lib/authlogs')
const countries = require('./lib/countries')

module.exports = {
  admins,
  kycs,
  otps,
  permissions,
  roles,
  adminroles,
  tokens,
  users,
  authlogs,
  countries
}
