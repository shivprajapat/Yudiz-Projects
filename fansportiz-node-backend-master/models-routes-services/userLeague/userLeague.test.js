/* eslint-disable indent */
const request = require('supertest')
const { describe, it, before } = require('mocha')
const expect = require('expect')
const { messages, status } = require('../../helper/api.responses')
const server = require('../../index')
 const UsersModel = require('../user/model')
 const { globalStore } = require('../../config/testStore')
 const { encryption } = require('../../helper/utilities.services')

const store = {}

describe('User League Routes', () => {
  before(async () => {
    store.userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmM3NzQ3NmFiYWI4MDBkMDRiZjA1OGMiLCJpYXQiOjE2MDY5MDcwNDAsImV4cCI6MTYxNDY4MzA0MH0.uwvCRR9eYkkAfp6jU2qlonZt1N0juSQSlCCIbfTOywo'
    const systemUser = await UsersModel.findOne({ _id: globalStore.systemUserID }, { aJwtTokens: 1 }).sort({ dCreatedAt: -1 }).lean()
    const secondSystemUser = await UsersModel.findOne({ eType: 'B', _id: { $ne: systemUser._id } }, { aJwtTokens: 1 }).sort({ dCreatedAt: -1 }).lean()
    store.token = globalStore.adminToken
    store.userToken = globalStore.userToken
    store.matchID = globalStore.matchID
    store.leagueID = undefined
    store.matchLeagueID = globalStore.matchLeagueID
    store.MatchPlayerList = []
    store.matchPendingID = undefined
    store.matchDetails = {}
    store.teamPlayers = {}
    store.teamAPlayers = {}
    store.teamBPlayers = {}
    store.matchLeagueDetails = {}
    store.createdTeamIDs = [globalStore.createdTeamID]
    store.createdSecondTeamID = globalStore.createdTeamID2
    store.UserTeamID = undefined
    store.userTeam = []
    store.wId = '5f7f0fd9b18344309eb41138'
    store.awId = ['5f7f0fd9b18344309eb41138']
    store.sportsType = 'cricket'
    store.userId = globalStore.userID
    store.systemUserToken = globalStore.systemUserToken
    store.systemUserTeamID1 = globalStore.createdSystemUserTeamID
    store.systemUserTeamID2 = globalStore.createdSystemUserSecondTeamID
    store.secondSystemUserToken = secondSystemUser.aJwtTokens[secondSystemUser.aJwtTokens.length - 1].sToken
    store.depositToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmEzNDkzMDAxYjI0ZTAzNjJiZmY1M2IiLCJpYXQiOjE2NTQ4NjgyNzJ9.vPNUKDM7VpNsX0w-Yj35IRaXl1HU2oAWv1-6mnup-dI'
  })

    describe('/POST create a user team to join league', () => {
      it('should be a joined league v3', (done) => {
        const data = {
          aUserTeamId: store.createdTeamIDs,
          iMatchLeagueId: store.matchLeagueID
        }
        request(server)
          .post('/api/user/user-league/join-league/v3')
          .send(data)
          .set('Authorization', store.userToken)
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch(messages.English.join_contest_succ.replace('##', messages.English.cuserJoined))
            done()
          })
      })

      it('should not be a joined league because same team is already Joined', (done) => {
        const data = {
          aUserTeamId: [store.createdTeamIDs[0]],
          iMatchLeagueId: store.matchLeagueID
        }
        request(server)
          .post('/api/user/user-league/join-league/v3')
          .send(data)
          .set('Authorization', store.userToken)
          .expect(status.BadRequest)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch(messages.English.user_already_joined)
            done()
          })
      })
  })

  describe('/POST User deposit', () => {
    it('Should be add deposit in user', (done) => {
      request(server)
        .post('/api/admin/deposit/v2')
        .set('Authorization', store.token)
        .send({
          iUserId: globalStore.systemUserID,
          nCash: 50,
          eType: 'deposit',
          sPassword: encryption('fantasy@321')
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.cDeposit))
          done()
        })
})
    it('Should be list deposit of user', (done) => {
      request(server)
        .get('/api/admin/deposit/list/v1')
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cDeposit))
          store.processDepositId = res.body.data.rows[0].id
          done()
        })
    })
  })
describe('/POST create user team for syster user join', () => {
    it('should be a joined league', (done) => {
      const data = {
        iUserTeamId: `${store.systemUserTeamID1}`,
        iMatchLeagueId: store.matchLeagueID,
        bPrivateLeague: false
}
      request(server)
        .post('/api/user/system-user-league/join-league/v1')
        .send(data)
        .set('Authorization', store.systemUserToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.cuserJoined))

          done()
        })
        it('should not be a joined league ', (done) => {
          const data = {
            iUserTeamId: `${store.wId}`,
            iMatchLeagueId: store.matchLeagueID
          }
          request(server)
            .post('/api/user/system-user-league/join-league/v1')
            .send(data)
            .set('Authorization', store.userToken)
            .expect(status.BadRequest)
            .end(function(err, res) {
              if (err) return done(err)
              expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cteam))
              done()
            })
        })
        it('should be a multientry or not ', (done) => {
          const data = {
            iUserTeamId: store.createdTeamIDs[1],
            iMatchLeagueId: store.matchLeagueID
          }
          request(server)
            .post('/api/user/user-league/join-league/v1')
            .send(data)
            .set('Authorization', store.systemUserToken)
            .expect(status.BadRequest)
            .end(function(err, res) {
              if (err) return done(err)
              if (store.matchLeagueDetails.bMultipleEntry !== true) {
                expect(res.body.message).toMatch(messages.English.multiple_join_err)
              }
              done()
            })
        })
    })

    it('should be a joined league v2', (done) => {
      const data = {
        aUserTeamId: store.createdTeamIDs,
        iMatchLeagueId: store.matchLeagueID
      }
      request(server)
        .post('/api/user/system-user-league/join-league/v2')
        .send(data)
        .set('Authorization', store.secondSystemUserToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.join_contest_succ.replace('##', messages.English.cuserJoined))
          done()
        })
    })
})

