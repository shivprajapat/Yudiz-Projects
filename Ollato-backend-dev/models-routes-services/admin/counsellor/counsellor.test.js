const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('counsellor management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllCounsellor: '/api/v1/admin/counsellor/get-all-counsellor',
      getByIdCounsellor: '/api/v1/admin/counsellor/get-counsellor-by-id'
    }
  })

  describe('/POST admin counsellor management  ', () => {
    describe('/POST get all ', () => {
      it('should get all counsellor', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'first_name',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllCounsellor)
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
    describe('/POST get counsellor by id ', () => {
      it('should get counsellor by id', (done) => {
        const data = { id: 4 }
        request(server)
          .post(routes.getByIdCounsellor)
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
      it('should not get counsellor by id', (done) => {
        const data = { id: -4 }
        request(server)
          .post(routes.getByIdCounsellor)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Counsellor does not exist.')
            done()
          })
      })
    })
  })
})
