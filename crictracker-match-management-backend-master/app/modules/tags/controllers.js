const { players: PlayersModel, teams: TeamsModel, CountryModel, venues: VenuesModel, CountsModel, matches: MatchesModel } = require('../../model/index')
const _ = require('../../../global')
const { getPaginationValues, s3, updateCounts } = require('../../utils')
const { updateTag } = require('./common')
const { eTeamTypeEnum } = require('../../model/enums')
const { getCountryFullName } = require('../match/common')
const cachegoose = require('cachegoose')
const grpcControllers = require('../../grpc/client')
const { CACHE_2M } = require('../../../config')
const { convertAmp } = require('../Common/controllers')

const controllers = {}

controllers.updatePlayerTagStatus = async (parent, { input }, context) => {
  try {
    const { iPlayerId, eStatus } = input
    if (!iPlayerId || !eStatus) _.throwError('requiredField', context)

    const player = await PlayersModel.findOne({ _id: iPlayerId })
    if (!player) _.throwError('notFound', context, 'playerTag')

    const playerParams = {}
    const tagParams = {}

    if (eStatus === 'a' && player.eTagStatus === 'a') _.throwError('playerTagAlreadyApproved', context)
    if (eStatus === 'r' && player.eTagStatus === 'r') _.throwError('playerTagAlreadyRejected', context)

    if (eStatus === 'a' && player.eTagStatus !== 'a') {
      tagParams.sName = player.sFirstName
      tagParams.eType = 'p'
      tagParams.iId = player._id.toString()
      tagParams.eStatus = 'a'

      playerParams.eTagStatus = 'a'
    }

    if (eStatus === 'r') {
      playerParams.eTagStatus = 'r'
      const updateTagParams = {}
      updateTagParams.eType = 'p'
      updateTagParams.eStatus = 'dec'
      updateTagParams._id = player._id.toString()

      const data = await updateTag(updateTagParams, context)
      if (data.isError) _.throwError('wentWrong', context)
    }

    await PlayersModel.updateOne({ _id: player._id }, playerParams)

    return _.resolve('updateSuccess', null, 'playerTag', context)
  } catch (error) {
    return error
  }
}

controllers.updateTeamTagStatus = async (parent, { input }, context) => {
  try {
    const { _id, eStatus } = input
    if (!_id || !eStatus) _.throwError('requiredField', context)

    const team = await TeamsModel.findOne({ _id })
    if (!team) _.throwError('notFound', context, 'playerTag')

    const teamParams = {}
    const tagParams = {}

    if (eStatus === 'a' && team.eTagStatus === 'a') _.throwError('teamTagAlreadyApproved', context)
    if (eStatus === 'r' && team.eTagStatus === 'r') _.throwError('teamTagAlreadyRejected', context)

    if (eStatus === 'a' && team.eTagStatus !== 'a') {
      tagParams.sName = team.sTitle
      tagParams.eType = 't'
      tagParams.iId = team._id.toString()
      tagParams.eStatus = 'a'

      // const data = await createTag(tagParams, context)
      // if (data.isError) _.throwError('wentWrong', context)

      teamParams.eTagStatus = 'a'
    }

    if (eStatus === 'r') {
      teamParams.eTagStatus = 'r'
      const updateTagParams = {}
      updateTagParams.eType = 't'
      updateTagParams.eStatus = 'dec'
      updateTagParams._id = team._id.toString()

      const data = await updateTag(updateTagParams, context)
      if (data.isError) _.throwError('wentWrong', context)
    }

    await PlayersModel.updateOne({ _id: team._id }, teamParams)

    return _.resolve('updateSuccess', null, 'teamTag', context)
  } catch (error) {
    return error
  }
}

