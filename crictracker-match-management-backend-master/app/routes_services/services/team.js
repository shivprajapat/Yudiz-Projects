const controllers = {}
const { teams: TeamsModel, SeriesDataModel, CountryModel, seriessquad: SeriesSquadModel, players: PlayersModel } = require('../../model')
const _ = require('../../../global')
const axios = require('axios')
// const { getS3ImageURL } = require('../../utils/lib/services')
// const config = require('../../../config')
const async = require('async')
const { getS3ImageURL } = require('../../utils/lib/services')
const config = require('../../../config')
const path = require('path')
const fs = require('fs')
const { uploadS3Image } = require('../../utils/lib/s3Bucket')

controllers.getTeam = async (req, res) => {
  try {
    const team = await TeamsModel.findOne({ sTitle: req?.body?.sTitle })
    res.json({ team })
  } catch (error) {
    return res.send({ error })
  }
}

const getCountryFullName = async (sISO) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (sISO) {
          const country = await CountryModel.findOne({ sISO })

          if (country) resolve(country.sTitle)
          else resolve(null)
        } else resolve(null)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })()
  })
}

controllers.updateTeam = async (req, res) => {
  try {
    const { iSeriesId } = req.body
    if (!iSeriesId) res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.requiredField.message })

    const seriesData = await SeriesDataModel.findOne({ iSeriesId: _.mongify(iSeriesId) }, { aTeams: 1 }).lean()

    const { aTeams } = seriesData

    if (aTeams.length) {
      async.eachSeries(aTeams, async (_id, cb) => {
        const team = await TeamsModel.findById(_id, { sTeamKey: 1 }).lean()
        const res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}teams/${team?.sTeamKey}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })

        if (res?.data?.response) {
          const { tid: sTeamKey, title: sTitle, logo_url: sLogoUrl, type: sTeamType, country: sCountry, alt_name: sAltName, sex: sSex } = res.data.response

          const newTeamParams = { sTeamKey: sTeamKey.toString(), sTitle, sLogoUrl, sTeamType, sCountry, sAltName, sSex }

          const s3Res = await getS3ImageURL(sLogoUrl, config.S3_BUCKET_TEAM_THUMB_URL_PATH, _.encodeString(sTeamKey.toString(), 4))
          if (s3Res?.success) newTeamParams.oImg = { sUrl: s3Res.path }
          else newTeamParams.oImg = { sUrl: '' }

          if (sCountry) newTeamParams.sCountryFull = await getCountryFullName(sCountry)

          await TeamsModel.updateOne({ sTeamKey }, newTeamParams)
          Promise.resolve(cb)
        }
      })
    }

    return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.updateSuccess.message.replace('##', 'Teams') })
  } catch (error) {
    return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'UpdateTeam Error', data: error?.response?.data })
  }
}

controllers.updateS3Url = async (req, res) => {
  try {
    const aTeam = await TeamsModel.find({}).lean()
    for (const oTeam of aTeam) {
      await getS3ImageURL(oTeam?.sLogoUrl, config.S3_BUCKET_TEAM_THUMB_URL_PATH, oTeam?.sTeamKey)
    }
    console.log('done')
  } catch (error) {
    console.log({ error })
    return res.send('internal server error ')
  }
}

controllers.uploadImageFromLocal = async (req, res) => {
  try {
    const sJerseyUrl = path.join(__dirname, '../../../jersey/')
    const files = fs.readdirSync(sJerseyUrl)
    for (const file of files) {
      console.log(file)
      const filePath = path.join(sJerseyUrl, file)
      const oTeam = await TeamsModel.findOne({ sTeamKey: file.split('_')[1].split('.')[0] }).lean()
      const hashed = _.encodeString(oTeam?.sTeamKey, 5)
      const imageName = oTeam?.sTitle.split(' ').join('_') + '_' + hashed + path.extname(filePath)
      const stats = fs.statSync(filePath)
      const image = fs.readFileSync(filePath)
      const fileSizeInBytes = stats.size
      // Convert the file size to megabytes (optional)
      const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024)
      const paramsObj = {
        ContentType: 'image/png',
        ContentLength: fileSizeInMegabytes,
        Body: image,
        Key: config.S3_TEAM_JERSEY_PATH + '300x300/' + imageName.toLowerCase(),
        ACL: 'public-read'
      }
      const oJersey = {
        sUrl: config.S3_TEAM_JERSEY_PATH + '300x300/' + imageName.toLowerCase()
      }
      await uploadS3Image(paramsObj)
      await TeamsModel.updateOne({ _id: oTeam?._id }, { oJersey })
    }
    return res.send('done')
  } catch (error) {
    console.log(error)
    return res.send('error aavel che  ')
  }
}

