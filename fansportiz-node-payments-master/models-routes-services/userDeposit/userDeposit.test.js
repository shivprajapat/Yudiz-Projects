const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const { globalStore } = require('../../config/testStore')
const { encryption } = require('../../helper/utilities.services')

const store = {}

describe('UserDeposit Routes', () => {
  before(async() => {
    store.ID = undefined
    store.wID = '5f7f0fd9b18344309eb41138'
    store.adminToken = globalStore.adminToken
    store.userToken = globalStore.userToken
    store.iUserId = globalStore.userID
    store.wiDepositId = 0
  })

  describe('/POST Admin deposit', () => {
    it('Should be get user passbook detail', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.iUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cpassbook))
          store.nCurrentDepositBalance = res.body.data.nCurrentDepositBalance
          done()
        })
    })

    it('Should be add deposit in user', (done) => {
      request(server)
        .post('/api/admin/deposit/v2')
        .set('Authorization', store.adminToken)
        .send({
          iUserId: store.iUserId,
          nCash: 5000,
          eType: 'deposit',
          sPassword: encryption('fantasy@321')
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.cDeposit))
          done()
        })
    })

    it('Should be check after admin deposit amount changed or not', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.iUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data.nCurrentDepositBalance).toBe(store.nCurrentDepositBalance + 5000)
          store.nCurrentDepositBalance = res.body.data.nCurrentDepositBalance
          done()
        })
    })

    it('Should not be add deposit in user because invalid deposit password', (done) => {
      request(server)
        .post('/api/admin/deposit/v2')
        .set('Authorization', store.adminToken)
        .send({
          iUserId: store.iUserId,
          nCash: 50,
          eType: 'deposit',
          sPassword: encryption('fantasy@1223')
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.auth_failed)
          done()
        })
    })

    it('Should not be add deposit in user because invalid body', (done) => {
      request(server)
        .post('/api/admin/deposit/v2')
        .set('Authorization', store.adminToken)
        .send({
          nCash: 50,
          eType: 'deposit',
          sPassword: encryption('fantasy@1223')
        })
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })
  })

  describe('/POST user deposit', () => {
    it('Should fetch the setting as per type', (done) => {
      const type = 'Deposit'
      request(server)
        .get(`/api/user/setting/${type}/v2`)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.csetting))
          if (res.body.data) {
            store.nMin = res.body.data.nMin
            store.nMax = res.body.data.nMax
          }
          done()
        })
    })

    it('Should be add user deposit', (done) => {
      request(server)
        .post('/api/user/deposit/v1')
        .set('Authorization', store.userToken)
        .send({
          nAmount: 50,
          ePaymentGateway: 'TEST'
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.cDeposit))
          done()
        })
    })

    it('Should not be add user deposit because invalid promocode', (done) => {
      request(server)
        .post('/api/user/deposit/v1')
        .set('Authorization', store.userToken)
        .send({
          nAmount: 10,
          ePaymentGateway: 'CASHFREE',
          sPromocode: 'TESTCASESTEST'
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid_promo_err)
          done()
        })
    })

    it('Should not be add user deposit because amount is lower', (done) => {
      const data = { nAmount: Number(store.nMin) - 5, ePaymentGateway: 'CASHFREE' }
      request(server)
        .post('/api/user/deposit/v1')
        .set('Authorization', store.userToken)
        .send(data)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.min_err.replace('##', messages.English.cDeposit).replace('#', store.nMin))
          done()
        })
    })

    it('Should not be add user deposit because amount is higher', (done) => {
      const data = { nAmount: Number(store.nMax) + 100, ePaymentGateway: 'CASHFREE' }
      request(server)
        .post('/api/user/deposit/v1')
        .set('Authorization', store.userToken)
        .send(data)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.max_err.replace('##', messages.English.cDeposit).replace('#', store.nMax))
          done()
        })
    })
  })

  describe('/GET list deposit to admin', () => {
    it('Should be list deposit of user', (done) => {
      request(server)
        .get('/api/admin/deposit/list/v1?status=S')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cDeposit))
          if (res.body.data) store.iDepositIdS = res.body.data.rows[0].id
          done()
        })
    })

    it('Should be list deposit of user with pending status', (done) => {
      request(server)
        .get('/api/admin/deposit/list/v1?status=P')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cDeposit))
          if (res.body.data) {
            store.iDepositIdP = res.body.data.rows[0].id
            store.pendingDepoUserId = res.body.data.rows[0].iUserId
            store.DepositedAmount = res.body.data.rows[0].nAmount
          }
          done()
        })
    })
  })

  describe('/GET deposit count', () => {
    it('Should be get deposit count', (done) => {
      request(server)
        .get('/api/admin/deposit/counts/v1')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', `${messages.English.cDeposit} ${messages.English.cCounts}`))
          done()
        })
    })
  })

  describe('/POST process deposit', () => {
    it('Should be get user passbook detail', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.pendingDepoUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cpassbook))
          store.nCurrentDepositBalance = res.body.data.nCurrentDepositBalance
          done()
        })
    })

    it('Should be process deposit for user', (done) => {
      request(server)
        .post(`/api/admin/deposit/${store.iDepositIdP}/v1`)
        .set('Authorization', store.adminToken)
        .send({
          ePaymentStatus: 'S'
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.cprocessedDeposit))
          done()
        })
    })

    it('Should be check after process deposit amount changed or not', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.pendingDepoUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data.nCurrentDepositBalance).toBe(store.nCurrentDepositBalance + store.DepositedAmount)
          done()
        })
    })

    it('Should not be process deposit for user because already in progress', (done) => {
      request(server)
        .post(`/api/admin/deposit/${store.iDepositIdP}/v1`)
        .set('Authorization', store.adminToken)
        .send({
          ePaymentStatus: 'S'
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.wait_for_proccessing.replace('##', messages.English.cDeposit))
          done()
        })
    })
  })
})
