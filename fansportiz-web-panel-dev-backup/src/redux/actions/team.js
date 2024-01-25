import axios from '../../axios/instanceAxios'
import {
  TEAM_LIST,
  CLEAR_TEAM_LIST,
  CLEAR_USER_TEAM,
  CLEAR_CONTEST_LIST,
  CLEAR_TEAM_PLAYER_LIST,
  CLEAR_CONTEST_JOIN_LIST,
  USER_TEAM,
  CONTEST_LIST,
  CLEAR_EDIT_TEAM,
  CONTEST_JOIN_LIST,
  TEAM_PLAYER_LIST,
  SWITCH_USER_TEAM,
  CREATE_TEAM,
  EDIT_TEAM,
  CLEAR_CREATE_TEAM,
  CLEAR_TEAM_MESSAGE,
  USER_COMPARE_TEAM,
  CLEAR_PRIVATE_LEAGUE_VALIDATION,
  PRIVATE_LEAGUE_VALIDATION,
  CLEAR_JOIN_DETAILS,
  JOIN_DETAILS,
  DREAM_TEAM,
  GET_AUTO_PICK_TEAM,
  CLEAR_AUTO_PICK_TEAM
} from '../constants'
import { catchBlankData, catchError } from '../../utils/helper'
import { joinLeague } from './league'

const errMsg = 'Server is unavailable.'

// get the my team list for that particular match
export const getMyTeamList = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_TEAM_LIST })
  await axios.get(`/gaming/user/user-team/teams/${ID}/v3`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TEAM_LIST,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(TEAM_LIST))
  })
}

export const getDreamTeam = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_TEAM_LIST })
  await axios.get(`/gaming/user/dream-team/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DREAM_TEAM,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(DREAM_TEAM))
  })
}

// validation
export const privateLeagueValidationList = (Type, token) => async (dispatch) => {
  dispatch({ type: CLEAR_TEAM_LIST })
  dispatch({ type: CLEAR_PRIVATE_LEAGUE_VALIDATION })
  await axios.get(`/gaming/user/setting/${Type}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PRIVATE_LEAGUE_VALIDATION,
      payload: {
        privateLeagueValidation: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(PRIVATE_LEAGUE_VALIDATION))
  })
}

// list of the user team
export const getUserTeam = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_USER_TEAM })
  await axios.get(`/gaming/user/user-team/team-player-leaderboard/${ID}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USER_TEAM,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(USER_TEAM))
  })
}

// get the compare user team
export const getCompareUserTeam = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_USER_TEAM })
  await axios.get(`/gaming/user/user-team/team-player-leaderboard/${ID}/v3`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USER_COMPARE_TEAM,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(USER_COMPARE_TEAM))
  })
}

// get the validation join contest list
export const getMyContestList = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CONTEST_LIST })
  await axios.get(`/gaming/user/user-league/join-list/${ID}/v3`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CONTEST_LIST,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(CONTEST_LIST))
  })
}

// get joined contest list
export const getMyJoinList = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CONTEST_JOIN_LIST })
  await axios.get(`/gaming/user/user-league/join/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CONTEST_JOIN_LIST,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(CONTEST_JOIN_LIST))
  })
}

export const getMyJoinDetails = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_JOIN_DETAILS })
  await axios.get(`/gaming/user/user-league/join-details/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: JOIN_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(JOIN_DETAILS))
  })
}

// get match player list
export const getMyTeamPlayerList = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_TEAM_PLAYER_LIST })
  await axios.get(`/gaming/user/match-player/${ID}/v2`).then((response) => {
    dispatch({
      type: TEAM_PLAYER_LIST,
      payload: {
        matchPlayerMatchId: ID,
        matchPlayer: response.data.data.matchPlayer,
        aPlayerRole: response.data.data.aPlayerRole,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: TEAM_PLAYER_LIST,
      payload: {
        resMessage: error && error.response && error.response.data && error.response.data.message ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

// Switch team
export const switchTeam = (iUserLeagueId, iUserTeamId, token) => async (dispatch) => {
  dispatch(dispatch({
    type: SWITCH_USER_TEAM,
    payload: {
      resMessage: '',
      resStatus: null,
      switchTeamSuccess: null
    }
  }))
  await axios.put(`/gaming/user/user-league/switch-team/${iUserLeagueId}/v1`, { iUserTeamId }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SWITCH_USER_TEAM,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        switchTeamSuccess: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: SWITCH_USER_TEAM,
      payload: {
        switchTeamSuccess: false,
        resStatus: false,
        resMessage: error && error.response ? error.response.data.message : errMsg
      }
    })
  })
}

// create team
export const createTeam = (matchID, captionId, viceCaptionId, SelectedPlayer, name, token) => async (dispatch) => {
  dispatch({ type: CLEAR_TEAM_MESSAGE })
  dispatch({ type: CLEAR_CREATE_TEAM })
  await axios.post('/gaming/user/user-team/v3', { iMatchId: matchID, iCaptainId: captionId, iViceCaptainId: viceCaptionId, aPlayers: SelectedPlayer, sName: name }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CREATE_TEAM,
      payload: {
        createTeamData: response.data.data,
        resMessage: response.data.message,
        resStatus: true,
        isCreateTeam: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: CREATE_TEAM,
      payload: {
        resMessage: error.response.data.message,
        resStatus: false,
        isCreateTeam: false
      }
    })
  })
}

// create team and join contest
export const createTeamJoinLeague = (matchID, captionId, viceCaptionId, SelectedPlayer, iMatchLeagueId, bPrivateLeague, sShareCode, Name, sPromoCode, token) => async (dispatch) => {
  dispatch({ type: CLEAR_TEAM_MESSAGE })
  await axios.post('/gaming/user/user-team/v3', { iMatchId: matchID, iCaptainId: captionId, iViceCaptainId: viceCaptionId, aPlayers: SelectedPlayer, sName: Name }, { headers: { Authorization: token } }).then((response) => {
    if (response.status === 200) {
      dispatch({
        type: CREATE_TEAM,
        payload: {
          resMessage: response.data.message,
          resStatus: true,
          createAndJoin: true
        }
      })
      dispatch(joinLeague(iMatchLeagueId, response.data.data._id, bPrivateLeague, token, sShareCode, sPromoCode))
    } else {
      dispatch({
        type: CREATE_TEAM,
        payload: {
          resMessage: response.data.message,
          resStatus: false
        }
      })
    }
  }).catch((error) => {
    dispatch(catchError(CREATE_TEAM, error))
  })
}

// Edit team
export const editTeam = (matchID, teamId, captionId, viceCaptionId, SelectedPlayer, Name, token) => async (dispatch) => {
  dispatch({ type: CLEAR_TEAM_MESSAGE })
  dispatch({ type: CLEAR_EDIT_TEAM })
  await axios.put(`/gaming/user/user-team/${teamId}/v3`, { iMatchId: matchID, iCaptainId: captionId, iViceCaptainId: viceCaptionId, aPlayers: SelectedPlayer, sName: Name }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: EDIT_TEAM,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        isEditTeam: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: EDIT_TEAM,
      payload: {
        resMessage: error.response.data.message,
        resStatus: false,
        isEditTeam: false
      }
    })
  })
}

export const getAutoPickTeam = (matchId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTO_PICK_TEAM })
  await axios.get(`/gaming/user/auto-pick/${matchId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_AUTO_PICK_TEAM,
      payload: {
        data: response.data.aData,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_AUTO_PICK_TEAM,
      payload: {
        data: [],
        resMessage: error && error.response && error.response.data && error.response.data.message ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
