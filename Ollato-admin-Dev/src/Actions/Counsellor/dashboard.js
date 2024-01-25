
import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const getDashboardDataAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_COUNSELLOR_DASHBOARD })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/dashboard`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_COUNSELLOR_DASHBOARD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        dashboardData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_COUNSELLOR_DASHBOARD,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getCounsellorDataAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VIEW_COUNSELLOR_DETAILS })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/get-counsellor`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.VIEW_COUNSELLOR_DETAILS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        counsellorData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.VIEW_COUNSELLOR_DETAILS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const counsellorChangePasswordAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_COUNSELLOR_CHANGE_PASSWORD })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/settings/change-password`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.COUNSELLOR_CHANGE_PASSWORD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isPasswordChanged: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.COUNSELLOR_CHANGE_PASSWORD,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isPasswordChanged: false
      }
    })
  })
}

export const reportDownloadStudentAction = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_COUNSELLOR_DOWNLOAD_REPORT })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/test-report/${id}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.COUNSELLOR_DOWNLOAD_REPORT,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isPasswordChanged: true,
        downloadReportLink: response.data.data.report_path,
        isReportDownloaded: false
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.COUNSELLOR_DOWNLOAD_REPORT,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isPasswordChanged: false,
        isReportDownloaded: false
      }
    })
  })
}

export const getAllIssueCatgoriesAction = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ISSUE_CATEGORY })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/settings/get-all-issue-category`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ISSUE_CATEGORY,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        getIssueCategory: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ISSUE_CATEGORY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const supportAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_SUPPORT })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/settings/counsellor-support`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.SUPPORT,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isQueryReported: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.SUPPORT,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isQueryReported: false
      }
    })
  })
}

export const editCounsellorProfileAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_COUNSELLOR_PROFILE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/update`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_COUNSELLOR_PROFILE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isProfileUpdated: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_COUNSELLOR_PROFILE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isProfileUpdated: false
      }
    })
  })
}

export const getSlotsDataAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_SLOTS_DATA })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/availability/time-slots-after-current-time`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_SLOTS_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        allSlotsData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_SLOTS_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}
