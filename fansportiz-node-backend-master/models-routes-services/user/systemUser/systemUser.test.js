const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { messages, status } = require('../../../helper/api.responses')
const { randomStr } = require('../../../helper/utilities.services')
const { globalStore } = require('../../../config/testStore')
const store = {}

describe('System user management routes', () => {
  before(async() => {
    store.ID = undefined
    store.wId = '5f7f0fd9b18344309eb41138'
    store.adminToken = globalStore.adminToken
  })

  describe('/POST add System user', () => {
    it('should be add system users ', (done) => {
      const data = {
        nUsers: 1
      }
      request(server)
        .post('/api/admin/system-user/v1')
        .set('Authorization', store.adminToken)
        .send(data)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.csystemUsers))
          done()
        })
    })
  })

  describe('/Get System user list', () => {
    it('should get list of system users ', (done) => {
      request(server)
        .get('/api/admin/system-user/list/v1')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.csystemUsers))
          store.ID = res.body.data[0].results[0]._id
          done()
        })
    })
  })

  describe('/Get System user count', () => {
    it('should get count of system users ', (done) => {
      request(server)
        .get('/api/admin/system-user/counts/v1')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', `${messages.English.csystemUsers} ${messages.English.cCounts}`))
          done()
        })
    })
  })

  describe('/POST add token to System user', () => {
    it('should be add token to system users ', (done) => {
      request(server)
        .post('/api/admin/system-user/add-token/v1')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.add_success.replace('##', messages.English.cToken))
          done()
        })
    })
  })

  describe('/Get System user', () => {
    it('should get of system user', (done) => {
      request(server)
        .get('/api/admin/system-user/v1')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.csystemUser))
          done()
        })
    })
  })

  describe('/Get profile details', () => {
    it('should profile details ', (done) => {
      request(server)
        .get(`/api/admin/system-user/${store.ID}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cprofile))
          done()
        })
    })

    it('should not get profile details ', (done) => {
      request(server)
        .get(`/api/admin/system-user/${store.wId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cprofile))
          done()
        })
    })
  })

  describe('/Put Update system profile details', () => {
    it('Should update system user profile', (done) => {
      request(server)
        .put(`/api/admin/system-user/${store.ID}/v1`)
        .set('Authorization', store.adminToken)
        .send({
          sName: 'test',
          sEmail: `${randomStr(10, 'private')}SU@test.com`
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.csystemUser))
          done()
        })
    })

    it('should not update system user profile details because invalid id', (done) => {
      request(server)
        .put(`/api/admin/system-user/${store.wId}/v1`)
        .set('Authorization', store.adminToken)
        .send({
          sName: 'test',
          sEmail: `${randomStr(10, 'private')}SU@test.com`
        })
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.csystemUser))
          done()
        })
    })
  })
})
