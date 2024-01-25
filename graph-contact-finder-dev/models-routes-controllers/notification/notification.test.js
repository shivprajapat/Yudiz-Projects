/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const server = require('../../app')
const request = require('supertest')
const { status, message } = require('../../responses')

let adminToken = ''; let userToken = ''

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

test('should login successfully', async () => {
  const res = await request(server)
    .post('/api/user/login')
    .send({
      sMobileNumber: '9698562456',
      sPassword: '123aSD!@'
    })
    .set('sPushToken', 'cLxzohPS0I7yjb0WNgFCpg:APA91bHR3o8Sa_fhDydf3D4gVDgBS_esHowktRcuEYU3hbVLq9MSKteTtsp7axFF1LGEho998h7bB5oYIzNSM3upkJT5uc4Ep7d3MetJP00mmXRQTUqytSkPZ-CrV-jRpTdEk6GnGKBr')

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.LoginSuccessfully)
  userToken = res.body.data.jwt_token
})

test('should send notification to user', async () => {
  const res = await request(server)
    .post('/api/admin/notification')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      iUserId: '62c429783154755c09d3c12f',
      sTitle: 'testcase',
      sMessage: 'Testing in jest test cases',
      iType: '62a998c73f731100eb11d5dc'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.CreatedSuccessfully.replace('##', message.English.Notification))
})

test('should throw user not found', async () => {
  const res = await request(server)
    .post('/api/admin/notification')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      iUserId: '62a31290f09c3570280c8add',
      sTitle: 'Welcome again!!',
      sMessage: 'Happy to have you again',
      iType: '62a998c73f731100eb11d5d9'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.User))
})

test('should throw notification types not found - to user', async () => {
  const res = await request(server)
    .post('/api/admin/notification')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      iUserId: '62a31290f09c3570280c8adc',
      sTitle: 'Welcome again!!',
      sMessage: 'Happy to have you again',
      iType: '62a998c73f731100eb11d5d8'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.NotificationType))
})

test('should send notification to all(global)', async () => {
  const res = await request(server)
    .post('/api/admin/global-notification')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sTitle: 'test jest!!',
      sMessage: 'testing test case',
      iType: '62a998c73f731100eb11d5dc',
      dExpTime: '07/29/2022'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.CreatedSuccessfully.replace('##', message.English.Notification))
})

test('should throw invalid expire time', async () => {
  const res = await request(server)
    .post('/api/admin/global-notification')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sTitle: 'Welcome!!',
      sMessage: 'Happy to have you',
      iType: '62a998c73f731100eb11d5d9',
      dExpTime: '06/24/2022'
    })

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.InvalidExpireTime)
})

test('should throw notification types not found - global', async () => {
  const res = await request(server)
    .post('/api/admin/global-notification')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sTitle: 'Welcome!!',
      sMessage: 'Happy to have you',
      iType: '62a998c73f731100eb11d5d8',
      dExpTime: '06/26/2022'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.NotificationType))
})

test('should delete notification', async () => {
  const res = await request(server)
    .delete('/api/admin/delete-notification/62aaf030fd9eb9722e3ce3c8')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.DeletedSuccessfully.replace('##', message.English.Notification))
})

test('should throw notification not found - delete', async () => {
  const res = await request(server)
    .delete('/api/admin/delete-notification/62aaf030fd9eb9722e3ce3c9')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Notification))
})

test('should throw notifiacation mode is already ', async () => {
  const res = await request(server)
    .put('/api/admin/change-mode/62b456186d9a0a5baaec7b6e')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({
      eMode: 1
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.NotificationModeAlready.replace('##', message.English.Enabled))
})

test('should disable mode of notification', async () => {
  const res = await request(server)
    .put('/api/admin/change-mode/62b0658fdce3ee8cf696d465')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({
      eMode: 0
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.NotificationModeUpdatedSuccessfully.replace('##', message.English.Disabled))
})

test('should enable mode of notification', async () => {
  const res = await request(server)
    .put('/api/admin/change-mode/62b455869cb1d5b58f0bbf23')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({
      eMode: 1
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.NotificationModeUpdatedSuccessfully.replace('##', message.English.Enabled))
})

test('should fetch list of notification', async () => {
  const res = await request(server)
    .get('/api/admin/notification-list')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({
      sSearch: 'we'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Notifications))
})

test('should throw notification not found', async () => {
  const res = await request(server)
    .get('/api/admin/notification-list')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({
      sSearch: 'we2'
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Notifications))
})

test('should fetch list of notification types', async () => {
  const res = await request(server)
    .get('/api/admin/notification-types-list')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.NotificationType))
})

test('should fetch needed notification', async () => {
  const res = await request(server)
    .get('/api/admin/notification/get/62b458f63cc9abf35cc46950')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Notification))
})

test('should throw needed notification not found', async () => {
  const res = await request(server)
    .get('/api/admin/notification/get/62b458f63cc9abf35cc46959')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Notification))
})

test('should fetch unread notification count', async () => {
  const res = await request(server)
    .get('/api/user/notification/unread-count')
    .set('Authorization', `Bearer ${userToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.UnreadNotificationCount))
})

test('should fetch list of notification types', async () => {
  const res = await request(server)
    .get('/api/user/notification-types-list')
    .set('Authorization', `Bearer ${userToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.NotificationType))
})

test('should fetch list of notification', async () => {
  const res = await request(server)
    .get('/api/user/notification/list')
    .set('Authorization', `Bearer ${userToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Notification))
})

test('should send push notification to user using device token', async () => {
  const res = await request(server)
    .post('/api/admin/push-notification/add')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sTitle: 'Testing with single user in test case',
      sMessage: 'Testing Notification in test case using jest',
      sUserToken: 'cLxzohPS0I7yjb0WNgFCpg:APA91bHR3o8Sa_fhDydf3D4gVDgBS_esHowktRcuEYU3hbVLq9MSKteTtsp7axFF1LGEho998h7bB5oYIzNSM3upkJT5uc4Ep7d3MetJP00mmXRQTUqytSkPZ-CrV-jRpTdEk6GnGKBr'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.SentSuccessfully.replace('##', message.English.PushNotification))
})

test('should send push notification to subscribe devices to topic', async () => {
  const res = await request(server)
    .post('/api/admin/push-notification/add')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      sTitle: 'Testing push topic notification',
      sMessage: 'Testing Notification in test case using jest',
      sTopic: 'admin'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.SentSuccessfully.replace('##', message.English.PushNotification))
})
