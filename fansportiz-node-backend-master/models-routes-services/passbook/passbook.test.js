const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const { globalStore } = require('../../config/testStore')
const store = {}

describe('Passbook Routes', () => {
  before(async () => {
    store.ID = undefined
    store.wID = '5f7f0fd9b18344309eb41138'
    store.adminToken = globalStore.adminToken
    store.userToken = globalStore.userToken
    store.iUserId = globalStore.userID
  })

  describe('/GET list passbook to admin', () => {
    it('Should be list passbook of user', (done) => {
      request(server)
        .get('/api/admin/passbook/list/v2?start=0&limit=5')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.ctransactions))
          done()
        })
    })
  })

  describe('/GET list passbook to user', () => {
    it('Should be list passbook of user', (done) => {
      request(server)
        .get('/api/user/passbook/list/v1?start=0&limit=5')
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cpassbook))
          done()
        })
    })
  })

  describe('/GET users passbook detail', () => {
    it('Should be get user passbook detail', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.iUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cpassbook))
          done()
        })
    })
  })

  describe('/GET passbook list count', () => {
    it('Should be get passbook count', (done) => {
      request(server)
        .get('/api/admin/passbook/counts/v2')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', `${messages.English.ctransactions} ${messages.English.cCounts}`))
          done()
        })
    })
  })

  describe('/GET matchLeague wise passbook list', () => {
    it('Should be get matchLeague wise passbook list', (done) => {
      request(server)
        .get(`/api/admin/passbook/match-league-list/${store.iMatchLeagueId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cpassbook))
          done()
        })
    })
  })

  describe('/GET matchLeague wise passbook list count', () => {
    it('Should be get matchLeague wise passbook count', (done) => {
      request(server)
        .get(`/api/admin/passbook/match-league-list/count/${store.iMatchLeagueId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', `${messages.English.ctransactions} ${messages.English.cCounts}`))
          done()
        })
    })
  })
})
