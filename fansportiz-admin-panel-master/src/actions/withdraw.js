import axios from '../axios'
import { CLEAR_WITHDRAW_MESSAGE, UPDATE_WITHDRAW_PAYMENT_STATUS, WITHDRAWAL_TOTAL_COUNT, WITHDRAW_LIST } from './constants'
const errMsg = 'Server is unavailable.'

export const getWithdrawList = (withdrawListData) => async (dispatch) => {
  dispatch({ type: CLEAR_WITHDRAW_MESSAGE })
  const { start, limit, sort, order, search, status, method, reversedInfo, startDate, endDate, isFullResponse, token } = withdrawListData
  await axios.get(`/withdraw/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&status=${status}&method=${method}&reversedFlag=${reversedInfo}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: WITHDRAW_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true,
        isFullResponse
      }
    })
  }).catch((error) => {
    dispatch({
      type: WITHDRAW_LIST,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const updatePaymentStatus = (paymentStatus, id, rejectMsg, token) => async (dispatch) => {
  dispatch({ type: CLEAR_WITHDRAW_MESSAGE })
  await axios.post(`/withdraw/${id}/v1`, { ePaymentStatus: paymentStatus, sRejectReason: rejectMsg }, { headers: { Authorization: token } }).then(response => {
    dispatch({
      type: UPDATE_WITHDRAW_PAYMENT_STATUS,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_WITHDRAW_PAYMENT_STATUS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getWithdrawalsTotalCount = (data) => async (dispatch) => {
  const { search, status, method, reversedInfo, startDate, endDate, token } = data
  await axios.get(`/withdraw/counts/v1?search=${search}&status=${status}&method=${method}&reversedFlag=${reversedInfo}&datefrom=${startDate}&dateto=${endDate}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: WITHDRAWAL_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: WITHDRAWAL_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}
