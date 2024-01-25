import axios from '../axios'
import { CLEAR_RESPONSE_MESSAGE, LEADERSHIP_BOARD, LEADERSHIP_BOARD_ADD_SEASON, LEADER_BOARD, SEASON_IDS } from './constants'
const errMsg = 'Server is unavailable'

export const getLeadershipBoard = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_RESPONSE_MESSAGE })
  await axios.get('/leadership-board/v2', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEADERSHIP_BOARD,
      payload: {
        data: response.data.data ? response.data.data : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEADERSHIP_BOARD,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const calculateLeaderBoard = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_RESPONSE_MESSAGE })
  await axios.post('/leadership-board/v2', {}, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEADER_BOARD,
      payload: {
        data: response.data.data ? response.data.data : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEADER_BOARD,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSeasonIds = (token) => async (dispatch) => {
  await axios.get('/season-id-list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SEASON_IDS,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SEASON_IDS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addSeason = (aSeasons, token) => async (dispatch) => {
  dispatch({ type: CLEAR_RESPONSE_MESSAGE })
  await axios.post('/leadership-board-add-season/v1', { aSeasons }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEADERSHIP_BOARD_ADD_SEASON,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: LEADERSHIP_BOARD_ADD_SEASON,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}
