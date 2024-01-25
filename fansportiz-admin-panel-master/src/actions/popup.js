import axios from '../axios'
import { ADD_POP_UP_AD, CLEAR_POPUP_AD_MESSAGE, DELETE_POP_UP_AD, POP_UP_ADS_LIST, POP_UP_AD_DETAILS, UPDATE_POP_UP_AD } from './constants'
const errMsg = 'Server is unavailable.'

export const getPopUpAdsList = (start, limit, type, search, token) => async (dispatch) => {
  await axios.get(`/popupAds/list/v1?start=${start}&limit=${limit}&eType=${type}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: POP_UP_ADS_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: POP_UP_ADS_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPopupAdDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/popupAds/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: POP_UP_AD_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: POP_UP_AD_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const addPopupAd = (addPopupAdData) => async (dispatch) => {
  const { title, adImage, type, Link, category, Match, League, platform, adStatus, token } = addPopupAdData
  dispatch({ type: CLEAR_POPUP_AD_MESSAGE })
  try {
    const response = await axios.post('/popupAds/pre-signed-url/v1', { sFileName: adImage.file.name, sContentType: adImage.file.type }, { headers: { Authorization: token } })
    const url = response.data.data.sUrl
    const sImage = response.data.data.sPath
    await axios.put(url, adImage.file, { headers: { 'Content-Type': adImage.file.type } })
    await axios.post('/popupAds/add/v1', {
      sTitle: title, eType: type, sImage, sLink: Link, eStatus: adStatus, ePlatform: platform, iMatchId: Match, iMatchLeagueId: League, eCategory: category
    }, { headers: { Authorization: token } }).then((response2) => {
      dispatch({
        type: ADD_POP_UP_AD,
        payload: {
          resMessage: response2.data.message,
          resStatus: true
        }
      })
    })
  } catch (error) {
    dispatch({
      type: ADD_POP_UP_AD,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  }
}

export const updatePopupAd = (updatePopupAdData) => async (dispatch) => {
  const { popupAdId, title, adImage, type, Link, category, Match, League, platform, adStatus, token } = updatePopupAdData
  dispatch({ type: CLEAR_POPUP_AD_MESSAGE })
  try {
    if (adImage && adImage.file) {
      const response = await axios.post('/popupAds/pre-signed-url/v1', { sFileName: adImage.file.name, sContentType: adImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, adImage.file, { headers: { 'Content-Type': adImage.file.type } })
      await axios.put(`/popupAds/${popupAdId}/v1`, {
        sTitle: title, sLink: Link, eType: type, sImage, eStatus: adStatus, ePlatform: platform, iMatchId: Match, iMatchLeagueId: League, eCategory: category
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: UPDATE_POP_UP_AD,
          payload: {
            resMessage: response2.data.message,
            resStatus: true
          }
        })
      })
    } else {
      await axios.put(`/popupAds/${popupAdId}/v1`, {
        sTitle: title, eType: type, sLink: Link, sImage: adImage, eStatus: adStatus, ePlatform: platform, iMatchId: Match, iMatchLeagueId: League, eCategory: category
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: UPDATE_POP_UP_AD,
          payload: {
            resMessage: response.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch({
      type: ADD_POP_UP_AD,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  }
}

export const deletePopUpAd = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_POPUP_AD_MESSAGE })
  await axios.delete(`/popupAds/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_POP_UP_AD,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: DELETE_POP_UP_AD,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
