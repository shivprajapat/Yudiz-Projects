import axios from '../axios'
import { catchFunc } from '../helpers/helper'
import { ADD_MATCH_PLAYER, CLEAR_MATCH_PLAYER_MESSAGE, DELETE_MATCH_PLAYER, FETCH_MATCH_PLAYER, FETCH_MATCH_PLAYER_11, FETCH_PLAYING_EIGHT, FETCH_PLAYING_SEVEN, GENERATE_CRICKET_SCORE_POINT, GENERATE_SCORE_POINT, GET_RANK_CALCULATE, GET_WIN_RETURN, LINEUPSOUT, MATCH_PLAYER_DETAILS, MATCH_PLAYER_LIST, MATCH_PLAYER_SCORE_POINT_LIST, SEASON_POINT, UPDATE_MATCH_PLAYER, UPDATE_MP_SCORE_POINT } from './constants'
const errMsg = 'Server is unavailable.'

export const getMatchPlayerList = (matchPlayerListData, isMatchAPIGenerated) => async (dispatch) => {
  const { start, limit, sort, order, searchText, role, team, token, Id } = matchPlayerListData
  await axios.get(`/match-player/list/${Id}/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${searchText}&eRole=${role}&iTeamId=${team}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_PLAYER_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resMessage: response.data.message,
        resStatus: true,
        isMatchAPIGenerated
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_PLAYER_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getMatchPlayerScorePoint = (token, ID) => async (dispatch) => {
  await axios.get(`/match-player/score-point/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_PLAYER_SCORE_POINT_LIST,
      payload: {
        data: response.data.data.aPointBreakup ? response.data.data.aPointBreakup : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_PLAYER_SCORE_POINT_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getMatchPlayerDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/match-player/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_PLAYER_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_PLAYER_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const fetchMatchPlayer = (sportsType, ID, token, isMatchAPIGenerated) => async (dispatch) => {
  dispatch({ type: 'CLEAR_MATCH_PLAYER_MESSAGE' })
  await axios.get(`/match-player/${sportsType}/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FETCH_MATCH_PLAYER,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isMatchAPIGenerated
      }
    })
  }).catch((error) => {
    dispatch({
      type: FETCH_MATCH_PLAYER,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const fetchplaying11 = (sportsType, ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.get(`/match-player/${sportsType}/playing-eleven/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FETCH_MATCH_PLAYER_11,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: FETCH_MATCH_PLAYER_11,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const fetchPlaying7 = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.get(`/match-player/kabaddi/starting-seven/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FETCH_PLAYING_SEVEN,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: FETCH_PLAYING_SEVEN,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const fetchPlaying5 = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.get(`/match-player/basketball/starting-five/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FETCH_PLAYING_EIGHT,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: FETCH_PLAYING_EIGHT,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getGenerateScorePoint = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.post(`/score-point/${ID}/v1`, null, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GENERATE_CRICKET_SCORE_POINT,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: GENERATE_CRICKET_SCORE_POINT,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const generateScorePoint = (sportsType, ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.post(`/score-point/${sportsType}/${ID}/v1`, null, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GENERATE_SCORE_POINT,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: GENERATE_SCORE_POINT,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getRankCalculate = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.get(`/user-team/rank/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_RANK_CALCULATE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resFlag: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_RANK_CALCULATE,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg,
        resFlag: false
      }
    })
  })
}

export const getWinReturn = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.get(`/user-team-win-return/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_WIN_RETURN,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_WIN_RETURN,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const lineupsOut = (bLineupsOut, ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.put(`/match/lineups-out/${ID}/v1`, { bLineupsOut }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LINEUPSOUT,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: LINEUPSOUT,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const AddMatchPlayer = (addMatchPlayerData) => async (dispatch) => {
  const { aPlayers, scorePoints, seasonPoints, TeamName, show, sportsType, token, matchId } = addMatchPlayerData
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  try {
    await axios.post('/match-player/v2', {
      aPlayers,
      iMatchId: matchId,
      iTeamId: TeamName,
      nScoredPoints: scorePoints,
      nSeasonPoints: seasonPoints,
      bShow: show === 'Y',
      sportsType: sportsType
    }, { headers: { Authorization: token } }).then((response1) => {
      dispatch({
        type: ADD_MATCH_PLAYER,
        payload: {
          resMessage: response1.data.message,
          resStatus: true
        }
      })
    })
  } catch (error) {
    dispatch(catchFunc(ADD_MATCH_PLAYER, error))
  }
}

export const UpdateMatchPlayer = (updateMatchPlayerData) => async (dispatch) => {
  const { playerName, playerId, playerImage, playerRole, credits, scorePoints, seasonPoints, TeamName, show, frontendStatus, sportsType, token, matchId, matchPlayerId } = updateMatchPlayerData
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  try {
    if (playerImage && playerImage.file) {
      const response = await axios.post('/match-player/pre-signed-url/v1', { sFileName: playerImage.file.name, sContentType: playerImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage1 = response.data.data.sPath
      await axios.put(url, playerImage.file, { headers: { 'Content-Type': playerImage.file.type } })
      await axios.put(`/match-player/${matchPlayerId}/v1`, {
        iPlayerId: playerId,
        iMatchId: matchId,
        iTeamId: TeamName,
        sImage: sImage1,
        sName: playerName,
        eRole: playerRole,
        nFantasyCredit: credits,
        nScoredPoints: scorePoints,
        nSeasonPoints: seasonPoints,
        bShow: show === 'Y',
        eStatus: frontendStatus,
        sportsType: sportsType
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: UPDATE_MATCH_PLAYER,
          payload: {
            resMessage: response2.data.message,
            resStatus: true
          }
        })
      })
    } else {
      await axios.put(`/match-player/${matchPlayerId}/v1`, {
        iMatchId: matchId,
        iTeamId: TeamName,
        sImage: playerImage,
        sName: playerName,
        eRole: playerRole,
        nFantasyCredit: credits,
        nScoredPoints: scorePoints,
        nSeasonPoints: seasonPoints,
        bShow: show === 'Y',
        eStatus: frontendStatus,
        sportsType: sportsType
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: UPDATE_MATCH_PLAYER,
          payload: {
            resMessage: response.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_MATCH_PLAYER, error))
  }
}

export const updateMPScorePoint = (aPointBreakups, ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.put(`/match-player/score-point/${ID}/v1`, {
    aPointBreakup: aPointBreakups
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_MP_SCORE_POINT,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_MP_SCORE_POINT,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const deleteMatchPlayer = (Id, matchId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.delete(`/match-player/${Id}/v2?iMatchId=${matchId}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_MATCH_PLAYER,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: DELETE_MATCH_PLAYER,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const calculateSeasonPoint = (matchId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_PLAYER_MESSAGE })
  await axios.put(`/match-player/season-point/${matchId}/v1`, {}, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SEASON_POINT,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: SEASON_POINT,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
