const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../../index')
const expect = require('expect')
const { status, messages } = require('../../../../helper/api.responses')
const adminService = require('../../auth/services')
let routes = {}
const store = {}

describe('test management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllTests: '/api/v1/admin/test/test-sub-category/get-all',
      getByIdTest: '/api/v1/admin/test/test-sub-category/get-by-id',
      createTest: '/api/v1/admin/test/test-sub-category/create',
      updateTest: '/api/v1/admin/test/test-sub-category/update',
      deleteTest: '/api/v1/admin/test/test-sub-category/delete'
    }
  })

  describe('/POST admin test management  ', () => {
    describe('/POST get all ', () => {
      it('should get all test', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'title',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllTests)
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
    describe('/POST get test by id ', () => {
      it('should get test by id', (done) => {
        const data = { id: 4 }
        request(server)
          .post(routes.getByIdTest)
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
      it('should not get test by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdTest)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Test subcategory does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add test', () => {
    it('should create a test ', (done) => {
      const data = {
        test_id: 12,
        title: 'test-category-54',
        sub_test_abb: 'TE',
        no_of_questions: 12,
        description: 'test description',
        sort_order: 0
      } // add not existing title to create
      request(server)
        .post(routes.createTest)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.add_success.replace('##', messages.en.testSubCategory))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a test ', (done) => {
      const data = {
        test_id: 12,
        title: 'test-category-5',
        sub_test_abb: 'TE',
        no_of_questions: 12,
        description: 'test description',
        sort_order: 0
      } // only add existing title to test
      request(server)
        .post(routes.createTest)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.testSubCategory))
          done()
        })
    })

    it('should not create this test ', (done) => {
      const data = { }
      request(server)
        .post(routes.createTest)
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

  describe('/POST Update test', () => {
    it('should update a test ', (done) => {
      const data = {
        id: 10,
        test_id: 1,
        title: 'test-category-5',
        sub_test_abb: 'TE',
        no_of_questions: 12,
        description: 'test description',
        sort_order: 0
      }
      request(server)
        .post(routes.updateTest)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.testSubCategory))
          done()
        })
    })

    it('should not update this test ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateTest)
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

  describe('/DELETE a test', () => {
    it('should delete a test ', (done) => {
      const data = { id: [7] } // send existing id
      request(server)
        .post(routes.deleteTest)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.testSubCategory))
          done()
        })
    })

    it('should not delete a test', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteTest)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.testSubCategory))
          done()
        })
    })
  })
})
