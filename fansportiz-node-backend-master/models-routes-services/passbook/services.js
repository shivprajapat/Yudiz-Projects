const UsersModel = require('../user/model')
const PassbookModel = require('../passbook/model')
const { Op, fn, col } = require('sequelize')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, searchValues, convertToDecimal } = require('../../helper/utilities.services')
const ObjectId = require('mongoose').Types.ObjectId
const UserBalance = require('../userBalance/model')
const MatchModel = require('../match/model')
const { findWithdraw } = require('./grpc/clientServices')
class Passbook {
  async list(req, res) {
    try {
      let data = []
      const query = []
      let { nLimit, nOffset, eType, dStartDate, dEndDate } = req.query

      nLimit = parseInt(nLimit) || 20
      nOffset = parseInt(nOffset) || 0

      if (dStartDate && dEndDate) {
        query.push({ dActivityDate: { [Op.gte]: new Date(Number(dStartDate) * 1000) } })
        query.push({ dActivityDate: { [Op.lte]: new Date(Number(dEndDate) * 1000) } })
      }

      if (eType === 'bonus') {
        query.push({ iUserId: req.user._id.toString() })
        query.push({ nBonus: { [Op.gt]: 0 } })
        query.push({
          eTransactionType: {
            [Op.in]:
            ['Cashback-Return', 'Play', 'Play-Return', 'Refer-Bonus', 'Bonus', 'Bonus-Expire', 'Deposit', 'Cashback-Contest', 'Win']
          }
        })

        data = await PassbookModel.findAll({
          where: {
            [Op.and]: query
          },
          attributes: ['id', 'eType', 'nCash', 'nBonus', 'nAmount', 'eTransactionType', 'sRemarks', 'dActivityDate', 'iMatchId', 'iMatchLeagueId', 'iTransactionId', 'iUserLeagueId', 'iSeriesId', 'iCategoryId'],
          order: [['id', 'desc']],
          offset: nOffset,
          limit: nLimit
        })
      } else if (eType === 'cash') {
        query.push({ iUserId: req.user._id.toString() })
        query.push({ [Op.or]: [{ nCash: { [Op.gt]: 0 } }, { eTransactionType: 'Opening' }] })

        data = await PassbookModel.findAll({
          where: {
            [Op.and]: query
          },
          attributes: ['id', 'eType', 'nCash', 'nBonus', 'nAmount', 'eTransactionType', 'sRemarks', 'dActivityDate', 'iMatchId', 'iMatchLeagueId', 'iTransactionId', 'iUserLeagueId', 'iSeriesId', 'iCategoryId'],
          order: [['id', 'desc']],
          offset: nOffset,
          limit: nLimit
        })
      } else if (eType === 'all') {
        query.push({ [Op.and]: [{ iUserId: req.user._id.toString() }, { eTransactionType: { [Op.ne]: 'Loyalty-Point' } }] })
        data = await PassbookModel.findAll({
          where: { [Op.and]: query },
          attributes: ['id', 'eType', 'nCash', 'nBonus', 'nAmount', 'eTransactionType', 'sRemarks', 'dActivityDate', 'iMatchId', 'iMatchLeagueId', 'iTransactionId', 'iUserLeagueId', 'iSeriesId', 'iCategoryId'],
          order: [['id', 'desc']],
          offset: nOffset,
          limit: nLimit
        })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cpassbook), data })
    } catch (error) {
      catchError('Passbook.list', error, req, res)
    }
  }

  async adminListV2(req, res) {
    try {
      const { start = 0, limit = 10, sort = 'dActivityDate', order, search, searchType = 'DEFAULT', datefrom, dateto, particulars, type, id, isFullResponse, eStatus = '', sportsType = '' } = req.query

      const orderBy = order && order === 'asc' ? 'ASC' : 'DESC'

      const query = []
      if (datefrom && dateto) {
        query.push({ dActivityDate: { [Op.gte]: new Date(datefrom) } })
        query.push({ dActivityDate: { [Op.lte]: new Date(dateto) } })
      }

      if (eStatus && ['R', 'CMP', 'CNCL'].includes(eStatus.toUpperCase())) {
        query.push({ eStatus: eStatus.toUpperCase() })
      }

      if (id) {
        query.push({ id: Number(id) })
      }
      if (type && ['Dr', 'Cr'].includes(type)) {
        query.push({ eType: type })
      }
      if (particulars) {
        query.push({ eTransactionType: particulars })
      }

      if (sportsType) {
        query.push({ eCategory: sportsType })
      }

      let users = []
      if (search) {
        if (searchType === 'PASSBOOK' && isNaN(Number(search))) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { rows: [] } })
        let userQuery = {}

        switch (searchType) {
          case 'NAME':
            userQuery = { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            break
          case 'USERNAME':
            userQuery = { sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            break
          case 'MOBILE':
            userQuery = { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            break
          case 'PASSBOOK':
            userQuery = {}
            break
          default:
            userQuery = searchValues(search)
            break
        }

        if (ObjectId.isValid(search)) {
          users = await UsersModel.findById(search, { sMobNum: 1, sEmail: 1, sUsername: 1 }).lean()
          if (!users) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { rows: [] } })
          users = [users]
        } else {
          users = await UsersModel.find(userQuery, { sMobNum: 1, sEmail: 1, sUsername: 1 }).lean()
        }
        if (users.length === 0) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { rows: [] } })
      }

      const userIds = users.map(user => user._id.toString())

      if (search) {
        if (searchType === 'PASSBOOK') {
          query.push({ id: Number(search) })
        } else {
          if (!isNaN(Number(search))) {
            if (users.length) {
              query.push({ [Op.or]: [{ id: { [Op.like]: search + '%' } }, { iUserId: { [Op.in]: userIds } }] })
            } else {
              query.push({ id: { [Op.or]: [{ [Op.like]: search + '%' }] } })
            }
          } else {
            query.push({ iUserId: { [Op.in]: userIds } })
          }
        }
      }

      if ((!datefrom || !dateto) && [true, 'true'].includes(isFullResponse)) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].date_filter_err })
      }

      if (([true, 'true'].includes(isFullResponse))) query.push({ eUserType: 'U' })
      const paginationFields = [true, 'true'].includes(isFullResponse) ? {} : {
        offset: parseInt(start),
        limit: parseInt(limit)
      }

      const data = await PassbookModel.findAll({
        where: {
          [Op.and]: query
        },
        order: [[sort, orderBy]],
        ...paginationFields,
        attributes: ['id', 'iUserId', 'bIsBonusExpired', 'nAmount', 'nBonus', 'nCash', 'eTransactionType', 'iPreviousId', 'iUserLeagueId', 'iMatchId', 'iMatchLeagueId', 'iUserDepositId', 'iWithdrawId', 'sRemarks', 'sCommonRule', 'eType', 'dActivityDate', 'nNewWinningBalance', 'nNewDepositBalance', 'nNewTotalBalance', 'nNewBonus', 'dProcessedDate', 'nWithdrawFee', 'sPromocode', 'eStatus', 'eUserType', 'iTransactionId', 'nLoyaltyPoint', 'eCategory'],
        raw: true
      })

      const passbookData = await addUserFields(data, users)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { rows: passbookData } })
    } catch (error) {
      catchError('Passbook.listV2', error, req, res)
    }
  }

  async getCountsV2(req, res) {
    try {
      const { search, searchType = 'DEFAULT', datefrom, dateto, particulars, type, id, eStatus = '', sportsType = '' } = req.query

      const query = []
      if (datefrom && dateto) {
        query.push({ dActivityDate: { [Op.gte]: new Date(datefrom) } })
        query.push({ dActivityDate: { [Op.lte]: new Date(dateto) } })
      }

      if (eStatus && ['R', 'CMP', 'CNCL'].includes(eStatus.toUpperCase())) {
        query.push({ eStatus: eStatus.toUpperCase() })
      }
      if (id) {
        query.push({ id: Number(id) })
      }
      if (type && ['Dr', 'Cr'].includes(type)) {
        query.push({ eType: type })
      }
      if (particulars) {
        query.push({ eTransactionType: particulars })
      }
      if (sportsType) {
        query.push({ eCategory: sportsType })
      }

      let users = []

      if (search) {
        if (searchType === 'PASSBOOK' && isNaN(Number(search))) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { count: 0 } })
        let userQuery = {}

        switch (searchType) {
          case 'NAME':
            userQuery = { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            break
          case 'USERNAME':
            userQuery = { sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            break
          case 'MOBILE':
            userQuery = { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            break
          case 'PASSBOOK':
            userQuery = {}
            break
          default:
            userQuery = searchValues(search)
            break
        }

        if (ObjectId.isValid(search)) {
          users = await UsersModel.findById(search, { sMobNum: 1, sEmail: 1, sUsername: 1 }).lean()
          if (!users) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { count: 0 } })
          users = [users]
        } else {
          users = await UsersModel.find(userQuery, { sMobNum: 1, sEmail: 1, sUsername: 1 }).lean()
        }
        if (users.length === 0) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { count: 0 } })
      }

      const userIds = users.map(user => user._id.toString())

      if (search) {
        if (searchType === 'PASSBOOK') {
          query.push({ id: Number(search) })
        } else {
          if (!isNaN(Number(search))) {
            if (users.length) {
              query.push({ [Op.or]: [{ id: { [Op.like]: search + '%' } }, { iUserId: { [Op.in]: userIds } }] })
            } else {
              query.push({ id: { [Op.or]: [{ [Op.like]: search + '%' }] } })
            }
          } else {
            query.push({ iUserId: { [Op.in]: userIds } })
          }
        }
      }

      const count = await PassbookModel.count({
        where: {
          [Op.and]: query
        },
        col: 'id',
        raw: true
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', `${messages[req.userLanguage].ctransactions} ${messages[req.userLanguage].cCounts}`), data: { count } })
    } catch (error) {
      catchError('Passbook.getCountsV2', error, req, res)
    }
  }

  async userDetails(req, res) {
    try {
      const { iUserId } = req.params
      const oData = {}
      // passbook include for difference
      const balance = await UserBalance.findOne({ where: { iUserId }, raw: true })
      if (!balance) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cBalance) })
      oData.nCurrentDepositBalance = balance.nCurrentDepositBalance
      // nActualDepositBalance // for cash only -> statistics
      oData.nCurrentWinningBalance = balance.nCurrentWinningBalance
      // nActualWinningBalance -> statistics
      oData.nCurrentBonus = balance.nCurrentBonus
      // nActualBonus // for bonus only -> statistics

      // passbook include for total
      oData.nTotalBonusEarned = balance.nTotalBonusEarned // for bonus only
      // nBonus -> statistics
      oData.nTotalDepositAmount = balance.nTotalDepositAmount // for cash only
      // nDeposits -> statistics
      oData.nTotalWithdrawAmount = balance.nTotalWithdrawAmount // for withdraw only
      // nWithdraw -> statistics
      oData.nTotalWinningAmount = balance.nTotalWinningAmount // for winnings amount only
      // nTotalWinnings -> statistics

      // FOR total played with cash
      const aTotalPlayedCash = await PassbookModel.findAll({ attributes: [[fn('sum', col('nCash')), 'total']], where: { eTransactionType: 'Play', iUserId }, raw: true })
      oData.nTotalPlayedCash = aTotalPlayedCash.length ? convertToDecimal(!aTotalPlayedCash[0].total ? 0 : aTotalPlayedCash[0].total) : 0
      // nTotalPlayedCash -> statistics

      // FOR total played with bonus
      const aTotalPlayedBonus = await PassbookModel.findAll({ attributes: [[fn('sum', col('nBonus')), 'total']], where: { eTransactionType: 'Play', iUserId, nBonus: { [Op.gt]: 0 } }, raw: true })
      oData.nTotalPlayedBonus = aTotalPlayedBonus.length ? convertToDecimal(!aTotalPlayedBonus[0].total ? 0 : aTotalPlayedBonus[0].total) : 0
      // nTotalPlayedBonus -> statistics

      // FOR total play return with cash
      const aTotalPlayReturnCash = await PassbookModel.findAll({ attributes: [[fn('sum', col('nCash')), 'total']], where: { eTransactionType: 'Play-Return', iUserId }, raw: true })
      oData.nTotalPlayReturnCash = aTotalPlayReturnCash.length ? convertToDecimal(!aTotalPlayReturnCash[0].total ? 0 : aTotalPlayReturnCash[0].total) : 0
      // nTotalPlayReturnCash -> statistics
      const aTotalPlayReturnBonus = await PassbookModel.findAll({ attributes: [[fn('sum', col('nBonus')), 'total']], where: { eTransactionType: 'Play-Return', iUserId, nBonus: { [Op.gt]: 0 } }, raw: true })
      oData.nTotalPlayReturnBonus = aTotalPlayReturnBonus.length ? convertToDecimal(!aTotalPlayReturnBonus[0].total ? 0 : aTotalPlayReturnBonus[0].total) : 0
      // nTotalPlayReturnBonus -> statistics

      const oPendingWithdraw = await findWithdraw({ where: { iUserId, ePaymentStatus: 'P' }, raw: true })
      if (!oPendingWithdraw) {
        oData.nLastPendingWithdraw = 0
        oData.nWinBalanceAtLastPendingWithdraw = 0
      } else {
        const pendingDetails = await PassbookModel.findOne({ where: { iUserId, dCreatedAt: { [Op.lte]: oPendingWithdraw.dCreatedAt } }, order: [['dCreatedAt', 'DESC']], raw: true })
        oData.nLastPendingWithdraw = oPendingWithdraw.nAmount || 0
        oData.nWinBalanceAtLastPendingWithdraw = pendingDetails.nNewWinningBalance || 0
      }
      const aTotalCreatorBonus = await PassbookModel.findAll({ attributes: [[fn('sum', col('nAmount')), 'total']], where: { eTransactionType: 'Creator-Bonus', iUserId }, raw: true })
      oData.nTotalCreatorBonus = aTotalCreatorBonus.length ? convertToDecimal(!aTotalCreatorBonus[0].total ? 0 : aTotalCreatorBonus[0].total) : 0
      const aTotalRegisterBonus = await PassbookModel.findAll({ attributes: [[fn('sum', col('nAmount')), 'total']], where: { eTransactionType: 'Bonus', iUserId }, raw: true })
      oData.nTotalRegisterBonus = aTotalRegisterBonus.length ? convertToDecimal(!aTotalRegisterBonus[0].total ? 0 : aTotalRegisterBonus[0].total) : 0
      const aTotalReferBonus = await PassbookModel.findAll({ attributes: [[fn('sum', col('nAmount')), 'total']], where: { eTransactionType: 'Refer-Bonus', iUserId }, raw: true })
      oData.nTotalReferBonus = aTotalReferBonus.length ? convertToDecimal(!aTotalReferBonus[0].total ? 0 : aTotalReferBonus[0].total) : 0
      const aTotalBonusExpired = await PassbookModel.findAll({ attributes: [[fn('sum', col('nAmount')), 'total']], where: { eTransactionType: 'Bonus-Expire', iUserId }, raw: true })
      oData.nTotalBonusExpired = aTotalBonusExpired.length ? convertToDecimal(!aTotalBonusExpired[0].total ? 0 : aTotalBonusExpired[0].total) : 0
      const aTotalCashbackCash = await PassbookModel.findAll({ attributes: [[fn('sum', col('nCash')), 'total']], where: { eTransactionType: 'Cashback-Contest', iUserId, nCash: { [Op.gt]: 0 } }, raw: true })
      oData.nTotalCashbackCash = aTotalCashbackCash.length ? convertToDecimal(!aTotalCashbackCash[0].total ? 0 : aTotalCashbackCash[0].total) : 0
      // nCashbackCash -> statistics
      const aTotalCashbackBonus = await PassbookModel.findAll({ attributes: [[fn('sum', col('nBonus')), 'total']], where: { eTransactionType: 'Cashback-Contest', iUserId, nBonus: { [Op.gt]: 0 } }, raw: true })
      oData.nTotalCashbackBonus = aTotalCashbackBonus.length ? convertToDecimal(!aTotalCashbackBonus[0].total ? 0 : aTotalCashbackBonus[0].total) : 0
      // nCashbackBonus -> statistics

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cpassbook), data: oData })
    } catch (error) {
      catchError('Passbook.userDetails', error, req, res)
    }
  }

  async matchLeagueWiseList(req, res) {
    try {
      const { start = 0, limit = 10, sort = 'dActivityDate', order, search, searchType = 'DEFAULT', datefrom, dateto, particulars, type, id, isFullResponse, eStatus = '' } = req.query

      const orderBy = order && order === 'asc' ? 'ASC' : 'DESC'

      const query = []
      if (datefrom && dateto) {
        query.push({ dActivityDate: { [Op.gte]: new Date(datefrom) } })
        query.push({ dActivityDate: { [Op.lte]: new Date(dateto) } })
      }

      if (eStatus && ['R', 'CMP', 'CNCL'].includes(eStatus.toUpperCase())) {
        query.push({ eStatus: eStatus.toUpperCase() })
      }

      if (id) {
        query.push({ id: Number(id) })
      }
      if (type && ['Dr', 'Cr'].includes(type)) {
        query.push({ eType: type })
      }
      if (particulars) {
        query.push({ eTransactionType: particulars })
      }

      let users = []

      if (search) {
        if (searchType === 'PASSBOOK' && isNaN(Number(search))) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { rows: [] } })
        const userQuery = searchValues(search)

        if (ObjectId.isValid(search)) {
          users = await UsersModel.findById(search, { sMobNum: 1, sEmail: 1, sUsername: 1 }).lean()
          if (!users) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { rows: [] } })
          users = [users]
        } else {
          users = await UsersModel.find(userQuery, { sMobNum: 1, sEmail: 1, sUsername: 1 }).lean()
        }
        if (users.length === 0) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { rows: [] } })
      }

      const userIds = users.map(user => user._id.toString())

      if (search) {
        if (searchType === 'PASSBOOK') {
          query.push({ id: Number(search) })
        } else {
          if (!isNaN(Number(search))) {
            if (users.length) {
              query.push({ [Op.or]: [{ id: { [Op.like]: search + '%' } }, { iUserId: { [Op.in]: userIds } }] })
            } else {
              query.push({ id: { [Op.or]: [{ [Op.like]: search + '%' }] } })
            }
          } else {
            query.push({ iUserId: { [Op.in]: userIds } })
          }
        }
      }

      if ((!datefrom || !dateto) && [true, 'true'].includes(isFullResponse)) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].date_filter_err })
      }

      const paginationFields = [true, 'true'].includes(isFullResponse) ? {} : {
        offset: parseInt(start),
        limit: parseInt(limit)
      }

      const data = await PassbookModel.findAll({
        where: {
          iMatchLeagueId: req.params.id.toString(),
          [Op.and]: query
        },
        order: [[sort, orderBy]],
        ...paginationFields,
        attributes: ['id', 'iUserId', 'bIsBonusExpired', 'nAmount', 'nBonus', 'nCash', 'eTransactionType', 'iPreviousId', 'iUserLeagueId', 'iMatchId', 'iMatchLeagueId', 'iUserDepositId', 'iWithdrawId', 'sRemarks', 'sCommonRule', 'eType', 'dActivityDate', 'nNewWinningBalance', 'nNewDepositBalance', 'nNewTotalBalance', 'nNewBonus', 'dProcessedDate', 'nWithdrawFee', 'sPromocode', 'eStatus', 'eUserType', 'iTransactionId', 'nLoyaltyPoint'],
        raw: true
      })

      const passbookData = await addUserFields(data, users)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cpassbook), data: passbookData })
    } catch (error) {
      catchError('Passbook.matchLeagueWiseList', error, req, res)
    }
  }

  async matchLeagueWiseCount(req, res) {
    try {
      const { search, searchType = 'DEFAULT', datefrom, dateto, particulars, type, id, eStatus = '' } = req.query

      const query = []
      if (datefrom && dateto) {
        query.push({ dActivityDate: { [Op.gte]: new Date(datefrom) } })
        query.push({ dActivityDate: { [Op.lte]: new Date(dateto) } })
      }

      if (eStatus && ['R', 'CMP', 'CNCL'].includes(eStatus.toUpperCase())) {
        query.push({ eStatus: eStatus.toUpperCase() })
      }
      if (id) {
        query.push({ id: Number(id) })
      }
      if (type && ['Dr', 'Cr'].includes(type)) {
        query.push({ eType: type })
      }
      if (particulars) {
        query.push({ eTransactionType: particulars })
      }

      let users = []

      if (search) {
        if (searchType === 'PASSBOOK' && isNaN(Number(search))) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { count: 0 } })
        let userQuery = {}

        switch (searchType) {
          case 'NAME':
            userQuery = { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            break
          case 'USERNAME':
            userQuery = { sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            break
          case 'MOBILE':
            userQuery = { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            break
          case 'PASSBOOK':
            userQuery = {}
            break
          default:
            userQuery = searchValues(search)
        }

        if (ObjectId.isValid(search)) {
          users = await UsersModel.findById(search, { sMobNum: 1, sEmail: 1, sUsername: 1 }).lean()
          if (!users) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { count: 0 } })
          users = [users]
        } else {
          users = await UsersModel.find(userQuery, { sMobNum: 1, sEmail: 1, sUsername: 1 }).lean()
        }
        if (users.length === 0) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].ctransactions), data: { count: 0 } })
      }

      const userIds = users.map(user => user._id.toString())

      if (search) {
        if (searchType === 'PASSBOOK') {
          query.push({ id: Number(search) })
        } else {
          if (!isNaN(Number(search))) {
            if (users.length) {
              query.push({ [Op.or]: [{ id: { [Op.like]: search + '%' } }, { iUserId: { [Op.in]: userIds } }] })
            } else {
              query.push({ id: { [Op.or]: [{ [Op.like]: search + '%' }] } })
            }
          } else {
            query.push({ iUserId: { [Op.in]: userIds } })
          }
        }
      }

      const count = await PassbookModel.count({
        where: {
          iMatchLeagueId: req.params.id.toString(),
          [Op.and]: query
        },
        raw: true,
        col: 'id'
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', `${messages[req.userLanguage].ctransactions} ${messages[req.userLanguage].cCounts}`), data: { count } })
    } catch (error) {
      catchError('Passbook.matchLeagueWiseCount', error, req, res)
    }
  }
}

