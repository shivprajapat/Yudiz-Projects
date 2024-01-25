const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}

describe('issue-category management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      createIssue: '/api/v1/admin/issue-category/create-issue-category',
      updateIssue: '/api/v1/admin/issue-category/update-issue-category',
      deleteIssue: '/api/v1/admin/issue-category/delete-issue-category'
    }
  })

  describe('/POST Add issue-category', () => {
    it('should create a issue-category ', (done) => {
      const data = { title: 'issue-category-2' } // add not existing title to create
      request(server)
        .post(routes.createIssue)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.add_success.replace('##', messages.en.issueCategory))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a issue-category ', (done) => {
      const data = { title: 'issue-4' } // add existing title to test this case
      request(server)
        .post(routes.createIssue)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.issueCategory))
          done()
        })
    })

    it('should not create this issue-category ', (done) => {
      const data = { }
      request(server)
        .post(routes.createIssue)
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

  describe('/POST Update issue-category', () => {
    it('should update a issue-category ', (done) => {
      const data = { id: 1, title: 'is-1' } // enter existing id
      request(server)
        .post(routes.updateIssue)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.issueCategory))
          done()
        })
    })

    it('should not update a issue-category ', (done) => {
      const data = { id: 100, title: '123456' } // -!12345--> unprocessable entity
      request(server)
        .post(routes.updateIssue)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.issueCategory))
          done()
        })
    })

    it('should not update this issue-category ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateIssue)
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

  describe('/DELETE a issue-category', () => {
    it('should delete a issue-category ', (done) => {
      const data = { id: [6] } // send existing id
      request(server)
        .post(routes.deleteIssue)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.issueCategory))
          done()
        })
    })

    it('should not delete a issue-category', (done) => {
      const data = { id: [-600] }
      request(server)
        .post(routes.deleteIssue)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.issueCategory))
          done()
        })
    })
  })
})
