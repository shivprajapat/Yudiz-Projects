const { rule } = require('graphql-shield')
const _ = require('../../../global')
const { getPermissions } = require('../Common/controllers')
const { redis } = require('../../utils')

const permissions = {}

permissions.isAuthenticated = rule('Authentication')(async (parent, { input }, context) => {
  try {
    const data = await getPermissions(context)
    if (data.isError) return data.error
    return true
  } catch (error) {
    return { error, isError: true }
  }
})

permissions.isUserAuthenticated = rule('User Authentication')(async (parent, { input }, context) => {
  try {
    const { authorization, decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    if (await redis.redisAuthDb.get(`at:${authorization}`)) _.throwError('authorizationError', context)
    return true
  } catch (error) {
    return { error, isError: true }
  }
})

module.exports = permissions
