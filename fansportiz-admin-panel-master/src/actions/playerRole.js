import axios from '../axios'
import { CLEAR_PLAYER_ROLE_MESSAGE, PLAYER_ROLE_DETAILS, PLAYER_ROLE_LIST, UPDATE_PLAYER_ROLE_LIST } from './constants'
const errMsg = 'Server is unavailable.'

export const getPlayerRoleList = (sportsType, token) => async (dispatch) => {
  await axios.get(`/player-role/v1?sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PLAYER_ROLE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PLAYER_ROLE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getBaseballPlayerRoleList = (sportsType, token) => async (dispatch) => {
  await axios.get(`/player-role/v1?sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: 'BASEBALL_PLAYER_ROLE_LIST',
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: 'BASEBALL_PLAYER_ROLE_LIST',
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPlayerRoleDetails = (ID, sportsType, token) => async (dispatch) => {
  await axios.get(`/player-role/${ID}/v1?sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PLAYER_ROLE_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PLAYER_ROLE_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getbaseballPlayerRoleDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/player-role/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: 'BASEBALL_PLAYER_ROLE_DETAILS',
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: 'BASEBALL_PLAYER_ROLE_DETAILS',
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updatePlayerRole = (sFullName, nMax, nMin, nPosition, ID, sportsType, token) => async (dispatch) => {
  await axios.put(`/player-role/${ID}/v2?sportsType=${sportsType}`, {
    sFullName: sFullName, nMax: parseInt(nMax), nMin: parseInt(nMin), nPosition: parseInt(nPosition)
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_PLAYER_ROLE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_PLAYER_ROLE_LIST,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const UpdateBaseballPlayerRole = (nMax, nMin, ID, token) => async (dispatch) => {
  await axios.put(`/player-role/${ID}/v1`, {
    nMax, nMin
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: 'UPDATE_BASEBALL_PLAYER_ROLE_LIST',
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: 'UPDATE_BASEBALL_PLAYER_ROLE_LIST',
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const clearMsg = () => (dispatch) => {
  dispatch({
    type: CLEAR_PLAYER_ROLE_MESSAGE
  })
}
