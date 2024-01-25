const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('state management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllStates: '/api/v1/admin/states',
      getByIdState: '/api/v1/admin/state/get',
      createState: '/api/v1/admin/state/create',
      updateState: '/api/v1/admin/state/update',
      deleteState: '/api/v1/admin/state/delete'
    }
  })

  describe('/POST admin state management  ', () => {
    describe('/POST get all ', () => {
      it('should get all state', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'id',
          search: '',
          order: 'ASC'
        }
        request(server)
          .post(routes.getAllStates)
          .send(data)
          .set({ Authorization: store.token })
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('State fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
    })
    describe('/POST get state by id ', () => {
      it('should get state by id', (done) => {
        const data = { id: 4 }
        request(server)
          .post(routes.getByIdState)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('State fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
      it('should not get state by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdState)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('State does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add state', () => {
    it('should create a state ', (done) => {
      const data = { title: 'state15', countyId: 1, abbreviation: 'ab' } // add not existing title to create
      request(server)
        .post(routes.createState)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.generate_success.replace('##', messages.en.state))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a state ', (done) => {
      const data = { title: 'Delhi', countyId: 103, abbreviation: 'CT' } // only add existing title to test
      request(server)
        .post(routes.createState)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.state))
          done()
        })
    })

    it('should not create this state ', (done) => {
      const data = { }
      request(server)
        .post(routes.createState)
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

  describe('/POST Update state', () => {
    it('should update a state ', (done) => {
      const data = { id: 1, title: 'ahmedabad-1', countyId: 103, abbreviation: 'ab' }
      request(server)
        .post(routes.updateState)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.state))
          done()
        })
    })

    it('should not update a state ', (done) => {
      const data = { id: 100, title: '123456', countyId: 103, abbreviation: 'ab' } // -!12345--> unprocessable entity
      request(server)
        .post(routes.updateState)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.state))
          done()
        })
    })

    it('should not update this state ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateState)
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

  describe('/DELETE a state', () => {
    it('should delete a state ', (done) => {
      const data = { id: [7] } // send existing id
      request(server)
        .post(routes.deleteState)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.state))
          done()
        })
    })

    it('should not delete a state', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteState)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.state))
          done()
        })
    })
  })
})
