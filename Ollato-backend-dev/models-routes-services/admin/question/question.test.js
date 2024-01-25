const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('question management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllQuestion: '/api/v1/admin/question/get-all-question',
      getByIdQuestion: '/api/v1/admin/question/get-question-by-id'
    }
  })

  describe('/POST admin question management  ', () => {
    describe('/POST get all ', () => {
      it('should get all question', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'test_detail_id',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllQuestion)
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
    describe('/POST get question by id ', () => {
      it('should get question by id', (done) => {
        const data = { id: 4 }
        request(server)
          .post(routes.getByIdQuestion)
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
      it('should not get question by id', (done) => {
        const data = { id: -4 }
        request(server)
          .post(routes.getByIdQuestion)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Question does not exist.')
            done()
          })
      })
    })
  })
})
