const { findAdmin, updateAdmin } = require('./grpc/clientServices')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')

async function getAdmintokenAndId() {
  const adminData = await findAdmin({ eStatus: 'Y', eType: 'SUPER', aJwtTokens: { $exists: true, $ne: [] } }, { _id: 1, sDepositToken: 1 }, { dLoginAt: -1 })
  let token = null
  let iAdminId = ''
  if (adminData) {
    token = adminData.sDepositToken
    if (!token) {
      token = jwt.sign({ _id: (adminData._id).toHexString() }, config.JWT_SECRET)
      await updateAdmin(adminData._id, token)
    }
    iAdminId = adminData._id
  }
  if (iAdminId && token) return { token, iAdminId }
}

module.exports = {
  getAdmintokenAndId
}
