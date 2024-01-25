const axios = require('axios')
const { OAuth2Client } = require('google-auth-library')
const { isApiRateLimiterEnabled } = require('../../../../global/lib/constraints')
const { users, tokens, otps, authlogs } = require('../../../model')
const { queuePush, services, getS3ImageURL } = require('../../../utils')
const { isNumeric } = services
const { redisAuthDb } = require('../../../utils/lib/redis')
const moment = require('moment')
const config = require('../../../../config')
const client = new OAuth2Client(config.GOOGLE_CLIENT_ID)
const _ = require('../../../../global')
const loginJwtValidity = '30d'

const controllers = {}

controllers.signUp = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sFullName', 'sUserName', 'sEmail', 'sPassword', 'sNumber', 'sConfirmPassword', 'sSocialType', 'sSocialToken', 'sCode', 'sPushToken'])
    let { sFullName, sUserName, sEmail, sPassword, sConfirmPassword, sSocialType, sSocialToken, sCode, sPushToken } = body
    const { sNumber } = body

    if (!(sSocialType && sSocialToken) && (!sUserName || !sEmail || !sFullName || !sPassword || !sConfirmPassword)) _.throwError('requiredField', context)
    if (!(sSocialType && sSocialToken) && !sCode) _.throwError('requiredFormField', context, 'otp')

    sUserName = sUserName.toLowerCase()
    sEmail = sEmail.toLowerCase()
    sPassword = _.asymmetricDecrypt(sPassword).message
    sConfirmPassword = _.asymmetricDecrypt(sConfirmPassword).message

    if (sEmail && _.isEmail(sEmail)) _.throwError('invalidEmail', context)
    if (sUserName && _.isUserName(sUserName)) _.throwError('invalidUserName', context)
    if (sNumber && sNumber.length !== 10) _.throwError('invalidNumber', context)

    const userExist = await users.findOne({ sEmail }).lean()
    if (userExist && userExist?.eStatus === 'i') _.throwError('accountDeactivated', context)
    if (userExist && userExist?.eStatus === 'd') _.throwError('accountDeleted', context)
    if (userExist) _.throwError('alreadyExists', context, 'usernameOrEmailOrNumber')

    if (sPassword && _.isPassword(sPassword)) _.throwError('invalidPassword', context)
    if (sPassword && (sPassword !== sConfirmPassword)) _.throwError('passAndCpassNotMatch', context)

    let oSocial, sSocialId
    let userParams = {}
    if (sSocialType && sSocialToken) {
      if (sSocialType === 'G') {
        const ticket = await client.verifyIdToken({ idToken: sSocialToken, audience: [config.GOOGLE_CLIENT_ID] })
        const payload = ticket.getPayload()

        const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${sSocialToken}`)
        if (payload.sub !== googleRes.data.sub) _.throwError('socialAuthFailed', context)
        if (googleRes.data.email !== sEmail) _.throwError('socialEmailError', context)

        sSocialId = googleRes.data.sub
        oSocial = {
          sType: 'G',
          sId: sSocialId,
          sToken: sSocialToken
        }
      } else if (sSocialType === 'F') {
        const fbRes = await axios.get(`https://graph.facebook.com/v3.2/me?access_token=${sSocialToken}&debug=all&fields=id,name,first_name,last_name,email&format=json&method=get&pretty=1`)
        if (!fbRes || (fbRes && !fbRes.data.id)) _.throwError('socialAuthFailed', context)
        if (fbRes.data.email !== sEmail) _.throwError('socialEmailError', context)

        sSocialId = fbRes.data.id
        oSocial = {
          sType: 'F',
          sId: sSocialId,
          sToken: sSocialToken
        }
      }
    }

    if (oSocial) {
      const socialUser = await tokens.findOne({ 'oSocial.sId': sSocialId }).lean()
      if (socialUser) _.throwError('alreadyExists', context, 'user')
      userParams.sEmail = sEmail
      userParams.bIsSocialUser = true
    } else {
      userParams = {
        sUsername: sUserName,
        sFullName,
        sMobNum: sNumber,
        sEmail,
        sPassword: _.encryptPassword(sPassword)
      }
    }
    const isOTPExist = await otps.findOne({ sLogin: sEmail, eType: 'e', eAuth: 'r', sCode, bIsVerify: true }).sort({ dCreatedAt: -1 }).lean()
    if (sCode && (!isOTPExist || isOTPExist.sCode !== sCode)) _.throwError('wentWrongWith', context, 'otp')
    if (isOTPExist) await otps.deleteOne({ _id: isOTPExist._id })

    userParams.bIsEmailVerified = true
    const user = await users.create(userParams)

    const sToken = _.encodeToken({ iUserId: user._id }, loginJwtValidity)
    const query = {
      iId: _.mongify(user._id),
      aToken: [{
        sJwt: sToken
      }],
      eType: 'u'
    }
    if (sPushToken) query.aToken[0].sPush = sPushToken
    const ePlatform = ['A', 'I', 'W'].includes(context.platform) ? context.platform : 'O'
    await authlogs.create({ iUserId: user._id, ePlatform, eType: 'R', sIpAddress: context.ip })
    const tokenData = await tokens.create(query)
    if (oSocial) {
      await tokens.findByIdAndUpdate(tokenData._id, { oSocial })
    }

    return _.resolve('registerSuccess', { oData: { ...user._doc, sToken } }, 'user', context)
  } catch (error) {
    return error
  }
}

