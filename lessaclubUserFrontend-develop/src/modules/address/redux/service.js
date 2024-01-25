import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { setParamsForGetRequest } from 'shared/utils'
import {
  ADD_ADDRESS,
  CLEAR_ADD_ADDRESS_RESPONSE,
  CLEAR_DELETE_ADDRESS_RESPONSE,
  CLEAR_GET_ADDRESSES_RESPONSE,
  CLEAR_UPDATE_ADDRESS_RESPONSE,
  DELETE_ADDRESS,
  GET_ADDRESS,
  UPDATE_ADDRESS
} from './action'

const errMsg = 'Server is unavailable.'

export const getAddress = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_GET_ADDRESSES_RESPONSE })
  axios
    .get(`${apiPaths.address}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ADDRESS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: GET_ADDRESS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const addAddress = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_ADD_ADDRESS_RESPONSE })
  axios
    .post(apiPaths.address, payload)
    .then(({ data }) => {
      callback && callback()
      dispatch({
        type: ADD_ADDRESS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: ADD_ADDRESS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const updateAddress = (id, payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_UPDATE_ADDRESS_RESPONSE })
  axios
    .put(apiPaths.address + '/' + id, payload)
    .then(({ data }) => {
      callback && callback()
      dispatch({
        type: UPDATE_ADDRESS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UPDATE_ADDRESS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const deleteAddress = (id, callback) => (dispatch) => {
  dispatch({ type: CLEAR_DELETE_ADDRESS_RESPONSE })
  axios
    .delete(apiPaths.address + '/' + id)
    .then(({ data }) => {
      dispatch({
        type: DELETE_ADDRESS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callback && callback()
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: DELETE_ADDRESS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
