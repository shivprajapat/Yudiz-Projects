const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('norms management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllNorms: '/api/v1/admin/norms/get-all-norms',
      getByIdNorms: '/api/v1/admin/norms/get-norms-by-id',
      createNorms: '/api/v1/admin/norms/create',
      updateNorms: '/api/v1/admin/norms/update',
      deleteNorms: '/api/v1/admin/norms/delete'
    }
  })

  describe('/POST admin norms management  ', () => {
    describe('/POST get all ', () => {
      it('should get all norms', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'title',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllNorms)
          .send(data)
          .set({ Authorization: store.token })
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Data fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
    })
    describe('/POST get norms by id ', () => {
      it('should get norms by id', (done) => {
        const data = { id: 4 }
        request(server)
          .post(routes.getByIdNorms)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Data fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
      it('should not get norms by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdNorms)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Norm does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add norms', () => {
    it('should create a norms ', (done) => {
      const data = { title: 'norm312', code: 'A', sort_order: 1 } // add not existing title to create
      request(server)
        .post(routes.createNorms)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.add_success.replace('##', messages.en.norm))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a norm ', (done) => {
      const data = { title: 'High', code: 'A', sort_order: 1 } // only add existing title to test
      request(server)
        .post(routes.createNorms)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.norm))
          done()
        })
    })

    it('should not create this norms ', (done) => {
      const data = { }
      request(server)
        .post(routes.createNorms)
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

  describe('/POST Update norms', () => {
    it('should update a norms ', (done) => {
      const data = { id: 1, title: 'High-1', code: 'A', sort_order: 1 }
      request(server)
        .post(routes.updateNorms)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.norm))
          done()
        })
    })

    it('should not update this norms ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateNorms)
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

  describe('/DELETE a norms', () => {
    it('should delete a norms ', (done) => {
      const data = { id: 7 } // send existing id
      request(server)
        .post(routes.deleteNorms)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.norm))
          done()
        })
    })

    it('should not delete a norms', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteNorms)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.norm))
          done()
        })
    })
  })
})
