const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../../index')
const expect = require('expect')
const { status, messages } = require('../../../helper/api.responses')
const adminService = require('../auth/services')
let routes = {}
const store = {}
const wID = -100

describe('board management routes', () => {
  before(async () => {
    const adminToken = await adminService.getAdminToken()
    store.token = adminToken
    routes = {
      getAllBoard: '/api/v1/admin/board/get-all-board',
      getByIdBoard: '/api/v1/admin/board/get-board-by-id',
      createBoard: '/api/v1/admin/board/create',
      updateBoard: '/api/v1/admin/board/update',
      deleteBoard: '/api/v1/admin/board/delete'
    }
  })

  describe('/POST admin board management  ', () => {
    describe('/POST get all ', () => {
      it('should get all board', (done) => {
        const data = {
          start: 0,
          limit: 5,
          sort: 'title',
          search: '',
          order: 'asc'
        }
        request(server)
          .post(routes.getAllBoard)
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
    describe('/POST get board by id ', () => {
      it('should get board by id', (done) => {
        const data = {
          id: 4
        }
        request(server)
          .post(routes.getByIdBoard)
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
      it('should not get board by id', (done) => {
        const data = {
          id: 45
        }
        request(server)
          .post(routes.getByIdBoard)
          .set({ Authorization: store.token })
          .send(data)
          .expect(status.NotFound)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.message).toMatch('Board does not exist.')
            done()
          })
      })
    })
  })

  describe('/POST Add board', () => {
    it('should create a board ', (done) => {
      const data = { title: 'zarna1234' } // add not existing title to create
      request(server)
        .post(routes.createBoard)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.en.add_success.replace('##', messages.en.board))
          store.ID = res.body.data._id
          done()
        })
    })

    it('should not create a board ', (done) => {
      const data = { title: '-!12345' }
      request(server)
        .post(routes.createBoard)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.ResourceExist)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.already_exist.replace('##', messages.en.board))
          done()
        })
    })

    it('should not create a board ', (done) => {
      const data = { }
      request(server)
        .post(routes.createBoard)
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

  describe('/POST Update board', () => {
    it('should update a banner ', (done) => {
      const data = { id: 4, title: 'board-1', isActive: 'y' }
      request(server)
        .post(routes.updateBoard)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.update_success.replace('##', messages.en.board))
          done()
        })
    })

    it('should not update a board ', (done) => {
      const data = { id: 16, title: '-!123456' }
      request(server)
        .post(routes.updateBoard)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.board))
          done()
        })
    })

    it('should not create a board ', (done) => {
      const data = { }
      request(server)
        .post(routes.updateBoard)
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

  describe('/DELETE a board', () => {
    it('should delete a board ', (done) => {
      const data = { id: 21 } // send existing id
      request(server)
        .post(routes.deleteBoard)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.del_success.replace('##', messages.en.board))
          done()
        })
    })

    it('should not delete a board ', (done) => {
      const data = { id: wID }
      request(server)
        .post(routes.deleteBoard)
        .set('Authorization', store.token)
        .send(data)
        .expect(status.NotFound)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).toBeA('object')
          expect(res.body.message).toMatch(messages.en.not_exist.replace('##', messages.en.board))
          done()
        })
    })
  })
})
