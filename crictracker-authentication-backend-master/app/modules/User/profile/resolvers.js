const { updateProfile, getUser, generateProfilePreSignedUrl, listFrontCountry, updateProfileImage } = require('./controllers')

const Mutation = {
  updateProfile,
  generateProfilePreSignedUrl,
  updateProfileImage
}

const Query = {
  getUser,
  listFrontCountry
}

const resolvers = { Query, Mutation }

module.exports = resolvers
