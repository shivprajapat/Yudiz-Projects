const DreamTeamModel = require('../matchTeams/dreamteam.model')
const SportModel = require('../sports/model')
const MatchModel = require('../match/model')
const MatchTeamsModel = require('../matchTeams/model')
const MatchPlayerModel = require('../matchPlayer/model')
const crypto = require('crypto')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, handleCatchError } = require('../../helper/utilities.services')

async function fetchDreamTeam(req, res) {
  try {
    const match = await MatchModel.findOne({ _id: ObjectId(req.params.id), eStatus: { $in: ['I', 'CMP'] }, bDreamTeam: true }, { _id: 1, eCategory: 1, aPlayerRole: 1 }).lean()
    if (!match) return res.status(status.BadRequest).jsonp({ status: status.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].dream_team) })

    const data = await DreamTeamModel.findOne({ iMatchId: ObjectId(match._id), eStatus: 'Y' }, { eType: 0, eStatus: 0, dCreatedAt: 0, dUpdatedAt: 0, __v: 0, bPointCalculated: 0 }).lean()
    if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].dream_team) })

    const matchTeam = await MatchTeamsModel.findOne({ sHash: data.sHash }, { aPlayers: 1 }).lean()
    if (!matchTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].dream_team) })
    data.aPlayers = matchTeam.aPlayers
    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].dream_team), data })
  } catch (error) {
    return catchError('UserTeam.fetchDreamTeam', error, req, res)
  }
}

async function createDreamTeam(req, res) {
  try {
    const match = await MatchModel.findOne({ _id: ObjectId(req.params.id), eStatus: { $in: ['I', 'CMP'] } }, { _id: 1, eCategory: 1, aPlayerRole: 1 }).lean()
    if (!match) return res.status(status.BadRequest).jsonp({ status: status.BadRequest, message: messages[req.userLanguage].match_state_error })

    const { eCategory, aPlayerRole } = match

    const sportData = await SportModel.findOne({ eCategory, eStatus: 'Y' }, { oRule: 1 }).lean()
    const { nTotalPlayers } = sportData.oRule

    const data = await generateDreamTeam({ nTotalPlayers, aPlayerRole, eCategory, _id: match._id })

    const { bSuccess } = data
    if (!bSuccess) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].went_wrong_with.replace('##', messages[req.userLanguage].dream_team_creation_error) })
    await MatchModel.updateOne({ _id: ObjectId(req.params.id) }, { $set: { bDreamTeam: true } })
    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].generated_succ.replace('##', messages[req.userLanguage].dream_team) })
  } catch (error) {
    return catchError('UserTeam.createDreamTeam', error, req, res)
  }
}

async function generateDreamTeam(data) {
  try {
    const { nTotalPlayers, aPlayerRole, _id, eCategory } = data

    const count = aPlayerRole.reduce((acc, { nMin, nMax }) => acc + Math.floor((nMax + nMin) / 2), 0) // (2+3+4+4) => 13
    let removeCount = (count - nTotalPlayers) // (13 - 11) => 3
    const sortedRole = aPlayerRole.sort((a, b) => (a.nMax < b.nMax ? 1 : -1))

    const playerRoleObject = {}
    sortedRole.forEach(({ sName, nMin, nMax }) => {
      playerRoleObject[sName] = Math.floor((nMax + nMin) / 2)
    })
    // [{ WK: 2 } ,{ ALLR: 3 }, { BATS: 4}, { BWL: 4 }]

    let i = 0
    do {
      if (i === Object.keys(sortedRole).length) i = 0
      const { sName, nMin } = sortedRole[i++]
      if (nMin < (playerRoleObject[sName] - 1)) continue
      playerRoleObject[sName]--
      removeCount--
    } while (removeCount !== 0)

    const dreamTeamData = await updateDreamTeamPlayer({ sortedRole, playerRoleObject, _id, bFlag: false })
    if (!dreamTeamData.bSuccess) return

    const { aPlayers, nCredit: nTotalCredit, nTotalPoint } = dreamTeamData

    const UserTeamPlayer = aPlayers.sort((a, b) => a > b ? 1 : -1)
    const TeamHash = crypto.createHash('sha1').update(JSON.stringify(UserTeamPlayer).toString()).digest('hex')

    const dreamMatchTeam = {
      iMatchId: ObjectId(_id),
      aPlayers,
      sHash: TeamHash,
      nTotalCredit,
      nTotalPoint,
      eCategory
    }
    const dreamTeam = {
      iMatchId: ObjectId(_id),
      sName: 'Dream Team',
      iCaptainId: aPlayers[0].iMatchPlayerId,
      iViceCaptainId: aPlayers[1].iMatchPlayerId,
      sHash: TeamHash,
      nTotalPoints: nTotalPoint,
      eCategory
    }

    await DreamTeamModel.updateMany({ iMatchId: ObjectId(_id) }, { eStatus: 'N' })
    await Promise.all([
      MatchTeamsModel.create(dreamMatchTeam),
      DreamTeamModel.create(dreamTeam)
    ])
    return { bSuccess: true }
  } catch (error) {
    handleCatchError(error)
    return { bSuccess: false }
  }
}

async function updateDreamTeamPlayer(data) {
  try {
    const { sortedRole, playerRoleObject, aId = [], _id, bFlag = true } = data

    const findQuery = { iMatchId: ObjectId(_id) }
    if (bFlag) findQuery._id = { $nin: aId }

    let aPlayer = []
    let nCredit = 0
    let nTotalPoint = 0
    for (const role of sortedRole) {
      const { sName } = role
      findQuery.eRole = sName
      let dreamPlayers = await MatchPlayerModel.find(findQuery, { _id: 1, nFantasyCredit: 1, nScoredPoints: 1, iTeamId: 1 }).sort({ nScoredPoints: -1 }).limit(playerRoleObject[sName]).lean()
      nCredit += dreamPlayers.reduce((acc, { nFantasyCredit }) => acc + nFantasyCredit, 0)
      nTotalPoint += dreamPlayers.reduce((acc, { nScoredPoints }) => acc + nScoredPoints, 0)
      dreamPlayers = dreamPlayers.map(({ _id, nScoredPoints, iTeamId }) => { return { nScoredPoints, iTeamId, iMatchPlayerId: _id } })
      aPlayer = aPlayer.concat(dreamPlayers)
    }

    const aSortedDreamPlayer = aPlayer.sort((a, b) => (a.nScoredPoints < b.nScoredPoints ? -1 : 1))
    if (nCredit > 100) {
      aId.push(aSortedDreamPlayer[2].iMatchPlayerId)
      return await updateDreamTeamPlayer({ ...data, aId, bFlag: true })
    }

    return {
      bSuccess: true,
      aPlayers: aSortedDreamPlayer,
      nCredit,
      nTotalPoint
    }
  } catch (error) {
    handleCatchError(error)
    return { bSuccess: false }
  }
}

module.exports = {
  fetchDreamTeam,
  createDreamTeam
}
