const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('software-matrix management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllSoftwareMatrix: '/api/v1/admin/software-metrixs',
      getByIdSoftwareMatrix: '/api/v1/admin/software-metrix',
      createSoftwareMatrix: '/api/v1/admin/software-metrix/create',
      updateSoftwareMatrix: '/api/v1/admin/software-metrix/update',
      deleteSoftwareMatrix: '/api/v1/admin/software-metrix/delete'
    }
  })

  describe('/POST admin software-matrix management  ', () => {
    describe('/POST get all ', () => {
      it('should get all software-matrix', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'custom_id',
          search: '',
          order: 'ASC'
        }
        request(server)
          .post(routes.getAllSoftwareMatrix)
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
    describe('/POST get software-matrix by id ', () => {
      it('should get software-matrix by id', (done) => {
        const data = { id: 4 }
        request(server)
          .post(routes.getByIdSoftwareMatrix)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Software Metrix fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
      it('should not get software-matrix by id', (done) => {
        const data = { id: -45000 }
        request(server)
          .post(routes.getByIdSoftwareMatrix)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Data does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add software-matrix', () => {
    it('should not create this software-matrix ', (done) => {
      const data = { }
      request(server)
        .post(routes.createSoftwareMatrix)
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

  describe('/POST Update software-matrix', () => {
    it('should update a software-matrix ', (done) => {
      const data = {
        id: 1,
        testAbb1: 'sadas12',
        testAbb2: 'sadas22',
        testAbb3: 'sadas32',
        mathDropped: 1,
        scienceDropped: 1,
        careerProfileId: 12,
        sortOrder: 1,
        matrixArray: [{
          norm_values: 'A,H,A',
          test_detail_id: 2
        },
        {
          norm_values: 'B,E,A',
          test_detail_id: 3
        }]
      }
      request(server)
        .post(routes.updateSoftwareMatrix)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.SoftwareMetrix))
          done()
        })
    })

    it('should not update this software-matrix ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateSoftwareMatrix)
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

  describe('/DELETE a software-matrix', () => {
    it('should delete a software-matrix ', (done) => {
      const data = { id: [7] } // send existing id
      request(server)
        .post(routes.deleteSoftwareMatrix)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.SoftwareMetrix))
          done()
        })
    })

    it('should not delete a software-matrix', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteSoftwareMatrix)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.SoftwareMetrix))
          done()
        })
    })
  })
})
