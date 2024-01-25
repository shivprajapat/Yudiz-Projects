const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { messages, status } = require('../../../helper/api.responses')
const { globalStore } = require('../../../config/testStore')
const store = {}

describe('User Profile management routes', () => {
  before(async () => {
    store.userToken = globalStore.userToken
    store.token = globalStore.adminToken
    store.wId = '62e257c6a094175b71deea5f'
    store.ID = globalStore.userID
  })

  describe('/Get User profile details', () => {
    it('should profile details ', (done) => {
      request(server)
        .get('/api/user/profile/v2')
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.user))
          done()
        })
    })
  })

  describe('/Get User profile statistics', () => {
    it('should profile details ', (done) => {
      request(server)
        .get('/api/user/profile-statistics/v1')
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.user))
          done()
        })
    })
  })

  describe('/Update User profile details', () => {
    it('should not change profile because pin code is invalid', (done) => {
      request(server)
        .put('/api/user/profile/v1')
        .set('Authorization', store.userToken)
        .send({
          nPinCode: 1234
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cPin))
          done()
        })
    })

    it('should not change profile because gender is invalid', (done) => {
      request(server)
        .put('/api/user/profile/v1')
        .set('Authorization', store.userToken)
        .send({
          eGender: 'X'
        })
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cGender))
          done()
        })
    })

    it('Should update user profile', (done) => {
      request(server)
        .put('/api/user/profile/v1')
        .set('Authorization', store.userToken)
        .send({
          sName: 'super user',
          eGender: 'M'
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cprofile))
          done()
        })
    })
  })

  describe('/Put User profile details V2', () => {
    it('should be change valid username', (done) => {
      request(server)
        .put('/api/user/profile/v2')
        .set('Authorization', store.userToken)
        .send({
          sUsername: '1u'
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.username))
          done()
        })
    })

    it('should not change profile because gender is invalid', (done) => {
      request(server)
        .put('/api/user/profile/v2')
        .set('Authorization', store.userToken)
        .send({
          eGender: 'X'
        })
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cGender))
          done()
        })
    })

    it('should not change profile because pin code is invalid', (done) => {
      request(server)
        .put('/api/user/profile/v2')
        .set('Authorization', store.userToken)
        .send({
          nPinCode: 1234
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cPin))
          done()
        })
    })

    it('should change unique username', (done) => {
      request(server)
        .put('/api/user/profile/v2')
        .set('Authorization', store.userToken)
        .send({
          sUsername: 'superuser'
        })
        .expect(status.ResourceExist)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.already_exist.replace('##', messages.English.username))
          done()
        })
    })

    it('Should update user profile', (done) => {
      request(server)
        .put('/api/user/profile/v2')
        .set('Authorization', store.userToken)
        .send({
          sName: 'superuser',
          sUsername: 'test12',
          eGender: 'M'
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.cprofile))
          done()
        })
    })
  })

  describe('/POST Get signed url for users profile image', () => {
    it('Should be get signed url', (done) => {
      request(server)
        .post('/api/user/profile/pre-signed-url/v1')
        .set('Authorization', store.userToken)
        .send({
          sFileName: 'player.jpg',
          sContentType: 'image/jpeg'
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          store.imageUrl = res.body.data.sPath
          expect(res.body.message).toMatch(messages.English.presigned_succ)
          done()
        })
    })

    it('Should not be get signed url because filename or contentType is invalid', (done) => {
      request(server)
        .post('/api/user/profile/pre-signed-url/v1')
        .set('Authorization', store.userToken)
        .send({
          sFileName: 'player.jpg',
          sContentType: 'image/png'
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.image))
          done()
        })
    })

    it('Should not get signed url', (done) => {
      request(server)
        .post('/api/user/profile/pre-signed-url/v1')
        .set('Authorization', store.userToken)
        .send({
          sFileName: 'player.jpg'
        })
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })
  })

  describe('/Get Admin: Users profile list', () => {
    it('should get list of users profile ', (done) => {
      request(server)
        .get('/api/admin/profile/v2')
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data.results).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cusers))
          done()
        })
    })
  })

  describe('/Get Admin: counts of users profile list', () => {
    it('should get count of users profile ', (done) => {
      request(server)
        .get('/api/admin/profile/counts/v1')
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', `${messages.English.cusers} ${messages.English.cCounts}`))
          done()
        })
    })
  })

  describe('/Get Admin: User recommendation', () => {
    it('should get User recommendation ', (done) => {
      request(server)
        .get('/api/admin/user/recommendation/v1')
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cRecommendedUsers))
          done()
        })
    })
  })

  describe('/GET Admin: User profile details', () => {
    it('should be get user profile', (done) => {
      request(server)
        .get(`/api/admin/profile/${store.ID}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cprofile))
          done()
        })
    })

    it('Should be not get user profile', (done) => {
      request(server)
        .get(`/api/admin/profile/${store.wId}/v1`)
        .set('Authorization', store.token)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.cprofile))
          done()
        })
    })
  })

  describe('/PUT Admin: User profile details', () => {
    it('should not change profile because pin code is invalid', (done) => {
      request(server)
        .put(`/api/admin/profile/${store.ID}/v1`)
        .set('Authorization', store.token)
        .send({
          nPinCode: 1234
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cPin))
          done()
        })
    })

    it('should not change profile because gender is invalid', (done) => {
      request(server)
        .put('/api/user/profile/v1')
        .set('Authorization', store.userToken)
        .send({
          eGender: 'X'
        })
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.cGender))
          done()
        })
    })

    it('Should update user profile', (done) => {
      request(server)
        .put(`/api/admin/profile/${store.ID}/v1`)
        .set('Authorization', store.token)
        .send({
          sName: 'super user',
          eGender: 'M'
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.update_success.replace('##', messages.English.user))
          done()
        })
    })
  })

  describe('/Get Admin: User\'s referred list', () => {
    it('should get User referred list ', (done) => {
      request(server)
        .get(`/api/admin/referred-list/${store.ID}/v1`)
        .set('Authorization', store.token)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data.results).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cUsersCity))
          done()
        })
    })
  })

  describe('/POST Admin: Get signed url for users profile image', () => {
    it('Should be get signed url', (done) => {
      request(server)
        .post('/api/admin/profile/pre-signed-url/v1')
        .set('Authorization', store.token)
        .send({
          sFileName: 'player.jpg',
          sContentType: 'image/jpeg'
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          store.imageUrl = res.body.data.sPath
          expect(res.body.message).toMatch(messages.English.presigned_succ)
          done()
        })
    })

    it('Should not be get signed url because filename or contentType is invalid', (done) => {
      request(server)
        .post('/api/admin/profile/pre-signed-url/v1')
        .set('Authorization', store.token)
        .send({
          sFileName: 'player.jpg',
          sContentType: 'image/png'
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid.replace('##', messages.English.image))
          done()
        })
    })

    it('Should not get signed url', (done) => {
      request(server)
        .post('/api/admin/profile/pre-signed-url/v1')
        .set('Authorization', store.token)
        .send({
          sFileName: 'player.jpg'
        })
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })
  })

  describe('/Get Admin: city list', () => {
    it('should get city list ', (done) => {
      request(server)
        .get('/api/admin/city/v1')
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cUsersCity))
          done()
        })
    })
  })

  describe('/Get Admin: states list', () => {
    it('should get states list ', (done) => {
      request(server)
        .get('/api/admin/states/v1')
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cUserStates))
          done()
        })
    })
  })

  describe('/Get User: cities list', () => {
    it('should get cities list ', (done) => {
      request(server)
        .get('/api/user/profile/cities/v1?nStateId=1')
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cUsersCity))
          done()
        })
    })
  })
})
