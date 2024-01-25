/* eslint-disable no-undef */
const server = require('../../app')
const request = require('supertest')
const { message, status } = require('../../responses')

const utilityObj = {}

test('should create new user', async () => {
  const res = await request(server)
    .post('/api/user/register')
    .send({
      sName: 'Divu',
      sMobileNumber: '7567332387',
      sPassword: '123aSD!@'
    })
  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.CreatedSuccessfully.replace('##', message.English.User))
})

test('should return user already registered', async () => {
  const res = await request(server)
    .post('/api/user/register')
    .send({
      sName: 'Divu',
      sMobileNumber: '7567332387',
      sPassword: '123aSD!@'
    })
  expect(res.statusCode).toEqual(status.ResourceExist)
  expect(res.body.message).toEqual(message.English.AlreadyExist.replace('##', message.English.User))
})

test('should not create user due to invalid mobile number', async () => {
  const res = await request(server)
    .post('/api/user/register')
    .send({
      sName: 'Ankit',
      sMobileNumber: '78781790564',
      sPassword: '123aSD!@'
    })
  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.InvalidEntry.replace('##', message.English.MobileNumber))
})

test('should login successfully', async () => {
  const res = await request(server)
    .post('/api/user/login')
    .send({
      sMobileNumber: '9712187556',
      sPassword: '123aSD!@'
    })
    .set('sPushToken', 'cLxzohPS0I7yjb0WNgFCpg:APA91bHR3o8Sa_fhDydf3D4gVDgBS_esHowktRcuEYU3hbVLq9MSKteTtsp7axFF1LGEho998h7bB5oYIzNSM3upkJT5uc4Ep7d3MetJP00mmXRQTUqytSkPZ-CrV-jRpTdEk6GnGKBr')
  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.LoginSuccessfully)
  utilityObj.userToken = res.body.data.jwt_token
})

test('should admin login successfully', async () => {
  const res = await request(server)
    .post('/api/admin/auth/login')
    .send({
      sMobileNumber: '9712187556',
      sPassword: '123aSD!@'
    })
    .set('sPushToken', 'cLxzohPS0I7yjb0WNgFCpg:APA91bHR3o8Sa_fhDydf3D4gVDgBS_esHowktRcuEYU3hbVLq9MSKteTtsp7axFF1LGEho998h7bB5oYIzNSM3upkJT5uc4Ep7d3MetJP00mmXRQTUqytSkPZ-CrV-jRpTdEk6GnGKBr')
  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.LoginSuccessfully)
  utilityObj.adminToken = res.body.data.jwt_token
})

test('should throw user not registered', async () => {
  const res = await request(server)
    .post('/api/user/login')
    .send({
      sMobileNumber: '7575062098',
      sPassword: '123aSD!@'
    })
  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.UserNotRegistered)
})

test('should throw user not found when user was deleted', async () => {
  const res = await request(server)
    .post('/api/user/login')
    .send({
      sMobileNumber: '7567332389',
      sPassword: '123aSD!@'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.UserNotRegistered)
})

test('should throw incorrect password', async () => {
  const res = await request(server)
    .post('/api/user/login')
    .send({
      sMobileNumber: '7567332387',
      sPassword: '123aSD!@#'
    })

  expect(res.statusCode).toEqual(status.Forbidden)
  expect(res.body.message).toEqual(message.English.IncorrectPassword)
})

test('should sync all contact successfully', async () => {
  const data = [
    {
      sName: 'RushiRaj',
      sMobileNumber: '8690717891'
    },
    {
      sName: 'Ankit D',
      sMobileNumber: '7878179056'
    },
    {
      sName: 'Rakesh R',
      sMobileNumber: '7490924040'
    }
  ]

  const res = await request(server)
    .post('/api/user/contact-sync')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)
    .send(data)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.AllContactsSyncedSuccessFully)
})

test('should sync valid contact and return invalid contact', async () => {
  const data = [
    {
      sName: 'Hardik G',
      sMobileNumber: '7567332388'
    },
    {
      sName: 'invalid contact',
      sMobileNumber: '787817905'
    }
  ]
  const res = await request(server)
    .post('/api/user/contact-sync')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)
    .send(data)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.ContactsSyncSuccessfully)
})

test('should search contact successfully', async () => {
  const res = await request(server)
    .get('/api/user/search-contact/7575062099')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.ContactFoundSuccessfully)
})

test('should return contact not found', async () => {
  const res = await request(server)
    .get('/api/user/search-contact/7575062099')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.SearchedContactNotFound)
})

test('should change password successfully', async () => {
  const res = await request(server)
    .post('/api/user/change-password')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)
    .send({
      sOldPassword: '123aSD!@',
      sNewPassword: '123aSD!@',
      sReTypePassword: '123aSD!@'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.UpdatedSuccessfully.replace('##', message.English.Password))
})

test('should not change password due to invalid value', async () => {
  const res = await request(server)
    .post('/api/user/change-password')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)
    .send({
      sOldPassword: '123aSD!@',
      sNewPassword: 'hemal123',
      sReTypePassword: 'hemal123'
    })

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.InvalidEntry.replace('##', message.English.Password))
})

test('should not change password due to different value', async () => {
  const res = await request(server)
    .post('/api/user/change-password')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)
    .send({
      sOldPassword: '123aSD!@',
      sNewPassword: '123aSD!@#',
      sReTypePassword: '123aSD!@#$'
    })

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.PasswordDoNotMatch)
})

