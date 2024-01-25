// ** add-user

import axios from 'axios'

import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'
import {
  USER_LIST_BEGIN,
  USER_LIST_FAILURE,
  USER_LIST_SUCCESS,
  USER_UPDATE_BEGIN,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAILURE
} from '../constants'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

export const UserListBegin = () => ({
  type: USER_LIST_BEGIN
})

export const UserListSuccess = (payload) => ({
  type: USER_LIST_SUCCESS,
  payload
})

export const UserListFailure = (payload) => ({
  type: USER_LIST_FAILURE,
  payload
})

export const UserUpdateBegin = (payload) => ({
  type: USER_UPDATE_BEGIN
})

export const UserUpdateSuccess = (payload) => ({
  type: USER_UPDATE_SUCCESS,
  payload
})

export const UserUpdateFailure = (payload) => ({
  type: USER_UPDATE_FAILURE,
  payload
})

export const getUserList = (payload, callback) => (dispatch) => {
  dispatch(UserListBegin())
  return axios
    .get(
      `${process.env.REACT_APP_AUTH_URL}/user/list?size=${payload.size}&search=${payload.search}&sort=${payload.sort}&orderBy=${payload.orderBy}&pageNumber=${payload.pageNumber}&eStatus=${payload.eStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}`,
      {
        headers: {
          Authorization: `${token}`
        }
      },
      payload
    )
    .then(({ data }) => {
      dispatch(UserListSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(UserListFailure(error?.response?.data?.message))
    })
}

export const UserUpdate = (id, payload) => (dispatch) => {
  dispatch(UserUpdateBegin())
  axios
    .put(`${process.env.REACT_APP_AUTH_URL}/user/edit/${id}`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(UserUpdateSuccess(data))
      SuccessToastNotification(data.message)
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(UserUpdateFailure(error?.response?.data?.message))
    })
}
