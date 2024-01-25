const { users: UsersModel, tokens: TokenModel } = require('../../../model')
const _ = require('../../../../global')
const { getPaginationValues, queuePush } = require('../../../utils')
const { redisAuthDb } = require('../../../utils/lib/redis')
const moment = require('moment')

const controllers = {}

/**
 * This service is used for admin panel to getting Front website users data.
 * @param {*} param1 { input } used for filter purpose.
 * @returns This service will return website users list with pagination data.
 */
controllers.listUsers = async (parent, { input }, context) => {
  try {
    let { eStatus } = input
    const { nSkip, nLimit, sorting: oSorting, sSearch } = getPaginationValues(input)

    eStatus = !eStatus ? ['a', 'i'] : [eStatus]

    let query = {}
    if (sSearch) {
      query = {
        $or: [
          { sFullName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
          { sEmail: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
          { sMobNum: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
          { sUsername: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
        ]
      }
    }
    if (eStatus) query.eStatus = { $in: eStatus }

    const nTotal = await UsersModel.countDocuments(query)
    const aResults = await UsersModel.find(query, { sFullName: 1, sEmail: 1, sUsername: 1, sMobNum: 1, eStatus: 1, bIsEmailVerified: 1, _id: 1, bIsMobVerified: 1, bNormalLogin: 1, dCreated: 1 }).sort(oSorting).skip(nSkip).limit(nLimit).lean()

    return { aResults, nTotal }
  } catch (error) {
    return error
  }
}

/**
 * This service is used for admin panel to get particular Front website users details.
 * @param {*} param1 { input } used to get user id.
 * @returns This service will return website user details.
 */
controllers.viewUserDetail = async (parent, { input }, context) => {
  try {
    const { iId } = input

    const oData = await UsersModel.findById(iId, { sPassword: 0 }).populate({ path: 'oCountry', select: 'sSortName sName' }).lean()
    if (!oData) _.throwError('notFound', context, 'user')

    return _.resolve('fetchSuccess', { oData }, 'user', context)
  } catch (error) {
    return error
  }
}

/**
 * This service is used for admin panel to active/in-active Front website users.
 * @param {*} param1 { input } used to get users id and status.
 * @returns This service will return update response.
 */
controllers.bulkUpdateUsers = async (parent, { input }, context) => {
  try {
    const { eStatus, aId } = input
    // let { aId } = input
    // aId = aId.map(id => _.mongify(id))
    const { decodedToken } = context

    const oDelete = {
      dDeletedOn: new Date(),
      iDeletedBy: decodedToken.iAdminId,
      eDeletedBy: 'a'
    }
    const oData = await UsersModel.updateMany({ _id: aId }, { eStatus, oDelete })
    if (!oData.modifiedCount) _.throwError('notFound', context, 'user')

    if (eStatus === 'i') {
      for (const id of aId) {
        const userTokens = await TokenModel.findOne({ iId: _.mongify(id), eType: 'u' })
        for (let index = 0; index < userTokens?.aToken.length; index++) {
          const ele = userTokens?.aToken[index]
          if (ele.sJwt) {
            const token = _.decodeToken(ele.sJwt)
            if (token?.exp) redisAuthDb.setex(`at:${ele.sJwt}`, moment(token.exp * 1000).diff(moment(), 'seconds'), id)
          }
        }
      }
    }

    if (eStatus === 'd') {
      for (const id of aId) {
        const userTokens = await TokenModel.findOne({ iId: _.mongify(id), eType: 'u' })
        for (let index = 0; index < userTokens?.aToken.length; index++) {
          const ele = userTokens?.aToken[index]
          if (ele.sJwt) {
            const token = _.decodeToken(ele.sJwt)
            if (token?.exp) redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), id)
          }
        }
      }
    }

    return _.resolve('updateSuccess', null, 'user', context)
  } catch (error) {
    return error
  }
}

controllers.deleteUser = async (parent, { input }, context) => {
  try {
    const { sReason } = input

    const { decodedToken } = context

    const { iUserId: _id } = decodedToken

    const oDelete = {
      dDeletedOn: new Date(),
      iDeletedBy: decodedToken.iUserId,
      eDeletedBy: 'u',
      sReason
    }

    const oData = await UsersModel.findOneAndUpdate({ _id, eStatus: 'a' }, { oDelete, eStatus: 'd' }, { new: true })
    if (!oData) _.throwError('notFound', context, 'user')
    const userTokens = await TokenModel.findOne({ iId: _.mongify(_id), eType: 'u' })

    queuePush('sendMail', {
      eType: 'deleteUser',
      sEmail: oData.sEmail,
      sUserName: oData.sUserName
    })

    for (let index = 0; index < userTokens?.aToken.length; index++) {
      const ele = userTokens?.aToken[index]
      if (ele.sJwt) {
        const token = _.decodeToken(ele.sJwt)
        if (token?.exp) redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), _id)
      }
    }
    return _.resolve('deleteSuccess', oData, 'user', context)
  } catch (error) {
    return error
  }
}

controllers.deleteUserAdmin = async (parent, { input }, context) => {
  try {
    const { sReason, iUserId: _id } = input

    const { decodedToken } = context

    const { iAdminId } = decodedToken

    const oDelete = {
      dDeletedOn: new Date(),
      iDeletedBy: iAdminId,
      eDeletedBy: 'a',
      sReason
    }

    const oData = await UsersModel.findOneAndUpdate({ _id, eStatus: 'a' }, { oDelete, eStatus: 'd' }, { new: true })
    if (!oData) _.throwError('notFound', context, 'user')
    const userTokens = await TokenModel.findOne({ iId: _.mongify(_id), eType: 'u' })

    queuePush('sendMail', {
      eType: 'deleteUser',
      sEmail: oData.sEmail,
      sUserName: oData.sUserName
    })

    for (let index = 0; index < userTokens?.aToken.length; index++) {
      const ele = userTokens?.aToken[index]
      if (ele.sJwt) {
        const token = _.decodeToken(ele.sJwt)
        if (token?.exp) redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), _id)
      }
    }
    return _.resolve('deleteSuccess', oData, 'user', context)
  } catch (error) {
    return error
  }
}

module.exports = controllers
