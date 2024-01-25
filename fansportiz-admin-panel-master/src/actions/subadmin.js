import axios from '../axios'
import { encryption } from '../helpers/helper'
import { ADD_SUB_ADMIN, ADMIN_IDS, ADMIN_LOGS, CLEAR_SUB_ADMIN_MESSAGE, LEAGUE_LOGS, MATCH_API_DETAILS, MATCH_API_LOGS, MATCH_LOGS, SINGLE_ADMIN_LOGS, SUB_ADMIN_DETAILS, SUB_ADMIN_LIST, UPDATE_SUB_ADMIN } from './constants'
const errMsg = 'Server is unavailable.'

export const addSubadmin = (addSubAdminData) => async (dispatch) => {
  dispatch({ type: CLEAR_SUB_ADMIN_MESSAGE })
  const { fullname, username, email, MobNum, password, aRole, subAdminStatus, token } = addSubAdminData
  const encryptPassword = encryption(password)
  await axios.post('/auth/sub-admin/v4', {
    sName: fullname,
    sUsername: username,
    sEmail: email,
    sMobNum: MobNum,
    sPassword: encryptPassword,
    aRole: aRole,
    eStatus: subAdminStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_SUB_ADMIN,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_SUB_ADMIN,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const updateSubadmin = (updateSubAdminData) => async (dispatch) => {
  const { fullname, username, email, password, MobNum, aRole, subAdminStatus, ID, token } = updateSubAdminData
  dispatch({ type: CLEAR_SUB_ADMIN_MESSAGE })
  const encryptPassword = encryption(password)
  await axios.put(`/sub-admin/${ID}/v4`, {
    sName: fullname,
    sUsername: username,
    sEmail: email,
    sMobNum: MobNum,
    aRole: aRole,
    eStatus: subAdminStatus,
    sPassword: password ? encryptPassword : ''
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_SUB_ADMIN,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_SUB_ADMIN,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getSubadminList = (start, limit, sort, order, searchText, token) => async (dispatch) => {
  await axios.get(`/sub-admin/list/v2?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${searchText}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SUB_ADMIN_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SUB_ADMIN_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSubadminDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/sub-admin/${Id}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SUB_ADMIN_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SUB_ADMIN_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const singleAdminLogs = (id, token) => async (dispatch) => {
  await axios.get(`sub-admin-logs/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SINGLE_ADMIN_LOGS,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SINGLE_ADMIN_LOGS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const adminLogs = (data) => async (dispatch) => {
  const { start, limit, order, search, searchType, adminId, dateFrom, dateTo, token } = data
  await axios.get(`/sub-admin-logs/v2?nStart=${start}&nLimit=${limit}&order=${order}&search=${search}&operation=${searchType}&iAdminId=${adminId}&datefrom=${dateFrom}&dateto=${dateTo}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADMIN_LOGS,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: ADMIN_LOGS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const adminIds = (token) => async (dispatch) => {
  await axios.get('/sub-admin-ids/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADMIN_IDS,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: ADMIN_IDS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getMatchLogs = (start, limit, matchId, token) => async (dispatch) => {
  await axios.get(`/match/logs/${matchId}/v1?start=${start}&limit=${limit}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_LOGS,
      payload: {
        data: response?.data?.data[0] || [],
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: MATCH_LOGS,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getLeagueLogs = (start, limit, leagueId, token) => async (dispatch) => {
  await axios.get(`/league/logs/${leagueId}/v1?start=${start}&limit=${limit}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEAGUE_LOGS,
      payload: {
        data: response?.data?.data || [],
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: LEAGUE_LOGS,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getMatchAPILogs = (matchId, start, limit, order, filter, token) => async (dispatch) => {
  await axios.get(`/api-logs/list/${matchId}/v1?start=${start}&limit=${limit}&order=${order}&eType=${filter}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_API_LOGS,
      payload: {
        data: response?.data?.data[0] || [],
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: MATCH_API_LOGS,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getMatchAPIDetails = (id, token) => async (dispatch) => {
  await axios.get(`/api-logs/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_API_DETAILS,
      payload: {
        data: response?.data?.data || [],
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: MATCH_API_DETAILS,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const clearSubadminMsg = () => (dispatch) => {
  dispatch({ type: CLEAR_SUB_ADMIN_MESSAGE })
}
