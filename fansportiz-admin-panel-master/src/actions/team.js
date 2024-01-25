import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { ADD_TEAM, CLEAR_TEAM_MESSAGE, TEAMS_TOTAL_COUNT, TEAM_DETAILS, TEAM_LIST, TEAM_NAME, UPDATE_TEAM } from './constants'
const errMsg = 'Server is unavailable.'

export const getTeamList = (teamListData) => async (dispatch) => {
  const { start, limit, sort, order, searchText, provider, sportsType, token } = teamListData
  await axios.get(`/team/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${searchText}&eProvider=${provider}&sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TEAM_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TEAM_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getBaseballTeamList = (start, limit, sort, order, search, sportsType, token) => async (dispatch) => {
  await axios.get(`/team/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: 'BASEBALL_TEAM_LIST',
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: 'BASEBALL_TEAM_LIST',
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addTeam = (addTeamData) => async (dispatch) => {
  const { sKey, sName, sImage, sShortName, sportsType, teamStatus, token } = addTeamData
  dispatch({ type: CLEAR_TEAM_MESSAGE })
  try {
    if (sImage) {
      const response = await axios.post('/team/pre-signed-url/v1', { sFileName: sImage.file.name, sContentType: sImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage1 = response.data.data.sPath
      await axios.put(url, sImage.file, { headers: { 'Content-Type': sImage.file.type } })
      await axios.post('/team/add/v1', {
        sKey, sName, sImage: sImage1, sportsType, sShortName, eStatus: teamStatus
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch(successFunc(ADD_TEAM, response2))
      })
    } else {
      await axios.post('/team/add/v1', {
        sKey, sName, sImage: '', sportsType, sShortName, eStatus: teamStatus
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch(successFunc(ADD_TEAM, response))
      })
    }
  } catch (error) {
    dispatch(catchFunc(ADD_TEAM, error))
  }
}

export const addBaseballTeam = (sKey, sName, sImage, sportsType, token) => async (dispatch) => {
  dispatch({ type: CLEAR_TEAM_MESSAGE })
  const response = await axios.post('/team/pre-signed-url/v1', { sFileName: sImage.file.name, sContentType: sImage.file.type }, { headers: { Authorization: token } })
  const url = response.data.data.sUrl
  const sImage1 = response.data.data.sPath
  await axios.put(url, sImage.file, { headers: { 'Content-Type': sImage.file.type } })
  await axios.post('/team/add/v1', {
    sKey, sName, sImage: sImage1, sportsType
  }, { headers: { Authorization: token } }).then((response2) => {
    dispatch({
      type: 'ADD_BASEBALL_TEAM',
      payload: {
        resMessage: response2.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: 'ADD_BASEBALL_TEAM',
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getTeamDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/team/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TEAM_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: TEAM_DETAILS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getBaseballTeamDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/team/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: 'BASEBALL_TEAM_DETAILS',
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: 'BASEBALL_TEAM_DETAILS',
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const updateTeam = (updateTeamData) => async (dispatch) => {
  const { Id, sKey, sName, sImage, sShortName, sportsType, teamStatus, token } = updateTeamData
  dispatch({ type: CLEAR_TEAM_MESSAGE })
  try {
    if (sImage && sImage.file) {
      const response = await axios.post('/team/pre-signed-url/v1', { sFileName: sImage.file.name, sContentType: sImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage1 = response.data.data.sPath
      await axios.put(url, sImage.file, { headers: { 'Content-Type': sImage.file.type } })
      await axios.put(`/team/${Id}/v1`, {
        sKey, sName, sImage: sImage1, sShortName, sportsType, eStatus: teamStatus
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: UPDATE_TEAM,
          payload: {
            data: response2.data.data ? response2.data.data : [],
            resMessage: response2.data.message,
            resStatus: true
          }
        })
      })
    } else {
      await axios.put(`/team/${Id}/v1`, {
        sKey, sName, sImage: sImage || '', sShortName, sportsType, eStatus: teamStatus
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: UPDATE_TEAM,
          payload: {
            data: response.data.data ? response.data.data : [],
            resMessage: response.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_TEAM, error))
  }
}

export const UpdateBaseballTeam = (Id, sportsType, sKey, sName, sImage, token) => async (dispatch) => {
  dispatch({ type: 'CLEAR_TEAM_MESSAGE' })
  try {
    if (sImage.file) {
      const response = await axios.post('/team/pre-signed-url/v1', { sFileName: sImage.file.name, sContentType: sImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage1 = response.data.data.sPath
      await axios.put(url, sImage.file, { headers: { 'Content-Type': sImage.file.type } })
      await axios.put(`/team/${Id}/v1`, {
        sKey, sName, sImage: sImage1, sportsType
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: 'UPDATE_BASEBALL_TEAM',
          payload: {
            resMessage: response2.data.message,
            resStatus: true
          }
        })
      })
    } else {
      await axios.put(`/team/${Id}/v1`, {
        sKey, sName, sImage, sportsType
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: 'UPDATE_BASEBALL_TEAM',
          payload: {
            resMessage: response.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch({
      type: 'UPDATE_BASEBALL_TEAM',
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  }
}

export const getTeamName = (sportsType, token, start, limit, search) => async (dispatch) => {
  await axios.get(`/team/team-list/v1?start=${start}&limit=${limit}&search=${search}&sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TEAM_NAME,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TEAM_NAME,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getTeamsTotalCount = (data) => async (dispatch) => {
  const { searchText, provider, sportsType, token } = data
  await axios.get(`/team/counts/v1?search=${searchText}&eProvider=${provider}&sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TEAMS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TEAMS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}
