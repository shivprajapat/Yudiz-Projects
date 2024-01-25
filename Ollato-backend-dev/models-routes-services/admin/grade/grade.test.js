const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('grade management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllGrade: '/api/v1/admin/grade/get-all-grade',
      getByIdGrade: '/api/v1/admin/grade/get-grade-by-id',
      createGrade: '/api/v1/admin/grade/create',
      updateGrade: '/api/v1/admin/grade/update',
      deleteGrade: '/api/v1/admin/grade/delete'
    }
  })

  describe('/POST admin grade management  ', () => {
    describe('/POST get all ', () => {
      it('should get all grade', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'title',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllGrade)
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
    describe('/POST get grade by id ', () => {
      it('should get grade by id', (done) => {
        const data = {
          id: 4
        }
        request(server)
          .post(routes.getByIdGrade)
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
      it('should not get grade by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdGrade)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Grade does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add grade', () => {
    it('should create a grade ', (done) => {
      const data = { title: 'grade1AA' } // add not existing title to create
      request(server)
        .post(routes.createGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.add_success.replace('##', messages.en.grade))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a grade ', (done) => {
      const data = { title: 'grade12' } // add existing title to test this case
      request(server)
        .post(routes.createGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.grade))
          done()
        })
    })

    it('should not create this grade ', (done) => {
      const data = { }
      request(server)
        .post(routes.createGrade)
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

  describe('/POST Update grade', () => {
    it('should update a grade ', (done) => {
      const data = { id: 1, title: 'gr12' } // add existing id only
      request(server)
        .post(routes.updateGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.grade))
          done()
        })
    })

    it('should not update a grade ', (done) => {
      const data = { id: 100, title: '123456' } // -!12345--> unprocessable entity
      request(server)
        .post(routes.updateGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.grade))
          done()
        })
    })

    it('should not update this grade ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateGrade)
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

  describe('/DELETE a grade', () => {
    it('should delete a grade ', (done) => {
      const data = { id: [6] } // send existing id
      request(server)
        .post(routes.deleteGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.grade))
          done()
        })
    })

    it('should not delete a grade', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.grade))
          done()
        })
    })
  })
})
