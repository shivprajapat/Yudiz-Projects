import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { CLEAR_PAYMENT_MESSAGE, PAYMENT_DETAILS, PAYMENT_LIST, UPDATE_PAYMENT } from './constants'

export const getPaymentList = (start, limit, sort, order, search, token) => async (dispatch) => {
  await axios.get(`/payment-option/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PAYMENT_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PAYMENT_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPaymentDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/payment-option/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PAYMENT_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PAYMENT_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const updatePayment = (updatePaymentData) => async (dispatch) => {
  const { PaymentId, Offer, Name, Key, PaymentStatus, Order, PaymentImage, token } = updatePaymentData
  dispatch({ type: CLEAR_PAYMENT_MESSAGE })
  try {
    if (PaymentImage && PaymentImage.file) {
      const response = await axios.post('/payment-option/pre-signed-url/v1', { sFileName: PaymentImage.file.name, sContentType: PaymentImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, PaymentImage.file, { headers: { 'Content-Type': PaymentImage.file.type } })
      await axios.put(`/payment-option/${PaymentId}/v1`, {
        sOffer: Offer, sName: Name, eKey: Key, nOrder: Order, bEnable: PaymentStatus, sImage
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch(successFunc(UPDATE_PAYMENT, response2))
      })
    } else {
      await axios.put(`/payment-option/${PaymentId}/v1`, {
        sOffer: Offer, sName: Name, eKey: Key, nOrder: Order, bEnable: PaymentStatus, sImage: PaymentImage
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch(successFunc(UPDATE_PAYMENT, response))
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_PAYMENT, error))
  }
}
