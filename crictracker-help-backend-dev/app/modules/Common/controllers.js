/* eslint-disable no-useless-escape */
const _ = require('../../../global')
const { feedback: FeedbackModel, counts: CountsModel } = require('../../model')

const controllers = {}

const updateCount = async () => {
  try {
    const res = {}

    const nES = await FeedbackModel.countDocuments({ eQueryType: 'e', eStatus: 'a' }).lean() // editorial suggestions
    const nOE = await FeedbackModel.countDocuments({ eQueryType: 's', eStatus: 'a' }).lean() // other queries

    Object.assign(res, { nES, nOE })
    await CountsModel.updateOne({ eType: 'f' }, res, { upsert: true })
    return
  } catch (error) {
    return error
  }
}

controllers.getPermissions = (context) => {
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

controllers.isUsersAuthenticated = async (context) => {
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

controllers.getHelpCounts = async (parent, { input }, context) => {
  try {
    await updateCount()

    const count = await CountsModel.findOne({ eType: 'f' }).lean()

    return _.resolve('fetchSuccess', count, 'counts', context)
  } catch (error) {
    return error
  }
}

module.exports = controllers
