import axios from '../../axios/instanceAxios'
import {
  GET_FETCH_LIVE_INNING, GET_FULL_SCORED, CLEAR_GET_FULL_SCORED, CLEAR_GET_FETCH_LIVE_INNING, CLEAR_SCORE_CARD, GET_SCORECARD
} from '../constants'

const errMsg = 'Server is unavailable.'

export const getFullScored = (matchId, token) => async (dispatch) => { // get ads List
  dispatch({ type: CLEAR_GET_FULL_SCORED })
  await axios.get(`/gaming/admin/scorecard/${matchId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_FULL_SCORED,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true,
        isFetchFullScored: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_FULL_SCORED,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        isFetchFullScored: false
      }
    })
  })
}

export const getFetchLiveInnings = (matchId, nInningNumber) => async (dispatch) => { // get ads List
  dispatch({ type: CLEAR_GET_FETCH_LIVE_INNING })
  await axios.get(`/gaming/user/live-innings/${matchId}/v2?nInningNumber=${nInningNumber}`).then((response) => {
    dispatch({
      type: GET_FETCH_LIVE_INNING,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true,
        isFetchLiveInning: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_FETCH_LIVE_INNING,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        isFetchLiveInning: false
      }
    })
  })
}

export const viewScoreCard = (matchId) => async (dispatch) => {
  dispatch({ type: CLEAR_SCORE_CARD })
  await axios.get(`/gaming/user/view-scorecard/${matchId}/v1`).then((response) => {
    dispatch({
      type: GET_SCORECARD,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_SCORECARD,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
