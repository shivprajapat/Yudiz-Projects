import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { CHANGE_BG_IMAGE, CLEAR_SETTING_MESSAGE, CURRENCY_DATA, GET_VALIDATION, SETTING_DETAILS, SETTING_LIST, SIDE_BG_IMAGE, UPDATE_CURRENCY, UPDATE_SETTING } from './constants'

export const getSettingList = (start, limit, sort, order, search, token) => async (dispatch) => {
  await axios.get(`/setting/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SETTING_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SETTING_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSettingDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/setting/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SETTING_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SETTING_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const updateSetting = (updateSettingData) => async (dispatch) => {
  const { settingId, Title, Key, Max, Min, settingStatus, creatorBonusType, token } = updateSettingData
  dispatch({ type: CLEAR_SETTING_MESSAGE })
  await axios.put(`/setting/${settingId}/v1`, {
    sTitle: Title, sKey: Key, nMax: Max, nMin: Min, sValue: creatorBonusType, eStatus: settingStatus
  }, { headers: { Authorization: token } }).then((response2) => {
    dispatch(successFunc(UPDATE_SETTING, response2))
  }).catch((error) => {
    dispatch(catchFunc(UPDATE_SETTING, error))
  })
}

export const getSideBackgroundImage = (key, token) => async (dispatch) => {
  await axios.get(`/side-background/${key}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SIDE_BG_IMAGE,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SIDE_BG_IMAGE,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const submitSiteSideBackgroundImage = (bgImage, key, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SETTING_MESSAGE })
  try {
    if (bgImage) {
      const response = await axios.post('/side-background/pre-signed-url/v1', { sFileName: bgImage.file.name, sContentType: bgImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, bgImage.file, { headers: { 'Content-Type': bgImage.file.type } })
      await axios.post('/side-background/v1', {
        sImage, sKey: key
      }, { headers: { Authorization: token } }).then((response1) => {
        dispatch(successFunc(CHANGE_BG_IMAGE, response1))
      })
    }
  } catch (error) {
    dispatch(catchFunc(CHANGE_BG_IMAGE, error))
  }
}

export const getCurrencyData = (token) => async (dispatch) => {
  await axios.get('/currency/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CURRENCY_DATA,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: CURRENCY_DATA,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updateCurrencyDetails = (currencyData) => async (dispatch) => {
  const { Title, Key, shortName, logo, token } = currencyData
  dispatch({ type: CLEAR_SETTING_MESSAGE })
  await axios.post('/currency/v1', {
    sTitle: Title, sLogo: logo, sShortName: shortName, sKey: Key
  }, { headers: { Authorization: token } }).then((response2) => {
    dispatch(successFunc(UPDATE_CURRENCY, response2))
  }).catch((error) => {
    dispatch(catchFunc(UPDATE_CURRENCY, error))
  })
}

export const settingForValidation = (key, token) => async (dispatch) => {
  await axios.get(`/setting-validation/${key}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_VALIDATION,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_VALIDATION,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}
