const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const ReportModel = require('./model')
const { globalStore } = require('../../config/testStore')
const store = {}

describe('Report Routes', () => {
  before(async() => {
    store.ID = '60deb02a790e8f384049b828'
    store.wID = '5f7f0fd9b18344309eb41138'
    store.adminToken = globalStore.adminToken
  })

  describe('/GET match list', () => {
    it('Should get completed match list', (done) => {
      request(server)
        .get('/api/admin/match/list/v1?start=0&limit=5&sportsType=cricket&filter=CMP')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.match))
          store.iComptedMatchId = res.body.data.length ? res.body.data[0].results[0]._id : store.wID
          done()
        })
    })

    it('Should get upcoming match list', (done) => {
      request(server)
        .get('/api/admin/match/list/v1?start=0&limit=1&sportsType=cricket&filter=u')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.match))
          store.iUpcomingMatchId = res.body.data.length ? res.body.data[0].results[0]._id : store.wID
          done()
        })
    })
  })

  describe('/POST add match report', () => {
    it('Should be add match report', (done) => {
      request(server)
        .post(`/api/admin/report/${store.iComptedMatchId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.creport))
          done()
        })
    })
    it('Should not get report because invalid id', (done) => {
      request(server)
        .post(`/api/admin/report/${store.wID}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.match_not_complete)
          done()
        })
    })
  })

  describe('/PUT update match report', () => {
    it('Should be update match report', (done) => {
      request(server)
        .put(`/api/admin/update-report/${store.iComptedMatchId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.creport))
          done()
        })
    })
    it('Should not update report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/update-report/${store.wID}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.match_not_complete)
          done()
        })
    })
  })

  describe('/GET match report', () => {
    it('Should be get match report', (done) => {
      request(server)
        .get(`/api/admin/report/${store.iComptedMatchId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(async function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          await ReportModel.deleteOne({ iMatchId: store.iComptedMatchId })
          done()
        })
    })
    it('Should not get report because invalid id', (done) => {
      request(server)
        .get(`/api/admin/report/${store.wID}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.creport))
          done()
        })
    })
  })

  describe('/GET generalize report list', () => {
    it('Should be get generalize report', (done) => {
      request(server)
        .get('/api/admin/reports/v1')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.cgeneralizeReport))
          const report = res.body.data.find(({ eType }) => eType === 'U')
          store.iTeamsId = report.aTeams.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iParticipantsId = report.aParticipants.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iWinsId = report.aWins.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iWinReturnId = report.aWinReturn.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iPrivateLeagueId = report.aPrivateLeague.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iPlayReturnId = report.aPlayReturn.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iPlayId = report.aPlayed.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iCashbackId = report.aCashback.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iCashbackReturnId = report.aCashbackReturn.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iCreatorBonusId = report.aCreatorBonus.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iCreatorBonusReturnId = report.aCreatorBonusReturn.find(({ eCategory }) => eCategory === 'CRICKET')._id
          store.iAppId = report.aAppDownload.find(({ ePlatform }) => ePlatform === 'A')._id

          done()
        })
    })
  })

  describe('/PUT generalize report list : User reports', () => {
    const data = { eKey: 'W', eType: 'U' }
    it('Should be update generalize report TU', (done) => {
      data.eKey = 'TU'
      request(server)
        .put('/api/admin/user-reports/v1')
        .send(data)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be update generalize report RU', (done) => {
      data.eKey = 'RU'
      request(server)
        .put('/api/admin/user-reports/v1')
        .send(data)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be update generalize report LU', (done) => {
      data.eKey = 'LU'
      request(server)
        .put('/api/admin/user-reports/v1')
        .send(data)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be update generalize report TUT', (done) => {
      data.eKey = 'TUT'
      request(server)
        .put('/api/admin/user-reports/v1')
        .send(data)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be update generalize report W', (done) => {
      data.eKey = 'W'
      request(server)
        .put('/api/admin/user-reports/v1')
        .send(data)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be update generalize report UB', (done) => {
      data.eKey = 'UB'
      request(server)
        .put('/api/admin/user-reports/v1')
        .send(data)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be update generalize report BE', (done) => {
      data.eKey = 'BE'
      request(server)
        .put('/api/admin/user-reports/v1')
        .send(data)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be update generalize report TDS', (done) => {
      data.eKey = 'TDS'
      request(server)
        .put('/api/admin/user-reports/v1')
        .send(data)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be update generalize report ABCD', (done) => {
      data.eKey = 'ABCD'
      request(server)
        .put('/api/admin/user-reports/v1')
        .send(data)
        .set('Authorization', store.adminToken)
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })
  })

  describe('/PUT generalize report list : play-reports', () => {
    it('Should be update generalize report PL', (done) => {
      request(server)
        .put(`/api/admin/play-reports/${store.iPlayId}/v1`)
        .send({ eKey: 'PL', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cPlayReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/play-reports/${store.iPlayId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/play-reports/${store.wID}/v1`)
        .send({ eKey: 'PL', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cPlayReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : play-return-reports', () => {
    it('Should be update generalize report PR', (done) => {
      request(server)
        .put(`/api/admin/play-return-reports/${store.iPlayReturnId}/v1`)
        .send({ eKey: 'PR', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cPlayReturnReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/play-return-reports/${store.iPlayReturnId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/play-return-reports/${store.wID}/v1`)
        .send({ eKey: 'PR', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cPlayReturnReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : cashback-reports', () => {
    it('Should be update generalize report CC', (done) => {
      request(server)
        .put(`/api/admin/cashback-reports/${store.iCashbackId}/v1`)
        .send({ eKey: 'CC', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cCashbackReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/cashback-reports/${store.iCashbackId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/cashback-reports/${store.wID}/v1`)
        .send({ eKey: 'CC', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cCashbackReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : cashback-return-reports', () => {
    it('Should be update generalize report CR', (done) => {
      request(server)
        .put(`/api/admin/cashback-return-reports/${store.iCashbackReturnId}/v1`)
        .send({ eKey: 'CR', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cCashbackReturnReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/cashback-return-reports/${store.iCashbackReturnId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/cashback-return-reports/${store.wID}/v1`)
        .send({ eKey: 'CR', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cCashbackReturnReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : wins-reports', () => {
    it('Should be update wins report', (done) => {
      request(server)
        .put(`/api/admin/wins-reports/${store.iWinsId}/v1`)
        .send({ eKey: 'TW', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cWinningReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/wins-reports/${store.iWinsId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/wins-reports/${store.wID}/v1`)
        .send({ eKey: 'TW', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cWinningReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : wins-return-reports', () => {
    it('Should be update wins report', (done) => {
      request(server)
        .put(`/api/admin/wins-return-reports/${store.iWinReturnId}/v1`)
        .send({ eKey: 'TWR', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cWinningReturnReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/wins-return-reports/${store.iWinReturnId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/wins-return-reports/${store.wID}/v1`)
        .send({ eKey: 'TWR', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cWinningReturnReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : creator-bonus', () => {
    it('Should be update wins report', (done) => {
      request(server)
        .put(`/api/admin/creator-bonus/${store.iCreatorBonusId}/v1`)
        .send({ eKey: 'CB', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cCreatorBonusReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/creator-bonus/${store.iCreatorBonusId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/creator-bonus/${store.wID}/v1`)
        .send({ eKey: 'CB', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cCreatorBonusReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : creator-bonus-return', () => {
    it('Should be update wins report', (done) => {
      request(server)
        .put(`/api/admin/creator-bonus-return/${store.iCreatorBonusReturnId}/v1`)
        .send({ eKey: 'CBR', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cCreatorBonusReturnReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/creator-bonus-return/${store.iCreatorBonusReturnId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/creator-bonus-return/${store.wID}/v1`)
        .send({ eKey: 'CBR', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cCreatorBonusReturnReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : User team report', () => {
    it('Should be update user team report', (done) => {
      request(server)
        .put(`/api/admin/userteam-reports/${store.iTeamsId}/v1`)
        .send({ eKey: 'UT', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cTeamsReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/userteam-reports/${store.iTeamsId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/userteam-reports/${store.wID}/v1`)
        .send({ eKey: 'UT', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cTeamsReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : league-participants-reports', () => {
    it('Should be update league participants report', (done) => {
      request(server)
        .put(`/api/admin/league-participants-reports/${store.iParticipantsId}/v1`)
        .send({ eKey: 'LP', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cParticipantReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/league-participants-reports/${store.iParticipantsId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/league-participants-reports/${store.wID}/v1`)
        .send({ eKey: 'LP', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cParticipantReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : private-league-reports', () => {
    it('Should be update cancelled private league report', (done) => {
      request(server)
        .put(`/api/admin/private-league-reports/${store.iPrivateLeagueId}/v1`)
        .send({ eKey: 'CNCLL', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cPrivateLeagueReport))
          done()
        })
    })

    it('Should be update completed private league report', (done) => {
      request(server)
        .put(`/api/admin/private-league-reports/${store.iPrivateLeagueId}/v1`)
        .send({ eKey: 'CMPL', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cPrivateLeagueReport))
          done()
        })
    })

    it('Should be update created private league report', (done) => {
      request(server)
        .put(`/api/admin/private-league-reports/${store.iPrivateLeagueId}/v1`)
        .send({ eKey: 'CL', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cPrivateLeagueReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/private-league-reports/${store.iPrivateLeagueId}/v1`)
        .send({ eKey: 'AD', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/private-league-reports/${store.wID}/v1`)
        .send({ eKey: 'CL', eCategory: 'CRICKET', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cPrivateLeagueReport))
          done()
        })
    })
  })

  describe('/PUT generalize report list : app-download-reports', () => {
    it('Should be update app download report', (done) => {
      request(server)
        .put(`/api/admin/app-download-reports/${store.iAppId}/v1`)
        .send({ eKey: 'AD', ePlatform: 'A', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cAppDownloadReport))
          done()
        })
    })

    it('Should not be update generalize report because invalid key', (done) => {
      request(server)
        .put(`/api/admin/app-download-reports/${store.iAppId}/v1`)
        .send({ eKey: 'CL', ePlatform: 'A', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cKey))
          done()
        })
    })

    it('Should not be update generalize report because invalid id', (done) => {
      request(server)
        .put(`/api/admin/app-download-reports/${store.wID}/v1`)
        .send({ eKey: 'AD', ePlatform: 'A', eType: 'U' })
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cAppDownloadReport))
          done()
        })
    })
  })

  describe('/GET filtered generalize report', () => {
    const dStartDate = new Date()
    it('Should be get filtered generalize report : USER_REPORT', (done) => {
      const eKey = 'USER_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : USERTEAM_REPORT', (done) => {
      const eKey = 'USERTEAM_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : PARTICIPANT_REPORT', (done) => {
      const eKey = 'PARTICIPANT_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)

        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : WIN_REPORT', (done) => {
      const eKey = 'WIN_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : PRIVATE_LEAGUE_REPORT', (done) => {
      const eKey = 'PRIVATE_LEAGUE_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : PLAY_REPORT', (done) => {
      const eKey = 'PLAY_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : PLAY_RETURN_REPORT', (done) => {
      const eKey = 'PLAY_RETURN_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : CASHBACK_REPORT', (done) => {
      const eKey = 'CASHBACK_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : CASHBACK_RETURN_REPORT', (done) => {
      const eKey = 'CASHBACK_RETURN_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : CREATOR_BONUS_REPORT', (done) => {
      const eKey = 'CREATOR_BONUS_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : CREATOR_BONUS_RETURN_REPORT', (done) => {
      const eKey = 'CREATOR_BONUS_RETURN_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : WIN_RETURN_REPORT', (done) => {
      const eKey = 'WIN_RETURN_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })

    it('Should be get filtered generalize report : APP_DOWNLOAD_REPORT', (done) => {
      const eKey = 'APP_DOWNLOAD_REPORT'
      request(server)
        .get(`/api/admin/filter-reports/v1?dStartDate=${dStartDate}&dEndDate=${new Date()}&eKey=${eKey}&eType=U`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.creport))
          done()
        })
    })
  })
})