controllers.socialSignUp = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sSocialType', 'sSocialToken', 'sPushToken'])

    let oSocial
    const userQuery = { bIsEmailVerified: true }

    switch (body.sSocialType) {
      case 'G': {
        const ticket = await client.verifyIdToken({ idToken: body.sSocialToken, audience: [config.GOOGLE_CLIENT_ID] })
        const payload = ticket?.getPayload()

        if (!payload) _.throwError('socialAuthFailed', context)

        Object.assign(userQuery, { sEmail: payload.email, sFullName: payload.name, sProPic: payload.picture })

        oSocial = {
          sType: 'G',
          sId: payload.sub,
          sToken: body.sSocialToken
        }
        break
      }
      case 'F': {
        const fbRes = await axios.get(`https://graph.facebook.com/v3.2/me?access_token=${body.sSocialToken}&debug=all&fields=id,name,first_name,last_name,email,picture&format=json&method=get&pretty=1`)
        if (!fbRes || (fbRes && !fbRes.data.id)) _.throwError('socialAuthFailed', context)

        Object.assign(userQuery, { sEmail: fbRes.data.email, sFullName: fbRes.data.name, sProPic: fbRes.data.picture.data.url })

        oSocial = {
          sType: 'F',
          sId: fbRes.data.id,
          sToken: body.sSocialToken
        }
        break
      }
      default:
        break
    }

    let socialUser = await users.findOne({ sEmail: userQuery.sEmail }).lean()
    const token = await tokens.findOne({ 'oSocial.sId': oSocial.sId }).lean()

    let sToken

    if (socialUser) {
      if (socialUser?.eStatus === 'i') _.throwError('accountDeactivated', context)
      if (socialUser?.eStatus === 'd') _.throwError('accountDeleted', context)
      if (!socialUser.sPassword) await users.findByIdAndUpdate(socialUser._id, { bNormalLogin: false })

      sToken = _.encodeToken({ iUserId: socialUser._id }, loginJwtValidity)
      const tokenQuery = { sJwt: sToken }

      if (body?.sPushToken) tokenQuery.sPush = body.sPushToken
      token.aToken.push(tokenQuery)

      if (token.aToken.length > 5) token.aToken.shift()
      const tokensUpdate = await tokens.updateOne({ iId: socialUser._id }, { aToken: token.aToken })
      if (!tokensUpdate.modifiedCount) _.throwError('serverError', context)

      const ePlatform = ['A', 'I', 'W'].includes(context.platform) ? context.platform : 'O'
      await authlogs.create({ iUserId: socialUser._id, ePlatform, eType: 'L', sIpAddress: context.ip })
    } else {
      const s3Res = await getS3ImageURL(userQuery.sProPic, config.S3_BUCKET_PROFILE_PATH)
      if (s3Res?.success) Object.assign(userQuery, { sProPic: s3Res.path })

      Object.assign(userQuery, { bNormalLogin: false })
      socialUser = await users.create(userQuery)
      sToken = _.encodeToken({ iUserId: socialUser._id }, loginJwtValidity)

      const query = {
        iId: _.mongify(socialUser._id),
        aToken: [{
          sJwt: sToken
        }],
        eType: 'u',
        oSocial
      }

      if (body.sPushToken) query.aToken[0].sPush = body.sPushToken
      const ePlatform = ['A', 'I', 'W'].includes(context.platform) ? context.platform : 'O'
      await authlogs.create({ iUserId: socialUser._id, ePlatform, eType: 'L', sIpAddress: context.ip })

      await tokens.create(query)
    }

    return _.resolve('loggedInSuccess', { oData: { sToken } }, '', context)
  } catch (error) {
    return error
  }
}

