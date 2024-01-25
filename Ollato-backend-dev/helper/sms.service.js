const config = require('../config/config-file')
const { handleCatchError } = require('./utilities.services')
const axios = require('axios')

/**
 * to generate OTP code with dynamic length
 * @param  {number} nLength
 * @return {string} '1234'
 */
const generateOTP = (nLength) => {
  const digits = '0123456789'
  let OTP = ''
  for (let i = 0; i < nLength; i++) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }
  if (Number(OTP).toString().length !== nLength) {
    return generateOTP(nLength)
  }
  return OTP
}

/**
 * to send or verify otp through MSG91 provider
 * @param  {string} sAction
 * @param  {object} => { sPhone, sOTP }
 * @return {object} => {isSuccess, message}
 */
async function SendOtpMsg(oUser) {
  try {
    const { sPhone, sOTP } = oUser
    if (!sPhone || !sOTP) throw new Error('Invalid details')
    try {
      const response = await axios.get('https://api.msg91.com/api/v5/otp', {
        params:
                  {
                    template_id: config.MSG91_TEMPLATE_ID,
                    mobile: `91${sPhone}`,
                    authkey: config.MSG91_AUTH_KEY,
                    otp: sOTP
                  }
      })
      if (!response || response.data.type !== 'success') return { isSuccess: false, message: response.data.message || response.data }
      return { isSuccess: true, message: 'OTP sent successfully!' }
    } catch (error) {
      handleCatchError(error)
    }
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = {
  SendOtpMsg,
  generateOTP
}
