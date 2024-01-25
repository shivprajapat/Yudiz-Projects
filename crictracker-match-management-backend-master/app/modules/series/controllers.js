const { SeriesDataModel, SeriesStandingsModel, SeriesRoundsModel, series: SeriesModel, SeriesTopPlayers, matches: MatchesModel, liveinnings: LiveInningsModel } = require('../../model')
const { getPaginationValues } = require('../../utils/index')
const moment = require('moment')
const { ObjectId } = require('mongoose').Types
const { ALLOW_DISK_USE, CACHE_5M } = require('../../../config')
const momentZone = require('moment-timezone')
const _ = require('../../../global')

const controllers = {}

controllers.fetchSeriesData = async (parent, { input }, context) => {
  try {
    const { iSeriesId } = input
    const data = await SeriesDataModel.findOne({ iSeriesId }, { _id: 0 }).populate({ path: 'aVenues' }).populate({ path: 'aTeams' }).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.fetchSeriesRounds = async (parent, { input }, context) => {
  try {
    const { iSeriesId } = input
    const data = await SeriesRoundsModel.find({ iSeriesId }).sort({ nOrder: 1 }).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.fetchSeriesStandings = async (parent, { input }, context) => {
  try {
    const { iSeriesId, iRoundId, nLimit } = input
    const query = {}
    if (iSeriesId) query.iSeriesId = ObjectId(iSeriesId)
    if (iRoundId) query.iRoundId = iRoundId

    const agg = [
      { $match: query },
      {
        $lookup: {
          from: 'teams',
          localField: 'iTeamId',
          foreignField: '_id',
          as: 'oTeam'
        }
      },
      {
        $lookup: {
          from: 'series_rounds',
          localField: 'iRoundId',
          foreignField: '_id',
          as: 'oRound'
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
      { $unwind: '$oTeam' },
      { $unwind: '$oRound' },
      { $unwind: '$oSeries' },
      {
        $addFields: {
          nNetRunRate: { $toDecimal: '$nNetrr' }
        }
      },
      { $sort: { 'oRound.nOrder': 1, nPoints: -1, nPriority: 1, nNetRunRate: -1 } }
    ]

    if (nLimit) agg.push({ $limit: nLimit })

    const data = await SeriesStandingsModel.aggregate(agg, {
      collation: {
        locale: 'en_US',
        numericOrdering: true
      }
    }).cache(CACHE_5M, `series_standings:${iSeriesId}:${nLimit || 0}`)

    const matchesData = await MatchesModel.find({ iSeriesId })
      .populate([
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
      ])
      .sort({ dStartDate: 1 }).lean()

    matchesData.forEach((ele) => {
      const teamA = ele?.oTeamScoreA?.iTeamId
      const teamB = ele?.oTeamScoreB?.iTeamId
      if (teamA && teamB && ele.oTeamScoreA.sTeamKey !== '111066' && ele.oTeamScoreB.sTeamKey !== '111066') {
        data.map((oData) => {
          const { oTeam } = oData
          if (!oTeam?.aMatch) oTeam.aMatch = []
          if (oTeam._id.toString() === teamA.toString()) oTeam.aMatch.push(ele)
          if (oTeam._id.toString() === teamB.toString()) oTeam.aMatch.push(ele)
          return oData
        })
      }
    })

    return data
  } catch (error) {
    return error
  }
}

controllers.listSeries = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sSearch, sorting } = getPaginationValues(input)

    const query = { eCategoryStatus: 'p' }

    if (sSearch) query.$or = [{ sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }]

    const aResults = await SeriesModel.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()

    const nTotal = await SeriesModel.countDocuments(query)

    return aResults?.length ? { aResults, nTotal } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

controllers.listSeriesTeams = async (parent, { input }, context) => {
  try {
    const { iSeriesId } = input
    const data = await SeriesDataModel.findOne({ iSeriesId }, { iSeriesId: 1, aTeams: 1, _id: 0 })
      .populate({ path: 'aTeams', options: { sort: { sTitle: 1 } } }).lean()

    if (data?.aTeams?.length) data.aTeams = data.aTeams.filter(s => s?.sTitle !== 'TBA')
    return data
  } catch (error) {
    return error
  }
}

controllers.listSeriesTopPlayers = async (parent, { input }, context) => {
  try {
    const { iSeriesId } = input
    const data = await SeriesTopPlayers.find({ iSeriesId }).populate([{ path: 'oTeam' }, { path: 'oPlayer' }, { path: 'oSeries' }, { path: 'oSeriesStatsTypes' }]).lean()

    return data
  } catch (error) {
    return error
  }
}

controllers.getSeriesSearch = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sSearch } = getPaginationValues(input)

    if (!sSearch) return { aResults: [] }

    const query = { $text: { $search: sSearch }, eState: 'pub', eStatus: 'a' }

    const aResults = await SeriesModel.find(query).sort({ dStartDate: -1 }).skip(nSkip).limit(nLimit).lean()

    return { aResults }
  } catch (error) {
    return error
  }
}

controllers.listFixtureSeries = async (parent, { input }, context) => {
  try {
    const { eCategory } = input
    const { sSearch } = getPaginationValues(input)

    const query = {}
    if (eCategory === 'd') Object.assign(query, { sCategory: 'domestic', bIsLeague: { $in: [null, false] } })
    if (eCategory === 'i') Object.assign(query, { sCategory: 'international', bIsLeague: { $in: [null, false] } })
    if (eCategory === 'w') Object.assign(query, { sCategory: 'women', bIsLeague: { $in: [null, false] } })
    if (eCategory === 'l') query.bIsLeague = true

    query.sStatus = { $in: ['live', 'fixture', 'upcoming'] }

    if (sSearch) {
      query.$or = [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sAbbr: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }
    const data = await SeriesModel.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: { $dateToString: { date: '$dStartDate', format: '%Y-%m' } },
          aSeries: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          sMonth: '$_id',
          aSeries: 1
        }
      },
      {
        $sort: { sMonth: 1 }
      }
    ]).allowDiskUse(ALLOW_DISK_USE)

    return data
  } catch (error) {
    return error
  }
}

