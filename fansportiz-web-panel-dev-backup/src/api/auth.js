import axios from '../axios/instanceAxios'

export const FirebaseTokenQuery = async (FirebaseToken) => {
  return FirebaseToken
}

export const VerificationSendOTP = async (mobileNumber, type, auth, token) => {
  const response = await axios.post('/gaming/user/auth/send-otp/v1', { sLogin: mobileNumber, sType: type, sAuth: auth }, { headers: { Authorization: token } })
  return response?.data
}

export const googleLogin = async (socialType, token) => {
  const response = await axios.post('/gaming/user/auth/social-login/v2', {
    sSocialType: socialType,
    sSocialToken: token
  })
  return response?.data
}

export const deleteAccount = async (reason) => {
  return await axios.delete('/gaming/user/auth/delete-account/v1', { data: { sReason: reason } })
}

export const deleteAccountReasons = async () => {
  return await axios.get('/gaming/user/delete-account-reason/v1')
}
