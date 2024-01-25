const axios = require('axios')
const { fantasyarticles: FantasyArticlesModel, matches: MatchesModel, matchoverviews: MatchOverviewsModel, players: PlayersModel, FantasyArticleComments, seriessquad: SeriesSquadModel, matchsquad: MatchSquadModel, FantasyArticleClapsModel, FantasyPlayersModel, UserCommentsModel } = require('../../model/index')
const _ = require('../../../global')
const { getCategoryIdBySlug } = require('./common')
const moment = require('moment')
const { fantasyArticleViews } = require('../../../global/lib/article-view')
const { readTime } = require('../../../global/lib/read-time-estimate')
const { scheduleArticleTask, getPaginationValues, redis, queuePush } = require('../../utils')
const config = require('../../../config')
const { ePlatformType, eFantasyLeagueType } = require('../../model/enums')
const { convertAmp } = require('../Common/controllers')
const momentZone = require('moment-timezone')
const grpcControllers = require('../../grpc/client')

const controllers = {}

const updateArticleReadTime = async (id) => {
  try {
    const article = await FantasyArticlesModel.findOne({ _id: id })

    if (article) {
      const string = article.sDescription
      const imageCount = 0
      // string: content, customWordTime : 275, customImageTime: 12, imageNumberCount: 5, customTableRowTime: 10, chineseKoreanReadTime: 500
      const {
        duration // 0.23272727272727273
      } = readTime(string, 275, 12, imageCount, 10, 500)
      // console.log(humanizedDuration, duration, totalWords, wordTime, totalImages, imageTime)
      await FantasyArticlesModel.updateOne({ _id: id }, { nDuration: duration })
    }
  } catch (error) {
    return error
  }
}

// fetchMiniScorecardData -> 2 mins.
// fetchFullScorecardData -> 2 mins.
// fetchLiveInningsData -> 2 mins.
// fetchPlayer -> 30 sec.
// listFantasyPlayer -> 1 min.
// fetchFixuresData -> 2 mins.
// listFantasyMatch -> 30 sec.
// fetchVenues -> 2 mins.
// listTeam -> 30 sec.
// fetchSeries -> 2 mins.
// fetchSeriesStats -> 3 mins.
// fetchSeriesStatsTypes (series stats type) -> 3 mins.
// listPlayer -> 30 sec.
// getLiveMatches -> 30 sec.
// listAllFixtures -> 1 min.
// listMatchSquad -> 30 sec.
// getMatchBySlug -> 30 sec.
// getPlayerByIdFront -> 30 sec.
// getTeamByIdFront -> 30 sec.
// listMatchCommentaries -> 1 min.
// listMatchOvers -> 1 min.

// Admin Services
controllers.editFantasyArticle = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'sTitle', 'sSubtitle', 'sSrtTitle', 'sMatchPreview', 'oImg', 'oTImg', 'aCVCFan', 'aTags', 'sEditorNotes', 'oAdvanceFeature', 'eState', 'eVisibility', 'bPriority', 'aTopicPicksFan', 'aBudgetPicksFan', 'oOtherInfo', 'aAvoidPlayerFan', 'iAuthorDId', 'iCategoryId', 'aSeries', 'aPlayer', 'aTeam', 'aVenue', 'sVideoUrl', 'sMustPick', 'aLeague', 'dPublishDate', 'dPublishDisplayDate', 'oSeo', 'sBroadCastingPlatform', 'nPaceBowling', 'nSpinBowling', 'nBattingPitch', 'nBowlingPitch', 'aPollId'])

    if (!body._id) _.throwError('requiredField', context)

    if (body.sTitle?.trim().length > 200 || body.sTitle?.trim().length < 10) _.throwError('formFieldInvalid', context, 'title')
    if (body.sSubtitle?.trim().length >= 200 || body.sSubtitle?.trim().length < 10) _.throwError('formFieldInvalid', context, 'subtitle')
    if (body.sSrtTitle?.trim().length > 60 || body.sSrtTitle?.trim().length < 10) _.throwError('formFieldInvalid', context, 'shortTitle')

    if (!body?.iCategoryId) _.throwError('requiredField', context)

    const article = await FantasyArticlesModel.findOne({ _id: body._id }).lean()
    if (!article) _.throwError('notFound', context, 'fantasyArticle')
    if (!article?.iMatchId) _.throwError('wentWrong', context)

    const match = await MatchesModel.findOne({ _id: article.iMatchId }).lean()
    if (!match) _.throwError('notFound', context, 'match')
    if (!match?.bFantasyTips) _.throwError('fantasyTipsNotEnabled', context)

    // validate fantasy team
    const { aLeague } = body

    if (!aLeague?.length) _.throwError('invalidFantasyTeam', context)

    if (aLeague.length) {
      for (const l of aLeague) {
        if (!l?.eLeague || !l?.aTeam.length) _.throwError('invalidLeague', context)

        l.eLeagueFull = eFantasyLeagueType.description[l.eLeague]
        for (const t of l?.aTeam) {
          if (t?.aSelectedPlayerFan?.length < 1) _.throwError('invalidPlayersLength', context)
          if (!t?.iCapFanId || !t?.iVCFanId) _.throwError('capOrVcCantEmpty', context)
          if ((t?.aSelectedPlayerFan?.findIndex((id) => id === t?.iCapFanId) < 0) || (t?.aSelectedPlayerFan?.findIndex((id) => id === t?.iVCFanId) < 0)) _.throwError('capOrVCShouldSelected', context)

          if (t?.iVCFanId === t?.iCapFanId) _.throwError('capOrVcNotSame')
          const aPlayers = t?.aSelectedPlayerFan
          const aUnique = [...new Set(aPlayers)]
          if (aPlayers?.length !== aUnique?.length) _.throwError('uniquePlayersRequired', context)
        }
      }
    }

    if (article?.eState === 't' && (body.eState === 'd' || body.eState === 'p')) body.iReviewerId = null

    if (body.sMatchPreview) body.sDescription = _.stripHtml(body.sMatchPreview).replace(/\r\n|\n|\r/gm, '').substr(0, 200)

    const { decodedToken } = context
    if (body.eState === 's' && !body.dPublishDate) _.throwError('scheduledDateMissing', context)

    const { iAdminId } = decodedToken
    if (article.eState === 'p' && article.iReviewerId && article?.iReviewerId?.toString() !== iAdminId) _.throwError('fantasyarticleUnderReview', context)

    if ((article?.eState === 't' && body.eState === 'd') || (body.eState === 't')) body.iReviewerId = null
    if (article?.eState === 's' && body.eState !== 'p') _.throwError('cantEditScheduledFantasyArticle', context)
    if (body.eState === 'pub' && ['p', 'cs'].includes(article.eState)) {
      body.dPublishDate = new Date()
      if (!body.dPublishDisplayDate) body.dPublishDisplayDate = body.dPublishDate
    }
    if (body.eState === 'pub' && article.dPublishDate && article.eState === 'pub') {
      delete body?.dPublishDate
      if (body?.dPublishDisplayDate) {
        if (!moment(body.dPublishDisplayDate).isValid()) _.throwError('invalid', context, 'date')
        body.dPublishDisplayDate = moment(body.dPublishDisplayDate).toISOString()
      } else body.dPublishDisplayDate = article.dPublishDate
    }

    if (!['pub', 's'].includes(body.eState)) {
      body.dPublishDate = null
      body.dPublishDisplayDate = null
    }
    if (body.eState === 's') {
      body.dPublishDate = moment(body.dPublishDate).toDate()
      body.dPublishDisplayDate = body.dPublishDate
    }

    if (['d', 'r', 'cr', 't'].includes(article.eState) && ['pub', 's'].includes(body.eState)) _.throwError('invalidFantasyArticleOperation', context)

    if (article.eState === 'r') _.throwError('cantEditRejectedFantasyArticle', context)

    if (article.eState === 'd' && !['p', 'd', 't'].includes(body.eState)) _.throwError('invalidFantasyArticleOperation', context)

    if (article.eState === 'p' && !['p', 'r', 'cr', 'pub', 's', 't'].includes(body.eState)) _.throwError('invalidFantasyArticleOperation', context)

    if (article.eState === 'cr' && !['cr', 'cs', 't'].includes(body.eState)) _.throwError('invalidFantasyArticleOperation', context)

    if (article.eState === 'cs' && !['cr', 'cs', 't', 'r', 'pub', 's'].includes(body.eState)) _.throwError('invalidFantasyArticleOperation', context)

    if (article.eState === 't' && !['d'].includes(body.eState)) _.throwError('invalidFantasyArticleOperation', context)

    if (article.eState === 'pub' && !['t', 'pub'].includes(body.eState)) _.throwError('invalidFantasyArticleOperation', context)

    if (article.eState === 's' && ['p'].includes(body.eState)) {
      body.dPublishDate = null
      body.dPublishDisplayDate = null
    }

    if (['pub', 's', 'r', 'cr', 'cs'].includes(body.eState) && (!article.iReviewerId && !article.dPublishDate)) _.throwError('fantasyArticleNotPicked', context)

    if (body.eState === 's') {
      const isValidDate = moment(body.dPublishDate).isValid()
      if (!isValidDate) _.throwError('invalid', context, 'date')
      if (moment(body.dPublishDate).unix() < moment().unix()) _.throwError('invalidPublishDate', context)
    }

    // invoke scheduler
    if (body.eState === 's') {
      const scheduledTime = moment(body.dPublishDate).unix()
      await scheduleArticleTask({ eType: 'fantasyArticle', data: { _id: article._id, nTimestamp: scheduledTime } }, scheduledTime)
    }

    // set oSeo to active states whenever admin try to revert it
    if (body?.eState === 'pub') {
      Object.assign(body?.oSeo, { eStatus: 'a' })
    }

    if (body?.oAdvanceFeature?.bAmp) {
      if (body?.sMatchPreview) body.sAmpPreview = await convertAmp(body?.sMatchPreview)
      if (body?.sMustPick) body.sAmpMustPick = await convertAmp(body?.sMustPick)
    }

    if (body?.oAdvanceFeature?.bImp) await MatchesModel.updateOne({ _id: article.iMatchId }, { bImp: body.oAdvanceFeature.bImp })
    Object.assign(body, { dModifiedDate: moment().utc() })

    const articleData = await FantasyArticlesModel.findByIdAndUpdate({ _id: body._id }, body, { new: true })
      .populate([
        { path: 'aLeague.aTeam.aSelectedPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aBudgetPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aTopicPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aAvoidPlayerFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aCVCFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oCapFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oVCFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTPFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTeamA.oTeam' },
        { path: 'aLeague.aTeam.oTeamB.oTeam' }
      ]).lean()

    Object.assign(body?.oSeo, { iId: articleData?._id })
    const akg = await grpcControllers.insertSeo(body?.oSeo)
    if (akg.nStatus !== 200) {
      await FantasyArticlesModel.findByIdAndDelete(article?._id).lean()
      _.throwError(akg.sMessage, context, akg?.sPrefix)
    }

    if (body.eState === 't') {
      queuePush('updateSiteMap', { _id: article._id, eType: 'fa', dPublishDate: article.dPublishDate })
      // queuePush('updateEntitySeo', { iId: article._id, eStatus: 'd' })
      await grpcControllers.updateEntitySeo({ iId: article._id, eStatus: 'd' })
    }

    // Update article read time
    await updateArticleReadTime(body._id)

    return _.resolve('updateSuccess', { oData: articleData }, 'fantasyArticle', context)
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.updateFantasyTipsStatus = async (parent, { input }, context) => {
  try {
    const { iMatchId, bStatus } = input

    if (typeof bStatus !== 'boolean') _.throwError('invalidStatusType', context)
    if (!iMatchId) _.throwError('requiredField', context)

    const match = await MatchesModel.findByIdAndUpdate(iMatchId, { bFantasyTips: bStatus }, { new: true })
    if (!match) _.throwError('notFound', context, 'match')

    return _.resolve('updateSuccess', null, 'fantasyTipsStatus', context)
  } catch (error) {
    return error
  }
}

