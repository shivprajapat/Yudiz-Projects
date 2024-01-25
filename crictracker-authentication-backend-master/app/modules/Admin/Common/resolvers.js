const { generatePreSignedUrl } = require('./controllers')

const Mutation = {
  generatePreSignedUrl
}

const resolvers = { Mutation }

module.exports = resolvers
