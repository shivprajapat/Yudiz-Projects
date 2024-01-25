import axios from '../axios'
import { CLEAR_SCORE_POINT_MESSAGE, FETCH_LIST, FETCH_SCORE_POINT, GET_POINT_SYSTEM, UPDATE_SCORE_POINTS } from './constants'
const errMsg = 'Server is unavailable.'

export const getPointSystemList = (search, eFormat, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SCORE_POINT_MESSAGE })
  await axios.get(`/score-point/v1?search=${search}&eFormat=${eFormat}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_POINT_SYSTEM,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_POINT_SYSTEM,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getFormatsList = (eCategory, token) => async (dispatch) => {
  await axios.get(`/point-system/v1?eCategory=${eCategory}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FETCH_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: FETCH_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPointSystem = (id, token) => async (dispatch) => {
  await axios.get(`/score-point/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FETCH_SCORE_POINT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: FETCH_SCORE_POINT,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updateScorePoint = (scorePointData) => async (dispatch) => {
  dispatch({ type: CLEAR_SCORE_POINT_MESSAGE })
  await axios.put(`/score-point/${scorePointData.iPointId}/v1`, {
    id: scorePointData.id,
    sName: scorePointData.Name,
    sKey: scorePointData.Key,
    nPoint: scorePointData.Points,
    nRangeFrom: scorePointData.RangeFrom,
    nRangeTo: scorePointData.RangeTo,
    nMinValue: scorePointData.MinValue,
    nBonus: scorePointData.Bonus
  }, { headers: { Authorization: scorePointData.token } }).then((response) => {
    dispatch({
      type: UPDATE_SCORE_POINTS,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_SCORE_POINTS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}
