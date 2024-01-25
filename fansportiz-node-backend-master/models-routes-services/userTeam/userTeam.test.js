const request = require('supertest')
const { describe, it, before, after } = require('mocha')
const expect = require('expect')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const { globalStore } = require('../../config/testStore')
const UserLeagueModel = require('../userLeague/model')
const UsersModel = require('../user/model')
const { generateNumber } = require('../../helper/utilities.services')

const store = {}
describe('UserTeam routes', () => {
  before(async() => {
    store.matchID = globalStore.matchID
    store.teamPlayers = {}
    store.teamAPlayers = {}
    store.teamBPlayers = {}
    store.matchDetails = {}
    store.MatchPlayerList = globalStore.MatchPlayerList
    store.createdTeamID = undefined
    store.userTeam = []
    store.wId = '5f7f0fd9b18344309eb41138'
    store.adminToken = globalStore.adminToken
    store.iUserId = globalStore.userID
    store.userToken = globalStore.userToken
    store.sportsType = 'cricket'
    const [userLeague, systemUser] = await Promise.all([
      UserLeagueModel.findOne({ }, { _id: 1, iMatchLeagueId: 1 }).sort({ dCreatedAt: -1 }).lean(),
      UsersModel.findOne({ eType: 'B' }, { aJwtTokens: 1 }).lean()
    ])
    store.iUserLeagueId = userLeague._id
    store.iMatchLeagueId = userLeague.iMatchLeagueId
    store.systemUserToken = systemUser.aJwtTokens[0].sToken
  })
  after(() => {
    globalStore.createdTeamID = store.createdTeamID
    globalStore.createdTeamID2 = store.createdTeamID2
    globalStore.createdSystemUserTeamID = store.systemUserTeamId1
    globalStore.createdSystemUserSecondTeamID = store.systemUserTeamId2
    globalStore.systemUserID = store.systemUserID
    globalStore.systemUserToken = store.systemUserToken
    globalStore.iMatchLeagueId = store.iMatchLeagueId
  })
  describe('/Get user Team List', () => {
    it('should be a get user Team player list', (done) => {
      request(server)
        .get(`/api/user/user-team/teams/${store.matchID}/v3`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cuserTeams))
          done()
        })
    })
  })

  describe('/Post Add User Team', () => {
    it('should be a Add User team', (done) => {
      store.MatchPlayerList.map(player => {
        if (!store.teamPlayers[player.sTeamName]) {
          store.teamPlayers[player.sTeamName] = []
        }
        store.teamPlayers[player.sTeamName].push(player)
      })

      const teamNames = Object.keys(store.teamPlayers)
      teamNames.forEach(teamName => {
        if (teamName === teamNames[0]) {
          store.teamPlayers[teamName].map(player => {
            if (!store.teamAPlayers[player.eRole]) {
              store.teamAPlayers[player.eRole] = []
            }
            store.teamAPlayers[player.eRole].push({ iMatchPlayerId: player._id })
          })
        } else {
          store.teamPlayers[teamName].map(player => {
            if (!store.teamBPlayers[player.eRole]) {
              store.teamBPlayers[player.eRole] = []
            }
            store.teamBPlayers[player.eRole].push({ iMatchPlayerId: player._id })
          })
        }
      })

      const teamKeys = Object.keys(store.teamAPlayers)
      teamKeys.forEach(Role => {
        var Array1 = store.teamAPlayers[Role]
        var Array2 = store.teamBPlayers[Role]
        let randomItem1
        let randomItem2
        if (Role && Array1 && Array1.length) {
          randomItem1 = Array1[generateNumber(0, Array1.length)]
          const index = Array1.findIndex((player) => player.iMatchPlayerId === randomItem1.iMatchPlayerId)
          Array1.splice(index, 1)
        } else {
          randomItem1 = store.teamAPlayers.BAT[generateNumber(0, store.teamAPlayers.BAT.length)]
        }
        if (Role && Array2 && Array2.length) {
          randomItem2 = Array2[generateNumber(0, Array2.length)]
          const index2 = Array2.findIndex((player) => player.iMatchPlayerId === randomItem2.iMatchPlayerId)
          Array2.splice(index2, 1)
        } else {
          randomItem2 = store.teamBPlayers.BAT[generateNumber(0, store.teamBPlayers.BAT.length)]
        }
        if (Role === 'BATS' || Role === 'BWL' || Role === 'ALLR') {
          if (Array1.length >= Array2.length) {
            let randomItem3 = Array1[generateNumber(0, Array1.length)]
            if (randomItem1.iMatchPlayerId === randomItem3.iMatchPlayerId) {
              randomItem3 = Array1[generateNumber(0, Array1.length)]
            }
            if (store.userTeam.some(({ iMatchPlayerId }) => iMatchPlayerId === randomItem3.iMatchPlayerId)) {
              randomItem3 = Array1[generateNumber(0, Array1.length)]
            }
            store.userTeam.push(randomItem1, randomItem2, randomItem3)
          } else {
            let randomItem3 = Array2[generateNumber(0, Array2.length)]
            if (randomItem1.iMatchPlayerId === randomItem3.iMatchPlayerId) {
              randomItem3 = Array2[generateNumber(0, Array2.length)]
            }
            if (store.userTeam.some(({ iMatchPlayerId }) => iMatchPlayerId === randomItem3.iMatchPlayerId)) {
              randomItem3 = Array2[generateNumber(0, Array2.length)]
            }
            store.userTeam.push(randomItem1, randomItem2, randomItem3)
          }
        } else {
          store.userTeam.push(randomItem1, randomItem2)
        }
      })

      const playerId = new Set()
      for (let iMatchPlayerId of store.userTeam) {
        if (typeof iMatchPlayerId === 'object' && iMatchPlayerId.iMatchPlayerId) {
          iMatchPlayerId = iMatchPlayerId.iMatchPlayerId
        }
        playerId.add(iMatchPlayerId)
      }
      let teamLength = playerId.size
      if (teamLength !== 11) {
        while (teamLength < 11) {
          const newPlayer = store.teamPlayers.find(player => !playerId.includes(player.iMatchPlayerId))
          store.userTeam.push(newPlayer)
          teamLength++
        }
      }
      store.userTeam = [...new Set([...store.userTeam])]

      store.captainId = store.userTeam[generateNumber(0, store.userTeam.length)]
      store.viceCaptionId = store.userTeam[generateNumber(0, store.userTeam.length)]
      if (store.captainId.iMatchPlayerId === store.viceCaptionId.iMatchPlayerId) {
        store.viceCaptionId = store.userTeam[generateNumber(0, store.userTeam.length)]
      }
      const newTeam = store.userTeam.map(p => p.iMatchPlayerId)
      const data = {
        iMatchId: store.matchID,
        aPlayers: newTeam,
        iCaptainId: store.captainId.iMatchPlayerId,
        iViceCaptainId: store.viceCaptionId.iMatchPlayerId,
        sName: `Team${store.captainId.iMatchPlayerId}`
      }

      request(server)
        .post('/api/user/user-team/v3')
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cnewUserTeam))
          store.createdTeamID = res.body.data._id
          done()
        })
    })

    it('Should be add second team', (done) => {
      store.iCaptainId2 = store.userTeam[generateNumber(0, store.userTeam.length)]
      store.iViceCaptainId2 = store.userTeam[generateNumber(0, store.userTeam.length)]
      if (store.iCaptainId2.iMatchPlayerId === store.iViceCaptainId2.iMatchPlayerId) {
        store.iViceCaptainId2 = store.userTeam[generateNumber(0, store.userTeam.length)]
      }
      const newTeam = store.userTeam.map(p => p.iMatchPlayerId)
      const data = {
        iMatchId: store.matchID,
        aPlayers: newTeam,
        iCaptainId: store.iCaptainId2.iMatchPlayerId,
        iViceCaptainId: store.iViceCaptainId2.iMatchPlayerId,
        sName: `Team2${store.iCaptainId2.iMatchPlayerId}`
      }
      request(server)
        .post('/api/user/user-team/v3')
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cnewUserTeam))
          store.createdTeamID2 = res.body.data._id
          done()
        })
    })

    it('should be a add User team for system user', (done) => {
      const newTeam = store.userTeam.map(p => p.iMatchPlayerId)
      const data = {
        iMatchId: `${store.matchID}`,
        aPlayers: newTeam,
        iCaptainId: store.captainId.iMatchPlayerId,
        iViceCaptainId: store.viceCaptionId.iMatchPlayerId,
        sName: `Team${store.captainId.iMatchPlayerId}${store.viceCaptionId.iMatchPlayerId}`
      }

      request(server)
        .post('/api/user/system-user-team/v2')
        .send(data)
        .set('Authorization', store.systemUserToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cnewUserTeam))
          store.systemUserTeamId1 = res.body.data._id
          store.systemUserID = res.body.data.iUserId
          done()
        })
    })
    it('should be a add second User team for system user', (done) => {
      store.iCaptainId2 = store.userTeam[generateNumber(0, store.userTeam.length)]
      store.iViceCaptainId2 = store.userTeam[generateNumber(0, store.userTeam.length)]
      if (store.iCaptainId2.iMatchPlayerId === store.iViceCaptainId2.iMatchPlayerId) {
        store.iViceCaptainId2 = store.userTeam[generateNumber(0, store.userTeam.length)]
      }
      const newTeam = store.userTeam.map(p => p.iMatchPlayerId)
      const data = {
        iMatchId: store.matchID,
        aPlayers: newTeam,
        iCaptainId: store.iCaptainId2.iMatchPlayerId,
        iViceCaptainId: store.iViceCaptainId2.iMatchPlayerId,
        sName: `Team2${store.iCaptainId2.iMatchPlayerId}`
      }

      request(server)
        .post('/api/user/system-user-team/v2')
        .send(data)
        .set('Authorization', store.systemUserToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cnewUserTeam))
          store.systemUserTeamId2 = res.body.data._id
          store.systemUserID = res.body.data.iUserId
          done()
        })
    })

    it('Should not found a match id', (done) => {
      const data = {
        iMatchId: store.wId,
        aPlayers: store.userTeam,
        iCaptainId: store.captainId.iMatchPlayerId,
        iViceCaptainId: store.viceCaptionId.iMatchPlayerId,
        sName: `Team${store.viceCaptionId.iMatchPlayerId}`
      }
      request(server)
        .post('/api/user/user-team/v3')
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.match_started)
          done()
        })
    })

    it('Should not add user team because of Captain is not defined', (done) => {
      const data = {
        iMatchId: store.matchID,
        aPlayers: store.userTeam,
        iViceCaptainId: store.viceCaptionId.iMatchPlayerId,
        sName: `Team${store.viceCaptionId.iMatchPlayerId}`
      }
      request(server)
        .post('/api/user/user-team/v3')
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })

    it('Should not add user team because of Vice Caption is not defined', (done) => {
      const data = {
        iMatchId: store.matchID,
        aPlayers: store.userTeam,
        iCaptainId: store.captainId.iMatchPlayerId,
        sName: `Team${store.captainId.iMatchPlayerId}`
      }
      request(server)
        .post('/api/user/user-team/v3')
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })
  })

  describe('/Put Update a user team', () => {
    it('Should not Update user team because of same team is already exist', (done) => {
      const newTeam = store.userTeam.map(p => p.iMatchPlayerId)
      const data = {
        iMatchId: store.matchID,
        aPlayers: newTeam,
        iCaptainId: store.captainId.iMatchPlayerId,
        iViceCaptainId: store.viceCaptionId.iMatchPlayerId,
        sName: `Team${store.captainId.iMatchPlayerId}`
      }
      request(server)
        .put(`/api/user/user-team/${store.wId}/v3`)
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.ResourceExist)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.already_exist.replace('##', messages.English.cteamName))
          done()
        })
    })

    it('Should be a Update a user team', (done) => {
      store.captainId = store.userTeam[generateNumber(0, store.userTeam.length)]
      store.viceCaptionId = store.userTeam[generateNumber(0, store.userTeam.length)]
      if (store.captainId === store.viceCaptionId) {
        store.viceCaptionId = store.userTeam[generateNumber(0, store.userTeam.length)]
      }
      const newTeam = store.userTeam.map(p => p.iMatchPlayerId)
      const data = {
        iMatchId: store.matchID,
        aPlayers: newTeam,
        iCaptainId: store.viceCaptionId.iMatchPlayerId,
        iViceCaptainId: store.captainId.iMatchPlayerId,
        sName: `Team1${store.viceCaptionId.iMatchPlayerId}`
      }
      request(server)
        .put(`/api/user/user-team/${store.createdTeamID}/v3`)
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cuserTeamDetails))
          done()
        })
    })

    it('Should not Update user team because wrong Id will pass', (done) => {
      const newTeam = store.userTeam.map(p => p.iMatchPlayerId)
      const data = {
        iMatchId: store.wId,
        aPlayers: newTeam,
        iCaptainId: store.captainId.iMatchPlayerId,
        iViceCaptainId: store.viceCaptionId.iMatchPlayerId,
        sName: `Team${store.captainId.iMatchPlayerId}`
      }
      request(server)
        .put(`/api/user/user-team/${store.createdTeamID}/v3`)
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.match_started)
          done()
        })
    })

    it('Should not Update user team because captain is not defined', (done) => {
      const newTeam = store.userTeam.map(p => p.iMatchPlayerId)
      const data = {
        iMatchId: store.matchID,
        aPlayers: newTeam,
        iViceCaptainId: store.viceCaptionId.iMatchPlayerId,
        sName: `Team${store.captainId.iMatchPlayerId}`
      }
      request(server)
        .put(`/api/user/user-team/${store.createdTeamID}/v3`)
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })

    it('Should not Update user team because Vice-Captain is not defined', (done) => {
      const data = {
        iMatchId: store.matchID,
        aPlayers: store.userTeam,
        iCaptainId: store.captainId.iMatchPlayerId,
        sName: `Team${store.captainId.iMatchPlayerId}`
      }
      request(server)
        .put(`/api/user/user-team/${store.createdTeamID}/v3`)
        .send(data)
        .set('Authorization', store.userToken)
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })
  })

  describe('/GET user => user team list', () => {
    it('Should be get user team list', (done) => {
      request(server)
        .get(`/api/user/user-team/teams/${store.matchID}/v3`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cuserTeams))
          done()
        })
    })
  })

  describe('/GET team player leader board v2 using userTeam id', () => {
    it('Should be get Team Player leader board', (done) => {
      request(server)
        .get(`/api/user/user-team/team-player-leaderboard/${store.createdTeamID}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cuserTeams))
          done()
        })
    })

    it('Should not be get Team Player leader board', (done) => {
      request(server)
        .get(`/api/user/user-team/team-player-leaderboard/${store.wId}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.NotFound)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.userTeam))
          done()
        })
    })
  })

  describe('/GET team player leader board v3 using userLeague id', () => {
    // it('Should be get Team Player leader board', (done) => {
    //   request(server)
    //     .get(`/api/user/user-team/team-player-leaderboard/${store.iUserLeagueId}/v3`)
    //     .set('Authorization', store.userToken)
    //     .expect(status.OK)
    //     .end((err, res) => {
    //       if (err) return done(err)
    //       expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cuserTeams))
    //       done()
    //     })
    // })

    it('Should not be get Team Player leader board', (done) => {
      request(server)
        .get(`/api/user/user-team/team-player-leaderboard/${store.wId}/v3`)
        .set('Authorization', store.userToken)
        .expect(status.NotFound)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.userTeam))
          done()
        })
    })
  })

  describe('/GET user team unique players', () => {
    it('Should be get user team unique players', (done) => {
      request(server)
        .get(`/api/user/user-team-unique-players/${store.matchID}/v1`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.teamPlayers))
          done()
        })
    })
  })

  describe('/GET user team unique players league', () => {
    it('Should be get user team unique players league', (done) => {
      request(server)
        .get(`/api/user/user-team-unique-players-league/${store.iMatchLeagueId}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.teamPlayers))
          done()
        })
    })
  })

  describe('/GET user team count', () => {
    it('Should be get user team counts', (done) => {
      request(server)
        .get(`/api/user/user-team-count/${store.matchID}/v1`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.userTeamCount))
          done()
        })
    })
  })

  // **** admin side test cases ****

  describe('/GET admin side user team list', () => {
    it('Should be get admin side user list', (done) => {
      request(server)
        .get(`/api/admin/user-team/list/${store.matchID}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.userTeam))
          done()
        })
    })
  })

  describe('/GET user teams team players', () => {
    it('Should be get user teams team players', (done) => {
      request(server)
        .get(`/api/admin/user-team/team-player/${store.createdTeamID}/v2`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.teamPlayers))
          done()
        })
    })

    it('Should not be get user teams team players because invalid id', (done) => {
      request(server)
        .get(`/api/admin/user-team/team-player/${store.wId}/v2`)
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.userTeam))
          done()
        })
    })
  })

  describe('/POST user team list', () => {
    it('Should be get admin side user team list match wise', (done) => {
      request(server)
        .post('/api/admin/user-team/v1')
        .set('Authorization', store.adminToken)
        .send({
          iMatchId: store.matchID,
          iUserId: store.iUserId
        })
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.userTeam))
          done()
        })
    })
  })
})
