import axios from '../../axios/instanceAxios'
import {
  GET_PLAYER_SCORE_POINT,
  GET_PLAYER_SEASON_NAME,
  GET_LIST_MATCH_PLAYER,
  CLEAR_SCORE_POINT,
  CLEAR_SEASON_NAME,
  GET_UNIQUE_PLAYER,
  GET_UNIQUE_PLAYER_LEAGUE
} from '../constants'
import { catchBlankData } from '../../utils/helper'

export const getPlayerScorePoints = (id, token) => async (dispatch) => { // player score points list
  dispatch({ type: CLEAR_SCORE_POINT })
  await axios.get(`/gaming/user/match-player/score-point/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_PLAYER_SCORE_POINT,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_PLAYER_SCORE_POINT))
  })
}

export const getPlayerSeasonNames = (id, token) => async (dispatch) => { // player season points get
  dispatch({ type: CLEAR_SEASON_NAME })
  await axios.get(`/gaming/user/match-player/season-point/${id}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_PLAYER_SEASON_NAME,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_PLAYER_SEASON_NAME))
  })
}

export const listMatchPlayer = (id, token) => async (dispatch) => { // list of match player
  await axios.get(`/gaming/user/match-player/${id}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_LIST_MATCH_PLAYER,
      payload: {
        matchPlayerMatchId: id,
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_LIST_MATCH_PLAYER))
  })
}

export const getUniquePlayers = (id, token) => async (dispatch) => { // unique-player list
  await axios.get(`/gaming/user/user-team-unique-players/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_UNIQUE_PLAYER,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_UNIQUE_PLAYER))
  })
}

export const getUniquePlayersLeague = (id, token) => async (dispatch) => { // unique-player league
  await axios.get(`/gaming/user/user-team-unique-players-league/${id}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_UNIQUE_PLAYER_LEAGUE,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_UNIQUE_PLAYER_LEAGUE))
  })
}
