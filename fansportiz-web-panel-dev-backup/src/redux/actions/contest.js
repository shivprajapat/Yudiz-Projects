import axios from '../../axios/instanceAxios'
import {
  CREATE_CONTEST,
  CREATE_JOIN_CONTEST,
  JOIN_CONTEST,
  VERIFY_CODE,
  FEE_CALCULATE,
  GENERATE_PRIZE_BREAKUP,
  CLEAR_CONTEST_MESSAGE,
  CLEAR_FEE_CALCULATE,
  CLEAR_CONTEST,
  RESET_CONTEST,
  CLEAR_JOIN_CONTEST,
  CLEAR_VERIFY_CONTEST
} from '../constants'
import { catchError } from '../../utils/helper'
const errMsg = 'Server is unavailable.'

export const createContest = (nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CONTEST })
  await axios.post('/gaming/user/private-league/v2', { nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CREATE_CONTEST,
      payload: {
        resContestMessage: response.data.message,
        createContest: response.data.data,
        resContestStatus: true,
        isCreatedContest: true
      }
    })
  }).catch((error) => {
    dispatch(
      {
        type: CREATE_CONTEST,
        payload: {
          resContestMessage: error && error.response ? error.response.data.message : errMsg,
          createContest: {},
          resContestStatus: false,
          isCreatedContest: false
        }
      }
    )
  })
}

export const createContestAndTeam = (nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CONTEST })
  await axios.post('/gaming/user/private-league/v2', { nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CREATE_CONTEST,
      payload: {
        resContestMessage: response.data.message,
        createContest: response.data.data,
        resContestStatus: true,
        IsCreateContestAndTeam: true
      }
    })
  }).catch((error) => {
    dispatch(
      {
        type: CREATE_CONTEST,
        payload: {
          resContestMessage: error && error.response ? error.response.data.message : errMsg,
          createContest: {},
          resContestStatus: false,
          IsCreateContestAndTeam: false
        }
      }
    )
  })
}

export const createContestAndJoinTeam = (nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CONTEST_MESSAGE })
  await axios.post('/gaming/user/private-league/v2', { nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CREATE_JOIN_CONTEST,
      payload: {
        resMessage: response.data.message,
        createContest: response.data.data,
        isContestCreated: true,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch(catchError(CREATE_JOIN_CONTEST, error))
  })
}

export const jointAndCreateContest = (nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, userTeamId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CONTEST_MESSAGE })
  dispatch({ type: CLEAR_JOIN_CONTEST })
  const array = []
  if (!Array.isArray(userTeamId)) {
    array.push(userTeamId)
  }
  const response = await axios.post('/gaming/user/private-league/v2', { nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup }, { headers: { Authorization: token } })
  await axios.post('/gaming/user/user-league/join-league/v3', { aUserTeamId: !Array.isArray(userTeamId) ? array : userTeamId, iMatchLeagueId: response.data.data._id, sShareCode: response.data.data.sShareCode, bPrivateLeague: true }, { headers: { Authorization: token } }).then((response1) => {
    dispatch({
      type: JOIN_CONTEST,
      payload: {
        resMessage: response1.data.message,
        createContest: response1.data.data,
        data: response1.data.data,
        resStatus: true,
        joinedContest: true,
        contestDetails: response.data.data
      }
    })
  }).catch((error) => {
    dispatch(
      {
        type: JOIN_CONTEST,
        payload: {
          resMessage: error && error.response ? error.response.data.message : errMsg,
          createContest: error && error.response ? error.response.data.data : {},
          resStatus: false,
          joinedContest: false,
          contestDetails: response.data.data
        }
      }
    )
  }).catch((error) => {
    dispatch(catchError(CREATE_CONTEST, error))
  })
}

export const verifyContest = (matchId, code, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CONTEST_MESSAGE })
  await axios.post('/gaming/user/private-league/verify-code/v1', { iMatchId: matchId, sShareCode: code }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: VERIFY_CODE,
      payload: {
        verifyContest: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch(catchError(VERIFY_CODE, error))
  })
}

export const joinContest = (userTeamId, matchId, code, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CONTEST_MESSAGE })
  const array = []
  if (!Array.isArray(userTeamId)) {
    array.push(userTeamId)
  }
  await axios.post('/gaming/user/user-league/join-league/v3', {
    aUserTeamId: !Array.isArray(userTeamId) ? array : userTeamId,
    iMatchLeagueId: matchId,
    sShareCode: code,
    bPrivateLeague: true
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: JOIN_CONTEST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        joinedContest: true,
        sucessFullyJoin: true,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: JOIN_CONTEST,
      payload: {
        data: error.response ? error.response.data.data : {},
        resStatus: false,
        joinedContest: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const feeCalculate = (nMax, nTotalPayout, token) => async (dispatch) => {
  dispatch({ type: CLEAR_FEE_CALCULATE })
  await axios.post('/gaming/user/private-league/calculate-fee/v2', { nMax, nTotalPayout }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FEE_CALCULATE,
      payload: {
        resMessage: response.data.message,
        calculatefee: response.data.data,
        resStatus: true,
        sucessFeeCalculate: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: FEE_CALCULATE,
      payload: {
        sucessFeeCalculate: false,
        resStatus: false,
        resMessage: error && error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const genPrizeBreakup = (nMax, bPoolPrize, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CONTEST_MESSAGE })
  await axios.post('/gaming/user/private-league/prize-breakup/v2', { nMax, bPoolPrize }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GENERATE_PRIZE_BREAKUP,
      payload: {
        resMessage: response.data.message,
        generatePrizeBreakup: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GENERATE_PRIZE_BREAKUP,
      payload: {
        resMessage: error && error.response ? error.response.data.message : errMsg,
        generatePrizeBreakup: [],
        resStatus: false
      }
    })
  })
}

export const resetContest = () => async (dispatch) => {
  dispatch({ type: RESET_CONTEST })
}

export const resetVerifyContest = () => async (dispatch) => {
  dispatch({ type: CLEAR_VERIFY_CONTEST })
}