controllers.userLogin = async (parent, { input }, context) => {
  try {
    const { sLogin, sPassword, sPushToken } = input
    if (!sLogin || !sPassword) _.throwError('requiredField', context)

    const loginQuery = {}

    isNumeric(sLogin) ? loginQuery.sMobNum = sLogin : loginQuery.sEmail = sLogin
    const user = await users.findOne(loginQuery, { sPassword: 1, eStatus: 1 }, { readPreference: 'primary' }).lean()
    if (!user) _.throwError('notRegistered', context)

    if (user.sPassword !== _.encryptPassword(_.asymmetricDecrypt(sPassword).message)) {
      if (isApiRateLimiterEnabled) {
        const message = await _.apiRateLimiter(context.ip, apiPath.userLogin, constraints.loginThreshold, constraints.loginRateLimit)
        if (message.status === 'Limit remaining') _.throwError('invalidCredentials', context)
        else if (message.status === 'Limit reached') _.throwError('tooManyRequest', context)
        else throw new Error(message)
      } else {
        _.throwError('invalidCredentials', context)
      }
    }

    if (user.eStatus === 'i') {
      const userTokens = await tokens.findOne({ iId: _.mongify(user._id), eType: 'u' }).lean()
      if (userTokens?.aToken?.length) {
        for (const ele of userTokens.aToken) {
          redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), user._id)
        }
      }
      _.throwError('accountDeactivated', context)
    }

    if (user.eStatus === 'd') {
      const userTokens = await tokens.findOne({ iId: _.mongify(user._id), eType: 'u' })
      if (userTokens?.aToken?.length) {
        for (const ele of userTokens.aToken) {
          redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), user._id)
        }
      }
      _.throwError('accountDeleted', context)
    }

    const sToken = _.encodeToken({ iUserId: user._id }, loginJwtValidity)

    const token = await tokens.findOne({ iId: user._id })
    if (!token) {
      const query = {
        iId: _.mongify(user._id),
        aToken: [{
          sJwt: sToken
        }],
        eType: 'u'
      }

      if (sPushToken) query.aToken[0].sPush = sPushToken
      await tokens.create(query)
    } else {
      const tokenQuery = { sJwt: sToken }

      if (sPushToken) tokenQuery.sPush = sPushToken
      token.aToken.push(tokenQuery)

      if (token.aToken.length > 5) token.aToken.shift()
      const tokensUpdate = await tokens.updateOne({ iId: user._id }, { aToken: token.aToken })
      if (!tokensUpdate.modifiedCount) _.throwError('serverError', context)
    }

    const ePlatform = ['A', 'I', 'W'].includes(context.platform) ? context.platform : 'O'
    await authlogs.create({ iUserId: user._id, ePlatform, eType: 'L', sIpAddress: context.ip })

    return _.resolve('loggedInSuccess', { oData: { sToken } }, '', context)
  } catch (error) {
    return error
  }
}