// front serivice
controllers.listCurrentSeriesDropdown = async (parent, { input }, context) => {
  try {
    const { nLimit = 50, eSubType } = input
    const query = { sStatus: { $in: ['live', 'fixture', 'upcoming'] }, nTotalTeams: { $gt: 2 }, eCategoryStatus: 'a', iCategoryId: { $ne: null } }

    context.eSubType = eSubType

    const data = await SeriesModel.find(query).sort({ dStartDate: 1 }).limit(nLimit).lean()

    return data
  } catch (error) {
    return error
  }
}

controllers.listSeriesArchive = async (parent, { input }, context) => {
  try {
    const { eCategory, dYear, sTimezone } = input
    const { sSearch, nSkip, nLimit } = getPaginationValues(input)

    const query = {}
    if (eCategory === 'd') query.sCategory = 'domestic'
    if (eCategory === 'i') query.sCategory = 'international'
    if (eCategory === 'w') query.sCategory = 'women'
    if (eCategory === 'l') query.bIsLeague = true

    if (dYear) {
      const dStartYear = momentZone.tz(dYear, sTimezone).startOf('year').utc().toDate()
      const dEndYear = momentZone.tz(dYear, sTimezone).endOf('year').utc().toDate()
      query.dStartDate = { $gte: dStartYear, $lt: dEndYear }
    }

    if (sSearch) {
      query.$or = [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sAbbr: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }

    const aResults = await SeriesModel.find(query).sort({ dStartDate: -1 }).skip(nSkip).limit(nLimit)

    return aResults
  } catch (error) {
    return error
  }
}

controllers.listSeriesYear = async (parent, { input }, context) => {
  try {
    // need to optimize
    const data = await SeriesModel.find({}, { dStartDate: 1 })
    const res = [...new Set(data.map(d => moment(d.dStartDate, 'YYYY-MM-DD').format('YYYY')))].sort()
    return res
  } catch (error) {
    return error
  }
}

/**
 * This service is used for admin panel to getting currently live or ongoing series data.
 * @param {*} param1 { input } used for filter purpose
 * @returns This service will return currently ongoing(Live) series list with pagination data.
 */
controllers.listCurrentOngoingSeries = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sSearch } = getPaginationValues(input)

    const query = {}

    if (sSearch) {
      query.$or = [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sAbbr: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }

    const d = new Date()
    d.setDate(d.getDate() - 7)

    query.$or = [{ sStatus: { $in: ['fixture', 'upcoming'] }, dStartDate: { $gt: d } }, { sStatus: 'live' }, { sStatus: 'completed', dEndDate: { $gt: d } }]
    const nTotal = await SeriesModel.countDocuments(query)
    const aResults = await SeriesModel.find(query, { _id: 1, dStartDate: 1, dEndDate: 1, sTitle: 1, sStatus: 1, sAbbr: 1, sSeason: 1 }).sort({ dStartDate: -1 }).skip(nSkip).limit(nLimit).lean()

    return { aResults, nTotal }
  } catch (error) {
    return error
  }
}

