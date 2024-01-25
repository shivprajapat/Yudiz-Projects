import axios from 'axios'
import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'
import {
  ADD_EPISODE_BEGIN,
  ADD_EPISODE_FAILURE,
  ADD_EPISODE_SUCCESS,
  DELETE_EPISODE_BEGIN,
  DELETE_EPISODE_SUCCESS,
  EPISODE_DETAIL_BEGIN,
  EPISODE_DETAIL_FAILURE,
  EPISODE_DETAIL_SUCCESS,
  EPISODE_LIST_BEGIN,
  EPISODE_LIST_FAILURE,
  EPISODE_LIST_SUCCESS,
  EPISODE_UPDATE_BEGIN,
  EPISODE_UPDATE_FAILURE,
  EPISODE_UPDATE_SUCCESS
} from '../constants'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

export const addEpisodeBegin = () => ({
  type: ADD_EPISODE_BEGIN
})

export const addEpisodeSuccess = (payload) => ({
  type: ADD_EPISODE_SUCCESS,
  payload
})

export const addEpisodeFailure = (payload) => ({
  type: ADD_EPISODE_FAILURE,
  payload
})

export const addEpisode = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(addEpisodeBegin())
    return axios
      .post(`${process.env.REACT_APP_AUTH_URL}/episode/add`, payload, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        dispatch(addEpisodeSuccess(data))
        SuccessToastNotification(data?.message)
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(addEpisodeFailure(error?.response?.data?.message))
      })
  }
}

export const episodeListBegin = () => ({
  type: EPISODE_LIST_BEGIN
})

export const episodeListSuccess = (payload) => ({
  type: EPISODE_LIST_SUCCESS,
  payload
})

export const episodeListFailure = (payload) => ({
  type: EPISODE_LIST_FAILURE,
  payload
})

export const getEpisodeList = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(episodeListBegin())
    return axios
      .get(
        `${process.env.REACT_APP_AUTH_URL}/episode/list?size=${payload.size}&search=${payload.search}&sort=${payload.sort}&orderBy=${payload.orderBy}&pageNumber=${payload.pageNumber}&eStatus=${payload.eStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}`,
        {
          headers: {
            Authorization: `${token}`
          }
        },
        payload
      )
      .then(({ data }) => {
        dispatch(episodeListSuccess(data))
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(episodeListFailure(error?.response?.data?.message))
      })
  }
}

export const deleteEpisodeRequest = () => ({
  type: DELETE_EPISODE_BEGIN
})
export const deleteEpisodeSuccess = (payload) => {
  return {
    type: DELETE_EPISODE_SUCCESS,
    payload
  }
}

export const deleteEpisodeAction = (payload, callBack) => {
  return (dispatch) => {
    dispatch(deleteEpisodeRequest())
    return axios
      .delete(
        `${process.env.REACT_APP_AUTH_URL}/episode/${payload}`,

        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then(({ data }) => {
        dispatch(deleteEpisodeSuccess(payload))
        callBack && callBack(data)
      })
      .catch((error) => {
        FailureToastNotification(error?.message)
      })
  }
}
export const episodeUpdateBegin = () => ({
  type: EPISODE_UPDATE_BEGIN
})

export const episodeUpdateSuccess = (payload) => ({
  type: EPISODE_UPDATE_SUCCESS,
  payload
})

export const episodeUpdateFailure = (payload) => ({
  type: EPISODE_UPDATE_FAILURE,
  payload
})
export const episodeUpdate = (id, payload, callBack) => (dispatch) => {
  dispatch(episodeUpdateBegin())
  axios
    .put(`${process.env.REACT_APP_AUTH_URL}/episode/edit/${id}`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      episodeUpdateSuccess(data)
      SuccessToastNotification(data.message)
      callBack && callBack()
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      episodeUpdateFailure(error?.response?.data?.message)
    })
}

export const episodeDetailBegin = () => ({
  type: EPISODE_DETAIL_BEGIN
})

export const episodeDetailSuccess = (payload) => ({
  type: EPISODE_DETAIL_SUCCESS,
  payload
})

export const episodeDetailFailure = (payload) => ({
  type: EPISODE_DETAIL_FAILURE,
  payload
})

export const getEpisodeById = (id) => (dispatch) => {
  dispatch(episodeDetailBegin())
  return axios
    .get(`${process.env.REACT_APP_AUTH_URL}/episode/view/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(episodeDetailSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(episodeDetailFailure(error?.response?.data?.message))
    })
}
