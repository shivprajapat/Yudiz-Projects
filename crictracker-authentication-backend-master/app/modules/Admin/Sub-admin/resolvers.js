
const { createSubAdmin, generateUsername, changeAdminPicture, listSubAdmins, authenticateAdmin, getSubAdmin, bulkAction, editSubAdmin, editSubAdminProfilePicture, editProfile, getProfile, changePassword, resolveSubAdmin, getDisplayAuthor, generateTokenFront, subAdminSubscription } = require('./controllers')

const Mutation = {
  createSubAdmin,
  bulkAction,
  editSubAdmin,
  editSubAdminProfilePicture,
  editProfile,
  changePassword,
  changeAdminPicture
}

const Query = {
  generateUsername,
  listSubAdmins,
  getSubAdmin,
  getProfile,
  authenticateAdmin,
  getDisplayAuthor,
  generateTokenFront,
  subAdminSubscription
}

const subAdmin = {
  oSeo: (subAdmin) => {
    return { __typename: 'Seo', iId: subAdmin._id }
  },
  __resolveReference: (reference) => {
    return resolveSubAdmin(reference._id)
  }
}

const resolvers = {
  Mutation,
  Query,
  subAdmin
}

module.exports = resolvers
