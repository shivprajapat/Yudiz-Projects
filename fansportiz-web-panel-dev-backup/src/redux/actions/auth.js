import axios from '../../axios/instanceAxios'
import storage from '../../localStorage/localStorage'
import {
  SEND_OTP,
  VERIFY_OTP,
  FORGOT_PASSWORD,
  REGISTER_USER,
  CHECK_EXIST,
  VALIDATE_TOKEN,
  LOGIN_USER,
  LOGOUT,
  CLEAR_AUTH_MESSAGE,
  CLEAR_MESSAGE_TYPE,
  CLEAR_SEND_OTP_MESSAGE,
  CLEAR_VERIFY_OTP_MESSAGE,
  CLEAR_CHECKED_MESSAGE,
  GOOGLE_LOGIN_USER,
  FIREBASE_TOKEN,
  DELETE_ACCOUNT_REASONS,
  DELETE_ACCOUNT
} from '../constants'
import { catchError } from '../../utils/helper'
import { encryption } from '../../utils/encryption'

const errMsg = 'Server is unavailable.'

export const sendOTP = (mobileNumber, type, auth) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_MESSAGE })
  dispatch({ type: CLEAR_SEND_OTP_MESSAGE })
  await axios.post('/gaming/user/auth/send-otp/v1', { sLogin: mobileNumber, sType: type, sAuth: auth }).then((response) => {
    dispatch({
      type: SEND_OTP,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        sendOtp: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: SEND_OTP,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg,
        sendOtp: false
      }
    })
  })
}

export const VerifyOTP = (mobileNumber, type, auth, code, ID, FirebaseToken) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_MESSAGE })
  dispatch({ type: CLEAR_VERIFY_OTP_MESSAGE })
  await axios.post('/gaming/user/auth/verify-otp/v2', {
    sLogin: mobileNumber, sType: type, sAuth: auth, sCode: code, sDeviceId: ID, sPushToken: FirebaseToken
  }).then((response) => {
    dispatch({
      type: VERIFY_OTP,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        otpVerified: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: VERIFY_OTP,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg,
        otpVerified: false
      }
    })
  })
}

export const VerificationSendOTP = (mobileNumber, type, auth, token) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_MESSAGE })
  dispatch({ type: CLEAR_SEND_OTP_MESSAGE })
  await axios.post('/gaming/user/auth/send-otp/v1', { sLogin: mobileNumber, sType: type, sAuth: auth }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SEND_OTP,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        sendOtp: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: SEND_OTP,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg,
        sendOtp: false
      }
    })
  })
}

export const VerificationVerifyOTP = (mobileNumber, type, auth, code, ID, token, FirebaseToken) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_MESSAGE })
  dispatch({ type: CLEAR_VERIFY_OTP_MESSAGE })
  await axios.post('/gaming/user/auth/verify-otp/v2', {
    sLogin: mobileNumber, sType: type, sAuth: auth, sCode: code, sDeviceId: ID, sPushToken: FirebaseToken
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: VERIFY_OTP,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        otpVerified: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: VERIFY_OTP,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg,
        otpVerified: false
      }
    })
  })
}

export const ForgotPassword = (mobileNumber, type, auth, code, password) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_MESSAGE })
  // const encryptedPass = encryption(password)
  await axios.post('/gaming/user/auth/reset-password/v3', {
    sLogin: mobileNumber, sType: type, sAuth: auth, sCode: code, sNewPassword: password
  }).then((response) => {
    dispatch({
      type: FORGOT_PASSWORD,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch(catchError(FORGOT_PASSWORD, error))
  })
}

// Registration
export const Registration = (FirebaseToken, PlatForm, userName, email, mobileNumber, Password, sCode, referralCode, token, socialToken, aPolicyId) => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_MESSAGE })
  // const encryptedPass = encryption(Password)
  axios.post('/gaming/user/auth/register/v4', {
    sPushToken: FirebaseToken, sUsername: userName, sEmail: email, sMobNum: mobileNumber, sDeviceId: token, sPassword: Password, sCode, sReferCode: referralCode, sSocialToken: socialToken
  }, { headers: { Platform: PlatForm } }).then(async (response) => {
    if (response.data.Authorization) {
      storage.setItem('Token', response.data.Authorization)
      storage.setItem('userData', JSON.stringify(response.data.data))
      dispatch({
        type: REGISTER_USER,
        payload: {
          loginUser: userName,
          loginPass: Password,
          token: response.data.Authorization,
          resMessage: response.data.message,
          resStatus: true,
          messageType: '',
          registerSuccess: true
        }
      })
    } else {
      dispatch({
        type: REGISTER_USER,
        payload: {
          loginUser: userName,
          loginPass: Password,
          resMessage: response.data.message,
          resStatus: true,
          messageType: '',
          registerSuccess: true
        }
      })
    }
  }).catch((error) => {
    dispatch({
      type: REGISTER_USER,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg,
        messageType: '',
        registerSuccess: false
      }
    })
  })
}

