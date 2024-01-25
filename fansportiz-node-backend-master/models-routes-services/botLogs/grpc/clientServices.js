const { AdminClient } = require('../../../helper/grpcClient')

async function findAdmins(query, projection, sorting) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.findAdmins({ query: JSON.stringify(query), projection: JSON.stringify(projection), sorting: JSON.stringify(sorting) }, function (err, response) {
        if (err) reject(err)
        resolve(JSON.parse(response.adminData))
      })
    })()
  })
}

module.exports = {
  findAdmins
}
