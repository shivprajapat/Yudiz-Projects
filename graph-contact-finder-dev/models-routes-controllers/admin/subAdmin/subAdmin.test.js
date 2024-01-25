/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const server = require('../../../app')
const request = require('supertest')
const { status, message } = require('../../../responses')

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

test('should fetch list of sub-admin', async () => {
  const res = await request(server)
    .get('/api/admin/sub-admin/list')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({
      sOrder: 'asc'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.SubAdmin))
})

test('should throw sub-admin not found', async () => {
  const res = await request(server)
    .get('/api/admin/sub-admin/list')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({
      sOrder: 'asc'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.SubAdmin))
})

test('should fetch needed sub-admin', async () => {
  const res = await request(server)
    .get('/api/admin/sub-admin/62b440df9c1db09bb64942c0')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.SubAdmin))
})

test('should throw sub-admin not found', async () => {
  const res = await request(server)
    .get('/api/admin/sub-admin/62b440df9c1db09bb64942c1')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.SubAdmin))
})

test('should update sub-admin', async () => {
  const res = await request(server)
    .put('/api/admin/sub-admin/62e0fc236f16f77a3783a8c7')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Mrunal M',
      sMobileNumber: '1012229980'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.UpdatedSuccessfully.replace('##', message.English.SubAdmin))
})

test('should throw role not found - update', async () => {
  const res = await request(server)
    .put('/api/admin/sub-admin/62b440df9c1db09bb64942c0')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Kushal',
      sMobileNumber: '9726283487',
      iRoleId: '62b40552cbed31d72d70f6d0'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Role))
})

test('should throw mobile number already exist - update', async () => {
  const res = await request(server)
    .put('/api/admin/sub-admin/62b440df9c1db09bb64942c0')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Kushal',
      sMobileNumber: '7567089391'
    })

  expect(res.statusCode).toEqual(status.ResourceExist)
  expect(res.body.message).toEqual(message.English.AlreadyExist.replace('##', message.English.MobileNumber))
})

test('should throw sub-admin not found - update', async () => {
  const res = await request(server)
    .put('/api/admin/sub-admin/62b440df9c1db09bb64942c1')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Kushal',
      sMobileNumber: '7567089391'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.SubAdmin))
})

test('should fetch sub-admin ids', async () => {
  const res = await request(server)
    .get('/api/admin/sub-admin-ids')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.SubAdmin))
})

test('should fetch sub-admin ids not found', async () => {
  const res = await request(server)
    .get('/api/admin/sub-admin-ids')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.SubAdmin))
})
