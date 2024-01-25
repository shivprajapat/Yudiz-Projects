const request = require('supertest')
const { describe, it } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const store = {}

describe('cron routes', () => {
  describe('/POST cron for calculate MatchPlayer Set By', () => {
    it('should be a cron added data for processing', (done) => {
      request(server)
        .post('/api/admin/cron/v1')
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.matchPlayer))
          done()
        })
    })
  })

  describe('/POST Match-live cron ', () => {
    it('should be cancel match league if not fulfill it\'s criteria', (done) => {
      request(server)
        .post('/api/admin/cron/match-live/v1')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.matchStatus))
          done()
        })
    })
  })

  describe('/POST Bonus Expire cron ', () => {
    it('should be Expired bonus of all users', (done) => {
      request(server)
        .post('/api/admin/cron/bonus-expire/v1')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.cBackgroundProcess.replace('##', messages.English.cExpireBonus))
          done()
        })
    })
  })

  describe('/GET Live Leader board cron ', () => {
    it('should be generate score points for all live match', (done) => {
      request(server)
        .get('/api/admin/cron/leaderboard/v1')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.leaderboard))
          done()
        })
    })
  })

  describe('/GET load Leader board cron ', () => {
    it('Should be get upcoming match list', (done) => {
      request(server)
        .get('/api/user/match/list/v1?sportsType=cricket')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cupcomingMatch))
          store.iMatchId = res.body.data[0]._id
          done()
        })
    })

    it('should be load leader board to redis', (done) => {
      request(server)
        .get(`/api/admin/cron/load-leaderboard/v1?matchId=${store.iMatchId}`)
        .send()
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.leaderboard))
          done()
        })
    })
  })

  describe('/GET calculate season point cron ', () => {
    it('should be calculate season point', (done) => {
      request(server)
        .get('/api/admin/cron/calculate-season-point/v1')
        .expect(({ body }) => {
          if (!(body.status === status.OK) && !(body.status === status.NotFound)) throw new Error(`expected status is ${status.OK} or ${status.NotFound} but matching status is ${body.status}`)
        })
        .end((err, res) => {
          if (err) return done(err)
          if (res.body.status === status.OK) expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.matchStatus))
          else expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.matchPlayer))
          done()
        })
    })
  })

  /** cashFree payment gateway involve so failed some time */
  // describe('/GET process payment cron ', () => {
  //   it('should be process payment', (done) => {
  //     request(server)
  //       .get('/api/admin/cron/process-payment/v1')
  //       .expect(status.OK)
  //       .end((err, res) => {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.processDepositPayment))
  //         done()
  //       })
  //   })
  // })

  describe('/GET remove pending matches cron ', () => {
    it('should be remove pending matches cron', (done) => {
      request(server)
        .get('/api/admin/cron/remove-pending-matches/v1')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toBe([messages.English.no_pending_match_remove, messages.English.pending_match_remove].includes(res.body.message) ? res.body.message : false)
          done()
        })
    })
  })

  describe('/GET process play return cron ', () => {
    it('should be process play return', (done) => {
      request(server)
        .get('/api/admin/cron/process-playreturn/v1')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.queued_success.replace('##', messages.English.cmatchLeague))
          done()
        })
    })
  })

  describe('/GET process initiated payouts cron ', () => {
    it('should be process initiated payouts', (done) => {
      request(server)
        .get('/api/admin/cron/process-initiated-payouts/v1')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.processInitiatePayout))
          done()
        })
    })
  })

  describe('/GET fix statistics cron ', () => {
    it('should be fix statistics', (done) => {
      request(server)
        .get('/api/admin/cron/fix-statistics/v1')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.queued_success.replace('##', messages.English.cmatchLeague))
          done()
        })
    })
  })

  describe('/GET check live leagues cron ', () => {
    it('should be check live leagues', (done) => {
      request(server)
        .get('/api/admin/cron/check-live-leagues/v1')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.check_live_leagues)
          done()
        })
    })
  })

  /* It is taking too much time to execute because it fetch upcoming match and update data from 3rd party api one by one */
  // describe('/GET update match data cron ', () => {
  //   it('should be update match data', (done) => {
  //     request(server)
  //       .get('/api/admin/cron/update-match-data/v1')
  //       .expect(status.OK)
  //       .end((err, res) => {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch(messages.English.refresh_success.replace('##', messages.English.match))
  //         done()
  //       })
  //   })
  // })

  describe('/GET remove old apilogs cron ', () => {
    it('should remove old apilogs', (done) => {
      request(server)
        .get('/api/admin/cron/remove-old-apilogs/v1')
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.old_api_logs_remove)
          done()
        })
    })
  })
})
