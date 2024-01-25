import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { CLEAR_AUTH_RESPONSE, FORGOT_PASSWORD, FORGOT_PASSWORD_EMAIL, LOGIN, SET_PASSWORD, SIGNUP } from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { GetToken } from 'firebase.js'
import { profileUpdate } from 'modules/user/redux/service'
const errMsg = 'Server is unavailable.'

export const loginUser = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_RESPONSE })
  axios
    .post(apiPaths.userLogin, payload)
    .then(({ data }) => {
      localStorage.setItem('userToken', data.result.accessToken)
      localStorage.setItem('userId', data.result.userId)
      callback && callback()
      GetToken().then((currentToken) => {
        dispatch(
          profileUpdate(data.result.userId, {
            fcmTokens: [currentToken]
          })
        )
      })
      dispatch({
        type: LOGIN,
        payload: {
          token: data.result.accessToken,
          data: data.result.userId,
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: LOGIN,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const registerUser = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_RESPONSE })
  axios
    .post(apiPaths.userRegister, payload)
    .then(({ data }) => {
      callback && callback()
      dispatch({
        type: SIGNUP,
        payload: {
          token: data.result.accessToken,
          data: data.result.userId,
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: LOGIN,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const setPassword = (payload, routeChangeCallback) => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_RESPONSE })
  axios
    .post(apiPaths.userSetPassword, payload)
    .then(({ data }) => {
      routeChangeCallback && routeChangeCallback()
      dispatch({
        type: SET_PASSWORD,
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: SET_PASSWORD,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const ForgotPasswordRequest = (payload, routeChangeCallback) => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_RESPONSE })
  axios
    .post(apiPaths.forgotPasswordRequest, payload)
    .then(({ data }) => {
      routeChangeCallback && routeChangeCallback()
      dispatch({
        type: FORGOT_PASSWORD,
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: FORGOT_PASSWORD,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const ForgotPasswordEmail = (payload, routeChangeCallback) => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_RESPONSE })
  axios
    .post(apiPaths.forgotPassword, payload)
    .then(({ data }) => {
      routeChangeCallback && routeChangeCallback()
      dispatch({
        type: FORGOT_PASSWORD_EMAIL,
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: FORGOT_PASSWORD_EMAIL,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