controllers.uploadTeamFlagsFromLocal = async (req, res) => {
  try {
    const sTeamUrl = path.join(__dirname, '../../../teamFlags/')
    const files = fs.readdirSync(sTeamUrl)
    for (const file of files) {
      console.log(file)
      const filePath = path.join(sTeamUrl, file)
      const oTeam = await TeamsModel.findOne({ sTeamKey: file.split('.')[0] }).lean()
      const hashed = _.encodeString(oTeam?.sTeamKey, 5)
      const imageName = oTeam?.sTitle.split(' ').join('_') + '_flag_' + hashed + path.extname(filePath)
      const stats = fs.statSync(filePath)
      const image = fs.readFileSync(filePath)
      const fileSizeInBytes = stats.size
      // Convert the file size to megabytes (optional)
      const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024)
      const paramsObj = {
        ContentType: `image/${path.extname(filePath).split('.')[1]}+xml`,
        ContentLength: fileSizeInMegabytes,
        Body: image,
        Key: config.S3_TEAM_FLAG_PATH + imageName.toLowerCase(),
        ACL: 'public-read'
      }
      const oImg = {
        sUrl: config.S3_TEAM_FLAG_PATH + imageName.toLowerCase()
      }
      console.log(paramsObj)
      await uploadS3Image(paramsObj)
      await TeamsModel.updateOne({ _id: oTeam?._id }, { oImg })
    }
    return res.send('done')
  } catch (error) {
    console.log(error)
    return res.send('error aavel che')
  }
}

controllers.updateLeagueStatus = async (req, res) => {
  try {
    let leagueTeams = await SeriesDataModel.aggregate([
      {
        $lookup: {
          from: 'series',
          localField: 'iSeriesId',
          foreignField: '_id',
          as: 'seriesData'
        }
      },
      { $match: { 'seriesData.bIsLeague': true } },
      { $unwind: '$aTeams' },
      { $group: { _id: '$aTeams' } }
    ]).exec()

    leagueTeams = leagueTeams.map(s => s._id)

    const teams = await TeamsModel.updateMany({ _id: { $in: leagueTeams } }, { $set: { bIsLeague: true } })

    return res.send({ teams })
  } catch (error) {
    return res.send(error)
  }
}

controllers.addPrimaryTeam = async (req, res) => {
  try {
    const { aTeam } = req.body
    let aTeamPlayedPlayer

    for (const iTeam of aTeam) {
      aTeamPlayedPlayer = await SeriesSquadModel.aggregate([
        [
          {
            $match: {
              iTeamId: _.mongify(iTeam)
            }
          }, {
            $group: {
              _id: '$iPlayerId'
            }
          }, {
            $sort: { _id: 1 }
          }
        ]
      ])
      for (const iTeamPlayedPlayerId of aTeamPlayedPlayer) {
        // console.log(iTeamPlayedPlayerId?._id, iTeam)
        await PlayersModel.updateOne({ _id: iTeamPlayedPlayerId?._id }, { $set: { iPrimaryTeam: _.mongify(iTeam) } })
        console.log(`primary team added to playerid ${iTeamPlayedPlayerId?._id}`)
      }
    }
    return res.send('done ')
  } catch (error) {
    console.log(error)
    return res.send('error aavel che  ')
  }
}

module.exports = controllers