controllers.editPlayerRating = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['iPlayerId', 'iMatchId', 'ePlatform', 'nRating', 'eRole'])
    const { iPlayerId, iMatchId, ePlatform, nRating, eRole } = input

    if (!ePlatformType.value.includes(ePlatform)) _.throwError('invalid', context, 'platformType')

    const player = await PlayersModel.findOne({ _id: iPlayerId }).lean()
    if (!player) _.throwError('notFound', context, 'player')

    const aRating = player?.aFantasyPlayerRating

    let newRating = []
    if (!player?.aFantasyPlayerRating?.length) {
      newRating.push({ ePlatformType: ePlatform, nRating })
    } else {
      newRating = aRating.map(r => {
        if (r.ePlatformType === ePlatform) {
          r.nRating = nRating
        }
        return {
          ePlatformType: r.ePlatformType,
          nRating: r.nRating
        }
      })
    }

    await PlayersModel.updateOne({ _id: _.mongify(iPlayerId) }, { aFantasyPlayerRating: newRating })

    await FantasyPlayersModel.updateOne({ iPlayerId: _.mongify(iPlayerId), iMatchId: _.mongify(iMatchId), ePlatformType: ePlatform }, { nRating, eRole })

    return _.resolve('updateSuccess', null, 'rating', context)
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.listFantasyArticle = async (parent, { input }, context) => {
  try {
    const { iMatchId, eState } = input

    const query = {}
    if (iMatchId) query.iMatchId = iMatchId
    if (eState) query.eState = eState

    const data = await FantasyArticlesModel.find(query)
    return data || []
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.getFantasyArticle = async (parent, { input }, context) => {
  try {
    const { _id } = input

    const data = await FantasyArticlesModel.findOne({ _id })
      .populate([
        {
          path: 'oMatch',
          populate: [{ path: 'oTeamScoreA.oTeam' }, { path: 'oTeamScoreB.oTeam' }, { path: 'oSeries' }, { path: 'oVenue' }]
        },
        { path: 'aBudgetPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aTopicPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aAvoidPlayerFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aCVCFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.aSelectedPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oCapFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oVCFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTPFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTeamA.oTeam' },
        { path: 'aLeague.aTeam.oTeamB.oTeam' }
      ]).lean()

    if (data) {
      const nCommentCount = await UserCommentsModel.countDocuments({ eStatus: { $ne: 'd' }, iArticleId: _.mongify(_id) }).lean()
      Object.assign(data, { nCommentCount })
      Object.assign(data.oAdvanceFeature, { bImp: data?.oMatch?.bImp })
    }

    if (!data) _.throwError('notFound', context, 'fantasyArticle')
    return data
  } catch (error) {
    return error
  }
}

controllers.addMatchOverview = async (parent, { input }, context) => {
  try {
    const { iMatchId, sMatchPreview, sNews, sPitchCondition, sAvgScore, sPitchReport, oTeam1, oTeam2, sWeatherReport, iWinnerTeamId, sWeatherCondition, sOutFieldCondition, sLiveStreaming } = input

    const match = await MatchesModel.findOne({ _id: iMatchId })
    if (!match) _.throwError('notFound', context, 'match')

    if (!iMatchId || !sMatchPreview || !Object.keys(oTeam1)?.length || !Object.keys(oTeam2)?.length || !sMatchPreview) _.throwError('requiredField', context)

    if (!oTeam1.aPlayers?.length || !oTeam2.aPlayers?.length) _.throwError('invalidPlaying11', context)

    if (!oTeam1.aPlayers.includes(oTeam1.iC)) _.throwError('capShouldSelected', context)

    if (!oTeam2.aPlayers.includes(oTeam2.iC)) _.throwError('capShouldSelected', context)

    if (!oTeam1.aPlayers.includes(oTeam1.iWK)) delete oTeam1.iWK

    if (!oTeam1.aPlayers.includes(oTeam1.iVC)) delete oTeam1.iVC

    if (!oTeam2.aPlayers.includes(oTeam2.iVC)) delete oTeam2.iVC

    if (!oTeam2.aPlayers.includes(oTeam2.iWK)) delete oTeam2.iWK

    if (!oTeam1.iTeamId || !oTeam1.iVC || !oTeam1.iC || !oTeam1.iWK || !oTeam2.iTeamId || !oTeam2.iVC || !oTeam2.iC || !oTeam2.iWK) _.throwError('requiredField', context)

    if (oTeam1.iC === oTeam1.iVC || oTeam2.iC === oTeam2.iVC) _.throwError('capOrVcNotSame', context)

    const isExist = await MatchOverviewsModel.findOne({ iMatchId: _.mongify(iMatchId) }).lean()
    if (isExist) _.throwError('alreadyExists', context, 'matchOverview')

    const aSeriesPlayers1 = await SeriesSquadModel.find({ iSeriesId: _.mongify(match.iSeriesId), iTeamId: _.mongify(match.oTeamScoreA.iTeamId) }, { iPlayerId: 1 })

    const aSeriesPlayers2 = await SeriesSquadModel.find({ iSeriesId: _.mongify(match.iSeriesId), iTeamId: _.mongify(match.oTeamScoreB.iTeamId) }, { iPlayerId: 1 })

    const aBenchedPlayers1 = []
    const aBenchedPlayers2 = []

    aSeriesPlayers1.forEach(p => {
      if (!oTeam1.aPlayers.includes(p.iPlayerId.toString())) aBenchedPlayers1.push(p.iPlayerId)
    })
    aSeriesPlayers2.forEach(p => {
      if (!oTeam2.aPlayers.includes(p.iPlayerId.toString())) aBenchedPlayers2.push(p.iPlayerId)
    })

    Object.assign(oTeam1, { aBenchedPlayers: aBenchedPlayers1 })
    Object.assign(oTeam2, { aBenchedPlayers: aBenchedPlayers2 })

    const params = {}

    if (sNews) params.sNews = sNews
    if (sPitchCondition) params.sPitchCondition = sPitchCondition
    if (sAvgScore) params.sAvgScore = sAvgScore
    if (sPitchReport) params.sPitchReport = sPitchReport
    if (sWeatherReport) params.sWeatherReport = sWeatherReport
    if (iWinnerTeamId) params.iWinnerTeamId = iWinnerTeamId
    if (sWeatherCondition) params.sWeatherCondition = sWeatherCondition
    if (sOutFieldCondition) params.sOutFieldCondition = sOutFieldCondition
    if (sLiveStreaming) params.sLiveStreaming = sLiveStreaming

    params.oTeam1 = oTeam1
    params.oTeam2 = oTeam2
    params.iMatchId = iMatchId
    params.sMatchPreview = sMatchPreview

    const overview = await MatchOverviewsModel.create(params)

    const oData = await MatchOverviewsModel.findOne({ _id: overview._id })
      .populate([
        { path: 'oMatch', populate: [{ path: 'oSeries' }, { path: 'oVenue' }] },
        { path: 'oTeam1.oTeam' },
        { path: 'oTeam1.aPlayers' },
        { path: 'oTeam1.aBenchedPlayers' },
        { path: 'oTeam2.oTeam' },
        { path: 'oTeam2.aPlayers' },
        { path: 'oTeam2.aBenchedPlayers' },
        { path: 'oWinnerTeam' }
      ])

    return _.resolve('addSuccess', { oData }, 'matchOverview', context)
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.getMatchOverview = async (parent, { input }, context) => {
  try {
    const { iMatchId } = input

    const oMatch = await MatchesModel.findOne({ _id: iMatchId })
      .populate([
        { path: 'oSeries' },
        { path: 'oVenue' },
        { path: 'oTeamA' },
        { path: 'oTeamB' }
      ]).lean()

    if (!oMatch) _.throwError('notFound', context, 'match')

    const res = { oMatch }

    const oOverview = await MatchOverviewsModel.findOne({ iMatchId: _.mongify(iMatchId) })
      .populate([
        { path: 'oTeam1.oTeam' },
        { path: 'oTeam1.aPlayers' },
        { path: 'oTeam1.aBenchedPlayers' },
        { path: 'oTeam2.oTeam' },
        { path: 'oTeam2.aPlayers' },
        { path: 'oTeam2.aBenchedPlayers' },
        { path: 'oWinnerTeam' }
      ])

    if (oOverview) {
      const aFantasyArticle = await FantasyArticlesModel.find({ iMatchId: _.mongify(iMatchId) })
      Object.assign(oOverview, { aCricPrediction: aFantasyArticle })
      Object.assign(res, { oOverview })
    }

    return res
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.editMatchOverview = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sMatchPreview', 'sNews', 'sPitchCondition', 'sAvgScore', 'sPitchReport', 'oTeam1', 'oTeam2', 'iWinnerTeamId', 'sWeatherReport', 'sOutFieldCondition', 'sWeatherCondition', 'iMatchId', 'sBroadCastingPlatform', 'nPaceBowling', 'nSpinBowling', 'nBattingPitch', 'nBowlingPitch', 'sLiveStreaming'])

    if (body?.nPaceBowling > 100 || body?.nSpinBowling > 100 || body?.nBattingPitch > 100 || body?.nBowlingPitch > 100) _.throwError('percentageShouldBeLessThan100', context)

    if (!body.sMatchPreview || !Object.keys(body.oTeam1)?.length || !Object.keys(body.oTeam2)?.length || !body.sMatchPreview || !body.iMatchId) _.throwError('requiredField', context)

    if (!body.oTeam1.aPlayers?.length || !body.oTeam2.aPlayers?.length) _.throwError('invalidPlaying11', context)

    if (!body.oTeam1.aPlayers.includes(body.oTeam1.iC)) _.throwError('capShouldSelected', context)

    if (!body.oTeam2.aPlayers.includes(body.oTeam2.iC)) _.throwError('capShouldSelected', context)

    if (!body.oTeam1.aPlayers.includes(body.oTeam1.iWK)) delete body.oTeam1.iWK

    if (!body.oTeam1.aPlayers.includes(body.oTeam1.iVC)) delete body.oTeam1.iVC

    if (!body.oTeam2.aPlayers.includes(body.oTeam2.iVC)) delete body.oTeam2.iVC

    if (!body.oTeam2.aPlayers.includes(body.oTeam2.iWK)) delete body.oTeam2.iWK

    if (body.oTeam1.iC === body.oTeam1.iVC || body.oTeam2.iC === body.oTeam2.iVC) _.throwError('capOrVcNotSame', context)

    const match = await MatchesModel.findOne({ _id: body.iMatchId }).lean()
    if (!match) _.throwError('notFound', context, 'match')

    const aSeriesPlayers1 = await SeriesSquadModel.find({ iSeriesId: _.mongify(match.iSeriesId), iTeamId: _.mongify(match.oTeamScoreA.iTeamId) }, { iPlayerId: 1 })

    const aSeriesPlayers2 = await SeriesSquadModel.find({ iSeriesId: _.mongify(match.iSeriesId), iTeamId: _.mongify(match.oTeamScoreB.iTeamId) }, { iPlayerId: 1 })

    const aBenchedPlayers1 = []
    const aBenchedPlayers2 = []

    aSeriesPlayers1.forEach(p => {
      if (!body?.oTeam1?.aPlayers?.includes(p.iPlayerId.toString())) aBenchedPlayers1.push(p.iPlayerId)
    })
    aSeriesPlayers2.forEach(p => {
      if (!body?.oTeam2?.aPlayers?.includes(p.iPlayerId.toString())) aBenchedPlayers2.push(p.iPlayerId)
    })

    if (body.oTeam1) body.oTeam1.aBenchedPlayers = aBenchedPlayers1
    if (body.oTeam2) body.oTeam2.aBenchedPlayers = aBenchedPlayers2

    await MatchOverviewsModel.updateOne({ iMatchId: _.mongify(body.iMatchId) }, body, { upsert: true })

    const oOverview = await MatchOverviewsModel.findOne({ iMatchId: _.mongify(body.iMatchId) })
      .populate([
        { path: 'oTeam1.oTeam' },
        { path: 'oTeam1.aPlayers' },
        { path: 'oTeam1.aBenchedPlayers' },
        { path: 'oTeam2.oTeam' },
        { path: 'oTeam2.aPlayers' },
        { path: 'oTeam2.aBenchedPlayers' },
        { path: 'oWinnerTeam' }
      ]).lean()

    const aFantasyArticle = await FantasyArticlesModel.find({ iMatchId: _.mongify(body.iMatchId) }).lean()
    if (oOverview) Object.assign(oOverview, { aCricPrediction: aFantasyArticle })

    const resData = { oMatch: match, oOverview }

    return _.resolve('editSuccess', { oData: resData }, 'matchOverview', context)
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.createFantasyArticle = async (parent, { input }, context) => {
  try {
    const { iMatchId, ePlatformType } = input
    if (!iMatchId || !ePlatformType) _.throwError('requiredFiled', context)

    const match = await MatchesModel.findOne({ _id: iMatchId }).lean()
    if (!match) _.throwError('notFound', context, 'match')

    const { iAdminId } = context.decodedToken

    const params = {}
    params.iMatchId = _.mongify(iMatchId)
    params.ePlatformType = ePlatformType
    params.iAuthorId = _.mongify(iAdminId)
    params.iAuthorDId = _.mongify(iAdminId)
    params.oAdvanceFeature = {
      bAllowComments: true,
      bAmp: true,
      bFBEnable: true
    }

    const query = {}
    query.ePlatformType = ePlatformType
    query.iMatchId = _.mongify(iMatchId)
    query.eState = { $ne: 't' }
    const existArticle = await FantasyArticlesModel.findOne(query)
    if (existArticle) _.throwError('alreadyExists', context, 'fantasyArticle')

    const oData = await getCategoryIdBySlug(config[ePlatformType], context)

    if (oData.isError) _.throwError('wentWrong', context)
    if (oData?.data?.iId) params.iCategoryId = _.mongify(oData.data.iId)

    const article = await FantasyArticlesModel.create(params)

    // create fantasy players
    const seriesSquad = await SeriesSquadModel.find({
      iSeriesId: _.mongify(match.iSeriesId),
      $or: [{ iTeamId: _.mongify(match?.oTeamScoreA?.iTeamId) }, { iTeamId: _.mongify(match?.oTeamScoreB?.iTeamId) }]
    }).populate([
      { path: 'iPlayerId' }
    ]).lean()

    if (seriesSquad?.length) {
      for (const ss of seriesSquad) {
        const playerParams = {}
        playerParams.iMatchId = match?._id
        playerParams.iPlayerId = ss?.iPlayerId?._id
        playerParams.iTeamId = ss.iTeamId
        playerParams.ePlatformType = ePlatformType
        playerParams.eRole = ss?.iPlayerId?.sPlayingRole || null

        const { aFantasyPlayerRating } = ss?.iPlayerId // obj
        const creditIndex = aFantasyPlayerRating.findIndex(c => c?.ePlatformType === ePlatformType)
        playerParams.nRating = aFantasyPlayerRating[creditIndex]?.nRating || 8 // default player credit

        await FantasyPlayersModel.updateOne({ iMatchId: _.mongify(iMatchId), iPlayerId: _.mongify(playerParams?.iPlayerId), iTeamId: _.mongify(playerParams?.iTeamId), ePlatformType }, playerParams, { upsert: true })
      }
    }

    // Update article read time
    await updateArticleReadTime(article._id)
    return _.resolve('addSuccess', { oData: { _id: article._id, iMatchId: article.iMatchId, ePlatformType: article.ePlatformType } }, 'fantasyArticle', context)
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.pickFantasyArticle = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['iArticleId', 'eType'])
    const { iArticleId, eType } = input
    const { decodedToken } = context

    const article = await FantasyArticlesModel.findOne({ _id: iArticleId })
    if (!article) _.throwError('notFound', context, 'fantasyarticle')
    if (!['p', 'cr', 'pub'].includes(article.eState)) _.throwError('cantPickArticle', context)

    const updateParams = {}
    if (eType === 'p') {
      if (article.iReviewerId) _.throwError('articleAlreadyReview', context)
      updateParams.iReviewerId = _.mongify(decodedToken.iAdminId)
    }
    if (eType === 'o') {
      if (!article.iReviewerId) _.throwError('cantOvertakeArticle', context)
      updateParams.iReviewerId = _.mongify(decodedToken.iAdminId)
    }

    if (eType === 'o') redis.pubsub.publish(`fantasyArticleTakeOver:${article._id}:${article.iReviewerId}`, { fantasyArticleTakeOver: { _id: decodedToken.iAdminId } })
    await FantasyArticlesModel.updateOne({ _id: iArticleId }, updateParams)

    return _.resolve('fantasyArticlePicked', null, null, context)
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.editFantasyDisplayAuthor = async (parent, { input }, context) => {
  try {
    const { iArticleId, iAuthorDId } = input

    const article = await FantasyArticlesModel.findOne({ _id: iArticleId }).lean()
    if (!article) _.throwError('notFound', context, 'fantasyarticle')

    await FantasyArticlesModel.updateOne({ _id: iArticleId }, { iAuthorDId: _.mongify(iAuthorDId) })

    return _.resolve('displayAuthorChange', null, null, context)
  } catch (error) {
    return error
  }
}

// Admin Services --> for author and publisher
controllers.createFantasyArticleComment = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['iArticleId', 'iReceiverId', 'sMessage', 'dSentDate', 'aPic'])
    const { decodedToken } = context
    const { iArticleId, iReceiverId, sMessage, aPic } = input
    if (!iReceiverId || !iArticleId) _.throwError('requiredField', context)
    if ((sMessage && aPic?.length) || (!sMessage && !aPic?.length)) _.throwError('textOrImage', context)

    const article = await FantasyArticlesModel.findOne({ _id: iArticleId })
    if (!article) _.throwError('notFound', context, 'article')

    const commentParams = {}

    if (sMessage) commentParams.sMessage = sMessage
    if (aPic?.length) commentParams.aPic = aPic
    commentParams.iReceiverId = iReceiverId
    commentParams.iSenderId = decodedToken.iAdminId
    commentParams.dSentDate = Date.now()
    commentParams.iArticleId = _.mongify(iArticleId)

    const oData = await FantasyArticleComments.create(commentParams)

    return _.resolve('addSuccess', { oData }, 'comment', context)
  } catch (error) {
    return error
  }
}

// Admin Services -> comments for author and publisher
controllers.listFantasyArticleComment = async (parent, { input }, context) => {
  try {
    const { iArticleId, nOrder } = input

    const isExist = await FantasyArticlesModel.findOne({ _id: iArticleId }).lean()
    if (!isExist) _.throwError('notFound', context, 'article')

    const { nSkip, nLimit } = getPaginationValues(input)

    const aResults = await FantasyArticleComments.find({ iArticleId: _.mongify(iArticleId) }).sort({ dCreated: nOrder }).skip(nSkip).limit(nLimit)
    const nTotal = await FantasyArticleComments.countDocuments({ iArticleId: _.mongify(iArticleId) })

    return aResults.length ? { aResults, nTotal } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.deleteFantasyArticle = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const fantasyArticle = await FantasyArticlesModel.findOne({ _id })
    if (!fantasyArticle) _.throwError('notFound', context, 'fantasyArticle')

    if (fantasyArticle.eState === 't') _.throwError('alreadyDeleted', context, 'fantasyArticle')

    await FantasyArticlesModel.updateOne({ _id }, { eState: 't' })

    queuePush('updateSiteMap', { _id, eType: 'fa', dPublishDate: fantasyArticle.dPublishDate })

    return _.resolve('deleteSuccess', null, 'fantasyArticle', context)
  } catch (error) {
    return error
  }
}

controllers.copyFantasyArticle = async (parent, { input }, context) => {
  try {
    const { _id, ePlatformType } = input

    const fantasyArticle = await FantasyArticlesModel.findOne({ _id })
      .populate([
        { path: 'aBudgetPicksFan.oPlayerFan' },
        { path: 'aTopicPicksFan.oPlayerFan' },
        { path: 'aAvoidPlayerFan.oPlayerFan' },
        { path: 'aCVCFan.oPlayerFan' },
        { path: 'aLeague.aTeam.aSelectedPlayerFan' },
        { path: 'aLeague.aTeam.oCapFan' },
        { path: 'aLeague.aTeam.oVCFan' },
        { path: 'aLeague.aTeam.oTPFan' }
      ]).lean()

    if (!fantasyArticle) _.throwError('notFound', context, 'fantasyArticle')
    const aArticles = await FantasyArticlesModel.find({ iMatchId: _.mongify(fantasyArticle.iMatchId), eState: { $nin: ['t', 'r'] }, ePlatformType })

    const match = await MatchesModel.findOne({ _id: _.mongify(fantasyArticle?.iMatchId) }).lean()
    if (!match) _.throwError('notFound', context, 'match')

    for (const ar of aArticles) {
      if (ar.ePlatformType === ePlatformType) _.throwError('platformAlreadyExist', context)
    }

    const copyParams = { ...fantasyArticle }

    delete copyParams._id
    delete copyParams.iReviewerId
    delete copyParams.dCreated
    delete copyParams.dUpdated

    copyParams.eState = 'd'
    copyParams.ePlatformType = ePlatformType

    const data = await getCategoryIdBySlug(config[ePlatformType], context)
    if (data.isError) _.throwError('categoryError', context)

    if (data?.data?.iId) copyParams.iCategoryId = _.mongify(data?.data?.iId)

    // create fantasyPlayer for copied article

    // create fantasy players
    const seriesSquad = await SeriesSquadModel.find({
      iSeriesId: _.mongify(match.iSeriesId),
      $or: [{ iTeamId: _.mongify(match?.oTeamScoreA?.iTeamId) }, { iTeamId: _.mongify(match?.oTeamScoreB?.iTeamId) }]
    }).populate([
      { path: 'iPlayerId' }
    ]).lean()

    if (seriesSquad?.length) {
      for (const ss of seriesSquad) {
        const playerParams = {}
        playerParams.iMatchId = match?._id
        playerParams.iPlayerId = ss?.iPlayerId?._id
        playerParams.iTeamId = ss.iTeamId
        playerParams.ePlatformType = ePlatformType
        playerParams.eRole = ss?.iPlayerId?.sPlayingRole || null

        const { aFantasyPlayerRating } = ss?.iPlayerId // obj
        const creditIndex = aFantasyPlayerRating.findIndex(c => c?.ePlatformType === ePlatformType)
        playerParams.nRating = aFantasyPlayerRating[creditIndex]?.nRating || 8 // default player credit

        await FantasyPlayersModel.updateOne({ iMatchId: _.mongify(match._id), iPlayerId: _.mongify(playerParams?.iPlayerId), iTeamId: _.mongify(playerParams?.iTeamId), ePlatformType }, playerParams, { upsert: true })
      }
    }

    // replace copy article players with copied article players

    const aNewFanPlayer = await FantasyPlayersModel.find({ iMatchId: _.mongify(match._id), ePlatformType }).lean()

    for (const leg of copyParams.aLeague) {
      for (const t of leg.aTeam) {
        // if (ePlatformType !== 'ew') {
        //   t.aSelectedPlayerFan = t?.aSelectedPlayerFan?.filter((ele) => ele?.iPlayerId?.toString() !== t?.oTPFan?.iPlayerId?.toString())
        //   delete t?.iTPFanId
        // }

        t.aSelectedPlayerFan = t?.aSelectedPlayerFan?.map((ele) => {
          const replaceId = aNewFanPlayer.find(id => ele?.iPlayerId?.toString() === id?.iPlayerId?.toString())
          return replaceId?._id
        })

        const replaceVC = aNewFanPlayer.find(id => id.iPlayerId.toString() === t.oVCFan.iPlayerId.toString())
        t.iVCFanId = replaceVC._id

        const replaceC = aNewFanPlayer.find(id => id.iPlayerId.toString() === t.oCapFan.iPlayerId.toString())
        t.iCapFanId = replaceC._id

        // if (t?.iTPFanId) {
        //   const replaceTP = aNewFanPlayer.find(id => id.iPlayerId.toString() === t.oTPFan.iPlayerId.toString())
        //   t.iTPFanId = replaceTP._id
        // }

        // replace fantasyPlayer
      }
    }

    // replace players from other fields

    copyParams.aCVCFan = copyParams.aCVCFan.map(ele => {
      const newId = aNewFanPlayer.find(id => id?.iPlayerId?.toString() === ele?.oPlayerFan?.iPlayerId?.toString())
      return { ...ele, iPlayerFanId: newId._id }
    })

    copyParams.aTopicPicksFan = copyParams.aTopicPicksFan.map(ele => {
      const newId = aNewFanPlayer.find(id => id?.iPlayerId?.toString() === ele?.oPlayerFan?.iPlayerId?.toString())
      return { ...ele, iPlayerFanId: newId._id }
    })

    copyParams.aBudgetPicksFan = copyParams.aBudgetPicksFan.map(ele => {
      const newId = aNewFanPlayer.find(id => id?.iPlayerId?.toString() === ele?.oPlayerFan?.iPlayerId?.toString())
      return { ...ele, iPlayerFanId: newId._id }
    })

    copyParams.aAvoidPlayerFan = copyParams.aAvoidPlayerFan.map(ele => {
      const newId = aNewFanPlayer.find(id => id?.iPlayerId?.toString() === ele?.oPlayerFan?.iPlayerId?.toString())
      return { ...ele, iPlayerFanId: newId._id }
    })

    const oData = await FantasyArticlesModel.create(copyParams)

    const seoParams = {
      iId: oData._id.toString(),
      sSlug: `${config[ePlatformType]}-${oData?.sTitle}`,
      eType: 'fa'
    }

    // queuePush('addSeoData', seoParams)
    const dataRes = await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
    if (dataRes?.data?.status !== 200) _.throwError('wentWrong', context)

    return _.resolve('fantasyArticleCopied', { oData }, null, context)
  } catch (error) {
    return error
  }
}

// front service
controllers.getFantasyTipsFront = async (parent, { input }, context) => {
  try {
    const { iMatchId, ePlatformType } = input

    if (!iMatchId || !ePlatformType) _.throwError('requiredField', context)

    const match = await MatchesModel.findOne({ _id: iMatchId })
      .populate([
        { path: 'oTeamA', select: '_id sTitle sAbbr oImg oJersey' },
        { path: 'oTeamB', select: '_id sTitle sAbbr oImg oJersey' }
      ])
      .lean()
    if (!match) _.throwError('notFound', context, 'match')

    const fantasyArticle = await FantasyArticlesModel.findOne({ iMatchId: _.mongify(iMatchId), ePlatformType, eState: 'pub' })
      .populate([
        { path: 'oMatch', populate: [{ path: 'oTeamScoreA.oTeam' }, { path: 'oTeamScoreB.oTeam' }] },
        { path: 'aLeague.aTeam.aSelectedPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oCapFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oVCFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTeamA.oTeam' },
        { path: 'aLeague.aTeam.oTeamB.oTeam' },
        { path: 'aLeague.aTeam.oTPFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] }
      ])
      .lean()

    const resObj = {}
    resObj.oTeamA = match.oTeamA
    resObj.oTeamB = match.oTeamB

    Object.assign(resObj, fantasyArticle)

    return resObj
  } catch (error) {
    return error
  }
}

// front service
controllers.getMatchInfoFront = async (parent, { input }, context) => {
  try {
    const { iMatchId } = input
    if (!iMatchId) _.throwError('requiredField', context)

    const match = await MatchesModel.findOne({ _id: iMatchId })
      .populate([
        { path: 'oSeries' },
        { path: 'oVenue' },
        { path: 'oTeamA' },
        { path: 'oTeamB' },
        { path: 'oToss.oWinnerTeam' }
      ])
      .lean()
    if (!match) _.throwError('notFound', context, 'match')

    const info = await MatchOverviewsModel.findOne({ iMatchId: _.mongify(iMatchId) }, { sPitchCondition: 1, sWeatherReport: 1, sAvgScore: 1, iWinnerTeamId: 1 }).populate([{ path: 'oWinnerTeam' }]).lean()

    const response = {
      oMatch: match,
      sPitchCondition: info?.sPitchCondition,
      sWeatherReport: info?.sWeatherReport,
      sAvgScore: info?.sAvgScore,
      oWinnerTeam: info?.oWinnerTeam
    }

    let matchsquad1
    let matchsquad2

    matchsquad1 = await MatchSquadModel.find({ iMatchId: _.mongify(iMatchId), iTeamId: _.mongify(match?.oTeamA?._id) }).populate({ path: 'oPlayer' }).lean()
    if (!matchsquad1?.length) matchsquad1 = await SeriesSquadModel.find({ iSeriesId: match.iSeriesId, iTeamId: _.mongify(match?.oTeamA?._id) }).populate({ path: 'oPlayer' }).lean()

    response.oTeam1 = {
      oTeam: match?.oTeamA,
      aPlayers: matchsquad1 || []
    }

    matchsquad2 = await MatchSquadModel.find({ iMatchId: _.mongify(iMatchId), iTeamId: _.mongify(match?.oTeamB?._id) }).populate({ path: 'oPlayer' }).lean()

    if (!matchsquad2?.length) matchsquad2 = await SeriesSquadModel.find({ iSeriesId: match.iSeriesId, iTeamId: _.mongify(match?.oTeamB?._id) }).populate({ path: 'oPlayer' }).lean()

    response.oTeam2 = {
      oTeam: match?.oTeamB,
      aPlayers: matchsquad2 || []
    }
    return response
  } catch (error) {
    return error
  }
}

// front service
controllers.listMatchFantasyTipsFront = async (parent, { input }, context) => {
  try {
    const { dDay, eFormat, sTimezone, sSearch } = input || {}
    let { nOrder } = input || {}
    const { nSkip, nLimit } = getPaginationValues(input)

    if (!nOrder) nOrder = 1
    const sorting = { bImp: -1, dStartDate: nOrder }

    const query = { bFantasyTips: true }

    const dStartDay = momentZone.tz(dDay, sTimezone).startOf('day').utc().toDate()
    const dEndDay = momentZone.tz(dDay, sTimezone).endOf('day').utc().toDate()

    if (dDay) query.dStartDate = { $gte: dStartDay, $lt: dEndDay }
    if (eFormat) query.sFormatStr = eFormat
    if (sSearch) Object.assign(query, { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } })

    let aResults = await MatchesModel.find(query)
      .populate([
        { path: 'aFantasyTips', match: { eState: 'pub' }, select: 'ePlatformType' },
        { path: 'oSeries', select: 'sTitle sGameFormat sCategory sSeason dStartDate dEndDate sCountry sStatus _id iCategoryId' },
        { path: 'oVenue', select: 'sName sLocation' },
        { path: 'oTeamA', select: 'sTitle sAbbr oImg' },
        { path: 'oTeamB', select: 'sTitle sAbbr oImg' }
      ]).sort(sorting).skip(nSkip).limit(nLimit).lean()

    aResults = _.customSortByPriority({ data: aResults, sortBy: ['indian premier league'] })

    return aResults?.length ? { aResults } : { aResults: [] }
  } catch (error) {
    return error
  }
}

// front service
controllers.listFrontFantasyArticle = async (parent, { input }, context) => {
  try {
    const { iId } = input
    const { nSkip, nLimit, sorting } = getPaginationValues(input)

    const query = {
      eState: 'pub'
    }
    if (iId) query.iCategoryId = iId

    const nTotal = await FantasyArticlesModel.countDocuments(query)
    let aResults = await FantasyArticlesModel.find(query).sort(sorting).skip(nSkip).limit(nLimit).populate([{ path: 'oMatch', populate: { path: 'oSeries' } }]).lean()
    const cusTomSorting = ({ data, sortBy, sortType = 'asc' }) => {
      const sortByObject = sortBy.reduce((obj, item, index) => {
        return {
          ...obj,
          [item]: index
        }
      }, {})
      return data.sort((a, b) => {
        let aSort
        for (let i = 0; i < sortBy.length; i++) {
          if (a?.oMatch?.oSeries?.sTitle.toLowerCase().includes(sortBy[i])) {
            aSort = sortByObject[sortBy[i]]
            break
          }
        }
        if (typeof aSort !== 'number') aSort = Number(a?.oMatch?.dStartTimestamp)

        let bSort
        for (let i = 0; i < sortBy.length; i++) {
          if (b?.oMatch?.oSeries?.sTitle.toLowerCase().includes(sortBy[i])) {
            bSort = sortByObject[sortBy[i]]
            break
          }
        }
        if (typeof bSort !== 'number') bSort = Number(b?.oMatch?.dStartTimestamp)
        return sortType === 'asc' ? aSort - bSort : bSort - aSort
      })
    }
    aResults = cusTomSorting({ data: aResults, sortBy: ['indian premier league'] })
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

// front service
controllers.listFrontTagCategoryFantasyArticle = async (parent, { input }, context) => {
  try {
    let { iId } = input
    const { nSkip, nLimit, sorting } = getPaginationValues(input)

    let query = {
      eState: 'pub'
    }
    if (iId) {
      iId = _.mongify(iId)
      query = {
        ...query,
        $or: [
          { iCategoryId: iId },
          { aTags: { $in: [iId] } },
          { aSeries: { $in: [iId] } },
          { aPlayer: { $in: [iId] } },
          { aTeam: { $in: [iId] } },
          { aVenue: { $in: [iId] } }
        ]
      }
    }

    const nTotal = await FantasyArticlesModel.countDocuments(query)
    const aResults = await FantasyArticlesModel.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

// front service
controllers.getFrontFantasyArticle = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const query = {
      _id,
      eState: 'pub'
    }
    const article = await FantasyArticlesModel.findOne(query)
      .populate([
        {
          path: 'oMatch',
          populate: [{ path: 'oTeamA' }, { path: 'oTeamB' }, { path: 'oSeries' }, { path: 'oVenue' }]
        },
        { path: 'aBudgetPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aTopicPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aAvoidPlayerFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aCVCFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.aSelectedPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oCapFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oVCFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTPFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTeamA.oTeam' },
        { path: 'aLeague.aTeam.oTeamB.oTeam' },
        {
          path: 'oOverview',
          populate: [
            { path: 'oTeam1.oTeam' },
            { path: 'oTeam1.aPlayers' },
            { path: 'oTeam1.aBenchedPlayers' },
            { path: 'oTeam2.oTeam' },
            { path: 'oTeam2.aPlayers' },
            { path: 'oTeam2.aBenchedPlayers' },
            { path: 'oWinnerTeam' }
          ]
        }
      ]).lean()
    if (!article) _.throwError('notFound', context, 'fantasyArticle')
    // set articale view count

    const { ip } = context

    fantasyArticleViews(article, ip)

    const nCommentCount = await UserCommentsModel.countDocuments({ eStatus: 'a', iArticleId: _.mongify(_id) }).lean()
    Object.assign(article, { nCommentCount })

    return article
  } catch (error) {
    return error
  }
}

// Admin Services
controllers.getPreviewFantasyArticleFront = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const query = {
      _id
    }
    const article = await FantasyArticlesModel.findOne(query)
      .populate([
        {
          path: 'oMatch',
          populate: [{ path: 'oTeamA' }, { path: 'oTeamB' }, { path: 'oSeries' }, { path: 'oVenue' }]
        },
        { path: 'aBudgetPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aTopicPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aAvoidPlayerFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aCVCFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.aSelectedPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oCapFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oVCFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTPFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTeamA.oTeam' },
        { path: 'aLeague.aTeam.oTeamB.oTeam' },
        {
          path: 'oOverview',
          populate: [
            { path: 'oTeam1.oTeam' },
            { path: 'oTeam1.aPlayers' },
            { path: 'oTeam1.aBenchedPlayers' },
            { path: 'oTeam2.oTeam' },
            { path: 'oTeam2.aPlayers' },
            { path: 'oTeam2.aBenchedPlayers' },
            { path: 'oWinnerTeam' }
          ]
        }
      ]).lean()
    if (!article) _.throwError('notFound', context, 'fantasyArticle')

    return article
  } catch (error) {
    return error
  }
}

// front service
controllers.getOverviewFront = async (parent, { input }, context) => {
  try {
    const { iMatchId } = input

    if (!iMatchId) _.throwError('requiredField', context)

    const match = await MatchesModel.findOne({ _id: iMatchId }).lean()
    if (!match) _.throwError('notFound', context, 'match')

    let overview = await MatchOverviewsModel.findOne({ iMatchId: _.mongify(iMatchId) })
      .populate([
        { path: 'oTeam1.oTeam' },
        { path: 'oTeam1.aPlayers' },
        { path: 'oTeam1.aBenchedPlayers' },
        { path: 'oTeam2.oTeam' },
        { path: 'oTeam2.aPlayers' },
        { path: 'oTeam2.aBenchedPlayers' }
      ])

    if (!overview) overview = {}
    if (overview) {
      const aFantasyArticle = await FantasyArticlesModel.find({ iMatchId: _.mongify(iMatchId), eState: 'pub' }).lean()
      Object.assign(overview, { aCricPrediction: aFantasyArticle || [] })
    }
    return overview
  } catch (error) {
    return error
  }
}

controllers.getAuthorFantasyArticles = async (parent, { input }, context) => {
  try {
    if (!input.iAuthorDId) return _.throwError('requiredField', context)
    const { iAuthorDId } = input

    const query = { eState: 'pub', iAuthorDId }

    const { nSkip, nLimit, sorting } = getPaginationValues(input)

    const nTotal = await FantasyArticlesModel.countDocuments(query)
    const aResults = await FantasyArticlesModel.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

// front service
controllers.getMatchOverviewFront = async (parent, { input }, context) => {
  try {
    const { iMatchId } = input
    if (!iMatchId) _.throwError('requiredField', context)

    const match = await MatchesModel.findOne({ _id: iMatchId })
      .populate([
        { path: 'oTeamA' },
        { path: 'oTeamB' }])
      .lean()

    if (!match) _.throwError('notFound', context, 'match')

    const info = await MatchOverviewsModel.findOne({ iMatchId: _.mongify(iMatchId) }).populate([
      { path: 'oWinnerTeam' }
    ]).lean()

    const aFantasyArticle = await FantasyArticlesModel.find({ iMatchId: _.mongify(iMatchId), eState: 'pub' }, { ePlatformType: 1 })

    const response = {
      sMatchPreview: info?.sMatchPreview,
      sPitchCondition: info?.sPitchCondition,
      sWeatherReport: info?.sWeatherReport,
      sAvgScore: info?.sAvgScore,
      oWinnerTeam: info?.oWinnerTeam,
      aCricPrediction: aFantasyArticle || [],
      sBroadCastingPlatform: info?.sBroadCastingPlatform,
      nPaceBowling: info?.nPaceBowling,
      nSpinBowling: info?.nSpinBowling,
      nBattingPitch: info?.nBattingPitch,
      nBowlingPitch: info?.nBowlingPitch
    }

    let matchsquad1
    let matchsquad2

    matchsquad1 = await MatchSquadModel.find({ iMatchId: _.mongify(iMatchId), iTeamId: _.mongify(match?.oTeamA?._id) }).populate({ path: 'oPlayer' }).sort({ nPriority: 1 }).lean()
    // if match squad doesnt exist then series squad
    if (!matchsquad1?.length) matchsquad1 = await SeriesSquadModel.find({ iSeriesId: match.iSeriesId, iTeamId: _.mongify(match?.oTeamA?._id) }).populate({ path: 'oPlayer' }).lean()

    response.oTeam1 = {
      oTeam: match?.oTeamA,
      aPlayers: matchsquad1 || []
    }

    matchsquad2 = await MatchSquadModel.find({ iMatchId: _.mongify(iMatchId), iTeamId: _.mongify(match?.oTeamB?._id) }).populate({ path: 'oPlayer' }).sort({ nPriority: 1 }).lean()

    if (!matchsquad2?.length) matchsquad2 = await SeriesSquadModel.find({ iSeriesId: match.iSeriesId, iTeamId: _.mongify(match?.oTeamB?._id) }).populate({ path: 'oPlayer' }).lean()

    response.oTeam2 = {
      oTeam: match?.oTeamB,
      aPlayers: matchsquad2 || []
    }
    return response
  } catch (error) {
    return error
  }
}

// front service
controllers.updateFantasyArticleClap = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId'])
    if (!body.iArticleId) _.throwError('requiredField', context)
    const { iArticleId } = body

    const { decodedToken } = context

    const clapQuery = {}

    if (decodedToken) {
      const { iUserId } = decodedToken
      if (!iUserId) _.throwError('authorizationError', context)
      clapQuery.iUserId = iUserId
    }

    const article = await FantasyArticlesModel.findOne({ _id: _.mongify(iArticleId), eState: 'pub' }).lean()
    if (!article) _.throwError('wentWrong', context)

    // Here i put fake objectId for storing unauthenticated users clap
    if (!clapQuery.iUserId) clapQuery.iUserId = '60b6f7b6ac9fc7178c7a7a7a'

    clapQuery.iArticleId = article._id

    let userClapCount = 0
    // Update user claps

    const clap = await FantasyArticleClapsModel.findOne(clapQuery).lean()

    if (clap) {
      if (clap.nClapCount >= 5 && clap?.iUserId?.toString() !== '60b6f7b6ac9fc7178c7a7a7a') _.throwError('noClapLeft', context)
      userClapCount = clap.nClapCount + 1
    } else {
      ++userClapCount
    }

    const updateClap = await FantasyArticleClapsModel.updateOne(clapQuery, { nClapCount: userClapCount }, { upsert: true, runValidators: true })
    if (!updateClap.acknowledged) _.throwError('wentWrong', context)

    // Update Article claps
    const updateArticleClap = await FantasyArticlesModel.updateOne({ _id: article._id }, { $inc: { nClaps: 1 } })
    if (!updateArticleClap.modifiedCount) _.throwError('wentWrong', context)

    return _.resolve('successfully', { nTotalClap: userClapCount }, 'articleClapped', context)
  } catch (error) {
    return error
  }
}

// front service
controllers.getUserFantasyArticleClap = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId'])
    if (!body.iArticleId) _.throwError('requiredField', context)
    const { iArticleId } = body
    const { decodedToken } = context

    const { iUserId } = decodedToken
    if (!iUserId) _.throwError('authorizationError', context)

    const article = await FantasyArticlesModel.findOne({ _id: _.mongify(iArticleId), eState: 'pub' }).lean()

    if (!article) _.throwError('wentWrong', context)

    const query = {
      iUserId,
      iArticleId
    }
    let nTotalClap = 0
    const userClasp = await FantasyArticleClapsModel.findOne(query, { nClapCount: 1 }).lean()
    if (userClasp) nTotalClap = userClasp.nClapCount
    return { nTotalClap }
  } catch (error) {
    return error
  }
}

controllers.listFantasyPlayersInfo = async (parent, { input }, context) => {
  try {
    const { ePlatformType, iMatchId, iTeamId } = input || {}

    if (!iMatchId) _.throwError('requiredField', context)

    const match = await MatchesModel.findOne({ _id: iMatchId })
    if (!match) _.throwError('notFound', context, 'match')

    const { oTeamScoreA, oTeamScoreB } = match

    const query = { $and: [{ iMatchId: _.mongify(iMatchId) }] }
    if (ePlatformType) query.$and.push({ ePlatformType })

    if (iTeamId) query.$and.push({ $or: [{ iTeamId: _.mongify(iTeamId) }] })
    else query.$and.push({ $or: [{ iTeamId: _.mongify(oTeamScoreA.iTeamId) }, { iTeamId: _.mongify(oTeamScoreB.iTeamId) }] })

    const aPlayersDetails = await FantasyPlayersModel.find(query)
      .populate([
        { path: 'oMatch' },
        { path: 'oPlayer' },
        { path: 'oTeam' }
      ])
      .lean()

    return aPlayersDetails || []
  } catch (error) {
    return error
  }
}

controllers.resolveFantasyArticle = async (_id) => {
  try {
    const data = await FantasyArticlesModel.findOne({ _id: _.mongify(_id) }).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.updateFantasyArticleStatus = async (parent, { input }, context) => {
  try {
    const { _id, eState } = input
    if (!_id || !eState) _.throwError('requiredField', context)

    const article = await FantasyArticlesModel.findOneAndUpdate({ _id }, { eState, $unset: { iReviewerId: 1, dPublishDate: 1 } })
    if (eState === 't') {
      // queuePush('updateEntitySeo', { iId: _id, eStatus: 'd' })
      await grpcControllers.updateEntitySeo({ iId: _id, eStatus: 'd' })

      queuePush('updateSiteMap', { _id, eType: 'fa', dPublishDate: article.dPublishDate })
    }
    return _.resolve('updateSuccess', null, 'fantasyarticle', context)
  } catch (error) {
    return error
  }
}

controllers.getRelatedFantasyStories = async (parent, { input }, context) => {
  try {
    const { oGetRelatedFantasyStoriesIdInput, oPaginationInput } = input
    const { nLimit, nSkip } = getPaginationValues(oPaginationInput)
    const { aTags, aTeam, aPlayer, aVenue, aSeries, iCategoryId, iFantasyArticleId } = oGetRelatedFantasyStoriesIdInput
    if (!iFantasyArticleId || !iCategoryId) _.throwError('requiredField', context)
    const $or = [{ iCategoryId: _.mongify(iCategoryId) }]
    if (aTags?.length) $or.push({ aTags: { $in: aTags.map(tag => _.mongify(tag)) } })
    if (aSeries?.length) $or.push({ aSeries: { $in: aSeries.map(tag => _.mongify(tag)) } })
    if (aPlayer?.length) $or.push({ aPlayer: { $in: aPlayer.map(tag => _.mongify(tag)) } })
    if (aVenue?.length) $or.push({ aVenue: { $in: aVenue.map(tag => _.mongify(tag)) } })
    if (aTeam?.length) $or.push({ aTeam: { $in: aTeam.map(tag => _.mongify(tag)) } })

    const query = { $or, eState: 'pub' }

    if (iFantasyArticleId) query._id = { $ne: _.mongify(iFantasyArticleId) }

    const aResults = await FantasyArticlesModel.find(query).sort({ dPublishDate: -1 }).skip(nSkip).limit(nLimit).lean()

    return { aResults }
  } catch (error) {
    return error
  }
}

controllers.updatePickFantasyArticleData = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'sTitle', 'sSubtitle', 'sSrtTitle', 'sMatchPreview', 'oImg', 'oTImg', 'aCVCFan', 'aTags', 'sEditorNotes', 'oAdvanceFeature', 'eState', 'eVisibility', 'bPriority', 'aTopicPicksFan', 'aBudgetPicksFan', 'oOtherInfo', 'aAvoidPlayerFan', 'iAuthorDId', 'iCategoryId', 'aSeries', 'aPlayer', 'aTeam', 'aVenue', 'sVideoUrl', 'sMustPick', 'aLeague', 'dPublishDate', 'dPublishDisplayDate'])

    const article = await FantasyArticlesModel.findOne({ _id: body._id }).lean()

    // validate fantasy team
    const { aLeague } = body

    if (aLeague.length) {
      for (const l of aLeague) {
        l.eLeagueFull = eFantasyLeagueType.description[l.eLeague]
      }
    }

    if (article?.eState === 't' && (body.eState === 'd' || body.eState === 'p')) body.iReviewerId = null

    if (body.sMatchPreview) body.sDescription = _.stripHtml(body.sMatchPreview).replace(/\r\n|\n|\r/gm, '').substr(0, 200)

    if ((article?.eState === 't' && body.eState === 'd') || (body.eState === 't')) body.iReviewerId = null
    if (body.eState === 'pub' && ['p', 'cs'].includes(article.eState)) {
      body.dPublishDate = new Date()
      body.dPublishDisplayDate = body.dPublishDate
    }
    if (body.eState === 'pub' && article.dPublishDate && article.eState === 'pub') {
      delete body?.dPublishDate
      if (body?.dPublishDisplayDate) {
        body.dPublishDisplayDate = moment(body?.dPublishDisplayDate).toISOString()
      } else body.dPublishDisplayDate = article?.dPublishDate
    }

    if (!['pub', 's'].includes(body.eState)) {
      body.dPublishDate = null
      body.dPublishDisplayDate = null
    }

    if (body.eState === 's') {
      body.dPublishDate = moment(body?.dPublishDate).toDate()
      body.dPublishDisplayDate = body?.dPublishDate
    }

    if (article.eState === 's' && ['p'].includes(body.eState)) {
      body.dPublishDate = null
      body.dPublishDisplayDate = null
    }

    if (body?.oAdvanceFeature?.bAmp) {
      body.sAmpPreview = await convertAmp(body?.sAmpPreview)
      body.sAmpMustPick = await convertAmp(body?.sAmpMustPick)
    }

    const articleData = await FantasyArticlesModel.findByIdAndUpdate({ _id: body._id }, body, { new: true })
      .populate([
        { path: 'aLeague.aTeam.aSelectedPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aBudgetPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aTopicPicksFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aAvoidPlayerFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aCVCFan.oPlayerFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oCapFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oVCFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTPFan', populate: [{ path: 'oPlayer' }, { path: 'oTeam' }] },
        { path: 'aLeague.aTeam.oTeamA.oTeam' },
        { path: 'aLeague.aTeam.oTeamB.oTeam' }
      ]).lean()

    if (body.eState === 't') {
      // queuePush('updateEntitySeo', { iId: article._id, eStatus: 'd' })
      await grpcControllers.updateEntitySeo({ iId: article._id, eStatus: 'd' })
    }
    redis.pubsub.publish(`fantasyArticleTakeOverUpdate:${article._id}:${article.iReviewerId}`, { fantasyArticleTakeOverUpdate: 'Data updated' })
    return _.resolve('updateSuccess', { oData: articleData }, 'fantasyArticle', context)
  } catch (error) {
    return error
  }
}

