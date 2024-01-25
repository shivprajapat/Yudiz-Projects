import axios from '../axios'
import { CLEAR_DEPOSIT_MESSAGE, DEPOSIT_LIST, DEPOSIT_TOTAL_COUNT, UPDATE_DEPOSIT_PAYMENT_STATUS } from './constants'
const errMsg = 'Server is unavailable.'

export const getDepositList = (depositListData) => async (dispatch) => {
  dispatch({ type: CLEAR_DEPOSIT_MESSAGE })
  const { start, limit, sort, order, search, status, method, startDate, endDate, isFullResponse, token } = depositListData
  await axios.get(`/deposit/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&status=${status}&method=${method}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DEPOSIT_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true,
        isFullResponse
      }
    })
  }).catch(() => {
    dispatch({
      type: DEPOSIT_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updatePaymentStatus = (paymentStatus, id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_DEPOSIT_MESSAGE })
  await axios.post(`/deposit/${id}/v1`, { ePaymentStatus: paymentStatus }, { headers: { Authorization: token } }).then(response => {
    dispatch({
      type: UPDATE_DEPOSIT_PAYMENT_STATUS,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_DEPOSIT_PAYMENT_STATUS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getDepositsTotalCount = (data) => async (dispatch) => {
  const { search, status, method, startDate, endDate, token } = data
  await axios.get(`/deposit/counts/v1?search=${search}&status=${status}&method=${method}&datefrom=${startDate}&dateto=${endDate}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DEPOSIT_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: DEPOSIT_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}
