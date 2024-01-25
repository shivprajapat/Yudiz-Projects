
import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const getAllSessionList = (start, limit, sorting, sessionStatus, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sorting,
    sessionStatus,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_SESSIONS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/sessions`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_SESSIONS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        sessionList: response.data.data.rows,
        count: response.data.data.count
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_SESSIONS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const acceptRejectAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ACCEPTREJECTSESSION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/session/accept-reject`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ACCEPTREJECTSESSION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isAcceptReject: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ACCEPTREJECTSESSION,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isAcceptReject: false
      }
    })
  })
}

export const viewDetailsAction = (data, token, adminType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_DETAILED_VIEW_SESSION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/session`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_DETAILED_VIEW_SESSION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        sessionDetails: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_DETAILED_VIEW_SESSION,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const rescheduleSessionAction = (data, token, adminType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_COUNSELLOR_RESCHEDULE_SESSION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/session/reschedule`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.COUNSELLOR_RESCHEDULE_SESSION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isSessionReschdule: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.COUNSELLOR_RESCHEDULE_SESSION,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSessionReschdule: false
      }
    })
  })
}

export const cancelSessionAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_COUNSELLOR_RESCHEDULE_SESSION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/session/cancel`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.COUNSELLOR_CANCEL_SESSION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isSessionCancel: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.COUNSELLOR_CANCEL_SESSION,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSessionCancel: false
      }
    })
  })
}

// Report
export const report = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_REPORT_SESSION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/session/report`, data
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

// Report
export const sessionCompleted = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_COMPLETED_SESSION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/session/complete`, data
    , { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.COMPLETED_SESSION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isCompleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.COMPLETED_SESSION,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message,
        isCompleted: false
      }
    })
  })
}
