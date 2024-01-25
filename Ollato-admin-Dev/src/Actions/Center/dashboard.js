import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const DashBoardData = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_CENTER_DASHBOARD_DATA })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/dashboard`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_CENTER_DASHBOARD_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        centerDashData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_CENTER_DASHBOARD_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/*
  Submit Test
*/
export const viewCenterProfile = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VIEW_CENTER_PROFILE })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/get-center-detail`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.VIEW_CENTER_PROFILE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        profileData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.VIEW_CENTER_PROFILE,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const editProfileCenter = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_UPDATE_CENTER_PROFILE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/update-center-detail`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.UPDATE_CENTER_PROFILE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isProfileEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.UPDATE_CENTER_PROFILE,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message,
        isProfileEdited: false
      }
    })
  })
}
