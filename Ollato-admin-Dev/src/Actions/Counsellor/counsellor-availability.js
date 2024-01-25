
import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const getAllCounsellorList = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_COUNSELLOR_LIST })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/availability/get-all-available-counselor`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_COUNSELLOR_LIST,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        counsellorList: response.data.data.rows,
        count: response.data.data.count
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_COUNSELLOR_LIST,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getAllTimeSlotData = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_TIMESLOTS })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/time-slots`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_TIMESLOTS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        timeSlotData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_TIMESLOTS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const setAvailability = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_SET_AVAILABILITY })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/availability/set-counsellor`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.SET_AVAILABILITY,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isAvailability: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.SET_AVAILABILITY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isAvailability: false
      }
    })
  })
}

export const viewAvailability = (data, token, adminType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_AVAILABLE_BY_ID })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/availability/get-by-id`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_AVAILABLE_BY_ID,
      payload: {
        resStatus: true,
        // resMessage: response.data.message,
        availableData: response?.data,
        isCounsellorAvailable: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_AVAILABLE_BY_ID,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCounsellorAvailable: false
      }
    })
  })
}

export const editAvailability = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_AVAILABILITY })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/availability/update-counsellor`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_AVAILABILITY,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isAvailableEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_AVAILABILITY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isAvailableEdited: false
      }
    })
  })
}

export const deleteAvailability = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_AVAILABILITY })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/counsellor/availability/delete`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_AVAILABILITY,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isAvailableDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_AVAILABILITY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isAvailableDeleted: false
      }
    })
  })
}
