const { isApiRateLimiterEnabled } = require('../../../../global/lib/constraints')
const { admins, tokens, otps: OTPVerificationsModel, adminroles } = require('../../../model')
const { queuePush } = require('../../../utils')
const _ = require('../../../../global')
const { redisAuthDb } = require('../../../utils/lib/redis')
const config = require('../../../../config')
const moment = require('moment')

const controllers = {}

controllers.adminLogin = async (parent, { input }, context) => {
  try {
    const { sUserName, sPassword, sPushToken } = input
    if (!sUserName || !sPassword) _.throwError('requiredField', context)

    const query = {
      $or: [{ sEmail: sUserName }, { sUName: sUserName }]
    }

    const admin = await admins.findOne(query).lean()

    if (!admin) {
      if (isApiRateLimiterEnabled) {
        const message = await _.apiRateLimiter(context.ip, apiPath.adminLogin, constraints.loginThreshold, constraints.loginRateLimit)
        if (message.status === 'Limit remaining') _.throwError('notRegistered', context)
        else if (message.status === 'Limit reached') _.throwError('tooManyRequest', context)
        else throw new Error(message)
      } else {
        _.throwError('notRegistered', context)
      }
    }

    const adminLogin = await admins.findOne({ ...query, sPassword: _.encryptPassword(_.asymmetricDecrypt(sPassword).message) }).lean()

    if (!adminLogin) {
      if (isApiRateLimiterEnabled) {
        const message = await _.apiRateLimiter(context.ip, apiPath.adminLogin, constraints.loginThreshold, constraints.loginRateLimit)
        if (message.status === 'Limit remaining') _.throwError('invalidCredentials', context)
        else if (message.status === 'Limit reached') _.throwError('tooManyRequest', context)
        else throw new Error(message)
      } else {
        _.throwError('invalidCredentials', context)
      }
    }

    if (admin.eStatus === 'i') {
      const adminTokens = await tokens.findOne({ iId: _.mongify(admin._id) }).lean()
      if (adminTokens) {
        if (adminTokens.aToken.length) {
          for (let index = 0; index < adminTokens?.aToken.length; index++) {
            const ele = adminTokens?.aToken[index]
            if (ele.sJwt) {
              const token = _.decodeToken(ele.sJwt)
              if (token?.exp) await redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), admin._id)
            }
          }
        }
      }
      _.throwError('accountDeactivated', context)
    }
    if (admin.eStatus === 'd') {
      const adminTokens = await tokens.findOne({ iId: _.mongify(admin._id) }).lean()
      if (adminTokens) {
        if (adminTokens.aToken.length) {
          for (let index = 0; index < adminTokens?.aToken.length; index++) {
            const ele = adminTokens?.aToken[index]
            if (ele.sJwt) {
              const token = _.decodeToken(ele.sJwt)
              if (token?.exp) await redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), admin._id)
            }
          }
        }
      }
      _.throwError('accountDeleted', context)
    }
    const adminPermissions = await adminroles.findOne({ iAdminId: _.mongify(admin._id) }, { 'aPermissions.iPermissionId': 1 }).populate({ path: 'aPermissions.iPermissionId', select: 'eKey' }).lean()

    const aPermissions = adminPermissions?.aPermissions?.map(p => {
      return p?.iPermissionId?.eKey
    })

    const sToken = _.encodeToken({ iAdminId: admin._id, aPermissions, eType: admin.eType }, '7d')

    const token = await tokens.findOne({ iId: admin._id }).lean()
    if (!token) {
      const query = {
        iId: _.mongify(admin._id),
        aToken: [{
          sJwt: sToken
        }],
        eType: 'a'
      }

      await tokens.create(query)
    } else {
      token.aToken.push({ sJwt: sToken })
      if (token.aToken.length > 5) {
        const shiftToken = token.aToken.shift()
        if (shiftToken.sJwt) {
          if (_.decodeToken(shiftToken.sJwt) !== 'jwt expired' && _.decodeToken(shiftToken.sJwt) !== 'invalid signature' && _.decodeToken(shiftToken.sJwt) !== 'jwt malformed') {
            await redisAuthDb.setex(`at:${shiftToken.sJwt}`, moment(_.decodeToken(shiftToken.sJwt).exp * 1000).diff(moment(), 'seconds'), admin._id)
          }
        }
      }

      const tokensUpdate = await tokens.updateOne({ iId: admin._id }, { aToken: token.aToken })
      if (!tokensUpdate.modifiedCount) _.throwError('serverError', context)
    }

    if (sPushToken) {
      admin.aPush.push(sPushToken)
      if (admin.aPush.length > 5) admin.aPush.shift()
    }

    return _.resolve('success', { oData: { sToken } }, 'login', context)
  } catch (error) {
    return error
  }
}

