const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('role management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllRoles: '/api/v1/admin/roles',
      getByIdRole: '/api/v1/admin/role/get-role-by-id',
      createRole: '/api/v1/admin/role/create',
      updateRole: '/api/v1/admin/role/update',
      deleteRole: '/api/v1/admin/role/delete'
    }
  })

  describe('/POST admin role management  ', () => {
    describe('/POST get all ', () => {
      it('should get all role', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'title',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllRoles)
          .send(data)
          .set({ Authorization: store.token })
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Role fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
    })
    describe('/POST get role by id ', () => {
      it('should get role by id', (done) => {
        const data = { id: 4 } // existing id only
        request(server)
          .post(routes.getByIdRole)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.OK)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Role fetched successfully.')
            expect(res.body.data).toBeA('object')
            done()
          })
      })
      it('should not get role by id', (done) => {
        const data = { id: 45 }
        request(server)
          .post(routes.getByIdRole)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Role does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add role', () => {
    it('should create a role ', (done) => {
      const data = {
        title: 'role-28',
        modules: [
          {
            module_permission_id: 1,
            permissions: {
              list: true,
              create: true,
              view: true,
              update: true,
              delete: true
            }
          },
          {
            module_permission_id: 2,
            permissions: {
              list: true,
              create: true,
              view: true,
              update: true,
              delete: true
            }
          }
        ]
      } // add non existing title to create
      request(server)
        .post(routes.createRole)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.add_success.replace('##', messages.en.role))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a role ', (done) => {
      const data = {
        title: 'role1',
        modules: [
          {
            module_permission_id: 1,
            permissions: {
              list: true,
              create: true,
              view: true,
              update: true,
              delete: true
            }
          },
          {
            module_permission_id: 2,
            permissions: {
              list: true,
              create: true,
              view: true,
              update: true,
              delete: true
            }
          }
        ]
      } // only add existing title to test
      request(server)
        .post(routes.createRole)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.role))
          done()
        })
    })

    it('should not create this role ', (done) => {
      const data = { }
      request(server)
        .post(routes.createRole)
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

  describe('/POST Update role', () => {
    it('should update a role ', (done) => {
      const data = {
        id: 1,
        title: 'test26',
        modules: [
          {
            module_permission_id: 1,
            permissions: {
              list: true,
              create: true,
              view: true,
              update: true,
              delete: true
            }
          },
          {
            module_permission_id: 2,
            permissions: {
              list: true,
              create: true,
              view: true,
              update: true,
              delete: true
            }
          }
        ]
      }
      request(server)
        .post(routes.updateRole)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.role))
          done()
        })
    })

    it('should not update this role ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateRole)
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

  describe('/DELETE a role', () => {
    it('should delete a role ', (done) => {
      const data = { id: [5] } // send existing id
      request(server)
        .post(routes.deleteRole)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.role))
          done()
        })
    })

    it('should not delete a role', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteRole)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.role))
          done()
        })
    })
  })
})