export const CheckExist = (sType, sValue) => async (dispatch) => {
  dispatch({ type: CLEAR_MESSAGE_TYPE })
  dispatch({ type: CLEAR_CHECKED_MESSAGE })
  await axios.post('/gaming/user/auth/check-exist/v1', { sType, sValue }).then((response) => {
    dispatch({
      type: CHECK_EXIST,
      payload: {
        messageType: '',
        resStatus: true,
        isChecked: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: CHECK_EXIST,
      payload: {
        resStatus: false,
        isChecked: false,
        resMessage: error.response ? error.response.data.message : errMsg,
        messageType: sType
      }
    })
  })
}

export const VerifyToken = (pushToken, deviceToken) => async (dispatch) => {
  dispatch({ type: CLEAR_MESSAGE_TYPE })
  await axios.post('/gaming/user/auth/validate-token/v2', { sPushToken: pushToken, sDeviceId: deviceToken }, { headers: { Authorization: pushToken } }).then((response) => {
    storage.setItem('tokenVerified', true)
    dispatch({
      type: VALIDATE_TOKEN,
      payload: {
        resStatus: true,
        tokenVerified: true
      }
    })
  }).catch((error) => {
    dispatch(catchError(VALIDATE_TOKEN, error))
  })
}

export const FirebaseToken = (Token) => async (dispatch) => {
  dispatch({
    type: FIREBASE_TOKEN,
    payload: {
      FirebaseToken: Token
    }
  })
}

export const Login = (FirebaseToken, PlatForm, userName, Password, loginID) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_MESSAGE })
  const encryptedPass = encryption(Password)
  await axios.post('/gaming/user/auth/login/v2', {
    sPushToken: FirebaseToken, sLogin: userName, sPassword: encryptedPass, sDeviceToken: loginID
  }, { headers: { Platform: PlatForm } }).then((response) => {
    if (response.data.Authorization) {
      storage.setItem('Token', response.data.Authorization)
      storage.setItem('userData', JSON.stringify(response.data.data))
      dispatch({
        type: LOGIN_USER,
        payload: {
          loginUser: userName,
          loginPass: Password,
          token: response.data.Authorization,
          data: response.data.data,
          resMessage: response.data.message,
          nOtpSend: response.data.data.nOtpSend,
          resStatus: true
        }
      })
    } else {
      dispatch({
        type: LOGIN_USER,
        payload: {
          loginUser: userName,
          loginPass: Password,
          resMessage: response.data.message,
          nOtpSend: response.data.data.nOtpSend,
          resStatus: true
        }
      })
    }
  }).catch((error) => {
    dispatch(catchError(LOGIN_USER, error))
  })
}

export const googleLogin = (socialType, token) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_MESSAGE })
  await axios.post('/gaming/user/auth/social-login/v2', {
    sSocialType: socialType,
    sSocialToken: token
  }).then((response) => {
    if (response.data.Authorization) {
      storage.setItem('Token', response.data.Authorization)
      storage.setItem('userData', JSON.stringify(response.data.data))
      dispatch({
        type: GOOGLE_LOGIN_USER,
        payload: {
          token: response.data.Authorization,
          data: response.data.data,
          resMessage: response.data.message,
          resStatus: true
        }
      })
    } else {
      dispatch({
        type: GOOGLE_LOGIN_USER,
        payload: {
          resMessage: response.data.message,
          resStatus: true
        }
      })
    }
  }).catch((error) => {
    if (error && error.response && error.response.data && error.response.data.status === 404) {
      dispatch({
        type: GOOGLE_LOGIN_USER,
        payload: {
          resMessage: error.response.data.message,
          resStatus: true,
          socialRegisterData: error.response.data.data
        }
      })
    } else {
      dispatch(catchError(GOOGLE_LOGIN_USER, error))
    }
  })
}

export const logout = (token) => async (dispatch) => {
  await axios.put('/gaming/user/auth/logout/v1', {}, { headers: { Authorization: token } }).then((response) => {
    storage.removeItem('Token')
    storage.removeItem('userData')
    dispatch({
      type: LOGOUT,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch(catchError(LOGOUT, error))
  })
}

export const deleteAccount = (reason, token) => async (dispatch) => {
  await axios.delete('/gaming/user/auth/delete-account/v1', { data: { sReason: reason }, headers: { Authorization: token } }).then((response) => {
    storage.removeItem('Token')
    storage.removeItem('userData')
    dispatch({
      type: DELETE_ACCOUNT,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        accountDeleted: true
      }
    })
  }).catch((error) => {
    dispatch(catchError(DELETE_ACCOUNT, error))
  })
}

export const deleteAccountReasons = token => async (dispatch) => {
  await axios.get('/gaming/user/delete-account-reason/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_ACCOUNT_REASONS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch(catchError(DELETE_ACCOUNT_REASONS, error))
  })
}
