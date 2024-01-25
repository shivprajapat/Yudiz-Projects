const UserWithdrawModel = require('./model')
const PassbookModel = require('../passbook/model')
const UserBalanceModel = require('../userBalance/model')
const db = require('../../database/sequelize')
const { Transaction, Op, literal } = require('sequelize')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { APP_LANG } = require('../../config/common')
const { handleCatchError, convertToDecimal } = require('../../helper/utilities.services')
const { messages } = require('../../helper/api.responses')
const { findUsers, updateUserStatistics } = require('../userDeposit/grpc/clientServices')

async function reversedTransaction(data, iWithdrawId) {
  try {
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async (t) => {
      await UserWithdrawModel.update({ dReversedDate: new Date(), bReversed: true }, { where: { id: iWithdrawId }, transaction: t, lock: true })
    })
    return { isSuccess: true }
  } catch (error) {
    handleCatchError(error)
    return { isSuccess: false }
  }
}

async function cancellOrRejectTransaction(data, ePaymentStatus, iWithdrawId) {
  try {
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async (t) => {
      const withdraw = await UserWithdrawModel.findOne({ where: { id: iWithdrawId, ePaymentStatus: { [Op.notIn]: ['C', 'R'] } }, raw: true }, { transaction: t, lock: true })

      if (withdraw) {
        const { iUserId, nAmount, ePaymentGateway } = withdraw
        const dProcessedDate = new Date()

        const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })
        const { eUserType, nCurrentBonus: nOldBonus, nCurrentTotalBalance: nOldTotalBalance, nCurrentDepositBalance: nOldDepositBalance, nCurrentWinningBalance: nOldWinningBalance } = oldBalance

        await UserWithdrawModel.update({ ePaymentStatus, iTransactionId: data.referenceId, dProcessedDate }, { where: { id: iWithdrawId }, transaction: t, lock: true })

        let updateStatsObj
        const updateObj = {
          nCurrentTotalBalance: literal(`nCurrentTotalBalance + ${nAmount}`),
          nTotalWithdrawAmount: literal(`nTotalWithdrawAmount - ${nAmount}`),
          nTotalWithdrawCount: literal('nTotalWithdrawCount - 1')
        }
        const passbook = await PassbookModel.findOne({ where: { iUserId, iWithdrawId: iWithdrawId } }, { transaction: t, lock: true })
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
        await PassbookModel.create({ iUserId, eUserType, nAmount, nCash: nAmount, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Withdraw-Return', iWithdrawId: withdraw.id, eType: 'Cr', sRemarks: messages[APP_LANG].withdraw_rejected_webhook.replace('##', ePaymentGateway), dProcessedDate, eStatus: 'R' }, { transaction: t, lock: true })
        await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: updateStatsObj }, { upsert: true })
      }
    })
    return { isSuccess: true }
  } catch (error) {
    handleCatchError(error)
    return { isSuccess: false }
  }
}

async function successTransaction(data, iWithdrawId) {
  try {
    const { referenceId } = data
    const dProcessedDate = new Date()

    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async (t) => {
      const withdraw = await UserWithdrawModel.count({ where: { id: iWithdrawId, ePaymentStatus: { [Op.in]: ['P', 'I'] } }, raw: true }, { transaction: t, lock: true })

      if (withdraw) {
        await UserWithdrawModel.update({ ePaymentStatus: 'S', dProcessedDate, iTransactionId: referenceId }, { where: { id: iWithdrawId }, transaction: t, lock: true })
        await PassbookModel.update({ dProcessedDate }, { where: { iWithdrawId }, transaction: t, lock: true })
      }
    })
    return { isSuccess: true }
  } catch (error) {
    handleCatchError(error)
    return { isSuccess: false }
  }
}
/**
 * Used for getting list for admin withdraw and deposit
 * @param  {enum}  ePaymentStatus = ['P','S','R','C']
 * @param  {enum} ePaymentGateway
 * @param {string} sSearch value for searching
 * @param {string} sFlag = 'D' for deposit ,'W' for withdraw
 * @param {boolean} bReversedFlag ='y','n
 * @return {userQuery, aUsers} {isSuccess, status, message, data}
 */
async function getAdminWithdrawDepositListQuery(ePaymentStatus, ePaymentGateway, sSearch, sFlag, bReversedFlag) {
  const query = []

  if (ePaymentStatus) {
    query.push({ ePaymentStatus })
  }

  if (ePaymentGateway) {
    query.push({ ePaymentGateway })
  }

  if (bReversedFlag && ['y', 'n'].includes(bReversedFlag)) {
    const bReversed = (bReversedFlag === 'y')
    query.push({ bReversed })
  }
  let aUsers = []
  if (sSearch && sSearch.length) {
    const aSearchQuery = []
    const nSearchNumber = Number(sSearch)
    if (!isNaN(nSearchNumber)) {
      aUsers = await findUsers({ sMobNum: new RegExp('^.*' + sSearch + '.*', 'i') }, { sMobNum: 1, sEmail: 1, sUsername: 1 })
      const userIds = aUsers.map(user => user._id.toString())

      if (aUsers.length) {
        aSearchQuery.push({
          [Op.or]: [
            { id: { [Op.like]: nSearchNumber + '%' } },
            { iUserId: { [Op.in]: userIds } }
          ]
        })
      } else {
        aSearchQuery.push({ id: nSearchNumber })
      }
    } else {
      aUsers = await findUsers({ $or: [{ sName: new RegExp('^.*' + sSearch + '.*', 'i') }, { sUsername: new RegExp('^.*' + sSearch + '.*', 'i') }] }, { sMobNum: 1, sEmail: 1, sUsername: 1 })
      if (aUsers.length > 0) {
        const userIds = aUsers.map(user => user._id.toString())
        aSearchQuery.push({ iUserId: { [Op.in]: userIds } })
      }
    }
    if (sFlag === 'D') {
      aSearchQuery.push({ iTransactionId: { [Op.like]: sSearch + '%' } })
      aSearchQuery.push({ iOrderId: { [Op.like]: sSearch + '%' } })
    }
    query.push({ [Op.or]: aSearchQuery })
  }
  return { query, aUsers }
}

module.exports = {
  reversedTransaction,
  successTransaction,
  cancellOrRejectTransaction,
  getAdminWithdrawDepositListQuery
}
