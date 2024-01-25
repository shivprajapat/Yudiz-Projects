const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const { globalStore } = require('../../config/testStore')
const store = {}

describe('Payment Routes', () => {
  before(async() => {
    store.userToken = globalStore.userToken
    store.platform = 'A'
  })

  describe('/POST create user payment order', () => {
    it('Should be create user payment order', (done) => {
      const data = { eType: 'CASHFREE', nAmount: 100 }
      request(server)
        .post('/api/user/payment/create/v1')
        .set('Authorization', store.userToken)
        .set('Platform', store.platform)
        .send(data)
        .expect(status.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', `${(store.platform === 'A' || store.platform === 'I') ? messages.English.cCashFreePaymentToken : messages.English.cCashFreePaymentLink}`))
          done()
        })
    })

    it('Should not be create user payment order because invalid eType', (done) => {
      const data = { eType: 'TEST', nAmount: 100 }
      request(server)
        .post('/api/user/payment/create/v1')
        .set('Authorization', store.userToken)
        .set('Platform', store.platform)
        .send(data)
        .expect(status.BadRequest)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.error_with.replace('##', messages.English.cpaymentOption))
          done()
        })
    })

    it('Should not be create user payment order because invalid promo code', (done) => {
      const data = { eType: 'CASHFREE', nAmount: 100, sPromocode: 'TESTCASE' }
      request(server)
        .post('/api/user/payment/create/v1')
        .set('Authorization', store.userToken)
        .set('Platform', store.platform)
        .send(data)
        .expect(status.BadRequest)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.invalid_promo_err)
          done()
        })
    })
  })
})
