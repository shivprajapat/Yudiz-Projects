import axios from '../../axios/instanceAxios'
import {
  MATCH_LEAGUE_LIST,
  MATCH_LEAGUE_DETAILS,
  JOIN_LEAGUE,
  JOIN_LEAGUE_LIST,
  CLEAR_LEAGUE_MESSAGE,
  CLEAR_JOIN_LEAGUE_MESSAGE
} from '../constants'
import { catchBlankData, catchError } from '../../utils/helper'

const errMsg = 'Server is unavailable.'

export const getLeagueList = (ID, sportsType, token) => async (dispatch) => { // leagues list
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  await axios.get(`/gaming/user/match-league/${ID}/list/v2?sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_LEAGUE_LIST,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(MATCH_LEAGUE_LIST))
  })
}

export const getMatchLeagueDetails = (ID, token) => async (dispatch) => { // match league details
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  await axios.get(`/gaming/user/match-league/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_LEAGUE_DETAILS,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(MATCH_LEAGUE_DETAILS))
  })
}

export const joinLeague = (iMatchLeagueId, iUserTeamId, bPrivateLeague, token, sShareCode = '', sPromo = '') => async (dispatch) => { // join contest
  dispatch({ type: CLEAR_JOIN_LEAGUE_MESSAGE })
  const array = []
  if (!Array.isArray(iUserTeamId)) {
    array.push(iUserTeamId)
  }
  const body = sPromo !== ''
    ? { iMatchLeagueId, aUserTeamId: !Array.isArray(iUserTeamId) ? array : iUserTeamId, bPrivateLeague, sShareCode, sPromo }
    : { iMatchLeagueId, aUserTeamId: !Array.isArray(iUserTeamId) ? array : iUserTeamId, bPrivateLeague, sShareCode }
  await axios.post('/gaming/user/user-league/join-league/v3', body, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: JOIN_LEAGUE,
      payload: {
        data: response.data.data,
        joinedLeague: true,
        MatchLeagueId: iMatchLeagueId,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: JOIN_LEAGUE,
      payload: {
        data: error.response ? error.response.data.data : {},
        resStatus: false,
        joinedLeague: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const listofjoinedLeague = (iMatchId, token) => async (dispatch) => { // joined contest list
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  await axios.get(`/gaming/user/user-league/join-list/${iMatchId}/v3`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: JOIN_LEAGUE_LIST,
      payload: {
        resMessage: response.data.message,
        joinedLeague: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchError(JOIN_LEAGUE_LIST))
  })
}
