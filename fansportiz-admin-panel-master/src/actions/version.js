import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import {
  VERSION_LIST,
  CLEAR_VERSION_MESSAGE,
  VERSION_DETAILS,
  UPDATE_VERSION,
  ADD_VERSION,
  UPDATE_MAINTENANCE_MODE,
  GET_MAINTENANCE_MODE,
  DELETE_VERSION
} from './constants'
const errMsg = 'Server is unavailable.'

export const getVersionList = (start, limit, token) => async (dispatch) => {
  await axios
    .get(`/version/list/v1?start=${start}&limit=${limit}`, {
      headers: { Authorization: token }
    })
    .then((response) => {
      dispatch({
        type: VERSION_LIST,
        payload: {
          data: response.data.data[0] ? response.data.data[0] : [],
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: VERSION_LIST,
        payload: {
          data: [],
          resStatus: false
        }
      })
    })
}

export const getVersionDetails = (id, token) => async (dispatch) => {
  await axios
    .get(`/version/${id}/v1`, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: VERSION_DETAILS,
        payload: {
          data: response.data.data,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: VERSION_DETAILS,
        payload: {
          data: [],
          resStatus: false
        }
      })
    })
}

export const updateVersion = (updateVersionData) => async (dispatch) => {
  const { versionId, name, description, type, version, urlofversion, token, conditionUrl, inAppUpdate, forceVersion } = updateVersionData
  dispatch({ type: CLEAR_VERSION_MESSAGE })
  if (conditionUrl) {
    await axios
      .put(
        `/version/${versionId}/v1`,
        {
          sName: name,
          sDescription: description,
          eType: type,
          sVersion: version,
          sUrl: urlofversion,
          bInAppUpdate: inAppUpdate === 'Y',
          sForceVersion: forceVersion
        },
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch(successFunc(UPDATE_VERSION, response))
      })
      .catch((error) => {
        dispatch(catchFunc(UPDATE_VERSION, error))
      })
  } else {
    await axios
      .post(
        '/version/add/v1',
        {
          sName: name,
          sDescription: description,
          eType: type,
          sVersion: version,
          sUrl: urlofversion,
          bForceUpdate: inAppUpdate === 'Y',
          sForceVersion: forceVersion
        },
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch(successFunc(ADD_VERSION, response))
      })
      .catch((error) => {
        dispatch(catchFunc(ADD_VERSION, error))
      })
  }
}

export const getMaintenanceMode = (token) => async (dispatch) => {
  await axios.get('/maintenance-mode/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_MAINTENANCE_MODE,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_MAINTENANCE_MODE,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updateMaintenanceMode = (value, maintenanceMsg, token) => async (dispatch) => {
  dispatch({ type: CLEAR_VERSION_MESSAGE })
  await axios.put('/maintenance-mode/v1', {
    bIsMaintenanceMode: value,
    sMessage: maintenanceMsg
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_MAINTENANCE_MODE,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_MAINTENANCE_MODE,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const deleteVersion = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_VERSION_MESSAGE })
  await axios.delete(`/version/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(DELETE_VERSION, response))
  }).catch((error) => {
    dispatch(catchFunc(DELETE_VERSION, error))
  })
}
