import axios from '../axios'
import { catchFunc } from '../helpers/helper'
import { ADD_PLAYER, CLEAR_PLAYER_MESSAGE, PLAYERS_LIST, PLAYERS_TOTAL_COUNT, PLAYER_DETAILS, UPDATE_PLAYER } from './constants'

const errMsg = 'Server is unavailable.'

export const getPlayersList = (getPlayersListData) => async (dispatch) => {
  await axios.get(`/player/list/v1?start=${getPlayersListData.start}&limit=${getPlayersListData.limit}&sort=${getPlayersListData.sort}&order=${getPlayersListData.order}&search=${getPlayersListData.searchText}&eProvider=${getPlayersListData.provider}&sportsType=${getPlayersListData.sportsType}`, { headers: { Authorization: getPlayersListData.token } }).then((response) => {
    dispatch({
      type: PLAYERS_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true,
        isSearch: getPlayersListData.searchText !== ''
      }
    })
  }).catch(() => {
    dispatch({
      type: PLAYERS_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getBaseballPlayerList = (getBaseballPlayersList) => async (dispatch) => {
  await axios.get(`/player/list/v1?start=${getBaseballPlayersList.start}&limit=${getBaseballPlayersList.limit}&sort=${getBaseballPlayersList.sort}&order=${getBaseballPlayersList.order}&search=${getBaseballPlayersList.searchText}&sportsType=${getBaseballPlayersList.sportsType}`, { headers: { Authorization: getBaseballPlayersList.token } }).then((response) => {
    dispatch({
      type: 'BASEBALL_PLAYER_LIST',
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: 'BASEBALL_PLAYER_LIST',
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addPlayer = (addPlayerData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_PLAYER_MESSAGE' })
  try {
    if (addPlayerData.sImage) {
      const response = await axios.post('/player/pre-signed-url/v1', { sFileName: addPlayerData.sImage.file.name, sContentType: addPlayerData.sImage.file.type }, { headers: { Authorization: addPlayerData.token } })
      const url = response.data.data.sUrl
      const sImage1 = response.data.data.sPath
      const response1 = await axios.put(url, addPlayerData.sImage.file, { headers: { 'Content-Type': addPlayerData.sImage.file.type } })
      if (response1.status === 200) {
        axios.post('/player/add/v1', {
          sKey: addPlayerData.sKey, sName: addPlayerData.sName, sImage: sImage1, nFantasyCredit: parseFloat(addPlayerData.nFantasyCredit), eRole: addPlayerData.eRole, sportsType: addPlayerData.sportsType
        }, { headers: { Authorization: addPlayerData.token } }).then((response2) => {
          dispatch({
            type: ADD_PLAYER,
            payload: {
              resMessage: response2.data.message,
              resStatus: true
            }
          })
        })
      }
    } else {
      await axios.post('/player/add/v1', {
        sKey: addPlayerData.sKey, sName: addPlayerData.sName, sImage: '', nFantasyCredit: parseFloat(addPlayerData.nFantasyCredit), eRole: addPlayerData.eRole, sportsType: addPlayerData.sportsType
      }, { headers: { Authorization: addPlayerData.token } }).then((response) => {
        dispatch({
          type: ADD_PLAYER,
          payload: {
            resMessage: response.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch({
      type: ADD_PLAYER,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  }
}

export const addBaseballPlayer = (addBaseballPlayerData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_PLAYER_MESSAGE' })
  await axios.post('/player/pre-signed-url/v1', { sFileName: addBaseballPlayerData.sImage.file.name, sContentType: addBaseballPlayerData.sImage.file.type }, { headers: { Authorization: addBaseballPlayerData.token } }).then((response) => {
    const url = response.data.data.sUrl
    const sImage1 = response.data.data.sPath
    axios.put(url, addBaseballPlayerData.sImage.file, { headers: { 'Content-Type': addBaseballPlayerData.sImage.file.type } }).then((response1) => {
      if (response1.status === 200) {
        axios.post('/player/add/v1', {
          sKey: addBaseballPlayerData.sKey, sName: addBaseballPlayerData.sName, sImage: sImage1, nFantasyCredit: addBaseballPlayerData.nFantasyCredit, eRole: addBaseballPlayerData.eRole, sportsType: addBaseballPlayerData.sportsType
        }, { headers: { Authorization: addBaseballPlayerData.token } }).then((response2) => {
          dispatch({
            type: 'ADD_BASEBALL_PLAYER',
            payload: {
              resMessage: response2.data.message,
              resStatus: true
            }
          })
        }).catch((error) => {
          dispatch({
            type: 'ADD_BASEBALL_PLAYER',
            payload: {
              resMessage: error.response ? error.response.data.message : errMsg,
              resStatus: false
            }
          })
        })
      }
    }).catch(() => {
      dispatch({
        type: 'ADD_BASEBALL_PLAYER',
        payload: {
          resMessage: 'Failed to add player image',
          resStatus: false
        }
      })
    })
  }).catch((error) => {
    dispatch({
      type: 'ADD_BASEBALL_PLAYER',
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getPlayerDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/player/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PLAYER_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: PLAYER_DETAILS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getBaseballPlayerDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/player/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: 'BASEBALL_PLAYER_DETAILS',
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: 'BASEBALL_PLAYER_DETAILS',
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const updatePlayer = (updatePlayerData) => async (dispatch) => {
  dispatch({ type: CLEAR_PLAYER_MESSAGE })
  try {
    if (updatePlayerData.sImage && updatePlayerData.sImage.file) {
      const response = await axios.post('/player/pre-signed-url/v1', { sFileName: updatePlayerData.sImage.file.name, sContentType: updatePlayerData.sImage.file.type }, { headers: { Authorization: updatePlayerData.token } })
      const url = response.data.data.sUrl
      const sImage1 = response.data.data.sPath
      const response1 = await axios.put(url, updatePlayerData.sImage.file, { headers: { 'Content-Type': updatePlayerData.sImage.file.type } })
      if (response1.status === 200) {
        await axios.put(`/player/${updatePlayerData.Id}/v1`, {
          sKey: updatePlayerData.sKey, sName: updatePlayerData.sName, sImage: sImage1, nFantasyCredit: parseFloat(updatePlayerData.nFantasyCredit), eRole: updatePlayerData.eRole, sportsType: updatePlayerData.sportsType
        }, { headers: { Authorization: updatePlayerData.token } }).then((response2) => {
          dispatch({
            type: UPDATE_PLAYER,
            payload: {
              data: response2.data.data,
              resMessage: response2.data.message,
              resStatus: true
            }
          })
        })
      }
    } else {
      await axios.put(`/player/${updatePlayerData.Id}/v1`, {
        sKey: updatePlayerData.sKey, sName: updatePlayerData.sName, sImage: updatePlayerData.sImage, nFantasyCredit: parseFloat(updatePlayerData.nFantasyCredit), eRole: updatePlayerData.eRole, sportsType: updatePlayerData.sportsType
      }, { headers: { Authorization: updatePlayerData.token } }).then((response) => {
        dispatch({
          type: UPDATE_PLAYER,
          payload: {
            data: response.data.data,
            resMessage: response.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_PLAYER, error))
  }
}

export const UpdateBaseballPlayer = (updateBaseballPlayerData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_PLAYER_MESSAGE' })
  try {
    if (updateBaseballPlayerData.sImage.file) {
      const response = await axios.post('/player/pre-signed-url/v1', { sFileName: updateBaseballPlayerData.sImage.file.name, sContentType: updateBaseballPlayerData.sImage.file.type }, { headers: { Authorization: updateBaseballPlayerData.token } })
      const url = response.data.data.sUrl
      const sImage1 = response.data.data.sPath
      await axios.put(url, updateBaseballPlayerData.sImage.file, { headers: { 'Content-Type': updateBaseballPlayerData.sImage.file.type } })
      await axios.put(`/player/${updateBaseballPlayerData.Id}/v1`, {
        sKey: updateBaseballPlayerData.sKey, sName: updateBaseballPlayerData.sName, sImage: sImage1, nFantasyCredit: updateBaseballPlayerData.nFantasyCredit, eRole: updateBaseballPlayerData.eRole, sportsType: updateBaseballPlayerData.sportsType
      }, { headers: { Authorization: updateBaseballPlayerData.token } }).then((response2) => {
        dispatch({
          type: 'CRICKET_BASEBALL_PLAYER',
          payload: {
            resMessage: response2.data.message,
            resStatus: true
          }
        })
      })
    } else {
      await axios.put(`/player/${updateBaseballPlayerData.Id}/v1`, {
        sKey: updateBaseballPlayerData.sKey, sName: updateBaseballPlayerData.sName, sImage: updateBaseballPlayerData.sImage, nFantasyCredit: updateBaseballPlayerData.nFantasyCredit, eRole: updateBaseballPlayerData.eRole, sportsType: updateBaseballPlayerData.sportsType
      }, { headers: { Authorization: updateBaseballPlayerData.token } }).then((response) => {
        dispatch({
          type: 'CRICKET_BASEBALL_PLAYER',
          payload: {
            resMessage: response.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch(catchFunc('CRICKET_BASEBALL_PLAYER', error))
  }
}

export const getPlayersTotalCount = (data) => async (dispatch) => {
  const { searchText, provider, sportsType, token } = data
  await axios.get(`/player/counts/v1?&search=${searchText}&eProvider=${provider}&sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PLAYERS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PLAYERS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}
