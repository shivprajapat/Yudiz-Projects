import axios from 'axios'
import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'
import {
  ADD_WEB_SERIES_BEGIN,
  ADD_WEB_SERIES_FAILURE,
  ADD_WEB_SERIES_SUCCESS,
  DELETE_WEB_SERIES_BEGIN,
  DELETE_WEB_SERIES_SUCCESS,
  WEB_SERIES_DETAIL_BEGIN,
  WEB_SERIES_DETAIL_FAILURE,
  WEB_SERIES_DETAIL_SUCCESS,
  WEB_SERIES_LIST_BEGIN,
  WEB_SERIES_LIST_FAILURE,
  WEB_SERIES_LIST_SUCCESS,
  WEB_SERIES_UPDATE_BEGIN,
  WEB_SERIES_UPDATE_FAILURE,
  WEB_SERIES_UPDATE_SUCCESS
} from '../constants'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

export const addWebSeriesBegin = () => ({
  type: ADD_WEB_SERIES_BEGIN
})

export const addWebSeriesSuccess = (payload) => ({
  type: ADD_WEB_SERIES_SUCCESS,
  payload
})

export const addWebSeriesFailure = (payload) => ({
  type: ADD_WEB_SERIES_FAILURE,
  payload
})

export const addWebSeries = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(addWebSeriesBegin())
    return axios
      .post(`${process.env.REACT_APP_AUTH_URL}/webSeries/add`, payload, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        dispatch(addWebSeriesSuccess(data))
        SuccessToastNotification(data?.message)
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(addWebSeriesFailure(error?.response?.data?.message))
      })
  }
}

export const webSeriesListBegin = () => ({
  type: WEB_SERIES_LIST_BEGIN
})

export const webSeriesListSuccess = (payload) => ({
  type: WEB_SERIES_LIST_SUCCESS,
  payload
})

export const webSeriesListFailure = (payload) => ({
  type: WEB_SERIES_LIST_FAILURE,
  payload
})

export const getWebSeriesList = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(webSeriesListBegin())
    return axios
      .get(
        `${process.env.REACT_APP_AUTH_URL}/webSeries/list?size=${payload.size}&search=${payload.search}&sort=${payload.sort}&orderBy=${payload.orderBy}&pageNumber=${payload.pageNumber}&eStatus=${payload.eStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}`,
        {
          headers: {
            Authorization: `${token}`
          }
        },
        payload
      )
      .then(({ data }) => {
        dispatch(webSeriesListSuccess(data))
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(webSeriesListFailure(error?.response?.data?.message))
      })
  }
}

export const deleteWebSeriesRequest = () => ({
  type: DELETE_WEB_SERIES_BEGIN
})
export const deleteWebSeriesSuccess = (payload) => {
  return {
    type: DELETE_WEB_SERIES_SUCCESS,
    payload
  }
}

export const deleteWebSeriesAction = (payload, callBack) => {
  return (dispatch) => {
    dispatch(deleteWebSeriesRequest())
    return axios
      .delete(
        `${process.env.REACT_APP_AUTH_URL}/webSeries/${payload}`,

        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then(({ data }) => {
        dispatch(deleteWebSeriesSuccess(payload))
        callBack && callBack(data)
      })
      .catch((error) => {
        FailureToastNotification(error?.message)
      })
  }
}
export const webSeriesUpdateBegin = () => ({
  type: WEB_SERIES_UPDATE_BEGIN
})

export const webSeriesUpdateSuccess = (payload) => ({
  type: WEB_SERIES_UPDATE_SUCCESS,
  payload
})

export const webSeriesUpdateFailure = (payload) => ({
  type: WEB_SERIES_UPDATE_FAILURE,
  payload
})
export const webSeriesUpdate = (id, payload, callBack) => (dispatch) => {
  dispatch(webSeriesUpdateBegin())
  axios
    .put(`${process.env.REACT_APP_AUTH_URL}/webSeries/edit/${id}`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      webSeriesUpdateSuccess(data)
      SuccessToastNotification(data.message)
      callBack && callBack()
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      webSeriesUpdateFailure(error?.response?.data?.message)
    })
}

export const webSeriesDetailBegin = () => ({
  type: WEB_SERIES_DETAIL_BEGIN
})

export const webSeriesDetailSuccess = (payload) => ({
  type: WEB_SERIES_DETAIL_SUCCESS,
  payload
})

export const webSeriesDetailFailure = (payload) => ({
  type: WEB_SERIES_DETAIL_FAILURE,
  payload
})

export const getWebSeriesById = (id) => (dispatch) => {
  dispatch(webSeriesDetailBegin())
  return axios
    .get(`${process.env.REACT_APP_AUTH_URL}/webSeries/view/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(webSeriesDetailSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(webSeriesDetailFailure(error?.response?.data?.message))
    })
}
