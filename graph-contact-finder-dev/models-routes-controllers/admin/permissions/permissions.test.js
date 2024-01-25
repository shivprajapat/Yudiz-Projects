/* eslint-disable no-undef */
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

test('should add permission successfully', async () => {
  const res = await request(server)
    .post('/api/admin/permission')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Notification',
      sKey: 'NOTIFICATION',
      eStatus: 'N'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.AddedSuccessfully.replace('##', message.English.Permission))
})

test('should throw permission already exists', async () => {
  const res = await request(server)
    .post('/api/admin/permission')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Notification',
      sKey: 'NOTIFICATION',
      eStatus: 'N'
    })

  expect(res.statusCode).toEqual(status.ResourceExist)
  expect(res.body.message).toEqual(message.English.AlreadyExist.replace('##', message.English.Permission))
})

test('should fetch active permissions list', async () => {
  const res = await request(server)
    .get('/api/admin/permission')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Permissions))
})

test('should fetch all permissions', async () => {
  const res = await request(server)
    .get('/api/admin/permission/list')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Permissions))
})

test('should fetch needed permission', async () => {
  const res = await request(server)
    .get('/api/admin/permission/62a1f0d440e184e76a66baaf')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Permission))
})

test('should throw permission not found', async () => {
  const res = await request(server)
    .get('/api/admin/permission/62a1f0d440e184e76a66baaa') // manually set wrong id
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Permission))
})

test('should permission gets updated', async () => {
  const res = await request(server)
    .put('/api/admin/permission/62b420e525dde82dfc92cb6d')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Notification',
      sKey: 'NOTIFICATION',
      eStatus: 'N'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.UpdatedSuccessfully.replace('##', message.English.Permission))
})

test('should throw permission not found', async () => {
  const res = await request(server)
    .put('/api/admin/permission/62b420e525dde82dfc92cb6f')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Notification',
      sKey: 'NOTIFICATION',
      eStatus: 'N'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Permission))
})