controllers.getSeriesByIdFront = async (parent, { input }, context) => {
  try {
    const { _id } = input
    if (!_id) _.throwError('requiredField', context)

    const series = await SeriesModel.findOne({ _id }).lean()
    if (!series) _.throwError('notFound', context, 'series')

    return series
  } catch (error) {
    return error
  }
}

/// remove in future - get formats for stats from series
controllers.listSeriesStatsFormat = async (parent, { input }, context) => {
  try {
    const { iSeriesId } = input
    if (!iSeriesId) _.throwError('requiredField', context)

    const series = await SeriesModel.findOne({ _id: iSeriesId }).lean()

    return series.aFormats || []
  } catch (error) {
    return error
  }
}

controllers.listAllCurrentSeries = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sSearch, sorting } = getPaginationValues(input)
    const { eCategory } = input
    const sortBy = ['indian premier league', 'women\'s premier league', 'india', 'icc', 'ashes', 'australia', 'pakistan', 'england', 'new zealand', 'west indies', 'bangladesh', 'afghanistan', 'sri lanka']

    const query = {}
    Object.assign(query, { $or: [{ sStatus: 'live' }, { sStatus: 'upcoming' }] })
    query.eCategoryStatus = 'a'

    if (eCategory === 'd') query.sCategory = 'domestic'
    if (eCategory === 'i') Object.assign(query, { sCategory: 'international', bIsLeague: false })
    if (eCategory === 'w') query.sCategory = 'women'
    if (eCategory === 'l') query.bIsLeague = true

    if (sSearch) {
      query.$or = [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sAbbr: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }

    const data = await SeriesModel.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()
    const aTrimmedData = _.customSortByPriority({ data, sortBy })

    return { aResults: aTrimmedData?.length ? aTrimmedData : [] }
  } catch (error) {
    return error
  }
}

