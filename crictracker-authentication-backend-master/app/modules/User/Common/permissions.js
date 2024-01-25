/**
 *  Permissions is used to do validation and authentication of request befor performaing bussiness logic.
 *  Graphql-Sheild is used to create permissions.
 *
 * @function {permissions.isAuthenticated} is for authenticating a user by jwt tokens.
 *
**/

const { rule } = require('graphql-shield')
const { redisAuthDb } = require('../../../utils/lib/redis')
const _ = require('../../../../global')

const permissions = {}

permissions.isUserAuthenticated = rule('User Authentication')(async (parent, { input }, context) => {
  try {
    const { authorization, decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken?.iUserId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    if (await redisAuthDb.get(`at:${authorization}`)) _.throwError('authorizationError', context)
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
