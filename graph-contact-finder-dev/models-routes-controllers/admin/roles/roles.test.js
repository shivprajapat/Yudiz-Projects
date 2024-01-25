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

test('should add role', async () => {
  const body = {
    sName: 'subadmin permission 3',
    aPermissions: [
      {
        sKey: 'USERS',
        eType: 'N'
      },
      {
        sKey: 'USER_CONTACT',
        eType: 'N'
      },
      {
        sKey: 'PERMISSION',
        eType: 'N'
      },
      {
        sKey: 'SUBADMIN',
        eType: 'N'
      },
      {
        sKey: 'ADMIN_ROLE',
        eType: 'N'
      },
      {
        sKey: 'NOTIFICATION',
        eType: 'N'
      }
    ],
    eStatus: 'N'
  }
  const res = await request(server)
    .post('/api/admin/role')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.AddedSuccessfully.replace('##', message.English.Role))
})

test('should throw role already exist - add', async () => {
  const body = {
    sName: 'subadmin permission 3',
    aPermissions: [
      {
        sKey: 'USERS',
        eType: 'N'
      },
      {
        sKey: 'USER_CONTACT',
        eType: 'N'
      },
      {
        sKey: 'PERMISSION',
        eType: 'N'
      },
      {
        sKey: 'SUBADMIN',
        eType: 'N'
      },
      {
        sKey: 'ADMIN_ROLE',
        eType: 'N'
      },
      {
        sKey: 'NOTIFICATION',
        eType: 'N'
      }
    ],
    eStatus: 'N'
  }
  const res = await request(server)
    .post('/api/admin/role')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body)

  expect(res.statusCode).toEqual(status.ResourceExist)
  expect(res.body.message).toEqual(message.English.AlreadyExist.replace('##', message.English.Role))
})

test('should throw permissions not found - add', async () => {
  const body = {
    sName: 'subadmin permission new',
    aPermissions: [
      {
        sKey: 'USERS',
        eType: 'N'
      },
      {
        sKey: 'USER_CONTACT',
        eType: 'N'
      },
      {
        sKey: 'PERMISSION',
        eType: 'N'
      },
      {
        sKey: 'SUBADMIN',
        eType: 'N'
      },
      {
        sKey: 'ADMIN_ROLE',
        eType: 'N'
      },
      {
        sKey: 'NOTIFICATION',
        eType: 'N'
      }
    ],
    eStatus: 'N'
  }
  const res = await request(server)
    .post('/api/admin/role')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Permissions))
})

test('should throw invalid entry - add', async () => {
  const body = {
    sName: 'subadmin permission 5',
    aPermissions: [
      {
        sKey: 'USERS',
        eType: 'N'
      },
      {
        sKey: 'USER_CONTACT',
        eType: 'N'
      },
      {
        sKey: 'PERMISSION',
        eType: 'N'
      },
      {
        sKey: 'SUBADMIN',
        eType: 'N'
      },
      {
        sKey: 'ADMIN_ROLE',
        eType: 'N'
      }
    ],
    eStatus: 'Y'
  }
  const res = await request(server)
    .post('/api/admin/role')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body)

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.InvalidEntry.replace('##', message.English.Permissions))
})

test('should fetch roles whose eStatus is Y', async () => {
  const res = await request(server)
    .get('/api/admin/role')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Roles))
})

test('should throw list not found', async () => {
  const res = await request(server)
    .get('/api/admin/role')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Roles))
})

test('should fetch roles', async () => {
  const res = await request(server)
    .get('/api/admin/role/list')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({
      sSearch: 'n per'
    })

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Roles))
})

test('should throw roles not found', async () => {
  const res = await request(server)
    .get('/api/admin/role/list')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({
      sSearch: 'n perd' // will not match any role
    })

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Roles))
})

test('should fetch needed role', async () => {
  const res = await request(server)
    .get('/api/admin/role/62b42bb540ddf61fd9b58116')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.FetchedSuccessFully.replace('##', message.English.Role))
})

test('should throw role not found - by id', async () => {
  const res = await request(server)
    .get('/api/admin/role/62b42bb540ddf61fd9b58117')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Role))
})