describe('/GET use league join details', () => {
  it('should get join details of user leagues ', (done) => {
    request(server)
      .get(`/api/user/user-league/join-details/${store.matchLeagueID}/v1`)
      .set('Authorization', store.userToken)
      .expect(status.OK)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cUserJoinedLeagueList))
        done()
      })
  })
})

describe('/GET Join list for user league V3', () => {
  it('should get join list for user league', (done) => {
    request(server)
    .get(`/api/user/user-league/join-list/${store.matchID}/v3`)
    .set('Authorization', store.userToken)
    .expect(status.OK)
    .end(function(err, res) {
      if (err) return done(err)
      expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cUserJoinedLeagueList))
      done()
    })
  })
})
describe('/POST Matchwise user league list for admin', () => {
  it('should get matchwise userleague list', (done) => {
const data = {
  iMatchId: store.matchID,
  iUserId: store.userId
}
    request(server)
    .post('/api/admin/user-league/v1')
    .set('Authorization', store.token)
    .send(data)
    .expect(status.OK)
    .end(function(err, res) {
      if (err) return done(err)
      expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cuserLeague))
      store.userLeagueId = res.body.data[0]._id
      done()
    })
  })
  it('should not get matchwise userleague list', (done) => {
const data = {
  iMatchId: `${store.wID} `,
  iUserId: store.userId
}
    request(server)
    .post('/api/admin/user-league/v1') // change route join details
    .set('Authorization', store.token)
    .send(data)
    .expect(status.InternalServerError)
    .end(function(err, res) {
      if (err) return done(err)
      expect(res.body.message).toMatch(messages.English.error)
      done()
    })
  })
})
describe('/GET user joined league list for user', () => {
  it(' should be a list of user joined data', (done) => {
    request(server)
      .get(`/api/user/user-league/join/${store.matchID}/v1`)
      .set('Authorization', store.userToken)
      .expect(status.OK)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body.data).toBeA('array')
        expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cUserJoinedLeagueList))
        done()
      })
  })
})
describe('/PUT switch user team', () => {
it('should switch user team', (done) => {
  const data = {
    iUserTeamId: `${store.createdSecondTeamID}`
  }
  request(server)
  .put(`/api/user/user-league/switch-team/${store.userLeagueId}/v1`)
  .set('Authorization', store.userToken)
  .send(data)
  .expect(status.OK)
  .end(function(err, res) {
    if (err) return done(err)
    expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.cuserTeamSwitched))
    done()
  })
})
it('should not switch user team as team already exists', (done) => {
  const data = {
    iUserTeamId: `${store.createdSecondTeamID}`
  }
  request(server)
  .put(`/api/user/user-league/switch-team/${store.userLeagueId}/v1`)
  .set('Authorization', store.userToken)
  .send(data)
  .expect(status.ResourceExist)
  .end(function(err, res) {
    if (err) return done(err)
    expect(res.body.message).toMatch(messages.English.already_exist.replace('##', messages.English.cuserTeam))
    done()
  })
})

it('should not switch user team as team does not exist', (done) => {
  const data = {
    iUserTeamId: `${store.wId}`
  }
  request(server)
  .put(`/api/user/user-league/switch-team/${store.userLeagueId}/v1`)
  .set('Authorization', store.userToken)
  .send(data)
  .expect(status.NotFound)
  .end(function(err, res) {
    if (err) return done(err)
    expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cuserTeam))
    done()
  })
})
it('should not switch user team as userleague does not exist', (done) => {
  const data = {
    iUserTeamId: `${store.createdSecondTeamID}`
  }
  request(server)
  .put(`/api/user/user-league/switch-team/${store.wId}/v1`)
  .set('Authorization', store.userToken)
  .send(data)
  .expect(status.NotFound)
  .end(function(err, res) {
    if (err) return done(err)
    expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cuserSpLeague))
    done()
  })
})
})
describe('/GET extra win list for admin', () => {
  it('should be a list of user extra win data', (done) => {
    request(server)
      .get(`/api/admin/user-league/extra-win-list/${store.matchID}/v1`)
      .set('Authorization', store.token)
      .expect(status.OK)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body.data).toBeA('array')
        expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.extrawin_list))
        done()
      })
  })
})
})
