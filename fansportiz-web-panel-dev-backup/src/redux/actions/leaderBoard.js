import axios from '../../axios/instanceAxios'
import {
  MY_TEAMS_LEADERBOARD_LIST,
  ALL_LEADERBOARD_LIST,
  CLEAR_LEADERBOARD_MESSAGE,
  CLEAR_ALL_LEADERBOARD_LIST,
  CLEAR_MY_TEAMS_LEADERBOARD_MESSAGE,
  SERIES_LEADERBOARD_LIST,
  GET_SERIES_CATEGORY,
  LEADERSHIP_BOARD_LIST,
  GET_LEADERBOARD_ALL_RANK,
  GET_LEADERBOARD_MY_RANK,
  GET_LEADERBOARD_CATEGORY_DETAILS,
  CLEAR_GET_SERIES_CATEGORY,
  CLEAR_SERIES_LEADERBOARD_LIST
} from '../constants'
import { catchBlankData } from '../../utils/helper'

// all leader-board list
export const getAllTeamLeaderBoardList = (limit, offset, iMatchLeagueId, token, nPutTime) => async (dispatch) => {
  dispatch({ type: CLEAR_LEADERBOARD_MESSAGE })
  dispatch({ type: CLEAR_ALL_LEADERBOARD_LIST })
  await axios.get(`/gaming/user/leaderboard/list/${iMatchLeagueId}/v2?nLimit=${limit}&nOffset=${offset}&nPutTime=${nPutTime || ''}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ALL_LEADERBOARD_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        bCached: response.data.bCached,
        bFullResponse: response.data.bFullResponse,
        nPutTime: response.data.nPutTime,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: ALL_LEADERBOARD_LIST,
      payload: {
        bCached: false,
        bFullResponse: false,
        data: [],
        resStatus: false
      }
    })
    dispatch(catchBlankData(ALL_LEADERBOARD_LIST))
  })
}

// get leadership board
export const getLeadershipBoard = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_LEADERBOARD_MESSAGE })
  await axios.get('/gaming/user/leadership-board/v2', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEADERSHIP_BOARD_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(LEADERSHIP_BOARD_LIST))
  })
}

// get the series list
export const getSeries = (sportsType) => async (dispatch) => {
  dispatch({ type: CLEAR_LEADERBOARD_MESSAGE })
  dispatch({ type: CLEAR_SERIES_LEADERBOARD_LIST })
  await axios.post('/gaming/user/series-leaderboard/v1', { eCategory: sportsType }).then((response) => {
    dispatch({
      type: SERIES_LEADERBOARD_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(SERIES_LEADERBOARD_LIST))
  })
}

// get the series category list
export const getSeriesCategory = (id) => async (dispatch) => {
  dispatch({ type: CLEAR_LEADERBOARD_MESSAGE })
  dispatch({ type: CLEAR_GET_SERIES_CATEGORY })
  await axios.get(`/gaming/user/series-leaderboard-category-list/${id}/v1`).then((response) => {
    dispatch({
      type: GET_SERIES_CATEGORY,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_SERIES_CATEGORY))
  })
}

// get my leader-board rank
export const getMyLeaderboardRank = (id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_LEADERBOARD_MESSAGE })
  await axios.get(`/gaming/user/series-leaderboard-get-myrank/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_LEADERBOARD_MY_RANK,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_LEADERBOARD_MY_RANK))
  })
}

// get all leader-board ranks
export const getAllLeaderBoardRank = (id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_LEADERBOARD_MESSAGE })
  await axios.get(`/gaming/user/series-leaderboard-get-allrank/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_LEADERBOARD_ALL_RANK,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_LEADERBOARD_ALL_RANK))
  })
}

// get the categories details
export const getCategoriesDetails = (id) => async (dispatch) => {
  dispatch({ type: CLEAR_LEADERBOARD_MESSAGE })
  await axios.get(`/gaming/user/series-leaderboard-category/${id}/v1`).then((response) => {
    dispatch({
      type: GET_LEADERBOARD_CATEGORY_DETAILS,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_LEADERBOARD_CATEGORY_DETAILS))
  })
}

// get my team leaderboard List
export const getMyTeamLeaderBoardList = (iMatchLeagueId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_LEADERBOARD_MESSAGE })
  dispatch({ type: CLEAR_MY_TEAMS_LEADERBOARD_MESSAGE })
  await axios.get(`/gaming/user/leaderboard/my-teams/${iMatchLeagueId}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MY_TEAMS_LEADERBOARD_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(MY_TEAMS_LEADERBOARD_LIST))
  })
}
