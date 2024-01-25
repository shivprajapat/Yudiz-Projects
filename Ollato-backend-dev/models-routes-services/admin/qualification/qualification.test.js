const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('Qualification management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllQualifications: '/api/v1/admin/qualification/get-all-qualification',
      getByIdQualification: '/api/v1/admin/qualification/get-qualification-by-id',
      createQualification: '/api/v1/admin/qualification/create',
      updateQualification: '/api/v1/admin/qualification/update',
      deleteQualification: '/api/v1/admin/qualification/delete'
    }
  })

  describe('/POST admin qualification management  ', () => {
    describe('/POST get all ', () => {
      it('should get all qualification', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'title',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllQualifications)
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
    describe('/POST get qualification by id ', () => {
      it('should get qualification by id', (done) => {
        const data = {
          id: 4
        }
        request(server)
          .post(routes.getByIdQualification)
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
      it('should not get qualification by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdQualification)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Qualification does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add qualification', () => {
    it('should create a qualification ', (done) => {
      const data = { title: 'qualification-13' } // add not existing title to create
      request(server)
        .post(routes.createQualification)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.add_success.replace('##', messages.en.qualification))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a qualification ', (done) => {
      const data = { title: 'qualification-1' } // only add existing title to test
      request(server)
        .post(routes.createQualification)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.qualification))
          done()
        })
    })

    it('should not create this qualification ', (done) => {
      const data = { }
      request(server)
        .post(routes.createQualification)
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

  describe('/POST Update qualification', () => {
    it('should update a qualification ', (done) => {
      const data = { id: 1, title: 'qualification-1' }
      request(server)
        .post(routes.updateQualification)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.qualification))
          done()
        })
    })

    it('should not update a qualification ', (done) => {
      const data = { id: 100, title: '123456' } // -!12345--> unprocessable entity
      request(server)
        .post(routes.updateQualification)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.qualification))
          done()
        })
    })

    it('should not update this qualification ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateQualification)
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

  describe('/DELETE a qualification', () => {
    it('should delete a qualification ', (done) => {
      const data = { id: [7] } // send existing id
      request(server)
        .post(routes.deleteQualification)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.qualification))
          done()
        })
    })

    it('should not delete a qualification', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteQualification)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.qualification))
          done()
        })
    })
  })
})
