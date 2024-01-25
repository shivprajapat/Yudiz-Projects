import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { CLEAR_FEEDBACK_MESSAGE, FEEDBACK_DETAILS, FEEDBACK_LIST, UPDATE_FEEDBACK_STATUS } from './constants'

export const getFeedbackList = (data) => async (dispatch) => {
  const { start, limit, sort, order, search, type, status, dateFrom, dateTo, token } = data
  await axios.get(`/complaint/v1?iUserId=${search}&start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&type=${type}&status=${status}&datefrom=${dateFrom}&dateto=${dateTo}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FEEDBACK_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: FEEDBACK_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getFeedbackDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/complaint/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FEEDBACK_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: FEEDBACK_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const updateFeedbackStatus = (data) => async (dispatch) => {
  const { complainStatus, comment, type, id, token } = data
  dispatch({ type: CLEAR_FEEDBACK_MESSAGE })
  await axios.put(`/complaint/${id}/v1`, {
    eStatus: complainStatus, sComment: comment, eType: type
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(UPDATE_FEEDBACK_STATUS, response))
  }).catch((error) => {
    dispatch(catchFunc(UPDATE_FEEDBACK_STATUS, error))
  })
}