controllers.socialSignIn = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sSocialType', 'sSocialToken', 'sPushToken'])
    const { sSocialType, sSocialToken, sPushToken } = body
    if (!sSocialType || !sSocialToken) _.throwError('requiredField', context)
    const ePlatform = ['A', 'I', 'W'].includes(context.platform) ? context.platform : 'O'

    let userSocialId
    let userSocialEmail
    if (sSocialType === 'G') {
      const ticket = await client.verifyIdToken({ idToken: sSocialToken, audience: [config.GOOGLE_CLIENT_ID] })
      const payload = ticket.getPayload()
      const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${sSocialToken}`)
      if (payload.sub !== googleRes.data.sub) _.throwError('socialAuthFailed', context)
      if (!googleRes || (googleRes && !googleRes.data.sub)) _.throwError('socialAuthFailed', context)
      userSocialId = googleRes.data.sub
      userSocialEmail = googleRes.data.email
    } else if (sSocialType === 'F') {
      const fbRes = await axios.get(`https://graph.facebook.com/v3.2/me?access_token=${sSocialToken}&debug=all&fields=id,name,first_name,last_name,email&format=json&method=get&pretty=1`)
      if (!fbRes || (fbRes && !fbRes.data.id)) _.throwError('socialAuthFailed', context)
      userSocialId = fbRes.data.id
      userSocialEmail = fbRes.data.email
    }

    const token = await tokens.findOne({ 'oSocial.sId': userSocialId, eType: 'u' }).lean()
    const user = await users.findOne({ sEmail: userSocialEmail, bIsSocialUser: true }).lean()
    if (!token || !user) _.throwError('accountNotExist', context)
    if (user?.eStatus === 'i') _.throwError('accountDeactivated', context)
    if (user?.eStatus === 'd') _.throwError('accountDeleted', context)

    const sToken = _.encodeToken({ iUserId: user._id }, '7d')
    if (!token) {
      const query = {
        iId: _.mongify(user._id),
        aToken: [{
          sJwt: sToken
        }],
        eType: 'u'
      }
      if (sPushToken) query.aToken[0].sPush = sPushToken
      await tokens.create(query)
    } else {
      const tokenQuery = { sJwt: sToken }
      if (sPushToken) tokenQuery.sPush = sPushToken
      token.aToken.push(tokenQuery)
      if (token.aToken.length > 5) token.aToken.shift()
      const tokensUpdate = await tokens.updateOne({ iId: user._id }, { aToken: token.aToken })
      if (!tokensUpdate.modifiedCount) _.throwError('serverError', context)
    }
    await authlogs.create({ iUserId: user._id, ePlatform, eType: 'L', sIpAddress: context.ip })
    return _.resolve('success', { oData: { sToken } }, 'login', context)
  } catch (error) {
    return error
  }
}

