/* eslint-disable camelcase */
const { series: SeriesModel, SeriesStatsTypesModel } = require('../../model')
const axios = require('axios')
const moment = require('moment')
const { ObjectId } = require('mongoose').Types
const grpcControllers = require('../../grpc/client/')
const { scheduleMatchTask } = require('../../utils/lib/matchScheduler')

class Statistics {
  async updateTypes(req, res) {
    try {
      const { iSeriesId } = req?.body
      let sKey
      if (iSeriesId) {
        const series = await SeriesModel.findOne({ _id: iSeriesId }, { sSeriesKey: 1 }).lean()
        sKey = series.sSeriesKey
      } else sKey = '90738' // default key

      addSeriesStatsTypes(sKey)

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.fetchSuccess.message.replace('##', 'Series Types') })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong })
    }
  }

  async update(req, res) {
    try {
      let query = {}
      const dEnd = moment().subtract(2, 'd').toDate()
      if (req?.body?.iSeriesId) query._id = ObjectId(req?.body?.iSeriesId)
      else {
        query = { $or: [{ sStatus: 'live' }, { dEndDate: { $gte: dEnd }, sStatus: 'result' }] }
      }

      const series = await SeriesModel.find(query).lean()
      if (series?.length) {
        for (const s of series) {
          scheduleMatchTask({ eType: 'statTypes', data: { sSeriesKey: s.sSeriesKey } }, moment().unix())
          // const oSeriesTypes = await getSeriesStatsTypes(s.sSeriesKey, 'udpate')
          // if (oSeriesTypes?.aFormats?.length) {
          //   for (const f of oSeriesTypes?.aFormats) {
          //     for (const st of oSeriesTypes?.aTypes) {
          //       scheduleMatchTask({ eType: 'stats', data: { sSeriesKey: s.sSeriesKey, iStatsTypeId: st._id, sStatsType: st.sType, iSeriesId: s._id, eGroupTitle: st.eGroupTitle, eFormat: f } }, moment().unix())
          //     }
          //   }
          // }
        }
        if (req?.body?.iSeriesId) {
          const grpcAck = await grpcControllers.getSlugs({ _id: [series[0]?.iCategoryId || req?.body?.iSeriesId] })
          const oMainSlug = grpcAck?.oSlugsData?.find(ele => (series[0]?.iCategoryId ? ele.eType === 'ct' : ele.eType === 'se') && ele.eSubType === 'st')
          axios({
            method: 'POST',
            url: `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUD_FLARE_ZONE_ID}/purge_cache`,
            headers: {
              'X-Auth-Email': process.env.CLOUD_FLARE_AUTH_EMAIL,
              'X-Auth-Key': process.env.CLOUD_FLARE_AUTH_KEY,
              'Content-Type': 'application/json'
            },
            data: {
              files: [{ url: `https://www.crictracker.com/${oMainSlug?.sSlug}/` }]
            }
          })
            .then(response => {
              console.log(response.data)
            })
            .catch(error => {
              console.error(error)
            })
        }
      }
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: 'series-statistics Done' })
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'series-statistics Done' })
    }
  }
}

const addSeriesStatsTypes = async (sKey) => {
  try {
    const response = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sKey}/stats/?token=${process.env.ENTITY_SPORT_TOKEN}`)
    const resData = response?.data?.response
    if (typeof resData !== 'string' && resData) {
      for (const el of resData?.stat_types) {
        let eGroupTitle
        if (el.group_title === 'Batting') eGroupTitle = 'Bat'
        if (el.group_title === 'Bowling') eGroupTitle = 'Bwl'
        if (el.group_title === 'Team') eGroupTitle = 'Team'

        for (const ty in el.types) {
          const params = {
            eGroupTitle,
            sType: ty,
            sDescription: el.types[ty],
            eProvider: 'es'
          }
          const exist = await SeriesStatsTypesModel.findOne(params).lean()
          if (!exist) await SeriesStatsTypesModel.create(params)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = new Statistics()
