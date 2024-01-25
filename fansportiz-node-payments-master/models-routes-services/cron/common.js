const config = require('../../config/config')
const UserDepositModel = require('../userDeposit/model')
const PassbookModel = require('../passbook/model')
const UserBalanceModel = require('../userBalance/model')
const UserWithdrawModel = require('../userWithdraw/model')
const { literal } = require('sequelize')
const db = require('../../database/sequelize')
const axios = require('axios')
// const PromocodeModel = require('../promocode/model')
// const PromocodeStatisticServices = require('../promocode/statistics/model')
// const UsersModel = require('../user/model')
// const StatisticsModel = require('../user/statistics/model')
const ObjectId = require('mongoose').Types.ObjectId
const { jsonStatus, messages } = require('../../helper/api.responses')
const { queuePush } = require('../../helper/redis')
const { validateCashfreeToken } = require('../payment/common')
const { CASHFREE_ORDERID_PREFIX, APP_LANG } = require('../../config/common')
const { convertToDecimal } = require('../../helper/utilities.services')
const { findPromocode, createPromocodeStatistics, updateUserStatistics, findUser } = require('../userDeposit/grpc/clientServices')

const checkCashfreeStatus = (iOrderId) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const iDepositId = iOrderId
        if (!iOrderId.toString().includes(`${CASHFREE_ORDERID_PREFIX}`)) {
          iOrderId = `${CASHFREE_ORDERID_PREFIX}${iOrderId}`
        }
        const response = await axios.get(`${config.CASHFREE_STABLE_URL}/orders/${iOrderId}/payments`, { headers: { 'x-api-version': '2022-01-01', 'Content-Type': 'application/json', 'x-client-id': config.CASHFREE_APPID, 'x-client-secret': config.CASHFREE_SECRETKEY } })
        const payload = response.data

        const logData = { iDepositId, eGateway: 'CASHFREE', eType: 'D', oReq: { iOrderId }, oRes: response ? response.data : {} }
        await queuePush('TransactionLog', logData)

        return resolve({ isSuccess: true, payload })
      } catch (error) {
        return resolve({ isSuccess: false, error: error })
      }
    })()
  })
}

