const constraints = {
  loginThreshold: 3,
  loginRateLimit: 1800,
  forgotPasswordThreshold: 1,
  forgotPasswordRateLimit: 30,
  forgotPasswordOtpCount: 3,
  forgotPasswordOtpRateLimit: 1800,
  userBlockLimit: 777600,
  isApiRateLimiterEnabled: false
}

module.exports = constraints
