const SQLUserLeagueModel = require('../userLeague/userLeagueSqlModel')
const UserBalanceModel = require('./model')
const StatisticsModel = require('../user/statistics/model')
const settingServices = require('../setting/services')
const db = require('../../database/sequelize')
const { Op, literal, Transaction } = require('sequelize')
const PassbookModel = require('../passbook/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, handleCatchError, getStatisticsSportsKey, convertToDecimal } = require('../../helper/utilities.services')
const { bulkQueuePush, checkProcessed, queuePush } = require('../../helper/redis')
const commonRuleServices = require('../commonRules/services')
const { ObjectId } = require('mongoose').Types
const { APP_LANG } = require('../../config/common')
const UserModel = require('../user/model')
// const { GamesDBConnect } = require('../../database/mongoose')

class UserBalance {
  async adminGet(req, res) {
    try {
      let data = await UserBalanceModel.findOne({ where: { iUserId: req.params.id }, raw: true })

      const stat = await StatisticsModel.findOne({ iUserId: req.params.id },
        { nTotalPlayedCash: 1 }).lean()
      if (!stat) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].user), data })

      const { nTotalPlayedCash: nTotalPlayCash } = stat

      data = { ...data, ...stat, nTotalPlayCash }
      delete data.nTotalPlayedCash
      delete data.aTotalMatch
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cBalance), data })
    } catch (error) {
      return catchError('UserBalance.adminGet', error, req, res)
    }
  }

  // done
  async userPlayDeduction(data, session) {
    return db.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
      },
      async (t) => {
        // const transactionOptions = {
        //   readPreference: 'primary',
        //   readConcern: { level: 'majority' },
        //   writeConcern: { w: 'majority' }
        // }
        // const session = await GamesDBConnect.startSession()
        // session.startTransaction(transactionOptions)

        let {
          iUserId,
          iUserLeagueId,
          iMatchLeagueId,
          iMatchId,
          nPrice,
          nBonusUtil = 0,
          sMatchName,
          sUserName,
          eType,
          sPromocode,
          eCategory,
          bPrivateLeague,
          nJoinPrice,
          nPromoDiscount = 0
        } = data
        iUserId = iUserId.toString()
        iUserLeagueId = iUserLeagueId.toString()
        iMatchId = iMatchId.toString()
        iMatchLeagueId = iMatchLeagueId.toString()
        nBonusUtil = Number(nBonusUtil)

        const leagueJoinAmount = convertToDecimal(nPrice)
        const userBalance = await UserBalanceModel.findOne({
          where: { iUserId },
          plain: true,
          transaction: t,
          lock: true
        })
        if (!userBalance) {
          return { isSuccess: false, nPrice, iUserId }
        }

        const {
          nCurrentWinningBalance,
          nCurrentDepositBalance,
          nCurrentTotalBalance,
          nCurrentBonus
        } = userBalance

        let nActualBonus = 0

        // if user and match contest having bonus then we have to use bonus(in percentage) of user to join contest.
        if (nBonusUtil && nBonusUtil > 0 && nPrice > 0) {
          const nBonus = (nPrice * nBonusUtil) / 100

          if (userBalance.nCurrentBonus - nBonus >= 0) {
            nActualBonus = nBonus
            if (userBalance.nCurrentTotalBalance < nPrice - nBonus) {
              return {
                isSuccess: false,
                nPrice: convertToDecimal(nPrice - nBonus - userBalance.nCurrentTotalBalance),
                nActualBonus: nActualBonus
              }
            }
          } else {
            nActualBonus = userBalance.nCurrentBonus
            if (userBalance.nCurrentTotalBalance < nPrice - userBalance.nCurrentBonus) {
              return {
                isSuccess: false,
                nPrice: convertToDecimal(nPrice - userBalance.nCurrentBonus - userBalance.nCurrentTotalBalance),
                nActualBonus: nActualBonus
              }
            }
          }
        } else if (userBalance.nCurrentTotalBalance < nPrice) {
          return {
            isSuccess: false,
            nPrice: convertToDecimal(nPrice - userBalance.nCurrentTotalBalance),
            nActualBonus: nActualBonus
          }
        }

        nPrice = nActualBonus ? nPrice - nActualBonus : nPrice
        nPrice = convertToDecimal(nPrice)
        nActualBonus = convertToDecimal(nActualBonus)
        let nCash = 0
        let nWin = 0
        let bResetDeposit = false
        // if user having deposit balance less than contest price to join, then we'll check for winning balance.
        if (userBalance.nCurrentDepositBalance < nPrice) {
          if (userBalance.nCurrentDepositBalance < 0) {
            // we'll cut contest join price from winning balance.
            nWin = nPrice
            await UserBalanceModel.update(
              {
                nCurrentWinningBalance: literal(
                  `nCurrentWinningBalance - ${nPrice}`
                ),
                nCurrentTotalBalance: literal(
                  `nCurrentTotalBalance - ${nPrice}`
                ),
                nCurrentBonus: literal(`nCurrentBonus - ${nActualBonus}`)
              },
              { where: { iUserId }, transaction: t, lock: true }
            )
          } else {
            bResetDeposit = true
            nWin = nPrice - userBalance.nCurrentDepositBalance
            await UserBalanceModel.update(
              {
                nCurrentDepositBalance: 0,
                nCurrentWinningBalance: literal(
                  `nCurrentWinningBalance - ${nPrice - userBalance.nCurrentDepositBalance
                  }`
                ),
                nCurrentTotalBalance: literal(
                  `nCurrentTotalBalance - ${nPrice}`
                ),
                nCurrentBonus: literal(`nCurrentBonus - ${nActualBonus}`)
              },
              { where: { iUserId }, transaction: t, lock: true }
            )
          }
        } else {
          nCash = nPrice
          await UserBalanceModel.update(
            {
              nCurrentDepositBalance: literal(
                `nCurrentDepositBalance - ${nPrice}`
              ),
              nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nPrice}`),
              nCurrentBonus: literal(`nCurrentBonus - ${nActualBonus}`)
            },
            { where: { iUserId }, transaction: t, lock: true }
          )
        }

        const sRemarks = sPromocode
          ? `${sUserName} participated in ${sMatchName} with Promocode ${sPromocode}`
          : `${sUserName} participated in ${sMatchName}`
        const passbook = await PassbookModel.create(
          {
            iUserId,
            nAmount: leagueJoinAmount,
            nCash: nPrice,
            nBonus: nActualBonus,
            iUserLeagueId,
            iMatchLeagueId,
            iMatchId,
            eUserType: eType,
            eTransactionType: 'Play',
            eType: 'Dr',
            nOldWinningBalance: nCurrentWinningBalance,
            nOldDepositBalance: nCurrentDepositBalance,
            nOldTotalBalance: nCurrentTotalBalance,
            nOldBonus: nCurrentBonus,
            sRemarks,
            sPromocode,
            eCategory
          },
          { transaction: t, lock: true }
        )

        if (!passbook || (passbook && !passbook.id)) return { isSuccess: false, nPrice: nPrice, nActualBonus: nActualBonus }
        const matchCategory = getStatisticsSportsKey(eCategory)
        let leagueTypeStat
        if (bPrivateLeague) {
          leagueTypeStat = {
            [`${matchCategory}.nJoinPLeague`]: 1,
            [`${matchCategory}.nJoinPLeagueSpend`]: Number(
              parseFloat(leagueJoinAmount).toFixed(2)
            ),
            nTotalPLeagueSpend: Number(parseFloat(leagueJoinAmount).toFixed(2))
          }
        } else {
          leagueTypeStat = {
            [`${matchCategory}.nJoinLeague`]: 1,
            nTotalSpend: Number(parseFloat(nJoinPrice).toFixed(2)),
            nDiscountAmount: Number(parseFloat(nPromoDiscount).toFixed(2))
          }
        }

        let query = {}
        if (!bResetDeposit) {
          leagueTypeStat = {
            ...leagueTypeStat,
            nActualDepositBalance: -Number(parseFloat(nCash).toFixed(2))
          }
        } else {
          query = { $set: { nActualDepositBalance: 0 } }
        }

        // Update UserLeague which we have created outside
        await StatisticsModel.updateOne(
          { iUserId: ObjectId(iUserId) },
          {
            $inc: {
              nTotalJoinLeague: 1,
              [`${matchCategory}.nSpending`]: Number(
                parseFloat(leagueJoinAmount).toFixed(2)
              ),
              [`${matchCategory}.nSpendingCash`]: Number(
                parseFloat(nCash + nWin).toFixed(2)
              ),
              nActualWinningBalance: -Number(parseFloat(nWin).toFixed(2)),
              nActualBonus: -Number(parseFloat(nActualBonus).toFixed(2)),
              nTotalPlayedCash: Number(parseFloat(nPrice).toFixed(2)),
              nTotalPlayedBonus: Number(parseFloat(nActualBonus).toFixed(2)),
              nWinnings: -Number(parseFloat(nWin).toFixed(2)),
              [`${matchCategory}.nSpendingBonus`]: Number(
                parseFloat(nActualBonus).toFixed(2)
              ),
              [`${matchCategory}.nDiscountAmount`]: Number(
                parseFloat(nPromoDiscount).toFixed(2)
              ),
              ...leagueTypeStat
            },
            $addToSet: {
              [`${matchCategory}.aMatchPlayed`]: {
                iMatchId: ObjectId(iMatchId)
              },
              aTotalMatch: { iMatchId: ObjectId(iMatchId) }
            },
            ...query
          },
          { upsert: true }
        )

        return { isSuccess: true, nPrice: nPrice, nActualBonus: nActualBonus }
      }
    )
  }

  // done
  async referBonus(data) {
    try {
      let { iUserId, rule, sUserName, eType: eUserType, nReferrals, iReferById } = data
      if (!rule) rule = {}
      let { eType, nAmount = 0, eRule = '', nExpireDays = 0 } = rule
      iUserId = iUserId.toString()
      nAmount = parseFloat(nAmount)
      const dBonusExpiryDate = new Date()
      dBonusExpiryDate.setDate(dBonusExpiryDate.getDate() + nExpireDays)

      const eTransactionType = (eRule === 'RB') ? 'Bonus' : 'Refer-Bonus'

      if (eRule === 'RR' && iReferById) {
        const passbookProcessed = await checkProcessed(`referBonus:${iUserId}:${iReferById}`, 20)
        if (passbookProcessed === 'EXIST') return { isSuccess: true }
      }

      return db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
      }, async (t) => {
        const userBalance = await UserBalanceModel.findOne({ where: { iUserId }, transaction: t, lock: true })
        const { nCurrentWinningBalance = 0, nCurrentDepositBalance, nCurrentTotalBalance, nCurrentBonus } = userBalance
        if (eType === 'C') {
          await UserBalanceModel.update({
            nCurrentTotalBalance: literal(`nCurrentTotalBalance + ${nAmount}`),
            nCurrentDepositBalance: literal(`nCurrentDepositBalance + ${nAmount}`)
            // nTotalDepositAmount: literal(`nTotalDepositAmount + ${nAmount}`),
            // nTotalDepositCount: literal('nTotalDepositCount + 1')
          }, { where: { iUserId }, transaction: t, lock: true })
        } else if (eType === 'B') {
          await UserBalanceModel.update({
            nCurrentBonus: literal(`nCurrentBonus + ${nAmount}`),
            nTotalBonusEarned: literal(`nTotalBonusEarned + ${nAmount}`)
          }, { where: { iUserId }, transaction: t, lock: true })
        }
        await UserModel.updateOne({ _id: ObjectId(iReferById) }, { $set: { eReferStatus: 'S' } })
        let sRemarks
        if (eRule === 'RCB') {
          sRemarks = messages[APP_LANG].get_refer_bonus.replace('##', sUserName)
        } else if (eRule === 'RR') {
          sRemarks = messages[APP_LANG].get_register_refer_bonus.replace('##', sUserName)
        } else {
          sRemarks = messages[APP_LANG].get_register_bonus.replace('##', sUserName)
        }

        await PassbookModel.create({
          iUserId,
          nAmount: nAmount,
          nCash: eType === 'C' ? nAmount : 0,
          nBonus: eType === 'B' ? nAmount : 0,
          eTransactionType,
          eType: 'Cr',
          eUserType,
          nOldWinningBalance: nCurrentWinningBalance,
          nOldDepositBalance: nCurrentDepositBalance,
          nOldTotalBalance: nCurrentTotalBalance,
          nOldBonus: nCurrentBonus,
          dBonusExpiryDate,
          sRemarks,
          sCommonRule: eRule,
          dActivityDate: new Date()
        }, { transaction: t, lock: true })

        const nCash = eType === 'C' ? nAmount : 0
        // const nCount = eType === 'C' ? 1 : 0
        const nBonus = eType === 'B' ? nAmount : 0
        const isExist = await StatisticsModel.countDocuments({ iUserId: ObjectId(data.iUserId) })

        if (!isExist) {
          await StatisticsModel.create({ iUserId: ObjectId(data.iUserId) })
        }
        await StatisticsModel.updateOne({ iUserId: ObjectId(data.iUserId) }, {
          $inc: {
            nReferrals: !nReferrals ? 0 : 1,
            nActualBonus: convertToDecimal(nBonus),
            nActualDepositBalance: convertToDecimal(nCash),
            // nDeposits: Number(parseFloat(nCash).toFixed(2)),
            nCash: convertToDecimal(nCash),
            nBonus: convertToDecimal(nBonus)
            // nDepositCount: nCount
          }
        }, { upsert: true })

        return { isSuccess: true }
      })
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  // done
  /**
   *
   * @param { Object } data
   */
  async userPlayReturn(data) {
    try {
      let { iMatchId, iMatchLeagueId, userLeagues, eCategory } = data
      console.log('inside userPlayReturn....', iMatchId, iMatchLeagueId)

      const oUserLeagues = {}
      const oPlayedUserLeagues = {}
      const aPlayReturnQueue = []

      iMatchLeagueId = iMatchLeagueId.toString()
      iMatchId = iMatchId.toString()
      const userLeagueId = userLeagues.map(({ _id }) => _id.toString())

      const matchCategory = getStatisticsSportsKey(eCategory)

      const [playReturnPassBooks, playPassBooks] = await Promise.all([
        PassbookModel.findAll({
          where: { eTransactionType: 'Play-Return', iUserLeagueId: { [Op.in]: userLeagueId } },
          attributes: ['iUserLeagueId'],
          raw: true
        }),
        PassbookModel.findAll({
          where: { eTransactionType: 'Play', iUserLeagueId: { [Op.in]: userLeagueId } },
          attributes: ['nAmount', 'nBonus', 'nCash', 'nOldDepositBalance', 'nNewDepositBalance', 'nOldWinningBalance', 'nNewWinningBalance', 'iUserLeagueId'],
          raw: true
        })
      ])
      playReturnPassBooks.forEach((pbk, i) => { oUserLeagues[pbk.iUserLeagueId] = i })
      playPassBooks.forEach((pbk, i) => { oPlayedUserLeagues[pbk.iUserLeagueId] = i })

      const aUserLeagueData = []
      const aStatisticUpdate = []

      console.time(`${iMatchLeagueId} Play Return`)
      for (const ul of userLeagues) {
        let {
          iUserId,
          _id: iUserLeagueId,
          sMatchName,
          sUserName,
          eType
        } = ul
        iUserId = iUserId.toString()
        iUserLeagueId = iUserLeagueId.toString()

        if (eType === 'U') aPlayReturnQueue.push(iUserId)

        const isExist = oUserLeagues[iUserLeagueId.toString()] ? playReturnPassBooks[oUserLeagues[iUserLeagueId.toString()]] : false
        if (!isExist) {
          const passBook = (typeof oPlayedUserLeagues[iUserLeagueId.toString()] === 'number') ? playPassBooks[oPlayedUserLeagues[iUserLeagueId.toString()]] : false
          if (passBook) {
            aUserLeagueData.push({
              iMatchLeagueId,
              iUserLeagueId,
              iMatchId,
              eUserType: (eType === 'U') ? 'U' : 'B',
              iUserId,
              sMatchName,
              sUserName,
              eCategory,
              eTransactionType: 'Play'
            })
            const {
              nAmount: passBookAmount,
              nBonus: passBookBonus,
              nCash: passBookCash
            } = passBook
            const statisticObj = {
              nWinnings:
                convertToDecimal(
                  passBook.nOldWinningBalance -
                  passBook.nNewWinningBalance
                ),
              nTotalPlayReturn: convertToDecimal(passBookAmount),
              nTotalPlayReturnBonus: convertToDecimal(passBookBonus),
              nTotalPlayReturnCash: convertToDecimal(passBookCash),
              nActualDepositBalance:
                convertToDecimal(
                  passBook.nOldDepositBalance -
                  passBook.nNewDepositBalance
                ),
              nActualWinningBalance:
                convertToDecimal(
                  passBook.nOldWinningBalance -
                  passBook.nNewWinningBalance
                ),
              nActualBonus: convertToDecimal(passBookBonus),
              [`${matchCategory}.nPlayReturn`]: convertToDecimal(passBookAmount),
              [`${matchCategory}.nSpendingCash`]: -convertToDecimal(passBookCash),
              [`${matchCategory}.nSpendingBonus`]: -convertToDecimal(passBookBonus)
            }
            aStatisticUpdate.push({
              updateOne: {
                filter: { iUserId: ObjectId(iUserId) },
                update: { $inc: statisticObj }
              }
            })
          }
        }
      }

      let result = { isSuccess: true }
      try {
        if (aUserLeagueData && aUserLeagueData.length) {
          const procedureArgument = { replacements: { iId: iMatchLeagueId } }
          await SQLUserLeagueModel.destroy({ where: { iMatchLeagueId, eTransactionType: 'Play' } })
          await SQLUserLeagueModel.bulkCreate(aUserLeagueData)
          await db.sequelize.query('CALL bulkPlayReturn(:iId)', procedureArgument)
          await StatisticsModel.bulkWrite(aStatisticUpdate, { ordered: false })
          await bulkQueuePush('pushNotification:playReturn', aPlayReturnQueue, 1000)
        }
      } catch (error) {
        result = { isSuccess: false }
        handleCatchError(error)
      }
      console.timeEnd(`${iMatchLeagueId} Play Return`)

      return result
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  /**
   * It will give user contest cashback
   * @param { Object } data
   * @returns { Object } of isSuccess true or false
   */
  async userContestCashback(data) {
    try {
      let { nAmount, eCashbackType, nTeams, userLeagues, iMatchId, iMatchLeagueId, eCategory } = data
      nAmount = Number(nAmount)

      const bonusExpireDays = await settingServices.findSetting('BonusExpireDays')
      if (!bonusExpireDays) return ({ isSuccess: false })

      iMatchLeagueId = iMatchLeagueId.toString()
      iMatchId = iMatchId.toString()

      const aUserIds = userLeagues.map(({ _id }) => _id.toString())
      const oUserLeagues = {}

      let dBonusExpiryDate;

      (eCashbackType === 'B') ? (dBonusExpiryDate = new Date().setDate(new Date().getDate() + bonusExpireDays.nMax)) : dBonusExpiryDate = null

      const cashbackContestPassbooks = await PassbookModel.findAll({
        where: { eTransactionType: 'Cashback-Contest', iUserId: { [Op.in]: aUserIds } },
        attributes: ['nAmount', 'nBonus', 'nCash', 'nOldDepositBalance', 'nNewDepositBalance', 'nOldWinningBalance', 'nNewWinningBalance', 'iUserLeagueId', 'iUserId'],
        raw: true
      })
      cashbackContestPassbooks.forEach((e, i) => { oUserLeagues[e.iUserId] = i })

      for (const ul of userLeagues) {
        await db.sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        }, async (t) => {
          let { _id: iUserId, sUserName, eType } = ul
          iUserId = iUserId.toString()

          const passbookProcessed = await checkProcessed(`cashback:${iUserId}:${iMatchLeagueId}`, 15)
          if (passbookProcessed !== 'EXIST') {
            const isProcessed = await PassbookModel.findOne({ where: { iUserId, eTransactionType: 'Cashback-Contest', iMatchLeagueId, iMatchId }, transaction: t, lock: true })
            if (!isProcessed) {
              const userBalance = await UserBalanceModel.findOne({ where: { iUserId }, transaction: t, lock: true })
              const { nCurrentWinningBalance = 0, nCurrentDepositBalance = 0, nCurrentTotalBalance = 0, nCurrentBonus = 0 } = userBalance

              if (eCashbackType === 'C') {
                await UserBalanceModel.update({
                  nCurrentTotalBalance: literal(`nCurrentTotalBalance + ${nAmount}`),
                  nCurrentWinningBalance: literal(`nCurrentWinningBalance + ${nAmount}`),
                  nTotalWinningAmount: literal(`nTotalWinningAmount + ${nAmount}`)
                // nTotalDepositAmount: literal(`nTotalDepositAmount + ${nAmount}`),
                // nTotalDepositCount: literal('nTotalDepositCount + 1')
                }, { where: { iUserId }, transaction: t, lock: true })
              } else if (eCashbackType === 'B') {
                dBonusExpiryDate = new Date()
                dBonusExpiryDate.setDate(dBonusExpiryDate.getDate() + bonusExpireDays.nMax)
                await UserBalanceModel.update({
                  nCurrentBonus: literal(`nCurrentBonus + ${nAmount}`),
                  nTotalBonusEarned: literal(`nTotalBonusEarned + ${nAmount}`)
                }, { where: { iUserId }, transaction: t, lock: true })
              }

              const sRemarks = messages[APP_LANG].got_cashback_with_min_team.replace('##', sUserName).replace('#', nTeams)
              await PassbookModel.create({
                iUserId,
                nAmount: nAmount,
                nCash: eCashbackType === 'C' ? nAmount : 0,
                nBonus: eCashbackType === 'B' ? nAmount : 0,
                eTransactionType: 'Cashback-Contest',
                eUserType: eType,
                eType: 'Cr',
                iMatchLeagueId,
                iMatchId,
                nOldWinningBalance: nCurrentWinningBalance,
                nOldDepositBalance: nCurrentDepositBalance,
                nOldTotalBalance: nCurrentTotalBalance,
                nOldBonus: nCurrentBonus,
                dBonusExpiryDate,
                sRemarks,
                dActivityDate: new Date()
              }, { transaction: t, lock: true })

              const matchCategory = getStatisticsSportsKey(eCategory)
              const nCash = (eCashbackType === 'C') ? nAmount : 0
              // const nCount = (eCashbackType === 'C') ? 1 : 0
              const nBonus = eCashbackType === 'B' ? nAmount : 0
              await StatisticsModel.updateOne({ iUserId: ObjectId(ul._id) }, {
                $inc: {
                  nActualBonus: convertToDecimal(nBonus),
                  nActualWinningBalance: convertToDecimal(nCash),
                  nWinnings: convertToDecimal(nCash),
                  nTotalWinnings: convertToDecimal(nCash),
                  nCashbackCash: convertToDecimal(nCash),
                  nCashbackBonus: convertToDecimal(nBonus),
                  // nDepositCount: nCount,
                  // nDeposits: Number(parseFloat(nCash).toFixed(2)),
                  nCash: convertToDecimal(nCash),
                  nBonus: convertToDecimal(nBonus),
                  [`${matchCategory}.nCashbackAmount`]: convertToDecimal(nAmount),
                  [`${matchCategory}.nCashbackCount`]: 1
                }
              }, { upsert: true })
            }
          }
        })
      }
      return { isSuccess: true }
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  /**
   * It will give user contest cashback
   * @param { Object } data
   * @returns { Object } of isSuccess true or false
   */
  async userContestCashbackV2(data) {
    try {
      let {
        nAmount,
        eCashbackType,
        nTeams,
        aUserLeagues,
        iMatchId,
        iMatchLeagueId,
        eCategory
      } = data
      const aProcessLeagues = []
      const aStatisticUpdate = []
      const oLeagueData = {}
      const oCashbackData = {}
      nAmount = Number(nAmount)
      iMatchId = iMatchId.toString()
      iMatchLeagueId = iMatchLeagueId.toString()
      let dBonusExpiryDate = null

      const matchCategory = getStatisticsSportsKey(eCategory)
      const nCash = eCashbackType === 'C' ? nAmount : 0
      const nBonus = eCashbackType === 'B' ? nAmount : 0

      const bonusExpireDays = await settingServices.findSetting(
        'BonusExpireDays'
      )
      if (!bonusExpireDays) return { isSuccess: false }

      if (eCashbackType === 'B') {
        dBonusExpiryDate = new Date()
        dBonusExpiryDate.setDate(dBonusExpiryDate.getDate() + bonusExpireDays.nMax)
        dBonusExpiryDate.setUTCHours(23, 59) // 23:59 EOD
      }
      // SP CHANGE
      const aUserIds = aUserLeagues.map((e, i) => {
        oLeagueData[e._id.toString()] = i
        return e._id.toString()
      })
      const aCashbackEntries = await PassbookModel.findAll({ where: { iUserId: { [Op.in]: aUserIds }, iMatchId: iMatchId.toString(), iMatchLeagueId: iMatchLeagueId.toString(), eTransactionType: 'Cashback-Contest' }, raw: true, attributes: ['iUserId'] })
      aCashbackEntries.forEach((pbk, i) => { oCashbackData[pbk.iUserId] = i })

      // need to push this data in userleague sql
      for (const league of aUserLeagues) {
        const isExist = oLeagueData[league._id.toString()] === oCashbackData[league._id.toString()]
        if (!isExist) {
          aProcessLeagues.push({
            nFinalAmount: nAmount,
            eUserType: (league.eType === 'U') ? 'U' : 'B',
            eTransactionType: 'Cashback-Contest',
            nTdsFee: nTeams, // here we are using this field for temp to store minTeam count in SQL table
            eCategory,
            iMatchId,
            iMatchLeagueId,
            iUserId: league._id.toString(),
            sUserName: league.sUserName
          })

          const oStatistics = {
            nActualBonus: convertToDecimal(nBonus),
            nCashbackCash: convertToDecimal(nCash),
            nCashbackBonus: convertToDecimal(nBonus),
            nActualDepositBalance: convertToDecimal(nCash),
            nCash: convertToDecimal(nCash),
            nBonus: convertToDecimal(nBonus),
            [`${matchCategory}.nCashbackCash`]: convertToDecimal(nCash),
            [`${matchCategory}.nCashbackCashCount`]: 1,
            [`${matchCategory}.nCashbackBonus`]: convertToDecimal(nBonus),
            [`${matchCategory}.nCashbackBonusCount`]: 1,
            [`${matchCategory}.nCashbackAmount`]: convertToDecimal(nAmount),
            [`${matchCategory}.nCashbackCount`]: 1
          }
          aStatisticUpdate.push({
            updateOne: {
              filter: { iUserId: ObjectId(league._id) },
              update: { $inc: oStatistics }
            }
          })
        }
      }
      let result = { isSuccess: true }
      try {
        if (aProcessLeagues && aProcessLeagues.length) {
          const procedureArgument = { replacements: { _iId: iMatchLeagueId, _dBonusExpiryDate: dBonusExpiryDate, _eCashbackType: eCashbackType } }
          await SQLUserLeagueModel.destroy({ where: { iMatchLeagueId, eTransactionType: 'Cashback-Contest' } })
          await SQLUserLeagueModel.bulkCreate(aProcessLeagues)
          let aSPResult = await db.sequelize.query('CALL bulkCashbackContest(:_iId, :_dBonusExpiryDate, :_eCashbackType, @_error, @bSuccess)', procedureArgument)
          console.log(`Cashback Contest SP Called: ${iMatchLeagueId}`)
          aSPResult = JSON.parse(JSON.stringify(aSPResult))
          console.log(`Cashback Contest Result: ${aSPResult}`)
          if (!aSPResult[0].bSuccess) result = { isSuccess: false }
          await StatisticsModel.bulkWrite(aStatisticUpdate, { ordered: false })
        }
      } catch (error) {
        result = { isSuccess: false }
        handleCatchError(error)
      }

      return result
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  // done
  /**
   * It will take returns user contest cashback
   * @param { Object } data
   */
  async userContestCashbackReturn(data) {
    const aProcessedLeagues = []
    let successCount = 0
    const failedCount = 0
    try {
      let { nAmount, eCashbackType, nTeams, userLeagues, iMatchId, iMatchLeagueId, eCategory } = data
      nAmount = Number(nAmount)

      for (const ul of userLeagues) {
        await db.sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        }, async (t) => {
          let { _id: iUserId, sUserName, eType, iLeagueId } = ul
          iUserId = iUserId.toString()
          iMatchLeagueId = iMatchLeagueId.toString()
          iMatchId = iMatchId.toString()

          const passbookProcessed = await checkProcessed(`cashbackReturn:${iUserId}:${iMatchLeagueId}`, 15)
          if (passbookProcessed !== 'EXIST') {
            const isProcessed = await PassbookModel.findOne({ where: { iUserId, eTransactionType: 'Cashback-Return', iMatchLeagueId, iMatchId }, transaction: t, lock: true })
            if (!isProcessed) {
              const isExist = await PassbookModel.findOne({ where: { iUserId, eTransactionType: 'Cashback-Contest', iMatchLeagueId, iMatchId }, transaction: t, lock: true })
              if (isExist) {
                const userBalance = await UserBalanceModel.findOne({ where: { iUserId }, transaction: t, lock: true })
                const { nCurrentWinningBalance = 0, nCurrentDepositBalance = 0, nCurrentTotalBalance = 0, nCurrentBonus = 0 } = userBalance

                if (eCashbackType === 'C') {
                  await UserBalanceModel.update({
                    nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nAmount}`),
                    nCurrentWinningBalance: literal(`nCurrentWinningBalance - ${nAmount}`),
                    nTotalCashbackReturned: literal(`nTotalCashbackReturned + ${nAmount}`)
                  // nTotalDepositAmount: literal(`nTotalDepositAmount - ${nAmount}`),
                  // nTotalDepositCount: literal('nTotalDepositCount - 1')
                  }, { where: { iUserId }, transaction: t, lock: true })
                } else if (eCashbackType === 'B') {
                  await UserBalanceModel.update({
                    nCurrentBonus: literal(`nCurrentBonus - ${nAmount}`),
                    // nTotalBonusEarned: literal(`nTotalBonusEarned - ${nAmount}`)
                    nTotalBonusReturned: literal(`nTotalBonusReturned + ${nAmount}`)
                  }, { where: { iUserId }, transaction: t, lock: true })
                }

                const sRemarks = messages[APP_LANG].got_cashback_return_with_min_team.replace('##', sUserName).replace('#', nTeams)
                await PassbookModel.create({
                  iUserId,
                  nAmount: nAmount,
                  nCash: eCashbackType === 'C' ? nAmount : 0,
                  nBonus: eCashbackType === 'B' ? nAmount : 0,
                  eTransactionType: 'Cashback-Return',
                  eType: 'Dr',
                  eUserType: eType,
                  iMatchLeagueId,
                  iMatchId,
                  nOldWinningBalance: nCurrentWinningBalance,
                  nOldDepositBalance: nCurrentDepositBalance,
                  nOldTotalBalance: nCurrentTotalBalance,
                  nOldBonus: nCurrentBonus,
                  sRemarks,
                  dActivityDate: new Date()
                }, { transaction: t, lock: true })

                const matchCategory = getStatisticsSportsKey(eCategory)
                const nCash = (eCashbackType === 'C') ? nAmount : 0
                // const nCount = (eCashbackType === 'C') ? 1 : 0
                const nBonus = eCashbackType === 'B' ? nAmount : 0
                await StatisticsModel.updateOne({ iUserId: ObjectId(ul._id) }, {
                  $inc: {
                    nActualBonus: -convertToDecimal(nBonus),
                    nActualWinningBalance: -convertToDecimal(nCash),
                    nWinnings: -convertToDecimal(nCash),
                    nTotalCashbackReturnCash: convertToDecimal(nCash),
                    nTotalCashbackReturnBonus: convertToDecimal(nBonus),
                    // nActualDepositBalance: -(Number(parseFloat(nCash).toFixed(2))),
                    // nDepositCount: -(nCount),
                    // nDeposits: -(Number(parseFloat(nCash).toFixed(2))),
                    nCash: -convertToDecimal(nCash),
                    nBonus: -convertToDecimal(nBonus),
                    [`${matchCategory}.nCashbackAmount`]: -convertToDecimal(nAmount),
                    [`${matchCategory}.nCashbackCount`]: -1
                  }
                }, { upsert: true })
              // await session.commitTransaction()
              // session.endSession()
              }
            }
            aProcessedLeagues.push(iLeagueId)
            successCount++
          }
        })
      }
      if (failedCount) console.log(`******** userCashbackReturn ********** failed: ${failedCount}, success: ${successCount}`)
      return { isSuccess: true, aProcessedLeagues, successCount, failedCount }
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false, error, aProcessedLeagues, successCount, failedCount }
    }
  }

  // Nw Contest CashBacReturn SP
  async userContestCashbackReturnV2(data) {
    try {
      let {
        nAmount,
        eCashbackType,
        nTeams,
        aUserLeagues,
        iMatchId,
        iMatchLeagueId,
        eCategory
      } = data
      nAmount = Number(nAmount)

      const aProcessLeagues = []
      const aStatisticUpdate = []
      const oLeagueData = {}
      const oCashbackReturnData = {}
      nAmount = Number(nAmount)
      iMatchId = iMatchId.toString()
      iMatchLeagueId = iMatchLeagueId.toString()

      const matchCategory = getStatisticsSportsKey(eCategory)
      const nCash = eCashbackType === 'C' ? nAmount : 0
      const nBonus = eCashbackType === 'B' ? nAmount : 0
      // SP change
      const aUserIds = aUserLeagues.map((e, i) => {
        oLeagueData[e._id.toString()] = i
        return e._id.toString()
      })

      const aCashbackReturnEntries = await PassbookModel.findAll({ where: { iUserId: { [Op.in]: aUserIds }, iMatchId: iMatchId.toString(), iMatchLeagueId: iMatchLeagueId.toString(), eTransactionType: 'Cashback-Return' }, raw: true, attributes: ['iUserId'] })
      aCashbackReturnEntries.forEach((pbk, i) => { oCashbackReturnData[pbk.iUserId] = i })

      for (const league of aUserLeagues) {
        const isExist = oLeagueData[league._id.toString()] === oCashbackReturnData[league._id.toString()]
        if (!isExist) {
          aProcessLeagues.push({
            nFinalAmount: nAmount,
            eUserType: (league.eType === 'U') ? 'U' : 'B',
            eTransactionType: 'Cashback-Return',
            nTdsFee: nTeams, // here we are using this field for temp to store minTeam count in SQL table
            eCategory,
            iMatchId,
            iMatchLeagueId,
            iUserId: league._id.toString(),
            iUserLeagueId: league.iLeagueId.toString(),
            sUserName: league.sUserName
          })

          const oStatistics = {
            nActualBonus: -convertToDecimal(nBonus),
            nCashbackCash: -convertToDecimal(nCash),
            nCashbackBonus: -convertToDecimal(nBonus),
            nActualDepositBalance: -convertToDecimal(nCash),
            nTotalCashbackReturnCash: convertToDecimal(nCash),
            nTotalCashbackReturnBonus: convertToDecimal(nBonus),
            nCash: -convertToDecimal(nCash),
            [`${matchCategory}.nCashbackAmount`]: -convertToDecimal(nAmount),
            [`${matchCategory}.nCashbackCount`]: -1,
            [`${matchCategory}.nCashbackCash`]: -convertToDecimal(nCash),
            [`${matchCategory}.nCashbackCashCount`]: -1,
            [`${matchCategory}.nCashbackBonus`]: -convertToDecimal(nBonus),
            [`${matchCategory}.nCashbackBonusCount`]: -1,
            [`${matchCategory}.nCashbackReturnCash`]: convertToDecimal(nCash),
            [`${matchCategory}.nCashbackReturnCashCount`]: 1,
            [`${matchCategory}.nCashbackReturnBonus`]: convertToDecimal(nBonus),
            [`${matchCategory}.nCashbackReturnBonusCount`]: 1
          }

          aStatisticUpdate.push({
            updateOne: {
              filter: { iUserId: ObjectId(league._id) },
              update: { $inc: oStatistics }
            }
          })
        }
      }
      let result = { isSuccess: true }
      try {
        if (aProcessLeagues && aProcessLeagues.length) {
          const procedureArgument = { replacements: { _iId: iMatchLeagueId, _eCashbackType: eCashbackType } }
          await SQLUserLeagueModel.destroy({ where: { iMatchLeagueId, eTransactionType: 'Cashback-Return' } })
          await SQLUserLeagueModel.bulkCreate(aProcessLeagues)
          let aSPResult = await db.sequelize.query('CALL bulkCashbackContestReturn(:_iId, :_eCashbackType, @_error, @bSuccess)', procedureArgument)
          console.log(`Cashback Contest Return SP Called: ${iMatchLeagueId}`)
          aSPResult = JSON.parse(JSON.stringify(aSPResult))
          console.log('Cashback Contest Return Result:', aSPResult[0])
          if (!aSPResult[0].bSuccess) result = { isSuccess: false }
          await StatisticsModel.bulkWrite(aStatisticUpdate, { ordered: false })
        }
      } catch (error) {
        result = { isSuccess: false }
        handleCatchError(error)
      }

      return result
    } catch (error) {
      handleCatchError(error)
      return {
        isSuccess: false,
        error
      }
    }
  }

  /**
   * It will opens account
   * @param { Object } data
   * @returns { Object } of isSuccess true or false
   */
  async openAccount(data) {
    try {
      let { iUserId, sUsername, eType: eUserType } = data

      iUserId = iUserId.toString()

      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
      }, async (t) => {
        await PassbookModel.create({
          iUserId,
          eUserType,
          eTransactionType: 'Opening',
          eType: 'Cr',
          sRemarks: messages[APP_LANG].initial_account_opened.replace('##', sUsername),
          dActivityDate: new Date()
        }, { transaction: t, lock: true })

        await UserBalanceModel.create({
          iUserId,
          eUserType
        }, { transaction: t, lock: true })
        await StatisticsModel.create({ iUserId: ObjectId(iUserId) })
      })
      return { isSuccess: true }
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  async birthdayBonus(data) {
    try {
      let { iUserId, sUsername, eType: eUserType, birthdayBonus, year } = data

      iUserId = iUserId.toString()

      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
      }, async (t) => {
        const userBalance = await UserBalanceModel.findOne({ where: { iUserId }, transaction: t, lock: true })
        const { nCurrentBonus } = userBalance
        const nNewBonus = nCurrentBonus + birthdayBonus
        await UserBalanceModel.update({
          nTotalBonusEarned: literal(`nTotalBonusEarned + ${birthdayBonus}`),
          nCurrentBonus: literal(`nCurrentBonus + ${birthdayBonus}`)
        }, {
          where: { iUserId },
          transaction: t,
          lock: true
        })
        await PassbookModel.create({
          iUserId,
          nAmount: birthdayBonus,
          nBonus: birthdayBonus,
          eUserType,
          eTransactionType: 'Bonus',
          nOldBonus: nCurrentBonus,
          nNewBonus,
          sCommonRule: 'BB',
          eType: 'Cr',
          sRemarks: messages[APP_LANG].get_birthday_bonus.replace('##', sUsername),
          dActivityDate: new Date()
        }, { transaction: t, lock: true })
        await UserModel.updateOne({ _id: ObjectId(iUserId) }, { $set: { sDobBonusIn: year } })
        await StatisticsModel.updateOne({ iUserId: ObjectId(iUserId) }, { $inc: { nActualBonus: convertToDecimal(birthdayBonus), nBonus: convertToDecimal(birthdayBonus) } }, { upsert: true })
      })
      await queuePush('pushNotification:BirthdayBonus', { _id: iUserId, bonus: birthdayBonus })
      return { isSuccess: true }
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  /**
   * It will revert previously opened account
   * @param { Object } data
   * @returns { Object } of isSuccess true or false
   */
  async revertOpenedAccount(data) {
    try {
      let { iUserId, eType: eUserType } = data

      iUserId = iUserId.toString()

      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
      }, async (t) => {
        await PassbookModel.destroy({
          where: {
            iUserId,
            eUserType,
            eTransactionType: 'Opening',
            eType: 'Cr'
          }
        }, { transaction: t, lock: true })

        await UserBalanceModel.destroy({
          where: {
            iUserId,
            eUserType
          }
        }, { transaction: t, lock: true })
        await StatisticsModel.deleteOne({ iUserId: ObjectId(iUserId) })
      })
      return { isSuccess: true }
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  // currently in development mode, not in live.
  async winReturn(data) {
    return new Promise((resolve, reject) => {
      try {
        let { nPrice = 0, iUserId, _id, sMatchName, sUserName, iMatchLeagueId, iMatchId, eType, nBonusWin = 0 } = data

        eType = (eType === 'U') ? 'U' : 'B'
        iUserId = iUserId.toString()
        const iUserLeagueId = _id.toString()
        iMatchId = iMatchId.toString()
        iMatchLeagueId = iMatchLeagueId.toString()
        nPrice = Number(nPrice)

        return db.sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        }, async (t) => {
          const isProcessed = await PassbookModel.findOne({ where: { iUserId, eTransactionType: 'Win-Return', iUserLeagueId, iMatchLeagueId, iMatchId }, transaction: t, lock: true })
          if (!isProcessed) {
            const userBalance = await UserBalanceModel.findOne({ where: { iUserId } })

            const { nCurrentWinningBalance, nCurrentDepositBalance, nCurrentTotalBalance, nCurrentBonus } = userBalance

            const passBook = await PassbookModel.findOne({ where: { iUserId, eTransactionType: 'Win', iUserLeagueId }, transaction: t, lock: true })

            if (passBook && nPrice > 0) {
              if (userBalance.nCurrentWinningBalance >= nPrice) {
                await UserBalanceModel.update({
                  nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nPrice}`),
                  nCurrentWinningBalance: literal(`nCurrentWinningBalance - ${nPrice}`),
                  nCurrentBonus: literal(`nCurrentBonus - ${nBonusWin}`),
                  nTotalBonusEarned: literal(`nTotalBonusEarned - ${nBonusWin}`)
                },
                {
                  where: { iUserId },
                  transaction: t,
                  lock: true
                })
              } else if (userBalance.nCurrentTotalBalance >= nPrice) {
                await UserBalanceModel.update({
                  nCurrentDepositBalance: literal(`nCurrentDepositBalance - ${(nPrice - nCurrentWinningBalance)}`),
                  nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nPrice}`),
                  nCurrentWinningBalance: 0,
                  nCurrentBonus: literal(`nCurrentBonus - ${nBonusWin}`),
                  nTotalBonusEarned: literal(`nTotalBonusEarned - ${nBonusWin}`)
                },
                {
                  where: { iUserId },
                  transaction: t,
                  lock: true
                })
              } else {
                await UserBalanceModel.update({
                  nCurrentDepositBalance: literal(`nCurrentDepositBalance - ${(nPrice - nCurrentWinningBalance)}`),
                  nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nPrice}`),
                  nCurrentWinningBalance: 0,
                  nCurrentBonus: literal(`nCurrentBonus - ${nBonusWin}`),
                  nTotalBonusEarned: literal(`nTotalBonusEarned - ${nBonusWin}`)
                },
                {
                  where: { iUserId },
                  transaction: t,
                  lock: true
                })
              }
            } else if (passBook && nBonusWin > 0) {
              await UserBalanceModel.update({
                nCurrentBonus: literal(`nCurrentBonus - ${nBonusWin}`),
                nTotalBonusEarned: literal(`nTotalBonusEarned - ${nBonusWin}`)
              },
              {
                where: { iUserId },
                transaction: t,
                lock: true
              })
            }

            await PassbookModel.create({
              iUserId,
              eTransactionType: 'Win-Return',
              eType: 'Dr',
              eUserType: eType,
              nBonus: nBonusWin,
              nAmount: nPrice + nBonusWin,
              nCash: nPrice,
              iUserLeagueId,
              iMatchId,
              iMatchLeagueId,
              nOldWinningBalance: nCurrentWinningBalance,
              nOldDepositBalance: nCurrentDepositBalance,
              nOldTotalBalance: nCurrentTotalBalance,
              nOldBonus: nCurrentBonus,
              sRemarks: messages[APP_LANG].win_return_for.replace('##', sUserName).replace('#', sMatchName),
              dActivityDate: new Date()
            }, { transaction: t, lock: true })

            await PassbookModel.update({
              bWinReturn: true
            },
            {
              where: { iUserId, eTransactionType: 'Win', iUserLeagueId, iMatchLeagueId, iMatchId },
              transaction: t,
              lock: true
            })
          }
          resolve({ isSuccess: true })
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // currently in development mode, not in live.
  async creatorBonusReturn(data) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let { iUserId, _id, iMatchId, eCategory } = data
          iUserId = iUserId.toString()
          const iMatchLeagueId = _id.toString()
          iMatchId = iMatchId.toString()

          await db.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
          }, async (t) => {
            const isProcessed = await PassbookModel.findOne({ where: { iUserId, eTransactionType: 'Creator-Bonus-Return', iMatchLeagueId, iMatchId }, raw: true, transaction: t, lock: true })
            if (!isProcessed) {
              const isCashbackProcessed = await PassbookModel.findOne({ where: { iUserId, eTransactionType: 'Creator-Bonus', iMatchLeagueId, iMatchId }, raw: true, transaction: t, lock: true })
              if (isCashbackProcessed) {
                const userBalance = await UserBalanceModel.findOne({ where: { iUserId }, raw: true, transaction: t, lock: true })
                const { nCurrentWinningBalance, nCurrentDepositBalance, nCurrentTotalBalance, nCurrentBonus, eUserType } = userBalance
                const { nAmount } = isCashbackProcessed

                const lcc = await commonRuleServices.findRule('LCC')
                // const lcc = await CommonRuleModel.findOne({ eRule: 'LCC', eStatus: 'Y' }, { eType: 1 }).lean()
                const lccType = lcc && lcc.eType ? lcc.eType : 'C'

                let sValue = 'WIN'
                if (lccType === 'D') {
                  sValue = 'DEPOSIT'
                } else if (lccType === 'B') {
                  sValue = 'BONUS'
                }

                let updateBalance = {
                  nCurrentWinningBalance: literal(`nCurrentWinningBalance - ${nAmount}`),
                  nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nAmount}`),
                  nTotalWinningAmount: literal(`nTotalWinningAmount - ${nAmount}`)
                }

                let updatePassBook = {
                  iUserId,
                  nAmount: nAmount,
                  eTransactionType: 'Creator-Bonus-Return',
                  eType: 'Dr',
                  eUserType: eUserType,
                  nCash: nAmount,
                  nBonus: 0,
                  iMatchLeagueId,
                  iMatchId,
                  eCategory,
                  nOldWinningBalance: nCurrentWinningBalance,
                  nOldDepositBalance: nCurrentDepositBalance,
                  nOldTotalBalance: nCurrentTotalBalance,
                  nOldBonus: nCurrentBonus,
                  sRemarks: messages[APP_LANG].creator_bonus_cash_win_returned,
                  dActivityDate: new Date()
                }

                if (sValue === 'DEPOSIT') {
                  updateBalance = {
                    nCurrentDepositBalance: literal(`nCurrentDepositBalance - ${nAmount}`),
                    nCurrentTotalBalance: literal(`nCurrentTotalBalance - ${nAmount}`),
                    nTotalDepositAmount: literal(`nTotalDepositAmount - ${nAmount}`),
                    nTotalDepositCount: literal('nTotalDepositCount - 1')
                  }

                  updatePassBook = {
                    iUserId,
                    nAmount: nAmount,
                    eTransactionType: 'Creator-Bonus-Return',
                    eType: 'Dr',
                    eUserType: eUserType,
                    nCash: nAmount,
                    nBonus: 0,
                    iMatchLeagueId,
                    iMatchId,
                    eCategory,
                    nOldWinningBalance: nCurrentWinningBalance,
                    nOldDepositBalance: nCurrentDepositBalance,
                    nOldTotalBalance: nCurrentTotalBalance,
                    nOldBonus: nCurrentBonus,
                    sRemarks: messages[APP_LANG].creator_bonus_cash_deposit_returned,
                    dActivityDate: new Date()
                  }
                } else if (sValue === 'BONUS') {
                  updateBalance = {
                    nCurrentBonus: literal(`nCurrentBonus - ${nAmount}`),
                    nTotalBonusEarned: literal(`nTotalBonusEarned - ${nAmount}`)
                  }

                  updatePassBook = {
                    iUserId,
                    nAmount: nAmount,
                    eTransactionType: 'Creator-Bonus-Return',
                    eType: 'Dr',
                    eUserType: eUserType,
                    nCash: 0,
                    nBonus: nAmount,
                    iMatchLeagueId,
                    iMatchId,
                    eCategory,
                    nOldWinningBalance: nCurrentWinningBalance,
                    nOldDepositBalance: nCurrentDepositBalance,
                    nOldTotalBalance: nCurrentTotalBalance,
                    nOldBonus: nCurrentBonus,
                    sRemarks: messages[APP_LANG].creator_bonus_returned,
                    dActivityDate: new Date()
                  }
                }

                await UserBalanceModel.update(updateBalance, { where: { iUserId }, transaction: t, lock: true })
                await PassbookModel.create(updatePassBook, { transaction: t, lock: true })
                await PassbookModel.update({
                  bCreatorBonusReturn: true
                },
                {
                  where: { iUserId, eTransactionType: 'Creator-Bonus', iMatchLeagueId, iMatchId },
                  transaction: t,
                  lock: true
                })
              }
              return resolve({ isSuccess: true })
            } else {
              return resolve({ isSuccess: true })
            }
          })
          return resolve({ isSuccess: true })
        } catch (error) {
          handleCatchError(error)
          return resolve({ isSuccess: false, error })
        }
      })()
    })
  }

  async checkUserBalance(data) {
    try {
      const { iUserId, nPromoDiscount = 0, matchLeague, remainTeams } = data
      const userBalance = await UserBalanceModel.findOne({ where: { iUserId: iUserId.toString() }, plain: true, raw: true })
      const nJoinPrice = (nPromoDiscount) ? matchLeague.nPrice - nPromoDiscount : matchLeague.nPrice
      let { nCurrentTotalBalance, nCurrentBonus } = userBalance
      const { nBonusUtil } = matchLeague

      let nTotalAmount = 0
      let bValid = true
      remainTeams.forEach(t => {
        let nActualBonus = 0
        if (nBonusUtil && nBonusUtil > 0 && nJoinPrice > 0) {
          const nBonus = (nJoinPrice * nBonusUtil) / 100
          if (nCurrentBonus - nBonus >= 0) {
            nActualBonus = nBonus
            if (nCurrentTotalBalance < nJoinPrice - nBonus) {
              nTotalAmount = nTotalAmount + nJoinPrice - nBonus - nCurrentTotalBalance
              bValid = false
              return
            }
          } else {
            nActualBonus = userBalance.nCurrentBonus
            if (nCurrentTotalBalance < nJoinPrice - nCurrentBonus) {
              nTotalAmount = nTotalAmount + nJoinPrice - nCurrentBonus - nCurrentTotalBalance
              bValid = false
              return
            }
          }
        } else if (nCurrentTotalBalance < nJoinPrice) {
          nTotalAmount = nTotalAmount + nJoinPrice - nCurrentTotalBalance
          bValid = false
          return
        }

        const nPrice = nActualBonus ? nJoinPrice - nActualBonus : nJoinPrice
        nCurrentTotalBalance = nCurrentTotalBalance - nPrice
        nCurrentBonus = nCurrentBonus - nActualBonus
      })
      return { bValid, nTotalAmount }
    } catch (err) {
      handleCatchError(err)
    }
  }
}

module.exports = new UserBalance()
