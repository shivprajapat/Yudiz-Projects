import axios from 'axios'
import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'
import {
  ADD_MOVIE_BEGIN,
  ADD_MOVIE_FAILURE,
  ADD_MOVIE_SUCCESS,
  DELETE_MOVIE_BEGIN,
  DELETE_MOVIE_SUCCESS,
  MOVIE_DETAIL_BEGIN,
  MOVIE_DETAIL_FAILURE,
  MOVIE_DETAIL_SUCCESS,
  MOVIE_LIST_BEGIN,
  MOVIE_LIST_FAILURE,
  MOVIE_LIST_SUCCESS,
  MOVIE_UPDATE_BEGIN,
  MOVIE_UPDATE_FAILURE,
  MOVIE_UPDATE_SUCCESS
} from '../constants'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

export const addMovieBegin = () => ({
  type: ADD_MOVIE_BEGIN
})

export const addMovieSuccess = (payload) => ({
  type: ADD_MOVIE_SUCCESS,
  payload
})

export const addMovieFailure = (payload) => ({
  type: ADD_MOVIE_FAILURE,
  payload
})

export const addMovie = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(addMovieBegin())
    return axios
      .post(`${process.env.REACT_APP_AUTH_URL}/movie/add`, payload, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        dispatch(addMovieSuccess(data))
        SuccessToastNotification(data?.message)
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(addMovieFailure(error?.response?.data?.message))
      })
  }
}

export const movieListBegin = () => ({
  type: MOVIE_LIST_BEGIN
})

export const movieListSuccess = (payload) => ({
  type: MOVIE_LIST_SUCCESS,
  payload
})

export const movieListFailure = (payload) => ({
  type: MOVIE_LIST_FAILURE,
  payload
})

export const getMovieList = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(movieListBegin())
    return axios
      .get(
        `${process.env.REACT_APP_AUTH_URL}/movie/list?size=${payload.size}&search=${payload.search}&sort=${payload.sort}&orderBy=${payload.orderBy}&pageNumber=${payload.pageNumber}&eStatus=${payload.eStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}`,
        {
          headers: {
            Authorization: `${token}`
          }
        },
        payload
      )
      .then(({ data }) => {
        dispatch(movieListSuccess(data))
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(movieListFailure(error?.response?.data?.message))
      })
  }
}

export const deleteMovieRequest = () => ({
  type: DELETE_MOVIE_BEGIN
})
export const deleteMovieSuccess = (payload) => {
  return {
    type: DELETE_MOVIE_SUCCESS,
    payload
  }
}

export const deleteMovieAction = (payload, callBack) => {
  return (dispatch) => {
    dispatch(deleteMovieRequest())
    return axios
      .delete(
        `${process.env.REACT_APP_AUTH_URL}/movie/${payload}`,

        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then(({ data }) => {
        dispatch(deleteMovieSuccess(payload))
        SuccessToastNotification(data.message)
        callBack && callBack(data)
      })
      .catch((error) => {
        FailureToastNotification(error?.message)
      })
  }
}
export const movieUpdateBegin = () => ({
  type: MOVIE_UPDATE_BEGIN
})

export const movieUpdateSuccess = (payload) => ({
  type: MOVIE_UPDATE_SUCCESS,
  payload
})

export const movieUpdateFailure = (payload) => ({
  type: MOVIE_UPDATE_FAILURE,
  payload
})
export const movieUpdate = (id, payload, callBack) => (dispatch) => {
  dispatch(movieUpdateBegin())
  axios
    .put(`${process.env.REACT_APP_AUTH_URL}/movie/edit/${id}`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      movieUpdateSuccess(data)
      SuccessToastNotification(data.message)
      callBack && callBack()
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      movieUpdateFailure(error?.response?.data?.message)
    })
}

export const movieDetailBegin = () => ({
  type: MOVIE_DETAIL_BEGIN
})

export const movieDetailSuccess = (payload) => ({
  type: MOVIE_DETAIL_SUCCESS,
  payload
})

export const movieDetailFailure = (payload) => ({
  type: MOVIE_DETAIL_FAILURE,
  payload
})

export const getMovieById = (id) => (dispatch) => {
  dispatch(movieDetailBegin())
  return axios
    .get(`${process.env.REACT_APP_AUTH_URL}/movie/view/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(movieDetailSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(movieDetailFailure(error?.response?.data?.message))
    })
}
