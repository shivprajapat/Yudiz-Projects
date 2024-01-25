import axios from '../../axios'

export async function login({ sEmail, sPassword }) {
  return await axios.post('/auth/login', {
    sEmail,
    sPassword
  })
}

export async function forgotPassword({ sEmail }) {
  return await axios.post('/auth/forgotPassword', {
    sEmail
  })
}

export async function resetPassWord({ sEmail, otp, sNewPassword }) {
  return await axios.post(`/auth/resetPassword`, { sEmail, otp, sNewPassword })
}

export async function logout() {
  return await axios.get(`/profile/logout`)
}

export async function changePassWord({ sNewPassword, sOldPassword }) {
  return await axios.post(`/profile/changePassword`, { sNewPassword, sOldPassword })
}
