const request = require('supertest')
const { describe, it, before, after } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const MatchModel = require('../match/model')
const PlayerModel = require('../player/model')
const { globalStore } = require('../../config/testStore')

const store = {}

describe('matchplayers routes', () => {
  before(async () => {
    const [footballMatchData, basketballMatchData, kabaddiMatchData, baseballMatchData, playerData] = await Promise.all([
      // MatchModel.findOne({ eProvider: 'ENTITYSPORT' }, { _id: 1 }).lean(),
      MatchModel.findOne({ eCategory: 'FOOTBALL' }, { _id: 1 }).lean(),
      MatchModel.findOne({ eCategory: 'BASKETBALL', eProvider: 'SPORTSRADAR' }, { _id: 1 }).lean(),
      MatchModel.findOne({ eCategory: 'KABADDI' }, { _id: 1 }).lean(),
      MatchModel.findOne({ eCategory: 'BASEBALL' }, { _id: 1 }).lean(),
      PlayerModel.findOne({ }, { _id: 1 }).lean()
    ])
    store.playerId = playerData._id
    store.iEntityPlayerId = undefined
    store.matchID = '61baeca9c213ef6d8cdf6454'
    store.entityMatchID = globalStore.matchID
    store.HomeID = globalStore.HomeID
    store.awayID = globalStore.AwayID
    store.matchPlayerID = undefined
    store.wId = '5f6dd7b7537f4a48c4e1126d'
    store.token = globalStore.adminToken
    store.userToken = globalStore.userToken
    store.football = footballMatchData._id
    store.kabaddi = kabaddiMatchData ? kabaddiMatchData._id : undefined
    store.basketball = basketballMatchData ? basketballMatchData._id : undefined
    store.matchDoesNotExist = '61fa5eae550be7ce09c85be2'
    store.baseball = baseballMatchData ? baseballMatchData._id : undefined
  })

  after(() => {
    // globalStore.MatchPlayerList = store.MatchPlayerList
  })

  describe('/POST create a match player', () => {
    it('Should be add match player', (done) => {
      const data = {
        iMatchId: globalStore.CustomMatchId,
        iTeamId: globalStore.CustomHomeId,
        sImage: 'abc/img.jpg',
        eRole: 'BATS',
        nFantasyCredit: '10',
        nScoredPoints: '10',
        bShow: true,
        sportsType: 'cricket',
        aPlayers: [{ sName: 'MSD', iPlayerId: store.playerId }]
      }
      request(server)
        .post('/api/admin/match-player/v2')
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cnewMatchPlayer))
          store.matchPlayerID = res.body.data[0]._id
          done()
        })
    })

    it('Should not be add match player', (done) => {
      const data = {
        iMatchId: `${store.entityMatchID}`,
        iTeamId: `${store.wId}`,
        sImage: 'abc/img.jpg',
        sName: 'MSD',
        eRole: 'BATS',
        nFantasyCredit: '10',
        nScoredPoints: '10',
        bShow: true,
        sportsType: 'cricket'
      }
      request(server)
        .post('/api/admin/match-player/v2')
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cteam))
          done()
        })
    })
  })

  describe('/GET details of perticular one match player', () => {
    it('Should be a get a details of match player', (done) => {
      request(server)
        .get(`/api/admin/match-player/${store.matchPlayerID}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.matchPlayer))
          done()
        })
    })
    it('Should not be a get a details of match player', (done) => {
      request(server)
        .get(`/api/admin/match-player/${store.wId}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.matchPlayer))
          done()
        })
    })
  })

  describe('/GET score points of perticular one match player', () => {
    it('Should be a get a score-points of match player', (done) => {
      request(server)
        .get(`/api/admin/match-player/score-point/${store.matchPlayerID}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cpointBreakup))
          done()
        })
    })
    it('Should not be a get a details of match player', (done) => {
      request(server)
        .get(`/api/admin/match-player/score-point/${store.wId}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.matchPlayer))
          done()
        })
    })
  })

  describe('/POST signed url for match player', () => {
    it('Should be signed url form match-player image', (done) => {
      request(server)
        .post('/api/admin/match-player/pre-signed-url/v1')
        .set('Authorization', store.token)
        .send({
          sFileName: 'player123.jpg',
          sContentType: 'image/jpeg'
        })
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.presigned_succ)
          done()
        })
    })

    it('Should not be signed url form match-player image', (done) => {
      request(server)
        .post('/api/admin/match-player/pre-signed-url/v1')
        .set('Authorization', store.token)
        .send({
          sFileName: 'player123.jpg'
        })
        .expect(status.UnprocessableEntity)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })
  })

  describe('/PUT update a match player', () => {
    it('should be a update a match player ', (done) => {
      const data = {
        iMatchId: globalStore.CustomMatchId,
        sName: 'MSD',
        eRole: 'WK',
        sportsType: 'cricket'
      }
      request(server)
        .put(`/api/admin/match-player/${store.matchPlayerID}/v1`)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.matchPlayer))
          done()
        })
    })

    it('should not be a update a match player ', (done) => {
      const data = {
        iMatchId: `${store.entityMatchID}`,
        sName: 'MSD',
        eRole: 'BATS',
        sportsType: 'cricket'
      }
      request(server)
        .put(`/api/admin/match-player/${store.wId}/v1`)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.matchPlayer))
          done()
        })
    })
  })

  describe('Admin : Get various match and player information', () => {
    it('Admin : should fetch a player information', (done) => {
      request(server)
        .get(`/api/admin/match-player/cricket/${store.entityMatchID}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.newMatchPlayers))
          done()
        })
    })

    it('Admin : should not fetch a player information because invalid match id', (done) => {
      request(server)
        .get(`/api/admin/match-player/cricket/${store.wId}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })

    it('Admin : should fetch playing eleven', (done) => {
      request(server)
        .get(`/api/admin/match-player/cricket/playing-eleven/${store.entityMatchID}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cplaying11))
          done()
        })
    })

    it('Admin : should not fetch playing eleven because invalid match id', (done) => {
      request(server)
        .get(`/api/admin/match-player/cricket/playing-eleven/${store.wId}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })

    it('Admin : should fetch a playing-eleven player information', (done) => {
      request(server)
        .get(`/api/admin/match-player/football/playing-eleven/${store.football}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cplaying11))
          done()
        })
    })

    it('Admin : should not fetch playing eleven for football because invalid match id', (done) => {
      request(server)
        .get(`/api/admin/match-player/football/playing-eleven/${store.wId}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })

    // it('Admin : should fetch a baseball players', (done) => {
    //   request(server)
    //     .get(`/api/admin/match-player/baseball/${store.baseball}/v1`)
    //     .set('Authorization', store.token)
    //     .expect(status.OK)
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.newMatchPlayers))
    //       done()
    //     })
    // })

    it('Admin : should fetch football player', (done) => {
      request(server)
        .get(`/api/admin/match-player/football/${store.football}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.newMatchPlayers))
          done()
        })
    })

    it('Admin : should not fetch football player because invalid match id', (done) => {
      request(server)
        .get(`/api/admin/match-player/football/${store.wId}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })

    // it('Admin : should fetch basket ball player', (done) => {
    //   request(server)
    //     .get(`/api/admin/match-player/basketball/${store.basketball}/v1`)
    //     .set('Authorization', store.token)
    //     .expect(status.OK)
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.newMatchPlayers))
    //       done()
    //     })
    // })

    // it('Admin : should fetch match player list', (done) => {
    //   request(server)
    //     .get(`/api/admin/match-player/list/${store.}/v1`)
    //     .set('Authorization', store.token)
    //     .expect(status.OK)
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.matchPlayer))
    //       console.log('Matchhh Player Listttt', res.body.data[0].results)
    //       store.MatchPlayerList = res.body.data[0].results
    //       console.log('store MAtchplayer', store.MatchPlayerList)
    //       console.log('Entity match ID', store.entityMatchID)
    //       done()
    //     })
    // })
    it('Admin : should fetch match player list of third party api', (done) => {
      request(server)
        .get(`/api/admin/match-player/list/${store.entityMatchID}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.matchPlayer))
          store.MatchPlayerList = res.body.data[0].results
          store.iEntityPlayerId = res.body.data[0].results[0]._id
          globalStore.MatchPlayerList = store.MatchPlayerList
          done()
        })
    })

    it('Admin : should not fetch match player because invalid match id', (done) => {
      request(server)
        .get(`/api/admin/match-player/list/${store.wId}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })

    it('Admin : should fetch season point v1', (done) => {
      request(server)
        .put(`/api/admin/match-player/season-point/${store.entityMatchID}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cseasonPoint))
          done()
        })
    })

    it('Admin : should not fetch season point v1', (done) => {
      request(server)
        .put(`/api/admin/match-player/season-point/${store.matchDoesNotExist}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })

    it('Admin : should fetch season point v2 for single match', (done) => {
      const data = {
        id: '6375d8a648ba9a268cc34146'
      }
      request(server)
        .put('/api/admin/match-player/season-point/v2')
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cseasonPoint))
          done()
        })
    })

    it('Admin : should not fetch season point v2 for a single match', (done) => {
      const data = {
        id: '637dedecb4a53c8682cc3fa0'
      }
      request(server)
        .put('/api/admin/match-player/season-point/v2')
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })

    it('should be calculate all match season point', (done) => {
      request(server)
        .put('/api/admin/match-player/season-point/v2')
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cseasonPoint))
          done()
        })
    })

    /** kabbadi and baseball related test cases not working because of 3rd party apis */
    // it('Admin : should fetch kabaddi player', (done) => {
    //   request(server)
    //     .get(`/api/admin/match-player/kabaddi/${store.kabaddi}/v1`)
    //     .set('Authorization', store.token)
    //     .expect(status.OK)
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.newMatchPlayers))
    //       done()
    //     })
    // })

    // it('Admin : should fetch kabaddi starting seven', (done) => {
    //   request(server)
    //     .get(`/api/admin/match-player/kabaddi/starting-seven/${store.kabaddi}/v1`)
    //     .set('Authorization', store.token)
    //     .expect(status.OK)
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cstarting7))
    //       done()
    //     })
    // })

    // it('Admin : should not fetch kabaddi starting seven', (done) => {
    //   request(server)
    //     .get(`/api/admin/match-player/kabaddi/starting-seven/${store.basketball}/v1`)
    //     .set('Authorization', store.token)
    //     .expect(status.NotFound)
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
    //       done()
    //     })
    // })

    // it('Admin : should fetch basketball five', (done) => {
    //   request(server)
    //     .get(`/api/admin/match-player/basketball/starting-five/${store.basketball}/v1`)
    //     .set('Authorization', store.token)
    //     .expect(status.OK)
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cstarting5))
    //       done()
    //     })
    // })

    // it('Admin : should not fetch basketball five', (done) => {
    //   request(server)
    //     .get(`/api/admin/match-player/basketball/starting-five/${store.wId}/v1`)
    //     .set('Authorization', store.token)
    //     .expect(status.NotFound)
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
    //       done()
    //     })
    // })
  })

  describe('USER : Get various match player information', () => {
    it('User:should fetch a player information v2', (done) => {
      request(server)
        .get(`/api/user/match-player/${store.entityMatchID}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.matchPlayer))
          done()
        })
    })

    it('User:should not fetch a player information as id passed in url does not exist v2', (done) => {
      request(server)
        .get(`/api/user/match-player/${store.wId}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })

    it('User:should fetch a player information', (done) => {
      request(server)
        .get(`/api/user/match-player-info/${store.matchPlayerID}/v1`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.matchPlayer))
          done()
        })
    })

    it('User:should fetch a player score point', (done) => {
      request(server)
        .get(`/api/user/match-player/score-point/${store.matchPlayerID}/v1`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cscorePoints))
          done()
        })
    })

    it('User :should not fetch a player score point as id passed in url does not exist', (done) => {
      request(server)
        .get('/api/user/match-player/score-point/61baecd0c213ef6d8cdf64e6/v1')
        .set('Authorization', store.userToken)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cscorePoints))
          done()
        })
    })

    it('User :should fetch a season point', (done) => {
      request(server)
        .get(`/api/user/match-player/season-point/${store.matchPlayerID}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.matchPlayer))
          done()
        })
    })
    it('User :should not fetch a season point as id passed in url does not exist', (done) => {
      request(server)
        .get(`/api/user/match-player/season-point/${store.wId}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.match))
          done()
        })
    })
  })

  describe('/PUT score-point of match player', () => {
    const data = {
      aPointBreakup: [
        {
          _id: '62a3493001b24e0362bff253',
          nScoredPoints: 0
        },
        {
          _id: '62a3493001b24e0362bff254',
          nScoredPoints: 130
        }
      ]
    }
    it('should be a update a score-point', (done) => {
      request(server)
        .put(`/api/admin/match-player/score-point/${store.matchPlayerID}/v1`)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.matchPlayer))
          done()
        })
    })

    it('should not be a update a score-point', (done) => {
      const data = {
        aPointBreakup: [
          {
            _id: '62a3493001b24e0362bff253',
            nScoredPoints: 0
          },
          {
            _id: '62a3493001b24e0362bff254',
            nScoredPoints: 130
          }
        ]
      }
      request(server)
        .put(`/api/admin/match-player/score-point/${store.wId}/v1`)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.matchPlayer))
          done()
        })
    })
  })

  describe('/DELETE a match player', () => {
    it('should be a delete a matchplayer', (done) => {
      request(server)
        .delete(`/api/admin/match-player/${store.matchPlayerID}/v2?iMatchId=${globalStore.CustomMatchId}`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.del_success.replace('##', messages.English.matchPlayer))
          done()
        })
    })

    it('should not be a delete a matchplayer', (done) => {
      request(server)
        .delete(`/api/admin/match-player/${store.wId}/v2?iMatchId=${store.entityMatchID}`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.matchPlayer))
          done()
        })
    })
  })

  describe('Admin: /PUT reset matchplayer detail', () => {
    it('Should not be reset matchplayer detail', (done) => {
      request(server)
        .put(`/api/admin/match-player/reset/${store.wId}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.matchPlayer))
          done()
        })
    })
    it('Should be reset matchplayer detail', (done) => {
      request(server)
        .put(`/api/admin/match-player/reset/${store.iEntityPlayerId}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.refresh_success.replace('##', messages.English.matchPlayer))
          done()
        })
    })
  })
})
