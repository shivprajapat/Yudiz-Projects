import axios from '../axios'
import axios1 from 'axios'
import { ADD_SYSTEM_USER, CLEAR_SYSTEM_USERS_MESSAGE, GET_PROBABILITY, JOIN_BOT_IN_CONTEST, SYSTEM_USERS_TOTAL_COUNT, SYSTEM_USER_DETAILS, SYSTEM_USER_LIST } from './constants'
const errMsg = 'Server is unavailable.'

const axios2 = axios1.create({
  baseURL: process.env.REACT_APP_ENVIRONMENT === 'development' ? process.env.REACT_APP_NODE_AXIOS_BASE_URL_DEV : process.env.REACT_APP_ENVIRONMENT === 'staging' ? process.env.REACT_APP_NODE_AXIOS_BASE_URL_STAG : process.env.REACT_APP_NODE_AXIOS_BASE_URL_PROD
})

export const getSystemUserList = (data) => async (dispatch) => {
  dispatch({ type: CLEAR_SYSTEM_USERS_MESSAGE })
  const { start, limit, sort, order, searchvalue, filterBy, startDate, endDate, isFullResponse, token } = data
  const url = (filterBy === 'EMAIL_VERIFIED')
    ? `/system-user/list/v1?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&email=${true}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
    : (filterBy === 'MOBILE_VERIFIED')
        ? `/system-user/list/v1?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&mobile=${true}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
        : (filterBy === 'INTERNAL_ACCOUNT')
            ? `/system-user/list/v1?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&internalAccount=${true}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
            : `/system-user/list/v1?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
  await axios.get(url, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USER_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true,
        isFullResponse
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USER_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addSystemUsers = (nUsers, token) => async (dispatch) => {
  await axios.post('/system-user/v1', { nUsers }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_SYSTEM_USER,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_SYSTEM_USER,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getSystemUserDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/system-user/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USER_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USER_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getSystemUsersTotalCount = (data) => async (dispatch) => {
  const { searchvalue, filterBy, startDate, endDate, token } = data
  const url = (filterBy === 'EMAIL_VERIFIED')
    ? `/system-user/counts/v1?search=${searchvalue}&email=${true}&datefrom=${startDate}&dateto=${endDate}`
    : (filterBy === 'MOBILE_VERIFIED')
        ? `/system-user/counts/v1?search=${searchvalue}&mobile=${true}&datefrom=${startDate}&dateto=${endDate}`
        : (filterBy === 'INTERNAL_ACCOUNT')
            ? `/system-user/counts/v1?search=${searchvalue}&internalAccount=${true}&datefrom=${startDate}&dateto=${endDate}`
            : `/system-user/counts/v1?search=${searchvalue}&datefrom=${startDate}&dateto=${endDate}`
  await axios.get(url, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USERS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USERS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getProbability = (data) => async (dispatch) => {
  const { players, rules, matchLeagueId, matchId, token } = data
  dispatch({ type: CLEAR_SYSTEM_USERS_MESSAGE })
  await axios2.post(`/match-players-probability-with-cvc/${matchId}/v1`, {
    players, rules, iMatchLeagueId: matchLeagueId
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_PROBABILITY,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_PROBABILITY,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const joinBotInContest = (data) => async (dispatch) => {
  const { players, teamCount, rules, instantAdd, matchLeagueId, matchId, token } = data
  dispatch({ type: CLEAR_SYSTEM_USERS_MESSAGE })
  await axios2.post(`/join-bot-team-with-cvc/${matchId}/v1`, {
    players, teamCount, rules, bInstantAdd: instantAdd, iMatchLeagueId: matchLeagueId
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: JOIN_BOT_IN_CONTEST,
      payload: {
        resMessage: response.data.message,
        isTeamCreate: true,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: JOIN_BOT_IN_CONTEST,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        isTeamCreate: false,
        resStatus: false
      }
    })
  })
}
