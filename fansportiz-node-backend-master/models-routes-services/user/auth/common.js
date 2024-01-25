const jwt = require('jsonwebtoken')
const UsersModel = require('../model')
const PreferencesModel = require('../../preferences/model')
const commonRuleServices = require('../../commonRules/services')
const userBalanceServices = require('../../userBalance/services')
const { genDynamicLinkV2 } = require('../../../helper/firebase.services')
const { messages, jsonStatus } = require('../../../helper/api.responses')
const { checkAlphanumeric, validatePassword, validateUsername, handleCatchError, randomStr } = require('../../../helper/utilities.services')
const { queuePush } = require('../../../helper/redis')
const config = require('../../../config/config')
const bcrypt = require('bcryptjs')
const { subscribeUser } = require('../../../helper/firebase.services')
const { UsersDBConnect } = require('../../../database/mongoose')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)
const { createKyc } = require('../grpc/clientServices')
const common = require('../../../config/common')

const checkUserExist = async (body, userLanguage = 'English') => {
  try {
    const { sUsername, sEmail, sMobNum, sPassword } = body
    if (!checkAlphanumeric(sUsername)) return { isSuccess: false, status: jsonStatus.BadRequest, message: messages[userLanguage].must_alpha_num }
    if (!validateUsername(sUsername)) return { isSuccess: false, status: jsonStatus.BadRequest, message: messages[userLanguage].invalid.replace('##', messages[userLanguage].username) }
    if (sMobNum.length !== 10) return { isSuccess: false, status: jsonStatus.BadRequest, message: messages[userLanguage].invalid.replace('##', messages[userLanguage].mobileNumber) }
    if (sPassword && !validatePassword(sPassword)) return { isSuccess: false, status: jsonStatus.BadRequest, message: messages[userLanguage].invalid_pass.replace('##', messages[userLanguage].ssPassword) }

    const userExist = await UsersModel.findOne({ $or: [{ sEmail }, { sMobNum }, { sUsername }] }, null, { readPreference: 'primary' })
    if (userExist && userExist.eType === 'B') return { isSuccess: false, status: jsonStatus.NotFound, message: messages[userLanguage].user_blocked }
    if (userExist && userExist.sUsername === sUsername) return { isSuccess: false, status: jsonStatus.ResourceExist, message: messages[userLanguage].already_exist.replace('##', messages[userLanguage].username) }
    if (userExist && userExist.sMobNum === sMobNum) return { isSuccess: false, status: jsonStatus.ResourceExist, message: messages[userLanguage].already_exist.replace('##', messages[userLanguage].mobileNumber) }
    if (userExist && userExist.sEmail === sEmail) return { isSuccess: false, status: jsonStatus.ResourceExist, message: messages[userLanguage].already_exist.replace('##', messages[userLanguage].email) }
    return { isSuccess: true, status: jsonStatus.OK, message: messages[userLanguage].successfully.replace('##', messages[userLanguage].checkUser) }
  } catch (error) {
    handleCatchError(error)
    return { isSuccess: false, status: jsonStatus.InternalServerError, message: messages[userLanguage].err_user_check }
  }
}