controllers.sendOTP = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sLogin', 'eType', 'eAuth'])
    const { sLogin, eType } = body
    let { eAuth } = body

    if (isApiRateLimiterEnabled) {
      let message, messageForOtpCount
      switch (eAuth) {
        case 'r':
          message = await _.apiRateLimiter(context.ip, apiPath.registerPath, constraints.registerThreshold, constraints.registerRateLimit)
          if (message.status === 'Limit reached') _.throwError('resendOtpTimerExpire', context)
          messageForOtpCount = await _.apiRateLimiter(context.ip, apiPath.registerOtpCount, constraints.registerOtpCount, constraints.registerOtpRateLimit)
          break
        case 'f':
          message = await _.apiRateLimiter(context.ip, apiPath.forgotPasswordPath, constraints.forgotPasswordThreshold, constraints.forgotPasswordRateLimit)
          if (message.status === 'Limit reached') _.throwError('resendOtpTimerExpire', context)
          messageForOtpCount = await _.apiRateLimiter(context.ip, apiPath.forgotPasswordOtpCount, constraints.forgotPasswordOtpCount, constraints.forgotPasswordOtpRateLimit)
          break
        case 'fr':
          message = await _.apiRateLimiter(context.ip, apiPath.resendOtpPath, constraints.resendOtpThresold, constraints.resendOtpTimeOutRateLimit)
          if (message.status === 'Limit reached') _.throwError('resendOtpTimerExpire', context)
          messageForOtpCount = await _.apiRateLimiter(context.ip, apiPath.resendOtpCount, constraints.resendOtpCount, constraints.resendOtpRateLimit)
          break
        case 'v':
          message = await _.apiRateLimiter(context.ip, apiPath.verifyPath, constraints.verifyThreshold, constraints.verifyRateLimit)
          if (message.status === 'Limit reached') _.throwError('resendOtpTimerExpire', context)
          messageForOtpCount = await _.apiRateLimiter(context.ip, apiPath.verifyOtpCount, constraints.verifyOtpCount, constraints.verifyOtpRateLimit)
          break
        default:
          break
      }

      if (messageForOtpCount.status === 'Limit reached') _.throwError('maxNumberOtpReached', context)
    }

    if (!sLogin) _.throwError('requiredField', context)

    if (eAuth === 'fr') eAuth = 'f'

    const tokenQuery = {}
    const oOtpQuery = { eAuth, eType, eStatus: 'a' }

    if (eAuth === 'r') {
      const query = isNumeric(sLogin) ? { sMobNum: sLogin } : { sEmail: sLogin }

      const oUser = await users.findOne(query, { eStatus: 1 }, { readPreference: 'primary' }).lean()

      if (['i', 'd'].includes(oUser?.eStatus)) _.throwError('blocked', context, 'user')
      if (oUser) _.throwError('emailAlreadyRegistered', context)

      oOtpQuery.sLogin = sLogin
      const otp = await otps.find(oOtpQuery)

      if (otp.length) await otps.deleteMany(oOtpQuery)
    }

    if (eAuth === 'f') {
      const query = isNumeric(sLogin) ? { sMobNum: sLogin } : { sEmail: sLogin }
      const oFUser = await users.findOne(query, { _id: 1, eStatus: 1 }, { readPreference: 'primary' }).lean()

      if (!oFUser) _.throwError('accountNotExist', context)
      if (['i', 'd'].includes(oFUser?.eStatus)) _.throwError('blocked', context, 'user')

      oOtpQuery.sLogin = sLogin
      const otp = await otps.find(oOtpQuery)

      if (otp.length) await otps.deleteMany(oOtpQuery)
      tokenQuery.iUserId = oFUser._id
    }

    if (eAuth === 'v') {
      const { authorization } = context.headers
      if (!authorization) _.throwError('requiredField', context)
      const { decodedToken } = context
      if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

      const user = await users.findById(decodedToken.iUserId).lean()
      if (!user) _.throwError('authorizationError', context)
      if (user?.bIsMobVerified) _.throwError('alreadyVerified', context, 'user')

      const isMobileNum = isNumeric(sLogin)
      const query = isMobileNum ? { sMobNum: sLogin } : { sEmail: sLogin }
      const userExist = await users.findOne({ ...query, _id: { $ne: decodedToken.iUserId }, eStatus: 'Y' }, { _id: 1 }, { readPreference: 'primary' }).lean()
      if (userExist) _.throwError('alreadyExists', context, 'user')
      oOtpQuery.sLogin = sLogin

      const otp = await otps.find(oOtpQuery)
      if (otp.length) await otps.deleteMany(oOtpQuery)
    }

    const sOtp = config.NODE_ENV === 'dev' || config.NODE_ENV === 'local-dev' ? '1111' : _.randomCode(4)

    oOtpQuery.sExpiryToken = _.encodeToken({ sLogin: oOtpQuery.sLogin }, '10m')

    oOtpQuery.sCode = sOtp
    const otpCreate = await otps.create(oOtpQuery)
    tokenQuery.sOtp = sOtp

    if (eType === 'm' && otpCreate) {
      // otpService.send(sLogin)
    }

    if (eType === 'e' && otpCreate) {
      queuePush('sendMail', {
        eType: eAuth,
        sEmail: sLogin,
        sOtp
      })
    }

    return _.resolve('sentSuccess', null, 'otp', context)
  } catch (error) {
    return error
  }
}

