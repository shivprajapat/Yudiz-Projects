const { sendOTP, verifyUserOTP, signUp, userLogin, socialSignIn, resetUserPassword, userLogout, userChangePassword, resolveUser, userExists, socialSignUp } = require('./controllers')

const Mutation = {
  sendOTP,
  verifyUserOTP,
  signUp,
  userLogin,
  socialSignIn,
  resetUserPassword,
  userLogout,
  userChangePassword,
  userExists,
  socialSignUp
}

const user = {
  __resolveReference: (reference) => {
    return resolveUser(reference._id)
  }
}

const resolvers = { Mutation, user }

module.exports = resolvers
