/* eslint-disable no-unused-vars */
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
    .set('sPushToken', 'cLxzohPS0I7yjb0WNgFCpg:APA91bHR3o8Sa_fhDydf3D4gVDgBS_esHowktRcuEYU3hbVLq9MSKteTtsp7axFF1LGEho998h7bB5oYIzNSM3upkJT5uc4Ep7d3MetJP00mmXRQTUqytSkPZ-CrV-jRpTdEk6GnGKBr')

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.LoginSuccessfully)
  adminToken = res.body.data.jwt_token
})

test('should throw admin not found while login', async () => {
  const res = await request(server)
    .post('/api/admin/auth/login')
    .send({
      sMobileNumber: '7567332387',
      sPassword: '123aSD!@'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Admin))
})

test('should throw wrong password while login', async () => {
  const res = await request(server)
    .post('/api/admin/auth/login')
    .send({
      sMobileNumber: '9726283487',
      sPassword: '123aSD!@#'
    })

  expect(res.statusCode).toEqual(status.Forbidden)
  expect(res.body.message).toEqual(message.English.IncorrectPassword)
})

test('should create sub-admin successfully', async () => {
  const res = await request(server)
    .post('/api/admin/auth/sub-admin')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Kushal',
      sMobileNumber: '9726283487',
      sPassword: '123aSD!@',
      iRoleId: '62b42a38ba798f9c8a2aadcf'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.AddedSuccessfully.replace('##', message.English.SubAdmin))
})

test('should throw access denied while creating sub-admin', async () => {
  const res = await request(server)
    .post('/api/admin/auth/sub-admin')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Kushal',
      sMobileNumber: '7575062098',
      sPassword: '123aSD!@',
      iRoleId: '62b42a38ba798f9c8a2aadcf'
    })

  expect(res.statusCode).toEqual(status.UnAuthorize)
  expect(res.body.message).toEqual(message.English.AccessDenied)
})

test('should throw role not found while creating sub-admin', async () => {
  const res = await request(server)
    .post('/api/admin/auth/sub-admin')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Kushal',
      sMobileNumber: '7575062098',
      sPassword: '123aSD!@',
      iRoleId: '62b42a38ba798f9c8a2aadcd' // randomly change in id
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Role))
})

test('should throw sub-admin already exists while creating sub-admin', async () => {
  const res = await request(server)
    .post('/api/admin/auth/sub-admin')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sName: 'Kushal',
      sMobileNumber: '9712187556',
      sPassword: '123aSD!@',
      iRoleId: '62b42a38ba798f9c8a2aadcf'
    })

  expect(res.statusCode).toEqual(status.ResourceExist)
  expect(res.body.message).toEqual(message.English.AlreadyExist.replace('##', message.English.SubAdmin))
})

test('should logout successfully', async () => {
  const res = await request(server)
    .put('/api/admin/auth/logout')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.LoggedOutSuccessfully)
})
