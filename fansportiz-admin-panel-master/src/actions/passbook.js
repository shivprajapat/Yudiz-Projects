import axios from '../axios'
import { CLEAR_PASSBOOK_MESSAGE, PASSBOOK_DETAILS, PASSBOOK_LIST, STATISTIC_DETAILS, SYSTEM_USER_PASSBOOK_DETAILS, SYSTEM_USER_STATISTIC_DETAILS, TRANSACTIONS_TOTAL_COUNT } from './constants'

export const getPassbookList = (passBookData) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  const { start, limit, sort, order, search, searchType, startDate, endDate, particulars, eType, status, isFullResponse, token } = passBookData
  await axios.get(`/passbook/list/v2?start=${start}&limit=${limit}&sort=${sort}&order=${order}&searchType=${searchType}&search=${search}&datefrom=${startDate}&dateto=${endDate}&particulars=${particulars}&type=${eType}&eStatus=${status}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PASSBOOK_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true,
        isFullResponse
      }
    })
  }).catch(() => {
    dispatch({
      type: PASSBOOK_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getLeaguePassbookList = (passBookData) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  const { id, start, limit, sort, order, search, searchType, startDate, endDate, particulars, eType, status, isFullResponse, token } = passBookData
  await axios.get(`/passbook/match-league-list/${id}/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&searchType=${searchType}&search=${search}&datefrom=${startDate}&dateto=${endDate}&particulars=${particulars}&type=${eType}&eStatus=${status}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PASSBOOK_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true,
        isFullResponse
      }
    })
  }).catch(() => {
    dispatch({
      type: PASSBOOK_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPassbookDetails = (iUserId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  await axios.get(`/passbooks/${iUserId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PASSBOOK_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PASSBOOK_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getStatisticDetails = (iUserId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  await axios.get(`/statistics/${iUserId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: STATISTIC_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: STATISTIC_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSystemUserPassbookDetails = (iUserId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  await axios.get(`/system-user/passbooks/${iUserId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USER_PASSBOOK_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USER_PASSBOOK_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSystemUserStatisticDetails = (iUserId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  await axios.get(`/system-user/statistics/${iUserId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USER_STATISTIC_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USER_STATISTIC_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getTransactionsTotalCount = (data) => async (dispatch) => {
  const { search, searchType, startDate, endDate, particulars, eType, status, token } = data
  await axios.get(`/passbook/counts/v2?searchType=${searchType}&search=${search}&datefrom=${startDate}&dateto=${endDate}&particulars=${particulars}&type=${eType}&eStatus=${status}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TRANSACTIONS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TRANSACTIONS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getLeagueTransactionsTotalCount = (data) => async (dispatch) => {
  const { id, search, searchType, startDate, endDate, particulars, eType, status, token } = data
  await axios.get(`/passbook/match-league-list/count/${id}/v1?searchType=${searchType}&search=${search}&datefrom=${startDate}&dateto=${endDate}&particulars=${particulars}&type=${eType}&eStatus=${status}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TRANSACTIONS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TRANSACTIONS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}
