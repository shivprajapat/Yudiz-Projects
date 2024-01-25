/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const server = require('../../app')
const request = require('supertest')
const { status, message } = require('../../responses')

let adminToken = ''

test('should login successfully', async () => {
  const res = await request(server)
    .post('/api/admin/auth/login')
    .send({
      sMobileNumber: '9712187556',
      sPassword: '123aSD!@'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.LoginSuccessfully)
  adminToken = res.body.data.jwt_token
})

test('should fetch report', async () => {
  const res = await request(server)
    .get('/api/admin/reports')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Report))
})

test('should needed report', async () => {
  const res = await request(server)
    .put('/api/admin/user-reports')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      eKey: 'RU' // TU, TC, RU, LU, UU
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.UpdatedSuccessfully.replace('##', message.English.Report))
})

test('should return invalid key', async () => {
  const res = await request(server)
    .put('/api/admin/user-reports')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      eKey: 'PU' // TU, TC, RU, LU, UU
    })

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.ValidationFailed)
})
