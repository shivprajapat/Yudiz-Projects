
import axios from 'axios'
import constants from '../Shared/Types/constants'

/* login action method */
export const login = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_LOGIN })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/login-with-password`, userData).then((response) => {
    localStorage.setItem('token', response.data.Authorization)
    localStorage.setItem('profile', JSON.stringify({ first_name: response.data.data.first_name, last_name: response.data.data.last_name, profile: response.data.data.profile }))
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
  }).catch((error) => {
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
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/login-with-otp`, userData).then((response) => {
    dispatch({
      type: constants.SEND_OTP,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isOTPSend: true
      }
    })
  }).catch((error) => {
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

/* login with otp - verify otp */
export const verifyOtp = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VERIFY_OTP })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/login-with-verify-otp`, userData).then((response) => {
    localStorage.setItem('token', response.data.Authorization)
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
  }).catch((error) => {
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

export const verifyForgotPasswordOTP = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VERIFY_FORGOT_PASSWORD })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/otp-verification`, userData).then((response) => {
    dispatch({
      type: constants.VERIFY_FORGOT_PASSWORD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isVerified: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.VERIFY_FORGOT_PASSWORD,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.messsage,
        isVerified: false
      }
    })
  })
}

export const resetPassword = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_RESET_PASSWORD })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/reset-password`, userData).then((response) => {
    dispatch({
      type: constants.RESET_PASSWORD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isReset: true
      }
    })
  }).catch((error) => {
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

/* forgot password verify email */
export const forgotPasswordVerifyEmail = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_FORGET_PASSWORD_VERIFY_EMAIL })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/forgot-password`, userData).then((response) => {
    dispatch({
      type: constants.FORGET_PASSWORD_VERIFY_EMAIL,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isForgotOTPSend: true,
        token: response.data.Authorization
      }
    })
  }).catch((error) => {
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
  axios.get('https://jsonplaceholder.typicode.com/todos').then((response) => {
    dispatch({
      type: constants.DUMMY,
      payload: {
        resStatus: true,
        data: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DUMMY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/*
   Module - Forgot Password
*/
// verify email -Forgot Password
export const emailVerifiedAction = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EMAIL_VERIFY_FORGOT_PASSWORD })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/forgot-password`, userData).then((response) => {
    // localStorage.setItem('authToken', response.data.Authorization)
    dispatch({
      type: constants.EMAIL_VERIFY_FORGOT_PASSWORD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        authToken: response.data.Authorization,
        isEmailVerified: true
      }
    })
  }).catch((error) => {
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
export const otpVerifiedAction = (userData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_OTP_VERIFICATION_FORGOT_PASSWORD })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/otp-verification`, userData).then((response) => {
    dispatch({
      type: constants.OTP_VERIFICATION_FORGOT_PASSWORD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isOtpVerified: true
      }
    })
  }).catch((error) => {
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

/*
  Get All Grades Data
*/
export const getAllGradesAction = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_GRADES })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/get_all_grade`).then((response) => {
    dispatch({
      type: constants.GET_ALL_GRADES,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        gradesData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_GRADES,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/*
  Get All Countries Data
*/
export const getAllCountriesAction = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_COUNTRIES })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/country/get_all_country`).then((response) => {
    dispatch({
      type: constants.GET_ALL_COUNTRIES,
      payload: {
        resStatus: true,
        // resMessage: response.data.message,
        countriesData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_COUNTRIES,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/*
  Get All States Data
*/
export const getAllStatesAction = (countryid) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_STATES })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/state/get_all_states`, { counrty_id: countryid }).then((response) => {
    dispatch({
      type: constants.GET_ALL_STATES,
      payload: {
        resStatus: true,
        // resMessage: response.data.message,
        statesData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_STATES,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/*
  Get All District Data
*/
export const getAllDistrictAction = (stateid) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_DISTRICTS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/city/get_all_cities`, { state_id: stateid }).then((response) => {
    dispatch({
      type: constants.GET_ALL_DISTRICTS,
      payload: {
        resStatus: true,
        // resMessage: response.data.message,
        districtData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_DISTRICTS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// Get All School data
export const getAllSchoolAction = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_SCHOOL_DETAILS })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/school/get-all-school`).then((response) => {
    dispatch({
      type: constants.GET_ALL_SCHOOL_DETAILS,
      payload: {
        resStatus: true,
        // resMessage: response.data.message,
        schoolDataArray: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_SCHOOL_DETAILS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/*
  Register Student Data
*/
export const studentRegister = (studentData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_SIGNUP_STUDENT })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/register`, studentData).then((response) => {
    dispatch({
      type: constants.SIGNUP_STUDENT,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        studentData: response.data.data,
        isRegistered: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.SIGNUP_STUDENT,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isRegistered: false
      }
    })
  })
}

/*
  Register Email verification
*/
export const emailVerification = (studentData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_SEND_OTP_SIGNUP })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/email-otp-send`, studentData).then((response) => {
    dispatch({
      type: constants.SEND_OTP_SIGNUP,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isEmailAddressVerified: true
      }
    })
  }).catch((error) => {
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

/*
  Register OTP verification
*/
export const otpVerification = (studentData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VERIFY_OTP_SIGNUP })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/email-otp-verify`, studentData).then((response) => {
    dispatch({
      type: constants.VERIFY_OTP_SIGNUP,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isOTPSignupVerified: true
      }
    })
  }).catch((error) => {
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

/*
  Register Email verification
*/
export const mobileVerification = (studentData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_MOBILE_VERIFICATION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/email-otp-send`, studentData).then((response) => {
    dispatch({
      type: constants.MOBILE_VERIFICATION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isMobileOTPVerification: true
      }
    })
  }).catch((error) => {
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

/*
  Register OTP verification
*/
export const mobileOTPVerification = (studentData) => (dispatch) => {
  dispatch({ type: constants.CLEAR_MOBILE_VERIFICATION_OTP_SEND })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/email-otp-verify`, studentData).then((response) => {
    dispatch({
      type: constants.MOBILE_VERIFICATION_OTP_SEND,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isMobileOTPSend: true
      }
    })
  }).catch((error) => {
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

/*
  Logout
*/
export const logoutAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_LOGOUT })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/logout`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.LOGOUT,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isLoggedOut: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.LOGOUT,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message,
        isLoggedOut: false
      }
    })
  })
}

/*
  Get all questions by ID
*/
export const getQuestionsByIDAction = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_QUESTIONS_BY_ID })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/question-of-subcategory`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_QUESTIONS_BY_ID,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        questionsArray: response.data.data,
        alredyGiven: true,
        isLoading: false
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_QUESTIONS_BY_ID,
      payload: {
        resMessage: error?.response?.data?.message,
        resStatus: error?.response?.data?.status,
        alredyGiven: false,
        isLoading: false
      }
    })
  })
}

