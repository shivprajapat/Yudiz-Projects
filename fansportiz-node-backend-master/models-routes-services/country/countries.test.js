const request = require('supertest')
const { describe, it } = require('mocha')
const server = require('../../index')
const { messages, status } = require('../../helper/api.responses')
const expect = require('expect')

describe('Country Routes', () => {
  describe('/GET country list', () => {
    it('Should be fetch country list', (done) => {
      request(server)
        .get('/api/user/country/v1')
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.countries))
          done()
        })
    })

    it('Should be fetch country list for admin', (done) => {
      request(server)
        .get('/api/admin/country/v1')
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch(messages.English.success.replace('##', messages.English.countries))
          done()
        })
    })
  })
})
