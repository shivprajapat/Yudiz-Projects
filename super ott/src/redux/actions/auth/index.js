import axios from 'axios'
import { FailureToastNotification } from '../../../components/ToastNotification'
import {
  CLEAR_ERROR_MESSAGE,
  GET_USER_DATA_BEGIN,
  GET_USER_DATA_FAILURE,
  GET_USER_DATA_SUCCESS,
  LOGIN_BEGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_BEGIN,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
} from '../constants'
// const config = useJwt.jwtConfig

export const loginRequest = () => ({
  type: LOGIN_BEGIN
})
export const loginSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload
})
export const loginFailure = (payload) => ({
  type: LOGIN_FAILURE,
  payload
})

export const clearErrMessage = () => ({
  type: CLEAR_ERROR_MESSAGE
})

// ** Handle User Login
export const handleLogin = (payload, callBack) => {
  return (dispatch) => {
    dispatch(loginRequest())
    return axios
      .post(`${process.env.REACT_APP_AUTH_URL}/auth/login`, payload)
      .then((response) => {
        localStorage.setItem('adminAuthToken', `${response.headers.authorization}`)
        localStorage.setItem('userData', JSON.stringify(response?.data?.data))
        axios
          .get(`${process.env.REACT_APP_AUTH_URL}/profile/view`, {
            headers: {
              Authorization: `${response.headers.authorization}`
            }
          })
          .then((response) => {
            localStorage.setItem('userData', JSON.stringify(response?.data?.data))
            dispatch(loginSuccess(response?.data?.data))
            callBack && callBack(response?.data?.data)
          })
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(loginFailure(error?.response?.data?.message))
      })
  }
}

export const getUserDataBegin = () => ({
  type: GET_USER_DATA_BEGIN
})
export const getUserDataSuccess = (payload) => ({
  type: GET_USER_DATA_SUCCESS,
  payload
})
export const getUserDataFailure = (payload) => ({
  type: GET_USER_DATA_FAILURE,
  payload
})

// ** Handle User Data View
export const getAllUserData = (callBack) => {
  return (dispatch) => {
    dispatch(getUserDataBegin())
    return axios
      .get(`${process.env.REACT_APP_AUTH_URL}/profile/view`, {
        headers: {
          Authorization: `${localStorage.getItem('adminAuthToken')}`
        }
      })
      .then((response) => {
        dispatch(getUserDataSuccess(response?.data?.data))
        callBack && callBack(response?.data?.data)
      })
      .catch((error) => {
        FailureToastNotification(error?.response.message)
        dispatch(getUserDataFailure(error?.message))
      })
  }
}

export const logoutRequest = () => ({
  type: LOGOUT_BEGIN
})
export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS
})
export const logoutFailure = (payload) => ({
  type: LOGOUT_FAILURE,
  payload
})

export const handleLogout = (callBack) => {
  return (dispatch) => {
    dispatch(logoutRequest())
    return axios
      .get(`${process.env.REACT_APP_AUTH_URL}/profile/logout`, {
        headers: {
          Authorization: `${localStorage.getItem('adminAuthToken')}`
        }
      })
      .then((response) => {
        localStorage.clear()
        dispatch(logoutSuccess())
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.message)
        dispatch(logoutFailure(error?.message))
      })
  }
}