test('should role gets updated', async () => {
  const body = {
    sName: 'subadmin permission first',
    aPermissions: [
      {
        sKey: 'USERS',
        eType: 'R'
      },
      {
        sKey: 'USER_CONTACT',
        eType: 'R'
      },
      {
        sKey: 'PERMISSION',
        eType: 'W'
      },
      {
        sKey: 'SUBADMIN',
        eType: 'W'
      },
      {
        sKey: 'ADMIN_ROLE',
        eType: 'W'
      },
      {
        sKey: 'NOTIFICATION',
        eType: 'W'
      }
    ],
    eStatus: 'Y'
  }
  const res = await request(server)
    .put('/api/admin/role/62b42bb540ddf61fd9b58116')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.UpdatedSuccessfully.replace('##', message.English.Role))
})

test('should throw role already exist - update', async () => {
  const body = {
    sName: 'subadmin permission 3',
    aPermissions: [
      {
        sKey: 'USERS',
        eType: 'R'
      },
      {
        sKey: 'USER_CONTACT',
        eType: 'R'
      },
      {
        sKey: 'PERMISSION',
        eType: 'W'
      },
      {
        sKey: 'SUBADMIN',
        eType: 'W'
      },
      {
        sKey: 'ADMIN_ROLE',
        eType: 'W'
      },
      {
        sKey: 'NOTIFICATION',
        eType: 'W'
      }
    ],
    eStatus: 'Y'
  }
  const res = await request(server)
    .put('/api/admin/role/62b42bb540ddf61fd9b58116')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body)

  expect(res.statusCode).toEqual(status.ResourceExist)
  expect(res.body.message).toEqual(message.English.AlreadyExist.replace('##', message.English.Role))
})

test('should throw permission not found - update', async () => {
  const body = {
    sName: 'subadmin permission new',
    aPermissions: [
      {
        sKey: 'USERS',
        eType: 'R'
      },
      {
        sKey: 'USER_CONTACT',
        eType: 'R'
      },
      {
        sKey: 'PERMISSION',
        eType: 'W'
      },
      {
        sKey: 'SUBADMIN',
        eType: 'W'
      },
      {
        sKey: 'ADMIN_ROLE',
        eType: 'W'
      },
      {
        sKey: 'NOTIFICATION',
        eType: 'W'
      }
    ],
    eStatus: 'Y'
  }
  const res = await request(server)
    .put('/api/admin/role/62b42bb540ddf61fd9b58116')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Permissions))
})

test('should throw invalid entry - update', async () => {
  const body = {
    sName: 'subadmin permission first',
    aPermissions: [
      {
        sKey: 'USERS',
        eType: 'R'
      },
      {
        sKey: 'USER_CONTACT',
        eType: 'R'
      },
      {
        sKey: 'PERMISSION',
        eType: 'W'
      },
      {
        sKey: 'SUBADMIN',
        eType: 'W'
      },
      {
        sKey: 'NOTIFICATION',
        eType: 'W'
      }
    ],
    eStatus: 'Y'
  }
  const res = await request(server)
    .put('/api/admin/role/62b42bb540ddf61fd9b58116')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body)

  expect(res.statusCode).toEqual(status.BadRequest)
  expect(res.body.message).toEqual(message.English.InvalidEntry.replace('##', message.English.Permissions))
})

test('should throw role not found - update', async () => {
  const body = {
    sName: 'subadmin permission 5',
    aPermissions: [
      {
        sKey: 'USERS',
        eType: 'R'
      },
      {
        sKey: 'USER_CONTACT',
        eType: 'R'
      },
      {
        sKey: 'PERMISSION',
        eType: 'W'
      },
      {
        sKey: 'SUBADMIN',
        eType: 'W'
      },
      {
        sKey: 'ADMIN_ROLE',
        eType: 'W'
      },
      {
        sKey: 'NOTIFICATION',
        eType: 'W'
      }
    ],
    eStatus: 'Y'
  }
  const res = await request(server)
    .put('/api/admin/role/62b42bb540ddf61fd9b58117')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Role))
})

test('should role gets deleted', async () => {
  const res = await request(server)
    .delete('/api/admin/role/62b42e45e09638eee9456a6d')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.Success)
  expect(res.body.message).toEqual(message.English.DeletedSuccessfully.replace('##', message.English.Role))
})

test('should throw role not found - delete', async () => {
  const res = await request(server)
    .delete('/api/admin/role/62b42e45e09638eee9456a6d')
    .set('Authorization', `Bearer ${adminToken}`)

  expect(res.statusCode).toEqual(status.NotFound)
  expect(res.body.message).toEqual(message.English.NotFound.replace('##', message.English.Role))
})
