const { AdminClient } = require('../../../helper/grpcClient')

function findAdmin(query, projection, sorting) {
  return new Promise((resolve, reject) => {
    AdminClient.findAdmin({ query: JSON.stringify(query), projection: JSON.stringify(projection), sorting: JSON.stringify(sorting) }, function(err, response) {
      if (err) reject(err)
      resolve(JSON.parse(response.adminData))
    })
  })
}

function updateAdmin(_id, token) {
  return new Promise((resolve, reject) => {
    AdminClient.updateAdmin({ _id, token }, function(err, response) {
      if (err) reject(err)
      resolve(response)
    })
  })
}

module.exports = {
  findAdmin,
  updateAdmin
}
