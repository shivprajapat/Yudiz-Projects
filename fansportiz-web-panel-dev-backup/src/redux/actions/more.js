import axios from '../../axios/instanceAxios'
import {
  MORE_LIST,
  CONTEST_SLUG_DETAILS,
  GET_SCORE_POINTS,
  GET_OFFER_LIST,
  CLEAR_MORE_LIST,
  CLEAR_CONTEST_SLUG_MESSAGE,
  MATCH_TIPS_DETAILS,
  CLEAR_SCORE_POINTS,
  CLEAR_OFFER_LIST
} from '../constants'
import { catchBlankData, catchBlankDataObj } from '../../utils/helper'

export const getMoreList = (token) => async (dispatch) => { // more list
  dispatch({ type: CLEAR_MORE_LIST })
  await axios.get('/statics/user/cms/list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MORE_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(MORE_LIST))
  })
}

export const getContestSlug = (slug) => async (dispatch) => { // get details from slug
  dispatch({ type: CLEAR_CONTEST_SLUG_MESSAGE })
  await axios.get(`/statics/user/cms/${slug}/v1`).then((response) => {
    dispatch({
      type: CONTEST_SLUG_DETAILS,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankDataObj(CONTEST_SLUG_DETAILS))
  })
}

export const getMatchTips = (slug, token) => async (dispatch) => { // match tips get
  dispatch({ type: CLEAR_CONTEST_SLUG_MESSAGE })
  await axios.get(`/gaming/user/predictions/${slug}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_TIPS_DETAILS,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankDataObj(MATCH_TIPS_DETAILS))
  })
}

export const getScorePoints = (format, token) => async (dispatch) => { // get score points
  dispatch({ type: CLEAR_SCORE_POINTS })
  await axios.get(`/gaming/user/score-point/v1?eFormat=${format}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_SCORE_POINTS,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_SCORE_POINTS))
  })
}

export const getOfferList = (token) => async (dispatch) => { // offer list get
  dispatch({ type: CLEAR_OFFER_LIST })
  await axios.get('/statics/user/offer/list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_OFFER_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(GET_OFFER_LIST))
  })
}