controllers.getFantasyArticleTotalClaps = async (parent, { input }, context) => {
  const { _id } = input

  const article = await FantasyArticlesModel.findOne({ _id, eState: 'pub' }).lean()
  if (!article) _.throwError('notFound', context, 'article')

  return { nTotalClap: article.nClaps }
}

controllers.updateFantasyArticleViewCount = async (parent, { input }, context) => {
  const { _id } = input

  fantasyArticleViews({ _id, ip: context.ip })

  return 'Successfully incresed article view'
}

controllers.updateFantasyPlayersList = async (parent, { input }, context) => {
  const { iMatchId, ePlatformType } = input
  if (!iMatchId || !ePlatformType) _.throwError('requiredFiled', context)

  const match = await MatchesModel.findOne({ _id: iMatchId }).lean()
  if (!match) _.throwError('notFound', context, 'match')

  const fantasyArticle = await FantasyArticlesModel.findOne({ iMatchId: _.mongify(iMatchId), ePlatformType }).lean()
  if (!fantasyArticle) _.throwError('notFound', context, 'article')

  const fPlayers = await FantasyPlayersModel.find({ iMatchId: _.mongify(iMatchId), ePlatformType }, { _id: 0, iPlayerId: 1 })

  const arrPlayers = []
  fPlayers.forEach(e => arrPlayers.push(e.iPlayerId))

  const seriesSquad = await SeriesSquadModel.find({
    iSeriesId: _.mongify(match.iSeriesId),
    $or: [{ iTeamId: _.mongify(match?.oTeamScoreA?.iTeamId) }, { iTeamId: _.mongify(match?.oTeamScoreB?.iTeamId) }],
    iPlayerId: { $nin: arrPlayers }
  }).populate([
    { path: 'iPlayerId' }
  ]).lean()

  if (seriesSquad?.length) {
    for (const ss of seriesSquad) {
      const playerParams = {}
      playerParams.iMatchId = match?._id
      playerParams.iPlayerId = ss?.iPlayerId?._id
      playerParams.iTeamId = ss.iTeamId
      playerParams.ePlatformType = ePlatformType
      playerParams.eRole = ss?.iPlayerId?.sPlayingRole || null

      const { aFantasyPlayerRating } = ss?.iPlayerId // obj
      const creditIndex = aFantasyPlayerRating.findIndex(c => c?.ePlatformType === ePlatformType)
      playerParams.nRating = aFantasyPlayerRating[creditIndex]?.nRating || 8 // default player credit

      await FantasyPlayersModel.updateOne({ iMatchId: _.mongify(match._id), iPlayerId: _.mongify(playerParams?.iPlayerId), iTeamId: _.mongify(playerParams?.iTeamId), ePlatformType }, playerParams, { upsert: true })
    }
  }
  return _.resolve('updateSuccess', null, 'player', context)
}

module.exports = controllers
