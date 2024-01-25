const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const { globalStore } = require('../../config/testStore')
const { testCasesDefault } = require('../../config/testCases.js')

const store = {}

describe('UserWithdraw Routes', () => {
  before(async () => {
    store.ID = undefined
    store.wID = '5f7f0fd9b18344309eb41138'
    store.wiWithdrawId = 0
    store.adminToken = globalStore.adminToken
    store.userToken = globalStore.userToken
    store.iUserId = globalStore.userID
    store.sPassword = testCasesDefault.credentialPassword
  })

  describe('/POST Admin withdraw', () => {
    it('Should be get user balance', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.iUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cpassbook))
          store.nCurrentDepositBalance = res.body.data.nCurrentDepositBalance
          store.nTotalWithdrawAmount = res.body.data.nTotalWithdrawAmount
          done()
        })
    })

    it('Should be add withdraw in user', (done) => {
      request(server)
        .post('/api/admin/withdraw/v1')
        .set('Authorization', store.adminToken)
        .send({
          iUserId: store.iUserId,
          eType: 'withdraw',
          nAmount: 5,
          sPassword: store.sPassword
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.successfully.replace('##', messages.English.withdraw))
          done()
        })
    })

    it('Should be check after admin withdraw amount changed or not', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.iUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data.nTotalWithdrawAmount).toBe(Number(store.nTotalWithdrawAmount) + 5)
          store.nTotalWithdrawAmount = res.body.data.nTotalWithdrawAmount
          done()
        })
    })

    it('Should not be add withdraw in user', (done) => {
      request(server)
        .post('/api/admin/withdraw/v1')
        .set('Authorization', store.adminToken)
        .send({
          iUserId: store.iUserId,
          eType: 'withdraw',
          nAmount: 5
        })
        .expect(status.UnprocessableEntity)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.errors[0].msg).toMatch('Invalid value')
          done()
        })
    })

    it('Should not be add withdraw in user because wrong password', (done) => {
      request(server)
        .post('/api/admin/withdraw/v1')
        .set('Authorization', store.adminToken)
        .send({
          iUserId: store.iUserId,
          eType: 'withdraw',
          nAmount: 5,
          sPassword: 'TEST@1234'
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.auth_failed)
          done()
        })
    })
  })

  describe('/POST user withdraw', () => {
    it('Should fetch all payout options', (done) => {
      request(server)
        .get('/api/user/payout-option/list/v2')
        .expect(status.OK)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('array')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cpayoutOptions))
          if (res.body.data.length) store.iPaymentOptionId = res.body.data[res.body.data.length - 1]._id
          done()
        })
    })

    it('Should fetch the setting as per type', (done) => {
      const type = 'Withdraw'
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

    it('Should be add user withdraw', (done) => {
      request(server)
        .post(`/api/user/withdraw/${store.iPaymentOptionId}/v2`)
        .set('Authorization', store.userToken)
        .send({
          nAmount: 25,
          ePaymentGateway: 'CASHFREE'
        })
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.withdraw_request_success)
          done()
        })
    })

    it('Should be check after user withdraw amount changed or not', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.iUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data.nTotalWithdrawAmount).toBe(Number(store.nTotalWithdrawAmount) + 25)
          store.nTotalWithdrawAmount = res.body.data.nTotalWithdrawAmount
          done()
        })
    })

    it('Should not be add user withdraw because pending withdraw', (done) => {
      request(server)
        .post(`/api/user/withdraw/${store.iPaymentOptionId}/v2`)
        .set('Authorization', store.userToken)
        .send({
          nAmount: 15,
          ePaymentGateway: 'CASHFREE'
        })
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.already_exist.replace('##', messages.English.cPendingWithdraw))
          done()
        })
    })

    it('Should not be add user withdraw because amount is lower', (done) => {
      const data = { nAmount: Number(store.nMin) - 5, ePaymentGateway: 'CASHFREE' }
      request(server)
        .post(`/api/user/withdraw/${store.iPaymentOptionId}/v2`)
        .set('Authorization', store.userToken)
        .send(data)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.min_err.replace('##', messages.English.withdraw).replace('#', store.nMin))
          done()
        })
    })

    it('Should not be add user withdraw because amount is higher', (done) => {
      const data = { nAmount: Number(store.nMax) + 100, ePaymentGateway: 'CASHFREE' }
      request(server)
        .post(`/api/user/withdraw/${store.iPaymentOptionId}/v2`)
        .set('Authorization', store.userToken)
        .send(data)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.max_err.replace('##', messages.English.withdraw).replace('#', store.nMax))
          done()
        })
    })
  })

  describe('/GET user withdraw request', () => {
    it('Should be get user withdraw request', (done) => {
      request(server)
        .get('/api/user/withdraw-request/v2')
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.already_exist.replace('##', messages.English.cPendingWithdraw))
          store.iWithdrawId = res.body.data.userWithdraw.id
          store.nAmount = res.body.data.userWithdraw.nAmount
          done()
        })
    })
  })

  describe('/GET list withdraw to admin', () => {
    it('Should be list withdraw of user', (done) => {
      request(server)
        .get('/api/admin/withdraw/list/v1')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.withdraw))
          done()
        })
    })

    it('Should be list withdraw of user', (done) => {
      request(server)
        .get('/api/admin/withdraw/list/v1?status=S')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.withdraw))
          store.iWithdrawIdS = res.body.data.rows[0].id
          done()
        })
    })
  })

  describe('/GET withdraw count', () => {
    it('Should be get withdraw count', (done) => {
      request(server)
        .get('/api/admin/withdraw/counts/v1')
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', `${messages.English.withdraw} ${messages.English.cCounts}`))
          done()
        })
    })
  })

  /** Not working because payment gateway involve */
  // describe('/POST process withdraw', () => {
  //   it('Should not be process withdraw for user because wrong withdraw id', (done) => {
  //     request(server)
  //       .post(`/api/admin/withdraw/${store.wiWithdrawId}/v1`)
  //       .set('Authorization', store.adminToken)
  //       .send({
  //         ePaymentStatus: 'S'
  //       })
  //       .expect(status.BadRequest)
  //       .end(function(err, res) {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch(messages.English.withdraw_process_err)
  //         done()
  //       })
  //   })

  //   it('Should be process withdraw for user', (done) => {
  //     request(server)
  //       .post(`/api/admin/withdraw/${store.iWithdrawId}/v1`)
  //       .set('Authorization', store.adminToken)
  //       .send({
  //         ePaymentStatus: 'S'
  //       })
  //       .expect(status.OK)
  //       .end(function(err, res) {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.withdraw))
  //         done()
  //       })
  //   })

  //   it('Should not be process withdraw for user', (done) => {
  //     request(server)
  //       .post(`/api/admin/withdraw/${store.iWithdrawId}/v1`)
  //       .set('Authorization', store.adminToken)
  //       .send({
  //         ePaymentStatus: 'S'
  //       })
  //       .expect(status.BadRequest)
  //       .end(function(err, res) {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch(messages.English.wait_for_proccessing.replace('##', messages.English.withdraw))
  //         done()
  //       })
  //   })
  // })

  describe('/GET cancel withdraw request', () => {
    it('Should be check balance ', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.iUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          store.nTotalWithdrawAmount = res.body.data.nTotalWithdrawAmount
          done()
        })
    })

    it('Should be cancel', (done) => {
      request(server)
        .get(`/api/user/withdraw/cancel/${store.iWithdrawId}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.cancel_success.replace('##', messages.English.withdraw))
          done()
        })
    })

    it('Should be check balance after user cancel request', (done) => {
      request(server)
        .get(`/api/admin/passbooks/${store.iUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data.nTotalWithdrawAmount).toBe(Number(store.nTotalWithdrawAmount) - Number(store.nAmount))
          store.nTotalWithdrawAmount = res.body.data.nTotalWithdrawAmount
          done()
        })
    })

    it('Should not be cancel because invalid id', (done) => {
      request(server)
        .get(`/api/user/withdraw/cancel/${store.wiWithdrawId}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.withdraw))
          done()
        })
    })

    it('Should not be cancel because withdraw is not pending', (done) => {
      request(server)
        .get(`/api/user/withdraw/cancel/${store.iWithdrawIdS}/v2`)
        .set('Authorization', store.userToken)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.withdraw_process_err)
          done()
        })
    })
  })
})