controllers.forgotPassword = async (parent, { input }, context) => {
  try {
    const { sEmail } = input

    if (!sEmail) _.throwError('requiredField', context)

    if (_.isEmail(sEmail)) _.throwError('invalidEmail', context)

    const admin = await admins.findOne({ sEmail }).lean()

    if (!admin) _.throwError('accountNotExist', context)
    if (isApiRateLimiterEnabled) {
      const messageForOtpCount = await _.apiRateLimiter(context.ip, apiPath.forgotPasswordOtpCount, constraints.forgotPasswordOtpCount, constraints.forgotPasswordOtpRateLimit)
      if (messageForOtpCount.status === 'Limit reached') _.throwError('maxNumberOtpReached', context)

      const message = await _.apiRateLimiter(context.ip, apiPath.forgotPassword, constraints.forgotPasswordThreshold, constraints.forgotPasswordRateLimit)
      if (message.status === 'Limit reached') _.throwError('resendOtpTimerExpire', context)
    }

    const sOtp = config.NODE_ENV === 'dev' || config.NODE_ENV === 'local-dev' ? '111111' : _.randomCode(6)

    const findOtpQuery = { sEmail, eAuth: 'f', eType: 'e', eStatus: 'a' }
    const otp = await OTPVerificationsModel.findOne(findOtpQuery).lean()

    if (otp) {
      await OTPVerificationsModel.deleteOne({ _id: otp._id })
    }

    const createOtpQuery = {
      sCode: sOtp,
      sExpiryToken: _.encodeToken({ sLogin: sEmail }, '10m'),
      sEmail,
      eAuth: 'f',
      eType: 'e'
    }

    const otpCreate = await OTPVerificationsModel.create(createOtpQuery)

    if (otpCreate) {
      queuePush('sendMail', {
        eType: 'f',
        sEmail,
        sOtp
      })
    }
    return _.resolve('sentSuccess', null, 'email', context)
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.verifyOtp = async (parent, { input }, context) => {
  try {
    const { sOtp, eType, eAuth, sEmail } = input
    if (!sEmail) _.throwError('fieldRequired', context, 'email')
    const query = {
      sEmail,
      sCode: sOtp,
      eAuth,
      eType
    }

    const otp = await OTPVerificationsModel.findOne(query).lean()
    if (!otp) _.throwError('otpNotMatched', context)

    if (_.decodeToken(otp.sExpiryToken) === 'jwt expired') {
      await OTPVerificationsModel.findByIdAndDelete(otp._id).lean()
      _.throwError('expired', context, 'otp')
    }
    await OTPVerificationsModel.deleteOne({ _id: otp._id })
    return _.resolve('verifiedSuccess', null, 'otp', context)
  } catch (error) {
    return error
  }
}

controllers.resetPassword = async (parent, { input }, context) => {
  try {
    const { sNewPassword, sConfirmNewPassword, sEmail } = input
    if (!sEmail) _.throwError('badRequest', context)
    const confirmNewPassword = _.asymmetricDecrypt(sConfirmNewPassword).message
    const newPassword = _.asymmetricDecrypt(sNewPassword).message
    if (newPassword !== confirmNewPassword) _.throwError('passAndCpassNotMatch', context)
    if (_.isPassword(newPassword)) _.throwError('invalidPassword', context)
    const query = {
      sEmail,
      eStatus: 'a'
    }

    const admin = await admins.findOne(query).lean()
    if (!admin) _.throwError('accountNotExist', context)
    if (admin.sPassword === _.encryptPassword(newPassword)) _.throwError('samePassword', context)
    const token = await tokens.findOne({ iId: _.mongify(admin._id) }).lean()

    if (token?.aToken?.length) {
      for (let index = 0; index < token.aToken.length; index++) {
        const ele = token.aToken[index]
        if (ele.sJwt) {
          const token = _.decodeToken(ele.sJwt)
          if (token?.exp) await redisAuthDb.setex(`at:${ele.sJwt}`, `${admin._id}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'))
          else token.aToken.splice(index, 1)
        }
      }
      await tokens.updateOne({ iId: _.mongify(admin._id) }, { aToken: token.aToken })
    }

    await admins.updateOne(query, { sPassword: _.encryptPassword(newPassword) })
    return _.resolve('success', null, 'resetPassword', context)
  } catch (error) {
    return error
  }
}

controllers.adminLogout = async (parent, input, context) => {
  try {
    const { authorization } = context.headers
    const { decodedToken } = context
    const query = { iId: _.mongify(decodedToken.iAdminId) }
    const token = await tokens.findOne(query).lean()
    token.aToken.splice(token.aToken.findIndex((ele) => ele.sJwt === authorization), 1)
    if (decodedToken.exp) await redisAuthDb.setex(`at:${authorization}`, moment(decodedToken.exp * 1000).diff(moment(), 'seconds'), `${decodedToken.iAdminId}`)
    await tokens.updateOne({ _id: _.mongify(token._id) }, { aToken: token.aToken })
    return _.resolve('success', null, 'logout', context)
  } catch (error) {
    return error
  }
}

module.exports = controllers
