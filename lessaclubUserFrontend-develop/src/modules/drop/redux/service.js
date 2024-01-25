import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'

import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { setParamsForGetRequest } from 'shared/utils'
import {
  CLEAR_CREATE_DROP_RESPONSE,
  CLEAR_GET_DROP_LIST_RESPONSE,
  CLEAR_UPDATE_DROP_RESPONSE,
  CREATE_DROP,
  GET_DROP_LIST,
  UPDATE_DROP
} from './action'
import { CLEAR_ASSET_UPLOAD_RESPONSE } from 'modules/assets/redux/action'

const errMsg = 'Server is unavailable.'

export const getDrops = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_GET_DROP_LIST_RESPONSE })
  axios
    .get(payload ? `${apiPaths.drop}${setParamsForGetRequest(payload)}` : apiPaths.drop)
    .then(({ data }) => {
      dispatch({
        type: GET_DROP_LIST,
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
        type: GET_DROP_LIST,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const createDrop = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_CREATE_DROP_RESPONSE })
  axios
    .post(apiPaths.drop, payload)
    .then(({ data }) => {
      dispatch({ type: CLEAR_ASSET_UPLOAD_RESPONSE })
      dispatch({
        type: CREATE_DROP,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch(getDrops({ page: 1, perPage: 12, isExpired: false }))
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
        type: CREATE_DROP,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
export const updateDrop = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_UPDATE_DROP_RESPONSE })
  axios
    .put(apiPaths.drop, payload)
    .then(({ data }) => {
      dispatch({ type: CLEAR_ASSET_UPLOAD_RESPONSE })
      dispatch({
        type: UPDATE_DROP,
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
        type: UPDATE_DROP,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