test('should send otp on forgot password', async () => {
  const res = await request(server)
    .get('/api/user/forgot-password/9712187556')

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.OTPSentSuccessfully)
})

test('should return user not registered - forgot password', async () => {
  const res = await request(server)
    .get('/api/user/forgot-password/9712187557')

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.UserNotRegistered)
})

test('should reset password successfully', async () => {
  const res = await request(server)
    .post('/api/user/reset-password')
    .send({
      sOTP: '1234',
      sNewPassword: '123aSD!@',
      sReTypePassword: '123aSD!@',
      sMobileNumber: '9712187556'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.UpdatedSuccessfully.replace('##', message.English.Password))
})

test('should return wrong OTP', async () => {
  const res = await request(server)
    .post('/api/user/reset-password')
    .send({
      sOTP: '12343',
      sNewPassword: '123aSD!@',
      sReTypePassword: '123aSD!@',
      sMobileNumber: '9712187556'
    })

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.WrongOTP)
})

test('should return user not registered - reset password', async () => {
  const res = await request(server)
    .post('/api/user/reset-password')
    .send({
      sOTP: '1234',
      sNewPassword: '123aSD!@',
      sReTypePassword: '123aSD!@',
      sMobileNumber: '9712187557'
    })

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.UserNotRegistered)
})

test('should logout successfully', async () => {
  const res = await request(server)
    .put('/api/user/logout')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.LoggedOutSuccessfully)
})

test('should throw need to login first', async () => {
  const res = await request(server)
    .put('/api/user/logout')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.NeedToLoginFirst)
})

test('should delete profile successfully', async () => {
  const res = await request(server)
    .delete('/api/user/delete-my-profile')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.DeletedSuccessfully.replace('##', message.English.Profile))
})

test('should delete contact successfully', async () => {
  const res = await request(server)
    .delete('/api/user/delete-contact/7567332387')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.DeletedSuccessfully.replace('##', message.English.Contact))
})

test('should throw contact not found', async () => {
  const res = await request(server)
    .delete('/api/user/delete-contact/7567332387') // after deleted 7567332387
    .set('Authorization', `Bearer ${utilityObj.userToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Contact))
})

test('should throw contact not synced with user', async () => {
  const res = await request(server)
    .delete('/api/user/delete-contact/7567332387')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Contact))
})

test('admin - should get users successfully', async () => {
  const res = await request(server)
    .get('/api/admin/get-users')
    .query({
      nLimit: 2,
      sSort: 'sMobileNumber'
    })
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Users))
})

test('admin - should return users not found', async () => {
  const res = await request(server)
    .get('/api/admin/get-users')
    .query({
      nLimit: 2,
      sSort: 'sMobileNumber',
      sSearch: 'u7'
    })
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Users))
})

test('admin - should get user details successfully', async () => {
  const res = await request(server)
    .get('/api/admin/get-user/7567332387')
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.UserDetails))
})

test('admin - should get user not found', async () => {
  const res = await request(server)
    .get('/api/admin/get-user/9726283488')
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.UserNotRegistered)
})

test('admin - should get contacts of user', async () => {
  const res = await request(server)
    .get('/api/admin/get-contacts/7567332387')
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Contacts))
})

test('admin - should get user updated', async () => {
  const res = await request(server)
    .put('/api/admin/update-user/62c429783154755c09d3c12f')
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)
    .send({
      sName: 'Hemal',
      sMobileNumber: '9712187556'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.UpdatedSuccessfully.replace('##', message.English.User))
})

test('admin - should throw user not found', async () => {
  const res = await request(server)
    .put('/api/admin/update-user/62b2b4a9db49f41362f722ee')
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)
    .send({
      sName: 'Divu M',
      sMobileNumber: '7567332387'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.User))
})

test('admin - should throw mobile number already exist', async () => {
  const res = await request(server)
    .put('/api/admin/update-user/62b2a37d6e9d5c2376bcf7ac')
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)
    .send({
      sName: 'Divu M',
      sMobileNumber: '9712187556' // already exists
    })

  expect(res.statusCode).toEqual(status.ResourceExist)
  expect(res.body.message).toEqual(message.English.AlreadyExist.replace('##', message.English.MobileNumber))
})

test('admin - should delete user successfully', async () => {
  const res = await request(server)
    .delete('/api/admin/delete-user/62c429783154755c09d3c12f')
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.DeletedSuccessfully.replace('##', message.English.Profile))
})

test('admin - should trow user not found', async () => {
  const res = await request(server)
    .delete('/api/admin/delete-user/62b2a37d6e9d5c2376bcf7ac') // after deleted this profile
    .set('Authorization', `Bearer ${utilityObj.adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.User))
})

test('user - should filtered contact not found', async () => {
  const res = await request(server)
    .get('/api/user/filter-contacts')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)
    .query({
      eField: 'IT',
      eDesignation: 'TL',
      sMobileNumber: '9712187556'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.SearchedContactNotFound)
})

test('user - should fetched filtered contacts successfully', async () => {
  const res = await request(server)
    .get('/api/user/filter-contacts')
    .set('Authorization', `Bearer ${utilityObj.userToken}`)
    .query({
      eField: 'IT'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Contacts))
})
