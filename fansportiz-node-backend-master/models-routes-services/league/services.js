const MatchLeagueModel = require('../matchLeague/model')
const LeagueModel = require('./model')
const LeagueCategoryModel = require('../leagueCategory/model')
const FilterCategoryModel = require('../leagueCategory/filterCategory.model')
const PassbookModel = require('../passbook/model')
const UserTdsModel = require('../userTds/model')
const UserLeagueModel = require('../userLeague/model')
const { ruleType } = require('../../data')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, pick, removenull, getPaginationValues2, convertToDecimal, getIp, checkValidImageType, getBucketName } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
// const s3 = require('../../helper/s3config')
const { Op } = require('sequelize')
const { s3Leagues } = require('../../config/config')
const { createAdminLog } = require('../commonRules/grpc/clientServices')
const bucket = require('../../helper/cloudStorage.services')
class League {
  // To get List of league Name and _id SportsType wise and which has atLeast one prize breakup
  async leagueList(req, res) {
    try {
      const { sportsType } = req.query
      const data = await LeagueModel.find({ eCategory: sportsType.toUpperCase(), eStatus: 'Y', 'aLeaguePrize.nRankFrom': { $gt: 0 } }, { sName: 1 }).lean()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cleague), data })
    } catch (error) {
      catchError('League.leagueList', error, req, res)
    }
  }

  async fullLeagueListV2(req, res) {
    try {
      let { nStart, nLimit, search } = req.query
      nStart = parseInt(nStart) || 0
      nLimit = parseInt(nLimit) || 10
      let query = search ? { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : {}

      query = { ...query, eStatus: 'Y', 'aLeaguePrize.nRankFrom': { $gt: 0 } }

      const results = await LeagueModel.find(query, { sName: 1, eCategory: 1 }).skip(nStart).limit(nLimit).lean()
      const total = await LeagueModel.countDocuments(query)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cleague), data: { total, results } })
    } catch (error) {
      catchError('League.leagueList', error, req, res)
    }
  }

  // To add new league
  async add(req, res) {
    try {
      const { nMin, nMax, eCategory, iFilterCatId, bMultipleEntry, nTeamJoinLimit, iLeagueCatId, nPrice, nBonusUtil, bPoolPrize, bUnlimitedJoin, bCashbackEnabled, nMinCashbackTeam, nCashbackAmount, eCashbackType, nMinTeamCount, sName, bAutoCreate } = req.body
      const { _id: iAdminId } = req.admin

      req.body = pick(req.body, ['sName', 'nTotalWinners', 'nLoyaltyPoint', 'nTeamJoinLimit', 'nMax', 'nMin', 'nPrice', 'nTotalPayout', 'nDeductPercent', 'nBonusUtil', 'sPayoutBreakupDesign', 'bConfirmLeague', 'bMultipleEntry', 'bAutoCreate', 'bPoolPrize', 'nPosition', 'eStatus', 'eCategory', 'nWinnersCount', 'iLeagueCatId', 'iFilterCatId', 'bUnlimitedJoin', 'nMinCashbackTeam', 'nCashbackAmount', 'eCashbackType', 'nMinTeamCount', 'nBotsCount', 'bBotCreate', 'nCopyBotsPerTeam', 'bCashbackEnabled', 'nSameCopyBotTeam'])
      removenull(req.body)

      if (bPoolPrize === false && bUnlimitedJoin === true) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].unlimitedJoin) })
      if (nMin && nMax && parseInt(nMin) > parseInt(nMax)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].cminimumEntry).replace('#', messages[req.userLanguage].cmaximumEntry) })

      // For Auto create Contest, there is not allow unlimited user join feature.
      if (bAutoCreate === true && bUnlimitedJoin === true) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_allowed_with.replace('##', messages[req.userLanguage].autoCreate).replace('#', messages[req.userLanguage].unlimitedJoin) })

      // User can create Minimum team but it can't be greater than maximum size of contest.
      if (nMinTeamCount && nMax && parseInt(nMinTeamCount) >= parseInt(nMax)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].cteam).replace('#', messages[req.userLanguage].cmaximumEntry) })

      // contest whose multiple team join feature not enable, then team join limit can't be the greater than 1.
      if (bMultipleEntry === false && nTeamJoinLimit > 1) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cteamJoinLimit) })

      // To create any contest, there should be proper league category as well proper filter category also.
      const leagueCategory = await LeagueCategoryModel.findById(iLeagueCatId, { sTitle: 1 }).lean()
      if (!leagueCategory) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].leagueCategory) })

      const filterCategory = await FilterCategoryModel.findById(iFilterCatId, { sTitle: 1 }).lean()
      if (!filterCategory) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].filterCategory) })

      // For Free contest, there is not any bonus utilization feature.
      if (Number(nPrice) === 0 && nBonusUtil && Number(nBonusUtil) > 0) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].bonus) })

      // For cashback enable contest, Minimum team for cashback reward and cashback amount and it's type like cash or bonus data must be required.
      if (bCashbackEnabled && nMinCashbackTeam && nCashbackAmount <= 0) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cashbackamount) })
      if (bCashbackEnabled && nMinCashbackTeam && !ruleType.includes(eCashbackType)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cashbacktype) })

      // Given contest named if already exist then we'll throw validation message.
      const leagueExist = await LeagueModel.findOne({ eCategory: eCategory.toUpperCase(), sName }).lean()
      if (leagueExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].leagueName) })

      const data = await LeagueModel.create({ ...req.body, eCategory: eCategory.toUpperCase(), sLeagueCategory: leagueCategory.sTitle, sFilterCategory: filterCategory.sTitle })

      const oNewFields = data
      const logData = { oOldFields: {}, oNewFields, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: null, eKey: 'L' }
      await createAdminLog(logData)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].newLeague), data })
    } catch (error) {
      catchError('League.add', error, req, res)
    }
  }

  // To update leagues
  async update(req, res) {
    try {
      let { nMin, nMax, eCategory, iFilterCatId, bMultipleEntry, nTeamJoinLimit, iLeagueCatId, nPrice, nBonusUtil, bPoolPrize, bUnlimitedJoin, bCashbackEnabled, nMinCashbackTeam, nCashbackAmount, eCashbackType, nMinTeamCount, sName, bAutoCreate, nLoyaltyPoint } = req.body
      const { _id: iAdminId } = req.admin

      req.body = pick(req.body, ['sName', 'nWinnersCount', 'nLoyaltyPoint', 'nTotalWinners', 'bMultipleEntry', 'nTeamJoinLimit', 'nMax', 'nMin', 'nPrice', 'nTotalPayout', 'nDeductPercent', 'nBonusUtil', 'sPayoutBreakupDesign', 'bConfirmLeague', 'bAutoCreate', 'bPoolPrize', 'nPosition', 'eStatus', 'eCategory', 'iLeagueCatId', 'iFilterCatId', 'bUnlimitedJoin', 'nMinCashbackTeam', 'nCashbackAmount', 'eCashbackType', 'nMinTeamCount', 'nBotsCount', 'bBotCreate', 'nCopyBotsPerTeam', 'nSameCopyBotTeam'])

      nBonusUtil = nBonusUtil || 0
      nLoyaltyPoint = nLoyaltyPoint || 0

      if (bPoolPrize === false && bUnlimitedJoin === true) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].unlimitedJoin) })

      if (nMin && nMax && parseInt(nMin) > parseInt(nMax)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].cminimumEntry).replace('#', messages[req.userLanguage].cmaximumEntry) })

      // For Auto create Contest, there is not allow unlimited user join feature.
      if (bAutoCreate === true && bUnlimitedJoin === true) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_allowed_with.replace('##', messages[req.userLanguage].autoCreate).replace('#', messages[req.userLanguage].unlimitedJoin) })

      // User can create Minimum team but it can't be greater than maximum size of contest.
      if (nMinTeamCount && nMax && parseInt(nMinTeamCount) > parseInt(nMax)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].cteam).replace('#', messages[req.userLanguage].cmaximumEntry) })

      // contest whose multiple team join feature not enable, then team join limit can't be the greater than 1 and vice versa.
      if (bMultipleEntry === false && nTeamJoinLimit > 1) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cteamJoinLimit) })
      if (bMultipleEntry === true && nTeamJoinLimit <= 1) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cteamJoinLimit) })

      const oldLeague = await LeagueModel.findById(req.params.id).lean()
      if (!oldLeague) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) })

      // For pool contest, we don't allow for prize breakup to extra reward type.
      if (bPoolPrize === true) {
        const { aLeaguePrize: leaguePrize } = oldLeague

        const totalPayInPercent = leaguePrize.reduce((acc, pb) => (acc + pb.nPrize), 0)
        if (totalPayInPercent > 100) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].pool_prize_breakup_err })

        const checkBreakup = await LeagueModel.countDocuments({ _id: ObjectId(req.params.id), 'aLeaguePrize.eRankType': 'E' })
        if (checkBreakup > 0) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].extra_not_allowed_in_poolprize_league })
      }

      // Given contest named if already exist then we'll throw validation message.
      const leagueExist = await LeagueModel.findOne({ eCategory: eCategory.toUpperCase(), sName, _id: { $ne: req.params.id } }).lean()
      if (leagueExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].leagueName) })

      // To create any contest, there should be proper league category as well proper filter category also.
      const leagueCategory = await LeagueCategoryModel.findById(iLeagueCatId, { sTitle: 1 }).lean()
      if (!leagueCategory && iLeagueCatId) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].leagueCategory) })

      if (leagueCategory) req.body.sLeagueCategory = leagueCategory.sTitle

      const filterCategory = await FilterCategoryModel.findById(iFilterCatId, { sTitle: 1 }).lean()
      if (!filterCategory && iFilterCatId) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].filterCategory) })

      // For Free contest, there is not any bonus utilization feature.
      if (Number(nPrice) === 0 && nBonusUtil && Number(nBonusUtil) > 0) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].bonus) })

      // For cashback enable contest, Minimum team for cashback reward and cashback amount and it's type like cash or bonus data must be required.
      if (bCashbackEnabled && nMinCashbackTeam && nCashbackAmount <= 0) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cashbackamount) })
      if (bCashbackEnabled && nMinCashbackTeam && !ruleType.includes(eCashbackType)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cashbacktype) })

      if (filterCategory) req.body.sFilterCategory = filterCategory.sTitle

      const data = await LeagueModel.findByIdAndUpdate(req.params.id, { ...req.body, eCategory: eCategory.toUpperCase(), bCashbackEnabled, nMinCashbackTeam, nCashbackAmount, nLoyaltyPoint, nBonusUtil, dUpdatedAt: Date.now() }, { new: true, runValidators: true }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) })

      const logData = { oOldFields: oldLeague, oNewFields: data, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: null, eKey: 'L' }
      await createAdminLog(logData)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].cleague), data })
    } catch (error) {
      catchError('League.update', error, req, res)
    }
  }

  // To get all league sportsType wise
  async list(req, res) {
    try {
      const { sportsType, searchField, searchCategory } = req.query

      const { start, limit, sorting, search } = getPaginationValues2(req.query)
      let query = {
        eCategory: sportsType.toUpperCase(),
        sName: { $regex: new RegExp('^.*' + search + '.*', 'i') },
        sLeagueCategory: { $regex: new RegExp('^.*' + searchCategory + '.*', 'i') }
      }
      if (searchField === 'nBonusUtil') {
        query = {
          ...query,
          [`${searchField}`]: { $gt: 0 }
        }
      } else if (['bConfirmLeague', 'bMultipleEntry', 'bAutoCreate', 'bPoolPrize', 'bUnlimitedJoin'].includes(searchField)) {
        query = {
          ...query,
          [`${searchField}`]: true
        }
      }

      const results = await LeagueModel.find(query, {
        sName: 1,
        nMax: 1,
        nMin: 1,
        nPrice: 1,
        nTotalPayout: 1,
        nDeductPercent: 1,
        nBonusUtil: 1,
        sPayoutBreakupDesign: 1,
        bConfirmLeague: 1,
        bMultipleEntry: 1,
        bUnlimitedJoin: 1,
        bAutoCreate: 1,
        bPoolPrize: 1,
        nPosition: 1,
        nTotalWinners: 1,
        eStatus: 1,
        eCategory: 1,
        nLoyaltyPoint: 1,
        bCashbackEnabled: 1,
        nMinCashbackTeam: 1,
        nCashbackAmount: 1,
        eCashbackType: 1,
        iLeagueCatId: 1,
        sLeagueCategory: 1,
        iFilterCatId: 1,
        sFilterCategory: 1,
        nMinTeamCount: 1,
        nBotsCount: 1,
        nCopyBotsPerTeam: 1,
        nSameCopyBotTeam: 1,
        bBotCreate: 1,
        dCreatedAt: 1,
        nWinnersCount: 1
      }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()

      const total = await LeagueModel.countDocuments({ ...query })

      const data = [{ total, results }]
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cleague), data })
    } catch (error) {
      return catchError('League.list', error, req, res)
    }
  }

  // To delete league
  async remove(req, res) {
    try {
      const data = await LeagueModel.findByIdAndDelete(req.params.id).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) })
      const { _id: iAdminId } = req.admin

      const logData = { oOldFields: data, oNewFields: {}, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: null, eKey: 'L' }
      await createAdminLog(logData)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].cleague), data })
    } catch (error) {
      return catchError('League.remove', error, req, res)
    }
  }

  // To get details of single league by _id
  async get(req, res) {
    try {
      const data = await LeagueModel.findById(req.params.id).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cleague), data })
    } catch (error) {
      catchError('League.get', error, req, res)
    }
  }

  // To add PriceBreakUp for single League
  async addPrizeBreakup(req, res) {
    try {
      let { nRankFrom, nRankTo, nPrize, eRankType, sInfo, sImage } = req.body
      req.body = pick(req.body, ['nRankFrom', 'nRankTo', 'nPrize', 'eRankType', 'sInfo', 'sImage'])
      const { _id: iAdminId } = req.admin

      nPrize = Number(nPrize)
      // For Extra reward prize breakup, we required information of extra reward like T-Shirt, Coupon, Etc. And it's prize always be zero.
      if ((eRankType === 'E') && !sInfo) { return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].ssinfo) }) }
      if ((eRankType === 'E') && (parseInt(nPrize) !== 0)) { return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].snprice) }) }

      // Rank from always less than Rank to
      if (nRankFrom && nRankTo && (parseInt(nRankFrom) > parseInt(nRankTo))) { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].crankFrom).replace('#', messages[req.userLanguage].crankTo) }) }

      const league = await LeagueModel.findById(req.params.id).lean()
      if (!league) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) }) }

      // Rank from can't be grater than contest max. size and winner counts of contest vice versa for RankTo also.
      if ((nRankFrom > league.nMax) || (nRankTo > league.nMax)) { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].crankFrom).replace('#', messages[req.userLanguage].snMax) }) }
      if ((nRankFrom > league.nWinnersCount) || (nRankTo > league.nWinnersCount)) { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].crankFrom).replace('#', messages[req.userLanguage].snWinnerCount) }) }

      if ((league.bPoolPrize) && eRankType === 'E') { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].extra_not_allowed_in_poolprize_league }) }

      let { aLeaguePrize: leaguePrize, nTotalPayout, bPoolPrize } = league

      if (bPoolPrize) {
        const totalPayInPercent = leaguePrize.reduce((acc, pb) => (acc + pb.nPrize), 0)
        if (totalPayInPercent + nPrize > 100) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].totalPer).replace('#', messages[req.userLanguage].hundred) })
      } else if (leaguePrize) {
        // if total prize breakup prize in given breakup range is grater than contest payouts then we'll throw validation message accordingly.
        const totalPay = leaguePrize.reduce((acc, pb) => (acc + (Number(pb.nPrize) * ((Number(pb.nRankTo) - Number(pb.nRankFrom)) + 1))), 0)
        if (totalPay + (nPrize * ((nRankTo - nRankFrom) + 1)) > nTotalPayout) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].stotalPay) }) }
      }

      if (leaguePrize.length) {
        // If Prize breakup already exist in contest, then we'll throw validation message accordingly.
        const priceExist = leaguePrize.find((pb) => {
          if ((pb.nRankFrom <= parseInt(nRankFrom)) && (pb.nRankTo >= parseInt(nRankFrom))) return true
          if ((pb.nRankFrom <= parseInt(nRankTo)) && (pb.nRankTo >= parseInt(nRankTo))) return true
        })
        if (priceExist) { return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cpriceBreakup) }) }
      }

      let aLeaguePrize = {}
      if (eRankType === 'E' && sImage) {
        aLeaguePrize = { nRankFrom, nRankTo, nPrize, eRankType, sInfo, sImage }
      } else {
        aLeaguePrize = { nRankFrom, nRankTo, nPrize, eRankType, sInfo }
      }

      if (Array.isArray(leaguePrize)) { leaguePrize.push(aLeaguePrize) } else { leaguePrize = [aLeaguePrize] }

      leaguePrize.sort((a, b) => a.nRankFrom - b.nRankFrom)

      const data = await LeagueModel.findByIdAndUpdate(req.params.id, { aLeaguePrize: leaguePrize, dUpdatedAt: Date.now() }, { new: true, runValidators: true }).lean()

      const logData = { oOldFields: { _id: league._id, sName: league.sName, aLeaguePrize: league.aLeaguePrize }, oNewFields: { _id: data._id, sName: data.sName, aLeaguePrize: data.aLeaguePrize }, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: null, eKey: 'PB' }
      await createAdminLog(logData)

      if (!data) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) }) }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cnewPriceBreakup), data })
    } catch (error) {
      catchError('League.addPrizeBreakup', error, req, res)
    }
  }

  // To update PriceBreakUp for single League
  async updatePrizeBreakup(req, res) {
    try {
      let { nRankFrom, nRankTo, nPrize, eRankType, sInfo, sImage } = req.body
      nPrize = Number(nPrize)
      const { _id: iAdminId } = req.admin

      // For Extra reward prize breakup, we required information of extra reward like T-Shirt, Coupon, Etc. And it's prize always be zero.
      if ((eRankType === 'E') && !sInfo) { return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].ssinfo) }) }
      if ((eRankType === 'E') && (parseInt(nPrize) !== 0)) { return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].snprice) }) }

      // Rank from always less than Rank to
      if (nRankFrom && nRankTo && (parseInt(nRankFrom) > parseInt(nRankTo))) { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].crankFrom).replace('#', messages[req.userLanguage].crankTo) }) }

      const league = await LeagueModel.findById(req.params.id).lean()
      if (!league) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) }) }

      // Rank from can't be grater than contest max. size and winner counts of contest vice versa for RankTo also.
      if ((nRankFrom > league.nMax) || (nRankTo > league.nMax)) { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].crankFrom).replace('#', messages[req.userLanguage].snMax) }) }
      if ((nRankFrom > league.nWinnersCount) || (nRankTo > league.nWinnersCount)) { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].crankFrom).replace('#', messages[req.userLanguage].snWinnerCount) }) }

      if ((league.bPoolPrize) && eRankType === 'E') { return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].extra_not_allowed_in_poolprize_league }) }

      const { aLeaguePrize: leaguePrize, nTotalPayout, bPoolPrize } = league
      const old = leaguePrize.find(({ _id }) => req.params.pid === _id.toString())

      if (bPoolPrize) {
        let totalPayInPercent = leaguePrize.reduce((acc, pb) => (acc + pb.nPrize), 0)
        totalPayInPercent = totalPayInPercent - old.nPrize
        if (totalPayInPercent + nPrize > 100) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].less_then_err.replace('##', messages[req.userLanguage].totalPer).replace('#', messages[req.userLanguage].hundred) })
      } else if (leaguePrize.length) {
        // if total prize breakup prize in given new breakup range after removing already exist breakup range is grater than contest payouts then we'll throw validation message accordingly.
        const totalPay = leaguePrize.reduce((acc, pb) => (acc + (Number(pb.nPrize) * ((Number(pb.nRankTo) - Number(pb.nRankFrom)) + 1))), 0)
        const nOldPrize = old.nPrize * ((old.nRankTo - old.nRankFrom) + 1)
        if (totalPay + (nPrize * ((nRankTo - nRankFrom) + 1)) - nOldPrize > nTotalPayout) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].stotalPay) }) }
      }

      if (leaguePrize.length) {
        // If Prize breakup already exist in contest, then we'll throw validation message accordingly.
        const priceExist = leaguePrize.find((pb) => {
          if ((pb.nRankFrom <= parseInt(nRankFrom)) && (pb.nRankTo >= parseInt(nRankFrom)) && (pb._id.toString() !== req.params.pid.toString())) { return true }
          if ((pb.nRankFrom <= parseInt(nRankTo)) && (pb.nRankTo >= parseInt(nRankTo)) && (pb._id.toString() !== req.params.pid.toString())) { return true }
        })
        if (priceExist) { return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cpriceBreakup) }) }
      }

      let updateObj = {
        'aLeaguePrize.$.nRankFrom': nRankFrom,
        'aLeaguePrize.$.nRankTo': nRankTo,
        'aLeaguePrize.$.nPrize': nPrize,
        'aLeaguePrize.$.eRankType': eRankType,
        'aLeaguePrize.$.sInfo': sInfo
      }
      if (eRankType === 'E' && sImage) {
        updateObj = { ...updateObj, 'aLeaguePrize.$.sImage': sImage }
      } else {
        updateObj = { ...updateObj, 'aLeaguePrize.$.sImage': '' }
      }

      const data = await LeagueModel.findOneAndUpdate({ _id: ObjectId(req.params.id), 'aLeaguePrize._id': ObjectId(req.params.pid) }, updateObj, { new: true, runValidators: true }).lean()
      if (!data) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) }) }

      const logData = { oOldFields: { _id: league._id, sName: league.sName, aLeaguePrize: league.aLeaguePrize }, oNewFields: { _id: data._id, sName: data.sName, aLeaguePrize: data.aLeaguePrize }, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: null, eKey: 'PB' }
      await createAdminLog(logData)

      // if update extra prize to real money then remove old extra prize image
      // old && old.sImage
      if (old && old.sImage && (['R', 'B'].includes(eRankType) || old.sImage !== sImage)) {
        const sBucketName = getBucketName()
        const bucketParams = {
          Bucket: sBucketName,
          Key: old.sImage
        }
        await bucket.deleteObject(bucketParams)
        // await s3.deleteObject(s3Params)
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].cpriceBreakup), data })
    } catch (error) {
      catchError('League.updatePrizeBreakup', error, req, res)
    }
  }

  async removePrizeBreakup(req, res) {
    try {
      const { _id: iAdminId } = req.admin

      const data = await LeagueModel.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $pull: { aLeaguePrize: { _id: ObjectId(req.params.pid) } } }, { new: false, runValidators: true })
      if (!data) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) }) }

      const old = data.aLeaguePrize.find(p => p._id.toString() === req.params.pid)

      // if rank type is Extra then image also remove from s3
      if (old && old.eRankType === 'E' && old.sImage) {
        const sBucketName = getBucketName()
        const bucketParams = {
          Bucket: sBucketName,
          Key: old.sImage
        }
        await bucket.deleteObject(bucketParams)
        // await s3.deleteObject(s3Params)
      }

      let aLeaguePrize = data.aLeaguePrize
      aLeaguePrize = aLeaguePrize.filter(({ _id }) => _id.toString() !== req.params.pid)

      const logData = { oOldFields: { _id: data._id, sName: data.sName, aLeaguePrize: data.aLeaguePrize }, oNewFields: { _id: data._id, sName: data.sName, aLeaguePrize: aLeaguePrize }, sIP: getIp(req), iAdminId: ObjectId(iAdminId), iUserId: null, eKey: 'PB' }
      await createAdminLog(logData)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].cpriceBreakup), data })
    } catch (error) {
      catchError('League.removePrizeBreakup', error, req, res)
    }
  }

  // To get List of PriceBreakUp for single League
  async listPrizeBreakup(req, res) {
    try {
      const data = await LeagueModel.findById(req.params.id, { aLeaguePrize: 1, _id: 0 }).lean()

      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cpriceBreakup), data: data })
    } catch (error) {
      return catchError('League.listPrizeBreakup', error, req, res)
    }
  }

  // To get single PriceBreakUp for single League
  async getPrizeBreakup(req, res) {
    try {
      const data = await LeagueModel.findOne({
        _id: ObjectId(req.params.id),
        'aLeaguePrize._id': ObjectId(req.params.pid)
      }, { aLeaguePrize: { $elemMatch: { _id: ObjectId(req.params.pid) } } }).lean()

      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cpriceBreakup), data })
    } catch (error) {
      catchError('League.getPrizeBreakup', error, req, res)
    }
  }

  // To get signedUrl for PriceBreakUp extra image
  async getSignedUrl(req, res) {
    try {
      req.body = pick(req.body, ['sFileName', 'sContentType'])
      const { sFileName, sContentType } = req.body

      const valid = checkValidImageType(sFileName, sContentType)
      if (!valid) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].image) })

      const data = await bucket.getSignedUrl({ sFileName, sContentType, path: s3Leagues })
      // const data = await s3.signedUrl(sFileName, sContentType, s3Leagues)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      catchError('League.getSignedUrl', error, req, res)
    }
  }

  // To copy league
  async copyLeague(req, res) {
    try {
      const { eCategory } = req.body
      const iLeagueId = req.params.id

      req.body = pick(req.body, ['eCategory'])
      removenull(req.body)

      // Given contest named if doesn't exist then we'll throw validation message.
      const leagueData = await LeagueModel.findOne({ _id: iLeagueId }).lean()
      if (!leagueData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cleague) })

      const leagueObj = { ...leagueData }
      delete leagueObj.aLeaguePrize
      delete leagueObj.dCreatedAt
      delete leagueObj.dUpdatedAt
      delete leagueObj._id
      delete leagueObj.eCategory

      const prizeBreakUp = leagueData.aLeaguePrize.map((p) => {
        return { nRankFrom: p.nRankFrom, nRankTo: p.nRankTo, nPrize: p.nPrize, eRankType: p.eRankType, sInfo: p.sInfo }
      })

      // Collect sports which already have given league or same league name except same sport
      let gameCategoryList = []
      const otherCategories = eCategory.filter(cat => cat !== leagueData.eCategory) // can copy in same sport unlimited time
      const leagueExist = await LeagueModel.find({ eCategory: { $in: otherCategories }, sName: leagueData.sName, _id: { $ne: iLeagueId } }).lean()
      if (leagueExist) gameCategoryList = leagueExist.map((p) => p.eCategory)
      // Iterate requested sports and create league if given sport doesn't have this league except same sport
      const data = []
      const aLeagueInfo = []

      for (const sCategory of eCategory) {
        if (!gameCategoryList.includes(sCategory)) {
          aLeagueInfo.push({
            ...leagueObj, eCategory: sCategory, aLeaguePrize: prizeBreakUp
          })
        }
      }

      const aCreatedLeagues = await LeagueModel.insertMany(aLeagueInfo, { ordered: true })

      aCreatedLeagues.map((e) => {
        data.push({ _id: e._id, eCategory: e.eCategory })
      })

      if (!data.length && eCategory.length === 1) {
        return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cleague) })
      } else if (!data.length) {
        return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].are_already_exist.replace('##', messages[req.userLanguage].cleagues) })
      }

      const leagueName = data.map((i) => i.eCategory).toString()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].league_copy_success.replace('##', leagueName), data })
    } catch (error) {
      catchError('League.copyLeague', error, req, res)
    }
  }

  async leagueAnalytics(req, res) {
    try {
      const { id } = req.params

      const [aMatchLeagues, nMatchLeagueCancelled, nMatchLeagueLive] = await Promise.all([
        MatchLeagueModel.find({ iLeagueId: ObjectId(id) }, { _id: 1, eMatchStatus: 1, bCancelled: 1 }).lean(),
        MatchLeagueModel.countDocuments({ iLeagueId: ObjectId(id), bCancelled: true }),
        MatchLeagueModel.countDocuments({ iLeagueId: ObjectId(id), bCancelled: false, eMatchStatus: 'L' })
      ])
      const matchLeagueTotal = aMatchLeagues.length
      const aLiveAndCompletedMatchLeagues = aMatchLeagues.filter((matchLeague) => {
        return !matchLeague.bCancelled && ['L', 'CMP'].includes(matchLeague.eMatchStatus)
      })
      const { matchLeagueIds, matchLeagueIdsStr } = aLiveAndCompletedMatchLeagues.reduce((acc, matchLeague) => {
        acc.matchLeagueIds.push(matchLeague._id)
        acc.matchLeagueIdsStr.push(matchLeague._id.toString())
        return acc
      }, { matchLeagueIds: [], matchLeagueIdsStr: [] })

      const [aMatchLeaguedata, nJoinedRealUsers, nJoinedTotal, nRealUserWinningCash, nRealUserWinningBonus, nTotalTdsAmount, nRealCashCollection] = await Promise.all([
        MatchLeagueModel.aggregate([
          {
            $match: {
              iLeagueId: ObjectId(id), bCancelled: false
            }
          },
          {
            $group: {
              _id: '$iLeagueId',
              totalFee: {
                $sum: '$nPrice'
              },
              avgFee: {
                $avg: '$nPrice'
              },
              totalBonusUtl: {
                $sum: '$nBonusUtil'
              },
              avgBonusUtl: {
                $avg: '$nBonusUtil'
              }
            }
          }
        ]),
        UserLeagueModel.countDocuments({ iMatchLeagueId: { $in: matchLeagueIds }, eType: 'U' }, { readPreference: 'primary' }),
        UserLeagueModel.countDocuments({ iMatchLeagueId: { $in: matchLeagueIds } }, { readPreference: 'primary' }),
        PassbookModel.sum('nCash', { where: { eTransactionType: 'Win', eUserType: 'U', iMatchLeagueId: { [Op.in]: matchLeagueIdsStr } } }),
        PassbookModel.sum('nBonus', { where: { eTransactionType: 'Win', eUserType: 'U', iMatchLeagueId: { [Op.in]: matchLeagueIdsStr } } }),
        UserTdsModel.sum('nAmount', { where: { eUserType: 'U', iMatchLeagueId: { [Op.in]: matchLeagueIdsStr } } }),
        PassbookModel.sum('nCash', { where: { iMatchLeagueId: { [Op.in]: matchLeagueIdsStr }, eUserType: 'U', eTransactionType: 'Play' } })
      ])

      const profit = convertToDecimal(nRealCashCollection - (nRealUserWinningCash + nRealUserWinningBonus - nTotalTdsAmount))
      const avgProfit = profit ? convertToDecimal(profit / matchLeagueIdsStr.length) : 0
      const nJoinedAvg = nJoinedRealUsers ? convertToDecimal(nJoinedRealUsers / matchLeagueIds.length) : 0
      const liveRatio = nMatchLeagueLive ? convertToDecimal((nMatchLeagueLive * 10) / matchLeagueTotal) : 0
      const cancelledRatio = nMatchLeagueCancelled ? convertToDecimal((nMatchLeagueCancelled * 10) / matchLeagueTotal) : 0

      const result = {
        nTotal: matchLeagueTotal,
        oCancelled: {
          nTotal: nMatchLeagueCancelled,
          sRatio: `${cancelledRatio}/10`
        },
        oLive: {
          nTotal: nMatchLeagueLive,
          sRatio: `${liveRatio}/10`
        },
        oParticipation: {
          nAvg: Math.floor(nJoinedAvg),
          nTotalRealUsers: nJoinedRealUsers,
          nTotal: nJoinedTotal
        },
        oBonusUtilisation: {
          nAvg: aMatchLeaguedata[0]?.avgBonusUtl,
          nTotal: aMatchLeaguedata[0]?.totalBonusUtl
        },
        oProfit: { nAvg: avgProfit, nTotal: profit },
        oEntryFee: {
          nAvg: aMatchLeaguedata[0]?.avgFee,
          nTotal: aMatchLeaguedata[0]?.totalFee
        }
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].leagueAnalytics), data: result })
    } catch (error) {
      catchError('League.leagueAnalytics', error, req, res)
    }
  }
}

module.exports = new League()
