const MyMatchesModel = require('./model')
const UserLeagueModel = require('../userLeague/model')
const MatchLeagueModel = require('../matchLeague/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, convertToDecimal } = require('../../helper/utilities.services')
const { redisClient2 } = require('../../helper/redis')
const ObjectId = require('mongoose').Types.ObjectId
const { bAllowDiskUse } = require('../../config/config')

class MyMatches {
  async myMatchesListV4(req, res) {
    try {
      const { sportsType, type, start = 0, limit = 50 } = req.query
      let eMatchStatus = type.toUpperCase()

      if (!['U', 'L', 'CMP'].includes(eMatchStatus)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].stype) })

      eMatchStatus = eMatchStatus === 'CMP' ? { $in: ['CMP', 'I', 'CNCL'] } : eMatchStatus

      let data = await MyMatchesModel.find({
        eMatchStatus,
        eCategory: sportsType.toUpperCase(),
        iUserId: req.user._id,
        $and: [{ aMatchLeagueId: { $exists: true } }, { 'aMatchLeagueId.0': { $exists: true } }]
      }, {
        nJoinedLeague: 1,
        nTeams: 1,
        nWinnings: 1,
        oMatch: 1,
        iMatchId: 1,
        aExtraWin: 1,
        nBonusWin: 1,
        _id: 0
      })
        .sort({ dStartDate: -1 })
        .skip(Number(start))
        .limit(Number(limit))
        .populate('oMatch', [
          'sKey',
          'eFormat',
          'sName',
          'sSponsoredText',
          'sSeasonKey',
          'sVenue',
          'eStatus',
          'dStartDate',
          'oHomeTeam',
          'bScorecardShow',
          'sWinning',
          'oAwayTeam',
          'iTossWinnerId',
          'eTossWinnerAction',
          'bMatchOnTop',
          'eCategory',
          'sInfo',
          'sLeagueText',
          'sSeasonName',
          'nMaxTeamLimit',
          'iSeriesId',
          'bDisabled',
          'eProvider',
          'nPrizeCount',
          'bLineupsOut',
          'sFantasyPost',
          'sStreamUrl',
          'dUpdatedAt',
          'dCreatedAt'
        ]).lean()

      data = data.map((m) => {
        return { ...m, ...m.oMatch[0], oMatch: undefined }
      })

      if (eMatchStatus === 'L') {
        const aMatchIds = Array.isArray(data) && data.length ? data.map(({ _id }) => _id) : []
        const aMatchLeagues = await MatchLeagueModel.find({ iMatchId: { $in: aMatchIds } }, { nWinnersCount: 1, iMatchId: 1 }).lean()

        const aMatchLeaguePromises = []
        aMatchLeagues.forEach((league) => aMatchLeaguePromises.push(redisClient2.hmget(`hml:{${league.iMatchId}}:${league._id}`, 'exists', 'putTime', 'expireTime', 'matchId')))
        const redisMatchLeagueData = await Promise.all(aMatchLeaguePromises)

        for (let i = 0; i < aMatchLeagues.length; i++) {
          const isCached = redisMatchLeagueData[i]
          const matchIndex = data.findIndex(match => match._id.toString() === aMatchLeagues[i].iMatchId.toString())

          if (Number(isCached[0])) {
            const userData = await UserLeagueModel.find({ iMatchLeagueId: aMatchLeagues[i]._id, iUserId: req.user._id }).lean()

            const teamIds = []
            userData.forEach(s => {
              teamIds.push(s.iUserTeamId)
            })
            const redisData = await redisClient2.evalsha('5111ebb3688a5c52bd02c6df453b42710ede8f94', 1, `ml:{${aMatchLeagues[i].iMatchId}}:${aMatchLeagues[i]._id}`, ...teamIds)

            userData.forEach(s => {
              redisData.forEach(singleTeam => {
                if (s.iUserTeamId.toString() === singleTeam[0]) {
                  if (data.some(match => match._id.toString() === data[matchIndex]._id.toString() && match.bWinningZone)) {
                    data[matchIndex].bWinningZone = true
                  } else {
                    data[matchIndex].bWinningZone = aMatchLeagues[i].nWinnersCount >= singleTeam[2]
                  }
                }
              })
            })
          } else {
            data[matchIndex].bWinningZone = false
          }
        }
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmyMatch), data })
    } catch (error) {
      return catchError('MyMatches.myMatchesListV4', error, req, res)
    }
  }

  async listCompleteMyMatches(req, res) {
    try {
      const { start = 0, limit = 5 } = req.query

      const aMatches = await MyMatchesModel.find(
        { iUserId: ObjectId(req.params.id), eMatchStatus: 'CMP', $and: [{ aMatchLeagueId: { $exists: true } }, { 'aMatchLeagueId.0': { $exists: true } }] },
        { nTeams: 1, oMatch: 1, iMatchId: 1, _id: 0 }
      ).sort({ dStartDate: -1 }).skip(Number(start)).limit(Number(limit))
        .populate('oMatch', ['eFormat', 'sName', 'eStatus', 'dStartDate', 'oHomeTeam', 'sWinning', 'oAwayTeam', 'eCategory', 'iSeriesId']).lean()

      const aMatchIds = aMatches.map(match => match.iMatchId)
      const aUserLeague = await UserLeagueModel.find({ iUserId: ObjectId(req.params.id), iMatchId: { $in: aMatchIds } }, { nTotalPoints: 1, iMatchId: 1, sTeamName: 1 }).sort({ nTotalPoints: -1 }).lean()

      const data = aMatches.map(match => {
        const userLeague = aUserLeague.length ? aUserLeague.find(u => u.iMatchId.toString() === match.iMatchId.toString()) : null
        return { ...match, ...match.oMatch[0], oMatch: undefined, nTotalPoints: userLeague ? userLeague.nTotalPoints : 0 }
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmyMatch), data })
    } catch (error) {
      return catchError('MyMatches.listCompleteMyMatches', error, req, res)
    }
  }

  async listCommonMatches(req, res) {
    try {
      const { start = 0, limit = 5 } = req.query

      const aUserIds = [ObjectId(req.user._id), ObjectId(req.params.id)]

      const aMyMatches = await MyMatchesModel.aggregate([
        { $match: { iUserId: { $in: aUserIds }, eMatchStatus: 'CMP', $and: [{ aMatchLeagueId: { $exists: true } }, { 'aMatchLeagueId.0': { $exists: true } }] } },
        { $group: { _id: '$iMatchId', userId: { $addToSet: '$iUserId' }, aMatches: { $push: '$$ROOT' } } },
        { $project: { user: { $size: '$userId' }, aMatches: 1 } },
        { $match: { user: { $eq: 2 } } },
        { $sort: { 'aMatches.dStartDate': -1 } },
        { $skip: Number(start) },
        { $limit: Number(limit) }
      ]).allowDiskUse(bAllowDiskUse).exec()

      const aMatchIds = aMyMatches.map(a => a._id)

      const aUserLeague = await UserLeagueModel.find({ iUserId: { $in: aUserIds }, iMatchId: { $in: aMatchIds } }, { nTotalPoints: 1, iMatchId: 1, iUserId: 1, sTeamName: 1 }).sort({ nTotalPoints: -1 })
        .populate('iMatchId', ['eFormat', 'sName', 'eStatus', 'dStartDate', 'oHomeTeam', 'sWinning', 'oAwayTeam', 'eCategory', 'iSeriesId'])
        .lean()

      const data = aMyMatches.map(myMatch => {
        const match = aUserLeague.length ? aUserLeague.find(u => u.iMatchId._id.toString() === myMatch._id.toString()) : null
        const userLeague1 = aUserLeague.length ? aUserLeague.find(u => u.iUserId.toString() === myMatch.aMatches[0].iUserId.toString() && u.iMatchId._id.toString() === myMatch._id.toString()) : null
        const userLeague2 = aUserLeague.length ? aUserLeague.find(u => u.iUserId.toString() === myMatch.aMatches[1].iUserId.toString() && u.iMatchId._id.toString() === myMatch._id.toString()) : null
        const oUser1 = { iUserId: myMatch.aMatches[0].iUserId, nTeams: myMatch.aMatches[0].nTeams, ...userLeague1, iMatchId: undefined }
        const oUser2 = { iUserId: myMatch.aMatches[1].iUserId, nTeams: myMatch.aMatches[1].nTeams, ...userLeague2, iMatchId: undefined }
        return { ...myMatch, oUser1, oUser2, ...match.iMatchId, aMatches: undefined }
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cmyMatch), data })
    } catch (error) {
      return catchError('MyMatches.listCommonMatches', error, req, res)
    }
  }

  async getMatchCompareStats(req, res) {
    try {
      const aUserIds = [ObjectId(req.user._id), ObjectId(req.params.id)]

      const aMyMatches = await MyMatchesModel.aggregate([
        { $match: { iUserId: { $in: aUserIds }, eMatchStatus: 'CMP', $and: [{ aMatchLeagueId: { $exists: true } }, { 'aMatchLeagueId.0': { $exists: true } }] } },
        { $group: { _id: '$iMatchId', userId: { $addToSet: '$iUserId' } } },
        { $project: { user: { $size: '$userId' } } },
        { $match: { user: { $eq: 2 } } },
        { $group: { _id: null, nMyMatches: { $sum: 1 }, data: { $push: '$$ROOT' } } }
      ]).allowDiskUse(bAllowDiskUse).exec()

      const aMatchIds = aMyMatches.length && aMyMatches[0].data.length ? aMyMatches[0].data.map(a => a._id) : []
      const nTotalMatches = aMyMatches.length ? aMyMatches[0].nMyMatches : 0

      let [User1Win, User2Win] = await Promise.all([
        MyMatchesModel.countDocuments({ iMatchId: { $in: aMatchIds }, iUserId: ObjectId(req.user._id), $or: [{ nBonusWin: { $gt: 0 } }, { nWinnings: { $gt: 0 } }, { aExtraWin: { $exists: true } }, { 'aExtraWin.0': { $exists: true } }] }),
        MyMatchesModel.countDocuments({ iMatchId: { $in: aMatchIds }, iUserId: ObjectId(req.params.id), $or: [{ nBonusWin: { $gt: 0 } }, { nWinnings: { $gt: 0 } }, { aExtraWin: { $exists: true } }, { 'aExtraWin.0': { $exists: true } }] })
      ])

      User1Win = User1Win && (nTotalMatches >= User1Win) ? convertToDecimal((User1Win / nTotalMatches) * 100) : 0
      User2Win = User2Win && (nTotalMatches >= User2Win) ? convertToDecimal((User2Win / nTotalMatches) * 100) : 0

      const data = { nTotalMatches, oUser1: { _id: req.user._id, nWin: User1Win }, oUser2: { _id: req.user._id, nWin: User2Win } }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserData), data })
    } catch (error) {
      return catchError('MyMatches.getMatchCompareStats', error, req, res)
    }
  }
}

module.exports = new MyMatches()
