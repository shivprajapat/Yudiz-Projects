import axios from '../axios'
import { ADD_BANNER, BANNER_DETAILS, BANNER_LIST, BANNER_STATISTICS, CLEAR_BANNER_MESSAGE, DELETE_BANNER, UPDATE_BANNER } from './constants'

const errMsg = 'Server is unavailable.'

export const getBannerList = (start, limit, sort, order, search, token) => async (dispatch) => {
  await axios.get(`/banner/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: BANNER_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: BANNER_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addBanner = (addBannerData) => async (dispatch) => {
  const { place, Link, bannerType, Description, bannerStatus, screen, bannerImage, sportsType, Match, League, position, token } = addBannerData
  dispatch({ type: CLEAR_BANNER_MESSAGE })
  try {
    const response = await axios.post('/banner/pre-signed-url/v1', { sFileName: bannerImage.file.name, sContentType: bannerImage.file.type }, { headers: { Authorization: token } })
    const url = response.data.data.sUrl
    const sImage = response.data.data.sPath
    await axios.put(url, bannerImage.file, { headers: { 'Content-Type': bannerImage.file.type } })
    await axios.post('/banner/add/v1', {
      ePlace: place, sLink: Link, eType: bannerType, sDescription: Description, eStatus: bannerStatus, eScreen: screen, sImage, eCategory: sportsType, iMatchId: Match, iMatchLeagueId: League, nPosition: position
    }, { headers: { Authorization: token } }).then((response2) => {
      dispatch({
        type: ADD_BANNER,
        payload: {
          resMessage: response2.data.message,
          resStatus: true
        }
      })
    })
  } catch (error) {
    dispatch({
      type: ADD_BANNER,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  }
}

export const getBannerDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/banner/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: BANNER_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: BANNER_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const updateBanner = (updateBannerData) => async (dispatch) => {
  const { place, bannerId, Link, bannerType, Description, bannerStatus, screen, bannerImage, sportsType, Match, League, position, token } = updateBannerData
  dispatch({ type: CLEAR_BANNER_MESSAGE })
  try {
    if (bannerImage && bannerImage.file) {
      const response = await axios.post('/banner/pre-signed-url/v1', { sFileName: bannerImage.file.name, sContentType: bannerImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, bannerImage.file, { headers: { 'Content-Type': bannerImage.file.type } })
      await axios.put(`/banner/${bannerId}/v1`, {
        ePlace: place, sLink: Link, eType: bannerType, sDescription: Description, eStatus: bannerStatus, eScreen: screen, sImage, eCategory: sportsType, iMatchId: Match, iMatchLeagueId: League, nPosition: position
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: UPDATE_BANNER,
          payload: {
            resMessage: response2.data.message,
            resStatus: true
          }
        })
      })
    } else {
      await axios.put(`/banner/${bannerId}/v1`, {
        ePlace: place, sLink: Link, eType: bannerType, sDescription: Description, eStatus: bannerStatus, eScreen: screen, sImage: bannerImage, eCategory: sportsType, iMatchId: Match, iMatchLeagueId: League, nPosition: position
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: UPDATE_BANNER,
          payload: {
            resMessage: response.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch({
      type: UPDATE_BANNER,
      payload: {
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  }
}

export const deleteBanner = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_BANNER_MESSAGE })
  await axios.delete(`/banner/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_BANNER,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: DELETE_BANNER,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getBannerStatisticsList = (data) => async (dispatch) => {
  const { start, limit, startDate, endDate, bannerId, token } = data
  await axios.get(`/banner/stats/${bannerId}/v2?start=${start}&limit=${limit}&datefrom=${startDate}&dateto=${endDate}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: BANNER_STATISTICS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: BANNER_STATISTICS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
