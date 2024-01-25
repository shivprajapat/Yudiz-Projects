import Axios from '../../axios'
import { encryption } from '../../helpers/helper'

export async function loginApi({ sLogin, sPassword }) {
  const encryptedPassword = encryption(sPassword)
  return await Axios.post('/api/employee/login/v1', {
    sLogin,
    sPassword: encryptedPassword,
  })
}

export async function logoutApi() {
  return await Axios.put('/api/employee/logout/v1')
}

export async function forgotPasswordApi(sLogin) {
  return await Axios.post('/api/employee/forgot-password', {
    sLogin,
  })
}

export async function resetPasswordApi({ sNewPassword, sConfirmPassword, token, sCode }) {
  const encryptedNewPassword = encryption(sNewPassword)
  const encryptedConfirmPassword = encryption(sConfirmPassword)

  return await Axios.post(`/reset-password?token=${token}`, {
    sNewPassword: encryptedNewPassword,
    sConfirmPassword: encryptedConfirmPassword,
    sCode,
  })
}
export async function changePasswordApi(changePasswordData) {
  const ebcryptedChnagePasswordObject = {
    sCurrentPassword: encryption(changePasswordData.sCurrentPassword),
    sNewPassword: encryption(changePasswordData.sNewPassword),
    sConfirmPassword: encryption(changePasswordData.sConfirmPassword),
  }

  return await Axios.post('/api/employee/change-password/v1', ebcryptedChnagePasswordObject)
}