controllers.listPlayerTags = async (parent, { input }, context) => {
  try {
    const { aCountryFilter, aRoleFilter, aStatus, eType } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)

    const query = {}
    query.eTagStatus = aStatus?.length ? { $in: aStatus } : { $in: ['a', 'r', 'p'] }
    if (sSearch) {
      query.$or = [
        { sFullName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sFirstName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sShortName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }

    if (aCountryFilter?.length) query.sCountry = { $in: aCountryFilter }
    if (aRoleFilter?.length) query.sPlayingRole = { $in: aRoleFilter }

    if (eType === 't') query.bTagEnabled = true

    const nTotal = await PlayersModel.countDocuments(query)

    const aResults = await PlayersModel.find(query).sort(sorting).skip(nSkip).limit(nLimit)

    return aResults?.length ? { nTotal, aResults } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

controllers.listTeamTags = async (parent, { input }, context) => {
  try {
    const { aCountryFilter, aStatus, eType } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)

    const query = {}
    query.eTagStatus = aStatus?.length ? { $in: aStatus } : { $in: ['a', 'r', 'p'] }
    if (sSearch) {
      query.$or = [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }

    if (aCountryFilter?.length) query.sCountry = { $in: aCountryFilter }

    if (eType === 't') query.bTagEnabled = true

    const nTotal = await TeamsModel.countDocuments(query)
    const aResults = await TeamsModel.find(query).sort(sorting).skip(nSkip).limit(nLimit)

    return aResults?.length ? { nTotal, aResults } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

controllers.editPlayer = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const body = _.pick(input, ['sFullName', 'sPlayingRole', 'oImg', 'sContent', 'sShortName', 'sFirstName', 'sLastName', 'sMiddleName', 'dBirthDate', 'sBirthPlace', 'sCountry', 'sLogoUrl', 'sBattingStyle', 'sBowlingStyle', 'sFieldingPosition', 'iRecentMatchId', 'nRecentAppearance', 'aFantasyPlayerRating', 'nPriority', 'nBattingPerformancePoint', 'nBowlingPerformancePoint', 'sNationality', 'nMatchesPlayed', 'nRuns', 'nWickets', 'sNickName', 'aMajorTeams', 'eTagStatus', 'bTagEnabled', 'sCountryFull', 'sSex'])

    const oOldPlayer = await PlayersModel.findById(_id, { oImg: 1 }).lean()
    if (!oOldPlayer) _.throwError('notFound', context, 'player')

    if (body.sCountry) body.sCountryFull = await getCountryFullName(body.sCountry)
    if (body?.sContent) {
      const sAmpContent = await convertAmp(body?.sContent)
      Object.assign(body, { sAmpContent })
    }
    const oPlayer = await PlayersModel.findOneAndUpdate({ _id }, body, { new: true })

    if (body?.oImg?.sUrl && (oOldPlayer?.oImg?.sUrl !== body?.oImg?.sUrl)) s3.deleteObject(oOldPlayer.oImg.sUrl)

    return _.resolve('updateSuccess', { oData: oPlayer }, 'player', context)
  } catch (error) {
    return error
  }
}

controllers.bulkUpdatePlayerTag = async (parent, { input }, context) => {
  try {
    let { aId } = input
    const { eStatus } = input
    if (!aId?.length || !eStatus) _.throwError('requiredFiled', context)

    aId = aId.map(i => _.mongify(i))

    const data = await PlayersModel.updateMany({ _id: aId }, { eTagStatus: eStatus })
    if (!data.matchedCount) _.throwError('notFound', context, 'playerTag')
    return _.resolve('updateSuccess', null, 'playerTag', context)
  } catch (error) {
    return error
  }
}

controllers.bulkUpdateTeamTag = async (parent, { input }, context) => {
  try {
    let { aId } = input
    const { eStatus } = input
    // const { decodedToken } = context
    if (!aId?.length || !eStatus) _.throwError('requiredFiled', context)

    aId = aId.map(i => _.mongify(i))

    const data = await TeamsModel.updateMany({ _id: aId }, { eTagStatus: eStatus })
    if (!data.matchedCount) _.throwError('notFound', context, 'playerTag')
    return _.resolve('updateSuccess', null, 'teamTag', context)
  } catch (error) {
    return error
  }
}

controllers.getPlayerById = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const oPlayer = await PlayersModel.findOne({ _id }).lean()
    if (!oPlayer) _.throwError('notFound', context, 'player')
    return oPlayer
  } catch (error) {
    return error
  }
}

controllers.listCountry = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)

    const query = {}
    if (sSearch) {
      query.$or = [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }

    const nTotal = await CountryModel.countDocuments(query).lean()
    const aResults = await CountryModel.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()
    return aResults?.length ? { aResults, nTotal } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

controllers.bulkEnableStatus = async (parent, { input }, context) => {
  try {
    const { bStatus, eType } = input
    let { aId } = input
    let type
    if (!aId.length || !eType) _.throwError('requiredField', context)

    aId = aId.map(_id => _.mongify(_id))

    if (eType === 'p') {
      type = 'player'
      await PlayersModel.updateMany({ _id: aId }, { bTagEnabled: bStatus }, { upsert: true })
    }
    if (eType === 't') {
      type = 'team'
      await TeamsModel.updateMany({ _id: aId }, { bTagEnabled: bStatus }, { upsert: true })
    }
    if (eType === 'v') {
      type = 'venue'
      await VenuesModel.updateMany({ _id: aId }, { bTagEnabled: bStatus }, { upsert: true })
    }
    return _.resolve('updateSuccess', null, type, context)
  } catch (error) {
    return error
  }
}

controllers.bulkUpdateOtherTag = async (parent, { input }, context) => {
  try {
    const { eType, eStatus, aId } = input

    if (!eType || !eStatus || !aId.length) _.throwError('requiredField', context)

    const tagParams = {}
    tagParams.eStatus = eStatus

    let model
    if (eType === 'p') {
      tagParams.eType = 'p'
      model = PlayersModel
    }
    if (eType === 't') {
      tagParams.eType = 't'
      model = TeamsModel
    }
    if (eType === 'v') {
      tagParams.eType = 'v'
      model = VenuesModel
    }

    for (const _id of aId) {
      if (eType === 'p') {
        const player = await PlayersModel.findOne({ _id: _.mongify(_id) })
        if (!player.bTagEnabled) _.throwError('tagNotEnabled', context)

        if (player && player.bTagEnabled) {
          tagParams.iId = _.mongify(_id)
          tagParams.sName = player.sFirstName
        }
      }
      if (eType === 't') {
        const team = await TeamsModel.findOne({ _id: _.mongify(_id) })
        if (!team.bTagEnabled) _.throwError('tagNotEnabled', context)
        if (team && team.bTagEnabled) {
          tagParams.iId = _.mongify(_id)
          tagParams.sName = team.sTitle
        }
      }
      if (eType === 'v') {
        const venue = await VenuesModel.findOne({ _id: _.mongify(_id) })
        if (!venue.bTagEnabled) _.throwError('tagNotEnabled', context)
        if (venue && venue.bTagEnabled) {
          tagParams.iId = _.mongify(_id)
          tagParams.sName = venue.sTitle
        }
      }

      if (Object.keys(tagParams).length && tagParams.sName && tagParams.iId) {
        const { decodedToken } = context
        Object.assign(tagParams, { iAdminId: decodedToken?.iAdminId })

        const checkTag = await grpcControllers.isTagExist({ sName: tagParams.sName, iId: tagParams.iId.toString() })
        if (checkTag.bIsExist) _.throwError('tagNameAlreadyExist', context)

        const exist = await model.findOne({ _id }).lean()
        if (!exist) _.throwError('notFound', context, 'tag')

        if (exist.eTagStatus) await model.updateOne({ _id }, { eTagStatus: eStatus })
        cachegoose.clearCache(`tag:${eType}:${_id}`)

        // updateTagStream(tagParams)
        await grpcControllers.createTag(tagParams)
      }
    }

    return _.resolve('updateSuccess', null, 'tag', context)
  } catch (error) {
    return error
  }
}

controllers.editTeam = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sCountry', 'sTitle', 'oImg', 'oJersey'])
    const { eTeamType } = input

    if (eTeamType) {
      if (!eTeamTypeEnum?.value.includes(eTeamType)) _.throwError('invalidTeamType', context)
      body.sTeamType = eTeamType
    }

    const oOldTeam = await TeamsModel.findById(input._id, { oImg: 1 }).lean()
    if (!oOldTeam) _.throwError('notFound', context, 'team')

    if (body.sCountry) body.sCountryFull = await getCountryFullName(body.sCountry)
    const team = await TeamsModel.findByIdAndUpdate(input._id, body, { new: true }).lean()

    if (body?.oImg?.sUrl && (oOldTeam?.oImg?.sUrl !== body?.oImg?.sUrl)) s3.deleteObject(oOldTeam.oImg.sUrl)

    return _.resolve('updateSuccess', { oData: team }, 'team', context)
  } catch (error) {
    return error
  }
}

