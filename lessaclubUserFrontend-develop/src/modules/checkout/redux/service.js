import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  ORDER_PAYMENT,
  CLEAR_ORDER_PAYMENT_RESPONSE,
  CLEAR_ORDER_CREATION_RESPONSE,
  CLEAR_ORDER_UPDATE_RESPONSE,
  CLEAR_PENDING_ORDER_RESPONSE,
  ORDER_CREATION,
  ORDER_UPDATE,
  PENDING_ORDER,
  STOCK_AVAILABILITY,
  CLEAR_STOCK_AVAILABILITY_RESPONSE,
  REFERRAL_DISCOUNT,
  CLEAR_REFERRAL_DISCOUNT_RESPONSE
} from './action'
import { setParamsForGetRequest } from 'shared/utils'

const errMsg = 'Server is unavailable.'

export const orderCreation = (payload, callback) => (dispatch) => {
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
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: ORDER_CREATION,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const orderUpdate = (id, payload, callback) => (dispatch) => {
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
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: ORDER_CREATION,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const orderPayment = (id, payload, callback) => (dispatch) => {
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
      callback && callback()
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
      callback && callback()
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
    })
}

export const checkStockAvailability = (id) => (dispatch) => {
  dispatch({ type: CLEAR_STOCK_AVAILABILITY_RESPONSE })
  axios
    .get(`${apiPaths.assetShow}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: STOCK_AVAILABILITY,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: STOCK_AVAILABILITY,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getReferralDiscount = (id, payload) => (dispatch) => {
  dispatch({ type: CLEAR_REFERRAL_DISCOUNT_RESPONSE })
  axios
    .get(`${apiPaths.referralDiscount}/${id}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: REFERRAL_DISCOUNT,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: REFERRAL_DISCOUNT,
        payload: {
          data: {},
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
