const UserDepositModel = require('./model')
const UserBalanceModel = require('../userBalance/model')
const PassbookModel = require('../passbook/model')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const db = require('../../database/sequelize')
const { literal, Op, Transaction } = require('sequelize')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, pick, removenull, getIp, convertToDecimal } = require('../../helper/utilities.services')
const bcrypt = require('bcryptjs')
const config = require('../../config/config')
const { queuePush } = require('../../helper/redis')
const { CASHFREE_ORDERID_PREFIX, APP_LANG } = require('./../../config/common')
const { redisClient } = require('../../helper/redis')
const { getAdminWithdrawDepositListQuery } = require('../userWithdraw/common')
const { findPromocode, findSetting, getCurrencySymbol, createPromocodeStatistics, createAdminLog, findUser, findUsers, countUsers, findCredential, updateUserStatistics } = require('./grpc/clientServices')

class UserDeposit {
  async adminDeposit(req, res) {
    try {
      let { iUserId, nCash, nBonus, eType, sPassword } = req.body
      const { _id: iAdminId } = req.admin

      nBonus = Number(nBonus) || 0
      nCash = Number(nCash) || 0
      const nAmount = nBonus + nCash

      const pass = await findCredential({ eKey: 'PAY' })
      if (!bcrypt.compareSync(sPassword, pass.sPassword)) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })
      }
      const bonusExpireDays = await findSetting({ sKey: 'BonusExpireDays' })
      if (!bonusExpireDays) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cbonusExpirySetting) })
      let dBonusExpiryDate = null
      if (nBonus > 0) {
        dBonusExpiryDate = new Date()
        dBonusExpiryDate.setDate(dBonusExpiryDate.getDate() + bonusExpireDays.nMax)
      }
      const userData = await findUser({ _id: iUserId }, { eType: 1, sUsername: 1 })

      try {
        let statUpdate = {}
        const { eType: eUserType, sUsername } = userData
        await db.sequelize.transaction(async (t) => {
          const userDeposit = await UserDepositModel.create({ iUserId, nAmount, nCash, nBonus, ePaymentStatus: 'S', sInfo: 'Deposit by admin', eUserType, dProcessedDate: new Date() }, { transaction: t, lock: true })
          const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true, raw: true })
          if (!oldBalance) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cBalance) })
          const { nCurrentBonus: nOldBonus, nCurrentTotalBalance: nOldTotalBalance, nCurrentDepositBalance: nOldDepositBalance, nCurrentWinningBalance: nOldWinningBalance } = oldBalance

          if (eType === 'deposit') {
            await UserBalanceModel.update({
              nCurrentDepositBalance: literal(`nCurrentDepositBalance + ${nCash}`),
              nCurrentTotalBalance: literal(`nCurrentTotalBalance + ${nCash}`),
              nCurrentBonus: literal(`nCurrentBonus + ${nBonus}`),
              nTotalBonusEarned: literal(`nTotalBonusEarned + ${nBonus}`),
              nTotalDepositAmount: literal(`nTotalDepositAmount + ${nCash}`),
              nTotalDepositCount: literal('nTotalDepositCount + 1')
            },
            {
              where: { iUserId },
              transaction: t,
              lock: true
            })
            statUpdate = { $inc: { nActualDepositBalance: convertToDecimal(nCash), nActualBonus: convertToDecimal(nBonus), nDeposits: convertToDecimal(nCash), nCash: convertToDecimal(nCash), nBonus: convertToDecimal(nBonus), nDepositCount: 1 } }
          } else if (eType === 'winning') {
            await UserBalanceModel.update({
              nCurrentWinningBalance: literal(`nCurrentWinningBalance + ${nCash}`),
              nCurrentTotalBalance: literal(`nCurrentTotalBalance + ${nCash}`),
              nTotalWinningAmount: literal(`nTotalWinningAmount + ${nCash}`),
              nTotalDepositCount: literal('nTotalDepositCount + 1')
            },
            {
              where: { iUserId },
              transaction: t,
              lock: true
            })
            statUpdate = { $inc: { nActualWinningBalance: convertToDecimal(nCash), nWinnings: convertToDecimal(nCash), nTotalWinnings: convertToDecimal(nCash), nDepositCount: 1 } }
          }
          await PassbookModel.create({ iUserId, nAmount, nCash, nBonus, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Deposit', eUserType, iUserDepositId: userDeposit.id, eType: 'Cr', sRemarks: messages[APP_LANG].admin_deposit, dBonusExpiryDate, dActivityDate: new Date(), eStatus: 'CMP' }, { transaction: t, lock: true })
        })

        await updateUserStatistics({ iUserId: ObjectId(iUserId) }, statUpdate, { upsert: true })

        const logData = { oOldFields: {}, oNewFields: { eType: nBonus ? 'BONUS' : eType === 'deposit' ? 'DEPOSIT' : 'WINNING', nCash, nBonus, iUserId, sUsername }, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: ObjectId(iUserId), eKey: 'AD' }
        await createAdminLog(logData)
      } catch (error) {
        return catchError('UserDeposit.adminDeposit', error, req, res)
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].cDeposit) })
    } catch (error) {
      return catchError('UserDeposit.adminDeposit', error, req, res)
    }
  }

  async userDeposit(req, res) {
    try {
      req.body = pick(req.body, ['ePaymentGateway', 'ePaymentStatus', 'nAmount', 'sPromocode'])
      removenull(req.body)
      let { nAmount: depositAmount, sPromocode = '', ePaymentGateway } = req.body

      depositAmount = Number(depositAmount) || 0
      const iUserId = req.user._id.toString()
      const user = await findUser({ _id: iUserId }, { bIsInternalAccount: 1, eType: 1 })
      if (!user) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

      await this.validateDepositRateLimit(iUserId, req.userLanguage)

      let promocodes
      let nCash = 0
      let nBonus = 0
      let dBonusExpiryDate
      let promocodeId

      if (sPromocode) {
        const promocode = await findPromocode({ eStatus: 'Y', sCode: sPromocode.toUpperCase(), dStartTime: { $lt: new Date(Date.now()) }, dExpireTime: { $gt: new Date(Date.now()) } }, { _id: 1, nAmount: 1, dExpireTime: 1, bIsPercent: 1, bMaxAllowForAllUser: 1, nMaxAllow: 1, nBonusExpireDays: 1, nPerUserUsage: 1, nMinAmount: 1, nMaxAmount: 1 })
        if (!promocode) { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_promo_err }) }

        const { dExpireTime, nAmount: promoAmount, bIsPercent, nBonusExpireDays, nMaxAmount, nMinAmount } = promocode

        const symbol = await getCurrencySymbol()
        if (depositAmount && !(nMaxAmount >= convertToDecimal(depositAmount, 2) && nMinAmount <= convertToDecimal(depositAmount, 2))) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].promo_amount_err.replace('#', nMinAmount).replace('##', nMaxAmount).replace('₹', symbol) })

        promocodes = promocode
        if (dExpireTime && new Date(dExpireTime) < new Date(Date.now())) { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_promo_err }) }

        promocodeId = promocode._id.toString()
        if (bIsPercent) {
          nBonus = convertToDecimal(promoAmount * depositAmount / 100)
          nCash = parseFloat(depositAmount)
        } else {
          nBonus = parseFloat(promoAmount)
          nCash = parseFloat(depositAmount)
        }
        dBonusExpiryDate = new Date()
        dBonusExpiryDate.setDate(dBonusExpiryDate.getDate() + nBonusExpireDays)
      } else {
        nCash = parseFloat(depositAmount)
      }

      const depositValidation = await findSetting({ sKey: 'Deposit' }, { nMin: 1, nMax: 1 })
      if (!depositValidation) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cvalidationSetting) })

      const symbol = await getCurrencySymbol()
      if (depositAmount < depositValidation.nMin) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].min_err.replace('##', messages[req.userLanguage].cDeposit).replace('#', `${depositValidation.nMin}`).replace('₹', symbol) })
      if (depositAmount > depositValidation.nMax) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].max_err.replace('##', messages[req.userLanguage].cDeposit).replace('#', `${depositValidation.nMax}`).replace('₹', symbol) })

      const nAmount = parseFloat(nCash) + parseFloat(nBonus)

      try {
        await db.sequelize.transaction(async (t) => {
          let paymentStatus = 'P'
          if (user.bIsInternalAccount === true) {
            paymentStatus = 'S'
          }

          if (sPromocode) {
            const { count: allCount } = await UserDepositModel.findAndCountAll({ where: { iPromocodeId: promocodeId, ePaymentStatus: { [Op.in]: ['P', 'S'] } } }, { transaction: t, lock: true })
            const { count } = await UserDepositModel.findAndCountAll({ where: { iUserId, iPromocodeId: promocodeId, ePaymentStatus: { [Op.in]: ['P', 'S'] } } }, { transaction: t, lock: true })

            if (!promocodes.bMaxAllowForAllUser && (count >= promocodes.nMaxAllow)) {
              return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].promo_usage_limit })
            } else if ((allCount >= promocodes.nMaxAllow) || (count >= promocodes.nPerUserUsage)) {
              return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].promo_usage_limit })
            }

            await UserDepositModel.create({ iUserId, nAmount, nCash, nBonus, ePaymentStatus: paymentStatus, sInfo: `Deposit from ${ePaymentGateway} of ${symbol}${depositAmount} using ${sPromocode.toUpperCase()}`, iPromocodeId: promocodeId, sPromocode: sPromocode.toUpperCase(), eUserType: user.eType }, { transaction: t, lock: true })
          } else {
            await UserDepositModel.create({ iUserId, nAmount, nCash, nBonus, ePaymentStatus: paymentStatus, sInfo: `Deposit from ${ePaymentGateway} of ${symbol}${depositAmount}`, eUserType: user.eType }, { transaction: t, lock: true })
          }
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].cDeposit) })
        })
      } catch (error) {
        return catchError('UserDeposit.userDeposit', error, req, res)
      }
    } catch (error) {
      const { status = '', message = '' } = error
      if (!status) { return catchError('UserDeposit.userDeposit', error, req, res) }
      return res.status(status).jsonp({ status, message })
    }
  }

  async processDeposit(req, res) {
    try {
      const { ePaymentStatus } = req.body
      const { _id: iAdminId } = req.admin

      try {
        await db.sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        }, async (t) => {
          const bProcessing = await redisClient.incr(`processDeposit:${req.params.id}`)
          if (bProcessing > 1) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].wait_for_proccessing.replace('##', messages[req.userLanguage].cDeposit) })

          const deposit = await UserDepositModel.findOne({ where: { id: req.params.id } }, { transaction: t, lock: true })
          if (deposit.ePaymentStatus !== 'P') {
            await redisClient.del(`processDeposit:${req.params.id}`)
            return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].depo_already_process })
          } else {
            await redisClient.expire(`processDeposit:${req.params.id}`, 20)
            const { iUserId, nCash, nBonus = 0, ePaymentStatus: ePaymentOldStatus, sInfo, sPromocode, iPromocodeId, nAmount, ePlatform, ePaymentGateway } = deposit
            const oOldFields = { nCash, nBonus, ePaymentStatus: ePaymentOldStatus, sInfo, sPromocode, iPromocodeId, nAmount, ePlatform }
            const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })
            let nOldBonus = 0
            let nOldTotalBalance = 0
            let nOldDepositBalance = 0
            let nOldWinningBalance = 0
            if (oldBalance) {
              const { nCurrentBonus, nCurrentTotalBalance, nCurrentDepositBalance, nCurrentWinningBalance } = oldBalance
              nOldBonus = nCurrentBonus
              nOldTotalBalance = nCurrentTotalBalance
              nOldDepositBalance = nCurrentDepositBalance
              nOldWinningBalance = nCurrentWinningBalance
            } else {
              await UserBalanceModel.create({ iUserId, eUserType: deposit.eUserType }, { transaction: t, lock: true })
            }

            const dProcessedDate = new Date()

            if (ePaymentStatus === 'S') {
              let dBonusExpiryDate
              if (deposit.iPromocodeId) {
                const promocode = await findPromocode({ _id: deposit.iPromocodeId.toString() }, { nBonusExpireDays: 1 })

                const { nBonusExpireDays = 0 } = promocode
                dBonusExpiryDate = new Date()
                dBonusExpiryDate.setDate(dBonusExpiryDate.getDate() + nBonusExpireDays)
              } else {
                dBonusExpiryDate = null
              }
              await UserDepositModel.update({ ePaymentStatus: 'S', iTransactionId: deposit.id, dProcessedDate }, { where: { id: req.params.id }, transaction: t, lock: true })

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

              await PassbookModel.create({ iUserId, nAmount, nCash, nBonus, eUserType: deposit.eUserType, dBonusExpiryDate, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Deposit', iUserDepositId: deposit.id, eType: 'Cr', sRemarks: messages[APP_LANG].depsoit_approved.replace('##', ePaymentGateway), dProcessedDate, sPromocode, eStatus: 'CMP' }, { transaction: t, lock: true })
              await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: { nActualDepositBalance: convertToDecimal(nCash), nActualBonus: convertToDecimal(nBonus), nDeposits: convertToDecimal(nCash), nCash: convertToDecimal(nCash), nBonus: convertToDecimal(nBonus), nDepositCount: 1 } }, { upsert: true })

              if (deposit.iPromocodeId) {
                await createPromocodeStatistics({ iUserId, iPromocodeId, nAmount: nBonus, sTransactionType: 'DEPOSIT', idepositId: deposit.id })
              }
            } else if (ePaymentStatus === 'C') {
              await UserDepositModel.update({ ePaymentStatus: 'C', dProcessedDate }, { where: { id: req.params.id }, transaction: t, lock: true })
            }
            const oNewFields = { ...oOldFields, ePaymentStatus }
            const logData = { oOldFields, oNewFields, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: ObjectId(iUserId), eKey: 'D' }
            await createAdminLog(logData)
          }
        })
      } catch (error) {
        return catchError('UserDeposit.processDeposit', error, req, res)
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].cprocessedDeposit) })
    } catch (error) {
      return catchError('UserDeposit.processDeposit', error, req, res)
    }
  }

  async adminList(req, res) {
    try {
      let { datefrom, dateto, start = 0, limit = 10, sort = 'dCreatedAt', order, search, status: paymentStatus, method, isFullResponse } = req.query

      const orderBy = order && order === 'asc' ? 'ASC' : 'DESC'

      start = !start ? 0 : start
      limit = !limit ? 0 : limit
      sort = !sort ? 'dCreatedAt' : sort

      const { query, aUsers } = await getAdminWithdrawDepositListQuery(paymentStatus, method, search, 'D')

      if ((!datefrom || !dateto) && [true, 'true'].includes(isFullResponse)) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].date_filter_err })
      }

      if (datefrom && dateto) {
        query.push({ dUpdatedAt: { [Op.gte]: datefrom } })
        query.push({ dUpdatedAt: { [Op.lte]: dateto } })
      }
      const paginationFields = [true, 'true'].includes(isFullResponse) ? {} : {
        offset: parseInt(start),
        limit: parseInt(limit)
      }

      const data = await UserDepositModel.findAll({
        where: {
          [Op.and]: query
        },
        order: [[sort, orderBy]],
        ...paginationFields,
        raw: true
      })

      const depositData = await addUserFields(data, aUsers)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cDeposit), data: { rows: depositData } })
    } catch (error) {
      catchError('UserDeposit.adminList', error, req, res)
    }
  }

  // To get counts of deposits with searching and filter
  async getCounts(req, res) {
    try {
      const { datefrom, dateto, search, status: paymentStatus, method } = req.query

      const { query } = await getAdminWithdrawDepositListQuery(paymentStatus, method, search, 'D')

      if (datefrom && dateto) {
        query.push({ dUpdatedAt: { [Op.gte]: datefrom } })
        query.push({ dUpdatedAt: { [Op.lte]: dateto } })
      }
      const count = await UserDepositModel.count({
        where: {
          [Op.and]: query
        },
        raw: true
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', `${messages[req.userLanguage].cDeposit} ${messages[req.userLanguage].cCounts}`), data: { count } })
    } catch (error) {
      catchError('UserDeposit.getCounts', error, req, res)
    }
  }

  /**
   * It'll create deposit data according data from payment gateway
   * @param { Object } payload
   * @param { Object } user
   * @returns { Object } of user deposit
   */
  createDeposit(payload, user) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const iUserId = user._id.toString()
          const { eType: eUserType, bIsInternalAccount } = user
          payload = pick(payload, ['ePaymentGateway', 'ePaymentStatus', 'sInfo', 'nAmount', 'sPromocode'])
          removenull(payload)

          const { nAmount, sPromocode = '', ePaymentGateway } = payload
          let nCash = 0
          let nBonus = 0
          let promocodeId, promocodes

          const symbol = await getCurrencySymbol()
          if (sPromocode) {
            const rejectPromo = { status: jsonStatus.BadRequest, message: messages.English.invalid_promo_err }
            const promocode = await findPromocode({ eStatus: 'Y', sCode: sPromocode.toUpperCase(), dStartTime: { $lt: new Date(Date.now()) }, dExpireTime: { $gt: new Date(Date.now()) } }, { nAmount: 1, bMaxAllowForAllUser: 1, dExpireTime: 1, bIsPercent: 1, nMaxAllow: 1, nPerUserUsage: 1, nBonusExpireDays: 1, nMaxAmount: 1, nMinAmount: 1 })
            if (!promocode) return reject(rejectPromo)

            const rejectReason = { status: jsonStatus.BadRequest, message: messages.English.promo_amount_err.replace('#', promocode.nMinAmount).replace('##', promocode.nMaxAmount).replace('₹', symbol) }
            if (nAmount && !(promocode.nMaxAmount >= convertToDecimal(nAmount, 2) && promocode.nMinAmount <= convertToDecimal(nAmount, 2))) return reject(rejectReason)

            promocodes = promocode
            const { dExpireTime, nAmount: promoAmount, bIsPercent } = promocode
            if (dExpireTime && new Date(dExpireTime) < new Date(Date.now())) { return reject(rejectPromo) }
            promocodeId = promocode._id.toString()
            if (bIsPercent) {
              nBonus = convertToDecimal(promoAmount * nAmount / 100)
              nCash = parseFloat(nAmount)
            } else {
              nBonus = parseFloat(promoAmount)
              nCash = parseFloat(nAmount)
            }
          } else { nCash = parseFloat(nAmount) }
          const nDeposit = parseFloat(nCash) + parseFloat(nBonus)
          const depositValidation = await findSetting({ sKey: 'Deposit' })
          if (!depositValidation) {
            const rejectSetting = { status: jsonStatus.NotFound, message: messages.English.not_exist.replace('##', messages.English.cvalidationSetting) }
            return reject(rejectSetting)
          }

          if (nAmount < depositValidation.nMin) {
            const rejectMinErr = { status: jsonStatus.BadRequest, message: messages.English.min_err.replace('##', messages.English.cDeposit).replace('#', `${depositValidation.nMin}`).replace('₹', symbol) }
            return reject(rejectMinErr)
          }
          if (nAmount > depositValidation.nMax) {
            const rejectMaxErr = { status: jsonStatus.BadRequest, message: messages.English.max_err.replace('##', messages.English.cDeposit).replace('#', `${depositValidation.nMax}`).replace('₹', symbol) }
            return reject(rejectMaxErr)
          }
          try {
            return db.sequelize.transaction(async (t) => {
              let paymentStatus = 'P'
              let nOldBonus = 0
              let nOldTotalBalance = 0
              let nOldDepositBalance = 0
              let nOldWinningBalance = 0
              if (bIsInternalAccount === true) {
                paymentStatus = 'S'
                const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })
                if (oldBalance) {
                  const { nCurrentBonus, nCurrentTotalBalance, nCurrentDepositBalance, nCurrentWinningBalance } = oldBalance
                  nOldBonus = nCurrentBonus
                  nOldTotalBalance = nCurrentTotalBalance
                  nOldDepositBalance = nCurrentDepositBalance
                  nOldWinningBalance = nCurrentWinningBalance
                } else {
                  await UserBalanceModel.create({ iUserId, eUserType }, { transaction: t, lock: true })
                }
              }
              let userDeposit
              const symbol = await getCurrencySymbol()

              if (sPromocode) {
                const { count: allCount } = await UserDepositModel.findAndCountAll({ where: { iPromocodeId: promocodeId, ePaymentStatus: { [Op.in]: ['P', 'S'] } } }, { transaction: t, lock: true })
                const { count } = await UserDepositModel.findAndCountAll({ where: { iUserId, iPromocodeId: promocodeId, ePaymentStatus: { [Op.in]: ['P', 'S'] } } }, { transaction: t, lock: true })
                if (!promocodes.bMaxAllowForAllUser && (count >= promocodes.nMaxAllow)) {
                  const rejectInvalid = { status: jsonStatus.BadRequest, message: messages.English.promo_usage_limit }
                  return reject(rejectInvalid)
                } else if ((allCount >= promocodes.nMaxAllow) || (count >= promocodes.nPerUserUsage)) {
                  const rejectInvalid = { status: jsonStatus.BadRequest, message: messages.English.promo_usage_limit }
                  return reject(rejectInvalid)
                }
                userDeposit = await UserDepositModel.create({ iUserId, nAmount: nDeposit, nCash, nBonus, eUserType, ePaymentStatus: paymentStatus, ePaymentGateway, sInfo: `Deposit from ${ePaymentGateway} of ${symbol}${nAmount}`, iPromocodeId: promocodeId, sPromocode: sPromocode.toUpperCase() }, { transaction: t, lock: true })
              } else {
                userDeposit = await UserDepositModel.create({ iUserId, nAmount: nDeposit, nCash, nBonus, ePaymentStatus: paymentStatus, ePaymentGateway, sInfo: `Deposit from ${ePaymentGateway} of ${symbol}${nAmount}` }, { transaction: t, lock: true })
              }

              // update passbook and balance
              if (bIsInternalAccount === true) {
                let dBonusExpiryDate
                if (userDeposit.iPromocodeId) {
                  const promocode = await findPromocode({ eStatus: 'Y', _id: userDeposit.iPromocodeId.toString() }, { nBonusExpireDays: 1 })

                  const { nBonusExpireDays = 0 } = promocode
                  dBonusExpiryDate = new Date()
                  dBonusExpiryDate.setDate(dBonusExpiryDate.getDate() + nBonusExpireDays)
                } else {
                  dBonusExpiryDate = null
                }

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

                await PassbookModel.create({ iUserId, nAmount, nCash, nBonus, eUserType, dBonusExpiryDate, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Deposit', iUserDepositId: userDeposit.id, eType: 'Cr', sRemarks: messages[APP_LANG].depsoit_approved.replace('##', ePaymentGateway), eStatus: 'CMP' }, { transaction: t, lock: true })
                await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: { nActualDepositBalance: convertToDecimal(nCash), nActualBonus: convertToDecimal(nBonus), nDeposits: convertToDecimal(nCash), nCash: convertToDecimal(nCash), nBonus: convertToDecimal(nBonus), nDepositCount: 1 } }, { upsert: true })
              }
              return resolve({ data: userDeposit })
            })
          } catch (error) {
            return reject(error)
          }
        } catch (error) {
          return reject(error)
        }
      })()
    })
  }

  /**
   * It'll update user balance
   * @param { Object } payload
   * @param { String } ePaymentGateway
   * @returns { Object } status of success or error
   */
  updateBalance(payload, ePaymentGateway) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let { txStatus: ePaymentStatus, orderId, referenceId } = payload
          try {
            await db.sequelize.transaction(async (t) => {
              if (orderId.toString().includes(CASHFREE_ORDERID_PREFIX)) {
                orderId = orderId.toString().substring(CASHFREE_ORDERID_PREFIX.length)
              }

              // const logData = { iDepositId: Number(orderId), iTransactionId: referenceId, eGateway: ePaymentGateway, eType: 'D', oRes: payload }
              // await queuePush('TransactionLog', logData)

              const deposit = await UserDepositModel.findOne({ where: { id: orderId }, raw: true }, { transaction: t, lock: true })

              if (deposit.ePaymentStatus !== 'P') { return resolve({ alreadySuccess: true, status: jsonStatus.OK, message: messages.English.action_success.replace('##', messages.English.cDepositeHasBeenMade) }) } else {
                const { iUserId, nCash = 0, nBonus = 0, nAmount, eUserType } = deposit

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

                  const updateDepositResult = await UserDepositModel.update({ ePaymentStatus: 'S', ePaymentGateway, sInfo: JSON.stringify(payload), iTransactionId: referenceId, iOrderId: payload.orderId, dProcessedDate: new Date() }, { where: { id: orderId }, transaction: t, lock: true })
                  const oldBalance = await UserBalanceModel.findOne({ where: { iUserId } }, { transaction: t, lock: true })
                  if (!oldBalance) return resolve({ alreadySuccess: true, status: jsonStatus.NotFound, message: messages.English.not_exist.replace('##', messages.English.cBalance) })
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
                  await PassbookModel.create({ iUserId, nAmount, nCash, nBonus, eUserType, dBonusExpiryDate, nOldBonus, nOldTotalBalance, nOldDepositBalance, nOldWinningBalance, eTransactionType: 'Deposit', iUserDepositId: deposit.id, eType: 'Cr', sRemarks: messages[APP_LANG].deposit_success_of.replace('##', nAmount).replace('#', ePaymentGateway), dActivityDate: new Date(), iTransactionId: referenceId, sPromocode: deposit.sPromocode, eStatus: 'CMP' }, { transaction: t, lock: true })
                  await updateUserStatistics({ iUserId: ObjectId(iUserId) }, { $inc: { nActualDepositBalance: convertToDecimal(nCash), nActualBonus: convertToDecimal(nBonus), nDeposits: convertToDecimal(nCash), nCash: convertToDecimal(nCash), nBonus: convertToDecimal(nBonus), nDepositCount: 1 } }, { upsert: true })
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
                    }
                  }

                  if (deposit.iPromocodeId) {
                    await createPromocodeStatistics({ iUserId, iPromocodeId: deposit.iPromocodeId, nAmount: nBonus, sTransactionType: 'DEPOSIT', idepositId: deposit.id })
                  }
                  return resolve({ alreadySuccess: false, status: jsonStatus.OK, message: messages.English.action_success.replace('##', messages.English.cDepositeHasBeenMade) })
                } else if (ePaymentStatus === 'FAILED' || ePaymentStatus === 'CANCELLED') {
                  await UserDepositModel.update({ ePaymentStatus: 'C', sInfo: JSON.stringify(payload), iTransactionId: referenceId, iOrderId: payload.orderId, dProcessedDate: new Date() }, { where: { id: orderId }, transaction: t, lock: true })
                  return resolve({ alreadySuccess: false, status: jsonStatus.OK, message: messages.English.action_success.replace('##', messages.English.cDepositeHasBeenMade) })
                } else {
                  return resolve({ alreadySuccess: false, status: jsonStatus.OK, message: messages.English.action_success.replace('##', messages.English.cDepositeHasBeenMade) })
                }
              }
            })
          } catch (error) {
            return reject(error)
          }
        } catch (error) {
          return reject(error)
        }
      })()
    })
  }

  /**
   * It'll validate deposit rate limit
   * @param { String } iUserId
   * @param { String } lang
   * @returns { Object } status of success or error
   */
  validateDepositRateLimit(iUserId, lang) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (config.NODE_ENV !== 'production') {
            return resolve({ status: 'success' })
          }
          const depositRateLimit = await findSetting({ sKey: 'UserDepositRateLimit' })
          const depositRateLimitTimeFrame = await findSetting({ sKey: 'UserDepositRateLimitTimeFrame' })

          if (!depositRateLimit || !depositRateLimitTimeFrame) {
            return resolve({ status: 'success' })
          }

          const currentDate = new Date().toISOString()
          const fromDate = new Date(new Date().setMinutes(new Date().getMinutes() - parseInt(depositRateLimitTimeFrame.nMax))).toISOString()

          const { count } = await UserDepositModel.findAndCountAll({
            where: {
              iUserId,
              ePaymentStatus: 'P',
              dCreatedAt: {
                [Op.lte]: currentDate,
                [Op.gte]: fromDate
              }
            }
          })

          if (count >= parseInt(depositRateLimit.nMax)) {
            const limitExceed = { status: jsonStatus.TooManyRequest, message: messages[lang].limit_reached.replace('##', messages[lang].depositRequest) }
            return reject(limitExceed)
          }
          resolve({ status: 'success' })
        } catch (error) {
          reject(error)
        }
      })()
    })
  }

  async checkUserDepositStatus(req, res) {
    try {
      const iUserId = req.user._id.toString()
      const { id } = req.params

      const user = await countUsers({ _id: iUserId })
      if (!user) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

      const data = await UserDepositModel.findOne({ where: { iUserId, id }, attributes: ['id', 'ePaymentStatus'], raw: true })
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cDeposit) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cDeposit), data })
    } catch (error) {
      return catchError('UserDeposit.checkUserDepositStatus', error, req, res)
    }
  }
}

module.exports = new UserDeposit()

/**
 * It will add users fields for admin deposit list
 * @param { Array } deposit
 * @param { Array } users
 * @returns { Object } user deposit data
 */
async function addUserFields(deposit, users = []) {
  let data

  if (users.length) {
    data = users
  } else {
    const depositIds = deposit.map(p => ObjectId(p.iUserId))
    data = await findUsers({ _id: { $in: depositIds } }, { sMobNum: 1, sEmail: 1, sUsername: 1 })
  }

  return deposit.map(p => {
    const user = data.find(u => u._id.toString() === p.iUserId.toString())
    return { ...p, ...user, _id: undefined }
  })
}
