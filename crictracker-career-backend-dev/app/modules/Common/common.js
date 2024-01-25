const _ = require('../../../global')

const getPermissions = (context) => {
  try {
    const { authorization } = context.headers
    if (!authorization) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken.iAdminId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    return { data: decodedToken }
  } catch (error) {
    return { isError: true, error }
  }
}

// To be removed

const isUsersAuthenticated = async (context) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { authorization } = context.headers
        if (!authorization) _.throwError('requiredField', context)
        const { decodedToken } = context
        if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken?.iUserId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
        // const userAuthResponse = await axios.post(`${AUTH_SUBGRAPH_URL}`, {
        //   query: 'query GetUser { getUser { _id sEmail } }'
        // }, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     authorization: authorization
        //   }
        // })
        // const data = userAuthResponse.data?.data?.getUser
        // if (!data) resolve({ error: userAuthResponse.data?.errors, isError: true })
        resolve({ isError: false })
      } catch (error) {
        resolve({ error, isError: true })
      }
    })()
  })
}

module.exports = { getPermissions, isUsersAuthenticated }
