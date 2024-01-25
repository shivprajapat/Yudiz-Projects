const constants = {}

constants.apiPath = {
  adminLogin: 'ADMIN_LOGIN',

  clientForgotPasswordAttempt: 'CLIENT_FORGOT_PASSWORD_ATTEMPT_COUNT',
  clientForgotPasswordPath: 'FORGOT_PASSWORD_TIMEOUT',

  registerOtpCount: 'REGISTER_OTP_COUNT',
  registerPath: 'REGISTER_OTP_TIMEOUT',

  verifyOtpCount: 'VERIFY_OTP_COUNT',
  verifyPath: 'VERIFY_OTP_TIMEOUT',

  resendOtpCount: 'RESEND_OTP_COUNT',
  resendOtpPath: 'RESEND_OTP_TIMEOUT',

  clientLogin: 'CLIENT_LOGIN_ATTEMPT_COUNT'
}

constants.constraints = {
  isApiRateLimiterEnabled: process.env.IS_API_RATE_LIMITER_ENABLED === 'true',

  registerThreshold: 1,
  registerRateLimit: 30,
  registerOtpCount: 3,
  registerOtpRateLimit: 1800,

  forgotPasswordThreshold: 1,
  forgotPasswordRateLimit: 30,
  forgotPasswordOtpCount: 3,
  forgotPasswordOtpRateLimit: 1800,

  resendOtpThreshold: 1,
  resendOtpTimeOutRateLimit: 30,
  resendOtpCount: 3,
  resendOtpRateLimit: 1800,

  verifyThreshold: 1,
  verifyRateLimit: 30,
  verifyOtpCount: 3,
  verifyOtpRateLimit: 1800,

  loginThreshold: 5,
  loginRateLimitTime: 1800,

  userBlockLimit: 777600,
  forgotPasswordOtpLimitTime: 30
}

module.exports = constants
