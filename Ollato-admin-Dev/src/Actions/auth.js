import axios from 'axios'
import constants from '../Shared/Types/constants'
import ls from 'localstorage-slim'
// import localStorage from 'react-secure-storage'

/* login action method */
export const login = (userData, navigate) => (dispatch) => {
  dispatch({ type: constants.CLEAR_LOGIN })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/login-with-password`,
      userData
    )
    .then((response) => {
      localStorage.setItem('token', response.data.Authorization)
      // localStorage.setItem('isLogin', '1')
      ls.set('admin-type', 'counsellor', { encrypt: true, secret: response.data.data.id })
      localStorage.setItem('profile', JSON.stringify(response.data.data))
      dispatch({
        type: constants.LOGIN,
        payload: {
          resStatus: true,
          userData: response.data.data,
          resMessage: response.data.message,
          token: response.data.Authorization,
          isAuthenticated: true
        }
      })
      setTimeout(() => {
        navigate('/counsellor-dashboard')
      }, 1000)
    })
    .catch((error) => {
      dispatch({
        type: constants.LOGIN,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isAuthenticated: false
        }
      })
    })
}

/* login with otp */
export const sendOTP = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_SEND_OTP })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/login-with-otp`,
      userData
    )
    .then((response) => {
      dispatch({
        type: constants.SEND_OTP,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isOTPSend: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.SEND_OTP,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isOTPSend: false
        }
      })
    })
}

export const verifyOtp = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VERIFY_OTP })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/login-with-verify-otp`,
      userData
    )
    .then((response) => {
      localStorage.setItem('token', response.data.Authorization)
      localStorage.setItem('profile', JSON.stringify(response.data.data))
      ls.set('admin-type', 'counsellor', { encrypt: true, secret: response.data.data.id })
      dispatch({
        type: constants.VERIFY_OTP,
        payload: {
          resStatus: true,
          data: response.data.data,
          resMessage: response.data.message,
          token: response.data.Authorization,
          isAuthenticated: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.VERIFY_OTP,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isAuthenticated: false
        }
      })
    })
}

/* forgot password verify email */
export const forgotPasswordVerifyEmail = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_FORGET_PASSWORD_VERIFY_EMAIL })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/forgot-password`,
      userData
    )
    .then((response) => {
      dispatch({
        type: constants.FORGET_PASSWORD_VERIFY_EMAIL,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isForgotOTPSend: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.FORGET_PASSWORD_VERIFY_EMAIL,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isForgotOTPSend: false
        }
      })
    })
}

export const getDummyData = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_DUMMY })
  axios
    .get('https://jsonplaceholder.typicode.com/todos')
    .then((response) => {
      dispatch({
        type: constants.DUMMY,
        payload: {
          resStatus: true,
          data: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.DUMMY,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

// verify email -Forgot Password
export const emailVerifiedAction = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EMAIL_VERIFY_FORGOT_PASSWORD })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/forgot-password`,
      userData
    )
    .then((response) => {
      dispatch({
        type: constants.EMAIL_VERIFY_FORGOT_PASSWORD,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          authToken: response.data.Authorization,
          isEmailVerified: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.EMAIL_VERIFY_FORGOT_PASSWORD,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isEmailVerified: false
        }
      })
    })
}

// verify otp -Forgot Password
export const otpVerifiedAction = (userData, admintype) => (dispatch) => {
  dispatch({ type: constants.CLEAR_OTP_VERIFICATION_FORGOT_PASSWORD })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${admintype}/otp-verification-forgot-password`,
      userData
    )
    .then((response) => {
      dispatch({
        type: constants.OTP_VERIFICATION_FORGOT_PASSWORD,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isOtpVerified: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.OTP_VERIFICATION_FORGOT_PASSWORD,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isOtpVerified: false
        }
      })
    })
}

/* Module - Reset Password */
export const resetPassword = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_RESET_PASSWORD })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/reset-password`,
      userData
    )
    .then((response) => {
      dispatch({
        type: constants.RESET_PASSWORD,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isReset: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.RESET_PASSWORD,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isReset: false
        }
      })
    })
}

/* Register Email verification */
export const emailVerification = (studentData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_SEND_OTP_SIGNUP })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/email-otp-send`,
      studentData
    )
    .then((response) => {
      dispatch({
        type: constants.SEND_OTP_SIGNUP,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isEmailAddressVerified: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.SEND_OTP_SIGNUP,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isEmailAddressVerified: false
        }
      })
    })
}

