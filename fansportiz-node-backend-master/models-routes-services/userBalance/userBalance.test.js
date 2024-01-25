const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')
const { globalStore } = require('../../config/testStore')
const store = {}

describe('UserBalance Routes', () => {
  before(async() => {
    store.ID = undefined
    store.wID = '5f7f0fd9b18344309eb41138'
    store.adminToken = globalStore.adminToken

    store.iUserId = globalStore.userID
  })

  describe('/GET list user balance to admin', () => {
    it('Should be list user balance of user', (done) => {
      request(server)
        .get(`/api/admin/balance/${store.iUserId}/v1`)
        .set('Authorization', store.adminToken)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.cBalance))
          done()
        })
    })
  })
})
