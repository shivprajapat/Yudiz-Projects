import axios from '../axios'
import { CLEAR_SPORT_MESSAGE, SPORTS_LIST, SPORT_DETAILS, UPDATE_SPORT } from './constants'
const errMsg = 'Server is unavailable.'

export const getSportsList = (token) => async (dispatch) => {
  await axios.get('/sport/list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SPORTS_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: SPORTS_LIST,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateSport = (updateSportData) => async (dispatch) => {
  dispatch({ type: CLEAR_SPORT_MESSAGE })
  const { sportName, key, position, Active, totalPlayers, maxPlayerOneTeam, scoreInfoLink, scoreInfoTabName, id, token } = updateSportData
  await axios.put(`/sport/${id}/v1`, {
    sName: sportName,
    sKey: key,
    nPosition: parseInt(position),
    eStatus: Active,
    nTotalPlayers: parseInt(totalPlayers),
    nMaxPlayerOneTeam: parseInt(maxPlayerOneTeam),
    sScoreInfoLink: scoreInfoLink,
    sScoreInfoTabName: scoreInfoTabName
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_SPORT,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_SPORT,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getSportDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/sport/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SPORT_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: SPORT_DETAILS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}