/* Register OTP verification */
export const otpVerification = (studentData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VERIFY_OTP_SIGNUP })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/email-otp-verify`,
      studentData
    )
    .then((response) => {
      dispatch({
        type: constants.VERIFY_OTP_SIGNUP,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isOTPSignupVerified: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.VERIFY_OTP_SIGNUP,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isOTPSignupVerified: false
        }
      })
    })
}

/* Get All States Data */
export const getAllStatesAction = (countryid) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_STATES })
  axios
    .post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/state/get_all_states`, {
      counrty_id: countryid
    })
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_STATES,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          statesData: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_STATES,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

/* Get All Countries Data */
export const getAllCountriesAction = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_COUNTRIES })
  axios
    .get(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/country/get_all_country`
    )
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_COUNTRIES,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          countriesData: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_COUNTRIES,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

/* Get All District Data */
export const getAllDistrictAction = (stateid) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_DISTRICTS })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/city/get_all_cities`, {
        state_id: stateid
      }
    )
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_DISTRICTS,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          districtData: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_DISTRICTS,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

/* Get All Boards Data */
export const getAllBoardsAction = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_BOARDS })
  axios
    .get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/board/get-all-board`)
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_BOARDS,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          boardsData: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_BOARDS,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

/* Get All school Data */
export const getAllSchoolAction = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_SCHOOLS })
  axios
    .get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/school/get-all-school`)
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_SCHOOLS,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          schoolData: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_SCHOOLS,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

/* Get All school Data */
export const getAllGradeAction = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_GRADE })
  axios
    .get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/grade/get-all-grade`)
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_GRADE,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          gradeData: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_GRADE,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

/* Get All counsellor Data */
export const getAllCounsellorAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_COUNSELLOR })
  axios
    .get(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/counsellor/get-all-counsellor-frontend`,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_COUNSELLOR,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          counsellorData: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_COUNSELLOR,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

/* Get All Qualification Data */
export const GetQualificationAction = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_QUALIFICATIONS })
  axios
    .get(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/get_qualification`
    )
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_QUALIFICATIONS,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          qData: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_QUALIFICATIONS,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

/* Get All Universities Data */
export const GetAllUniversityData = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_UNIVERSITIES })
  axios
    .get(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/get_all_university`
    )
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_UNIVERSITIES,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          universityData: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_UNIVERSITIES,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

/* Post Signup */
export const registerC = (formData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_SIGNUP })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/register`,
      formData
    )
    .then((response) => {
      dispatch({
        type: constants.SIGNUP,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          registerData: response.data.data,
          isRegistered: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.SIGNUP,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isRegistered: false
        }
      })
    })
}

/* Post Signup */
export const adminLogin = (formData, navigate) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADMIN_LOGIN })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/login-with-password`,
      formData
    )
    .then((response) => {
      localStorage.setItem('token', response.data.Authorization)
      // localStorage.setItem('isLogin', 1)
      // localStorage.setItem('admin-type', response.data.data.admin_type)
      ls.set('admin-type', response.data.data.admin_type, { encrypt: true, secret: response.data.data.id })
      localStorage.setItem('profile', JSON.stringify(response.data.data))
      if (response.data.data.admin_type === 'sub') {
        localStorage.setItem(
          'roles',
          JSON.stringify(response.data.data.admin_role.role_permissions)
        )
      }
      dispatch({
        type: constants.ADMIN_LOGIN,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          adminData: response.data.data,
          isLogin: true
          // role_permission: response.data.data.admin_role.role_permissions
        }
      })
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1000)
      localStorage.setItem('token', response.data.Authorization)
    })
    .catch((error) => {
      dispatch({
        type: constants.ADMIN_LOGIN,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isLogin: false
        }
      })
    })
}