module.exports = new Passbook()
async function addUserFields(passbook, users = []) {
  let data
  const oUser = {}
  const oMatch = {}

  data = users
  const matchIds = passbook.map((p) => ObjectId(p.iMatchId))
  const aMatchIds = []
  const passbookIds = passbook.map((p) => ObjectId(p.iUserId))
  matchIds.forEach((id, i) => matchIds[i] && aMatchIds.push(id))
  const [usersData, matchesData] = await Promise.all([
    UsersModel.find({ _id: { $in: passbookIds } }, { sMobNum: 1, sEmail: 1, sUsername: 1 }).lean(),
    MatchModel.find({ _id: { $in: aMatchIds } }, { sName: 1, dStartDate: 1 }).lean()
  ])

  data = Array.isArray(usersData) ? usersData : []
  if (data.length) data.forEach((usr, i) => { oUser[usr._id.toString()] = i })

  const matchData = Array.isArray(matchesData) ? matchesData : []
  if (matchData.length) matchesData.forEach((match, i) => { oMatch[match._id.toString()] = i })

  return passbook.map(p => {
    // const user = data.find(u => u._id.toString() === p.iUserId.toString())
    const user = (typeof oUser[p.iUserId.toString()] === 'number') ? { ...data[oUser[p.iUserId.toString()]] } : {}
    let sMatchName = ''
    let dMatchStartDate = ''
    if (p.iMatchId && matchData && matchData.length) {
      // const match = matchData.find(u => u._id.toString() === p.iMatchId.toString())
      const match = (typeof oMatch[p.iMatchId.toString()] === 'number') ? { ...matchData[oMatch[p.iMatchId.toString()]] } : {}
      if (match && match.sName) sMatchName = match.sName
      if (match && match.dStartDate) dMatchStartDate = match.dStartDate
    }
    return { ...p, ...user, _id: undefined, sMatchName, dMatchStartDate }
  })
}
