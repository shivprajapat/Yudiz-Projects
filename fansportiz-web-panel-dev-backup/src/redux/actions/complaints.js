import {
  COMPLAINT_LIST,
  COMPLAINT_DETAILS,
  CLEAR_COMPLAINT_LIST,
  CLEAR_COMPLAINT_DETAILS,
  CLEAR_ADD_COMPLAINT,
  ADD_COMPLAINT
} from '../constants'
import { catchBlankData, catchBlankDataObj } from '../../utils/helper'
import axios from '../../axios/instanceAxios'
const errMsg = 'Server is unavailable.'

export const getComplaintList = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_COMPLAINT_LIST })
  await axios.get('/user/complaint/list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: COMPLAINT_LIST,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(COMPLAINT_LIST))
  })
}

export const getComplaintDetails = (id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_COMPLAINT_DETAILS })
  await axios.get(`/user/complaint/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: COMPLAINT_DETAILS,
      payload: {
        resMessage: response.data.message,
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankDataObj(COMPLAINT_DETAILS))
  })
}

export const addComplaint = (sImage, sTitle, sDescription, eType, token) => async (dispatch) => {
  dispatch({ type: CLEAR_ADD_COMPLAINT })
  if (sImage && sImage.file) {
    const response2 = await axios.post('/user/complaint/pre-signed-url/v1', { sFileName: sImage.file.name, sContentType: sImage.file.type }, { headers: { Authorization: token } })
    const bImgUrl = response2.data.data.sUrl
    const bImg = response2.data.data.sPath
    await axios.put(bImgUrl, sImage.file, { headers: { 'Content-Type': sImage.file.type } })
    dispatch({ type: CLEAR_ADD_COMPLAINT })
    await axios.post('/user/complaint/v1', { sImage: bImg, sTitle, sDescription, eType }, { headers: { Authorization: token } }).then((response) => {
      dispatch({
        type: ADD_COMPLAINT,
        payload: {
          resMessage: response.data.message,
          addedComplaint: true,
          resStatus: true
        }
      })
    }).catch((error) => {
      dispatch(
        {
          type: ADD_COMPLAINT,
          payload: {
            resContestMessage: error && error.response ? error.response.data.message : errMsg,
            addedComplaint: false,
            resContestStatus: false
          }
        }
      )
    }).catch((error) => {
      dispatch({
        type: ADD_COMPLAINT,
        payload: {
          resStatus: false,
          resMessage: error.response
            ? error.response.data.message
            : errMsg,
          addedComplaint: false
        }
      })
    })
  } else {
    dispatch({ type: CLEAR_ADD_COMPLAINT })
    await axios.post('/user/complaint/v1', { sImage: sImage || '', sTitle, sDescription, eType }, { headers: { Authorization: token } }).then((response) => {
      dispatch({
        type: ADD_COMPLAINT,
        payload: {
          resMessage: response.data.message,
          addedComplaint: true,
          resStatus: true
        }
      })
    }).catch((error) => {
      dispatch(
        {
          type: ADD_COMPLAINT,
          payload: {
            resContestMessage: error && error.response ? error.response.data.message : errMsg,
            addedComplaint: false,
            resContestStatus: false
          }
        }
      )
    })
  }
}