/* Admin Forgot Password */
export const forgotPasswordEmailAction =
  (userData, admintype) => (dispatch) => {
    dispatch({ type: constants.CLEAR_ADMIN_FORGOT_PASSWORD })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${admintype}/forgot-password`,
        userData
      )
      .then((response) => {
        dispatch({
          type: constants.ADMIN_FORGOT_PASSWORD,
          payload: {
            resStatus: true,
            resMessage: response.data.message,
            adminToken: response.data.Authorization,
            isAdminEmailVerified: true
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.ADMIN_FORGOT_PASSWORD,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message,
            isAdminEmailVerified: false
          }
        })
      })
  }

/* Register Email verification */
export const mobileVerification = (studentData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_MOBILE_VERIFICATION })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/email-otp-send`,
      studentData
    )
    .then((response) => {
      dispatch({
        type: constants.MOBILE_VERIFICATION,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isMobileOTPVerification: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.MOBILE_VERIFICATION,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isMobileOTPVerification: false
        }
      })
    })
}

/* Register OTP verification */
export const mobileOTPVerification = (studentData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_MOBILE_VERIFICATION_OTP_SEND })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/email-otp-verify`,
      studentData
    )
    .then((response) => {
      dispatch({
        type: constants.MOBILE_VERIFICATION_OTP_SEND,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isMobileOTPSend: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.MOBILE_VERIFICATION_OTP_SEND,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isMobileOTPSend: false
        }
      })
    })
}

/* Module - Admin Reset Password */
export const adminResetPassword = (userData, admintype) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADMIN_RESET_PASSWORD })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${admintype}/reset-password/`,
      userData
    )
    .then((response) => {
      dispatch({
        type: constants.ADMIN_RESET_PASSWORD,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isAdminReset: true
        }
      })
      // localStorage.setItem('token',  )
    })
    .catch((error) => {
      dispatch({
        type: constants.ADMIN_RESET_PASSWORD,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isAdminReset: false
        }
      })
    })
}

/* Logout */
export const logoutAction = (token, adminType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADMIN_LOGOUT })
  axios
    .get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/logout`, {
      headers: { Authorization: token }
    })
    .then((response) => {
      dispatch({
        type: constants.ADMIN_LOGOUT,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isLoggedOut: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADMIN_LOGOUT,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isLoggedOut: false
        }
      })
    })
}

// center login
export const centerLogin = (userData, navigate) => (dispatch) => {
  dispatch({ type: constants.CLEAR_CENTER_LOGIN })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/login-with-password`,
      userData
    )
    .then((response) => {
      localStorage.setItem('token', response.data.Authorization)
      // localStorage.setItem('isLogin', '1')
      ls.set('admin-type', 'center', { encrypt: true, secret: response.data.data.id })
      localStorage.setItem('profile', JSON.stringify(response.data.data))

      dispatch({
        type: constants.CENTER_LOGIN,
        payload: {
          resStatus: true,
          userData: response.data.data,
          resMessage: response.data.message,
          // token: response.data.Authorization,
          isAuthenticated: true
        }
      })
      setTimeout(() => {
        navigate('/center/dashboard')
      }, 1000)
    })
    .catch((error) => {
      dispatch({
        type: constants.CENTER_LOGIN,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isAuthenticated: false
        }
      })
    })
}

/* Change Password */
export const changePassword = (data, token, adminType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_CHANGE_PASSWORD })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/change-password`,
      data,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.CHANGE_PASSWORD,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isPasswordChanged: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.CHANGE_PASSWORD,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isPasswordChanged: false
        }
      })
    })
}

/*
  view admin profile
*/
export const viewProfileAdmin = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VIEW_ADMIN_PROFILE })
  axios
    .get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/admin-profile`, {
      headers: { Authorization: token }
    })
    .then((response) => {
      localStorage.setItem('profile', JSON.stringify(response.data.data))
      dispatch({
        type: constants.VIEW_ADMIN_PROFILE,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          profileDataAdmin: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.VIEW_ADMIN_PROFILE,
        payload: {
          resStatus: error?.response?.data.status,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

// update admin profile
export const editProfileAdmin = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_UPDATE_ADMIN_PROFILE })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/admin-profile/update`,
      data,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.UPDATE_ADMIN_PROFILE,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isProfileEditedAdmin: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.UPDATE_ADMIN_PROFILE,
        payload: {
          resStatus: error?.response?.data.status,
          resMessage: error?.response?.data?.message,
          isProfileEditedAdmin: false
        }
      })
    })
}
