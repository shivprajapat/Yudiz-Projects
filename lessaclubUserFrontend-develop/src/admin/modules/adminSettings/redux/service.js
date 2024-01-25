import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'

import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import {
  CLEAR_UPDATE_ADMIN_GENERAL_SETTINGS,
  UPDATE_ADMIN_GENERAL_SETTINGS,
  CLEAR_GET_ADMIN_GENERAL_SETTINGS_RESPONSE,
  GET_ADMIN_GENERAL_SETTINGS,
  CREATE_ADMIN_GENERAL_SETTINGS,
  CLEAR_CREATE_ADMIN_GENERAL_SETTINGS_RESPONSE,
  CLEAR_ADMIN_COMMISSION_SETTINGS,
  GET_ADMIN_COMMISSION_SETTINGS,
  UPDATE_ADMIN_COMMISSION_SETTINGS,
  CREATE_ADMIN_COMMISSION_SETTINGS
} from './action'

const errMsg = 'Server is unavailable.'

export const updateAdminGeneralSettings = (id, payload) => (dispatch) => {
  dispatch({ type: CLEAR_UPDATE_ADMIN_GENERAL_SETTINGS })
  axios
    .put(`${apiPaths.adminSettings}/${id}`, payload)
    .then(({ data }) => {
      dispatch({
        type: UPDATE_ADMIN_GENERAL_SETTINGS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UPDATE_ADMIN_GENERAL_SETTINGS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}

export const getAdminGeneralSetting = () => (dispatch) => {
  dispatch({ type: CLEAR_GET_ADMIN_GENERAL_SETTINGS_RESPONSE })
  axios
    .get(`${apiPaths.adminSettings}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ADMIN_GENERAL_SETTINGS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ADMIN_GENERAL_SETTINGS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getAllAdminGeneralSetting = () => (dispatch) => {
  dispatch({ type: CLEAR_GET_ADMIN_GENERAL_SETTINGS_RESPONSE })
  axios
    .get(`${apiPaths.adminSettingsforUser}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ADMIN_GENERAL_SETTINGS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ADMIN_GENERAL_SETTINGS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const createAdminGeneralSetting = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_CREATE_ADMIN_GENERAL_SETTINGS_RESPONSE })
  axios
    .post(`${apiPaths.adminSettings}`, payload)
    .then(({ data }) => {
      dispatch({
        type: CREATE_ADMIN_GENERAL_SETTINGS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: CREATE_ADMIN_GENERAL_SETTINGS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getAdminCommissionSetting = () => (dispatch) => {
  dispatch({ type: CLEAR_ADMIN_COMMISSION_SETTINGS })
  axios
    .get(`${apiPaths.adminCommissionSettings}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ADMIN_COMMISSION_SETTINGS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ADMIN_COMMISSION_SETTINGS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const updateAdminCommissionSetting = (id, payload) => (dispatch) => {
  dispatch({ type: CLEAR_ADMIN_COMMISSION_SETTINGS })
  axios
    .put(`${apiPaths.adminCommissionSettings}/${id}`, payload)
    .then(({ data }) => {
      dispatch({
        type: UPDATE_ADMIN_COMMISSION_SETTINGS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UPDATE_ADMIN_COMMISSION_SETTINGS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const createAdminCommissionSetting = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_ADMIN_COMMISSION_SETTINGS })
  axios
    .post(apiPaths.adminCommissionSettings, payload)
    .then(({ data }) => {
      dispatch({
        type: CREATE_ADMIN_COMMISSION_SETTINGS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: CREATE_ADMIN_COMMISSION_SETTINGS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
