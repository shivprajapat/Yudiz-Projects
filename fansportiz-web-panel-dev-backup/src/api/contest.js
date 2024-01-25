import axios from '../axios/instanceAxios'
import { CREATE_CONTEST, JOIN_CONTEST } from '../redux/constants'
import { catchError } from '../utils/helper'
const errMsg = 'Server is unavailable.'

// create contest (public/private)
export const createContest = async (nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, token) => {
  const response = await axios.post('/gaming/user/private-league/v2', { nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup }, { headers: { Authorization: token } })
  return response?.data?.data
}

// join contest()
export const jointAndCreateContest = (nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, userTeamId, token) => async (dispatch) => {
  const array = []
  if (!Array.isArray(userTeamId)) {
    array.push(userTeamId)
  }
  // eslint-disable-next-line no-use-before-define
  const response = await axios.post('/gaming/user/user-league/join-league/v3', { aUserTeamId: !Array.isArray(userTeamId) ? array : userTeamId, iMatchLeagueId: response.data.data._id, sShareCode: response.data.data.sShareCode, bPrivateLeague: true }, { headers: { Authorization: token } }).then((response1) => {
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
