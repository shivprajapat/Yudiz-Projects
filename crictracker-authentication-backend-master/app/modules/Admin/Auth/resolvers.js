const { adminLogin, forgotPassword, verifyOtp, resetPassword, adminLogout } = require('./controllers')

const Mutation = {
  adminLogin,
  forgotPassword,
  verifyOtp,
  resetPassword,
  adminLogout
}

const resolvers = { Mutation }

module.exports = resolvers