controllers.verifyUserOTP = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sLogin', 'eType', 'eAuth', 'sOtp'])
    const { sOtp, eType, eAuth, sLogin } = body
    const query = {
      sCode: sOtp,
      eAuth,
      eType,
      sLogin
    }
    const otp = await otps.findOne({ ...query, bIsVerify: false }).lean()
    if (!otp || otp.sCode !== sOtp) _.throwError('otpNotMatched', context)

    if (_.decodeToken(otp?.sExpiryToken) === 'jwt expired') {
      await otps.findByIdAndDelete(otp._id).lean()
      _.throwError('expired', context, 'otp')
    }

    if (eAuth === 'v') {
      const { authorization } = context.headers
      if (!authorization) _.throwError('requiredField', context)
      const { decodedToken } = context
      if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

      const user = await users.findById(decodedToken.iUserId).lean()
      if (!user) _.throwError('authorizationError', context)

      const isMobileNum = isNumeric(sLogin)
      const query = isMobileNum ? { sMobNum: sLogin } : { sEmail: sLogin }

      const userExist = await users.findOne({ ...query, _id: { $ne: _.mongify(decodedToken.iUserId) }, eType: { $nin: ['i', 'd'] } }, { _id: 1 }, { readPreference: 'primary' }).lean()
      if (userExist) _.throwError('alreadyExists', context, 'user')

      if (eType === 'e') {
        await users.findByIdAndUpdate(decodedToken.iUserId, { sEmail: sLogin, bIsEmailVerified: true })
      } else if (eType === 'm') {
        await users.findByIdAndUpdate(decodedToken.iUserId, { sMobNum: sLogin, bIsMobVerified: true })
      }
    }
    if (eAuth === 'f') {
      const isMobileNum = isNumeric(sLogin)
      const query = isMobileNum ? { sMobNum: sLogin } : { sEmail: sLogin }

      const isUserExist = await users.findOne({ ...query, eStatus: 'a' }, { _id: 1 }, { readPreference: 'primary' }).lean()
      if (!isUserExist) _.throwError('accountNotExist', context)
    }
    await otps.findByIdAndUpdate(otp._id, { bIsVerify: true })
    return _.resolve('verifiedSuccess', { oData: { sCode: sOtp } }, 'otp', context)
  } catch (error) {
    return error
  }
}

controllers.resetUserPassword = async (parent, { input }, context) => {
  try {
    let { sNewPassword, sConfirmNewPassword } = input
    const { sCode, sLogin } = input

    if (!sCode) _.throwError('requiredField', context)

    const isOTPExist = await otps.findOne({ $or: [{ eType: 'e' }, { eType: 'm' }], eAuth: 'f', sCode, bIsVerify: true }).sort({ dCreatedAt: -1 }).lean()

    if (sCode && (!isOTPExist || isOTPExist.sCode !== sCode)) _.throwError('wentWrongWith', context, 'otp')

    sConfirmNewPassword = _.asymmetricDecrypt(sConfirmNewPassword).message
    sNewPassword = _.asymmetricDecrypt(sNewPassword).message

    if (sNewPassword !== sConfirmNewPassword) _.throwError('passAndCpassNotMatch', context)

    if (_.isPassword(sNewPassword)) _.throwError('invalidPassword', context)

    const query = {
      $or: [{ sMobNum: sLogin }, { sEmail: sLogin }],
      eStatus: 'a'
    }

    const user = await users.findOne(query).lean()

    if (!user) _.throwError('accountNotExist', context)
    if (_.encryptPassword(sNewPassword) === user.sPassword) _.throwError('newPasswordSameAsOld', context)
    const token = await tokens.findOne({ iId: _.mongify(user._id) }).lean()
    if (token?.aToken?.length) {
      for (let index = 0; index < token.aToken.length; index++) {
        const ele = token.aToken[index]
        if (ele?.sJwt && _.decodeToken(ele.sJwt) !== 'jwt expired' && _.decodeToken(ele.sJwt) !== 'invalid signature') {
          await redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), `${user._id}`)
          ele.sJwt = ''
        } else {
          ele.sJwt = ''
        }
      }
    }

    const ePlatform = ['A', 'I', 'W'].includes(context.platform) ? context.platform : 'O'

    await authlogs.create({ iUserId: user._id, ePlatform, eType: 'RP', sIpAddress: context.ip })
    await users.updateOne(query, { sPassword: _.encryptPassword(sNewPassword), bNormalLogin: true })
    await tokens.updateOne({ iId: _.mongify(user._id) }, { aToken: token.aToken })

    if (isOTPExist) await otps.deleteOne({ _id: isOTPExist._id })

    return _.resolve('successfully', null, 'resetPassword', context)
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.userLogout = async (parent, input, context) => {
  try {
    const { authorization } = context.headers
    const { decodedToken } = context
    const query = { iId: _.mongify(decodedToken.iUserId), eType: 'u' }

    const token = await tokens.findOne(query).lean()
    token?.aToken?.splice(token.aToken.findIndex((ele) => ele.sJwt === authorization), 1)

    await redisAuthDb.setex(`at:${authorization}`, moment(decodedToken.exp * 1000).diff(moment(), 'seconds'), `${decodedToken.iUserId}`)

    if (token) await tokens.updateOne({ _id: _.mongify(token._id) }, { aToken: token.aToken })

    return _.resolve('loggedOutSuccess', null, '', context)
  } catch (error) {
    return error
  }
}

