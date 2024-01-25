import axios from '../../../axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  ORDER_PAYMENT,
  CLEAR_ORDER_PAYMENT_RESPONSE,
  CLEAR_ORDER_CREATION_RESPONSE,
  CLEAR_ORDER_UPDATE_RESPONSE,
  CLEAR_PENDING_ORDER_RESPONSE,
  ORDER_CREATION,
  ORDER_UPDATE,
  PENDING_ORDER
} from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { setParamsForGetRequest } from 'shared/utils'

const errMsg = 'Server is unavailable.'

export const orderCreation = (payload, callBack) => (dispatch) => {
  dispatch({ type: CLEAR_ORDER_CREATION_RESPONSE })
  axios
    .post(apiPaths.order, payload)
    .then(({ data }) => {
      dispatch({
        type: ORDER_CREATION,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callBack && callBack()
    })
    .catch((error) => {
      dispatch({
        type: ORDER_CREATION,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response.data.message,
          type: TOAST_TYPE.Error
        }
      })
    })
}

export const orderUpdate = (id, payload, callBack) => (dispatch) => {
  dispatch({ type: CLEAR_ORDER_UPDATE_RESPONSE })
  axios
    .put(apiPaths.order + '/' + id, payload)
    .then(({ data }) => {
      dispatch({
        type: ORDER_UPDATE,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callBack && callBack()
    })
    .catch((error) => {
      dispatch({
        type: ORDER_CREATION,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response.data.message,
          type: TOAST_TYPE.Error
        }
      })
    })
}

export const orderPayment = (id, payload, callBack) => (dispatch) => {
  dispatch({ type: CLEAR_ORDER_PAYMENT_RESPONSE })
  axios
    .post(apiPaths.orderPayment + '/' + id, payload)
    .then(({ data }) => {
      dispatch({
        type: ORDER_PAYMENT,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          orderPayment: true
        }
      })
      callBack && callBack()
    })
    .catch((error) => {
      dispatch({
        type: ORDER_PAYMENT,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          orderPayment: false
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response ? error.response.data.message : errMsg,
          type: TOAST_TYPE.Error
        }
      })
    })
}

export const getPendingOrder = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_PENDING_ORDER_RESPONSE })
  axios
    .get(`${apiPaths.order}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: PENDING_ORDER,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: PENDING_ORDER,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response.data.message,
          type: TOAST_TYPE.Error
        }
      })
    })
}