const processRegisterAndReferBonus = async (body, userLanguage = 'English', ip) => {
  const { sUsername, sDeviceId, sPushToken, sReferCode } = body
  let referredBy
  if (sReferCode) {
    referredBy = await UsersModel.findOne({ sReferCode: sReferCode }).lean()
    if (!referredBy) {
      return { isSuccess: false, status: jsonStatus.BadRequest, message: messages[userLanguage].enter_valid_referral_code }
    }
  }
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' }
  }
  const session = await UsersDBConnect.startSession()
  session.startTransaction(transactionOptions)
  let iUserId, eUserType
  try {
    const sPotectedPassword = bcrypt.hashSync(body.sPassword ?? '', salt)
    const aDeviceToken = sDeviceId ? [sDeviceId] : []

    // const sNewReferCode = await genReferCode(sName || sUsername);
    const sNewReferCode = await genReferCodeV2()
    const sNewReferLink = await genDynamicLinkV2('share', sNewReferCode)

    const oUser = {
      ...body,
      sReferCode: sNewReferCode,
      aDeviceToken,
      sReferLink: sNewReferLink
    }
    if (body?.sPassword) oUser.sPassword = sPotectedPassword

    let user = await UsersModel.create(
      [
        oUser
      ],
      { session }
    )

    if (Array.isArray(user)) {
      user = user[0]
    }

    await createKyc(user._id.toString())
    const Authorization = jwt.sign(
      { _id: user._id.toHexString(), eType: user.eType },
      config.JWT_SECRET,
      { expiresIn: config.JWT_VALIDITY }
    )
    const newToken = { sPushToken }

    iUserId = user._id
    eUserType = user.eType

    const openAccount = await userBalanceServices.openAccount({
      iUserId: user._id,
      sUsername,
      eType: user.eType
    })

    if (openAccount.isSuccess === false) {
      throw new Error(
        messages[userLanguage].went_wrong_with.replace(
          '##',
          messages[userLanguage].cpassbook
        )
      )
    }

    await PreferencesModel.create([{ iUserId: user._id }], { session })

    let registerReferBonus
    let referCodeBonus
    let registerBonus
    if (referredBy) {
      user.iReferredBy = referredBy._id
      registerReferBonus = await commonRuleServices.findRule('RR')
      referCodeBonus = await commonRuleServices.findRule('RCB')

      // We'll give refer reward from whom refer code through new user registered
      if (registerReferBonus) {
        const { sRewardOn = '' } = registerReferBonus
        if (sRewardOn) {
          if (sRewardOn === 'REGISTER') {
            const refer = await userBalanceServices.referBonus({
              iUserId: referredBy._id,
              rule: registerReferBonus,
              sReferCode: referredBy.sReferCode,
              sUserName: referredBy.sUsername,
              eType: referredBy.eType,
              nReferrals: 1,
              iReferById: user._id
            })

            if (refer.isSuccess === false) {
              throw new Error(
                messages[userLanguage].went_wrong_with.replace(
                  '##',
                  messages[userLanguage].bonus
                )
              )
            }

            // Add Push Notification
            await queuePush('pushNotification:registerReferBonus', {
              _id: user._id
            })
          }
          user.sReferrerRewardsOn = sRewardOn
        }
      }
      // We'll give refer code bonus to new user because they participate in referral code program
      if (referCodeBonus) {
        const refer = await userBalanceServices.referBonus({
          iUserId: user._id,
          rule: referCodeBonus,
          sReferCode: referredBy.sReferCode,
          sUserName: user.sUsername,
          eType: user.eType,
          iReferById: referredBy._id
        })
        // const refer = await userBalanceServices.referAddBonus({ iUserId: user._id, rule: referCodeBonus, sReferCode: referredBy.sReferCode, sUserName: user.sUsername, eType: user.eType })

        if (refer.isSuccess === false) {
          throw new Error(
            messages[userLanguage].went_wrong_with.replace(
              '##',
              messages[userLanguage].bonus
            )
          )
        }
        // Add Push Notification
        await queuePush('pushNotification:referCodeBonus', {
          _id: referredBy._id
        })
      }
    } else {
      // We'll give register bonus to all new user who don't register with refer code.
      registerBonus = await commonRuleServices.findRule('RB')
      const refer = await userBalanceServices.referBonus({
        iUserId: user._id,
        rule: registerBonus,
        sReferCode: user.sReferCode,
        sUserName: user.sUsername,
        eType: user.eType
      })

      if (refer.isSuccess === false) {
        throw new Error(
          messages[userLanguage].went_wrong_with.replace(
            '##',
            messages[userLanguage].bonus
          )
        )
      }
      // Add Push Notification
      await queuePush('pushNotification:registerBonus', { _id: user._id })
    }

    await session.commitTransaction()
    await UsersModel.updateOne(
      { _id: ObjectId(user._id) },
      {
        sReferrerRewardsOn: user.sReferrerRewardsOn,
        $push: { aPushToken: newToken },
        iReferredBy: user.iReferredBy
      }
    )

    if (sPushToken) {
      await subscribeUser(sPushToken, body.ePlatform)
    }

    await queuePush('AuthLogs', {
      iUserId: user._id,
      ePlatform: body.ePlatform,
      eType: 'R',
      sDeviceToken: sDeviceId,
      sIpAddress: ip
    })

    UsersModel.filterDataForUser(user)
    return { isSuccess: true, status: jsonStatus.OK, message: messages[userLanguage].reg_success, data: { user, Authorization } }
  } catch (error) {
    if (iUserId && eUserType) {
      await userBalanceServices.revertOpenedAccount({
        iUserId,
        eType: eUserType
      })
    }
    await session.abortTransaction()
    handleCatchError(error)
    return { isSuccess: false, status: jsonStatus.InternalServerError, message: messages[userLanguage].error }
  } finally {
    session.endSession()
  }
}

const genReferCodeV2 = async (sName) => {
  try {
    // const sReferCode = sName
    //   ? sName.substring(0, common.REFERRAL_CODE_USER_NAME_LENGTH) +
    //   randomStr(common.REFERRAL_CODE_RANDOM_NUMBER_LENGTH, "referral")
    //   : randomStr(common.REFERRAL_CODE_LENGTH, "referral");
    const sReferCode = randomStr(common.REFERRAL_CODE_LENGTH, 'referral')
    const codeExist = await UsersModel.countDocuments({ sReferCode })
    if (
      !codeExist &&
        sReferCode.toString().length === common.REFERRAL_CODE_LENGTH
    ) {
      return sReferCode.toUpperCase()
    } else {
      return genReferCodeV2(sName)
    }
  } catch (error) {
    handleCatchError(error)
    return new Error(error)
  }
}

module.exports = {
  checkUserExist,
  processRegisterAndReferBonus,
  genReferCodeV2
}