controllers.listSeriesScorecard = async (parent, { input }, context) => {
  try {
    const { _id } = input

    const series = await SeriesModel.findOne({ _id }).lean()
    if (!series) _.throwError('notFound', context, 'series')

    let allMatches = []
    const resMatch = []

    /// five limit :  3 from future - [live,scheduled] , 2 from past - completed

    const currDate = moment().toDate()

    const countMatch = await MatchesModel.find({ iSeriesId: _.mongify(_id) })
      .sort({ dStartDate: 1 })
      .lean()

    const pastM = countMatch.filter(ele => ele.dStartDate <= currDate)
    const futureM = countMatch.filter(ele => ele.dStartDate >= currDate)

    let pastLimit = 2
    let futureLimit = 3

    if (countMatch.length <= 5) {
      allMatches = await MatchesModel.find({ iSeriesId: _.mongify(_id) })
        .populate([
          { path: 'oSeries' },
          { path: 'oVenue' },
          { path: 'oTeamScoreA.oTeam' },
          { path: 'oTeamScoreB.oTeam' },
          { path: 'oToss.oWinnerTeam' },
          { path: 'oWinner' }
        ])
        .sort({ dStartDate: -1 })
        .limit(5)
        .lean()
    } else {
      if (futureM.length < 3) {
        futureLimit = futureM.length
        pastLimit = (3 - futureLimit) + pastLimit
      }
      if (pastM.length < 2) {
        pastLimit = pastM.length
        futureLimit = (2 - pastLimit) + futureLimit
      }

      if (pastLimit !== 0) {
        const pastMatches = await MatchesModel.find({ iSeriesId: _.mongify(_id), dStartDate: { $lte: currDate } })
          .populate([
            { path: 'oSeries' },
            { path: 'oVenue' },
            { path: 'oTeamScoreA.oTeam' },
            { path: 'oTeamScoreB.oTeam' },
            { path: 'oToss.oWinnerTeam' },
            { path: 'oWinner' }
          ])
          .sort({ dStartDate: -1, dCreated: -1 })
          .limit(pastLimit)
          .lean()

        allMatches.push(...pastMatches)
      }

      if (futureLimit !== 0) {
        const futureMatches = await MatchesModel.find({ iSeriesId: _.mongify(_id), dStartDate: { $gte: currDate } })
          .populate([
            { path: 'oSeries' },
            { path: 'oVenue' },
            { path: 'oTeamScoreA.oTeam' },
            { path: 'oTeamScoreB.oTeam' },
            { path: 'oToss.oWinnerTeam' },
            { path: 'oWinner' }
          ])
          .sort({ dStartDate: 1, dCreated: 1 })
          .limit(futureLimit)
          .lean()

        allMatches.push(...futureMatches)
      }
    }

    for (const m of allMatches) {
      const inning = await LiveInningsModel.findOne({ iMatchId: m._id, nInningNumber: m.nLatestInningNumber }).lean()

      const copyMatch = { ...m }
      copyMatch.iMatchId = m._id
      copyMatch.oToss.iWinnerId = m?.oToss?.iWinnerTeamId
      copyMatch.oToss.sDecision = m?.oToss?.eDecision
      copyMatch.iBattingTeamId = inning?.iBattingTeamId
      copyMatch.iFieldingTeamId = inning?.iFieldingTeamId

      resMatch.push(copyMatch)
    }

    // const aStatus = ['live', 'scheduled', 'completed']
    // const sortByRef = (matches, aStatus) => {
    //   const sorter = (a, b) => {
    //     return aStatus.indexOf(a.sStatusStr) - aStatus.indexOf(b.sStatusStr)
    //   }
    //   return matches.sort(sorter)
    // }

    // const sortedMatches = sortByRef(resMatch, aStatus)

    const sortedMatches = resMatch.sort((a, b) => {
      if (a.sStatusStr === 'scheduled' || a.sStatusStr === 'live') {
        return +a.dStartDate - +b.dStartDate || +b.dStartDate - +a.dStartDate
      } else {
        return +b.dStartDate - +a.dStartDate
      }
    })

    return sortedMatches
    // return resMatch
  } catch (error) {
    return error
  }
}

controllers.listSeriesFantasyTipsFront = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting } = getPaginationValues(input)

    const query = { bFantasyTips: true, iSeriesId: _.mongify(input?.iSeriesId) }

    const aResults = await MatchesModel.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'fantasyarticles',
          localField: '_id',
          foreignField: 'iMatchId',
          pipeline: [{ $match: { eState: 'pub' } }],
          as: 'aFantasyTips'
        }
      },
      {
        $addFields: {
          count: {
            $size: '$aFantasyTips'
          }
        }
      },
      {
        $match: {
          count: {
            $gt: 0
          }
        }
      },
      {
        $sort: sorting
      },
      {
        $skip: nSkip
      },
      {
        $limit: nLimit
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
        $lookup: {
          from: 'teams',
          localField: 'oTeamScoreA.iTeamId',
          foreignField: '_id',
          as: 'oTeamA'
        }
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'oTeamScoreB.iTeamId',
          foreignField: '_id',
          as: 'oTeamB'
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
        $addFields: {
          oSeries: { $arrayElemAt: ['$oSeries', 0] },
          oTeamA: { $arrayElemAt: ['$oTeamA', 0] },
          oTeamB: { $arrayElemAt: ['$oTeamB', 0] },
          oVenue: { $arrayElemAt: ['$oVenue', 0] }
        }
      }
    ])

    return aResults || []
  } catch (error) {
    return error
  }
}

module.exports = controllers
