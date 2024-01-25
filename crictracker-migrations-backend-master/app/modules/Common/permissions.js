const { rule } = require('graphql-shield')
const { getPermissions } = require('./controllers')

const permissions = {}

permissions.isAuthenticated = rule('Authentication')(async (parent, { input }, context) => {
  try {
    const data = await getPermissions(context)
    if (data.isError) return data.error
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
