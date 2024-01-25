
import axios from 'axios'
import constants from '../Shared/Types/constants'

// Available Slots
export const getAllAvailableSlots = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_AVAILABLE_SLOTS })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/time-slots`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_AVAILABLE_SLOTS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        availableSlots: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_AVAILABLE_SLOTS,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// Counsellor Data
export const getAllCounsellorData = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_FILTERED_COUNSELLOR })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/get-filtered-counsellors`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_FILTERED_COUNSELLOR,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        counsellorData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_FILTERED_COUNSELLOR,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// Session History Data
export const getSessionsHistory = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_SESSION_HISTORY })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/get-sessions`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_SESSION_HISTORY,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        sessionHistoryData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_SESSION_HISTORY,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// CounsellorDetails
export const getCounsellorDetails = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_COUNSELLOR_DETAILS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/get-counsellor`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_COUNSELLOR_DETAILS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        counsellorDetails: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_COUNSELLOR_DETAILS,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// Counsellor Avialble Solts
export const getCounsellorAvailableSlots = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_COUNSELLOR_AVAILABLE_SLOTS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/get-available-counsellor`, data, { headers: { Authorization: token } }).then((response) => {
    console.log('second called')

    dispatch({
      type: constants.GET_ALL_COUNSELLOR_AVAILABLE_SLOTS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        counsellorAvailableSlots: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_COUNSELLOR_AVAILABLE_SLOTS,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// book session
export const bookSession = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_BOOK_SESSION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/session/book`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.BOOK_SESSION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isSessionBooked: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.BOOK_SESSION,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message,
        isSessionBooked: false
      }
    })
  })
}

// Session Details
export const getSessionDetails = (data, token) => (dispatch) => {
  const dataObject = {
    sessionId: data?.id
  }
  dispatch({ type: constants.CLEAR_SESSION_DETAILS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/counsellor/session`, dataObject
    , { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.SESSION_DETAILS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        sessionDetails: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.SESSION_DETAILS,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// Session Details
export const sessionReschedule = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_COUNSELLOR_RESCHEDULE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/reschedule-session`, data
    , { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.COUNSELLOR_RESCHEDULE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isReschedule: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.COUNSELLOR_RESCHEDULE,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message,
        isReschedule: false
      }
    })
  })
}

// Session Details
export const sessionCancel = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_CANCEL_SESSION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/cancel-session`, data
    , { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.CANCEL_SESSION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isCancel: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.CANCEL_SESSION,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message,
        isCancel: false
      }
    })
  })
}

// Report
export const report = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_REPORT_SESSION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/session/report`, data
    , { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.REPORT_SESSION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isReported: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.REPORT_SESSION,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message,
        isReported: false
      }
    })
  })
}

// Ratings
export const ratings = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_RATINGS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/session/ratings`, data
    , { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.RATINGS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isRated: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.RATINGS,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message,
        isRated: false
      }
    })
  })
}
