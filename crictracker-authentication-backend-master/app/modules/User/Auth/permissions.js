/**
 *  Permissions is used to do validation and authentication of request befor performaing bussiness logic.
 * Graphql-Sheild is used to create permissions.
 *
 * @function {permissions.verifyOtp} is for checking if OTP is valid or not.
 *
 * */

const { rule } = require('graphql-shield')
const _ = require('../../../../global')
const permissions = {}

permissions.verifyOtp = rule('Verify Otp')(async (parent, { input }, context) => {
  try {
    const { sOtp, sToken } = input
    if (!sOtp) _.throwError('requiredField', context)
    if (!sToken) _.throwError('badRequest', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('otpNotMatched', context)
    input.decodedToken = decodedToken
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
