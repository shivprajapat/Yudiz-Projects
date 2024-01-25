import axios from '../axios'
import { CLEAR_REPORT_MESSAGE, GET_ALL_REPORTS, GET_DATE_RANGE_WISE_REPORTS, UPDATE_APP_DOWNLOAD_REPORT, UPDATE_CASHBACK_REPORT, UPDATE_CASHBACK_RETURN_REPORT, UPDATE_CREATOR_BONUS_REPORT, UPDATE_CREATOR_BONUS_RETURN_REPORT, UPDATE_GENERALIZE_REPORT, UPDATE_PARTICIPANTS, UPDATE_PLAYED_REPORT, UPDATE_PLAY_RETURN_REPORT, UPDATE_PRIVATELEAGUE, UPDATE_TEAMS, UPDATE_WINS, UPDATE_WIN_RETURN } from './constants'
const errMsg = 'Server is unavailable.'

export const getAllReports = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_REPORT_MESSAGE })
  await axios.get('/reports/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_ALL_REPORTS,
      payload: {
        data: response.data ? response.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_ALL_REPORTS,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getDateRangeWiseReport = (startDate, endDate, key, type, token) => async (dispatch) => {
  await axios.get(`/filter-reports/v1?dStartDate=${startDate}&dEndDate=${endDate}&eKey=${key}&eType=${type}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_DATE_RANGE_WISE_REPORTS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_DATE_RANGE_WISE_REPORTS,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateGeneralizeReport = (generalizeReportData) => async (dispatch) => {
  dispatch({ type: CLEAR_REPORT_MESSAGE })
  const { key, userType, token } = generalizeReportData
  await axios.put('/user-reports/v1',
    {
      eKey: key,
      eType: userType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_GENERALIZE_REPORT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_GENERALIZE_REPORT,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateTeams = (updateTeamsData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, sportsType, userType, token } = updateTeamsData
  await axios.put(`/userteam-reports/${id}/v1`,
    {
      eKey: 'UT',
      eType: userType,
      eCategory: sportsType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_TEAMS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_TEAMS,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateParticipants = (updateParticipantsData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, sportsType, userType, token } = updateParticipantsData
  await axios.put(`/league-participants-reports/${id}/v1`,
    {
      eKey: 'LP',
      eType: userType,
      eCategory: sportsType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_PARTICIPANTS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_PARTICIPANTS,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateWins = (updateWinsData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, sportsType, userType, token } = updateWinsData
  await axios.put(`/wins-reports/${id}/v1`,
    {
      eKey: 'TW',
      eCategory: sportsType,
      eType: userType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_WINS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_WINS,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateWinReturn = (updateWinReturnData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, sportsType, userType, token } = updateWinReturnData
  await axios.put(`/wins-return-reports/${id}/v1`,
    {
      eKey: 'TWR',
      eCategory: sportsType,
      eType: userType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_WIN_RETURN,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_WIN_RETURN,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updatePrivateLeague = (updatePrivateLeagueData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, key, sportsType, token } = updatePrivateLeagueData
  await axios.put(`/private-league-reports/${id}/v1`,
    {
      eKey: key,
      eType: 'U',
      eCategory: sportsType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_PRIVATELEAGUE,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_PRIVATELEAGUE,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updatePlayedReport = (updatePlayedData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, key, sportsType, userType, token } = updatePlayedData
  await axios.put(`/play-reports/${id}/v1`,
    {
      eKey: key,
      eCategory: sportsType,
      eType: userType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_PLAYED_REPORT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_PLAYED_REPORT,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updatePlayReturnReport = (updatePlayReturnData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, key, sportsType, userType, token } = updatePlayReturnData
  await axios.put(`/play-return-reports/${id}/v1`,
    {
      eKey: key,
      eCategory: sportsType,
      eType: userType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_PLAY_RETURN_REPORT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_PLAY_RETURN_REPORT,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateCashbackReport = (updateCashbackData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, key, sportsType, userType, token } = updateCashbackData
  await axios.put(`/cashback-reports/${id}/v1`,
    {
      eKey: key,
      eCategory: sportsType,
      eType: userType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_CASHBACK_REPORT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_CASHBACK_REPORT,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateCashbackReturnReport = (updateCashbackReturnData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, key, sportsType, userType, token } = updateCashbackReturnData
  await axios.put(`/cashback-return-reports/${id}/v1`,
    {
      eKey: key,
      eCategory: sportsType,
      eType: userType
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_CASHBACK_RETURN_REPORT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_CASHBACK_RETURN_REPORT,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateCreatorBonusReport = (updateCreatorBonusData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, key, sportsType, token } = updateCreatorBonusData
  await axios.put(`/creator-bonus/${id}/v1`,
    {
      eKey: key,
      eCategory: sportsType,
      eType: 'U'
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_CREATOR_BONUS_REPORT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_CREATOR_BONUS_REPORT,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateCreatorBonusReturnReport = (updateCreatorBonusReturnData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, key, sportsType, token } = updateCreatorBonusReturnData
  await axios.put(`/creator-bonus-return/${id}/v1`,
    {
      eKey: key,
      eCategory: sportsType,
      eType: 'U'
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_CREATOR_BONUS_RETURN_REPORT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_CREATOR_BONUS_RETURN_REPORT,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateAppDownloadReport = (updateAppDownloadData) => async (dispatch) => {
  dispatch({ type: 'CLEAR_REPORT_MESSAGE' })
  const { id, key, platform, token } = updateAppDownloadData
  await axios.put(`/app-download-reports/${id}/v1`,
    {
      eKey: key,
      ePlatform: platform,
      eType: 'U'
    }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_APP_DOWNLOAD_REPORT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_APP_DOWNLOAD_REPORT,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  })
}
