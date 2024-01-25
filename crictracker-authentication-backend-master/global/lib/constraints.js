const constraints = {
  isApiRateLimiterEnabled: process.env.ISAPIRATELIMITERENABLED === 'true',

  registerThreshold: 1,
  registerRateLimit: 30,
  registerOtpCount: 3,
  registerOtpRateLimit: 1800,

  forgotPasswordThreshold: 1,
  forgotPasswordRateLimit: 30,
  forgotPasswordOtpCount: 3,
  forgotPasswordOtpRateLimit: 1800,

  resendOtpThresold: 1,
  resendOtpTimeOutRateLimit: 30,
  resendOtpCount: 3,
  resendOtpRateLimit: 1800,

  verifyThreshold: 1,
  verifyRateLimit: 30,
  verifyOtpCount: 3,
  verifyOtpRateLimit: 1800,

  loginThreshold: 5,
  loginRateLimit: 1800,

  userBlockLimit: 777600,
  forgotPasswordOtpLimitTime: 30
}

module.exports = constraints
