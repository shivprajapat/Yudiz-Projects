/* eslint-disable max-params */
const MatchLeagueModel = require('./model')
const LeagueModel = require('../league/model')
const PromocodeStatisticsModel = require('../promocode/statistics/model')
const MatchModel = require('../match/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, getPaginationValues, getPaginationValues2, handleCatchError, getIp, convertToDecimal } = require('../../helper/utilities.services')
const getUpdatedPrizeBreakupData = require('../matchLeague/common')
const mongoose = require('mongoose')
const userBalanceServices = require('../userBalance/services')
const ObjectId = mongoose.Types.ObjectId
const UserLeagueModel = require('../userLeague/model')
const { queuePush } = require('../../helper/redis')
const { fn, col } = require('sequelize')
const MyMatchesModel = require('../myMatches/model')
const { CACHE_1 } = require('../../config/config')
const { GamesDBConnect } = require('../../database/mongoose')
const BotLogModel = require('../botLogs/model')
const PassbookModel = require('../passbook/model')
const LeagueCategoryModel = require('../leagueCategory/model')
const UserTdsModel = require('../userTds/model')
const PromocodeModel = require('../promocode/model')
const { createAdminLog } = require('../commonRules/grpc/clientServices')

class MatchLeague {
  async addV2(req, res) {
    try {
      const { iMatchId, aLeagueId } = req.body

      const match = await MatchModel.findById(iMatchId).lean()
      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      const { eCategory, eStatus } = match

      const aLeagueIds = aLeagueId.map(id => ObjectId(id))
      const aLeagues = await LeagueModel.find({ _id: { $in: aLeagueIds }, eCategory, eStatus: 'Y', 'aLeaguePrize.nRankFrom': { $gt: 0 } }, { __v: 0, dUpdatedAt: 0, dCreatedAt: 0 }).lean()
      if (!aLeagues.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cleagues) })

      const aMatchLeagueData = aLeagues.map(league => { return { ...league, iMatchId, iLeagueId: league._id, eCategory, eMatchStatus: eStatus, _id: undefined } })

      await MatchLeagueModel.create(aMatchLeagueData)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', `${aMatchLeagueData.length} ${messages[req.userLanguage].cnewMatchLeague}`) })
    } catch (error) {
      catchError('MatchLeague.addV2', error, req, res)
    }
  }

  // To get LeagueId and MatchId
  async get(req, res) {
    try {
      const data = await MatchLeagueModel.find({ iMatchId: ObjectId(req.params.id) }, { iLeagueId: 1, iMatchId: 1 }).lean()
      if (!data.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data })
    } catch (error) {
      catchError('MatchLeague.get', error, req, res)
    }
  }

  // Get details of league
  async getSingleLeague(req, res) {
    try {
      const data = await MatchLeagueModel.findById(req.params.id).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data })
    } catch (error) {
      catchError('MatchLeague.getSingleLeague', error, req, res)
    }
  }

  async getUpcomingLeague(req, res) {
    try {
      const data = await MatchLeagueModel.find(
        {
          iMatchId: ObjectId(req.params.id),
          bPrivateLeague: false,
          bCancelled: false,
          bPrizeDone: false,
          $or: [
            { $expr: { $lt: ['$nJoined', '$nMax'] } },
            { bUnlimitedJoin: true }
          ]
        }, { sName: 1, _id: 1 }).lean()
      if (!data.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data })
    } catch (error) {
      catchError('MatchLeague.getUpcomingLeague', error, req, res)
    }
  }

  async getFinalLeagueCount(req, res) {
    try {
      const { eStatus } = req.query

      let data = {}
      const LeagueData = await MatchLeagueModel.find({
        iMatchId: ObjectId(req.params.id),
        bCancelled: false
      }, { _id: 1 }).lean()

      const leagueId = LeagueData.map(({ _id }) => _id)
      data.nLeagueCount = LeagueData.length

      data.nJoinedUsers = await UserLeagueModel.countDocuments({
        iMatchId: ObjectId(req.params.id),
        iMatchLeagueId: { $in: leagueId },
        bCancelled: false
      }, { readPreference: 'primary' })

      if (['U', 'L', 'I', 'CMP'].includes(eStatus)) {
        data.nPrivateLeagueCount = await MatchLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), bPrivateLeague: true, bCancelled: false })
        data.nPublicLeagueCount = await MatchLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), bPrivateLeague: false, bCancelled: false })
      }
      if (['CMP', 'I', 'L'].includes(eStatus)) {
        data.nCancelledPrivateLeagueCount = await MatchLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), bPrivateLeague: true, bCancelled: true })
        data.nCancelledPublicLeagueCount = await MatchLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), bPrivateLeague: false, bCancelled: true })
      }
      if (['CMP', 'I'].includes(eStatus)) {
        const [nTotalPlayReturnUsers, nTotalWinner, nPointCalculated, nRankCalculated, nPrizeCalculated, nWinDistributed] = await Promise.all([
          PassbookModel.count({ where: { eTransactionType: 'Play-Return', iMatchId: req.params.id }, col: 'id' }),
          PassbookModel.count({ where: { eTransactionType: 'Win', iMatchId: req.params.id }, col: 'id' }),
          UserLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), iMatchLeagueId: { $in: leagueId }, bCancelled: false, bPointCalculated: true }),
          UserLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), iMatchLeagueId: { $in: leagueId }, bCancelled: false, bRankCalculated: true }),
          MatchLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), bPrizeDone: true }),
          MatchLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), bWinningDone: true })
        ])
        data = { ...data, nTotalPlayReturnUsers, nTotalWinner, nPointCalculated, nRankCalculated, nPrizeCalculated, nWinDistributed }
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data })
    } catch (error) {
      catchError('MatchLeague.getFinalLeagueCount', error, req, res)
    }
  }

  async cashbackDetailsV2(req, res) {
    try {
      const { iUserId, iMatchId } = req.query
      let { start, limit } = getPaginationValues(req.query)
      start = parseInt(start)
      limit = parseInt(limit)

      const exist = await MatchLeagueModel.findById(req.params.id).lean()
      if (!exist) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })

      const query = {
        aMatchLeagueCashback: {
          $elemMatch: {
            iMatchLeagueId: ObjectId(req.params.id)
          }
        }
      }

      const projection = {
        aMatchLeagueCashback: {
          $elemMatch: {
            iMatchLeagueId: ObjectId(req.params.id)
          }
        },
        iUserId: 1
      }

      if (iUserId) query.iUserId = ObjectId(iUserId)
      if (iMatchId) query.iMatchId = ObjectId(iMatchId)

      const total = await MyMatchesModel.countDocuments(query)
      const matchMatchData = await MyMatchesModel.find(query, projection).populate('iUserId', ['_id', 'sUsername', 'sName', 'eType']).skip(start).limit(limit).lean()
      const data = { total, data: matchMatchData }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data })
    } catch (error) {
      catchError('MatchLeague.cashbackDetails', error, req, res)
    }
  }

  async checkFairPlayDetails(req, res) {
    try {
      const { sType } = req.query
      let data
      if (sType === 'MATCH_LEAGUE') {
        data = await MatchLeagueModel.findById(req.params.id, { _id: 1, sName: 1, nTotalPayout: 1, nPrice: 1, nJoined: 1, sFairPlay: 1 }).lean()
        if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })
        await queuePush('FairPlay', data)
      } else if (sType === 'MATCH') {
        data = await MatchModel.findById(req.params.id).lean()
        if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })
        if (!['L', 'CMP', 'I'].includes(data.eStatus)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].match_not_started })
        const matchLeagues = await MatchLeagueModel.find({ iMatchId: ObjectId(data._id), bCancelled: false }, { _id: 1, sName: 1, nTotalPayout: 1, nPrice: 1, nJoined: 1, sFairPlay: 1 }).lean()
        matchLeagues.map((matchLeague) => queuePush('FairPlay', matchLeague))
      } else {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].went_wrong_with.replace('##', messages[req.userLanguage].stype) })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].processFairPlay) })
    } catch (error) {
      catchError('MatchLeague.checkFairPlayDetails', error, req, res)
    }
  }

  // To get List of Match league (SportsType wise) with pagination, sorting and searching
  async list(req, res) {
    try {
      const { leagueType, _id, isFullResponse } = req.query
      const { start, limit, sorting, search } = getPaginationValues2(req.query)

      let query = search ? { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : {}

      query = {
        ...query,
        iMatchId: ObjectId(req.params.id)
      }
      if (leagueType) {
        query.bPrivateLeague = leagueType === 'PRIVATE' ? true : leagueType === 'PUBLIC' ? false : undefined
      }
      if (_id) {
        query._id = ObjectId(_id)
      }

      let results
      if ([true, 'true'].includes(isFullResponse)) {
        results = await MatchLeagueModel.find(query, {
          nJoined: 1,
          iMatchId: 1,
          iLeagueId: 1,
          sLeagueName: 1,
          iUserId: 1,
          sName: 1,
          sShareLink: 1,
          sShareCode: 1,
          aLeaguePrize: 1,
          nMax: 1,
          nMin: 1,
          nPrice: 1,
          nTotalPayout: 1,
          nDeductPercent: 1,
          nBonusUtil: 1,
          sPayoutBreakupDesign: 1,
          bConfirmLeague: 1,
          bMultipleEntry: 1,
          bAutoCreate: 1,
          bCancelled: 1,
          bCopyLeague: 1,
          nLeaguePrice: 1,
          bPrizeDone: 1,
          bWinningDone: 1,
          bPrivateLeague: 1,
          sLeagueCat: 1,
          nLoyaltyPoint: 1,
          bCashbackEnabled: 1,
          nMinCashbackTeam: 1,
          nCashbackAmount: 1,
          eCashbackType: 1,
          sFairPlay: 1,
          bPoolPrize: 1,
          bUnlimitedJoin: 1,
          nPosition: 1,
          nMinTeamCount: 1,
          nBotsCount: 1,
          nCopyBotsPerTeam: 1,
          bBotCreate: 1,
          nAdminCommission: 1,
          nCreatorCommission: 1,
          eCategory: 1,
          dCreatedAt: 1,
          nSameCopyBotTeam: 1,
          nWinnersCount: 1
        }).sort(sorting).populate('iLeagueCatId', '-_id sColorCode').lean()
      } else {
        results = await MatchLeagueModel.find(query, {
          nJoined: 1,
          iMatchId: 1,
          iLeagueId: 1,
          sLeagueName: 1,
          iUserId: 1,
          sName: 1,
          sShareLink: 1,
          sShareCode: 1,
          aLeaguePrize: 1,
          nMax: 1,
          nMin: 1,
          nPrice: 1,
          nTotalPayout: 1,
          nDeductPercent: 1,
          nBonusUtil: 1,
          sPayoutBreakupDesign: 1,
          bConfirmLeague: 1,
          bMultipleEntry: 1,
          bAutoCreate: 1,
          bCancelled: 1,
          bCopyLeague: 1,
          nLeaguePrice: 1,
          bPrizeDone: 1,
          bWinningDone: 1,
          bPrivateLeague: 1,
          sLeagueCat: 1,
          nLoyaltyPoint: 1,
          bCashbackEnabled: 1,
          nMinCashbackTeam: 1,
          nCashbackAmount: 1,
          eCashbackType: 1,
          sFairPlay: 1,
          bPoolPrize: 1,
          bUnlimitedJoin: 1,
          nPosition: 1,
          nMinTeamCount: 1,
          nBotsCount: 1,
          nCopyBotsPerTeam: 1,
          bBotCreate: 1,
          nAdminCommission: 1,
          nCreatorCommission: 1,
          eCategory: 1,
          dCreatedAt: 1,
          nSameCopyBotTeam: 1,
          nWinnersCount: 1
        }).sort(sorting).skip(Number(start)).limit(Number(limit)).populate('iLeagueCatId', '-_id sColorCode').lean()
      }

      const total = await MatchLeagueModel.countDocuments({ ...query })

      const aLeagueIds = results.map((league) => ObjectId(league.iLeagueId))
      const promoData = await PromocodeModel.find({ aLeagues: { $in: aLeagueIds }, aMatches: req.params.id, eType: 'MATCH' }, { aLeagues: 1, _id: 0 }).lean()
      const promoLeaguesData = promoData && promoData.length ? promoData.map(({ aLeagues }) => aLeagues).flat() : []

      results = results.map((league) => {
        if (league.iLeagueId) {
          const aPromo = promoLeaguesData.filter((leagueId) => league.iLeagueId.toString() === leagueId.toString())
          return { ...league, nPromoCount: aPromo.length }
        }
        return { ...league }
      })

      const data = [{ total, results }]

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data })
    } catch (error) {
      return catchError('MatchLeague.list', error, req, res)
    }
  }

  // To get Match league report (SportsType wise)
  async leagueReport(req, res) {
    try {
      const query = {
        iMatchId: ObjectId(req.params.id)
      }
      const requiredFields = {
        nJoined: 1,
        iMatchId: 1,
        sLeagueName: 1,
        iUserId: 1,
        sName: 1,
        sShareLink: 1,
        sShareCode: 1,
        aLeaguePrize: 1,
        nMax: 1,
        nMin: 1,
        nPrice: 1,
        nTotalPayout: 1,
        nDeductPercent: 1,
        nBonusUtil: 1,
        sPayoutBreakupDesign: 1,
        bConfirmLeague: 1,
        bMultipleEntry: 1,
        bAutoCreate: 1,
        bCancelled: 1,
        bCopyLeague: 1,
        nLeaguePrice: 1,
        bPrizeDone: 1,
        bWinningDone: 1,
        bPrivateLeague: 1,
        sLeagueCat: 1,
        nLoyaltyPoint: 1,
        bCashbackEnabled: 1,
        nMinCashbackTeam: 1,
        nCashbackAmount: 1,
        eCashbackType: 1,
        sFairPlay: 1,
        bPoolPrize: 1,
        bUnlimitedJoin: 1,
        nPosition: 1,
        nMinTeamCount: 1,
        nBotsCount: 1,
        nCopyBotsPerTeam: 1,
        nSameCopyBotTeam: 1,
        bBotCreate: 1,
        nAdminCommission: 1,
        nCreatorCommission: 1,
        eCategory: 1,
        dCreatedAt: 1,
        nWinnersCount: 1
      }
      const results = await MatchLeagueModel.find(query, requiredFields).lean()

      const aResult = []
      for (const d of results) {
        // actual user joined

        let query = { iMatchLeagueId: d._id, bCancelled: false, eType: 'U' }
        if (d.bCancelled) query = { iMatchLeagueId: d._id, eType: 'U' }

        const [nJoinedRealUsers, aRealUserWin, PromoDiscount, aTotal, aTotalCashback, nTotalTdsAmount] = await Promise.all([
          UserLeagueModel.countDocuments(query, { readPreference: 'primary' }),
          PassbookModel.findAll({ attributes: [['eUserType', 'eType'], [fn('sum', col('nCash')), 'nCash'], [fn('sum', col('nBonus')), 'nBonus']], group: 'eUserType', where: { eTransactionType: 'Win', iMatchLeagueId: d._id.toString() }, raw: true }),
          PromocodeStatisticsModel.findOne({ iMatchLeagueId: d._id }, { nAmount: 1 }).lean(),
          PassbookModel.findAll({ attributes: ['eUserType', [fn('sum', col('nCash')), 'nCash'], [fn('sum', col('nBonus')), 'nBonus']], group: 'eUserType', where: { eTransactionType: 'Play', iMatchLeagueId: d._id.toString() }, raw: true }),
          PassbookModel.findAll({ attributes: [[fn('sum', col('nCash')), 'nCash'], [fn('sum', col('nBonus')), 'nBonus']], where: { iMatchLeagueId: d._id.toString(), eTransactionType: 'Cashback-Contest' }, raw: true }),
          UserTdsModel.sum('nAmount', { where: { iMatchLeagueId: d._id.toString() } })
        ])
        let [nRealUserWinningCash, nBotWinningCash, nRealUserWinningBonus, nBotWinningBonus, nRealCashCollection, nBotUsersMoney, nTotalBonusUsed, nBotUsersBonus, nTotalCashbackBonus, nTotalCashbackCash, nTotalPromoDiscount] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if (aRealUserWin.length) {
          aRealUserWin.find((data) => {
            if (data.eType === 'U') {
              nRealUserWinningCash = data.nCash
              nRealUserWinningBonus = data.nBonus
            } else {
              nBotWinningCash = data.nCash
              nBotWinningBonus = data.nBonus
            }
          })
        }
        if (aTotal.length) {
          aTotal.find((data) => {
            if (data.eUserType === 'U') {
              nTotalBonusUsed = data.nBonus
            } else {
              nBotUsersMoney = data.nCash
              nBotUsersBonus = data.nBonus
            }
            nRealCashCollection = nRealCashCollection + data.nCash
          })
        }
        if (aTotalCashback.length) {
          nTotalCashbackBonus = aTotalCashback[0].nBonus
          nTotalCashbackCash = aTotalCashback[0].nCash
        }

        if (PromoDiscount) {
          nTotalPromoDiscount = await PromocodeStatisticsModel.countDocuments({ iMatchLeagueId: d._id })
          nTotalPromoDiscount *= PromoDiscount.nAmount
        }
        // total collection = (actual + bot) user winning (cash + bonus) provided

        aResult.push({
          ...d,
          nRealUserWinningCash: nRealUserWinningCash ? convertToDecimal(nRealUserWinningCash, 2) : 0,
          nBotWinningCash: nBotWinningCash ? convertToDecimal(nBotWinningCash, 2) : 0,
          nRealUserWinningBonus: nRealUserWinningBonus ? convertToDecimal(nRealUserWinningBonus, 2) : 0,
          nBotWinningBonus: nBotWinningBonus ? convertToDecimal(nBotWinningBonus, 2) : 0,
          nJoinedRealUsers,
          nTotalPromoDiscount: convertToDecimal(nTotalPromoDiscount, 2) || 0,
          nRealCashCollection: convertToDecimal(nRealCashCollection, 2) || 0,
          nBotUsersMoney: convertToDecimal(nBotUsersMoney, 2) || 0,
          nTotalBonusUsed: convertToDecimal(nTotalBonusUsed, 2) || 0,
          nTotalCashbackBonus: convertToDecimal(nTotalCashbackBonus, 2) || 0,
          nTotalCashbackCash: convertToDecimal(nTotalCashbackCash, 2) || 0,
          nTotalTdsAmount: convertToDecimal(nTotalTdsAmount, 2) || 0,
          nBotUsersBonus
        })
      }
      const data = [{ results: aResult }]

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data })
    } catch (error) {
      return catchError('MatchLeague.list', error, req, res)
    }
  }

  // Get contest list for match
  async upComingLeagueListV2(req, res) {
    try {
      const query = {
        iMatchId: ObjectId(req.params.id),
        bPrivateLeague: false,
        bCancelled: false,
        bPrizeDone: false,
        $or: [
          { $expr: { $lt: ['$nJoined', '$nMax'] } },
          { bUnlimitedJoin: true }
        ]
      }

      const hiddenLeague = await LeagueCategoryModel.findOne({ sKey: 'hiddenLeague' }, { _id: 1 }).lean().cache(CACHE_1, 'hiddenLeague')
      if (hiddenLeague) query.iLeagueCatId = { $ne: ObjectId(hiddenLeague._id) }

      const data = await MatchLeagueModel.find(query,
        { nAutoFillSpots: 0, sShareCode: 0, iUserId: 0, sLeagueCategory: 0, iFilterCatId: 0, nBotsCount: 0, nCopyBotsPerTeam: 0, nSameCopyBotTeam: 0, bBotCreate: 0, bCopyBotInit: 0 }).populate('oLeagueCategory').lean()

      const matchLeagueData = data.map(l => ({ ...l, oLeagueCategory: l.oLeagueCategory[0] }))

      const updatedData = await getUpdatedPrizeBreakupData(matchLeagueData)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cupcomingLeague), data: updatedData })
    } catch (error) {
      return catchError('MatchLeague.upComingLeagueListV2', error, req, res)
    }
  }

  // To get details of matchLeague
  async leagueInfo(req, res) {
    try {
      const data = await MatchLeagueModel.findById(req.params.id, { nAutoFillSpots: 0, sLeagueCategory: 0, iFilterCatId: 0, bBotCreate: 0, bCopyBotInit: 0, nCopyBotsPerTeam: 0, nSameCopyBotTeam: 0 }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })
      const hiddenLeague = await LeagueCategoryModel.findOne({ sKey: 'hiddenLeague' }, { _id: 1 }).lean().cache(CACHE_1, 'hiddenLeague')
      const hiddenLeagueId = hiddenLeague ? hiddenLeague._id.toString() : ''
      if (data.iLeagueCatId && data.iLeagueCatId.toString() === hiddenLeagueId) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })
      const [updatedData] = await getUpdatedPrizeBreakupData([data])

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data: updatedData })
    } catch (error) {
      catchError('MatchLeague.leagueInfo', error, req, res)
    }
  }

  // cancel contest
  async cancelMatchLeague(req, res) {
    try {
      const { _id: iAdminId } = req.admin

      const league = await MatchLeagueModel.findById({ _id: req.params.id })
      if (!league) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })

      if (league.bCancelled === true) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].league_already_cancel.replace('##', messages[req.userLanguage].cmatchLeague) })
      if (league.bPrizeDone === true) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].league_prize_done.replace(messages[req.userLanguage].cmatchLeague) })

      league.bPlayReturnProcess = true

      const matchLeague = await league.save()

      const type = 'MATCHLEAGUE'
      this.processPlayReturn(matchLeague, type, ObjectId(iAdminId), getIp(req), 'ADMIN')

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cancel_success.replace('##', messages[req.userLanguage].cmatchLeague) })
    } catch (error) {
      catchError('MatchLeague.cancelMatchLeague', error, req, res)
    }
  }

  async processPlayReturn(matchLeague, type, iAdminId = null, sIP = '', sOperationBy = 'CRON', nJoined, uniqueUserJoinCount) {
    try {
      let userLeagues = []

      const ulProjection = { _id: 1, iUserId: 1, sUserName: 1, sMatchName: 1, eType: 1 }
      if (type === 'MATCHLEAGUE' || type === 'MANUALLY') {
        userLeagues = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(matchLeague._id) }, ulProjection).lean()
      } else if (type === 'OVERFLOW') {
        userLeagues = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(matchLeague._id) }, ulProjection).sort({ dCreatedAt: -1 }).limit(Number(matchLeague.nJoined - matchLeague.nMax)).lean()
      }

      let bBonusUtil = false
      const nBonusUtil = Number(matchLeague.nBonusUtil)
      const nPrice = Number(matchLeague.nPrice)
      if (nBonusUtil && nBonusUtil > 0 && nPrice > 0) bBonusUtil = true
      const result = await userBalanceServices.userPlayReturn({ bBonusUtil, nActualBonus: 0, nPrice, eCategory: matchLeague.eCategory, userLeagues, iMatchLeagueId: matchLeague._id.toString(), iMatchId: matchLeague.iMatchId.toString() })
      if (result.isSuccess) {
        try {
          if (type === 'MATCHLEAGUE' || type === 'MANUALLY') {
            const logData = {
              oOldFields: { _id: matchLeague._id, sName: matchLeague.sName, bCancelled: false },
              oNewFields: { _id: matchLeague._id, sName: matchLeague.sName, bCancelled: true },
              oDetails: { sOperationBy, nJoined, uniqueUserJoinCount },
              sIP: sIP,
              iAdminId: iAdminId,
              iUserId: null,
              eKey: 'ML'
            }
            const userLeagueIds = userLeagues.map(({ _id }) => _id)

            await Promise.all([
              MyMatchesModel.updateMany({ iMatchId: ObjectId(matchLeague.iMatchId), aMatchLeagueId: { $in: [ObjectId(matchLeague._id)] } }, { $pull: { aMatchLeagueId: ObjectId(matchLeague._id) }, $inc: { nJoinedLeague: -1 }, $push: { aCMatchLeagueId: ObjectId(matchLeague._id) } }),
              createAdminLog(logData),
              UserLeagueModel.updateMany({ _id: { $in: userLeagueIds } }, { bCancelled: true })
            ])

            await MatchLeagueModel.updateOne({ _id: ObjectId(matchLeague._id) }, { bCancelled: true, nJoined: userLeagues.length })
            await MatchModel.updateOne({ iGrandLeagueId: ObjectId(matchLeague._id) }, { iGrandLeagueId: null, nLeagueTotalPayout: 0 }, { runValidators: true })
          } else if (type === 'OVERFLOW') {
            const aUserIds = userLeagues.map(({ iUserId }) => ObjectId(iUserId))
            const userLeagueIds = userLeagues.map(({ _id }) => _id)

            await Promise.all([
              MyMatchesModel.updateMany({ iMatchId: ObjectId(matchLeague.iMatchId), aMatchLeagueId: { $in: [ObjectId(matchLeague._id)] }, iUserId: { $in: aUserIds } }, { $pull: { aMatchLeagueId: ObjectId(matchLeague._id) }, $inc: { nJoinedLeague: -1 }, $push: { aCMatchLeagueId: ObjectId(matchLeague._id) } }),
              UserLeagueModel.updateMany({ _id: { $in: userLeagueIds } }, { bCancelled: true })
            ])

            await MatchLeagueModel.updateOne({ _id: ObjectId(matchLeague._id) }, { $inc: { nJoined: -(userLeagues.length) } })
          }

          const { bCashbackEnabled, bIsProcessed, nMinCashbackTeam } = matchLeague

          if (bCashbackEnabled && bIsProcessed && nMinCashbackTeam) {
            const { _id, iMatchId, nMinCashbackTeam: nMinTeam, nCashbackAmount, eCashbackType, eCategory } = matchLeague
            await queuePush('ProcessUsersCashbackReturn', { _id, iMatchId, nMinTeam, nCashbackAmount, eCashbackType, eCategory })
          }
        } catch (error) {
          // await session.abortTransaction()
          handleCatchError(error)
          return { isSuccess: false }
        } finally {
          // session.endSession()
        }
      }

      return { isSuccess: true }
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  async processCashback(data) {
    try {
      const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' }
      }
      const session = await GamesDBConnect.startSession()
      session.startTransaction(transactionOptions)

      try {
        const { _id, iMatchId, nMinTeam, nCashbackAmount, eCashbackType, eCategory } = data
        const nAmount = parseFloat(nCashbackAmount)
        const aUserLeagues = await UserLeagueModel.aggregate([
          {
            $match: {
              iMatchLeagueId: ObjectId(_id)
            }
          }, {
            $addFields: {
              eType: { $cond: [{ $eq: ['$eType', 'U'] }, 'U', 'B'] }
            }
          }, {
            $group: {
              _id: '$iUserId',
              count: { $sum: 1 },
              sUserName: { $first: '$sUserName' },
              sLeagueName: { $first: '$sLeagueName' },
              eType: { $first: '$eType' }
            }
          }, {
            $match: {
              count: { $gte: nMinTeam }
            }
          }
        ]).exec()

        if (aUserLeagues.length) {
          const result = await userBalanceServices.userContestCashbackV2({ nAmount, eCashbackType, nTeams: nMinTeam, aUserLeagues, iMatchId, iMatchLeagueId: _id, eCategory })
          if (result.isSuccess) {
            const aUserLeagueIds = aUserLeagues.map(userLeague => userLeague._id)
            const [match, existingMyMatches] = await Promise.all([
              MatchModel.findById(iMatchId).select({ dStartDate: 1 }).lean(),
              MyMatchesModel.find({ iMatchId, iUserId: { $in: aUserLeagueIds }, aMatchLeagueCashback: { $elemMatch: { iMatchLeagueId: _id } } }, { iUserId: 1, _id: 0 }).session(session).lean()
            ])
            const existingMyMatchesSet = new Set(existingMyMatches.map(existingMyMatch => existingMyMatch.iUserId.toString()))
            const aUpdateQuery = []
            for (const userLeague of aUserLeagues) {
              if (existingMyMatchesSet.has(userLeague._id?.toString())) continue
              else {
                aUpdateQuery.push({
                  updateOne:
                    {
                      filter: { iMatchId, iUserId: userLeague._id },
                      update: {
                        $addToSet: {
                          aMatchLeagueCashback: {
                            iMatchLeagueId: _id,
                            nAmount,
                            eType: eCashbackType,
                            nTeams: userLeague.count
                          }
                        },
                        $set: { dStartDate: match.dStartDate }
                      }
                    }
                })
              }
            }

            await MyMatchesModel.bulkWrite(aUpdateQuery, { ordered: false })
            await MatchLeagueModel.updateOne({ _id: ObjectId(_id) }, { bIsProcessed: true }).session(session)
          } else {
            await session.abortTransaction()
            return { isSuccess: false }
          }
        }

        await session.commitTransaction()
        return { isSuccess: true }
      } catch (error) {
        await session.abortTransaction()
        handleCatchError(error)
        return { isSuccess: false }
      } finally {
        session.endSession()
      }
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  async botCreateUpdate(req, res) {
    try {
      const { bBotCreate } = req.body
      const data = await MatchLeagueModel.findByIdAndUpdate(req.params.id, { bBotCreate, dUpdatedAt: Date.now() }, { new: true, runValidators: true }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })

      const oNewFields = { ...data, bBotCreate, dUpdatedAt: Date.now() }
      const logData = { oOldFields: data, oNewFields, eKey: 'ML', iAdminId: req.admin._id, sIp: getIp(req) }
      await createAdminLog(logData)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].cmatchLeague), data })
    } catch (error) {
      catchError('MatchLeague.botCreateUpdate', error, req, res)
    }
  }

  async updateCopyBotCreation(req, res) {
    try {
      const iMatchLeagueId = req.params.id
      const matchLeague = await MatchLeagueModel.findOne({ _id: iMatchLeagueId }).lean()
      if (!matchLeague) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cmatchLeague) })
      if (matchLeague.eMatchStatus !== 'U') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].cannot_edit_copybot_number })
      if (!matchLeague.bBotCreate || matchLeague.bBotCreate === false) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].matchLeague_bot_updation })
      const { nCopyBotsPerTeam, nSameCopyBotTeam } = req.body
      await MatchLeagueModel.updateOne({ _id: iMatchLeagueId }, { nCopyBotsPerTeam, nSameCopyBotTeam }).lean()
      const logData = { oOldFields: matchLeague, oNewFields: { ...matchLeague, nCopyBotsPerTeam, nSameCopyBotTeam }, sIP: getIp(req), iAdminId: req.admin._id, eKey: 'ML' }
      await createAdminLog(logData)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].copyBotNumber) })
    } catch (error) {
      catchError('MatchLeague.updateCopyBotCreation', error, req, res)
    }
  }

  async getProcessedCount(req, res) {
    try {
      const processedBotData = await BotLogModel.aggregate([
        {
          $match: {
            iMatchLeagueId: ObjectId(req.params.id)
          }
        }, {
          $group: {
            _id: '$iMatchLeagueId',
            count: { $sum: '$nTeams' }
          }
        }
      ])

      const submittedNBot = (processedBotData.length) ? processedBotData[0].count : 0
      const data = await UserLeagueModel.aggregate([
        {
          $match: {
            iMatchLeagueId: ObjectId(req.params.id)
          }
        }, {
          $group: {
            _id: '$eType',
            count: { $sum: 1 },
            sType: { $first: '$eType' }
          }
        }
      ])

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data: { botCount: data, submittedNBot } })
    } catch (error) {
      catchError('MatchLeague.getProcessedCount', error, req, res)
    }
  }

  /**
   * To get promocode usage details matchLeague wise
   * @return { total { number }, results { array } }
   */
  async getPromoUsage(req, res) {
    const { start, limit, sorting, search } = getPaginationValues2(req.query)

    let query = { iPromocodeId: { $ne: null }, iMatchLeagueId: req.params.id }
    if (search) {
      query = {
        ...query,
        sUserName: { $regex: new RegExp('^.*' + search + '.*', 'i') }
      }
    }
    const [total, userLeagues] = await Promise.all([UserLeagueModel.countDocuments(query),
      UserLeagueModel.find(query, { sUserName: 1, iPromocodeId: 1, dCreatedAt: 1, sTeamName: 1, nPromoDiscount: 1, iUserId: 1, eType: 1 }).sort(sorting).skip(Number(start)).limit(Number(limit)).populate({ path: 'iPromocodeId', select: 'sCode sName' }).lean()])

    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmatchLeague), data: [{ total, results: userLeagues }] })
  }
}

module.exports = new MatchLeague()
