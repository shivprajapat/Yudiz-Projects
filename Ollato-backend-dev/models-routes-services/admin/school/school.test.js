const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('school management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllSchools: '/api/v1/admin/school/get-all-school',
      getByIdSchool: '/api/v1/admin/school/get-school-by-id',
      createSchool: '/api/v1/admin/school/create',
      updateSchool: '/api/v1/admin/school/update',
      deleteSchool: '/api/v1/admin/school/delete'
    }
  })

  describe('/POST admin school management  ', () => {
    describe('/POST get all ', () => {
      it('should get all school', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'title',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllSchools)
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
    describe('/POST get school by id ', () => {
      it('should get school by id', (done) => {
        const data = { id: 4 }
        request(server)
          .post(routes.getByIdSchool)
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
      it('should not get school by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdSchool)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('School does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add school', () => {
    it('should create a school ', (done) => {
      const data = {
        title: 'school1123',
        abbreviation: 'rtyrt',
        address_1: 'rtfghu',
        address_2: 'uyi',
        county_id: 1,
        state_id: 2,
        city_id: 1,
        board_id: 4,
        pin_code: '123456',
        area: 'Iskon'
      } // add not existing title to create
      request(server)
        .post(routes.createSchool)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.add_success.replace('##', messages.en.school))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a school ', (done) => {
      const data = {
        title: 'q',
        abbreviation: 'rtyrt',
        address_1: 'rtfghu',
        address_2: 'uyi',
        county_id: 1,
        state_id: 2,
        city_id: 1,
        board_id: 4,
        pin_code: '123456',
        area: 'iskon'
      } // only add existing title to test
      request(server)
        .post(routes.createSchool)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.school))
          done()
        })
    })

    it('should not create this school ', (done) => {
      const data = { }
      request(server)
        .post(routes.createSchool)
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

  describe('/POST Update school', () => {
    it('should update a school ', (done) => {
      const data = {
        id: 1,
        title: 'xzfcdz112',
        abbreviation: 'rtyrt',
        address_1: 'rtfghu',
        address_2: 'uyi',
        county_id: 1,
        state_id: 2,
        city_id: 1,
        board_id: 4,
        pin_code: '123456',
        area: 'iskon'
      } // add not existing title
      request(server)
        .post(routes.updateSchool)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.school))
          done()
        })
    })

    it('should not update a school ', (done) => {
      const data = {
        id: 1000000,
        title: 'xzfcdz1',
        abbreviation: 'rtyrt',
        address_1: 'rtfghu',
        address_2: 'uyi',
        county_id: 1,
        state_id: 2,
        city_id: 1,
        board_id: 4,
        pin_code: '123456',
        area: 'iskon'
      } // not existing id
      request(server)
        .post(routes.updateSchool)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.school))
          done()
        })
    })

    it('should not update this school ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateSchool)
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

  describe('/DELETE a school', () => {
    it('should delete a school ', (done) => {
      const data = { id: [7] } // send existing id
      request(server)
        .post(routes.deleteSchool)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.school))
          done()
        })
    })

    it('should not delete a school', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteSchool)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.school))
          done()
        })
    })
  })
})
