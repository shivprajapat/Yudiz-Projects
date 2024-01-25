const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const adminAuthServices = require('../admin/auth/services')
const LiveInningsModel = require('./liveInnings/model')
const store = {}

describe('ScoreCard Routes', () => {
  before(async() => {
    store.ID = undefined
    store.wID = '5f7f0fd9b18344309eb41138'
    store.adminToken = await adminAuthServices.getAdminToken()
    const liveMatch = await LiveInningsModel.findOne({}, { _id: 1, iMatchId: 1 }).lean()
    store.iMatchId = liveMatch.iMatchId
  })

  describe('/GET full scorecard of match', () => {
    it('Should be get scorecard of match', (done) => {
      request(server)
        .get(`/api/admin/scorecard/${store.iMatchId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.scorecard))
          done()
        })
    })
    it('Should be not get scorecard of match because invalid id', (done) => {
      request(server)
        .get(`/api/admin/scorecard/${store.wID}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })
  })

  describe('/GET live inning scorecard of match', () => {
    it('Should be get live inning scorecard of match', (done) => {
      request(server)
        .get(`/api/admin/live-innings/${store.iMatchId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.innings))
          done()
        })
    })
    it('Should be not get live inning scorecard of match because invalid id', (done) => {
      request(server)
        .get(`/api/admin/live-innings/${store.wID}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })
  })
})