const processPayment = (deposit, payload) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await db.sequelize.transaction(async (t) => {
          const { iUserId, id, ePaymentGateway, nCash = 0, nBonus = 0, nAmount } = deposit
          const { payment_status: ePaymentStatus, cf_payment_id: referenceId } = payload[0] || {}
          if (deposit.ePaymentStatus !== 'S') {
            if (ePaymentStatus === 'SUCCESS') {
              let dBonusExpiryDate = new Date()
              if (deposit.sPromocode) {
                const promocode = await findPromocode({ sCode: deposit.sPromocode.toUpperCase() }, { nBonusExpireDays: 1 })
                const { nBonusExpireDays = 0 } = promocode
                if (nBonusExpireDays) {
                  dBonusExpiryDate.setDate(dBonusExpiryDate.getDate() + nBonusExpireDays)
                } else { dBonusExpiryDate = null }
              } else {
                dBonusExpiryDate = null
              }

              const updateDepositResult = await UserDepositModel.update({ ePaymentStatus: 'S', ePaymentGateway, sInfo: JSON.stringify(deposit), iTransactionId: referenceId, dProcessedDate: new Date() }, { where: { id: id }, transaction: t, lock: true })
              const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })

              const { nCurrentBonus: nOldBonus, nCurrentTotalBalance: nOldTotalBalance, nCurrentDepositBalance: nOldDepositBalance, nCurrentWinningBalance: nOldWinningBalance } = oldBalance

              await UserBalanceModel.update({
                nCurrentDepositBalance: literal(`nCurrentDepositBalance + ${nCash}`),
                nCurrentTotalBalance: literal(`nCurrentTotalBalance + ${nCash}`),
                nTotalDepositAmount: literal(`nTotalDepositAmount + ${nCash}`),
                nTotalBonusEarned: literal(`nTotalBonusEarned + ${nBonus}`),
                nCurrentBonus: literal(`nCurrentBonus + ${nBonus}`),
                nTotalDepositCount: literal('nTotalDepositCount + 1')
              },
              {
                where: { iUserId },
                transaction: t,
                lock: true
              })
              await PassbookModel.create({
                iUserId,
                nAmount,
                nCash,
                nBonus,
                dBonusExpiryDate,
                nOldBonus,
                nOldTotalBalance,
                nOldDepositBalance,
                nOldWinningBalance,
                eTransactionType: 'Deposit',
                iUserDepositId: deposit.id,
                eType: 'Cr',
                sRemarks: messages[APP_LANG].deposit_success_of.replace('##', nAmount).replace('#', ePaymentGateway),
                dActivityDate: new Date(),
                iTransactionId: referenceId,
                eStatus: 'CMP'
              }, { transaction: t, lock: true })

              await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: { nActualBonus: convertToDecimal(nBonus), nDeposits: nCash, nCash, nBonus, nDepositCount: 1, nActualDepositBalance: convertToDecimal(nCash), nDepositDiscount: convertToDecimal(nBonus) } }, { upsert: true })

              // Assign referral on first deposit
              const user = await findUser({ _id: ObjectId(iUserId) })
              const { sReferrerRewardsOn = '', iReferredBy = '' } = user
              if (iReferredBy && sReferrerRewardsOn && sReferrerRewardsOn === 'FIRST_DEPOSIT') {
                let depositCount = await UserDepositModel.count({
                  where: {
                    iUserId,
                    ePaymentStatus: 'S'
                  }
                }, {
                  transaction: t, lock: true
                })

                depositCount += updateDepositResult[0]

                if (depositCount === 1) {
                  await queuePush('processReferReward', { sReferral: 'DB', iUserId: user._id })

                  // const referredBy = await UsersModel.findOne({ _id: iReferredBy }).lean()
                  // if (referredBy) {
                  //   const registerReferBonus = await commonRuleServices.findRule('RR')
                  //   if (registerReferBonus) {
                  //     const refer = await userBalanceServices.referBonus({ iUserId: referredBy._id, rule: registerReferBonus, sReferCode: referredBy.sReferCode, sUserName: referredBy.sUsername, eType: referredBy.eType, nReferrals: 1, iReferById: user._id })
                  //     if (refer.isSuccess === false) {
                  //       return resolve({ alreadySuccess: false, status: jsonStatus.BadRequest, message: messages.English.went_wrong_with.replace('##', messages.English.bonus) })
                  //     }
                  //     // Add Push Notification
                  //     await queuePush('pushNotification:registerReferBonus', { _id: referredBy._id })
                  //   }
                  // }
                }
              }

              if (deposit.iPromocodeId) {
                await createPromocodeStatistics({
                  iUserId,
                  iPromocodeId: deposit.iPromocodeId,
                  nAmount: nBonus,
                  sTransactionType: 'DEPOSIT',
                  idepositId: deposit.id
                })
              }
              return resolve({ alreadySuccess: false, status: jsonStatus.OK })
            } else if (!payload.length || ['CANCELLED', 'PENDING', 'FAILED'].includes(ePaymentStatus)) {
              await UserDepositModel.update({ ePaymentStatus: 'C', sInfo: JSON.stringify(payload), iTransactionId: referenceId, dProcessedDate: new Date() }, { where: { id: id }, transaction: t, lock: true })
              return resolve({ alreadySuccess: false, status: jsonStatus.OK })
            } else {
              return resolve({ alreadySuccess: false, status: jsonStatus.OK })
            }
          }
        })
      } catch (error) {
        return reject(error)
      }
    })()
  })
}

