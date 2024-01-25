const otpService = {}
const config = require('../../../config')

otpService.generate = (len) => {
  let char = ''
  char = !config.NODE_ENV || config.NODE_ENV === 'dev' ? '1' : '0123456789'
  // char = '1'
  let val = ''
  for (let i = len; i > 0; i--) {
    val += char[Math.floor(Math.random() * char.length)]
  }

  if (val.toString().length === len) {
    return val
  } else {
    otpService.generate(len)
  }

  return val
}

// for sending text message otp
otpService.send = (sMobNum) => {
// messaging service code here
}

module.exports = otpService
