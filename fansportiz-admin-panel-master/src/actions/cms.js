import axios from '../axios'
import { ADD_CMS, CLEAR_CMS_MESSAGE, CMS_DETAILS, CMS_LIST, DELETE_CMS, UPDATE_CMS } from './constants'

const errMsg = 'Server is unavailable.'

export const getCMSList = (search, token) => async (dispatch) => {
  await axios.get(`/cms/v1?search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CMS_LIST,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: CMS_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addCMS = (addDataCMS) => async (dispatch) => {
  const { Title, Description, Slug, Category, Details, priority, contentStatus, token } = addDataCMS
  dispatch({ type: CLEAR_CMS_MESSAGE })
  await axios.post('/cms/add/v1', {
    sTitle: Title,
    sDescription: Description,
    sSlug: Slug,
    sCategory: Category,
    sContent: Details,
    nPriority: priority,
    eStatus: contentStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_CMS,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_CMS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg
      }
    })
  })
}

export const deleteCMS = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_CMS_MESSAGE })
  await axios.delete(`/cms/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_CMS,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: DELETE_CMS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getCMSDetails = (Slug, token) => async (dispatch) => {
  await axios.get(`/cms/${Slug}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CMS_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: CMS_DETAILS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const updateCMS = (updateDataCMS) => async (dispatch) => {
  const { Title, Description, Slug, Category, Details, priority, contentStatus, cmsId, token } = updateDataCMS
  dispatch({ type: CLEAR_CMS_MESSAGE })
  await axios.put(`/cms/${cmsId}/v1`, {
    sTitle: Title,
    sDescription: Description,
    sCategory: Category,
    sSlug: Slug,
    sContent: Details,
    nPriority: priority,
    eStatus: contentStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_CMS,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_CMS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg
      }
    })
  })
}
