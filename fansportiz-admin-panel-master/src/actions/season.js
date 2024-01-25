import axios from '../axios'
import { CLEAR_SEASON_MESSAGE, SEASON_DATA_EXPORT, SEASON_DETAILS, SEASON_LIST, UPDATE_SEASON, USERS_LIST_IN_SEASON } from './constants'
const errMsg = 'Server is unavailable.'

export const getSeasonList = (seasonListData) => async (dispatch) => {
  const { start, limit, search, sportsType, startDate, endDate, token } = seasonListData
  await axios.get(`/season/list/v1?start=${start}&limit=${limit}&search=${search}&datefrom=${startDate}&dateto=${endDate}&sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SEASON_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SEASON_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSeasonDetails = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SEASON_MESSAGE })
  await axios.get(`/season/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SEASON_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SEASON_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getUsersListInSeason = (userListData) => async (dispatch) => {
  const { seasonId, start, limit, token } = userListData
  await axios.get(`/season-users/${seasonId}/v1?start=${start}&limit=${limit}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USERS_LIST_IN_SEASON,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: USERS_LIST_IN_SEASON,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const seasonDataExport = (Id, token) => async (dispatch) => {
  await axios.get(`/season-users-exports/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SEASON_DATA_EXPORT,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SEASON_DATA_EXPORT,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updateSeason = (data) => async (dispatch) => {
  const { seasonName, seasonId, token } = data
  dispatch({ type: CLEAR_SEASON_MESSAGE })
  await axios.put(`/season/${seasonId}/v1`, {
    sName: seasonName
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_SEASON,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_SEASON,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}
