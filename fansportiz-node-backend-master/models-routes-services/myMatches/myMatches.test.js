const request = require('supertest')
const { describe, before, it } = require('mocha')
const expect = require('expect')
const { messages, status } = require('../../helper/api.responses')
const server = require('../../index')
const { globalStore } = require('../../config/testStore')
const store = {}

describe('My Matches Routes', () => {
  before(async() => {
    store.wId = '5f7f0fd9b18344309eb41138'
    store.userToken = globalStore.userToken
    store.sportsType = 'cricket'
    store.iUserId = globalStore.userData._id
  })

  describe('/GET list of upcoming matches', () => {
    it('Should be add cricket match', (done) => {
      request(server)
        .get(`/api/user/my-matches/list/v4?sportsType=${store.sportsType}&type=U`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cmyMatch))
          done()
        })
    })
  })

  describe('/GET list of completed matches', () => {
    it('Should be get list of my matches', (done) => {
      request(server)
        .get(`/api/user/my-matches/list-complete/${store.iUserId}/v1`)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cmyMatch))
          done()
        })
    })
  })

  describe('/GET list of common matches', () => {
    it('Should be get list of common my matches', (done) => {
      request(server)
        .get(`/api/user/my-matches/list-complete/${store.iUserId}/v1`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cmyMatch))
          done()
        })
    })
  })

  describe('/GET details of compare statistics', () => {
    it('Should be get details of compare statistics', (done) => {
      request(server)
        .get(`/api/user/my-matches/compare-statistics/${store.iUserId}/v1`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cuserData))
          done()
        })
    })
  })
})
