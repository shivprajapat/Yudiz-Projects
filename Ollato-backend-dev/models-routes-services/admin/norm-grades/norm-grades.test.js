const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('norm-grades management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllNormGrade: '/api/v1/admin/norm-grades/get-all',
      getByIdNormGrade: '/api/v1/admin/norm-grades/get-by-id',
      createNormGrade: '/api/v1/admin/norm-grades/create',
      updateNormGrade: '/api/v1/admin/norm-grades/update',
      deleteNormGrade: '/api/v1/admin/norm-grades/delete'
    }
  })

  describe('/POST admin norm-grades management  ', () => {
    describe('/POST get all ', () => {
      it('should get all norm-grades', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'norm_id',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllNormGrade)
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
    describe('/POST get norm-grades by id ', () => {
      it('should get norm-grades by id', (done) => {
        const data = {
          id: 4
        }
        request(server)
          .post(routes.getByIdNormGrade)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Norm grades fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
      it('should not get norm-grades by id', (done) => {
        const data = { id: -45000 }
        request(server)
          .post(routes.getByIdNormGrade)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Norm grades does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add norm-grades', () => {
    it('should create a norm-grades ', (done) => {
      const data = { grade_id: 9, test_id: 2, test_detail_id: 1, norm_id: 2, min_marks: 59, max_marks: 100 }
      request(server)
        .post(routes.createNormGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.generate_success.replace('##', messages.en.normGrade))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create this Norm grades ', (done) => {
      const data = { }
      request(server)
        .post(routes.createNormGrade)
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

  describe('/POST Update Norm grades', () => {
    it('should update a Norm grades ', (done) => {
      const data = { id: 1, grade_id: 9, test_id: 2, test_detail_id: 1, norm_id: 2, min_marks: 59, max_marks: 100 }
      request(server)
        .post(routes.updateNormGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.normGrade))
          done()
        })
    })

    it('should not update a Norm grades ', (done) => {
      const data = { id: 100, grade_id: 9, test_id: 2, test_detail_id: 1, norm_id: 2, min_marks: 59, max_marks: 100 } // -!12345--> unprocessable entity
      request(server)
        .post(routes.updateNormGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.normGrade))
          done()
        })
    })

    it('should not update this Norm grades ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateNormGrade)
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

  describe('/DELETE a Norm grades', () => {
    it('should delete a Norm grades ', (done) => {
      const data = { id: [6] } // send existing id
      request(server)
        .post(routes.deleteNormGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.normGrade))
          done()
        })
    })

    it('should not delete a Norm grades', (done) => {
      const data = { id: [600] }
      request(server)
        .post(routes.deleteNormGrade)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.normGrade))
          done()
        })
    })
  })
})
