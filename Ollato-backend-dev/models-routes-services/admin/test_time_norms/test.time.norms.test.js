const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('time-norm management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllTimeNorms: '/api/v1/admin/get-all-test-time-norms',
      getByIdTimeNorm: '/api/v1/admin/get-test-time-norms',
      createTimeNorm: '/api/v1/admin/create-test-time-norms',
      updateTimeNorm: '/api/v1/admin/update-test-time-norms',
      deleteTimeNorm: '/api/v1/admin/delete-test-time-norms'
    }
  })

  describe('/POST admin time-norm management  ', () => {
    describe('/POST get all ', () => {
      it('should get all time-norm', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sorting: 'time_Sec',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllTimeNorms)
          .send(data)
          .set({ Authorization: store.token })
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Test time norms fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
    })
    describe('/POST get time-norm by id ', () => {
      it('should get time-norm by id', (done) => {
        const data = { id: 4 }
        request(server)
          .post(routes.getByIdTimeNorm)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Test time norms fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
      it('should not get time-norm by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdTimeNorm)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Test time norms does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add time-norm', () => {
    it('should create a time-norm ', (done) => {
      const data = {
        testDetailId: 2,
        gradeId: 3,
        timeSec: 1500
      } // add not existing title to create
      request(server)
        .post(routes.createTimeNorm)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.generate_success.replace('##', messages.en.testTimeNorms))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create this time-norm ', (done) => {
      const data = { }
      request(server)
        .post(routes.createTimeNorm)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.UnprocessableEntity)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })
  })

  describe('/POST Update time-norm', () => {
    it('should update a time-norm ', (done) => {
      const data = {
        id: 1,
        testDetailId: 2,
        gradeId: 3,
        timeSec: 1500
      }
      request(server)
        .post(routes.updateTimeNorm)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.testTimeNorms))
          done()
        })
    })

    it('should not update a time-norm ', (done) => {
      const data = {
        id: 100,
        testDetailId: 2,
        gradeId: 3,
        timeSec: 1500
      } // -!12345--> unprocessable entity
      request(server)
        .post(routes.updateTimeNorm)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.testTimeNorms))
          done()
        })
    })

    it('should not update this time-norm ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateTimeNorm)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.UnprocessableEntity)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })
  })

  describe('/DELETE a time-norm', () => {
    it('should delete a time-norm ', (done) => {
      const data = { id: [7] } // send existing id
      request(server)
        .post(routes.deleteTimeNorm)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.testTimeNorms))
          done()
        })
    })

    it('should not delete a time-norm', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteTimeNorm)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.testTimeNorms))
          done()
        })
    })
  })
})
