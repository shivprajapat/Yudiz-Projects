import axios from '../../axios/instanceAxios'
import {
  TRANSACTION_LIST,
  CLEAR_TRANSACTION_LIST,
  CANCEL_WITHDRAW,
  PENDING_DEPOSITS,
  CLEAR_PENDING_DEPOSIT_LIST
} from '../constants'
import { catchBlankData } from '../../utils/helper'

export const getTransactionList = (limit, offset, Type, startDate, lastDate, token) => async (dispatch) => { // transaction list
  await axios.get(`/gaming/user/passbook/list/v1?eType=${Type}&nLimit=${limit}&nOffset=${offset}&dStartDate=${startDate}&dEndDate=${lastDate}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TRANSACTION_LIST,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(TRANSACTION_LIST))
  })
}

// cancel withdraw
export const CancelWithdraw = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_TRANSACTION_LIST })
  await axios.get(`/payment/user/withdraw/cancel/${ID}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CANCEL_WITHDRAW,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        cancelWithdraw: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(CANCEL_WITHDRAW))
  })
}

export const pendingDeposits = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_PENDING_DEPOSIT_LIST })
  await axios.get('/payment/user/deposit/pending/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PENDING_DEPOSITS,
      payload: {
        pendingDeposits: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(PENDING_DEPOSITS))
  })
}
