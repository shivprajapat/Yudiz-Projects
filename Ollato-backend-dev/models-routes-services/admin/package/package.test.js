const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('package management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllPackages: '/api/v1/admin/packages',
      getByIdPackage: '/api/v1/admin/package/get',
      createPackage: '/api/v1/admin/package/create',
      updatePackage: '/api/v1/admin/package/update',
      deletePackage: '/api/v1/admin/package/delete'
    }
  })

  describe('/POST admin package management  ', () => {
    describe('/POST get all ', () => {
      it('should get all package', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'title',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllPackages)
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
    describe('/POST get package by id ', () => {
      it('should get package by id', (done) => {
        const data = { id: 3 }
        request(server)
          .post(routes.getByIdPackage)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Package fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
      it('should not get package by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdPackage)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Package does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add package', () => {
    it('should create a package ', (done) => {
      const data = {
        title: 'tes12',
        amount: 20020.30,
        description: '123',
        package_number: 1,
        package_type: 'addon',
        online_test: true,
        test_report: false,
        video_call: false,
        f2f_call: true
      } // add not existing title to create
      request(server)
        .post(routes.createPackage)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.generate_success.replace('##', messages.en.package))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a package ', (done) => {
      const data = {
        title: 'package test1',
        amount: 20020.30,
        description: '123',
        package_number: 1,
        package_type: 'addon',
        online_test: true,
        test_report: false,
        video_call: false,
        f2f_call: true
      } // only add existing title to test
      request(server)
        .post(routes.createPackage)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.package))
          done()
        })
    })

    it('should not create this package ', (done) => {
      const data = { }
      request(server)
        .post(routes.createPackage)
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

  describe('/POST Update package', () => {
    it('should update a package ', (done) => {
      const data = {
        id: 1,
        title: 'package test2',
        amount: 20020.30,
        description: '123',
        package_number: 1,
        package_type: 'addon',
        online_test: true,
        test_report: false,
        video_call: false,
        f2f_call: true
      }
      request(server)
        .post(routes.updatePackage)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.package))
          done()
        })
    })

    it('should not update this package ', (done) => {
      const data = { }
      request(server)
        .post(routes.updatePackage)
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

  describe('/DELETE a package', () => {
    it('should delete a package ', (done) => {
      const data = { id: [3] } // send existing id
      request(server)
        .post(routes.deletePackage)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.package))
          done()
        })
    })

    it('should not delete a package', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deletePackage)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.package))
          done()
        })
    })
  })
})