/*
  Get all questions by ID
*/
export const submitAnswer = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_SUBMIT_OPTION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/question/select-option`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.SUBMIT_OPTION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isAnswerAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.SUBMIT_OPTION,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message || error.message,
        isAnswerAdded: false
      }
    })
  })
}

/*
  Get all questions by ID
*/
export const question = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_QUESTIONS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/question-of-subcategory`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.QUESTIONS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        dataArray: response.data.data,
        alredyGiven: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.QUESTIONS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        alredyGiven: false
      }
    })
  })
}

/*
  Submit Test
*/
export const submitTest = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_FINISH_TEST })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/test/finish`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.FINISH_TEST,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isTestCompleted: true,
        allTestCompleted: response.data.data.all_test_finish,
        isLoading: false
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.FINISH_TEST,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isTestCompleted: false,
        remainingTestIdS: error?.response?.data?.data?.remaining_question_id,
        isLoading: false
      }
    })
  })
}

/*
  Submit Test
*/
export const viewProfileAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VIEW_PROFILE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/student-profile`, {}, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.VIEW_PROFILE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        profileData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.VIEW_PROFILE,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const editProfileAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_UPDATE_PROFILE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/update-profile`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.UPDATE_PROFILE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isProfileEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.UPDATE_PROFILE,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message,
        isProfileEdited: false
      }
    })
  })
}

/*
  Change Password
*/
export const changePasswordAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_CHANGE_PASSWORD })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/change-password`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.CHANGE_PASSWORD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isPasswordChanged: true
      }
    })
  }).catch((error) => {
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
  Get All Boards
*/
export const getAllBoardsAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_BOARDS_DATA })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/board/get-all-board`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_BOARDS_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        boardsDataArray: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_BOARDS_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/*
  Get All Schools
*/
export const getAllSchoolsAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_SCHOOLS })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/school/get-all-school`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_SCHOOLS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        schoolDataArray: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_SCHOOLS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}
