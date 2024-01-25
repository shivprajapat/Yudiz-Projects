import axios from 'axios'
import constants from '../../Shared/Types/constants'

/* Get School Functionality */
export const getAllSession = (start, limit, sorting, sessionStatus, search, token, adminType) => (dispatch) => {
  const data = {
    start,
    limit,
    sorting,
    sessionStatus,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_SESSION_DATA_ADMIN })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/sessions`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_SESSION_DATA_ADMIN,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        sessionDataArray: response.data.data.rows,
        sessionCount: response.data.data.count
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_SESSION_DATA_ADMIN,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const viewDetailsSession = (data, token, adminType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_DETAILED_VIEW_SESSION_ADMIN })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/session`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_DETAILED_VIEW_SESSION_ADMIN,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        sessionDetails: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_DETAILED_VIEW_SESSION_ADMIN,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}
