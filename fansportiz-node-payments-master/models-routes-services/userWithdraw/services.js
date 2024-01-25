const UserWithdrawModel = require('./model')
const PassbookModel = require('../passbook/model')
const UserBalanceModel = require('../userBalance/model')
const PayoutOptionModel = require('../payoutOptions/model')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const db = require('../../database/sequelize')
const { literal, Op, Transaction } = require('sequelize')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, getIp, convertToDecimal } = require('../../helper/utilities.services')
const bcrypt = require('bcryptjs')
const { getBenficiaryDetails, getUserBalance, requestTransfer } = require('../payment/common')
const config = require('../../config/config')
const { redisClient, queuePush } = require('../../helper/redis')
const { reversedTransaction, successTransaction, cancellOrRejectTransaction } = require('./common')
const { CASHFREE_ORDERID_PREFIX, APP_LANG } = require('./../../config/common')
const { getAdminWithdrawDepositListQuery } = require('./common')
const { findSetting, getCurrencySymbol, findUser, findCredential, createAdminLog, findUsers, updateUserStatistics } = require('../userDeposit/grpc/clientServices')
const { findBankDetail, findKyc, findAdmins } = require('./grpc/clientServices')

class UserWithdraw {
  async adminList(req, res) {
    try {
      let { start = 0, limit = 10, sort = 'dCreatedAt', order, search, status: paymentStatus, method, datefrom, dateto, isFullResponse, reversedFlag } = req.query
      const orderBy = order && order === 'asc' ? 'ASC' : 'DESC'
      start = !start ? 0 : start
      limit = !limit ? 0 : limit
      sort = !sort ? 'dCreatedAt' : sort
      const { query, aUsers } = await getAdminWithdrawDepositListQuery(paymentStatus, method, search, 'W', reversedFlag)

      if ((!datefrom || !dateto) && [true, 'true'].includes(isFullResponse)) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].date_filter_err })
      }

      if (datefrom && dateto) {
        query.push({ dWithdrawalTime: { [Op.gte]: datefrom } })
        query.push({ dWithdrawalTime: { [Op.lte]: dateto } })
      }

      const paginationFields = [true, 'true'].includes(isFullResponse) ? {} : {
        offset: parseInt(start),
        limit: parseInt(limit)
      }

      const data = await UserWithdrawModel.findAll({
        where: {
          [Op.and]: query
        },
        order: [[sort, orderBy]],
        ...paginationFields,
        raw: true
      })

      const withdrawData = await addUserFields(data, aUsers)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].withdraw), data: { rows: withdrawData } })
    } catch (error) {
      catchError('UserWithdraw.adminList', error, req, res)
    }
  }

  // To get counts of withdrawls with searching and filter
  async getCounts(req, res) {
    try {
      const { search, status: paymentStatus, method, datefrom, dateto, reversedFlag } = req.query

      const { query } = await getAdminWithdrawDepositListQuery(paymentStatus, method, search, 'W', reversedFlag)

      if (datefrom && dateto) {
        query.push({ dWithdrawalTime: { [Op.gte]: datefrom } })
        query.push({ dWithdrawalTime: { [Op.lte]: dateto } })
      }
      const count = await UserWithdrawModel.count({
        where: {
          [Op.and]: query
        },
        raw: true
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', `${messages[req.userLanguage].withdraw} ${messages[req.userLanguage].cCounts}`), data: { count } })
    } catch (error) {
      catchError('UserWithdraw.getCounts', error, req, res)
    }
  }

  async adminWithdraw(req, res) {
    try {
      let { iUserId, nAmount, eType, sPassword, nBonus = 0 } = req.body
      nAmount = Number(nAmount) || 0
      const iWithdrawalDoneBy = req.admin._id.toString()

      const pass = await findCredential({ eKey: 'PAY' })
      if (!bcrypt.compareSync(sPassword, pass.sPassword)) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
      }
      const userData = await findUser({ _id: iUserId }, { eType: 1, sUsername: 1 })
      if (!userData) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

      try {
        const { eType: eUserType, sUsername } = userData
        await db.sequelize.transaction(async (t) => {
          const oldWithdraw = await UserWithdrawModel.findOne({ where: { iUserId }, order: [['id', 'DESC']] }, { transaction: t, lock: true })
          const nParentId = !oldWithdraw ? null : oldWithdraw.id
          const userWithdraw = await UserWithdrawModel.create({ iUserId, eUserType, nAmount, sIP: getIp(req), ePaymentGateway: 'ADMIN', ePaymentStatus: 'S', dWithdrawalTime: new Date(), dProcessedDate: new Date(), iWithdrawalDoneBy, nParentId }, { transaction: t, lock: true })
          const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true, raw: true })
          if (!oldBalance) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cBalance) })
          const { nCurrentBonus: nOldBonus, nCurrentTotalBalance: nOldTotalBalance, nCurrentDepositBalance: nOldDepositBalance, nCurrentWinningBalance: nOldWinningBalance } = oldBalance

          let nCash = 0
          let nWin = 0
          if (eType === 'withdraw') {
            nCash = nAmount
            await UserBalanceModel.update({
              nCurrentDepositBalance: literal(`nCurrentDepositBalance - ${nAmount}`),
              nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nAmount}`),
              nTotalWithdrawAmount: literal(`nTotalWithdrawAmount + ${nAmount}`),
              nTotalWithdrawCount: literal('nTotalWithdrawCount + 1')
            },
            {
              where: { iUserId },
              transaction: t,
              lock: true
            })
          } else if (eType === 'winning') {
            nWin = nAmount
            await UserBalanceModel.update({
              nCurrentWinningBalance: literal(`nCurrentWinningBalance - ${nAmount}`),
              nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nAmount}`),
              nTotalWithdrawAmount: literal(`nTotalWithdrawAmount + ${nAmount}`),
              nTotalWithdrawCount: literal('nTotalWithdrawCount + 1')
            },
            {
              where: { iUserId },
              transaction: t,
              lock: true
            })
          }
          await PassbookModel.create({ iUserId, eUserType, nAmount, nCash: nAmount, nBonus, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Withdraw', iWithdrawId: userWithdraw.id, eType: 'Dr', sRemarks: messages[APP_LANG].admin_withdraw, dActivityDate: new Date(), eStatus: 'CMP' }, { transaction: t, lock: true })
          await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: { nActualWinningBalance: -convertToDecimal(nWin), nActualDepositBalance: -convertToDecimal(nCash), nWinnings: -convertToDecimal(nWin), nTotalWinReturn: convertToDecimal(nCash), nWithdraw: convertToDecimal(nAmount), nWithdrawCount: 1 } }, { upsert: true })

          const logData = { oOldFields: {}, oNewFields: { eType: nBonus ? 'BONUS' : eType === 'withdraw' ? 'DEPOSIT' : 'WINNING', nCash: nAmount, nBonus, iUserId, sUsername }, sIP: getIp(req), iAdminId: ObjectId(req.admin._id), iUserId: ObjectId(iUserId), eKey: 'AW' }
          await createAdminLog(logData)
        })
      } catch (error) {
        return catchError('UserWithdraw.adminWithdraw', error, req, res)
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].withdraw) })
    } catch (error) {
      return catchError('UserWithdraw.adminWithdraw', error, req, res)
    }
  }

  async addV3(req, res) {
    try {
      let { nAmount } = req.body

      const payoutOption = await PayoutOptionModel.findById(req.params.id).lean()
      if (!payoutOption || payoutOption.bEnable === false) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].invalid_payout) })

      const { eKey: ePaymentGateway, nMinAmount, nMaxAmount } = payoutOption
      const nFee = payoutOption.nWithdrawFee

      nAmount = Number(nAmount) || 0
      const iUserId = req.user._id.toString()

      if (req.user.bIsInternalAccount === true) {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].withdraw_not_permited.replace('##', messages[req.userLanguage].internal_user)
        })
      }

      const withdrawValidation = await findSetting({ sKey: 'Withdraw' })
      if (!withdrawValidation) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cvalidationSetting) })

      const symbol = await getCurrencySymbol()
      if (nAmount < withdrawValidation.nMin) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].min_err.replace('##', messages[req.userLanguage].withdraw).replace('#', `${withdrawValidation.nMin}`).replace('₹', symbol) })
      if (nAmount > withdrawValidation.nMax) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].max_err.replace('##', messages[req.userLanguage].withdraw).replace('#', `${withdrawValidation.nMax}`).replace('₹', symbol) })

      let sErrorMessage = ''
      const user = await findUser({ _id: req.user._id })
      if (!user.bIsMobVerified) sErrorMessage = sErrorMessage ? sErrorMessage.concat(` ${messages[req.userLanguage].mob_verify_err}`) : sErrorMessage.concat(messages[req.userLanguage].mob_verify_err)

      const kycDetails = await findKyc({ iUserId: req.user._id, $or: [{ 'oPan.eStatus': 'A' }, { 'oAadhaar.eStatus': 'A' }] })
      if (!kycDetails) sErrorMessage = sErrorMessage ? sErrorMessage.concat(` ${messages[req.userLanguage].kyc_not_approved}`) : sErrorMessage.concat(messages[req.userLanguage].kyc_not_approved)
      if (kycDetails && kycDetails.oPan.eStatus !== 'A') sErrorMessage = sErrorMessage ? sErrorMessage.concat(` ${messages[req.userLanguage].pancard_not_approved}`) : sErrorMessage.concat(messages[req.userLanguage].pancard_not_approved)
      if (kycDetails && kycDetails.oAadhaar.eStatus !== 'A') sErrorMessage = sErrorMessage ? sErrorMessage.concat(` ${messages[req.userLanguage].aadharcard_not_approved}`) : sErrorMessage.concat(messages[req.userLanguage].aadharcard_not_approved)

      const bankDetails = await findBankDetail({ iUserId: req.user._id })
      if (!bankDetails || !bankDetails.sAccountNo || !bankDetails.sIFSC) sErrorMessage = sErrorMessage ? sErrorMessage.concat(` ${messages[req.userLanguage].fill_bankdetails_err}`) : sErrorMessage.concat(messages[req.userLanguage].fill_bankdetails_err)

      if (sErrorMessage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: sErrorMessage })

      let nWithdrawFee = 0
      if (nAmount >= nMinAmount && nAmount <= nMaxAmount) {
        nWithdrawFee = nFee
      }

      await this.validateWithdrawRateLimit(iUserId, req.userLanguage)

      try {
        await db.sequelize.transaction(async (t) => {
          const existWithdraw = await UserWithdrawModel.findOne({ where: { iUserId, ePaymentStatus: 'P', ePaymentGateway: { [Op.ne]: 'ADMIN' } }, attributes: ['id', 'iUserId', 'ePaymentGateway', 'ePaymentStatus', 'sInfo', 'nAmount', 'nParentId', 'dWithdrawalTime', 'iWithdrawalDoneBy', 'nWithdrawFee', 'ePlatform', 'dProcessedDate', 'dCreatedAt'] }, { transaction: t, lock: true })
          if (existWithdraw) {
            return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cPendingWithdraw), data: { bPending: true, existWithdraw } })
          } else {
            const oldWithdraw = await UserWithdrawModel.findOne({ where: { iUserId }, order: [['id', 'DESC']] }, { transaction: t, lock: true })
            const nParentId = !oldWithdraw ? null : oldWithdraw.id
            // const currentBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })

            // if (nAmount > currentBalance.nCurrentWinningBalance) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].insuff_balance.replace('##', messages[req.userLanguage].withdraw) })

            const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })
            if (!oldBalance) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cBalance) })
            const { nCurrentBonus: nOldBonus, nCurrentTotalBalance: nOldTotalBalance, nCurrentDepositBalance: nOldDepositBalance, nCurrentWinningBalance: nOldWinningBalance } = oldBalance

            const updateObj = {
              nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nAmount}`),
              nTotalWithdrawAmount: literal(`nTotalWithdrawAmount + ${nAmount}`),
              nTotalWithdrawCount: literal('nTotalWithdrawCount + 1')
            }

            let updateStatsObj, resetFieldObj
            const winBifurcate = await findSetting({ sKey: 'WinBifurcate' })
            if (winBifurcate) {
              if (nAmount > nOldWinningBalance) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].insuff_balance.replace('##', messages[req.userLanguage].withdraw) })
              updateObj.nCurrentWinningBalance = literal(`nCurrentWinningBalance - ${nAmount}`)
              updateStatsObj = {
                nActualWinningBalance: -convertToDecimal(nAmount),
                nWinnings: -convertToDecimal(nAmount)
              }
            } else {
              if (nOldWinningBalance < nAmount) {
                if (nOldWinningBalance < 0) {
                  if (nAmount > nOldDepositBalance) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].insuff_balance.replace('##', messages[req.userLanguage].withdraw) })
                  updateObj.nCurrentDepositBalance = literal(`nCurrentDepositBalance - ${nAmount}`)
                  updateStatsObj = {
                    nActualDepositBalance: -convertToDecimal(nAmount),
                    nCash: -convertToDecimal(nAmount)
                  }
                } else {
                  if ((nOldDepositBalance - (nAmount - nOldWinningBalance)) < 0) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].insuff_balance.replace('##', messages[req.userLanguage].withdraw) })

                  updateObj.nCurrentDepositBalance = literal(`nCurrentDepositBalance - ${(nAmount - nOldWinningBalance)}`)
                  updateObj.nCurrentWinningBalance = 0
                  updateStatsObj = {
                    nActualDepositBalance: -convertToDecimal(nAmount - nOldWinningBalance),
                    nCash: -convertToDecimal(nAmount - nOldWinningBalance)
                  }
                  resetFieldObj = { nActualWinningBalance: 0, nWinnings: 0 }
                }
              } else {
                // if (nAmount > nOldDepositBalance) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].insuff_balance.replace('##', messages[req.userLanguage].withdraw) })

                updateObj.nCurrentWinningBalance = literal(`nCurrentWinningBalance - ${nAmount}`)
                updateStatsObj = {
                  nActualWinningBalance: -convertToDecimal(nAmount),
                  nWinnings: -convertToDecimal(nAmount)
                }
              }
            }
            updateStatsObj = { ...updateStatsObj, nWithdraw: convertToDecimal(nAmount), nWithdrawCount: 1 }

            const userWithdraw = await UserWithdrawModel.create({ iUserId, eUserType: user.eType, nAmount, dWithdrawalTime: new Date(), nParentId, ePaymentGateway, nWithdrawFee }, { transaction: t, lock: true })

            await UserBalanceModel.update(updateObj,
              {
                where: { iUserId },
                transaction: t,
                lock: true
              })
            await PassbookModel.create({ iUserId, eUserType: user.eType, nAmount, nCash: nAmount, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Withdraw', iWithdrawId: userWithdraw.id, eType: 'Dr', eStatus: 'CMP', sRemarks: messages[APP_LANG].withdraw_from_fee.replace('##', ePaymentGateway).replace('#', nWithdrawFee), nWithdrawFee }, { transaction: t, lock: true })
            await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: updateStatsObj, ...resetFieldObj }, { upsert: true })
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].withdraw_request_success })
          }
        })
      } catch (error) {
        return catchError('UserWithdraw.addV3', error, req, res)
      }
    } catch (error) {
      const { status = '', message = '' } = error
      if (!status) { return catchError('UserWithdraw.addV3', error, req, res) }
      return res.status(status).jsonp({ status, message })
    }
  }

  async processWithdrawV2(req, res) {
    try {
      const { ePaymentStatus, sRejectReason } = req.body
      const { _id: iAdminId } = req.admin

      try {
        await db.sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        }, async (t) => {
          const bProcessing = await redisClient.incr(`processWithdraw:${req.params.id}`)
          if (bProcessing > 1) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].wait_for_proccessing.replace('##', messages[req.userLanguage].withdraw) })

          const withdraw = await UserWithdrawModel.findOne({ where: { id: req.params.id, ePaymentStatus: { [Op.in]: ['P', 'I'] } }, raw: true }, { transaction: t, lock: true })
          if (!withdraw) {
            await redisClient.del(`processWithdraw:${req.params.id}`)
            return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].withdraw_process_err })
          } else {
            await redisClient.expire(`processWithdraw:${req.params.id}`, 20)
            const { iUserId, eUserType, nAmount, ePaymentStatus: ePaymentOldStatus, sInfo, ePlatform, sIP, ePaymentGateway } = withdraw
            const oOldFields = { nAmount, ePaymentStatus: ePaymentOldStatus, sInfo, ePlatform, sIP }

            const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })
            if (!oldBalance) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cBalance) })
            const { nCurrentBonus: nOldBonus, nCurrentTotalBalance: nOldTotalBalance, nCurrentDepositBalance: nOldDepositBalance, nCurrentWinningBalance: nOldWinningBalance } = oldBalance

            const dProcessedDate = new Date()

            if (ePaymentStatus === 'S') {
              if (ePaymentOldStatus === 'P') {
                // ************** Add money to user account Remaining **************
                const { iUserId, nAmount, id: iWithdrawId, nWithdrawFee = 0 } = withdraw

                const passbook = await PassbookModel.findOne({ where: { iUserId, iWithdrawId: req.params.id }, attributes: ['id'] }, { transaction: t, lock: true })

                const { success: hasBalance, message: balanceSuccess } = await getUserBalance(iUserId, iWithdrawId, passbook.id)
                const { success: BenficiaryExist, message: benSuccess } = await getBenficiaryDetails(iUserId, iWithdrawId, passbook.id)
                if (BenficiaryExist && hasBalance) {
                  const nFinalAmount = nAmount - nWithdrawFee
                  const reqTransData = { iUserId, nFinalAmount, iWithdrawId, iAdminId, iPassbookId: passbook.id }
                  const { success, message, sCurrentStatus, referenceId = null } = await requestTransfer(reqTransData)
                  if (success) {
                    await UserWithdrawModel.update({ ePaymentStatus: 'S', iWithdrawalDoneBy: iAdminId.toString(), dProcessedDate, iTransactionId: referenceId }, { where: { id: req.params.id }, transaction: t, lock: true })
                    await PassbookModel.update({ dProcessedDate }, { where: { iWithdrawId: req.params.id }, transaction: t, lock: true })
                  } else if (['PENDING', 'SUCCESS'].includes(sCurrentStatus)) {
                    await UserWithdrawModel.update({ ePaymentStatus: 'I', iWithdrawalDoneBy: iAdminId.toString(), dProcessedDate }, { where: { id: req.params.id }, transaction: t, lock: true })
                    await PassbookModel.update({ dProcessedDate }, { where: { iWithdrawId: req.params.id }, transaction: t, lock: true })
                    return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].error_payout_process.replace('##', message) })
                  } else {
                    return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].error_payout_process.replace('##', message) })
                  }
                } else {
                  if (!hasBalance) {
                    return res.status(status.NotAcceptable).jsonp({ status: jsonStatus.NotAcceptable, message: messages[req.userLanguage].error_payout_balance_check.replace('##', balanceSuccess) })
                  } else {
                    return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].error_payout_fetchOrAdd_Beneficiary.replace('##', benSuccess) })
                  }
                }
              }
              if (ePaymentOldStatus === 'I') {
                await UserWithdrawModel.update({ ePaymentStatus: 'S', iWithdrawalDoneBy: iAdminId.toString(), dProcessedDate }, { where: { id: req.params.id }, transaction: t, lock: true })
                await PassbookModel.update({ dProcessedDate }, { where: { iWithdrawId: req.params.id }, transaction: t, lock: true })
              }
            } else if (ePaymentStatus === 'C') {
              await UserWithdrawModel.update({ ePaymentStatus: 'R', iWithdrawalDoneBy: iAdminId.toString(), dProcessedDate }, { where: { id: req.params.id }, transaction: t, lock: true })

              let updateStatsObj
              const updateObj = {
                nCurrentTotalBalance: literal(`nCurrentTotalBalance + ${nAmount}`),
                nTotalWithdrawAmount: literal(`nTotalWithdrawAmount - ${nAmount}`),
                nTotalWithdrawCount: literal('nTotalWithdrawCount - 1')
              }
              const passbook = await PassbookModel.findOne({ where: { iUserId, iWithdrawId: req.params.id } }, { transaction: t, lock: true })
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
              await PassbookModel.create({ iUserId, eUserType, nAmount, nCash: nAmount, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Withdraw-Return', iWithdrawId: withdraw.id, eType: 'Cr', sRemarks: messages[APP_LANG].withdraw_rejected_admin.replace('##', ePaymentGateway).replace('#', sRejectReason), dProcessedDate, eStatus: 'R' }, { transaction: t, lock: true })
              await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: updateStatsObj }, { upsert: true })

              const [user, setting] = await Promise.all([
                findUser({ _id: iUserId }, { sEmail: 1, sMobNum: 1, sUsername: 1 }),
                findSetting({ sKey: 'WITHDRAW_REJECT_NOTIFY' })
              ])
              const { sValue } = setting || {}

              if (sValue === 'EMAIL') {
                await queuePush('SendMail', {
                  sSlug: 'withdraw-reject-email',
                  replaceData: {
                    sUsername: user.sUsername,
                    reason: sRejectReason
                  },
                  to: user.sEmail
                })
              } else if (sValue === 'SMS') {
                await queuePush('sendSms', {
                  sProvider: 'TEST', // for now we can't configure sms provider so value is 'TEST'
                  oUser: {
                    sPhone: user.sMobNum,
                    reason: sRejectReason
                  }
                })
              } else if (sValue === 'NOTIFICATION') {
                await queuePush('pushNotification:rejectWithdraw', { _id: iUserId, sRejectReason })
              }
            }

            const oNewFields = { ...oOldFields, ePaymentStatus, sIP: getIp(req) }
            const logData = { oOldFields, oNewFields, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: ObjectId(iUserId), eKey: 'W' }
            await createAdminLog(logData)
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].processWithdraw) })
          }
        })
      } catch (error) {
        return catchError('UserWithdraw.processWithdrawV2', error, req, res)
      }
    } catch (error) {
      return catchError('UserWithdraw.processWithdrawV2', error, req, res)
    }
  }

  async userCancelWithdraw(req, res) {
    try {
      const { iWithdrawId } = req.params

      try {
        await db.sequelize.transaction(async (t) => {
          const withdraw = await UserWithdrawModel.findOne({ where: { id: iWithdrawId, iUserId: req.user._id.toString() } }, { transaction: t, lock: true })
          if (!withdraw) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].withdraw) })

          if (withdraw.ePaymentStatus !== 'P') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].withdraw_process_err })

          const { iUserId, nAmount, ePaymentGateway, eUserType } = withdraw
          const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })
          if (!oldBalance) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cBalance) })
          const { nCurrentBonus: nOldBonus, nCurrentTotalBalance: nOldTotalBalance, nCurrentDepositBalance: nOldDepositBalance, nCurrentWinningBalance: nOldWinningBalance } = oldBalance

          await UserWithdrawModel.update({ ePaymentStatus: 'C', sInfo: 'Withdraw cancelled by self.', dProcessedDate: new Date() }, { where: { id: iWithdrawId }, transaction: t, lock: true })

          let updateStatsObj
          const updateObj = {
            nCurrentTotalBalance: literal(`nCurrentTotalBalance + ${nAmount}`),
            nTotalWithdrawAmount: literal(`nTotalWithdrawAmount - ${nAmount}`),
            nTotalWithdrawCount: literal('nTotalWithdrawCount - 1')
          }
          const passbook = await PassbookModel.findOne({ where: { iUserId, iWithdrawId } }, { transaction: t, lock: true })
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
          await PassbookModel.create({ iUserId, eUserType, nAmount, nCash: nAmount, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Withdraw-Return', iWithdrawId: withdraw.id, eType: 'Cr', sRemarks: messages[APP_LANG].withdraw_cancelled.replace('##', ePaymentGateway), eStatus: 'CNCL' }, { transaction: t, lock: true })
          await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: updateStatsObj }, { upsert: true })

          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cancel_success.replace('##', messages[req.userLanguage].withdraw) })
        })
      } catch (error) {
        return catchError('UserWithdraw.userCancelWithdraw', error, req, res)
      }
    } catch (error) {
      return catchError('UserWithdraw.userCancelWithdraw', error, req, res)
    }
  }

  async checkWithdrawRequestV2(req, res) {
    try {
      const iUserId = req.user._id.toString()
      const user = await findUser({ _id: req.user._id })
      if (!user) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

      if (user.bIsInternalAccount === true) {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].withdraw_not_permited.replace('##', messages[req.userLanguage].internal_user)
        })
      }
      try {
        let userWithdraw
        let bFlag = true
        await db.sequelize.transaction(async (t) => {
          userWithdraw = await UserWithdrawModel.findOne({ where: { iUserId, ePaymentStatus: 'P', ePaymentGateway: { [Op.ne]: 'ADMIN' } } }, { transaction: t, lock: true })
          if (!userWithdraw) { bFlag = false }
        })
        if (!bFlag) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].withdraw), data: { pending: false } })
        userWithdraw.eUserType = undefined
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cPendingWithdraw), data: { pending: true, userWithdraw } })
      } catch (error) {
        return catchError('UserWithdraw.checkWithdrawLimitV2', error, req, res)
      }
    } catch (error) {
      return catchError('UserWithdraw.checkWithdrawRequestV2', error, req, res)
    }
  }

  validateWithdrawRateLimit(iUserId, lang) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (config.NODE_ENV !== 'production') {
            return resolve({ status: 'success' })
          }

          const withdrawRateLimit = await findSetting({ sKey: 'UserWithdrawRateLimit' })
          const withdrawRateLimitTimeFrame = await findSetting({ sKey: 'UserWithdrawRateLimitTimeFrame' })

          if (!withdrawRateLimit || !withdrawRateLimitTimeFrame) {
            return resolve({ status: 'success' })
          }

          const currentDate = new Date().toISOString()
          const fromDate = new Date(new Date().setMinutes(new Date().getMinutes() - parseInt(withdrawRateLimitTimeFrame.nMax))).toISOString()

          const { count } = await UserWithdrawModel.findAndCountAll({
            where: {
              iUserId,
              dCreatedAt: {
                [Op.lte]: currentDate,
                [Op.gte]: fromDate
              }
            }
          })

          if (count >= parseInt(withdrawRateLimit.nMax)) {
            const limitExceed = { status: jsonStatus.TooManyRequest, message: messages[lang].limit_reached.replace('##', messages[lang].cWithdrawRequest) }
            return reject(limitExceed)
          }

          resolve({ status: 'success' })
        } catch (error) {
          reject(error)
        }
      })()
    })
  }

  async cashfreeWebhook(req, res) {
    try {
      const postData = req.body
      const { event } = postData

      if (event === 'TRANSFER_REVERSED') {
        const iWithdrawId = Number(postData.transferId.toString().split(CASHFREE_ORDERID_PREFIX).pop())

        const logData = { iWithdrawId, eGateway: 'CASHFREE', eType: 'W', oReq: { sInfo: `Cashfree payout Webhook ${event} event.` }, oRes: postData }
        await queuePush('TransactionLog', logData)

        await reversedTransaction(postData, iWithdrawId)
      }
      if ((Number(postData.acknowledged) && ['TRANSFER_SUCCESS', 'TRANSFER_ACKNOWLEDGED'].includes(event))) {
        const iWithdrawId = Number(postData.transferId.toString().split(CASHFREE_ORDERID_PREFIX).pop())

        const logData = { iWithdrawId, eGateway: 'CASHFREE', eType: 'W', oReq: { sInfo: `Cashfree payout Webhook ${event} event.` }, oRes: postData }
        await queuePush('TransactionLog', logData)

        await successTransaction(postData, iWithdrawId)
      }
      if (['TRANSFER_REJECTED', 'TRANSFER_FAILED'].includes(event)) {
        const iWithdrawId = Number(postData.transferId.toString().split(CASHFREE_ORDERID_PREFIX).pop())

        const logData = { iWithdrawId, eGateway: 'CASHFREE', eType: 'W', oReq: { sInfo: `Cashfree payout Webhook ${event} event.` }, oRes: postData }
        await queuePush('TransactionLog', logData)

        const ePaymentStatus = (event === 'TRANSFER_FAILED') ? 'C' : 'R'
        await cancellOrRejectTransaction(postData, ePaymentStatus, iWithdrawId)
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].action_success.replace('##', messages[req.userLanguage].cresponseGet) })
    } catch (error) {
      return catchError('UserWithdraw.cashfreeWebhook', error, req, res)
    }
  }
}

module.exports = new UserWithdraw()

/**
 * It'll add users fields for admin withdraw list
 * @param { Array } withdraw
 * @param { Array } users
 * @returns { Array } of all users which are done withdraw
 */

async function addUserFields(withdraw, users = []) {
  let data
  const length = withdraw.length

  if (users.length) {
    data = users
  } else {
    const withdrawIds = withdraw.map(p => ObjectId(p.iUserId))
    data = await findUsers({ _id: { $in: withdrawIds } }, { sMobNum: 1, sEmail: 1, sUsername: 1 })
  }

  const aAdminIds = withdraw.map(w => {
    if (w.iUserId && !['P', 'C'].includes(w.ePaymentStatus) && w.iWithdrawalDoneBy) {
      return w.iWithdrawalDoneBy
    }
  })

  const aAdmin = await findAdmins({ _id: { $in: aAdminIds } }, { sUsername: 1 })

  for (let i = 0; i < length; i++) {
    const { iUserId, iWithdrawalDoneBy } = withdraw[i]
    const user = data.find(u => u._id.toString() === iUserId.toString())
    const admin = iWithdrawalDoneBy ? aAdmin.find(a => a._id.toString() === iWithdrawalDoneBy.toString()) : null
    user.sName = !admin ? '' : admin.sUsername
    withdraw[i] = { ...withdraw[i], ...user, _id: undefined }
  }

  return withdraw
}
