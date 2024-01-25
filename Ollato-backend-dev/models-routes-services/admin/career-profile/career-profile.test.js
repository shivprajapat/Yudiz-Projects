const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('career profile management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllCareerProfile: '/api/v1/admin/career-profile/get-all',
      getCareerProfileById: '/api/v1/admin/career-profile/get-by-id',
      createCareerProfile: '/api/v1/admin/career-profile/create',
      updateCareerProfile: '/api/v1/admin/career-profile/update',
      deleteCareerProfile: '/api/v1/admin/career-profile/delete'
    }
  })

  describe('/POST admin career profile management  ', () => {
    describe('/POST get all ', () => {
      it('should get all career profile', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'profile_type',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllCareerProfile)
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
    describe('/POST get career profile by id ', () => {
      it('should get career profile by id', (done) => {
        const data = {
          id: 4
        }
        request(server)
          .post(routes.getCareerProfileById)
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
      it('should not get career profile by id', (done) => {
        const data = {
          id: 100000
        }
        request(server)
          .post(routes.getCareerProfileById)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Career Profile does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add career profile', () => {
    it('should create a career profile ', (done) => {
      const data = { profile_type: 'Academic Professions1' } // add not existing title to create
      request(server)
        .post(routes.createCareerProfile)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.add_success.replace('##', messages.en.careerProfile))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a career profile ', (done) => {
      const data = { profile_type: 'Academic Professions' } // add existing title to test this case
      request(server)
        .post(routes.createCareerProfile)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.careerProfile))
          done()
        })
    })
  })

  describe('/POST Update career profile', () => {
    it('should update a career profile ', (done) => {
      const data = { id: 4, profile_type: 'techno-12' } // add existing id only
      request(server)
        .post(routes.updateCareerProfile)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.careerProfile))
          done()
        })
    })

    it('should not update a career profile ', (done) => {
      const data = { id: 16, profile_type: '123456' } // set null deleted_at // -!12345--> unprocessable entity
      request(server)
        .post(routes.updateCareerProfile)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.careerProfile))
          done()
        })
    })
  })

  describe('/DELETE a career profile', () => {
    it('should delete a career profile ', (done) => {
      const data = { id: 16 } // set null deleted_at // send existing id
      request(server)
        .post(routes.deleteCareerProfile)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.careerProfile))
          done()
        })
    })

    it('should not delete a career profile ', (done) => {
      const data = { id: 16, profile_type: '-!123456' } // check
      request(server)
        .post(routes.deleteCareerProfile)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.careerProfile))
          done()
        })
    })
  })
})
