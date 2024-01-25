// ** add-genre

import axios from 'axios'
import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'
import {
  ADD_GENRE_BEGIN,
  ADD_GENRE_FAILURE,
  ADD_GENRE_SUCCESS,
  DELETE_GENRE_BEGIN,
  DELETE_GENRE_SUCCESS,
  GENRE_DETAIL_BEGIN,
  GENRE_DETAIL_FAILURE,
  GENRE_DETAIL_SUCCESS,
  GENRE_DROPDOWN_BEGIN,
  GENRE_DROPDOWN_FAILURE,
  GENRE_DROPDOWN_SUCCESS,
  GENRE_LIST_BEGIN,
  GENRE_LIST_FAILURE,
  GENRE_LIST_SUCCESS,
  GENRE_UPDATE_BEGIN,
  GENRE_UPDATE_FAILURE,
  GENRE_UPDATE_SUCCESS
} from '../constants'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

export const addGenreBegin = () => ({
  type: ADD_GENRE_BEGIN
})

export const addGenreSuccess = (payload) => ({
  type: ADD_GENRE_SUCCESS,
  payload
})

export const addGenreFailure = (payload) => ({
  type: ADD_GENRE_FAILURE,
  payload
})

export const addGenre = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(addGenreBegin())
    return axios
      .post(`${process.env.REACT_APP_AUTH_URL}/genre/add`, payload, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        dispatch(addGenreSuccess(data))
        SuccessToastNotification(data?.message)
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(addGenreFailure(error?.response?.data?.message))
      })
  }
}

export const genreListBegin = () => ({
  type: GENRE_LIST_BEGIN
})

export const genreListSuccess = (payload) => ({
  type: GENRE_LIST_SUCCESS,
  payload
})

export const genreListFailure = (payload) => ({
  type: GENRE_LIST_FAILURE,
  payload
})

export const getGenreList = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(genreListBegin())
    return axios
      .get(
        `${process.env.REACT_APP_AUTH_URL}/genre/list?size=${payload.size}&search=${payload.search}&sort=${payload.sort}&orderBy=${payload.orderBy}&pageNumber=${payload.pageNumber}&eStatus=${payload.eStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}`,
        {
          headers: {
            Authorization: `${token}`
          }
        },
        payload
      )
      .then(({ data }) => {
        dispatch(genreListSuccess(data))
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(genreListFailure(error?.response?.data?.message))
      })
  }
}

export const deleteGenreRequest = () => ({
  type: DELETE_GENRE_BEGIN
})
export const deleteGenreSuccess = (payload) => {
  return {
    type: DELETE_GENRE_SUCCESS,
    payload
  }
}

export const deleteGenreAction = (payload, callBack) => {
  return (dispatch) => {
    dispatch(deleteGenreRequest())
    return axios
      .delete(
        `${process.env.REACT_APP_AUTH_URL}/genre/${payload}`,

        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then(({ data }) => {
        dispatch(deleteGenreSuccess(payload))
        callBack && callBack(data)
      })
      .catch((error) => {
        FailureToastNotification(error?.message)
      })
  }
}
export const genreUpdateBegin = () => ({
  type: GENRE_UPDATE_BEGIN
})

export const genreUpdateSuccess = (payload) => ({
  type: GENRE_UPDATE_SUCCESS,
  payload
})

export const genreUpdateFailure = (payload) => ({
  type: GENRE_UPDATE_FAILURE,
  payload
})
export const genreUpdate = (id, payload, callBack) => (dispatch) => {
  dispatch(genreUpdateBegin())
  axios
    .put(`${process.env.REACT_APP_AUTH_URL}/genre/${id}`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      genreUpdateSuccess(data)
      SuccessToastNotification(data.message)
      callBack && callBack()
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      genreUpdateFailure(error?.response?.data?.message)
    })
}

export const genreDetailBegin = () => ({
  type: GENRE_DETAIL_BEGIN
})

export const genreDetailSuccess = (payload) => ({
  type: GENRE_DETAIL_SUCCESS,
  payload
})

export const genreDetailFailure = (payload) => ({
  type: GENRE_DETAIL_FAILURE,
  payload
})

export const getGenreById = (id) => (dispatch) => {
  dispatch(genreDetailBegin())
  return axios
    .get(`${process.env.REACT_APP_AUTH_URL}/genre/view/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(genreDetailSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(genreDetailFailure(error?.response?.data?.message))
    })
}

export const genreDropDownBegin = () => ({
  type: GENRE_DROPDOWN_BEGIN
})

export const genreDropDownSuccess = (payload) => ({
  type: GENRE_DROPDOWN_SUCCESS,
  payload
})

export const genreDropDownFailure = (payload) => ({
  type: GENRE_DROPDOWN_FAILURE,
  payload
})

export const getGenreDropDown = () => (dispatch) => {
  dispatch(genreDropDownBegin())
  axios
    .get(`${process.env.REACT_APP_AUTH_URL}/dropDown/genre`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(genreDropDownSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.message)
      dispatch(genreDropDownFailure(error?.message))
    })
}
