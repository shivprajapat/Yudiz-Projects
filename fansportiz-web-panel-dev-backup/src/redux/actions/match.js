/* eslint-disable no-unneeded-ternary */
/* eslint-disable import/prefer-default-export */
import axios from '../../axios/instanceAxios'
import {
  MATCH_LIST,
  MATCH_DETAILS,
  MY_UPCOMING_MATCH_LIST,
  MY_LIVE_MATCH_LIST,
  MY_COMPLETED_MATCH_LIST,
  GET_HOME_BANNER,
  CLEAR_MATCH_MESSAGE,
  CLEAR_MATCH_LIST,
  GET_BANNER_STATICS
} from '../constants'
import { catchBlankData } from '../../utils/helper'

const errMsg = 'Server is unavailable.'

export const getMatchList = (sportsType) => async (dispatch) => { // matches list
  dispatch({ type: CLEAR_MATCH_MESSAGE })
  dispatch({ type: CLEAR_MATCH_LIST })
  await axios.get(`/gaming/user/match/list/v1?sportsType=${sportsType}`).then((response) => {
    dispatch({
      type: MATCH_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(MATCH_LIST))
  })
}

export const getMatchDetails = (id, sportsType, token) => async (dispatch) => { // get one match details
  dispatch({ type: CLEAR_MATCH_MESSAGE })
  await axios.get(`/gaming/user/match/${id}/v1?sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_DETAILS,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(MATCH_DETAILS))
  })
}

export const myUpcomingMatchList = (sportsType, token, type) => async (dispatch) => { // my upcoming match list
  await axios.get(`/gaming/user/my-matches/list/v4?sportsType=${sportsType}&type=${type}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MY_UPCOMING_MATCH_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        // aMatches: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(MY_UPCOMING_MATCH_LIST))
  })
}

export const myLiveMatchList = (sportsType, token, type) => async (dispatch) => { // live match list
  await axios.get(`/gaming/user/my-matches/list/v4?sportsType=${sportsType}&type=${type}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MY_LIVE_MATCH_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        // aMatches: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(MY_LIVE_MATCH_LIST))
  })
}

export const myCompletedMatchList = (sportsType, token, type) => async (dispatch) => { // completed match list
  await axios.get(`/gaming/user/my-matches/list/v4?sportsType=${sportsType}&type=${type}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MY_COMPLETED_MATCH_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        // aMatches: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(MY_COMPLETED_MATCH_LIST))
  })
}

export const GetHomeBanner = (place) => async (dispatch) => { // home banner list
  await axios.get(`/statics/user/banner/list/${place}/v1`).then((response) => {
    dispatch({
      type: GET_HOME_BANNER,
      payload: {
        bannerData: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_HOME_BANNER,
      payload: {
        bannerData: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getBannerStatics = (ID, token) => async (dispatch) => { // banner statics
  await axios.post(`/statics/user/banner/log/${ID}/v1`, {}, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_BANNER_STATICS,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_BANNER_STATICS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
