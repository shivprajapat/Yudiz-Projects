const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const { globalStore } = require('../../config/testStore')
const store = {}

describe('PlayerRoles Routes', () => {
  before(async() => {
    store.ID = undefined
    store.wId = '5f7f0fd9b18344309eb41138'
    store.token = globalStore.adminToken
    store.iMatchId = globalStore.matchID
  })

  describe('/GET Player Role Sports Wise', () => {
    it('Should be fetch player role list', (done) => {
      request(server)
        .get('/api/admin/player-role/v1?sportsType=cricket')
        .set('Authorization', store.token)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cplayerRole))
          store.ID = res.body.data[0]._id
          done()
        })
    })

    it('Should not be fetch player role list because invalid category', (done) => {
      request(server)
        .get('/api/admin/player-role/v1?sportsType=chess')
        .set('Authorization', store.token)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cplayerRole))
          done()
        })
    })
  })

  describe('/GET details of Player Role', () => {
    it('Should be fetch player role  details', (done) => {
      request(server)
        .get(`/api/admin/player-role/${store.ID}/v1?sportsType=cricket`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cplayerRole))
          done()
        })
    })

    it('Should not be fetch player role  details', (done) => {
      request(server)
        .get(`/api/admin/player-role/${store.wId}/v1?sportsType=hockey`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cplayerRole))
          done()
        })
    })
  })

  describe('/PUT Update player Role', () => {
    it('Should be update a player role', (done) => {
      const updatePlayerRole = {
        sFullName: 'BatsMan',
        nMax: 5,
        nMin: 2
      }
      request(server)
        .put(`/api/admin/player-role/${store.ID}/v2?sportsType=cricket`)
        .set('Authorization', store.token)
        .send(updatePlayerRole)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cplayerRole))
          done()
        })
    })

    it('Should not be update player role  details as wId does not exist', (done) => {
      const updatePlayerRole = {
        sFullName: 'BatsMan',
        nMax: 5,
        nMin: 2
      }
      request(server)
        .put(`/api/admin/player-role/${store.wId}/v2?sportsType=cricket`)
        .set('Authorization', store.token)
        .send(updatePlayerRole)
        .expect(status.NotFound)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cplayerRole))
          done()
        })
    })

    it('Should not be update player role  details because min is greater than max', (done) => {
      const updatePlayerRole = {
        sFullName: 'BatsMan',
        nMax: 5,
        nMin: 10
      }
      request(server)
        .put(`/api/admin/player-role/${store.ID}/v2?sportsType=cricket`)
        .set('Authorization', store.token)
        .send(updatePlayerRole)
        .expect(status.BadRequest)
        .end((err, res) => {
          if (err) return done(err)
          if (updatePlayerRole.nMin > updatePlayerRole.nMax) {
            expect(res.body.message).toMatch(messages.English.less_then_err.replace('##', messages.English.cminumum).replace('#', messages.English.cmaximum))
          }
          done()
        })
    })
  })

  describe('/GET match Player Role', () => {
    it('Should be fetch player role of match', (done) => {
      request(server)
        .get(`/api/user/match-player-role/${store.iMatchId}/v1`)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cplayerRole))
          done()
        })
    })

    it('Should not be fetch player role of match', (done) => {
      request(server)
        .get(`/api/user/match-player-role/${store.wId}/v1`)
        .expect(status.NotFound)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })
  })
})
