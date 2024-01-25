const { matches: MatchesModel, series: SeriesModel, venues: VenuesModel, teams: TeamsModel, players: PlayersModel, seriessquad: SeriesSquadModel, miniscorecards: MiniScorecardsModel, SeriesStatsModel, SeriesStatsTypesModel, fullscorecards: FullScorecardsModel, liveinnings: LiveInningsModel, fantasyarticles: FantasyArticlesModel, matchsquad: MatchSquadModel, MiniScoreCardHeader } = require('../../model')

// model files name changed
const _ = require('../../../global')
const moment = require('moment')
const momentZone = require('moment-timezone')
const { eMatchFormat, eStatisticsTypes } = require('../../model/enums')
const { getPaginationValues } = require('../../utils')
const { fetchPlayersByCountry, fetchSeriesSquadFun } = require('./common')
const { fetchMatchFromApi, getIdBySlug } = require('./common')
const { ALLOW_DISK_USE, CACHE_1M, CACHE_2M, CACHE_5M, OPEN_WEATHER_API_KEY } = require('../../../config')
const axios = require('axios')
const { matchoverviews: MatchesOverview, matchsquad: MatchesSquadModel } = require('../../model')

const controllers = {}

controllers.fetchMatchData = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['dStartDate', 'dEndDate'])
    let { dStartDate, dEndDate } = input

    if (!dStartDate || !dEndDate) _.throwError('requiredField', context)
    if (!moment(dStartDate).isValid() || !moment(dEndDate).isValid()) _.throwError('invalidDate', context)

    dStartDate = moment(dStartDate).format('YYYY-MM-DD')
    dEndDate = moment(dEndDate).add(1, 'days').format('YYYY-MM-DD')

    fetchMatchFromApi(dStartDate, dEndDate)

    return _.resolve('fetchMatchDataSuccess', null, null, context)
  } catch (error) {
    return error
  }
}

controllers.fetchMiniScorecardData = async (parent, { input }, context) => {
  try {
    const data = await MiniScorecardsModel.find().sort({ nPriority: 1 }).limit(15).lean().cache(CACHE_1M)
    return data
  } catch (error) {
    return _.throwError(error, context)
  }
}

controllers.fetchFullScorecardData = async (parent, { input }, context) => {
  try {
    const { iMatchId } = input
    const data = await FullScorecardsModel.findOne({ iMatchId: _.mongify(iMatchId) })
      .populate([
        { path: 'oMatch', select: 'sTitle sSubtitle sFormatStr' },
        { path: 'oSeries', select: 'sTitle sAbbr sSeason' },
        { path: 'oVenue', select: 'sName sLocation' },
        { path: 'oToss.oWinnerTeam', select: '_id sTitle sAbbr oImg eTagStatus' },
        { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg eTagStatus' },
        { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg eTagStatus' },
        { path: 'oMom', select: 'sTitle `sShortName` sFullName sThumbUrl eTagStatus oImg iPrimaryTeam', populate: { path: 'oPrimaryTeam', select: 'oJersey' } }
      ])
      .lean().cache(CACHE_2M, `fullscorecard:${iMatchId}`)

    return data
  } catch (error) {
    return _.throwError(error, context.userLanguage)
  }
}

controllers.fetchLiveInningsData = async (parent, { input }, context) => {
  try {
    const { iMatchId, nInningNumber } = input
    let sKey = `liveinnings:${iMatchId}`
    const query = { iMatchId: _.mongify(iMatchId) }
    if (nInningNumber) {
      sKey = `liveinnings:${nInningNumber}:${iMatchId}`
      query.nInningNumber = nInningNumber
    }

    const data = await LiveInningsModel.find(query)
      .populate([
        { path: 'oMatch', select: 'sTitle sSubtitle sFormatStr' },
        { path: 'oBattingTeam', select: '_id sTitle sAbbr oImg eTagStatus' },
        { path: 'oFieldingTeam', select: '_id sTitle sAbbr oImg eTagStatus' },
        { path: 'aBatters.oBatter', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aBatters.oBowler', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aBatters.oFirstFielder', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aBatters.oSecondFielder', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aBatters.oThirdFielder', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aBowlers.oBowler', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aFielders.oFielder', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'oLastWicket.oBatter', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'oLastWicket.oBowler', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aFOWs.oBatter', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aFOWs.oBowler', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'oCurrentPartnership.aBatters.oBatter', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aActiveBatters.oBatter', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aActiveBowlers.oBowler', select: 'sTitle sShortName sFullName eTagStatus' },
        { path: 'aYetToBat', select: 'sTitle sShortName sFullName eTagStatus' }
      ])
      .sort({ nInningNumber: 1 }).lean().cache(CACHE_2M, sKey)
    // console.log({ data: data[0].aBowlers[0] })
    return data
  } catch (error) {
    return _.throwError(error, context.userLanguage)
  }
}

controllers.fetchPlayer = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['sName'])
    const { sName } = input

    const data = await PlayersModel.findOne({ sFirstName: { $regex: new RegExp('^.*' + sName + '.*', 'i') } }, { _id: 1 }).lean()

    return data._id
  } catch (error) {
    return error
  }
}

controllers.listFantasyPlayer = async (parent, { input }, context) => {
  try {
    const { iMatchId, iTeamId } = input || {}

    if (!iMatchId) _.throwError('requiredField', context)

    const match = await MatchesModel.findOne({ _id: iMatchId })
    if (!match) _.throwError('notFound', context, 'match')

    const { iSeriesId, oTeamScoreA, oTeamScoreB } = match

    const query = { $and: [{ iSeriesId: _.mongify(iSeriesId) }] }

    if (iTeamId) query.$and.push({ $or: [{ iTeamId: _.mongify(iTeamId) }] })
    else query.$and.push({ $or: [{ iTeamId: _.mongify(oTeamScoreA.iTeamId) }, { iTeamId: _.mongify(oTeamScoreB.iTeamId) }] })

    const squadExist = await SeriesSquadModel.find(query)
    if (squadExist.length < 11) await fetchSeriesSquadFun(match.sSeriesKey, match.sMatchKey)

    const [data] = await SeriesSquadModel.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'players',
          localField: 'iPlayerId',
          foreignField: '_id',
          as: 'player'
        }
      },
      {
        $unwind: {
          path: '$player'
        }
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ['$$ROOT', '$player'] }
        }
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'iTeamId',
          foreignField: '_id',
          as: 'team'
        }
      },
      {
        $unwind: {
          path: '$team'
        }
      },
      {
        $addFields: { sTeamName: '$team.sTitle', sTeamAbbr: '$team.sAbbr' }
      },
      {
        $project: {
          player: 0,
          aMajorTeams: 0,
          sPlayerKey: 0,
          sTeamKey: 0,
          sSeriesKey: 0,
          iPlayerId: 0,
          iSeriesId: 0,
          team: 0,
          iTeamId: 0
        }
      },
      {
        $group: {
          _id: null,
          aResults: {
            $push: '$$ROOT'
          }
        }
      }

    ]).allowDiskUse(ALLOW_DISK_USE)

    return data?.aResults.length ? data.aResults : []
  } catch (error) {
    return error
  }
}