controllers.getTeamById = async (parent, { input }, context) => {
  try {
    const team = await TeamsModel.findOne({ _id: input._id }).lean()
    if (!team) _.throwError('notFound', context, 'team')
    return team
  } catch (error) {
    return error
  }
}

controllers.getCount = async (parent, { input }, context) => {
  try {
    const { eType } = input
    await updateCounts(eType)
    const res = await CountsModel.findOne({ eType }).lean()
    return res
  } catch (error) {
    return error
  }
}

controllers.getPopularPlayers = async (parent, { input }, context) => {
  try {
    const { nLimit = 10, iPlayerId } = input
    const oMatchQuery = { eTagStatus: 'a' }

    if (iPlayerId) Object.assign(oMatchQuery, { _id: { $ne: iPlayerId } })

    const aPlayer = await PlayersModel.find(oMatchQuery).sort({ nPriority: -1 }).populate('oPrimaryTeam').limit(nLimit).lean()
    return aPlayer
  } catch (error) {
    return error
  }
}

// Teams Mobile Services
controllers.listGlobalTeams = async (parent, { input }, context) => {
  try {
    const { eTeamType = 'i' } = input
    const { nSkip, nLimit } = getPaginationValues(input)

    const sTeamType = 'country'
    const query = { sTeamType, eTagStatus: 'a', sSex: { $ne: 'female' }, sCountry: { $ne: 'int' }, sTitle: { $ne: 'TBA' } }

    if (eTeamType === 'l') {
      query.sTeamType = { $ne: 'country' }
      query.bIsLeague = true
    } else if (eTeamType === 'd') {
      query.sTeamType = 'club'
      query.bIsLeague = false
    } else if (eTeamType === 'w') {
      delete query.sTeamType
      query.sSex = 'female'
    }

    const aTeams = await TeamsModel.find(query).sort({ nPriority: -1, _id: -1 }).skip(nSkip).limit(nLimit).cache(CACHE_2M, `listGlobalTeams:${nSkip}:${nLimit}:${JSON.stringify(query)}`).lean()

    return aTeams
  } catch (error) {
    return error
  }
}

