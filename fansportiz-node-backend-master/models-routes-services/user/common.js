const UserLeagueModel = require('../userLeague/model')
const { handleCatchError } = require('../../helper/utilities.services')
const userBalanceServices = require('../userBalance/services')
const { queuePush } = require('../../helper/redis')
const UsersModel = require('./model')
const commonRuleServices = require('../commonRules/services')

// done...
async function processLeagueJoinReferReward(data) {
  try {
    const { iUserId, sReferrerRewardsOn, iReferredBy, nJoinSuccess } = data
    let totalLeagueJoinCount
    if (sReferrerRewardsOn === 'FIRST_PAID_LEAGUE_JOIN') {
      totalLeagueJoinCount = await UserLeagueModel.countDocuments({ iUserId, nOriginalPrice: { $gt: 0 } })
    } else {
      totalLeagueJoinCount = await UserLeagueModel.countDocuments({ iUserId })
    }

    if (nJoinSuccess !== 0) {
      totalLeagueJoinCount = totalLeagueJoinCount - nJoinSuccess

      if (totalLeagueJoinCount === 0) {
        const referredBy = await UsersModel.findOne({ _id: iReferredBy }, { sReferCode: 1, sUsername: 1, eType: 1, _id: 1 }).lean()
        if (referredBy) {
          const registerReferBonus = await commonRuleServices.findRule('RR')
          if (registerReferBonus) {
            const refer = await userBalanceServices.referBonus({ iUserId: referredBy._id, rule: registerReferBonus, sReferCode: referredBy.sReferCode, sUserName: referredBy.sUsername, eType: referredBy.eType, nReferrals: 1, iReferById: iUserId })
            if (refer && refer.isSuccess) {
              // Add Push Notification
              await queuePush('pushNotification:registerReferBonus', { _id: referredBy._id })
            }
          }
        }
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

// done...
async function processRegisterReferCodeBonus(data) {
  try {
    const { registerReferBonus, referCodeBonus, referredBy, user } = data

    // const registerReferBonus = await commonRuleServices.findRule('RR')
    // const referCodeBonus = await commonRuleServices.findRule('RCB')

    const { sRewardOn = '' } = registerReferBonus || {}
    // We'll give refer reward from whom refer code through new user registered
    if (registerReferBonus && sRewardOn && sRewardOn === 'REGISTER') {
      const refer = await userBalanceServices.referBonus({ iUserId: referredBy._id, rule: registerReferBonus, sReferCode: referredBy.sReferCode, sUserName: referredBy.sUsername, eType: referredBy.eType, nReferrals: 1, iReferById: user._id })
      if (refer && refer.isSuccess) {
        // Add Push Notification
        await queuePush('pushNotification:registerReferBonus', { _id: referredBy._id })
      }
    }

    // We'll give refer code bonus to new user because they participate in referral code program
    if (referCodeBonus) {
      const refer = await userBalanceServices.referBonus({ iUserId: user._id, rule: referCodeBonus, sReferCode: referredBy.sReferCode, sUserName: user.sUsername, eType: user.eType })

      if (refer && refer.isSuccess) {
        // Add Push Notification
        await queuePush('pushNotification:referCodeBonus', { _id: user._id })
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

// done...
async function processRegisterBonus(data) {
  try {
    const { iUserId } = data
    // We'll give register bonus to all new user who don't register with refer code.
    const user = await UsersModel.findById(iUserId, { _id: 1, sReferCode: 1, sUsername: 1, eType: 1 }, { readPreference: 'primaryPreferred' }).lean()

    if (user) {
      const registerBonus = await commonRuleServices.findRule('RB')
      if (registerBonus) {
        const refer = await userBalanceServices.referBonus({ iUserId: user._id, rule: registerBonus, sReferCode: user.sReferCode, sUserName: user.sUsername, eType: user.eType }, { readPreference: 'primaryPreferred' })
        if (refer && refer.isSuccess) {
          // Add Push Notification
          await queuePush('pushNotification:registerBonus', { _id: user._id })
        }
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

// done....
async function processFirstDepositReferBonus(data) {
  try {
    const { iUserId } = data
    const user = await UsersModel.findById(iUserId, { _id: 1, iReferredBy: 1 }).populate({ path: 'iReferredBy', select: '_id sReferCode sUsername eType' }).lean()
    const { iReferredBy: referredBy } = user

    if (referredBy) {
      const registerReferBonus = await commonRuleServices.findRule('RR')
      if (registerReferBonus) {
        const refer = await userBalanceServices.referBonus({ iUserId: referredBy._id, rule: registerReferBonus, sReferCode: referredBy.sReferCode, sUserName: referredBy.sUsername, eType: referredBy.eType, nReferrals: 1, iReferById: user._id })
        if (refer && refer.isSuccess) {
          // Add Push Notification
          await queuePush('pushNotification:registerReferBonus', { _id: referredBy._id })
        }
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = {
  processLeagueJoinReferReward,
  processRegisterBonus,
  processRegisterReferCodeBonus,
  processFirstDepositReferBonus
}
