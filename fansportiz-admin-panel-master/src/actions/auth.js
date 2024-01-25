import axios from '../axios'
import { history } from '../App'
import { encryption } from '../helpers/helper'
import { CLEAR_AUTH_PROPS, CLEAR_AUTH_RESPONSE, CLEAR_MESSAGE, LOGIN, LOGOUT, RESET_PASSWORD, SEND_OTP } from './constants'

const errMsg = 'Server is unavailable.'

const login = (email, password) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_RESPONSE })
  const Password = encryption(password)
  await axios.post('/auth/login/v2', {
    sLogin: email,
    sPassword: Password
  }).then((response) => {
    const userData = response.data && response.data.data
    const obj = {}
    localStorage.setItem('Token', response.data.Authorization)
    localStorage.setItem('adminData', JSON.stringify(response.data.data))
    userData && userData.iRoleId && userData.iRoleId.aPermissions && userData.iRoleId.aPermissions.map(permission => {
      obj[permission.sKey] = permission.eType
      return obj
    })
    localStorage.setItem('adminPermission', JSON.stringify(obj))
    dispatch({
      type: LOGIN,
      payload: {
        token: response.data.Authorization,
        data: response.data.data,
        permission: obj,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: LOGIN,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

const logout = token => async (dispatch) => {
  await axios.put('/auth/logout/v1', {}, { headers: { Authorization: token } }).then(async (response) => {
    localStorage.removeItem('Token')
    localStorage.removeItem('adminData')
    localStorage.removeItem('adminPermission')
    history.push('/auth')
    dispatch({ type: CLEAR_AUTH_PROPS })
    dispatch({
      type: LOGOUT,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: LOGOUT,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

const sendOtp = sLogin => async (dispatch) => {
  dispatch({ type: CLEAR_MESSAGE })
  await axios.post('/auth/send-otp/v1', { sLogin }).then((response) => {
    dispatch({
      type: SEND_OTP,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: SEND_OTP,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

const resetPassword = (token, password) => async (dispatch) => {
  dispatch({ type: CLEAR_MESSAGE })
  await axios.post('/auth/reset-password/v1', {
    sToken: token,
    sNewPassword: password
  }).then((response) => {
    dispatch({
      type: RESET_PASSWORD,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: RESET_PASSWORD,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export { login, logout, sendOtp, resetPassword }
