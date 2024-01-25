const { KycClient, CMSClient, NotificationsClient } = require('../../../helper/grpcClient')

async function createKyc(iUserId) {
  return new Promise((resolve, reject) => {
    (() => {
      KycClient.createKyc({ iUserId }, function(err, response) {
        if (err) return reject(err)
        return resolve(response)
      })
    })()
  })
}

async function deleteKyc(iUserId) {
  return new Promise((resolve, reject) => {
    (() => {
      KycClient.deleteKyc({ iUserId }, function(err, response) {
        if (err) return reject(err)
        return resolve(response)
      })
    })()
  })
}

async function deleteUserKyc(iUserId) {
  return new Promise((resolve, reject) => {
    (() => {
      KycClient.deleteUserKyc({ iUserId }, function(err, response) {
        if (err) return reject(err)
        return resolve(response)
      })
    })()
  })
}

async function countCMS(query) {
  return new Promise((resolve, reject) => {
    (() => {
      CMSClient.countCMS({ query: JSON.stringify(query) }, function(err, response) {
        if (err) return reject(err)
        return resolve(response.count)
      })
    })()
  })
}

async function findNotificationType(sHeading) {
  return new Promise((resolve, reject) => {
    (() => {
      NotificationsClient.findNotificationType({ sHeading }, function(err, response) {
        if (err) return reject(err)
        return resolve(JSON.parse(response.data))
      })
    })()
  })
}

async function addNotificationMessage(data) {
  return new Promise((resolve, reject) => {
    (() => {
      NotificationsClient.addNotificationMessage({ iUserId: data.iUserId, sTitle: data.sTitle, sMessage: data.sMessage, iType: data.iType }, function(err, response) {
        if (err) return reject(err)
        return resolve(response)
      })
    })()
  })
}

module.exports = {
  createKyc,
  deleteKyc,
  countCMS,
  deleteUserKyc,
  findNotificationType,
  addNotificationMessage

}
