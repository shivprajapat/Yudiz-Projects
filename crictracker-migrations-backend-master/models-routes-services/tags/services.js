/* eslint-disable camelcase */
/* eslint-disable prefer-regex-literals */
const async = require('async')
const axios = require('axios')
const { Sequelize } = require('sequelize')
const sequelize = require('../../db_services/sqlConnect')
const { players: PlayersModel, series: SeriesModel, wptags: WPTagsModel, teams: TeamsModel, venues: VenuesModel, tags: TagsModel, admins: AdminsModel, seo: SeoModel, articles: ArticlesModel, categories: CategoriesModel, seoredirects: SeoRedirects } = require('../models')

const { getPlayerIdFromKey } = require('../common')
const { ObjectId } = require('mongoose').Types

class Tags {
  async addPlayers(req, res) {
    try {
      console.log('In addPlayers')
      let { limit, pageNo = 1, country } = req.query
      let aPlayers = []
      if (pageNo === 1) aPlayers = await getPlayersData(limit, pageNo, country)
      const totalPages = aPlayers.data.response.total_pages

      for (let j = 0; j < totalPages; j++) {
        pageNo = j + 1
        if (pageNo !== 1) aPlayers = await getPlayersData(limit, pageNo, country)
        for (let i = 0; i < aPlayers.data.response.items.length; i++) {
          console.log('i', i)
          await getPlayerIdFromKey(aPlayers.data.response.items[i].pid, aPlayers.data.response.items[i])
        }
      }

      return res.send('Done')
    } catch (error) {
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  async dumpPlayerTagDataSqlToMongo(req, res) {
    try {
      const { limit } = req.query
      const data = await sequelize.query('SELECT * FROM wp_terms wt JOIN wp_term_taxonomy wtt ON wtt.term_id = wt.term_id WHERE wtt.taxonomy="post_tag" LIMIT :limit;', { raw: true, replacements: { limit: parseInt(limit) }, type: Sequelize.QueryTypes.SELECT })
      async.eachSeries(data, async (s, cb) => {
        const filters = { $and: [] }
        if (s.name) {
          filters.$and.push({
            $or: [
              { sFullName: { $regex: new RegExp('^.*' + s.name + '.*', 'i') } }
            ]
          })
        }

        const dataExact = await PlayersModel.findOne({ sFullName: new RegExp(`^${s.name}$`, 'i') })

        const data = await PlayersModel.aggregate([
          { $match: filters }
        ])

        if (dataExact) {
          const aPlayers = []
          if (dataExact.sFullName.toLowerCase().includes(s.name.toLowerCase())) {
            aPlayers.push(dataExact)
          }

          if (aPlayers.length) {
            const term_id = await WPTagsModel.countDocuments({ term_id: s.term_id })

            if (!term_id) {
              const updateObj = { ...s, aDocuments: aPlayers, eType: 'player' }
              if (aPlayers.length === 1) {
                updateObj.iId = dataExact._id
                updateObj.sAssignedName = dataExact.sFullName
                updateObj.bIsAssigned = true
              } else {
                updateObj.iId = null
                updateObj.bIsAssigned = false
              }
              await WPTagsModel.create(updateObj)
            }
          }
        } else if (data.length) {
          const aPlayers = []
          data.forEach(el => {
            if (el.sFullName.toLowerCase().split(' ').includes(s.name.toLowerCase())) {
              aPlayers.push(el)
            }
          })

          if (aPlayers.length) {
            const term_id = await WPTagsModel.countDocuments({ term_id: s.term_id })
            if (!term_id) {
              const updateObj = { ...s, aDocuments: aPlayers, eType: 'player' }
              if (aPlayers.length === 1) {
                updateObj.iId = aPlayers[0]._id
                updateObj.sAssignedName = aPlayers[0].sFullName
                updateObj.bIsAssigned = true
              } else {
                updateObj.iId = null
                updateObj.bIsAssigned = false
              }
              await WPTagsModel.create(updateObj)
            }
          }
        }
        Promise.resolve(cb)
      }, (error) => {
        return res.status(500).jsonp({ data: error })
      })

      // return res.send({ data })
    } catch (error) {
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  async dumpTeamTagDataSqlToMongo(req, res) {
    try {
      const { limit } = req.query
      const data = await sequelize.query('SELECT * FROM wp_terms wt JOIN wp_term_taxonomy wtt ON wtt.term_id = wt.term_id WHERE wtt.taxonomy="post_tag" LIMIT :limit;', { raw: true, replacements: { limit: parseInt(limit) }, type: Sequelize.QueryTypes.SELECT })
      async.eachSeries(data, async (s, cb) => {
        const filters = { $and: [] }
        if (s.name) {
          filters.$and.push({
            $or: [
              { sTitle: { $regex: new RegExp('^.*' + s.name + '.*', 'i') } }
            ]
          })
        }

        const dataExact = await TeamsModel.findOne({ sTitle: new RegExp(`^${s.name}$`, 'i') })

        const data = await TeamsModel.aggregate([
          { $match: filters }
        ])

        if (dataExact) {
          const aTeams = []

          if (dataExact.sTitle.toLowerCase().includes(s.name.toLowerCase())) {
            aTeams.push(dataExact)
          }

          if (aTeams.length) {
            const term_id = await WPTagsModel.countDocuments({ term_id: s.term_id })
            if (!term_id) {
              const updateObj = { ...s, aDocuments: aTeams, eType: 'team' }
              if (aTeams.length === 1) {
                updateObj.iId = dataExact._id
                updateObj.sAssignedName = dataExact.sTitle
                updateObj.bIsAssigned = true
              } else {
                updateObj.iId = null
                updateObj.bIsAssigned = false
              }
              await WPTagsModel.create(updateObj)
            }
          }
        } else if (data.length) {
          const aTeams = []
          data.forEach(el => {
            if (el.sTitle.toLowerCase().split(' ').includes(s.name.toLowerCase())) {
              aTeams.push(el)
            }
          })

          if (aTeams.length) {
            const term_id = await WPTagsModel.countDocuments({ term_id: s.term_id })
            if (!term_id) {
              const updateObj = { ...s, aDocuments: aTeams, eType: 'team' }
              if (aTeams.length === 1) {
                updateObj.iId = aTeams[0]._id
                updateObj.sAssignedName = aTeams[0].sTitle
                updateObj.bIsAssigned = true
              } else {
                updateObj.iId = null
                updateObj.bIsAssigned = false
              }
              await WPTagsModel.create(updateObj)
            }
          }
        }
        Promise.resolve(cb)
      }, (error) => {
        console.log('done', error)
        return res.status(500).jsonp({ data: 'done' })
      })

      // return res.send({ data })
    } catch (error) {
      console.log('error', error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  async dumpVenueTagDataSqlToMongo(req, res) {
    try {
      const { limit } = req.query
      const data = await sequelize.query('SELECT * FROM wp_terms wt JOIN wp_term_taxonomy wtt ON wtt.term_id = wt.term_id WHERE wtt.taxonomy="post_tag" LIMIT :limit;', { raw: true, replacements: { limit: parseInt(limit) }, type: Sequelize.QueryTypes.SELECT })
      async.eachSeries(data, async (s, cb) => {
        const filters = { $and: [] }
        if (s.name) {
          s.name = s.name.replace(/[^a-zA-Z0-9 ]/g, '')

          filters.$and.push({
            $or: [
              { sName: { $regex: new RegExp('^.*' + s.name + '.*', 'i') } }
            ]
          })
        }

        const dataExact = await VenuesModel.findOne({ sName: new RegExp(`^${s.name}$`, 'i') })

        const data = await VenuesModel.aggregate([
          { $match: filters }
        ])

        if (dataExact) {
          const aTeams = []

          if (dataExact.sName.toLowerCase().includes(s.name.toLowerCase())) {
            aTeams.push(dataExact)
          }

          if (aTeams.length) {
            const term_id = await WPTagsModel.countDocuments({ term_id: s.term_id })
            if (!term_id) {
              const updateObj = { ...s, aDocuments: aTeams, eType: 'venue' }
              if (aTeams.length === 1) {
                updateObj.iId = dataExact._id
                updateObj.sAssignedName = dataExact.sName
                updateObj.bIsAssigned = true
              } else {
                updateObj.iId = null
                updateObj.bIsAssigned = false
              }
              await WPTagsModel.create(updateObj)
            }
          }
        } else if (data.length) {
          const aTeams = []
          data.forEach(el => {
            if (el.sName.toLowerCase().split(' ').includes(s.name.toLowerCase())) {
              aTeams.push(el)
            }
          })

          if (aTeams.length) {
            const term_id = WPTagsModel.countDocuments({ term_id: s.term_id })
            if (!term_id) {
              const updateObj = { ...s, aDocuments: aTeams, eType: 'venue' }
              if (aTeams.length === 1) {
                updateObj.iId = aTeams[0]._id
                updateObj.sAssignedName = aTeams[0].sName
                updateObj.bIsAssigned = true
              } else {
                updateObj.iId = null
                updateObj.bIsAssigned = false
              }
              await WPTagsModel.create(updateObj)
            }
          }
        }
        Promise.resolve(cb)
      }, (error) => {
        console.log('done', error)
        return res.status(500).jsonp({ data: 'done' })
      })

      // return res.send({ data })
    } catch (error) {
      console.log('error', error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  async dumpTagDataSqlToMongo(req, res) {
    try {
      const { nLimit = 100, eType } = req.body
      let Model
      let sFieldName
      if (eType === 'player') {
        Model = PlayersModel
        sFieldName = 'sFullName'
      } else if (eType === 'team') {
        Model = TeamsModel
        sFieldName = 'sTitle'
      } else if (eType === 'venue') {
        Model = VenuesModel
        sFieldName = 'sName'
      } else {
        return res.send({ message: 'Invalid type' })
      }

      await createMigrateTags(nLimit, Model, sFieldName, eType)
      return res.send({ message: 'done' })
    } catch (error) {
      console.log('error', error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  async dumpRemainingTagDataSqlToMongoAsSimpleTag(req, res) {
    try {
      const { nLimit = 100 } = req.body
      WPTagsModel.find({}, { _id: 0, term_id: 1 }).lean().then(async (MongoTermIds) => {
        MongoTermIds = MongoTermIds.map(el => el.term_id)
        const notIn = MongoTermIds.length ? `NOT IN(${MongoTermIds})` : ''
        const data = await sequelize.query(`SELECT * FROM wp_terms wt JOIN wp_term_taxonomy wtt ON wtt.term_id = wt.term_id WHERE wtt.taxonomy="post_tag" AND wt.term_id ${notIn} LIMIT :limit;`, { raw: true, replacements: { limit: parseInt(nLimit), MongoTermIds }, type: Sequelize.QueryTypes.SELECT })
        console.log({ data }, data.length)
        async.eachSeries(data, async (s, cb) => {
          const updateObj = { ...s, eType: 'simple' }
          await WPTagsModel.create(updateObj)
          Promise.resolve(cb)
        }, (error) => {
          console.log('done', error)
          return res.status(500).jsonp({ data: 'done!!!' })
        })
      }).catch(error => {
        console.log('done', error)
        return res.status(500).jsonp({ data: 'not done ): ', error })
      })
    } catch (error) {
      console.log('error', error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  // script
  async dumpSimpleTagsToMongo(req, res) {
    try {
      const { limit } = req.query
      const query = { eStatus: 'a', eType: 'player' }
      query.bIsMigrated = { $ne: true }

      const admin = await AdminsModel.findOne({ eStatus: 'a' }).sort({ _id: 1 }).lean()
      const WPtags = await WPTagsModel.find(query).sort({ dUpdated: -1 }).limit(limit).lean()

      for (const t of WPtags) {
        if (['player', 'team', 'venue'].includes(t.eType) && t?.bIsAssigned && t?.iId && t?.sAssignedName) {
          const exist = await TagsModel.findOne({ iId: ObjectId(t.iId) })
          if (!exist) {
            const tagParams = {
              sName: t.sAssignedName,
              iId: t.iId,
              nCount: t?.count,
              eStatus: 'a',
              iSubmittedBy: admin?._id,
              iProcessedBy: admin?._id
            }

            let Model
            if (t.eType === 'player') {
              Model = PlayersModel
              tagParams.eType = 'p'
            }
            if (t.eType === 'team') {
              Model = TeamsModel
              tagParams.eType = 't'
            }
            if (t.eType === 'venue') {
              Model = VenuesModel
              tagParams.eType = 'v'
            }

            await TagsModel.create(tagParams)
            await Model.updateOne({ _id: ObjectId(t.iId) }, { eTagStatus: 'a', bTagEnabled: true })

            const sNewUrl = await SeoModel.findOne({ iId: ObjectId(t.iId) }).lean()

            await SeoRedirects.create({ iId: ObjectId(t.iId), sOldUrl: t.slug, sNewUrl: sNewUrl?.sSlug, eCode: 308, eSeoType: tagParams.eType, eStatus: 'a' })

            await WPTagsModel.updateOne({ _id: t._id }, { bIsMigrated: true })
          } else await WPTagsModel.updateOne({ _id: t._id }, { bIsMigrated: true })
        } else if (t.bIsAssigned === false && t.eType === 'simple') {
          const exist = await TagsModel.findOne({ sName: t.name }).lean()
          if (!exist) {
            const tagParams = {
              sName: t.name,
              nCount: t?.count,
              eStatus: 'a',
              iSubmittedBy: admin?._id,
              iProcessedBy: admin?._id,
              eType: 'gt'
            }

            const newTag = await TagsModel.create(tagParams)
            const seoParams = { iId: newTag._id, eType: 'gt' }

            const tagSlug = await SeoModel.countDocuments({ sSlug: t.slug, $or: [{ eType: 'gt' }, { eType: 'p' }, { eType: 'v' }, { eType: 't' }] })

            seoParams.sSlug = tagSlug ? `${t.slug}-${Date.now()}` : t.slug
            await SeoModel.create(seoParams)
            await WPTagsModel.updateOne({ _id: t._id }, { bIsMigrated: true })
          }
        }
      }

      res.send('simple tags done')
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async duplicateCatTag(req, res) {
    try {
      const Category = await CategoriesModel.find({})
      for (let i = 0; i < Category.length; i++) {
        const exist = await TagsModel.findOne({ sName: Category[i].sName })
        if (exist) {
          console.log({ sName: Category[i].sName })
        }
      }

      return res.send('duplicateCatTag done')
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async tagsPriorityAlgo(req, res) {
    try {
      await PlayersModel.updateMany({}, { nPriority: 0 })
      const playerCount = await PlayersModel.countDocuments({ sBattingStyle: { $ne: '' }, sBowlingStyle: { $ne: '' }, sFullName: { $ne: '' } })
      const result = []
      for (let index = 0; index < playerCount / 1000; index++) {
        const players = await PlayersModel.find({ sBattingStyle: { $ne: '' }, sBowlingStyle: { $ne: '' }, sFullName: { $ne: '' } }).skip(index * 1000).limit(1000).lean()
        async.eachSeries(players, async (player, cb) => {
          const playerUsedAsTag = await ArticlesModel.countDocuments({ aPlayer: player._id })

          const query = {
            sTitle: { $regex: player.sFullName, $options: 'i' },
            eState: 'pub',
            eStatus: 'a'
          }

          const playerUsedAsTitle = await ArticlesModel.countDocuments(query)
          result.push({ player: player.sFirstName, nCount: playerUsedAsTag + playerUsedAsTitle })
          if (result.length === playerCount) console.log(result)
          await PlayersModel.updateOne({ _id: player._id }, { nPriority: playerUsedAsTag + playerUsedAsTitle })
          Promise.resolve(cb)
        })
      }
    } catch (error) {
      console.log(error)
      res.json({ message: 'Something went wrong' })
    }
  }

  async seriesPriorityAlgo(req, res) {
    try {
      await SeriesModel.updateMany({}, { nPriority: 0 })
      const seriesCount = await SeriesModel.countDocuments()
      const result = []
      for (let index = 0; index < seriesCount / 1000; index++) {
        const series = await SeriesModel.find().skip(index * 1000).limit(1000).lean()
        async.eachSeries(series, async (series, cb) => {
          const seriesUsedAsTag = await ArticlesModel.countDocuments({ aSeries: series._id })

          const query = {
            sTitle: { $regex: series.sTitle, $options: 'i' },
            eState: 'pub',
            eStatus: 'a'
          }

          const seriesUsedAsTitle = await ArticlesModel.countDocuments(query)
          result.push({ series: series.sTitle, nCount: seriesUsedAsTag + seriesUsedAsTitle })
          console.log({ series: series.sTitle, nCount: seriesUsedAsTag, seriesUsedAsTitle })
          if (result.length === seriesCount) console.log(result)
          await SeriesModel.updateOne({ _id: series._id }, { nPriority: seriesUsedAsTag + seriesUsedAsTitle })
          Promise.resolve(cb)
        })
      }
    } catch (error) {
      console.log(error)
      res.json({ message: 'Something went wrong' })
    }
  }

  async teamPriorityAlgo(req, res) {
    try {
      await TeamsModel.updateMany({}, { nPriority: 0 })
      const teamCount = await TeamsModel.countDocuments()
      const result = []
      for (let index = 0; index < teamCount / 1000; index++) {
        const teams = await TeamsModel.find().skip(index * 1000).limit(1000).lean()
        async.eachSeries(teams, async (team, cb) => {
          const teamUsedAsTag = await ArticlesModel.countDocuments({ aTeam: team._id })

          const query = {
            sTitle: { $regex: team.sTitle, $options: 'i' },
            eState: 'pub',
            eStatus: 'a'
          }

          const teamUsedAsTitle = await ArticlesModel.countDocuments(query)
          result.push({ team: team.sTitle, nCount: teamUsedAsTag + teamUsedAsTitle })
          console.log({ team: team.sTitle, nCount: teamUsedAsTag, teamUsedAsTitle })
          if (result.length === teamCount) console.log(result)
          await TeamsModel.updateOne({ _id: team._id }, { nPriority: teamUsedAsTag + teamUsedAsTitle })
          Promise.resolve(cb)
        })
      }
    } catch (error) {
      console.log(error)
      res.json({ message: 'Something went wrong' })
    }
  }

  async getTagSeo(req, res) {
    try {
      const tagSeo = await SeoModel.find({ $or: [{ eType: 'gt' }, { eType: 't' }, { eType: 'p' }, { eType: 'v' }], eStatus: 'a' }).lean()

      async.eachSeries(tagSeo, async (seo, cb) => {
        try {
          const { data: { json, status } } = await axios.get(`https://www.crictracker.com/wp-json/yoast/v1/get_head?url=https://www.crictracker.com/${seo?.sSlug}/`)

          if (status === 200) {
            const query = {
              sTitle: json?.title,
              sDescription: json?.description,
              sRobots: `${json?.robots?.follow.charAt(0).toUpperCase() + json?.robots?.follow.slice(1)}, ${json?.robots?.index.charAt(0).toUpperCase() + json?.robots?.index.slice(1)}`,
              sCUrl: json.canonical.split('/')[json.canonical.split('/').length - 2],
              oFB: {
                sTitle: json?.og_title,
                sDescription: json?.og_description
              },
              oTwitter: {
                sTitle: json?.og_title,
                sDescription: json?.og_description
              }
            }
            console.log({ sTitleFound: json?.title })
            await SeoModel.updateOne({ _id: seo._id }, query)
            Promise.resolve(cb)
          }
        } catch (err) {
          console.log('err', 404, { sTitleError: seo?.sSlug })
          Promise.resolve(cb)
        }
      }, (err) => {
        if (err) console.log(err)
      })
      res.json({ message: 'done' })
    } catch (error) {
      console.log(error)
    }
  }

  async updatePlayerSeo(req, res) {
    const players = await SeoModel.find({ eType: 'p', sSlug: { $regex: new RegExp('^.*cricket-players/.*', 'i') } }).lean()

    for await (const player of players) {
      const getPlayer = await PlayersModel.findOne({ _id: player.iId })
      if (getPlayer) {
        const sTitle = `${getPlayer.sFullName ?? getPlayer.sFirstName} Latest News, Records, Stats & Career Info - CricTracker`
        const sDescription = `${getPlayer.sFullName ?? getPlayer.sFirstName} News: Check out the latest news and updates on ${getPlayer.sFullName ?? getPlayer.sFirstName} along with photos, videos, biography, career stats, and more on CricTracker.`
        console.log({ sTitle, sDescription, _id: getPlayer._id })
        await SeoModel.updateOne({ iId: getPlayer._id }, { sTitle, sDescription })
      } else console.log('-----------------------------------------------' + player._id + '--------------------------------------------------')
    }
    res.send('done')
  }

  async updateTeamSeo(req, res) {
    const teams = await SeoModel.find({ eType: 't', sSlug: { $regex: new RegExp('^.*cricket-teams/.*', 'i') } }).lean()

    for await (const team of teams) {
      const getTeam = await TeamsModel.findOne({ _id: team.iId })
      if (getTeam) {
        const sTitle = `${getTeam.sTitle} Cricket Team: Latest ${getTeam.sTitle} Cricket Team News, Matches, Players, Scores & Stats - Crictracker`
        const sDescription = `${getTeam.sTitle} Cricket Team: Read all the latest ${getTeam.sTitle} cricket team news, updates, previews, schedule, stats, and videos on Crictracker`
        console.log({ sTitle, sDescription, _id: getTeam._id })
        await SeoModel.updateOne({ iId: getTeam._id }, { sTitle, sDescription })
      } else console.log('-----------------------------------------------' + team._id + '--------------------------------------------------')
    }
    res.send('done')
  }
}

const createMigrateTags = (limit, Model, fieldName, eType) => {
  return new Promise((resolve, reject) => {
    try {
      WPTagsModel.find({}, { _id: 0, term_id: 1 }).lean().then(async (MongoTermIds) => {
        MongoTermIds = MongoTermIds.map(el => el.term_id)
        const notIn = MongoTermIds.length ? `NOT IN(${MongoTermIds})` : ''
        const data = await sequelize.query(`SELECT * FROM wp_terms wt JOIN wp_term_taxonomy wtt ON wtt.term_id = wt.term_id WHERE wtt.taxonomy="post_tag" AND wt.term_id ${notIn} LIMIT :limit;`, { raw: true, replacements: { limit: parseInt(limit), MongoTermIds }, type: Sequelize.QueryTypes.SELECT })
        console.log({ data })
        async.eachSeries(data, async (s, cb) => {
          const searchRegex = {}
          const searchRegexExact = {}
          if (s.name) s.name = s.name.replace(/[^a-zA-Z0-9 ]/g, '')
          searchRegex[fieldName] = { $regex: new RegExp('^.*' + s.name + '.*', 'i') }
          searchRegexExact[fieldName] = new RegExp(`^${s.name}$`, 'i')
          const filters = { $or: [searchRegex] }

          const dataExact = await Model.findOne(searchRegexExact)
          const dataMulti = await Model.aggregate([{ $match: filters }])

          if (dataExact) {
            const aDocs = []
            if (dataExact[fieldName].toLowerCase().includes(s.name.toLowerCase())) {
              aDocs.push(dataExact)
            }

            if (aDocs.length) {
              const term_id = await WPTagsModel.countDocuments({ term_id: s.term_id })
              if (!term_id) {
                const updateObj = { ...s, aDocuments: aDocs, eType }
                if (aDocs.length === 1) {
                  updateObj.iId = dataExact._id
                  updateObj.sAssignedName = dataExact[fieldName]
                  updateObj.bIsAssigned = true
                } else {
                  updateObj.iId = null
                  updateObj.bIsAssigned = false
                }
                await WPTagsModel.create(updateObj)
              }
            }
          } else if (dataMulti.length) {
            const aDocs = []
            dataMulti.forEach(el => {
              if (el[fieldName].toLowerCase().split(' ').includes(s.name.toLowerCase())) {
                aDocs.push(el)
              }
            })

            if (aDocs.length) {
              const term_id = await WPTagsModel.countDocuments({ term_id: s.term_id })
              if (!term_id) {
                const updateObj = { ...s, aDocuments: aDocs, eType }
                if (aDocs.length === 1) {
                  updateObj.iId = aDocs[0]._id
                  updateObj.sAssignedName = aDocs[0][fieldName]
                  updateObj.bIsAssigned = true
                } else {
                  updateObj.iId = null
                  updateObj.bIsAssigned = false
                }
                await WPTagsModel.create(updateObj)
              }
            }
          }
          Promise.resolve(cb)
        }, (error) => {
          console.log('done', error)
          if (error) reject(error)
          else resolve(true)
        })
      }).catch(error => {
        console.log({ error })
        reject(error)
      })
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })
}

const getPlayersData = (limit = 5, pageNo = 1, country = 'in') => {
  console.log('In getPlayersData')
  return new Promise((resolve, reject) => {
    axios.get(`https://rest.entitysport.com/v2/players?per_page=${limit}&paged=${pageNo}&country=${country}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } }).then(data => {
      resolve(data)
    }).catch(error => {
      console.log({ error })
      reject(error)
    })
  })
}

module.exports = new Tags()