controllers.userChangePassword = async (parent, { input }, context) => {
  try {
    if (!context?.headers?.authorization) _.throwError('requiredField', context)
    const { decodedToken } = context

    const userExist = await users.findOne({ _id: decodedToken.iUserId }).lean()
    if (!userExist) _.throwError('accountNotExist', context)

    let { sCurrentPassword, sNewPassword, sConfirmPassword } = input

    if (!sConfirmPassword || !sNewPassword)_.throwError('requiredField', context)

    sNewPassword = _.asymmetricDecrypt(sNewPassword).message
    sConfirmPassword = _.asymmetricDecrypt(sConfirmPassword).message

    if (_.isPassword(sNewPassword)) _.throwError('invalidPassword', context)
    if (sNewPassword !== sConfirmPassword) _.throwError('passAndCpassNotMatch', context)

    if (userExist.sPassword) {
      if (!sCurrentPassword || !sConfirmPassword || !sNewPassword)_.throwError('requiredField', context)
      sCurrentPassword = _.asymmetricDecrypt(sCurrentPassword).message
      if (userExist.sPassword !== _.encryptPassword(sCurrentPassword)) _.throwError('changePasswordIncorrect', context)
      if (sNewPassword === sCurrentPassword) _.throwError('passwordMatch', context)
    }

    const token = await tokens.findOne({ iId: _.mongify(decodedToken.iUserId) }).lean()
    if (token?.aToken?.length) {
      for (let index = 0; index < token.aToken.length; index++) {
        const ele = token.aToken[index]
        if (ele.sJwt && (ele.sJwt !== context.headers.authorization) && _.decodeToken(ele.sJwt) !== 'jwt expired' && _.decodeToken(ele.sJwt) !== 'invalid signature') {
          await redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), `${decodedToken._id}`)
          ele.sJwt = ''
        }
      }
    }

    await users.updateOne({ _id: _.mongify(decodedToken.iUserId) }, { sPassword: _.encryptPassword(sNewPassword), bNormalLogin: true }, { readPreference: 'primary' })
    await tokens.updateOne({ iId: _.mongify(decodedToken.iUserId) }, { aToken: token.aToken })

    const ePlatform = ['A', 'I', 'W'].includes(context.platform) ? context.platform : 'O'
    await authlogs.create({ iUserId: _.mongify(decodedToken.iUserId), ePlatform, eType: 'CP', sIpAddress: context.ip })

    return _.resolve('successfully', null, 'changePassword', context)
  } catch (error) {
    return error
  }
}

controllers.resolveUser = async (_id) => {
  try {
    const user = await users.findOne({ _id: _.mongify(_id) }).lean()
    return user
  } catch (error) {
    return error
  }
}

controllers.userExists = async (parent, { input }, context) => {
  try {
    let { sLogin, sUserName } = input
    sUserName = sUserName.toLowerCase()
    sLogin = sLogin.toLowerCase()

    if (sLogin && _.isEmail(sLogin)) _.throwError('invalidEmail', context)
    const domain = sLogin.substring(sLogin.lastIndexOf('@') + 1)
    if (_.validateEmailDomain(domain))_.throwError('invalidDomain', context)

    if (sUserName && _.isUserName(sUserName)) _.throwError('invalidUserName', context)

    const emailQuery = {
      sEmail: sLogin
    }
    const sUserNameQuery = {
      sUsername: sUserName
    }
    const isUserExist = await users.findOne({ ...sUserNameQuery }, { _id: 1 }, { readPreference: 'primary' }).lean()
    if (isUserExist) _.throwError('alreadyExists', context, 'userName')
    const isEmailExist = await users.findOne({ ...emailQuery }, { _id: 1 }, { readPreference: 'primary' }).lean()
    if (isEmailExist) _.throwError('alreadyExists', context, 'email')

    return _.resolve('verifiedSuccess', '', 'emailAndUserName', context)
  } catch (error) {
    return error
  }
}

module.exports = controllers