controllers.fetchFixuresData = async (parent, { input }, context) => {
  try {
    const { iSeriesId, iTeamId, iVenueId, sStatusStr } = input
    const { sorting } = getPaginationValues(input)
    let query = {}
    if (sStatusStr) Object.assign(query, { sStatusStr })
    if (iTeamId) query = { $or: [{ 'oTeamScoreA.iTeamId': _.mongify(iTeamId) }, { 'oTeamScoreB.iTeamId': _.mongify(iTeamId) }] }
    if (iSeriesId) query.iSeriesId = iSeriesId
    if (iVenueId) query.iVenueId = iVenueId
    const data = await MatchesModel.find(query).populate([{ path: 'oVenue' }, { path: 'oSeries' }, { path: 'oTeamA' }, { path: 'oTeamB' }, { path: 'oToss.oWinnerTeam' }, { path: 'oTeamScoreA.oTeam' }, { path: 'oTeamScoreB.oTeam' }, { path: 'oWinner' }]).sort(sorting).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.listFantasyMatch = async (parent, { input }, context) => {
  try {
    const { aStatus, aFilter, eType, aDate } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)

    const query = {}
    const searchQuery = {}
    if (sSearch) {
      searchQuery.$or = [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oSeries.sTitle': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }
    if (aStatus?.length) query.sStatusStr = { $in: aStatus }
    if (aStatus?.length && aStatus?.includes('live') && aStatus?.includes('scheduled') && eType === 'm') {
      query.dEndDate = { $gte: moment().startOf('day').toDate() }
    }

    if (aFilter?.length) {
      aFilter.forEach(ele => {
        if (!eMatchFormat.value.includes(ele)) _.throwError('invalid', context, 'matchFormat')
      })
      query.sFormatStr = { $in: aFilter }
    }
    if (aDate?.length === 2) query.dStartDate = { $gte: moment(aDate[0], 'YYYY-MM-DD hh:mm:ss').startOf('day').toDate(), $lte: moment(aDate[1], 'YYYY-MM-DD hh:mm:ss').endOf('day').toDate() }
    let nTotal
    let aResults
    if (eType === 'm') {
      const data = await MatchesModel.aggregate([
        {
          $match: query
        },
        { $sort: sorting },
        {
          $lookup: {
            from: 'series',
            localField: 'iSeriesId',
            foreignField: '_id',
            as: 'oSeries'
          }
        },
        {
          $unwind: {
            path: '$oSeries',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: searchQuery
        },
        { $skip: parseInt(nSkip) },
        { $limit: parseInt(nLimit) },
        {
          $lookup: {
            from: 'fantasyarticles',
            localField: '_id',
            foreignField: 'iMatchId',
            as: 'aFantasyTips'
          }
        },
        {
          $addFields: {
            aFantasyTips: {
              $filter: {
                input: '$aFantasyTips',
                as: 'tip',
                cond: { $ne: ['$$tip.eState', 't'] }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'venues',
            localField: 'iVenueId',
            foreignField: '_id',
            as: 'oVenue'
          }
        },
        {
          $unwind: {
            path: '$oVenue',
            preserveNullAndEmptyArrays: true
          }
        }
      ]).allowDiskUse(true)

      nTotal = await MatchesModel.aggregate([
        {
          $match: query
        },
        { $sort: sorting },
        {
          $lookup: {
            from: 'series',
            localField: 'iSeriesId',
            foreignField: '_id',
            as: 'oSeries'
          }
        },
        {
          $unwind: {
            path: '$oSeries',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: searchQuery
        },
        {
          $count: 'nTotal'
        }
      ]).allowDiskUse(true)
      nTotal = nTotal[0]?.nTotal ? nTotal[0].nTotal : 0
      aResults = data.length ? data : []
    }

    if (eType === 't') {
      // console.time('agg 1')
      // const [data] = await FantasyArticlesModel.aggregate(
      //   [
      //     {
      //       $match: {
      //         eState: 't'
      //       }
      //     }, {
      //       $project: {
      //         _id: 1,
      //         iMatchId: 1,
      //         iAuthorId: 1,
      //         sTitle: 1,
      //         sSubtitle: 1,
      //         ePlatformType: 1,
      //         sMatchPreview: 1,
      //         eState: 1,
      //         eStatus: 1,
      //         eType: 1,
      //         iAuthorDId: 1,
      //         iReviewerId: 1,
      //         dPublishDate: 1,
      //         dCreated: 1,
      //         dUpdated: 1
      //       }
      //     }, {
      //       $group: {
      //         _id: '$iMatchId',
      //         aFantasyTips: {
      //           $push: '$$ROOT'
      //         }
      //       }
      //     }, {
      //       $lookup: {
      //         from: 'matches',
      //         localField: '_id',
      //         foreignField: '_id',
      //         as: 'match'
      //       }
      //     }, {
      //       $unwind: {
      //         path: '$match'
      //       }
      //     }, {
      //       $replaceRoot: {
      //         newRoot: {
      //           $mergeObjects: [
      //             '$$ROOT', '$match'
      //           ]
      //         }
      //       }
      //     }, {
      //       $project: {
      //         match: 0
      //       }
      //     },
      //     {
      //       $lookup: {
      //         from: 'series',
      //         localField: 'iSeriesId',
      //         foreignField: '_id',
      //         as: 'oSeries'
      //       }
      //     }, {
      //       $unwind: {
      //         path: '$oSeries',
      //         preserveNullAndEmptyArrays: true
      //       }
      //     },
      //     {
      //       $match: { ...query, ...searchQuery }
      //     },

      //     {
      //       $lookup: {
      //         from: 'venues',
      //         localField: 'iVenueId',
      //         foreignField: '_id',
      //         as: 'oVenue'
      //       }
      //     }, {
      //       $unwind: {
      //         path: '$oVenue',
      //         preserveNullAndEmptyArrays: true
      //       }
      //     },
      //     {
      //       $facet: {
      //         nTotal: [{ $count: 'total' }],
      //         aResults: [
      //           { $sort: { ...sorting, dCreated: -1 } },
      //           { $skip: parseInt(nSkip) },
      //           { $limit: parseInt(nLimit) }
      //         ]
      //       }
      //     }
      //   ]
      // ).allowDiskUse(true)
      // console.timeEnd('agg 1')

      const data2 = await FantasyArticlesModel.aggregate(
        [
          {
            $match: {
              eState: 't'
            }
          }, {
            $project: {
              _id: 1,
              iMatchId: 1,
              iAuthorId: 1,
              sTitle: 1,
              sSubtitle: 1,
              ePlatformType: 1,
              sMatchPreview: 1,
              eState: 1,
              eStatus: 1,
              eType: 1,
              iAuthorDId: 1,
              iReviewerId: 1,
              dPublishDate: 1,
              dCreated: 1,
              dUpdated: 1
            }
          }, {
            $group: {
              _id: '$iMatchId',
              aFantasyTips: {
                $push: '$$ROOT'
              }
            }
          }, {
            $lookup: {
              from: 'matches',
              localField: '_id',
              foreignField: '_id',
              as: 'match'
            }
          }, {
            $unwind: {
              path: '$match'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  '$$ROOT', '$match'
                ]
              }
            }
          },
          {
            $lookup: {
              from: 'series',
              localField: 'iSeriesId',
              foreignField: '_id',
              as: 'oSeries'
            }
          },
          {
            $unwind: {
              path: '$oSeries',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              match: 0
            }
          },
          {
            $match: { ...query, ...searchQuery }
          },
          {
            $group: {
              _id: null,
              nTotal: { $sum: 1 },
              aResults: { $push: '$$ROOT' }
            }
          },
          {
            $unwind: '$aResults'
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ nTotal: '$nTotal' }, '$aResults']
              }
            }
          },
          {
            $skip: nSkip
          },
          {
            $limit: nLimit
          },
          {
            $sort: { ...sorting, dCreated: -1 }
          },
          {
            $lookup: {
              from: 'venues',
              localField: 'iVenueId',
              foreignField: '_id',
              as: 'oVenue'
            }
          },
          {
            $unwind: {
              path: '$oVenue',
              preserveNullAndEmptyArrays: true
            }
          }
        ]
      ).allowDiskUse(true)

      // nTotal = data?.nTotal[0]?.total
      // aResults = data?.aResults || []

      nTotal = data2[0]?.nTotal || 0
      aResults = data2 || []
    }

    return aResults?.length ? { nTotal, aResults } : { nTotal: 0, aResults: [] }
  } catch (error) {
    return error
  }
}

controllers.fetchVenues = async (parent, { input }, context) => {
  try {
    const data = await VenuesModel.find({}).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.listTeam = async (parent, { input }, context) => {
  try {
    const { aCountryFilter } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    const query = {}
    if (sSearch) {
      query.$or = [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }]
    }

    if (aCountryFilter?.length) query.sCountry = { $in: aCountryFilter }

    const nTotal = await TeamsModel.countDocuments(query)
    const aResults = await TeamsModel.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return aResults?.length ? { aResults, nTotal } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

controllers.fetchSeries = async (parent, { input }, context) => {
  try {
    const data = await SeriesModel.find({}).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.fetchSeriesStats = async (parent, { input }, context) => {
  try {
    const { _id, iSeriesId, eFormat, nLimit } = input
    const query = {}
    if (eFormat) Object.assign(query, { eFormat })
    if (iSeriesId) query.iSeriesId = iSeriesId
    let projection = {}
    if (_id) {
      const isExist = await SeriesStatsTypesModel.findById(_id).lean()
      if (!isExist) _.throwError('notFound', context, 'seriesStatsType')
      query.iSeriesStatsId = _id

      if (isExist.eGroupTitle === 'Bat') {
        projection = { nOvers: 0, nWickets: 0, sBestMatch: 0, sBestInning: 0, nEcon: 0, nWicket4i: 0, nWicket5i: 0, nWicket10m: 0, nMaidens: 0 }
      } else if (isExist.eGroupTitle === 'Bwl') {
        projection = { nRun100: 0, nRun50: 0, nRun6: 0, nRun4: 0, nNotout: 0, nHighest: 0, nCatches: 0, nStumpings: 0 }
      } else {
        projection = { _id: 1, dCreated: 1, dUpdated: 1, iSeriesId: 1, iSeriesStatsId: 1, iPlayerId: 1, iTeamId: 1, dModified: 1, eProvider: 1, nRun100: 1, nRun50: 1, nRunsConceded: 1, nRuns: 1, nWickets: 1, nWicket4i: 1, nWicket5i: 1, nWicket10m: 1 }
      }
    }

    const data = await SeriesStatsModel.find(query, projection).populate([{ path: 'oTeam' }, { path: 'oPlayer' }]).sort({ nPriority: 1 }).limit(nLimit || 15).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.fetchSeriesStatsTypes = async (parent, { input }, context) => {
  try {
    const { eGroupTitle, aStateType } = input
    const query = {}

    if (eGroupTitle && eGroupTitle !== 'All') {
      query.eGroupTitle = eGroupTitle
    } else {
      query.eGroupTitle = { $in: eStatisticsTypes.value }
    }

    if (aStateType?.length) {
      query.$and = [{ sType: { $in: aStateType } }, { eGroupTitle: query.eGroupTitle }]
      delete query.eGroupTitle
    }

    const data = await SeriesStatsTypesModel.find(query).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.fetchPlayersFromApi = async (parent, { input }, context) => {
  try {
    const { sCountry } = input
    if (!sCountry) _.throwError('requiredField', context)
    if (sCountry !== 'all') {
      fetchPlayersByCountry(sCountry, context)
    }

    return _.resolve('fetchPlayerSuccess', null, null, context)
  } catch (error) {
    return error
  }
}

controllers.listPlayer = async (parent, { input }, context) => {
  try {
    const { aCountryFilter, aRoleFilter } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)

    const query = {}
    if (sSearch) {
      query.$or = [
        { sFullName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sFirstName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sShortName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }

    if (aCountryFilter?.length) query.sCountry = { $in: aCountryFilter }
    if (aRoleFilter?.length) query.sPlayingRole = { $in: aRoleFilter }

    const nTotal = await PlayersModel.countDocuments(query)
    const aResults = await PlayersModel.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return aResults?.length ? { aResults, nTotal } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

controllers.resolveSeries = async (_id) => {
  try {
    const data = await SeriesModel.findOne({ _id: _.mongify(_id) }).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.getLiveMatches = async (parent, { input }, context) => {
  try {
    const startDate = moment().add(48, 'hours').toDate()
    const endDate = moment().subtract(48, 'hours').toDate()
    const query = { sFormatStr: { $ne: 'First Class' }, dStartDate: { $lt: startDate }, dEndDate: { $gt: endDate } }
    const matches = await MatchesModel.find(query).populate('oTeamScoreA.iTeamId').populate('oTeamScoreB.iTeamId').populate('oToss').sort({ dUpdated: -1 }).lean()

    return matches
  } catch (error) {
    return error
  }
}

controllers.listAllFixtures = async (parent, { input }, context) => {
  try {
    const { eCategory, eStatus, iTeamId, iSeriesId, iVenueId, dByMonth, sTimezone } = input
    const { nSkip, nLimit, sSearch } = getPaginationValues(input)

    // dByMonth - 2022-01-01T00:00:00+05:30
    const $sort = {}
    const query = {}
    const filter = {}
    const teamFilter = []
    const seriesLeagueFilter = []
    if (iTeamId) {
      teamFilter.push({ 'oTeamScoreA.iTeamId': _.mongify(iTeamId) }, { 'oTeamScoreB.iTeamId': _.mongify(iTeamId) })
    }

    if (iSeriesId) filter.iSeriesId = _.mongify(iSeriesId)
    if (iVenueId) filter.iVenueId = _.mongify(iVenueId)

    if (sSearch) {
      if (!filter?.$or?.length) filter.$or = []
      filter.$or.push(
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oSeries.sTitle': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oTeamScoreA.oTeam.sTitle': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oTeamScoreA.oTeam.sAbbr': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oTeamScoreB.oTeam.sTitle': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oTeamScoreB.oTeam.sAbbr': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      )
    }

    if (dByMonth) {
      query.dStartDate = { $gte: momentZone.tz(dByMonth, 'YYYY-MM-DD hh:mm:ss', sTimezone).startOf('month').utc().toDate(), $lt: momentZone.tz(dByMonth, 'YYYY-MM-DD hh:mm:ss', sTimezone).endOf('month').utc().toDate() }
    } else if (['r', 'u'].includes(eStatus)) {
      if (eStatus === 'u') query.dStartDate = { $gte: moment().utc().toDate(), $lte: moment().add('15', 'days').utc().toDate() }
      if (eStatus === 'r') query.dStartDate = { $lte: moment().utc().toDate(), $gte: moment().subtract('15', 'days').utc().toDate() }
    }

    if (eCategory === 'l') Object.assign(filter, { 'oSeries.bIsLeague': true })
    else {
      query.bIsDomestic = eCategory === 'd'
      seriesLeagueFilter.push({ 'oSeries.bIsLeague': false }, { 'oSeries.bIsLeague': null })
    }

    if (eStatus === 'l') {
      query.sStatusStr = 'live'
      Object.assign($sort, { dStartDate: 1 })
    }

    if (eStatus === 'u') {
      Object.assign($sort, { dStartDate: 1 })
      query.sStatusStr = 'scheduled'
    }

    if (eStatus === 'r') {
      Object.assign($sort, { dStartDate: -1 })
      query.sStatusStr = 'completed'
    }

    if (teamFilter.length || seriesLeagueFilter.length) filter.$and = []
    if (teamFilter.length) filter.$and.push({ $or: teamFilter })
    if (seriesLeagueFilter.length) filter.$and.push({ $or: seriesLeagueFilter })

    const data = await MatchesModel.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'series',
          localField: 'iSeriesId',
          foreignField: '_id',
          as: 'oSeries'
        }
      },
      {
        $unwind: {
          path: '$oSeries'
        }
      },
      {
        $match: filter
      },
      {
        $sort: Object.keys($sort).length ? $sort : { dStartDate: 1 } // for top 50
      },
      {
        $skip: parseInt(nSkip)
      },
      {
        $limit: parseInt(nLimit)
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'oTeamScoreA.iTeamId',
          foreignField: '_id',
          as: 'oTeamScoreA.oTeam'
        }
      }, {
        $lookup: {
          from: 'teams',
          localField: 'oTeamScoreB.iTeamId',
          foreignField: '_id',
          as: 'oTeamScoreB.oTeam'
        }
      }, {
        $unwind: {
          path: '$oTeamScoreA.oTeam'
        }
      }, {
        $unwind: {
          path: '$oTeamScoreB.oTeam'
        }
      },
      {
        $lookup: {
          from: 'venues',
          localField: 'iVenueId',
          foreignField: '_id',
          as: 'oVenue'
        }
      },
      {
        $unwind: {
          path: '$oVenue'
        }
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'iWinnerId',
          foreignField: '_id',
          as: 'oWinner'
        }
      },
      {
        $unwind: {
          path: '$oWinner',
          preserveNullAndEmptyArrays: true
        }
      }
    ])

    return data
  } catch (error) {
    return error
  }
}

controllers.listAllFixturesMobile = async (parent, { input }, context) => {
  try {
    const { aCategory, eStatus, aTeamId, aSeriesId, aVenueId, dByMonth, sTimezone } = input
    const { sSearch } = getPaginationValues(input)
    // dByMonth - 2022-01-01T00:00:00+05:30
    const $sort = {}
    const query = {}
    const filter = {}
    const teamFilter = []
    const seriesLeagueFilter = []
    if (aTeamId?.length) {
      teamFilter.push({ 'oTeamScoreA.iTeamId': { $in: aTeamId.map((ele) => _.mongify(ele)) } }, { 'oTeamScoreB.iTeamId': { $in: aTeamId.map((ele) => _.mongify(ele)) } })
    }

    if (aSeriesId?.length) filter.iSeriesId = { $in: aSeriesId.map((ele) => _.mongify(ele)) }
    if (aVenueId?.length) filter.iVenueId = { $in: aVenueId.map((ele) => _.mongify(ele)) }

    if (sSearch) {
      if (!filter?.$or?.length) filter.$or = []
      filter.$or.push(
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oSeries.sTitle': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oTeamScoreA.oTeam.sTitle': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oTeamScoreA.oTeam.sAbbr': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oTeamScoreB.oTeam.sTitle': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { 'oTeamScoreB.oTeam.sAbbr': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      )
    }

    if (dByMonth) {
      query.dStartDate = { $gte: momentZone.tz(dByMonth, 'YYYY-MM-DD hh:mm:ss', sTimezone).startOf('month').utc().toDate(), $lt: momentZone.tz(dByMonth, 'YYYY-MM-DD hh:mm:ss', sTimezone).endOf('month').utc().toDate() }
    } else if (['r', 'u'].includes(eStatus)) {
      if (eStatus === 'u') query.dStartDate = { $gte: moment().utc().toDate(), $lte: moment().add('15', 'days').utc().toDate() }
      if (eStatus === 'r') query.dStartDate = { $lte: moment().utc().toDate(), $gte: moment().subtract('15', 'days').utc().toDate() }
    }

    if (aCategory?.length) {
      query.bIsDomestic = aCategory.includes('d')
      if (aCategory.includes('l')) Object.assign(filter, { 'oSeries.bIsLeague': true })
      else if (aCategory.includes('w')) Object.assign(filter, { 'oSeries.sCategory': 'women' })
      else {
        seriesLeagueFilter.push({ 'oSeries.bIsLeague': false }, { 'oSeries.bIsLeague': null })
      }
    }

    if (eStatus === 'l') {
      query.sStatusStr = 'live'
      Object.assign($sort, { dStartDate: 1 })
    }

    if (eStatus === 'u') {
      Object.assign($sort, { dStartDate: 1 })
      query.sStatusStr = 'scheduled'
    }

    if (eStatus === 'r') {
      Object.assign($sort, { dStartDate: -1 })
      query.sStatusStr = 'completed'
    }

    if (teamFilter.length || seriesLeagueFilter.length) filter.$and = []
    if (teamFilter.length) filter.$and.push({ $or: teamFilter })
    if (seriesLeagueFilter.length) filter.$and.push({ $or: seriesLeagueFilter })

    const data = await MatchesModel.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'series',
          localField: 'iSeriesId',
          foreignField: '_id',
          as: 'oSeries'
        }
      },
      {
        $unwind: {
          path: '$oSeries'
        }
      },
      {
        $match: filter
      },
      {
        $sort: Object.keys($sort).length ? $sort : { dStartDate: 1 } // for top 50
      }, {
        $limit: 50
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'oTeamScoreA.iTeamId',
          foreignField: '_id',
          as: 'oTeamScoreA.oTeam'
        }
      }, {
        $lookup: {
          from: 'teams',
          localField: 'oTeamScoreB.iTeamId',
          foreignField: '_id',
          as: 'oTeamScoreB.oTeam'
        }
      }, {
        $unwind: {
          path: '$oTeamScoreA.oTeam'
        }
      }, {
        $unwind: {
          path: '$oTeamScoreB.oTeam'
        }
      },
      {
        $lookup: {
          from: 'venues',
          localField: 'iVenueId',
          foreignField: '_id',
          as: 'oVenue'
        }
      },
      {
        $unwind: {
          path: '$oVenue'
        }
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'iWinnerId',
          foreignField: '_id',
          as: 'oWinner'
        }
      },
      {
        $unwind: {
          path: '$oWinner',
          preserveNullAndEmptyArrays: true
        }
      }
    ])
    const sortBy = ['indian premier league', 'women\'s premier league', 'india', 'icc', 'australia', 'pakistan', 'england', 'new zealand', 'west indies', 'bangladesh', 'afghanistan', 'sri lanka']
    const aSortedData = _.customSortByPriority({ data, sortBy })

    return aSortedData
  } catch (error) {
    return error
  }
}

controllers.getTeamSearch = async (parent, { input }, context) => {
  try {
    const { sSearch, nSkip, nLimit } = getPaginationValues(input)
    if (!sSearch) return { aResults: [], nTotal: 0 }
    const query = { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') }, eStatus: 'a', eTagStatus: 'a' }

    const aResults = await TeamsModel.find(query).sort({ nPriority: -1 }).skip(nSkip).limit(nLimit).lean()
    return { aResults }
  } catch (error) {
    return error
  }
}

controllers.getPlayerSearch = async (parent, { input }, context) => {
  try {
    const { sSearch, nLimit, nSkip } = getPaginationValues(input)
    if (!sSearch) return { aResults: [], nTotal: 0 }

    const query = { eTagStatus: 'a', $or: [{ sFullName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }, { sShortName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }, { sFirstName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }, { sLastName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }, { sMiddleName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }] }

    const aResults = await PlayersModel.find(query).sort({ nPriority: -1, sFullName: 1 }).skip(nSkip).limit(nLimit).populate('oPrimaryTeam').lean()
    return { aResults }
  } catch (error) {
    return error
  }
}

controllers.listMatchSquad = async (parent, { input }, context) => {
  try {
    const { iMatchId } = input

    const match = await MatchesModel.findOne({ _id: iMatchId }).lean()
    if (!match) _.throwError('notFound', context, 'match')

    const aResults = await MatchSquadModel.find({ iMatchId: _.mongify(iMatchId) })
      .populate([
        { path: 'oTeam', select: '_id sTitle sAbbr eTagStatus' }
      ]).lean()

    return aResults.length ? aResults : []
  } catch (error) {
    return error
  }
}

controllers.getMatchBySlug = async (parent, { input }, context) => {
  try {
    const { sSlug } = input || {}
    if (!sSlug) _.throwError('requiredField', context)

    const resData = await getIdBySlug(sSlug, context)
    if (resData.isError) {
      if (resData?.error) _.throwError('invalidSlug', context)
      else _.throwError('wentWrong', context)
    }

    const { iId } = resData?.data

    const data = await MatchesModel.findOne({ _id: iId })
      .populate([
        { path: 'oVenue' },
        { path: 'oSeries' },
        { path: 'oTeamA' },
        { path: 'oTeamB' },
        { path: 'oToss.oWinnerTeam' },
        { path: 'oTeamScoreA.oTeam' },
        { path: 'oTeamScoreB.oTeam' },
        { path: 'oMom', select: 'sTitle sShortName sFullName sThumbUrl eTagStatus' },
        { path: 'oMos', select: 'sTitle sShortName sFullName sThumbUrl eTagStatus' }
      ])
      .lean()

    if (!data) _.throwError('notFound', context)

    const aInning = await LiveInningsModel.find({ iMatchId: _.mongify(iId) }).lean()
    Object.assign(data, { aInning })

    return data
  } catch (error) {
    return error
  }
}

const matchQueryMaking = (oPlayer, nRangeDifference, oMatchQuery) => {
  if ((oPlayer?.sPlayingRole === 'bat' || oPlayer?.sPlayingRole === 'wk' || oPlayer?.sPlayingRole === 'wkbat') && oPlayer?.nBattingPerformancePoint) {
    Object.assign(oMatchQuery, { sPlayingRole: oPlayer?.sPlayingRole, nBattingPerformancePoint: { $gte: (oPlayer?.nBattingPerformancePoint - nRangeDifference), $lte: (oPlayer?.nBattingPerformancePoint + nRangeDifference) } })
  } else if (oPlayer?.sPlayingRole === 'bowl' && oPlayer?.nBowlingPerformancePoint) {
    Object.assign(oMatchQuery, { sPlayingRole: oPlayer?.sPlayingRole, nBowlingPerformancePoint: { $gte: (oPlayer?.nBowlingPerformancePoint - nRangeDifference), $lte: (oPlayer?.nBowlingPerformancePoint + nRangeDifference) } })
  } else if (oPlayer?.sPlayingRole === 'all' && oPlayer?.nBowlingPerformancePoint && oPlayer?.nBattingPerformancePoint) {
    Object.assign(oMatchQuery, { sPlayingRole: oPlayer?.sPlayingRole, nBattingPerformancePoint: { $gte: (oPlayer?.nBattingPerformancePoint - nRangeDifference), $lte: (oPlayer?.nBattingPerformancePoint + nRangeDifference) }, nBowlingPerformancePoint: { $gte: (oPlayer?.nBowlingPerformancePoint - 10), $lte: (oPlayer?.nBowlingPerformancePoint + 10) } })
  }
  return oMatchQuery
}

controllers.getPlayerByIdFront = async (parent, { input }, context) => {
  try {
    const { _id } = input || {}
    if (!_id) _.throwError('requiredField', context)
    const oMatchTypePriority = {
      test: 1,
      odi: 2,
      t20i: 3,
      t20: 4,
      firstclass: 5,
      lista: 6,
      t10: 7
    }

    const oPlayer = await PlayersModel.findOne({ _id }).populate('oStats').populate('oPrimaryTeam').lean()
    if (!oPlayer) _.throwError('notFound', context, 'player')

    const aTeam = await MatchSquadModel.aggregate([
      {
        $match: {
          iPlayerId: _.mongify(oPlayer?._id),
          bPlaying11: true
        }
      }, {
        $group: {
          _id: {
            iTeamId: '$iTeamId'
          }
        }
      }, {
        $lookup: {
          from: 'teams',
          localField: '_id.iTeamId',
          foreignField: '_id',
          as: 'oTeam'
        }
      }, {
        $unwind: {
          path: '$oTeam',
          preserveNullAndEmptyArrays: true
        }
      }, {
        $sort: {
          'oTeam.dCreated': -1
        }
      }, {
        $project: {
          'oTeam._id': 1,
          _id: 0,
          'oTeam.sTitle': 1,
          'oTeam.sAbbr': 1,
          'oTeam.oImg': 1,
          'oTeam.sTeamType': 1,
          'oTeam.sCountry': 1,
          'oTeam.sAltName': 1,
          'oTeam.oSeo': 1,
          'oTeam.sCountryFull': 1,
          'oTeam.eTagStatus': 1
        }
      }
    ])
    Object.assign(oPlayer, { aTeam })

    if (oPlayer?.oStats) {
      oPlayer?.oStats.map(async oStat => Object.assign(oStat, { nPriority: oMatchTypePriority[oStat?.sMatchStatsTypes] }))
    }
    return oPlayer
  } catch (error) {
    return error
  }
}

controllers.getSimilarPlayerById = async (parent, { input }, context) => {
  try {
    const { _id, nLimit = 10 } = input || {}
    const oPlayer = await PlayersModel.findOne({ _id }).lean()
    if (!oPlayer) _.throwError('notFound', context, 'player')
    let oMatchQuery = {
      sPlayingRole: oPlayer?.sPlayingRole,
      _id: { $ne: _.mongify(oPlayer?._id) },
      eTagStatus: 'a',
      bTagEnabled: true
    }
    const oSort = {}
    if (oPlayer?.sPlayingRole === 'bowl') {
      Object.assign(oSort, { nBowlingPerformancePoint: 1 })
    } else {
      Object.assign(oSort, { nBattingPerformancePoint: -1 })
    }

    oMatchQuery = matchQueryMaking(oPlayer, nLimit, oMatchQuery)
    const nSimilarPlayerCount = await PlayersModel.countDocuments(oMatchQuery).lean()
    let aRemainingSimilarPlayer = []
    if (nSimilarPlayerCount < nLimit) {
      const nRemainingPlayers = nLimit - nSimilarPlayerCount
      aRemainingSimilarPlayer = await PlayersModel.aggregate([
        {
          $match: {
            sPlayingRole: oPlayer?.sPlayingRole,
            _id: { $ne: _.mongify(oPlayer?._id) },
            eTagStatus: 'a',
            bTagEnabled: true
          }
        }, {
          $sample: { size: nRemainingPlayers }
        }, {
          $lookup: {
            from: 'teams',
            localField: 'iPrimaryTeam',
            foreignField: '_id',
            as: 'oPrimaryTeam'
          }
        }, {
          $unwind: { path: '$oPrimaryTeam', preserveNullAndEmptyArrays: true }
        }
      ])
    }

    const aSimilarPlayer = await PlayersModel.find(oMatchQuery).sort(oSort).limit(nLimit).populate('oPrimaryTeam').lean()
    if (aRemainingSimilarPlayer.length) aSimilarPlayer.push(...aRemainingSimilarPlayer)
    return aSimilarPlayer
  } catch (error) {
    return error
  }
}

// controllers.getRecentMatchesOfPlayer = async (parent, { input }, context) => {
//   try {
//     const { _id, nLimit = 5, aFormatStr } = input
//     let aRecentMatch = []

//     const oPlayer = await PlayersModel.findOne({ _id }).lean()
//     if (!oPlayer) _.throwError('notFound', context, 'player')

//     const cachedData = await redis.redisMatchDb.get(`recentMatches:${oPlayer?._id}:${JSON.stringify(aFormatStr)}:${nLimit}`)
//     if (cachedData) {
//       aRecentMatch = JSON.parse(cachedData)
//       return aRecentMatch
//     }

//     let aTeam = await MatchSquadModel.find({ iPlayerId: _.mongify(oPlayer?._id), bPlaying11: true }).lean()

//     aTeam = [...new Set(aTeam?.map((ele) => ele?.iTeamId?.toString()))]

//     if (aTeam.length && aFormatStr.length) {
//       for (const sFormatStr of aFormatStr) {
//         const aTeamId = aTeam.map(ele => _.mongify(ele))
//         const oMatchQuery = {
//           $or: [
//             {
//               'oTeamScoreA.iTeamId': {
//                 $in: aTeamId
//               }
//             }, {
//               'oTeamScoreB.iTeamId': {
//                 $in: aTeamId
//               }
//             }
//           ],
//           sStatusStr: 'completed'
//         }

//         if (sFormatStr === 't20') {
//           Object.assign(oMatchQuery, { $and: [{ $or: oMatchQuery?.$or }, { $or: [{ sFormatStr: 't20i' }, { sFormatStr: 't20' }] }] })
//           delete oMatchQuery.$or
//         }
//         if (sFormatStr === 'odi' || sFormatStr === 'test') Object.assign(oMatchQuery, { sFormatStr })

//         const aMatchData = await MatchesModel.aggregate([
//           {
//             $match: oMatchQuery
//           }, {
//             $sort: {
//               dStartDate: -1
//             }
//           }, {
//             $limit: nLimit
//           }, {
//             $lookup: {
//               from: 'liveinnings',
//               localField: '_id',
//               foreignField: 'iMatchId',
//               as: 'oInningsData'
//             }
//           }, {
//             $unwind: {
//               path: '$oInningsData',
//               preserveNullAndEmptyArrays: true
//             }
//           }, {
//             $match: {
//               $or: [
//                 { 'oInningsData.aBatters.iBatterId': _.mongify(oPlayer?._id) },
//                 { 'oInningsData.aBowlers.iBowlerId': _.mongify(oPlayer?._id) }
//               ]
//             }
//           }, {
//             $lookup: {
//               from: 'venues',
//               localField: 'iVenueId',
//               foreignField: '_id',
//               as: 'oVenue'
//             }
//           }, {
//             $unwind: {
//               path: '$oVenue',
//               preserveNullAndEmptyArrays: true
//             }
//           }, {
//             $project: {
//               _id: 1,
//               'oInningsData.aBatters.iBatterId': 1,
//               'oInningsData.aBatters.bIsBatting': 1,
//               'oInningsData.aBatters.nRuns': 1,
//               'oInningsData.aBatters.sStrikeRate': 1,
//               'oInningsData.aBowlers.iBowlerId': 1,
//               'oInningsData.aBowlers.sOvers': 1,
//               'oInningsData.aBowlers.nRunsConceded': 1,
//               'oInningsData.aBowlers.sEcon': 1,
//               'oInningsData.aBowlers.nWickets': 1,
//               dStartDate: 1,
//               'oVenue._id': 1,
//               'oVenue.sLocation': 1,
//               sFormatStr: 1,
//               sTitle: 1,
//               sShortTitle: 1
//             }
//           }
//         ])
//         aRecentMatch.push({ sFormatStr, aMatchData, sPlayingRole: oPlayer?.sPlayingRole })
//       }
//     }
//     // if (aRecentMatch.length) {
//     //   for (const oRecentMatch of aRecentMatch) {
//     //     const oBattingData = oRecentMatch?.oInningsData?.aBatters.find((oBatter) => oBatter?.iBatterId.toString() === oPlayer?._id.toString())
//     //     const oBowlingData = oRecentMatch?.oInningsData?.aBowlers.find((oBowler) => oBowler?.iBowlerId.toString() === oPlayer?._id.toString())
//     //     Object.assign(oRecentMatch, { oBattingData: oBattingData, oBowlingData: oBowlingData, sPlayingRole: oPlayer?.sPlayingRole })
//     //     const oExistingData = aRecentMatch.find((oMatch, index) => {
//     //       const bIsSecondData = oMatch?.oInningsData?.[oBowlingData ? 'aBatters' : 'aBowlers'].find((oData) => oData?.[oBowlingData ? 'iBatterId' : 'iBowlerId'].toString() === oPlayer?._id.toString()) && oRecentMatch?._id.toString() === oMatch?._id.toString()
//     //       if (bIsSecondData) {
//     //         aRecentMatch.splice(index, 1)
//     //         return true
//     //       }
//     //       return false
//     //     })

//     await redis.redisMatchDb.setex(`recentMatches:${oPlayer?._id}:${JSON.stringify(aFormatStr)}:${nLimit}`, 600, _.stringify(aRecentMatch))
//     return aRecentMatch
//   } catch (error) {
//     return error
//   }
// }

controllers.getRecentMatchesOfPlayer = async (parent, { input }, context) => {
  try {
    const { _id, nLimit = 5, aFormatStr } = input
    let aRecentMatch = []
    const aData = []

    const oPlayer = await PlayersModel.findOne({ _id }).lean()
    if (!oPlayer) _.throwError('notFound', context, 'player')

    // const cachedData = await redis.redisMatchDb.get(`recentMatches:${oPlayer?._id}:${JSON.stringify(aFormatStr)}:${nLimit}`)
    // if (cachedData) {
    //   aRecentMatch = JSON.parse(cachedData)
    //   return aRecentMatch
    // }
    let aTeam = await MatchSquadModel.find({ iPlayerId: _.mongify(oPlayer?._id), bPlaying11: true }).lean()
    aTeam = [...new Set(aTeam?.map((ele) => ele?.iTeamId?.toString()))]

    if (aTeam.length) {
      const aTeamId = aTeam.map(ele => _.mongify(ele))
      for (const sFormatStr of aFormatStr) {
        const oMatchQuery = {
          $or: [
            {
              'oTeamScoreA.iTeamId': {
                $in: aTeamId
              }
            }, {
              'oTeamScoreB.iTeamId': {
                $in: aTeamId
              }
            }
          ],
          sStatusStr: { $nin: ['scheduled', 'live'] }
        }

        if (sFormatStr === 't20') {
          Object.assign(oMatchQuery, { $and: [{ $or: oMatchQuery?.$or }, { $or: [{ sFormatStr: 't20i' }, { sFormatStr: 't20' }] }] })
          delete oMatchQuery.$or
        }
        if (sFormatStr === 'odi' || sFormatStr === 'test') Object.assign(oMatchQuery, { sFormatStr })
        aRecentMatch = await MatchesModel.aggregate([
          {
            $match: oMatchQuery
          }, {
            $lookup: {
              from: 'liveinnings',
              localField: '_id',
              foreignField: 'iMatchId',
              as: 'oInningsData'
            }
          }, {
            $unwind: {
              path: '$oInningsData',
              preserveNullAndEmptyArrays: true
            }
          }, {
            $match: {
              $or: [
                { 'oInningsData.aBatters.iBatterId': _.mongify(oPlayer?._id) },
                { 'oInningsData.aBowlers.iBowlerId': _.mongify(oPlayer?._id) }
              ]
            }
          }, {
            $group: {
              _id: '$_id',
              aInning: { $push: { oInning: '$oInningsData' } },
              aMatch: { $push: { dStartDate: '$dStartDate', iVenueId: '$iVenueId', sFormatStr: '$sFormatStr', sTitle: '$sTitle', sShortTitle: '$sShortTitle' } }
            }
          }, {
            $sort: {
              'aMatch.dStartDate': -1
            }
          }, {
            $limit: nLimit
          }, {
            $lookup: {
              from: 'venues',
              localField: 'aMatch.iVenueId',
              foreignField: '_id',
              as: 'oVenue'
            }
          }, {
            $unwind: {
              path: '$oVenue',
              preserveNullAndEmptyArrays: true
            }
          }, {
            $project: {
              _id: 1,
              'aInning.oInning.aBatters.iBatterId': 1,
              'aInning.oInning.aBatters.bIsBatting': 1,
              'aInning.oInning.aBatters.nRuns': 1,
              'aInning.oInning.aBatters.sStrikeRate': 1,
              'aInning.oInning.aBowlers.iBowlerId': 1,
              'aInning.oInning.aBowlers.sOvers': 1,
              'aInning.oInning.aBowlers.nRunsConceded': 1,
              'aInning.oInning.aBowlers.sEcon': 1,
              'aInning.oInning.aBowlers.nWickets': 1,
              'aMatch.dStartDate': 1,
              'aMatch.sFormatStr': 1,
              'aMatch.sShortTitle': 1,
              'aMatch.sTitle': 1,
              'oVenue._id': 1,
              'oVenue.sLocation': 1,
              'oVenue.sName': 1
            }
          }
        ])
        const aResult = []
        if (aRecentMatch.length) {
          for (const oRecentMatch of aRecentMatch) {
            Object.assign(oRecentMatch, { aBattingData: [], aBowlingData: [] })
            for (const ele of oRecentMatch?.aInning) {
              const oBattingData = ele?.oInning?.aBatters.find((oBatter) => oBatter?.iBatterId.toString() === oPlayer?._id.toString())
              const oBowlingData = ele?.oInning?.aBowlers.find((oBowler) => oBowler?.iBowlerId.toString() === oPlayer?._id.toString())
              if (oBattingData) oRecentMatch?.aBattingData.push(oBattingData)
              if (oBowlingData) oRecentMatch?.aBowlingData.push(oBowlingData)
            }
            delete oRecentMatch?.aInning
            aResult.push(oRecentMatch)
          }
        }
        aData.push({ sFormatStr, aMatchData: aResult, sPlayingRole: oPlayer?.sPlayingRole })
      }
    }
    // await redis.redisMatchDb.setex(`recentMatches:${oPlayer?._id}:${JSON.stringify(aFormatStr)}:${nLimit}`, 600, _.stringify(aData))
    return aData
  } catch (error) {
    return error
  }
}

controllers.getComparisonOfPlayers = async (parent, { input }, context) => {
  try {
    const { iPlayerIdA, iPlayerIdB } = input
    const oMatchTypePriority = {
      test: 1,
      odi: 2,
      t20i: 3,
      t20: 4,
      firstclass: 5,
      lista: 6,
      t10: 7
    }
    const oPlayerAStats = await PlayersModel.findOne({ _id: _.mongify(iPlayerIdA), eTagStatus: 'a' }).populate('oStats').populate('oPrimaryTeam').lean()
    const oPlayerBStats = await PlayersModel.findOne({ _id: _.mongify(iPlayerIdB), eTagStatus: 'a' }).populate('oStats').populate('oPrimaryTeam').lean()

    if (oPlayerAStats?.oStats) oPlayerAStats?.oStats.map(oStat => Object.assign(oStat, { nPriority: oMatchTypePriority[oStat?.sMatchStatsTypes] }))
    if (oPlayerBStats?.oStats) oPlayerBStats?.oStats.map(oStat => Object.assign(oStat, { nPriority: oMatchTypePriority[oStat?.sMatchStatsTypes] }))

    return [oPlayerAStats, oPlayerBStats]
  } catch (error) {
    return error
  }
}

controllers.getTeamByIdFront = async (parent, { input }, context) => {
  try {
    const { _id } = input || {}
    if (!_id) _.throwError('requiredField', context)

    const team = await TeamsModel.findOne({ _id }).lean()
    if (!team) _.throwError('notFound', context, 'team')
    return team
  } catch (error) {
    return error
  }
}

controllers.resolveSeriesMiniScorecard = async (iSeriesId) => {
  try {
    const data = await MiniScorecardsModel.find({ 'oSeries._id': _.mongify(iSeriesId) }).sort({ nPriority: 1 }).lean()

    return data
  } catch (error) {
    return error
  }
}

controllers.resolveShortTeam = async (iId) => {
  try {
    const res = await TeamsModel.findOne({ _id: iId }).lean()
    return res
  } catch (error) {
    return error
  }
}

controllers.resolveShortPlayer = async (iId) => {
  try {
    const res = await PlayersModel.findOne({ _id: iId }).lean()
    return res
  } catch (error) {
    return error
  }
}

controllers.resolveShortVenue = async (iId) => {
  try {
    const res = await VenuesModel.findOne({ _id: iId }).lean()
    return res
  } catch (error) {
    return error
  }
}

controllers.getMatchById = async (parent, { input }, context) => {
  try {
    const { _id } = input || {}
    if (!_id) _.throwError('requiredField', context)

    const data = await MatchesModel.findOne({ _id })
      .populate([
        { path: 'oVenue' },
        { path: 'oSeries' },
        { path: 'oTeamA' },
        { path: 'oTeamB' },
        { path: 'oWinner' },
        { path: 'oToss.oWinnerTeam' },
        { path: 'oTeamScoreA.oTeam' },
        { path: 'oTeamScoreB.oTeam' },
        { path: 'oMom', select: '_id sTitle sShortName sFullName sThumbUrl oImg ' },
        { path: 'oMos', select: '_id sTitle sShortName sFullName sThumbUrl oImg ' }
      ])
      .lean()

    if (!data) _.throwError('notFound', context)

    const aInning = await LiveInningsModel.find({ iMatchId: _.mongify(_id) })
      .populate([
        { path: 'oBattingTeam' },
        { path: 'oFieldingTeam' },
        { path: 'aActiveBatters.oBatter', select: 'sTitle sShortName sFullName eTagStatus oImg iPrimaryTeam', populate: { path: 'oPrimaryTeam', select: 'oJersey' } },
        { path: 'aActiveBowlers.oBowler', select: 'sTitle sShortName sFullName eTagStatus oImg iPrimaryTeam', populate: { path: 'oPrimaryTeam', select: 'oJersey' } },
        { path: 'oLastWicket.oBatter', select: 'sTitle sShortName sFullName eTagStatus oImg iPrimaryTeam', populate: { path: 'oPrimaryTeam', select: 'oJersey' } }
      ]).lean()
    Object.assign(data, { aInning })

    const aMatchSquad = await MatchesSquadModel.find({ iMatchId: _id, bPlaying11: true }).populate({ path: 'oTeam', select: 'oJersey' }).lean()
    if (data?.oMom) Object.assign(data?.oMom, { oPlayingTeam: aMatchSquad.find(oMatchSquad => _.isEqualId(oMatchSquad?.iPlayerId, data?.oMom?._id))?.oTeam })
    if (data?.oMos) Object.assign(data?.oMos, { oPlayingTeam: aMatchSquad.find(oMatchSquad => _.isEqualId(oMatchSquad?.iPlayerId, data?.oMos?._id))?.oTeam })

    return data
  } catch (error) {
    return error
  }
}

controllers.listAllFixturesFilter = async (parent, { input }, context) => {
  try {
    const { eCategory, eStatus, iTeamId, iSeriesId, iVenueId, dByMonth, sTimezone } = input

    const query = {}
    const filter = {}
    if (iTeamId) {
      query.$or = []
      query.$or.push({ 'oTeamScoreA.iTeamId': _.mongify(iTeamId) }, { 'oTeamScoreB.iTeamId': _.mongify(iTeamId) })
    }

    if (iSeriesId) query.iSeriesId = _.mongify(iSeriesId)
    if (iVenueId) query.iVenueId = _.mongify(iVenueId)

    if (dByMonth) {
      query.dStartDate = { $gte: momentZone.tz(dByMonth, 'YYYY-MM-DD hh:mm:ss', sTimezone).startOf('month').utc().toDate(), $lt: momentZone.tz(dByMonth, 'YYYY-MM-DD hh:mm:ss', sTimezone).endOf('month').utc().toDate() }
    } else if (['r', 'u'].includes(eStatus)) {
      if (eStatus === 'u') query.dStartDate = { $gte: moment().utc().toDate(), $lte: moment().add('15', 'days').utc().toDate() }
      if (eStatus === 'r') query.dStartDate = { $lte: moment().utc().toDate(), $gte: moment().subtract('15', 'days').utc().toDate() }
    }

    if (eCategory === 'l') {
      const leagueSeries = await SeriesModel.find({ bIsLeague: true }).select('_id')
      Object.assign(filter, { iSeriesId: { $in: leagueSeries.map((ele) => _.mongify(ele)) } })
    } else {
      query.bIsDomestic = eCategory === 'd'
      Object.assign(filter, { $or: [{ bIsLeague: false }, { bIsLeague: { $exists: false } }] })
    }

    if (eStatus === 'l') query.sStatusStr = 'live'
    if (eStatus === 'u') query.sStatusStr = 'scheduled'
    if (eStatus === 'r') query.sStatusStr = 'completed'

    const aMatch = await MatchesModel.find({ ...query, ...filter }, { iVenueId: 1, iSeriesId: 1, 'oTeamScoreA.iTeamId': 1, 'oTeamScoreB.iTeamId': 1 })
      .sort({ dStartDate: 1 })
      .populate([
        { path: 'oSeries', select: '_id sTitle' },
        { path: 'oVenue', select: '_id sName' },
        { path: 'oTeamA', select: '_id sTitle eTagStatus' },
        { path: 'oTeamB', select: '_id sTitle eTagStatus' }
      ])
      .lean()

    const aVenue = []
    const aTeam = []
    const aSeries = []
    for await (const m of aMatch) {
      if (m.oVenue && (aVenue.findIndex(v => v._id.toString() === m.oVenue._id.toString()) < 0) && m.oVenue.sName !== 'TBA') aVenue.push(m.oVenue)
      if (m.oTeamA && (aTeam.findIndex(t => t._id.toString() === m.oTeamA._id.toString() && m.oTeamA.sTitle !== 'TBA') < 0)) aTeam.push(m.oTeamA)
      if (m.oTeamB && (aTeam.findIndex(t => t._id.toString() === m.oTeamB._id.toString()) < 0) && m.oTeamB.sTitle !== 'TBA') aTeam.push(m.oTeamB)
      if (m.oSeries && (aSeries.findIndex(s => s?._id.toString() === m.oSeries._id.toString()) < 0)) aSeries.push(m.oSeries)
    }

    return { aVenue, aTeam, aSeries }
  } catch (error) {
    return error
  }
}

controllers.listSeriesSquad = async (parent, { input }, context) => {
  try {
    const { iSeriesId, iTeamId } = input
    if (!iSeriesId) _.throwError('requiredField', context, '')

    const query = { iSeriesId: _.mongify(iSeriesId) }
    if (iTeamId) query.iTeamId = _.mongify(iTeamId)

    const seriesSquad = await SeriesSquadModel.find(query).populate([{ path: 'oPlayer' }, { path: 'oTeam' }]).lean()

    return seriesSquad
  } catch (error) {
    return error
  }
}

controllers.getTagDetail = async (data) => {
  try {
    if (data?.__typename === 'oTeams') {
      const team = await TeamsModel.findOne({ sTitle: data?.sTitle })
      return team
    } else {
      const player = await PlayersModel.findOne({ sFullName: data?.sFullName })
      return player
    }
  } catch (error) {
    return error
  }
}

controllers.resolveMiniScorecard = async (iMatchId) => {
  try {
    const match = await MatchesModel.findOne({ _id: _.mongify(iMatchId) }).populate([
      { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini nTotalTeams iCategoryId sSrtTitle' },
      { path: 'oVenue', select: 'sName sLocation' },
      { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg eTagStatus' },
      { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg eTagStatus' },
      { path: 'oWinner', select: '_id sTitle sAbbr oImg' }
    ])
    match.iMatchId = match._id

    return match
  } catch (error) {
    return error
  }
}

controllers.getFiltersForMatchesFront = async (parent, { input }, context) => {
  try {
    const { aCategory, eStatus, aTeamId, aSeriesId, aVenueId, dByMonth, sTimezone, eFilterType } = input

    const query = {}
    const filter = {}
    if (aTeamId?.length) {
      query.$or.push({ 'oTeamScoreA.iTeamId': { $in: aTeamId.map(ele => _.mongify(ele)) } }, { 'oTeamScoreB.iTeamId': { $in: aTeamId.map(ele => _.mongify(ele)) } })
    }

    if (aSeriesId?.length) query.iSeriesId = aSeriesId.map(ele => _.mongify(ele))
    if (aVenueId?.length) query.iVenueId = aVenueId.map(ele => _.mongify(ele))

    if (dByMonth) {
      query.dStartDate = { $gte: momentZone.tz(dByMonth, 'YYYY-MM-DD hh:mm:ss', sTimezone).startOf('month').utc().toDate(), $lt: momentZone.tz(dByMonth, 'YYYY-MM-DD hh:mm:ss', sTimezone).endOf('month').utc().toDate() }
    } else if (['r', 'u'].includes(eStatus)) {
      if (eStatus === 'u') query.dStartDate = { $gte: moment().utc().toDate(), $lte: moment().add('15', 'days').utc().toDate() }
      if (eStatus === 'r') query.dStartDate = { $lte: moment().utc().toDate(), $gte: moment().subtract('15', 'days').utc().toDate() }
    }

    if (aCategory?.length) {
      query.bIsDomestic = aCategory.includes('d')
      if (aCategory.includes('l')) {
        const leagueSeries = await SeriesModel.find({ bIsLeague: true }).select('_id')
        Object.assign(filter, { iSeriesId: { $in: leagueSeries.map((ele) => _.mongify(ele)) } })
      } else if (aCategory.includes('w')) {
        const leagueSeries = await SeriesModel.find({ sCategory: 'women' }).select('_id')
        Object.assign(filter, { iSeriesId: { $in: leagueSeries.map((ele) => _.mongify(ele)) } })
      } else {
        Object.assign(filter, { $or: [{ bIsLeague: false }, { bIsLeague: { $exists: false } }] })
      }
    }

    if (eStatus === 'l') query.sStatusStr = 'live'
    if (eStatus === 'u') query.sStatusStr = 'scheduled'
    if (eStatus === 'r') query.sStatusStr = 'completed'

    const aMatch = await MatchesModel.find({ ...query, ...filter }, { iVenueId: 1, iSeriesId: 1, 'oTeamScoreA.iTeamId': 1, 'oTeamScoreB.iTeamId': 1 })
      .sort({ dStartDate: 1 })
      .populate([
        { path: 'oSeries', select: '_id sTitle' },
        { path: 'oVenue', select: '_id sName' },
        { path: 'oTeamA', select: '_id sTitle eTagStatus' },
        { path: 'oTeamB', select: '_id sTitle eTagStatus' }
      ])
      .lean()

    const aVenue = []
    const aTeam = []
    const aSeries = []
    for await (const m of aMatch) {
      if (m.oVenue && (aVenue.findIndex(v => v._id.toString() === m.oVenue._id.toString()) < 0) && m.oVenue.sName !== 'TBA') aVenue.push(m.oVenue)
      if (m.oTeamA && (aTeam.findIndex(t => t._id.toString() === m.oTeamA._id.toString() && m.oTeamA.sTitle !== 'TBA') < 0)) aTeam.push(m.oTeamA)
      if (m.oTeamB && (aTeam.findIndex(t => t._id.toString() === m.oTeamB._id.toString()) < 0) && m.oTeamB.sTitle !== 'TBA') aTeam.push(m.oTeamB)
      if (m.oSeries && (aSeries.findIndex(s => s?._id.toString() === m.oSeries._id.toString()) < 0)) aSeries.push(m.oSeries)
    }

    const aFormat = [{ sName: 'International', sValue: 'i' }, { sName: 'League', sValue: 'l' }, { sName: 'Domestic', sValue: 'd' }]

    if (eFilterType === 'v') return { aVenue }
    if (eFilterType === 't') return { aTeam }
    if (eFilterType === 's') return { aSeries }
    if (eFilterType === 'f') return { aFormat }
    return { aVenue, aTeam, aSeries, aFormat }
  } catch (error) {
    return error
  }
}

controllers.editMatchImpStatus = async (parent, { input }, context) => {
  try {
    const updateAck = await MatchesModel.updateOne({ _id: input._id }, { bImp: input.bImp })
    if (!updateAck.modifiedCount) _.throwError('notFound', context, 'match')

    return _.resolve('updateSuccess', null, 'match', context)
  } catch (error) {
    return error
  }
}

controllers.dailyHuntWidget = async (parent, { input }, context) => {
  try {
    const { iSeriesId, eType = 'first' } = input
    let response = {}
    const secondWidget = await MatchesModel.find({ iSeriesId: _.mongify(iSeriesId), dStartDate: { $gte: moment().startOf('day'), $lte: moment().endOf('day') } }).populate([
      { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini sSrtTitle nTotalTeams iCategoryId' },
      { path: 'oVenue', select: 'sName sLocation' },
      { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
      { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' }
    ]).sort({ dStartDate: 1 }).limit(2).lean()

    if (!secondWidget.length) {
      // const [match0] = await MatchesModel.aggregate([
      //   {
      //     $match: { iSeriesId: _.mongify(iSeriesId) }
      //   },
      //   {
      //     $addFields: { hour: { $hour: '$dStartDate' } }
      //   },
      //   {
      //     $match: {
      //       dStartDate: { $gte: new Date() },
      //       hour: 10
      //     }
      //   },
      //   {
      //     $limit: 1
      //   },
      //   {
      //     $lookup: {
      //       from: 'series',
      //       localField: 'iSeriesId',
      //       foreignField: '_id',
      //       as: 'oSeries'
      //     }
      //   },
      //   {
      //     $unwind: '$oSeries'
      //   },
      //   {
      //     $lookup: {
      //       from: 'venues',
      //       localField: 'iVenueId',
      //       foreignField: '_id',
      //       as: 'oVenue'
      //     }
      //   },
      //   {
      //     $unwind: '$oVenue'
      //   },
      //   {
      //     $lookup: {
      //       from: 'teams',
      //       localField: 'oTeamScoreA.iTeamId',
      //       foreignField: '_id',
      //       as: 'oTeamScoreA.oTeam'
      //     }
      //   },
      //   {
      //     $unwind: '$oTeamScoreA.oTeam'
      //   },
      //   {
      //     $lookup: {
      //       from: 'teams',
      //       localField: 'oTeamScoreB.iTeamId',
      //       foreignField: '_id',
      //       as: 'oTeamScoreB.oTeam'
      //     }
      //   },
      //   {
      //     $unwind: '$oTeamScoreB.oTeam'
      //   }
      // ])

      // const [match1] = await MatchesModel.aggregate([
      //   {
      //     $match: { iSeriesId: _.mongify(iSeriesId) }
      //   },
      //   {
      //     $addFields: { hour: { $hour: '$dStartDate' } }
      //   },
      //   {
      //     $match: {
      //       dStartDate: { $gte: new Date() },
      //       hour: 14
      //     }
      //   },
      //   {
      //     $limit: 1
      //   },
      //   {
      //     $lookup: {
      //       from: 'series',
      //       localField: 'iSeriesId',
      //       foreignField: '_id',
      //       as: 'oSeries'
      //     }
      //   },
      //   {
      //     $unwind: '$oSeries'
      //   },
      //   {
      //     $lookup: {
      //       from: 'venues',
      //       localField: 'iVenueId',
      //       foreignField: '_id',
      //       as: 'oVenue'
      //     }
      //   },
      //   {
      //     $unwind: '$oVenue'
      //   },
      //   {
      //     $lookup: {
      //       from: 'teams',
      //       localField: 'oTeamScoreA.iTeamId',
      //       foreignField: '_id',
      //       as: 'oTeamScoreA.oTeam'
      //     }
      //   },
      //   {
      //     $unwind: '$oTeamScoreA.oTeam'
      //   },
      //   {
      //     $lookup: {
      //       from: 'teams',
      //       localField: 'oTeamScoreB.iTeamId',
      //       foreignField: '_id',
      //       as: 'oTeamScoreB.oTeam'
      //     }
      //   },
      //   {
      //     $unwind: '$oTeamScoreB.oTeam'
      //   }
      // ])
      // response.push(match0)
      // response.push(match1)
      return {}
    }
    if (secondWidget.length && secondWidget.length > 1) {
      if (eType === 'first') {
        secondWidget[0].iMatchId = secondWidget[0]._id
        response = secondWidget[0]
      } else {
        secondWidget[1].iMatchId = secondWidget[1]._id
        response = secondWidget[1]
      }
      return response
    } else {
      // const [previousNoonMatch] = await MatchesModel.aggregate([
      //   {
      //     $match: { iSeriesId: _.mongify(iSeriesId) }
      //   },
      //   {
      //     $addFields: { hour: { $hour: '$dStartDate' } }
      //   },
      //   {
      //     $match: {
      //       dStartDate: { $lte: new Date() },
      //       hour: 10
      //     }
      //   },
      //   {
      //     $limit: 1
      //   },
      //   {
      //     $lookup: {
      //       from: 'series',
      //       localField: 'iSeriesId',
      //       foreignField: '_id',
      //       as: 'oSeries'
      //     }
      //   },
      //   {
      //     $unwind: '$oSeries'
      //   },
      //   {
      //     $lookup: {
      //       from: 'venues',
      //       localField: 'iVenueId',
      //       foreignField: '_id',
      //       as: 'oVenue'
      //     }
      //   },
      //   {
      //     $unwind: '$oVenue'
      //   },
      //   {
      //     $lookup: {
      //       from: 'teams',
      //       localField: 'oTeamScoreA.iTeamId',
      //       foreignField: '_id',
      //       as: 'oTeamScoreA.oTeam'
      //     }
      //   },
      //   {
      //     $unwind: '$oTeamScoreA.oTeam'
      //   },
      //   {
      //     $lookup: {
      //       from: 'teams',
      //       localField: 'oTeamScoreB.iTeamId',
      //       foreignField: '_id',
      //       as: 'oTeamScoreB.oTeam'
      //     }
      //   },
      //   {
      //     $unwind: '$oTeamScoreB.oTeam'
      //   }
      // ])
      if (eType === 'first') {
        return {}
      } else {
        secondWidget[0].iMatchId = secondWidget[0]._id
        return secondWidget[0]
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
controllers.fetchFantasyPlayerStats = async (parent, { input }, context) => {
  try {
    const { iSeriesId, aTeamId, aSeriesStatsType, nLimit = 10 } = input
    const aSeriesStats = await SeriesStatsTypesModel.find({ eSubType: { $in: aSeriesStatsType } }, { _id: 1, eSubType: 1 }).lean()
    const res = []
    for (const oSeriesStats of aSeriesStats) {
      const aData = await SeriesStatsModel.find({ iSeriesId: _.mongify(iSeriesId), iSeriesStatsId: oSeriesStats?._id.toString(), iTeamId: { $in: aTeamId.map(ele => _.mongify(ele)) } }).sort({ nPriority: 1 }).limit(nLimit).populate([{ path: 'oTeam' }, { path: 'oPlayer' }]).lean().cache(CACHE_5M, `${iSeriesId}:${aTeamId[0]}:${aTeamId[1]}:${oSeriesStats?._id}:${nLimit}`)
      res.push({ eSeriesStatsType: oSeriesStats?.eSubType, aData })
    }
    return res
  } catch (error) {
    return error
  }
}

controllers.getTeamForm = async (parent, { input }, context) => {
  try {
    const { iTeamId, dStartTimestamp, nLimit = 5 } = input

    const query = { $or: [{ 'oTeamScoreA.iTeamId': _.mongify(iTeamId) }, { 'oTeamScoreB.iTeamId': _.mongify(iTeamId) }], sStatusStr: 'completed' }
    if (dStartTimestamp) query.dStartTimestamp = { $lt: +dStartTimestamp }

    const teamMatches = await MatchesModel.find(query).populate([
      { path: 'oVenue' },
      { path: 'oSeries' },
      { path: 'oTeamA' },
      { path: 'oTeamB' },
      { path: 'oWinner' },
      { path: 'oToss.oWinnerTeam' },
      { path: 'oTeamScoreA.oTeam' },
      { path: 'oTeamScoreB.oTeam' },
      { path: 'oMom', select: 'sTitle sShortName sFullName sThumbUrl' },
      { path: 'oMos', select: 'sTitle sShortName sFullName sThumbUrl' }
    ]).sort({ dStartDate: -1 }).limit(parseInt(nLimit)).cache(CACHE_2M, `teamForm:${nLimit}`)

    return teamMatches
  } catch (error) {
    return error
  }
}

controllers.getHeadToHead = async (parent, { input }, context) => {
  try {
    let { iTeamIds, dStartTimestamp, nLimit = 5 } = input
    iTeamIds.length = 2
    iTeamIds = iTeamIds.map(s => _.mongify(s))

    const query = {
      'oTeamScoreA.iTeamId': { $in: iTeamIds },
      'oTeamScoreB.iTeamId': { $in: iTeamIds },
      sStatusStr: 'completed'
    }
    if (dStartTimestamp) query.dStartTimestamp = { $lt: +dStartTimestamp }

    const headToHead = await MatchesModel.find(query).populate([
      { path: 'oVenue' },
      { path: 'oSeries' },
      { path: 'oTeamA' },
      { path: 'oTeamB' },
      { path: 'oWinner' },
      { path: 'oToss.oWinnerTeam' },
      { path: 'oTeamScoreA.oTeam' },
      { path: 'oTeamScoreB.oTeam' },
      { path: 'oMom', select: 'sTitle sShortName sFullName sThumbUrl' },
      { path: 'oMos', select: 'sTitle sShortName sFullName sThumbUrl' }
    ]).sort({ dStartDate: -1 }).limit(parseInt(nLimit)).cache(CACHE_2M, `headToHead:${nLimit}`)

    return headToHead
  } catch (error) {
    return error
  }
}

controllers.getRecentMatchesOfTeam = async (parent, { input }, context) => {
  try {
    const { _id, nLimit = 5, sFormatStr } = input
    const oMatchQuery = {
      $or: [{ 'oTeamScoreA.iTeamId': _.mongify(_id) }, { 'oTeamScoreB.iTeamId': _.mongify(_id) }],
      sStatusStr: { $nin: ['scheduled', 'live'] }
    }
    if (sFormatStr) Object.assign(oMatchQuery, { sFormatStr })
    const aMatch = await MatchesModel.find(oMatchQuery).sort({ dStartTimestamp: -1 }).limit(nLimit).populate('oSeries').populate('oTeamScoreA.oTeam').populate('oTeamScoreB.oTeam').populate('oWinner').lean().cache(CACHE_5M, `teamRecentMatches:${_id}:${nLimit}`)
    return aMatch
  } catch (error) {
    return error
  }
}

controllers.getMatchesBetweenTeams = async (parent, { input }, context) => {
  try {
    const { iTeamIdA, iTeamIdB, nLimit = 10 } = input
    const oMatchQuery = {
      $or: [
        { 'oTeamScoreA.iTeamId': _.mongify(iTeamIdA), 'oTeamScoreB.iTeamId': _.mongify(iTeamIdB) },
        { 'oTeamScoreA.iTeamId': _.mongify(iTeamIdB), 'oTeamScoreB.iTeamId': _.mongify(iTeamIdA) }
      ],
      sStatusStr: 'completed'
    }
    const aMatches = await MatchesModel.find(oMatchQuery).sort({ dStartTimestamp: -1 }).limit(nLimit).populate('oTeamScoreA.oTeam').populate('oTeamScoreB.oTeam').populate('oWinner').lean().cache(CACHE_5M, `matchesBetweenTeams:${iTeamIdA}:${iTeamIdB}:${nLimit}`)
    return aMatches
  } catch (error) {
    return error
  }
}

controllers.getMiniScoreCardHeader = async (parent, { input }, context) => {
  try {
    const aHeaderMiniScoreCard = await MiniScoreCardHeader.find({}).sort({ nPriority: 1 }).populate('oSeries', ['_id', 'sTitle', 'sSrtTitle']).lean()
    return aHeaderMiniScoreCard
  } catch (error) {
    return error
  }
}

controllers.updateMatchForecasting = async (parent, { input }, context) => {
  try {
    const { id } = input
    const nCurrentEpochTime = moment().unix()
    const oMatch = await MatchesModel.findById(id).populate('oVenue').lean()
    if (!oMatch) return _.throwError('notFound', context, 'match')
    const nDifferenceEpochTime = oMatch?.dStartTimestamp - nCurrentEpochTime
    if (Math.ceil(nDifferenceEpochTime / (3600 * 24)) > 5) return _.throwError('notFound', context, 'forecasting')
    if (oMatch?.oVenue?.sVenueKey === '1') return _.throwError('venueTBA', context)
    const axiosRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${parseFloat(oMatch?.oVenue?.sLatitude)}&lon=${parseFloat(oMatch?.oVenue?.sLongitude)}&appid=${OPEN_WEATHER_API_KEY}`)
    if (axiosRes?.data?.cod !== '200') return _.throwError('notFound', context, 'forecasting')
    const aForecastData = axiosRes?.data?.list
    const aForeCastingData = aForecastData.filter(ele => {
      if (oMatch?.dStartTimestamp - ele?.dt < 3600 * 3 && oMatch?.dStartTimestamp - ele?.dt >= 0) {
        return ele
      } else {
        return null
      }
    })
    if (!aForeCastingData?.length) return _.throwError('notFound', context, 'forecasting')
    const oForecast = {
      nTemp: aForeCastingData[0]?.main?.temp - 273.15,
      sDescription: aForeCastingData[0]?.weather[0]?.description,
      nWindSpeed: (aForeCastingData[0]?.wind?.speed * 3600) / 1000,
      nWindDegree: aForeCastingData[0]?.wind?.deg,
      nPOP: aForeCastingData[0]?.pop,
      nHumidity: aForeCastingData[0]?.main?.humidity,
      sIcon: aForeCastingData[0]?.weather[0]?.icon,
      sTimeStamp: aForeCastingData[0]?.dt,
      sDate: aForeCastingData[0]?.dt_txt
    }
    await MatchesOverview.updateOne({ iMatchId: oMatch?._id }, { oForecast }, { upsert: true })
    return { sMessage: 'forecasting data added' }
  } catch (error) {
    return error
  }
}

module.exports = controllers
