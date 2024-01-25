import axios from 'axios'
import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'
import {
  ADD_CAST_BEGIN,
  ADD_CAST_FAILURE,
  ADD_CAST_SUCCESS,
  CAST_DETAIL_BEGIN,
  CAST_DETAIL_FAILURE,
  CAST_DETAIL_SUCCESS,
  CAST_DROPDOWN_BEGIN,
  CAST_DROPDOWN_FAILURE,
  CAST_DROPDOWN_SUCCESS,
  CAST_LIST_BEGIN,
  CAST_LIST_FAILURE,
  CAST_LIST_SUCCESS,
  DELETE_CAST_BEGIN,
  DELETE_CAST_SUCCESS
} from '../constants'

// const token = userData().sToken
const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

export const addCastBegin = () => ({
  type: ADD_CAST_BEGIN
})

export const addCastSuccess = (payload) => ({
  type: ADD_CAST_SUCCESS,
  payload
})

export const addCastFailure = (payload) => ({
  type: ADD_CAST_FAILURE,
  payload
})

export const addCast = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(addCastBegin())
    return axios
      .post(`${process.env.REACT_APP_AUTH_URL}/cast/add`, payload, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        dispatch(addCastSuccess(data))
        SuccessToastNotification(data?.message)
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(addCastFailure(error?.response?.data?.message))
      })
  }
}

export const castListBegin = () => ({
  type: CAST_LIST_BEGIN
})

export const castListSuccess = (payload) => ({
  type: CAST_LIST_SUCCESS,
  payload
})

export const castListFailure = (payload) => ({
  type: CAST_LIST_FAILURE,
  payload
})

export const getCastList = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(castListBegin())
    return axios
      .get(
        `${process.env.REACT_APP_AUTH_URL}/cast/list?size=${payload.size}&search=${payload.search}&sort=${payload.sort}&orderBy=${payload.orderBy}&pageNumber=${payload.pageNumber}&eStatus=${payload.eStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}`,
        {
          headers: {
            Authorization: `${token}`
          }
        },
        payload
      )
      .then(({ data }) => {
        dispatch(castListSuccess(data))
        callBack && callBack(data?.data)
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(castListFailure(error?.response?.data?.message))
      })
  }
}

export const deleteCastRequest = () => ({
  type: DELETE_CAST_BEGIN
})
export const deleteCastSuccess = (payload) => {
  return {
    type: DELETE_CAST_SUCCESS,
    payload
  }
}

export const deleteCastAction = (payload, callback) => {
  return (dispatch) => {
    dispatch(deleteCastRequest())
    return axios
      .delete(
        `${process.env.REACT_APP_AUTH_URL}/cast/${payload}`,

        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then(({ data }) => {
        dispatch(deleteCastSuccess(payload))
        callback(data)
      })
      .catch((error) => {
        FailureToastNotification(error?.message)
      })
  }
}
export const castUpdate = (id, payload, callBack) => (dispatch) => {
  axios
    .put(`${process.env.REACT_APP_AUTH_URL}/cast/${id}`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      SuccessToastNotification(data.message)
      callBack && callBack()
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
    })
}

export const castDetailBegin = () => ({
  type: CAST_DETAIL_BEGIN
})

export const castDetailSuccess = (payload) => ({
  type: CAST_DETAIL_SUCCESS,
  payload
})

export const castDetailFailure = (payload) => ({
  type: CAST_DETAIL_FAILURE,
  payload
})

export const getCastById = (id) => (dispatch) => {
  dispatch(castDetailBegin())
  return axios
    .get(`${process.env.REACT_APP_AUTH_URL}/cast/view/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(castDetailSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(castDetailFailure(error?.response?.data?.message))
    })
}
export const castDropDownBegin = () => ({
  type: CAST_DROPDOWN_BEGIN
})

export const castDropDownSuccess = (payload) => ({
  type: CAST_DROPDOWN_SUCCESS,
  payload
})

export const castDropDownFailure = (payload) => ({
  type: CAST_DROPDOWN_FAILURE,
  payload
})

export const getCastDropDown = () => (dispatch) => {
  dispatch(castDropDownBegin())
  axios
    .get(`${process.env.REACT_APP_AUTH_URL}/dropDown/cast`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(castDropDownSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.message)
      dispatch(castDropDownFailure(error?.message))
    })
}