const checkCashfreePayoutStatus = (iTransferId) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const data = await validateCashfreeToken()
        const { isVerify, Token } = data
        if (isVerify) {
          const response = await axios.get(`${config.CASHFREE_BASEURL}/${config.CASHFREE_TRANSFER_STATUS_PATH}?transferId=${iTransferId}`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${Token}` } })

          const payload = response.data

          const logData = { iWithdrawId: iTransferId, eGateway: 'CASHFREE', eType: 'W', oReq: { iTransferId }, oRes: response ? response.data : {} }
          await queuePush('TransactionLog', logData)

          if (payload.status !== 'ERROR') {
            return resolve({ isSuccess: true, payload: payload.data })
          } else return resolve({ isSuccess: false, error: payload })
        } else {
          return resolve({ isSuccess: false, error: data })
        }
      } catch (error) {
        return resolve({ isSuccess: false, error: error })
      }
    })()
  })
}

const processPayout = (withdraw, payload) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { iUserId, id, nAmount, eUserType } = withdraw
        const { referenceId, beneId, status: ePaymentStatus, reason, transferMode } = payload.transfer

        const sRemarks = messages[APP_LANG].remarks_values.replace('#paymentstatus#', ePaymentStatus).replace('#refId#', referenceId).replace('#beneId#', beneId).replace('#reason#', reason).replace('#transfermode#', transferMode)

        await db.sequelize.transaction(async (t) => {
          const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })
          const { nCurrentBonus: nOldBonus, nCurrentTotalBalance: nOldTotalBalance, nCurrentDepositBalance: nOldDepositBalance, nCurrentWinningBalance: nOldWinningBalance } = oldBalance

          if (ePaymentStatus === 'SUCCESS') {
            await UserWithdrawModel.update({ ePaymentStatus: 'S', iTransactionId: referenceId, sInfo: JSON.stringify(payload.transfer), dProcessedDate: new Date() }, { where: { id }, transaction: t, lock: true })
            return resolve({ alreadySuccess: false, status: jsonStatus.OK })
          } else if (['FAILED', 'ERROR', 'REJECTED'].includes(ePaymentStatus)) {
            await UserWithdrawModel.update({ ePaymentStatus: 'R', dProcessedDate: new Date() }, { where: { id }, transaction: t, lock: true })

            let updateStatsObj
            const updateObj = {
              nCurrentTotalBalance: literal(`nCurrentTotalBalance + ${nAmount}`),
              nTotalWithdrawAmount: literal(`nTotalWithdrawAmount - ${nAmount}`),
              nTotalWithdrawCount: literal('nTotalWithdrawCount - 1')
            }
            const passbook = await PassbookModel.findOne({ where: { iUserId, iWithdrawId: id } }, { transaction: t, lock: true })
            const winDiff = passbook.nOldWinningBalance - passbook.nNewWinningBalance
            const depositDiff = passbook.nOldDepositBalance - passbook.nNewDepositBalance
            if (depositDiff > 0) {
              if (winDiff > 0) {
                updateObj.nCurrentWinningBalance = literal(`nCurrentWinningBalance + ${winDiff}`)
                updateObj.nCurrentDepositBalance = literal(`nCurrentDepositBalance + ${depositDiff}`)
                updateStatsObj = {
                  nActualDepositBalance: convertToDecimal(depositDiff),
                  nCash: convertToDecimal(depositDiff),
                  nActualWinningBalance: convertToDecimal(winDiff),
                  nWinnings: convertToDecimal(winDiff)
                }
              } else {
                updateObj.nCurrentDepositBalance = literal(`nCurrentDepositBalance + ${nAmount}`)
                updateStatsObj = {
                  nActualDepositBalance: convertToDecimal(nAmount),
                  nCash: convertToDecimal(nAmount)
                }
              }
            } else {
              updateObj.nCurrentWinningBalance = literal(`nCurrentWinningBalance + ${nAmount}`)
              updateStatsObj = {
                nActualWinningBalance: convertToDecimal(nAmount),
                nWinnings: convertToDecimal(nAmount)
              }
            }
            updateStatsObj = { ...updateStatsObj, nWithdraw: -convertToDecimal(nAmount), nWithdrawCount: -1 }
            await UserBalanceModel.update(updateObj,
              {
                where: { iUserId },
                transaction: t,
                lock: true
              })

            await PassbookModel.create({ iUserId, eUserType, nAmount, nCash: nAmount, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Withdraw-Return', iWithdrawId: withdraw.id, eType: 'Cr', sRemarks, eStatus: 'R' }, { transaction: t, lock: true })
            await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: updateStatsObj }, { upsert: true })
            return resolve({ alreadySuccess: false, status: jsonStatus.OK })
          } else if (ePaymentStatus === 'REVERSED') {
            await UserWithdrawModel.update({ bReversed: true, dReversedDate: new Date() }, { where: { id }, transaction: t, lock: true })
            return resolve({ alreadySuccess: false, status: jsonStatus.OK })
          } else {
            return resolve({ alreadySuccess: false, status: jsonStatus.OK })
          }
        })
      } catch (error) {
        return reject(error)
      }
    })()
  })
}

module.exports = {
  checkCashfreeStatus,
  processPayment,
  checkCashfreePayoutStatus,
  processPayout
}
