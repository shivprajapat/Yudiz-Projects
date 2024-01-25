const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('city management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllCities: '/api/v1/admin/cities',
      getByIdCity: '/api/v1/admin/city/get',
      createCity: '/api/v1/admin/city/create',
      updateCity: '/api/v1/admin/city/update',
      deleteCity: '/api/v1/admin/city/delete'
    }
  })

  describe('/POST admin city management  ', () => {
    describe('/POST get all ', () => {
      it('should get all city', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'title',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllCities)
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
    describe('/POST get city by id ', () => {
      it('should get city by id', (done) => {
        const data = {
          id: 4
        }
        request(server)
          .post(routes.getByIdCity)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('City fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
      it('should not get city by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdCity)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('City does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add city', () => {
    it('should create a city ', (done) => {
      const data = { title: 'city13', countyId: 1, stateId: 4, abbreviation: 'ab' } // add not existing title to create
      request(server)
        .post(routes.createCity)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.generate_success.replace('##', messages.en.city))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a city ', (done) => {
      const data = { title: 'city12', countyId: 103, stateId: 4, abbreviation: 'CT' } // only add existing title to test
      request(server)
        .post(routes.createCity)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.city))
          done()
        })
    })

    it('should not create this city ', (done) => {
      const data = { }
      request(server)
        .post(routes.createCity)
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

  describe('/POST Update city', () => {
    it('should update a city ', (done) => {
      const data = { id: 1, title: 'ahmedabad-1', countyId: 103, stateId: 4, abbreviation: 'ab' }
      request(server)
        .post(routes.updateCity)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.city))
          done()
        })
    })

    it('should not update a city ', (done) => {
      const data = { id: 100, title: '123456', countyId: 103, stateId: 4, abbreviation: 'ab' } // -!12345--> unprocessable entity
      request(server)
        .post(routes.updateCity)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.city))
          done()
        })
    })

    it('should not update this city ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateCity)
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

  describe('/DELETE a city', () => {
    it('should delete a city ', (done) => {
      const data = { id: [7] } // send existing id
      request(server)
        .post(routes.deleteCity)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.city))
          done()
        })
    })

    it('should not delete a city', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteCity)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.city))
          done()
        })
    })
  })
})