controllers.listScheduleByTeamId = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit } = getPaginationValues(input)
    const { iTeamId } = input

    const schedule = await MatchesModel.find({ $or: [{ 'oTeamScoreA.iTeamId': _.mongify(iTeamId) }, { 'oTeamScoreB.iTeamId': _.mongify(iTeamId) }], sStatusStr: { $in: ['live', 'scheduled'] } }).populate([{ path: 'oSeries' }, { path: 'oTeamScoreA.oTeam' }, { path: 'oTeamScoreB.oTeam' }, { path: 'oVenue' }]).skip(nSkip).limit(nLimit).sort({ dStartDate: 1 }).cache(CACHE_2M, `scheduleByTeamId:${nSkip}:${nLimit}:${iTeamId}`).lean()

    return schedule
  } catch (error) {
    return error
  }
}

controllers.listResultByTeamId = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit } = getPaginationValues(input)
    const { iTeamId } = input

    const result = await MatchesModel.find({ $or: [{ 'oTeamScoreA.iTeamId': _.mongify(iTeamId) }, { 'oTeamScoreB.iTeamId': _.mongify(iTeamId) }], sStatusStr: { $in: ['completed', 'cancelled'] } }).populate([{ path: 'oSeries' }, { path: 'oTeamScoreA.oTeam' }, { path: 'oTeamScoreB.oTeam' }, { path: 'oVenue' }, { path: 'oWinner' }]).skip(nSkip).limit(nLimit).sort({ dStartDate: -1 }).cache(CACHE_2M, `resultByTeamId:${nSkip}:${nLimit}:${iTeamId}`).lean()

    return result
  } catch (error) {
    return error
  }
}

controllers.listFantasyArticlesByTeamId = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit } = getPaginationValues(input)
    const { iTeamId } = input

    const result = MatchesModel.aggregate([
      {
        $match: {
          $or: [
            { 'oTeamScoreA.iTeamId': _.mongify(iTeamId) },
            { 'oTeamScoreB.iTeamId': _.mongify(iTeamId) }
          ],
          bFantasyTips: true
        }
      },
      { $sort: { dStartDate: -1 } },
      { $skip: nSkip },
      { $limit: nLimit },
      {
        $lookup: {
          from: 'fantasyarticles',
          localField: '_id',
          foreignField: 'iMatchId',
          pipeline: [{ $match: { $expr: { $eq: ['$eState', 'pub'] } } }],
          as: 'faData'
        }
      },
      {
        $unwind: '$faData'
      },
      { $replaceRoot: { newRoot: '$faData' } }
    ]).exec()

    return result
  } catch (error) {
    return error
  }
}

module.exports = controllers
