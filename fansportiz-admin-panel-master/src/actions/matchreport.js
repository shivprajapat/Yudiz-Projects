import axios from '../axios'
import { CLEAR_GENERATE_REPORT_MESSAGE, GET_REPORT_LIST } from './constants'
const errMsg = 'Server is unavailable.'

export const getReportList = (iMatchId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_GENERATE_REPORT_MESSAGE })
  await axios.get(`/report/${iMatchId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_REPORT_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_REPORT_LIST,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const generateReportList = (iMatchId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_GENERATE_REPORT_MESSAGE })
  await axios.post(`/report/${iMatchId}/v1`, {}, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_REPORT_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_REPORT_LIST,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateMatchReport = (matchId, token) => async (dispatch) => {
  await axios.put(`/update-report/${matchId}/v1`, { }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_REPORT_LIST,
      payload: {
        resStatus: true,
        data: response.data.data,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_REPORT_LIST,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}
